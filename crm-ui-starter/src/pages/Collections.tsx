import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Pause } from 'lucide-react'
import { mockLoans } from '../services/mockData'

const dpdBuckets = [
  { id: 'current', label: 'Current', color: 'bg-success', count: 18, amount: 2800000 },
  { id: 'bucket1', label: '1-30 DPD', color: 'bg-warning', count: 8, amount: 1200000 },
  { id: 'bucket2', label: '31-60 DPD', color: 'bg-orange-500', count: 4, amount: 600000 },
  { id: 'bucket3', label: '60+ DPD', color: 'bg-danger', count: 2, amount: 300000 }
]

const callLogs = [
  { id: 1, customerName: 'Rajesh Kumar', loanId: 'LA-00001', time: '10:30 AM', status: 'promise', outcome: 'Payment promised on 20-Dec' },
  { id: 2, customerName: 'Priya Sharma', loanId: 'LA-00002', time: '09:45 AM', status: 'not-connected', outcome: 'No response, will retry' },
  { id: 3, customerName: 'Amit Patel', loanId: 'LA-00003', time: '08:15 AM', status: 'collected', outcome: 'Payment received - ₹50,000' }
]

export const Collections: React.FC = () => {
  const [selectedBucket, setSelectedBucket] = useState<string>('bucket1')
  const [selectedLoan, setSelectedLoan] = useState<typeof mockLoans[0] | null>(null)

  const loansInBucket = mockLoans.filter(l => l.bucket === selectedBucket)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-gray-900 mb-2">Collections</h1>
        <p className="text-body-lg text-gray-600">Manage overdue cases and collections</p>
      </div>

      {/* DPD Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dpdBuckets.map((bucket) => (
          <Card
            key={bucket.id}
            className={`cursor-pointer transition-all ${selectedBucket === bucket.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
            onClick={() => setSelectedBucket(bucket.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{bucket.label}</p>
                <p className="text-3xl font-bold text-gray-900">{bucket.count}</p>
              </div>
              <div className={`w-12 h-12 ${bucket.color} rounded-lg opacity-20`}></div>
            </div>
            <p className="text-sm font-medium text-gray-600">₹{(bucket.amount / 100000).toFixed(1)}L</p>
          </Card>
        ))}
      </div>

      {/* Main Collections View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: DPD Bucket List */}
        <div className="lg:col-span-1">
          <Card title={`Cases in ${dpdBuckets.find(b => b.id === selectedBucket)?.label}`}>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loansInBucket.map((loan, idx) => (
                <button
                  key={loan.id}
                  onClick={() => setSelectedLoan(loan)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedLoan?.id === loan.id
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-light-gray border border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-900">{loan.loanId}</p>
                  <p className="text-xs text-gray-600">₹{(loan.amount / 100000).toFixed(1)}L • DPD: {loan.dpd}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Loan Details & Call Logs */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLoan ? (
            <>
              {/* Loan Summary */}
              <Card title="Loan Summary">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Loan ID</span>
                    <span className="font-semibold text-gray-900">{selectedLoan.loanId}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="font-semibold text-gray-900">₹{(selectedLoan.principalAmount / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Days Overdue</span>
                    <span className={`font-bold ${selectedLoan.dpd > 60 ? 'text-danger' : selectedLoan.dpd > 30 ? 'text-orange-500' : 'text-warning'}`}>
                      {selectedLoan.dpd} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Outstanding Amount</span>
                    <span className="font-bold text-primary">₹{((selectedLoan.principalAmount - selectedLoan.collectedAmount) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Next EMI Due</span>
                    <span className="font-semibold text-gray-900">{selectedLoan.nextPaymentDue}</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card title="Quick Actions">
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors font-medium">
                    <Phone size={18} />
                    Make Call
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium">
                    <MessageSquare size={18} />
                    Send SMS
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors font-medium">
                    <CheckCircle size={18} />
                    Record Payment
                  </button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="text-center py-12 text-gray-600">
              Select a case to view details
            </Card>
          )}

          {/* Promise to Pay Tracking */}
          <Card title="Promise to Pay - Tracking">
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">Promise Made</p>
                  <p className="text-sm text-primary">20-Dec-2024</p>
                </div>
                <p className="text-sm text-gray-600">Promised amount: ₹50,000</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">Follow-up Needed</p>
                  <p className="text-sm text-yellow-700">2 days remaining</p>
                </div>
                <p className="text-sm text-gray-600">Last contacted: 18-Dec at 10:30 AM</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Call Logs Timeline */}
      <Card title="Call Logs & Activity" className="mt-8">
        <div className="space-y-3">
          {callLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 bg-light-gray rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-3 h-3 rounded-full ${
                  log.status === 'collected' ? 'bg-success' :
                  log.status === 'promise' ? 'bg-primary' :
                  'bg-warning'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{log.customerName}</p>
                    <p className="text-xs text-gray-600">{log.loanId} • {log.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    log.status === 'collected' ? 'bg-success/10 text-success' :
                    log.status === 'promise' ? 'bg-primary/10 text-primary' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {log.status === 'collected' ? 'Collected' : log.status === 'promise' ? 'Promise' : 'Not Connected'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{log.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Collections
