const express = require('express');
const { AuthController, loginValidation, registerValidation } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/login', loginValidation, AuthController.login);
router.post('/register', registerValidation, AuthController.register);

// Protected routes
router.get('/me', protect, AuthController.getMe);

module.exports = router;