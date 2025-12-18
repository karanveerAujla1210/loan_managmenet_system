const Loan = require('../models/loan.model');
const Payment = require('../models/payment.model');

class MISReportService {
  async generateDailyMIS(reportDate = new Date()) {
    const dayStart = new Date(reportDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(reportDate);
    dayEnd.setHours(23, 59, 59, 999);

    const totalActiveLoan = await Loan.countDocuments({
      status: { $in: ['active', 'npa'] }
    });

    const outstandingAgg = await Loan.aggregate([
      {
        $match: { status: { $in: ['active', 'npa'] } }
      },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: '$outstandingAmount' }
        }
      }
    ]);
    const totalOutstanding = outstandingAgg[0]?.totalOutstanding || 0;

    const todaysPayments = await Payment.find({
      paymentDate: { $gte: dayStart, $lte: dayEnd },
      status: 'confirmed'
    });
    const todaysCollection = todaysPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      reportDate,
      metrics: {
        totalActiveLoan,
        totalOutstanding,
        todaysCollection,
        collectionEfficiency: totalOutstanding > 0 ? ((todaysCollection / totalOutstanding) * 100).toFixed(2) : 0
      }
    };
  }

  async generatePortfolioHealth(reportDate = new Date()) {
    const bucketDistribution = await Loan.aggregate([
      {
        $match: { status: { $in: ['active', 'npa'] } }
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

    const totalCount = bucketDistribution.reduce((sum, b) => sum + (b.count || 0), 0);
    const totalAmount = bucketDistribution.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const buckets = {};
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
        totalOutstanding: totalAmount
      },
      bucketDistribution: buckets
    };
  }

  async generateLegalLossReport(reportDate = new Date()) {
    const legalLoans = await Loan.find({
      bucket: 'LEGAL',
      status: { $in: ['active', 'npa'] }
    });

    const totalLegalCases = legalLoans.length;
    const totalLegalOutstanding = legalLoans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
    const avgDPDLegal = legalLoans.length > 0
      ? (legalLoans.reduce((sum, l) => sum + (l.dpd || 0), 0) / legalLoans.length).toFixed(1)
      : 0;

    const allActiveLoans = await Loan.find({
      status: { $in: ['active', 'npa'] }
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
}

module.exports = new MISReportService();
