const mongoose = require('mongoose');

const RiskFactorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  impact: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const RiskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  factors: [RiskFactorSchema],
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by user, year, and month
RiskSchema.index({ user: 1, year: 1, month: 1 });

// Index for efficient querying by business
RiskSchema.index({ business: 1 });

module.exports = mongoose.model('Risk', RiskSchema); 