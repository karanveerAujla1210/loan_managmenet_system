const cron = require('node-cron');
const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');

const dpdEngine = async () => {
  try {
    console.log('[DPD Engine] Starting...');

    const installments = await Installment.find();
    const today = new Date();

    for (const inst of installments) {
      const dueDate = new Date(inst.dueDate);
      if (dueDate < today && inst.status !== 'paid') {
        const dpd = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        inst.dpd = dpd;
        inst.status = 'overdue';
        await inst.save();
      }
    }

    // Update loan DPD
    const loans = await Loan.find();
    for (const loan of loans) {
      const loanInstallments = await Installment.find({ loanId: loan._id });
      const maxDPD = Math.max(...loanInstallments.map(i => i.dpd || 0), 0);
      loan.dpd = maxDPD;
      await loan.save();
    }

    console.log('[DPD Engine] Completed');
  } catch (error) {
    console.error('[DPD Engine] Error:', error.message);
  }
};

const initDPDEngine = () => {
  cron.schedule('30 2 * * *', dpdEngine);
  console.log('[DPD Engine] Scheduled for 2:30 AM daily');
};

module.exports = { initDPDEngine, dpdEngine };
