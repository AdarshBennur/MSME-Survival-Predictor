#!/bin/bash

# MSME Beacon Frontend - Deployment Setup Script
# ============================================

echo "🚀 Setting up MSME Beacon Frontend for deployment..."
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

# Create Vercel configuration file
echo "📝 Creating Vercel configuration file..."
cat > vercel.json << EOL
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.onrender.com/api"
  }
}
EOL

# Create .env.production file for production environment variables
echo "📝 Creating .env.production file..."
cat > .env.production << EOL
# Backend API URL (replace with your actual backend URL when deployed)
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
EOL

# Create .env.development file for local development
echo "📝 Creating .env.development file..."
cat > .env.development << EOL
# Backend API URL for local development
REACT_APP_API_URL=http://localhost:5001/api
EOL

echo ""
echo "🎉 Setup complete!"
echo "📖 To deploy on Vercel:"
echo "   1. Install Vercel CLI: npm install -g vercel"
echo "   2. Login to Vercel: vercel login"
echo "   3. Deploy: vercel"
echo "   4. Set the following environment variables in Vercel dashboard:"
echo "      - REACT_APP_API_URL (URL of your deployed backend API)"
echo ""
echo "📖 To test locally:"
echo "   npm start"
echo ""
echo "⚠️ Important: Before deploying to production, update the REACT_APP_API_URL"
echo "   in .env.production and vercel.json with your actual backend URL."
echo "" 