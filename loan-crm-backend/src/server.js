const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const config = require('./config/env');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start cron jobs if enabled
if (config.ENABLE_CRON_JOBS) {
  require('./cron/dpdUpdater');
  require('./cron/legalEscalation');
  require('./cron/reconcilePayments');
  require('./cron/autoAssignCollectors');
  logger.info('Cron jobs started');
}

const port = config.PORT;
const server = app.listen(port, () => {
  logger.info(`Loan CRM Backend running on port ${port} in ${config.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});

module.exports = server;