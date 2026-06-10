#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from orison import web
if __name__ == "__main__":
    host = os.getenv("ORISON_HOST", "0.0.0.0")
    port = int(os.getenv("ORISON_PORT", 5001))
    debug = bool(os.getenv("FLASK_DEBUG", "").lower() in ['true', '1', 't'])
web.run_server(host=host, port=5002, debug=debug)
