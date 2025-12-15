import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { collectorService } from '../../services/collectorService';

const CollectorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [myCases, setMyCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const collectorId = localStorage.getItem('userId');
      
      // Fetch today's dashboard stats
      const dashboardData = await collectorService.getTodayDashboard(collectorId);
      setStats(dashboardData);

      // Fetch top 10 priority cases
      const casesData = await collectorService.getMyCases(collectorId, { limit: 10 });
      setMyCases(casesData);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCalling = () => {
    navigate('/collector/cases');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Today's Collections Target</h1>
          <p className="text-gray-600 mt-2">Your action items for today</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* Today Due Count */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Today Due</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats?.todayDueCount || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Cases pending</p>
          </div>

          {/* Overdue Count */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium">Overdue</p>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats?.overdueCount || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Priority cases</p>
          </div>

          {/* Highest DPD */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-700">
            <p className="text-gray-600 text-sm font-medium">Highest DPD</p>
            <p className="text-4xl font-bold text-red-700 mt-2">{stats?.highestDPDCase?.dpd || 0}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.highestDPDCase?.customerId?.name || 'N/A'}
            </p>
          </div>

          {/* Collected Today */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Collected</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{(stats?.totalCollectedToday || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-2">Today's collection</p>
          </div>

          {/* Promises Due Today */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Promises Due</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats?.promisesDueToday || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Follow up calls</p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mb-8">
          <button
            onClick={handleStartCalling}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105 text-lg"
          >
            START CALLING →
          </button>
        </div>

        {/* My Cases Preview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Priority Cases</h2>
            <p className="text-sm text-gray-600 mt-1">Your top 10 cases by priority</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    EMI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    DPD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Bucket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {myCases.length > 0 ? (
                  myCases.map((loan) => (
                    <tr key={loan._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {loan.customerId?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {loan._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{loan.emiAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(loan.nextDueDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        <span className={`${
                          loan.dpd > 30 ? 'text-red-700' :
                          loan.dpd > 7 ? 'text-orange-600' :
                          loan.dpd > 0 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {loan.dpd} DPD
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          loan.bucket === 'NORMAL' ? 'bg-green-100 text-green-800' :
                          loan.bucket === 'EARLY_OVERDUE' ? 'bg-yellow-100 text-yellow-800' :
                          loan.bucket === 'OVERDUE' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {loan.bucket}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/collector/loan/${loan._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        >
                          CALL
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No cases assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={handleStartCalling}
              className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm"
            >
              View all {stats?.assignedCasesCount || 0} cases →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;
