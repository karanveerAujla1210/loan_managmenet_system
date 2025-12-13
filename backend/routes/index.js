const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const customerRoutes = require('./customers');
const loanRoutes = require('./loans');
const paymentRoutes = require('./payments');
const dashboardRoutes = require('./dashboard');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.get('/', (req, res) => {
  res.json({ message: 'NBFC Loan Management API' });
});

// Route handlers
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/loans', loanRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
