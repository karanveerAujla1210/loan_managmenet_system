const Joi = require('joi');
const { AppError } = require('../utils/errorHandler');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    next();
  };
};

// Common validation schemas
const schemas = {
  // Customer validation
  createCustomer: Joi.object({
    firstName: Joi.string().required().trim().max(50),
    lastName: Joi.string().trim().max(50),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    email: Joi.string().email().lowercase(),
    dob: Joi.date(),
    address: Joi.object({
      line1: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pincode: Joi.string().pattern(/^\d{6}$/)
    }),
    kyc: Joi.object({
      aadhaar: Joi.string().pattern(/^\d{12}$/),
      pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    }),
    creditScore: Joi.number().min(300).max(900),
    monthlyIncome: Joi.number().positive(),
    employmentType: Joi.string().valid('SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'OTHER')
  }),

  // Loan validation
  createLoan: Joi.object({
    customerId: Joi.string().required(),
    loanType: Joi.string().valid('PERSONAL', 'BUSINESS', 'VEHICLE', 'HOME', 'GOLD').required(),
    principalAmount: Joi.number().min(1000).required(),
    interestRate: Joi.number().min(0).max(50).required(),
    tenure: Joi.number().min(1).max(360).required(),
    tenureType: Joi.string().valid('MONTHS', 'DAYS').default('MONTHS'),
    disbursementDate: Joi.date().required()
  }),

  // Payment validation
  createPayment: Joi.object({
    loanId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    paymentDate: Joi.date().required(),
    paymentMode: Joi.string().valid('CASH', 'CHEQUE', 'NEFT', 'RTGS', 'UPI', 'CARD', 'ONLINE').required(),
    referenceNumber: Joi.string(),
    bankName: Joi.string(),
    chequeNumber: Joi.string(),
    chequeDate: Joi.date()
  }),

  // User validation
  createUser: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required().max(50),
    lastName: Joi.string().required().max(50),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    role: Joi.string().valid('ADMIN', 'MANAGER', 'COLLECTOR', 'LEGAL', 'VIEWER').required()
  }),

  // Login validation
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Collection validation
  createCollection: Joi.object({
    loanId: Joi.string().required(),
    visitType: Joi.string().valid('FIELD_VISIT', 'PHONE_CALL', 'EMAIL', 'SMS', 'LEGAL_NOTICE').required(),
    contactResult: Joi.string().valid('CONTACTED', 'NOT_CONTACTED', 'WRONG_NUMBER', 'SWITCHED_OFF', 'NO_RESPONSE').required(),
    customerResponse: Joi.string().valid('COOPERATIVE', 'AGGRESSIVE', 'PROMISED_PAYMENT', 'DISPUTED', 'UNAVAILABLE').required(),
    promiseDate: Joi.date(),
    promiseAmount: Joi.number().positive(),
    actualPayment: Joi.number().positive(),
    remarks: Joi.string().max(500),
    nextFollowUpDate: Joi.date(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM')
  }),

  // Legal case validation
  createLegalCase: Joi.object({
    loanId: Joi.string().required(),
    caseType: Joi.string().valid('CIVIL', 'CRIMINAL', 'RECOVERY', 'SARFAESI').required(),
    courtName: Joi.string().required(),
    filingDate: Joi.date().required(),
    claimAmount: Joi.number().positive().required(),
    lawyerName: Joi.string(),
    lawyerContact: Joi.string()
  })
};

module.exports = { validateRequest, schemas };