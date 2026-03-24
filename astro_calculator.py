"""
Astrological calculator: given a birth date/time and location,
returns planetary zodiac signs and dominant element.

Dependencies: requests, geopy
Install with: pip install requests geopy
"""

import argparse
import json
import sys
from datetime import datetime, timezone

import requests
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

ELEMENTS = {
    "Aries":       "fire",
    "Leo":         "fire",
    "Sagittarius": "fire",
    "Taurus":      "earth",
    "Virgo":       "earth",
    "Capricorn":   "earth",
    "Gemini":      "air",
    "Libra":       "air",
    "Aquarius":    "air",
    "Cancer":      "water",
    "Scorpio":     "water",
    "Pisces":      "water",
}

PLANETS = ["sun", "moon", "mercury", "venus", "mars",
           "jupiter", "saturn", "uranus", "neptune", "pluto"]

EPHEMERIS_BASE = "https://ephemeris.fyi/ephemeris"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def geocode(city: str, country: str) -> tuple[float, float]:
    """Return (latitude, longitude) for the given city and country."""
    geolocator = Nominatim(user_agent="petastral-calculator/1.0")
    query = f"{city}, {country}"
    try:
        location = geolocator.geocode(query, timeout=10)
    except (GeocoderTimedOut, GeocoderServiceError) as exc:
        raise RuntimeError(f"Geocoding failed: {exc}") from exc

    if location is None:
        raise ValueError(f"Could not find coordinates for '{query}'")

    return location.latitude, location.longitude


def longitude_to_sign(degrees: float) -> str:
    """Convert ecliptic longitude (0-360°) to zodiac sign name."""
    degrees = degrees % 360
    index = int(degrees // 30)
    return ZODIAC_SIGNS[index]


def dominant_element(sign_map: dict[str, str]) -> str:
    """Return the element with the most planets; ties broken by fire>earth>air>water."""
    counts: dict[str, int] = {"fire": 0, "earth": 0, "air": 0, "water": 0}
    for sign in sign_map.values():
        counts[ELEMENTS[sign]] += 1

    priority = ["fire", "earth", "air", "water"]
    return max(priority, key=lambda e: (counts[e], -priority.index(e)))


def fetch_positions(lat: float, lon: float, dt: datetime) -> dict[str, float]:
    """
    Call ephemeris.fyi and return a dict of planet -> ecliptic longitude (°).
    """
    iso_dt = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    bodies_param = ",".join(PLANETS)

    url = f"{EPHEMERIS_BASE}/get_ephemeris_data"
    params = {
        "latitude":  lat,
        "longitude": lon,
        "datetime":  iso_dt,
        "bodies":    bodies_param,
    }

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    positions: dict[str, float] = {}
    for planet in PLANETS:
        # The API may nest data differently; handle both flat and nested shapes.
        entry = data.get(planet) or data.get(planet.capitalize())
        if entry is None:
            raise ValueError(
                f"Planet '{planet}' missing from API response. "
                f"Keys returned: {list(data.keys())}"
            )
        lon_dd = entry.get("apparentLongitudeDd") or entry.get("apparentLongitude")
        if lon_dd is None:
            raise ValueError(
                f"'apparentLongitude' missing for '{planet}'. "
                f"Entry: {entry}"
            )
        positions[planet] = float(lon_dd)

    return positions


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def calculate(
    city: str,
    country: str,
    year: int,
    month: int,
    day: int,
    hour: int,
    minute: int,
) -> dict:
    # 1. Geocode location
    lat, lon = geocode(city, country)

    # 2. Build UTC datetime (treat the supplied time as UTC / birth time as-is)
    dt = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)

    # 3. Fetch planetary longitudes
    positions = fetch_positions(lat, lon, dt)

    # 4. Convert to zodiac signs
    sign_map: dict[str, str] = {
        planet: longitude_to_sign(deg) for planet, deg in positions.items()
    }

    # 5. Dominant element
    dom_element = dominant_element(sign_map)

    return {
        "sun_sign":       sign_map["sun"],
        "moon_sign":      sign_map["moon"],
        "mercury_sign":   sign_map["mercury"],
        "venus_sign":     sign_map["venus"],
        "mars_sign":      sign_map["mars"],
        "jupiter_sign":   sign_map["jupiter"],
        "saturn_sign":    sign_map["saturn"],
        "uranus_sign":    sign_map["uranus"],
        "neptune_sign":   sign_map["neptune"],
        "pluto_sign":     sign_map["pluto"],
        "dominant_element": dom_element,
        # extra context
        "latitude":  lat,
        "longitude": lon,
        "datetime_utc": dt.isoformat(),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Calculate planetary zodiac signs for a given birth date/time and location."
    )
    parser.add_argument("--city",    required=True, help="Birth city (e.g. 'London')")
    parser.add_argument("--country", required=True, help="Birth country (e.g. 'UK')")
    parser.add_argument("--year",    required=True, type=int)
    parser.add_argument("--month",   required=True, type=int)
    parser.add_argument("--day",     required=True, type=int)
    parser.add_argument("--hour",    required=True, type=int, help="Hour in UTC (0-23)")
    parser.add_argument("--minute",  required=True, type=int, help="Minute (0-59)")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    try:
        result = calculate(
            city=args.city,
            country=args.country,
            year=args.year,
            month=args.month,
            day=args.day,
            hour=args.hour,
            minute=args.minute,
        )
        print(json.dumps(result, indent=2))
    except (ValueError, RuntimeError, requests.HTTPError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        sys.exit(1)
