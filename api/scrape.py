import json
import os
import sys
from typing import Any

# Ensure Python can import from src/script
ROOT = os.getcwd()
SCRIPT_DIR = os.path.join(ROOT, 'src', 'script')
if SCRIPT_DIR not in sys.path:
    sys.path.append(SCRIPT_DIR)

try:
    from toyota_scrapper import UniversalRedDeerToyotaScraper
except Exception as e:
    UniversalRedDeerToyotaScraper = None
    IMPORT_ERROR = e
else:
    IMPORT_ERROR = None


def _json_response(status: int, body: Any):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
        },
        "body": json.dumps(body),
    }


def handler(request, response=None):
    """
    Vercel Python Serverless Function entrypoint.
    Runs the scraper and returns latest vehicles as JSON without committing to GitHub.
    """
    # Basic method guard (allow GET/POST)
    method = getattr(request, 'method', 'GET').upper()
    if method not in ("GET", "POST"):
        return _json_response(405, {"error": "Method Not Allowed"})

    if IMPORT_ERROR or UniversalRedDeerToyotaScraper is None:
        return _json_response(500, {"error": "Scraper import failed", "details": str(IMPORT_ERROR)})

    try:
        scraper = UniversalRedDeerToyotaScraper()
        vehicles = scraper.scrape_inventory()
        # Return normalized data; UI already expects sale_value support
        return _json_response(200, {
            "ok": True,
            "count": len(vehicles or []),
            "vehicles": vehicles or [],
        })
    except Exception as e:
        return _json_response(500, {"error": str(e)})
