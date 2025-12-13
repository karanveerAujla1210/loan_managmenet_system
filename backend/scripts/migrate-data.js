const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Customer = require('../src/models/customer.model');
const User = require('../src/models/user.model');
const Loan = require('../src/models/loan.model');
const Payment = require('../src/models/payment.model');
const Disbursement = require('../src/models/disbursement.model');
const Document = require('../src/models/document.model');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Helper function to convert UUID to ObjectId
const uuidToObjectId = (uuid) => {
  if (!uuid) return null;
  // Create a consistent ObjectId from UUID
  const hash = require('crypto').createHash('md5').update(uuid).digest('hex');
  return new mongoose.Types.ObjectId(hash.substring(0, 24));
};

// Migration function
const migrateData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Read the JSON file
    const dataPath = path.join(__dirname, '../../mongo_6_tables_filled.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('Data loaded successfully');
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('Clearing existing data...');
    await Customer.deleteMany({});
    await User.deleteMany({});
    await Loan.deleteMany({});
    await Payment.deleteMany({});
    await Disbursement.deleteMany({});
    await Document.deleteMany({});
    
    // Migrate Users
    if (data.users && data.users.length > 0) {
      console.log(`Migrating ${data.users.length} users...`);
      const users = data.users.map(user => ({
        ...user,
        _id: uuidToObjectId(user._id),
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
      }));
      await User.insertMany(users);
      console.log('Users migrated successfully');
    }
    
    // Migrate Customers
    if (data.customers && data.customers.length > 0) {
      console.log(`Migrating ${data.customers.length} customers...`);
      const customers = data.customers.map(customer => ({
        ...customer,
        _id: uuidToObjectId(customer._id),
        createdBy: customer.createdBy ? uuidToObjectId(customer.createdBy) : null,
        dob: customer.dob ? new Date(customer.dob) : null,
        createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
        updatedAt: customer.updatedAt ? new Date(customer.updatedAt) : new Date(),
        // Ensure required fields have default values
        address: customer.address || {
          line1: '',
          city: '',
          state: '',
          pincode: ''
        },
        kyc: customer.kyc || {
          aadhaar: null,
          pan: null,
          documents: [],
          isVerified: false
        }
      }));
      await Customer.insertMany(customers);
      console.log('Customers migrated successfully');
    }
    
    // Migrate Loans
    if (data.loans && data.loans.length > 0) {
      console.log(`Migrating ${data.loans.length} loans...`);
      const loans = data.loans.map(loan => ({
        ...loan,
        _id: uuidToObjectId(loan._id),
        customerId: uuidToObjectId(loan.customerId),
        assignedAgent: loan.assignedAgent ? uuidToObjectId(loan.assignedAgent) : null,
        approvedBy: loan.approvedBy ? uuidToObjectId(loan.approvedBy) : null,
        disbursedBy: loan.disbursedBy ? uuidToObjectId(loan.disbursedBy) : null,
        disbursementDate: loan.disbursementDate ? new Date(loan.disbursementDate) : null,
        maturityDate: loan.maturityDate ? new Date(loan.maturityDate) : null,
        createdAt: loan.createdAt ? new Date(loan.createdAt) : new Date(),
        updatedAt: loan.updatedAt ? new Date(loan.updatedAt) : new Date(),
        // Process schedule if exists
        schedule: loan.schedule ? loan.schedule.map(inst => ({
          ...inst,
          dueDate: new Date(inst.dueDate)
        })) : [],
        // Process notes if exists
        notes: loan.notes ? loan.notes.map(note => ({
          ...note,
          addedBy: uuidToObjectId(note.addedBy),
          addedAt: new Date(note.addedAt)
        })) : []
      }));
      await Loan.insertMany(loans);
      console.log('Loans migrated successfully');
    }
    
    // Migrate Payments
    if (data.payments && data.payments.length > 0) {
      console.log(`Migrating ${data.payments.length} payments...`);
      const payments = data.payments.map(payment => ({
        ...payment,
        _id: uuidToObjectId(payment._id),
        loanId: uuidToObjectId(payment.loanId),
        customerId: uuidToObjectId(payment.customerId),
        processedBy: payment.processedBy ? uuidToObjectId(payment.processedBy) : null,
        processedAt: payment.processedAt ? new Date(payment.processedAt) : null,
        createdAt: payment.createdAt ? new Date(payment.createdAt) : new Date(),
        updatedAt: payment.updatedAt ? new Date(payment.updatedAt) : new Date()
      }));
      await Payment.insertMany(payments);
      console.log('Payments migrated successfully');
    }
    
    // Migrate Disbursements
    if (data.disbursements && data.disbursements.length > 0) {
      console.log(`Migrating ${data.disbursements.length} disbursements...`);
      const disbursements = data.disbursements.map(disbursement => ({
        ...disbursement,
        _id: uuidToObjectId(disbursement._id),
        loanId: uuidToObjectId(disbursement.loanId),
        customerId: uuidToObjectId(disbursement.customerId),
        disbursedBy: disbursement.disbursedBy ? uuidToObjectId(disbursement.disbursedBy) : null,
        disbursedAt: disbursement.disbursedAt ? new Date(disbursement.disbursedAt) : null,
        createdAt: disbursement.createdAt ? new Date(disbursement.createdAt) : new Date(),
        updatedAt: disbursement.updatedAt ? new Date(disbursement.updatedAt) : new Date()
      }));
      await Disbursement.insertMany(disbursements);
      console.log('Disbursements migrated successfully');
    }
    
    // Migrate Documents
    if (data.documents && data.documents.length > 0) {
      console.log(`Migrating ${data.documents.length} documents...`);
      const documents = data.documents.map(document => ({
        ...document,
        _id: uuidToObjectId(document._id),
        ownerId: uuidToObjectId(document.ownerId),
        uploadedBy: uuidToObjectId(document.uploadedBy),
        verifiedBy: document.verifiedBy ? uuidToObjectId(document.verifiedBy) : null,
        verifiedAt: document.verifiedAt ? new Date(document.verifiedAt) : null,
        createdAt: document.createdAt ? new Date(document.createdAt) : new Date(),
        updatedAt: document.updatedAt ? new Date(document.updatedAt) : new Date()
      }));
      await Document.insertMany(documents);
      console.log('Documents migrated successfully');
    }
    
    console.log('Data migration completed successfully!');
    
    // Print summary
    const customerCount = await Customer.countDocuments();
    const userCount = await User.countDocuments();
    const loanCount = await Loan.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const disbursementCount = await Disbursement.countDocuments();
    const documentCount = await Document.countDocuments();
    
    console.log('\n=== Migration Summary ===');
    console.log(`Users: ${userCount}`);
    console.log(`Customers: ${customerCount}`);
    console.log(`Loans: ${loanCount}`);
    console.log(`Payments: ${paymentCount}`);
    console.log(`Disbursements: ${disbursementCount}`);
    console.log(`Documents: ${documentCount}`);
    console.log('========================\n');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await migrateData();
    console.log('Migration process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { migrateData, connectDB };