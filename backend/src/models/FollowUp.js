const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  note: {
    type: String,
    required: true
  },
  nextFollowUpDate: Date
}, { timestamps: true });

FollowUpSchema.index({ loanId: 1 });
FollowUpSchema.index({ nextFollowUpDate: 1 });

module.exports = mongoose.model('FollowUp', FollowUpSchema);
