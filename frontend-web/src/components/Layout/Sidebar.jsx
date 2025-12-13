import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  BarChart2,
  User,
  DollarSign
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Loans', href: '/loans', icon: FileText },
  { name: 'Collections', href: '/collections', icon: DollarSign },
  { name: 'Profile', href: '/profile', icon: User },
];

const Sidebar = ({ sidebarOpen }) => {
  return (
    <div
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm
        transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:flex lg:flex-shrink-0`}
    >
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-4">
            <img src="/logo.svg" alt="Mini Business Loan" className="h-12 w-auto" />
          </div>
          <nav className="mt-6 flex-1 px-4 space-y-2 bg-white">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200`
                }
              >
                <item.icon
                  className={`${({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'} 
                    mr-4 flex-shrink-0 h-5 w-5`}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
