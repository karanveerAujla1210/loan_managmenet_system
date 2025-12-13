import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { CheckCircle, Download, FileText, Calendar, Users, TrendingUp } from 'lucide-react'

export const CaseClosure: React.FC = () => {
  const [closureStage, setClosureStage] = useState<'pending' | 'completed'>('completed')

  const closureSteps = [
    { id: 1, label: 'Full Payment Received', completed: true, date: '15-Dec-2024' },
    { id: 2, label: 'Final Interest Calculated', completed: true, date: '15-Dec-2024' },
    { id: 3, label: 'Settlement Confirmed', completed: true, date: '16-Dec-2024' },
    { id: 4, label: 'Documents Prepared', completed: true, date: '16-Dec-2024' },
    { id: 5, label: 'Customer Notified', completed: true, date: '16-Dec-2024' },
    { id: 6, label: 'Closure Certificate Issued', completed: true, date: '17-Dec-2024' }
  ]

  if (closureStage === 'completed') {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center bg-light-gray">
        <div className="w-full max-w-2xl">
          {/* Success Indicator */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-success to-emerald-400 rounded-full shadow-lg mb-6 animate-pulse">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h1 className="text-display-md font-bold text-gray-900 mb-2">Loan Closed Successfully</h1>
            <p className="text-body-lg text-gray-600">Case #LA-00001 has been successfully closed</p>
          </div>

          {/* Closure Summary Card */}
          <Card className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Customer Name</p>
                <p className="text-xl font-bold text-gray-900">Rajesh Kumar</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Loan Amount</p>
                <p className="text-xl font-bold text-primary">₹3,00,000</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Amount Collected</p>
                <p className="text-xl font-bold text-success">₹3,45,000</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600 mb-1">Tenure</p>
                <p className="font-bold text-gray-900">36 months</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
                <p className="font-bold text-gray-900">12%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Closed On</p>
                <p className="font-bold text-gray-900">17-Dec-2024</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="font-bold text-success">✓ Settled</p>
              </div>
            </div>
          </Card>

          {/* Checklist of Completed Steps */}
          <Card title="Closure Checklist" className="mb-8">
            <div className="space-y-3">
              {closureSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-4 p-4 bg-light-gray rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="flex items-center justify-center w-6 h-6 bg-success rounded-full text-white text-sm font-bold">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-600">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Key Documents */}
          <Card title="Documents" className="mb-8">
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-light-gray hover:bg-gray-200 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Loan Closure Certificate</p>
                    <p className="text-xs text-gray-600">Issued 17-Dec-2024</p>
                  </div>
                </div>
                <Download size={20} className="text-gray-600" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-light-gray hover:bg-gray-200 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-info" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Settlement Statement</p>
                    <p className="text-xs text-gray-600">Final amount: ₹3,45,000</p>
                  </div>
                </div>
                <Download size={20} className="text-gray-600" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-light-gray hover:bg-gray-200 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-success" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Payment History Report</p>
                    <p className="text-xs text-gray-600">All 36 EMI records</p>
                  </div>
                </div>
                <Download size={20} className="text-gray-600" />
              </button>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center justify-center gap-2">
              <Download size={20} />
              Download All Documents
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-light-gray transition-colors font-medium">
              Share with Customer
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 mb-2">Thank you for choosing us!</p>
            <p className="text-sm text-gray-500">This loan account has been successfully closed. All documents are available for download above.</p>
          </div>
        </div>
      </div>
    )
  }

  // Pending Closure View
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-gray-900 mb-2">Case Closure</h1>
        <p className="text-body-lg text-gray-600">Monitor and manage loan closure process</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No pending closures. All active loans are in good standing.</p>
          <button 
            onClick={() => setClosureStage('completed')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            View Sample Closure
          </button>
        </div>
      </Card>
    </div>
  )
}

export default CaseClosure
