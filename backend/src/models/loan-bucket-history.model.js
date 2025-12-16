const mongoose = require('mongoose');

const LoanBucketHistorySchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  previousBucket: String,
  currentBucket: String,
  dpd: Number,
  changedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: false });

LoanBucketHistorySchema.index({ loanId: 1, changedAt: -1 });

module.exports = mongoose.model('LoanBucketHistory', LoanBucketHistorySchema);
