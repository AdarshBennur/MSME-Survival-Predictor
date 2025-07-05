const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get user profile data
// @route   GET /api/profile
// @access  Private
const getProfileData = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create default profile from User data if doesn't exist
      const user = await User.findById(req.user._id);
      profile = await Profile.create({
        userId: req.user._id,
        personalInfo: {
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'Business Owner'
        },
        businessInfo: {
          businessName: user.businessName || '',
          businessType: user.businessType || '',
          industry: user.industry || '',
          businessLocation: user.businessLocation || user.location || '',
          businessSize: user.businessSize || 'Small (10-49 employees)'
        },
        professionalInfo: {},
        preferences: {}
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile data
// @route   PUT /api/profile
// @access  Private
const updateProfileData = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create new profile if doesn't exist
      profile = new Profile({ userId: req.user._id });
    }

    // Update profile data
    if (req.body.personalInfo) {
      profile.personalInfo = { ...profile.personalInfo, ...req.body.personalInfo };
    }
    if (req.body.businessInfo) {
      profile.businessInfo = { ...profile.businessInfo, ...req.body.businessInfo };
    }
    if (req.body.professionalInfo) {
      profile.professionalInfo = { ...profile.professionalInfo, ...req.body.professionalInfo };
    }
    if (req.body.preferences) {
      profile.preferences = { ...profile.preferences, ...req.body.preferences };
    }

    profile.lastUpdated = new Date();
    const updatedProfile = await profile.save();

    // Also update the main User record for authentication purposes
    await User.findByIdAndUpdate(req.user._id, {
      name: profile.personalInfo.fullName,
      email: profile.personalInfo.email,
      businessName: profile.businessInfo.businessName,
      industry: profile.businessInfo.industry,
      location: profile.businessInfo.businessLocation,
      businessSize: profile.businessInfo.businessSize,
      phone: profile.personalInfo.phone,
      role: profile.personalInfo.role,
      businessType: profile.businessInfo.businessType
    });

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile data updated successfully'
    });
  } catch (error) {
    console.error('Update profile data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user profile data
// @route   DELETE /api/profile
// @access  Private
const deleteProfileData = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Profile data deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getProfileData,
  updateProfileData,
  deleteProfileData
}; 