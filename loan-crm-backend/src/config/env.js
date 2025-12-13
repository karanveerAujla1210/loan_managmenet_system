require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_crm',
  DB_NAME: process.env.DB_NAME || 'loan_crm',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs/',
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads/',
  
  // Cron Jobs
  ENABLE_CRON_JOBS: process.env.ENABLE_CRON_JOBS === 'true',
  DPD_UPDATE_CRON: process.env.DPD_UPDATE_CRON || '0 1 * * *',
  LEGAL_ESCALATION_CRON: process.env.LEGAL_ESCALATION_CRON || '0 2 * * *',
  PAYMENT_RECONCILE_CRON: process.env.PAYMENT_RECONCILE_CRON || '0 3 * * *'
};