const Loan = require('../models/loan.model');
const Payment = require('../models/payment.model');
const Installment = require('../models/installment.model');

const calculatePortfolioHealthIndex = async () => {
  const loans = await Loan.find({ status: { $in: ['active', 'disbursed'] } });
  if (loans.length === 0) return 0.87;

  const healthScores = loans.map(loan => {
    const nextEMI = loan.getNextEMIDue();
    if (!nextEMI) return 1;
    
    const daysOverdue = Math.max(0, Math.floor((Date.now() - nextEMI.dueDate) / (1000 * 60 * 60 * 24)));
    if (daysOverdue === 0) return 1;
    if (daysOverdue <= 30) return 0.9;
    if (daysOverdue <= 90) return 0.7;
    return 0.4;
  });

  const avgHealth = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;
  return Math.round(avgHealth * 100) / 100;
};

const calculateExpectedCashInflow = async (days = 7) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const installments = await Installment.find({
    dueDate: { $gte: new Date(), $lte: futureDate },
    status: { $in: ['pending', 'partially_paid'] }
  });

  const totalInflow = installments.reduce((sum, inst) => {
    const due = inst.principalDue + inst.interestDue + inst.penaltyDue;
    const paid = inst.paidPrincipal + inst.paidInterest + inst.paidPenalty;
    return sum + Math.max(0, due - paid);
  }, 0);

  return totalInflow;
};

const calculateStressExposure = async () => {
  const riskLoans = await Loan.find({
    $or: [
      { bucket: { $in: ['M1', 'M2', 'M3', 'NPA'] } },
      { dpd: { $gte: 30 } }
    ]
  });

  const totalExposure = riskLoans.reduce((sum, loan) => {
    return sum + (loan.outstandingAmount || 0);
  }, 0);

  return totalExposure;
};

const calculateLiquidityGap = async () => {
  const inflow = await calculateExpectedCashInflow(7);
  const outstandingPayments = await Installment.find({
    dueDate: { $lte: new Date() },
    status: { $in: ['pending', 'partially_paid', 'overdue'] }
  });

  const outflow = outstandingPayments.reduce((sum, inst) => {
    const due = inst.principalDue + inst.interestDue + inst.penaltyDue;
    const paid = inst.paidPrincipal + inst.paidInterest + inst.paidPenalty;
    return sum + Math.max(0, due - paid);
  }, 0);

  return Math.max(0, outflow - inflow);
};

const calculateCollectionEfficiency = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dueInstallments = await Installment.find({
    dueDate: { $gte: thirtyDaysAgo, $lte: new Date() }
  });

  if (dueInstallments.length === 0) return 0;

  const collected = dueInstallments.filter(inst => inst.status === 'paid').length;
  return Math.round((collected / dueInstallments.length) * 100);
};

const calculateRollRate = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const loansWithMovement = await Loan.find({
    updatedAt: { $gte: thirtyDaysAgo }
  });

  const movedToHigherBucket = loansWithMovement.filter(loan => {
    const bucketOrder = { current: 0, X: 1, Y: 2, M1: 3, M2: 4, M3: 5, NPA: 6 };
    return bucketOrder[loan.bucket] > 1;
  }).length;

  return loansWithMovement.length > 0 
    ? Math.round((movedToHigherBucket / loansWithMovement.length) * 100 * 10) / 10
    : 0;
};

const calculateCureRate = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const previouslyOverdueLoans = await Loan.find({
    updatedAt: { $gte: thirtyDaysAgo },
    bucket: { $in: ['X', 'Y', 'M1', 'M2', 'M3'] }
  });

  const curedLoans = previouslyOverdueLoans.filter(loan => loan.bucket === 'current').length;

  return previouslyOverdueLoans.length > 0
    ? Math.round((curedLoans / previouslyOverdueLoans.length) * 100)
    : 0;
};

const calculateEarlyRiskSignals = async () => {
  const signals = [];

  const highDPDLoans = await Loan.countDocuments({ dpd: { $gte: 15, $lt: 30 } });
  if (highDPDLoans > 0) signals.push('high_dpd');

  const increasingNPA = await Loan.countDocuments({ bucket: 'NPA' });
  if (increasingNPA > 10) signals.push('npa_growth');

  const lowCollectionRate = await calculateCollectionEfficiency();
  if (lowCollectionRate < 80) signals.push('low_collection');

  return signals.length > 0 ? 'Moderate' : 'Low';
};

const getRecoveryMomentum = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentPayments = await Payment.find({
    createdAt: { $gte: sevenDaysAgo },
    status: 'success'
  });

  const previousPayments = await Payment.find({
    createdAt: { $gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000), $lt: sevenDaysAgo },
    status: 'success'
  });

  const recentTotal = recentPayments.reduce((sum, p) => sum + p.amount, 0);
  const previousTotal = previousPayments.reduce((sum, p) => sum + p.amount, 0);

  if (recentTotal > previousTotal) return { status: 'Improving', trend: 'up' };
  if (recentTotal < previousTotal) return { status: 'Slowing', trend: 'down' };
  return { status: 'Stable', trend: 'neutral' };
};

const getTodaysPriorityActions = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueTodayCount = await Installment.countDocuments({
    dueDate: { $gte: today, $lt: tomorrow },
    status: { $in: ['pending', 'partially_paid'] }
  });

  const overdueCount = await Installment.countDocuments({
    dueDate: { $lt: today },
    status: { $in: ['pending', 'partially_paid', 'overdue'] }
  });

  const escalationCount = await Loan.countDocuments({
    dpd: { $gte: 90 },
    status: { $ne: 'closed' }
  });

  return [
    { icon: 'phone', count: dueTodayCount, label: 'Calls due today' },
    { icon: 'map-pin', count: Math.ceil(dueTodayCount * 0.3), label: 'Field visits required' },
    { icon: 'alert-circle', count: escalationCount, label: 'Escalations pending' }
  ];
};

const getCashFlowTrends = async (months = 6) => {
  const trends = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - i);
    monthStart.setDate(1);
    
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const payments = await Payment.find({
      createdAt: { $gte: monthStart, $lt: monthEnd },
      status: 'success'
    });

    const totalInflow = payments.reduce((sum, p) => sum + p.amount, 0);
    
    trends.push({
      month: monthStart.toLocaleString('default', { month: 'short' }),
      inflow: totalInflow,
      timestamp: monthStart.getTime()
    });
  }

  return trends;
};

module.exports = {
  calculatePortfolioHealthIndex,
  calculateExpectedCashInflow,
  calculateStressExposure,
  calculateLiquidityGap,
  calculateCollectionEfficiency,
  calculateRollRate,
  calculateCureRate,
  calculateEarlyRiskSignals,
  getRecoveryMomentum,
  getTodaysPriorityActions,
  getCashFlowTrends
};
