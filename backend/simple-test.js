const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    
    const db = client.db('loancrm');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Existing Collections:');
    if (collections.length === 0) {
      console.log('  No collections found - database is empty');
    } else {
      collections.forEach(col => console.log(`  - ${col.name}`));
    }
    
    console.log('\n🔍 Required Collections for NBFC:');
    const required = ['users', 'customers', 'loans', 'payments', 'transactions', 'schedules', 'collections', 'analytics'];
    required.forEach(r => console.log(`  - ${r}`));
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await client.close();
  }
}

run();