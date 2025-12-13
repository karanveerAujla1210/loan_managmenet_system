const mongoose = require('mongoose');
const BaseModel = require('../../core/BaseModel');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters'],
    match: [/^[a-zA-Z]+$/, 'First name can only contain letters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters'],
    match: [/^[a-zA-Z]+$/, 'Last name can only contain letters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  
  role: {
    type: String,
    enum: {
      values: ['admin', 'manager', 'team-lead', 'collector', 'user'],
      message: 'Role must be one of: admin, manager, team-lead, collector, user'
    },
    default: 'user'
  },
  
  permissions: [{
    type: String,
    enum: [
      // User management
      'users.create', 'users.read', 'users.update', 'users.delete',
      
      // Customer management
      'customers.create', 'customers.read', 'customers.update', 'customers.delete',
      
      // Loan management
      'loans.create', 'loans.read', 'loans.update', 'loans.delete',
      'loans.approve', 'loans.reject', 'loans.disburse',
      
      // Payment management
      'payments.create', 'payments.read', 'payments.update', 'payments.delete',
      'payments.reverse',
      
      // Collection management
      'collections.create', 'collections.read', 'collections.update', 'collections.delete',
      'collections.assign',
      
      // Reports
      'reports.view', 'reports.export',
      
      // System administration
      'system.admin', 'system.config'
    ]
  }],
  
  department: {
    type: String,
    enum: ['operations', 'collections', 'credit', 'risk', 'admin', 'it'],
    default: 'operations'
  },
  
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 18 && age <= 65;
      },
      message: 'Age must be between 18 and 65 years'
    }
  },
  
  address: {
    line1: {
      type: String,
      trim: true,
      maxlength: [100, 'Address line 1 cannot exceed 100 characters']
    },
    line2: {
      type: String,
      trim: true,
      maxlength: [100, 'Address line 2 cannot exceed 100 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    pincode: {
      type: String,
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  profile: {
    avatar: {
      type: String, // URL to profile image
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    experience: {
      type: Number, // Years of experience
      min: [0, 'Experience cannot be negative']
    },
    skills: [{
      type: String,
      trim: true
    }],
    certifications: [{
      name: String,
      issuedBy: String,
      issuedDate: Date,
      expiryDate: Date
    }]
  },
  
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },
  
  security: {
    lastLogin: {
      type: Date,
      default: null
    },
    lastLoginIP: {
      type: String,
      default: null
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpire: {
      type: Date,
      select: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    }
  },
  
  workSchedule: {
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workingHours: {
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      }
    },
    breakTime: {
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      }
    }
  },
  
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  team: {
    type: String,
    trim: true
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active'
  },
  
  joinDate: {
    type: Date,
    default: Date.now
  },
  
  terminationDate: {
    type: Date,
    default: null
  },
  
  // Performance metrics
  performance: {
    totalLoansProcessed: {
      type: Number,
      default: 0
    },
    totalCollectionsAmount: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number, // in minutes
      default: 0
    },
    customerSatisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    lastPerformanceReview: {
      type: Date,
      default: null
    }
  }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'security.lastLogin': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Instance methods
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.security.twoFactorSecret;
  delete user.security.resetPasswordToken;
  delete user.security.resetPasswordExpire;
  delete user.security.emailVerificationToken;
  return user;
};

userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

userSchema.methods.canAccessResource = function(resource, action) {
  const permission = `${resource}.${action}`;
  return this.hasPermission(permission);
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { 'security.loginAttempts': 1, 'security.lockUntil': 1 }
  });
};

userSchema.methods.updateLastLogin = function(ip) {
  return this.updateOne({
    $set: {
      'security.lastLogin': new Date(),
      'security.lastLoginIP': ip
    }
  });
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

userSchema.statics.findByDepartment = function(department) {
  return this.find({ department, isActive: true });
};

userSchema.statics.getActiveUsers = function() {
  return this.find({ status: 'active', isActive: true });
};

userSchema.statics.getUserStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Create the model using BaseModel
const baseModel = new BaseModel(userSchema, 'User');

// Add role-based permissions
const rolePermissions = {
  admin: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'customers.create', 'customers.read', 'customers.update', 'customers.delete',
    'loans.create', 'loans.read', 'loans.update', 'loans.delete', 'loans.approve', 'loans.reject', 'loans.disburse',
    'payments.create', 'payments.read', 'payments.update', 'payments.delete', 'payments.reverse',
    'collections.create', 'collections.read', 'collections.update', 'collections.delete', 'collections.assign',
    'reports.view', 'reports.export',
    'system.admin', 'system.config'
  ],
  manager: [
    'users.read', 'users.update',
    'customers.create', 'customers.read', 'customers.update',
    'loans.create', 'loans.read', 'loans.update', 'loans.approve', 'loans.reject',
    'payments.create', 'payments.read', 'payments.update',
    'collections.create', 'collections.read', 'collections.update', 'collections.assign',
    'reports.view', 'reports.export'
  ],
  'team-lead': [
    'customers.create', 'customers.read', 'customers.update',
    'loans.create', 'loans.read', 'loans.update',
    'payments.create', 'payments.read', 'payments.update',
    'collections.create', 'collections.read', 'collections.update',
    'reports.view'
  ],
  collector: [
    'customers.read',
    'loans.read',
    'payments.read',
    'collections.create', 'collections.read', 'collections.update'
  ],
  user: [
    'customers.read',
    'loans.read',
    'payments.read',
    'collections.read'
  ]
};

// Pre-save middleware to set permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    this.permissions = rolePermissions[this.role] || [];
  }
  next();
});

module.exports = baseModel.getModel();