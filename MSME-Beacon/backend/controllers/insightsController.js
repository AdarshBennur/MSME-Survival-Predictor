const Insights = require('../models/Insights');

// @desc    Get user insights data
// @route   GET /api/insights
// @access  Private
const getInsightsData = async (req, res) => {
  try {
    let insights = await Insights.findOne({ userId: req.user._id });

    if (!insights) {
      // Create default insights if doesn't exist
      insights = await Insights.create({
        userId: req.user._id,
        marketTrends: {},
        businessAnalytics: {},
        predictions: {},
        performanceMetrics: {},
        dataVisualization: { charts: [], reports: [] }
      });
    }

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get insights data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user insights data
// @route   PUT /api/insights
// @access  Private
const updateInsightsData = async (req, res) => {
  try {
    let insights = await Insights.findOne({ userId: req.user._id });

    if (!insights) {
      // Create new insights if doesn't exist
      insights = new Insights({ userId: req.user._id });
    }

    // Update insights data
    if (req.body.marketTrends) {
      insights.marketTrends = { ...insights.marketTrends, ...req.body.marketTrends };
    }
    if (req.body.businessAnalytics) {
      insights.businessAnalytics = { ...insights.businessAnalytics, ...req.body.businessAnalytics };
    }
    if (req.body.predictions) {
      insights.predictions = { ...insights.predictions, ...req.body.predictions };
    }
    if (req.body.performanceMetrics) {
      insights.performanceMetrics = { ...insights.performanceMetrics, ...req.body.performanceMetrics };
    }
    if (req.body.dataVisualization) {
      insights.dataVisualization = { ...insights.dataVisualization, ...req.body.dataVisualization };
    }

    insights.lastUpdated = new Date();
    const updatedInsights = await insights.save();

    res.json({
      success: true,
      data: updatedInsights,
      message: 'Insights data updated successfully'
    });
  } catch (error) {
    console.error('Update insights data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add insight report
// @route   POST /api/insights/report
// @access  Private
const addInsightReport = async (req, res) => {
  try {
    let insights = await Insights.findOne({ userId: req.user._id });

    if (!insights) {
      insights = new Insights({ userId: req.user._id });
    }

    const newReport = {
      title: req.body.title,
      content: req.body.content,
      generatedAt: new Date()
    };

    insights.dataVisualization.reports.push(newReport);
    insights.lastUpdated = new Date();
    await insights.save();

    res.json({
      success: true,
      data: newReport,
      message: 'Insight report added successfully'
    });
  } catch (error) {
    console.error('Add insight report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user insights data
// @route   DELETE /api/insights
// @access  Private
const deleteInsightsData = async (req, res) => {
  try {
    await Insights.findOneAndDelete({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Insights data deleted successfully'
    });
  } catch (error) {
    console.error('Delete insights data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getInsightsData,
  updateInsightsData,
  addInsightReport,
  deleteInsightsData
}; 