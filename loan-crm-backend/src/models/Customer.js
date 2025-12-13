const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const customerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/
  },
  email: {
    type: String,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  dob: Date,
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: /^\d{6}$/
    }
  },
  kyc: {
    aadhaar: {
      type: String,
      match: /^\d{12}$/
    },
    pan: {
      type: String,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    },
    documents: [{
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  creditScore: {
    type: Number,
    min: 300,
    max: 900
  },
  monthlyIncome: Number,
  employmentType: {
    type: String,
    enum: ['SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'OTHER']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ 'kyc.aadhaar': 1 });
customerSchema.index({ 'kyc.pan': 1 });
customerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Customer', customerSchema);