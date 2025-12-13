const cron = require('node-cron');
const Loan = require('../models/Loan');
const User = require('../models/User');
const logger = require('../config/logger');
const config = require('../config/env');

const autoAssignCollectors = async () => {
  try {
    logger.info('Starting auto collector assignment job');

    // Find loans without assigned collectors in overdue status
    const unassignedLoans = await Loan.find({
      assignedCollector: null,
      collectionStatus: { $in: ['OVERDUE', 'LEGAL'] },
      status: 'ACTIVE'
    });

    if (unassignedLoans.length === 0) {
      logger.info('No unassigned loans found');
      return;
    }

    // Get available collectors
    const collectors = await User.find({
      role: 'COLLECTOR',
      isActive: true
    });

    if (collectors.length === 0) {
      logger.warn('No active collectors found for assignment');
      return;
    }

    // Simple round-robin assignment
    const bulkOps = [];
    unassignedLoans.forEach((loan, index) => {
      const collector = collectors[index % collectors.length];
      
      bulkOps.push({
        updateOne: {
          filter: { _id: loan._id },
          update: { assignedCollector: collector._id }
        }
      });
    });

    if (bulkOps.length > 0) {
      await Loan.bulkWrite(bulkOps);
      logger.info(`Auto-assigned ${bulkOps.length} loans to collectors`);
    }

    logger.info('Auto collector assignment job completed successfully');
  } catch (error) {
    logger.error('Error in auto collector assignment job:', error);
  }
};

// Schedule the job to run daily at 4 AM
if (config.ENABLE_CRON_JOBS) {
  cron.schedule('0 4 * * *', autoAssignCollectors, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  logger.info('Auto collector assignment cron job scheduled');
}

module.exports = { autoAssignCollectors };