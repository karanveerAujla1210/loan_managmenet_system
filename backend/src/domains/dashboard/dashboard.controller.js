const kpiService = require('../../services/dashboardKpiService');

const getKPIs = async (req, res) => {
  try {
    const [
      portfolioHealth,
      expectedInflow,
      stressExposure,
      liquidityGap,
      collectionEfficiency,
      rollRate,
      cureRate,
      riskSignals,
      recoveryMomentum,
      priorityActions,
      cashFlowTrends
    ] = await Promise.all([
      kpiService.calculatePortfolioHealthIndex(),
      kpiService.calculateExpectedCashInflow(7),
      kpiService.calculateStressExposure(),
      kpiService.calculateLiquidityGap(),
      kpiService.calculateCollectionEfficiency(),
      kpiService.calculateRollRate(),
      kpiService.calculateCureRate(),
      kpiService.calculateEarlyRiskSignals(),
      kpiService.getRecoveryMomentum(),
      kpiService.getTodaysPriorityActions(),
      kpiService.getCashFlowTrends(6)
    ]);

    res.json({
      success: true,
      data: {
        kpis: {
          portfolioHealth: {
            value: portfolioHealth,
            label: 'Portfolio Health',
            status: portfolioHealth >= 0.8 ? 'Good' : portfolioHealth >= 0.6 ? 'Stable' : 'At Risk'
          },
          expectedInflow: {
            value: expectedInflow,
            label: 'Expected Inflow (7 days)',
            formatted: `₹${(expectedInflow / 10000000).toFixed(2)}Cr`
          },
          stressExposure: {
            value: stressExposure,
            label: 'Loans at Risk',
            formatted: `₹${(stressExposure / 10000000).toFixed(2)}Cr`
          },
          liquidityGap: {
            value: liquidityGap,
            label: 'Expected Shortfall',
            formatted: `₹${(liquidityGap / 100000).toFixed(0)}L`
          }
        },
        insights: {
          collectionEfficiency,
          rollRate,
          cureRate,
          riskSignals
        },
        recovery: recoveryMomentum,
        priorityActions,
        trends: cashFlowTrends,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('KPI calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate KPIs'
    });
  }
};

module.exports = { getKPIs };
