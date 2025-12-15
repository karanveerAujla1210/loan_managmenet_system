const mongoose = require('mongoose');

const bankReconciliationSchema = new mongoose.Schema(
  {
    reconciliationDate: {
      type: Date,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    bankStatementFile: String,
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RECONCILED', 'LOCKED'],
      default: 'PENDING',
    },
    transactions: [
      {
        bankUTR: String,
        bankAmount: Number,
        bankDate: Date,
        bankMode: String,
        crmPaymentId: mongoose.Schema.Types.ObjectId,
        crmAmount: Number,
        crmDate: Date,
        matchStatus: {
          type: String,
          enum: ['MATCHED', 'UNLINKED_PAYMENT', 'PENDING_CONFIRMATION', 'AMOUNT_MISMATCH', 'FRAUD_ALERT'],
          default: 'PENDING_CONFIRMATION',
        },
        resolution: {
          action: String,
          linkedLoanId: mongoose.Schema.Types.ObjectId,
          resolvedBy: mongoose.Schema.Types.ObjectId,
          resolvedAt: Date,
          note: String,
        },
      },
    ],
    summary: {
      totalBankAmount: Number,
      totalCRMAmount: Number,
      matchedCount: Number,
      unmatchedCount: Number,
      discrepancyAmount: Number,
    },
    lockedAt: Date,
    lockedBy: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('BankReconciliation', bankReconciliationSchema);
