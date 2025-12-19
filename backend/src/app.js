require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(compression());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

try {
  app.use('/api/v1/auth', require('../routes/auth'));
} catch (e) {
  console.error('Auth route error:', e.message);
}

try {
  app.use('/api/v1/loans', require('../routes/loans'));
} catch (e) {
  console.error('Loans route error:', e.message);
}

try {
  app.use('/api/v1/customers', require('../routes/customers'));
} catch (e) {
  console.error('Customers route error:', e.message);
}

try {
  app.use('/api/v1/payments', require('../routes/payments'));
} catch (e) {
  console.error('Payments route error:', e.message);
}

try {
  app.use('/api/v1/dashboard', require('../routes/dashboard'));
} catch (e) {
  console.error('Dashboard route error:', e.message);
}

try {
  app.use('/api/v1/reports', require('./routes/reports.routes'));
} catch (e) {
  console.error('Reports route error:', e.message);
}

try {
  app.use('/api/v1/legal', require('../routes/legal'));
} catch (e) {
  console.error('Legal route error:', e.message);
}

try {
  app.use('/api/v1/admin', require('../routes/admin'));
} catch (e) {
  console.error('Admin route error:', e.message);
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
