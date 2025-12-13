import React, { useState } from 'react'
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { Card } from '../components/ui/Card'
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react'
import { mockCustomers } from '../services/mockData'

const creditScoreData = [
  { range: '300-400', count: 2, color: '#EF4444' },
  { range: '400-500', count: 5, color: '#F59E0B' },
  { range: '500-650', count: 12, color: '#FBBF24' },
  { range: '650-750', count: 18, color: '#22C55E' },
  { range: '750+', count: 8, color: '#1741FF' }
]

const radarData = [
  { category: 'Income Stability', value: 78 },
  { category: 'Repayment History', value: 85 },
  { category: 'Debt-to-Income', value: 70 },
  { category: 'Asset Quality', value: 82 },
  { category: 'Business Health', value: 75 }
]

const eligibilityData = [
  { name: 'Eligible', value: 42, color: '#22C55E' },
  { name: 'Conditional', value: 18, color: '#F59E0B' },
  { name: 'Not Eligible', value: 5, color: '#EF4444' }
]

export const CreditAnalysis: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-gray-900 mb-2">Credit Analysis</h1>
        <p className="text-body-lg text-gray-600">Analyze credit worthiness and loan eligibility</p>
      </div>

      {/* Customer Selector & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Select Customer">
          <select 
            value={selectedCustomer.id}
            onChange={(e) => {
              const cust = mockCustomers.find(c => c.id === e.target.value)
              if (cust) setSelectedCustomer(cust)
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            {mockCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Credit Score</p>
            <p className="text-3xl font-bold text-primary">745</p>
            <p className="text-xs text-success mt-2">✓ Good</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Eligibility</p>
            <p className="text-3xl font-bold text-success">₹50L</p>
            <p className="text-xs text-success mt-2">✓ Eligible</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Risk Rating</p>
            <p className="text-3xl font-bold text-gray-900">Low</p>
            <p className="text-xs text-gray-600 mt-2">LTV: 68%</p>
          </div>
        </Card>
      </div>

      {/* Credit Profile & DTI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <Card title="Credit Profile Radar">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke="#1741FF" fill="#1741FF" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Income vs EMI */}
        <Card title="Income vs EMI Analysis">
          <div className="space-y-4">
            <div className="p-4 bg-light-gray rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Monthly Income</span>
                <span className="text-2xl font-bold text-gray-900">₹2,50,000</span>
              </div>
              <p className="text-xs text-gray-600">Verified through ITR</p>
            </div>

            <div className="p-4 bg-light-gray rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Proposed EMI</span>
                <span className="text-2xl font-bold text-primary">₹50,000</span>
              </div>
              <p className="text-xs text-gray-600">For ₹50L @ 12% for 60 months</p>
            </div>

            <div className="p-4 bg-light-gray rounded-lg border-2 border-success">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">EMI to Income Ratio</span>
                <span className="text-2xl font-bold text-success">20%</span>
              </div>
              <p className="text-xs text-success">✓ Well within 50% limit</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Credit Score Distribution & Debt Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Credit Score Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChartComponent data={creditScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="count" fill="#1741FF" radius={[8, 8, 0, 0]} />
            </BarChartComponent>
          </ResponsiveContainer>
        </Card>

        <Card title="Debt Obligations">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Existing EMIs</span>
                <span className="font-bold text-gray-900">₹40,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Credit Card Dues</span>
                <span className="font-bold text-gray-900">₹15,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-info h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Proposed EMI</span>
                <span className="font-bold text-primary">₹50,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Monthly Obligations</span>
                <span className="text-2xl font-bold text-gray-900">₹1,05,000</span>
              </div>
              <p className="text-xs text-warning mt-2">⚠️ 42% of income - High leverage</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Flags */}
      <Card title="Risk Assessment & Recommendations" className="border-l-4 border-warning">
        <div className="space-y-3">
          <div className="p-3 bg-warning/10 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">High debt-to-income ratio</p>
              <p className="text-sm text-gray-600">Current obligations at 42% of income</p>
            </div>
          </div>
          <div className="p-3 bg-success/10 rounded-lg flex gap-3">
            <TrendingUp size={20} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Strong repayment history</p>
              <p className="text-sm text-gray-600">No defaults in last 3 years</p>
            </div>
          </div>
          <div className="p-3 bg-info/10 rounded-lg flex gap-3">
            <TrendingDown size={20} className="text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Recommendation</p>
              <p className="text-sm text-gray-600">Approve with conditions - Consider reduced ticket size or higher interest rate</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CreditAnalysis
