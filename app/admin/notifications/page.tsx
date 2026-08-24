'use client';

import React, { useState } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { useRouter } from 'next/navigation';
import { CircleAlert, Bell, BellOff, BellRing, Check, CheckCheck, ShoppingBag, Package, Star, MessageSquare, Leaf, TrendingUp, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'ORDER' | 'STOCK' | 'REVIEW' | 'MESSAGE' | 'CAMPAIGN' | 'SYSTEM';
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'ORDER',
    title: 'New order received',
    description: 'Order #NM-2041 worth Rs. 2,450 from Ramesh Adhikari has been placed.',
    isRead: false,
    createdAt: '2024-08-06T14:30:00Z',
    link: '/admin/orders/1',
  },
  {
    id: '2',
    type: 'STOCK',
    title: 'Low stock alert',
    description: 'Dead Sea Mud Mask 100g is running low (12 units remaining).',
    isRead: false,
    createdAt: '2024-08-06T11:20:00Z',
    link: '/admin/inventory',
  },
  {
    id: '3',
    type: 'REVIEW',
    title: 'New review pending moderation',
    description: 'A new 5-star review for Dead Sea Mud Mask is awaiting approval.',
    isRead: false,
    createdAt: '2024-08-06T10:05:00Z',
    link: '/admin/reviews',
  },
  {
    id: '4',
    type: 'MESSAGE',
    title: 'New support message',
    description: 'Deepak KC has a high-priority message regarding order delivery.',
    isRead: false,
    createdAt: '2024-08-06T09:45:00Z',
    link: '/admin/messages',
  },
  {
    id: '5',
    type: 'CAMPAIGN',
    title: 'Campaign performance update',
    description: '"Monsoon Glow" campaign has reached 85% of its target audience.',
    isRead: true,
    createdAt: '2024-08-05T16:30:00Z',
    link: '/admin/marketing/campaigns',
  },
  {
    id: '6',
    type: 'SYSTEM',
    title: 'System maintenance scheduled',
    description: 'Scheduled maintenance will occur on Sunday, 2:00 AM - 4:00 AM NPT.',
    isRead: true,
    createdAt: '2024-08-05T12:00:00Z',
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  ORDER: <ShoppingBag className="h-4 w-4" />,
  STOCK: <Package className="h-4 w-4" />,
  REVIEW: <Star className="h-4 w-4" />,
  MESSAGE: <MessageSquare className="h-4 w-4" />,
  CAMPAIGN: <TrendingUp className="h-4 w-4" />,
  SYSTEM: <Settings className="h-4 w-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  ORDER: 'bg-primary-100 text-primary-700',
  STOCK: 'bg-yellow-100 text-yellow-700',
  REVIEW: 'bg-lime-100 text-lime-700',
  MESSAGE: 'bg-blue-100 text-blue-700',
  CAMPAIGN: 'bg-accent-100 text-accent-700',
  SYSTEM: 'bg-gray-100 text-gray-600',
};

const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function AdminNotificationsPage() {
  const { hasPermission } = useAdminAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const canManage = hasPermission(PERMISSIONS.MANAGE_NOTIFICATIONS);

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to view notifications."
      />
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const orderCount = notifications.filter(n => n.type === 'ORDER').length;
  const alertCount = notifications.filter(n => ['STOCK', 'REVIEW'].includes(n.type)).length;
  const filteredNotifications = filter === 'ALL' ? notifications : notifications.filter(n => !n.isRead);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) handleMarkRead(notification.id);
    if (notification.link) router.push(notification.link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">Alerts and updates for store operations.</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          <Check className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Unread" value={String(unreadCount)} icon={<Bell className="h-5 w-5 text-red-500" />} />
        <StatCard title="Orders" value={String(notifications.filter(n => n.type === 'ORDER').length)} icon={<ShoppingBag className="h-5 w-5 text-primary-600" />} />
        <StatCard title="Alerts" value={String(alertCount)} icon={<CircleAlert className="h-5 w-5 text-yellow-500" />} />
        <StatCard title="Total" value={String(notifications.length)} icon={<BellRing className="h-5 w-5 text-gray-600" />} />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === 'ALL' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === 'UNREAD' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Unread
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12 text-gray-300" />}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    notification.isRead
                      ? 'border-gray-100 bg-white opacity-60 hover:opacity-80'
                      : 'border-primary-100 bg-primary-50/50 hover:bg-primary-50'
                  }`}
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLORS[notification.type] || 'bg-gray-100 text-gray-600'}`}>
                    {TYPE_ICONS[notification.type] || <Leaf className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm ${notification.isRead ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <span className="flex-shrink-0 text-xs text-gray-400">{formatRelativeTime(notification.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{notification.description}</p>
                    {!notification.isRead && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Unread
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}