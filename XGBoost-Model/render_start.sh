#!/bin/bash
set -euo pipefail
# This script runs when the service starts on Render

# Render provides its own Python environment
# No need to activate a local venv

# Start the FastAPI application
cd ml_api
exec uvicorn main:app --host 0.0.0.0 --port $PORT
