const ERROR_CODES = {
  // Loan errors
  'LOAN_NOT_FOUND': { status: 404, message: 'Loan not found' },
  'LOAN_STATE_INVALID': { status: 409, message: 'Invalid loan state transition' },
  'LOAN_ALREADY_APPROVED': { status: 409, message: 'Loan already approved' },
  'LOAN_NOT_APPROVED': { status: 409, message: 'Loan must be approved first' },

  // Payment errors
  'PAYMENT_NOT_FOUND': { status: 404, message: 'Payment not found' },
  'NO_PENDING_INSTALLMENT': { status: 409, message: 'No pending installment' },
  'INVALID_AMOUNT': { status: 400, message: 'Invalid payment amount' },
  'INVALID_METHOD': { status: 400, message: 'Invalid payment method' },

  // Installment errors
  'INSTALLMENT_NOT_FOUND': { status: 404, message: 'Installment not found' },

  // RBAC errors
  'RBAC_DENIED': { status: 403, message: 'Access denied' },
  'UNAUTHORIZED': { status: 401, message: 'Unauthorized' },
  'FORBIDDEN': { status: 403, message: 'Insufficient permissions' },

  // Validation errors
  'VALIDATION_ERROR': { status: 400, message: 'Validation failed' },
  'PRECONDITION_FAILED': { status: 409, message: 'Precondition failed' },

  // State errors
  'STATE_GUARD_ERROR': { status: 500, message: 'State guard error' },

  // Auth errors
  'NO_TOKEN': { status: 401, message: 'No token provided' },
  'INVALID_TOKEN': { status: 401, message: 'Invalid token' },
  'TOKEN_EXPIRED': { status: 401, message: 'Token expired' },
  'AUTH_ERROR': { status: 401, message: 'Authentication failed' },

  // Server errors
  'INTERNAL_ERROR': { status: 500, message: 'Internal server error' },
  'CONFIG_ERROR': { status: 500, message: 'Server configuration error' },
  'NOT_FOUND': { status: 404, message: 'Route not found' }
};

const getError = (code, details = {}) => ({
  code,
  message: ERROR_CODES[code]?.message || 'Unknown error',
  status: ERROR_CODES[code]?.status || 500,
  ...(Object.keys(details).length > 0 && { details })
});

module.exports = { ERROR_CODES, getError };
