const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const PromiseToPay = require('../models/PromiseToPayModel');
const CollectorPerformance = require('../models/CollectorPerformanceModel');

class CollectorScoringService {
  /**
   * Calculate weekly collector performance score (100 points total)
   * A. Due-Date Collection Rate (40 points)
   * B. Early Overdue Recovery (25 points)
   * C. Promise Discipline (15 points)
   * D. Bucket Movement Impact (10 points)
   * E. Data Quality (10 points)
   */

  async calculateWeeklyScore(collectorId, weekStartDate = null) {
    // Default to current week
    if (!weekStartDate) {
      const today = new Date();
      weekStartDate = new Date(today);
      weekStartDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    }

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // End of week (Saturday)

    let totalScore = 0;
    const scoreBreakdown = {};

    // A. Due-Date Collection Rate (40 points)
    const dueDateScore = await this.calculateDueDateCollectionRate(
      collectorId,
      weekStartDate,
      weekEndDate
    );
    scoreBreakdown.dueDateCollection = dueDateScore;
    totalScore += dueDateScore;

    // B. Early Overdue Recovery (25 points)
    const earlyOverdueScore = await this.calculateEarlyOverdueRecovery(
      collectorId,
      weekStartDate,
      weekEndDate
    );
    scoreBreakdown.earlyOverdueRecovery = earlyOverdueScore;
    totalScore += earlyOverdueScore;

    // C. Promise Discipline (15 points)
    const promiseScore = await this.calculatePromiseDiscipline(
      collectorId,
      weekStartDate,
      weekEndDate
    );
    scoreBreakdown.promiseDiscipline = promiseScore;
    totalScore += promiseScore;

    // D. Bucket Movement Impact (10 points)
    const bucketScore = await this.calculateBucketMovement(
      collectorId,
      weekStartDate,
      weekEndDate
    );
    scoreBreakdown.bucketMovement = bucketScore;
    totalScore += bucketScore;

    // E. Data Quality (10 points)
    const dataQualityScore = this.calculateDataQuality(collectorId, 10);
    scoreBreakdown.dataQuality = dataQualityScore;
    totalScore += dataQualityScore;

    // Save score
    await CollectorPerformance.updateOne(
      { collectorId, weekStartDate },
      {
        collectorId,
        weekStartDate,
        weekEndDate,
        totalScore: Math.min(totalScore, 100), // Cap at 100
        scoreBreakdown,
        updatedAt: new Date()
      },
      { upsert: true }
    );

    return {
      collectorId,
      totalScore: Math.min(totalScore, 100),
      scoreBreakdown,
      weekStartDate,
      weekEndDate
    };
  }

  /**
   * A. Due-Date Collection Rate (40 points)
   * (Due EMIs Collected on Time / Total Due EMIs) × 40
   */
  async calculateDueDateCollectionRate(collectorId, weekStart, weekEnd) {
    const loans = await Loan.find({
      assignedCollector: collectorId,
      status: { $in: ['ACTIVE', 'OVERDUE', 'CLOSED'] }
    });

    let totalDueEMIs = 0;
    let collectedOnTime = 0;

    for (const loan of loans) {
      // Get EMIs that were due during the week
      const dueEMIs = await this.getEMIsDuringPeriod(loan._id, weekStart, weekEnd);

      for (const emi of dueEMIs) {
        totalDueEMIs++;

        // Check if payment was made on or before due date
        const payment = await Payment.findOne({
          loanId: loan._id,
          paymentDate: { $lte: emi.dueDate },
          status: 'CONFIRMED'
        });

        if (payment) {
          collectedOnTime++;
        }
      }
    }

    const rate = totalDueEMIs > 0 ? (collectedOnTime / totalDueEMIs) : 0;
    return rate * 40; // Max 40 points
  }

  /**
   * B. Early Overdue Recovery (25 points)
   * (1–7 DPD EMIs recovered / Total 1–7 DPD EMIs) × 25
   */
  async calculateEarlyOverdueRecovery(collectorId, weekStart, weekEnd) {
    const loans = await Loan.find({
      assignedCollector: collectorId,
      dpd: { $gte: 1, $lte: 7 } // Early overdue
    });

    let totalEarlyOverdueEMIs = 0;
    let recoveredEarlyOverdue = 0;

    for (const loan of loans) {
      const overduePeriodStart = new Date(loan.nextDueDate);
      overduePeriodStart.setDate(overduePeriodStart.getDate() + 1);
      const overduePeriodEnd = new Date(overduePeriodStart);
      overduePeriodEnd.setDate(overduePeriodStart.getDate() + 7);

      // Count overdue EMIs that existed before the week
      if (overduePeriodEnd > weekStart) {
        totalEarlyOverdueEMIs++;

        // Check if payment was made during the week
        const payment = await Payment.findOne({
          loanId: loan._id,
          paymentDate: { $gte: weekStart, $lte: weekEnd },
          status: 'CONFIRMED'
        });

        if (payment) {
          recoveredEarlyOverdue++;
        }
      }
    }

    const rate = totalEarlyOverdueEMIs > 0 ? (recoveredEarlyOverdue / totalEarlyOverdueEMIs) : 0;
    return rate * 25; // Max 25 points
  }

  /**
   * C. Promise Discipline (15 points)
   * 1 − (Broken Promises / Total Promises) × 15
   */
  async calculatePromiseDiscipline(collectorId, weekStart, weekEnd) {
    // Get promises made by this collector before or during the week
    const allPromises = await PromiseToPay.find({
      createdBy: collectorId,
      promiseDate: { $lte: weekEnd }
    });

    if (allPromises.length === 0) {
      return 15; // Perfect score if no promises made
    }

    let brokenPromises = 0;

    for (const promise of allPromises) {
      const promiseDate = new Date(promise.promiseDate);
      promiseDate.setHours(23, 59, 59, 999);

      // Check if payment was made by promise date
      const payment = await Payment.findOne({
        loanId: promise.loanId,
        paymentDate: { $lte: promiseDate },
        status: 'CONFIRMED'
      });

      if (!payment) {
        brokenPromises++;
      }
    }

    const breakRate = brokenPromises / allPromises.length;
    return Math.max(0, (1 - breakRate) * 15); // Max 15 points
  }

  /**
   * D. Bucket Movement Impact (10 points)
   * Loans moved to LOWER bucket − Loans moved to HIGHER bucket (normalized)
   */
  async calculateBucketMovement(collectorId, weekStart, weekEnd) {
    const loanHistory = await Loan.find({
      assignedCollector: collectorId,
      $or: [
        { bucketChangedDate: { $gte: weekStart, $lte: weekEnd } }
      ]
    });

    let movedDown = 0; // Positive movement (improved bucket)
    let movedUp = 0;   // Negative movement (worsened bucket)

    for (const loan of loanHistory) {
      if (loan.previousBucket && loan.bucket) {
        const bucketRank = {
          'NORMAL': 0,
          'EARLY_OVERDUE': 1,
          'OVERDUE': 2,
          'SEVERE_OVERDUE': 3,
          'LONG_OVERDUE': 4,
          'LEGAL': 5
        };

        const currentRank = bucketRank[loan.bucket] || 0;
        const previousRank = bucketRank[loan.previousBucket] || 0;

        if (currentRank < previousRank) {
          movedDown++; // Improved
        } else if (currentRank > previousRank) {
          movedUp++;   // Worsened
        }
      }
    }

    const netMovement = (movedDown - movedUp) / (movedDown + movedUp || 1);
    return Math.max(0, Math.min(10, netMovement * 10)); // Max 10 points
  }

  /**
   * E. Data Quality (10 points)
   * Manager-controlled assessment
   */
  calculateDataQuality(collectorId, points = 10) {
    // This would be set by manager based on:
    // - No wrong entries
    // - No fake payments
    // - No disputes caused
    // Default to full points unless marked otherwise
    return points;
  }

  /**
   * Helper: Get EMIs due during a specific period
   */
  async getEMIsDuringPeriod(loanId, periodStart, periodEnd) {
    const loan = await Loan.findById(loanId);
    if (!loan) return [];

    const emis = [];
    const loanStart = new Date(loan.createdAt);
    let currentEmiDate = new Date(loan.startDate || loanStart);

    for (let i = 0; i < loan.tenure; i++) {
      if (currentEmiDate >= periodStart && currentEmiDate <= periodEnd) {
        emis.push({
          emiNumber: i + 1,
          dueDate: currentEmiDate,
          amount: loan.emiAmount
        });
      }
      currentEmiDate.setMonth(currentEmiDate.getMonth() + 1);
    }

    return emis;
  }

  /**
   * Get top performing collectors for a week
   */
  async getTopPerformers(weekStartDate = null, limit = 10) {
    const performances = await CollectorPerformance.find({
      weekStartDate: weekStartDate || { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ totalScore: -1 }).limit(limit).populate('collectorId');

    return performances;
  }

  /**
   * Get collector score history
   */
  async getCollectorScoreHistory(collectorId, weeks = 12) {
    const scores = await CollectorPerformance.find({
      collectorId,
      weekStartDate: {
        $gte: new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000)
      }
    }).sort({ weekStartDate: -1 });

    return scores;
  }
}

module.exports = new CollectorScoringService();
