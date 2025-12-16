const mongoose = require('mongoose');
const Branch = require('../src/models/branch.model');
const branchData = require('../../data/branch_master_.json');

async function importBranches() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-management');
    
    await Branch.deleteMany({});
    
    const branches = branchData.map(branch => ({
      branchId: branch.Branch_ID,
      branchName: branch.Branch_Name.trim(),
      category: branch.Category
    }));
    
    await Branch.insertMany(branches);
    console.log(`✅ Imported ${branches.length} branches successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importBranches();