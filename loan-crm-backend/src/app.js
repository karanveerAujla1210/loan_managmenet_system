const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { globalErrorHandler } = require('./utils/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./config/logger');

// Import routes
const userRoutes = require('./routes/user.routes');
const loanRoutes = require('./routes/loan.routes');
const paymentRoutes = require('./routes/payment.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const collectionRoutes = require('./routes/collection.routes');
const legalRoutes = require('./routes/legal.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
app.use('/api/', apiLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Loan CRM Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/legal', legalRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Swagger documentation
if (process.env.NODE_ENV !== 'production') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Handle undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;