import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/admin/utils';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  Megaphone,
  Star,
  MessageSquare,
  MessageCircle,
  Users as UsersIcon,
  BarChart3,
  FileBarChart,
  Bell,
  Settings,
  LogOut,
  Store,
  ChevronDown,
  Leaf,
  Circle,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, permission: PERMISSIONS.VIEW_DASHBOARD },
  { label: 'Orders', href: '/admin/orders', icon: <Package className="h-4 w-4" />, permission: PERMISSIONS.VIEW_ORDERS },
  { label: 'Customers', href: '/admin/customers', icon: <Users className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_CUSTOMERS },
  {
    label: 'Products',
    href: '/admin/products',
    icon: <Package className="h-4 w-4" />,
    permission: PERMISSIONS.VIEW_PRODUCTS,
    children: [
      { label: 'All Products', href: '/admin/products', icon: <Circle className="h-3 w-3" /> },
      { label: 'Categories', href: '/admin/categories', icon: <Circle className="h-3 w-3" /> },
      { label: 'Inventory', href: '/admin/inventory', icon: <Circle className="h-3 w-3" /> },
    ],
  },
  { label: 'Suppliers', href: '/admin/suppliers', icon: <Truck className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_SUPPLIERS },
  {
    label: 'Marketing',
    href: '/admin/marketing',
    icon: <Megaphone className="h-4 w-4" />,
    permission: PERMISSIONS.MANAGE_CAMPAIGNS,
    children: [
      { label: 'Festival Offers & Combos', href: '/admin/marketing/offers', icon: <Circle className="h-3 w-3" /> },
      { label: 'Campaigns', href: '/admin/marketing/campaigns', icon: <Circle className="h-3 w-3" /> },
      { label: 'Coupons & Deals', href: '/admin/marketing/coupons', icon: <Circle className="h-3 w-3" /> },
      { label: 'Social Media', href: '/admin/marketing/social', icon: <Circle className="h-3 w-3" /> },
    ],
  },
  { label: 'Reviews', href: '/admin/reviews', icon: <Star className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_REVIEWS },
  {
    label: 'Content',
    href: '/admin/blog',
    icon: <MessageSquare className="h-4 w-4" />,
    children: [
      { label: 'Blog Posts', href: '/admin/blog', icon: <Circle className="h-3 w-3" /> },
      { label: 'Recipes', href: '/admin/recipes', icon: <Circle className="h-3 w-3" /> },
      { label: 'Gallery', href: '/admin/gallery', icon: <Circle className="h-3 w-3" /> },
      { label: 'Media', href: '/admin/media', icon: <Circle className="h-3 w-3" /> },
      { label: 'Website Pages', href: '/admin/pages', icon: <Circle className="h-3 w-3" /> },
    ],
  },
  { label: 'Messages', href: '/admin/messages', icon: <MessageCircle className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_MESSAGES },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" />, permission: PERMISSIONS.VIEW_ANALYTICS },
  { label: 'Reports', href: '/admin/reports', icon: <FileBarChart className="h-4 w-4" />, permission: PERMISSIONS.VIEW_REPORTS },
  { label: 'Users & Roles', href: '/admin/users', icon: <UsersIcon className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_USERS },
  { label: 'Notifications', href: '/admin/notifications', icon: <Bell className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_NOTIFICATIONS },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-4 w-4" />, permission: PERMISSIONS.MANAGE_SETTINGS },
];

export interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  mobileOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const [openGroups, setOpenGroups] = React.useState<string[]>([]);

  const isCollapsed = onToggleCollapse !== undefined ? collapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));

  // Check if any child is active to auto-expand
  React.useEffect(() => {
    const activeGroups = navItems
      .filter((item) => item.children?.some((child) => pathname?.startsWith(child.href)))
      .map((item) => item.label);
    setOpenGroups((prev) => Array.from(new Set([...prev, ...activeGroups])));
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
          'lg:static lg:z-30',
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-64',
          mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo & Header */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">Nature&apos;s Mud</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', isCollapsed ? 'rotate-90' : '-rotate-90')} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="flex lg:hidden ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href) || item.children?.some((c) => pathname?.startsWith(c.href));
            const hasChild = !!item.children?.length;
            const isOpen = openGroups.includes(item.label);

            return (
              <div key={item.label}>
                {hasChild ? (
                  <div>
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        active ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        isCollapsed && !mobileOpen && 'justify-center px-2'
                      )}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {(!isCollapsed || mobileOpen) && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                        </>
                      )}
                    </button>
                    {isOpen && (!isCollapsed || mobileOpen) && (
                      <div className="mt-1 space-y-0.5 pl-11">
                        {item.children?.map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                                childActive
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <span className="shrink-0">{child.icon}</span>
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      isCollapsed && !mobileOpen && 'justify-center px-2'
                    )}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {(!isCollapsed || mobileOpen) && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Home link */}
        <div className="border-t border-gray-100 p-3">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Store className="h-4 w-4" />
            {(!isCollapsed || mobileOpen) && <span>View Storefront</span>}
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onClose) onClose();
              logout();
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {(!isCollapsed || mobileOpen) && <span>Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };