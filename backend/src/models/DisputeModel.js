const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    type: {
      type: String,
      enum: ['PAYMENT_DUPLICATE', 'AMOUNT_MISMATCH', 'PENALTY_INVALID', 'COLLECTOR_BEHAVIOR', 'LOAN_TERMS'],
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED'],
      default: 'OPEN',
    },
    description: String,
    attachments: [String], // URLs to proof documents
    raisedBy: {
      type: String,
      enum: ['COLLECTOR', 'CUSTOMER', 'SYSTEM'],
      required: true,
    },
    raisedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    loanStatus: {
      type: String,
      default: 'DISPUTE_PAYMENT_HOLD',
    },
    resolution: {
      action: {
        type: String,
        enum: ['ACCEPT_PAYMENT', 'REJECT_CLAIM', 'WAIVE_PENALTY', 'CORRECT_MAPPING'],
      },
      note: String,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      resolvedAt: Date,
    },
    auditLog: [
      {
        action: String,
        user: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        details: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', disputeSchema);
