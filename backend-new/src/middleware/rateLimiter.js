const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');
const ApiError = require('../utils/ApiError');
const { logSecurityEvent } = require('../config/logger');

// Create Redis store for rate limiting
const createRedisStore = () => {
  if (redisClient.isReady()) {
    return new RedisStore({
      sendCommand: (...args) => redisClient.getClient().call(...args),
    });
  }
  return undefined; // Fall back to memory store
};

// Global rate limiter
const globalRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  store: createRedisStore(),
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'), {
      endpoint: req.originalUrl,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later',
      retryAfter: '15 minutes'
    });
  }
});

// Authentication rate limiter
const authRateLimit = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  store: createRedisStore(),
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts, please try again later',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    logSecurityEvent('AUTH_RATE_LIMIT_EXCEEDED', null, req.ip, req.get('User-Agent'), {
      endpoint: req.originalUrl,
      email: req.body.email
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later',
      retryAfter: '15 minutes'
    });
  }
});

// Password reset rate limiter
const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  store: createRedisStore(),
  keyGenerator: (req) => `password_reset:${req.body.email || req.ip}`,
  message: {
    error: 'Too many password reset attempts, please try again later',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    logSecurityEvent('PASSWORD_RESET_RATE_LIMIT_EXCEEDED', null, req.ip, req.get('User-Agent'), {
      email: req.body.email
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later',
      retryAfter: '1 hour'
    });
  }
});

// API rate limiter for different user roles
const createRoleBasedRateLimit = (limits) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      const userRole = req.user?.role || 'guest';
      return limits[userRole] || limits.default || 100;
    },
    store: createRedisStore(),
    keyGenerator: (req) => `${req.user?.id || req.ip}:${req.user?.role || 'guest'}`,
    message: {
      error: 'Rate limit exceeded for your user role',
      retryAfter: '15 minutes'
    },
    handler: (req, res) => {
      logSecurityEvent('ROLE_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'), {
        role: req.user?.role,
        endpoint: req.originalUrl
      });
      
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded for your user role',
        retryAfter: '15 minutes'
      });
    }
  });
};

// Loan application rate limiter
const loanApplicationRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 loan applications per day
  store: createRedisStore(),
  keyGenerator: (req) => `loan_application:${req.user?.id || req.ip}`,
  message: {
    error: 'Too many loan applications submitted today, please try again tomorrow',
    retryAfter: '24 hours'
  },
  handler: (req, res) => {
    logSecurityEvent('LOAN_APPLICATION_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'));
    
    res.status(429).json({
      success: false,
      message: 'Too many loan applications submitted today, please try again tomorrow',
      retryAfter: '24 hours'
    });
  }
});

// File upload rate limiter
const fileUploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 file uploads per hour
  store: createRedisStore(),
  keyGenerator: (req) => `file_upload:${req.user?.id || req.ip}`,
  message: {
    error: 'Too many file uploads, please try again later',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    logSecurityEvent('FILE_UPLOAD_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'));
    
    res.status(429).json({
      success: false,
      message: 'Too many file uploads, please try again later',
      retryAfter: '1 hour'
    });
  }
});

// Payment processing rate limiter
const paymentRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 payment attempts per 5 minutes
  store: createRedisStore(),
  keyGenerator: (req) => `payment:${req.user?.id || req.ip}`,
  message: {
    error: 'Too many payment attempts, please wait before trying again',
    retryAfter: '5 minutes'
  },
  handler: (req, res) => {
    logSecurityEvent('PAYMENT_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'), {
      amount: req.body.amount,
      loanId: req.body.loanId
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many payment attempts, please wait before trying again',
      retryAfter: '5 minutes'
    });
  }
});

// OTP rate limiter
const otpRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 OTP per minute
  store: createRedisStore(),
  keyGenerator: (req) => `otp:${req.body.phone || req.body.email || req.ip}`,
  message: {
    error: 'Please wait before requesting another OTP',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    logSecurityEvent('OTP_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'), {
      phone: req.body.phone,
      email: req.body.email
    });
    
    res.status(429).json({
      success: false,
      message: 'Please wait before requesting another OTP',
      retryAfter: '1 minute'
    });
  }
});

// Search rate limiter
const searchRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  store: createRedisStore(),
  keyGenerator: (req) => `search:${req.user?.id || req.ip}`,
  message: {
    error: 'Too many search requests, please slow down',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many search requests, please slow down',
      retryAfter: '1 minute'
    });
  }
});

// Export rate limiter
const exportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 exports per hour
  store: createRedisStore(),
  keyGenerator: (req) => `export:${req.user?.id || req.ip}`,
  message: {
    error: 'Too many export requests, please try again later',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    logSecurityEvent('EXPORT_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'), {
      exportType: req.query.format
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many export requests, please try again later',
      retryAfter: '1 hour'
    });
  }
});

// Dynamic rate limiter based on endpoint sensitivity
const createDynamicRateLimit = (config) => {
  return (req, res, next) => {
    const endpoint = req.route?.path || req.path;
    const method = req.method.toLowerCase();
    const key = `${method}:${endpoint}`;
    
    const endpointConfig = config[key] || config.default;
    
    if (!endpointConfig) {
      return next();
    }
    
    const limiter = rateLimit({
      windowMs: endpointConfig.windowMs,
      max: endpointConfig.max,
      store: createRedisStore(),
      keyGenerator: (req) => `dynamic:${key}:${req.user?.id || req.ip}`,
      message: endpointConfig.message,
      handler: (req, res) => {
        logSecurityEvent('DYNAMIC_RATE_LIMIT_EXCEEDED', req.user?.id, req.ip, req.get('User-Agent'), {
          endpoint: key,
          config: endpointConfig
        });
        
        res.status(429).json({
          success: false,
          message: endpointConfig.message.error,
          retryAfter: endpointConfig.message.retryAfter
        });
      }
    });
    
    limiter(req, res, next);
  };
};

// Burst rate limiter for high-frequency operations
const burstRateLimit = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // 10 requests per second
  store: createRedisStore(),
  message: {
    error: 'Too many requests per second, please slow down',
    retryAfter: '1 second'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests per second, please slow down',
      retryAfter: '1 second'
    });
  }
});

// IP-based suspicious activity detector
const suspiciousActivityDetector = async (req, res, next) => {
  try {
    const ip = req.ip;
    const suspiciousKey = `suspicious:${ip}`;
    
    // Check for suspicious patterns
    const requestCount = await redisClient.incr(`requests:${ip}`);
    await redisClient.expire(`requests:${ip}`, 60); // 1 minute window
    
    // If more than 200 requests per minute from same IP
    if (requestCount > 200) {
      await redisClient.set(suspiciousKey, 'true', 3600); // Block for 1 hour
      
      logSecurityEvent('SUSPICIOUS_ACTIVITY_DETECTED', req.user?.id, ip, req.get('User-Agent'), {
        requestCount,
        timeWindow: '1 minute'
      });
      
      return res.status(429).json({
        success: false,
        message: 'Suspicious activity detected. Access temporarily restricted.',
        retryAfter: '1 hour'
      });
    }
    
    // Check if IP is already marked as suspicious
    const isSuspicious = await redisClient.exists(suspiciousKey);
    if (isSuspicious) {
      return res.status(429).json({
        success: false,
        message: 'Access restricted due to suspicious activity',
        retryAfter: '1 hour'
      });
    }
    
    next();
  } catch (error) {
    // If Redis is down, continue without rate limiting
    next();
  }
};

module.exports = {
  globalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  createRoleBasedRateLimit,
  loanApplicationRateLimit,
  fileUploadRateLimit,
  paymentRateLimit,
  otpRateLimit,
  searchRateLimit,
  exportRateLimit,
  createDynamicRateLimit,
  burstRateLimit,
  suspiciousActivityDetector
};