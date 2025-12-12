const Dashboard = require('../models/Dashboard');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Dashboard.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Dashboard.getRecentActivities();
    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get collection trends
exports.getCollectionTrends = async (req, res) => {
  try {
    const trends = await Dashboard.getCollectionTrends();
    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get loan portfolio data
exports.getLoanPortfolio = async (req, res) => {
  try {
    const portfolio = await Dashboard.getLoanPortfolio();
    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
