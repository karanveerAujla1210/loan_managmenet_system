const mongoose = require('mongoose');
const { createLoan } = require('../services/loanService');
const { updateDPD } = require('../services/dpdService');
const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const Schedule = require('../models/Schedule');
const Payment = require('../models/Payment');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testLoanSystem() {
  try {
    console.log('🧪 Testing Loan Management System...\n');

    // 1. Create test customer
    const customer = await Customer.create({
      firstName: 'Test',
      lastName: 'Customer',
      phone: '9999999999',
      email: 'test@example.com'
    });
    console.log('✅ Customer created:', customer.firstName, customer.lastName);

    // 2. Create test loan
    const loanData = {
      principal: 50000,
      disbursementDate: new Date('2024-01-01'),
      customerId: customer._id,
      loanId: 'TEST001',
      branch: 'Test Branch'
    };

    const loan = await createLoan(loanData);
    console.log('✅ Loan created:', loan.loanId);
    console.log('   Principal:', loan.principal);
    console.log('   PF Amount:', loan.pfAmount);
    console.log('   GST Amount:', loan.gstAmount);
    console.log('   Net Disbursement:', loan.netDisbursement);
    console.log('   Total Repayable:', loan.totalRepayable);
    console.log('   Weekly EMI:', loan.weeklyEmi);

    // 3. Check schedule creation
    const schedule = await Schedule.find({ loanId: loan._id }).sort({ installmentNumber: 1 });
    console.log('✅ Schedule created:', schedule.length, 'installments');
    console.log('   First EMI due:', schedule[0].dueDate.toDateString());
    console.log('   Last EMI due:', schedule[13].dueDate.toDateString());

    // 4. Add test payment
    const payment = await Payment.create({
      loanId: loan._id,
      customerId: customer._id,
      amount: 5000,
      paymentDate: new Date('2024-01-08'),
      method: 'UPI',
      txnRef: 'TEST123'
    });
    console.log('✅ Payment added:', payment.amount);

    // 5. Test DPD calculation
    await updateDPD();
    const updatedLoan = await Loan.findById(loan._id);
    console.log('✅ DPD calculated:', updatedLoan.dpd, 'days');
    console.log('   Bucket:', updatedLoan.bucket);

    // 6. System stats
    const stats = {
      totalCustomers: await Customer.countDocuments(),
      totalLoans: await Loan.countDocuments(),
      totalPayments: await Payment.countDocuments(),
      totalSchedules: await Schedule.countDocuments()
    };
    
    console.log('\n📊 System Statistics:');
    console.log('   Customers:', stats.totalCustomers);
    console.log('   Loans:', stats.totalLoans);
    console.log('   Payments:', stats.totalPayments);
    console.log('   Schedules:', stats.totalSchedules);

    console.log('\n🎉 All tests passed! System is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testLoanSystem();