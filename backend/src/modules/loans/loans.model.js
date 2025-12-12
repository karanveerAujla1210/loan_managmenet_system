const mongoose = require('mongoose');
const { calculateDPD, calculateBucket, checkBrokenPTP, calculateEscalation, updateLoanStatus, recalcOutstanding, getNextDueDate } = require('../../utils/loanHelpers');

const installmentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  principalAmount: { type: Number, required: true },
  interestAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue'], default: 'pending' },
  paidDate: Date,
  daysOverdue: { type: Number, default: 0 }
});

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  type: { type: String, enum: ['payment', 'adjustment', 'reversal'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ['cash', 'bank_transfer', 'cheque', 'online', 'upi'], default: 'cash' },
  reference: String,
  referenceNumber: String,
  paymentMode: String,
  remarks: String,
  allocatedTo: [{
    installmentNumber: Number,
    amount: Number
  }],
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
});

const eventSchema = new mongoose.Schema({
  type: { type: String, enum: ['payment', 'ptp', 'status', 'note', 'overdue', 'created'], required: true },
  timestamp: { type: Date, default: Date.now },
  payload: mongoose.Schema.Types.Mixed,
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String
});

const loanSchema = new mongoose.Schema({
  loanId: { type: String, required: true, unique: true },
  uniqueId: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  branch: String,
  loanType: { type: String, enum: ['Fresh', 'Renewal', 'Top-up'], default: 'Fresh' },
  principalAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  numberOfInstallments: { type: Number, default: 14 },
  frequency: { type: String, enum: ['weekly', 'monthly'], default: 'weekly' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  disbursement: {
    date: Date,
    processingFees: Number,
    gst: Number,
    netDisbursement: Number,
    utr: String,
    status: { type: String, enum: ['pending', 'disbursed'], default: 'pending' }
  },
  status: { type: String, enum: ['active', 'overdue', 'completed', 'defaulted', 'closed', 'critical', 'broken_ptp'], default: 'active' },
  outstandingAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dpd: { type: Number, default: 0 },
  nextDueDate: Date,
  collectionBucket: { type: String, enum: ['Current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'], default: 'Current' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  escalationLevel: { type: Number, default: 0 }, // 0=none, 1=field, 2=supervisor, 3=legal
  ptp: {
    active: { type: Boolean, default: false },
    promiseDate: Date,
    amount: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
  },
  schedule: [installmentSchema],
  transactions: [transactionSchema],
  events: [eventSchema],
  collectionNotes: [{
    note: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  promiseToPay: [{
    amount: Number,
    promiseDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'kept', 'broken'], default: 'pending' }
  }]
}, { timestamps: true });

// Update loan metrics
loanSchema.methods.updateMetrics = function() {
  this.dpd = calculateDPD(this);
  this.collectionBucket = calculateBucket(this.dpd);
  this.outstandingAmount = recalcOutstanding(this);
  this.nextDueDate = getNextDueDate(this);
  
  // Check broken PTP
  checkBrokenPTP(this);
  
  // Update escalation level
  const newEscalation = calculateEscalation(this.dpd);
  if (newEscalation > this.escalationLevel) {
    this.events.push({
      type: 'escalation',
      description: `Escalated from level ${this.escalationLevel} to ${newEscalation}`,
      payload: { from: this.escalationLevel, to: newEscalation }
    });
    this.escalationLevel = newEscalation;
  }
  
  this.status = updateLoanStatus(this);
  
  // Update installment overdue status
  const today = new Date();
  this.schedule.forEach(installment => {
    if (installment.remainingAmount > 0 && installment.dueDate < today) {
      installment.status = installment.paidAmount > 0 ? 'partial' : 'overdue';
      installment.daysOverdue = Math.floor((today - installment.dueDate) / (1000 * 60 * 60 * 24));
    }
  });
};

// Indexes for better performance
loanSchema.index({ loanId: 1 });
loanSchema.index({ customerId: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ 'schedule.dueDate': 1 });
loanSchema.index({ dpd: 1 });
loanSchema.index({ collectionBucket: 1 });
loanSchema.index({ agentId: 1 });
loanSchema.index({ escalationLevel: 1 });

module.exports = mongoose.model('Loan', loanSchema);