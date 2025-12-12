const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test configuration
const testConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

let authToken = null;

// Test user credentials
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'admin'
};

// Test loan data
const testLoan = {
  customerId: null, // Will be set after customer creation
  loanAmount: 50000,
  interestRate: 12,
  tenure: 12,
  purpose: 'Business',
  status: 'PENDING'
};

// Test customer data
const testCustomer = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  address: '123 Test Street, Test City',
  panNumber: 'ABCDE1234F',
  aadharNumber: '123456789012'
};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      ...testConfig,
      method,
      url,
      ...(data && { data }),
      ...(authToken && { headers: { ...testConfig.headers, Authorization: `Bearer ${authToken}` } })
    };
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ ${method.toUpperCase()} ${url} failed:`, error.response?.data || error.message);
    throw error;
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await makeRequest('GET', '/health');
    console.log('✅ Health check passed:', response);
    return true;
  } catch (error) {
    return false;
  }
};

const testUserRegistration = async () => {
  console.log('\n👤 Testing User Registration...');
  try {
    const response = await makeRequest('POST', '/auth/register', testUser);
    console.log('✅ User registration successful:', response.message);
    
    if (response.data?.accessToken) {
      authToken = response.data.accessToken;
      console.log('🔑 Auth token obtained');
    }
    
    return true;
  } catch (error) {
    // User might already exist, try login
    return false;
  }
};

const testUserLogin = async () => {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('✅ User login successful:', response.message);
    
    if (response.data?.accessToken) {
      authToken = response.data.accessToken;
      console.log('🔑 Auth token obtained');
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

const testCustomerCreation = async () => {
  console.log('\n👥 Testing Customer Creation...');
  try {
    const response = await makeRequest('POST', '/customers', testCustomer);
    console.log('✅ Customer creation successful:', response.message);
    
    if (response.data?._id) {
      testLoan.customerId = response.data._id;
      console.log('📝 Customer ID saved for loan creation');
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

const testCustomerRetrieval = async () => {
  console.log('\n📋 Testing Customer Retrieval...');
  try {
    const response = await makeRequest('GET', '/customers');
    console.log('✅ Customer retrieval successful. Count:', response.data?.length || 0);
    
    // If we have customers and no customerId set, use the first one
    if (response.data?.length > 0 && !testLoan.customerId) {
      testLoan.customerId = response.data[0]._id;
      console.log('📝 Using existing customer ID for loan creation');
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

const testLoanCreation = async () => {
  console.log('\n💰 Testing Loan Creation...');
  
  if (!testLoan.customerId) {
    console.log('❌ No customer ID available for loan creation');
    return false;
  }
  
  try {
    const response = await makeRequest('POST', '/loans', testLoan);
    console.log('✅ Loan creation successful:', response.message);
    return true;
  } catch (error) {
    return false;
  }
};

const testLoanRetrieval = async () => {
  console.log('\n📊 Testing Loan Retrieval...');
  try {
    const response = await makeRequest('GET', '/loans');
    console.log('✅ Loan retrieval successful. Count:', response.data?.length || 0);
    return true;
  } catch (error) {
    return false;
  }
};

const testCollectionsDueToday = async () => {
  console.log('\n📅 Testing Collections Due Today...');
  try {
    const response = await makeRequest('GET', '/collections/due-today');
    console.log('✅ Collections due today retrieved. Count:', response.data?.length || 0);
    return true;
  } catch (error) {
    return false;
  }
};

const testDashboardStats = async () => {
  console.log('\n📈 Testing Dashboard Stats...');
  try {
    const response = await makeRequest('GET', '/dashboard/stats');
    console.log('✅ Dashboard stats retrieved:', Object.keys(response.data || {}));
    return true;
  } catch (error) {
    return false;
  }
};

const testTokenRefresh = async () => {
  console.log('\n🔄 Testing Token Refresh...');
  
  if (!authToken) {
    console.log('❌ No auth token available for refresh test');
    return false;
  }
  
  try {
    // This would need a refresh token in a real scenario
    // For now, just test the endpoint exists
    const response = await makeRequest('POST', '/auth/refresh', { refreshToken: 'dummy' });
    console.log('✅ Token refresh endpoint accessible');
    return true;
  } catch (error) {
    // Expected to fail with dummy token, but endpoint should exist
    if (error.response?.status === 401 || error.response?.status === 400) {
      console.log('✅ Token refresh endpoint exists (expected auth error with dummy token)');
      return true;
    }
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting API Connection Tests...\n');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Customer Creation', fn: testCustomerCreation },
    { name: 'Customer Retrieval', fn: testCustomerRetrieval },
    { name: 'Loan Creation', fn: testLoanCreation },
    { name: 'Loan Retrieval', fn: testLoanRetrieval },
    { name: 'Collections Due Today', fn: testCollectionsDueToday },
    { name: 'Dashboard Stats', fn: testDashboardStats },
    { name: 'Token Refresh', fn: testTokenRefresh }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Print summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log('\n' + '-' .repeat(30));
  console.log(`📈 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All API connections are working correctly!');
  } else {
    console.log('⚠️  Some API connections need attention. Check the logs above.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Ensure MongoDB is running');
  console.log('2. Check backend server is running on port 5000');
  console.log('3. Verify environment variables are set correctly');
  console.log('4. Check network connectivity');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testConfig,
  API_BASE_URL
};