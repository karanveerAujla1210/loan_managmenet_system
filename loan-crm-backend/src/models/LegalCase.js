const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const legalCaseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  loanId: {
    type: String,
    ref: 'Loan',
    required: true
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  caseNumber: {
    type: String,
    unique: true,
    required: true
  },
  caseType: {
    type: String,
    enum: ['CIVIL', 'CRIMINAL', 'RECOVERY', 'SARFAESI'],
    required: true
  },
  courtName: {
    type: String,
    required: true
  },
  filingDate: {
    type: Date,
    required: true
  },
  claimAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true
  },
  lawyerName: String,
  lawyerContact: String,
  status: {
    type: String,
    enum: ['FILED', 'PENDING', 'HEARING', 'JUDGMENT', 'EXECUTION', 'SETTLED', 'DISMISSED'],
    default: 'FILED'
  },
  nextHearingDate: Date,
  lastHearingDate: Date,
  hearingRemarks: String,
  judgmentDate: Date,
  judgmentAmount: Number,
  recoveredAmount: {
    type: Number,
    default: 0
  },
  expenses: {
    courtFees: {
      type: Number,
      default: 0
    },
    lawyerFees: {
      type: Number,
      default: 0
    },
    otherExpenses: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedLegal: {
    type: String,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

legalCaseSchema.index({ loanId: 1 });
legalCaseSchema.index({ customerId: 1 });
legalCaseSchema.index({ caseNumber: 1 });
legalCaseSchema.index({ status: 1 });
legalCaseSchema.index({ nextHearingDate: 1 });
legalCaseSchema.index({ assignedLegal: 1 });

module.exports = mongoose.model('LegalCase', legalCaseSchema);