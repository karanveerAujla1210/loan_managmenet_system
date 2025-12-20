require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const loadRoute = (path, name) => {
  try {
    return require(path);
  } catch (e) {
    console.error(`Failed to load ${name} route:`, e.message);
    return null;
  }
};

// Load and register routes
const authRoute = loadRoute('../routes/auth.new', 'auth');
if (authRoute) app.use('/api/v1/auth', authRoute);

const loansRoute = loadRoute('../routes/loans.new', 'loans');
if (loansRoute) app.use('/api/v1/loans', loansRoute);

const customersRoute = loadRoute('../routes/customers', 'customers');
if (customersRoute) app.use('/api/v1/customers', customersRoute);

const paymentsRoute = loadRoute('../routes/payments.routes', 'payments');
if (paymentsRoute) app.use('/api/v1/payments', paymentsRoute);

const dashboardRoute = loadRoute('../routes/dashboard.routes', 'dashboard');
if (dashboardRoute) app.use('/api/v1/dashboard', dashboardRoute);

const reportsRoute = loadRoute('../routes/reports.routes', 'reports');
if (reportsRoute) app.use('/api/v1/reports', reportsRoute);

const legalRoute = loadRoute('../routes/legal.routes', 'legal');
if (legalRoute) app.use('/api/v1/legal', legalRoute);

const indexRoute = loadRoute('../routes/index', 'index');
if (indexRoute) app.use('/api/v1', indexRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' }
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

module.exports = app;
