const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const insightsController = require('../controllers/insightsController');

// Insights routes
router.get('/', protect, insightsController.getInsightsData);
router.put('/', protect, insightsController.updateInsightsData);
router.post('/report', protect, insightsController.addInsightReport);
router.delete('/', protect, insightsController.deleteInsightsData);

module.exports = router; 