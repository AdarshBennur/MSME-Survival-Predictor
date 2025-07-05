const asyncHandler = require('express-async-handler');
const axios = require('axios');

// FastAPI ML service endpoint
const ML_SERVICE_URL = 'http://localhost:8000/predict';

// Fallback risk calculation function
const calculateRiskFallback = (businessData) => {
  console.log('🔄 Using fallback risk calculation...');
  
  // Normalize and validate inputs
  const revenue = parseFloat(businessData.revenue) || 0;
  const expenses = parseFloat(businessData.expenses) || 0;
  const cashFlow = parseFloat(businessData.cashFlow) || 0;
  const debt = parseFloat(businessData.debt) || 0;
  const assets = parseFloat(businessData.assets) || 0;
  const employeeCount = parseInt(businessData.employeeCount) || 0;
  const yearsInBusiness = parseInt(businessData.yearsInBusiness) || 0;
  const marketGrowth = parseFloat(businessData.marketGrowth) || 0;
  const competitionLevel = parseInt(businessData.competitionLevel) || 5;
  const customerRetention = parseFloat(businessData.customerRetention) || 0;
  const digitalPresence = parseInt(businessData.digitalPresence) || 5;
  const innovationScore = parseInt(businessData.innovationScore) || 5;
  
  // Calculate risk factors (0-100 scale where higher = more risk)
  let riskScore = 0;
  let riskFactors = [];
  
  // Financial Health (40% weight)
  const profitMargin = revenue > 0 ? ((revenue - expenses) / revenue) * 100 : -100;
  const debtToAssetRatio = assets > 0 ? (debt / assets) : 1;
  const cashFlowRatio = revenue > 0 ? (cashFlow / (revenue / 12)) : -1;
  
  let financialRisk = 0;
  if (profitMargin < 0) {
    financialRisk += 40;
    riskFactors.push('Negative profit margin');
  } else if (profitMargin < 10) {
    financialRisk += 25;
    riskFactors.push('Low profit margin');
  } else if (profitMargin < 20) {
    financialRisk += 10;
  }
  
  if (debtToAssetRatio > 0.7) {
    financialRisk += 30;
    riskFactors.push('High debt-to-asset ratio');
  } else if (debtToAssetRatio > 0.5) {
    financialRisk += 15;
  }
  
  if (cashFlowRatio < 0) {
    financialRisk += 30;
    riskFactors.push('Negative cash flow');
  } else if (cashFlowRatio < 0.1) {
    financialRisk += 15;
    riskFactors.push('Poor cash flow');
  }
  
  riskScore += Math.min(financialRisk, 40) * 0.4;
  
  // Business Maturity (20% weight)
  let maturityRisk = 0;
  if (yearsInBusiness < 1) {
    maturityRisk = 25;
    riskFactors.push('Very new business');
  } else if (yearsInBusiness < 3) {
    maturityRisk = 15;
    riskFactors.push('Young business');
  } else if (yearsInBusiness < 5) {
    maturityRisk = 8;
  }
  
  if (employeeCount < 3) {
    maturityRisk += 10;
    riskFactors.push('Very small team');
  } else if (employeeCount < 10) {
    maturityRisk += 5;
  }
  
  riskScore += Math.min(maturityRisk, 25) * 0.2;
  
  // Market Position (25% weight)
  let marketRisk = 0;
  if (marketGrowth < 0) {
    marketRisk += 20;
    riskFactors.push('Declining market');
  } else if (marketGrowth < 3) {
    marketRisk += 10;
    riskFactors.push('Slow market growth');
  }
  
  if (competitionLevel > 7) {
    marketRisk += 15;
    riskFactors.push('High competition');
  } else if (competitionLevel > 5) {
    marketRisk += 8;
  }
  
  if (customerRetention < 50) {
    marketRisk += 15;
    riskFactors.push('Poor customer retention');
  } else if (customerRetention < 75) {
    marketRisk += 8;
  }
  
  riskScore += Math.min(marketRisk, 25) * 0.25;
  
  // Innovation and Digital Presence (15% weight)
  let innovationRisk = 0;
  if (digitalPresence < 3) {
    innovationRisk += 10;
    riskFactors.push('Low digital presence');
  } else if (digitalPresence < 6) {
    innovationRisk += 5;
  }
  
  if (innovationScore < 3) {
    innovationRisk += 10;
    riskFactors.push('Low innovation capacity');
  } else if (innovationScore < 6) {
    innovationRisk += 5;
  }
  
  riskScore += Math.min(innovationRisk, 15) * 0.15;
  
  // Ensure score is within bounds
  riskScore = Math.max(0, Math.min(100, riskScore));
  
  // Determine risk level
  let riskLevel;
  if (riskScore < 30) {
    riskLevel = 'Low Risk';
  } else if (riskScore < 60) {
    riskLevel = 'Medium Risk';
  } else {
    riskLevel = 'High Risk';
  }
  
  return {
    risk_score: riskScore / 100, // Convert to 0-1 scale to match ML service format
    risk_level: riskLevel,
    factors: riskFactors,
    calculation_method: 'fallback'
  };
};

// @desc    Get current risk score
// @route   GET /api/risk/current
// @access  Private
const getCurrentRisk = asyncHandler(async (req, res) => {
  try {
    // Check if user has business data
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first.'
      });
    }

    // Return user-specific risk data (this would be calculated based on their actual data)
    res.status(200).json({
      success: true,
      data: {
        score: null, // Will be calculated when user submits prediction form
        category: null,
        lastUpdated: userBusinessData.createdAt,
        trend: null,
        message: 'Complete risk prediction to see your current risk score'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get risk history
// @route   GET /api/risk/history
// @access  Private
const getRiskHistory = asyncHandler(async (req, res) => {
  // Mock data for frontend development
  res.status(200).json([
    { date: '2023-01-01', score: 65, category: 'High Risk' },
    { date: '2023-02-01', score: 68, category: 'Moderate Risk' },
    { date: '2023-03-01', score: 70, category: 'Moderate Risk' },
    { date: '2023-04-01', score: 72, category: 'Moderate Risk' },
    { date: '2023-05-01', score: 75, category: 'Moderate Risk' },
    { date: '2023-06-01', score: 78, category: 'Low Risk' }
  ]);
});

// @desc    Calculate new risk score
// @route   POST /api/risk/calculate
// @access  Private
const calculateRisk = asyncHandler(async (req, res) => {
  // In a real app, this would analyze business data and calculate a risk score
  const { businessData } = req.body;
  
  // Simulated calculation
  const newScore = Math.floor(Math.random() * 20) + 65; // Random score between 65-85
  const category = newScore < 70 ? 'High Risk' : newScore < 80 ? 'Moderate Risk' : 'Low Risk';
  
  res.status(200).json({
    score: newScore,
    category,
    lastUpdated: new Date().toISOString(),
    message: 'Risk score has been recalculated'
  });
});

// @desc    Get risk factors
// @route   GET /api/risk/factors
// @access  Private
const getRiskFactors = asyncHandler(async (req, res) => {
  try {
    // Check if user has business data
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first.',
        data: []
      });
    }

    // Return empty array or user-specific factors if they exist
    res.status(200).json({
      success: true,
      data: [], // Will be populated when user completes prediction
      message: 'Complete risk prediction to see your risk factors'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get risk trends
// @route   GET /api/risk/trends
// @access  Private
const getRiskTrends = asyncHandler(async (req, res) => {
  try {
    // Check if user has business data
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first.',
        data: {
          overall: [],
          months: [],
          factors: {}
        }
      });
    }

    // Return empty trends data until user has historical predictions
    res.status(200).json({
      success: true,
      data: {
        overall: [],
        months: [],
        factors: {},
        message: 'Trend data will be available after multiple risk assessments'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Predict risk using ML microservice
// @route   POST /api/risk/predict
// @access  Private
const predictRisk = asyncHandler(async (req, res) => {
  try {
    const businessData = req.body;
    
    console.log('Sending data to ML service:', businessData);
    console.log('ML Service URL:', ML_SERVICE_URL);
    
    let mlResult = null;
    let usingFallback = false;
    
    // Try to call the ML service first
    try {
      const response = await axios.post(ML_SERVICE_URL, businessData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout for faster fallback
      });
      
      mlResult = response.data;
      console.log('✅ ML service response:', mlResult);
      
    } catch (mlError) {
      console.warn('⚠️ ML service unavailable, using fallback calculation:', mlError.message);
      mlResult = calculateRiskFallback(businessData);
      usingFallback = true;
    }
    
    // Extract risk score and risk level from the result
    const { risk_score, risk_level, factors } = mlResult;
    
    // Format response for frontend
    const predictionResult = {
      score: Math.round(risk_score * 100), // Convert to percentage
      category: risk_level,
      riskLevel: risk_level,
      lastUpdated: new Date().toISOString(),
      message: usingFallback 
        ? 'Risk prediction completed using fallback calculation (ML service unavailable)' 
        : 'Risk prediction completed successfully',
      method: usingFallback ? 'fallback' : 'ml_service',
      factors: factors || []
    };
    
    res.status(200).json(predictionResult);
    
  } catch (error) {
    console.error('Error in prediction:', error.message);
    
    // Last resort fallback
    try {
      const fallbackResult = calculateRiskFallback(req.body);
      const predictionResult = {
        score: Math.round(fallbackResult.risk_score * 100),
        category: fallbackResult.risk_level,
        riskLevel: fallbackResult.risk_level,
        lastUpdated: new Date().toISOString(),
        message: 'Risk prediction completed using emergency fallback calculation',
        method: 'emergency_fallback',
        factors: fallbackResult.factors || []
      };
      
      res.status(200).json(predictionResult);
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to calculate risk prediction',
        details: error.message
      });
    }
  }
});

module.exports = {
  getCurrentRisk,
  getRiskHistory,
  calculateRisk,
  getRiskFactors,
  getRiskTrends,
  predictRisk
}; 