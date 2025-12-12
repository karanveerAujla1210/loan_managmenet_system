const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@nbfc.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999'
    });
    await admin.save();

    // Create manager
    const manager = new User({
      name: 'Manager User',
      email: 'manager@nbfc.com',
      password: 'manager123',
      role: 'manager',
      phone: '9999999998'
    });
    await manager.save();

    // Create field agent
    const agent = new User({
      name: 'Field Agent',
      email: 'agent@nbfc.com',
      password: 'agent123',
      role: 'field_agent',
      phone: '9999999997'
    });
    await agent.save();

    // Create sample customers
    const customers = [
      {
        customerId: 'CUST001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        kyc: {
          aadhar: '1234-5678-9012',
          pan: 'ABCDE1234F',
          status: 'verified'
        }
      },
      {
        customerId: 'CUST002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        address: {
          street: '456 Oak Ave',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        kyc: {
          aadhar: '2345-6789-0123',
          pan: 'BCDEF2345G',
          status: 'verified'
        }
      }
    ];

    await Customer.insertMany(customers);

    console.log('Seed data created successfully');
    console.log('Admin: admin@nbfc.com / admin123');
    console.log('Manager: manager@nbfc.com / manager123');
    console.log('Agent: agent@nbfc.com / agent123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();