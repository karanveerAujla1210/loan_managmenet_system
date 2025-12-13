require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

// Import middleware
const { requestLogger } = require('./middleware/logger');
const { globalRateLimit } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { validateApiKey } = require('./middleware/auth');

// Import routes
const routes = require('./routes');

// Import config
const logger = require('./config/logger');

const app = express();

// Trust proxy
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// Security middleware
if (process.env.HELMET_ENABLED === 'true') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
}

// Compression
if (process.env.COMPRESSION_ENABLED === 'true') {
  app.use(compression());
}

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security sanitization
if (process.env.MONGO_SANITIZE_ENABLED === 'true') {
  app.use(mongoSanitize());
}

if (process.env.XSS_CLEAN_ENABLED === 'true') {
  app.use(xss());
}

if (process.env.HPP_ENABLED === 'true') {
  app.use(hpp());
}

// Redis session store
let redisClient;
if (process.env.NODE_ENV === 'production') {
  redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_SESSION_DB || 1
  });

  redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
}

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(globalRateLimit);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/v1', routes);

// Swagger documentation
if (process.env.SWAGGER_ENABLED === 'true') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../docs/swagger.json');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }'
  }));
}

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;