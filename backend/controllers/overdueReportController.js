
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const Schedule = require('../models/Schedule');
const Payment = require('../models/Payment');
const Collections = require('../models/Collections');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/overdue-reports/summary
exports.getOverdueSummary = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get overdue loans by bucket
  const overdueByBucket = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    { $group: { _id: '$bucket', count: { $sum: 1 }, totalAmount: { $sum: '$totalRepayable' } } },
    { $sort: { _id: 1 } }
  ]);

  // Get overdue loans by age (days past due ranges)
  const overdueByAge = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ['$dpd', 7] }, then: '1-7 days' },
              { case: { $lte: ['$dpd', 15] }, then: '8-15 days' },
              { case: { $lte: ['$dpd', 30] }, then: '16-30 days' },
              { case: { $lte: ['$dpd', 60] }, then: '31-60 days' },
              { case: { $lte: ['$dpd', 90] }, then: '61-90 days' },
              { case: { $lte: ['$dpd', 120] }, then: '91-120 days' }
            ],
            default: '120+ days'
          }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalRepayable' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get total overdue amount and count
  const totalOverdue = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: '$totalRepayable' } } }
  ]);

  // Get overdue trends for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const overdueTrend = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 }, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalRepayable' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get recovery rate
  const [totalDisbursed, totalCollected] = await Promise.all([
    Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$netDisbursement' } } }
    ]),
    Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  const recoveryRate = totalDisbursed[0] && totalCollected[0] 
    ? ((totalCollected[0].total / totalDisbursed[0].total) * 100).toFixed(2)
    : 0;

  res.json({
    success: true,
    data: {
      overdueByBucket,
      overdueByAge,
      totalOverdue: totalOverdue[0] || { count: 0, totalAmount: 0 },
      overdueTrend,
      recoveryRate: parseFloat(recoveryRate),
      generatedAt: new Date()
    }
  });
});

// GET /api/overdue-reports/detailed
exports.getDetailedOverdueReport = asyncHandler(async (req, res) => {
  const { bucket, page = 1, limit = 20, sortBy = 'dpd', sortOrder = 'desc' } = req.query;

  const skip = (page - 1) * limit;

  // Build filter
  const filter = { dpd: { $gt: 0 } };
  if (bucket && bucket !== 'all') {
    filter.bucket = bucket;
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get loans with customer details
  const loans = await Loan.find(filter)
    .populate('customerId', 'firstName lastName phone email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Loan.countDocuments(filter);

  // Get next installment details for each loan
  const loansWithSchedule = await Promise.all(loans.map(async (loan) => {
    const nextInstallment = await Schedule.findOne({
      loanId: loan._id,
      status: { $ne: 'paid' }
    }).sort({ installmentNumber: 1 });

    // Get last payment
    const lastPayment = await Payment.findOne({
      loanId: loan._id,
      status: 'success'
    }).sort({ paymentDate: -1 });

    return {
      ...loan.toObject(),
      nextInstallment,
      lastPayment
    };
  }));

  res.json({
    success: true,
    data: {
      loans: loansWithSchedule,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// GET /api/overdue-reports/aging
exports.getOverdueAgingReport = asyncHandler(async (req, res) => {
  const { branch } = req.query;

  // Build filter
  const filter = { dpd: { $gt: 0 } };
  if (branch) {
    filter.branch = branch;
  }

  // Get aging report by branch
  const agingByBranch = await Loan.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$branch',
        '1-7': {
          $sum: {
            $cond: [{ $lte: ['$dpd', 7] }, '$totalRepayable', 0]
          }
        },
        '8-15': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 7] }, { $lte: ['$dpd', 15] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '16-30': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 15] }, { $lte: ['$dpd', 30] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '31-60': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 30] }, { $lte: ['$dpd', 60] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '61-90': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 60] }, { $lte: ['$dpd', 90] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '90+': {
          $sum: {
            $cond: [{ $gt: ['$dpd', 90] }, '$totalRepayable', 0]
          }
        },
        total: { $sum: '$totalRepayable' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get aging report overall
  const agingOverall = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    {
      $group: {
        _id: null,
        '1-7': {
          $sum: {
            $cond: [{ $lte: ['$dpd', 7] }, '$totalRepayable', 0]
          }
        },
        '8-15': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 7] }, { $lte: ['$dpd', 15] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '16-30': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 15] }, { $lte: ['$dpd', 30] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '31-60': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 30] }, { $lte: ['$dpd', 60] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '61-90': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 60] }, { $lte: ['$dpd', 90] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '90+': {
          $sum: {
            $cond: [{ $gt: ['$dpd', 90] }, '$totalRepayable', 0]
          }
        },
        total: { $sum: '$totalRepayable' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      agingByBranch,
      agingOverall: agingOverall[0] || {},
      generatedAt: new Date()
    }
  });
});

// GET /api/overdue-reports/export
exports.exportOverdueReport = asyncHandler(async (req, res) => {
  const { bucket, branch, format = 'excel' } = req.query;

  // Build filter
  const filter = { dpd: { $gt: 0 } };
  if (bucket && bucket !== 'all') {
    filter.bucket = bucket;
  }
  if (branch && branch !== 'all') {
    filter.branch = branch;
  }

  // Get loans with customer details
  const loans = await Loan.find(filter)
    .populate('customerId', 'firstName lastName phone email')
    .sort({ dpd: -1 });

  // Get next installment details for each loan
  const loansWithSchedule = await Promise.all(loans.map(async (loan) => {
    const nextInstallment = await Schedule.findOne({
      loanId: loan._id,
      status: { $ne: 'paid' }
    }).sort({ installmentNumber: 1 });

    // Get last payment
    const lastPayment = await Payment.findOne({
      loanId: loan._id,
      status: 'success'
    }).sort({ paymentDate: -1 });

    return {
      ...loan.toObject(),
      nextInstallment,
      lastPayment
    };
  }));

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
    loansWithSchedule.forEach(loan => {
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
      data: {
        loans: loansWithSchedule,
        generatedAt: new Date()
      }
    });
  }
});
