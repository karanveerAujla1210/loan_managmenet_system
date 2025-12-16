const mongoose = require('mongoose');

const loanBucketHistorySchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  previousBucket: String,
  currentBucket: String,
  dpd: Number,
  changedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

loanBucketHistorySchema.index({ loanId: 1 });
loanBucketHistorySchema.index({ changedAt: 1 });

module.exports = mongoose.model('LoanBucketHistory', loanBucketHistorySchema);
