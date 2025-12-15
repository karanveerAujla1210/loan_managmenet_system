const mongoose = require('mongoose');

class BaseModel {
  constructor(schema, modelName) {
    // Add common fields to all schemas
    schema.add({
      createdAt: {
        type: Date,
        default: Date.now,
        index: true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      isActive: {
        type: Boolean,
        default: true,
        index: true
      },
      isDeleted: {
        type: Boolean,
        default: false,
        index: true
      },
      deletedAt: {
        type: Date,
        default: null
      },
      deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      version: {
        type: Number,
        default: 1
      },
      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    });

    // Add pre-save middleware
    schema.pre('save', function(next) {
      this.updatedAt = new Date();
      if (this.isModified() && !this.isNew) {
        this.version += 1;
      }
      next();
    });

    // Add pre-update middleware
    schema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function() {
      this.set({ updatedAt: new Date() });
      this.inc({ version: 1 });
    });

    // Add soft delete methods
    schema.methods.softDelete = function(userId) {
      this.isDeleted = true;
      this.deletedAt = new Date();
      this.deletedBy = userId;
      this.isActive = false;
      return this.save();
    };

    schema.methods.restore = function() {
      this.isDeleted = false;
      this.deletedAt = null;
      this.deletedBy = null;
      this.isActive = true;
      return this.save();
    };

    // Add query helpers
    schema.query.active = function() {
      return this.where({ isActive: true, isDeleted: false });
    };

    schema.query.deleted = function() {
      return this.where({ isDeleted: true });
    };

    // Add static methods
    schema.statics.findActive = function(filter = {}) {
      return this.find({ ...filter, isActive: true, isDeleted: false });
    };

    schema.statics.findDeleted = function(filter = {}) {
      return this.find({ ...filter, isDeleted: true });
    };

    schema.statics.softDeleteById = function(id, userId) {
      return this.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
        isActive: false
      });
    };

    schema.statics.restoreById = function(id) {
      return this.findByIdAndUpdate(id, {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        isActive: true
      });
    };

    // Add pagination method
    schema.statics.paginate = async function(filter = {}, options = {}) {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate = '',
        select = ''
      } = options;

      const skip = (page - 1) * limit;

      // Add default filters
      const query = {
        ...filter,
        isDeleted: false
      };

      let queryBuilder = this.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      if (populate) {
        queryBuilder = queryBuilder.populate(populate);
      }

      if (select) {
        queryBuilder = queryBuilder.select(select);
      }

      const [docs, total] = await Promise.all([
        queryBuilder.exec(),
        this.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        docs,
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      };
    };

    // Add search method
    schema.statics.search = function(searchTerm, fields = [], options = {}) {
      if (!searchTerm || fields.length === 0) {
        return this.find({});
      }

      const searchRegex = new RegExp(searchTerm, 'i');
      const searchQuery = {
        $or: fields.map(field => ({ [field]: searchRegex })),
        isDeleted: false
      };

      return this.find(searchQuery, null, options);
    };

    // Add audit trail
    schema.methods.addAuditLog = function(action, userId, details = {}) {
      if (!this.auditLog) {
        this.auditLog = [];
      }

      this.auditLog.push({
        action,
        userId,
        timestamp: new Date(),
        details,
        version: this.version
      });

      return this.save();
    };

    // Add validation helpers
    schema.methods.validateRequired = function(fields) {
      const errors = [];
      fields.forEach(field => {
        if (!this[field]) {
          errors.push(`${field} is required`);
        }
      });
      return errors;
    };

    // Add JSON transform
    schema.set('toJSON', {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      }
    });

    this.schema = schema;
    this.model = mongoose.model(modelName, schema);
  }

  getModel() {
    return this.model;
  }

  getSchema() {
    return this.schema;
  }
}

module.exports = BaseModel;