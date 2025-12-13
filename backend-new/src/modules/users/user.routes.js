const express = require('express');
const UserController = require('./user.controller');
const { authenticate, authorize, hasPermission } = require('../../middleware/auth');
const { 
  authRateLimit, 
  passwordResetRateLimit,
  searchRateLimit,
  exportRateLimit 
} = require('../../middleware/rateLimiter');
const { 
  userValidations, 
  handleValidationErrors 
} = require('../../middleware/validation');
const { auditLogger, businessLogger } = require('../../middleware/logger');

const router = express.Router();
const userController = new UserController();

// Public routes (no authentication required)
router.post('/register', 
  authRateLimit,
  userValidations.register,
  handleValidationErrors,
  auditLogger('USER_REGISTRATION'),
  userController.register
);

router.post('/login',
  authRateLimit,
  userValidations.login,
  handleValidationErrors,
  auditLogger('USER_LOGIN'),
  userController.login
);

router.post('/forgot-password',
  passwordResetRateLimit,
  [userValidations.email],
  handleValidationErrors,
  auditLogger('PASSWORD_RESET_REQUEST'),
  userController.forgotPassword
);

router.post('/reset-password',
  passwordResetRateLimit,
  [
    userValidations.password,
    userValidations.commonValidations.token
  ],
  handleValidationErrors,
  auditLogger('PASSWORD_RESET'),
  userController.resetPassword
);

// Protected routes (authentication required)
router.use(authenticate);

// User profile routes
router.get('/profile',
  businessLogger('GET_USER_PROFILE'),
  userController.getProfile
);

router.put('/profile',
  userValidations.updateProfile,
  handleValidationErrors,
  businessLogger('UPDATE_USER_PROFILE'),
  userController.updateProfile
);

router.post('/change-password',
  userValidations.changePassword,
  handleValidationErrors,
  auditLogger('CHANGE_PASSWORD'),
  userController.changePassword
);

router.post('/logout',
  auditLogger('USER_LOGOUT'),
  userController.logout
);

// User management routes (require specific permissions)
router.get('/',
  hasPermission('users.read'),
  businessLogger('GET_ALL_USERS'),
  userController.getAll
);

router.post('/',
  hasPermission('users.create'),
  userValidations.register,
  handleValidationErrors,
  businessLogger('CREATE_USER'),
  userController.create
);

router.get('/search',
  searchRateLimit,
  hasPermission('users.read'),
  businessLogger('SEARCH_USERS'),
  userController.searchUsers
);

router.get('/stats',
  hasPermission('users.read'),
  businessLogger('GET_USER_STATS'),
  userController.getUserStats
);

router.get('/dashboard',
  authorize('admin', 'manager'),
  businessLogger('GET_USER_DASHBOARD'),
  userController.getDashboard
);

router.get('/hierarchy',
  hasPermission('users.read'),
  businessLogger('GET_TEAM_HIERARCHY'),
  userController.getTeamHierarchy
);

router.get('/performance-review',
  authorize('admin', 'manager'),
  businessLogger('GET_USERS_FOR_PERFORMANCE_REVIEW'),
  userController.getUsersForPerformanceReview
);

router.get('/export',
  exportRateLimit,
  hasPermission('users.read'),
  auditLogger('EXPORT_USERS'),
  userController.exportUsers
);

// Role-based routes
router.get('/role/:role',
  hasPermission('users.read'),
  businessLogger('GET_USERS_BY_ROLE'),
  userController.getUsersByRole
);

router.get('/department/:department',
  hasPermission('users.read'),
  businessLogger('GET_USERS_BY_DEPARTMENT'),
  userController.getUsersByDepartment
);

router.get('/permission/:permission',
  hasPermission('users.read'),
  businessLogger('GET_USERS_BY_PERMISSION'),
  userController.getUsersByPermission
);

// Individual user routes
router.get('/:id',
  hasPermission('users.read'),
  userValidations.commonValidations.mongoId,
  handleValidationErrors,
  businessLogger('GET_USER_BY_ID'),
  userController.getById
);

router.put('/:id',
  hasPermission('users.update'),
  userValidations.commonValidations.mongoId,
  userValidations.updateProfile,
  handleValidationErrors,
  businessLogger('UPDATE_USER'),
  userController.update
);

router.delete('/:id',
  hasPermission('users.delete'),
  userValidations.commonValidations.mongoId,
  handleValidationErrors,
  auditLogger('DELETE_USER'),
  userController.delete
);

router.post('/:id/restore',
  hasPermission('users.update'),
  userValidations.commonValidations.mongoId,
  handleValidationErrors,
  auditLogger('RESTORE_USER'),
  userController.restore
);

// Admin-only routes
router.put('/:id/status',
  authorize('admin', 'manager'),
  userValidations.commonValidations.mongoId,
  [
    userValidations.body('status')
      .isIn(['active', 'inactive', 'suspended', 'terminated'])
      .withMessage('Invalid status')
  ],
  handleValidationErrors,
  auditLogger('UPDATE_USER_STATUS'),
  userController.updateUserStatus
);

router.put('/:id/permissions',
  authorize('admin'),
  userValidations.commonValidations.mongoId,
  [
    userValidations.body('permissions')
      .isArray()
      .withMessage('Permissions must be an array')
  ],
  handleValidationErrors,
  auditLogger('UPDATE_USER_PERMISSIONS'),
  userController.updateUserPermissions
);

router.put('/:id/manager',
  authorize('admin', 'manager'),
  userValidations.commonValidations.mongoId,
  [
    userValidations.body('managerId')
      .isMongoId()
      .withMessage('Invalid manager ID')
  ],
  handleValidationErrors,
  businessLogger('ASSIGN_MANAGER'),
  userController.assignManager
);

router.put('/:id/performance',
  authorize('admin', 'manager'),
  userValidations.commonValidations.mongoId,
  [
    userValidations.body('totalLoansProcessed')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total loans processed must be a non-negative integer'),
    userValidations.body('totalCollectionsAmount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Total collections amount must be a non-negative number'),
    userValidations.body('averageResponseTime')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Average response time must be a non-negative number'),
    userValidations.body('customerSatisfactionRating')
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage('Customer satisfaction rating must be between 1 and 5')
  ],
  handleValidationErrors,
  businessLogger('UPDATE_PERFORMANCE_METRICS'),
  userController.updatePerformanceMetrics
);

router.get('/:id/subordinates',
  hasPermission('users.read'),
  userValidations.commonValidations.mongoId,
  handleValidationErrors,
  businessLogger('GET_USER_SUBORDINATES'),
  userController.getUserSubordinates
);

router.get('/:id/permissions/:permission',
  hasPermission('users.read'),
  userValidations.commonValidations.mongoId,
  handleValidationErrors,
  businessLogger('CHECK_USER_PERMISSION'),
  userController.checkPermission
);

// Bulk operations
router.post('/bulk/status',
  authorize('admin'),
  [
    userValidations.body('userIds')
      .isArray({ min: 1 })
      .withMessage('User IDs array is required'),
    userValidations.body('userIds.*')
      .isMongoId()
      .withMessage('Invalid user ID'),
    userValidations.body('status')
      .isIn(['active', 'inactive', 'suspended', 'terminated'])
      .withMessage('Invalid status')
  ],
  handleValidationErrors,
  auditLogger('BULK_UPDATE_USER_STATUS'),
  userController.bulkUpdateStatus
);

// Health check
router.get('/health/check',
  userController.healthCheck
);

module.exports = router;