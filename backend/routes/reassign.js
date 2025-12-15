/**
 * Endpoint: POST /api/v1/loans/:loanId/reassign
 * 
 * Reassign a case from one collector to another
 * Logs audit event for tracking
 */

const express = require('express');
const Loan = require('../models/Loan');
const { authMiddleware } = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditLog');
const { logAuditEvent } = require('../services/auditService');

const router = express.Router({ mergeParams: true });

router.use(auditMiddleware);

/**
 * POST /api/v1/loans/:loanId/reassign
 * Reassign a loan to a different collector
 */
router.post('/:loanId/reassign', authMiddleware, async (req, res) => {
  try {
    // Only managers and admins can reassign
    if (!['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only managers can reassign cases'
      });
    }

    const { loanId } = req.params;
    const { newCollectorId, reason } = req.body;

    if (!newCollectorId) {
      return res.status(400).json({
        success: false,
        message: 'newCollectorId is required'
      });
    }

    // Find the loan
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    const oldCollectorId = loan.assignedCollectorId;

    // Update loan assignment
    loan.assignedCollectorId = newCollectorId;
    loan.reassignedAt = new Date();
    loan.reassignedBy = req.user._id;
    await loan.save();

    // Log audit event
    if (req.audit) {
      await logAuditEvent({
        action: 'case_reassigned',
        userId: req.audit.userId,
        userEmail: req.audit.userEmail,
        userName: req.audit.userName,
        userRole: req.audit.userRole,
        loanId: loan._id,
        loanIdStr: loan.loanId,
        oldValue: {
          assignedCollectorId: oldCollectorId
        },
        newValue: {
          assignedCollectorId: newCollectorId
        },
        changedFields: ['assignedCollectorId'],
        remarks: `Case reassigned: ${reason || 'No reason provided'}`,
        ipAddress: req.audit.ipAddress,
        userAgent: req.audit.userAgent
      });
    }

    res.json({
      success: true,
      message: 'Case reassigned successfully',
      data: {
        loanId: loan._id,
        loanIdStr: loan.loanId,
        oldCollectorId,
        newCollectorId,
        reassignedAt: loan.reassignedAt,
        reason
      }
    });
  } catch (error) {
    console.error('Error reassigning case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reassign case',
      error: error.message
    });
  }
});

module.exports = router;
