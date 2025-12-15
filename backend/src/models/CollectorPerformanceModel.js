const mongoose = require('mongoose');

const collectorPerformanceSchema = new mongoose.Schema(
  {
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    metrics: {
      casesAssigned: Number,
      casesWorked: Number,
      callsMade: Number,
      paymentsReceived: Number,
      amountCollected: Number,
      promisesSet: Number,
      promisesFulfilled: Number,
      promisesBroken: Number,
      casesMovedToLegal: Number,
      casesImproved: Number, // Moved to better bucket
      casesDeteriorated: Number, // Moved to worse bucket
    },
    kpis: {
      collectionOnDueDate: Number, // %
      earlyRecoveryRate: Number, // % of 1-7 DPD
      brokenPromiseRate: Number, // %
      callToPaymentRatio: Number,
      bucketMovementScore: Number, // Positive = improving
    },
    incentiveEligible: {
      type: Boolean,
      default: true,
    },
    incentiveAmount: Number,
    warnings: [String], // Performance warnings
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

module.exports = mongoose.model('CollectorPerformance', collectorPerformanceSchema);
