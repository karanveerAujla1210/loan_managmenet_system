import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Loan CRM</h1>
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Collection</p>
                <p className="text-2xl font-bold text-gray-900">₹2,45,000</p>
                <p className="text-xs text-green-600 mt-1">↗ +12%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Overdue</p>
                <p className="text-2xl font-bold text-gray-900">₹15,67,890</p>
                <p className="text-xs text-red-600 mt-1">234 cases</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-xs text-orange-600 mt-1">Follow-ups</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Achievement</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bucket Analysis */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">DPD Bucket Analysis</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h4 className="font-semibold text-green-800 mb-1">Current</h4>
                <p className="text-xl font-bold text-green-600">₹45L</p>
                <p className="text-xs text-green-600 mb-2">450 accounts</p>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">0 DPD</span>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <h4 className="font-semibold text-yellow-800 mb-1">X Bucket</h4>
                <p className="text-xl font-bold text-yellow-600">₹23L</p>
                <p className="text-xs text-yellow-600 mb-2">230 accounts</p>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">1-30 DPD</span>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-sm">⚠</span>
                </div>
                <h4 className="font-semibold text-orange-800 mb-1">Y Bucket</h4>
                <p className="text-xl font-bold text-orange-600">₹18L</p>
                <p className="text-xs text-orange-600 mb-2">180 accounts</p>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">31-60 DPD</span>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <h4 className="font-semibold text-red-800 mb-1">M1 Bucket</h4>
                <p className="text-xl font-bold text-red-600">₹12L</p>
                <p className="text-xs text-red-600 mb-2">120 accounts</p>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">61-90 DPD</span>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-sm">🔥</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-1">M2 Bucket</h4>
                <p className="text-xl font-bold text-purple-600">₹8L</p>
                <p className="text-xs text-purple-600 mb-2">80 accounts</p>
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">91-180 DPD</span>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-sm">💀</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">M3 Bucket</h4>
                <p className="text-xl font-bold text-gray-600">₹5L</p>
                <p className="text-xs text-gray-600 mb-2">50 accounts</p>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">181+ DPD</span>
              </div>

              <div className="text-center p-4 bg-gray-900 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-black text-sm">⚖</span>
                </div>
                <h4 className="font-semibold text-white mb-1">Legal</h4>
                <p className="text-xl font-bold text-white">₹3L</p>
                <p className="text-xs text-gray-300 mb-2">25 accounts</p>
                <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Court Cases</span>
              </div>

            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <button 
                onClick={() => alert('Update Payment clicked!')}
                className="flex items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span className="text-2xl mr-3">💰</span>
                <div className="text-left">
                  <p className="font-semibold">Update Payment</p>
                  <p className="text-sm text-blue-100">Record payments</p>
                </div>
              </button>

              <button 
                onClick={() => alert('Overdue Loans clicked!')}
                className="flex items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <span className="text-2xl mr-3">📋</span>
                <div className="text-left">
                  <p className="font-semibold">Overdue Loans</p>
                  <p className="text-sm text-green-100">Manage accounts</p>
                </div>
              </button>

              <button 
                onClick={() => alert('Bank Match clicked!')}
                className="flex items-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <span className="text-2xl mr-3">🏦</span>
                <div className="text-left">
                  <p className="font-semibold">Bank Match</p>
                  <p className="text-sm text-purple-100">Reconcile statements</p>
                </div>
              </button>

              <button 
                onClick={() => alert('Follow Up clicked!')}
                className="flex items-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
              >
                <span className="text-2xl mr-3">📞</span>
                <div className="text-left">
                  <p className="font-semibold">Follow Up</p>
                  <p className="text-sm text-orange-100">Schedule calls</p>
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
