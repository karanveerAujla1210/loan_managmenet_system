import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  Users, FileText, DollarSign, Plus, CreditCard, AlertCircle, 
  TrendingUp, Shield, Target, Activity, RefreshCw, BarChart3
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

const DashboardOptimized = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({ period: '30d', region: 'all' });

  // Optimized data loading
  const {
    stats,
    activities,
    trends,
    portfolio,
    riskData,
    isLoading,
    isLoadingActivities,
    error,
    refetch,
    isSuccess
  } = useDashboard(filters, {
    enableRealtime: activeTab === 'overview',
    loadRiskData: activeTab === 'risk',
    loadPortfolio: activeTab === 'operations'
  });

  // Memoized calculations
  const kpiData = useMemo(() => {
    if (!stats) return [];
    return [
      { title: 'Portfolio Health', value: `${stats.portfolioHealthScore}%`, icon: Shield, color: 'green', trend: '+2.3%' },
      { title: 'Collection Efficiency', value: `${stats.collectionEfficiency}%`, icon: Target, color: 'blue', trend: '+1.8%' },
      { title: 'NPA Ratio', value: `${stats.npaRatio}%`, icon: AlertCircle, color: 'red', trend: '-0.5%' },
      { title: 'Avg Ticket Size', value: `₹${stats.averageTicketSize?.toLocaleString()}`, icon: DollarSign, color: 'purple', trend: '+5.2%' }
    ];
  }, [stats]);

  const mainStats = useMemo(() => {
    if (!stats) return [];
    return [
      { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'blue', path: '/customers' },
      { title: 'Active Loans', value: stats.activeLoans, icon: FileText, color: 'green', path: '/loans' },
      { title: 'Total Disbursed', value: `₹${stats.totalDisbursed?.toLocaleString()}`, icon: DollarSign, color: 'purple' },
      { title: 'Pending Approvals', value: stats.pendingApprovals, icon: AlertCircle, color: 'orange', path: '/loans' },
      { title: 'Monthly Collections', value: `₹${stats.monthlyCollections?.toLocaleString()}`, icon: CreditCard, color: 'green', path: '/collections' },
      { title: 'Overdue Loans', value: stats.overdueLoans, icon: AlertCircle, color: 'red', path: '/collections' }
    ];
  }, [stats]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 font-['Segoe_UI']">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select 
            value={filters.period} 
            onChange={(e) => setFilters({...filters, period: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button onClick={refetch} className="p-2 border rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => navigate('/customers')} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Customer
          </button>
        </div>
      </div>

      {/* Critical Alerts */}
      {stats?.criticalAlerts?.length > 0 && (
        <CriticalAlerts alerts={stats.criticalAlerts} />
      )}

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          kpiData={kpiData}
          mainStats={mainStats}
          stats={stats}
          trends={trends}
          activities={activities}
          isLoadingActivities={isLoadingActivities}
          navigate={navigate}
        />
      )}

      {activeTab === 'risk' && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Risk analytics dashboard coming soon...</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'operations' && (
        <Card>
          <CardHeader>
            <CardTitle>Operations Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Operations dashboard coming soon...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Optimized components
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <AlertCircle className="h-12 w-12 text-red-500" />
    <p className="text-lg font-medium text-gray-900">Failed to load dashboard</p>
    <p className="text-sm text-gray-500">{error?.message}</p>
    <button onClick={onRetry} className="btn-primary">
      Try Again
    </button>
  </div>
);

const CriticalAlerts = ({ alerts }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <h3 className="font-semibold text-red-800">Critical Alerts</h3>
    </div>
    <div className="space-y-2">
      {alerts.map((alert, idx) => (
        <div key={idx} className="flex justify-between items-center">
          <span className="text-red-700">{alert.message}</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">{alert.count}</span>
        </div>
      ))}
    </div>
  </div>
);

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8">
      {[
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'risk', label: 'Risk Analytics', icon: Shield },
        { id: 'operations', label: 'Operations', icon: Activity }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

const OverviewTab = ({ kpiData, mainStats, stats, trends, activities, isLoadingActivities, navigate }) => (
  <>
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, idx) => (
        <KPICard key={idx} {...kpi} />
      ))}
    </div>

    {/* Main Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {mainStats.map((stat, idx) => (
        <StatCard key={idx} {...stat} onClick={stat.path ? () => navigate(stat.path) : undefined} />
      ))}
    </div>

    {/* Charts and Activities */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BucketDistributionChart data={stats?.bucketDistribution} />
      <DPDAnalysisChart data={stats?.dpdAnalysis} />
      <RecentActivities activities={activities} isLoading={isLoadingActivities} />
      <QuickActions navigate={navigate} />
    </div>
  </>
);

// Optimized card components
const KPICard = ({ title, value, icon: Icon, color, trend }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</p>}
        </div>
        <Icon className={`h-8 w-8 text-${color}-600`} />
      </div>
    </CardContent>
  </Card>
);

const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
  <Card className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className={`h-5 w-5 text-${color}-600`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900">{value?.toLocaleString() || 0}</div>
    </CardContent>
  </Card>
);

const BucketDistributionChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Bucket Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data?.map((bucket, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm font-medium">{bucket.bucket}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{bucket.count}</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min((bucket.count/100)*100, 100)}%`}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DPDAnalysisChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>DPD Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data && Object.entries(data).map(([range, count]) => (
          <div key={range} className="flex justify-between items-center">
            <span className="text-sm font-medium">{range} days</span>
            <span className="text-lg font-bold">{count}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentActivities = ({ activities, isLoading }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Recent Activities
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {activities?.slice(0, 10).map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">
                  {activity.customer && `${activity.customer} - `}
                  {activity.amount && `₹${activity.amount.toLocaleString()}`}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(activity.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const QuickActions = ({ navigate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { label: 'Create New Customer', desc: 'Add customer to system', icon: Users, color: 'blue', path: '/customers' },
          { label: 'Apply for Loan', desc: 'Create loan application', icon: FileText, color: 'green', path: '/loans' },
          { label: 'Record Payment', desc: 'Record loan payment', icon: CreditCard, color: 'purple', path: '/collections' }
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className={`w-full text-left px-4 py-3 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors border border-${action.color}-200`}
          >
            <div className="flex items-center gap-3">
              <action.icon className={`h-5 w-5 text-${action.color}-600`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default DashboardOptimized;
