const cron = require('node-cron');
const CollectorScoringService = require('../services/collector-scoring.service');
const moment = require('moment');

const initCollectorScoringCron = () => {
  // Run every Monday at 3:00 AM (calculate previous week's scores)
  cron.schedule('0 3 * * 1', async () => {
    try {
      console.log('[CRON] Collector scoring started');
      const weekStartDate = moment().subtract(1, 'week').startOf('week').toDate();
      await CollectorScoringService.calculateWeeklyScores(weekStartDate);
      console.log('[CRON] Collector scoring completed');
    } catch (error) {
      console.error('[CRON] Collector scoring failed:', error.message);
    }
  });
};

module.exports = { initCollectorScoringCron };
