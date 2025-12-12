const moment = require('moment');

const calculateDPD = (loan) => {
  const overdueInstallments = loan.installments.filter(i => 
    i.status !== 'paid' && moment(i.dueDate).isBefore(moment(), 'day')
  );
  
  if (overdueInstallments.length === 0) return 0;
  
  const oldestOverdue = overdueInstallments.reduce((oldest, current) => 
    moment(current.dueDate).isBefore(moment(oldest.dueDate)) ? current : oldest
  );
  
  return moment().diff(moment(oldestOverdue.dueDate), 'days');
};

const updateBucket = (dpd) => {
  if (dpd === 0) return 'current';
  if (dpd <= 7) return 'X';
  if (dpd <= 14) return 'Y';
  if (dpd <= 30) return 'M1';
  if (dpd <= 60) return 'M2';
  if (dpd <= 90) return 'M3';
  return 'NPA';
};

const getOutstandingAmount = (loan) => {
  return loan.installments.reduce((total, installment) => {
    return total + (installment.totalAmount - installment.paidAmount);
  }, 0);
};

module.exports = {
  calculateDPD,
  updateBucket,
  getOutstandingAmount
};