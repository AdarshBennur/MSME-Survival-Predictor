const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  risk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Risk',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actions: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Implemented', 'Dismissed'],
    default: 'Pending'
  },
  implementedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by user
RecommendationSchema.index({ user: 1 });

// Index for efficient querying by risk
RecommendationSchema.index({ risk: 1 });

module.exports = mongoose.model('Recommendation', RecommendationSchema); 