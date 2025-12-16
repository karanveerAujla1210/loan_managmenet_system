const mongoose = require('mongoose');

const LoanProductSchema = new mongoose.Schema({
  productCode: {
    type: String,
    unique: true,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  tenureDays: {
    type: Number,
    required: true
  },
  totalInstalments: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    enum: ['WEEKLY', 'MONTHLY'],
    required: true
  },
  interestType: {
    type: String,
    enum: ['FLAT'],
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  penaltyType: {
    type: String,
    enum: ['PER_DAY', 'FLAT', 'NONE'],
    required: true
  },
  penaltyRate: {
    type: Number,
    default: 0
  },
  allowPartialPayment: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('LoanProduct', LoanProductSchema);
