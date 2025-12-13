const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const loanSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  loanNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  loanType: {
    type: String,
    enum: ['PERSONAL', 'BUSINESS', 'VEHICLE', 'HOME', 'GOLD'],
    required: true
  },
  principalAmount: {
    type: Number,
    required: true,
    min: 1000
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  tenure: {
    type: Number,
    required: true,
    min: 1,
    max: 360
  },
  tenureType: {
    type: String,
    enum: ['MONTHS', 'DAYS'],
    default: 'MONTHS'
  },
  emi: {
    type: Number,
    required: true
  },
  disbursementDate: {
    type: Date,
    required: true
  },
  maturityDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'DISBURSED', 'ACTIVE', 'CLOSED', 'WRITTEN_OFF', 'CANCELLED'],
    default: 'PENDING'
  },
  currentDPD: {
    type: Number,
    default: 0
  },
  maxDPD: {
    type: Number,
    default: 0
  },
  totalOutstanding: {
    type: Number,
    default: 0
  },
  principalOutstanding: {
    type: Number,
    default: 0
  },
  interestOutstanding: {
    type: Number,
    default: 0
  },
  penaltyOutstanding: {
    type: Number,
    default: 0
  },
  lastPaymentDate: Date,
  nextDueDate: Date,
  collectionStatus: {
    type: String,
    enum: ['CURRENT', 'OVERDUE', 'LEGAL', 'WRITTEN_OFF'],
    default: 'CURRENT'
  },
  assignedCollector: {
    type: String,
    ref: 'User'
  },
  legalStatus: {
    isInLegal: {
      type: Boolean,
      default: false
    },
    legalDate: Date,
    legalAmount: Number,
    courtCase: String
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

loanSchema.index({ loanNumber: 1 });
loanSchema.index({ customerId: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ currentDPD: 1 });
loanSchema.index({ collectionStatus: 1 });
loanSchema.index({ assignedCollector: 1 });
loanSchema.index({ disbursementDate: -1 });
loanSchema.index({ nextDueDate: 1 });

module.exports = mongoose.model('Loan', loanSchema);