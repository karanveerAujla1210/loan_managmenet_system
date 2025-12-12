const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'nbfc-loan-management'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeLoansGauge = new client.Gauge({
  name: 'active_loans_total',
  help: 'Total number of active loans'
});

const overdueLoansGauge = new client.Gauge({
  name: 'overdue_loans_total',
  help: 'Total number of overdue loans'
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeLoansGauge);
register.registerMetric(overdueLoansGauge);

// Middleware to collect HTTP metrics
const collectHttpMetrics = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// Health check endpoint
const healthCheck = async (req, res) => {
  const mongoose = require('mongoose');
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name
    }
  };

  // Check Redis if available
  try {
    const { getRedis } = require('../config/redis-optional');
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      health.redis = { status: 'connected' };
    } else {
      health.redis = { status: 'not_configured' };
    }
  } catch (error) {
    health.redis = { status: 'disconnected', error: error.message };
  }

  const statusCode = health.database.status === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
};

// Metrics endpoint
const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error.message);
  }
};

module.exports = {
  collectHttpMetrics,
  healthCheck,
  metricsEndpoint,
  register,
  metrics: {
    activeLoansGauge,
    overdueLoansGauge,
    httpRequestDuration,
    httpRequestsTotal
  }
};