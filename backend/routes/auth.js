const express = require('express');
const csrf = require('csrf');
const { validateRegistration, validateLogin, validatePasswordUpdate } = require('../middleware/validation');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/authController');

const router = express.Router();
const protect = require('../middleware/auth');

// CSRF protection middleware
const tokens = new csrf();
const csrfProtection = (req, res, next) => {
  const secret = req.session?.csrfSecret || tokens.secretSync();
  if (!req.session) req.session = {};
  req.session.csrfSecret = secret;
  
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    if (!tokens.verify(secret, token)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
};

router.post('/register', authLimiter, validateRegistration, csrfProtection, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, csrfProtection, updateDetails);
router.put('/updatepassword', protect, validatePasswordUpdate, csrfProtection, updatePassword);
router.post('/forgotpassword', passwordResetLimiter, csrfProtection, forgotPassword);
router.put('/resetpassword/:resettoken', csrfProtection, resetPassword);
router.get('/logout', protect, logout);

module.exports = router;
