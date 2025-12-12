const mongoose = require('mongoose');
const Loan = require('../models/loan.model');
const Customer = require('../models/customer.model');
const { generateScheduleReducing } = require('./emi.service');

class LoanService {
  /**
   * Apply for a new loan
   */
  static async applyLoan(loanData, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Validate customer exists
      const customer = await Customer.findById(loanData.customerId).session(session);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Calculate EMI and total amount
      const schedule = generateScheduleReducing(
        loanData.principal,
        loanData.annualInterestRate,
        loanData.termMonths
      );
      
      const emiAmount = schedule[0]?.totalDue || 0;
      const totalAmount = schedule.reduce((sum, inst) => sum + inst.totalDue, 0);

      // Create loan
      const loan = new Loan({
        ...loanData,
        emiAmount,
        totalAmount,
        status: 'applied',
        assignedAgent: userId
      });

      await loan.save({ session });
      await session.commitTransaction();
      
      return loan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Approve loan
   */
  static async approveLoan(loanId, approvedBy, notes = '') {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const loan = await Loan.findById(loanId).session(session);
      if (!loan) {
        throw new Error('Loan not found');
      }

      if (loan.status !== 'applied' && loan.status !== 'under_review') {
        throw new Error(`Cannot approve loan with status: ${loan.status}`);
      }

      loan.status = 'approved';
      loan.approvedBy = approvedBy;
      
      if (notes) {
        loan.notes.push({
          text: notes,
          addedBy: approvedBy
        });
      }

      await loan.save({ session });
      await session.commitTransaction();
      
      return loan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Reject loan
   */
  static async rejectLoan(loanId, rejectedBy, reason) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const loan = await Loan.findById(loanId).session(session);
      if (!loan) {
        throw new Error('Loan not found');
      }

      if (loan.status !== 'applied' && loan.status !== 'under_review') {
        throw new Error(`Cannot reject loan with status: ${loan.status}`);
      }

      loan.status = 'rejected';
      loan.rejectionReason = reason;
      loan.notes.push({
        text: `Loan rejected: ${reason}`,
        addedBy: rejectedBy
      });

      await loan.save({ session });
      await session.commitTransaction();
      
      return loan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Disburse loan - generates EMI schedule
   */
  static async disburseLoan(loanId, disbursedBy, disbursementDate = new Date()) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const loan = await Loan.findById(loanId).session(session);
      if (!loan) {
        throw new Error('Loan not found');
      }

      if (loan.status !== 'approved') {
        throw new Error(`Cannot disburse loan with status: ${loan.status}`);
      }

      // Generate EMI schedule
      const schedule = generateScheduleReducing(
        loan.principal,
        loan.annualInterestRate,
        loan.termMonths,
        new Date(disbursementDate)
      );

      // Convert to installment format
      loan.schedule = schedule.map(inst => ({
        sequence: inst.sequence,
        dueDate: inst.dueDate,
        principalDue: inst.principalDue,
        interestDue: inst.interestDue,
        penaltyDue: 0,
        paidPrincipal: 0,
        paidInterest: 0,
        paidPenalty: 0,
        status: 'pending'
      }));

      loan.disbursementDate = new Date(disbursementDate);
      loan.maturityDate = schedule[schedule.length - 1].dueDate;
      loan.status = 'disbursed';
      loan.disbursedBy = disbursedBy;
      
      loan.notes.push({
        text: `Loan disbursed: ₹${loan.principal}`,
        addedBy: disbursedBy
      });

      await loan.save({ session });
      await session.commitTransaction();
      
      return loan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get loan with customer details
   */
  static async getLoanDetails(loanId) {
    return await Loan.findById(loanId)
      .populate('customerId', 'firstName lastName phone email')
      .populate('assignedAgent', 'name email')
      .populate('approvedBy', 'name email')
      .populate('disbursedBy', 'name email');
  }

  /**
   * Get loans by status
   */
  static async getLoansByStatus(status, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const loans = await Loan.find({ status })
      .populate('customerId', 'firstName lastName phone')
      .populate('assignedAgent', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Loan.countDocuments({ status });
    
    return {
      loans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = LoanService;