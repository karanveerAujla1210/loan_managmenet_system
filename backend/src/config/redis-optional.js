const Redis = require('ioredis');
const { logger } = require('./logger');

let redis = null;

const createRedisConnection = () => {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    };

    redis = new Redis(redisConfig);

    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (error) => {
      logger.warn('Redis connection failed - continuing without Redis:', error.message);
      redis = null;
    });

    return redis;
  } catch (error) {
    logger.warn('Redis not available - continuing without Redis');
    return null;
  }
};

const getRedis = () => {
  if (!redis) {
    redis = createRedisConnection();
  }
  return redis;
};

module.exports = { getRedis, redis: getRedis() };