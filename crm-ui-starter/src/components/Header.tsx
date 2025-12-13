import React, { useState } from 'react'
import { Bell, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { user, logout } = useAuth()

  const notifications = [
    { id: 1, title: 'Payment Received', message: 'Loan #LA-00123 payment received', time: '10 min ago', unread: true },
    { id: 2, title: 'Overdue Alert', message: 'Customer LA-00456 is overdue', time: '1 hour ago', unread: true },
    { id: 3, title: 'Disbursement', message: 'New disbursement request approved', time: '2 hours ago', unread: false }
  ]

  const userInitials = user?.name
    .split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || 'U'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm backdrop-blur-xl bg-white/90">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search loans, customers, payments..."
              className="w-full px-4 py-2.5 pl-10 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-6 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfile(false)
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-card-lg border border-gray-200 overflow-hidden animate-fadeInUp">
                <div className="bg-gradient-to-r from-primary/10 to-accent-purple/10 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
                  <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark">View All</a>
                </div>
              </div>
            )}
          </div>

          {/* Help Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Help">
            <HelpCircle size={20} className="text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
              <span className="text-gray-400">▼</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card-lg border border-gray-200 overflow-hidden animate-fadeInUp">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div className="divide-y divide-gray-100">
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">👤 My Profile</a>
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">⚙️ Settings</a>
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">🎓 Training</a>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-danger transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
