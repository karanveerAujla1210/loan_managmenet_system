const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/?appName=Cluster0";

async function analyzeSchema() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    
    const db = client.db('loancrm');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Database Analysis:');
    
    for (const col of collections) {
      console.log(`\n🔍 Collection: ${col.name}`);
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      const sample = await collection.findOne();
      
      console.log(`   Documents: ${count}`);
      if (sample) {
        console.log(`   Schema: ${Object.keys(sample).join(', ')}`);
      }
    }
    
    console.log('\n❌ Missing Collections:');
    const existing = collections.map(c => c.name);
    const required = ['customers', 'transactions', 'schedules', 'collections', 'analytics'];
    const missing = required.filter(r => !existing.includes(r));
    
    if (missing.length > 0) {
      missing.forEach(m => console.log(`   - ${m}`));
    } else {
      console.log('   None - all required collections exist');
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

analyzeSchema();