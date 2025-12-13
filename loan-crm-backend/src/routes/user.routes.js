const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateRequest(schemas.createUser), userController.register);
router.post('/login', authLimiter, validateRequest(schemas.login), userController.login);

// Protected routes
router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

// Admin only routes
router.use(restrictTo('ADMIN'));
router.get('/', userController.getAllUsers);
router.patch('/:id', userController.updateUser);
router.patch('/:id/deactivate', userController.deactivateUser);

module.exports = router;