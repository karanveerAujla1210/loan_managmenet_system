import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Segoe_UI']">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              <Outlet />
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
