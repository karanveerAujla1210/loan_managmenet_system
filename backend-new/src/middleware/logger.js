const morgan = require('morgan');
const logger = require('../config/logger');

// Custom token for user ID
morgan.token('user-id', (req) => {
  return req.user ? req.user.id : 'anonymous';
});

// Custom token for request ID
morgan.token('request-id', (req) => {
  return req.id || 'no-id';
});

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.get('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom token for request body size
morgan.token('req-body-size', (req) => {
  return req.get('content-length') || '0';
});

// Custom token for user agent (shortened)
morgan.token('user-agent-short', (req) => {
  const userAgent = req.get('User-Agent') || '';
  return userAgent.length > 50 ? userAgent.substring(0, 50) + '...' : userAgent;
});

// Custom token for API version
morgan.token('api-version', (req) => {
  return req.headers['api-version'] || 'v1';
});

// Custom format for development
const devFormat = ':method :url :status :response-time ms - :res[content-length] - :user-id';

// Custom format for production
const prodFormat = ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent-short" :response-time ms';

// Custom format for security logging
const securityFormat = ':remote-addr - :user-id [:date[iso]] ":method :url" :status :response-time ms ":user-agent"';

// Stream object for Morgan to use Winston
const stream = {
  write: (message) => {
    // Remove trailing newline
    logger.http(message.trim());
  }
};

// Request logger middleware
const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  { stream }
);

// Security logger for sensitive operations
const securityLogger = morgan(securityFormat, {
  stream: {
    write: (message) => {
      logger.info(`SECURITY: ${message.trim()}`);
    }
  },
  skip: (req, res) => {
    // Only log security-sensitive endpoints
    const securityEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/logout',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/users',
      '/loans',
      '/payments'
    ];
    
    return !securityEndpoints.some(endpoint => req.originalUrl.includes(endpoint));
  }
});

// Error logger middleware
const errorLogger = (err, req, res, next) => {
  // Log error details
  logger.error('Request Error:', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    },
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : null,
    timestamp: new Date().toISOString()
  });

  next(err);
};

// Performance logger middleware
const performanceLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    
    // Log slow requests (> 1 second)
    if (responseTime > 1000) {
      logger.warn('Slow Request:', {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        statusCode: res.statusCode,
        userId: req.user?.id,
        ip: req.ip
      });
    }
    
    // Set response time header
    res.set('X-Response-Time', responseTime);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

// API usage logger
const apiUsageLogger = (req, res, next) => {
  // Log API usage for analytics
  const logData = {
    endpoint: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    userRole: req.user?.role,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    apiVersion: req.headers['api-version'] || 'v1'
  };

  // Log after response is sent
  res.on('finish', () => {
    logData.statusCode = res.statusCode;
    logData.responseTime = res.get('X-Response-Time');
    
    logger.info('API_USAGE', logData);
  });

  next();
};

// Business operation logger
const businessLogger = (operation) => {
  return (req, res, next) => {
    // Log business operations
    const logData = {
      operation,
      userId: req.user?.id,
      userRole: req.user?.role,
      ip: req.ip,
      timestamp: new Date().toISOString(),
      requestData: {
        params: req.params,
        query: req.query,
        body: req.body
      }
    };

    logger.info(`BUSINESS_OPERATION: ${operation}`, logData);
    next();
  };
};

// Audit logger for compliance
const auditLogger = (action) => {
  return (req, res, next) => {
    const auditData = {
      action,
      userId: req.user?.id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      resource: req.originalUrl,
      method: req.method,
      requestId: req.id
    };

    // Log after response for complete audit trail
    res.on('finish', () => {
      auditData.statusCode = res.statusCode;
      auditData.success = res.statusCode < 400;
      
      logger.info('AUDIT_LOG', auditData);
    });

    next();
  };
};

// Request ID middleware
const requestId = (req, res, next) => {
  req.id = require('uuid').v4();
  res.set('X-Request-ID', req.id);
  next();
};

// Rate limit logger
const rateLimitLogger = (req, res, next) => {
  // Log rate limit hits
  const originalJson = res.json;
  res.json = function(data) {
    if (res.statusCode === 429) {
      logger.warn('Rate Limit Hit:', {
        ip: req.ip,
        userId: req.user?.id,
        endpoint: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
    }
    originalJson.call(this, data);
  };
  
  next();
};

// Database operation logger
const dbLogger = (operation, model) => {
  return (req, res, next) => {
    logger.debug('Database Operation:', {
      operation,
      model,
      userId: req.user?.id,
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
    next();
  };
};

// File operation logger
const fileLogger = (req, res, next) => {
  if (req.files || req.file) {
    const files = req.files || [req.file];
    
    logger.info('File Upload:', {
      userId: req.user?.id,
      fileCount: files.length,
      files: files.map(file => ({
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      })),
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

module.exports = {
  requestLogger,
  securityLogger,
  errorLogger,
  performanceLogger,
  apiUsageLogger,
  businessLogger,
  auditLogger,
  requestId,
  rateLimitLogger,
  dbLogger,
  fileLogger
};