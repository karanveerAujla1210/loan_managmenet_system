import React from 'react'
import Kpi from '../components/ui/Kpi'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Timeline } from '../components/ui/Timeline'

export const Dashboard: React.FC = () => {
  const recent = [
    { id: 1, when: '2h ago', title: 'Lead assigned to Priya', description: 'Lead LA-00987 assigned by system' },
    { id: 2, when: '4h ago', title: 'Payment received', description: 'Payment applied for Loan #LA-00123' },
    { id: 3, when: '1d ago', title: 'Disbursement requested', description: 'Disbursement requested by Ops' }
  ]

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-fadeInUp">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-display-md font-display font-bold text-dark-gray mb-2">Dashboard</h1>
            <p className="text-body-lg text-gray-600">Welcome back! Here's your loan portfolio overview</p>
          </div>
          <div className="text-right">
            <p className="text-body-sm text-gray-600">Last updated: Today at 2:30 PM</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Customers Card */}
        <div className="card-interactive bg-gradient-to-br from-white to-primary-light/20 border border-primary/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-600 mb-2">👥 Total Customers</p>
              <p className="stat-value text-4xl">1,254</p>
              <p className="text-xs text-green-600 font-semibold mt-2">↑ 12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-xl opacity-80">
              📊
            </div>
          </div>
        </div>

        {/* Active Loans Card */}
        <div className="card-interactive bg-gradient-to-br from-white to-accent-cyan/20 border border-accent-cyan/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-600 mb-2">📋 Active Loans</p>
              <p className="stat-value text-4xl">3,412</p>
              <p className="text-xs text-green-600 font-semibold mt-2">↑ 8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center text-white text-xl opacity-80">
              💰
            </div>
          </div>
        </div>

        {/* DPD Card */}
        <div className="card-interactive bg-gradient-to-br from-white to-warning/20 border border-warning/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-600 mb-2">⚠️ DPD &gt; 30</p>
              <p className="text-4xl font-bold text-warning">$124.3K</p>
              <p className="text-xs text-orange-600 font-semibold mt-2">↓ 3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-warm rounded-lg flex items-center justify-center text-white text-xl opacity-80">
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Health Section */}
        <div className="lg:col-span-2 card-elevated border border-white/40 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent-purple/10 p-6 border-b border-white/20">
            <h2 className="text-heading-lg font-display font-bold text-dark-gray">📊 Portfolio Health</h2>
            <p className="text-body-sm text-gray-600 mt-2">Collection effectiveness and recent trends</p>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-center gap-12">
              <div className="flex-shrink-0">
                <ProgressRing value={76} />
              </div>
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold gradient-primary-text">76%</span>
                    <span className="text-body-sm text-gray-600">Collection Rate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-body-sm text-gray-600 mb-1">On-time Payments</p>
                    <p className="text-2xl font-bold text-success">$2.8M</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-gray-600 mb-1">Overdue Amount</p>
                    <p className="text-2xl font-bold text-warning">$450K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="card-elevated border border-white/40 overflow-hidden">
          <div className="bg-gradient-to-r from-accent-emerald/10 to-accent-cyan/10 p-6 border-b border-white/20">
            <h2 className="text-heading-md font-display font-bold text-dark-gray">🔔 Recent Activity</h2>
          </div>

          <div className="p-6">
            <Timeline items={recent} />
          </div>
        </div>
      </div>

      {/* Bottom Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card-elevated border border-white/40 p-6">
          <h3 className="text-heading-md font-semibold text-dark-gray mb-4">💡 Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary-light transition-colors text-primary font-medium">+ New Loan Application</button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary-light transition-colors text-primary font-medium">+ Add Customer</button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary-light transition-colors text-primary font-medium">+ Process Payment</button>
          </div>
        </div>

        <div className="card-elevated border border-white/40 p-6">
          <h3 className="text-heading-md font-semibold text-dark-gray mb-4">📅 Upcoming Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-2xl">📞</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Customer follow-up calls</p>
                <p className="text-xs text-gray-600">Due in 2 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-2xl">📊</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Daily report submission</p>
                <p className="text-xs text-gray-600">Due today at 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
