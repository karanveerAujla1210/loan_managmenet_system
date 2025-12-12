import { Link } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

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
          </div>
          
          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
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
