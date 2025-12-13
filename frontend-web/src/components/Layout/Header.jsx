import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, Search, Settings, FileSearch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AlertNotification from '../AlertNotification';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = React.useState('');

  const handleSearchLoan = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const target = query.trim();
    if (target) {
      navigate(`/loans?search=${encodeURIComponent(target)}`);
    } else {
      navigate('/loans');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              {sidebarOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            
            {/* Logo for mobile */}
            <div className="lg:hidden ml-4">
              <img src="/logo.svg" alt="Mini Business Loan" className="h-8 w-auto" />
            </div>

            {/* Brand for large screens */}
            <div className="hidden lg:flex items-center ml-6">
              <img src="/logo.svg" alt="Mini Business Loan" className="h-8 w-auto mr-3" />
              <Link to="/dashboard" className="text-lg font-semibold text-gray-800 hover:text-gray-900">Loan Management</Link>
            </div>
            
            {/* Global Search */}
            <div className="hidden md:block ml-6">
              <form onSubmit={handleSearchLoan} className="relative">
                <label htmlFor="global-search" className="sr-only">Search customers or loans</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="global-search"
                  name="global-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search customers, loans..."
                  aria-label="Search customers or loans"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </form>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Loan Button */}
            <button
              onClick={(e) => handleSearchLoan(e)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              title="Search Loans"
              aria-label="Open loan search"
            >
              <FileSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Search Loan</span>
            </button>
            
            {/* Alert Notifications */}
            <AlertNotification />
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
              <Settings className="h-5 w-5" />
            </button>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;