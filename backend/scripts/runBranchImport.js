require('dotenv').config();
const mongoose = require('mongoose');
const importBranches = require('../src/import/importBranches');

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-crm';

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB');
    await importBranches();
    await mongoose.connection.close();
    console.log('Import complete. Connection closed.');
  })
  .catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
