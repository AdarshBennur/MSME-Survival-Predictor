const Dashboard = require('../models/Dashboard');

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne({ userId: req.user._id });

    if (!dashboard) {
      // Create default dashboard if doesn't exist
      dashboard = await Dashboard.create({
        userId: req.user._id,
        businessMetrics: {},
        kpis: {},
        financialData: {}
      });
    }

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user dashboard data
// @route   PUT /api/dashboard
// @access  Private
const updateDashboardData = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne({ userId: req.user._id });

    if (!dashboard) {
      // Create new dashboard if doesn't exist
      dashboard = new Dashboard({ userId: req.user._id });
    }

    // Update dashboard data
    if (req.body.businessMetrics) {
      dashboard.businessMetrics = { ...dashboard.businessMetrics, ...req.body.businessMetrics };
    }
    if (req.body.kpis) {
      dashboard.kpis = { ...dashboard.kpis, ...req.body.kpis };
    }
    if (req.body.financialData) {
      dashboard.financialData = { ...dashboard.financialData, ...req.body.financialData };
    }

    dashboard.lastUpdated = new Date();
    const updatedDashboard = await dashboard.save();

    res.json({
      success: true,
      data: updatedDashboard,
      message: 'Dashboard data updated successfully'
    });
  } catch (error) {
    console.error('Update dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user dashboard data
// @route   DELETE /api/dashboard
// @access  Private
const deleteDashboardData = async (req, res) => {
  try {
    await Dashboard.findOneAndDelete({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Dashboard data deleted successfully'
    });
  } catch (error) {
    console.error('Delete dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  updateDashboardData,
  deleteDashboardData
}; 