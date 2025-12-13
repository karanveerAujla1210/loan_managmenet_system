require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const UploadService = require('../src/services/upload.service');

// Sample data
const sampleDisbursements = [
  {
    loanId: "LN000001",
    amount: 100000,
    method: "bank_transfer",
    status: "completed",
    bankDetails: {
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      accountHolderName: "John Doe"
    },
    txnRef: "TXN123456789",
    disbursedAt: "2024-01-15T10:30:00Z"
  }
];

const samplePayments = [
  {
    loanId: "LN000001",
    amount: 8500,
    method: "upi",
    status: "success",
    txnRef: "PAY123456789",
    installmentSequence: 1,
    allocation: {
      principal: 7000,
      interest: 1400,
      penalty: 100
    },
    processedAt: "2024-02-15T09:30:00Z"
  }
];

async function testUpload() {
  try {
    await connectDB();
    console.log('Testing disbursement upload...');
    
    const disbResult = await UploadService.processDisbursementData(sampleDisbursements);
    console.log('Disbursement Result:', disbResult);
    
    console.log('Testing payment upload...');
    const payResult = await UploadService.processPaymentData(samplePayments);
    console.log('Payment Result:', payResult);
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testUpload();