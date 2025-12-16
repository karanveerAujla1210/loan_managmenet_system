const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  installmentNo: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  emiAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  penalty: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE'],
    default: 'PENDING',
    index: true
  },
  paidDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

InstallmentSchema.index({ loanId: 1, installmentNo: 1 }, { unique: true });
InstallmentSchema.index({ loanId: 1, status: 1 });

module.exports = mongoose.model('Installment', InstallmentSchema);
