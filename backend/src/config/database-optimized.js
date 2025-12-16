const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
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
    
    // Loan indexes
    await db.collection('loans').createIndex({ customerId: 1 });
    await db.collection('loans').createIndex({ status: 1 });
    await db.collection('loans').createIndex({ createdAt: -1 });
    
    // Payment indexes
    await db.collection('payments').createIndex({ loanId: 1 });
    await db.collection('payments').createIndex({ paymentDate: -1 });
    
    console.log('Database indexes created successfully'.green);
  } catch (error) {
    console.error(`Index creation error: ${error.message}`.red);
  }
};

module.exports = { connectDB, createIndexes };
