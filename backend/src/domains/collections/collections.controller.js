const Loan = require('../../models/loan.model');
const CollectorPerformance = require('../../models/collector-performance.model');
const { getError } = require('../../utils/errorCodes');

const getDashboard = async (req, res) => {
  try {
    const loans = await Loan.find({ state: { $in: ['ACTIVE', 'DELINQUENT', 'LEGAL'] } });

    const buckets = {
      'CURRENT': { count: 0, amount: 0 },
      'X': { count: 0, amount: 0 },
      'Y': { count: 0, amount: 0 },
      'M1': { count: 0, amount: 0 },
      'M2': { count: 0, amount: 0 },
      'M3': { count: 0, amount: 0 },
      'NPA': { count: 0, amount: 0 }
    };

    loans.forEach(loan => {
      const bucket = loan.bucket || 'CURRENT';
      if (buckets[bucket]) {
        buckets[bucket].count++;
        buckets[bucket].amount += loan.outstandingAmount || 0;
      }
    });

    const totalLoans = loans.length;
    const totalOutstanding = loans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
    const atRisk = loans.filter(l => l.dpd > 0).length;

    res.json({
      success: true,
      data: {
        totalLoans,
        totalOutstanding,
        atRisk,
        riskPercentage: totalLoans > 0 ? ((atRisk / totalLoans) * 100).toFixed(2) : 0,
        buckets
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

const getCollectorPerformance = async (req, res) => {
  try {
    const performance = await CollectorPerformance.find().sort({ efficiency: -1 });
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

module.exports = { getDashboard, getCollectorPerformance };
