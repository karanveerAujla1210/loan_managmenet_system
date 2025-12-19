const cron = require('node-cron');
const Loan = require('../models/loan.model');
const LegalCase = require('../models/legal-case.model');

const LEGAL_THRESHOLD = 90;

const stateEscalation = async () => {
  try {
    console.log('[State Escalation] Starting...');

    const loans = await Loan.find({ state: { $in: ['ACTIVE', 'DELINQUENT'] } });

    for (const loan of loans) {
      // Escalate to DELINQUENT
      if (loan.dpd > 0 && loan.state === 'ACTIVE') {
        loan.state = 'DELINQUENT';
        await loan.save();
      }

      // Escalate to LEGAL
      if (loan.dpd >= LEGAL_THRESHOLD && loan.state !== 'LEGAL') {
        loan.state = 'LEGAL';
        const existing = await LegalCase.findOne({ loanId: loan._id });
        if (!existing) {
          await LegalCase.create({
            loanId: loan._id,
            dpdAtEntry: loan.dpd,
            status: 'OPEN'
          });
        }
        await loan.save();
      }
    }

    console.log('[State Escalation] Completed');
  } catch (error) {
    console.error('[State Escalation] Error:', error.message);
  }
};

const initStateEscalation = () => {
  cron.schedule('0 3 * * *', stateEscalation);
  console.log('[State Escalation] Scheduled for 3:00 AM daily');
};

module.exports = { initStateEscalation, stateEscalation };
