import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn, getInitials } from '../../lib/utils';

const ModernHeader = ({ sidebarCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const { user, logout } = useAuth();

  const notifications = [
    {
      id: 1,
      title: 'New loan application',
      message: 'John Doe submitted a new application',
      time: '2 min ago',
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: 'Payment overdue',
      message: 'Customer ABC123 payment is 5 days overdue',
      time: '1 hour ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Disbursement approved',
      message: 'Loan #LN001 disbursement has been approved',
      time: '3 hours ago',
      unread: false,
      type: 'success'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header 
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-30 transition-all duration-300',
        sidebarCollapsed ? 'left-20' : 'left-70'
      )}
      style={{ left: sidebarCollapsed ? '80px' : '280px' }}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers, loans, or applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Help */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Messages */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="error" 
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors',
                          notification.unread ? 'bg-blue-50 border-l-primary-500' : 'border-l-transparent'
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Avatar size="sm" className="bg-primary-100 text-primary-700">
                {getInitials(user?.name || 'User')}
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'Employee'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar size="md" className="bg-primary-100 text-primary-700">
                        {getInitials(user?.name || 'User')}
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4 mr-3" />
                      Preferences
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;