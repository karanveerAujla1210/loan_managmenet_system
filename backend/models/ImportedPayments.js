const mongoose = require('mongoose');

const importedPaymentSchema = new mongoose.Schema({
  LoanID: { type: String, required: true },
  Amount: { type: Number, required: true },
  PaymentDate: { type: Date, required: true },
  PaymentMode: { type: String, required: true },
  ReferenceNumber: { type: String },
  Remarks: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImportedPayment', importedPaymentSchema);