const mongoose = require('mongoose');

const InstalmentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  instalmentNo: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  dueAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['DUE', 'PARTIAL', 'PAID', 'OVERDUE'],
    default: 'DUE'
  },
  paidOn: Date
}, { timestamps: true });

// Unique constraint on loanId + instalmentNo
InstalmentSchema.index({ loanId: 1, instalmentNo: 1 }, { unique: true });
InstalmentSchema.index({ dueDate: 1, status: 1 });
InstalmentSchema.index({ loanId: 1, status: 1 });

module.exports = mongoose.model('Instalment', InstalmentSchema);
