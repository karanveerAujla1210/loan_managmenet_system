const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  // What action
  action: {
    type: String,
    required: true,
    enum: [
      'payment_recorded',
      'promise_made',
      'case_reassigned',
      'status_changed',
      'legal_escalated',
      'note_added',
      'call_outcome_logged',
      'penalty_applied',
      'case_closed'
    ]
  },

  // Who did it
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: String,
  userName: String,
  userRole: String,

  // What it affects
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  loanIdStr: String, // Store string version for easier search

  // Changes
  oldValue: mongoose.Schema.Types.Mixed, // Previous state
  newValue: mongoose.Schema.Types.Mixed, // New state
  changedFields: [String], // Array of field names that changed

  // Additional context
  remarks: String,
  amount: Number,
  ipAddress: String,
  userAgent: String,

  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
AuditLogSchema.index({ loanId: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ loanIdStr: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
