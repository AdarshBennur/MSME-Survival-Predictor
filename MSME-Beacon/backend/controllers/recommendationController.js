const Recommendation = require('../models/Recommendation');

// @desc    Get all recommendations for a user
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single recommendation by ID
// @route   GET /api/recommendations/:id
// @access  Private
exports.getRecommendationById = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }
    
    // Make sure recommendation belongs to user
    if (recommendation.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this recommendation'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Generate recommendations based on business data
// @route   POST /api/recommendations/generate
// @access  Private
exports.generateRecommendations = async (req, res) => {
  try {
    // Check if user has business data first
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first to generate recommendations.',
        data: []
      });
    }

    // Only generate recommendations if user has business data
    // In a real implementation, this would analyze the user's actual business data
    const personalizedRecommendations = [
      {
        title: 'Review Your Financial Data',
        description: 'Based on your submitted business information, we recommend conducting a comprehensive risk assessment.',
        priority: 'High',
        category: 'Financial',
        status: 'Pending',
        user: req.user._id
      }
    ];
    
    // Create recommendations in database
    const recommendations = await Recommendation.create(personalizedRecommendations);
    
    res.status(201).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update recommendation status
// @route   PUT /api/recommendations/:id/status
// @access  Private
exports.updateRecommendationStatus = async (req, res) => {
  try {
    let recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }
    
    // Make sure recommendation belongs to user
    if (recommendation.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this recommendation'
      });
    }
    
    recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Filter recommendations by priority
// @route   GET /api/recommendations/filter/:priority
// @access  Private
exports.filterRecommendationsByPriority = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ 
      user: req.user.id,
      priority: req.params.priority
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 