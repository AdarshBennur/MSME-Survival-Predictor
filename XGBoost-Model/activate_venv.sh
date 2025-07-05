#!/bin/bash

# MSME Risk Prediction API - Environment Activation Script
# ========================================================

echo "🚀 Activating MSME Risk Prediction API environment..."

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Please run this script from the project root directory (XGBoost-Model)"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Please run setup_dependencies.sh first."
    exit 1
fi

# Activate virtual environment
source .venv/bin/activate

echo "✅ Virtual environment activated!"
echo "📍 Python: $(which python)"
echo "📍 Python version: $(python --version)"

echo ""
echo "🎯 Available commands:"
echo "   📖 Start API server:     cd ml_api && uvicorn main:app --reload"
echo "   🧪 Test API:            cd ml_api && python test_api.py"
echo "   🔍 Check health:        curl http://localhost:8000/health"
echo "   📚 View docs:           http://localhost:8000/docs"
echo "   🚪 Deactivate:          deactivate"

echo ""
echo "💡 Tip: Open a new terminal tab to keep the server running while testing!"

# Start an interactive shell with the environment activated
exec "$SHELL" 