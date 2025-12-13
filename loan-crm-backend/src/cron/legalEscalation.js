const cron = require('node-cron');
const Loan = require('../models/Loan');
const logger = require('../config/logger');
const config = require('../config/env');

const escalateToLegal = async () => {
  try {
    logger.info('Starting legal escalation job');

    // Find loans with DPD > 90 and not already in legal
    const loansForLegal = await Loan.find({
      currentDPD: { $gt: 90 },
      'legalStatus.isInLegal': false,
      status: 'ACTIVE'
    });

    const bulkOps = [];

    for (const loan of loansForLegal) {
      bulkOps.push({
        updateOne: {
          filter: { _id: loan._id },
          update: {
            collectionStatus: 'LEGAL',
            'legalStatus.isInLegal': true,
            'legalStatus.legalDate': new Date(),
            'legalStatus.legalAmount': loan.totalOutstanding
          }
        }
      });
    }

    if (bulkOps.length > 0) {
      await Loan.bulkWrite(bulkOps);
      logger.info(`Escalated ${bulkOps.length} loans to legal`);
    }

    logger.info('Legal escalation job completed successfully');
  } catch (error) {
    logger.error('Error in legal escalation job:', error);
  }
};

// Schedule the job to run daily at 2 AM
if (config.ENABLE_CRON_JOBS) {
  cron.schedule(config.LEGAL_ESCALATION_CRON, escalateToLegal, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  logger.info('Legal escalation cron job scheduled');
}

module.exports = { escalateToLegal };