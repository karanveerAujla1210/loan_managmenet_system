const Redis = require('ioredis');
const logger = require('./logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        logger.error('Redis connection error:', err);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis disconnected');
    }
  }

  getClient() {
    return this.client;
  }

  isReady() {
    return this.isConnected && this.client && this.client.status === 'ready';
  }

  // Cache operations
  async set(key, value, ttl = 3600) {
    try {
      if (!this.isReady()) return false;
      
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      if (!this.isReady()) return null;
      
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      if (!this.isReady()) return false;
      
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      if (!this.isReady()) return false;
      
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async expire(key, ttl) {
    try {
      if (!this.isReady()) return false;
      
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Redis EXPIRE error:', error);
      return false;
    }
  }

  // Hash operations
  async hset(key, field, value) {
    try {
      if (!this.isReady()) return false;
      
      await this.client.hset(key, field, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis HSET error:', error);
      return false;
    }
  }

  async hget(key, field) {
    try {
      if (!this.isReady()) return null;
      
      const value = await this.client.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis HGET error:', error);
      return null;
    }
  }

  async hdel(key, field) {
    try {
      if (!this.isReady()) return false;
      
      await this.client.hdel(key, field);
      return true;
    } catch (error) {
      logger.error('Redis HDEL error:', error);
      return false;
    }
  }

  // List operations
  async lpush(key, value) {
    try {
      if (!this.isReady()) return false;
      
      await this.client.lpush(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis LPUSH error:', error);
      return false;
    }
  }

  async rpop(key) {
    try {
      if (!this.isReady()) return null;
      
      const value = await this.client.rpop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis RPOP error:', error);
      return null;
    }
  }

  // Set operations
  async sadd(key, member) {
    try {
      if (!this.isReady()) return false;
      
      await this.client.sadd(key, JSON.stringify(member));
      return true;
    } catch (error) {
      logger.error('Redis SADD error:', error);
      return false;
    }
  }

  async sismember(key, member) {
    try {
      if (!this.isReady()) return false;
      
      const result = await this.client.sismember(key, JSON.stringify(member));
      return result === 1;
    } catch (error) {
      logger.error('Redis SISMEMBER error:', error);
      return false;
    }
  }

  // Increment operations
  async incr(key) {
    try {
      if (!this.isReady()) return 0;
      
      return await this.client.incr(key);
    } catch (error) {
      logger.error('Redis INCR error:', error);
      return 0;
    }
  }

  async incrby(key, increment) {
    try {
      if (!this.isReady()) return 0;
      
      return await this.client.incrby(key, increment);
    } catch (error) {
      logger.error('Redis INCRBY error:', error);
      return 0;
    }
  }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = redisClient;