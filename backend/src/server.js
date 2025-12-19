require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database-optimized');
const { initDPDEngine } = require('./jobs/dpdEngine');
const { initStateEscalation } = require('./jobs/stateEscalation');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize cron jobs
    initDPDEngine();
    initStateEscalation();
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Error:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('Shutting down gracefully');
      server.close(() => process.exit(0));
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
