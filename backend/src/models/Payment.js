const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  instalmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instalment',
    required: true
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    enum: ['UPI', 'CASH', 'IMPS', 'NEFT', 'RTGS'],
    required: true
  },
  reference: String,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  note: String
}, { timestamps: true });

// Indexes for audit trail
PaymentSchema.index({ paymentDate: 1 });
PaymentSchema.index({ loanId: 1 });
PaymentSchema.index({ reference: 1 }, { sparse: true });

module.exports = mongoose.model('Payment', PaymentSchema);
