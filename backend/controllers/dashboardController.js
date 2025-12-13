const asyncHandler = require('../middleware/asyncHandler');
const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Collections = require('../models/Collections');

// GET /api/dashboard/metrics
exports.metrics = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [totalCustomers, totalActiveLoans, totalOverdue, collectionsTodayAgg, collectionsMonthAgg, loanDisbursalAgg, pendingApprovalsCount, npaCount] = await Promise.all([
    Customer.countDocuments(),
    Loan.countDocuments({ status: 'active' }),
    Loan.countDocuments({ dpd: { $gt: 0 } }),
    Payment.aggregate([
      { $match: { paymentDate: { $gte: todayStart, $lte: todayEnd }, status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]),
    Payment.aggregate([
      { $match: { paymentDate: { $gte: monthStart }, status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Loan.aggregate([
      { $group: { _id: null, totalDisbursed: { $sum: '$netDisbursement' } } }
    ]),
    // pending approvals: loans or schedules/customers needing action
    Promise.all([
      Loan.countDocuments({ status: 'pending' }),
      Customer.countDocuments({ 'kyc.isVerified': false })
    ]).then(([loansPending, customersPending]) => loansPending + customersPending),
    Loan.countDocuments({ status: 'defaulted' })
  ]);

  res.json({
    success: true,
    data: {
      totalCustomers,
      totalActiveLoans,
      totalOverdueAccounts: totalOverdue,
      totalCollectionsToday: collectionsTodayAgg[0]?.total || 0,
      totalMonthlyCollections: collectionsMonthAgg[0]?.total || 0,
      loanDisbursalAmount: loanDisbursalAgg[0]?.totalDisbursed || 0,
      pendingApprovals: pendingApprovalsCount,
      npaAccounts: npaCount
    }
  });
});

// GET /api/dashboard/loan-performance
exports.loanPerformance = asyncHandler(async (req, res) => {
  // Monthly aggregation of disbursals and collections for last 12 months
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const disbursals = await Loan.aggregate([
    { $match: { disbursementDate: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$disbursementDate' } }, totalDisbursed: { $sum: '$netDisbursement' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ]);

  const collections = await Payment.aggregate([
    { $match: { paymentDate: { $gte: start }, status: 'success' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } }, totalCollected: { $sum: '$amount' } } },
    { $sort: { '_id': 1 } }
  ]);

  res.json({ success: true, data: { disbursals, collections } });
});

// GET /api/dashboard/collections-trend
exports.collectionsTrend = asyncHandler(async (req, res) => {
  // Last 30 days daily totals
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 29);
  start.setHours(0,0,0,0);

  const trend = await Payment.aggregate([
    { $match: { paymentDate: { $gte: start }, status: 'success' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ]);

  res.json({ success: true, data: trend });
});

// GET /api/dashboard/dpd-buckets
exports.dpdBuckets = asyncHandler(async (req, res) => {
  const dpdBuckets = await Loan.aggregate([
    { $group: { _id: '$bucket', count: { $sum: 1 }, avgDpd: { $avg: '$dpd' }, totalAmount: { $sum: '$totalRepayable' } } },
    { $sort: { totalAmount: -1 } }
  ]);

  res.json({ success: true, data: dpdBuckets });
});

// GET /api/dashboard/leads-stats
exports.leadsStats = asyncHandler(async (req, res) => {
  // New leads per week for last 8 weeks
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - (7 * 7));
  start.setHours(0,0,0,0);

  const leads = await Customer.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ]);

  res.json({ success: true, data: leads });
});

// GET /api/dashboard/recent-customers
exports.recentCustomers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const customers = await Customer.find().sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ success: true, data: customers });
});

// GET /api/dashboard/recent-loans
exports.recentLoans = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const loans = await Loan.find().sort({ createdAt: -1 }).limit(limit).populate('customerId', 'firstName lastName phone').lean();
  res.json({ success: true, data: loans });
});

// GET /api/dashboard/today-collections
exports.todayCollections = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const collections = await Payment.find({ paymentDate: { $gte: todayStart, $lte: todayEnd }, status: 'success' }).populate('customerId', 'firstName lastName').populate('loanId', 'loanId').lean();
  res.json({ success: true, data: collections });
});

// GET /api/dashboard/pending-approvals
exports.pendingApprovals = asyncHandler(async (req, res) => {
  // Combine loans with status 'pending' and customers with KYC not verified
  const [loans, customers] = await Promise.all([
    Loan.find({ status: 'pending' }).limit(50).lean(),
    Customer.find({ 'kyc.isVerified': false }).limit(50).lean()
  ]);

  res.json({ success: true, data: { loans, customers } });
});

module.exports = exports;
