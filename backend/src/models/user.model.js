const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone is required'],
    unique: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'counselor', 'collector', 'customer'], 
    default: 'customer' 
  },
  isActive: { type: Boolean, default: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Instance methods
UserSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.generateJWT = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

UserSchema.methods.isAccountLocked = function() {
  return this.lockedUntil && this.lockedUntil > Date.now();
};

UserSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockedUntil && this.lockedUntil < Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockedUntil: 1 }
    });
  }
  
  const updates = { $inc: { failedLoginAttempts: 1 } };
  if (this.failedLoginAttempts + 1 >= 5) {
    updates.$set = { lockedUntil: Date.now() + 60 * 60 * 1000 }; // 1 hour
  }
  
  return this.updateOne(updates);
};

module.exports = mongoose.model('User', UserSchema);