const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security event logger
const logSecurityEvent = (event, req, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    details
  };

  const logFile = path.join(logsDir, 'security.log');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Event:', logEntry);
  }
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    const logFile = path.join(logsDir, 'access.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  });

  next();
};

module.exports = {
  logSecurityEvent,
  requestLogger
};