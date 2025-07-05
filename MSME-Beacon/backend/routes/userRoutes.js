const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const userController = require('../controllers/userController');

// User routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.get('/settings', protect, userController.getUserSettings);
router.put('/settings', protect, userController.updateUserSettings);
router.get('/dashboard', protect, userController.getUserDashboardData);
router.put('/dashboard', protect, userController.updateUserDashboardData);
router.get('/insights', protect, userController.getUserInsightsData);
router.put('/insights', protect, userController.updateUserInsightsData);
router.post('/password/forgot', userController.forgotPassword);
router.put('/password/reset/:resetToken', userController.resetPassword);

module.exports = router; 