const moment = require('moment');

// Calculate Days Past Due (DPD)
const calculateDPD = (loan) => {
  if (!loan.schedule || loan.schedule.length === 0) return 0;
  
  const today = moment();
  let maxDPD = 0;
  
  loan.schedule.forEach(installment => {
    if (installment.remainingAmount > 0 && moment(installment.dueDate).isBefore(today)) {
      const dpd = today.diff(moment(installment.dueDate), 'days');
      maxDPD = Math.max(maxDPD, dpd);
    }
  });
  
  return maxDPD;
};

// Calculate collection bucket based on DPD
const calculateBucket = (dpd) => {
  if (dpd === 0) return 'Current';
  if (dpd <= 30) return 'X';
  if (dpd <= 60) return 'Y';
  if (dpd <= 90) return 'M1';
  if (dpd <= 120) return 'M2';
  if (dpd <= 150) return 'M3';
  return 'NPA';
};

// Check if PTP is broken
const checkBrokenPTP = (loan) => {
  if (!loan.ptp.active) return false;
  
  const today = moment();
  const promiseDate = moment(loan.ptp.promiseDate);
  
  if (promiseDate.isBefore(today) && loan.outstandingAmount > 0) {
    loan.ptp.active = false;
    loan.status = 'broken_ptp';
    
    // Add event
    loan.events.push({
      type: 'ptp',
      description: 'Promise to Pay broken',
      payload: { 
        promiseDate: loan.ptp.promiseDate,
        amount: loan.ptp.amount 
      }
    });
    
    return true;
  }
  
  return false;
};

// Calculate escalation level based on DPD
const calculateEscalation = (dpd) => {
  if (dpd <= 7) return 0;  // No escalation
  if (dpd <= 30) return 1; // Field agent
  if (dpd <= 60) return 2; // Supervisor
  return 3; // Legal
};

// Update loan status based on current state
const updateLoanStatus = (loan) => {
  if (loan.outstandingAmount <= 0) return 'completed';
  if (loan.dpd > 90) return 'defaulted';
  if (loan.dpd > 0) return 'overdue';
  if (loan.status === 'broken_ptp') return 'broken_ptp';
  return 'active';
};

// Recalculate outstanding amount
const recalcOutstanding = (loan) => {
  if (!loan.schedule) return loan.principalAmount;
  
  return loan.schedule.reduce((total, installment) => {
    return total + installment.remainingAmount;
  }, 0);
};

// Get next due date
const getNextDueDate = (loan) => {
  if (!loan.schedule) return null;
  
  const nextInstallment = loan.schedule.find(installment => 
    installment.remainingAmount > 0
  );
  
  return nextInstallment ? nextInstallment.dueDate : null;
};

// Generate loan schedule
const generateLoanSchedule = (loanData) => {
  const { 
    principalAmount, 
    interestRate, 
    numberOfInstallments, 
    startDate, 
    frequency 
  } = loanData;
  
  const totalAmount = principalAmount + (principalAmount * interestRate / 100);
  const installmentAmount = totalAmount / numberOfInstallments;
  const principalPerInstallment = principalAmount / numberOfInstallments;
  const interestPerInstallment = installmentAmount - principalPerInstallment;
  
  const schedule = [];
  let currentDate = moment(startDate);
  
  for (let i = 1; i <= numberOfInstallments; i++) {
    if (frequency === 'weekly') {
      currentDate = currentDate.add(1, 'week');
    } else {
      currentDate = currentDate.add(1, 'month');
    }
    
    schedule.push({
      installmentNumber: i,
      dueDate: currentDate.toDate(),
      principalAmount: Math.round(principalPerInstallment * 100) / 100,
      interestAmount: Math.round(interestPerInstallment * 100) / 100,
      totalAmount: Math.round(installmentAmount * 100) / 100,
      remainingAmount: Math.round(installmentAmount * 100) / 100,
      status: 'pending'
    });
  }
  
  return schedule;
};

// Allocate payment to installments
const allocatePayment = (loan, paymentAmount) => {
  let remainingAmount = paymentAmount;
  const allocations = [];
  
  // Sort installments by due date
  const sortedInstallments = loan.schedule
    .filter(inst => inst.remainingAmount > 0)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  for (const installment of sortedInstallments) {
    if (remainingAmount <= 0) break;
    
    const allocationAmount = Math.min(remainingAmount, installment.remainingAmount);
    
    installment.paidAmount += allocationAmount;
    installment.remainingAmount -= allocationAmount;
    remainingAmount -= allocationAmount;
    
    // Update installment status
    if (installment.remainingAmount === 0) {
      installment.status = 'paid';
      installment.paidDate = new Date();
    } else if (installment.paidAmount > 0) {
      installment.status = 'partial';
    }
    
    allocations.push({
      installmentNumber: installment.installmentNumber,
      amount: allocationAmount
    });
  }
  
  return { allocations, excessAmount: remainingAmount };
};

module.exports = {
  calculateDPD,
  calculateBucket,
  checkBrokenPTP,
  calculateEscalation,
  updateLoanStatus,
  recalcOutstanding,
  getNextDueDate,
  generateLoanSchedule,
  allocatePayment
};