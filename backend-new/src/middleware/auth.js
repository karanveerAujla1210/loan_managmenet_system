const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../modules/users/user.model');
const ApiError = require('../utils/ApiError');
const { logSecurityEvent } = require('../config/logger');
const redisClient = require('../config/redis');

// JWT token generation
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// Verify JWT token
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', 401);
    }
    throw new ApiError('Token verification failed', 401);
  }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError('Access token required', 401);
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new ApiError('Token has been revoked', 401);
    }

    // Verify token
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      throw new ApiError('User not found or inactive', 401);
    }

    // Check if user changed password after token was issued
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      throw new ApiError('Password recently changed. Please login again', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logSecurityEvent('AUTH_FAILED', null, req.ip, req.get('User-Agent'), {
      error: error.message,
      token: req.headers.authorization ? 'Bearer ***' : 'No token'
    });
    next(error);
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      logSecurityEvent('AUTHORIZATION_FAILED', req.user.id, req.ip, req.get('User-Agent'), {
        requiredRoles: roles,
        userRole: req.user.role,
        resource: req.originalUrl
      });
      return next(new ApiError('Insufficient permissions', 403));
    }

    next();
  };
};

// Permission-based authorization
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401));
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      logSecurityEvent('PERMISSION_DENIED', req.user.id, req.ip, req.get('User-Agent'), {
        requiredPermission: permission,
        userPermissions: req.user.permissions,
        resource: req.originalUrl
      });
      return next(new ApiError('Permission denied', 403));
    }

    next();
  };
};

// Resource ownership check
const checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return next(new ApiError('Resource not found', 404));
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      if (resource.createdBy && resource.createdBy.toString() !== req.user.id) {
        logSecurityEvent('OWNERSHIP_VIOLATION', req.user.id, req.ip, req.get('User-Agent'), {
          resourceId,
          resourceType: resourceModel.modelName,
          ownerId: resource.createdBy
        });
        return next(new ApiError('Access denied', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// API Key authentication
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new ApiError('API key required', 401));
  }

  // Validate API key (implement your logic here)
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!validApiKeys.includes(apiKey)) {
    logSecurityEvent('INVALID_API_KEY', null, req.ip, req.get('User-Agent'), {
      providedKey: apiKey.substring(0, 8) + '***'
    });
    return next(new ApiError('Invalid API key', 401));
  }

  next();
};

// Password validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Logout and blacklist token
const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (token) {
      // Add token to blacklist
      const decoded = jwt.decode(token);
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      
      if (expiresIn > 0) {
        await redisClient.set(`blacklist:${token}`, 'true', expiresIn);
      }
    }

    // Clear cookie
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    logSecurityEvent('USER_LOGOUT', req.user?.id, req.ip, req.get('User-Agent'));
    
    next();
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || req.cookies;

    if (!refreshToken) {
      throw new ApiError('Refresh token required', 401);
    }

    // Check if refresh token is blacklisted
    const isBlacklisted = await redisClient.exists(`blacklist:${refreshToken}`);
    if (isBlacklisted) {
      throw new ApiError('Refresh token has been revoked', 401);
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new ApiError('User not found or inactive', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Blacklist old refresh token
    const oldDecoded = jwt.decode(refreshToken);
    const expiresIn = oldDecoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await redisClient.set(`blacklist:${refreshToken}`, 'true', expiresIn);
    }

    req.tokens = tokens;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Account lockout middleware
const checkAccountLockout = async (req, res, next) => {
  try {
    const { email } = req.body;
    const lockoutKey = `lockout:${email}`;
    const attemptsKey = `attempts:${email}`;

    // Check if account is locked
    const isLocked = await redisClient.exists(lockoutKey);
    if (isLocked) {
      const lockoutTime = await redisClient.get(lockoutKey);
      throw new ApiError(`Account locked. Try again after ${new Date(lockoutTime).toLocaleString()}`, 423);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Track failed login attempts
const trackFailedAttempt = async (email) => {
  const attemptsKey = `attempts:${email}`;
  const lockoutKey = `lockout:${email}`;
  const maxAttempts = 5;
  const lockoutDuration = 30 * 60; // 30 minutes

  const attempts = await redisClient.incr(attemptsKey);
  await redisClient.expire(attemptsKey, 15 * 60); // Reset attempts after 15 minutes

  if (attempts >= maxAttempts) {
    const lockoutUntil = new Date(Date.now() + lockoutDuration * 1000);
    await redisClient.set(lockoutKey, lockoutUntil.toISOString(), lockoutDuration);
    await redisClient.del(attemptsKey);
    
    logSecurityEvent('ACCOUNT_LOCKED', null, null, null, {
      email,
      attempts,
      lockoutUntil: lockoutUntil.toISOString()
    });
  }

  return attempts;
};

// Clear failed attempts on successful login
const clearFailedAttempts = async (email) => {
  const attemptsKey = `attempts:${email}`;
  await redisClient.del(attemptsKey);
};

module.exports = {
  authenticate,
  authorize,
  hasPermission,
  checkOwnership,
  validateApiKey,
  validatePassword,
  hashPassword,
  comparePassword,
  generateTokens,
  verifyToken,
  logout,
  refreshToken,
  checkAccountLockout,
  trackFailedAttempt,
  clearFailedAttempts
};