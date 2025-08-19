'use client'
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { logout } from "@/services/authService";
import useAuth from "@/hooks/useAuth"; 

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

interface LogoutButtonProps {
  onClick: () => void;
  isMobile?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 border border-slate-200 rounded-xl max-w-md w-full p-6">
          
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-full">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
            Confirm Logout
          </h2>

          <p className="text-sm text-slate-600 text-center mb-6">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-gradient-to-r hover:from-slate-200 hover:to-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Logging out...</span>
                </>
              ) : (
                <span>Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

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

export const LogoutComponent: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const { logout: contextLogout } = useAuth();

  const handleLogout = (): void => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async (): void => {
    setIsLoggingOut(true);
    try {
      // Call API logout
      const response = await logout();
      
      if (response.success) {
        // Immediately call context logout which handles redirect
        contextLogout();
        console.log('User logged out successfully');
      } else {
        console.error('Logout failed:', response.message);
        // Still logout from context even if API fails
        contextLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout from context even if API fails
      contextLogout();
    }
    // Don't need to set loading false or close modal here since component will unmount
  };

  const cancelLogout = (): void => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <LogoutButton onClick={handleLogout} />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};