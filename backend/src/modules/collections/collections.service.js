const Loan = require('../loans/loans.model');
const User = require('../users/users.model');
const { allocatePayment } = require('../../utils/loanHelpers');

class CollectionsService {
  async getDueToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const loans = await Loan.find({
      'schedule.dueDate': { $gte: today, $lt: tomorrow },
      'schedule.remainingAmount': { $gt: 0 },
      status: { $in: ['active', 'overdue'] }
    })
    .populate('customerId', 'firstName lastName phone address')
    .populate('agentId', 'firstName lastName employeeId')
    .sort({ 'schedule.dueDate': 1 });

    return loans;
  }

  async getOverdue() {
    const loans = await Loan.find({
      dpd: { $gt: 0 },
      status: { $in: ['overdue', 'critical', 'broken_ptp'] }
    })
    .populate('customerId', 'firstName lastName phone address')
    .populate('agentId', 'firstName lastName employeeId')
    .sort({ dpd: -1 });

    return loans;
  }

  async getByBucket(bucket) {
    const loans = await Loan.find({
      collectionBucket: bucket,
      outstandingAmount: { $gt: 0 }
    })
    .populate('customerId', 'firstName lastName phone address')
    .populate('agentId', 'firstName lastName employeeId')
    .sort({ dpd: -1 });

    return loans;
  }

  async getByAgent(agentId) {
    const loans = await Loan.find({
      agentId,
      outstandingAmount: { $gt: 0 }
    })
    .populate('customerId', 'firstName lastName phone address')
    .sort({ dpd: -1 });

    return loans;
  }

  async addPayment(loanId, paymentData) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new Error('Loan not found');
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}`;
    
    // Allocate payment to installments
    const { allocations, excessAmount } = allocatePayment(loan, paymentData.amount);
    
    if (excessAmount > 0) {
      throw new Error(`Payment amount exceeds outstanding balance by ${excessAmount}`);
    }

    // Add transaction
    const transaction = {
      transactionId,
      type: 'payment',
      amount: paymentData.amount,
      method: paymentData.mode || 'cash',
      allocatedTo: allocations,
      collectedBy: paymentData.agentId,
      notes: paymentData.notes
    };

    loan.transactions.push(transaction);
    loan.paidAmount += paymentData.amount;

    // Add event
    loan.events.push({
      type: 'payment',
      description: `Payment of ₹${paymentData.amount} received`,
      actor: paymentData.agentId,
      payload: { 
        amount: paymentData.amount, 
        method: paymentData.mode,
        transactionId 
      }
    });

    // Update metrics
    loan.updateMetrics();
    
    await loan.save();
    
    return {
      loan,
      transaction,
      allocations
    };
  }

  async addPTP(loanId, ptpData) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new Error('Loan not found');
    }

    // Deactivate existing PTP
    loan.ptp.active = false;
    
    // Add new PTP
    loan.ptp = {
      active: true,
      promiseDate: new Date(ptpData.ptpDate),
      amount: ptpData.amount,
      createdBy: ptpData.agentId,
      createdAt: new Date()
    };

    // Add to PTP history
    loan.promiseToPay.push({
      amount: ptpData.amount,
      promiseDate: new Date(ptpData.ptpDate),
      createdBy: ptpData.agentId
    });

    // Add event
    loan.events.push({
      type: 'ptp',
      description: `Promise to Pay created for ₹${ptpData.amount}`,
      actor: ptpData.agentId,
      payload: { 
        amount: ptpData.amount, 
        promiseDate: ptpData.ptpDate,
        note: ptpData.note
      }
    });

    await loan.save();
    return loan;
  }

  async addNote(loanId, noteData) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new Error('Loan not found');
    }

    loan.collectionNotes.push({
      note: noteData.note,
      createdBy: noteData.agentId
    });

    // Add event
    loan.events.push({
      type: 'note',
      description: 'Collection note added',
      actor: noteData.agentId,
      payload: { note: noteData.note }
    });

    await loan.save();
    return loan;
  }

  async escalateLoan(loanId, escalationData) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new Error('Loan not found');
    }

    const currentLevel = loan.escalationLevel;
    const newLevel = Math.min(currentLevel + 1, 3); // Max level is 3 (legal)

    loan.escalationLevel = newLevel;

    // Add event
    loan.events.push({
      type: 'escalation',
      description: `Loan escalated from level ${currentLevel} to ${newLevel}`,
      actor: escalationData.agentId,
      payload: { 
        from: currentLevel, 
        to: newLevel,
        reason: escalationData.reason
      }
    });

    await loan.save();
    return loan;
  }

  async assignLoan(loanId, agentId, assignedBy) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new Error('Loan not found');
    }

    const agent = await User.findById(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    const previousAgent = loan.agentId;
    loan.agentId = agentId;

    // Add event
    loan.events.push({
      type: 'assignment',
      description: `Loan assigned to ${agent.firstName} ${agent.lastName}`,
      actor: assignedBy,
      payload: { 
        previousAgent,
        newAgent: agentId,
        agentName: `${agent.firstName} ${agent.lastName}`
      }
    });

    await loan.save();
    return loan;
  }

  async getCollectionSummary() {
    const summary = await Loan.aggregate([
      {
        $group: {
          _id: '$collectionBucket',
          count: { $sum: 1 },
          totalOutstanding: { $sum: '$outstandingAmount' },
          avgDPD: { $avg: '$dpd' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalStats = await Loan.aggregate([
      {
        $group: {
          _id: null,
          totalLoans: { $sum: 1 },
          totalOutstanding: { $sum: '$outstandingAmount' },
          totalOverdue: { 
            $sum: { 
              $cond: [{ $gt: ['$dpd', 0] }, 1, 0] 
            } 
          }
        }
      }
    ]);

    return {
      bucketSummary: summary,
      totalStats: totalStats[0] || {}
    };
  }

  async getDashboardData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Collections today
    const collectionsToday = await Loan.aggregate([
      { $unwind: '$transactions' },
      { 
        $match: { 
          'transactions.date': { $gte: today, $lt: tomorrow },
          'transactions.type': 'payment'
        } 
      },
      { $group: { _id: null, total: { $sum: '$transactions.amount' } } }
    ]);

    // Due today
    const dueToday = await Loan.countDocuments({
      'schedule.dueDate': { $gte: today, $lt: tomorrow },
      'schedule.remainingAmount': { $gt: 0 }
    });

    // Overdue by bucket
    const overdueByBucket = await Loan.aggregate([
      { $match: { dpd: { $gt: 0 } } },
      {
        $group: {
          _id: '$collectionBucket',
          count: { $sum: 1 },
          totalOutstanding: { $sum: '$outstandingAmount' }
        }
      }
    ]);

    // Agent performance
    const agentPerformance = await Loan.aggregate([
      { $match: { agentId: { $exists: true } } },
      { $unwind: '$transactions' },
      { 
        $match: { 
          'transactions.type': 'payment',
          'transactions.date': { 
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        } 
      },
      { 
        $group: { 
          _id: '$agentId',
          totalCollected: { $sum: '$transactions.amount' },
          transactionCount: { $sum: 1 }
        } 
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
      { $unwind: '$agent' },
      { 
        $project: {
          agentName: { $concat: ['$agent.firstName', ' ', '$agent.lastName'] },
          totalCollected: 1,
          transactionCount: 1
        }
      },
      { $sort: { totalCollected: -1 } },
      { $limit: 5 }
    ]);

    return {
      collectionsToday: collectionsToday[0]?.total || 0,
      dueToday,
      overdueByBucket,
      agentPerformance
    };
  }
}

module.exports = new CollectionsService();