const LoanService = require('../services/loan.service');
const { body, validationResult } = require('express-validator');

class LoanController {
  /**
   * Apply for new loan
   * POST /api/loans/apply
   */
  static async applyLoan(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const loan = await LoanService.applyLoan(req.body, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Loan application submitted successfully',
        data: loan
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all loans with filters
   * GET /api/loans
   */
  static async getLoans(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      
      let result;
      if (status) {
        result = await LoanService.getLoansByStatus(status, parseInt(page), parseInt(limit));
      } else {
        // Get all loans with pagination
        const skip = (page - 1) * limit;
        const loans = await require('../models/loan.model')
          .find()
          .populate('customerId', 'firstName lastName phone')
          .populate('assignedAgent', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        const total = await require('../models/loan.model').countDocuments();
        
        result = {
          loans,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        };
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get loan by ID
   * GET /api/loans/:id
   */
  static async getLoan(req, res) {
    try {
      const loan = await LoanService.getLoanDetails(req.params.id);
      
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      res.json({
        success: true,
        data: loan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Approve loan
   * PUT /api/loans/:id/approve
   */
  static async approveLoan(req, res) {
    try {
      const { notes } = req.body;
      const loan = await LoanService.approveLoan(req.params.id, req.user.id, notes);
      
      res.json({
        success: true,
        message: 'Loan approved successfully',
        data: loan
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Reject loan
   * PUT /api/loans/:id/reject
   */
  static async rejectLoan(req, res) {
    try {
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required'
        });
      }

      const loan = await LoanService.rejectLoan(req.params.id, req.user.id, reason);
      
      res.json({
        success: true,
        message: 'Loan rejected successfully',
        data: loan
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Disburse loan
   * PUT /api/loans/:id/disburse
   */
  static async disburseLoan(req, res) {
    try {
      const { disbursementDate } = req.body;
      const loan = await LoanService.disburseLoan(
        req.params.id, 
        req.user.id, 
        disbursementDate
      );
      
      res.json({
        success: true,
        message: 'Loan disbursed successfully',
        data: loan
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Validation rules
const loanValidation = [
  body('customerId').isMongoId().withMessage('Valid customer ID is required'),
  body('productCode').isIn(['personal', 'business', 'home', 'vehicle', 'education']).withMessage('Invalid product code'),
  body('principal').isFloat({ min: 1000, max: 10000000 }).withMessage('Principal must be between ₹1,000 and ₹1,00,00,000'),
  body('annualInterestRate').isFloat({ min: 0, max: 50 }).withMessage('Interest rate must be between 0% and 50%'),
  body('termMonths').isInt({ min: 1, max: 360 }).withMessage('Term must be between 1 and 360 months')
];

module.exports = { LoanController, loanValidation };