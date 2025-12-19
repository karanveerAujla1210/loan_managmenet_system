const STATE_TRANSITIONS = {
  'LEAD': ['APPLICATION_SUBMITTED'],
  'APPLICATION_SUBMITTED': ['CREDIT_REVIEW', 'REJECTED'],
  'CREDIT_REVIEW': ['APPROVED', 'REJECTED'],
  'APPROVED': ['DISBURSED', 'REJECTED'],
  'DISBURSED': ['ACTIVE'],
  'ACTIVE': ['DELINQUENT', 'CLOSED'],
  'DELINQUENT': ['LEGAL', 'ACTIVE', 'CLOSED'],
  'LEGAL': ['CLOSED', 'SETTLED'],
  'CLOSED': []
};

const getAllowedActions = (currentState) => {
  return STATE_TRANSITIONS[currentState] || [];
};

const isValidTransition = (fromState, toState) => {
  return STATE_TRANSITIONS[fromState]?.includes(toState) || false;
};

const getPreconditions = (state, action) => {
  const checks = {
    'APPROVE': [
      {
        check: (loan) => loan.principal > 0,
        message: 'Principal must be greater than 0'
      },
      {
        check: (loan) => loan.annualInterestRate >= 0,
        message: 'Interest rate must be non-negative'
      }
    ],
    'DISBURSE': [
      {
        check: (loan) => loan.state === 'APPROVED',
        message: 'Loan must be approved before disbursement'
      }
    ],
    'CLOSE': [
      {
        check: (loan) => loan.outstandingAmount <= 0,
        message: 'Cannot close loan with outstanding amount'
      }
    ]
  };
  return checks[action] || [];
};

module.exports = {
  STATE_TRANSITIONS,
  getAllowedActions,
  isValidTransition,
  getPreconditions
};
