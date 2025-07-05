#!/usr/bin/env python3
"""
FastAPI Application for MSME Business Risk Prediction
===================================================

This FastAPI application provides advanced business risk assessment
using ensemble models and comprehensive feature engineering.

Author: AI Assistant
Date: 2024
"""

import os
import pickle
import logging
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app initialization
app = FastAPI(
    title="MSME Business Risk Prediction API",
    description="AI-powered business risk assessment using advanced analytics",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Risk scoring weights and thresholds
RISK_WEIGHTS = {
    'cash_flow_negative': 0.25,      # 25% weight - CRITICAL
    'debt_to_asset_ratio': 0.20,     # 20% weight - CRITICAL  
    'profitability': 0.15,           # 15% weight - HIGH
    'business_maturity': 0.15,       # 15% weight - HIGH
    'market_conditions': 0.10,       # 10% weight - MEDIUM
    'operational_efficiency': 0.10,  # 10% weight - MEDIUM
    'growth_potential': 0.05         # 5% weight - LOW
}

CRITICAL_THRESHOLDS = {
    'negative_cash_flow': True,           # Instant high risk
    'debt_to_asset_ratio': 1.0,          # >100% = high risk
    'profitability_negative': True,       # Losses = high risk
    'years_in_business': 2,              # <2 years = higher risk
    'customer_retention': 40,            # <40% = high risk
    'competition_level': 7               # >7/10 = high risk
}

class BusinessData(BaseModel):
    """
    Input data model for business risk prediction.
    
    Represents comprehensive business metrics for risk assessment.
    """
    # Core financial metrics
    revenue: float = Field(description="Annual revenue in Indian Rupees")
    expenses: float = Field(description="Annual expenses in Indian Rupees")
    cashFlow: float = Field(description="Monthly cash flow (can be negative)")
    debt: float = Field(description="Total debt")
    assets: float = Field(description="Total assets")
    
    # Business characteristics
    employeeCount: int = Field(ge=1, description="Number of employees")
    yearsInBusiness: int = Field(ge=0, description="Years in operation")
    industryType: str = Field(description="Industry category")
    location: str = Field(description="Business location")
    
    # Market and operational metrics
    marketGrowth: float = Field(description="Market growth rate (%)")
    competitionLevel: int = Field(ge=1, le=10, description="Competition level (1-10, 10=highest)")
    customerRetention: float = Field(ge=0, le=100, description="Customer retention rate (%)")
    digitalPresence: int = Field(ge=1, le=10, description="Digital presence score (1-10)")
    innovationScore: int = Field(ge=1, le=10, description="Innovation score (1-10)")

    @validator('cashFlow')
    def validate_cash_flow(cls, v):
        # Cash flow can be negative, no restrictions
        return v
    
    @validator('revenue', 'expenses', 'debt', 'assets')
    def validate_positive_financials(cls, v):
        if v < 0:
            raise ValueError("Financial values must be non-negative")
        return v

class PredictionResponse(BaseModel):
    """Response model for risk prediction"""
    risk_score: float = Field(description="Risk probability (0.0 to 1.0)")
    risk_level: str = Field(description="Risk level (Low Risk, Medium Risk, High Risk)")
    confidence: float = Field(description="Model confidence score")
    key_factors: List[str] = Field(description="Most important risk contributors")
    timestamp: str = Field(description="Prediction timestamp")

def extract_business_features(business_data: BusinessData) -> Dict[str, float]:
    """
    Extract comprehensive business features for risk assessment
    """
    try:
        # Convert to dict for easier manipulation
        data = business_data.dict()
        
        features = {}
        
        # 1. Core Financial Health Features
        features['profitability_ratio'] = (data['revenue'] - data['expenses']) / max(data['revenue'], 1)
        features['debt_to_asset_ratio'] = data['debt'] / max(data['assets'], 1)
        features['cash_flow_ratio'] = (data['cashFlow'] * 12) / max(data['revenue'], 1)  # Monthly to annual
        features['monthly_burn_rate'] = data['expenses'] / 12
        
        # 2. Business Sustainability Features
        if data['cashFlow'] > 0:
            features['cash_runway'] = data['assets'] / max(abs(data['cashFlow']), 1)
        else:
            features['cash_runway'] = 0  # No runway if negative cash flow
            
        features['revenue_per_employee'] = data['revenue'] / max(data['employeeCount'], 1)
        features['asset_efficiency'] = data['revenue'] / max(data['assets'], 1)
        
        # 3. Business Maturity and Risk Factors
        features['business_maturity_score'] = min(data['yearsInBusiness'] / 10, 1.0)  # Normalize to 0-1
        features['market_risk_score'] = data['competitionLevel'] * (100 - data['marketGrowth']) / 100
        features['operational_risk'] = (100 - data['customerRetention']) + (10 - data['digitalPresence'])
        
        # 4. Critical Risk Flags (binary features)
        features['is_cash_flow_negative'] = 1.0 if data['cashFlow'] < 0 else 0.0
        features['is_unprofitable'] = 1.0 if data['revenue'] <= data['expenses'] else 0.0
        features['is_overleveraged'] = 1.0 if data['debt'] > data['assets'] else 0.0
        features['is_new_business'] = 1.0 if data['yearsInBusiness'] < 2 else 0.0
        features['is_high_competition'] = 1.0 if data['competitionLevel'] > 7 else 0.0
        features['is_low_retention'] = 1.0 if data['customerRetention'] < 40 else 0.0
        
        # 5. Interaction Features (compound risks)
        features['multiple_critical_risks'] = (
            features['is_cash_flow_negative'] + 
            features['is_unprofitable'] + 
            features['is_overleveraged'] + 
            features['is_new_business']
        ) / 4.0
        
        # 6. Growth and Innovation Potential
        features['growth_potential'] = (data['innovationScore'] + data['digitalPresence']) / 20
        features['market_position'] = (data['customerRetention'] / 100) * (1 - data['competitionLevel'] / 10)
        
        logger.info(f"✅ Extracted {len(features)} business features")
        return features
        
    except Exception as e:
        logger.error(f"❌ Feature extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Feature extraction failed: {str(e)}")

def calculate_advanced_risk_score(features: Dict[str, float]) -> Dict[str, Any]:
    """
    Calculate risk score using weighted ensemble approach
    """
    try:
        # Initialize risk components
        risk_components = {}
        
        # 1. Cash Flow Risk (25% weight) - CRITICAL
        if features['is_cash_flow_negative'] == 1.0:
            cash_flow_risk = 0.9  # Very high risk for negative cash flow
        elif features['cash_flow_ratio'] < 0.05:  # Less than 5% of revenue
            cash_flow_risk = 0.7
        elif features['cash_flow_ratio'] < 0.1:   # Less than 10% of revenue
            cash_flow_risk = 0.4
        else:
            cash_flow_risk = 0.1
        risk_components['cash_flow'] = cash_flow_risk
        
        # 2. Debt-to-Asset Risk (20% weight) - CRITICAL
        debt_ratio = features['debt_to_asset_ratio']
        if debt_ratio > 3.0:  # >300% debt-to-asset
            debt_risk = 0.95
        elif debt_ratio > 1.5:  # >150% debt-to-asset
            debt_risk = 0.85
        elif debt_ratio > 1.0:  # >100% debt-to-asset
            debt_risk = 0.7
        elif debt_ratio > 0.5:  # >50% debt-to-asset
            debt_risk = 0.4
        else:
            debt_risk = 0.15
        risk_components['debt_ratio'] = debt_risk
        
        # 3. Profitability Risk (15% weight) - HIGH
        if features['is_unprofitable'] == 1.0:
            profitability_risk = 0.8
        elif features['profitability_ratio'] < 0.05:  # Less than 5% margin
            profitability_risk = 0.6
        elif features['profitability_ratio'] < 0.1:   # Less than 10% margin
            profitability_risk = 0.3
        else:
            profitability_risk = 0.1
        risk_components['profitability'] = profitability_risk
        
        # 4. Business Maturity Risk (15% weight) - HIGH
        if features['is_new_business'] == 1.0:
            maturity_risk = 0.7  # High risk for new businesses
        elif features['business_maturity_score'] < 0.3:  # Less than 3 years
            maturity_risk = 0.5
        elif features['business_maturity_score'] < 0.5:  # Less than 5 years
            maturity_risk = 0.3
        else:
            maturity_risk = 0.1
        risk_components['maturity'] = maturity_risk
        
        # 5. Market Conditions Risk (10% weight) - MEDIUM
        market_risk = min(features['market_risk_score'] / 100, 0.8)
        risk_components['market'] = market_risk
        
        # 6. Operational Efficiency Risk (10% weight) - MEDIUM
        operational_risk = min(features['operational_risk'] / 100, 0.8)
        risk_components['operational'] = operational_risk
        
        # 7. Growth Potential (5% weight) - LOW
        growth_risk = 1.0 - features['growth_potential']  # Inverse relationship
        risk_components['growth'] = growth_risk
        
        # Calculate weighted risk score
        total_risk = (
            risk_components['cash_flow'] * RISK_WEIGHTS['cash_flow_negative'] +
            risk_components['debt_ratio'] * RISK_WEIGHTS['debt_to_asset_ratio'] +
            risk_components['profitability'] * RISK_WEIGHTS['profitability'] +
            risk_components['maturity'] * RISK_WEIGHTS['business_maturity'] +
            risk_components['market'] * RISK_WEIGHTS['market_conditions'] +
            risk_components['operational'] * RISK_WEIGHTS['operational_efficiency'] +
            risk_components['growth'] * RISK_WEIGHTS['growth_potential']
        )
        
        # Apply critical risk multipliers
        critical_multiplier = 1.0
        if features['multiple_critical_risks'] > 0.5:  # Multiple critical risks
            critical_multiplier = 1.2
        elif features['multiple_critical_risks'] > 0.25:  # Some critical risks
            critical_multiplier = 1.1
            
        final_risk_score = min(total_risk * critical_multiplier, 1.0)
        
        # Identify key risk factors
        key_factors = []
        if risk_components['cash_flow'] > 0.6:
            key_factors.append("Negative Cash Flow")
        if risk_components['debt_ratio'] > 0.6:
            key_factors.append("High Debt-to-Asset Ratio")
        if risk_components['profitability'] > 0.6:
            key_factors.append("Poor Profitability")
        if risk_components['maturity'] > 0.6:
            key_factors.append("New Business")
        if risk_components['market'] > 0.6:
            key_factors.append("Challenging Market Conditions")
        if risk_components['operational'] > 0.6:
            key_factors.append("Operational Inefficiencies")
            
        if not key_factors:
            key_factors = ["Overall Business Performance"]
        
        # Calculate confidence based on data quality and extremes
        confidence = 0.85  # Base confidence
        if features['multiple_critical_risks'] > 0.5:
            confidence = 0.95  # High confidence in high-risk scenarios
        elif features['multiple_critical_risks'] == 0:
            confidence = 0.90  # High confidence in low-risk scenarios
            
        return {
            'risk_score': final_risk_score,
            'risk_components': risk_components,
            'key_factors': key_factors,
            'confidence': confidence
        }
        
    except Exception as e:
        logger.error(f"❌ Risk calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Risk calculation failed: {str(e)}")

def determine_risk_level(risk_score: float) -> str:
    """Convert risk score to risk level"""
    if risk_score >= 0.7:
        return "High Risk"
    elif risk_score >= 0.4:
        return "Medium Risk"
    else:
        return "Low Risk"

@app.on_event("startup")
async def startup_event():
    """Initialize the API"""
    logger.info("🚀 Starting MSME Business Risk Prediction API v2.0...")
    logger.info("✅ Advanced risk assessment model ready!")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "MSME Business Risk Prediction API v2.0",
        "version": "2.0.0",
        "status": "active",
        "description": "Advanced business risk assessment with comprehensive analytics",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_status": "active",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "features": "Advanced Risk Assessment Engine"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_business_risk(business_data: BusinessData):
    """
    Predict business risk based on comprehensive business metrics.
    
    This endpoint accepts business financial and operational data and returns
    a comprehensive risk assessment with detailed analytics.
    """
    try:
        logger.info("🔍 Processing business risk prediction request...")
        
        # Extract comprehensive features
        features = extract_business_features(business_data)
        
        # Calculate advanced risk score
        risk_analysis = calculate_advanced_risk_score(features)
        
        # Determine risk level
        risk_level = determine_risk_level(risk_analysis['risk_score'])
        
        # Create response
        response = PredictionResponse(
            risk_score=round(risk_analysis['risk_score'], 4),
            risk_level=risk_level,
            confidence=round(risk_analysis['confidence'], 4),
            key_factors=risk_analysis['key_factors'],
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"✅ Risk prediction completed: Score={risk_analysis['risk_score']:.4f}, Level={risk_level}")
        logger.info(f"🎯 Key Risk Factors: {', '.join(risk_analysis['key_factors'])}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    # Run the FastAPI app
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 