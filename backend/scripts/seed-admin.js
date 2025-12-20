require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-management');
    
    const existingUser = await User.findOne({ email: 'admin@loancrm.com' });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@loancrm.com',
      password: 'password',
      role: 'admin'
    });

    console.log('Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
