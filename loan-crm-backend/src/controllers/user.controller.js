const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const { createSendToken } = require('../middleware/auth');
const logger = require('../config/logger');

const userController = {
  // Register new user
  register: async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName, phone, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return next(new AppError('User with this email or username already exists', 400));
      }

      // Set default permissions based on role
      const rolePermissions = {
        ADMIN: [
          'CREATE_LOAN', 'UPDATE_LOAN', 'DELETE_LOAN', 'VIEW_LOAN',
          'CREATE_PAYMENT', 'UPDATE_PAYMENT', 'DELETE_PAYMENT', 'VIEW_PAYMENT',
          'CREATE_CUSTOMER', 'UPDATE_CUSTOMER', 'DELETE_CUSTOMER', 'VIEW_CUSTOMER',
          'ASSIGN_COLLECTOR', 'VIEW_REPORTS', 'MANAGE_USERS', 'LEGAL_ACTIONS'
        ],
        MANAGER: [
          'CREATE_LOAN', 'UPDATE_LOAN', 'VIEW_LOAN',
          'CREATE_PAYMENT', 'UPDATE_PAYMENT', 'VIEW_PAYMENT',
          'CREATE_CUSTOMER', 'UPDATE_CUSTOMER', 'VIEW_CUSTOMER',
          'ASSIGN_COLLECTOR', 'VIEW_REPORTS'
        ],
        COLLECTOR: [
          'VIEW_LOAN', 'VIEW_PAYMENT', 'VIEW_CUSTOMER', 'CREATE_PAYMENT'
        ],
        LEGAL: [
          'VIEW_LOAN', 'VIEW_CUSTOMER', 'LEGAL_ACTIONS'
        ],
        VIEWER: [
          'VIEW_LOAN', 'VIEW_PAYMENT', 'VIEW_CUSTOMER'
        ]
      };

      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
        permissions: rolePermissions[role] || []
      });

      logger.info(`New user registered: ${username} with role: ${role}`);

      createSendToken(user, 201, res);
    } catch (error) {
      next(error);
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // Check if user exists and password is correct
      const user = await User.findOne({ username }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Incorrect username or password', 401));
      }

      if (!user.isActive) {
        return next(new AppError('Your account has been deactivated', 401));
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      logger.info(`User logged in: ${username}`);

      createSendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  },

  // Get current user profile
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const { firstName, lastName, phone, email } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { firstName, lastName, phone, email },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all users (Admin only)
  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, role, isActive } = req.query;

      const filter = {};
      if (role) filter.role = role;
      if (isActive !== undefined) filter.isActive = isActive === 'true';

      const skip = (page - 1) * limit;
      const users = await User.find(filter)
        .select('-password -refreshToken')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(filter);

      res.status(200).json({
        status: 'success',
        results: users.length,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user (Admin only)
  updateUser: async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      logger.info(`User updated: ${user.username} by admin: ${req.user.username}`);

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Deactivate user (Admin only)
  deactivateUser: async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      ).select('-password');

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      logger.info(`User deactivated: ${user.username} by admin: ${req.user.username}`);

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;