#!/bin/bash
set -euo pipefail
# This script runs during the build process on Render

# Render automatically creates a Python environment
# We'll install dependencies directly without creating a local venv
# which could cause issues with Render's runtime environment

# Install dependencies
pip install -r requirements.txt

# Verify installation of key packages
python -c "import fastapi, uvicorn, pandas, numpy, xgboost; print('Required packages verified')"
