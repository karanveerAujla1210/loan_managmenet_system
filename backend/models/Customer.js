const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  kyc: {
    aadhar: String,
    pan: String,
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);