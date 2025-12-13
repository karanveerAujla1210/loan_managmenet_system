const BaseService = require('../../core/BaseService');
const UserRepository = require('./user.repository');
const ApiError = require('../../utils/ApiError');
const { hashPassword, comparePassword } = require('../../middleware/auth');
const { businessUtils, stringUtils } = require('../../utils/helpers');
const logger = require('../../config/logger');

class UserService extends BaseService {
  constructor() {
    const userRepository = new UserRepository();
    super(userRepository);
  }

  // Create new user
  async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.repository.findByEmail(userData.email);
      if (existingUser) {
        throw ApiError.conflict('User with this email already exists');
      }

      const existingPhone = await this.repository.findByPhone(userData.phone);
      if (existingPhone) {
        throw ApiError.conflict('User with this phone number already exists');
      }

      // Generate employee ID if not provided
      if (!userData.employeeId) {
        userData.employeeId = businessUtils.generateCustomerId('EMP');
      }

      // Hash password
      userData.password = await hashPassword(userData.password);

      // Create user
      const user = await this.repository.create(userData);

      logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  // Authenticate user
  async authenticateUser(email, password, ip) {
    try {
      // Find user by email
      const user = await this.repository.findByEmail(email);
      if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
      }

      // Check if account is locked
      if (user.isLocked) {
        throw ApiError.unauthorized('Account is temporarily locked due to too many failed login attempts');
      }

      // Check if account is active
      if (user.status !== 'active') {
        throw ApiError.unauthorized('Account is not active');
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        // Increment login attempts
        await user.incrementLoginAttempts();
        throw ApiError.unauthorized('Invalid email or password');
      }

      // Reset login attempts and update last login
      await user.resetLoginAttempts();
      await user.updateLastLogin(ip);

      logger.info('User authenticated successfully', {
        userId: user.id,
        email: user.email,
        ip
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Authentication error:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const user = await this.repository.updateProfile(userId, profileData);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      logger.info('User profile updated', {
        userId: user.id,
        updatedFields: Object.keys(profileData)
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Change user password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user with password
      const user = await this.repository.findByEmail(
        (await this.repository.findById(userId)).email
      );

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw ApiError.badRequest('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await this.repository.updatePassword(userId, hashedNewPassword);

      logger.info('Password changed successfully', { userId });

      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not
        return { message: 'If the email exists, a reset link has been sent' };
      }

      // Generate reset token
      const resetToken = stringUtils.generateRandomString(32);
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token
      await this.repository.setResetPasswordToken(user.id, resetToken, resetExpiry);

      // TODO: Send email with reset link
      // await emailService.sendPasswordResetEmail(user.email, resetToken);

      logger.info('Password reset requested', {
        userId: user.id,
        email: user.email
      });

      return { message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      logger.error('Error in password reset:', error);
      throw error;
    }
  }

  // Confirm password reset
  async confirmPasswordReset(token, newPassword) {
    try {
      const user = await this.repository.findByResetToken(token);
      if (!user) {
        throw ApiError.badRequest('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password and clear reset token
      await this.repository.updatePassword(user.id, hashedPassword);
      await this.repository.clearResetPasswordToken(user.id);

      logger.info('Password reset completed', { userId: user.id });

      return { message: 'Password reset successfully' };
    } catch (error) {
      logger.error('Error confirming password reset:', error);
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role, options = {}) {
    try {
      return await this.repository.findByRole(role, options);
    } catch (error) {
      throw error;
    }
  }

  // Get users by department
  async getUsersByDepartment(department, options = {}) {
    try {
      return await this.repository.findByDepartment(department, options);
    } catch (error) {
      throw error;
    }
  }

  // Search users
  async searchUsers(searchTerm, options = {}) {
    try {
      return await this.repository.searchUsers(searchTerm, options);
    } catch (error) {
      throw error;
    }
  }

  // Update user status
  async updateUserStatus(userId, status, updatedBy) {
    try {
      const user = await this.repository.updateStatus(userId, status);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      logger.info('User status updated', {
        userId,
        newStatus: status,
        updatedBy
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw error;
    }
  }

  // Update user permissions
  async updateUserPermissions(userId, permissions, updatedBy) {
    try {
      const user = await this.repository.updatePermissions(userId, permissions);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      logger.info('User permissions updated', {
        userId,
        permissions,
        updatedBy
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Error updating user permissions:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStatistics() {
    try {
      return await this.repository.getUserStats();
    } catch (error) {
      throw error;
    }
  }

  // Get dashboard data
  async getDashboardData() {
    try {
      return await this.repository.getDashboardData();
    } catch (error) {
      throw error;
    }
  }

  // Get team hierarchy
  async getTeamHierarchy(managerId = null) {
    try {
      return await this.repository.getTeamHierarchy(managerId);
    } catch (error) {
      throw error;
    }
  }

  // Assign manager to user
  async assignManager(userId, managerId) {
    try {
      // Verify manager exists and is active
      const manager = await this.repository.findById(managerId);
      if (!manager || manager.status !== 'active') {
        throw ApiError.badRequest('Invalid manager');
      }

      // Verify manager has appropriate role
      const managerRoles = ['admin', 'manager', 'team-lead'];
      if (!managerRoles.includes(manager.role)) {
        throw ApiError.badRequest('User cannot be assigned as manager');
      }

      const user = await this.repository.update(userId, { manager: managerId });
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      logger.info('Manager assigned to user', {
        userId,
        managerId,
        managerName: manager.fullName
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Error assigning manager:', error);
      throw error;
    }
  }

  // Update performance metrics
  async updatePerformanceMetrics(userId, metrics) {
    try {
      const user = await this.repository.updatePerformanceMetrics(userId, metrics);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      logger.info('Performance metrics updated', {
        userId,
        metrics
      });

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Error updating performance metrics:', error);
      throw error;
    }
  }

  // Get users for performance review
  async getUsersForPerformanceReview() {
    try {
      return await this.repository.getUsersForPerformanceReview();
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateStatus(userIds, status, updatedBy) {
    try {
      const result = await this.repository.bulkUpdateStatus(userIds, status);

      logger.info('Bulk status update completed', {
        userIds,
        status,
        updatedBy,
        modifiedCount: result.modifiedCount
      });

      return {
        message: `${result.modifiedCount} users updated successfully`,
        modifiedCount: result.modifiedCount
      };
    } catch (error) {
      logger.error('Error in bulk status update:', error);
      throw error;
    }
  }

  // Get users by permission
  async getUsersByPermission(permission) {
    try {
      return await this.repository.getUsersByPermission(permission);
    } catch (error) {
      throw error;
    }
  }

  // Verify user permissions
  async verifyUserPermission(userId, permission) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      return user.hasPermission(permission);
    } catch (error) {
      throw error;
    }
  }

  // Get user's subordinates
  async getUserSubordinates(userId) {
    try {
      return await this.repository.getUsersByManager(userId);
    } catch (error) {
      throw error;
    }
  }

  // Validate user business rules
  async validateUserBusinessRules(userData) {
    const errors = [];

    // Check age requirement
    if (userData.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear();
      if (age < 18 || age > 65) {
        errors.push('User age must be between 18 and 65 years');
      }
    }

    // Check role hierarchy
    if (userData.role && userData.manager) {
      const manager = await this.repository.findById(userData.manager);
      if (manager) {
        const roleHierarchy = {
          'user': ['team-lead', 'manager', 'admin'],
          'collector': ['team-lead', 'manager', 'admin'],
          'team-lead': ['manager', 'admin'],
          'manager': ['admin']
        };

        const allowedManagerRoles = roleHierarchy[userData.role] || [];
        if (!allowedManagerRoles.includes(manager.role)) {
          errors.push(`${userData.role} cannot report to ${manager.role}`);
        }
      }
    }

    if (errors.length > 0) {
      throw ApiError.badRequest('Validation failed', errors);
    }

    return true;
  }

  // Health check
  async healthCheck() {
    try {
      const totalUsers = await this.repository.count();
      const activeUsers = await this.repository.count({ status: 'active' });
      
      return {
        status: 'healthy',
        service: 'UserService',
        totalUsers,
        activeUsers,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'UserService',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = UserService;