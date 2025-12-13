import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Loan Management CRM</h1>
                <p className="text-sm text-gray-500">Collections & Servicing Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString('en-IN', { hour12: true })}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">💰</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Today's Collection</p>
                <p className="text-2xl font-bold text-gray-900">₹2,45,000</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Overdue</p>
                <p className="text-2xl font-bold text-gray-900">₹15,67,890</p>
                <p className="text-xs text-red-600">234 cases</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg">📋</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Overdue Cases</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-xs text-orange-600">Active follow-ups</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🎯</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Collection Target</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bucket Analysis */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Bucket Analysis</h2>
            <p className="text-sm text-gray-500">Portfolio distribution by DPD ranges</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-green-800 text-sm">Current</h4>
                <p className="text-lg font-bold text-green-600">₹45L</p>
                <p className="text-xs text-green-600">450 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">0 DPD</span>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-yellow-800 text-sm">X Bucket</h4>
                <p className="text-lg font-bold text-yellow-600">₹23L</p>
                <p className="text-xs text-yellow-600">230 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">1-30 DPD</span>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-orange-800 text-sm">Y Bucket</h4>
                <p className="text-lg font-bold text-orange-600">₹18L</p>
                <p className="text-xs text-orange-600">180 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">31-60 DPD</span>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-red-800 text-sm">M1 Bucket</h4>
                <p className="text-lg font-bold text-red-600">₹12L</p>
                <p className="text-xs text-red-600">120 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">61-90 DPD</span>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-purple-800 text-sm">M2 Bucket</h4>
                <p className="text-lg font-bold text-purple-600">₹8L</p>
                <p className="text-xs text-purple-600">80 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">91-180 DPD</span>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 bg-gray-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-gray-800 text-sm">M3 Bucket</h4>
                <p className="text-lg font-bold text-gray-600">₹5L</p>
                <p className="text-xs text-gray-600">50 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">181+ DPD</span>
              </div>

              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <div className="w-6 h-6 bg-white rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-white text-sm">Legal Cases</h4>
                <p className="text-lg font-bold text-white">₹3L</p>
                <p className="text-xs text-gray-300">25 accounts</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">Court Cases</span>
              </div>

            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Frequently used operations</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <button className="flex items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold">Update Payment</p>
                  <p className="text-sm text-blue-100">Record new payments</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold">Overdue Loans</p>
                  <p className="text-sm text-green-100">Manage overdue accounts</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🏦</span>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold">Bank Match</p>
                  <p className="text-sm text-purple-100">Reconcile statements</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold">Follow Up</p>
                  <p className="text-sm text-orange-100">Schedule follow-ups</p>
                </div>
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;