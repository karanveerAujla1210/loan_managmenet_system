const mongoose = require('mongoose');

const promiseToPaySchema = new mongoose.Schema(
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
    promiseDate: {
      type: Date,
      required: true,
    },
    expectedAmount: {
      type: Number,
      required: true,
    },
    remark: String,
    status: {
      type: String,
      enum: ['PENDING', 'FULFILLED', 'BROKEN', 'PARTIALLY_FULFILLED'],
      default: 'PENDING',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fulfillmentDetails: {
      paymentId: mongoose.Schema.Types.ObjectId,
      amountReceived: Number,
      fulfillmentDate: Date,
      mode: String,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: Date,
    brokenPromiseTracking: {
      isBroken: Boolean,
      brokenAt: Date,
      reason: String,
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

module.exports = mongoose.model('PromiseToPay', promiseToPaySchema);
