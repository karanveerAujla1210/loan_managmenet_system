class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }

  // Static methods for common error types
  static badRequest(message = 'Bad Request', errors = null) {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }

  static methodNotAllowed(message = 'Method not allowed') {
    return new ApiError(message, 405);
  }

  static conflict(message = 'Conflict', errors = null) {
    return new ApiError(message, 409, errors);
  }

  static validationError(message = 'Validation Error', errors = null) {
    return new ApiError(message, 422, errors);
  }

  static tooManyRequests(message = 'Too Many Requests') {
    return new ApiError(message, 429);
  }

  static internalServerError(message = 'Internal Server Error') {
    return new ApiError(message, 500, null, false);
  }

  static notImplemented(message = 'Not Implemented') {
    return new ApiError(message, 501);
  }

  static badGateway(message = 'Bad Gateway') {
    return new ApiError(message, 502);
  }

  static serviceUnavailable(message = 'Service Unavailable') {
    return new ApiError(message, 503);
  }

  static gatewayTimeout(message = 'Gateway Timeout') {
    return new ApiError(message, 504);
  }

  // Business logic errors
  static businessLogicError(code, message, statusCode = 400) {
    const error = new ApiError(message, statusCode);
    error.code = code;
    error.type = 'BUSINESS_LOGIC_ERROR';
    return error;
  }

  // Database errors
  static databaseError(message = 'Database Error', originalError = null) {
    const error = new ApiError(message, 500, null, false);
    error.originalError = originalError;
    error.type = 'DATABASE_ERROR';
    return error;
  }

  // External service errors
  static externalServiceError(service, message = 'External Service Error') {
    const error = new ApiError(message, 503);
    error.service = service;
    error.type = 'EXTERNAL_SERVICE_ERROR';
    return error;
  }

  // Authentication errors
  static authenticationError(message = 'Authentication Failed') {
    const error = new ApiError(message, 401);
    error.type = 'AUTHENTICATION_ERROR';
    return error;
  }

  // Authorization errors
  static authorizationError(message = 'Authorization Failed', requiredPermissions = null) {
    const error = new ApiError(message, 403);
    error.requiredPermissions = requiredPermissions;
    error.type = 'AUTHORIZATION_ERROR';
    return error;
  }

  // File upload errors
  static fileUploadError(message = 'File Upload Error', fileErrors = null) {
    const error = new ApiError(message, 400, fileErrors);
    error.type = 'FILE_UPLOAD_ERROR';
    return error;
  }

  // Rate limit errors
  static rateLimitError(message = 'Rate Limit Exceeded', retryAfter = null) {
    const error = new ApiError(message, 429);
    error.retryAfter = retryAfter;
    error.type = 'RATE_LIMIT_ERROR';
    return error;
  }

  // Loan-specific business errors
  static loanErrors = {
    insufficientBalance: () => 
      ApiError.businessLogicError('INSUFFICIENT_BALANCE', 'Insufficient account balance for this transaction'),
    
    loanAlreadyExists: () => 
      ApiError.businessLogicError('LOAN_ALREADY_EXISTS', 'A loan application already exists for this customer'),
    
    invalidLoanStatus: (currentStatus, requiredStatus) => 
      ApiError.businessLogicError('INVALID_LOAN_STATUS', 
        `Loan status is ${currentStatus}, but ${requiredStatus} is required for this operation`),
    
    paymentAlreadyProcessed: () => 
      ApiError.businessLogicError('PAYMENT_ALREADY_PROCESSED', 'This payment has already been processed'),
    
    customerNotEligible: (reason) => 
      ApiError.businessLogicError('CUSTOMER_NOT_ELIGIBLE', `Customer is not eligible: ${reason}`),
    
    documentRequired: (documentType) => 
      ApiError.businessLogicError('DOCUMENT_REQUIRED', `${documentType} document is required`),
    
    creditScoreLow: (score, minRequired) => 
      ApiError.businessLogicError('CREDIT_SCORE_LOW', 
        `Credit score ${score} is below minimum required ${minRequired}`),
    
    loanLimitExceeded: (requestedAmount, maxAmount) => 
      ApiError.businessLogicError('LOAN_LIMIT_EXCEEDED', 
        `Requested amount ₹${requestedAmount} exceeds maximum limit ₹${maxAmount}`),
    
    repaymentOverdue: (overdueAmount, daysPastDue) => 
      ApiError.businessLogicError('REPAYMENT_OVERDUE', 
        `Previous repayments are overdue: ₹${overdueAmount} for ${daysPastDue} days`),
    
    accountSuspended: (reason) => 
      ApiError.businessLogicError('ACCOUNT_SUSPENDED', `Account suspended: ${reason}`)
  };

  // Collection-specific errors
  static collectionErrors = {
    invalidCollectionStatus: (status) => 
      ApiError.businessLogicError('INVALID_COLLECTION_STATUS', `Invalid collection status: ${status}`),
    
    collectorNotAssigned: () => 
      ApiError.businessLogicError('COLLECTOR_NOT_ASSIGNED', 'No collector assigned to this loan'),
    
    followUpTooEarly: (nextAllowedDate) => 
      ApiError.businessLogicError('FOLLOW_UP_TOO_EARLY', 
        `Next follow-up allowed on ${nextAllowedDate}`),
    
    legalActionRequired: () => 
      ApiError.businessLogicError('LEGAL_ACTION_REQUIRED', 'This case requires legal action')
  };

  // Payment-specific errors
  static paymentErrors = {
    invalidPaymentMethod: (method) => 
      ApiError.businessLogicError('INVALID_PAYMENT_METHOD', `Invalid payment method: ${method}`),
    
    paymentAmountInvalid: (amount, minAmount, maxAmount) => 
      ApiError.businessLogicError('PAYMENT_AMOUNT_INVALID', 
        `Payment amount ₹${amount} must be between ₹${minAmount} and ₹${maxAmount}`),
    
    paymentGatewayError: (gatewayMessage) => 
      ApiError.externalServiceError('Payment Gateway', `Payment failed: ${gatewayMessage}`),
    
    duplicateTransaction: (transactionId) => 
      ApiError.businessLogicError('DUPLICATE_TRANSACTION', 
        `Transaction ${transactionId} already exists`),
    
    paymentReversalNotAllowed: (reason) => 
      ApiError.businessLogicError('PAYMENT_REVERSAL_NOT_ALLOWED', 
        `Payment reversal not allowed: ${reason}`)
  };

  // Convert to JSON for API responses
  toJSON() {
    const errorResponse = {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      timestamp: this.timestamp
    };

    if (this.errors) {
      errorResponse.errors = this.errors;
    }

    if (this.code) {
      errorResponse.code = this.code;
    }

    if (this.type) {
      errorResponse.type = this.type;
    }

    if (this.service) {
      errorResponse.service = this.service;
    }

    if (this.requiredPermissions) {
      errorResponse.requiredPermissions = this.requiredPermissions;
    }

    if (this.retryAfter) {
      errorResponse.retryAfter = this.retryAfter;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = this.stack;
    }

    return errorResponse;
  }

  // Log error details
  logError(logger, req = null) {
    const errorLog = {
      message: this.message,
      statusCode: this.statusCode,
      stack: this.stack,
      timestamp: this.timestamp
    };

    if (this.errors) {
      errorLog.errors = this.errors;
    }

    if (this.code) {
      errorLog.code = this.code;
    }

    if (this.type) {
      errorLog.type = this.type;
    }

    if (req) {
      errorLog.request = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id
      };
    }

    if (this.statusCode >= 500) {
      logger.error('API Error:', errorLog);
    } else {
      logger.warn('API Error:', errorLog);
    }
  }
}

module.exports = ApiError;