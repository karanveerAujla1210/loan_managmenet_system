const {
  validateLoansImport,
  generatePreview,
  commitLoansImport,
  validatePaymentsImport,
  commitPaymentsImport
} = require('../services/importService');

/**
 * POST /api/import/loans/validate
 * Step 1: Validate loans CSV
 */
const validateLoansUpload = async (req, res) => {
  try {
    if (!req.body.rows || !Array.isArray(req.body.rows)) {
      return res.status(400).json({
        success: false,
        message: 'rows array required'
      });
    }

    const { errors, normalized } = await validateLoansImport(req.body.rows);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        validRowCount: normalized.length,
        totalRows: req.body.rows.length
      });
    }

    res.json({
      success: true,
      message: 'All rows valid',
      validRowCount: normalized.length,
      normalized
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /api/import/loans/preview
 * Step 2: Show preview with calculated instalments
 */
const previewLoansImport = async (req, res) => {
  try {
    if (!req.body.normalized || !Array.isArray(req.body.normalized)) {
      return res.status(400).json({
        success: false,
        message: 'normalized array required'
      });
    }

    const preview = generatePreview(req.body.normalized);

    res.json({
      success: true,
      message: 'Preview generated',
      preview,
      loanCount: preview.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /api/import/loans/confirm
 * Step 3: Atomic commit - create loans + instalments
 */
const confirmLoansImport = async (req, res) => {
  try {
    if (!req.body.normalized || !Array.isArray(req.body.normalized)) {
      return res.status(400).json({
        success: false,
        message: 'normalized array required'
      });
    }

    const batchId = `BATCH-${Date.now()}`;
    const result = await commitLoansImport(req.body.normalized, batchId);

    res.json({
      success: true,
      message: `${result.loanCount} loans imported successfully`,
      batchId: result.batchId,
      loanCount: result.loanCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Import failed: ' + error.message
    });
  }
};

/**
 * POST /api/import/payments/validate
 * Step 4: Validate payments CSV
 */
const validatePaymentsUpload = async (req, res) => {
  try {
    if (!req.body.rows || !Array.isArray(req.body.rows)) {
      return res.status(400).json({
        success: false,
        message: 'rows array required'
      });
    }

    const { errors, normalized } = await validatePaymentsImport(req.body.rows);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        validRowCount: normalized.length,
        totalRows: req.body.rows.length
      });
    }

    res.json({
      success: true,
      message: 'All rows valid',
      validRowCount: normalized.length,
      normalized
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /api/import/payments/confirm
 * Step 5: Atomic commit - create payments + update instalments
 */
const confirmPaymentsImport = async (req, res) => {
  try {
    if (!req.body.normalized || !Array.isArray(req.body.normalized)) {
      return res.status(400).json({
        success: false,
        message: 'normalized array required'
      });
    }

    const result = await commitPaymentsImport(req.body.normalized);

    res.json({
      success: true,
      message: `${result.paymentCount} payments imported successfully`,
      paymentCount: result.paymentCount,
      totalAmount: result.totalAmount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Import failed: ' + error.message
    });
  }
};

module.exports = {
  validateLoansUpload,
  previewLoansImport,
  confirmLoansImport,
  validatePaymentsUpload,
  confirmPaymentsImport
};
