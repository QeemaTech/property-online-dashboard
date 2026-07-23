import { NavLink } from 'react-router-dom';
import {
  Bell,
  Building,
  Building2,
  FileText,
  FolderKanban,
  Home,
  Image,
  Landmark,
  Layers,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Users,
  MonitorSmartphone,
  BadgePercent,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

const menuItems = [
  { path: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/developers', labelKey: 'developers', icon: Building2 },
  { path: '/projects', labelKey: 'projects', icon: FolderKanban },
  { path: '/units', labelKey: 'units', icon: Home },
  { path: '/countries', labelKey: 'countries', icon: MapPin },
  { path: '/cities', labelKey: 'cities', icon: Landmark },
  { path: '/areas', labelKey: 'areas', icon: MapPin },
  { path: '/unit-categories', labelKey: 'unitCategories', icon: Tag },
  { path: '/unit-types', labelKey: 'unitTypes', icon: Layers },
  { path: '/amenities', labelKey: 'amenities', icon: Sparkles },
  { path: '/facilities', labelKey: 'facilities', icon: Building },
  { path: '/banners', labelKey: 'banners', icon: Image },
  { path: '/offers', labelKey: 'offers', icon: BadgePercent },
  { path: '/onboarding', labelKey: 'onboarding', icon: SlidersHorizontal },
  { path: '/app-screens', labelKey: 'appScreens', icon: MonitorSmartphone },
  { path: '/pages', labelKey: 'pages', icon: FileText },
  { path: '/inquiries', labelKey: 'inquiries', icon: MessageSquare },
  { path: '/notifications', labelKey: 'notifications', icon: Bell },
  { path: '/users', labelKey: 'users', icon: Users },
  { path: '/settings', labelKey: 'settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { t, isRtl } = useI18n();
  const closedTransform = isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 ${isRtl ? 'right-0' : 'left-0'} h-full w-64 bg-sidebar text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : closedTransform} overflow-y-auto`}
      >
        <div className="p-4 border-b border-sidebar-hover">
          <h1 className="text-xl font-bold text-center">Property Online</h1>
          <p className="text-xs text-gray-400 text-center mt-1">{t('layout.sidebar.subtitle')}</p>
        </div>
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'}`
              }
              end={item.path === '/'}
            >
              <item.icon size={18} />
              <span>{t(`layout.sidebar.${item.labelKey}`)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
