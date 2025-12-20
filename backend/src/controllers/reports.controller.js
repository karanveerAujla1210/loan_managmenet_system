const {
  getPortfolioSnapshot,
  getBucketExposure,
  getCollectionEfficiency,
  getLegalExposure,
  getCollectorPerformance,
  getAgingAnalysis
} = require('../services/reports.service');

const getPortfolio = async (req, res) => {
  try {
    const data = await getPortfolioSnapshot();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Portfolio snapshot error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBuckets = async (req, res) => {
  try {
    const data = await getBucketExposure();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Bucket exposure error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEfficiency = async (req, res) => {
  try {
    const data = await getCollectionEfficiency();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Collection efficiency error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLegal = async (req, res) => {
  try {
    const data = await getLegalExposure();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Legal exposure error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCollectors = async (req, res) => {
  try {
    const data = await getCollectorPerformance();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Collector performance error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAging = async (req, res) => {
  try {
    const data = await getAgingAnalysis();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Aging analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPortfolio,
  getBuckets,
  getEfficiency,
  getLegal,
  getCollectors,
  getAging
};
