const { Queue, Worker } = require('bullmq');
const redis = require('../config/redis');
const { logger } = require('../config/logger');

// Queue configurations
const defaultJobOptions = {
  removeOnComplete: 10,
  removeOnFail: 5,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
};

// Create queues
const repaymentQueue = new Queue('repayment-generation', {
  connection: redis,
  defaultJobOptions,
});

const notificationQueue = new Queue('notifications', {
  connection: redis,
  defaultJobOptions,
});

const reconciliationQueue = new Queue('reconciliation', {
  connection: redis,
  defaultJobOptions,
});

// Queue event handlers
const setupQueueEvents = (queue, name) => {
  queue.on('completed', (job) => {
    logger.info(`${name} job completed`, { jobId: job.id });
  });

  queue.on('failed', (job, err) => {
    logger.error(`${name} job failed`, { jobId: job.id, error: err.message });
  });

  queue.on('stalled', (jobId) => {
    logger.warn(`${name} job stalled`, { jobId });
  });
};

setupQueueEvents(repaymentQueue, 'Repayment');
setupQueueEvents(notificationQueue, 'Notification');
setupQueueEvents(reconciliationQueue, 'Reconciliation');

module.exports = {
  repaymentQueue,
  notificationQueue,
  reconciliationQueue,
};