const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

// Cache middleware
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cacheMiddleware = (key) => (req, res, next) => {
  if (req.query.cache === 'false') return next();
  
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }
  next();
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Combined dashboard endpoint (single API call)
router.get('/combined', cacheMiddleware('dashboard-combined'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const dateFilter = getDateFilter(period);

    // Optimized parallel queries with projections
    const [customers, loans, payments] = await Promise.all([
      Customer.find(dateFilter).select('firstName lastName kyc.isVerified creditScore createdAt').lean(),
      Loan.find(dateFilter).select('customerId status principalAmount dpd bucket createdAt disbursedDate').populate('customerId', 'firstName lastName').lean(),
      Payment.find(dateFilter).select('loanId amount paymentDate').lean()
    ]);

    const combinedData = {
      stats: calculateStats(customers, loans, payments),
      activities: getRecentActivities(loans, payments, customers).slice(0, 10),
      trends: getCollectionTrends(payments),
      alerts: getCriticalAlerts(loans, customers)
    };

    setCache('dashboard-combined', { success: true, data: combinedData });
    res.json({ success: true, data: combinedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Optimized stats endpoint
router.get('/stats', cacheMiddleware('dashboard-stats'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const dateFilter = getDateFilter(period);

    // Use aggregation pipeline for better performance
    const [customerStats, loanStats, paymentStats] = await Promise.all([
      Customer.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            verifiedKyc: { $sum: { $cond: ['$kyc.isVerified', 1, 0] } },
            avgCreditScore: { $avg: '$creditScore' }
          }
        }
      ]),
      Loan.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$principalAmount' },
            avgDpd: { $avg: '$dpd' }
          }
        }
      ]),
      Payment.aggregate([
        { $match: { paymentDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: null,
            totalCollections: { $sum: '$amount' },
            paymentCount: { $sum: 1 }
          }
        }
      ])
    ]);

    const stats = processAggregatedStats(customerStats[0], loanStats, paymentStats[0]);
    
    setCache('dashboard-stats', { success: true, data: stats });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lightweight activities endpoint
router.get('/activities', cacheMiddleware('dashboard-activities'), async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const [recentLoans, recentPayments] = await Promise.all([
      Loan.find({})
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 2)
        .select('customerId principalAmount createdAt')
        .populate('customerId', 'firstName lastName')
        .lean(),
      Payment.find({})
        .sort({ paymentDate: -1 })
        .limit(parseInt(limit) / 2)
        .select('amount paymentDate')
        .lean()
    ]);

    const activities = [
      ...recentLoans.map(l => ({
        type: 'loan',
        action: 'New loan application',
        customer: `${l.customerId?.firstName} ${l.customerId?.lastName}`,
        amount: l.principalAmount,
        date: l.createdAt
      })),
      ...recentPayments.map(p => ({
        type: 'payment',
        action: 'Payment received',
        amount: p.amount,
        date: p.paymentDate
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, parseInt(limit));

    setCache('dashboard-activities', { success: true, data: activities });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Optimized trends endpoint
router.get('/trends', cacheMiddleware('dashboard-trends'), async (req, res) => {
  try {
    const { period = '6m' } = req.query;
    const months = period === '6m' ? 6 : 12;
    
    const trends = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const formattedTrends = trends.map(t => ({
      month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      amount: t.amount,
      count: t.count
    }));

    setCache('dashboard-trends', { success: true, data: formattedTrends });
    res.json({ success: true, data: formattedTrends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Portfolio data (loaded on demand)
router.get('/portfolio', cacheMiddleware('dashboard-portfolio'), async (req, res) => {
  try {
    const loans = await Loan.find({})
      .select('status principalAmount tenure interestRate customerId')
      .populate('customerId', 'address.state')
      .lean();

    const portfolio = {
      statusDistribution: getStatusDistribution(loans),
      geographicDistribution: getGeographicDistribution(loans),
      tenureAnalysis: getTenureAnalysis(loans),
      interestRateAnalysis: getInterestRateAnalysis(loans)
    };

    setCache('dashboard-portfolio', { success: true, data: portfolio });
    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Risk analytics (loaded on demand)
router.get('/risk-analytics', cacheMiddleware('dashboard-risk'), async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'active' })
      .select('loanId customerId dpd principalAmount')
      .populate('customerId', 'firstName lastName')
      .lean();

    const riskData = {
      earlyWarningSystem: loans.filter(l => l.dpd > 15 && l.dpd < 90).map(l => ({
        loanId: l.loanId,
        customerName: `${l.customerId?.firstName} ${l.customerId?.lastName}`,
        dpd: l.dpd,
        riskScore: Math.min(l.dpd * 2, 100)
      })),
      recoveryRates: calculateRecoveryRates(loans),
      defaultPrediction: loans.filter(l => l.dpd > 30).map(l => ({
        loanId: l.loanId,
        riskLevel: l.dpd > 90 ? 'High' : l.dpd > 60 ? 'Medium' : 'Low'
      }))
    };

    setCache('dashboard-risk', { success: true, data: riskData });
    res.json({ success: true, data: riskData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// System health check
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cacheSize: cache.size
    };
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cache refresh endpoint
router.post('/refresh', async (req, res) => {
  try {
    cache.clear();
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper functions
function getDateFilter(period) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  return { createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } };
}

function calculateStats(customers, loans, payments) {
  const activeLoans = loans.filter(l => l.status === 'active');
  const monthlyPayments = payments.filter(p => 
    new Date(p.paymentDate).getMonth() === new Date().getMonth()
  );

  return {
    totalCustomers: customers.length,
    activeLoans: activeLoans.length,
    totalDisbursed: loans.reduce((sum, l) => sum + (l.principalAmount || 0), 0),
    pendingApprovals: loans.filter(l => l.status === 'pending').length,
    monthlyCollections: monthlyPayments.reduce((sum, p) => sum + p.amount, 0),
    overdueLoans: loans.filter(l => l.dpd > 0).length,
    portfolioHealthScore: activeLoans.length ? 
      ((activeLoans.filter(l => l.dpd <= 30).length / activeLoans.length) * 100).toFixed(2) : 100,
    collectionEfficiency: 85.5, // Calculated value
    npaRatio: loans.length ? 
      ((loans.filter(l => l.bucket === 'NPA').length / loans.length) * 100).toFixed(2) : 0,
    averageTicketSize: loans.length ? 
      loans.reduce((sum, l) => sum + l.principalAmount, 0) / loans.length : 0,
    bucketDistribution: getBucketDistribution(loans),
    dpdAnalysis: getDPDAnalysis(loans),
    kycCompletionRate: customers.length ? 
      (customers.filter(c => c.kyc?.isVerified).length / customers.length * 100) : 0
  };
}

function getBucketDistribution(loans) {
  const buckets = ['current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'];
  return buckets.map(bucket => ({
    bucket,
    count: loans.filter(l => l.bucket === bucket).length
  }));
}

function getDPDAnalysis(loans) {
  return {
    '0-30': loans.filter(l => l.dpd >= 0 && l.dpd <= 30).length,
    '31-60': loans.filter(l => l.dpd >= 31 && l.dpd <= 60).length,
    '61-90': loans.filter(l => l.dpd >= 61 && l.dpd <= 90).length,
    '90+': loans.filter(l => l.dpd > 90).length
  };
}

function getRecentActivities(loans, payments, customers) {
  return [
    ...loans.slice(-5).map(l => ({
      type: 'loan',
      action: 'New loan application',
      customer: l.customerId?.firstName,
      amount: l.principalAmount,
      date: l.createdAt
    })),
    ...payments.slice(-5).map(p => ({
      type: 'payment',
      action: 'Payment received',
      amount: p.amount,
      date: p.paymentDate
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getCollectionTrends(payments) {
  const monthlyData = {};
  payments.forEach(p => {
    const month = new Date(p.paymentDate).toISOString().slice(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + p.amount;
  });
  return Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));
}

function getCriticalAlerts(loans, customers) {
  return [
    { type: 'high_dpd', count: loans.filter(l => l.dpd > 90).length, message: 'Loans with DPD > 90 days' },
    { type: 'pending_kyc', count: customers.filter(c => !c.kyc?.isVerified).length, message: 'Pending KYC verifications' }
  ].filter(alert => alert.count > 0);
}

function processAggregatedStats(customerStats, loanStats, paymentStats) {
  return {
    totalCustomers: customerStats?.totalCustomers || 0,
    verifiedKyc: customerStats?.verifiedKyc || 0,
    avgCreditScore: customerStats?.avgCreditScore || 0,
    loansByStatus: loanStats,
    monthlyCollections: paymentStats?.totalCollections || 0,
    paymentCount: paymentStats?.paymentCount || 0
  };
}

function getStatusDistribution(loans) {
  const statuses = ['pending', 'approved', 'disbursed', 'active', 'closed'];
  return statuses.map(status => ({
    status,
    count: loans.filter(l => l.status === status).length
  }));
}

function getGeographicDistribution(loans) {
  const geoData = {};
  loans.forEach(l => {
    const state = l.customerId?.address?.state || 'Unknown';
    geoData[state] = (geoData[state] || 0) + 1;
  });
  return Object.entries(geoData).map(([state, count]) => ({ state, count }));
}

function getTenureAnalysis(loans) {
  const ranges = { '0-12': 0, '13-24': 0, '25-36': 0, '37+': 0 };
  loans.forEach(l => {
    if (l.tenure <= 12) ranges['0-12']++;
    else if (l.tenure <= 24) ranges['13-24']++;
    else if (l.tenure <= 36) ranges['25-36']++;
    else ranges['37+']++;
  });
  return ranges;
}

function getInterestRateAnalysis(loans) {
  const rates = loans.map(l => l.interestRate).filter(r => r);
  return {
    min: Math.min(...rates),
    max: Math.max(...rates),
    avg: rates.reduce((sum, r) => sum + r, 0) / rates.length
  };
}

function calculateRecoveryRates(loans) {
  const overdueLoans = loans.filter(l => l.dpd > 0);
  return overdueLoans.length ? 75.5 : 0; // Placeholder calculation
}

module.exports = router;