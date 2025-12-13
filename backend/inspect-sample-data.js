const mongoose = require('mongoose');
require('colors');
require('dotenv').config();

// Import models
const User = require('./src/models/user.model');
const Customer = require('./src/models/customer.model');
const Loan = require('./src/models/loan.model');

const inspectSampleData = async () => {
  try {
    console.log('🔍 Inspecting Sample Data...'.cyan.bold);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB'.green);

    // Get all customers with detailed info
    console.log('\n👥 CUSTOMERS'.yellow.bold);
    const customers = await Customer.find().lean();
    
    customers.forEach((customer, index) => {
      console.log(`\n${index + 1}. Customer ID: ${customer._id}`.cyan);
      console.log(`   Name: ${customer.firstName} ${customer.lastName || ''}`.white);
      console.log(`   Phone: ${customer.phone}`.white);
      console.log(`   Email: ${customer.email || 'Not provided'}`.gray);
      console.log(`   DOB: ${customer.dob || 'Not provided'}`.gray);
      console.log(`   Address: ${JSON.stringify(customer.address, null, 2)}`.gray);
      console.log(`   KYC: ${JSON.stringify(customer.kyc, null, 2)}`.gray);
      console.log(`   Active: ${customer.isActive}`.white);
      console.log(`   Created: ${customer.createdAt}`.gray);
    });

    // Get all loans
    console.log('\n💰 LOANS'.yellow.bold);
    const loans = await Loan.find().populate('customerId', 'firstName lastName phone').lean();
    
    loans.forEach((loan, index) => {
      console.log(`\n${index + 1}. Loan ID: ${loan._id}`.cyan);
      console.log(`   Customer: ${loan.customerId?.firstName} ${loan.customerId?.lastName || ''} (${loan.customerId?.phone})`.white);
      console.log(`   Amount: ₹${loan.amount}`.white);
      console.log(`   Status: ${loan.status}`.white);
      console.log(`   Interest Rate: ${loan.interestRate}%`.white);
      console.log(`   Term: ${loan.termMonths} months`.white);
      console.log(`   Created: ${loan.createdAt}`.gray);
    });

    // Get all users
    console.log('\n👤 USERS'.yellow.bold);
    const users = await User.find().select('-password').lean();
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user._id}`.cyan);
      console.log(`   Name: ${user.firstName} ${user.lastName}`.white);
      console.log(`   Email: ${user.email}`.white);
      console.log(`   Role: ${user.role}`.white);
      console.log(`   Active: ${user.isActive}`.white);
      console.log(`   Created: ${user.createdAt}`.gray);
    });

    console.log('\n✅ Sample data inspection completed!'.green.bold);

  } catch (error) {
    console.error('❌ Error during inspection:', error.message.red);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB'.gray);
  }
};

inspectSampleData();