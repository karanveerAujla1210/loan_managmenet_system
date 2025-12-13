const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: String,
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  
  externalLoanId: String, // Excel ID
  
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  method: String,
  txnRef: String,
  remarks: String,
  
  allocation: {
    principal: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
    excess: { type: Number, default: 0 }
  },
  
  status: { type: String, default: "success", enum: ["success", "failed", "pending"] }
}, { timestamps: true });

PaymentSchema.index({ loanId: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);