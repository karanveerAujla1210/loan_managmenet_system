const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  borrowerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanProduct',
    required: true,
    immutable: true
  },
  loanAmount: {
    type: Number,
    required: true,
    immutable: true
  },
  totalPayable: {
    type: Number,
    required: true,
    immutable: true
  },
  disbursementDate: {
    type: Date,
    required: true,
    immutable: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED', 'WRITTEN_OFF'],
    default: 'ACTIVE'
  },
  outstandingAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Indexes for performance
LoanSchema.index({ assignedTo: 1, status: 1 });
LoanSchema.index({ status: 1 });
LoanSchema.index({ disbursementDate: 1 });

module.exports = mongoose.model('Loan', LoanSchema);
