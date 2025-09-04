import { 
  FileText,
  LucideIcon,
  Database,
} from 'lucide-react';
import { CountData } from '../context/CountContext';

// Type definitions
export type ColorType = 'blue' | 'emerald' | 'purple' | 'orange' | 'yellow';

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  countKey?: keyof CountData;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count?: number;
  color: ColorType;
  href: string;
  subItems?: SubMenuItem[];
  countKey?: keyof CountData; 
}

// Menu Items Configuration
export const MAIN_MENU_ITEMS: MenuItem[] = [
  { 
    id: 'dashboard', 
    icon: FileText, 
    label: 'Dashboard', 
    color: 'emerald', 
    href: '/dashboard',
    subItems: [
      { id: 'dashboard-input', label: 'Input', href: '/dashboard/input' },
      { id: 'dashboard-output', label: 'Output', href: '/dashboard/output' },
      { id: 'dashboard-stringer', label: 'Stringer', href: '/dashboard/stringer' },
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
        href: '/list/input/waitList', 
        countKey: 'waitList'
      },
      { 
        id: 'input-wip', 
        label: 'Input WIP', 
        href: '/list/input/inputWip', 
        countKey: 'inputWip' 
      },
      { 
        id: 'input-to-stringer', 
        label: 'Input to Stringer', 
        href: '/list/input/inputToStringer', 
        countKey: 'inputToStringer' 
      },
      { 
        id: 'waiting-in-output', 
        label: 'Waiting In Output', 
        href: '/list/input/waitingInOutput', 
        countKey: 'inputToStringer' 
      },
      { 
        id: 'output-to-input', 
        label: 'Output to Input', 
        href: '/list/input/outputToInput', 
        countKey: 'outputToInput' 
      },
      
      { 
        id: 'published', 
        label: 'Published', 
        href: '/list/input/published', 
        countKey: 'published' 
      },
      { 
        id: 'draft', 
        label: 'Draft', 
        href: '/list/input/inputDraft', 
        countKey: 'draft' 
      }
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
  {
  id: 'master', 
    icon: FileText, 
    label: 'Master', 
    color: 'emerald', 
    href: '/master',
    subItems: [
      { id: 'master-location', label: 'Add Location', href: '/master/location' },
      { id: 'master-tag', label: 'Add Tag', href: '/master/tag' },
      { id: 'master-content', label: 'Add ContentType', href: '/master/content' },
      { id: 'master-role', label: 'Add Role', href: '/master/role' },
      { id: 'master-user', label: 'Add User', href: '/master/user' },
    ]
  },
];

// Color utility functions
export const getColorClasses = (color: ColorType, isActive: boolean = false): string => {
  if (isActive) {
    return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-400 border-l-2 border-orange-400';
  }
  return 'hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 text-white hover:text-yellow-300 transition-all duration-200';
};

export const getActiveIndicatorClasses = (): string => {
  return 'bg-gradient-to-b from-orange-400 to-yellow-500 shadow-lg shadow-orange-500/50';
};