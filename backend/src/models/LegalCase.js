const mongoose = require('mongoose');

const legalCaseSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    unique: true
  },
  dpdAtEntry: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'NOTICE_SENT', 'COURT_FILED', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],
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

legalCaseSchema.index({ loanId: 1 }, { unique: true });
legalCaseSchema.index({ status: 1 });

module.exports = mongoose.model('LegalCase', legalCaseSchema);
