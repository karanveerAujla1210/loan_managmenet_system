const collectionsService = require('./collections.service');
const { calculateDPD, calculateBucket, checkBrokenPTP } = require('../../utils/loanHelpers');
const moment = require('moment');

// Mock loan data for testing
const mockLoan = {
  loanId: 'LN123456',
  dpd: 0,
  collectionBucket: 'Current',
  escalationLevel: 0,
  ptp: { active: false },
  schedule: [
    {
      installmentNumber: 1,
      dueDate: moment().subtract(5, 'days').toDate(),
      remainingAmount: 5000,
      paidAmount: 0
    },
    {
      installmentNumber: 2,
      dueDate: moment().add(7, 'days').toDate(),
      remainingAmount: 5000,
      paidAmount: 0
    }
  ],
  events: [],
  updateMetrics: function() {
    this.dpd = calculateDPD(this);
    this.collectionBucket = calculateBucket(this.dpd);
  }
};

// Test DPD calculation
console.log('Testing DPD calculation...');
const dpd = calculateDPD(mockLoan);
console.log(`DPD: ${dpd} days`); // Should be 5

// Test bucket calculation
console.log('Testing bucket calculation...');
const bucket = calculateBucket(dpd);
console.log(`Bucket: ${bucket}`); // Should be 'X'

// Test broken PTP
console.log('Testing broken PTP...');
mockLoan.ptp = {
  active: true,
  promiseDate: moment().subtract(1, 'day').toDate(),
  amount: 5000
};
const isBroken = checkBrokenPTP(mockLoan);
console.log(`PTP Broken: ${isBroken}`); // Should be true

console.log('Collections Engine tests completed!');

module.exports = {
  mockLoan
};