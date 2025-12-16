require('colors');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// Middleware
const { auth, authorize } = require('./middlewares/auth.middleware');
const financialGuard = require('./middlewares/financial-guard.middleware');
const auditMiddleware = require('./middlewares/audit.middleware');
const permissionGuard = require('./middlewares/permission-guard.middleware');
const immutabilityGuard = require('./middlewares/immutability-guard.middleware');
const reconciliationLockGuard = require('./middlewares/reconciliation-lock.middleware');

// Routes
const authRoutes = require('./routes/auth.new');
const loanRoutes = require('./routes/loans.new');
const paymentsSafeRoutes = require('./routes/payments-safe.routes');
const disputesRoutes = require('./routes/disputes.routes');
const promisesRoutes = require('./routes/promises.routes');
const collectorPerformanceRoutes = require('./routes/collector-performance.routes');
const misRoutes = require('./routes/mis.routes');
const reconciliationAdvancedRoutes = require('./routes/reconciliation-advanced.routes');
const auditRoutes = require('./routes/audit.routes');
const legalAdvancedRoutes = require('./routes/legal.advanced.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Security
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date() });
});

// Routes with guards
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/loans', auth, permissionGuard, immutabilityGuard, financialGuard, loanRoutes);
app.use('/api/v1/payments', auth, permissionGuard, paymentsSafeRoutes);
app.use('/api/v1/disputes', auth, permissionGuard, financialGuard, disputesRoutes);
app.use('/api/v1/reconciliation', auth, permissionGuard, reconciliationLockGuard, reconciliationAdvancedRoutes);
app.use('/api/v1/promises', promisesRoutes);
app.use('/api/v1/collector-performance', collectorPerformanceRoutes);
app.use('/api/v1/mis', misRoutes);
app.use('/api/v1/reconciliation', reconciliationAdvancedRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/legal', legalAdvancedRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

module.exports = app;
