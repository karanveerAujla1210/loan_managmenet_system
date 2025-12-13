const mongoose = require('mongoose');
const { updateDPD } = require('../services/dpdService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function runDPDUpdate() {
  try {
    console.log('Starting DPD update:', new Date().toISOString());
    await updateDPD();
    console.log('DPD update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('DPD update failed:', error);
    process.exit(1);
  }
}

runDPDUpdate();