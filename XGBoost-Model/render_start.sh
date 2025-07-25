#!/bin/bash
# This script runs when the service starts on Render

# Activate virtual environment
source .venv/bin/activate

# Start the FastAPI application
cd ml_api
uvicorn main:app --host 0.0.0.0 --port $PORT
