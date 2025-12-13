const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Protect all dashboard endpoints
router.use(auth);

router.get('/metrics', dashboard.metrics);
router.get('/loan-performance', dashboard.loanPerformance);
router.get('/collections-trend', dashboard.collectionsTrend);
router.get('/dpd-buckets', dashboard.dpdBuckets);
router.get('/leads-stats', dashboard.leadsStats);
router.get('/recent-customers', dashboard.recentCustomers);
router.get('/recent-loans', dashboard.recentLoans);
router.get('/today-collections', dashboard.todayCollections);
router.get('/pending-approvals', dashboard.pendingApprovals);

module.exports = router;
