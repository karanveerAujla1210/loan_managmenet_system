const dashboard = require('../controllers/dashboardController');

// Mock models
jest.mock('../models/Customer', () => ({
  countDocuments: jest.fn(),
  find: jest.fn()
}));
jest.mock('../models/Loan', () => ({
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  find: jest.fn()
}));
jest.mock('../models/Payment', () => ({
  aggregate: jest.fn(),
  find: jest.fn()
}));

const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

describe('dashboardController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('metrics returns expected fields', async () => {
    Customer.countDocuments.mockResolvedValue(42);
    Loan.countDocuments.mockResolvedValueOnce(100) // active
      .mockResolvedValueOnce(5) // overdue
      .mockResolvedValueOnce(3); // defaulted

    Payment.aggregate.mockResolvedValueOnce([{ total: 200 }]) // today
      .mockResolvedValueOnce([{ total: 1500 }]); // month

    Loan.aggregate.mockResolvedValueOnce([{ totalDisbursed: 50000 }]);
    Customer.countDocuments.mockResolvedValue(42);

    const req = {};
    const res = { json: jest.fn() };

    await dashboard.metrics(req, res, () => {});

    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data).toHaveProperty('totalCustomers');
    expect(payload.data).toHaveProperty('totalActiveLoans');
    expect(payload.data).toHaveProperty('totalCollectionsToday');
  });

  test('loanPerformance returns disbursals and collections arrays', async () => {
    Loan.aggregate.mockResolvedValue([{ _id: '2025-01', totalDisbursed: 1000 }]);
    Payment.aggregate.mockResolvedValue([{ _id: '2025-01', totalCollected: 900 }]);

    const req = {};
    const res = { json: jest.fn() };

    await dashboard.loanPerformance(req, res, () => {});

    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data).toHaveProperty('disbursals');
    expect(payload.data).toHaveProperty('collections');
  });
});
