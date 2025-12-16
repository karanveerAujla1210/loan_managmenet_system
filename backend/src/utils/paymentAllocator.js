const moment = require('moment');
const PENALTY_AMOUNT = 250;

const allocatePayment = (installments, paymentAmount) => {
  const allocation = {
    installmentAllocations: [],
    penaltyCharged: 0,
    remainingAmount: paymentAmount
  };
  
  for (const inst of installments) {
    if (allocation.remainingAmount <= 0) break;
    
    if (inst.status === 'PENDING' || inst.status === 'PARTIAL' || inst.status === 'OVERDUE') {
      const dueDate = moment(inst.dueDate);
      const today = moment().startOf('day');
      const isOverdue = today.isAfter(dueDate);
      
      let penalty = 0;
      if (isOverdue && inst.penalty === 0) {
        penalty = PENALTY_AMOUNT;
        allocation.penaltyCharged += penalty;
      }
      
      const totalDue = inst.remainingAmount + penalty;
      const amountToAllocate = Math.min(allocation.remainingAmount, totalDue);
      
      allocation.installmentAllocations.push({
        installmentNo: inst.installmentNo,
        allocated: amountToAllocate,
        penalty: penalty,
        newStatus: amountToAllocate >= totalDue ? 'PAID' : 'PARTIAL'
      });
      
      allocation.remainingAmount -= amountToAllocate;
    }
  }
  
  return allocation;
};

module.exports = {
  allocatePayment,
  PENALTY_AMOUNT
};
