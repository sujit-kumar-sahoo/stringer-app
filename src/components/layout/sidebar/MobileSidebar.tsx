'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LucideIcon,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw
} from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { useCount } from '../../../context/CountContext';

// Import constants and types
import { 
  MAIN_MENU_ITEMS_STRINGER,
  MAIN_MENU_ITEMS_ADMIN,
  MAIN_MENU_ITEMS_INPUT,
  MAIN_MENU_ITEMS_OUTPUT,
  MenuItem,
  SubMenuItem,
  ColorType,
  getColorClasses,
  getActiveIndicatorClasses 
} from '@/constants/menuItems';

import { useRouter } from 'next/navigation';
import useAuth from "@/hooks/useAuth";

interface SidebarItemProps {
  item: MenuItem;
  isActive?: boolean;
  expandedMenus: string[];
  onToggleExpand: (id: string) => void;
  onItemClick?: () => void;
}

interface SectionHeaderProps {
  title: string;
  action?: boolean;
}

const MobileSidebar: React.FC = () => {
  /* ================ for permission start ================= */
  const { user } = useAuth();
  const router = useRouter();
  console.log('============sujit=============');
  console.log(user);
  console.log('============sujit=============');
  let MAIN_MENU_ITEMS: MenuItem[] = [];

  if(user?.role_name === "ROLE_STRINGER") 
  {
    MAIN_MENU_ITEMS = MAIN_MENU_ITEMS_STRINGER;
  }
  else if(user?.role_name === "ROLE_INPUT") 
  {
    MAIN_MENU_ITEMS = MAIN_MENU_ITEMS_INPUT;
  }
  else if(user?.role_name === "ROLE_OUTPUT") 
  {
    MAIN_MENU_ITEMS = MAIN_MENU_ITEMS_OUTPUT;
  }
  else if(user?.role_name === "ROLE_ADMIN") 
  {
    MAIN_MENU_ITEMS = MAIN_MENU_ITEMS_ADMIN;
  }
  /*useEffect(() => {
      const permissions = user?.role_data?.route?.MENU?.["Stringer"]?.["/stories/list"] || [];
      if (!permissions.includes("add")) {
      router.push('/');
      }
  }, [user, router]);*/
  /* ================ for permission end ================= */

  const { isOpen, toggleSidebar } = useSidebar();
  const { counts, isLoading, refreshCounts } = useCount();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleToggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) 
        ? prev.filter(menuId => menuId !== id)
        : [...prev, id]
    );
  };

  const handleMobileItemClick = () => {
    toggleSidebar();
  };

  const handleRefreshCounts = async () => {
    await refreshCounts();
  };

  const isSubItemActive = (item: MenuItem): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => pathname === subItem.href);
  };

  const SidebarItem: React.FC<SidebarItemProps> = ({ 
    item, 
    isActive = false, 
    expandedMenus,
    onToggleExpand,
    onItemClick
  }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isParentActive = isActive || isSubItemActive(item);

    const handleMainItemClick = (e: React.MouseEvent) => {
      if (hasSubItems) {
        e.preventDefault();
        onToggleExpand(item.id);
        return;
      }

      if (onItemClick) {
        onItemClick();
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
          group relative w-full flex items-center text-left transition-all duration-300 rounded-xl cursor-pointer px-4 py-4
          ${getColorClasses(item.color, isParentActive)}
          transform hover:scale-[1.02]
        `}
        onClick={handleMainItemClick}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-6 h-6 mr-4">
          <item.icon className="w-6 h-6" />
        </div>
        
        <div className="flex items-center justify-between flex-1">
          <span className="font-semibold text-base">{item.label}</span>
          <div className="flex items-center space-x-3">
            {itemCount !== undefined && itemCount > 0 && (
              <span className={`
                px-3 py-1.5 rounded-full text-xs font-bold
                ${isParentActive 
                  ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                }
              `}>
                {isLoading ? '...' : itemCount}
              </span>
            )}
            {hasSubItems && (
              <div className="transition-transform duration-200 p-1 rounded hover:bg-white/10">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            )}
          </div>
        </div>

        {isParentActive && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-10 rounded-r-full ${getActiveIndicatorClasses()}`} />
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

        {hasSubItems && isExpanded && (
          <div className="ml-8 mt-2 space-y-1 border-l-2 border-slate-700/50 pl-6">
            {item.subItems?.map((subItem) => {
              const isSubActive = pathname === subItem.href;
              const subItemCount = subItem.countKey ? counts[subItem.countKey] : undefined;

              return (
                <Link
                  key={subItem.id}
                  href={subItem.href}
                  className={`
                    block px-4 py-3 rounded-lg text-base transition-all duration-200
                    ${isSubActive 
                      ? 'bg-orange-500/20 text-orange-300 font-medium border-l-4 border-orange-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                  onClick={onItemClick}
                >
                  <div className="flex items-center justify-between">
                    <span>{subItem.label}</span>
                    {subItemCount !== undefined && subItemCount > 0 && (
                      <span className={`
                        px-2.5 py-1 rounded-full text-xs font-bold
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
      </div>
    );
  };

  const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action = false }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex items-center space-x-1">
        <button 
          onClick={handleRefreshCounts}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 disabled:opacity-50"
          title="Refresh counts"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );

  // Don't render anything if sidebar is closed on mobile
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={toggleSidebar}
      />

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 z-50 flex flex-col
        bg-gradient-to-b from-slate-800 via-slate-900 to-blue-900
        border-r border-slate-700
        backdrop-blur-xl
        shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with close button - Fixed at top */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Navigation</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>
        
        {/* Navigation content - Scrollable */}
        <nav className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <div>
            <SectionHeader title="Main" />
            <div className="space-y-1">
              {MAIN_MENU_ITEMS.map((item: MenuItem) => (
                <SidebarItem 
                  key={item.id} 
                  item={item} 
                  isActive={pathname === item.href}
                  expandedMenus={expandedMenus}
                  onToggleExpand={handleToggleExpand}
                  onItemClick={handleMobileItemClick}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;