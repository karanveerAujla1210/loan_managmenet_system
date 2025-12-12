const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const setupSecurity = require('./middlewares/security');
const { collectHttpMetrics, healthCheck, metricsEndpoint } = require('./middlewares/monitoring');
const { logger } = require('./config/logger');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const customerRoutes = require('./modules/customers/customers.routes');
const loanRoutes = require('./modules/loans/loans.routes');
const collectionsRoutes = require('./modules/collections/collections.routes');
const paymentsRoutes = require('./modules/payments/payments.routes');
const eventsRoutes = require('./modules/events/events.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// Security middleware
setupSecurity(app);

// Basic middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Metrics collection
app.use(collectHttpMetrics);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/collections', collectionsRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Health and metrics endpoints
app.get('/health', healthCheck);
app.get('/metrics', metricsEndpoint);
app.get('/api/v1/health', healthCheck);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

module.exports = app;