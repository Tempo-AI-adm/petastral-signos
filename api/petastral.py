"""
Vercel serverless function: POST /api/petastral
Full flow: validate → astro calculation → Gemini report → Supabase save → JSON response
"""

import json
import os
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from typing import Optional, Tuple

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

REQUIRED_STR_FIELDS = [
    "pet_name", "pet_type", "breed", "sex",
    "owner_name", "owner_email",
    "city", "country",
]

REQUIRED_INT_FIELDS = ["year", "month", "day", "minute"]

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


def validate_body(body: dict) -> Tuple[Optional[dict], Optional[str]]:
    """Validate, coerce, and return (cleaned_data, error_message)."""
    data = {}

    for field in REQUIRED_STR_FIELDS:
        val = body.get(field)
        if not val or not str(val).strip():
            return None, f"Missing or empty required field: '{field}'"
        data[field] = str(val).strip()

    for field in REQUIRED_INT_FIELDS:
        val = body.get(field)
        if val is None:
            return None, f"Missing required field: '{field}'"
        try:
            data[field] = int(val)
        except (ValueError, TypeError):
            return None, f"Field '{field}' must be an integer"

    # hour: accept int or the string "não sei" (case-insensitive / stripped)
    hour_raw = body.get("hour")
    if hour_raw is None:
        return None, "Missing required field: 'hour'"
    if isinstance(hour_raw, str) and hour_raw.strip().lower() in ("não sei", "nao sei", "?", ""):
        data["hour"] = 12
        data["hour_unknown"] = True
    else:
        try:
            data["hour"] = int(hour_raw)
            data["hour_unknown"] = False
        except (ValueError, TypeError):
            return None, "Field 'hour' must be an integer or 'não sei'"

    # optional fields
    data["pet_color"]    = str(body.get("pet_color", "")).strip() or None
    data["pet_markings"] = str(body.get("pet_markings", "")).strip() or None

    return data, None


def build_gemini_prompt(data: dict, signs: dict) -> str:
    hour_display = "não informado" if data.get("hour_unknown") else f"{data['hour']:02d}"
    minute_display = f"{data['minute']:02d}"

    prompt = f"""DADOS DO PET:
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

    return prompt


def call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    payload = {
        "system_instruction": {
            "parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]
        },
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 6000,
        },
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
    """
    Upsert owner → insert pet → insert report.
    Returns (report_id, pet_id).
    """
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    supabase_key = os.environ.get("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    # 1. Upsert owner (unique on email)
    owner_payload = {
        "name":  data["owner_name"],
        "email": data["owner_email"],
    }
    owner_resp = requests.post(
        f"{supabase_url}/rest/v1/owners",
        headers={**headers, "Prefer": "resolution=merge-duplicates,return=representation"},
        json=owner_payload,
        timeout=15,
    )
    owner_resp.raise_for_status()
    owner_id = owner_resp.json()[0]["id"]

    # 2. Insert pet
    birth_data = {
        "city":    data["city"],
        "country": data["country"],
        "year":    data["year"],
        "month":   data["month"],
        "day":     data["day"],
        "hour":    data["hour"],
        "minute":  data["minute"],
        "hour_unknown": data.get("hour_unknown", False),
    }
    pet_payload = {
        "owner_id":     owner_id,
        "pet_name":     data["pet_name"],
        "pet_type":     data["pet_type"],
        "breed":        data["breed"],
        "sex":          data["sex"],
        "pet_color":    data.get("pet_color"),
        "pet_markings": data.get("pet_markings"),
        "birth_data":   birth_data,
    }
    pet_resp = requests.post(
        f"{supabase_url}/rest/v1/pets",
        headers=headers,
        json=pet_payload,
        timeout=15,
    )
    pet_resp.raise_for_status()
    pet_id = pet_resp.json()[0]["id"]

    # 3. Insert report
    report_payload = {
        "pet_id":      pet_id,
        "signs":       signs,
        "report_text": report_text,
        "created_at":  datetime.now(timezone.utc).isoformat(),
    }
    report_resp = requests.post(
        f"{supabase_url}/rest/v1/reports",
        headers=headers,
        json=report_payload,
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
        # --- Parse body ---
        content_length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(content_length)
        try:
            try:
                text = raw.decode('utf-8')
            except UnicodeDecodeError:
                text = raw.decode('latin-1')
            body = json.loads(text)
        except json.JSONDecodeError:
            json_response(self, 400, {"error": "Invalid JSON body"})
            return

        # --- Validate ---
        data, err = validate_body(body)
        if err:
            json_response(self, 400, {"error": err})
            return

        # --- Astro calculation ---
        try:
            signs = astro_calculator.calculate(
                city=data["city"],
                country=data["country"],
                year=data["year"],
                month=data["month"],
                day=data["day"],
                hour=data["hour"],
                minute=data["minute"],
            )
        except ValueError as exc:
            json_response(self, 422, {"error": f"Astro calculation failed: {exc}"})
            return
        except RuntimeError as exc:
            json_response(self, 502, {"error": f"Geocoding/ephemeris error: {exc}"})
            return
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Ephemeris API error: {exc}"})
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
            prompt = build_gemini_prompt(data, signs)
            report_text = call_gemini(prompt)
        except RuntimeError as exc:
            json_response(self, 502, {"error": f"Gemini API error: {exc}"})
            return
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Gemini HTTP error: {exc}"})
            return

        # --- Supabase save ---
        try:
            report_id, pet_id = save_to_supabase(data, signs_payload, report_text)
        except RuntimeError as exc:
            json_response(self, 500, {"error": str(exc)})
            return
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Supabase error: {exc} — {exc.response.text}"})
            return

        # --- Success ---
        json_response(self, 200, {
            "success":   True,
            "report_id": report_id,
            "pet_id":    pet_id,
            "report":    report_text,
            "signs":     signs_payload,
        })

    def log_message(self, format, *args):
        pass
