const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  sequence: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  principalDue: {
    type: Number,
    required: true
  },
  interestDue: {
    type: Number,
    required: true
  },
  penaltyDue: {
    type: Number,
    default: 0
  },
  paidPrincipal: {
    type: Number,
    default: 0
  },
  paidInterest: {
    type: Number,
    default: 0
  },
  paidPenalty: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid', 'overdue'],
    default: 'pending',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

InstallmentSchema.index({ loanId: 1, sequence: 1 });
InstallmentSchema.index({ dueDate: 1 });
InstallmentSchema.index({ status: 1 });

module.exports = mongoose.model('Installment', InstallmentSchema);
