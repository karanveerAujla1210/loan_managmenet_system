import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModernSidebar from './ModernSidebar';
import ModernHeader from './ModernHeader';
import { cn } from '../../lib/utils';

const ModernLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <ModernSidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />
      
      {/* Header */}
      <ModernHeader sidebarCollapsed={sidebarCollapsed} />
      
      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: sidebarCollapsed ? 80 : 280,
          paddingTop: 64 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default ModernLayout;