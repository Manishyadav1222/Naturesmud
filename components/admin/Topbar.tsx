import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/admin/utils';
import { useAdminAuth } from '@/lib/admin/auth';
import { Search, Bell, Menu, ChevronDown, LogOut, Settings } from 'lucide-react';

const Topbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        {searchOpen ? (
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              autoFocus
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 hover:border-gray-300 transition-colors"
          >
            <Search className="h-4 w-4" />
            Search...
            <kbd className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold">⌘K</kbd>
          </button>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <button className="text-xs text-primary-600 hover:text-primary-700">Mark all read</button>
              </div>
              <div className="space-y-1">
                <div className="rounded-lg px-3 py-2 hover:bg-gray-50">
                  <p className="text-sm text-gray-800">New order received #ORD-1234</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
                <div className="rounded-lg px-3 py-2 hover:bg-gray-50">
                  <p className="text-sm text-gray-800">Low stock alert: Himalayan Clay Mask</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400">
                {typeof user?.role === 'string' ? user.role : (user?.role?.name || 'Super Admin')}
              </p>
            </div>
            <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push('/admin/settings');
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={async () => {
                  setUserMenuOpen(false);
                  try {
                    await logout();
                  } catch (err) {
                    console.error('Logout failed:', err);
                  }
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { Topbar };