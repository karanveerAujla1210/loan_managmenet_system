const cron = require('node-cron');
const DPDSafeService = require('../services/dpd-safe.service');
const { isFeatureEnabled } = require('../config/feature-flags');

const initDPDSafeCron = () => {
  cron.schedule('30 2 * * *', async () => {
    try {
      if (!isFeatureEnabled('CRON_ENABLED')) {
        console.log('[CRON] DPD update disabled via feature flag');
        return;
      }

      console.log('[CRON] DPD update started');
      const result = await DPDSafeService.updateDPDSafely();

      if (result.skipped) {
        console.log('[CRON] DPD update skipped (already ran today)');
      } else {
        console.log(`[CRON] DPD updated: ${result.updated} loans, ${result.escalated} escalated`);
      }
    } catch (error) {
      console.error('[CRON] DPD update failed:', error.message);
    }
  });
};

module.exports = { initDPDSafeCron };
