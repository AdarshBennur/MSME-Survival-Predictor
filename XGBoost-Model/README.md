# MSME Risk Prediction API

This directory contains the machine learning API for MSME business risk prediction.

## Overview

The API is built with FastAPI and provides endpoints for predicting business risk based on financial and operational data.

## Local Development

### Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the API locally:
   ```bash
   cd ml_api
   uvicorn main:app --reload
   ```

4. Access the API documentation at http://localhost:8000/docs

## Deployment on Render

### Configuration

When deploying on Render, use the following settings:

1. **Build Command**:
   ```
   pip install -r requirements.txt
   ```

2. **Start Command**:
   ```
   uvicorn ml_api.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables**:
   - `PORT`: Automatically set by Render

### API Endpoints

- `GET /`: API information
- `GET /health`: Health check endpoint
- `POST /predict`: Risk prediction endpoint

## Testing

To test the API, run:

```bash
cd ml_api
python test_api.py
```
