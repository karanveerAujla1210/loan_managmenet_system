require('colors');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

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

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reports', reportsRoutes);

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
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
