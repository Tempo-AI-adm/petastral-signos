"""
Vercel serverless function: POST /api/petastral
Full flow: validate → astro calculation → Gemini report → Supabase save → JSON response
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Optional, Tuple

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import astro_calculator

import requests
from flask import Flask, Response, request as flask_request

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

REQUIRED_STR_FIELDS = [
    "pet_name", "pet_type", "breed", "sex",
    "owner_name", "owner_email",
    "city", "country",
]

REQUIRED_INT_FIELDS = ["year", "month", "day", "minute"]

GEMINI_MODEL = "gemini-2.0-flash-exp"
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

def json_resp(body, status):
    resp = Response(
        json.dumps(body, ensure_ascii=False),
        status=status,
        mimetype="application/json",
    )
    for k, v in CORS_HEADERS.items():
        resp.headers[k] = v
    return resp


def validate_body(body):
    # type: (dict) -> Tuple[Optional[dict], Optional[str]]
    data = {}

    for field in REQUIRED_STR_FIELDS:
        val = body.get(field)
        if not val or not str(val).strip():
            return None, "Missing or empty required field: '{}'".format(field)
        data[field] = str(val).strip()

    for field in REQUIRED_INT_FIELDS:
        val = body.get(field)
        if val is None:
            return None, "Missing required field: '{}'".format(field)
        try:
            data[field] = int(val)
        except (ValueError, TypeError):
            return None, "Field '{}' must be an integer".format(field)

    # hour: accept int or "não sei"
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

    data["pet_color"]    = str(body.get("pet_color", "")).strip() or None
    data["pet_markings"] = str(body.get("pet_markings", "")).strip() or None

    return data, None


def build_gemini_prompt(data, signs):
    hour_display   = "não informado" if data.get("hour_unknown") else "{:02d}".format(data["hour"])
    minute_display = "{:02d}".format(data["minute"])

    return """DADOS DO PET:
Nome: {pet_name}
Tipo: {pet_type}
Raça/Pelagem: {breed}
Sexo: {sex}
Cor: {pet_color}
Marcações: {pet_markings}
Data de Nascimento: {day:02d}/{month:02d}/{year} às {hour}:{minute}h
Local: {city}, {country}

DADOS ASTRAIS CALCULADOS:
- Sol em {sun}
- Lua em {moon}
- Mercúrio em {mercury}
- Vênus em {venus}
- Marte em {mars}
- Júpiter em {jupiter}
- Saturno em {saturn}
- Urano em {uranus}
- Netuno em {neptune}
- Plutão em {pluto}
- Elemento Predominante: {element}

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

**1. Sol em {sun}: Essência, Comportamento e Personalidade**
**2. Lua em {moon}: Emoções, Necessidades e Vínculo com o Tutor**
**3. Elementos Astrológicos: O Ambiente e a Energia Ideal**
**4. Mercúrio em {mercury}: Como Seu Pet Se Comunica e Processa Informações**
**5. Vênus em {venus}: Relacionamentos e Conexões**
**6. Marte em {mars}: Energia, Atividade e Comportamento**
**7. Júpiter em {jupiter}: Sorte, Descobertas e Expansão**
**8. Saturno em {saturn}: Desafios, Limites e Aprendizados de Vida**
**9. Urano, Netuno e Plutão: Transformações, Instintos e Propósito do Seu Pet**
**PILAR DE BEM-ESTAR (FINAL): Dicas Práticas para o Bem-Estar**""".format(
        pet_name=data["pet_name"],
        pet_type=data["pet_type"],
        breed=data["breed"],
        sex=data["sex"],
        pet_color=data.get("pet_color") or "não informado",
        pet_markings=data.get("pet_markings") or "não informado",
        day=data["day"], month=data["month"], year=data["year"],
        hour=hour_display, minute=minute_display,
        city=data["city"], country=data["country"],
        sun=signs["sun_sign"], moon=signs["moon_sign"],
        mercury=signs["mercury_sign"], venus=signs["venus_sign"],
        mars=signs["mars_sign"], jupiter=signs["jupiter_sign"],
        saturn=signs["saturn_sign"], uranus=signs["uranus_sign"],
        neptune=signs["neptune_sign"], pluto=signs["pluto_sign"],
        element=signs["dominant_element"],
    )


def call_gemini(prompt):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    payload = {
        "system_instruction": {"parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8000},
    }

    resp = requests.post(
        GEMINI_URL, params={"key": api_key}, json=payload, timeout=120
    )
    resp.raise_for_status()
    result = resp.json()

    try:
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as exc:
        raise RuntimeError("Unexpected Gemini response structure: {}".format(result)) from exc


def save_to_supabase(data, signs, report_text):
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    supabase_key = os.environ.get("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")

    headers = {
        "apikey": supabase_key,
        "Authorization": "Bearer {}".format(supabase_key),
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    # 1. Upsert owner
    owner_resp = requests.post(
        "{}/rest/v1/owners".format(supabase_url),
        headers=dict(headers, Prefer="resolution=merge-duplicates,return=representation"),
        json={"name": data["owner_name"], "email": data["owner_email"]},
        timeout=15,
    )
    owner_resp.raise_for_status()
    owner_id = owner_resp.json()[0]["id"]

    # 2. Insert pet
    pet_resp = requests.post(
        "{}/rest/v1/pets".format(supabase_url),
        headers=headers,
        json={
            "owner_id":     owner_id,
            "pet_name":     data["pet_name"],
            "pet_type":     data["pet_type"],
            "breed":        data["breed"],
            "sex":          data["sex"],
            "pet_color":    data.get("pet_color"),
            "pet_markings": data.get("pet_markings"),
            "birth_data": {
                "city":         data["city"],
                "country":      data["country"],
                "year":         data["year"],
                "month":        data["month"],
                "day":          data["day"],
                "hour":         data["hour"],
                "minute":       data["minute"],
                "hour_unknown": data.get("hour_unknown", False),
            },
        },
        timeout=15,
    )
    pet_resp.raise_for_status()
    pet_id = pet_resp.json()[0]["id"]

    # 3. Insert report
    report_resp = requests.post(
        "{}/rest/v1/reports".format(supabase_url),
        headers=headers,
        json={
            "pet_id":      pet_id,
            "signs":       signs,
            "report_text": report_text,
            "created_at":  datetime.now(timezone.utc).isoformat(),
        },
        timeout=15,
    )
    report_resp.raise_for_status()
    report_id = report_resp.json()[0]["id"]

    return report_id, pet_id


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/api/petastral", methods=["OPTIONS"])
@app.route("/", methods=["OPTIONS"])
def options():
    resp = Response("", status=204)
    for k, v in CORS_HEADERS.items():
        resp.headers[k] = v
    return resp


@app.route("/api/petastral", methods=["POST"])
@app.route("/", methods=["POST"])
def petastral():
    # --- Parse body ---
    try:
        raw = flask_request.get_data(as_text=True)
        if not raw:
            return json_resp({"error": "Empty request body"}, 400)
        body = json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return json_resp({"error": "Invalid JSON body"}, 400)

    # --- Validate ---
    data, err = validate_body(body)
    if err:
        return json_resp({"error": err}, 400)

    # --- Astro calculation ---
    try:
        signs = astro_calculator.calculate(
            city=data["city"], country=data["country"],
            year=data["year"], month=data["month"], day=data["day"],
            hour=data["hour"], minute=data["minute"],
        )
    except ValueError as exc:
        return json_resp({"error": "Astro calculation failed: {}".format(exc)}, 422)
    except RuntimeError as exc:
        return json_resp({"error": "Geocoding/ephemeris error: {}".format(exc)}, 502)

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
    except RuntimeError as exc:
        return json_resp({"error": "Gemini API error: {}".format(exc)}, 502)
    except requests.HTTPError as exc:
        return json_resp({"error": "Gemini HTTP error: {}".format(exc)}, 502)

    # --- Supabase save ---
    try:
        report_id, pet_id = save_to_supabase(data, signs_payload, report_text)
    except RuntimeError as exc:
        return json_resp({"error": str(exc)}, 500)
    except requests.HTTPError as exc:
        return json_resp({"error": "Supabase error: {} — {}".format(exc, exc.response.text)}, 502)

    # --- Success ---
    return json_resp({
        "success":   True,
        "report_id": report_id,
        "pet_id":    pet_id,
        "report":    report_text,
        "signs":     signs_payload,
    }, 200)
