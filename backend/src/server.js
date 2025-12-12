require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`.red);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(`Error: ${err.message}`.red);
      // Close server & exit process
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully'.yellow);
      server.close(() => {
        console.log('Process terminated'.red);
      });
    });

  } catch (error) {
    console.error(`Failed to start server: ${error.message}`.red);
    process.exit(1);
  }
};

startServer();