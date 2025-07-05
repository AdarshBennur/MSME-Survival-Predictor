const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/authConfig');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password in queries
  },
  businessName: {
    type: String,
    required: [true, 'Please add a business name'],
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  businessSize: {
    type: String,
    enum: ['Micro (1-9 employees)', 'Small (10-49 employees)', 'Medium (50-249 employees)', 'Large (250+ employees)'],
    default: 'Small (10-49 employees)'
  },
  // Additional profile fields
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    default: 'Business Owner',
    trim: true
  },
  businessType: {
    type: String,
    trim: true
  },
  businessLocation: {
    type: String,
    trim: true
  },
  // Settings fields
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      app: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      riskAlerts: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      monthlyInsights: { type: Boolean, default: true }
    },
    privacy: {
      shareData: { type: Boolean, default: false },
      allowTracking: { type: Boolean, default: false },
      publicProfile: { type: Boolean, default: false },
      dataRetention: { type: String, default: '1 year' }
    },
    appearance: {
      theme: { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
      fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
      compactView: { type: Boolean, default: false },
      colorScheme: { type: String, default: 'blue' }
    },
    language: {
      primary: { type: String, default: 'English' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      timeFormat: { type: String, default: '24h' },
      numberFormat: { type: String, default: 'Indian' }
    },
    regional: {
      timezone: { type: String, default: 'UTC+05:30 (India Standard Time)' },
      currency: { type: String, default: 'INR' },
      country: { type: String, default: 'India' }
    },
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      sessionTimeout: { type: Number, default: 30 },
      loginAlerts: { type: Boolean, default: true }
    }
  },
  // Dashboard/Business data
  dashboardData: {
    businessMetrics: {
      revenue: { type: Number, default: 0 },
      expenses: { type: Number, default: 0 },
      profit: { type: Number, default: 0 },
      cashFlow: { type: Number, default: 0 },
      assets: { type: Number, default: 0 },
      debt: { type: Number, default: 0 },
      employeeCount: { type: Number, default: 1 },
      yearsInBusiness: { type: Number, default: 1 }
    },
    kpis: {
      monthlySales: { type: Number, default: 0 },
      customerCount: { type: Number, default: 0 },
      avgTransactionValue: { type: Number, default: 0 },
      returnRate: { type: Number, default: 0 },
      marketingSpend: { type: Number, default: 0 },
      stockValue: { type: Number, default: 0 }
    },
    financialData: {
      currentAssets: { type: Number, default: 0 },
      currentLiabilities: { type: Number, default: 0 },
      totalEquity: { type: Number, default: 0 },
      workingCapital: { type: Number, default: 0 }
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  // Insights data
  insightsData: {
    marketTrends: {
      industry: { type: String, default: '' },
      marketGrowth: { type: Number, default: 0 },
      competitorAnalysis: { type: String, default: '' },
      marketOpportunities: [{ type: String }]
    },
    businessAnalytics: {
      revenueGrowth: { type: Number, default: 0 },
      profitMargin: { type: Number, default: 0 },
      customerAcquisitionCost: { type: Number, default: 0 },
      customerLifetimeValue: { type: Number, default: 0 },
      burnRate: { type: Number, default: 0 }
    },
    predictions: {
      nextQuarterRevenue: { type: Number, default: 0 },
      growthProjection: { type: Number, default: 0 },
      riskFactors: [{ type: String }],
      recommendations: [{ type: String }]
    },
    performanceMetrics: {
      efficiency: { type: Number, default: 0 },
      productivity: { type: Number, default: 0 },
      sustainability: { type: Number, default: 0 },
      innovation: { type: Number, default: 0 }
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(authConfig.saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id }, 
    authConfig.jwtSecret, 
    { expiresIn: authConfig.jwtExpire }
  );
};

module.exports = mongoose.model('User', UserSchema, 'users'); 