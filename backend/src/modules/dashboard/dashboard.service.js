const Loan = require('../loans/loans.model');
const Customer = require('../customers/customers.model');

class DashboardService {
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get loan statistics
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ status: 'active' });
    const overdueLoans = await Loan.countDocuments({ status: { $in: ['overdue', 'critical'] } });
    
    // Get outstanding amount
    const outstandingResult = await Loan.aggregate([
      { $match: { outstandingAmount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$outstandingAmount' } } }
    ]);
    const totalOutstanding = outstandingResult[0]?.total || 0;

    // Get collections today
    const collectionsResult = await Loan.aggregate([
      { $unwind: '$transactions' },
      { 
        $match: { 
          'transactions.date': { $gte: today, $lt: tomorrow },
          'transactions.type': 'payment'
        } 
      },
      { $group: { _id: null, total: { $sum: '$transactions.amount' } } }
    ]);
    const collectionsToday = collectionsResult[0]?.total || 0;

    // Get loans due today
    const dueToday = await Loan.countDocuments({
      'schedule.dueDate': { $gte: today, $lt: tomorrow },
      'schedule.remainingAmount': { $gt: 0 }
    });

    return {
      totalLoans,
      activeLoans,
      overdueLoans,
      totalOutstanding,
      collectionsToday,
      dueToday
    };
  }

  async getCollectionPerformance() {
    // Get collection performance by bucket
    const bucketPerformance = await Loan.aggregate([
      { $match: { outstandingAmount: { $gt: 0 } } },
      { 
        $group: { 
          _id: '$collectionBucket',
          count: { $sum: 1 },
          totalOutstanding: { $sum: '$outstandingAmount' }
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    // Get agent performance
    const agentPerformance = await Loan.aggregate([
      { $match: { agentId: { $exists: true } } },
      { $unwind: '$transactions' },
      { 
        $match: { 
          'transactions.type': 'payment',
          'transactions.date': { 
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
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
      { $limit: 10 }
    ]);

    return {
      bucketPerformance,
      agentPerformance
    };
  }
}

module.exports = new DashboardService();