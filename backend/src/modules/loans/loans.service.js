const Loan = require('./loans.model');
const Customer = require('../customers/customers.model');
const { generateLoanSchedule, allocatePayment } = require('../../utils/loanHelpers');
const { v4: uuidv4 } = require('uuid');

class LoanService {
  async createLoan(loanData) {
    // Verify customer exists
    const customer = await Customer.findById(loanData.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Calculate loan details
    const totalAmount = loanData.principalAmount + (loanData.principalAmount * loanData.interestRate / 100);
    const installmentAmount = totalAmount / loanData.numberOfInstallments;
    
    // Generate loan ID
    const loanId = `LN${Date.now()}`;
    
    // Calculate end date
    const startDate = new Date(loanData.startDate);
    const endDate = new Date(startDate);
    if (loanData.frequency === 'weekly') {
      endDate.setDate(startDate.getDate() + (loanData.numberOfInstallments * 7));
    } else {
      endDate.setMonth(startDate.getMonth() + loanData.numberOfInstallments);
    }

    // Generate schedule
    const schedule = generateLoanSchedule(loanData);

    const loan = new Loan({
      ...loanData,
      loanId,
      totalAmount,
      installmentAmount,
      endDate,
      outstandingAmount: totalAmount,
      schedule,
      events: [{
        type: 'created',
        description: 'Loan created',
        payload: { amount: loanData.principalAmount }
      }]
    });

    await loan.save();
    return loan.populate('customerId', 'firstName lastName email phone');
  }

  async getAllLoans(filters = {}) {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.customerId) {
      query.customerId = filters.customerId;
    }
    
    if (filters.agentId) {
      query.agentId = filters.agentId;
    }
    
    if (filters.bucket) {
      query.collectionBucket = filters.bucket;
    }

    const loans = await Loan.find(query)
      .populate('customerId', 'firstName lastName email phone')
      .populate('agentId', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });
    
    return loans;
  }

  async getLoanById(loanId) {
    const loan = await Loan.findOne({ loanId })
      .populate('customerId')
      .populate('agentId', 'firstName lastName employeeId')
      .populate('events.actor', 'firstName lastName');
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    // Update metrics before returning
    loan.updateMetrics();
    await loan.save();
    
    return loan;
  }

  async updateLoanStatus(loanId, status, userId) {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new Error('Loan not found');
    }

    const oldStatus = loan.status;
    loan.status = status;
    
    loan.events.push({
      type: 'status',
      description: `Status changed from ${oldStatus} to ${status}`,
      actor: userId,
      payload: { from: oldStatus, to: status }
    });

    await loan.save();
    return loan;
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
      method: paymentData.method,
      reference: paymentData.reference,
      allocatedTo: allocations,
      collectedBy: paymentData.collectedBy,
      notes: paymentData.notes
    };

    loan.transactions.push(transaction);
    loan.paidAmount += paymentData.amount;

    // Add event
    loan.events.push({
      type: 'payment',
      description: `Payment of ₹${paymentData.amount} received`,
      actor: paymentData.collectedBy,
      payload: { 
        amount: paymentData.amount, 
        method: paymentData.method,
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

  async getPayments(loanId) {
    const loan = await Loan.findOne({ loanId }).select('transactions');
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    return loan.transactions.filter(txn => txn.type === 'payment');
  }

  async getDueLoans(agentId) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const loans = await Loan.find({
      agentId,
      status: { $in: ['active', 'overdue'] },
      'schedule.dueDate': { $lte: today },
      'schedule.remainingAmount': { $gt: 0 }
    })
    .populate('customerId', 'firstName lastName phone address')
    .sort({ 'schedule.dueDate': 1 });
    
    return loans;
  }

  async getOverdueLoans(bucket, agentId) {
    const query = {
      status: { $in: ['overdue', 'critical', 'broken_ptp'] },
      dpd: { $gt: 0 }
    };
    
    if (bucket) {
      query.collectionBucket = bucket;
    }
    
    if (agentId) {
      query.agentId = agentId;
    }

    const loans = await Loan.find(query)
      .populate('customerId', 'firstName lastName phone address')
      .sort({ dpd: -1 });
    
    return loans;
  }

  async getOutstandingLoans(agentId) {
    const query = {
      outstandingAmount: { $gt: 0 },
      status: { $ne: 'completed' }
    };
    
    if (agentId) {
      query.agentId = agentId;
    }

    const loans = await Loan.find(query)
      .populate('customerId', 'firstName lastName phone')
      .sort({ outstandingAmount: -1 });
    
    return loans;
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
      promiseDate: ptpData.promiseDate,
      amount: ptpData.amount,
      createdBy: ptpData.createdBy,
      createdAt: new Date()
    };

    // Add to PTP history
    loan.promiseToPay.push({
      amount: ptpData.amount,
      promiseDate: ptpData.promiseDate,
      createdBy: ptpData.createdBy
    });

    // Add event
    loan.events.push({
      type: 'ptp',
      description: `Promise to Pay created for ₹${ptpData.amount}`,
      actor: ptpData.createdBy,
      payload: { 
        amount: ptpData.amount, 
        promiseDate: ptpData.promiseDate 
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
      createdBy: noteData.createdBy
    });

    // Add event
    loan.events.push({
      type: 'note',
      description: 'Collection note added',
      actor: noteData.createdBy,
      payload: { note: noteData.note }
    });

    await loan.save();
    return loan;
  }

  async getEvents(loanId) {
    const loan = await Loan.findOne({ loanId })
      .select('events')
      .populate('events.actor', 'firstName lastName');
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    return loan.events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

module.exports = new LoanService();