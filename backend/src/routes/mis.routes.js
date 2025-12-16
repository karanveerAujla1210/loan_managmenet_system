const express = require('express');
const MISReportService = require('../services/mis-report.service');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Portfolio snapshot
router.get('/portfolio-snapshot', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const data = await MISReportService.getPortfolioSnapshot();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Bucket exposure
router.get('/bucket-exposure', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const data = await MISReportService.getBucketExposure();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Collection efficiency
router.get('/collection-efficiency', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const data = await MISReportService.getCollectionEfficiency(date);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Roll rate analysis
router.get('/roll-rate', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const data = await MISReportService.getRollRateAnalysis();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Legal exposure
router.get('/legal-exposure', protect, authorize('admin', 'manager', 'legal'), async (req, res) => {
  try {
    const data = await MISReportService.getLegalExposure();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
