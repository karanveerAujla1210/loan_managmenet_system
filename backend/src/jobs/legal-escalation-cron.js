const cron = require('node-cron');
const DPDUpdateService = require('../services/dpd-update.service');

const initLegalEscalationCron = () => {
  // Run daily at 2:30 AM
  cron.schedule('30 2 * * *', async () => {
    try {
      console.log('[CRON] Legal escalation started');
      const result = await DPDUpdateService.updateAllLoans();
      console.log(`[CRON] Legal escalation completed: ${result.legalEscalated} cases created`);
    } catch (error) {
      console.error('[CRON] Legal escalation failed:', error.message);
    }
  });
};

module.exports = { initLegalEscalationCron };
