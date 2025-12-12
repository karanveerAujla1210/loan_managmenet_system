const moment = require('moment');

// Collection bucket configurations
const BUCKET_CONFIG = {
  Current: { min: 0, max: 0, color: '#10B981' },
  X: { min: 1, max: 7, color: '#F59E0B' },
  Y: { min: 8, max: 14, color: '#EF4444' },
  M1: { min: 15, max: 30, color: '#8B5CF6' },
  M2: { min: 31, max: 60, color: '#EC4899' },
  M3: { min: 61, max: 90, color: '#6366F1' },
  NPA: { min: 91, max: Infinity, color: '#1F2937' }
};

// Escalation level names
const ESCALATION_LEVELS = {
  0: 'None',
  1: 'Field Officer',
  2: 'Supervisor',
  3: 'Legal'
};

// Payment allocation strategy
const allocatePayment = (amount, installments) => {
  const sortedInstallments = installments
    .filter(inst => inst.remainingAmount > 0)
    .sort((a, b) => a.installmentNumber - b.installmentNumber);

  let remainingAmount = amount;
  const allocations = [];

  for (const installment of sortedInstallments) {
    if (remainingAmount <= 0) break;

    const allocatedAmount = Math.min(remainingAmount, installment.remainingAmount);
    
    allocations.push({
      installmentNumber: installment.installmentNumber,
      amount: allocatedAmount,
      dueDate: installment.dueDate
    });

    remainingAmount -= allocatedAmount;
  }

  return {
    allocations,
    excessAmount: remainingAmount
  };
};

// Calculate collection efficiency
const calculateCollectionEfficiency = (loans) => {
  const totalDue = loans.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  const totalCollected = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  
  return totalDue > 0 ? (totalCollected / (totalCollected + totalDue)) * 100 : 0;
};

// Get bucket statistics
const getBucketStats = (loans) => {
  const stats = {};
  
  Object.keys(BUCKET_CONFIG).forEach(bucket => {
    const bucketLoans = loans.filter(loan => loan.collectionBucket === bucket);
    stats[bucket] = {
      count: bucketLoans.length,
      totalOutstanding: bucketLoans.reduce((sum, loan) => sum + loan.outstandingAmount, 0),
      avgDPD: bucketLoans.length > 0 
        ? bucketLoans.reduce((sum, loan) => sum + loan.dpd, 0) / bucketLoans.length 
        : 0,
      config: BUCKET_CONFIG[bucket]
    };
  });

  return stats;
};

// Format collection summary for dashboard
const formatCollectionSummary = (loans) => {
  const total = loans.length;
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  const overdueCount = loans.filter(loan => loan.dpd > 0).length;
  const criticalCount = loans.filter(loan => loan.dpd > 30).length;

  return {
    total,
    totalOutstanding,
    overdueCount,
    criticalCount,
    overduePercentage: total > 0 ? (overdueCount / total) * 100 : 0,
    criticalPercentage: total > 0 ? (criticalCount / total) * 100 : 0,
    bucketStats: getBucketStats(loans),
    collectionEfficiency: calculateCollectionEfficiency(loans)
  };
};

// Generate collection report data
const generateCollectionReport = (loans, dateRange) => {
  const { startDate, endDate } = dateRange;
  
  const filteredLoans = loans.filter(loan => {
    const loanDate = moment(loan.createdAt);
    return loanDate.isBetween(startDate, endDate, null, '[]');
  });

  return {
    period: {
      startDate: moment(startDate).format('DD/MM/YYYY'),
      endDate: moment(endDate).format('DD/MM/YYYY')
    },
    summary: formatCollectionSummary(filteredLoans),
    topOverdueLoans: filteredLoans
      .filter(loan => loan.dpd > 0)
      .sort((a, b) => b.dpd - a.dpd)
      .slice(0, 10),
    escalationSummary: {
      level1: filteredLoans.filter(loan => loan.escalationLevel === 1).length,
      level2: filteredLoans.filter(loan => loan.escalationLevel === 2).length,
      level3: filteredLoans.filter(loan => loan.escalationLevel === 3).length
    }
  };
};

// Validate PTP date
const validatePTPDate = (ptpDate, loan) => {
  const date = moment(ptpDate);
  const today = moment();
  const nextDue = moment(loan.nextDueDate);

  if (!date.isValid()) {
    throw new Error('Invalid PTP date');
  }

  if (date.isBefore(today, 'day')) {
    throw new Error('PTP date cannot be in the past');
  }

  if (date.isAfter(nextDue.add(30, 'days'))) {
    throw new Error('PTP date cannot be more than 30 days after next due date');
  }

  return true;
};

module.exports = {
  BUCKET_CONFIG,
  ESCALATION_LEVELS,
  allocatePayment,
  calculateCollectionEfficiency,
  getBucketStats,
  formatCollectionSummary,
  generateCollectionReport,
  validatePTPDate
};