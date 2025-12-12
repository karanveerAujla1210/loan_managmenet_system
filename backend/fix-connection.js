const { MongoClient } = require('mongodb');

// Test different connection formats
const testConnections = async () => {
  const uris = [
    "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/loancrm?retryWrites=true&w=majority&appName=Cluster0",
    "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/test?retryWrites=true&w=majority"
  ];

  for (let i = 0; i < uris.length; i++) {
    try {
      console.log(`Testing URI ${i + 1}...`);
      const client = new MongoClient(uris[i]);
      await client.connect();
      console.log(`✅ Connection ${i + 1} successful!`);
      
      // Update .env with working URI
      const fs = require('fs');
      const envContent = fs.readFileSync('../.env', 'utf8');
      const newEnvContent = envContent.replace(
        /MONGODB_URI=.*/,
        `MONGODB_URI=${uris[i]}`
      );
      fs.writeFileSync('../.env', newEnvContent);
      console.log('✅ Updated .env file');
      
      await client.close();
      break;
    } catch (error) {
      console.log(`❌ Connection ${i + 1} failed: ${error.message}`);
    }
  }
};

testConnections();