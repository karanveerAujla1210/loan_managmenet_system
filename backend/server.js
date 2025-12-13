// Enable colors in console
require('colors');

const express = require('express');
const connectDB = require('./src/config/database');
const cors = require('cors');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const errorHandler = require('./middleware/error');
require('dotenv').config();

// Route files
const auth = require('./routes/auth');
const customers = require('./routes/customers');
const loans = require('./routes/loans');
const payments = require('./routes/payments');
const loanEngine = require('./routes/loanEngine');
const dashboardApi = require('./routes/apiDashboard');

const app = express();

// Request logging
app.use(requestLogger);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Session middleware for CSRF
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
app.use('/api/', apiLimiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS with security settings
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/customers', customers);
app.use('/api/v1/loans', loans);
app.use('/api/v1/payments', payments);
app.use('/api/v1/loan-engine', loanEngine);
app.use('/api/dashboard', dashboardApi);

// Error handler middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});



const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`.red);
  console.error(err.stack);
  // Close server & exit process
  process.exit(1);
});

startServer();