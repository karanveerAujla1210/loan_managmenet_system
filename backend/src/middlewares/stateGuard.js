const { isValidTransition, getPreconditions } = require('../utils/stateTransitions');

const stateGuardMiddleware = async (req, res, next) => {
  // Only check for transition endpoints
  if (!req.body.action) return next();

  try {
    const { id } = req.params;
    const { action } = req.body;

    // Get loan
    const Loan = require('../models/loan.model');
    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: { code: 'LOAN_NOT_FOUND', message: 'Loan not found' }
      });
    }

    // Check if transition valid
    const newState = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
    if (!isValidTransition(loan.state, newState)) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'LOAN_STATE_INVALID',
          message: `Action ${action} not allowed in state ${loan.state}`,
          details: { currentState: loan.state }
        }
      });
    }

    // Check preconditions
    const preconditions = getPreconditions(loan.state, action);
    for (const check of preconditions) {
      if (!check.check(loan)) {
        return res.status(409).json({
          success: false,
          error: { code: 'PRECONDITION_FAILED', message: check.message }
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'STATE_GUARD_ERROR', message: error.message }
    });
  }
};

module.exports = stateGuardMiddleware;
