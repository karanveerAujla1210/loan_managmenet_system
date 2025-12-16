const mongoose = require('mongoose');

const collectorPerformanceSchema = new mongoose.Schema({
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week: {
    startDate: Date,
    endDate: Date
  },
  onTimeCollections: {
    collected: Number,
    total: Number,
    score: Number
  },
  earlyOverdueRecovery: {
    recovered: Number,
    total: Number,
    score: Number
  },
  promiseDiscipline: {
    broken: Number,
    total: Number,
    score: Number
  },
  bucketImprovement: {
    improved: Number,
    total: Number,
    score: Number
  },
  dataQuality: {
    issues: Number,
    score: Number
  },
  totalScore: Number,
  incentivePercentage: Number,
  disqualified: Boolean,
  disqualificationReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

collectorPerformanceSchema.index({ collectorId: 1, 'week.startDate': 1 });

module.exports = mongoose.model('CollectorPerformance', collectorPerformanceSchema);
