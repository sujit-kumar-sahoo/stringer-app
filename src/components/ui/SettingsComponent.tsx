'use client'

import React, { useState } from 'react';
import { Settings, User } from 'lucide-react';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ isOpen, onClose }) => {
  const handleGeneralSettings = (): void => {
    console.log('General settings clicked');
    alert('General settings opened!');
    onClose();
  };

  const handlePreferences = (): void => {
    console.log('Preferences clicked');
    alert('Preferences opened!');
    onClose();
  };

  const handleAccount = (): void => {
    console.log('Account settings clicked');
    alert('Account settings opened!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-transparent z-40"
        onClick={onClose}
      />
      
      <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl z-50 shadow-xl overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Settings</p>
        </div>
        
        <div className="py-2">
          <button
            onClick={handleGeneralSettings}
            className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <Settings className="w-4 h-4 mr-3 text-slate-500" />
            <span>General Settings</span>
          </button>
          
          <button
            onClick={handlePreferences}
            className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <Settings className="w-4 h-4 mr-3 text-slate-500" />
            <span>Preferences</span>
          </button>

          <button
            onClick={handleAccount}
            className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <User className="w-4 h-4 mr-3 text-slate-500" />
            <span>Account Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
        isOpen
          ? 'bg-gradient-to-br from-slate-100 to-gray-100 border-2 border-slate-300 shadow-md'
          : 'bg-gradient-to-br from-slate-100 to-gray-100 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-105'
      }`}
      aria-label="Open profile settings"
    >
      <div className={`relative flex items-center justify-center w-full h-full rounded-full ${
        isOpen ? 'bg-gradient-to-br from-white to-slate-50' : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <User className={`w-5 h-5 transition-colors duration-200 ${
          isOpen
            ? 'text-slate-600'
            : 'text-slate-500 group-hover:text-slate-700'
        }`} />
      </div>
    </button>
  );
};

export const SettingsComponent: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const toggleSettings = (): void => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="relative">
      <ProfileButton
        onClick={toggleSettings}
        isOpen={isSettingsOpen}
      />
      <SettingsDropdown
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};