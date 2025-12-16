const mongoose = require('mongoose');
require('dotenv').config();

const Loan = require('../models/Loan');
const Installment = require('../models/installment.model');
const LegalCase = require('../models/LegalCase');
const LoanProduct = require('../models/LoanProduct');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Loan.deleteMany({});
    await Installment.deleteMany({});
    await LegalCase.deleteMany({});
    console.log('Cleared existing data');

    // Create loan product
    let product = await LoanProduct.findOne();
    if (!product) {
      product = await LoanProduct.create({
        name: 'Standard Loan',
        principal: 50000,
        interestRate: 20,
        tenure: 14,
        processingFee: 10,
        gst: 18
      });
      console.log('Created loan product');
    }

    // Create sample loans
    const loans = [];
    for (let i = 1; i <= 5; i++) {
      const loan = await Loan.create({
        borrowerName: `Customer ${i}`,
        phone: `9876543${String(i).padStart(3, '0')}`,
        productId: product._id,
        loanAmount: 50000 + (i * 10000),
        totalPayable: 60000 + (i * 10000),
        disbursementDate: new Date(2024, 0, i),
        status: i <= 3 ? 'ACTIVE' : 'CLOSED',
        outstandingAmount: i <= 3 ? 30000 + (i * 5000) : 0
      });
      loans.push(loan);
      console.log(`Created loan ${i}`);
    }

    // Create installments for each loan
    for (const loan of loans) {
      for (let j = 1; j <= 14; j++) {
        const dueDate = new Date(loan.disbursementDate);
        dueDate.setDate(dueDate.getDate() + (j * 7));

        await Installment.create({
          loanId: loan._id,
          installmentNo: j,
          dueDate,
          emiAmount: loan.totalPayable / 14,
          paidAmount: j <= 2 ? loan.totalPayable / 14 : 0,
          remainingAmount: j <= 2 ? 0 : loan.totalPayable / 14,
          penalty: 0,
          status: j <= 2 ? 'PAID' : 'PENDING'
        });
      }
      console.log(`Created installments for loan ${loan._id}`);
    }

    // Create legal cases for overdue loans
    const overdueLoan = loans[3];
    if (overdueLoan) {
      await LegalCase.create({
        loanId: overdueLoan._id,
        dpdAtEntry: 95,
        status: 'OPEN',
        remarks: 'Test legal case'
      });
      console.log('Created legal case');
    }

    console.log('✅ Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
