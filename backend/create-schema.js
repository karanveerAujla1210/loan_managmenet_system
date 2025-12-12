require('dotenv').config();
const mongoose = require('mongoose');

// Import all models to register schemas
const User = require('./src/modules/users/users.model');
const Customer = require('./src/modules/customers/customers.model');
const Loan = require('./src/modules/loans/loans.model');
const Transaction = require('./src/modules/transactions/transactions.model');
const Schedule = require('./src/modules/schedules/schedules.model');
const Collection = require('./src/modules/collections/collections.model');
const Analytics = require('./src/modules/analytics/analytics.model');

const createSchema = async () => {
  try {
    // Use environment variable or fallback
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://singh2212karanveer_db_user:Aujla%401210@cluster0.1ed6kd1.mongodb.net/loancrm?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create collections with sample data
    const collections = [
      { name: 'users', model: User, sample: { name: 'Admin', email: 'admin@nbfc.com', role: 'admin' }},
      { name: 'customers', model: Customer, sample: { name: 'Test Customer', phone: '9999999999' }},
      { name: 'loans', model: Loan, sample: { loanId: 'LN001', amount: 100000, status: 'active' }},
      { name: 'transactions', model: Transaction, sample: { type: 'payment', amount: 5000 }},
      { name: 'schedules', model: Schedule, sample: { installmentNumber: 1, amount: 5000 }},
      { name: 'collections', model: Collection, sample: { status: 'pending', dpd: 0 }},
      { name: 'analytics', model: Analytics, sample: { metric: 'total_loans', value: 1 }}
    ];
    
    for (const col of collections) {
      try {
        await col.model.create(col.sample);
        console.log(`✅ Created ${col.name} collection`);
      } catch (error) {
        console.log(`ℹ️  ${col.name} collection exists`);
      }
    }
    
    // List all collections
    const db = mongoose.connection.db;
    const allCollections = await db.listCollections().toArray();
    console.log('\n📊 All Collections:');
    allCollections.forEach(col => console.log(`  - ${col.name}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createSchema();