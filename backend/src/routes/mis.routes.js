const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const CollectorScoringService = require('../services/CollectorScoringService');
const MISReportService = require('../services/MISReportService');

// ==================== COLLECTOR SCORING ====================

// Get collector's current week score
router.get('/collector/:collectorId/score', auth.authorize('MANAGER', 'ADMIN'), asyncHandler(async (req, res) => {
  const { collectorId } = req.params;

  const scoreData = await CollectorScoringService.calculateWeeklyScore(collectorId);

  res.json({
    success: true,
    data: scoreData
  });
}));

// Get collector score history (last 12 weeks)
router.get('/collector/:collectorId/score-history', auth.authorize('MANAGER', 'ADMIN'), asyncHandler(async (req, res) => {
  const { collectorId } = req.params;

  const history = await CollectorScoringService.getCollectorScoreHistory(collectorId, 12);

  res.json({
    success: true,
    data: history
  });
}));

// Get top performing collectors
router.get('/collector/leaderboard', auth.authorize('MANAGER', 'ADMIN'), asyncHandler(async (req, res) => {
  const { week, limit = 10 } = req.query;

  const topPerformers = await CollectorScoringService.getTopPerformers(week ? new Date(week) : null, limit);

  res.json({
    success: true,
    data: topPerformers
  });
}));

// ==================== MIS REPORTS ====================

// Daily MIS Report
router.get('/mis/daily', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { date } = req.query;
  const reportDate = date ? new Date(date) : new Date();

  const misReport = await MISReportService.generateDailyMIS(reportDate);

  res.json({
    success: true,
    data: misReport
  });
}));

// Portfolio Health Report (Bucket Distribution)
router.get('/mis/portfolio-health', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { date } = req.query;
  const reportDate = date ? new Date(date) : new Date();

  const healthReport = await MISReportService.generatePortfolioHealth(reportDate);

  res.json({
    success: true,
    data: healthReport
  });
}));

// Roll Rate Analysis
router.get('/mis/roll-rate', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const rollRate = await MISReportService.generateRollRateAnalysis(
    startDate ? new Date(startDate) : null,
    endDate ? new Date(endDate) : null
  );

  res.json({
    success: true,
    data: rollRate
  });
}));

// Legal & Loss Report
router.get('/mis/legal-loss', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { date } = req.query;
  const reportDate = date ? new Date(date) : new Date();

  const legalReport = await MISReportService.generateLegalLossReport(reportDate);

  res.json({
    success: true,
    data: legalReport
  });
}));

// Unit Economics Report
router.get('/mis/unit-economics', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { date } = req.query;
  const reportDate = date ? new Date(date) : new Date();

  const unitEconomics = await MISReportService.generateUnitEconomics(reportDate);

  res.json({
    success: true,
    data: unitEconomics
  });
}));

// Historical Trends (day-on-day)
router.get('/mis/trends', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const trends = await MISReportService.generateHistoricalTrends(parseInt(days));

  res.json({
    success: true,
    data: trends
  });
}));

// Comprehensive MIS Dashboard (All reports)
router.get('/mis/dashboard', auth.authorize('MANAGER', 'ADMIN', 'LEGAL'), asyncHandler(async (req, res) => {
  const { date = new Date() } = req.query;

  const [daily, health, legal, economics, trends] = await Promise.all([
    MISReportService.generateDailyMIS(date),
    MISReportService.generatePortfolioHealth(date),
    MISReportService.generateLegalLossReport(date),
    MISReportService.generateUnitEconomics(date),
    MISReportService.generateHistoricalTrends(7) // Last 7 days
  ]);

  res.json({
    success: true,
    data: {
      daily,
      health,
      legal,
      economics,
      trends
    }
  });
}));

module.exports = router;
