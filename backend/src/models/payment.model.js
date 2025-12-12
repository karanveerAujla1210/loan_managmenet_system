const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: { 
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
  installmentSequence: Number,
  amount: { 
    type: Number, 
    required: true,
    min: [1, 'Payment amount must be positive']
  },
  method: { 
    type: String, 
    enum: ['razorpay', 'stripe', 'bank_transfer', 'cheque', 'cash', 'upi'], 
    required: true
  },
  status: { 
    type: String, 
    enum: ['initiated', 'pending', 'success', 'failed', 'cancelled'], 
    default: 'initiated' 
  },
  txnRef: { type: String, index: true },
  gatewayWebhookId: { 
    type: String, 
    index: true, 
    sparse: true 
  }, // For idempotency
  gatewayResponse: Object,
  allocation: {
    principal: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 }
  },
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  failureReason: String,
  metadata: { type: Object, default: {} }
}, {
  timestamps: true
});

// Indexes
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ loanId: 1, createdAt: -1 });
PaymentSchema.index({ gatewayWebhookId: 1 }, { sparse: true });
PaymentSchema.index({ status: 1 });

// Pre-save middleware to generate paymentId
PaymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const count = await this.constructor.countDocuments();
    this.paymentId = `PAY${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);