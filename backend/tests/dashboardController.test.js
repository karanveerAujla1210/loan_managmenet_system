// Mock models (must be defined before requiring controller)
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
const dashboard = require('../controllers/dashboardController');

describe('dashboardController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('metrics returns expected fields', async () => {
    Customer.countDocuments.mockResolvedValue(42);
    Loan.countDocuments.mockResolvedValue(10);

    Payment.aggregate.mockResolvedValue([{ total: 200 }]);

    Loan.aggregate.mockResolvedValue([{ totalDisbursed: 50000 }]);

    const req = {};
    const res = { json: jest.fn(), status: jest.fn(() => res) };
    const next = jest.fn();

    await dashboard.metrics(req, res, next);

    if (!res.json.mock.calls.length) {
      // show captured error from next
      const err = next.mock.calls[0] && next.mock.calls[0][0];
      throw new Error('Controller did not call res.json. Next was called with: ' + (err && err.message ? err.message : JSON.stringify(err)));
    }
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
    const res = { json: jest.fn(), status: jest.fn(() => res) };
    const next = jest.fn();

    await dashboard.loanPerformance(req, res, next);

    if (!res.json.mock.calls.length) {
      const err = next.mock.calls[0] && next.mock.calls[0][0];
      throw new Error('Controller did not call res.json. Next was called with: ' + (err && err.message ? err.message : JSON.stringify(err)));
    }
    const payload = res.json.mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data).toHaveProperty('disbursals');
    expect(payload.data).toHaveProperty('collections');
  });
});
