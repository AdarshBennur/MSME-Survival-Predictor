const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const recommendationController = require('../controllers/recommendationController');

// Recommendation routes
router.get('/', protect, recommendationController.getRecommendations);
router.get('/:id', protect, recommendationController.getRecommendationById);
router.post('/generate', protect, recommendationController.generateRecommendations);
router.put('/:id/status', protect, recommendationController.updateRecommendationStatus);
router.get('/filter/:priority', protect, recommendationController.filterRecommendationsByPriority);

module.exports = router; 