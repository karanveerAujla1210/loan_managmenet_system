const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Development error response
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// Production error response
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json(
      ApiResponse.error(err.message, null, err.statusCode)
    );
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR:', err);
    
    res.status(500).json(
      ApiResponse.error('Something went wrong!', null, 500)
    );
  }
};

// Handle MongoDB cast errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

// Handle MongoDB duplicate field errors
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiError(message, 409);
};

// Handle MongoDB validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
  new ApiError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new ApiError('Your token has expired! Please log in again.', 401);

// Handle Multer errors
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new ApiError('File too large', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new ApiError('Too many files', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new ApiError('Unexpected file field', 400);
  }
  return new ApiError('File upload error', 400);
};

// Handle Redis errors
const handleRedisError = (err) => {
  logger.warn('Redis error (non-critical):', err.message);
  return new ApiError('Cache service temporarily unavailable', 503);
};

// Handle rate limit errors
const handleRateLimitError = (err) => {
  return new ApiError('Too many requests, please try again later', 429);
};

// Handle validation errors from express-validator
const handleValidationError = (errors) => {
  const formattedErrors = errors.array().map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value
  }));
  
  return new ApiError('Validation failed', 400, formattedErrors);
};

// Handle Mongoose connection errors
const handleMongooseConnectionError = (err) => {
  logger.error('Database connection error:', err);
  return new ApiError('Database connection failed', 503);
};

// Handle timeout errors
const handleTimeoutError = (err) => {
  return new ApiError('Request timeout', 408);
};

// Handle CORS errors
const handleCorsError = (err) => {
  return new ApiError('CORS policy violation', 403);
};

// Handle file system errors
const handleFileSystemError = (err) => {
  if (err.code === 'ENOENT') {
    return new ApiError('File not found', 404);
  }
  if (err.code === 'EACCES') {
    return new ApiError('File access denied', 403);
  }
  if (err.code === 'ENOSPC') {
    return new ApiError('Insufficient storage space', 507);
  }
  return new ApiError('File system error', 500);
};

// Handle business logic errors
const handleBusinessLogicError = (err) => {
  // Custom business logic error handling
  const businessErrors = {
    'INSUFFICIENT_BALANCE': 'Insufficient account balance',
    'LOAN_ALREADY_EXISTS': 'Loan application already exists',
    'INVALID_LOAN_STATUS': 'Invalid loan status for this operation',
    'PAYMENT_ALREADY_PROCESSED': 'Payment has already been processed',
    'CUSTOMER_NOT_ELIGIBLE': 'Customer is not eligible for this loan',
    'DOCUMENT_REQUIRED': 'Required documents are missing',
    'CREDIT_SCORE_LOW': 'Credit score does not meet minimum requirements',
    'LOAN_LIMIT_EXCEEDED': 'Loan amount exceeds approved limit',
    'REPAYMENT_OVERDUE': 'Previous repayments are overdue',
    'ACCOUNT_SUSPENDED': 'Account has been suspended'
  };

  const message = businessErrors[err.code] || err.message;
  return new ApiError(message, err.statusCode || 400);
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Multer errors
  if (err.name === 'MulterError') {
    error = handleMulterError(error);
  }

  // Redis errors
  if (err.name === 'RedisError' || err.name === 'ReplyError') {
    error = handleRedisError(error);
  }

  // Rate limit errors
  if (err.name === 'RateLimitError') {
    error = handleRateLimitError(error);
  }

  // Mongoose connection errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    error = handleMongooseConnectionError(error);
  }

  // Timeout errors
  if (err.code === 'ETIMEDOUT' || err.name === 'TimeoutError') {
    error = handleTimeoutError(error);
  }

  // CORS errors
  if (err.name === 'CorsError') {
    error = handleCorsError(error);
  }

  // File system errors
  if (err.code && err.code.startsWith('E')) {
    error = handleFileSystemError(error);
  }

  // Business logic errors
  if (err.type === 'BUSINESS_LOGIC_ERROR') {
    error = handleBusinessLogicError(error);
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new ApiError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error handler
const validationErrorHandler = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = handleValidationError(errors);
    return next(error);
  }
  
  next();
};

// Global unhandled rejection handler
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Global uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  validationErrorHandler,
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError,
  handleMulterError,
  handleRedisError,
  handleRateLimitError,
  handleBusinessLogicError
};