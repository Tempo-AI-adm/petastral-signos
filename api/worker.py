"""
Vercel serverless function: POST /api/worker
Body: {"job_id": "<uuid>"}
Claims a pending job, runs the full pipeline (astro → Gemini → Supabase save),
and writes results back to the jobs table.
"""

import json
import os
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from typing import Tuple

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import astro_calculator

import requests

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

GEMINI_SYSTEM_INSTRUCTION = (
    "You are PetAstral's intelligence engine. Generate a professional, realistic "
    "personality and wellness guide combining Western Astrology with Animal Genetics "
    "(breed for dogs, fur color for cats). Tone: professional, technical, realistic. "
    "Use terms like 'behavioral tendencies' and 'astrological characteristics'. "
    "Avoid absolute predictions. Each chapter minimum 300 words with practical daily "
    "examples. Write fluidly with natural document appearance."
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def json_response(handler, status: int, body: dict):
    encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    for k, v in CORS_HEADERS.items():
        handler.send_header(k, v)
    handler.send_header("Content-Length", str(len(encoded)))
    handler.end_headers()
    handler.wfile.write(encoded)


def _supabase_headers(prefer: str = "return=representation") -> dict:
    key = os.environ.get("SUPABASE_KEY", "")
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": prefer,
    }


def _supabase_url(path: str) -> str:
    return os.environ.get("SUPABASE_URL", "").rstrip("/") + path


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def claim_job(job_id: str) -> bool:
    """Set status → 'processing' only if currently 'pending'. Returns True if claimed."""
    resp = requests.patch(
        _supabase_url(f"/rest/v1/jobs?id=eq.{job_id}&status=eq.pending"),
        headers=_supabase_headers(),
        json={"status": "processing"},
        timeout=10,
    )
    resp.raise_for_status()
    return len(resp.json()) > 0


def update_job(job_id: str, patch: dict):
    resp = requests.patch(
        _supabase_url(f"/rest/v1/jobs?id=eq.{job_id}"),
        headers=_supabase_headers(),
        json=patch,
        timeout=10,
    )
    resp.raise_for_status()


def fail_job(job_id: str, message: str):
    update_job(job_id, {
        "status": "failed",
        "error_message": message,
        "completed_at": _now_iso(),
    })


def build_gemini_prompt(data: dict, signs: dict) -> str:
    hour_display = "não informado" if data.get("hour_unknown") else f"{data['hour']:02d}"
    minute_display = f"{data['minute']:02d}"

    return f"""DADOS DO PET:
Nome: {data['pet_name']}
Tipo: {data['pet_type']}
Raça/Pelagem: {data['breed']}
Sexo: {data['sex']}
Cor: {data.get('pet_color') or 'não informado'}
Marcações: {data.get('pet_markings') or 'não informado'}
Data de Nascimento: {data['day']:02d}/{data['month']:02d}/{data['year']} às {hour_display}:{minute_display}h
Local: {data['city']}, {data['country']}

DADOS ASTRAIS CALCULADOS:
- Sol em {signs['sun_sign']}
- Lua em {signs['moon_sign']}
- Mercúrio em {signs['mercury_sign']}
- Vênus em {signs['venus_sign']}
- Marte em {signs['mars_sign']}
- Júpiter em {signs['jupiter_sign']}
- Saturno em {signs['saturn_sign']}
- Urano em {signs['uranus_sign']}
- Netuno em {signs['neptune_sign']}
- Plutão em {signs['pluto_sign']}
- Elemento Predominante: {signs['dominant_element']}

TAREFA: GERE O GUIA PETASTRAL COMPLETO

ESTRUTURA DO LAUDO:

**0. VISÃO ASTRAL (Resumo Executivo)**
Forneça uma frase resumo para cada dimensão:
- Personalidade:
- Emoções:
- Energia:
- Relacionamento:
Em seguida, liste todos os posicionamentos planetários.

**CAPÍTULOS PRINCIPAIS** (cada capítulo mínimo 300 palavras, com 2-3 subtópicos):

**1. Sol em {signs['sun_sign']}: Essência, Comportamento e Personalidade**
**2. Lua em {signs['moon_sign']}: Emoções, Necessidades e Vínculo com o Tutor**
**3. Elementos Astrológicos: O Ambiente e a Energia Ideal**
**4. Mercúrio em {signs['mercury_sign']}: Como Seu Pet Se Comunica e Processa Informações**
**5. Vênus em {signs['venus_sign']}: Relacionamentos e Conexões**
**6. Marte em {signs['mars_sign']}: Energia, Atividade e Comportamento**
**7. Júpiter em {signs['jupiter_sign']}: Sorte, Descobertas e Expansão**
**8. Saturno em {signs['saturn_sign']}: Desafios, Limites e Aprendizados de Vida**
**9. Urano, Netuno e Plutão: Transformações, Instintos e Propósito do Seu Pet**
**PILAR DE BEM-ESTAR (FINAL): Dicas Práticas para o Bem-Estar**"""


def call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    payload = {
        "system_instruction": {"parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 6000},
    }

    resp = requests.post(
        GEMINI_URL,
        params={"key": api_key},
        json=payload,
        timeout=120,
    )
    resp.raise_for_status()
    result = resp.json()
    try:
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as exc:
        raise RuntimeError(f"Unexpected Gemini response structure: {result}") from exc


def save_to_supabase(data: dict, signs: dict, report_text: str) -> Tuple[str, str]:
    headers = _supabase_headers()

    # 1. Upsert owner (unique on email)
    owner_resp = requests.post(
        _supabase_url("/rest/v1/owners"),
        headers={**headers, "Prefer": "resolution=merge-duplicates,return=representation"},
        json={"name": data["owner_name"], "email": data["owner_email"]},
        timeout=15,
    )
    owner_resp.raise_for_status()
    owner_id = owner_resp.json()[0]["id"]

    # 2. Insert pet
    birth_data = {k: data[k] for k in ("city", "country", "year", "month", "day", "hour", "minute")}
    birth_data["hour_unknown"] = data.get("hour_unknown", False)
    pet_resp = requests.post(
        _supabase_url("/rest/v1/pets"),
        headers=headers,
        json={
            "owner_id":     owner_id,
            "name":         data["pet_name"],
            "type":         data["pet_type"],
            "breed":        data["breed"],
            "sex":          data["sex"],
            "pet_color":    data.get("pet_color"),
            "pet_markings": data.get("pet_markings"),
            "birth_data":   birth_data,
        },
        timeout=15,
    )
    pet_resp.raise_for_status()
    pet_id = pet_resp.json()[0]["id"]

    # 3. Insert report
    report_resp = requests.post(
        _supabase_url("/rest/v1/reports"),
        headers=headers,
        json={
            "pet_id":      pet_id,
            "signs":       signs,
            "report_text": report_text,
            "created_at":  _now_iso(),
        },
        timeout=15,
    )
    report_resp.raise_for_status()
    report_id = report_resp.json()[0]["id"]

    return report_id, pet_id


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(content_length)
        try:
            body = json.loads(raw.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            json_response(self, 400, {"error": "Invalid JSON body"})
            return

        job_id = body.get("job_id")
        if not job_id:
            json_response(self, 400, {"error": "Missing required field: 'job_id'"})
            return

        # --- Claim job atomically (pending → processing) ---
        try:
            claimed = claim_job(job_id)
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Supabase error: {exc}"})
            return
        if not claimed:
            json_response(self, 409, {"error": "Job not found or already being processed"})
            return

        # --- Fetch input_data ---
        try:
            resp = requests.get(
                _supabase_url(f"/rest/v1/jobs?id=eq.{job_id}&select=input_data"),
                headers=_supabase_headers(),
                timeout=10,
            )
            resp.raise_for_status()
            rows = resp.json()
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Supabase error fetching job: {exc}"})
            return

        if not rows:
            json_response(self, 404, {"error": "Job not found"})
            return

        data = rows[0]["input_data"]

        # --- Astro calculation ---
        try:
            signs = astro_calculator.calculate(
                city=data["city"], country=data["country"],
                year=data["year"], month=data["month"], day=data["day"],
                hour=data["hour"], minute=data["minute"],
            )
        except (ValueError, RuntimeError, requests.HTTPError) as exc:
            fail_job(job_id, str(exc))
            json_response(self, 422, {"error": f"Astro calculation failed: {exc}"})
            return

        signs_payload = {
            "sun":              signs["sun_sign"],
            "moon":             signs["moon_sign"],
            "mercury":          signs["mercury_sign"],
            "venus":            signs["venus_sign"],
            "mars":             signs["mars_sign"],
            "jupiter":          signs["jupiter_sign"],
            "saturn":           signs["saturn_sign"],
            "uranus":           signs["uranus_sign"],
            "neptune":          signs["neptune_sign"],
            "pluto":            signs["pluto_sign"],
            "dominant_element": signs["dominant_element"],
        }

        # --- Gemini report ---
        try:
            report_text = call_gemini(build_gemini_prompt(data, signs))
        except (RuntimeError, requests.HTTPError) as exc:
            fail_job(job_id, str(exc))
            json_response(self, 502, {"error": f"Gemini error: {exc}"})
            return

        # --- Save to owners / pets / reports ---
        try:
            report_id, pet_id = save_to_supabase(data, signs_payload, report_text)
        except requests.HTTPError as exc:
            err = f"Supabase save error: {exc}"
            fail_job(job_id, err)
            json_response(self, 502, {"error": err})
            return

        # --- Mark job complete ---
        output = {
            "report_id": report_id,
            "pet_id":    pet_id,
            "report":    report_text,
            "signs":     signs_payload,
        }
        update_job(job_id, {
            "status":       "completed",
            "output_data":  output,
            "completed_at": _now_iso(),
        })

        json_response(self, 200, {"job_id": job_id, "status": "completed", **output})

    def log_message(self, format, *args):
        pass
