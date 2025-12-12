const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const generateCustomerId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `CUST${timestamp}`;
};

const generateLoanId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `LOAN${timestamp}`;
};

const generatePaymentId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `PAY${timestamp}`;
};

const generateRepaymentSchedule = (principal, rate, tenure) => {
  const monthlyRate = rate / 1200;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  const schedule = [];
  let balance = principal;
  
  for (let i = 1; i <= tenure; i++) {
    const interestAmount = balance * monthlyRate;
    const principalAmount = emi - interestAmount;
    balance -= principalAmount;
    
    schedule.push({
      installmentNumber: i,
      dueDate: moment().add(i, 'months').toDate(),
      principalAmount: Math.round(principalAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalAmount: Math.round(emi * 100) / 100,
      paidAmount: 0,
      status: 'due'
    });
  }
  
  return schedule;
};

module.exports = {
  generateCustomerId,
  generateLoanId,
  generatePaymentId,
  generateRepaymentSchedule
};