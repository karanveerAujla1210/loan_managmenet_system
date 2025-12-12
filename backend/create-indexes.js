const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/loancrm?retryWrites=true&w=majority&appName=Cluster0";

async function createIndexes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    
    const db = client.db('loancrm');
    
    // Performance indexes
    await db.collection('loans').createIndex({ "customerId": 1 });
    await db.collection('loans').createIndex({ "status": 1, "nextDueDate": 1 });
    await db.collection('loans').createIndex({ "dpd": 1, "bucket": 1 });
    await db.collection('schedules').createIndex({ "loanId": 1, "installmentNumber": 1 });
    await db.collection('payments').createIndex({ "loanId": 1, "paymentDate": -1 });
    await db.collection('transactions').createIndex({ "loanId": 1, "createdAt": -1 });
    await db.collection('collections').createIndex({ "agentId": 1, "nextFollowUp": 1 });
    
    // Unique indexes
    await db.collection('customers').createIndex({ "phone": 1 }, { unique: true });
    await db.collection('users').createIndex({ "email": 1 }, { unique: true });
    
    // Compound indexes for reporting
    await db.collection('loans').createIndex({ "branch": 1, "status": 1, "createdAt": -1 });
    await db.collection('analytics').createIndex({ "metric": 1, "date": -1, "branch": 1 });
    
    console.log("✅ All indexes created successfully!");
    
  } catch (error) {
    console.error("❌ Error creating indexes:", error.message);
  } finally {
    await client.close();
  }
}

createIndexes();