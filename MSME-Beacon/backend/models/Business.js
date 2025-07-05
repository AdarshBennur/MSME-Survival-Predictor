const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthlySales: {
    type: Number,
    required: [true, 'Please add monthly sales']
  },
  stockValue: {
    type: Number,
    required: [true, 'Please add stock value']
  },
  customerCount: {
    type: Number,
    required: [true, 'Please add customer count']
  },
  expenses: {
    type: Number,
    required: [true, 'Please add monthly expenses']
  },
  profit: {
    type: Number,
    required: [true, 'Please add monthly profit']
  },
  employeeCount: {
    type: Number,
    required: [true, 'Please add employee count']
  },
  avgTransactionValue: {
    type: Number
  },
  returnRate: {
    type: Number
  },
  marketingSpend: {
    type: Number
  },
  // Additional fields for more comprehensive analysis
  debtToEquityRatio: {
    type: Number
  },
  customerRetentionRate: {
    type: Number
  },
  inventoryTurnoverRate: {
    type: Number
  },
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
BusinessSchema.index({ user: 1, year: 1, month: 1 });

module.exports = mongoose.model('Business', BusinessSchema); 