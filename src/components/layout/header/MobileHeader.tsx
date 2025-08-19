'use client';
import React from 'react';
import { Menu } from 'lucide-react';
import { LogoutComponent } from '../../ui/LogoutComponent';
import { SettingsComponent } from '../../ui/SettingsComponent';
import { useSidebar } from '../../../context/SidebarContext';

const MobileHeader: React.FC = () => {
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
      <div className="flex items-center space-x-3">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Super App
        </h1>
      </div>
      
      {/* Settings and Logout side by side with smaller gap */}
      <div className="flex items-center space-x-1">
        <SettingsComponent />
        <LogoutComponent />
      </div>
    </header>
  );
};

export default MobileHeader;