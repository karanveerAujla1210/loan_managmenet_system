const express = require('express');
const router = express.Router();
const { triggerDPDUpdate } = require('../cron/dpdCronScheduler');
const { authMiddleware } = require('../middleware/auth');

/**
 * Manual DPD Update Trigger
 * POST /api/v1/admin/dpd-update
 * 
 * Admin endpoint to manually trigger DPD calculation
 * Useful for testing or forcing an update outside scheduled time
 */
router.post('/dpd-update', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can trigger DPD updates'
      });
    }

    const result = await triggerDPDUpdate();
    
    res.json({
      success: true,
      message: 'DPD update completed',
      data: result
    });
  } catch (error) {
    console.error('DPD update failed:', error);
    res.status(500).json({
      success: false,
      message: 'DPD update failed',
      error: error.message
    });
  }
});

/**
 * Check DPD Cron Status
 * GET /api/v1/admin/dpd-status
 */
router.get('/dpd-status', authMiddleware, (req, res) => {
  // Check if user is admin or manager
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  }

  res.json({
    success: true,
    message: 'DPD Cron is running',
    nextRun: getNextCronRun(),
    lastRun: global.lastDPDCronRun || 'Not run yet',
    schedule: 'Daily at 2:30 AM'
  });
});

/**
 * Helper to calculate next cron run time
 */
function getNextCronRun() {
  const now = new Date();
  const nextRun = new Date();
  nextRun.setDate(nextRun.getDate() + 1); // Tomorrow
  nextRun.setHours(2, 30, 0, 0); // 2:30 AM
  return nextRun;
}

module.exports = router;
