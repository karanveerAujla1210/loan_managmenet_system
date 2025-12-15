const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const Loan = require('../models/Loan');
const Collections = require('../models/Collections');
const { logAuditEvent } = require('../services/auditService');
const AuditLog = require('../models/AuditLog');

/**
 * POST /api/v1/loans/:loanId/promise
 * Record a promise to pay
 */
router.post('/:loanId/promise', authorize(['collector', 'manager', 'admin']), asyncHandler(async (req, res) => {
  const { loanId } = req.params;
  const { promiseToPayDate, promiseAmount, remarks } = req.body;

  if (!promiseToPayDate) {
    return res.status(400).json({ message: 'Promise date is required' });
  }

  const loan = await Loan.findById(loanId);
  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  const oldValue = {
    promiseToPayDate: loan.promiseToPayDate,
    promiseStatus: loan.promiseStatus,
  };

  loan.promiseToPayDate = new Date(promiseToPayDate);
  loan.promiseStatus = 'pending';
  loan.lastRemark = remarks || `Promise made for ${new Date(promiseToPayDate).toLocaleDateString()}`;
  loan.collectorId = req.user.id;

  await loan.save();

  // Log audit event
  try {
    await logAuditEvent({
      action: 'promise_made',
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      loanId: loan._id,
      loanIdStr: loan.loanId,
      oldValue,
      newValue: {
        promiseToPayDate: loan.promiseToPayDate,
        promiseStatus: loan.promiseStatus,
      },
      remarks: remarks || 'Promise to pay recorded',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (auditError) {
    console.error('Audit logging failed:', auditError.message);
    // Don't fail the operation if audit fails
  }

  res.json({
    success: true,
    message: 'Promise recorded successfully',
    data: {
      loanId: loan.loanId,
      promiseToPayDate: loan.promiseToPayDate,
      promiseStatus: loan.promiseStatus,
      reminderScheduled: true,
    },
  });
}));

/**
 * PUT /api/v1/loans/:loanId/promise/honored
 * Mark a promise as honored (payment received)
 */
router.put('/:loanId/promise/honored', authorize(['collector', 'manager', 'admin']), asyncHandler(async (req, res) => {
  const { loanId } = req.params;

  const loan = await Loan.findById(loanId);
  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  const oldValue = {
    promiseStatus: loan.promiseStatus,
    promiseToPayDate: loan.promiseToPayDate,
  };

  loan.promiseStatus = 'honored';
  loan.lastRemark = 'Promise honored - payment received';

  await loan.save();

  // Log audit event
  try {
    await logAuditEvent({
      action: 'promise_honored',
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      loanId: loan._id,
      loanIdStr: loan.loanId,
      oldValue,
      newValue: {
        promiseStatus: loan.promiseStatus,
      },
      remarks: 'Promise fulfilled - payment received',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (auditError) {
    console.error('Audit logging failed:', auditError.message);
  }

  res.json({
    success: true,
    message: 'Promise marked as honored',
    data: {
      loanId: loan.loanId,
      promiseStatus: loan.promiseStatus,
    },
  });
}));

/**
 * PUT /api/v1/loans/:loanId/promise/broken
 * Mark a promise as broken (due date passed without payment)
 */
router.put('/:loanId/promise/broken', authorize(['system', 'manager', 'admin']), asyncHandler(async (req, res) => {
  const { loanId } = req.params;
  const { reason } = req.body;

  const loan = await Loan.findById(loanId);
  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  const oldValue = {
    promiseStatus: loan.promiseStatus,
    promiseToPayDate: loan.promiseToPayDate,
  };

  loan.promiseStatus = 'broken';
  loan.lastRemark = reason || 'Promise broken - no payment received by due date';

  await loan.save();

  // Log audit event
  try {
    await logAuditEvent({
      action: 'promise_broken',
      userId: req.user.id || 'system',
      userEmail: req.user?.email || 'system@scheduler',
      userName: req.user?.name || 'Automated Scheduler',
      userRole: req.user?.role || 'system',
      loanId: loan._id,
      loanIdStr: loan.loanId,
      oldValue,
      newValue: {
        promiseStatus: loan.promiseStatus,
      },
      remarks: reason || 'Promise broken - automated by cron job',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (auditError) {
    console.error('Audit logging failed:', auditError.message);
  }

  res.json({
    success: true,
    message: 'Promise marked as broken',
    data: {
      loanId: loan.loanId,
      promiseStatus: loan.promiseStatus,
    },
  });
}));

/**
 * GET /api/v1/loans/:loanId/promise/history
 * Get promise history for a loan
 */
router.get('/:loanId/promise/history', authorize(['collector', 'manager', 'admin']), asyncHandler(async (req, res) => {
  const { loanId } = req.params;

  const loan = await Loan.findById(loanId);
  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  // Get all promise-related audit logs
  const promiseHistory = await AuditLog.find({
    loanId: loan._id,
    action: { $in: ['promise_made', 'promise_honored', 'promise_broken'] },
  }).sort({ timestamp: -1 }).limit(20);

  res.json({
    success: true,
    data: promiseHistory.map(log => ({
      date: log.timestamp,
      action: log.action,
      user: log.userName,
      promiseDate: log.newValue?.promiseToPayDate,
      status: log.newValue?.promiseStatus,
      remarks: log.remarks,
    })),
  });
}));

/**
 * GET /api/v1/promises/due-today
 * Get all loans with promises due today
 */
router.get('/due-today', authorize(['collector', 'manager', 'admin']), asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const loansWithPromises = await Loan.find({
    status: 'active',
    promiseToPayDate: { $gte: today, $lt: tomorrow },
    promiseStatus: { $ne: 'honored' },
  }).select('loanId customerName dpd emiAmount remainingAmount promiseToPayDate promiseStatus assignedCollectorId').limit(100);

  res.json({
    success: true,
    count: loansWithPromises.length,
    data: loansWithPromises,
  });
}));

/**
 * GET /api/v1/promises/analytics
 * Get promise fulfillment analytics
 */
router.get('/analytics', authorize(['manager', 'admin']), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) {
    dateFilter.$lt = new Date(endDate);
    dateFilter.$lt.setDate(dateFilter.$lt.getDate() + 1); // Include end date
  }

  // Get promise-related audit logs
  const promiseLogs = await AuditLog.aggregate([
    {
      $match: {
        action: { $in: ['promise_made', 'promise_honored', 'promise_broken'] },
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
    },
    {
      $group: {
        _id: '$userId',
        userName: { $first: '$userName' },
        totalPromises: {
          $sum: { $cond: [{ $eq: ['$action', 'promise_made'] }, 1, 0] },
        },
        honoredPromises: {
          $sum: { $cond: [{ $eq: ['$action', 'promise_honored'] }, 1, 0] },
        },
        brokenPromises: {
          $sum: { $cond: [{ $eq: ['$action', 'promise_broken'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        userId: '$_id',
        userName: 1,
        totalPromises: 1,
        honoredPromises: 1,
        brokenPromises: 1,
        fulfillmentRate: {
          $cond: [
            { $eq: ['$totalPromises', 0] },
            0,
            {
              $multiply: [
                { $divide: ['$honoredPromises', '$totalPromises'] },
                100,
              ],
            },
          ],
        },
      },
    },
    { $sort: { fulfillmentRate: -1 } },
  ]);

  res.json({
    success: true,
    stats: promiseLogs,
    summary: {
      totalPromises: promiseLogs.reduce((sum, s) => sum + s.totalPromises, 0),
      totalHonored: promiseLogs.reduce((sum, s) => sum + s.honoredPromises, 0),
      totalBroken: promiseLogs.reduce((sum, s) => sum + s.brokenPromises, 0),
      averageFulfillmentRate:
        promiseLogs.length > 0
          ? promiseLogs.reduce((sum, s) => sum + s.fulfillmentRate, 0) /
            promiseLogs.length
          : 0,
    },
  });
}));

module.exports = router;
