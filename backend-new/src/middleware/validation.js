const { body, param, query, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Common validation rules
const commonValidations = {
  // ID validation
  mongoId: param('id').isMongoId().withMessage('Invalid ID format'),
  
  // Email validation
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  // Phone validation (Indian format)
  phone: body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  
  // Password validation
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Name validation
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  // Amount validation
  amount: body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  // Date validation
  date: body('date')
    .isISO8601()
    .withMessage('Please provide a valid date in ISO format'),
  
  // Pagination validation
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  // Sort validation
  sort: query('sort')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'email', 'amount', 'status'])
    .withMessage('Invalid sort field'),
  
  order: query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
};

// User validation rules
const userValidations = {
  register: [
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('First name must be between 2 and 30 characters')
      .matches(/^[a-zA-Z]+$/)
      .withMessage('First name can only contain letters'),
    
    body('lastName')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Last name must be between 2 and 30 characters')
      .matches(/^[a-zA-Z]+$/)
      .withMessage('Last name can only contain letters'),
    
    commonValidations.email,
    commonValidations.phone,
    commonValidations.password,
    
    body('role')
      .optional()
      .isIn(['admin', 'manager', 'collector', 'user'])
      .withMessage('Invalid role'),
    
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .custom((value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
          throw new Error('User must be at least 18 years old');
        }
        return true;
      })
  ],
  
  login: [
    commonValidations.email,
    body('password').notEmpty().withMessage('Password is required')
  ],
  
  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('First name must be between 2 and 30 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Last name must be between 2 and 30 characters'),
    
    body('phone')
      .optional()
      .isMobilePhone('en-IN')
      .withMessage('Please provide a valid Indian phone number')
  ],
  
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    commonValidations.password.withMessage('New password must meet security requirements')
  ]
};

// Customer validation rules
const customerValidations = {
  create: [
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('First name can only contain letters and spaces'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Last name can only contain letters and spaces'),
    
    commonValidations.phone,
    
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('dateOfBirth')
      .isISO8601()
      .withMessage('Please provide a valid date of birth')
      .custom((value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
          throw new Error('Customer must be at least 18 years old');
        }
        if (age > 80) {
          throw new Error('Customer must be under 80 years old');
        }
        return true;
      }),
    
    body('address.line1')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Address line 1 must be between 5 and 100 characters'),
    
    body('address.city')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('City can only contain letters and spaces'),
    
    body('address.state')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('State must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('State can only contain letters and spaces'),
    
    body('address.pincode')
      .isLength({ min: 6, max: 6 })
      .withMessage('Pincode must be 6 digits')
      .isNumeric()
      .withMessage('Pincode must contain only numbers'),
    
    body('kyc.aadhaar')
      .isLength({ min: 12, max: 12 })
      .withMessage('Aadhaar number must be 12 digits')
      .isNumeric()
      .withMessage('Aadhaar number must contain only numbers'),
    
    body('kyc.pan')
      .isLength({ min: 10, max: 10 })
      .withMessage('PAN must be 10 characters')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .withMessage('Invalid PAN format'),
    
    body('monthlyIncome')
      .isFloat({ min: 1000 })
      .withMessage('Monthly income must be at least ₹1,000'),
    
    body('employmentType')
      .isIn(['salaried', 'self-employed', 'business', 'retired', 'unemployed'])
      .withMessage('Invalid employment type')
  ],
  
  update: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('phone')
      .optional()
      .isMobilePhone('en-IN')
      .withMessage('Please provide a valid Indian phone number'),
    
    body('monthlyIncome')
      .optional()
      .isFloat({ min: 1000 })
      .withMessage('Monthly income must be at least ₹1,000')
  ]
};

// Loan validation rules
const loanValidations = {
  create: [
    body('customerId')
      .isMongoId()
      .withMessage('Invalid customer ID'),
    
    body('principal')
      .isFloat({ min: 10000, max: 1000000 })
      .withMessage('Loan amount must be between ₹10,000 and ₹10,00,000'),
    
    body('interestRate')
      .optional()
      .isFloat({ min: 1, max: 50 })
      .withMessage('Interest rate must be between 1% and 50%'),
    
    body('tenure')
      .isInt({ min: 1, max: 60 })
      .withMessage('Loan tenure must be between 1 and 60 months'),
    
    body('purpose')
      .isIn(['business', 'personal', 'education', 'medical', 'home-improvement', 'debt-consolidation'])
      .withMessage('Invalid loan purpose'),
    
    body('disbursementDate')
      .isISO8601()
      .withMessage('Please provide a valid disbursement date')
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        if (date < today) {
          throw new Error('Disbursement date cannot be in the past');
        }
        return true;
      })
  ],
  
  approve: [
    commonValidations.mongoId,
    body('approvedAmount')
      .isFloat({ min: 1000 })
      .withMessage('Approved amount must be at least ₹1,000'),
    
    body('approvedInterestRate')
      .isFloat({ min: 1, max: 50 })
      .withMessage('Approved interest rate must be between 1% and 50%'),
    
    body('approvedTenure')
      .isInt({ min: 1, max: 60 })
      .withMessage('Approved tenure must be between 1 and 60 months'),
    
    body('remarks')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Remarks cannot exceed 500 characters')
  ],
  
  reject: [
    commonValidations.mongoId,
    body('reason')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Rejection reason must be between 10 and 500 characters')
  ]
};

// Payment validation rules
const paymentValidations = {
  create: [
    body('loanId')
      .isMongoId()
      .withMessage('Invalid loan ID'),
    
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Payment amount must be at least ₹1'),
    
    body('paymentMethod')
      .isIn(['cash', 'cheque', 'upi', 'neft', 'rtgs', 'imps', 'card'])
      .withMessage('Invalid payment method'),
    
    body('paymentDate')
      .isISO8601()
      .withMessage('Please provide a valid payment date')
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        if (date > today) {
          throw new Error('Payment date cannot be in the future');
        }
        if (date < thirtyDaysAgo) {
          throw new Error('Payment date cannot be more than 30 days old');
        }
        return true;
      }),
    
    body('transactionReference')
      .optional()
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('Transaction reference must be between 5 and 50 characters'),
    
    body('remarks')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Remarks cannot exceed 200 characters')
  ],
  
  reverse: [
    commonValidations.mongoId,
    body('reason')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Reversal reason must be between 10 and 500 characters')
  ]
};

// Collection validation rules
const collectionValidations = {
  create: [
    body('loanId')
      .isMongoId()
      .withMessage('Invalid loan ID'),
    
    body('collectorId')
      .isMongoId()
      .withMessage('Invalid collector ID'),
    
    body('followUpDate')
      .isISO8601()
      .withMessage('Please provide a valid follow-up date')
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        if (date < today) {
          throw new Error('Follow-up date cannot be in the past');
        }
        return true;
      }),
    
    body('contactMethod')
      .isIn(['phone', 'sms', 'email', 'visit', 'letter'])
      .withMessage('Invalid contact method'),
    
    body('status')
      .isIn(['promised', 'not-reachable', 'refused', 'partial-payment', 'full-payment', 'rescheduled'])
      .withMessage('Invalid collection status'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ]
};

// File upload validation
const fileValidations = {
  upload: [
    body('documentType')
      .isIn(['aadhaar', 'pan', 'bank-statement', 'salary-slip', 'business-proof', 'address-proof', 'photo'])
      .withMessage('Invalid document type'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters')
  ]
};

// Search validation
const searchValidations = {
  search: [
    query('q')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search query must be between 2 and 100 characters'),
    
    query('type')
      .optional()
      .isIn(['customers', 'loans', 'payments', 'collections'])
      .withMessage('Invalid search type'),
    
    commonValidations.page,
    commonValidations.limit
  ]
};

// Report validation
const reportValidations = {
  generate: [
    query('startDate')
      .isISO8601()
      .withMessage('Please provide a valid start date'),
    
    query('endDate')
      .isISO8601()
      .withMessage('Please provide a valid end date')
      .custom((value, { req }) => {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(value);
        
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
        
        const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
        if (daysDiff > 365) {
          throw new Error('Date range cannot exceed 365 days');
        }
        
        return true;
      }),
    
    query('type')
      .isIn(['loan-summary', 'collection-report', 'payment-report', 'dpd-report', 'portfolio-report'])
      .withMessage('Invalid report type'),
    
    query('format')
      .optional()
      .isIn(['pdf', 'excel', 'csv'])
      .withMessage('Invalid report format')
  ]
};

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    throw new ApiError('Validation failed', 400, formattedErrors);
  }
  
  next();
};

// Custom validation functions
const customValidations = {
  // Check if customer exists
  customerExists: async (customerId) => {
    const Customer = require('../modules/customers/customer.model');
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return true;
  },
  
  // Check if loan exists
  loanExists: async (loanId) => {
    const Loan = require('../modules/loans/loan.model');
    const loan = await Loan.findById(loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }
    return true;
  },
  
  // Check if user has permission
  hasPermission: (permission) => {
    return (req, res, next) => {
      if (!req.user.permissions.includes(permission)) {
        throw new ApiError('Insufficient permissions', 403);
      }
      next();
    };
  },
  
  // Validate business rules
  validateBusinessRules: {
    loanAmount: (amount, customerIncome) => {
      const maxLoanAmount = customerIncome * 10; // 10x monthly income
      if (amount > maxLoanAmount) {
        throw new Error(`Loan amount cannot exceed ${maxLoanAmount} (10x monthly income)`);
      }
      return true;
    },
    
    paymentAmount: (amount, outstandingAmount) => {
      if (amount > outstandingAmount) {
        throw new Error('Payment amount cannot exceed outstanding amount');
      }
      return true;
    }
  }
};

module.exports = {
  commonValidations,
  userValidations,
  customerValidations,
  loanValidations,
  paymentValidations,
  collectionValidations,
  fileValidations,
  searchValidations,
  reportValidations,
  handleValidationErrors,
  customValidations
};