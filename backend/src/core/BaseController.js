const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

class BaseController {
  constructor(service) {
    this.service = service;
  }

  // Validation middleware
  validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }));
      
      return res.status(400).json(
        ApiResponse.error('Validation failed', errorMessages, 400)
      );
    }
    next();
  };

  // Generic CRUD operations
  create = async (req, res, next) => {
    try {
      const data = { ...req.body, createdBy: req.user?.id };
      const result = await this.service.create(data);
      
      logger.info(`${this.constructor.name}: Created new record`, {
        userId: req.user?.id,
        recordId: result.id,
        ip: req.ip
      });

      res.status(201).json(
        ApiResponse.success('Record created successfully', result, 201)
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        search,
        ...filters
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      let result;
      if (search) {
        result = await this.service.search(search, options);
      } else {
        result = await this.service.getAll(filters, options);
      }

      res.json(ApiResponse.success('Records retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);

      if (!result) {
        throw new ApiError('Record not found', 404);
      }

      res.json(ApiResponse.success('Record retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = { ...req.body, updatedBy: req.user?.id };
      
      const result = await this.service.update(id, data);

      if (!result) {
        throw new ApiError('Record not found', 404);
      }

      logger.info(`${this.constructor.name}: Updated record`, {
        userId: req.user?.id,
        recordId: id,
        ip: req.ip
      });

      res.json(ApiResponse.success('Record updated successfully', result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id, req.user?.id);

      if (!result) {
        throw new ApiError('Record not found', 404);
      }

      logger.info(`${this.constructor.name}: Deleted record`, {
        userId: req.user?.id,
        recordId: id,
        ip: req.ip
      });

      res.json(ApiResponse.success('Record deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  restore = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.restore(id);

      if (!result) {
        throw new ApiError('Record not found', 404);
      }

      logger.info(`${this.constructor.name}: Restored record`, {
        userId: req.user?.id,
        recordId: id,
        ip: req.ip
      });

      res.json(ApiResponse.success('Record restored successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // Bulk operations
  bulkCreate = async (req, res, next) => {
    try {
      const { records } = req.body;
      
      if (!Array.isArray(records) || records.length === 0) {
        throw new ApiError('Records array is required', 400);
      }

      const data = records.map(record => ({
        ...record,
        createdBy: req.user?.id
      }));

      const result = await this.service.bulkCreate(data);

      logger.info(`${this.constructor.name}: Bulk created records`, {
        userId: req.user?.id,
        count: records.length,
        ip: req.ip
      });

      res.status(201).json(
        ApiResponse.success('Records created successfully', result, 201)
      );
    } catch (error) {
      next(error);
    }
  };

  bulkUpdate = async (req, res, next) => {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new ApiError('Updates array is required', 400);
      }

      const result = await this.service.bulkUpdate(updates, req.user?.id);

      logger.info(`${this.constructor.name}: Bulk updated records`, {
        userId: req.user?.id,
        count: updates.length,
        ip: req.ip
      });

      res.json(ApiResponse.success('Records updated successfully', result));
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req, res, next) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError('IDs array is required', 400);
      }

      const result = await this.service.bulkDelete(ids, req.user?.id);

      logger.info(`${this.constructor.name}: Bulk deleted records`, {
        userId: req.user?.id,
        count: ids.length,
        ip: req.ip
      });

      res.json(ApiResponse.success('Records deleted successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // Export operations
  export = async (req, res, next) => {
    try {
      const { format = 'csv', ...filters } = req.query;
      
      const result = await this.service.export(filters, format);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=export.${format}`);
      
      res.send(result);
    } catch (error) {
      next(error);
    }
  };

  // Statistics
  getStats = async (req, res, next) => {
    try {
      const { period = '30d' } = req.query;
      const result = await this.service.getStats(period);

      res.json(ApiResponse.success('Statistics retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // Health check for specific service
  healthCheck = async (req, res, next) => {
    try {
      const health = await this.service.healthCheck();
      res.json(ApiResponse.success('Service health check', health));
    } catch (error) {
      next(error);
    }
  };

  // Async wrapper for route handlers
  asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  // Response helpers
  sendSuccess = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json(ApiResponse.success(message, data, statusCode));
  };

  sendError = (res, message, statusCode = 500, errors = null) => {
    res.status(statusCode).json(ApiResponse.error(message, errors, statusCode));
  };

  // Pagination helper
  getPaginationParams = (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  };

  // Sort helper
  getSortParams = (req) => {
    const { sort = 'createdAt', order = 'desc' } = req.query;
    return { [sort]: order === 'desc' ? -1 : 1 };
  };

  // Filter helper
  getFilterParams = (req) => {
    const { page, limit, sort, order, search, ...filters } = req.query;
    return filters;
  };
}

module.exports = BaseController;