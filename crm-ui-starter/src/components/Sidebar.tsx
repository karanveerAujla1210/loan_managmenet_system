import React, { useState } from 'react'
import tokens from '../theme/tokens'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'leads', label: 'Leads', icon: '🎯' },
  { id: 'loans', label: 'Loans', icon: '📋' },
  { id: 'collections', label: 'Collections', icon: '💰' },
  { id: 'reports', label: 'Reports', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

export const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <aside className="sidebar">
      {/* Header with Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          💼
        </div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-title">LoanHub</div>
          <div className="sidebar-brand-subtitle">CRM System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-left ${
              activeItem === item.id
                ? 'bg-gradient-primary text-white shadow-glow-blue'
                : 'text-gray-700 hover:bg-primary-light/50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
          <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold text-sm">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">John Smith</div>
            <div className="text-xs text-gray-600 truncate">admin@loanhub.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
