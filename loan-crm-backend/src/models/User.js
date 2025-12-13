const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MANAGER', 'COLLECTOR', 'LEGAL', 'VIEWER'],
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      'CREATE_LOAN', 'UPDATE_LOAN', 'DELETE_LOAN', 'VIEW_LOAN',
      'CREATE_PAYMENT', 'UPDATE_PAYMENT', 'DELETE_PAYMENT', 'VIEW_PAYMENT',
      'CREATE_CUSTOMER', 'UPDATE_CUSTOMER', 'DELETE_CUSTOMER', 'VIEW_CUSTOMER',
      'ASSIGN_COLLECTOR', 'VIEW_REPORTS', 'MANAGE_USERS', 'LEGAL_ACTIONS'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  refreshToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);