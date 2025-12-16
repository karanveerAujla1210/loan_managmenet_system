const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
    default: 'OPEN'
  },
  dpdFrozen: {
    type: Boolean,
    default: true
  },
  frozenDPD: Number,
  resolution: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date
}, { timestamps: true });

disputeSchema.index({ loanId: 1 });
disputeSchema.index({ status: 1 });

module.exports = mongoose.model('Dispute', disputeSchema);
