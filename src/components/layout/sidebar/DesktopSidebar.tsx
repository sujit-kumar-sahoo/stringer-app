'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Plus,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Database,
  RefreshCw
} from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { useCount } from '../../../context/CountContext';

// Type definitions
type ColorType = 'blue' | 'emerald' | 'purple' | 'orange' | 'yellow';

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  countKey?: keyof import('../../../context/CountContext').CountData;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count?: number;
  color: ColorType;
  href: string;
  subItems?: SubMenuItem[];
  countKey?: keyof import('../../../context/CountContext').CountData; 
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

const DesktopSidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { counts, isLoading, refreshCounts } = useCount(); 
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  
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
      href: '',
      
      
      subItems: [
        { 
          id: 'input-listing', 
          label: 'Wait List', 
          href: '/list/input/wait-list', 
          countKey: 'waitList'
        },
        { 
          id: 'input-wip', 
          label: 'Input WIP', 
          href: '/input/wip', 
          countKey: 'inputWip' 
        },
        { 
          id: 'details', 
          label: 'Details', 
          href: '/details', 
          // countKey: 'inputWip' 
        },

        { 
          id: 'input-to-stringer', 
          label: 'Input to Stringer', 
          href: '/input/to-stringer', 
          countKey: 'inputToStringer' 
        },
        { 
          id: 'output-to-input', 
          label: 'Output to Input', 
          href: '/input/to-input', 
          countKey: 'outputToInput' 
        },
        { 
          id: 'published', 
          label: 'Published', 
          href: '/input/published', 
          countKey: 'published' 
        },
      ]
    },
    { 
      id: 'input-create', 
      icon: FileText, 
      label: 'Create', 
      color: 'emerald', 
      href: '/create',
    },
    { 
      id: 'input-activity', 
      icon: FileText, 
      label: 'Activity log', 
      color: 'emerald', 
      href: '/activity-log',
    },
  ];

  const handleToggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) 
        ? prev.filter(menuId => menuId !== id)
        : [...prev, id]
    );
  };

  const handleRefreshCounts = async () => {
    await refreshCounts();
  };

  const isSubItemActive = (item: MenuItem): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => pathname === subItem.href);
  };

  const getColorClasses = (color: ColorType, isActive: boolean = false): string => {
    if (isActive) {
      return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-400 border-l-2 border-orange-400';
    }
    return 'hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 text-white hover:text-yellow-300 transition-all duration-200';
  };

  const getActiveIndicatorClasses = (): string => {
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

    const handleMainItemClick = (e: React.MouseEvent) => {
      if (isMinimized) {
        return;
      }

      if (hasSubItems) {
        e.preventDefault();
        onToggleExpand(item.id);
        return;
      }
    };

    // Get the count for this item
    const getItemCount = () => {
      if (item.countKey) {
        return counts[item.countKey];
      }
      return item.count;
    };

    const itemCount = getItemCount();

    // Render main item content
    const MainItemContent = () => (
      <div
        className={`
          group relative w-full flex items-center text-left transition-all duration-300 rounded-xl cursor-pointer
          ${isMinimized ? 'px-2 py-3 justify-center' : 'px-4 py-3'}
          ${getColorClasses(item.color, isParentActive)}
          transform hover:scale-105
        `}
        title={isMinimized ? item.label : undefined}
        onClick={handleMainItemClick}
      >
        {/* Icon */}
        <div className={`
          flex items-center justify-center transition-all duration-300
          ${isMinimized ? 'w-5 h-5' : 'w-5 h-5 mr-3'}
        `}>
          <item.icon className="w-5 h-5" />
        </div>
        
        {!isMinimized && (
          <div className="flex items-center justify-between flex-1">
            <span className="font-semibold text-sm">{item.label}</span>
            <div className="flex items-center space-x-2">
              {itemCount !== undefined && itemCount > 0 && (
                <span className={`
                  px-2.5 py-1 rounded-full text-xs font-bold
                  ${isParentActive 
                    ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                  }
                `}>
                  {isLoading ? '...' : itemCount}
                </span>
              )}
              {hasSubItems && (
                <div className="transition-transform duration-200 p-1 -m-1 rounded hover:bg-white/10">
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

        {isParentActive && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full ${getActiveIndicatorClasses()}`} />
        )}
      </div>
    );

    return (
      <div className="relative">
        {hasSubItems ? (
          <MainItemContent />
        ) : (
          <Link href={item.href}>
            <MainItemContent />
          </Link>
        )}

        {hasSubItems && !isMinimized && isExpanded && (
          <div className="ml-6 mt-1 space-y-1 border-l-2 border-slate-700/50 pl-4">
            {item.subItems?.map((subItem) => {
              const isSubActive = pathname === subItem.href;
              const subItemCount = subItem.countKey ? counts[subItem.countKey] : undefined;
              
              return (
                <Link
                  key={subItem.id}
                  href={subItem.href}
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
                    {subItemCount !== undefined && subItemCount > 0 && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${isSubActive 
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50'
                          : 'bg-slate-600/50 text-slate-400'
                        }
                      `}>
                        {isLoading ? '...' : subItemCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Tooltip for minimized state */}
        {isMinimized && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 border border-orange-400/30 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            {item.label}
            {itemCount && itemCount > 0 && <span className="ml-1 font-bold text-orange-300">({itemCount})</span>}
            {hasSubItems && (
              <div className="mt-1 pt-1 border-t border-slate-600/50">
                {item.subItems?.map((subItem) => {
                  const subItemCount = subItem.countKey ? counts[subItem.countKey] : undefined;
                  return (
                    <div key={subItem.id} className="text-xs text-slate-300">
                      {subItem.label}
                      {subItemCount !== undefined && subItemCount > 0 && (
                        <span className="ml-1 text-orange-300">({isLoading ? '...' : subItemCount})</span>
                      )}
                    </div>
                  );
                })}
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
     
    </div>
  );

  return (
    <div className={`
      bg-gradient-to-b from-slate-800 via-slate-900 to-blue-900
      border-r border-slate-700
      transition-all duration-500 ease-in-out
      backdrop-blur-xl
      shadow-2xl
      h-screen
      relative
      ${isOpen ? 'w-72' : 'w-20'}
    `}>
      {/* Toggle button */}
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
      
      {/* Navigation */}
      <nav className={`
        flex-1 transition-all duration-300 h-full
        ${isOpen ? 'p-6 overflow-y-auto' : 'p-4 overflow-hidden'}
      `}>
        <div>
          <SectionHeader title="Main" action isMinimized={!isOpen} />
          <div className="space-y-2">
            {mainItems.map((item: MenuItem) => (
              <SidebarItem 
                key={item.id} 
                item={item} 
                isActive={pathname === item.href}
                isMinimized={!isOpen}
                expandedMenus={expandedMenus}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Sticky Refresh Button */}
      <button 
        onClick={handleRefreshCounts}
        disabled={isLoading}
        className="fixed bottom-[7rem] left-[3rem] z-50 p-2 bg-orange-500 hover:bg-orange-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 hover:scale-110"
        title="Refresh counts"
      >
        <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default DesktopSidebar;