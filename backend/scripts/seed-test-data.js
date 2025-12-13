require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Loan = require('../src/models/loan.model');
const Customer = require('../src/models/customer.model');

async function seedTestData() {
  try {
    await connectDB();
    
    // Create test customer
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      phone: '9876543210',
      email: 'john.doe@example.com',
      dob: new Date('1990-01-01'),
      address: {
        line1: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      kyc: {
        isVerified: true
      }
    });
    await customer.save();
    console.log('Customer created:', customer.customerId);

    // Create test loan
    const loan = new Loan({
      loanId: 'LN000001',
      customerId: customer._id,
      productCode: 'personal',
      principal: 100000,
      annualInterestRate: 12,
      termMonths: 12,
      status: 'disbursed'
    });
    await loan.save();
    console.log('Loan created:', loan.loanId);

    console.log('Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedTestData();