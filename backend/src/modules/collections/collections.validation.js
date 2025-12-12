const Joi = require('joi');

const paymentValidation = Joi.object({
  amount: Joi.number().positive().required(),
  mode: Joi.string().valid('cash', 'bank_transfer', 'cheque', 'online', 'upi').default('cash'),
  notes: Joi.string().optional()
});

const ptpValidation = Joi.object({
  ptpDate: Joi.date().min('now').required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().optional()
});

const noteValidation = Joi.object({
  note: Joi.string().min(1).max(500).required()
});

const escalationValidation = Joi.object({
  reason: Joi.string().min(1).max(200).required()
});

const assignmentValidation = Joi.object({
  loanId: Joi.string().required(),
  agentId: Joi.string().required()
});

module.exports = {
  paymentValidation,
  ptpValidation,
  noteValidation,
  escalationValidation,
  assignmentValidation
};