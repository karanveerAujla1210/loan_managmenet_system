const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');

class AuthController {
  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user and include password
      const user = await User.findOne({ email }).select('+passwordHash');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.isAccountLocked()) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }

      // Verify password
      const isMatch = await user.verifyPassword(password);
      
      if (!isMatch) {
        await user.incrementLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      if (user.failedLoginAttempts > 0) {
        await user.updateOne({
          $set: { failedLoginAttempts: 0 },
          $unset: { lockedUntil: 1 }
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT
      const token = user.generateJWT();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Register user
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, phone, password, role = 'customer' } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or phone'
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        passwordHash: password,
        role
      });

      // Generate JWT
      const token = user.generateJWT();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getMe(req, res) {
    try {
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[0-9]{10,15}$/).withMessage('Please provide a valid phone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').optional().isIn(['customer', 'agent', 'manager', 'admin']).withMessage('Invalid role')
];

module.exports = { AuthController, loginValidation, registerValidation };