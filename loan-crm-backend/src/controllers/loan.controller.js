const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const Schedule = require('../models/Schedule');
const Transaction = require('../models/Transaction');
const ScheduleGenerator = require('../utils/scheduleGenerator');
const { AppError } = require('../utils/errorHandler');
const logger = require('../config/logger');

const loanController = {
  // Create new loan
  createLoan: async (req, res, next) => {
    try {
      const { customerId, loanType, principalAmount, interestRate, tenure, disbursementDate } = req.body;

      // Verify customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return next(new AppError('Customer not found', 404));
      }

      // Generate loan number
      const loanCount = await Loan.countDocuments();
      const loanNumber = `LN${Date.now()}${String(loanCount + 1).padStart(4, '0')}`;

      // Generate EMI schedule
      const scheduleData = ScheduleGenerator.generateEMISchedule({
        principalAmount,
        interestRate,
        tenure,
        disbursementDate
      });

      // Calculate maturity date
      const maturityDate = new Date(disbursementDate);
      maturityDate.setMonth(maturityDate.getMonth() + tenure);

      // Create loan
      const loan = await Loan.create({
        loanNumber,
        customerId,
        loanType,
        principalAmount,
        interestRate,
        tenure,
        emi: scheduleData.emi,
        disbursementDate,
        maturityDate,
        totalOutstanding: principalAmount,
        principalOutstanding: principalAmount,
        nextDueDate: scheduleData.schedule[0]?.dueDate,
        createdBy: req.user._id
      });

      // Create schedule entries
      const scheduleEntries = scheduleData.schedule.map(entry => ({
        ...entry,
        loanId: loan._id
      }));
      await Schedule.insertMany(scheduleEntries);

      // Create disbursement transaction
      await Transaction.create({
        loanId: loan._id,
        customerId,
        transactionType: 'DISBURSEMENT',
        amount: principalAmount,
        transactionDate: disbursementDate,
        description: `Loan disbursement for ${loanNumber}`,
        balanceAfter: {
          principal: principalAmount,
          interest: 0,
          penalty: 0,
          total: principalAmount
        },
        createdBy: req.user._id
      });

      logger.info(`Loan created: ${loanNumber} for customer: ${customerId}`);

      res.status(201).json({
        status: 'success',
        data: { loan }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all loans with filters
  getLoans: async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        loanType,
        collectionStatus,
        assignedCollector,
        search
      } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (loanType) filter.loanType = loanType;
      if (collectionStatus) filter.collectionStatus = collectionStatus;
      if (assignedCollector) filter.assignedCollector = assignedCollector;

      let query = Loan.find(filter)
        .populate('customerId', 'firstName lastName phone')
        .populate('assignedCollector', 'firstName lastName')
        .sort({ createdAt: -1 });

      // Search functionality
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        const customers = await Customer.find({
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { phone: searchRegex }
          ]
        }).select('_id');
        
        const customerIds = customers.map(c => c._id);
        filter.$or = [
          { loanNumber: searchRegex },
          { customerId: { $in: customerIds } }
        ];
        
        query = Loan.find(filter)
          .populate('customerId', 'firstName lastName phone')
          .populate('assignedCollector', 'firstName lastName')
          .sort({ createdAt: -1 });
      }

      const skip = (page - 1) * limit;
      const loans = await query.skip(skip).limit(parseInt(limit));
      const total = await Loan.countDocuments(filter);

      res.status(200).json({
        status: 'success',
        results: loans.length,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        data: { loans }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get loan by ID
  getLoanById: async (req, res, next) => {
    try {
      const loan = await Loan.findById(req.params.id)
        .populate('customerId')
        .populate('assignedCollector', 'firstName lastName phone')
        .populate('createdBy', 'firstName lastName');

      if (!loan) {
        return next(new AppError('Loan not found', 404));
      }

      res.status(200).json({
        status: 'success',
        data: { loan }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update loan
  updateLoan: async (req, res, next) => {
    try {
      const loan = await Loan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!loan) {
        return next(new AppError('Loan not found', 404));
      }

      logger.info(`Loan updated: ${loan.loanNumber} by user: ${req.user._id}`);

      res.status(200).json({
        status: 'success',
        data: { loan }
      });
    } catch (error) {
      next(error);
    }
  },

  // Assign collector
  assignCollector: async (req, res, next) => {
    try {
      const { collectorId } = req.body;
      
      const loan = await Loan.findByIdAndUpdate(
        req.params.id,
        { assignedCollector: collectorId },
        { new: true }
      ).populate('assignedCollector', 'firstName lastName');

      if (!loan) {
        return next(new AppError('Loan not found', 404));
      }

      logger.info(`Collector assigned to loan: ${loan.loanNumber}`);

      res.status(200).json({
        status: 'success',
        data: { loan }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = loanController;