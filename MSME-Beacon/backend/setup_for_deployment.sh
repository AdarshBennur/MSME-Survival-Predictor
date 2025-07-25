#!/bin/bash
set -euo pipefail

# MSME Beacon Backend - Deployment Setup Script
# ============================================

echo "🚀 Setting up MSME Beacon Backend for deployment..."
echo "================================================"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ No .env file found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo "⚠️ Please update the .env file with your actual credentials!"
    else
        echo "❌ No .env.example file found. Please create a .env file manually."
    fi
fi

# Create a Render build script
echo "📝 Creating build script for Render..."
cat > render_build.sh << EOL
#!/bin/bash
set -euo pipefail
# This script runs during the build process on Render

# Install dependencies
npm install
EOL

# Make the build script executable
chmod +x render_build.sh

# Create a Render start script
echo "📝 Creating start script for Render..."
cat > render_start.sh << EOL
#!/bin/bash
set -euo pipefail
# This script runs when the service starts on Render

# Start the Node.js application with exec to properly handle UNIX signals
exec node server.js
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
echo "   4. Add the following environment variables in Render dashboard:"
echo "      - MONGODB_URI"
echo "      - JWT_SECRET"
echo "      - ML_SERVICE_URL (URL of your deployed ML service)"
echo "      - FRONTEND_URL (URL of your Vercel frontend)"
echo ""
echo "📖 To test locally:"
echo "   npm start"
echo "" 