const featureFlags = {
  CRON_ENABLED: process.env.CRON_ENABLED !== 'false',
  ESCALATION_ENABLED: process.env.ESCALATION_ENABLED !== 'false',
  SCORING_ENABLED: process.env.SCORING_ENABLED !== 'false',
  REMINDERS_ENABLED: process.env.REMINDERS_ENABLED !== 'false',
  RECONCILIATION_ENABLED: process.env.RECONCILIATION_ENABLED !== 'false'
};

const isFeatureEnabled = (feature) => {
  return featureFlags[feature] === true;
};

module.exports = { featureFlags, isFeatureEnabled };
