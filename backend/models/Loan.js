const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  installmentNumber: Number,
  dueDate: Date,
  principalAmount: Number,
  interestAmount: Number,
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['due', 'partial', 'paid', 'overdue'], default: 'due' },
  paidDate: Date
});

const loanSchema = new mongoose.Schema({
  loanId: { type: String, unique: true, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  principalAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true }, // in months
  totalAmount: Number,
  emiAmount: Number,
  disbursedDate: Date,
  status: { type: String, enum: ['pending', 'approved', 'disbursed', 'active', 'closed', 'npa'], default: 'pending' },
  installments: [installmentSchema],
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dpd: { type: Number, default: 0 }, // Days Past Due
  bucket: { type: String, enum: ['current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'], default: 'current' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);