const Joi = require('joi');

const loanSchema = Joi.object({
  customerId: Joi.string().required(),
  principalAmount: Joi.number().positive().required(),
  interestRate: Joi.number().min(0).max(100).required(),
  numberOfInstallments: Joi.number().integer().min(1).max(52).default(14),
  frequency: Joi.string().valid('weekly', 'monthly').default('weekly'),
  startDate: Joi.date().required()
});

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('cash', 'bank_transfer', 'cheque', 'online', 'upi').default('cash'),
  reference: Joi.string().optional(),
  notes: Joi.string().max(500).optional()
});

const ptpSchema = Joi.object({
  amount: Joi.number().positive().required(),
  promiseDate: Joi.date().min('now').required(),
  notes: Joi.string().max(500).optional()
});

const noteSchema = Joi.object({
  note: Joi.string().min(1).max(1000).required()
});

const validateLoan = (req, res, next) => {
  const { error } = loanSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validatePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validatePTP = (req, res, next) => {
  const { error } = ptpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateNote = (req, res, next) => {
  const { error } = noteSchema.validate(req.body);
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
  validateLoan,
  validatePayment,
  validatePTP,
  validateNote
};