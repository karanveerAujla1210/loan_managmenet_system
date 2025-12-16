const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const customerRoutes = require('./customers');
const loanRoutes = require('./loans');
const paymentRoutes = require('./payments');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');
const auditRoutes = require('./audit');
const reassignRoutes = require('./reassign');
const promiseRoutes = require('./promise');
const legalRoutes = require('./legal');

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
router.use('/admin', adminRoutes);
router.use('/audit', auditRoutes);
router.use('/loans', promiseRoutes);
router.use('/promises', promiseRoutes);
router.use('/loans', reassignRoutes);
router.use('/legal', legalRoutes);

module.exports = router;
