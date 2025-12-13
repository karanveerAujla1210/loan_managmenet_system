import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, HelpCircle, Search, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './ui/CoreUIComponents'
import { navigation, getBreadcrumbs } from '../_nav'

export const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()

  const notifications = [
    {
      id: 1,
      title: 'Payment Received',
      message: 'Loan #LA-00123 payment received ₹15,000',
      time: '10 min ago',
      unread: true,
      type: 'success',
    },
    {
      id: 2,
      title: 'Overdue Alert',
      message: 'Customer LA-00456 is 15 days overdue',
      time: '1 hour ago',
      unread: true,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Disbursement Approved',
      message: 'New disbursement request approved',
      time: '2 hours ago',
      unread: false,
      type: 'info',
    },
  ]

  // Get breadcrumbs based on current route
  const breadcrumbs = getBreadcrumbs(navigation, location.pathname)

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search loans, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-9 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfile(false)
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideInUp">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{unreadCount} new</span>}
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.type === 'success'
                              ? 'bg-green-500'
                              : notif.type === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View All Notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Help Icon */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Help & Support"
          >
            <HelpCircle size={20} className="text-gray-600" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideInUp">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <div className="mt-2 inline-block">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium capitalize">
                      {user?.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowProfile(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate('/help')
                      setShowProfile(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    📚 Help & Support
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <div className="px-6 py-2 border-t border-gray-100 bg-gray-50 flex items-center gap-1 text-xs">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-700 font-medium">
            Home
          </button>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight size={14} className="text-gray-400" />
              {crumb.to ? (
                <button
                  onClick={() => navigate(crumb.to!)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {crumb.name}
                </button>
              ) : (
                <span className="text-gray-700 font-medium">{crumb.name}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
