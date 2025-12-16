const moment = require('moment');

const PENALTY_AMOUNT = 250;
const INSTALLMENTS_COUNT = 14;

const generateSchedule = (loan) => {
  const { principal, disbursementDate } = loan;
  
  const interest = principal * 0.20;
  const totalRepayable = principal + interest;
  const weeklyEmi = totalRepayable / INSTALLMENTS_COUNT;
  
  const schedule = [];
  let currentDate = moment(disbursementDate).add(7, 'days');
  
  for (let i = 1; i <= INSTALLMENTS_COUNT; i++) {
    schedule.push({
      installmentNo: i,
      dueDate: currentDate.toDate(),
      emiAmount: Math.round(weeklyEmi * 100) / 100,
      paidAmount: 0,
      remainingAmount: Math.round(weeklyEmi * 100) / 100,
      penalty: 0,
      status: 'PENDING'
    });
    currentDate = currentDate.add(7, 'days');
  }
  
  return schedule;
};

module.exports = {
  generateSchedule,
  PENALTY_AMOUNT,
  INSTALLMENTS_COUNT
};
