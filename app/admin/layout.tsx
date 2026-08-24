'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin/auth';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { Skeleton } from '@/components/admin/Skeleton';
import { Toaster } from 'sonner';
import './globals.css';

function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  // Close mobile sidebar whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isLoginPage = pathname === '/admin/login';
  const isPublicPage = isLoginPage;

  useEffect(() => {
    if (!isLoading && !isPublicPage && !user) {
      router.push('/admin/login');
    }
  }, [isLoading, isPublicPage, user, router]);

  // Login page — just render the auth screen
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Topbar onMenuClick={() => setMobileMenuOpen((prev) => !prev)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminProtectedLayout>{children}</AdminProtectedLayout>
    </AdminAuthProvider>
  );
}