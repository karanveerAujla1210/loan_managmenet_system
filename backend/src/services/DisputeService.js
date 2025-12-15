const Dispute = require('../models/DisputeModel');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

class DisputeService {
  // Raise a new dispute
  async raiseDispute(loanId, customerId, type, description, attachments, raisedBy, userId) {
    const dispute = new Dispute({
      loanId,
      customerId,
      type,
      description,
      attachments,
      raisedBy,
      raisedByUser: userId,
      status: 'OPEN',
    });

    // Update loan status to DISPUTE_PAYMENT_HOLD
    await Loan.findByIdAndUpdate(loanId, {
      status: 'DISPUTE_PAYMENT_HOLD',
    });

    // Add audit log
    dispute.auditLog.push({
      action: 'DISPUTE_RAISED',
      user: userId,
      details: { type, raisedBy },
    });

    await dispute.save();
    return dispute;
  }

  // Get dispute details
  async getDispute(disputeId) {
    return Dispute.findById(disputeId)
      .populate('loanId')
      .populate('customerId')
      .populate('raisedByUser')
      .populate('resolution.resolvedBy');
  }

  // List disputes with filters
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

  // Move dispute to review
  async moveToReview(disputeId, userId) {
    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { status: 'UNDER_REVIEW' },
      { new: true }
    );

    dispute.auditLog.push({
      action: 'MOVED_TO_REVIEW',
      user: userId,
      details: {},
    });

    await dispute.save();
    return dispute;
  }

  // Resolve dispute
  async resolveDispute(disputeId, action, note, userId) {
    const dispute = await Dispute.findById(disputeId);
    const loan = await Loan.findById(dispute.loanId);

    // Handle resolution based on action
    switch (action) {
      case 'ACCEPT_PAYMENT':
        // Payment already recorded, just update loan status
        await Loan.findByIdAndUpdate(dispute.loanId, {
          status: 'ACTIVE',
        });
        break;

      case 'REJECT_CLAIM':
        // Revert to previous status
        await Loan.findByIdAndUpdate(dispute.loanId, {
          status: 'ACTIVE',
        });
        break;

      case 'WAIVE_PENALTY':
        // Admin-only: waive penalty
        const lastPayment = await Payment.findOne({ loanId: dispute.loanId })
          .sort({ createdAt: -1 });
        if (lastPayment) {
          lastPayment.penaltyWaived = true;
          await lastPayment.save();
        }
        await Loan.findByIdAndUpdate(dispute.loanId, {
          status: 'ACTIVE',
        });
        break;

      case 'CORRECT_MAPPING':
        // Correct system mapping error
        await Loan.findByIdAndUpdate(dispute.loanId, {
          status: 'ACTIVE',
        });
        break;
    }

    // Update dispute
    dispute.status = 'RESOLVED';
    dispute.resolution = {
      action,
      note,
      resolvedBy: userId,
      resolvedAt: new Date(),
    };

    dispute.auditLog.push({
      action: 'DISPUTE_RESOLVED',
      user: userId,
      details: { action, note },
    });

    await dispute.save();
    return dispute;
  }

  // Close dispute
  async closeDispute(disputeId, userId) {
    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { status: 'CLOSED' },
      { new: true }
    );

    dispute.auditLog.push({
      action: 'DISPUTE_CLOSED',
      user: userId,
      details: {},
    });

    await dispute.save();
    return dispute;
  }

  // Get dispute statistics
  async getDisputeStats() {
    const stats = await Dispute.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await Dispute.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    return { statusStats: stats, typeStats };
  }
}

module.exports = new DisputeService();
