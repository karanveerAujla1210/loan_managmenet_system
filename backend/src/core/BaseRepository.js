const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  // Basic CRUD operations
  async create(data) {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError('Duplicate entry found', 409);
      }
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid ID format', 400);
      }
      
      return await this.model.findById(id).where({ isDeleted: false });
    } catch (error) {
      throw error;
    }
  }

  async findOne(filter) {
    try {
      return await this.model.findOne({ ...filter, isDeleted: false });
    } catch (error) {
      throw error;
    }
  }

  async findAll(filter = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate = '',
        select = ''
      } = options;

      const query = { ...filter, isDeleted: false };
      
      return await this.model.paginate(query, {
        page,
        limit,
        sort,
        populate,
        select
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid ID format', 400);
      }

      const updatedData = {
        ...data,
        updatedAt: new Date()
      };

      return await this.model.findByIdAndUpdate(
        id,
        updatedData,
        { new: true, runValidators: true }
      ).where({ isDeleted: false });
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError('Duplicate entry found', 409);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid ID format', 400);
      }

      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid ID format', 400);
      }

      return await this.model.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
          isActive: false
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async restore(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid ID format', 400);
      }

      return await this.model.findByIdAndUpdate(
        id,
        {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          isActive: true
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations
  async bulkCreate(records) {
    try {
      return await this.model.insertMany(records, { ordered: false });
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdate(updates, userId) {
    try {
      const bulkOps = updates.map(update => ({
        updateOne: {
          filter: { _id: update.id, isDeleted: false },
          update: {
            ...update.data,
            updatedAt: new Date(),
            updatedBy: userId
          }
        }
      }));

      return await this.model.bulkWrite(bulkOps);
    } catch (error) {
      throw error;
    }
  }

  async bulkDelete(ids, userId) {
    try {
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
      
      return await this.model.updateMany(
        { _id: { $in: validIds }, isDeleted: false },
        {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
          isActive: false
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // Search operations
  async search(searchTerm, options = {}) {
    try {
      const {
        fields = [],
        page = 1,
        limit = 10,
        sort = { createdAt: -1 }
      } = options;

      if (!searchTerm || fields.length === 0) {
        return await this.findAll({}, { page, limit, sort });
      }

      const searchRegex = new RegExp(searchTerm, 'i');
      const searchQuery = {
        $or: fields.map(field => ({ [field]: searchRegex })),
        isDeleted: false
      };

      return await this.model.paginate(searchQuery, {
        page,
        limit,
        sort
      });
    } catch (error) {
      throw error;
    }
  }

  // Aggregation operations
  async aggregate(pipeline) {
    try {
      // Add default filter for non-deleted records
      const defaultMatch = { $match: { isDeleted: false } };
      const fullPipeline = [defaultMatch, ...pipeline];
      
      return await this.model.aggregate(fullPipeline);
    } catch (error) {
      throw error;
    }
  }

  // Count operations
  async count(filter = {}) {
    try {
      return await this.model.countDocuments({ ...filter, isDeleted: false });
    } catch (error) {
      throw error;
    }
  }

  async countDeleted(filter = {}) {
    try {
      return await this.model.countDocuments({ ...filter, isDeleted: true });
    } catch (error) {
      throw error;
    }
  }

  // Existence check
  async exists(filter) {
    try {
      const count = await this.model.countDocuments({ ...filter, isDeleted: false });
      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Statistics
  async getStats(period = '30d') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const pipeline = [
        {
          $match: {
            isDeleted: false,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ];

      const dailyStats = await this.model.aggregate(pipeline);
      const totalCount = await this.count();
      const deletedCount = await this.countDeleted();

      return {
        total: totalCount,
        deleted: deletedCount,
        active: totalCount - deletedCount,
        dailyStats,
        period
      };
    } catch (error) {
      throw error;
    }
  }

  // Export operations
  async export(filter = {}, format = 'csv') {
    try {
      const records = await this.model.find({ ...filter, isDeleted: false })
        .lean()
        .limit(10000); // Limit for performance

      if (format === 'json') {
        return JSON.stringify(records, null, 2);
      }

      if (format === 'csv') {
        if (records.length === 0) return '';

        const headers = Object.keys(records[0]).join(',');
        const rows = records.map(record => 
          Object.values(record).map(value => 
            typeof value === 'string' ? `"${value}"` : value
          ).join(',')
        );

        return [headers, ...rows].join('\n');
      }

      throw new ApiError('Unsupported export format', 400);
    } catch (error) {
      throw error;
    }
  }

  // Transaction operations
  async withTransaction(callback) {
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Advanced queries
  async findByDateRange(startDate, endDate, filter = {}) {
    try {
      return await this.model.find({
        ...filter,
        isDeleted: false,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findRecent(limit = 10, filter = {}) {
    try {
      return await this.model.find({ ...filter, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async findPopular(limit = 10, sortField = 'views') {
    try {
      return await this.model.find({ isDeleted: false })
        .sort({ [sortField]: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Utility methods
  async getDistinctValues(field, filter = {}) {
    try {
      return await this.model.distinct(field, { ...filter, isDeleted: false });
    } catch (error) {
      throw error;
    }
  }

  async getFieldStats(field) {
    try {
      const pipeline = [
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ];

      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  // Index management
  async createIndex(fields, options = {}) {
    try {
      return await this.model.createIndex(fields, options);
    } catch (error) {
      logger.error('Index creation error:', error);
      throw error;
    }
  }

  async getIndexes() {
    try {
      return await this.model.listIndexes();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseRepository;