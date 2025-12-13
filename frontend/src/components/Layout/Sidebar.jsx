import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Zap,
  CreditCard,
  Briefcase,
  TrendingUp,
  Phone,
  BarChart3,
  User,
  Settings,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Leads', path: '/leads', icon: Zap },
  { label: 'Credit Analysis', path: '/credit-analysis', icon: CreditCard },
  { label: 'Operations', path: '/operations', icon: Briefcase },
  { label: 'Disbursement', path: '/disbursement', icon: TrendingUp },
  { label: 'Collections', path: '/collections', icon: Phone },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
];

const bottomItems = [
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1741FF] to-[#1230cc] flex items-center justify-center">
            <span className="text-white font-bold text-sm">LMS</span>
          </div>
          <span className="font-semibold text-lg text-gray-900">LoanCRM</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#E9EDFF] text-[#1741FF]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200 px-3 py-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#E9EDFF] text-[#1741FF]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
