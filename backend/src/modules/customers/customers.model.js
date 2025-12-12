const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  dateOfBirth: Date,
  aadharNumber: String,
  panNumber: String,
  employmentInfo: {
    employer: String,
    position: String,
    monthlyIncome: Number,
    employmentLength: Number,
    workAddress: String
  },
  creditScore: Number,
  kyc: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String
  },
  documents: [{
    type: { type: String, enum: ['aadhar', 'pan', 'salary_slip', 'bank_statement', 'photo'], required: true },
    fileName: String,
    filePath: String,
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  references: [{
    name: String,
    phone: String,
    relationship: String,
    address: String
  }],
  status: { type: String, enum: ['active', 'inactive', 'blacklisted'], default: 'active' }
}, { timestamps: true });

// Indexes for better performance
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ 'kyc.status': 1 });

module.exports = mongoose.model('Customer', customerSchema);