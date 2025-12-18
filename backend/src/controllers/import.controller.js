const ImportService = require('../services/import.service');
const AuditLog = require('../models/audit-log.model');

class ImportController {
  static async importCustomers(req, res) {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
      }

      const result = await ImportService.importCustomers(data);

      if (AuditLog) {
        await AuditLog.create({
          action: 'BULK_IMPORT_CUSTOMERS',
          entity: 'CUSTOMER',
          entityId: null,
          userId: req.user?.id,
          changes: { after: { count: result.success } },
          status: 'SUCCESS'
        }).catch(err => console.error('Audit log error:', err));
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async importLoans(req, res) {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
      }

      const result = await ImportService.importLoans(data);

      if (AuditLog) {
        await AuditLog.create({
          action: 'BULK_IMPORT_LOANS',
          entity: 'LOAN',
          entityId: null,
          userId: req.user?.id,
          changes: { after: { count: result.success } },
          status: 'SUCCESS'
        }).catch(err => console.error('Audit log error:', err));
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async importPayments(req, res) {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
      }

      const result = await ImportService.importPayments(data);

      if (AuditLog) {
        await AuditLog.create({
          action: 'BULK_IMPORT_PAYMENTS',
          entity: 'PAYMENT',
          entityId: null,
          userId: req.user?.id,
          changes: { after: { count: result.success } },
          status: 'SUCCESS'
        }).catch(err => console.error('Audit log error:', err));
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async importUsers(req, res) {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
      }

      const result = await ImportService.importUsers(data);

      if (AuditLog) {
        await AuditLog.create({
          action: 'BULK_IMPORT_USERS',
          entity: 'USER',
          entityId: null,
          userId: req.user?.id,
          changes: { after: { count: result.success } },
          status: 'SUCCESS'
        }).catch(err => console.error('Audit log error:', err));
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ImportController;
