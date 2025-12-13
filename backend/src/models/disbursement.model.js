const mongoose = require('mongoose');

const DisbursementSchema = new mongoose.Schema({
  disbursementId: { 
    type: String, 
    unique: true,
    index: true
  },
  loanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Loan', 
    required: true,
    index: true
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: [1, 'Disbursement amount must be positive']
  },
  method: { 
    type: String, 
    enum: ['bank_transfer', 'cheque', 'cash', 'upi'], 
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  txnRef: { type: String, index: true },
  disbursedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  disbursedAt: Date,
  failureReason: String,
  metadata: { type: Object, default: {} }
}, {
  timestamps: true
});

// Indexes
DisbursementSchema.index({ disbursementId: 1 });
DisbursementSchema.index({ loanId: 1, createdAt: -1 });
DisbursementSchema.index({ status: 1 });

// Pre-save middleware to generate disbursementId
DisbursementSchema.pre('save', async function(next) {
  if (!this.disbursementId) {
    const count = await this.constructor.countDocuments();
    this.disbursementId = `DISB${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Disbursement', DisbursementSchema);