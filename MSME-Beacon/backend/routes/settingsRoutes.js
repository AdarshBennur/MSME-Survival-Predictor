const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const settingsController = require('../controllers/settingsController');

// Settings routes
router.get('/', protect, settingsController.getSettingsData);
router.put('/', protect, settingsController.updateSettingsData);
router.post('/reset', protect, settingsController.resetSettingsData);
router.delete('/', protect, settingsController.deleteSettingsData);

module.exports = router; 