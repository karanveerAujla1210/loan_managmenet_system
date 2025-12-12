const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/?appName=Cluster0";

async function createMissingSchemas() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    
    const db = client.db('loancrm');
    
    // Create customers collection
    await db.createCollection('customers');
    await db.collection('customers').insertOne({
      customerId: 'CUST001',
      name: 'Sample Customer',
      phone: '9999999999',
      email: 'customer@example.com',
      address: 'Sample Address',
      aadhaar: '1234-5678-9012',
      pan: 'ABCDE1234F',
      status: 'active',
      createdAt: new Date()
    });
    console.log('✅ Created customers collection');

    // Create transactions collection
    await db.createCollection('transactions');
    await db.collection('transactions').insertOne({
      transactionId: 'TXN001',
      loanId: 'LN001',
      customerId: 'CUST001',
      type: 'payment',
      amount: 5000,
      status: 'completed',
      paymentMethod: 'cash',
      createdAt: new Date()
    });
    console.log('✅ Created transactions collection');

    // Create schedules collection
    await db.createCollection('schedules');
    await db.collection('schedules').insertOne({
      loanId: 'LN001',
      installmentNumber: 1,
      dueDate: new Date(),
      amount: 5000,
      principal: 4500,
      interest: 500,
      remainingAmount: 5000,
      status: 'due',
      createdAt: new Date()
    });
    console.log('✅ Created schedules collection');

    // Create collections collection
    await db.createCollection('collections');
    await db.collection('collections').insertOne({
      loanId: 'LN001',
      customerId: 'CUST001',
      agentId: 'AGT001',
      dpd: 0,
      bucket: 'Current',
      lastContactDate: new Date(),
      nextFollowUp: new Date(),
      status: 'active',
      createdAt: new Date()
    });
    console.log('✅ Created collections collection');

    // Create analytics collection
    await db.createCollection('analytics');
    await db.collection('analytics').insertOne({
      metric: 'total_loans',
      value: 0,
      date: new Date(),
      category: 'portfolio',
      createdAt: new Date()
    });
    console.log('✅ Created analytics collection');

    console.log('\n🎉 All missing collections created successfully!');
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

createMissingSchemas();