// Simple in-memory cache middleware
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

const cacheManager = new CacheManager();

// Cleanup expired entries every 10 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 10 * 60 * 1000);

// Cache middleware factory
const createCacheMiddleware = (keyGenerator, ttl) => {
  return (req, res, next) => {
    // Skip caching if explicitly disabled
    if (req.query.cache === 'false') {
      return next();
    }

    const key = typeof keyGenerator === 'function' ? keyGenerator(req) : keyGenerator;
    const cached = cacheManager.get(key);

    if (cached) {
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data) {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheManager.set(key, data, ttl);
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Predefined cache middlewares
const dashboardCache = createCacheMiddleware(
  (req) => `dashboard-${JSON.stringify(req.query)}`,
  5 * 60 * 1000 // 5 minutes
);

const statsCache = createCacheMiddleware(
  (req) => `stats-${req.query.period || '30d'}`,
  10 * 60 * 1000 // 10 minutes
);

const activitiesCache = createCacheMiddleware(
  (req) => `activities-${req.query.limit || 10}`,
  2 * 60 * 1000 // 2 minutes
);

module.exports = {
  cacheManager,
  createCacheMiddleware,
  dashboardCache,
  statsCache,
  activitiesCache
};