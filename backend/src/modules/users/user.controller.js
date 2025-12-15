const BaseController = require('../../core/BaseController');
const UserService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { generateTokens } = require('../../middleware/auth');
const { logSecurityEvent } = require('../../config/logger');

class UserController extends BaseController {
  constructor() {
    const userService = new UserService();
    super(userService);
  }

  // Register new user
  register = async (req, res, next) => {
    try {
      const userData = req.body;
      
      // Validate business rules
      await this.service.validateUserBusinessRules(userData);
      
      const user = await this.service.createUser(userData);

      logSecurityEvent('USER_REGISTERED', user.id, req.ip, req.get('User-Agent'), {
        email: user.email,
        role: user.role
      });

      res.status(201).json(
        ApiResponse.created('User registered successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Login user
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      const user = await this.service.authenticateUser(email, password, req.ip);
      
      // Generate tokens
      const tokens = generateTokens(user.id);

      // Set HTTP-only cookies
      res.cookie('token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      logSecurityEvent('USER_LOGIN', user.id, req.ip, req.get('User-Agent'));

      res.json(
        ApiResponse.auth('Login successful', user, tokens)
      );
    } catch (error) {
      logSecurityEvent('LOGIN_FAILED', null, req.ip, req.get('User-Agent'), {
        email: req.body.email,
        error: error.message
      });
      next(error);
    }
  };

  // Logout user
  logout = async (req, res, next) => {
    try {
      // Clear cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      logSecurityEvent('USER_LOGOUT', req.user?.id, req.ip, req.get('User-Agent'));

      res.json(
        ApiResponse.success('Logout successful')
      );
    } catch (error) {
      next(error);
    }
  };

  // Get current user profile
  getProfile = async (req, res, next) => {
    try {
      const user = await this.service.getUserProfile(req.user.id);
      
      res.json(
        ApiResponse.success('Profile retrieved successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Update current user profile
  updateProfile = async (req, res, next) => {
    try {
      const user = await this.service.updateUserProfile(req.user.id, req.body);
      
      res.json(
        ApiResponse.success('Profile updated successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Change password
  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const result = await this.service.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      logSecurityEvent('PASSWORD_CHANGED', req.user.id, req.ip, req.get('User-Agent'));

      res.json(
        ApiResponse.success(result.message)
      );
    } catch (error) {
      next(error);
    }
  };

  // Forgot password
  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      
      const result = await this.service.resetPassword(email);

      logSecurityEvent('PASSWORD_RESET_REQUESTED', null, req.ip, req.get('User-Agent'), {
        email
      });

      res.json(
        ApiResponse.success(result.message)
      );
    } catch (error) {
      next(error);
    }
  };

  // Reset password
  resetPassword = async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      
      const result = await this.service.confirmPasswordReset(token, newPassword);

      logSecurityEvent('PASSWORD_RESET_COMPLETED', null, req.ip, req.get('User-Agent'));

      res.json(
        ApiResponse.success(result.message)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get users by role
  getUsersByRole = async (req, res, next) => {
    try {
      const { role } = req.params;
      const options = this.getPaginationParams(req);
      
      const users = await this.service.getUsersByRole(role, options);
      
      res.json(
        ApiResponse.success('Users retrieved successfully', users)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get users by department
  getUsersByDepartment = async (req, res, next) => {
    try {
      const { department } = req.params;
      const options = this.getPaginationParams(req);
      
      const users = await this.service.getUsersByDepartment(department, options);
      
      res.json(
        ApiResponse.success('Users retrieved successfully', users)
      );
    } catch (error) {
      next(error);
    }
  };

  // Search users
  searchUsers = async (req, res, next) => {
    try {
      const { q: searchTerm } = req.query;
      const options = {
        ...this.getPaginationParams(req),
        sort: this.getSortParams(req)
      };
      
      const users = await this.service.searchUsers(searchTerm, options);
      
      res.json(
        ApiResponse.success('Search results retrieved successfully', users)
      );
    } catch (error) {
      next(error);
    }
  };

  // Update user status (Admin only)
  updateUserStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const user = await this.service.updateUserStatus(id, status, req.user.id);

      logSecurityEvent('USER_STATUS_UPDATED', req.user.id, req.ip, req.get('User-Agent'), {
        targetUserId: id,
        newStatus: status
      });
      
      res.json(
        ApiResponse.success('User status updated successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Update user permissions (Admin only)
  updateUserPermissions = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      
      const user = await this.service.updateUserPermissions(id, permissions, req.user.id);

      logSecurityEvent('USER_PERMISSIONS_UPDATED', req.user.id, req.ip, req.get('User-Agent'), {
        targetUserId: id,
        permissions
      });
      
      res.json(
        ApiResponse.success('User permissions updated successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get user statistics
  getUserStats = async (req, res, next) => {
    try {
      const stats = await this.service.getUserStatistics();
      
      res.json(
        ApiResponse.stats('User statistics retrieved successfully', stats)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get dashboard data
  getDashboard = async (req, res, next) => {
    try {
      const dashboardData = await this.service.getDashboardData();
      
      res.json(
        ApiResponse.success('Dashboard data retrieved successfully', dashboardData)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get team hierarchy
  getTeamHierarchy = async (req, res, next) => {
    try {
      const { managerId } = req.query;
      
      const hierarchy = await this.service.getTeamHierarchy(managerId);
      
      res.json(
        ApiResponse.success('Team hierarchy retrieved successfully', hierarchy)
      );
    } catch (error) {
      next(error);
    }
  };

  // Assign manager to user
  assignManager = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { managerId } = req.body;
      
      const user = await this.service.assignManager(id, managerId);
      
      res.json(
        ApiResponse.success('Manager assigned successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Update performance metrics
  updatePerformanceMetrics = async (req, res, next) => {
    try {
      const { id } = req.params;
      const metrics = req.body;
      
      const user = await this.service.updatePerformanceMetrics(id, metrics);
      
      res.json(
        ApiResponse.success('Performance metrics updated successfully', user)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get users for performance review
  getUsersForPerformanceReview = async (req, res, next) => {
    try {
      const users = await this.service.getUsersForPerformanceReview();
      
      res.json(
        ApiResponse.success('Users for performance review retrieved successfully', users)
      );
    } catch (error) {
      next(error);
    }
  };

  // Bulk update user status
  bulkUpdateStatus = async (req, res, next) => {
    try {
      const { userIds, status } = req.body;
      
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw ApiError.badRequest('User IDs array is required');
      }
      
      const result = await this.service.bulkUpdateStatus(userIds, status, req.user.id);

      logSecurityEvent('BULK_USER_STATUS_UPDATE', req.user.id, req.ip, req.get('User-Agent'), {
        userIds,
        status,
        count: userIds.length
      });
      
      res.json(
        ApiResponse.success(result.message, result)
      );
    } catch (error) {
      next(error);
    }
  };

  // Get users by permission
  getUsersByPermission = async (req, res, next) => {
    try {
      const { permission } = req.params;
      
      const users = await this.service.getUsersByPermission(permission);
      
      res.json(
        ApiResponse.success('Users retrieved successfully', users)
      );
    } catch (error) {
      next(error);
    }
  };

  // Check user permission
  checkPermission = async (req, res, next) => {
    try {
      const { permission } = req.params;
      const userId = req.user.id;
      
      const hasPermission = await this.service.verifyUserPermission(userId, permission);
      
      res.json(
        ApiResponse.success('Permission check completed', { hasPermission })
      );
    } catch (error) {
      next(error);
    }
  };

  // Get user's subordinates
  getUserSubordinates = async (req, res, next) => {
    try {
      const { id } = req.params;
      const options = this.getPaginationParams(req);
      
      const subordinates = await this.service.getUserSubordinates(id, options);
      
      res.json(
        ApiResponse.success('Subordinates retrieved successfully', subordinates)
      );
    } catch (error) {
      next(error);
    }
  };

  // Health check
  healthCheck = async (req, res, next) => {
    try {
      const health = await this.service.healthCheck();
      
      res.json(
        ApiResponse.health(health.status, health)
      );
    } catch (error) {
      next(error);
    }
  };

  // Export users
  exportUsers = async (req, res, next) => {
    try {
      const { format = 'csv', ...filters } = req.query;
      
      const exportData = await this.service.export(filters, format);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=users_export.${format}`);
      
      res.send(exportData);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;