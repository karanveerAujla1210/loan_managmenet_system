const loanService = require('../loans/loans.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class EventsController {
  // Get events for a loan
  async getLoanEvents(req, res) {
    try {
      const { loanId } = req.params;
      const loan = await loanService.getLoanById(loanId);
      return successResponse(res, loan.events, 'Events retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  // Get all events across loans
  async getAllEvents(req, res) {
    try {
      const { type, startDate, endDate } = req.query;
      const filters = {};
      
      if (startDate && endDate) {
        filters.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const loans = await loanService.getAllLoans(filters);
      let allEvents = [];

      loans.forEach(loan => {
        const loanEvents = loan.events.map(event => ({
          ...event.toObject(),
          loanId: loan.loanId,
          customerId: loan.customerId
        }));
        allEvents = allEvents.concat(loanEvents);
      });

      if (type) {
        allEvents = allEvents.filter(event => event.type === type);
      }

      allEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return successResponse(res, allEvents, 'All events retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new EventsController();