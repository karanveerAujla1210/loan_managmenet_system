const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const redisClient = require('../config/redis');

class BaseService {
  constructor(repository) {
    this.repository = repository;
    this.cachePrefix = this.constructor.name.toLowerCase();
    this.defaultCacheTTL = 3600; // 1 hour
  }

  // CRUD operations
  async create(data) {
    try {
      const result = await this.repository.create(data);
      
      // Clear related cache
      await this.clearCache();
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - Create error:`, error);
      throw new ApiError('Failed to create record', 500);
    }
  }

  async getAll(filters = {}, options = {}) {
    try {
      const cacheKey = this.getCacheKey('all', { filters, options });
      
      // Try to get from cache first
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.repository.findAll(filters, options);
      
      // Cache the result
      await this.setCache(cacheKey, result);
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - GetAll error:`, error);
      throw new ApiError('Failed to retrieve records', 500);
    }
  }

  async getById(id) {
    try {
      const cacheKey = this.getCacheKey('byId', id);
      
      // Try to get from cache first
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.repository.findById(id);
      
      if (result) {
        // Cache the result
        await this.setCache(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - GetById error:`, error);
      throw new ApiError('Failed to retrieve record', 500);
    }
  }

  async update(id, data) {
    try {
      const result = await this.repository.update(id, data);
      
      if (result) {
        // Clear cache for this record and related caches
        await this.clearCache(id);
      }
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - Update error:`, error);
      throw new ApiError('Failed to update record', 500);
    }
  }

  async delete(id, userId) {
    try {
      const result = await this.repository.softDelete(id, userId);
      
      if (result) {
        // Clear cache for this record and related caches
        await this.clearCache(id);
      }
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - Delete error:`, error);
      throw new ApiError('Failed to delete record', 500);
    }
  }

  async restore(id) {
    try {
      const result = await this.repository.restore(id);
      
      if (result) {
        // Clear cache
        await this.clearCache(id);
      }
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - Restore error:`, error);
      throw new ApiError('Failed to restore record', 500);
    }
  }

  // Bulk operations
  async bulkCreate(records) {
    try {
      const result = await this.repository.bulkCreate(records);
      
      // Clear related cache
      await this.clearCache();
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - BulkCreate error:`, error);
      throw new ApiError('Failed to create records', 500);
    }
  }

  async bulkUpdate(updates, userId) {
    try {
      const result = await this.repository.bulkUpdate(updates, userId);
      
      // Clear related cache
      await this.clearCache();
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - BulkUpdate error:`, error);
      throw new ApiError('Failed to update records', 500);
    }
  }

  async bulkDelete(ids, userId) {
    try {
      const result = await this.repository.bulkDelete(ids, userId);
      
      // Clear related cache
      await this.clearCache();
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - BulkDelete error:`, error);
      throw new ApiError('Failed to delete records', 500);
    }
  }

  // Search operations
  async search(searchTerm, options = {}) {
    try {
      const cacheKey = this.getCacheKey('search', { searchTerm, options });
      
      // Try to get from cache first
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.repository.search(searchTerm, options);
      
      // Cache the result with shorter TTL for search results
      await this.setCache(cacheKey, result, 1800); // 30 minutes
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - Search error:`, error);
      throw new ApiError('Failed to search records', 500);
    }
  }

  // Statistics
  async getStats(period = '30d') {
    try {
      const cacheKey = this.getCacheKey('stats', period);
      
      // Try to get from cache first
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.repository.getStats(period);
      
      // Cache stats with shorter TTL
      await this.setCache(cacheKey, result, 900); // 15 minutes
      
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - GetStats error:`, error);
      throw new ApiError('Failed to retrieve statistics', 500);
    }
  }

  // Export operations
  async export(filters = {}, format = 'csv') {
    try {
      const result = await this.repository.export(filters, format);
      return result;
    } catch (error) {
      logger.error(`${this.constructor.name} - Export error:`, error);
      throw new ApiError('Failed to export records', 500);
    }
  }

  // Validation
  async validateData(data, rules) {
    try {
      // Implement validation logic based on rules
      const errors = [];
      
      for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];
        
        if (rule.required && (!value || value === '')) {
          errors.push(`${field} is required`);
        }
        
        if (value && rule.type && typeof value !== rule.type) {
          errors.push(`${field} must be of type ${rule.type}`);
        }
        
        if (value && rule.min && value < rule.min) {
          errors.push(`${field} must be at least ${rule.min}`);
        }
        
        if (value && rule.max && value > rule.max) {
          errors.push(`${field} must not exceed ${rule.max}`);
        }
        
        if (value && rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
      
      if (errors.length > 0) {
        throw new ApiError('Validation failed', 400, errors);
      }
      
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`${this.constructor.name} - Validation error:`, error);
      throw new ApiError('Validation failed', 500);
    }
  }

  // Cache operations
  getCacheKey(operation, params = '') {
    const paramsStr = typeof params === 'object' 
      ? JSON.stringify(params) 
      : params.toString();
    return `${this.cachePrefix}:${operation}:${paramsStr}`;
  }

  async getFromCache(key) {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.warn(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async setCache(key, data, ttl = this.defaultCacheTTL) {
    try {
      await redisClient.set(key, data, ttl);
    } catch (error) {
      logger.warn(`Cache set error for key ${key}:`, error);
    }
  }

  async clearCache(id = null) {
    try {
      if (id) {
        // Clear specific record cache
        const keys = [
          this.getCacheKey('byId', id),
          this.getCacheKey('all'),
          this.getCacheKey('stats'),
        ];
        
        for (const key of keys) {
          await redisClient.del(key);
        }
      } else {
        // Clear all related cache (pattern-based deletion would be better)
        const keys = [
          this.getCacheKey('all'),
          this.getCacheKey('stats'),
        ];
        
        for (const key of keys) {
          await redisClient.del(key);
        }
      }
    } catch (error) {
      logger.warn('Cache clear error:', error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      // Basic health check - can be overridden in child classes
      const count = await this.repository.count();
      return {
        status: 'healthy',
        service: this.constructor.name,
        recordCount: count,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`${this.constructor.name} - Health check error:`, error);
      return {
        status: 'unhealthy',
        service: this.constructor.name,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Utility methods
  async exists(id) {
    try {
      const record = await this.getById(id);
      return !!record;
    } catch (error) {
      return false;
    }
  }

  async count(filters = {}) {
    try {
      return await this.repository.count(filters);
    } catch (error) {
      logger.error(`${this.constructor.name} - Count error:`, error);
      throw new ApiError('Failed to count records', 500);
    }
  }

  // Transaction wrapper
  async withTransaction(callback) {
    try {
      return await this.repository.withTransaction(callback);
    } catch (error) {
      logger.error(`${this.constructor.name} - Transaction error:`, error);
      throw error;
    }
  }
}

module.exports = BaseService;