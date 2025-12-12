const { MongoClient } = require('mongodb');

const testConnections = async () => {
  const connections = [
    'mongodb+srv://singh2212karanveer_db_user:Aujla%401210@cluster0.1ed6kd1.mongodb.net/test?retryWrites=true&w=majority',
    'mongodb+srv://singh2212karanveer_db_user:Aujla@1210@cluster0.1ed6kd1.mongodb.net/test?retryWrites=true&w=majority',
    'mongodb+srv://singh2212karanveer_db_user:Aujla%401210@cluster0.1ed6kd1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  ];

  for (let i = 0; i < connections.length; i++) {
    try {
      console.log(`Testing connection ${i + 1}...`);
      const client = new MongoClient(connections[i]);
      await client.connect();
      console.log(`✅ Connection ${i + 1} successful`);
      
      const db = client.db('loancrm');
      const collections = await db.listCollections().toArray();
      console.log(`Collections: ${collections.map(c => c.name).join(', ')}`);
      
      await client.close();
      break;
    } catch (error) {
      console.log(`❌ Connection ${i + 1} failed: ${error.message}`);
    }
  }
};

testConnections();