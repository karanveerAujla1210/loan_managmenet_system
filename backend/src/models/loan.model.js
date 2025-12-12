const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  sequence: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  principalDue: { type: Number, required: true },
  interestDue: { type: Number, required: true },
  penaltyDue: { type: Number, default: 0 },
  paidPrincipal: { type: Number, default: 0 },
  paidInterest: { type: Number, default: 0 },
  paidPenalty: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'partially_paid', 'paid', 'overdue'], 
    default: 'pending' 
  }
}, { _id: false });

const LoanSchema = new mongoose.Schema({
  loanId: { 
    type: String, 
    unique: true,
    index: true
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true,
    index: true
  },
  productCode: { 
    type: String, 
    required: true,
    enum: ['personal', 'business', 'home', 'vehicle', 'education']
  },
  principal: { 
    type: Number, 
    required: true,
    min: [1000, 'Minimum loan amount is ₹1,000'],
    max: [10000000, 'Maximum loan amount is ₹1,00,00,000']
  },
  annualInterestRate: { 
    type: Number, 
    required: true,
    min: [0, 'Interest rate cannot be negative'],
    max: [50, 'Interest rate cannot exceed 50%']
  },
  interestType: { 
    type: String, 
    enum: ['reducing', 'flat', 'bullet'], 
    default: 'reducing' 
  },
  termMonths: { 
    type: Number, 
    required: true,
    min: [1, 'Minimum term is 1 month'],
    max: [360, 'Maximum term is 360 months']
  },
  emiAmount: { type: Number },
  totalAmount: { type: Number },
  disbursementDate: Date,
  maturityDate: Date,
  status: { 
    type: String, 
    enum: ['applied', 'under_review', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'npa'], 
    default: 'applied' 
  },
  schedule: [InstallmentSchema],
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  disbursedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dpd: { type: Number, default: 0 }, // Days Past Due
  bucket: { 
    type: String, 
    enum: ['current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'], 
    default: 'current' 
  },
  rejectionReason: String,
  notes: [{ 
    text: String, 
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  metadata: { type: Object, default: {} }
}, {
  timestamps: true
});

// Indexes
LoanSchema.index({ loanId: 1 });
LoanSchema.index({ customerId: 1 });
LoanSchema.index({ status: 1 });
LoanSchema.index({ disbursementDate: 1 });
LoanSchema.index({ assignedAgent: 1 });

// Pre-save middleware to generate loanId
LoanSchema.pre('save', async function(next) {
  if (!this.loanId) {
    const count = await this.constructor.countDocuments();
    this.loanId = `LN${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for outstanding amount
LoanSchema.virtual('outstandingAmount').get(function() {
  if (!this.schedule || this.schedule.length === 0) return 0;
  
  return this.schedule.reduce((total, inst) => {
    const due = inst.principalDue + inst.interestDue + inst.penaltyDue;
    const paid = inst.paidPrincipal + inst.paidInterest + inst.paidPenalty;
    return total + (due - paid);
  }, 0);
});

// Instance method to calculate next EMI due
LoanSchema.methods.getNextEMIDue = function() {
  if (!this.schedule || this.schedule.length === 0) return null;
  
  const nextEMI = this.schedule.find(inst => 
    inst.status === 'pending' || inst.status === 'partially_paid' || inst.status === 'overdue'
  );
  
  return nextEMI || null;
};

module.exports = mongoose.model('Loan', LoanSchema);