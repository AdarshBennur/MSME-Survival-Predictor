#!/bin/bash

# MSME Risk Prediction API - Deployment Setup Script
# ==================================================

echo "🚀 Setting up MSME Risk Prediction API for deployment..."
echo "=================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

echo "✅ Python3 found: $(python3 --version)"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

# Install all dependencies
echo "📦 Installing dependencies from requirements.txt..."
pip install -r requirements.txt

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
from main import app
print('✅ FastAPI app imports successfully')
"
cd ..

# Create a Render build script
echo "📝 Creating build script for Render..."
cat > render_build.sh << EOL
#!/bin/bash
# This script runs during the build process on Render

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
EOL

# Make the build script executable
chmod +x render_build.sh

# Create a Render start script
echo "📝 Creating start script for Render..."
cat > render_start.sh << EOL
#!/bin/bash
# This script runs when the service starts on Render

# Activate virtual environment
source .venv/bin/activate

# Start the FastAPI application
cd ml_api
uvicorn main:app --host 0.0.0.0 --port \$PORT
EOL

# Make the start script executable
chmod +x render_start.sh

echo ""
echo "🎉 Setup complete!"
echo "📖 To deploy on Render:"
echo "   1. Create a new Web Service"
echo "   2. Connect your GitHub repository"
echo "   3. Set the following configuration:"
echo "      - Build Command: ./render_build.sh"
echo "      - Start Command: ./render_start.sh"
echo "   4. Add any necessary environment variables"
echo ""
echo "📖 To test locally:"
echo "   source .venv/bin/activate"
echo "   cd ml_api"
echo "   uvicorn main:app --reload"
echo "" 