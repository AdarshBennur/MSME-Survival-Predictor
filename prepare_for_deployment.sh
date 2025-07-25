#!/bin/bash
set -euo pipefail

# MSME Survival Predictor - Deployment Preparation Script
# ======================================================

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  MSME Survival Predictor Deployment  ${NC}"
echo -e "${BLUE}  Preparation for Vercel and Render   ${NC}"
echo -e "${BLUE}======================================${NC}"

# Make all setup scripts executable
echo -e "${YELLOW}→ Making setup scripts executable...${NC}"
chmod +x XGBoost-Model/setup_for_deployment.sh
chmod +x MSME-Beacon/backend/setup_for_deployment.sh
chmod +x MSME-Beacon/frontend/setup_for_deployment.sh
echo -e "${GREEN}✓ Setup scripts are now executable${NC}"

# Step 1: Prepare ML model for deployment
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}→ Preparing ML model for deployment...${NC}"
echo -e "${BLUE}======================================${NC}"
cd XGBoost-Model
./setup_for_deployment.sh
cd ..

# Step 2: Prepare backend for deployment
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}→ Preparing backend for deployment...${NC}"
echo -e "${BLUE}======================================${NC}"
cd MSME-Beacon/backend
./setup_for_deployment.sh
cd ../..

# Step 3: Prepare frontend for deployment
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}→ Preparing frontend for deployment...${NC}"
echo -e "${BLUE}======================================${NC}"
cd MSME-Beacon/frontend
./setup_for_deployment.sh
cd ../..

# Final instructions
echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e ""
echo -e "${BLUE}1. Deploy ML model to Render:${NC}"
echo -e "   - Create a new Web Service on Render"
echo -e "   - Connect your GitHub repository"
echo -e "   - Set the root directory to: ${GREEN}XGBoost-Model${NC}"
echo -e "   - Set build command: ${GREEN}./render_build.sh${NC}"
echo -e "   - Set start command: ${GREEN}./render_start.sh${NC}"
echo -e ""
echo -e "${BLUE}2. Deploy backend to Render:${NC}"
echo -e "   - Create a new Web Service on Render"
echo -e "   - Connect your GitHub repository"
echo -e "   - Set the root directory to: ${GREEN}MSME-Beacon/backend${NC}"
echo -e "   - Set build command: ${GREEN}./render_build.sh${NC}"
echo -e "   - Set start command: ${GREEN}./render_start.sh${NC}"
echo -e "   - Add the following environment variables:"
echo -e "     - MONGODB_URI"
echo -e "     - JWT_SECRET"
echo -e "     - ML_SERVICE_URL (URL of your deployed ML service)"
echo -e "     - FRONTEND_URL (URL of your Vercel frontend)"
echo -e ""
echo -e "${BLUE}3. Deploy frontend to Vercel:${NC}"
echo -e "   - Connect your GitHub repository to Vercel"
echo -e "   - Set the root directory to: ${GREEN}MSME-Beacon/frontend${NC}"
echo -e "   - Add the following environment variables:"
echo -e "     - REACT_APP_API_URL (URL of your deployed backend API)"
echo -e ""
echo -e "${RED}⚠️  Important:${NC}"
echo -e "   - Update all URLs in the environment variables with your actual deployed URLs"
echo -e "   - Make sure your MongoDB Atlas database is properly configured and accessible"
echo -e "   - Ensure your IP is whitelisted in MongoDB Atlas"
echo -e "${BLUE}======================================${NC}" 