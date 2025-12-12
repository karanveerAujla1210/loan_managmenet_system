const allocatePayment = (loan, paymentAmount) => {
  const allocations = [];
  let remainingAmount = paymentAmount;
  
  // Sort installments by due date to allocate to earliest first
  const unpaidInstallments = loan.installments
    .filter(i => i.paidAmount < i.totalAmount)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  for (const installment of unpaidInstallments) {
    if (remainingAmount <= 0) break;
    
    const outstandingAmount = installment.totalAmount - installment.paidAmount;
    const allocationAmount = Math.min(remainingAmount, outstandingAmount);
    
    // Calculate principal and interest split
    const totalOutstanding = installment.totalAmount;
    const principalRatio = installment.principalAmount / totalOutstanding;
    const interestRatio = installment.interestAmount / totalOutstanding;
    
    const principalPaid = allocationAmount * principalRatio;
    const interestPaid = allocationAmount * interestRatio;
    
    allocations.push({
      installmentNumber: installment.installmentNumber,
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      totalPaid: allocationAmount
    });
    
    remainingAmount -= allocationAmount;
  }
  
  return allocations;
};

module.exports = { allocatePayment };