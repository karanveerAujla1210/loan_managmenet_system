const mongoose = require('mongoose');

const importedDisbursementSchema = new mongoose.Schema({
  loanId: { type: String, required: true },
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  dateOfDisbursement: { type: Date, required: true },
  branch: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImportedDisbursement', importedDisbursementSchema);