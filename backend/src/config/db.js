const mongoose = require('mongoose');
const { logger } = require('./logger');

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@'));
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Full error:', error);
    logger.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;