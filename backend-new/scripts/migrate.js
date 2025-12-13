#!/usr/bin/env node

/**
 * Database Migration Script
 * Sets up initial database structure, indexes, and configurations
 */

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../src/config/logger');

// Import models to ensure they're registered
const User = require('../src/modules/users/user.model');
// const Customer = require('../src/modules/customers/customer.model');
// const Loan = require('../src/modules/loans/loan.model');
// const Payment = require('../src/modules/payments/payment.model');
// const Schedule = require('../src/modules/schedules/schedule.model');
// const Collection = require('../src/modules/collections/collection.model');

class DatabaseMigration {
  constructor() {
    this.migrations = [];
    this.completedMigrations = [];
  }

  // Add migration
  addMigration(name, up, down) {
    this.migrations.push({ name, up, down });
  }

  // Connect to database
  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      logger.info('Connected to MongoDB for migration');
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  // Disconnect from database
  async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
    }
  }

  // Create migration tracking collection
  async createMigrationCollection() {
    const migrationSchema = new mongoose.Schema({
      name: { type: String, unique: true, required: true },
      executedAt: { type: Date, default: Date.now },
      version: { type: String, required: true }
    });

    if (!mongoose.models.Migration) {
      mongoose.model('Migration', migrationSchema);
    }

    const Migration = mongoose.model('Migration');
    
    // Get completed migrations
    this.completedMigrations = await Migration.find({}).select('name');
    this.completedMigrations = this.completedMigrations.map(m => m.name);
  }

  // Check if migration is completed
  isMigrationCompleted(name) {
    return this.completedMigrations.includes(name);
  }

  // Mark migration as completed
  async markMigrationCompleted(name) {
    const Migration = mongoose.model('Migration');
    await Migration.create({
      name,
      version: process.env.npm_package_version || '1.0.0'
    });
    this.completedMigrations.push(name);
  }

  // Run all pending migrations
  async runMigrations() {
    logger.info('Starting database migrations...');

    for (const migration of this.migrations) {
      if (!this.isMigrationCompleted(migration.name)) {
        try {
          logger.info(`Running migration: ${migration.name}`);
          await migration.up();
          await this.markMigrationCompleted(migration.name);
          logger.info(`Completed migration: ${migration.name}`);
        } catch (error) {
          logger.error(`Failed migration: ${migration.name}`, error);
          throw error;
        }
      } else {
        logger.info(`Skipping completed migration: ${migration.name}`);
      }
    }

    logger.info('All migrations completed successfully');
  }

  // Rollback last migration
  async rollbackLastMigration() {
    const Migration = mongoose.model('Migration');
    const lastMigration = await Migration.findOne().sort({ executedAt: -1 });

    if (!lastMigration) {
      logger.info('No migrations to rollback');
      return;
    }

    const migration = this.migrations.find(m => m.name === lastMigration.name);
    if (!migration) {
      logger.error(`Migration ${lastMigration.name} not found in migration list`);
      return;
    }

    try {
      logger.info(`Rolling back migration: ${migration.name}`);
      await migration.down();
      await Migration.deleteOne({ name: migration.name });
      logger.info(`Rolled back migration: ${migration.name}`);
    } catch (error) {
      logger.error(`Failed to rollback migration: ${migration.name}`, error);
      throw error;
    }
  }
}

// Initialize migration instance
const migration = new DatabaseMigration();

// Migration 1: Create indexes for User model
migration.addMigration(
  '001_create_user_indexes',
  async () => {
    const User = mongoose.model('User');
    
    // Create indexes
    await User.createIndexes([
      { email: 1 },
      { phone: 1 },
      { employeeId: 1 },
      { role: 1 },
      { department: 1 },
      { status: 1 },
      { 'security.lastLogin': -1 },
      { createdAt: -1 },
      { isActive: 1, isDeleted: 1 }
    ]);
    
    logger.info('Created User model indexes');
  },
  async () => {
    const User = mongoose.model('User');
    
    // Drop indexes (except _id)
    const indexes = await User.listIndexes();
    for (const index of indexes) {
      if (index.name !== '_id_') {
        await User.dropIndex(index.name);
      }
    }
    
    logger.info('Dropped User model indexes');
  }
);

// Migration 2: Create admin user
migration.addMigration(
  '002_create_admin_user',
  async () => {
    const User = mongoose.model('User');
    const { hashPassword } = require('../src/middleware/auth');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@nbfc.com' });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@nbfc.com',
      phone: '9999999999',
      password: await hashPassword('Admin@123'),
      role: 'admin',
      employeeId: 'ADMIN001',
      status: 'active',
      'security.emailVerified': true,
      'security.phoneVerified': true
    });
    
    await adminUser.save();
    logger.info('Created admin user: admin@nbfc.com / Admin@123');
  },
  async () => {
    const User = mongoose.model('User');
    await User.deleteOne({ email: 'admin@nbfc.com' });
    logger.info('Removed admin user');
  }
);

// Migration 3: Create application settings
migration.addMigration(
  '003_create_app_settings',
  async () => {
    const settingsSchema = new mongoose.Schema({
      key: { type: String, unique: true, required: true },
      value: mongoose.Schema.Types.Mixed,
      description: String,
      category: String,
      isSystem: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    if (!mongoose.models.Setting) {
      mongoose.model('Setting', settingsSchema);
    }

    const Setting = mongoose.model('Setting');
    
    // Default application settings
    const defaultSettings = [
      {
        key: 'app.name',
        value: 'NBFC Loan Management System',
        description: 'Application name',
        category: 'general',
        isSystem: true
      },
      {
        key: 'app.version',
        value: '2.0.0',
        description: 'Application version',
        category: 'general',
        isSystem: true
      },
      {
        key: 'loan.default_interest_rate',
        value: 24,
        description: 'Default annual interest rate (%)',
        category: 'loan',
        isSystem: false
      },
      {
        key: 'loan.default_processing_fee_rate',
        value: 2,
        description: 'Default processing fee rate (%)',
        category: 'loan',
        isSystem: false
      },
      {
        key: 'loan.default_penalty_rate',
        value: 36,
        description: 'Default penalty interest rate (%)',
        category: 'loan',
        isSystem: false
      },
      {
        key: 'loan.min_amount',
        value: 10000,
        description: 'Minimum loan amount',
        category: 'loan',
        isSystem: false
      },
      {
        key: 'loan.max_amount',
        value: 1000000,
        description: 'Maximum loan amount',
        category: 'loan',
        isSystem: false
      },
      {
        key: 'collection.auto_assignment',
        value: true,
        description: 'Enable automatic collector assignment',
        category: 'collection',
        isSystem: false
      },
      {
        key: 'notification.email_enabled',
        value: true,
        description: 'Enable email notifications',
        category: 'notification',
        isSystem: false
      },
      {
        key: 'notification.sms_enabled',
        value: true,
        description: 'Enable SMS notifications',
        category: 'notification',
        isSystem: false
      }
    ];
    
    // Insert settings if they don't exist
    for (const setting of defaultSettings) {
      await Setting.updateOne(
        { key: setting.key },
        setting,
        { upsert: true }
      );
    }
    
    logger.info('Created application settings');
  },
  async () => {
    if (mongoose.models.Setting) {
      await mongoose.model('Setting').deleteMany({});
      logger.info('Removed application settings');
    }
  }
);

// Migration 4: Create audit log collection
migration.addMigration(
  '004_create_audit_log',
  async () => {
    const auditLogSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      action: { type: String, required: true },
      resource: { type: String, required: true },
      resourceId: { type: String },
      oldValues: mongoose.Schema.Types.Mixed,
      newValues: mongoose.Schema.Types.Mixed,
      ip: String,
      userAgent: String,
      timestamp: { type: Date, default: Date.now, index: true }
    });

    // Create TTL index for automatic cleanup (keep logs for 1 year)
    auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

    if (!mongoose.models.AuditLog) {
      mongoose.model('AuditLog', auditLogSchema);
    }

    logger.info('Created audit log collection');
  },
  async () => {
    if (mongoose.models.AuditLog) {
      await mongoose.connection.db.dropCollection('auditlogs');
      logger.info('Removed audit log collection');
    }
  }
);

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'up';

  try {
    await migration.connect();
    await migration.createMigrationCollection();

    switch (command) {
      case 'up':
        await migration.runMigrations();
        break;
      
      case 'down':
        await migration.rollbackLastMigration();
        break;
      
      case 'status':
        console.log('Completed migrations:', migration.completedMigrations);
        break;
      
      default:
        console.log('Usage: node migrate.js [up|down|status]');
        break;
    }

  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await migration.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseMigration;