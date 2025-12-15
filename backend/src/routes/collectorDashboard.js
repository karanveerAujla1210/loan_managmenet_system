const express = require('express');
const router = express.Router();
const CollectorDashboardService = require('../services/CollectorDashboardService');
const auth = require('../middleware/auth');

// Get today's dashboard
router.get('/today', auth, async (req, res) => {
  try {
    const dashboard = await CollectorDashboardService.getTodayDashboard(
      req.user.id
    );

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get my cases (priority sorted)
router.get('/cases', auth, async (req, res) => {
  try {
    const cases = await CollectorDashboardService.getMyCases(
      req.user.id,
      req.query
    );

    res.json({
      success: true,
      data: cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get loan detail
router.get('/loan/:loanId', auth, async (req, res) => {
  try {
    const loanDetail = await CollectorDashboardService.getLoanDetail(
      req.params.loanId,
      req.user.id
    );

    res.json({
      success: true,
      data: loanDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get performance
router.get('/performance', auth, async (req, res) => {
  try {
    const performance = await CollectorDashboardService.getPerformance(
      req.user.id,
      req.query.date ? new Date(req.query.date) : new Date()
    );

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
