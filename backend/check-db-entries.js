const mongoose = require('mongoose');
require('colors');

// Import models
const User = require('./src/models/user.model');
const Customer = require('./src/models/customer.model');
const Loan = require('./src/models/loan.model');
const Payment = require('./src/models/payment.model');
const Document = require('./src/models/document.model');
const Disbursement = require('./src/models/disbursement.model');

const checkDatabaseEntries = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB'.green);

    // Count entries in each collection
    const counts = {
      users: await User.countDocuments(),
      customers: await Customer.countDocuments(),
      loans: await Loan.countDocuments(),
      payments: await Payment.countDocuments(),
      documents: await Document.countDocuments(),
      disbursements: await Disbursement.countDocuments()
    };

    // Display results
    console.log('\n=== DATABASE ENTRY COUNTS ==='.cyan.bold);
    console.log(`Users:        ${counts.users}`.yellow);
    console.log(`Customers:    ${counts.customers}`.yellow);
    console.log(`Loans:        ${counts.loans}`.yellow);
    console.log(`Payments:     ${counts.payments}`.yellow);
    console.log(`Documents:    ${counts.documents}`.yellow);
    console.log(`Disbursements: ${counts.disbursements}`.yellow);
    
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    console.log(`\nTotal Entries: ${total}`.green.bold);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB'.green);
  } catch (error) {
    console.error('Error:', error.message.red);
    process.exit(1);
  }
};

// Load environment variables
require('dotenv').config();

// Run the check
checkDatabaseEntries();