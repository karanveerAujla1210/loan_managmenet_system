const cron = require('node-cron');
const logger = require('../config/logger');

class CronManager {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  // Register a cron job
  register(name, schedule, task, options = {}) {
    try {
      const job = cron.schedule(schedule, async () => {
        const startTime = Date.now();
        logger.info(`Starting cron job: ${name}`);
        
        try {
          await task();
          const duration = Date.now() - startTime;
          logger.info(`Cron job completed: ${name} (${duration}ms)`);
        } catch (error) {
          logger.error(`Cron job failed: ${name}`, error);
        }
      }, {
        scheduled: false,
        timezone: options.timezone || 'Asia/Kolkata',
        ...options
      });

      this.jobs.set(name, {
        job,
        schedule,
        task,
        options,
        lastRun: null,
        nextRun: null,
        isRunning: false
      });

      logger.info(`Cron job registered: ${name} with schedule: ${schedule}`);
      return job;
    } catch (error) {
      logger.error(`Failed to register cron job: ${name}`, error);
      throw error;
    }
  }

  // Start a specific job
  start(name) {
    const jobInfo = this.jobs.get(name);
    if (!jobInfo) {
      throw new Error(`Cron job not found: ${name}`);
    }

    jobInfo.job.start();
    jobInfo.isRunning = true;
    logger.info(`Cron job started: ${name}`);
  }

  // Stop a specific job
  stop(name) {
    const jobInfo = this.jobs.get(name);
    if (!jobInfo) {
      throw new Error(`Cron job not found: ${name}`);
    }

    jobInfo.job.stop();
    jobInfo.isRunning = false;
    logger.info(`Cron job stopped: ${name}`);
  }

  // Start all jobs
  startAll() {
    if (this.isRunning) {
      logger.warn('Cron manager is already running');
      return;
    }

    for (const [name, jobInfo] of this.jobs) {
      try {
        this.start(name);
      } catch (error) {
        logger.error(`Failed to start cron job: ${name}`, error);
      }
    }

    this.isRunning = true;
    logger.info('All cron jobs started');
  }

  // Stop all jobs
  stopAll() {
    for (const [name, jobInfo] of this.jobs) {
      try {
        this.stop(name);
      } catch (error) {
        logger.error(`Failed to stop cron job: ${name}`, error);
      }
    }

    this.isRunning = false;
    logger.info('All cron jobs stopped');
  }

  // Get job status
  getJobStatus(name) {
    const jobInfo = this.jobs.get(name);
    if (!jobInfo) {
      return null;
    }

    return {
      name,
      schedule: jobInfo.schedule,
      isRunning: jobInfo.isRunning,
      lastRun: jobInfo.lastRun,
      nextRun: jobInfo.nextRun
    };
  }

  // Get all jobs status
  getAllJobsStatus() {
    const status = [];
    for (const [name] of this.jobs) {
      status.push(this.getJobStatus(name));
    }
    return status;
  }

  // Remove a job
  remove(name) {
    const jobInfo = this.jobs.get(name);
    if (!jobInfo) {
      throw new Error(`Cron job not found: ${name}`);
    }

    if (jobInfo.isRunning) {
      this.stop(name);
    }

    jobInfo.job.destroy();
    this.jobs.delete(name);
    logger.info(`Cron job removed: ${name}`);
  }

  // Check if manager is running
  isManagerRunning() {
    return this.isRunning;
  }

  // Get registered jobs count
  getJobsCount() {
    return this.jobs.size;
  }
}

// Create singleton instance
const cronManager = new CronManager();

// Register default jobs
const registerDefaultJobs = () => {
  // DPD Update Job - Daily at 1:00 AM
  cronManager.register(
    'dpd-update',
    process.env.CRON_DPD_UPDATE || '0 1 * * *',
    async () => {
      const DPDService = require('./dpdUpdateJob');
      await DPDService.updateAllLoansDPD();
    }
  );

  // Interest Calculation Job - Daily at 2:00 AM
  cronManager.register(
    'interest-calculation',
    process.env.CRON_INTEREST_CALCULATION || '0 2 * * *',
    async () => {
      const InterestService = require('./interestCalculationJob');
      await InterestService.calculateDailyInterest();
    }
  );

  // Collection Reminder Job - Daily at 9:00 AM
  cronManager.register(
    'collection-reminder',
    process.env.CRON_COLLECTION_REMINDER || '0 9 * * *',
    async () => {
      const CollectionService = require('./collectionReminderJob');
      await CollectionService.sendCollectionReminders();
    }
  );

  // Report Generation Job - Weekly on Monday at 6:00 AM
  cronManager.register(
    'weekly-reports',
    process.env.CRON_REPORT_GENERATION || '0 6 * * 1',
    async () => {
      const ReportService = require('./reportGenerationJob');
      await ReportService.generateWeeklyReports();
    }
  );

  // Data Cleanup Job - Weekly on Sunday at 3:00 AM
  cronManager.register(
    'data-cleanup',
    process.env.CRON_DATA_CLEANUP || '0 3 * * 0',
    async () => {
      const CleanupService = require('./dataCleanupJob');
      await CleanupService.cleanupOldData();
    }
  );

  // Backup Job - Daily at 4:00 AM
  cronManager.register(
    'database-backup',
    process.env.CRON_DATABASE_BACKUP || '0 4 * * *',
    async () => {
      const BackupService = require('./databaseBackupJob');
      await BackupService.createDatabaseBackup();
    }
  );

  // Health Check Job - Every 5 minutes
  cronManager.register(
    'health-check',
    '*/5 * * * *',
    async () => {
      const HealthService = require('./healthCheckJob');
      await HealthService.performHealthCheck();
    }
  );

  // Cache Cleanup Job - Every hour
  cronManager.register(
    'cache-cleanup',
    '0 * * * *',
    async () => {
      const CacheService = require('./cacheCleanupJob');
      await CacheService.cleanupExpiredCache();
    }
  );

  logger.info('Default cron jobs registered');
};

// Initialize default jobs
registerDefaultJobs();

module.exports = cronManager;