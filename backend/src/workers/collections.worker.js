const cron = require('node-cron');
const Loan = require('../modules/loans/loans.model');
const logger = require('../config/logger');

class CollectionsWorker {
  constructor() {
    this.isRunning = false;
  }

  // Update all loan metrics and check broken PTPs
  async updateLoanMetrics() {
    if (this.isRunning) {
      logger.info('Collections worker already running, skipping...');
      return;
    }

    this.isRunning = true;
    logger.info('Starting collections worker...');

    try {
      const activeLoans = await Loan.find({
        status: { $in: ['active', 'overdue', 'broken_ptp'] }
      });

      let updatedCount = 0;
      let brokenPTPCount = 0;

      for (const loan of activeLoans) {
        const oldBucket = loan.collectionBucket;
        const oldStatus = loan.status;
        const oldEscalation = loan.escalationLevel;

        loan.updateMetrics();

        // Check if anything changed
        if (
          loan.collectionBucket !== oldBucket ||
          loan.status !== oldStatus ||
          loan.escalationLevel !== oldEscalation
        ) {
          await loan.save();
          updatedCount++;

          if (loan.status === 'broken_ptp' && oldStatus !== 'broken_ptp') {
            brokenPTPCount++;
            
            // Add broken PTP event
            loan.events.push({
              type: 'broken_ptp',
              description: 'Promise to Pay was broken',
              payload: { 
                promiseDate: loan.ptp.promiseDate,
                amount: loan.ptp.amount 
              }
            });
            
            await loan.save();
          }
        }
      }

      logger.info(`Collections worker completed. Updated ${updatedCount} loans, ${brokenPTPCount} broken PTPs`);
    } catch (error) {
      logger.error('Collections worker error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Start the worker with cron schedule
  start() {
    // Run every hour
    cron.schedule('0 * * * *', () => {
      this.updateLoanMetrics();
    });

    // Run every day at 6 AM for comprehensive update
    cron.schedule('0 6 * * *', () => {
      this.updateLoanMetrics();
    });

    logger.info('Collections worker scheduled');
  }

  // Manual trigger
  async trigger() {
    return this.updateLoanMetrics();
  }
}

module.exports = new CollectionsWorker();