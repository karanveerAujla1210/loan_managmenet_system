const express = require('express');
const { protect, checkPermission } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

// Placeholder routes - controllers to be implemented
router.get('/', checkPermission('VIEW_PAYMENT'), (req, res) => {
  res.json({ message: 'Payment routes - to be implemented' });
});

router.post('/', paymentLimiter, checkPermission('CREATE_PAYMENT'), (req, res) => {
  res.json({ message: 'Create payment - to be implemented' });
});

module.exports = router;