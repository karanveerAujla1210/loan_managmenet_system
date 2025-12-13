const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scheduleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  loanId: {
    type: String,
    ref: 'Loan',
    required: true
  },
  installmentNumber: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  principalAmount: {
    type: Number,
    required: true
  },
  interestAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  principalPaid: {
    type: Number,
    default: 0
  },
  interestPaid: {
    type: Number,
    default: 0
  },
  penaltyPaid: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  principalOutstanding: {
    type: Number,
    default: function() { return this.principalAmount; }
  },
  interestOutstanding: {
    type: Number,
    default: function() { return this.interestAmount; }
  },
  penaltyOutstanding: {
    type: Number,
    default: 0
  },
  totalOutstanding: {
    type: Number,
    default: function() { return this.totalAmount; }
  },
  status: {
    type: String,
    enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  },
  dpd: {
    type: Number,
    default: 0
  },
  lastPaymentDate: Date,
  isRestructured: {
    type: Boolean,
    default: false
  },
  restructureReason: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

scheduleSchema.index({ loanId: 1, installmentNumber: 1 }, { unique: true });
scheduleSchema.index({ loanId: 1, dueDate: 1 });
scheduleSchema.index({ dueDate: 1 });
scheduleSchema.index({ status: 1 });
scheduleSchema.index({ dpd: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);