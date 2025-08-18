'use client'
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Settings, User, FileText, AlertCircle, LogOut, ChevronDown, X, Menu } from 'lucide-react';

// Type definitions
interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info' | 'user';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface ProfileButtonProps {
  onClick: () => void;
}

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsButtonProps {
  onClick: () => void;
  isOpen: boolean;
  isMobile?: boolean;
}

interface LogoutButtonProps {
  onClick: () => void;
  isMobile?: boolean;
}

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface NotificationButtonProps {
  notificationCount: number;
  onClick: () => void;
  isOpen: boolean;
  isMobile?: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
  isMobile?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

// Profile Button Component
const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
    >
      <User className="w-4 h-4 mr-3" />
      Profile Settings
    </button>
  );
};

// Mobile Menu Component
const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  unreadCount,
  onNotificationClick,
  onSettingsClick,
  onLogoutClick,
  onMarkAsRead,
  onDelete,
  onClearAll
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (type) {
      case 'success':
        return <Check {...iconProps} className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <X {...iconProps} className="w-4 h-4 text-red-600" />;
      case 'user':
        return <User {...iconProps} className="w-4 h-4 text-blue-600" />;
      case 'info':
      default:
        return <FileText {...iconProps} className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotificationBackground = (type: Notification['type']): string => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Menu Panel */}
      <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'notifications'
                ? 'text-orange-600 bg-orange-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            {activeTab === 'notifications' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'settings'
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'notifications' && (
            <div className="h-full flex flex-col">
              {/* Notifications Header */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-700">Your Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={onClearAll}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 transition-all duration-200 ${
                          !notification.read ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${getNotificationBackground(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-slate-900' : 'text-slate-600'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              
                              <div className="flex flex-col items-center space-y-1 ml-2 flex-shrink-0">
                                {!notification.read && (
                                  <button
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4 text-slate-400 hover:text-green-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() => onDelete(notification.id)}
                                  className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                                  title="Delete notification"
                                >
                                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-medium text-slate-700 mb-3">Account</h3>
                <div className="space-y-2">
                  <button className="flex items-center w-full px-3 py-3 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <User className="w-4 h-4 mr-3" />
                    Profile Settings
                  </button>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-medium text-slate-700 mb-3">Preferences</h3>
                <div className="space-y-2">
                  <button className="flex items-center w-full px-3 py-3 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell className="w-4 h-4 mr-3" />
                    Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              onLogoutClick();
              onClose();
            }}
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Settings Dropdown Component (Desktop)
const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ isOpen, onClose }) => {
  const handleProfileClick = (): void => {
    console.log('Profile settings clicked');
    alert('Profile settings opened!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Panel */}
      <div className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 border border-slate-200 rounded-xl z-50 py-2 shadow-lg">
        <div className="px-3 py-2 border-b border-slate-200 mb-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Settings</p>
        </div>
        
        <div className="space-y-1 px-2">
          <ProfileButton onClick={handleProfileClick} />
        </div>
      </div>
    </>
  );
};

// Settings Button Component
const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick, isOpen, isMobile = false }) => {
  if (isMobile) return null;
  
  return (
    <button
      onClick={onClick}
      className={`group relative p-3 rounded-xl transition-all duration-300 mr-4 ${
        isOpen 
          ? 'bg-gradient-to-br from-slate-100 to-gray-100 border border-slate-300 scale-105'
          : 'bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 hover:border-slate-300 hover:scale-105'
      }`}
      aria-label="Toggle settings"
    >
      <div className="relative flex items-center">
        <Settings className={`w-5 h-5 transition-colors duration-200 ${
          isOpen 
            ? 'text-slate-600' 
            : 'text-slate-600 group-hover:text-slate-700'
        }`} />
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        } ${
          isOpen 
            ? 'text-slate-600' 
            : 'text-slate-600 group-hover:text-slate-700'
        }`} />
      </div>
    </button>
  );
};

// Logout Button Component
const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, isMobile = false }) => {
  if (isMobile) return null;
  
  return (
    <button
      onClick={onClick}
      className="group relative p-3 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 hover:border-red-300 transition-all duration-300 mr-4 hover:scale-105"
      aria-label="Logout"
      title="Logout"
    >
      <div className="relative">
        <LogOut className="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors duration-200" />
      </div>
    </button>
  );
};

// Logout Confirmation Modal
const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 border border-slate-200 rounded-xl max-w-md w-full p-6">
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-full">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
            Confirm Logout
          </h2>

          {/* Message */}
          <p className="text-sm text-slate-600 text-center mb-6">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-gradient-to-r hover:from-slate-200 hover:to-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Notification Button Component
const NotificationButton: React.FC<NotificationButtonProps> = ({ notificationCount, onClick, isOpen, isMobile = false }) => {
  if (isMobile) return null;
  
  return (
    <button
      onClick={onClick}
      className={`group relative p-3 rounded-xl transition-all duration-300 mr-4 ${
        isOpen 
          ? 'bg-gradient-to-br from-orange-100 to-red-100 border border-orange-300 scale-105'
          : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover:border-orange-300 hover:scale-105'
      }`}
      aria-label="Toggle notifications"
    >
      <div className="relative">
        <Bell className={`w-5 h-5 transition-colors duration-200 ${
          isOpen 
            ? 'text-orange-600' 
            : 'text-orange-600 group-hover:text-orange-700'
        }`} />
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </div>
    </button>
  );
};

// Notification Panel Component (Desktop)
const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onDelete, 
  onClearAll,
  isMobile = false
}) => {
  if (!isOpen || isMobile) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (type) {
      case 'success':
        return <Check {...iconProps} className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <X {...iconProps} className="w-4 h-4 text-red-600" />;
      case 'user':
        return <User {...iconProps} className="w-4 h-4 text-blue-600" />;
      case 'info':
      default:
        return <FileText {...iconProps} className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotificationBackground = (type: Notification['type']): string => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 border border-slate-200 rounded-xl z-50 max-h-96 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Notifications</h3>
            <div className="flex items-center space-x-2">
              {notifications.filter(n => !n.read).length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-all duration-200 hover:bg-slate-100 ${
                    !notification.read ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getNotificationBackground(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-slate-900' : 'text-slate-600'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1 hover:bg-slate-200 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 text-slate-400 hover:text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(notification.id)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100">
            <button className="w-full text-xs text-slate-600 hover:text-slate-700 font-medium transition-colors flex items-center justify-center space-x-1">
              <Settings className="w-3 h-3" />
              <span>Notification Settings</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Header Component
export const Header: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Document Saved',
      message: 'Your document has been successfully saved to the cloud.',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'user',
      title: 'New Team Member',
      message: 'John Doe has joined your workspace.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Storage Almost Full',
      message: 'You are using 85% of your storage space.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'New features are now available in your dashboard.',
      time: '1 day ago',
      read: false
    },
    {
      id: 5,
      type: 'error',
      title: 'Connection Failed',
      message: 'Could not sync data. Please check your connection.',
      time: '2 days ago',
      read: true
    }
  ]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Close desktop dropdowns when switching to mobile
      if (mobile) {
        setIsNotificationOpen(false);
        setIsSettingsOpen(false);
      } else {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number): void => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDelete = (id: number): void => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = (): void => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleNotifications = (): void => {
    if (isMobile) {
      setIsMobileMenuOpen(true);
    } else {
      setIsNotificationOpen(!isNotificationOpen);
      if (isSettingsOpen) setIsSettingsOpen(false);
    }
  };

  const toggleSettings = (): void => {
    if (isMobile) {
      setIsMobileMenuOpen(true);
    } else {
      setIsSettingsOpen(!isSettingsOpen);
      if (isNotificationOpen) setIsNotificationOpen(false);
    }
  };

  const handleLogout = (): void => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = (): void => {
    console.log('User logged out');
    setIsLogoutModalOpen(false);
    alert('Logged out successfully!');
  };

  const cancelLogout = (): void => {
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="flex justify-between items-center  p-6 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200 relative">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-1">
            Super App
          </h1>
        </div>
      </div>
      
      <div className="flex items-center relative">
        <LogoutButton onClick={handleLogout} />
        <NotificationButton
          notificationCount={unreadCount}
          onClick={toggleNotifications}
          isOpen={isNotificationOpen}
        />
        <SettingsButton
          onClick={toggleSettings}
          isOpen={isSettingsOpen}
        />
        
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
        
        <SettingsDropdown
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={cancelLogout}
          onConfirm={confirmLogout}
        />
      </div>
    </header>
  );
};