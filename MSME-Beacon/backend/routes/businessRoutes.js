const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only csv and excel files
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV and Excel files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Import controllers
const businessController = require('../controllers/businessController');

// Business data routes
router.post('/', protect, businessController.addBusinessData);
router.get('/', protect, businessController.getBusinessData);
router.get('/:id', protect, businessController.getBusinessDataById);
router.put('/:id', protect, businessController.updateBusinessData);
router.delete('/:id', protect, businessController.deleteBusinessData);

// Bulk upload route
router.post('/upload', protect, upload.single('file'), businessController.uploadBusinessData);

// Download template route
router.get('/template/download', businessController.downloadTemplate);

module.exports = router; 