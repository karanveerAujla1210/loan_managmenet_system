const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const auditService = require('../services/auditService');

/**
 * GET /api/v1/audit/loan/:loanId
 * Get audit trail for a specific loan
 */
router.get('/loan/:loanId', authMiddleware, async (req, res) => {
  try {
    const { loanId } = req.params;
    const { page = 0, limit = 20 } = req.query;

    const result = await auditService.getLoanAuditLogs(loanId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/v1/audit/range
 * Get audit logs by date range
 * Query: startDate, endDate, userId, action, page, limit
 */
router.get('/range', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, userId, action, page = 0, limit = 50 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    const result = await auditService.getAuditLogsByDateRange(startDate, endDate, {
      userId,
      action,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/v1/audit/user/:userId
 * Get activity summary for a user
 */
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    // Only allow users to see their own audit trail unless they're admin/manager
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const result = await auditService.getUserActivitySummary(userId, parseInt(days));
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
