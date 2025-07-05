const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const dashboardController = require('../controllers/dashboardController');

// Dashboard routes
router.get('/', protect, dashboardController.getDashboardData);
router.put('/', protect, dashboardController.updateDashboardData);
router.delete('/', protect, dashboardController.deleteDashboardData);

module.exports = router; 