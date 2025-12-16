
const asyncHandler = require('../middleware/asyncHandler');
const overdueReportService = require('../services/overdueReportService');

// GET /api/overdue-reports/summary
exports.getOverdueSummary = asyncHandler(async (req, res) => {
  const summary = await overdueReportService.getOverdueSummary();
  res.json({
    success: true,
    data: summary
  });
});

// GET /api/overdue-reports/detailed
exports.getDetailedOverdueReport = asyncHandler(async (req, res) => {
  const { bucket, page = 1, limit = 20, sortBy = 'dpd', sortOrder = 'desc' } = req.query;

  const report = await overdueReportService.getDetailedOverdueReport(bucket, page, limit, sortBy, sortOrder);
  res.json({
    success: true,
    data: report
  });
});

// GET /api/overdue-reports/aging
exports.getOverdueAgingReport = asyncHandler(async (req, res) => {
  const { branch } = req.query;

  const report = await overdueReportService.getOverdueAgingReport(branch);
  res.json({
    success: true,
    data: report
  });
});

// GET /api/overdue-reports/export
exports.exportOverdueReport = asyncHandler(async (req, res) => {
  const { bucket, branch, format = 'excel' } = req.query;

  const report = await overdueReportService.exportOverdueReport(bucket, branch);

  if (format === 'excel') {
    const XLSX = require('xlsx');

    // Transform for Excel export
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add headers
    XLSX.utils.sheet_add_aoa(worksheet, [[
      'Loan ID', 'Customer Name', 'Phone', 'Email', 
      'Principal Amount', 'Interest Amount', 'Total Repayable',
      'Disbursement Date', 'DPD', 'Bucket',
      'Next Installment Date', 'Next Installment Amount',
      'Last Payment Date', 'Last Payment Amount',
      'Assigned Collector', 'Branch', 'Status'
    ]]);

    // Add data rows
    report.loans.forEach(loan => {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        loan.loanId,
        loan.customerId ? `${loan.customerId.firstName} ${loan.customerId.lastName}` : '',
        loan.customerId ? loan.customerId.phone : '',
        loan.customerId ? loan.customerId.email : '',
        loan.principal,
        loan.interestAmount,
        loan.totalRepayable,
        loan.disbursementDate,
        loan.dpd,
        loan.bucket,
        loan.nextInstallment ? loan.nextInstallment.dueDate : '',
        loan.nextInstallment ? loan.nextInstallment.emiAmount : '',
        loan.lastPayment ? loan.lastPayment.paymentDate : '',
        loan.lastPayment ? loan.lastPayment.amount : '',
        loan.assignedCollectorId || '',
        loan.branch || '',
        loan.status
      ]]);
    });

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Loan ID
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Phone
      { wch: 25 }, // Email
      { wch: 15 }, // Principal Amount
      { wch: 15 }, // Interest Amount
      { wch: 15 }, // Total Repayable
      { wch: 15 }, // Disbursement Date
      { wch: 10 }, // DPD
      { wch: 10 }, // Bucket
      { wch: 15 }, // Next Installment Date
      { wch: 15 }, // Next Installment Amount
      { wch: 15 }, // Last Payment Date
      { wch: 15 }, // Last Payment Amount
      { wch: 20 }, // Assigned Collector
      { wch: 15 }, // Branch
      { wch: 10 }  // Status
    ];

    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Overdue Report');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=overdue-report-${new Date().toISOString().split('T')[0]}.xlsx`);

    // Send file
    res.send(excelBuffer);
  } else {
    // Return JSON data
    res.json({
      success: true,
      data: report
    });
  }
});
