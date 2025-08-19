'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider } from '../../context/SidebarContext';

// Desktop components
import  DesktopHeader  from '../../components/layout/header/DesktopHeader';
import DesktopSidebar from '../../components/layout/sidebar/DesktopSidebar';
import DesktopMainContent from '../../components/layout/mainContent/DesktopMainContent';

// Mobile components
import MobileHeader from '../../components/layout/header/MobileHeader';
import MobileSidebar from '../../components/layout/sidebar/MobileSidebar';
import MobileMainContent from '../../components/layout/mainContent/MobileMainContent';

// Custom hook to detect mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // You can adjust this breakpoint as needed (768px is common for tablet/mobile)
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  // Conditional component selection
  const Header = isMobile ? MobileHeader : DesktopHeader;
  const Sidebar = isMobile ? MobileSidebar : DesktopSidebar;
  const MainContent = isMobile ? MobileMainContent : DesktopMainContent;

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
}