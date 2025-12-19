const Loan = require('../../models/loan.model');
const AuditLog = require('../../models/audit-log.model');
const { getAllowedActions, isValidTransition } = require('../../utils/stateTransitions');
const { getError } = require('../../utils/errorCodes');

const transitionLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, metadata = {} } = req.body;

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: getError('LOAN_NOT_FOUND')
      });
    }

    const newState = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
    if (!isValidTransition(loan.state, newState)) {
      return res.status(409).json({
        success: false,
        error: getError('LOAN_STATE_INVALID', { currentState: loan.state })
      });
    }

    const oldState = loan.state;
    loan.state = newState;
    loan.stateHistory = loan.stateHistory || [];
    loan.stateHistory.push({
      state: newState,
      changedAt: new Date(),
      changedBy: req.user?.id,
      reason: metadata.reason
    });

    await loan.save();

    await AuditLog.create({
      userId: req.user?.id,
      entityType: 'LOAN',
      entityId: loan._id,
      action: action,
      before: { state: oldState },
      after: { state: newState },
      timestamp: new Date()
    });

    res.json({
      success: true,
      data: {
        state: newState,
        allowedActions: getAllowedActions(newState)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

const getLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id).populate('customerId');
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: getError('LOAN_NOT_FOUND')
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

const getAllowedActionsForLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: getError('LOAN_NOT_FOUND')
      });
    }

    res.json({
      success: true,
      data: {
        state: loan.state,
        allowedActions: getAllowedActions(loan.state)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

module.exports = {
  transitionLoan,
  getLoan,
  getAllowedActionsForLoan
};
