const mongoose = require('mongoose');

const CollectorPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  weekStartDate: {
    type: Date,
    required: true,
    index: true
  },
  weekEndDate: Date,
  onTimeCollections: {
    count: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  earlyOverdueRecovery: {
    count: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  promiseDiscipline: {
    total: { type: Number, default: 0 },
    broken: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  bucketImprovement: {
    count: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  dataQuality: {
    score: { type: Number, default: 0 }
  },
  totalScore: {
    type: Number,
    default: 0
  },
  incentivePercentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'CALCULATED', 'APPROVED', 'PAID'],
    default: 'PENDING'
  },
  disqualified: {
    type: Boolean,
    default: false
  },
  disqualificationReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

CollectorPerformanceSchema.index({ userId: 1, weekStartDate: -1 });
CollectorPerformanceSchema.index({ weekStartDate: 1 });

module.exports = mongoose.model('CollectorPerformance', CollectorPerformanceSchema);
