import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Download, Filter, Calendar } from 'lucide-react'

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('portfolio')

  const reports = [
    { id: 1, name: 'Portfolio Summary', date: '17-Dec-2024', pages: 12, size: '2.4 MB' },
    { id: 2, name: 'Collection Report', date: '16-Dec-2024', pages: 8, size: '1.8 MB' },
    { id: 3, name: 'DPD Analysis', date: '15-Dec-2024', pages: 6, size: '1.2 MB' },
    { id: 4, name: 'Customer KYC Report', date: '14-Dec-2024', pages: 15, size: '3.1 MB' }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-body-lg text-gray-600">Generate and download business reports</p>
      </div>

      {/* Report Generator */}
      <Card title="Generate New Report" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="portfolio">Portfolio Summary</option>
              <option value="collection">Collection Report</option>
              <option value="dpd">DPD Analysis</option>
              <option value="kyc">Customer KYC Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input 
              type="month"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              defaultValue="2024-12"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card title="Recent Reports">
        <div className="space-y-2">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-light-gray hover:bg-gray-200 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-xs text-gray-600">{report.date} • {report.pages} pages • {report.size}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={18} />
                Download
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Reports
