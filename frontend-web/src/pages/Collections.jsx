import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collectionService } from '../services/api'
import toast from 'react-hot-toast'

const Collections = () => {
  const [dueToday, setDueToday] = useState([])
  const [overdue, setOverdue] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('due-today')

  useEffect(() => {
    fetchCollectionData()
  }, [])

  const fetchCollectionData = async () => {
    try {
      const [dueTodayRes, overdueRes] = await Promise.all([
        collectionService.getDueToday(),
        collectionService.getOverdue()
      ])
      
      setDueToday(dueTodayRes.data.data)
      setOverdue(overdueRes.data.data)
    } catch (error) {
      toast.error('Failed to fetch collection data')
    } finally {
      setLoading(false)
    }
  }

  const getBucketColor = (bucket) => {
    switch (bucket) {
      case 'Current': return 'bg-green-100 text-green-800'
      case 'X': return 'bg-yellow-100 text-yellow-800'
      case 'Y': return 'bg-orange-100 text-orange-800'
      case 'M1': return 'bg-red-100 text-red-800'
      case 'M2': return 'bg-red-200 text-red-900'
      case 'M3': return 'bg-red-300 text-red-900'
      case 'NPA': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderLoanTable = (loans, title) => (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outstanding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DPD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bucket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {loan.loanId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {loan.customerId?.firstName} {loan.customerId?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {loan.customerId?.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{loan.outstandingAmount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {loan.dpd || 0} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBucketColor(loan.collectionBucket)}`}>
                    {loan.collectionBucket}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.agentId ? `${loan.agentId.firstName} ${loan.agentId.lastName}` : 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/loans/${loan.loanId}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleCollect(loan.loanId)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Collect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const handleCollect = (loanId) => {
    // Navigate to collection form or open modal
    toast.info('Collection form will be implemented')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Collections</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage loan collections, payments, and follow-ups.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 rounded-md p-3 text-white text-2xl">
                  📅
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Due Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dueToday.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-red-500 rounded-md p-3 text-white text-2xl">
                  ⚠️
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {overdue.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-500 rounded-md p-3 text-white text-2xl">
                  💰
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Outstanding
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₹{(dueToday.reduce((sum, loan) => sum + (loan.outstandingAmount || 0), 0) + 
                       overdue.reduce((sum, loan) => sum + (loan.outstandingAmount || 0), 0)).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-500 rounded-md p-3 text-white text-2xl">
                  📊
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Collection Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    85%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('due-today')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'due-today'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Due Today ({dueToday.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overdue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overdue ({overdue.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'due-today' && renderLoanTable(dueToday, 'Loans Due Today')}
      {activeTab === 'overdue' && renderLoanTable(overdue, 'Overdue Loans')}
    </div>
  )
}

export default Collections