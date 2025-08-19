// NotificationComponent.tsx
'use client'
import React, { useState } from 'react';
import { Bell, Check, Trash2, X, User, FileText, AlertCircle, Settings } from 'lucide-react';
export interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info' | 'user';
  title: string;
  message: string;
  time: string;
  read: boolean;
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

const NotificationButton: React.FC<NotificationButtonProps> = ({ 
  notificationCount, 
  onClick, 
  isOpen, 
  isMobile = false 
}) => {
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
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      <div className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 border border-slate-200 rounded-xl z-50 max-h-96 overflow-hidden">
        
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

export const NotificationComponent: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
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
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="relative">
      <NotificationButton
        notificationCount={unreadCount}
        onClick={toggleNotifications}
        isOpen={isNotificationOpen}
      />
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
    </div>
  );
};
