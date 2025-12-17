import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';

// Layout Component with Sidebar
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          {children}
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

// Beautiful Dashboard Component with Modern UI
const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setAnimateCards(true);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your loan portfolio today.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>
          </div>
        </div>
      </div>
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                  +12% ↗
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Collection</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹2,45,000</p>
            <p className="text-xs text-gray-500">Target: ₹3,00,000</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '82%'}}></div>
            </div>
          </div>

          <div className={`group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-full">
                  -5% ↘
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Overdue</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹15,67,890</p>
            <p className="text-xs text-gray-500">Across all buckets</p>
            <div className="flex items-center mt-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Requires immediate attention</span>
            </div>
          </div>

          <div className={`group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📋</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-full">
                  +8 today
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Overdue Cases</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">234</p>
            <p className="text-xs text-gray-500">Active follow-ups</p>
            <div className="flex space-x-1 mt-3">
              <div className="w-1 h-6 bg-yellow-400 rounded"></div>
              <div className="w-1 h-6 bg-orange-400 rounded"></div>
              <div className="w-1 h-6 bg-red-400 rounded"></div>
              <div className="w-1 h-6 bg-purple-400 rounded"></div>
            </div>
          </div>

          <div className={`group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                  87%
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Collection Target</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">87%</p>
            <p className="text-xs text-gray-500">Monthly progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{width: '87%'}}></div>
            </div>
          </div>
        </div>

        {/* Bucket Analysis */}
        <div className={`bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 mb-8 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bucket Analysis</h2>
              <p className="text-gray-600">Portfolio distribution by DPD ranges</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Export
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="group text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <h4 className="font-bold text-green-800 mb-2">Current</h4>
              <p className="text-2xl font-bold text-green-600 mb-1">₹45L</p>
              <p className="text-sm text-green-600 font-medium">450 accounts</p>
              <div className="mt-3 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                0 DPD
              </div>
            </div>

            <div className="group text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <h4 className="font-bold text-yellow-800 mb-2">X Bucket</h4>
              <p className="text-2xl font-bold text-yellow-600 mb-1">₹23L</p>
              <p className="text-sm text-yellow-600 font-medium">230 accounts</p>
              <div className="mt-3 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                1-30 DPD
              </div>
            </div>

            <div className="group text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚠</span>
              </div>
              <h4 className="font-bold text-orange-800 mb-2">Y Bucket</h4>
              <p className="text-2xl font-bold text-orange-600 mb-1">₹18L</p>
              <p className="text-sm text-orange-600 font-medium">180 accounts</p>
              <div className="mt-3 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                31-60 DPD
              </div>
            </div>

            <div className="group text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚡</span>
              </div>
              <h4 className="font-bold text-red-800 mb-2">M1 Bucket</h4>
              <p className="text-2xl font-bold text-red-600 mb-1">₹12L</p>
              <p className="text-sm text-red-600 font-medium">120 accounts</p>
              <div className="mt-3 text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                61-90 DPD
              </div>
            </div>

            <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔥</span>
              </div>
              <h4 className="font-bold text-purple-800 mb-2">M2 Bucket</h4>
              <p className="text-2xl font-bold text-purple-600 mb-1">₹8L</p>
              <p className="text-sm text-purple-600 font-medium">80 accounts</p>
              <div className="mt-3 text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                91-180 DPD
              </div>
            </div>

            <div className="group text-center p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">💀</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">M3 Bucket</h4>
              <p className="text-2xl font-bold text-gray-600 mb-1">₹5L</p>
              <p className="text-sm text-gray-600 font-medium">50 accounts</p>
              <div className="mt-3 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                181+ DPD
              </div>
            </div>

            <div className="group text-center p-6 bg-gradient-to-br from-black to-gray-800 rounded-xl border border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-black text-sm font-bold">⚖️</span>
              </div>
              <h4 className="font-bold text-white mb-2">Legal Cases</h4>
              <p className="text-2xl font-bold text-white mb-1">₹3L</p>
              <p className="text-sm text-gray-300 font-medium">25 accounts</p>
              <div className="mt-3 text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded-full">
                Court Cases
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Frequently used operations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Update Payment</h3>
              <p className="text-blue-100 text-sm">Record new payments and allocations</p>
            </button>

            <button className="group p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Overdue Loans</h3>
              <p className="text-green-100 text-sm">View and manage overdue accounts</p>
            </button>

            <button className="group p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏦</span>
                </div>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Bank Match</h3>
              <p className="text-purple-100 text-sm">Reconcile bank statements</p>
            </button>

            <button className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📞</span>
                </div>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Follow Up</h3>
              <p className="text-orange-100 text-sm">Schedule customer follow-ups</p>
            </button>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activities */}
          <div className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Payment Received</p>
                  <p className="text-sm text-gray-600">Rahul Kumar - ₹25,000</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Follow-up Call</p>
                  <p className="text-sm text-gray-600">Priya Singh - Promised payment</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Overdue Alert</p>
                  <p className="text-sm text-gray-600">Amit Sharma - 45 DPD</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Collection Trend</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-bold text-green-600">₹12.5L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{width: '85%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Week</span>
                <span className="font-bold text-blue-600">₹11.2L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full" style={{width: '76%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monthly Target</span>
                <span className="font-bold text-purple-600">₹50L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '62%'}}></div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Performance Score</p>
                    <p className="text-2xl font-bold text-blue-600">92%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+8% from last month</p>
                    <p className="text-xs text-gray-500">Excellent performance!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

// Beautiful App Component with Enhanced Styling
function App() {
  return (
    <Router>
      <div className="font-inter">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
