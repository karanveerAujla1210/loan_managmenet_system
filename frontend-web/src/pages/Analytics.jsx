import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Scale, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import analyticsService from '../services/analyticsService';
import KPIWidget from '../components/analytics/KPIWidget';
import BucketChart from '../components/analytics/BucketChart';
import CashflowChart from '../components/analytics/CashflowChart';
import AgentPerformanceChart from '../components/analytics/AgentPerformanceChart';
import FilterPanel from '../components/analytics/FilterPanel';
import PageHeader from '../components/PageHeader';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({
    overview: {},
    buckets: [],
    cashflow: [],
    agentPerformance: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [overview, buckets, cashflow, agentPerformance] = await Promise.all([
        analyticsService.getOverview(filters),
        analyticsService.getBuckets(filters),
        analyticsService.getCashflowForecast(filters),
        analyticsService.getAgentPerformance(filters)
      ]);

      setData({
        overview: overview.data,
        buckets: buckets.data,
        cashflow: cashflow.data,
        agentPerformance: agentPerformance.data
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { overview } = data;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics Dashboard" 
        subtitle="Portfolio performance and insights"
      />

      <FilterPanel 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIWidget
          title="Total Disbursed"
          value={overview.totalDisbursed || 0}
          format="currency"
          icon={DollarSign}
          color="blue"
        />
        <KPIWidget
          title="Live Loans"
          value={overview.liveLoanCount || 0}
          icon={Users}
          color="green"
        />
        <KPIWidget
          title="Outstanding Amount"
          value={overview.outstandingPrincipal || 0}
          format="currency"
          icon={TrendingUp}
          color="purple"
        />
        <KPIWidget
          title="PAR 30"
          value={overview.par30 || 0}
          format="currency"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIWidget
          title="Legal Cases"
          value={overview.legalCount || 0}
          icon={Scale}
          color="yellow"
        />
        <KPIWidget
          title="Closed Loans"
          value={overview.closedCount || 0}
          icon={CheckCircle}
          color="green"
        />
        <KPIWidget
          title="Write-offs"
          value={overview.writeoffCount || 0}
          icon={XCircle}
          color="red"
        />
        <KPIWidget
          title="Today's Due"
          value={overview.todaysDueCount || 0}
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BucketChart data={data.buckets} />
        <CashflowChart data={data.cashflow} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AgentPerformanceChart data={data.agentPerformance} />
      </div>

      {/* PAR Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Portfolio at Risk (PAR) Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'PAR 0', value: overview.par0, color: 'bg-green-100 text-green-800' },
            { label: 'PAR 1-7', value: overview.par7, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'PAR 8-14', value: overview.par14, color: 'bg-orange-100 text-orange-800' },
            { label: 'PAR 15-30', value: overview.par30, color: 'bg-red-100 text-red-800' },
            { label: 'PAR 31-60', value: overview.par60, color: 'bg-purple-100 text-purple-800' },
            { label: 'PAR 60+', value: overview.par90, color: 'bg-gray-100 text-gray-800' }
          ].map((par, index) => (
            <div key={index} className={`p-4 rounded-lg ${par.color}`}>
              <p className="text-sm font-medium">{par.label}</p>
              <p className="text-xl font-bold">
                ₹{new Intl.NumberFormat('en-IN').format(par.value || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;