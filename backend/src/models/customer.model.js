const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { 
    type: String, 
    required: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid pincode']
  }
}, { _id: false });

const KycSchema = new mongoose.Schema({
  aadhaar: { 
    type: String, 
    sparse: true,
    match: [/^[0-9]{12}$/, 'Please enter a valid Aadhaar number']
  },
  pan: { 
    type: String, 
    sparse: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  isVerified: { type: Boolean, default: false }
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  lastName: { 
    type: String, 
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone is required'],
    unique: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  email: { 
    type: String, 
    sparse: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  dob: { 
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(dob) {
        const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return age >= 18;
      },
      message: 'Customer must be at least 18 years old'
    }
  },
  address: { type: AddressSchema, required: true },
  kyc: { type: KycSchema, required: true },
  creditScore: { type: Number, min: 300, max: 900 },
  monthlyIncome: { type: Number, min: 0 },
  employmentType: { 
    type: String, 
    enum: ['salaried', 'self_employed', 'business', 'retired', 'other']
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: Object, default: {} }
}, {
  timestamps: true
});

// Indexes
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ 'kyc.aadhaar': 1 }, { sparse: true });
CustomerSchema.index({ 'kyc.pan': 1 }, { sparse: true });
CustomerSchema.index({ createdAt: -1 });

// Virtual for full name
CustomerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

// Virtual populate for loans
CustomerSchema.virtual('loans', {
  ref: 'Loan',
  localField: '_id',
  foreignField: 'customerId'
});

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);