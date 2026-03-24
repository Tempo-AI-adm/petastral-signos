"""
Vercel serverless function: POST /api/calculate
Accepts JSON body: { city, country, year, month, day, hour, minute }
Returns JSON with 10 planetary signs and dominant element.
"""

import json
import sys
import os

# Add parent directory to path so we can import astro_calculator
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from http.server import BaseHTTPRequestHandler
import astro_calculator


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

REQUIRED_FIELDS = {
    "city": str,
    "country": str,
    "year": int,
    "month": int,
    "day": int,
    "hour": int,
    "minute": int,
}


def json_response(handler, status: int, body: dict):
    encoded = json.dumps(body).encode()
    handler.send_response(status)
    for k, v in CORS_HEADERS.items():
        handler.send_header(k, v)
    handler.send_header("Content-Length", str(len(encoded)))
    handler.end_headers()
    handler.wfile.write(encoded)


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
            body = json.loads(raw)
        except json.JSONDecodeError:
            json_response(self, 400, {"error": "Invalid JSON body"})
            return

        # Validate and coerce required fields
        kwargs = {}
        for field, ftype in REQUIRED_FIELDS.items():
            if field not in body:
                json_response(self, 400, {"error": f"Missing required field: '{field}'"})
                return
            try:
                kwargs[field] = ftype(body[field])
            except (ValueError, TypeError):
                json_response(self, 400, {"error": f"Field '{field}' must be a {ftype.__name__}"})
                return

        try:
            result = astro_calculator.calculate(**kwargs)
        except ValueError as exc:
            json_response(self, 422, {"error": str(exc)})
            return
        except RuntimeError as exc:
            json_response(self, 502, {"error": str(exc)})
            return
        except Exception as exc:
            json_response(self, 500, {"error": f"Internal error: {exc}"})
            return

        json_response(self, 200, result)

    def log_message(self, format, *args):
        # Suppress default access log noise in serverless logs
        pass
