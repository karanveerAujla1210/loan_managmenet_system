const dashboardService = require('./dashboard.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class DashboardController {
  async getStats(req, res) {
    try {
      const stats = await dashboardService.getStats();
      return successResponse(res, stats, 'Dashboard stats retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getCollectionPerformance(req, res) {
    try {
      const performance = await dashboardService.getCollectionPerformance();
      return successResponse(res, performance, 'Collection performance retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new DashboardController();