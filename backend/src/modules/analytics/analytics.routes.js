const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Analytics routes
router.get('/overview', analyticsController.getOverview);
router.get('/buckets', analyticsController.getBuckets);
router.get('/cashflow-forecast', analyticsController.getCashflowForecast);
router.get('/roll-rates', analyticsController.getRollRates);
router.get('/agent-performance', analyticsController.getAgentPerformance);
router.get('/legal', analyticsController.getLegal);
router.get('/closed', analyticsController.getClosed);
router.get('/defaults', analyticsController.getDefaults);
router.get('/vintage/:cohort', analyticsController.getVintageAnalysis);
router.get('/dpd-distribution', analyticsController.getDPDDistribution);
router.get('/collection-efficiency', analyticsController.getCollectionEfficiency);

module.exports = router;