/**
 * Database Initialization Script
 * Creates indexes and seed data
 */

const mongoose = require('mongoose');
const { User, LoanProduct } = require('../models');

const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');

    // Create indexes
    console.log('📍 Creating indexes...');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ active: 1 });

    await LoanProduct.collection.createIndex({ productCode: 1 }, { unique: true });
    await LoanProduct.collection.createIndex({ active: 1 });

    console.log('✅ Indexes created');

    // Seed default loan product
    console.log('🌱 Seeding default loan product...');
    const existingProduct = await LoanProduct.findOne({ productCode: 'BL-100' });
    
    if (!existingProduct) {
      await LoanProduct.create({
        productCode: 'BL-100',
        productName: 'Business Loan 100 Days',
        tenureDays: 100,
        totalInstalments: 14,
        frequency: 'WEEKLY',
        interestType: 'FLAT',
        interestRate: 20,
        penaltyType: 'FLAT',
        penaltyRate: 250,
        allowPartialPayment: true,
        active: true
      });
      console.log('✅ Default loan product created');
    } else {
      console.log('⏭️  Default loan product already exists');
    }

    // Seed default admin user
    console.log('🌱 Seeding default admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@loancrm.com' });
    
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: 'admin@loancrm.com',
        password: 'Admin@123456',
        role: 'ADMIN',
        active: true
      });
      console.log('✅ Default admin user created');
      console.log('   Email: admin@loancrm.com');
      console.log('   Password: Admin@123456');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    console.log('✨ Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-crm')
    .then(() => initializeDatabase())
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = initializeDatabase;
