const moment = require('moment');

const calculateDPD = (installments) => {
  if (!installments || installments.length === 0) return 0;
  
  const unpaidInstallment = installments.find(inst => 
    inst.status === 'PENDING' || inst.status === 'PARTIAL' || inst.status === 'OVERDUE'
  );
  
  if (!unpaidInstallment) return 0;
  
  const dueDate = moment(unpaidInstallment.dueDate);
  const today = moment().startOf('day');
  const dpd = today.diff(dueDate, 'days');
  
  return Math.max(0, dpd);
};

const assignBucket = (dpd) => {
  if (dpd === 0) return 'CURRENT';
  if (dpd >= 1 && dpd <= 7) return '1-7';
  if (dpd >= 8 && dpd <= 15) return '8-15';
  if (dpd >= 16 && dpd <= 22) return '16-22';
  if (dpd >= 23 && dpd <= 29) return '23-29';
  if (dpd >= 30 && dpd <= 59) return '30+';
  if (dpd >= 60 && dpd <= 89) return '60+';
  if (dpd >= 90) return 'LEGAL';
  return 'CURRENT';
};

const updateDPDAndBucket = (loan, installments) => {
  const dpd = calculateDPD(installments);
  const bucket = assignBucket(dpd);
  
  return {
    dpd,
    bucket,
    previousBucket: loan.bucket,
    status: dpd >= 90 ? 'LEGAL' : loan.status
  };
};

module.exports = {
  calculateDPD,
  assignBucket,
  updateDPDAndBucket
};
