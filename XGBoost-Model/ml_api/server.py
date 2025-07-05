#!/usr/bin/env python3
"""
Production Server Configuration for MSME Risk Prediction API
===========================================================

This script configures and runs the FastAPI in production mode.
Use this when deploying to a separate server.

Usage:
    python production_server.py
"""

import os
import uvicorn
from ml_api.main import app

def get_server_config():
    """Get server configuration from environment variables or defaults"""
    return {
        "host": os.getenv("API_HOST", "0.0.0.0"),
        "port": int(os.getenv("API_PORT", 8000)),
        "workers": int(os.getenv("API_WORKERS", 4)),
        "reload": os.getenv("API_DEBUG", "false").lower() == "true",
        "log_level": os.getenv("LOG_LEVEL", "info").lower(),
        "access_log": True,
        "use_colors": True,
    }

def run_production_server():
    """Run the FastAPI server in production mode"""
    config = get_server_config()
    
    print("🚀 Starting MSME Risk Prediction API in Production Mode")
    print("=" * 60)
    print(f"Host: {config['host']}")
    print(f"Port: {config['port']}")
    print(f"Workers: {config['workers']}")
    print(f"Debug/Reload: {config['reload']}")
    print(f"Log Level: {config['log_level']}")
    print("=" * 60)
    
    # Production server configuration
    uvicorn.run(
        "ml_api.main:app",
        host=config["host"],
        port=config["port"],
        workers=config["workers"] if not config["reload"] else 1,
        reload=config["reload"],
        log_level=config["log_level"],
        access_log=config["access_log"],
        use_colors=config["use_colors"],
        # Security headers
        server_header=False,
        date_header=True,
    )

if __name__ == "__main__":
    run_production_server() 