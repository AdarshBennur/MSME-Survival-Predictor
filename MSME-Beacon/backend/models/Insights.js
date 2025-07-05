const mongoose = require('mongoose');

const InsightsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  dataVisualization: {
    charts: [{
      type: { type: String },
      data: { type: mongoose.Schema.Types.Mixed },
      title: { type: String }
    }],
    reports: [{
      title: { type: String },
      content: { type: String },
      generatedAt: { type: Date, default: Date.now }
    }]
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
InsightsSchema.index({ userId: 1 });

module.exports = mongoose.model('Insights', InsightsSchema); 