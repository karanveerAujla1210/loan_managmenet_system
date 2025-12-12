const Joi = require('joi');

const customerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  address: Joi.object({
    street: Joi.string().max(200),
    city: Joi.string().max(50),
    state: Joi.string().max(50),
    zipCode: Joi.string().pattern(/^\d{6}$/),
    country: Joi.string().default('India')
  }),
  dateOfBirth: Joi.date().max('now'),
  aadharNumber: Joi.string().pattern(/^\d{12}$/),
  panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  employmentInfo: Joi.object({
    employer: Joi.string().max(100),
    position: Joi.string().max(100),
    monthlyIncome: Joi.number().positive(),
    employmentLength: Joi.number().positive(),
    workAddress: Joi.string().max(200)
  }),
  creditScore: Joi.number().min(300).max(900),
  bankDetails: Joi.object({
    accountNumber: Joi.string().min(9).max(18),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    bankName: Joi.string().max(100),
    accountHolderName: Joi.string().max(100)
  }),
  references: Joi.array().items(Joi.object({
    name: Joi.string().max(100),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/),
    relationship: Joi.string().max(50),
    address: Joi.string().max(200)
  })).max(3)
});

const kycSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required(),
  rejectionReason: Joi.string().when('status', {
    is: 'rejected',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const documentSchema = Joi.object({
  type: Joi.string().valid('aadhar', 'pan', 'salary_slip', 'bank_statement', 'photo').required(),
  fileName: Joi.string().required(),
  filePath: Joi.string().required()
});

const validateCustomer = (req, res, next) => {
  const { error } = customerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateKYC = (req, res, next) => {
  const { error } = kycSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateDocument = (req, res, next) => {
  const { error } = documentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validateCustomer,
  validateKYC,
  validateDocument
};