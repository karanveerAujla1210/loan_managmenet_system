const cron = require('node-cron');
const Schedule = require('../models/Schedule');
const Loan = require('../models/Loan');
const dateUtils = require('../utils/dateUtils');
const logger = require('../config/logger');
const config = require('../config/env');

const updateDPD = async () => {
  try {
    logger.info('Starting DPD update job');

    const currentDate = new Date();
    
    // Get all pending and partial schedules
    const schedules = await Schedule.find({
      status: { $in: ['PENDING', 'PARTIAL'] },
      dueDate: { $lt: currentDate }
    });

    const bulkOps = [];
    const loanUpdates = new Map();

    for (const schedule of schedules) {
      const dpd = dateUtils.calculateDPD(schedule.dueDate, currentDate);
      
      if (dpd !== schedule.dpd) {
        bulkOps.push({
          updateOne: {
            filter: { _id: schedule._id },
            update: { 
              dpd,
              status: dpd > 0 ? 'OVERDUE' : schedule.status
            }
          }
        });

        // Track loan-level DPD updates
        if (!loanUpdates.has(schedule.loanId) || loanUpdates.get(schedule.loanId) < dpd) {
          loanUpdates.set(schedule.loanId, dpd);
        }
      }
    }

    // Bulk update schedules
    if (bulkOps.length > 0) {
      await Schedule.bulkWrite(bulkOps);
      logger.info(`Updated DPD for ${bulkOps.length} schedules`);
    }

    // Update loan-level DPD and collection status
    const loanBulkOps = [];
    for (const [loanId, currentDPD] of loanUpdates) {
      const loan = await Loan.findById(loanId);
      if (loan) {
        const maxDPD = Math.max(loan.maxDPD || 0, currentDPD);
        let collectionStatus = 'CURRENT';
        
        if (currentDPD > 90) {
          collectionStatus = 'LEGAL';
        } else if (currentDPD > 0) {
          collectionStatus = 'OVERDUE';
        }

        loanBulkOps.push({
          updateOne: {
            filter: { _id: loanId },
            update: {
              currentDPD,
              maxDPD,
              collectionStatus
            }
          }
        });
      }
    }

    if (loanBulkOps.length > 0) {
      await Loan.bulkWrite(loanBulkOps);
      logger.info(`Updated DPD for ${loanBulkOps.length} loans`);
    }

    logger.info('DPD update job completed successfully');
  } catch (error) {
    logger.error('Error in DPD update job:', error);
  }
};

// Schedule the job to run daily at 1 AM
if (config.ENABLE_CRON_JOBS) {
  cron.schedule(config.DPD_UPDATE_CRON, updateDPD, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  logger.info('DPD updater cron job scheduled');
}

module.exports = { updateDPD };