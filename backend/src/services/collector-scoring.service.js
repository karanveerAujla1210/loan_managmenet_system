const CollectorPerformance = require('../models/collector-performance.model');
const Payment = require('../models/payment.model');
const Installment = require('../models/installment.model');

const calculateWeeklyScore = async (collectorId, weekStart, weekEnd) => {
  const payments = await Payment.find({
    createdBy: collectorId,
    createdAt: { $gte: weekStart, $lte: weekEnd }
  });
  
  const installments = await Installment.find({
    dueDate: { $gte: weekStart, $lte: weekEnd }
  });
  
  const onTimeCollected = payments.filter(p => {
    const inst = installments.find(i => i._id.equals(p.installmentId));
    return inst && new Date(p.paymentDate) <= new Date(inst.dueDate);
  }).length;
  const onTimeScore = (onTimeCollected / Math.max(installments.length, 1)) * 40;
  
  const earlyOverdueRecovered = payments.filter(p => {
    const inst = installments.find(i => i._id.equals(p.installmentId));
    return inst && inst.status === 'overdue' && new Date(p.paymentDate) <= new Date(inst.dueDate).setDate(new Date(inst.dueDate).getDate() + 7);
  }).length;
  const earlyOverdueScore = (earlyOverdueRecovered / Math.max(installments.length, 1)) * 25;
  
  const promiseScore = 15;
  const bucketScore = 10;
  const dataQualityScore = 10;
  
  const totalScore = onTimeScore + earlyOverdueScore + promiseScore + bucketScore + dataQualityScore;
  
  let incentivePercentage = 0;
  if (totalScore >= 85) incentivePercentage = 100;
  else if (totalScore >= 70) incentivePercentage = 75;
  else if (totalScore >= 50) incentivePercentage = 40;
  
  return {
    onTimeCollections: { collected: onTimeCollected, total: installments.length, score: onTimeScore },
    earlyOverdueRecovery: { recovered: earlyOverdueRecovered, total: installments.length, score: earlyOverdueScore },
    promiseDiscipline: { score: promiseScore },
    bucketImprovement: { score: bucketScore },
    dataQuality: { score: dataQualityScore },
    totalScore,
    incentivePercentage
  };
};

module.exports = {
  calculateWeeklyScore
};
