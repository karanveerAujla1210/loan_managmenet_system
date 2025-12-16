const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Branch = require('../models/branch.model');

async function importBranches() {
  try {
    const dataPath = path.join(__dirname, '../../..', 'data', 'branch_master_.json');
    const branchData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`Found ${branchData.length} branches to import...`);

    const transformed = branchData.map(b => ({
      branchId: b.Branch_ID,
      branchName: b.Branch_Name.trim(),
      category: b.Category
    }));

    await Branch.deleteMany({});
    const result = await Branch.insertMany(transformed);

    console.log(`✓ Successfully imported ${result.length} branches`);
    return result;
  } catch (error) {
    console.error('Import failed:', error.message);
    throw error;
  }
}

module.exports = importBranches;
