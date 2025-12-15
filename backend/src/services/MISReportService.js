const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

class MISReportService {
  /**
   * Generate Daily MIS Report
   * Core Metrics for Operations
   */
  async generateDailyMIS(reportDate = new Date()) {
    const dayStart = new Date(reportDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(reportDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Total Active Loans
    const totalActiveLoan = await Loan.countDocuments({
      status: { $in: ['ACTIVE', 'OVERDUE'] }
    });

    // Total Outstanding
    const outstandingAgg = await Loan.aggregate([
      {
        $match: { status: { $in: ['ACTIVE', 'OVERDUE'] } }
      },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: '$outstandingAmount' }
        }
      }
    ]);
    const totalOutstanding = outstandingAgg[0]?.totalOutstanding || 0;

    // Today's Due (Amount)
    const todaysDueLoans = await Loan.find({
      status: { $in: ['ACTIVE', 'OVERDUE'] },
      nextDueDate: { $gte: dayStart, $lte: dayEnd }
    });
    const todaysDue = todaysDueLoans.reduce((sum, loan) => sum + (loan.emiAmount || 0), 0);
    const todaysDueCount = todaysDueLoans.length;

    // Today's Collected
    const todaysPayments = await Payment.find({
      paymentDate: { $gte: dayStart, $lte: dayEnd },
      status: 'CONFIRMED'
    });
    const todaysCollection = todaysPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Collection Efficiency %
    const collectionEfficiency = todaysDue > 0 ? ((todaysCollection / todaysDue) * 100).toFixed(2) : 0;

    // New Overdues Today (loans that became overdue)
    const newOverdues = await Loan.countDocuments({
      previousBucket: { $in: ['NORMAL', null] },
      bucket: { $in: ['EARLY_OVERDUE', 'OVERDUE', 'SEVERE_OVERDUE', 'LONG_OVERDUE', 'LEGAL'] },
      bucketChangedDate: { $gte: dayStart, $lte: dayEnd }
    });

    // Recoveries Today
    const recoveries = todaysPayments.length;

    return {
      reportDate,
      dayStart,
      dayEnd,
      metrics: {
        totalActiveLoan,
        totalOutstanding,
        todaysDue,
        todaysDueCount,
        todaysCollection,
        collectionEfficiency: parseFloat(collectionEfficiency),
        newOverdues,
        recoveries
      }
    };
  }

  /**
   * Generate Portfolio Health Report
   * Bucket-wise Distribution (Trendable)
   */
  async generatePortfolioHealth(reportDate = new Date()) {
    const bucketDistribution = await Loan.aggregate([
      {
        $match: { status: { $in: ['ACTIVE', 'OVERDUE'] } }
      },
      {
        $group: {
          _id: '$bucket',
          count: { $sum: 1 },
          totalAmount: { $sum: '$outstandingAmount' },
          avgDPD: { $avg: '$dpd' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Calculate total portfolio
    const totalCount = bucketDistribution.reduce((sum, b) => sum + (b.count || 0), 0);
    const totalAmount = bucketDistribution.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Format response
    const buckets = {};
    const bucketNames = {
      'NORMAL': '0 DPD',
      'EARLY_OVERDUE': '1–7 DPD',
      'OVERDUE': '8–30 DPD',
      'SEVERE_OVERDUE': '31–60 DPD',
      'LONG_OVERDUE': '60+ DPD',
      'LEGAL': '90+ DPD (Legal)'
    };

    bucketDistribution.forEach(bucket => {
      buckets[bucket._id] = {
        count: bucket.count,
        amount: bucket.totalAmount,
        percentage: ((bucket.totalAmount / totalAmount) * 100).toFixed(2),
        avgDPD: bucket.avgDPD.toFixed(1)
      };
    });

    return {
      reportDate,
      portfolioSummary: {
        totalActiveLoans: totalCount,
        totalOutstanding: totalAmount,
        reportingBuckets: bucketNames
      },
      bucketDistribution: buckets
    };
  }

  /**
   * Roll Rate Analysis
   * Shows how loans move between buckets
   */
  async generateRollRateAnalysis(periodStart = null, periodEnd = null) {
    if (!periodStart) {
      periodEnd = new Date();
      periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    }

    // Get all loans with bucket history
    const loans = await Loan.find({
      bucketChangedDate: { $gte: periodStart, $lte: periodEnd }
    }).select('_id previousBucket bucket bucketChangedDate');

    // Build roll rate matrix
    const rollRateMatrix = {
      'NORMAL': {},
      'EARLY_OVERDUE': {},
      'OVERDUE': {},
      'SEVERE_OVERDUE': {},
      'LONG_OVERDUE': {},
      'LEGAL': {}
    };

    // Initialize buckets
    Object.keys(rollRateMatrix).forEach(fromBucket => {
      Object.keys(rollRateMatrix).forEach(toBucket => {
        rollRateMatrix[fromBucket][toBucket] = 0;
      });
    });

    // Count transitions
    loans.forEach(loan => {
      const from = loan.previousBucket || 'NORMAL';
      const to = loan.bucket || 'NORMAL';

      if (rollRateMatrix[from]) {
        rollRateMatrix[from][to] = (rollRateMatrix[from][to] || 0) + 1;
      }
    });

    // Calculate percentages
    const rollRatePercentage = {};
    Object.keys(rollRateMatrix).forEach(fromBucket => {
      const total = Object.values(rollRateMatrix[fromBucket]).reduce((sum, val) => sum + val, 0);
      rollRatePercentage[fromBucket] = {};

      Object.keys(rollRateMatrix[fromBucket]).forEach(toBucket => {
        rollRatePercentage[fromBucket][toBucket] = total > 0
          ? ((rollRateMatrix[fromBucket][toBucket] / total) * 100).toFixed(2)
          : 0;
      });
    });

    return {
      periodStart,
      periodEnd,
      analysis: 'Shows percentage of loans moving from one bucket to another',
      rollRateMatrix,
      rollRatePercentage
    };
  }

  /**
   * Legal & Loss Report
   */
  async generateLegalLossReport(reportDate = new Date()) {
    const legalLoans = await Loan.find({
      bucket: 'LEGAL',
      status: { $in: ['ACTIVE', 'OVERDUE'] }
    });

    const totalLegalCases = legalLoans.length;
    const totalLegalOutstanding = legalLoans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
    const avgDPDLegal = legalLoans.length > 0
      ? (legalLoans.reduce((sum, l) => sum + (l.dpd || 0), 0) / legalLoans.length).toFixed(1)
      : 0;

    // Percentage of portfolio in legal
    const allActiveLoans = await Loan.find({
      status: { $in: ['ACTIVE', 'OVERDUE'] }
    });
    const portfolioAmount = allActiveLoans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
    const legalPercentage = portfolioAmount > 0
      ? ((totalLegalOutstanding / portfolioAmount) * 100).toFixed(2)
      : 0;

    return {
      reportDate,
      legal: {
        totalLegalCases,
        totalLegalOutstanding,
        avgDPDLegal,
        legalPercentageOfPortfolio: parseFloat(legalPercentage)
      }
    };
  }

  /**
   * Unit Economics Snapshot
   */
  async generateUnitEconomics(reportDate = new Date()) {
    const activeLoans = await Loan.find({
      status: { $in: ['ACTIVE', 'OVERDUE'] }
    });

    if (activeLoans.length === 0) {
      return {
        reportDate,
        unitEconomics: null,
        message: 'No active loans'
      };
    }

    // Average loan size
    const avgLoanSize = (activeLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0) / activeLoans.length).toFixed(2);

    // Average interest earned (assuming interest rate on loan)
    // This assumes loanAmount has interest embedded, or there's an interestRate field
    const avgInterestRate = 12; // Default 12% p.a., should be from loan model
    const avgInterestEarned = (parseFloat(avgLoanSize) * (avgInterestRate / 100) / 12).toFixed(2);

    // Average processing fee + GST
    const avgProcessingFee = (parseFloat(avgLoanSize) * 0.01).toFixed(2); // 1% of loan
    const avgGST = (parseFloat(avgProcessingFee) * 0.18).toFixed(2); // 18% GST

    // Net yield
    const avgNetYield = (
      parseFloat(avgLoanSize) * 
      ((parseFloat(avgInterestRate) + 1.18) / 100 / 12)
    ).toFixed(2);

    // Cost of collection estimate (assuming 5% of loan value)
    const costOfCollectionEstimate = (parseFloat(avgLoanSize) * 0.05).toFixed(2);

    // Profitability per loan
    const profitPerLoan = (
      parseFloat(avgInterestEarned) +
      parseFloat(avgProcessingFee) +
      parseFloat(avgGST) -
      parseFloat(costOfCollectionEstimate)
    ).toFixed(2);

    return {
      reportDate,
      unitEconomics: {
        avgLoanSize: parseFloat(avgLoanSize),
        avgInterestEarned: parseFloat(avgInterestEarned),
        avgProcessingFee: parseFloat(avgProcessingFee),
        avgGST: parseFloat(avgGST),
        totalUpfrontRevenue: (parseFloat(avgProcessingFee) + parseFloat(avgGST)).toFixed(2),
        avgMonthlyYield: parseFloat(avgNetYield),
        costOfCollectionEstimate: parseFloat(costOfCollectionEstimate),
        profitPerLoan: parseFloat(profitPerLoan),
        roi: ((parseFloat(profitPerLoan) / parseFloat(avgLoanSize)) * 100).toFixed(2)
      },
      loanCount: activeLoans.length
    };
  }

  /**
   * Historical trends (for day-on-day comparison)
   */
  async generateHistoricalTrends(days = 30) {
    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const reportDate = new Date();
      reportDate.setDate(reportDate.getDate() - i);

      const dailyMIS = await this.generateDailyMIS(reportDate);
      trends.push(dailyMIS.metrics);
    }

    return {
      periodDays: days,
      trends
    };
  }
}

module.exports = new MISReportService();
