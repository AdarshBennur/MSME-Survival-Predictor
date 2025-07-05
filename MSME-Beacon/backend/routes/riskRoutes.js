const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const riskController = require('../controllers/riskController');

// Risk routes
router.get('/current', protect, riskController.getCurrentRisk);
router.get('/history', protect, riskController.getRiskHistory);
router.post('/calculate', protect, riskController.calculateRisk);
router.get('/factors', protect, riskController.getRiskFactors);
router.get('/trends', protect, riskController.getRiskTrends);

// Prediction routes - both protected and unprotected for testing
router.post('/predict', protect, riskController.predictRisk);
router.post('/predict-demo', riskController.predictRisk); // Unprotected for demo/testing

module.exports = router; 