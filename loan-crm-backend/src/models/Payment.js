const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  loanId: {
    type: String,
    ref: 'Loan',
    required: true
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMode: {
    type: String,
    enum: ['CASH', 'CHEQUE', 'NEFT', 'RTGS', 'UPI', 'CARD', 'ONLINE'],
    required: true
  },
  referenceNumber: String,
  bankName: String,
  chequeNumber: String,
  chequeDate: Date,
  allocation: {
    principal: {
      type: Number,
      default: 0
    },
    interest: {
      type: Number,
      default: 0
    },
    penalty: {
      type: Number,
      default: 0
    },
    charges: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['PENDING', 'CLEARED', 'BOUNCED', 'CANCELLED'],
    default: 'CLEARED'
  },
  bounceReason: String,
  bounceDate: Date,
  bounceCharges: {
    type: Number,
    default: 0
  },
  collectedBy: {
    type: String,
    ref: 'User'
  },
  receiptNumber: String,
  isReversed: {
    type: Boolean,
    default: false
  },
  reversalReason: String,
  reversalDate: Date,
  reversedBy: {
    type: String,
    ref: 'User'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

paymentSchema.index({ loanId: 1, paymentDate: -1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ collectedBy: 1 });
paymentSchema.index({ referenceNumber: 1 });

module.exports = mongoose.model('Payment', paymentSchema);