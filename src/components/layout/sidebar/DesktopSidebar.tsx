"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { useSidebar } from "../../../context/SidebarContext";
import { useCount } from "../../../context/CountContext";

import {
  MAIN_MENU_ITEMS_STRINGER,
  MAIN_MENU_ITEMS_ADMIN,
  MAIN_MENU_ITEMS_INPUT,
  MAIN_MENU_ITEMS_OUTPUT,
  
  MenuItem,
  getColorClasses,
  getActiveIndicatorClasses,
} from "@/constants/menuItems";

import { useRouter } from 'next/navigation';
import useAuth from "@/hooks/useAuth";

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

  /* ================ for permition start ================= */
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
  /* ================ for permition end ================= */


  const { isOpen, toggleSidebar } = useSidebar();
  const { counts, isLoading, refreshCounts } = useCount();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleToggleExpand = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id]
    );
  };

  const handleRefreshCounts = async () => {
    await refreshCounts();
  };

  const isSubItemActive = (item: MenuItem): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem) => pathname === subItem.href);
  };

  const SidebarItem: React.FC<SidebarItemProps> = ({
    item,
    isActive = false,
    isMinimized = false,
    expandedMenus,
    onToggleExpand,
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
          ${isMinimized ? "px-2 py-3 justify-center" : "px-4 py-3"}
          ${getColorClasses(item.color, isParentActive)}
          transform hover:scale-105
        `}
        title={isMinimized ? item.label : undefined}
        onClick={handleMainItemClick}
      >
        {/* Icon */}
        <div
          className={`
          flex items-center justify-center transition-all duration-300
          ${isMinimized ? "w-5 h-5" : "w-5 h-5 mr-3"}
        `}
        >
          <item.icon className="w-5 h-5" />
        </div>

        {!isMinimized && (
          <div className="flex items-center justify-between flex-1">
            <span className="font-semibold text-sm">{item.label}</span>
            <div className="flex items-center space-x-2">
              {itemCount !== undefined && itemCount > 0 && (
                <span
                  className={`
                  px-2.5 py-1 rounded-full text-xs font-bold
                  ${
                    isParentActive
                      ? "bg-orange-500/30 text-orange-300 border border-orange-400/50"
                      : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  }
                `}
                >
                  {isLoading ? "..." : itemCount}
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
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full ${getActiveIndicatorClasses()}`}
          />
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
              const subItemCount = subItem.countKey
                ? counts[subItem.countKey]
                : undefined;

              return (
                <Link
                  key={subItem.id}
                  href={subItem.href}
                  className={`
                    block px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${
                      isSubActive
                        ? "bg-orange-500/20 text-orange-300 font-medium border-l-2 border-orange-400"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{subItem.label}</span>
                    {subItemCount !== undefined && subItemCount > 0 && (
                      <span
                        className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${
                          isSubActive
                            ? "bg-orange-500/30 text-orange-300 border border-orange-400/50"
                            : "bg-slate-600/50 text-slate-400"
                        }
                      `}
                      >
                        {isLoading ? "..." : subItemCount}
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
            {itemCount && itemCount > 0 && (
              <span className="ml-1 font-bold text-orange-300">
                ({itemCount})
              </span>
            )}
            {hasSubItems && (
              <div className="mt-1 pt-1 border-t border-slate-600/50">
                {item.subItems?.map((subItem) => {
                  const subItemCount = subItem.countKey
                    ? counts[subItem.countKey]
                    : undefined;
                  return (
                    <div key={subItem.id} className="text-xs text-slate-300">
                      {subItem.label}
                      {subItemCount !== undefined && subItemCount > 0 && (
                        <span className="ml-1 text-orange-300">
                          ({isLoading ? "..." : subItemCount})
                        </span>
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

  const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    action = false,
    isMinimized = false,
  }) => (
    <div
      className={`flex items-center justify-between mb-3 ${
        isMinimized ? "hidden" : ""
      }`}
    ></div>
  );

  return (
    <div
      className={`
  bg-gradient-to-b from-slate-800 via-slate-900 to-blue-900
  border-r border-slate-700
  transition-all duration-500 ease-in-out
  backdrop-blur-xl
  shadow-2xl
  h-screen
  relative
  flex flex-col
  ${isOpen ? "w-72" : "w-20"}
`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 w-6 h-12 bg-orange-500 hover:bg-orange-400 border border-orange-400 rounded-r-lg shadow-lg hover:shadow-xl flex items-center justify-center text-white hover:text-white transition-all duration-300 hover:scale-110"
        aria-label={isOpen ? "Minimize sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Navigation - Made scrollable */}
      <nav
        className={`
  flex-1 overflow-y-auto overflow-x-hidden min-h-0
  ${isOpen ? "px-6 py-6" : "px-4 py-4"}
  scrollbar-hide
`}
      >
        <div>
          <SectionHeader title="Main" action isMinimized={!isOpen} />
          <div className="space-y-2">
            {MAIN_MENU_ITEMS.map((item: MenuItem) => (
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

      {/* Refresh Button - Fixed at bottom */}
      <div
        className={`
  flex-shrink-0
  ${isOpen ? "p-6 pt-0" : "p-4 pt-0"}
  border-t border-slate-700/50
  bg-gradient-to-t from-slate-900 to-transparent
`}
      >
        <button
          onClick={handleRefreshCounts}
          disabled={isLoading}
          className={`
            w-full p-3 bg-orange-500 hover:bg-orange-400 rounded-lg shadow-lg 
            hover:shadow-xl transition-all duration-300 disabled:opacity-50 
            hover:scale-105 flex items-center justify-center space-x-2
            ${!isOpen ? "px-2" : ""}
          `}
          title="Refresh counts"
        >
          <RefreshCw
            className={`w-5 h-5 text-white ${isLoading ? "animate-spin" : ""}`}
          />
          {isOpen && <span className="text-white font-medium">Refresh</span>}
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;
