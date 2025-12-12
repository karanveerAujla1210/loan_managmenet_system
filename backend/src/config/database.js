const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Modern Mongoose doesn't need these options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`Database error: ${err}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected'.yellow);
    });

    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;