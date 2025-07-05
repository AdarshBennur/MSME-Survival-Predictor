const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/authConfig');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, businessName, industry, location, businessSize } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      businessName,
      industry: industry || '',
      location: location || '',
      businessSize: businessSize || 'Small (10-49 employees)'
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          token: user.getSignedJwtToken()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password in this query)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Password matches, return user data and token
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        token: user.getSignedJwtToken()
      }
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          industry: user.industry,
          location: user.location,
          businessSize: user.businessSize,
          phone: user.phone,
          role: user.role,
          businessType: user.businessType,
          businessLocation: user.businessLocation
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic profile fields
    user.name = req.body.name || user.name;
    user.businessName = req.body.businessName || user.businessName;
    user.industry = req.body.industry || user.industry;
    user.location = req.body.location || user.location;
    user.businessSize = req.body.businessSize || user.businessSize;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.businessType = req.body.businessType || user.businessType;
    user.businessLocation = req.body.businessLocation || user.businessLocation;
    
    // Only update email if provided and it's different
    if (req.body.email && req.body.email !== user.email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
      user.email = req.body.email;
    }

    // If password is provided, update it
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        businessName: updatedUser.businessName,
        industry: updatedUser.industry,
        location: updatedUser.location,
        businessSize: updatedUser.businessSize,
        phone: updatedUser.phone,
        role: updatedUser.role,
        businessType: updatedUser.businessType,
        businessLocation: updatedUser.businessLocation
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/users/password/forgot
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // In a real implementation, this would:
    // 1. Find the user
    // 2. Generate a reset token
    // 3. Save the token and expiry in DB
    // 4. Send an email with the reset link
    
    // For now, just return a success message
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/users/password/reset/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    // In a real implementation, this would:
    // 1. Find user with valid reset token and expiry
    // 2. Update the password
    // 3. Clear the reset token fields
    
    // For now, just return a success message
    res.json({
      success: true,
      message: 'Password has been reset'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: user.settings || {
          notifications: { email: true, sms: false, app: true, marketing: false },
          privacy: { shareData: false, allowTracking: false },
          appearance: { theme: 'light', fontSize: 'medium', compactView: false },
          language: { primary: 'English' },
          regional: { timezone: 'UTC+05:30 (India Standard Time)' }
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get user settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
const updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update settings
    if (req.body.notifications) {
      user.settings.notifications = { ...user.settings.notifications, ...req.body.notifications };
    }
    if (req.body.privacy) {
      user.settings.privacy = { ...user.settings.privacy, ...req.body.privacy };
    }
    if (req.body.appearance) {
      user.settings.appearance = { ...user.settings.appearance, ...req.body.appearance };
    }
    if (req.body.language) {
      user.settings.language = { ...user.settings.language, ...req.body.language };
    }
    if (req.body.regional) {
      user.settings.regional = { ...user.settings.regional, ...req.body.regional };
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser.settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update user settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: user.dashboardData || {
          businessMetrics: {},
          kpis: {},
          financialData: {},
          lastUpdated: new Date()
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get user dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user dashboard data
// @route   PUT /api/users/dashboard
// @access  Private
const updateUserDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update dashboard data
    if (req.body.businessMetrics) {
      user.dashboardData.businessMetrics = { ...user.dashboardData.businessMetrics, ...req.body.businessMetrics };
    }
    if (req.body.kpis) {
      user.dashboardData.kpis = { ...user.dashboardData.kpis, ...req.body.kpis };
    }
    if (req.body.financialData) {
      user.dashboardData.financialData = { ...user.dashboardData.financialData, ...req.body.financialData };
    }
    
    user.dashboardData.lastUpdated = new Date();
    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser.dashboardData,
      message: 'Dashboard data updated successfully'
    });
  } catch (error) {
    console.error('Update user dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user insights data
// @route   GET /api/users/insights
// @access  Private
const getUserInsightsData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: user.insightsData || {
          marketTrends: {},
          businessAnalytics: {},
          predictions: {},
          performanceMetrics: {},
          lastUpdated: new Date()
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get user insights data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user insights data
// @route   PUT /api/users/insights
// @access  Private
const updateUserInsightsData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update insights data
    if (req.body.marketTrends) {
      user.insightsData.marketTrends = { ...user.insightsData.marketTrends, ...req.body.marketTrends };
    }
    if (req.body.businessAnalytics) {
      user.insightsData.businessAnalytics = { ...user.insightsData.businessAnalytics, ...req.body.businessAnalytics };
    }
    if (req.body.predictions) {
      user.insightsData.predictions = { ...user.insightsData.predictions, ...req.body.predictions };
    }
    if (req.body.performanceMetrics) {
      user.insightsData.performanceMetrics = { ...user.insightsData.performanceMetrics, ...req.body.performanceMetrics };
    }

    user.insightsData.lastUpdated = new Date();
    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser.insightsData,
      message: 'Insights data updated successfully'
    });
  } catch (error) {
    console.error('Update user insights data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  getUserDashboardData,
  updateUserDashboardData,
  getUserInsightsData,
  updateUserInsightsData,
  forgotPassword,
  resetPassword
}; 