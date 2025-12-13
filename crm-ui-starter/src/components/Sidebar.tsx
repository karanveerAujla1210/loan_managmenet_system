import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, ChevronDown } from 'lucide-react'
import { navigation, filterNavByRole, NavItem as NavItemType } from '../_nav'
import { Badge } from './ui/CoreUIComponents'

interface NavItemProps {
  item: NavItemType
  isActive: boolean
  onClick: () => void
  isCollapsed: boolean
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const hasChildren = item.component === 'NavGroup' && item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    } else if (item.to) {
      navigate(item.to)
      onClick()
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left
          ${isActive ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}
          ${isCollapsed ? 'justify-center px-2' : ''}
        `}
        title={isCollapsed ? item.name : ''}
      >
        {Icon && <Icon size={20} className="flex-shrink-0" />}
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <Badge variant="danger" size="sm" className="ml-auto">
                {item.badge.text}
              </Badge>
            )}
            {hasChildren && (
              <ChevronDown
                size={16}
                className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            )}
          </>
        )}
      </button>

      {/* Nested Items */}
      {hasChildren && isOpen && !isCollapsed && (
        <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
          {item.children.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              isActive={false}
              onClick={() => {}}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const currentPath = location.pathname

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Filter navigation based on user role
  const filteredNav = filterNavByRole(navigation, user?.role || 'loan_officer')

  return (
    <aside
      className={`
        h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
              💼
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">LoanHub</div>
              <div className="text-xs text-gray-500">Loan CRM</div>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md">
              L
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={item.to === currentPath}
            onClick={() => {}}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Footer - User Info & Logout */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 pb-3 border-b border-gray-200">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 truncate capitalize">
                {user?.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 
            transition-colors font-medium
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100
            transition-colors text-sm font-medium
          `}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
          {!isCollapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
