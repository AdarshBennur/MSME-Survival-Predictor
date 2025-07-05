const Business = require('../models/Business');
const path = require('path');
const fs = require('fs');

// @desc    Add business data
// @route   POST /api/business
// @access  Private
const addBusinessData = async (req, res) => {
  try {
    const {
      monthlySales,
      stockValue,
      customerCount,
      expenses,
      profit,
      employeeCount,
      avgTransactionValue,
      returnRate,
      marketingSpend,
      debtToEquityRatio,
      customerRetentionRate,
      inventoryTurnoverRate,
      month,
      year
    } = req.body;

    // Get current date if month/year not provided
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = year || currentDate.getFullYear();

    // Check if data for this month/year already exists
    const existingData = await Business.findOne({
      user: req.user._id,
      month: currentMonth,
      year: currentYear
    });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message: 'Business data for this month already exists. Use update instead.'
      });
    }

    // Create business data
    const businessData = await Business.create({
      user: req.user._id,
      monthlySales,
      stockValue,
      customerCount,
      expenses,
      profit,
      employeeCount,
      avgTransactionValue: avgTransactionValue || 0,
      returnRate: returnRate || 0,
      marketingSpend: marketingSpend || 0,
      debtToEquityRatio: debtToEquityRatio || 0,
      customerRetentionRate: customerRetentionRate || 0,
      inventoryTurnoverRate: inventoryTurnoverRate || 0,
      month: currentMonth,
      year: currentYear
    });

    res.status(201).json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Add business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all business data for a user
// @route   GET /api/business
// @access  Private
const getBusinessData = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { year, month } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    if (year) query.year = year;
    if (month) query.month = month;

    // Find all business data for the user with optional filtering
    const businessData = await Business.find(query).sort({ year: -1, month: -1 });

    res.json({
      success: true,
      count: businessData.length,
      data: businessData
    });
  } catch (error) {
    console.error('Get business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get business data by ID
// @route   GET /api/business/:id
// @access  Private
const getBusinessDataById = async (req, res) => {
  try {
    const businessData = await Business.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Make sure user owns the business data
    if (businessData.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this data'
      });
    }

    res.json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Get business data by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update business data
// @route   PUT /api/business/:id
// @access  Private
const updateBusinessData = async (req, res) => {
  try {
    let businessData = await Business.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Make sure user owns the business data
    if (businessData.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this data'
      });
    }

    // Update the data
    businessData = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Update business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete business data
// @route   DELETE /api/business/:id
// @access  Private
const deleteBusinessData = async (req, res) => {
  try {
    const businessData = await Business.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Make sure user owns the business data
    if (businessData.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this data'
      });
    }

    await businessData.remove();

    res.json({
      success: true,
      message: 'Business data deleted'
    });
  } catch (error) {
    console.error('Delete business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload business data from CSV/Excel
// @route   POST /api/business/upload
// @access  Private
const uploadBusinessData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // In a real implementation, this would:
    // 1. Parse the CSV/Excel file
    // 2. Validate the data
    // 3. Process and save the data in the database
    
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: req.file.filename
    });
  } catch (error) {
    console.error('Upload business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Download template file
// @route   GET /api/business/template/download
// @access  Public
const downloadTemplate = (req, res) => {
  try {
    // In a real implementation, this would send a template file
    // For now, we'll create a basic response
    res.json({
      success: true,
      message: 'Template download would be implemented here',
      templateFields: [
        'monthlySales', 'stockValue', 'customerCount', 'expenses',
        'profit', 'employeeCount', 'avgTransactionValue', 'returnRate',
        'marketingSpend', 'month', 'year'
      ]
    });
  } catch (error) {
    console.error('Download template error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  addBusinessData,
  getBusinessData,
  getBusinessDataById,
  updateBusinessData,
  deleteBusinessData,
  uploadBusinessData,
  downloadTemplate
}; 