import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  Users, FileText, DollarSign, Plus, CreditCard, AlertCircle, 
  TrendingUp, Shield, Target, Activity, Bell, Filter,
  BarChart3, PieChart, MapPin, Clock, Download, RefreshCw
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ period: '30d', region: 'all' });

  const { data: stats, isLoading, refetch } = useQuery(
    ['dashboard-stats', filters], 
    () => dashboardService.getDashboardStats(filters),
    { refetchInterval: 30000 }
  );

  const { data: activities } = useQuery(
    ['recent-activities'], 
    dashboardService.getRecentActivities
  );

  const { data: trends } = useQuery(
    ['collection-trends'], 
    dashboardService.getCollectionTrends
  );

  const { data: portfolio } = useQuery(
    ['loan-portfolio'], 
    dashboardService.getLoanPortfolio
  );

  const { data: riskData } = useQuery(
    ['risk-analytics'], 
    dashboardService.getRiskAnalytics
  );

  useEffect(() => {
    if (stats?.criticalAlerts) {
      setAlerts(stats.criticalAlerts);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <>
      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
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
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Portfolio Health" value={`${stats?.portfolioHealthScore}%`} icon={Shield} color="green" trend="+2.3%" />
        <KPICard title="Collection Efficiency" value={`${stats?.collectionEfficiency}%`} icon={Target} color="blue" trend="+1.8%" />
        <KPICard title="NPA Ratio" value={`${stats?.npaRatio}%`} icon={AlertCircle} color="red" trend="-0.5%" />
        <KPICard title="Avg Ticket Size" value={`₹${stats?.averageTicketSize?.toLocaleString()}`} icon={DollarSign} color="purple" trend="+5.2%" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Customers" value={stats?.totalCustomers} icon={Users} color="blue" onClick={() => navigate('/customers')} />
        <StatCard title="Active Loans" value={stats?.activeLoans} icon={FileText} color="green" onClick={() => navigate('/loans')} />
        <StatCard title="Total Disbursed" value={`₹${stats?.totalDisbursed?.toLocaleString()}`} icon={DollarSign} color="purple" />
        <StatCard title="Pending Approvals" value={stats?.pendingApprovals} icon={Clock} color="orange" onClick={() => navigate('/loans')} />
        <StatCard title="Monthly Collections" value={`₹${stats?.monthlyCollections?.toLocaleString()}`} icon={CreditCard} color="green" onClick={() => navigate('/collections')} />
        <StatCard title="Overdue Loans" value={stats?.overdueLoans} icon={AlertCircle} color="red" onClick={() => navigate('/collections')} />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BucketDistributionChart data={stats?.bucketDistribution} />
        <DPDAnalysisChart data={stats?.dpdAnalysis} />
        <CollectionTrendsChart data={trends} />
        <CreditScoreDistribution data={stats?.creditScoreDistribution} />
      </div>
    </>
  );

  const renderRiskTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>High Risk Loans</span>
                <span className="font-bold text-red-600">{riskData?.defaultPrediction?.filter(p => p.riskLevel === 'High').length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Medium Risk Loans</span>
                <span className="font-bold text-orange-600">{riskData?.defaultPrediction?.filter(p => p.riskLevel === 'Medium').length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery Rate</span>
                <span className="font-bold text-green-600">{riskData?.recoveryRates}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Early Warning System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {riskData?.earlyWarningSystem?.map((warning, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-yellow-50 rounded border">
                  <div>
                    <p className="font-medium">{warning.customerName}</p>
                    <p className="text-sm text-gray-600">Loan ID: {warning.loanId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">DPD: {warning.dpd}</p>
                    <p className="text-sm">Risk: {warning.riskScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOperationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="KYC Completion" value={`${stats?.kycCompletionRate?.toFixed(1)}%`} icon={Users} color="blue" />
        <KPICard title="Avg Processing Time" value={`${stats?.avgProcessingTime} days`} icon={Clock} color="orange" />
        <KPICard title="Interest Income" value={`₹${stats?.interestIncome?.toLocaleString()}`} icon={TrendingUp} color="green" />
        <KPICard title="Outstanding Principal" value={`₹${stats?.outstandingPrincipal?.toLocaleString()}`} icon={DollarSign} color="purple" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeographicDistribution data={portfolio?.geographicDistribution} />
        <TenureAnalysis data={portfolio?.tenureAnalysis} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-['Segoe_UI']">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Enhanced Dashboard</h1>
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

      {/* Tab Navigation */}
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

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'risk' && renderRiskTab()}
      {activeTab === 'operations' && renderOperationsTab()}

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={activities} />
        <QuickActions navigate={navigate} />
      </div>
    </div>
  );
};

// Component definitions
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
      <CardTitle className="flex items-center gap-2">
        <PieChart className="h-5 w-5" />
        Bucket Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data?.map((bucket, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm font-medium">{bucket.bucket}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{bucket.count}</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(bucket.count/100)*100}%`}}></div>
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

const CollectionTrendsChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Collection Trends
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-48 flex items-end justify-between gap-2">
        {data?.slice(-6).map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="bg-blue-500 w-8 rounded-t" style={{height: `${(item.amount/Math.max(...data.map(d => d.amount)))*150}px`}}></div>
            <span className="text-xs mt-1">{item.month?.slice(-2)}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const CreditScoreDistribution = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Credit Score Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data && Object.entries(data).map(([range, count]) => (
          <div key={range} className="flex justify-between items-center">
            <span className="text-sm font-medium">{range}</span>
            <span className="text-lg font-bold">{count}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const GeographicDistribution = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Geographic Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {data?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm">{item.state}</span>
            <span className="font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const TenureAnalysis = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Tenure Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data && Object.entries(data).map(([range, count]) => (
          <div key={range} className="flex justify-between items-center">
            <span className="text-sm font-medium">{range} months</span>
            <span className="text-lg font-bold">{count}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentActivities = ({ activities }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Recent Activities
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {activities?.map((activity, idx) => (
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
          { label: 'Record Payment', desc: 'Record loan payment', icon: CreditCard, color: 'purple', path: '/collections' },
          { label: 'Generate Report', desc: 'Export analytics data', icon: Download, color: 'orange', action: () => window.print() }
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={() => action.path ? navigate(action.path) : action.action()}
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

export default Dashboard;
