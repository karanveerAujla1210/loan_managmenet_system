import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Edit, Download } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { getCustomerById, getLoansByCustomerId } from '../services/mockData'

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'activity'>('overview')

  const customer = getCustomerById(id || '')
  const loans = getLoansByCustomerId(id || '')

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Customer not found</p>
      </div>
    )
  }

  const statusColors = {
    active: { bg: 'bg-success/10', text: 'text-success' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-700' },
    default: { bg: 'bg-danger/10', text: 'text-danger' }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 hover:bg-light-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-display-sm font-bold text-gray-900">Customer Profile</h1>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <img 
              src={customer.profileImage}
              alt={customer.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-heading-xl font-bold text-gray-900">{customer.name}</h2>
              <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${statusColors[customer.status].bg} ${statusColors[customer.status].text}`}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-200 pt-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="flex items-center gap-2 text-gray-900 font-medium">
              <Mail size={16} className="text-primary" />
              {customer.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="flex items-center gap-2 text-gray-900 font-medium">
              <Phone size={16} className="text-primary" />
              {customer.phone}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">PAN Number</p>
            <p className="text-gray-900 font-medium">{customer.panNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="flex items-center gap-2 text-gray-900 font-medium">
              <Calendar size={16} className="text-primary" />
              {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        {(['overview', 'loans', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Financial Summary">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Total Portfolio</span>
                <span className="text-2xl font-bold text-primary">₹{(customer.totalLoanAmount / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Active Loans</span>
                <span className="text-xl font-bold text-gray-900">{customer.loanCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average LTV</span>
                <span className="text-xl font-bold text-success">78%</span>
              </div>
            </div>
          </Card>

          <Card title="Credit Profile">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">CIBIL Score</span>
                <span className="text-2xl font-bold text-success">745</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Risk Category</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-success/10 text-success">Low Risk</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Default History</span>
                <span className="text-xl font-bold text-gray-900">None</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'loans' && (
        <div>
          {loans.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Loan ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Interest Rate</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tenure</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Collected</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">DPD</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-light-gray transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-primary">{loan.loanId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{(loan.amount / 100000).toFixed(1)}L</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{loan.interestRate}%</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{loan.tenure} months</td>
                        <td className="px-6 py-4 text-sm font-medium text-success">₹{(loan.collectedAmount / 100000).toFixed(1)}L</td>
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
          ) : (
            <Card className="text-center py-12">
              <p className="text-gray-600">No loans found for this customer</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <Card title="Activity Timeline">
          <div className="space-y-4">
            {[
              { date: '2024-12-10', action: 'Loan LA-00001 Disbursed', type: 'success' },
              { date: '2024-11-25', action: 'Payment received - ₹50,000', type: 'success' },
              { date: '2024-11-15', action: 'Loan Application Approved', type: 'info' },
              { date: '2024-11-01', action: 'Customer registered', type: 'info' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className={`w-3 h-3 rounded-full mt-2 ${item.type === 'success' ? 'bg-success' : 'bg-info'}`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default CustomerDetail
