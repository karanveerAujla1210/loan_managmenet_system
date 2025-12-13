import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, Zap, CreditCard, TrendingUp, Settings, LogOut } from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', path: '/customers', icon: Users },
  { id: 'credit-analysis', label: 'Credit Analysis', path: '/credit-analysis', icon: Zap },
  { id: 'collections', label: 'Collections', path: '/collections', icon: CreditCard },
  { id: 'case-closure', label: 'Case Closure', path: '/case-closure', icon: TrendingUp },
  { id: 'reports', label: 'Reports', path: '/reports', icon: TrendingUp },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings }
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const currentPath = location.pathname

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header with Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
            💼
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">LoanHub</div>
            <div className="text-xs text-gray-500">Loan CRM System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-light-gray'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer with User & Logout */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <img 
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 truncate capitalize">{user?.role.replace('_', ' ')}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-light-gray transition-colors text-left font-medium"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
