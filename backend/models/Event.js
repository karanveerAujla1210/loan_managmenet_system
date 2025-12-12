const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  type: { 
    type: String, 
    enum: ['payment', 'ptp', 'broken_ptp', 'status_update', 'escalation', 'note', 'assign_agent'],
    required: true 
  },
  description: String,
  amount: Number,
  ptpDate: Date,
  ptpAmount: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);