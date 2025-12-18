const Dispute = require('../models/dispute.model');
const Loan = require('../models/loan.model');
const Payment = require('../models/payment.model');

class DisputeService {
  async raiseDispute(loanId, customerId, type, description, attachments, raisedBy, userId) {
    const dispute = new Dispute({
      loanId,
      customerId,
      type,
      description,
      attachments,
      raisedBy,
      raisedByUser: userId,
      status: 'OPEN'
    });

    await Loan.findByIdAndUpdate(loanId, {
      status: 'DISPUTE_PAYMENT_HOLD'
    });

    dispute.auditLog.push({
      action: 'DISPUTE_RAISED',
      user: userId,
      details: { type, raisedBy }
    });

    await dispute.save();
    return dispute;
  }

  async getDispute(disputeId) {
    return Dispute.findById(disputeId)
      .populate('loanId')
      .populate('customerId')
      .populate('raisedByUser')
      .populate('resolution.resolvedBy');
  }

  async listDisputes(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.loanId) query.loanId = filters.loanId;

    return Dispute.find(query)
      .populate('loanId')
      .populate('customerId')
      .sort({ createdAt: -1 });
  }

  async moveToReview(disputeId, userId) {
    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { status: 'UNDER_REVIEW' },
      { new: true }
    );

    dispute.auditLog.push({
      action: 'MOVED_TO_REVIEW',
      user: userId,
      details: {}
    });

    await dispute.save();
    return dispute;
  }

  async resolveDispute(disputeId, action, note, userId) {
    const dispute = await Dispute.findById(disputeId);

    switch (action) {
      case 'ACCEPT_PAYMENT':
      case 'REJECT_CLAIM':
      case 'WAIVE_PENALTY':
      case 'CORRECT_MAPPING':
        await Loan.findByIdAndUpdate(dispute.loanId, {
          status: 'active'
        });
        break;
    }

    dispute.status = 'RESOLVED';
    dispute.resolution = {
      action,
      note,
      resolvedBy: userId,
      resolvedAt: new Date()
    };

    dispute.auditLog.push({
      action: 'DISPUTE_RESOLVED',
      user: userId,
      details: { action, note }
    });

    await dispute.save();
    return dispute;
  }

  async closeDispute(disputeId, userId) {
    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { status: 'CLOSED' },
      { new: true }
    );

    dispute.auditLog.push({
      action: 'DISPUTE_CLOSED',
      user: userId,
      details: {}
    });

    await dispute.save();
    return dispute;
  }

  async getDisputeStats() {
    const stats = await Dispute.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Dispute.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    return { statusStats: stats, typeStats };
  }
}

module.exports = new DisputeService();
