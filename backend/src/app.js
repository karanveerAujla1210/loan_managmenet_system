require('colors');
const express = require('express');
const cors = require('cors');

const app = express();

// CORS MUST BE FIRST - before all other middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Route imports
const authRoutes = require('./routes/auth.new');
const loanRoutes = require('./routes/loans.new');
const uploadRoutes = require('./routes/upload.routes');
const branchRoutes = require('./routes/branches');
const overdueRoutes = require('./routes/overdue.routes');
const legalRoutes = require('./routes/legal.routes');
const reconciliationRoutes = require('./routes/reconciliation.routes');
const paymentRoutes = require('./routes/payments.routes');
const reportsRoutes = require('./routes/reports.routes');
const disputesRoutes = require('./routes/disputes.routes');
const promisesRoutes = require('./routes/promises.routes');
const collectorPerformanceRoutes = require('./routes/collector-performance.routes');
const misRoutes = require('./routes/mis.routes');
const reconciliationAdvancedRoutes = require('./routes/reconciliation-advanced.routes');
const loansAdvancedRoutes = require('./routes/loans-advanced.routes');
const auditRoutes = require('./routes/audit.routes');
const legalAdvancedRoutes = require('./routes/legal.advanced.routes');
const paymentManualRoutes = require('./routes/payment-manual.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const importRoutes = require('./routes/import.routes');
const testDataRoutes = require('./routes/test-data.routes');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/overdue', overdueRoutes);
app.use('/api/v1/legal', legalRoutes);
app.use('/api/v1/reconciliation', reconciliationRoutes);
app.use('/api/v1/reconciliation-advanced', reconciliationAdvancedRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/disputes', disputesRoutes);
app.use('/api/v1/promises', promisesRoutes);
app.use('/api/v1/collector-performance', collectorPerformanceRoutes);
app.use('/api/v1/mis', misRoutes);
app.use('/api/v1/loans-advanced', loansAdvancedRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/legal-advanced', legalAdvancedRoutes);
app.use('/api/v1/payments-manual', paymentManualRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/import', importRoutes);
app.use('/api/v1/test-data', testDataRoutes);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = app;
