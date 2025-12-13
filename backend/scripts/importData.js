const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { linkImportedData } = require('../services/loanService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function importFromJSON() {
  try {
    // Read the JSON file with sample data
    const dataPath = path.join(__dirname, '../../mongo_6_tables_filled.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('Starting data import...');
    
    // Transform customers to disbursement format
    const disbursements = data.customers.map((customer, index) => ({
      loanId: `LOAN${String(index + 1).padStart(4, '0')}`,
      customerName: `${customer.firstName} ${customer.lastName || ''}`.trim(),
      mobileNumber: customer.phone,
      loanAmount: 50000 + (index * 5000), // Sample amounts
      dateOfDisbursement: new Date(Date.now() - (index * 86400000)), // Staggered dates
      branch: 'Main Branch'
    }));

    // Create sample payments (some customers have payments)
    const payments = disbursements.slice(0, 5).map((d, index) => ({
      LoanID: d.loanId,
      Amount: 5000 + (index * 500),
      PaymentDate: new Date(Date.now() - ((index + 1) * 86400000 * 7)),
      PaymentMode: 'UPI',
      ReferenceNumber: `TXN${String(index + 1).padStart(6, '0')}`
    }));

    await linkImportedData(disbursements, payments);
    
    console.log(`Import completed: ${disbursements.length} loans, ${payments.length} payments`);
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importFromJSON();