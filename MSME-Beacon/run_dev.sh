#!/bin/bash

# MSME Risk Prediction System
# Development startup script

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  MSME Risk Prediction System Startup${NC}"
echo -e "${BLUE}======================================${NC}"

# Check if Python is installed
if command -v python3 &>/dev/null; then
    echo -e "${GREEN}✓ Python detected${NC}"
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    echo -e "${GREEN}✓ Python detected${NC}"
    PYTHON_CMD=python
else
    echo -e "${RED}✗ Python not found. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if command -v node &>/dev/null; then
    echo -e "${GREEN}✓ Node.js detected${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 14 or higher.${NC}"
    exit 1
fi

# Check for virtual environment
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}→ Creating Python virtual environment...${NC}"
    $PYTHON_CMD -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
echo -e "${YELLOW}→ Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"

# Install backend dependencies
echo -e "${YELLOW}→ Installing backend dependencies...${NC}"
cd backend
pip install -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install frontend dependencies
echo -e "${YELLOW}→ Installing frontend dependencies...${NC}"
cd ../frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Start the servers
echo -e "${YELLOW}→ Starting servers...${NC}"

# Start backend server
cd ../backend
echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}Starting Backend Server on port 5000${NC}"
echo -e "${BLUE}======================================${NC}"
$PYTHON_CMD app.py &
BACKEND_PID=$!

# Start frontend server
cd ../frontend
echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}Starting Frontend Server on port 3000${NC}"
echo -e "${BLUE}======================================${NC}"
npm start &
FRONTEND_PID=$!

# Trap Ctrl+C and properly shutdown the servers
trap 'echo -e "${YELLOW}→ Shutting down servers...${NC}"; kill $BACKEND_PID; kill $FRONTEND_PID; exit 0' INT

echo -e "${GREEN}✓ Servers started successfully${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}Access the application at:${NC}"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend API:${NC} http://localhost:5000"
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the servers${NC}"

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID 