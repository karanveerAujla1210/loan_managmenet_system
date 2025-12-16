const CollectorPerformance = require('../models/CollectorPerformance');
const Payment = require('../models/payment.model');
const Installment = require('../models/disbursement.model');

const calculateWeeklyScore = async (collectorId, weekStart, weekEnd) => {
  const payments = await Payment.find({
    createdBy: collectorId,
    createdAt: { $gte: weekStart, $lte: weekEnd }
  });
  
  const installments = await Installment.find({
    dueDate: { $gte: weekStart, $lte: weekEnd }
  });
  
  // A. On-Time Collections (40 pts)
  const onTimeCollected = payments.filter(p => {
    const inst = installments.find(i => i._id.equals(p.installmentId));
    return inst && new Date(p.paymentDate) <= new Date(inst.dueDate);
  }).length;
  const onTimeScore = (onTimeCollected / Math.max(installments.length, 1)) * 40;
  
  // B. Early Overdue Recovery (25 pts)
  const earlyOverdueRecovered = payments.filter(p => {
    const inst = installments.find(i => i._id.equals(p.installmentId));
    return inst && inst.status === 'OVERDUE' && new Date(p.paymentDate) <= new Date(inst.dueDate).setDate(new Date(inst.dueDate).getDate() + 7);
  }).length;
  const earlyOverdueScore = (earlyOverdueRecovered / Math.max(installments.length, 1)) * 25;
  
  // C. Promise Discipline (15 pts)
  const promiseScore = 15; // Placeholder
  
  // D. Bucket Improvement (10 pts)
  const bucketScore = 10; // Placeholder
  
  // E. Data Quality (10 pts)
  const dataQualityScore = 10; // Placeholder
  
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
