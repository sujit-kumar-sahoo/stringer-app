'use client';
import React from 'react';
import { LogoutComponent } from '../../ui/LogoutComponent';
import { SettingsComponent } from '../../ui/SettingsComponent';

const DesktopHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-1">
            Super App
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <LogoutComponent />
        <SettingsComponent />
      </div>
    </header>
  );
};

export default DesktopHeader;