import React from 'react'
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Card } from '../components/ui/Card'
import { Kpi } from '../components/ui/Kpi'
import { TrendingUp, Users, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { getDashboardKPIs, mockLoans } from '../services/mockData'

const chartData = [
  { month: 'Jan', disbursed: 45, collected: 28 },
  { month: 'Feb', disbursed: 52, collected: 35 },
  { month: 'Mar', disbursed: 48, collected: 32 },
  { month: 'Apr', disbursed: 61, collected: 42 },
  { month: 'May', disbursed: 55, collected: 38 },
  { month: 'Jun', disbursed: 67, collected: 48 }
]

const dpdData = [
  { name: 'Current', value: 18, color: '#22C55E' },
  { name: '1-30 DPD', value: 8, color: '#F59E0B' },
  { name: '31-60 DPD', value: 4, color: '#EF5350' },
  { name: '60+ DPD', value: 2, color: '#D32F2F' }
]

const recentLoans = mockLoans.slice(0, 5).map(loan => ({
  ...loan,
  customerName: `Customer-${loan.customerId.slice(-3)}`
}))

export const Dashboard: React.FC = () => {
  const kpis = getDashboardKPIs()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-body-lg text-gray-600">Welcome back! Here's your loan portfolio overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Kpi 
          title="Total Portfolio" 
          value={`₹${(kpis.portfolio / 100000).toFixed(1)}L`}
          delta="+12% vs last month"
          color="primary"
          icon="📊"
        />
        <Kpi 
          title="Active Loans" 
          value={kpis.activeLoans}
          delta={`${kpis.overdueCases} overdue`}
          color="success"
          icon="✅"
        />
        <Kpi 
          title="Total Collected" 
          value={`₹${(kpis.totalCollected / 100000).toFixed(1)}L`}
          delta="+8% vs last month"
          color="success"
          icon="💰"
        />
        <Kpi 
          title="Customers" 
          value={kpis.totalCustomers}
          delta="+3 new this month"
          color="info"
          icon="👥"
        />
        <Kpi 
          title="Collection Rate" 
          value={`${Math.round((kpis.totalCollected / kpis.totalDisbursed) * 100)}%`}
          delta="Target: 95%"
          color="warning"
          icon="📈"
        />
        <Kpi 
          title="Overdue Cases" 
          value={kpis.overdueCases}
          delta={`${((kpis.overdueCases / kpis.activeLoans) * 100).toFixed(1)}% of portfolio`}
          color={kpis.overdueCases > 5 ? 'danger' : 'warning'}
          icon="⚠️"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Disbursement vs Collection Chart */}
        <Card title="Disbursement vs Collection" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChartComponent data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="disbursed" fill="#1741FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="collected" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChartComponent>
          </ResponsiveContainer>
        </Card>

        {/* DPD Distribution */}
        <Card title="DPD Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={dpdData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {dpdData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {dpdData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Loans Table */}
      <Card title="Recent Loans & Collections">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Loan ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Collected</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">DPD</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-light-gray transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{loan.loanId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{loan.customerName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{(loan.amount / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{(loan.collectedAmount / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      loan.dpd === 0 ? 'bg-success/10 text-success' :
                      loan.dpd <= 30 ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {loan.dpd === 0 ? 'Current' : `${loan.dpd} days`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
