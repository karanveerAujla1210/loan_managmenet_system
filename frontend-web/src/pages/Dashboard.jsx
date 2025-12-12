import { useState, useEffect } from 'react'
import { dashboardService } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalOutstanding: 0,
    collectionsToday: 0,
    dueToday: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardService.getStats()
      setStats(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Loans',
      value: stats.totalLoans,
      color: 'bg-blue-500',
      icon: '📊'
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      title: 'Overdue Loans',
      value: stats.overdueLoans,
      color: 'bg-red-500',
      icon: '⚠️'
    },
    {
      title: 'Total Outstanding',
      value: `₹${stats.totalOutstanding?.toLocaleString() || 0}`,
      color: 'bg-yellow-500',
      icon: '💰'
    },
    {
      title: 'Collections Today',
      value: `₹${stats.collectionsToday?.toLocaleString() || 0}`,
      color: 'bg-purple-500',
      icon: '💳'
    },
    {
      title: 'Due Today',
      value: stats.dueToday,
      color: 'bg-orange-500',
      icon: '📅'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your loan management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.color} rounded-md p-3 text-white text-2xl`}>
                    {card.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Recent loan activities will be displayed here
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Collection Performance
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Collection performance metrics will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard