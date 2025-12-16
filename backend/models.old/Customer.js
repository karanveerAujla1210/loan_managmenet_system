const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  phone: { type: String, unique: true, required: true },
  email: String,
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String
  },
  kyc: {
    aadhaar: String,
    pan: String,
    isVerified: { type: Boolean, default: false }
  },
  creditScore: Number,
  monthlyIncome: Number,
  employmentType: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);