const { getError } = require('../utils/errorCodes');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const details = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        error: getError('VALIDATION_ERROR', { errors: details })
      });
    }

    req.body = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const details = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        error: getError('VALIDATION_ERROR', { errors: details })
      });
    }

    req.query = value;
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const details = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        error: getError('VALIDATION_ERROR', { errors: details })
      });
    }

    req.params = value;
    next();
  };
};

module.exports = { validateRequest, validateQuery, validateParams };
