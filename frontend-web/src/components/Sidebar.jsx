import React, { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'credit',
      name: 'Credit Management',
      icon: '💳',
      submenu: [
        { name: 'Customer Credit Analysis', path: '/credit/analysis' },
        { name: 'Credit Health Summary', path: '/credit/health' },
        { name: 'Loan-wise Credit Score', path: '/credit/scores' }
      ]
    },
    {
      id: 'loans',
      name: 'Disbursed Loans',
      icon: '💰',
      submenu: [
        { name: 'Active Portfolio', path: '/loans/active' },
        { name: 'Loan Search', path: '/loans/search' },
        { name: 'Performance Analytics', path: '/loans/analytics' }
      ]
    },
    {
      id: 'overdue',
      name: 'Overdue Management',
      icon: '⚠️',
      submenu: [
        { name: 'DPD Bucket View', path: '/overdue/buckets' },
        { name: 'Aging Analysis', path: '/overdue/aging' },
        { name: 'Follow-up Scheduler', path: '/overdue/followup' }
      ]
    },
    {
      id: 'legal',
      name: 'Legal Cases',
      icon: '⚖️',
      submenu: [
        { name: 'Notice Management', path: '/legal/notices' },
        { name: 'Court Case Tracking', path: '/legal/cases' },
        { name: 'Document Upload', path: '/legal/documents' }
      ]
    },
    {
      id: 'payments',
      name: 'Payment Processing',
      icon: '💸',
      submenu: [
        { name: 'Manual Payment Entry', path: '/payments/manual' },
        { name: 'Bulk Payment Upload', path: '/payments/bulk' },
        { name: 'Payment Allocation', path: '/payments/allocation' }
      ]
    },
    {
      id: 'reconciliation',
      name: 'Bank Reconciliation',
      icon: '🏦',
      submenu: [
        { name: 'UTR Matching', path: '/reconciliation/utr' },
        { name: 'Statement Upload', path: '/reconciliation/upload' },
        { name: 'Mismatch Resolution', path: '/reconciliation/mismatches' }
      ]
    },
    {
      id: 'customers',
      name: 'Customer Management',
      icon: '👤',
      submenu: [
        { name: 'Customer Profile', path: '/customers/profile' },
        { name: 'Loan History', path: '/customers/history' },
        { name: 'Call Log Management', path: '/customers/calls' }
      ]
    },
    {
      id: 'reports',
      name: 'Reports & Analytics',
      icon: '📊',
      submenu: [
        { name: 'Collection Performance', path: '/reports/collection' },
        { name: 'Aging Reports', path: '/reports/aging' },
        { name: 'Branch Performance', path: '/reports/branch' }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      submenu: [
        { name: 'User Management', path: '/settings/users' },
        { name: 'Role & Permissions', path: '/settings/roles' },
        { name: 'System Configuration', path: '/settings/config' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-gray-200/50 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">💼</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Loan CRM</h2>
              <p className="text-xs text-gray-500">Collections System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 h-full overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setActiveMenu(activeMenu === item.id ? '' : item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {item.submenu && (
                  <span className={`text-xs transition-transform duration-200 ${
                    activeMenu === item.id ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </span>
                )}
              </button>

              {/* Submenu */}
              {item.submenu && activeMenu === item.id && (
                <div className="ml-6 mt-2 space-y-1 animate-fade-in-up">
                  {item.submenu.map((subItem, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@loancrm.com</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-lg">⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;