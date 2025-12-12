const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nbfc_loan_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Generate customer ID
const generateCustomerId = () => {
  return 'CUST' + Date.now() + Math.floor(Math.random() * 1000);
};

// Generate payment ID
const generatePaymentId = () => {
  return 'PAY' + Date.now() + Math.floor(Math.random() * 1000);
};

// Calculate EMI and installments
const calculateLoanDetails = (loanAmount, interestRate = 24, tenure = 12) => {
  const monthlyRate = interestRate / 100 / 12;
  const emiAmount = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1));
  const totalAmount = emiAmount * tenure;
  
  const installments = [];
  for (let i = 1; i <= tenure; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    
    installments.push({
      installmentNumber: i,
      dueDate: dueDate,
      principalAmount: Math.round(loanAmount / tenure),
      interestAmount: Math.round(emiAmount - (loanAmount / tenure)),
      totalAmount: emiAmount,
      paidAmount: 0,
      status: 'due'
    });
  }
  
  return { emiAmount, totalAmount, installments };
};

// Insert production data
const insertProductionData = async () => {
  try {
    console.log('Starting production data insertion...');
    
    // Read the JSON file
    const dataPath = path.join(__dirname, '../../final_loancrm_dataset.json');
    let rawData = fs.readFileSync(dataPath, 'utf8');
    
    // Fix NaN values in JSON
    rawData = rawData.replace(/: NaN/g, ': null');
    
    const data = JSON.parse(rawData);
    
    console.log(`Found ${data.loans?.length || 0} loans and ${data.payments?.length || 0} payments to insert`);
    
    let insertedLoans = 0;
    let insertedPayments = 0;
    let insertedCustomers = 0;
    
    // Process loans
    if (data.loans && Array.isArray(data.loans)) {
      for (const loanData of data.loans) {
        try {
          // Check if loan already exists
          const existingLoan = await Loan.findOne({ loanId: loanData.loanId });
          if (existingLoan) {
            console.log(`Loan ${loanData.loanId} already exists, skipping...`);
            continue;
          }
          
          // Create customer first
          const customerId = generateCustomerId();
          const customer = new Customer({
            customerId: customerId,
            name: loanData.customerName,
            phone: loanData.mobileNumber?.toString() || '',
            address: {
              city: loanData.branch || '',
              state: 'Uttar Pradesh',
              pincode: ''
            },
            kyc: {
              status: 'verified'
            },
            isActive: true
          });
          
          await customer.save();
          insertedCustomers++;
          
          // Calculate loan details
          const { emiAmount, totalAmount, installments } = calculateLoanDetails(
            loanData.loanAmount || 25000,
            24, // 24% annual interest
            12  // 12 months tenure
          );
          
          // Create loan
          const loan = new Loan({
            loanId: loanData.loanId,
            customerId: customer._id,
            principalAmount: loanData.loanAmount || 25000,
            interestRate: 24,
            tenure: 12,
            totalAmount: totalAmount,
            emiAmount: emiAmount,
            disbursedDate: new Date(loanData.disbursementDate || Date.now()),
            status: loanData.status?.toLowerCase() || 'active',
            installments: installments,
            dpd: 0,
            bucket: 'current'
          });
          
          await loan.save();
          insertedLoans++;
          console.log(`✓ Inserted loan: ${loanData.loanId} for customer: ${loanData.customerName}`);
          
        } catch (error) {
          console.error(`Error inserting loan ${loanData.loanId}:`, error.message);
        }
      }
    }
    
    // Process payments
    if (data.payments && Array.isArray(data.payments)) {
      for (const paymentData of data.payments) {
        try {
          // Find the corresponding loan
          const loan = await Loan.findOne({ loanId: paymentData.loanId });
          if (!loan) {
            console.log(`Loan ${paymentData.loanId} not found for payment, skipping...`);
            continue;
          }
          
          // Check if payment already exists
          const existingPayment = await Payment.findOne({ 
            loanId: loan._id, 
            amount: paymentData.amount,
            paymentDate: new Date(paymentData.paymentDate)
          });
          
          if (existingPayment) {
            console.log(`Payment for loan ${paymentData.loanId} already exists, skipping...`);
            continue;
          }
          
          // Create payment
          const payment = new Payment({
            paymentId: generatePaymentId(),
            loanId: loan._id,
            amount: paymentData.amount || 0,
            paymentDate: new Date(paymentData.paymentDate || Date.now()),
            paymentMethod: paymentData.paymentMode?.toLowerCase() === 'upi' ? 'online' : 'cash',
            reference: paymentData.referenceNumber?.toString() || '',
            collectedBy: null,
            status: 'confirmed',
            allocations: []
          });
          
          await payment.save();
          insertedPayments++;
          console.log(`✓ Inserted payment: ${paymentData.amount} for loan: ${paymentData.loanId}`);
          
        } catch (error) {
          console.error(`Error inserting payment for loan ${paymentData.loanId}:`, error.message);
        }
      }
    }
    
    console.log('\n=== PRODUCTION DATA INSERTION COMPLETED ===');
    console.log(`✓ Customers inserted: ${insertedCustomers}`);
    console.log(`✓ Loans inserted: ${insertedLoans}`);
    console.log(`✓ Payments inserted: ${insertedPayments}`);
    console.log('===============================================\n');
    
  } catch (error) {
    console.error('Error in production data insertion:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await insertProductionData();
};

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { insertProductionData };