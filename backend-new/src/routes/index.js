const express = require('express');
const ApiResponse = require('../utils/ApiResponse');

// Import route modules
const userRoutes = require('../modules/users/user.routes');
// const customerRoutes = require('../modules/customers/customer.routes');
// const loanRoutes = require('../modules/loans/loan.routes');
// const paymentRoutes = require('../modules/payments/payment.routes');
// const collectionRoutes = require('../modules/collections/collection.routes');
// const creditRoutes = require('../modules/credit/credit.routes');
// const riskRoutes = require('../modules/risk/risk.routes');

const router = express.Router();

// API status endpoint
router.get('/', (req, res) => {
  res.json(
    ApiResponse.success('NBFC Loan Management API is running', {
      version: '2.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      endpoints: {
        users: '/api/v1/users',
        customers: '/api/v1/customers',
        loans: '/api/v1/loans',
        payments: '/api/v1/payments',
        collections: '/api/v1/collections',
        credit: '/api/v1/credit',
        risk: '/api/v1/risk',
        reports: '/api/v1/reports',
        health: '/api/v1/health'
      }
    })
  );
});

// Health check endpoint
router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '2.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
    },
    cpu: {
      usage: process.cpuUsage()
    }
  };

  res.json(ApiResponse.health('healthy', healthCheck));
});

// Mount route modules
router.use('/users', userRoutes);
// router.use('/customers', customerRoutes);
// router.use('/loans', loanRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/collections', collectionRoutes);
// router.use('/credit', creditRoutes);
// router.use('/risk', riskRoutes);

// Catch-all for undefined routes
router.all('*', (req, res) => {
  res.status(404).json(
    ApiResponse.notFound(`Route ${req.originalUrl} not found`)
  );
});

module.exports = router;