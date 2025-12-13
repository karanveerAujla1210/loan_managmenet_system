const logger = require('../config/logger');
const { businessUtils, dateUtils } = require('../utils/helpers');

class DPDUpdateService {
  constructor() {
    this.batchSize = 1000; // Process loans in batches
  }

  // Update DPD for all active loans
  async updateAllLoansDPD() {
    try {
      logger.info('Starting DPD update job');
      
      const Loan = require('../modules/loans/loan.model');
      const Schedule = require('../modules/schedules/schedule.model');
      
      let processedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;
      
      // Get all active loans in batches
      let skip = 0;
      let hasMore = true;
      
      while (hasMore) {
        const loans = await Loan.find({
          status: { $in: ['active', 'overdue'] },
          isDeleted: false
        })
        .skip(skip)
        .limit(this.batchSize)
        .lean();
        
        if (loans.length === 0) {
          hasMore = false;
          break;
        }
        
        // Process each loan
        for (const loan of loans) {
          try {
            const result = await this.updateLoanDPD(loan._id);
            if (result.updated) {
              updatedCount++;
            }
            processedCount++;
          } catch (error) {
            logger.error(`Error updating DPD for loan ${loan._id}:`, error);
            errorCount++;
          }
        }
        
        skip += this.batchSize;
        
        // Log progress
        logger.info(`DPD update progress: ${processedCount} loans processed`);
      }
      
      logger.info('DPD update job completed', {
        processedCount,
        updatedCount,
        errorCount,
        duration: Date.now()
      });
      
      return {
        success: true,
        processedCount,
        updatedCount,
        errorCount
      };
      
    } catch (error) {
      logger.error('DPD update job failed:', error);
      throw error;
    }
  }

  // Update DPD for a specific loan
  async updateLoanDPD(loanId) {
    try {
      const Loan = require('../modules/loans/loan.model');
      const Schedule = require('../modules/schedules/schedule.model');
      const Payment = require('../modules/payments/payment.model');
      
      // Get loan details
      const loan = await Loan.findById(loanId);
      if (!loan) {
        throw new Error(`Loan not found: ${loanId}`);
      }
      
      // Get all schedules for this loan
      const schedules = await Schedule.find({
        loanId: loanId,
        isDeleted: false
      }).sort({ dueDate: 1 });
      
      if (schedules.length === 0) {
        return { updated: false, reason: 'No schedules found' };
      }
      
      // Get all payments for this loan
      const payments = await Payment.find({
        loanId: loanId,
        status: 'completed',
        isDeleted: false
      }).sort({ paymentDate: 1 });
      
      // Calculate current DPD and bucket
      const dpdResult = await this.calculateLoanDPD(schedules, payments);
      
      // Update loan if DPD or bucket changed
      let updated = false;
      const updateData = {};
      
      if (loan.dpd !== dpdResult.dpd) {
        updateData.dpd = dpdResult.dpd;
        updated = true;
      }
      
      if (loan.bucket !== dpdResult.bucket) {
        updateData.bucket = dpdResult.bucket;
        updated = true;
      }
      
      if (loan.status !== dpdResult.status) {
        updateData.status = dpdResult.status;
        updated = true;
      }
      
      if (updated) {
        await Loan.findByIdAndUpdate(loanId, updateData);
        
        // Create collection record if loan becomes overdue
        if (dpdResult.dpd > 0 && loan.dpd === 0) {
          await this.createCollectionRecord(loanId, dpdResult);
        }
        
        // Update existing collection record
        if (dpdResult.dpd > 0) {
          await this.updateCollectionRecord(loanId, dpdResult);
        }
      }
      
      return {
        updated,
        previousDPD: loan.dpd,
        newDPD: dpdResult.dpd,
        previousBucket: loan.bucket,
        newBucket: dpdResult.bucket
      };
      
    } catch (error) {
      logger.error(`Error updating DPD for loan ${loanId}:`, error);
      throw error;
    }
  }

  // Calculate DPD for a loan based on schedules and payments
  async calculateLoanDPD(schedules, payments) {
    try {
      const currentDate = new Date();
      let totalPaid = 0;
      let maxDPD = 0;
      let overdueAmount = 0;
      
      // Calculate total amount paid
      payments.forEach(payment => {
        totalPaid += payment.amount;
      });
      
      // Process each schedule to find overdue installments
      let runningTotal = 0;
      
      for (const schedule of schedules) {
        runningTotal += schedule.totalDue;
        
        // If this installment is due and not fully paid
        if (schedule.dueDate <= currentDate && totalPaid < runningTotal) {
          const dpd = dateUtils.calculateDPD(schedule.dueDate, currentDate);
          maxDPD = Math.max(maxDPD, dpd);
          overdueAmount += (runningTotal - totalPaid);
          break; // Only consider the first overdue installment for DPD
        }
      }
      
      // Determine bucket based on DPD
      const bucket = businessUtils.determineLoanBucket(maxDPD);
      
      // Determine loan status
      let status = 'active';
      if (maxDPD > 0) {
        status = 'overdue';
      }
      if (maxDPD > 90) {
        status = 'npa';
      }
      
      return {
        dpd: maxDPD,
        bucket,
        status,
        overdueAmount
      };
      
    } catch (error) {
      logger.error('Error calculating DPD:', error);
      throw error;
    }
  }

  // Create collection record for newly overdue loan
  async createCollectionRecord(loanId, dpdResult) {
    try {
      const Collection = require('../modules/collections/collection.model');
      
      const collectionData = {
        loanId,
        dpd: dpdResult.dpd,
        bucket: dpdResult.bucket,
        overdueAmount: dpdResult.overdueAmount,
        status: 'pending',
        priority: this.calculatePriority(dpdResult.dpd, dpdResult.overdueAmount),
        createdAt: new Date()
      };
      
      await Collection.create(collectionData);
      
      logger.info(`Collection record created for loan ${loanId}`, {
        dpd: dpdResult.dpd,
        bucket: dpdResult.bucket
      });
      
    } catch (error) {
      logger.error(`Error creating collection record for loan ${loanId}:`, error);
    }
  }

  // Update existing collection record
  async updateCollectionRecord(loanId, dpdResult) {
    try {
      const Collection = require('../modules/collections/collection.model');
      
      const updateData = {
        dpd: dpdResult.dpd,
        bucket: dpdResult.bucket,
        overdueAmount: dpdResult.overdueAmount,
        priority: this.calculatePriority(dpdResult.dpd, dpdResult.overdueAmount),
        updatedAt: new Date()
      };
      
      await Collection.findOneAndUpdate(
        { loanId, isDeleted: false },
        updateData,
        { upsert: true }
      );
      
    } catch (error) {
      logger.error(`Error updating collection record for loan ${loanId}:`, error);
    }
  }

  // Calculate collection priority based on DPD and amount
  calculatePriority(dpd, overdueAmount) {
    let priority = 'low';
    
    if (dpd >= 90 || overdueAmount >= 100000) {
      priority = 'critical';
    } else if (dpd >= 30 || overdueAmount >= 50000) {
      priority = 'high';
    } else if (dpd >= 7 || overdueAmount >= 10000) {
      priority = 'medium';
    }
    
    return priority;
  }

  // Get DPD statistics
  async getDPDStatistics() {
    try {
      const Loan = require('../modules/loans/loan.model');
      
      const stats = await Loan.aggregate([
        {
          $match: {
            isDeleted: false,
            status: { $in: ['active', 'overdue', 'npa'] }
          }
        },
        {
          $group: {
            _id: '$bucket',
            count: { $sum: 1 },
            totalAmount: { $sum: '$principal' },
            avgDPD: { $avg: '$dpd' },
            maxDPD: { $max: '$dpd' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      return stats;
      
    } catch (error) {
      logger.error('Error getting DPD statistics:', error);
      throw error;
    }
  }

  // Update DPD for loans with specific criteria
  async updateDPDForCriteria(criteria) {
    try {
      const Loan = require('../modules/loans/loan.model');
      
      const loans = await Loan.find({
        ...criteria,
        isDeleted: false
      });
      
      let updatedCount = 0;
      
      for (const loan of loans) {
        try {
          const result = await this.updateLoanDPD(loan._id);
          if (result.updated) {
            updatedCount++;
          }
        } catch (error) {
          logger.error(`Error updating DPD for loan ${loan._id}:`, error);
        }
      }
      
      return { updatedCount, totalLoans: loans.length };
      
    } catch (error) {
      logger.error('Error updating DPD for criteria:', error);
      throw error;
    }
  }

  // Health check for DPD service
  async healthCheck() {
    try {
      const Loan = require('../modules/loans/loan.model');
      
      const totalLoans = await Loan.countDocuments({
        status: { $in: ['active', 'overdue', 'npa'] },
        isDeleted: false
      });
      
      const overdueLoans = await Loan.countDocuments({
        dpd: { $gt: 0 },
        isDeleted: false
      });
      
      return {
        status: 'healthy',
        totalLoans,
        overdueLoans,
        overduePercentage: totalLoans > 0 ? (overdueLoans / totalLoans * 100).toFixed(2) : 0
      };
      
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

module.exports = new DPDUpdateService();