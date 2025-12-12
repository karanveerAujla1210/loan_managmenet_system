const mongoose = require('mongoose');

// Analytics snapshot model for caching
const analyticsSnapshotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  data: {
    portfolio: {
      totalDisbursed: Number,
      liveLoanCount: Number,
      outstandingPrincipal: Number,
      outstandingInterest: Number,
      par0: Number, par7: Number, par14: Number, par30: Number, par60: Number, par90: Number,
      currentBucketCounts: {
        Current: Number, X: Number, Y: Number, M1: Number, M2: Number, M3: Number, NPA: Number
      }
    },
    collections: {
      totalCollected: Number,
      collectionEfficiency: Number,
      recoveryRate: Number,
      todaysDue: Number,
      overdueCount: Number
    },
    buckets: [{
      bucket: String,
      count: Number,
      totalPrincipal: Number,
      averageDPD: Number
    }],
    rollRates: {
      matrix: [[Number]]
    }
  }
}, { timestamps: true });

// Legal case tracking
const legalCaseSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  caseNumber: String,
  stage: { type: String, enum: ['notice', 'summons', 'hearing', 'judgment', 'execution'], default: 'notice' },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filedDate: { type: Date, default: Date.now },
  nextHearingDate: Date,
  expectedRecovery: Number,
  actualRecovery: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'settled', 'dismissed', 'won', 'lost'], default: 'active' },
  notes: [{ text: String, date: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = {
  AnalyticsSnapshot: mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema),
  LegalCase: mongoose.model('LegalCase', legalCaseSchema)
};