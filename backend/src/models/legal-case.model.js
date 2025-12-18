const mongoose = require('mongoose');

const LegalCaseSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  dpdAtEntry: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'SETTLED'],
    default: 'OPEN'
  }
}, { timestamps: true });

module.exports = mongoose.model('LegalCase', LegalCaseSchema);
