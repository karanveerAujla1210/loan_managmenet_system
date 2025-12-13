const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const collectionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  loanId: {
    type: String,
    ref: 'Loan',
    required: true
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  collectorId: {
    type: String,
    ref: 'User',
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  visitType: {
    type: String,
    enum: ['FIELD_VISIT', 'PHONE_CALL', 'EMAIL', 'SMS', 'LEGAL_NOTICE'],
    required: true
  },
  contactResult: {
    type: String,
    enum: ['CONTACTED', 'NOT_CONTACTED', 'WRONG_NUMBER', 'SWITCHED_OFF', 'NO_RESPONSE'],
    required: true
  },
  customerResponse: {
    type: String,
    enum: ['COOPERATIVE', 'AGGRESSIVE', 'PROMISED_PAYMENT', 'DISPUTED', 'UNAVAILABLE'],
    required: true
  },
  promiseDate: Date,
  promiseAmount: Number,
  actualPayment: Number,
  remarks: {
    type: String,
    maxlength: 500
  },
  nextFollowUpDate: Date,
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'ESCALATED'],
    default: 'OPEN'
  },
  escalationReason: String,
  escalatedTo: {
    type: String,
    ref: 'User'
  },
  escalationDate: Date,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

collectionSchema.index({ loanId: 1, visitDate: -1 });
collectionSchema.index({ customerId: 1 });
collectionSchema.index({ collectorId: 1, visitDate: -1 });
collectionSchema.index({ nextFollowUpDate: 1 });
collectionSchema.index({ status: 1 });
collectionSchema.index({ priority: 1 });

module.exports = mongoose.model('Collection', collectionSchema);