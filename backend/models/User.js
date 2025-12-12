const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: 'Name can only contain letters and spaces'
    }
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please add a valid email'],
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  address: {
    street: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, required: [true, 'State is required'] },
    zipCode: { 
      type: String, 
      required: [true, 'ZIP code is required'],
      validate: {
        validator: function(v) {
          return /^[0-9]{5,10}(?:-[0-9]{4})?$/.test(v);
        },
        message: 'Please enter a valid ZIP code'
      }
    },
    country: { 
      type: String, 
      required: [true, 'Country is required'],
      default: 'India'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth'],
    validate: {
      validator: function(dob) {
        const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return age >= 18;
      },
      message: 'User must be at least 18 years old'
    }
  },
  idProof: {
    type: String,
    required: [true, 'Please add ID proof'],
    enum: {
      values: ['aadhar', 'passport', 'driving_license', 'voter_id'],
      message: 'ID proof must be one of: aadhar, passport, driving_license, voter_id'
    }
  },
  idNumber: {
    type: String,
    required: [true, 'Please add ID number'],
    unique: true,
    index: true
  },
  idImage: {
    type: String,
    required: [true, 'Please upload ID image'],
    validate: {
      validator: function(v) {
        return /.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: 'ID image must be a valid image file (jpg, jpeg, png, webp)'
    }
  },
  profileImage: {
    type: String,
    default: 'default.jpg',
    validate: {
      validator: function(v) {
        return /.(jpg|jpeg|png|webp)$/i.test(v) || v === 'default.jpg';
      },
      message: 'Profile image must be a valid image file (jpg, jpeg, png, webp)'
    }
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'agent', 'admin'],
      message: 'Role is either: customer, agent, or admin'
    },
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  lastLogin: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lockUntil: Date
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ idNumber: 1 }, { unique: true });

// Document middleware: runs before .save() and .create()
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // 1 second in the past to ensure token is created after
  next();
});

// Query middleware
userSchema.pre(/^find/, function(next) {
  // This points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

// Instance methods - available on all documents
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate email verification token
userSchema.methods.createVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Check if account is locked
userSchema.methods.isAccountLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts and lock account if needed
userSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 60 * 60 * 1000 }; // Lock for 1 hour
  }
  
  return await this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Virtual populate
userSchema.virtual('loans', {
  ref: 'Loan',
  foreignField: 'user',
  localField: '_id'
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!enteredPassword || !this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
