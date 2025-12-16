
const express = require('express');
const router = express.Router();
const {
  getOverdueSummary,
  getDetailedOverdueReport,
  getOverdueAgingReport,
  exportOverdueReport
} = require('../controllers/overdueReportControllerNew');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// GET /api/overdue-reports/summary
router.get('/summary', getOverdueSummary);

// GET /api/overdue-reports/detailed
router.get('/detailed', getDetailedOverdueReport);

// GET /api/overdue-reports/aging
router.get('/aging', getOverdueAgingReport);

// GET /api/overdue-reports/export
router.get('/export', exportOverdueReport);

module.exports = router;
