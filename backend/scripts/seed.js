require('colors');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Models
const User = require('../src/models/user.model');
const Customer = require('../src/models/customer.model');
const Loan = require('../src/models/loan.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nbfc_loan_management');
    console.log('MongoDB Connected for seeding'.green);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Loan.deleteMany({});
    
    console.log('Cleared existing data'.yellow);

    // Create admin user
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@loanmanagement.com',
      phone: '9999999999',
      passwordHash: 'Admin@123',
      role: 'admin'
    });

    // Create manager user
    const managerUser = await User.create({
      name: 'Loan Manager',
      email: 'manager@loanmanagement.com',
      phone: '9999999998',
      passwordHash: 'Manager@123',
      role: 'manager'
    });

    // Create sample customers
    const customer1 = await Customer.create({
      firstName: 'Rajesh',
      lastName: 'Kumar',
      phone: '9876543210',
      email: 'rajesh.kumar@email.com',
      dob: new Date('1985-06-15'),
      address: {
        line1: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      kyc: {
        aadhaar: '123456789012',
        pan: 'ABCDE1234F'
      },
      creditScore: 750,
      monthlyIncome: 50000,
      employmentType: 'salaried',
      createdBy: adminUser._id
    });

    const customer2 = await Customer.create({
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '9876543211',
      email: 'priya.sharma@email.com',
      dob: new Date('1990-03-22'),
      address: {
        line1: '456 Park Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      kyc: {
        aadhaar: '123456789013',
        pan: 'ABCDE1234G'
      },
      creditScore: 680,
      monthlyIncome: 35000,
      employmentType: 'self_employed',
      createdBy: managerUser._id
    });

    // Create sample loans
    await Loan.create({
      customerId: customer1._id,
      productCode: 'personal',
      principal: 500000,
      annualInterestRate: 12,
      termMonths: 24,
      status: 'applied',
      assignedAgent: managerUser._id
    });

    await Loan.create({
      customerId: customer2._id,
      productCode: 'business',
      principal: 1000000,
      annualInterestRate: 14,
      termMonths: 36,
      status: 'under_review',
      assignedAgent: managerUser._id
    });

    console.log('Sample data created successfully:'.green);
    console.log(`Admin User: admin@loanmanagement.com / Admin@123`.cyan);
    console.log(`Manager User: manager@loanmanagement.com / Manager@123`.cyan);
    console.log(`Customers: ${customer1.fullName}, ${customer2.fullName}`.cyan);
    console.log(`Loans: 2 sample loans created`.cyan);

  } catch (error) {
    console.error(`Seeding error: ${error.message}`.red);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  console.log('Seeding completed successfully!'.green.bold);
  process.exit(0);
};

runSeed().catch(err => {
  console.error(err);
  process.exit(1);
});