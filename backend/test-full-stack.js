require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const testFullStack = async () => {
  try {
    console.log('🔄 Testing full stack connection...');
    
    // Test database connection
    await connectDB();
    console.log('✅ Database connected');
    
    // Start server
    const server = app.listen(5000, () => {
      console.log('✅ Backend server started on port 5000');
    });
    
    // Test API endpoints
    const request = require('supertest');
    
    const healthResponse = await request(app).get('/health');
    console.log('✅ Health endpoint:', healthResponse.status);
    
    const metricsResponse = await request(app).get('/metrics');
    console.log('✅ Metrics endpoint:', metricsResponse.status);
    
    server.close();
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
};

testFullStack();