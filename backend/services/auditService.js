const AuditLog = require('../models/AuditLog');

/**
 * Log an audit event
 * @param {object} logData - { action, userId, userEmail, userName, userRole, loanId, loanIdStr, oldValue, newValue, changedFields, remarks, amount, ipAddress }
 */
async function logAuditEvent(logData) {
  try {
    const auditLog = new AuditLog({
      action: logData.action,
      userId: logData.userId,
      userEmail: logData.userEmail,
      userName: logData.userName,
      userRole: logData.userRole,
      loanId: logData.loanId,
      loanIdStr: logData.loanIdStr,
      oldValue: logData.oldValue,
      newValue: logData.newValue,
      changedFields: logData.changedFields || [],
      remarks: logData.remarks,
      amount: logData.amount,
      ipAddress: logData.ipAddress,
      userAgent: logData.userAgent,
      timestamp: new Date()
    });

    await auditLog.save();
    console.log(`[AUDIT] ${logData.action} for loan ${logData.loanIdStr}`);
    return auditLog;
  } catch (error) {
    console.error('[AUDIT] Error logging event:', error);
    // Don't throw - audit logging shouldn't break main operation
    return null;
  }
}

/**
 * Get audit logs for a specific loan
 */
async function getLoanAuditLogs(loanId, options = {}) {
  try {
    const skip = (options.page || 0) * (options.limit || 20);
    const limit = options.limit || 20;

    const logs = await AuditLog.find({ loanId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AuditLog.countDocuments({ loanId });

    return {
      success: true,
      data: logs,
      pagination: {
        total,
        page: options.page || 0,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get audit logs by date range
 */
async function getAuditLogsByDateRange(startDate, endDate, options = {}) {
  try {
    const skip = (options.page || 0) * (options.limit || 50);
    const limit = options.limit || 50;

    const query = {
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (options.userId) {
      query.userId = options.userId;
    }
    if (options.action) {
      query.action = options.action;
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AuditLog.countDocuments(query);

    return {
      success: true,
      data: logs,
      pagination: {
        total,
        page: options.page || 0,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching audit logs by date:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user activity summary
 */
async function getUserActivitySummary(userId, daysBack = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const logs = await AuditLog.find({
      userId,
      timestamp: { $gte: startDate }
    }).lean();

    const summary = {
      totalActions: logs.length,
      paymentRecorded: logs.filter(l => l.action === 'payment_recorded').length,
      promiseMade: logs.filter(l => l.action === 'promise_made').length,
      caseReassigned: logs.filter(l => l.action === 'case_reassigned').length,
      statusChanged: logs.filter(l => l.action === 'status_changed').length,
      legalEscalated: logs.filter(l => l.action === 'legal_escalated').length
    };

    return {
      success: true,
      data: summary
    };
  } catch (error) {
    console.error('Error getting user activity summary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  logAuditEvent,
  getLoanAuditLogs,
  getAuditLogsByDateRange,
  getUserActivitySummary
};
