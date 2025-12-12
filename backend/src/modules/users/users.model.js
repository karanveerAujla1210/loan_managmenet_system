const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'agent', 'collector'], 
    default: 'agent' 
  },
  phone: { type: String, required: true },
  employeeId: { type: String, unique: true },
  department: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  permissions: [{
    module: String,
    actions: [String]
  }],
  profile: {
    avatar: String,
    address: String,
    dateOfJoining: Date,
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate employee ID
userSchema.pre('save', function(next) {
  if (!this.employeeId) {
    this.employeeId = `EMP${Date.now()}`;
  }
  next();
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);