require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://singh2212karanveer_db_user:Aujla%401210@cluster0.1ed6kd1.mongodb.net/?appName=Cluster0';

const checkDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Existing Collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    console.log('\n🔍 Required Collections for NBFC:');
    const required = [
      'users', 'customers', 'loans', 'payments', 
      'transactions', 'schedules', 'collections', 
      'analytics', 'auditlogs', 'notifications'
    ];
    
    const existing = collections.map(c => c.name);
    const missing = required.filter(r => !existing.includes(r));
    
    if (missing.length > 0) {
      console.log('\n❌ Missing Collections:');
      missing.forEach(m => console.log(`  - ${m}`));
    } else {
      console.log('\n✅ All required collections exist');
    }
    
    // Check sample documents
    for (const col of existing) {
      const count = await db.collection(col).countDocuments();
      const sample = await db.collection(col).findOne();
      console.log(`\n📄 ${col}: ${count} documents`);
      if (sample) {
        console.log(`   Schema: ${Object.keys(sample).join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkDatabase();