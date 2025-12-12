const mongoose = require('mongoose');
const LoanService = require('./loan.service');
const Loan = require('../models/loan.model');
const Customer = require('../models/customer.model');

// Mock MongoDB for testing
jest.mock('mongoose');

describe('LoanService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyLoan', () => {
    test('should create loan application successfully', async () => {
      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn()
      };
      
      mongoose.startSession.mockResolvedValue(mockSession);
      
      const mockCustomer = { _id: 'customer123', firstName: 'John' };
      Customer.findById.mockReturnValue({
        session: jest.fn().mockResolvedValue(mockCustomer)
      });

      const mockLoan = {
        _id: 'loan123',
        customerId: 'customer123',
        principal: 100000,
        save: jest.fn().mockResolvedValue(true)
      };
      
      jest.spyOn(Loan.prototype, 'save').mockResolvedValue(mockLoan);

      const loanData = {
        customerId: 'customer123',
        principal: 100000,
        annualInterestRate: 12,
        termMonths: 12,
        productCode: 'personal'
      };

      const result = await LoanService.applyLoan(loanData, 'user123');
      
      expect(mockSession.startTransaction).toHaveBeenCalled();
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
    });

    test('should throw error if customer not found', async () => {
      const mockSession = {
        startTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn()
      };
      
      mongoose.startSession.mockResolvedValue(mockSession);
      Customer.findById.mockReturnValue({
        session: jest.fn().mockResolvedValue(null)
      });

      const loanData = {
        customerId: 'invalid123',
        principal: 100000,
        annualInterestRate: 12,
        termMonths: 12
      };

      await expect(LoanService.applyLoan(loanData, 'user123'))
        .rejects.toThrow('Customer not found');
      
      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
  });

  describe('approveLoan', () => {
    test('should approve loan successfully', async () => {
      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        endSession: jest.fn()
      };
      
      mongoose.startSession.mockResolvedValue(mockSession);
      
      const mockLoan = {
        _id: 'loan123',
        status: 'applied',
        notes: [],
        save: jest.fn().mockResolvedValue(true)
      };
      
      Loan.findById.mockReturnValue({
        session: jest.fn().mockResolvedValue(mockLoan)
      });

      const result = await LoanService.approveLoan('loan123', 'manager123', 'Approved');
      
      expect(mockLoan.status).toBe('approved');
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    test('should throw error for invalid status', async () => {
      const mockSession = {
        startTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn()
      };
      
      mongoose.startSession.mockResolvedValue(mockSession);
      
      const mockLoan = {
        status: 'disbursed'
      };
      
      Loan.findById.mockReturnValue({
        session: jest.fn().mockResolvedValue(mockLoan)
      });

      await expect(LoanService.approveLoan('loan123', 'manager123'))
        .rejects.toThrow('Cannot approve loan with status: disbursed');
    });
  });
});