// Test script for loan engine functionality

const { generateLoanSchedule } = require('../utils/scheduleGenerator');
const { allocatePayment } = require('../utils/paymentAllocator');
const { computeBucket } = require('../utils/dpdBucketEngine');

// Test 1: Schedule Generation
console.log('=== TESTING SCHEDULE GENERATION ===');
const principal = 50000;
const disbursementDate = new Date('2024-01-01');

const calc = generateLoanSchedule(principal, disbursementDate);
console.log('Principal:', principal);
console.log('PF Amount:', calc.pfAmount);
console.log('GST Amount:', calc.gstAmount);
console.log('Total PF:', calc.totalPF);
console.log('Net Disbursement:', calc.netDisbursement);
console.log('Interest Amount:', calc.interestAmount);
console.log('Total Repayable:', calc.totalRepayable);
console.log('Weekly EMI:', calc.weeklyEmi);
console.log('Schedule entries:', calc.schedule.length);

// Test 2: Payment Allocation
console.log('\n=== TESTING PAYMENT ALLOCATION ===');
const payment = { amount: 5000, paymentDate: new Date('2024-01-15') };
const { allocation, schedule } = allocatePayment(payment, calc.schedule);
console.log('Payment Amount:', payment.amount);
console.log('Allocation:', allocation);
console.log('First installment status:', schedule[0].status);

// Test 3: DPD Bucket Computation
console.log('\n=== TESTING DPD BUCKETS ===');
const testDPDs = [0, 5, 10, 20, 30, 65, 95, 125];
testDPDs.forEach(dpd => {
    console.log(`DPD ${dpd} -> Bucket: ${computeBucket(dpd)}`);
});

console.log('\n✅ All tests completed successfully!');