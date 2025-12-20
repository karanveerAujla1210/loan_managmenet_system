const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'NO_TOKEN', message: 'No token provided' } 
      });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ 
        success: false, 
        error: { code: 'CONFIG_ERROR', message: 'Server configuration error' } 
      });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' } 
      });
    }
    res.status(401).json({ 
      success: false, 
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' } 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } 
      });
    }
    next();
  };
};

module.exports = { protect, authorize, auth: protect };
