import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
  FolderOpenIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ScaleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const ModernLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Credit Management', href: '/credit-management', icon: ChartBarIcon },
    { name: 'Disbursed Loans', href: '/loans', icon: DocumentTextIcon },
    {
      name: 'Overdue Management',
      href: '/overdue',
      icon: ExclamationTriangleIcon,
      subItems: [
        { name: 'Overdue Buckets', href: '/overdue/buckets' },
        { name: 'Overdue Aging', href: '/overdue/aging' },
        { name: 'Follow-up Scheduler', href: '/overdue/followup' }
      ]
    },
    { name: 'Legal Cases', href: '/legal', icon: ScaleIcon },
    { name: 'Payment Processing', href: '/payments', icon: CreditCardIcon },
    { name: 'Bank Reconciliation', href: '/reconciliation', icon: BuildingOfficeIcon },
    { name: 'Customers', href: '/customers', icon: UsersIcon },
    { name: 'Reports & Analytics', href: '/reports', icon: PresentationChartLineIcon },
    {
      name: 'Collections',
      href: '/disputes',
      icon: BanknotesIcon,
      subItems: [
        { name: 'Disputes', href: '/disputes' },
        { name: 'Promises', href: '/promises' },
        { name: 'Collector Performance', href: '/collector-performance' }
      ]
    },
    {
      name: 'Data Management',
      href: '/import',
      icon: FolderOpenIcon,
      subItems: [
        { name: 'Import', href: '/import' },
        { name: 'Upload', href: '/upload' },
        { name: 'Audit Log', href: '/audit' }
      ]
    },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const isMenuActive = (item) => {
    return location.pathname === item.href || 
           (item.subItems && item.subItems.some(subItem => location.pathname === subItem.href));
  };

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = isMenuActive(item);
    const hasSubmenu = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenu === item.name;

    if (hasSubmenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => setExpandedMenu(isExpanded ? null : item.name)}
            className={`w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-sky-50 text-sky-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-sky-500' : 'text-gray-400'}`} />
              {item.name}
            </div>
            <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1 pl-2">
              {item.subItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.href;
                return (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isSubActive
                        ? 'bg-sky-50 text-sky-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full mr-3 ${isSubActive ? 'bg-sky-500' : 'bg-gray-300'}`} />
                    {subItem.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-sky-50 text-sky-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-sky-500' : 'text-gray-400'}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <span className="text-lg font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
            Loan CRM
          </span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} isMobile={true} />
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <span className="text-lg font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Business Loan CRM
            </span>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <button
            className="px-4 text-gray-500 hover:text-gray-600 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="relative w-full text-gray-400 focus-within:text-gray-600 max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </div>
                <input
                  className="block w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                  placeholder="Search customers, loans..."
                />
              </div>
            </div>

            <div className="ml-4 flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="h-8 w-px bg-gray-200" />

              <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
