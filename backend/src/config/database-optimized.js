const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      
      // Performance optimizations
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      
      // Compression
      compressors: 'zlib',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`Database error: ${err}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected'.yellow);
    });

    // Create indexes for better query performance
    await createIndexes();

    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`.red);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Customer indexes
    await db.collection('customers').createIndex({ phone: 1 }, { unique: true });
    await db.collection('customers').createIndex({ email: 1 }, { sparse: true });
    await db.collection('customers').createIndex({ createdAt: -1 });
    await db.collection('customers').createIndex({ 'kyc.isVerified': 1 });
    await db.collection('customers').createIndex({ creditScore: 1 });
    
    // Loan indexes
    await db.collection('loans').createIndex({ customerId: 1 });
    await db.collection('loans').createIndex({ status: 1 });
    await db.collection('loans').createIndex({ dpd: 1 });
    await db.collection('loans').createIndex({ bucket: 1 });
    await db.collection('loans').createIndex({ createdAt: -1 });
    await db.collection('loans').createIndex({ disbursedDate: -1 });
    await db.collection('loans').createIndex({ 'emi.dueDate': 1 });
    
    // Compound indexes for common queries
    await db.collection('loans').createIndex({ status: 1, dpd: 1 });
    await db.collection('loans').createIndex({ customerId: 1, status: 1 });
    
    // Payment indexes
    await db.collection('payments').createIndex({ loanId: 1 });
    await db.collection('payments').createIndex({ paymentDate: -1 });
    await db.collection('payments').createIndex({ status: 1 });
    
    // Compound indexes for payments
    await db.collection('payments').createIndex({ loanId: 1, paymentDate: -1 });
    
    console.log('Database indexes created successfully'.green);
  } catch (error) {
    console.error(`Index creation error: ${error.message}`.red);
  }
};

module.exports = { connectDB, createIndexes };