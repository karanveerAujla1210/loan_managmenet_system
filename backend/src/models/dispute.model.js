const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  installmentNo: Number,
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
    default: 'OPEN',
    index: true
  },
  dpdFrozen: {
    type: Boolean,
    default: true
  },
  frozenDPD: Number,
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: String,
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

DisputeSchema.index({ loanId: 1 });
DisputeSchema.index({ status: 1 });

module.exports = mongoose.model('Dispute', DisputeSchema);
