require('dotenv').config();
const app = require('./app-production');
const { connectDB } = require('./config/database-optimized');
const { initDPDSafeCron } = require('./jobs/dpd-safe-cron');
const { isFeatureEnabled } = require('./config/feature-flags');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected'.green);

    // Initialize cron jobs
    if (isFeatureEnabled('CRON_ENABLED')) {
      initDPDSafeCron();
      console.log('Cron jobs initialized'.green);
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`.yellow.bold);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`.yellow);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled rejection:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully'.yellow);
      server.close(() => {
        console.log('Process terminated'.red);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
