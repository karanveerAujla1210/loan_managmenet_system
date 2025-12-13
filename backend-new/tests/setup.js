const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const redisClient = require('../src/config/redis');

// Global test setup
let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Connect to Redis (use test database)
  process.env.REDIS_DB = 15; // Use database 15 for tests
  await redisClient.connect();
  
  console.log('Test database connected');
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connections
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop in-memory MongoDB
  if (mongoServer) {
    await mongoServer.stop();
  }
  
  // Close Redis connection
  await redisClient.disconnect();
  
  console.log('Test database disconnected');
});

// Clear database before each test
beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Clear Redis cache
  if (redisClient.isReady()) {
    const client = redisClient.getClient();
    await client.flushdb();
  }
});

// Global test utilities
global.testUtils = {
  // Create test user
  createTestUser: async (userData = {}) => {
    const User = require('../src/modules/users/user.model');
    const { hashPassword } = require('../src/middleware/auth');
    
    const defaultUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '9876543210',
      password: await hashPassword('Test@123'),
      role: 'user',
      status: 'active'
    };
    
    return await User.create({ ...defaultUser, ...userData });
  },
  
  // Create test customer
  createTestCustomer: async (customerData = {}) => {
    const Customer = require('../src/modules/customers/customer.model');
    
    const defaultCustomer = {
      firstName: 'Test',
      lastName: 'Customer',
      phone: '9876543210',
      email: 'customer@example.com',
      dateOfBirth: new Date('1990-01-01'),
      address: {
        line1: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      kyc: {
        aadhaar: '123456789012',
        pan: 'ABCDE1234F'
      },
      monthlyIncome: 50000,
      employmentType: 'salaried'
    };
    
    return await Customer.create({ ...defaultCustomer, ...customerData });
  },
  
  // Create test loan
  createTestLoan: async (loanData = {}) => {
    const Loan = require('../src/modules/loans/loan.model');
    
    // Create customer if not provided
    let customerId = loanData.customerId;
    if (!customerId) {
      const customer = await global.testUtils.createTestCustomer();
      customerId = customer._id;
    }
    
    const defaultLoan = {
      customerId,
      principal: 100000,
      interestRate: 24,
      tenure: 12,
      purpose: 'business',
      status: 'active',
      disbursementDate: new Date()
    };
    
    return await Loan.create({ ...defaultLoan, ...loanData });
  },
  
  // Generate JWT token for testing
  generateTestToken: (userId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '1h'
    });
  },
  
  // Create authenticated request headers
  getAuthHeaders: (userId) => {
    const token = global.testUtils.generateTestToken(userId);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },
  
  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate random string
  randomString: (length = 10) => {
    return Math.random().toString(36).substring(2, length + 2);
  },
  
  // Generate random email
  randomEmail: () => {
    return `test${Date.now()}@example.com`;
  },
  
  // Generate random phone
  randomPhone: () => {
    return `98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  }
};

// Mock external services
jest.mock('../src/utils/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/utils/smsService', () => ({
  sendSMS: jest.fn().mockResolvedValue(true),
  sendOTP: jest.fn().mockResolvedValue(true)
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.BCRYPT_SALT_ROUNDS = '10';

// Suppress console logs during tests (optional)
if (process.env.SUPPRESS_LOGS === 'true') {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
}