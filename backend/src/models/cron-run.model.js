const mongoose = require('mongoose');

const CronRunSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
    index: true
  },
  runDate: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    default: 'SUCCESS'
  },
  recordsProcessed: Number,
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: false });

CronRunSchema.index({ jobName: 1, runDate: -1 });

module.exports = mongoose.model('CronRun', CronRunSchema);
