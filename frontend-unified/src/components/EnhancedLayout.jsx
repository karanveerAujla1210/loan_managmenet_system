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
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const EnhancedLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
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
            className={`w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </div>
            <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1 pl-4">
              {item.subItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.href;
                return (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isSubActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <div className={`h-2 w-2 rounded-full mr-3 ${isSubActive ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    {subItem.name}
                  </Link>
                );
              })}\n            </div>\n          )}\n        </div>\n      );\n    }\n\n    return (\n      <Link\n        key={item.name}\n        to={item.href}\n        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
n          isActive\n            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600'\n            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'\n        }`}\n        onClick={() => isMobile && setSidebarOpen(false)}\n      >\n        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />\n        {item.name}\n      </Link>\n    );\n  };\n\n  return (\n    <div className=\"min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50\">\n      {/* Mobile sidebar overlay */}\n      {sidebarOpen && (\n        <div\n          className=\"fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden\"\n          onClick={() => setSidebarOpen(false)}\n        />\n      )}\n\n      {/* Mobile sidebar */}\n      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 lg:hidden shadow-xl ${\n        sidebarOpen ? 'translate-x-0' : '-translate-x-full'\n      }`}>\n        <div className=\"flex h-16 items-center justify-between px-4 border-b border-gray-200\">\n          <div className=\"flex items-center space-x-2\">\n            <div className=\"w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center\">\n              <span className=\"text-white font-bold text-sm\">₹</span>\n            </div>\n            <span className=\"text-lg font-bold text-gray-900\">LoanCRM</span>\n          </div>\n          <button onClick={() => setSidebarOpen(false)} className=\"text-gray-400 hover:text-gray-600\">\n            <XMarkIcon className=\"h-6 w-6\" />\n          </button>\n        </div>\n        <nav className=\"flex-1 space-y-1 px-3 py-4 overflow-y-auto\">\n          {navigation.map((item) => (\n            <NavItem key={item.name} item={item} isMobile={true} />\n          ))}\n        </nav>\n      </div>\n\n      {/* Desktop sidebar */}\n      <div className=\"hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col\">\n        <div className=\"flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm\">\n          <div className=\"flex h-16 items-center px-6 border-b border-gray-200\">\n            <div className=\"flex items-center space-x-3\">\n              <div className=\"w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg\">\n                <span className=\"text-white font-bold\">₹</span>\n              </div>\n              <div>\n                <p className=\"text-sm font-bold text-gray-900\">Business Loan</p>\n                <p className=\"text-xs text-gray-500\">CRM Platform</p>\n              </div>\n            </div>\n          </div>\n          <nav className=\"flex-1 space-y-1 px-3 py-6 overflow-y-auto\">\n            {navigation.map((item) => (\n              <NavItem key={item.name} item={item} />\n            ))}\n          </nav>\n          <div className=\"p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg m-3\">\n            <p className=\"text-xs text-gray-600 mb-2\">💡 <span className=\"font-semibold\">Pro Tip:</span></p>\n            <p className=\"text-xs text-gray-600\">Use keyboard shortcuts for faster navigation</p>\n          </div>\n        </div>\n      </div>\n\n      {/* Main content */}\n      <div className=\"lg:pl-72\">\n        {/* Top navigation */}\n        <div className=\"sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm\">\n          <button\n            className=\"px-4 text-gray-500 hover:text-gray-600 focus:outline-none lg:hidden\"\n            onClick={() => setSidebarOpen(true)}\n          >\n            <Bars3Icon className=\"h-6 w-6\" />\n          </button>\n\n          <div className=\"flex flex-1 justify-between items-center px-6\">\n            {/* Search Bar */}\n            <div className=\"flex flex-1 max-w-md\">\n              <div className=\"relative w-full\">\n                <MagnifyingGlassIcon className=\"absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400\" />\n                <input\n                  className=\"block w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all\"\n                  placeholder=\"Search customers, loans...\"\n                />\n              </div>\n            </div>\n\n            {/* Right Actions */}\n            <div className=\"ml-6 flex items-center space-x-4\">\n              {/* Notifications */}\n              <div className=\"relative\">\n                <button className=\"relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors\">\n                  <BellIcon className=\"h-6 w-6\" />\n                  <span className=\"absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse\" />\n                </button>\n              </div>\n\n              <div className=\"h-8 w-px bg-gray-200\" />\n\n              {/* User Menu */}\n              <div className=\"flex items-center space-x-3\">\n                <div className=\"hidden sm:block text-right\">\n                  <p className=\"text-sm font-medium text-gray-900\">Admin User</p>\n                  <p className=\"text-xs text-gray-500\">Manager</p>\n                </div>\n                <div className=\"w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg\">\n                  A\n                </div>\n              </div>\n\n              {/* Logout */}\n              <button\n                onClick={handleLogout}\n                className=\"flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors\"\n                title=\"Logout\"\n              >\n                <ArrowRightOnRectangleIcon className=\"h-5 w-5\" />\n              </button>\n            </div>\n          </div>\n        </div>\n\n        {/* Page content */}\n        <main className=\"flex-1 p-6 lg:p-8\">\n          {children}\n        </main>\n      </div>\n    </div>\n  );\n};\n\nexport default EnhancedLayout;
