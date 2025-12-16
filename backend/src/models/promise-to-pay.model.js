const mongoose = require('mongoose');

const PromiseToPaySchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  installmentNo: Number,
  promisedAmount: {
    type: Number,
    required: true
  },
  promisedDate: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'FULFILLED', 'BROKEN', 'CANCELLED'],
    default: 'PENDING',
    index: true
  },
  madeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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

PromiseToPaySchema.index({ loanId: 1, status: 1 });
PromiseToPaySchema.index({ promisedDate: 1 });

module.exports = mongoose.model('PromiseToPay', PromiseToPaySchema);
