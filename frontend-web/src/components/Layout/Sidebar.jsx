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
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Profile', href: '/profile', icon: User },
];

const Sidebar = ({ sidebarOpen }) => {
  return (
    <div
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 
        transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:flex lg:flex-shrink-0`}
    >
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Loan Management</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1 bg-white">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <item.icon
                  className={`${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'} 
                    mr-3 flex-shrink-0 h-6 w-6`}
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
