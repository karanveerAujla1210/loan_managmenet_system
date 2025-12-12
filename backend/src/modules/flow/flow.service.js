const Loan = require('../loans/loans.model');
const Schedule = require('../schedules/schedules.model');
const Transaction = require('../transactions/transactions.model');
const Collection = require('../collections/collections.model');

class FlowService {
  async getLoanFlow(loanId) {
    const loan = await Loan.findOne({ loanId }).populate('customer');
    if (!loan) throw new Error('Loan not found');

    const schedule = await Schedule.find({ loanId }).sort({ installmentNumber: 1 });
    const transactions = await Transaction.find({ loanId }).sort({ createdAt: -1 });
    const collections = await Collection.find({ loanId }).sort({ createdAt: -1 });

    return {
      loan,
      schedule,
      transactions,
      collections,
      timeline: this.generateTimeline(loan, schedule, transactions, collections)
    };
  }

  async updateLoanStatus(loanId, status, reason) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) throw new Error('Loan not found');

    loan.status = status;
    loan.statusHistory.push({
      status,
      reason,
      timestamp: new Date(),
      updatedBy: 'system'
    });

    await loan.save();
    return loan;
  }

  async processPayment(loanId, paymentData) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) throw new Error('Loan not found');

    // Create transaction
    const transaction = new Transaction({
      loanId,
      customerId: loan.customerId,
      amount: paymentData.amount,
      type: 'payment',
      paymentMethod: paymentData.paymentMethod,
      status: 'completed'
    });
    await transaction.save();

    // Update loan balances
    loan.totalPaid = (loan.totalPaid || 0) + paymentData.amount;
    loan.outstandingAmount = loan.principalAmount + loan.totalInterest - loan.totalPaid;

    // Update schedule installments
    await this.updateSchedulePayments(loanId, paymentData.amount);

    // Check if loan is fully paid
    if (loan.outstandingAmount <= 0) {
      loan.status = 'closed';
      loan.closureDate = new Date();
    }

    await loan.save();
    return { loan, transaction };
  }

  async updateSchedulePayments(loanId, paidAmount) {
    const pendingInstallments = await Schedule.find({
      loanId,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ dueDate: 1 });

    let remainingAmount = paidAmount;

    for (const installment of pendingInstallments) {
      if (remainingAmount <= 0) break;

      const dueAmount = installment.emiAmount - (installment.paidAmount || 0);
      
      if (remainingAmount >= dueAmount) {
        installment.paidAmount = installment.emiAmount;
        installment.status = 'paid';
        installment.paidDate = new Date();
        remainingAmount -= dueAmount;
      } else {
        installment.paidAmount = (installment.paidAmount || 0) + remainingAmount;
        installment.status = 'partial';
        remainingAmount = 0;
      }

      await installment.save();
    }
  }

  async generateSchedule(loanId) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) throw new Error('Loan not found');

    // Clear existing schedule
    await Schedule.deleteMany({ loanId });

    const scheduleItems = [];
    const startDate = new Date(loan.disbursementDate);
    
    for (let i = 1; i <= loan.tenure; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const scheduleItem = new Schedule({
        loanId,
        customerId: loan.customerId,
        installmentNumber: i,
        dueDate,
        emiAmount: loan.emiAmount,
        principalAmount: this.calculatePrincipalAmount(loan, i),
        interestAmount: this.calculateInterestAmount(loan, i),
        status: 'pending'
      });

      scheduleItems.push(scheduleItem);
    }

    await Schedule.insertMany(scheduleItems);
    return scheduleItems;
  }

  async getOverdueLoans() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueSchedules = await Schedule.find({
      dueDate: { $lt: today },
      status: { $in: ['pending', 'partial'] }
    }).populate({
      path: 'loanId',
      populate: { path: 'customer' }
    });

    const overdueLoans = [];
    const loanMap = new Map();

    for (const schedule of overdueSchedules) {
      const loanId = schedule.loanId.loanId;
      
      if (!loanMap.has(loanId)) {
        const daysOverdue = Math.floor((today - schedule.dueDate) / (1000 * 60 * 60 * 24));
        const overdueAmount = schedule.emiAmount - (schedule.paidAmount || 0);
        
        loanMap.set(loanId, {
          ...schedule.loanId.toObject(),
          daysOverdue,
          overdueAmount,
          overdueInstallments: 1
        });
      } else {
        const existing = loanMap.get(loanId);
        existing.overdueAmount += schedule.emiAmount - (schedule.paidAmount || 0);
        existing.overdueInstallments += 1;
      }
    }

    return Array.from(loanMap.values());
  }

  async allocateToAgent(loanId, agentId) {
    const collection = new Collection({
      loanId,
      agentId,
      status: 'assigned',
      assignedDate: new Date()
    });

    await collection.save();
    
    // Update loan status
    await this.updateLoanStatus(loanId, 'under_collection', 'Allocated to collection agent');
    
    return collection;
  }

  calculatePrincipalAmount(loan, installmentNumber) {
    // Simple calculation - can be enhanced for reducing balance
    return loan.principalAmount / loan.tenure;
  }

  calculateInterestAmount(loan, installmentNumber) {
    // Simple calculation - can be enhanced for reducing balance
    return (loan.principalAmount * loan.interestRate / 100) / 12;
  }

  generateTimeline(loan, schedule, transactions, collections) {
    const timeline = [];

    // Loan creation
    timeline.push({
      date: loan.createdAt,
      type: 'loan_created',
      description: 'Loan application created',
      amount: loan.principalAmount
    });

    // Disbursement
    if (loan.disbursementDate) {
      timeline.push({
        date: loan.disbursementDate,
        type: 'disbursed',
        description: 'Loan amount disbursed',
        amount: loan.principalAmount
      });
    }

    // Payments
    transactions.forEach(transaction => {
      timeline.push({
        date: transaction.createdAt,
        type: 'payment',
        description: `Payment received via ${transaction.paymentMethod}`,
        amount: transaction.amount
      });
    });

    // Collections
    collections.forEach(collection => {
      timeline.push({
        date: collection.createdAt,
        type: 'collection',
        description: `Allocated to collection agent`,
        agentId: collection.agentId
      });
    });

    return timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

module.exports = new FlowService();