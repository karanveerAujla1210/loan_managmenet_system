const Joi = require('joi');

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'manager', 'counsellor', 'advisor', 'field_agent', 'customer'),
    phone: Joi.string().pattern(/^[0-9]{10}$/)
  });
  return schema.validate(data);
};

module.exports = { validateLogin, validateRegister };