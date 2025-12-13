const BaseRepository = require('../../core/BaseRepository');
const User = require('./user.model');
const ApiError = require('../../utils/ApiError');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // Find user by email
  async findByEmail(email) {
    try {
      return await this.model.findByEmail(email).select('+password');
    } catch (error) {
      throw error;
    }
  }

  // Find user by phone
  async findByPhone(phone) {
    try {
      return await this.model.findByPhone(phone);
    } catch (error) {
      throw error;
    }
  }

  // Find user by employee ID
  async findByEmployeeId(employeeId) {
    try {
      return await this.model.findOne({ employeeId, isDeleted: false });
    } catch (error) {
      throw error;
    }
  }

  // Find users by role
  async findByRole(role, options = {}) {
    try {
      return await this.model.findByRole(role);
    } catch (error) {
      throw error;
    }
  }

  // Find users by department
  async findByDepartment(department, options = {}) {
    try {
      return await this.model.findByDepartment(department);
    } catch (error) {
      throw error;
    }
  }

  // Get active users
  async getActiveUsers(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 }
      } = options;

      return await this.model.paginate(
        { status: 'active', isDeleted: false },
        { page, limit, sort }
      );
    } catch (error) {
      throw error;
    }
  }

  // Get users by manager
  async getUsersByManager(managerId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 }
      } = options;

      return await this.model.paginate(
        { manager: managerId, isDeleted: false },
        { page, limit, sort }
      );
    } catch (error) {
      throw error;
    }
  }

  // Search users
  async searchUsers(searchTerm, options = {}) {
    try {
      const searchFields = ['firstName', 'lastName', 'email', 'phone', 'employeeId'];
      return await this.search(searchTerm, { ...options, fields: searchFields });
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const allowedFields = [
        'firstName', 'lastName', 'phone', 'address', 'profile',
        'settings', 'workSchedule'
      ];

      const updateData = {};
      allowedFields.forEach(field => {
        if (profileData[field] !== undefined) {
          updateData[field] = profileData[field];
        }
      });

      return await this.update(userId, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Update user password
  async updatePassword(userId, hashedPassword) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
          'security.passwordChangedAt': new Date()
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  async updateLastLogin(userId, ip) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          'security.lastLogin': new Date(),
          'security.lastLoginIP': ip
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // Increment login attempts
  async incrementLoginAttempts(userId) {
    try {
      const user = await this.findById(userId);
      if (user) {
        return await user.incrementLoginAttempts();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Reset login attempts
  async resetLoginAttempts(userId) {
    try {
      const user = await this.findById(userId);
      if (user) {
        return await user.resetLoginAttempts();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Set reset password token
  async setResetPasswordToken(userId, token, expiry) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          'security.resetPasswordToken': token,
          'security.resetPasswordExpire': expiry
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Find user by reset token
  async findByResetToken(token) {
    try {
      return await this.model.findOne({
        'security.resetPasswordToken': token,
        'security.resetPasswordExpire': { $gt: Date.now() },
        isDeleted: false
      });
    } catch (error) {
      throw error;
    }
  }

  // Clear reset password token
  async clearResetPasswordToken(userId) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          $unset: {
            'security.resetPasswordToken': 1,
            'security.resetPasswordExpire': 1
          }
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Update email verification
  async updateEmailVerification(userId, verified = true) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          'security.emailVerified': verified,
          $unset: verified ? { 'security.emailVerificationToken': 1 } : {}
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Update phone verification
  async updatePhoneVerification(userId, verified = true) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        { 'security.phoneVerified': verified },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Update user status
  async updateStatus(userId, status) {
    try {
      const validStatuses = ['active', 'inactive', 'suspended', 'terminated'];
      if (!validStatuses.includes(status)) {
        throw new ApiError('Invalid status', 400);
      }

      const updateData = { status };
      if (status === 'terminated') {
        updateData.terminationDate = new Date();
      }

      return await this.update(userId, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Update user permissions
  async updatePermissions(userId, permissions) {
    try {
      return await this.update(userId, { permissions });
    } catch (error) {
      throw error;
    }
  }

  // Update performance metrics
  async updatePerformanceMetrics(userId, metrics) {
    try {
      const updateData = {};
      
      if (metrics.totalLoansProcessed !== undefined) {
        updateData['performance.totalLoansProcessed'] = metrics.totalLoansProcessed;
      }
      
      if (metrics.totalCollectionsAmount !== undefined) {
        updateData['performance.totalCollectionsAmount'] = metrics.totalCollectionsAmount;
      }
      
      if (metrics.averageResponseTime !== undefined) {
        updateData['performance.averageResponseTime'] = metrics.averageResponseTime;
      }
      
      if (metrics.customerSatisfactionRating !== undefined) {
        updateData['performance.customerSatisfactionRating'] = metrics.customerSatisfactionRating;
      }

      updateData['performance.lastPerformanceReview'] = new Date();

      return await this.model.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      return await this.model.getUserStats();
    } catch (error) {
      throw error;
    }
  }

  // Get users dashboard data
  async getDashboardData() {
    try {
      const pipeline = [
        {
          $match: { isDeleted: false }
        },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            inactiveUsers: {
              $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
            },
            suspendedUsers: {
              $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] }
            },
            terminatedUsers: {
              $sum: { $cond: [{ $eq: ['$status', 'terminated'] }, 1, 0] }
            }
          }
        }
      ];

      const [stats] = await this.aggregate(pipeline);
      
      // Get role distribution
      const roleStats = await this.model.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get department distribution
      const departmentStats = await this.model.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get recent users (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentUsers = await this.count({
        createdAt: { $gte: thirtyDaysAgo }
      });

      return {
        ...stats,
        roleDistribution: roleStats,
        departmentDistribution: departmentStats,
        recentUsers
      };
    } catch (error) {
      throw error;
    }
  }

  // Get users with upcoming performance reviews
  async getUsersForPerformanceReview() {
    try {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      
      return await this.model.find({
        status: 'active',
        isDeleted: false,
        $or: [
          { 'performance.lastPerformanceReview': { $lt: sixMonthsAgo } },
          { 'performance.lastPerformanceReview': null }
        ]
      }).select('firstName lastName email role department performance.lastPerformanceReview');
    } catch (error) {
      throw error;
    }
  }

  // Get team hierarchy
  async getTeamHierarchy(managerId = null) {
    try {
      const pipeline = [
        {
          $match: {
            isDeleted: false,
            status: 'active',
            ...(managerId ? { manager: managerId } : { manager: null })
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'manager',
            as: 'subordinates'
          }
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            department: 1,
            subordinates: {
              $map: {
                input: '$subordinates',
                as: 'sub',
                in: {
                  _id: '$$sub._id',
                  firstName: '$$sub.firstName',
                  lastName: '$$sub.lastName',
                  email: '$$sub.email',
                  role: '$$sub.role'
                }
              }
            }
          }
        }
      ];

      return await this.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  // Bulk update user status
  async bulkUpdateStatus(userIds, status) {
    try {
      const validStatuses = ['active', 'inactive', 'suspended', 'terminated'];
      if (!validStatuses.includes(status)) {
        throw new ApiError('Invalid status', 400);
      }

      const updateData = { status };
      if (status === 'terminated') {
        updateData.terminationDate = new Date();
      }

      return await this.model.updateMany(
        { _id: { $in: userIds }, isDeleted: false },
        updateData
      );
    } catch (error) {
      throw error;
    }
  }

  // Get users by permission
  async getUsersByPermission(permission) {
    try {
      return await this.model.find({
        $or: [
          { permissions: permission },
          { role: 'admin' }
        ],
        status: 'active',
        isDeleted: false
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;