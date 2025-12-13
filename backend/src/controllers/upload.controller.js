const UploadService = require('../services/upload.service');

class UploadController {
  /**
   * Upload disbursement data from JSON
   * POST /api/upload/disbursements
   */
  static async uploadDisbursements(req, res) {
    try {
      const { data } = req.body;
      
      if (!Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          message: 'Data must be an array of disbursement records'
        });
      }

      const results = await UploadService.processDisbursementData(data);

      res.json({
        success: true,
        message: `Upload completed. ${results.success} records processed successfully, ${results.failed} failed.`,
        data: results
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Upload payment collections data from JSON
   * POST /api/upload/payments
   */
  static async uploadPayments(req, res) {
    try {
      const { data } = req.body;
      
      if (!Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          message: 'Data must be an array of payment records'
        });
      }

      const results = await UploadService.processPaymentData(data);

      res.json({
        success: true,
        message: `Upload completed. ${results.success} records processed successfully, ${results.failed} failed.`,
        data: results
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get upload history
   * GET /api/upload/history
   */
  static async getUploadHistory(req, res) {
    try {
      const { type, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const Payment = require('../models/payment.model');
      const Disbursement = require('../models/disbursement.model');

      let data;
      if (type === 'disbursements') {
        data = await Disbursement.find()
          .populate('loanId', 'loanId')
          .populate('customerId', 'firstName lastName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      } else if (type === 'payments') {
        data = await Payment.find()
          .populate('loanId', 'loanId')
          .populate('customerId', 'firstName lastName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      } else {
        return res.status(400).json({
          success: false,
          message: 'Type must be either "disbursements" or "payments"'
        });
      }

      res.json({
        success: true,
        data
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UploadController;