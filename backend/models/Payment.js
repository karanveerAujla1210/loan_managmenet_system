const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true, required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['cash', 'cheque', 'online', 'upi'], required: true },
  reference: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' },
  allocations: [{
    installmentNumber: Number,
    principalPaid: Number,
    interestPaid: Number,
    totalPaid: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);