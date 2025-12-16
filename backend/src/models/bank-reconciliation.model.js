const mongoose = require('mongoose');

const BankReconciliationSchema = new mongoose.Schema({
  statementDate: {
    type: Date,
    required: true,
    index: true
  },
  transactionDate: Date,
  amount: {
    type: Number,
    required: true
  },
  utr: {
    type: String,
    sparse: true,
    index: true
  },
  narration: String,
  matchedPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    sparse: true
  },
  matchedLoanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    sparse: true
  },
  status: {
    type: String,
    enum: ['UNMATCHED', 'MATCHED', 'REVIEW', 'RECONCILED', 'LOCKED'],
    default: 'UNMATCHED',
    index: true
  },
  matchType: {
    type: String,
    enum: ['EXACT', 'SEMI', 'LOOSE'],
    sparse: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

BankReconciliationSchema.index({ statementDate: 1, status: 1 });
BankReconciliationSchema.index({ utr: 1 }, { sparse: true });

module.exports = mongoose.model('BankReconciliation', BankReconciliationSchema);
