'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Home,
  Plus,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Building,
  Database,
  Menu,
  X
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

// Type definitions
type ColorType = 'blue' | 'emerald' | 'purple' | 'orange' | 'yellow';

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  count?: number;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count?: number;
  color: ColorType;
  href: string;
  subItems?: SubMenuItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  isActive?: boolean;
  isMinimized?: boolean;
  expandedMenus: string[];
  onToggleExpand: (id: string) => void;
}

interface SectionHeaderProps {
  title: string;
  action?: boolean;
  isMinimized?: boolean;
}

const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mainItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      icon: FileText, 
      label: 'Dashboard', 
      color: 'emerald', 
      href: '/dashboard',
      subItems: [
        { id: 'dashboard-you', label: 'You', href: '/dashboard/you' },
        { id: 'dashboard-we', label: 'We', href: '/dashboard/we' },
        { id: 'dashboard-our', label: 'Our', href: '/dashboard/our' },
      ]
    },
   
    { 
      id: 'input', 
      icon: Database, 
      label: 'Input', 
      color: 'purple', 
      href: '/input',
      subItems: [
        { id: 'input-status', label: 'Activity Log', href: '/input/activity-log', count: 24 },
        { id: 'input-listing', label: 'Listing', href: '/input/listing', count: 24 },
        { id: 'input-edit', label: 'Edit', href: '/input/edit', count: 24 },
        { id: 'input-create', label: 'Create', href: '/input/create', count: 24 },
      ]
    },
  ];

  const handleToggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) 
        ? prev.filter(menuId => menuId !== id)
        : [...prev, id]
    );
  };

  const isSubItemActive = (item: MenuItem): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => pathname === subItem.href);
  };

  const getColorClasses = (color: ColorType, isActive: boolean = false, isMinimized: boolean = false): string => {
    if (isActive) {
      return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-400 border-l-2 border-orange-400';
    }
    return 'hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 text-white hover:text-yellow-300 transition-all duration-200';
  };

  const getActiveIndicatorClasses = (color: ColorType, isMinimized: boolean = false): string => {
    return 'bg-gradient-to-b from-orange-400 to-yellow-500 shadow-lg shadow-orange-500/50';
  };

  const SidebarItem: React.FC<SidebarItemProps> = ({ 
    item, 
    isActive = false, 
    isMinimized = false,
    expandedMenus,
    onToggleExpand
  }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isParentActive = isActive || isSubItemActive(item);

    return (
      <div className="relative">
        <div
          className={`
            group relative w-full flex items-center text-left transition-all duration-300 rounded-xl cursor-pointer
            ${isMinimized ? 'px-2 py-3 justify-center' : 'px-4 py-3'}
            ${getColorClasses(item.color, isParentActive, isMinimized)}
            transform hover:scale-105
          `}
          onClick={() => {
            if (hasSubItems && !isMinimized) {
              onToggleExpand(item.id);
            } else {
              // Close sidebar on mobile after selection
              if (isMobile) {
                closeSidebar();
              }
            }
          }}
          title={isMinimized ? item.label : undefined}
        >
          {/* Icon */}
          <div className={`
            flex items-center justify-center transition-all duration-300
            ${isMinimized ? 'w-5 h-5' : 'w-5 h-5 mr-3'}
          `}>
            <item.icon className="w-5 h-5" />
          </div>
          
          {/* Label and count - only show when not minimized */}
          {!isMinimized && (
            <div className="flex items-center justify-between flex-1">
              <span className="font-semibold text-sm">{item.label}</span>
              <div className="flex items-center space-x-2">
                {item.count && (
                  <span className={`
                    px-2.5 py-1 rounded-full text-xs font-bold
                    ${isParentActive 
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                    }
                  `}>
                    {item.count}
                  </span>
                )}
                {hasSubItems && (
                  <div className="transition-transform duration-200">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced active indicator */}
          {isParentActive && (
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full ${getActiveIndicatorClasses(item.color, isMinimized)}`} />
          )}
        </div>

        {/* Submenu items */}
        {hasSubItems && !isMinimized && isExpanded && (
          <div className="ml-6 mt-1 space-y-1 border-l-2 border-slate-700/50 pl-4">
            {item.subItems?.map((subItem) => {
              const isSubActive = pathname === subItem.href;
              return (
                <Link
                  key={subItem.id}
                  href={subItem.href}
                  onClick={() => {
                    // Close sidebar on mobile after selection
                    if (isMobile) {
                      closeSidebar();
                    }
                  }}
                  className={`
                    block px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${isSubActive 
                      ? 'bg-orange-500/20 text-orange-300 font-medium border-l-2 border-orange-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{subItem.label}</span>
                    {subItem.count && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${isSubActive 
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50'
                          : 'bg-slate-600/50 text-slate-400'
                        }
                      `}>
                        {subItem.count}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Tooltip for minimized state */}
        {isMinimized && !isMobile && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 border border-orange-400/30 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            {item.label}
            {item.count && <span className="ml-1 font-bold text-orange-300">({item.count})</span>}
            {hasSubItems && (
              <div className="mt-1 pt-1 border-t border-slate-600/50">
                {item.subItems?.map((subItem, index) => (
                  <div key={subItem.id} className="text-xs text-slate-300">
                    {subItem.label}
                    {subItem.count && <span className="ml-1 text-orange-300">({subItem.count})</span>}
                  </div>
                ))}
              </div>
            )}
            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
          </div>
        )}
      </div>
    );
  };

  const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action = false, isMinimized = false }) => (
    <div className={`flex items-center justify-between mb-3 ${isMinimized ? 'hidden' : ''}`}>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </h3>
      {action && (
        <button className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
          <Plus className="w-3 h-3 text-slate-400 hover:text-white" />
        </button>
      )}
    </div>
  );

  const handleOverlayClick = (): void => {
    closeSidebar();
  };

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-white font-semibold text-lg">Dashboard</h1>
          <div className="w-9" /> 
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Fixed Sidebar */}
      <div className={`
        bg-gradient-to-b from-slate-800 via-slate-900 to-blue-900
        border-r border-slate-700
        transition-all duration-500 ease-in-out
        fixed top-0 left-0 h-full z-50
        lg:relative lg:z-auto
        backdrop-blur-xl
        shadow-2xl
        ${isMobile ? (
          `w-64 pt-16 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        ) : (
          `${isOpen ? 'w-72 translate-x-0' : 'w-20 translate-x-0'} pt-0`
        )}
      `}>
        
        {/* Toggle button in the middle of the sidebar - Desktop only */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 w-6 h-12 bg-orange-500 hover:bg-orange-400 border border-orange-400 rounded-r-lg shadow-lg hover:shadow-xl flex items-center justify-center text-white hover:text-white transition-all duration-300 hover:scale-110"
            aria-label={isOpen ? 'Minimize sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* Navigation */}
        <nav className={`
          flex-1 transition-all duration-300 h-full
          ${(isOpen || !isMobile) ? 'p-6 overflow-y-auto' : 'p-4 overflow-hidden'}
        `}>
          <div>
            <SectionHeader title="Main" isMinimized={!isOpen && !isMobile} />
            <div className="space-y-2">
              {mainItems.map((item: MenuItem) => (
                <SidebarItem 
                  key={item.id} 
                  item={item} 
                  isActive={pathname === item.href}
                  isMinimized={!isOpen && !isMobile}
                  expandedMenus={expandedMenus}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;