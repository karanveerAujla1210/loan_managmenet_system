const express = require('express');
const dashboardController = require('./dashboard.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/stats', dashboardController.getStats);
router.get('/collection-performance', dashboardController.getCollectionPerformance);

module.exports = router;