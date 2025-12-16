const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  loanId: { type: String, unique: true, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  
  principal: { type: Number, required: true },
  
  pfRate: { type: Number, default: 0.10 },
  pfAmount: Number,
  
  gstRate: { type: Number, default: 0.18 },
  gstAmount: Number,
  
  totalPF: Number,
  netDisbursement: Number,
  
  roiAnnual: { type: Number, default: 0.20 },
  interestAmount: Number,
  totalRepayable: Number,
  
  installmentFrequency: { type: String, default: "weekly" },
  installmentGapDays: { type: Number, default: 7 },
  installmentCount: { type: Number, default: 14 },
  weeklyEmi: Number,
  
  disbursementDate: { type: Date, required: true },
  branch: String,
  
  status: { type: String, default: "active", enum: ["active", "closed", "defaulted"] },
  dpd: { type: Number, default: 0 },
  bucket: { type: String, default: "current" },
  
  // Promise to Pay tracking
  promiseToPayDate: { type: Date, default: null },
  promiseStatus: { type: String, default: "none", enum: ["none", "pending", "honored", "broken"] },
  promiseAmount: { type: Number, default: null },
  promiseHistory: [{
    promiseDate: Date,
    promiseAmount: Number,
    dueDate: Date,
    status: String, // pending, honored, broken
    remarks: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recordedAt: Date,
  }],
  
  // Collection tracking
  assignedCollectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collectorName: String,
  lastPaymentDate: Date,
  lastRemark: String,
  callOutcome: String,
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);