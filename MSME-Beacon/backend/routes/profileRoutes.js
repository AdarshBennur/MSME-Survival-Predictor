const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const profileController = require('../controllers/profileController');

// Profile routes
router.get('/', protect, profileController.getProfileData);
router.put('/', protect, profileController.updateProfileData);
router.delete('/', protect, profileController.deleteProfileData);

module.exports = router; 