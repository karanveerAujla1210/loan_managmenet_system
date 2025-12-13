const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  loanId: {
    type: String,
    ref: 'Loan',
    required: true
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['DISBURSEMENT', 'PAYMENT', 'PENALTY', 'WAIVER', 'ADJUSTMENT', 'REVERSAL'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  referenceId: String, // Payment ID, Disbursement ID, etc.
  balanceBefore: {
    principal: Number,
    interest: Number,
    penalty: Number,
    total: Number
  },
  balanceAfter: {
    principal: Number,
    interest: Number,
    penalty: Number,
    total: Number
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'APPROVED'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

transactionSchema.index({ loanId: 1, transactionDate: -1 });
transactionSchema.index({ customerId: 1 });
transactionSchema.index({ transactionType: 1 });
transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);