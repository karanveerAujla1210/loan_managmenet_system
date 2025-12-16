/**
 * CSV Parser Utility
 * Converts CSV/Excel to normalized rows
 */

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have header row and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    rows.push(row);
  }

  return rows;
};

/**
 * Parse Excel file (requires xlsx library)
 * Install: npm install xlsx
 */
const parseExcel = async (file) => {
  const XLSX = await import('xlsx');
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: ''
  });

  if (rows.length < 2) {
    throw new Error('Excel must have header row and at least one data row');
  }

  const headers = rows[0].map(h => String(h).trim().toLowerCase());
  const dataRows = [];

  for (let i = 1; i < rows.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = rows[i][index] || '';
    });
    dataRows.push(row);
  }

  return dataRows;
};

/**
 * Validate required columns
 */
const validateColumns = (rows, requiredColumns) => {
  if (rows.length === 0) return { valid: false, error: 'No data rows' };

  const firstRow = rows[0];
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));

  if (missingColumns.length > 0) {
    return {
      valid: false,
      error: `Missing columns: ${missingColumns.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Convert numeric strings
 */
const normalizeRow = (row) => {
  const normalized = { ...row };

  if (normalized.loan_amount) {
    normalized.loan_amount = parseFloat(normalized.loan_amount);
  }
  if (normalized.amount) {
    normalized.amount = parseFloat(normalized.amount);
  }
  if (normalized.instalment_no) {
    normalized.instalment_no = parseInt(normalized.instalment_no);
  }

  return normalized;
};

export { parseCSV, parseExcel, validateColumns, normalizeRow };
