require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../modules/users/users.model');
const Customer = require('../modules/customers/customers.model');
const Loan = require('../modules/loans/loans.model');
const { generateLoanSchedule } = require('../utils/loanHelpers');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  console.log('Seeding users...');
  
  const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nbfc.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      employeeId: 'EMP001'
    },
    {
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@nbfc.com',
      password: 'manager123',
      role: 'manager',
      phone: '9876543211',
      employeeId: 'EMP002'
    },
    {
      firstName: 'Agent',
      lastName: 'One',
      email: 'agent1@nbfc.com',
      password: 'agent123',
      role: 'agent',
      phone: '9876543212',
      employeeId: 'EMP003'
    },
    {
      firstName: 'Agent',
      lastName: 'Two',
      email: 'agent2@nbfc.com',
      password: 'agent123',
      role: 'agent',
      phone: '9876543213',
      employeeId: 'EMP004'
    }
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }
  }
};

const seedCustomers = async () => {
  console.log('Seeding customers...');
  
  const customers = [
    {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '9876543220',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      dateOfBirth: new Date('1985-05-15'),
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      employmentInfo: {
        employer: 'Tech Corp',
        position: 'Software Engineer',
        monthlyIncome: 50000,
        employmentLength: 36
      },
      creditScore: 750,
      kyc: {
        status: 'verified',
        verifiedAt: new Date()
      }
    },
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@email.com',
      phone: '9876543221',
      address: {
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India'
      },
      dateOfBirth: new Date('1990-08-20'),
      aadharNumber: '123456789013',
      panNumber: 'ABCDE1234G',
      employmentInfo: {
        employer: 'Finance Ltd',
        position: 'Accountant',
        monthlyIncome: 40000,
        employmentLength: 24
      },
      creditScore: 720,
      kyc: {
        status: 'verified',
        verifiedAt: new Date()
      }
    }
  ];

  for (const customerData of customers) {
    const existingCustomer = await Customer.findOne({ email: customerData.email });
    if (!existingCustomer) {
      const customer = new Customer(customerData);
      await customer.save();
      console.log(`Created customer: ${customerData.email}`);
    }
  }
};

const seedLoans = async () => {
  console.log('Seeding loans...');
  
  const customers = await Customer.find().limit(2);
  const agents = await User.find({ role: 'agent' }).limit(2);
  
  if (customers.length === 0 || agents.length === 0) {
    console.log('No customers or agents found for loan seeding');
    return;
  }

  const loans = [
    {
      customerId: customers[0]._id,
      principalAmount: 100000,
      interestRate: 24,
      numberOfInstallments: 14,
      frequency: 'weekly',
      startDate: new Date(),
      agentId: agents[0]._id
    },
    {
      customerId: customers[1]._id,
      principalAmount: 50000,
      interestRate: 20,
      numberOfInstallments: 10,
      frequency: 'weekly',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      agentId: agents[1]._id
    }
  ];

  for (const loanData of loans) {
    const existingLoan = await Loan.findOne({ customerId: loanData.customerId });
    if (!existingLoan) {
      // Calculate loan details
      const totalAmount = loanData.principalAmount + (loanData.principalAmount * loanData.interestRate / 100);
      const installmentAmount = totalAmount / loanData.numberOfInstallments;
      
      // Generate loan ID
      const loanId = `LN${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      
      // Calculate end date
      const startDate = new Date(loanData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (loanData.numberOfInstallments * 7));

      // Generate schedule
      const schedule = generateLoanSchedule(loanData);

      const loan = new Loan({
        ...loanData,
        loanId,
        totalAmount,
        installmentAmount,
        endDate,
        outstandingAmount: totalAmount,
        schedule,
        events: [{
          type: 'created',
          description: 'Loan created',
          payload: { amount: loanData.principalAmount }
        }]
      });

      await loan.save();
      console.log(`Created loan: ${loanId}`);
    }
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await seedUsers();
    await seedCustomers();
    await seedLoans();
    
    console.log('Database seeding completed successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@nbfc.com / admin123');
    console.log('Manager: manager@nbfc.com / manager123');
    console.log('Agent: agent1@nbfc.com / agent123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };