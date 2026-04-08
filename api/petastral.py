"""
Vercel serverless function: POST /api/petastral + GET /api/petastral
POST → validate input, enqueue job in Supabase, return {job_id, status: "pending"}
       then fire-and-forget trigger to Render worker
GET  → return job status and result by ?job_id=<uuid>
"""
 
import json
import os
from http.server import BaseHTTPRequestHandler
from typing import Optional, Tuple
from urllib.parse import parse_qs, urlparse
 
import requests
 
# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
 
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}
 
REQUIRED_STR_FIELDS = [
    "pet_name", "pet_type", "breed", "sex",
    "owner_name", "owner_email",
    "city", "country",
]
 
REQUIRED_INT_FIELDS = ["year", "month", "day", "minute"]
 
WORKER_URL = os.environ.get("WORKER_URL", "https://petastral-worker.onrender.com")
 
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
 
 
def _supabase_headers() -> dict:
    key = os.environ.get("SUPABASE_KEY", "")
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
 
 
def _supabase_url(path: str) -> str:
    return os.environ.get("SUPABASE_URL", "").rstrip("/") + path
 
 
def create_job(input_data: dict) -> str:
    resp = requests.post(
        _supabase_url("/rest/v1/jobs"),
        headers=_supabase_headers(),
        json={"input_data": input_data},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()[0]["id"]
 
 
def trigger_worker(job_id: str):
    """Fire-and-forget: tell the Render worker to process this job.
    Uses a short timeout — we don't wait for the result.
    If this fails, the job stays 'pending' and can be retried."""
    try:
        requests.post(
            f"{WORKER_URL}/process",
            json={"job_id": job_id},
            timeout=3,
        )
    except Exception:
        # Fire-and-forget: don't block the user response if worker is slow/down
        pass
 
 
def get_job(job_id: str) -> Optional[dict]:
    resp = requests.get(
        _supabase_url(
            f"/rest/v1/jobs?id=eq.{job_id}"
            "&select=id,status,output_data,error_message,created_at,completed_at"
        ),
        headers=_supabase_headers(),
        timeout=10,
    )
    resp.raise_for_status()
    rows = resp.json()
    return rows[0] if rows else None
 
 
# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------
 
class handler(BaseHTTPRequestHandler):
 
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()
 
    def do_GET(self):
        qs = parse_qs(urlparse(self.path).query)
        job_id = (qs.get("job_id") or [None])[0]
        if not job_id:
            json_response(self, 400, {"error": "Missing query parameter: job_id"})
            return
 
        try:
            job = get_job(job_id)
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Supabase error: {exc}"})
            return
 
        if job is None:
            json_response(self, 404, {"error": "Job not found"})
            return
 
        json_response(self, 200, job)
 
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(content_length)
        try:
            try:
                text = raw.decode("utf-8")
            except UnicodeDecodeError:
                text = raw.decode("latin-1")
            body = json.loads(text)
        except json.JSONDecodeError:
            json_response(self, 400, {"error": "Invalid JSON body"})
            return
 
        data, err = validate_body(body)
        if err:
            json_response(self, 400, {"error": err})
            return
 
        try:
            job_id = create_job(data)
        except requests.HTTPError as exc:
            json_response(self, 502, {"error": f"Supabase error: {exc}"})
            return
 
        # Fire-and-forget: trigger worker to process this job
        trigger_worker(job_id)
 
        json_response(self, 202, {"job_id": job_id, "status": "pending"})
 
    def log_message(self, format, *args):
        pass
