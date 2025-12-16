const Dispute = require('../models/dispute.model');
const Loan = require('../models/loan.model');
const AuditLog = require('../models/audit-log.model');

class DisputeService {
  static async createDispute(loanId, reason, userId) {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    const dispute = await Dispute.create({
      loanId,
      reason,
      raisedBy: userId,
      dpdFrozen: true,
      frozenDPD: loan.dpd
    });

    await AuditLog.create({
      action: 'DISPUTE_CREATED',
      entity: 'DISPUTE',
      entityId: dispute._id,
      userId,
      changes: { after: { reason, dpdFrozen: true } },
      status: 'SUCCESS'
    });

    return dispute;
  }

  static async resolveDispute(disputeId, resolution, userId) {
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    dispute.status = 'RESOLVED';
    dispute.resolution = resolution;
    dispute.resolvedBy = userId;
    dispute.resolvedAt = new Date();
    dispute.dpdFrozen = false;
    await dispute.save();

    await AuditLog.create({
      action: 'DISPUTE_RESOLVED',
      entity: 'DISPUTE',
      entityId: dispute._id,
      userId,
      changes: { after: { status: 'RESOLVED', resolution } },
      status: 'SUCCESS'
    });

    return dispute;
  }

  static async getActiveLoanDisputes(loanId) {
    return await Dispute.find({ loanId, status: { $in: ['OPEN', 'UNDER_REVIEW'] } });
  }
}

module.exports = DisputeService;
