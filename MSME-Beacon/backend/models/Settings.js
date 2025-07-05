const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
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
    dataRetention: { type: String, default: '1 year', enum: ['6 months', '1 year', '2 years', 'indefinite'] }
  },
  appearance: {
    theme: { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
    fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
    compactView: { type: Boolean, default: false },
    colorScheme: { type: String, default: 'blue', enum: ['blue', 'green', 'purple', 'orange'] }
  },
  language: {
    primary: { type: String, default: 'English' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    timeFormat: { type: String, default: '24h', enum: ['12h', '24h'] },
    numberFormat: { type: String, default: 'Indian', enum: ['US', 'European', 'Indian'] }
  },
  regional: {
    timezone: { type: String, default: 'UTC+05:30 (India Standard Time)' },
    currency: { type: String, default: 'INR' },
    country: { type: String, default: 'India' }
  },
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 }, // minutes
    passwordLastChanged: { type: Date },
    loginAlerts: { type: Boolean, default: true }
  },
  dashboard: {
    defaultView: { type: String, default: 'overview', enum: ['overview', 'analytics', 'reports'] },
    autoRefresh: { type: Boolean, default: true },
    refreshInterval: { type: Number, default: 300 }, // seconds
    widgetLayout: [{ type: mongoose.Schema.Types.Mixed }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient user-specific queries
SettingsSchema.index({ userId: 1 });

module.exports = mongoose.model('Settings', SettingsSchema); 