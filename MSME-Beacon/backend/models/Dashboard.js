const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
DashboardSchema.index({ userId: 1 });

module.exports = mongoose.model('Dashboard', DashboardSchema); 