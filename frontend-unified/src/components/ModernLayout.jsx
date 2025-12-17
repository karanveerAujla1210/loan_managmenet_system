
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
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { modernTheme } from '../theme/modernTheme';

const ModernLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { name: 'Data Management', href: '/import', icon: FolderOpenIcon, subItems: [
      { name: 'Import', href: '/import' },
      { name: 'Upload', href: '/upload' },
      { name: 'Audit Log', href: '/audit' }
    ]},
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-primary-500">Loan CRM</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.subItems && item.subItems.some(subItem => location.pathname === subItem.href));
              const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

              return (
                <div key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                        className={`w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className={`mr-3 h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                          {item.name}
                        </div>
                        <svg className={`h-5 w-5 transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isSubmenuOpen && (
                        <div className="mt-1 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`group flex items-center px-10 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isSubActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={`mr-3 h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-primary-500">Business Loan CRM</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.subItems && item.subItems.some(subItem => location.pathname === subItem.href));
              const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

              return (
                <div key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                        className={`w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className={`mr-3 h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                          {item.name}
                        </div>
                        <svg className={`h-5 w-5 transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isSubmenuOpen && (
                        <div className="mt-1 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`group flex items-center px-10 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isSubActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`mr-3 h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <button
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex w-full md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full border-0 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search customers, loans..."
                  />
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              <div className="relative">
                <button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
