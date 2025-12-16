module.exports = {
  // Feature flags
  CRON_ENABLED: process.env.CRON_ENABLED !== 'false',
  ESCALATION_ENABLED: process.env.ESCALATION_ENABLED !== 'false',
  SCORING_ENABLED: process.env.SCORING_ENABLED !== 'false',
  REMINDERS_ENABLED: process.env.REMINDERS_ENABLED !== 'false',

  // Timezone
  TIMEZONE: 'Asia/Kolkata',

  // Limits
  MAX_PAYMENT_AMOUNT: 10000000,
  BACKDATING_LIMIT_DAYS: 7,
  PENALTY_AMOUNT: 250,
  LEGAL_DPD_THRESHOLD: 90,

  // Validation
  REQUIRE_IDEMPOTENCY_KEY: true,
  REQUIRE_UTR_FOR_BANK_PAYMENTS: true,

  // Safety
  IMMUTABLE_FIELDS: ['dpd', 'bucket', 'status', 'principal', 'schedule'],
  AUDIT_ALL_FINANCIAL_ACTIONS: true,
  LOG_UNAUTHORIZED_ATTEMPTS: true
};
