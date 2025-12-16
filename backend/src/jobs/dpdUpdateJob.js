const cron = require('node-cron');
const { updateAllLoans } = require('../services/DPDUpdateService');

const initDPDCron = () => {
  // Run daily at 2:30 AM
  cron.schedule('30 2 * * *', async () => {
    try {
      console.log('DPD update cron started');
      const result = await updateAllLoans();
      console.log(`DPD update completed: ${result.loansUpdated} loans updated`);
    } catch (error) {
      console.error('DPD update cron failed:', error.message);
    }
  });
};

module.exports = {
  initDPDCron
};
