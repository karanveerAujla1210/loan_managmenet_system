/**
 * Schema Validation Utilities
 * Ensures data integrity before database operations
 */

const validateLoanCreation = (loanData) => {
  const errors = [];

  if (!loanData.borrowerName) errors.push('borrowerName is required');
  if (!loanData.phone) errors.push('phone is required');
  if (!loanData.productId) errors.push('productId is required');
  if (!loanData.loanAmount || loanData.loanAmount <= 0) errors.push('loanAmount must be positive');
  if (!loanData.totalPayable || loanData.totalPayable <= 0) errors.push('totalPayable must be positive');
  if (!loanData.disbursementDate) errors.push('disbursementDate is required');

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateInstalmentCreation = (instalmentData) => {
  const errors = [];

  if (!instalmentData.loanId) errors.push('loanId is required');
  if (!instalmentData.instalmentNo || instalmentData.instalmentNo <= 0) errors.push('instalmentNo must be positive');
  if (!instalmentData.dueDate) errors.push('dueDate is required');
  if (!instalmentData.dueAmount || instalmentData.dueAmount <= 0) errors.push('dueAmount must be positive');

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validatePaymentCreation = (paymentData) => {
  const errors = [];

  if (!paymentData.loanId) errors.push('loanId is required');
  if (!paymentData.instalmentId) errors.push('instalmentId is required');
  if (!paymentData.amount || paymentData.amount <= 0) errors.push('amount must be positive');
  if (!paymentData.mode) errors.push('mode is required');
  if (!['UPI', 'CASH', 'IMPS', 'NEFT', 'RTGS'].includes(paymentData.mode)) {
    errors.push('mode must be one of: UPI, CASH, IMPS, NEFT, RTGS');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUserCreation = (userData) => {
  const errors = [];

  if (!userData.name) errors.push('name is required');
  if (!userData.email) errors.push('email is required');
  if (!userData.password || userData.password.length < 8) errors.push('password must be at least 8 characters');
  if (!userData.role) errors.push('role is required');
  if (!['CONTROLLER', 'COLLECTOR', 'ADMIN'].includes(userData.role)) {
    errors.push('role must be one of: CONTROLLER, COLLECTOR, ADMIN');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateLoanCreation,
  validateInstalmentCreation,
  validatePaymentCreation,
  validateUserCreation
};
