import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Phone, MapPin, Clock } from 'lucide-react';
import dashboardService from '../../services/dashboard';
import './fintechDashboard.css';

const KPICard = ({ icon: Icon, value, label, status, color }) => (
  <div className={`kpi-card kpi-${color}`}>
    <div className="kpi-header">
      <Icon className="kpi-icon" />
      <span className="kpi-status">{status}</span>
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
  </div>
);

const InsightStrip = ({ data }) => (
  <div className="insight-strip">
    <h3 className="insight-title">Portfolio Intelligence</h3>
    <div className="insight-grid">
      <div className="insight-item">
        <span className="insight-label">Collection Efficiency</span>
        <span className="insight-value">{data.collectionEfficiency}%</span>
      </div>
      <div className="insight-item">
        <span className="insight-label">Roll Rate (DPD movement)</span>
        <span className="insight-value">{data.rollRate}%</span>
      </div>
      <div className="insight-item">
        <span className="insight-label">Cure Rate</span>
        <span className="insight-value">{data.cureRate}%</span>
      </div>
      <div className="insight-item">
        <span className="insight-label">Early Risk Signals</span>
        <span className="insight-value">{data.riskSignals}</span>
      </div>
    </div>
  </div>
);

const CashFlowChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.inflow));
  const scale = 100 / maxValue;

  return (
    <div className="chart-container">
      <h3 className="chart-title">Cash Flow & Risk Trends</h3>
      <div className="chart-tabs">
        <button className="tab active">Cash Flow</button>
        <button className="tab">DPD Migration</button>
        <button className="tab">Vintage Analysis</button>
      </div>
      <div className="chart-area">
        {data.map((point, idx) => (
          <div key={idx} className="chart-bar-wrapper">
            <div 
              className="chart-bar"
              style={{ height: `${point.inflow * scale}%` }}
              title={`₹${(point.inflow / 10000000).toFixed(2)}Cr`}
            />
            <span className="chart-label">{point.month}</span>
          </div>
        ))}
      </div>
      <p className="chart-meta">Aggregated portfolio movement over time</p>
    </div>
  );
};

const OperationalPanel = ({ recovery, actions }) => (
  <div className="operational-panel">
    <h3 className="panel-title">Operational Signals</h3>
    
    <div className="recovery-card">
      <div className="recovery-header">
        <span>Recovery Momentum</span>
        {recovery.trend === 'up' ? (
          <TrendingUp className="trend-icon up" />
        ) : recovery.trend === 'down' ? (
          <TrendingDown className="trend-icon down" />
        ) : (
          <div className="trend-icon neutral">—</div>
        )}
      </div>
      <div className="recovery-status">{recovery.status}</div>
    </div>

    <div className="actions-section">
      <h4 className="actions-title">Today's Priority Actions</h4>
      <div className="actions-list">
        {actions.map((action, idx) => {
          const IconMap = {
            phone: Phone,
            'map-pin': MapPin,
            'alert-circle': AlertCircle
          };
          const ActionIcon = IconMap[action.icon];
          
          return (
            <div key={idx} className="action-item">
              <ActionIcon className="action-icon" />
              <div className="action-content">
                <span className="action-count">{action.count}</span>
                <span className="action-label">{action.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const FintechDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getKPIs();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!data) {
    return <div className="dashboard-error">No data available</div>;
  }

  const { kpis, insights, recovery, priorityActions, trends } = data;

  return (
    <div className="fintech-dashboard">
      <div className="dashboard-header">
        <h1>LoanOps Control</h1>
        <p className="header-subtitle">Loan Management System</p>
      </div>

      <div className="kpi-section">
        <KPICard
          icon={AlertCircle}
          value={kpis.portfolioHealth.value}
          label={kpis.portfolioHealth.label}
          status={kpis.portfolioHealth.status}
          color="green"
        />
        <KPICard
          icon={TrendingUp}
          value={kpis.expectedInflow.formatted}
          label={kpis.expectedInflow.label}
          status="Inflow"
          color="blue"
        />
        <KPICard
          icon={AlertCircle}
          value={kpis.stressExposure.formatted}
          label={kpis.stressExposure.label}
          status="Risk"
          color="amber"
        />
        <KPICard
          icon={Clock}
          value={kpis.liquidityGap.formatted}
          label={kpis.liquidityGap.label}
          status="Gap"
          color="grey"
        />
      </div>

      <InsightStrip data={insights} />

      <div className="analytics-section">
        <div className="analytics-left">
          <CashFlowChart data={trends} />
        </div>
        <div className="analytics-right">
          <OperationalPanel recovery={recovery} actions={priorityActions} />
        </div>
      </div>
    </div>
  );
};

export default FintechDashboard;
