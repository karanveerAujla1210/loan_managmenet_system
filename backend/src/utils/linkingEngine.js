const linkPaymentToLoan = (payment, loans) => {
  if (payment.loanId) {
    return {
      loanId: payment.loanId,
      status: 'LINKED'
    };
  }
  
  const candidates = loans.filter(loan => {
    const amountMatch = Math.abs(loan.weeklyEmi - payment.amount) < 1;
    const dateMatch = Math.abs(
      new Date(loan.disbursementDate).getTime() - 
      new Date(payment.paymentDate).getTime()
    ) < 30 * 24 * 60 * 60 * 1000;
    
    return amountMatch && dateMatch;
  });
  
  if (candidates.length === 1) {
    return {
      loanId: candidates[0]._id,
      status: 'AUTO_LINKED'
    };
  }
  
  return {
    loanId: null,
    status: 'UNLINKED'
  };
};

module.exports = {
  linkPaymentToLoan
};
