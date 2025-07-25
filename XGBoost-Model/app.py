#!/usr/bin/env python3
"""
Main entry point for MSME Business Risk Prediction API
=====================================================

This file serves as the entry point for the FastAPI application when deployed on Render.
It imports and runs the FastAPI app from the ml_api/main.py file.
"""

import os
import uvicorn
from ml_api.main import app

if __name__ == "__main__":
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the FastAPI app
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 