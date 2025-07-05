const Settings = require('../models/Settings');

// @desc    Get user settings data
// @route   GET /api/settings
// @access  Private
const getSettingsData = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      // Create default settings if doesn't exist
      settings = await Settings.create({
        userId: req.user._id,
        notifications: {
          email: true,
          sms: false,
          app: true,
          marketing: false,
          riskAlerts: true,
          weeklyReports: true,
          monthlyInsights: true
        },
        privacy: {
          shareData: false,
          allowTracking: false,
          publicProfile: false,
          dataRetention: '1 year'
        },
        appearance: {
          theme: 'light',
          fontSize: 'medium',
          compactView: false,
          colorScheme: 'blue'
        },
        language: {
          primary: 'English',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          numberFormat: 'Indian'
        },
        regional: {
          timezone: 'UTC+05:30 (India Standard Time)',
          currency: 'INR',
          country: 'India'
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
          loginAlerts: true
        },
        dashboard: {
          defaultView: 'overview',
          autoRefresh: true,
          refreshInterval: 300,
          widgetLayout: []
        }
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user settings data
// @route   PUT /api/settings
// @access  Private
const updateSettingsData = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      // Create new settings if doesn't exist
      settings = new Settings({ userId: req.user._id });
    }

    // Update settings data
    if (req.body.notifications) {
      settings.notifications = { ...settings.notifications, ...req.body.notifications };
    }
    if (req.body.privacy) {
      settings.privacy = { ...settings.privacy, ...req.body.privacy };
    }
    if (req.body.appearance) {
      settings.appearance = { ...settings.appearance, ...req.body.appearance };
    }
    if (req.body.language) {
      settings.language = { ...settings.language, ...req.body.language };
    }
    if (req.body.regional) {
      settings.regional = { ...settings.regional, ...req.body.regional };
    }
    if (req.body.security) {
      settings.security = { ...settings.security, ...req.body.security };
    }
    if (req.body.dashboard) {
      settings.dashboard = { ...settings.dashboard, ...req.body.dashboard };
    }

    settings.lastUpdated = new Date();
    const updatedSettings = await settings.save();

    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset user settings to default
// @route   POST /api/settings/reset
// @access  Private
const resetSettingsData = async (req, res) => {
  try {
    await Settings.findOneAndDelete({ userId: req.user._id });

    // Create new default settings
    const defaultSettings = await Settings.create({
      userId: req.user._id,
      notifications: {
        email: true,
        sms: false,
        app: true,
        marketing: false,
        riskAlerts: true,
        weeklyReports: true,
        monthlyInsights: true
      },
      privacy: {
        shareData: false,
        allowTracking: false,
        publicProfile: false,
        dataRetention: '1 year'
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        compactView: false,
        colorScheme: 'blue'
      },
      language: {
        primary: 'English',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        numberFormat: 'Indian'
      },
      regional: {
        timezone: 'UTC+05:30 (India Standard Time)',
        currency: 'INR',
        country: 'India'
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginAlerts: true
      },
      dashboard: {
        defaultView: 'overview',
        autoRefresh: true,
        refreshInterval: 300,
        widgetLayout: []
      }
    });

    res.json({
      success: true,
      data: defaultSettings,
      message: 'Settings reset to default successfully'
    });
  } catch (error) {
    console.error('Reset settings data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user settings data
// @route   DELETE /api/settings
// @access  Private
const deleteSettingsData = async (req, res) => {
  try {
    await Settings.findOneAndDelete({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Settings data deleted successfully'
    });
  } catch (error) {
    console.error('Delete settings data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getSettingsData,
  updateSettingsData,
  resetSettingsData,
  deleteSettingsData
}; 