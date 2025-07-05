#!/bin/bash

# MSME Risk Prediction API - Dependency Setup Script
# ==================================================

echo "🚀 Setting up MSME Risk Prediction API dependencies..."
echo "=================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

echo "✅ Python3 found: $(python3 --version)"

# Install all dependencies
echo "📦 Installing dependencies from requirements.txt..."
pip3 install -r requirements.txt

# Verify installations
echo "🔍 Verifying installations..."

# Test core dependencies
python3 -c "
import pandas, numpy, sklearn, xgboost, lightgbm
print('✅ ML libraries: pandas, numpy, sklearn, xgboost, lightgbm')
"

# Test FastAPI dependencies  
python3 -c "
import fastapi, uvicorn, pydantic, requests
print('✅ API libraries: fastapi, uvicorn, pydantic, requests')
"

# Test the application
echo "🧪 Testing FastAPI application..."
cd ml_api
python3 -c "
from main import app, load_model_artifacts
print('✅ FastAPI app imports successfully')
success = load_model_artifacts()
if success:
    print('✅ Model artifacts loaded successfully')
else:
    print('⚠️  Model artifacts not found - please train the model first')
"

echo ""
echo "🎉 Setup complete!"
echo "📖 To start the API server:"
echo "   cd ml_api"
echo "   uvicorn main:app --reload"
echo ""
echo "📖 To test the API:"
echo "   python test_api.py" 