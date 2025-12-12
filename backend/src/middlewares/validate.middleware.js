const { errorResponse } = require('../utils/responses');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    
    next();
  };
};

module.exports = {
  validateRequest
};