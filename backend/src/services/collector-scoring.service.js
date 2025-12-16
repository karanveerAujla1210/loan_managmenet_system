const CollectorPerformance = require('../models/collector-performance.model');
const Installment = require('../models/installment.model');
const PromiseToPay = require('../models/promise-to-pay.model');
const Loan = require('../models/loan.model');
const moment = require('moment');

class CollectorScoringService {
  static async calculateWeeklyScores(weekStartDate) {
    const weekEndDate = moment(weekStartDate).add(6, 'days').toDate();
    const collectors = await Loan.distinct('assignedAgent');

    for (const collectorId of collectors) {
      if (!collectorId) continue;

      const loans = await Loan.find({ assignedAgent: collectorId });
      const loanIds = loans.map(l => l._id);

      // A. On-time collections (40 pts)
      const onTimeInstallments = await Installment.countDocuments({
        loanId: { $in: loanIds },
        dueDate: { $gte: weekStartDate, $lte: weekEndDate },
        status: 'PAID',
        paidDate: { $lte: new Date() }
      });

      const totalDueInstallments = await Installment.countDocuments({
        loanId: { $in: loanIds },
        dueDate: { $gte: weekStartDate, $lte: weekEndDate }
      });

      const onTimeScore = totalDueInstallments > 0 
        ? (onTimeInstallments / totalDueInstallments) * 40 
        : 0;

      // B. Early overdue recovery (25 pts)
      const earlyOverdueRecovered = await Installment.countDocuments({
        loanId: { $in: loanIds },
        status: 'PAID',
        paidDate: { $gte: weekStartDate, $lte: weekEndDate }
      });

      const totalEarlyOverdue = await Installment.countDocuments({
        loanId: { $in: loanIds },
        status: { $in: ['OVERDUE', 'PARTIAL'] }
      });

      const earlyRecoveryScore = totalEarlyOverdue > 0 
        ? (earlyOverdueRecovered / totalEarlyOverdue) * 25 
        : 0;

      // C. Promise discipline (15 pts)
      const totalPromises = await PromiseToPay.countDocuments({
        madeBy: collectorId,
        createdAt: { $gte: weekStartDate, $lte: weekEndDate }
      });

      const brokenPromises = await PromiseToPay.countDocuments({
        madeBy: collectorId,
        status: 'BROKEN',
        createdAt: { $gte: weekStartDate, $lte: weekEndDate }
      });

      const promiseScore = totalPromises > 0 
        ? (1 - (brokenPromises / totalPromises)) * 15 
        : 0;

      // D. Bucket improvement (10 pts)
      const bucketImprovement = await this.calculateBucketImprovement(loanIds, weekStartDate, weekEndDate);

      // E. Data quality (10 pts) - manual review
      const dataQualityScore = 10;

      const totalScore = onTimeScore + earlyRecoveryScore + promiseScore + bucketImprovement + dataQualityScore;
      const incentivePercentage = this.getIncentivePercentage(totalScore);

      await CollectorPerformance.create({
        userId: collectorId,
        weekStartDate,
        weekEndDate,
        onTimeCollections: { count: onTimeInstallments, score: onTimeScore },
        earlyOverdueRecovery: { count: earlyOverdueRecovered, score: earlyRecoveryScore },
        promiseDiscipline: { total: totalPromises, broken: brokenPromises, score: promiseScore },
        bucketImprovement: { count: bucketImprovement, score: bucketImprovement },
        dataQuality: { score: dataQualityScore },
        totalScore,
        incentivePercentage,
        status: 'CALCULATED'
      });
    }
  }

  static async calculateBucketImprovement(loanIds, weekStartDate, weekEndDate) {
    const improved = await Loan.countDocuments({
      _id: { $in: loanIds },
      updatedAt: { $gte: weekStartDate, $lte: weekEndDate },
      bucket: { $in: ['CURRENT', '1-7', '8-15'] }
    });
    return Math.min(improved, 10);
  }

  static getIncentivePercentage(score) {
    if (score >= 85) return 100;
    if (score >= 70) return 75;
    if (score >= 50) return 40;
    return 0;
  }
}

module.exports = CollectorScoringService;
