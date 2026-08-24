'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/admin/Badge';
import { formatDate } from '@/lib/admin/utils';
import {
  Mail,
  Phone,
  MessageCircle,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  Send,
  User,
  Inbox,
  AlertCircle,
  Reply,
  ExternalLink,
} from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  admin_reply?: string | null;
  replied_at?: string | null;
  created_at: string;
}

export default function AdminMessagesPage() {
  const { hasPermission } = useAdminAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSavingReply, setIsSavingReply] = useState(false);

  const fetchMessages = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res: any = await api.get(`/messages?${params.toString()}`);
      if (res?.data) {
        setMessages(res.data);
        setUnreadCount(res.unreadCount || 0);
        if (selectedMessage) {
          const updated = res.data.find((m: ContactMessage) => m.id === selectedMessage.id);
          if (updated) setSelectedMessage(updated);
        }
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter, search, selectedMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplyText(msg.admin_reply || '');

    // If unread, mark as read
    if (msg.status === 'unread') {
      try {
        await api.patch(`/messages/${msg.id}`, { status: 'read' });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // Ignore
      }
    }
  };

  const handleStatusChange = async (msgId: number, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await api.patch(`/messages/${msgId}`, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage?.id === msgId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      fetchMessages(true);
    } catch {
      // Ignore
    }
  };

  const handleSaveReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setIsSavingReply(true);

    try {
      await api.patch(`/messages/${selectedMessage.id}`, {
        status: 'replied',
        adminReply: replyText,
      });
      setSelectedMessage({
        ...selectedMessage,
        status: 'replied',
        admin_reply: replyText,
        replied_at: new Date().toISOString(),
      });
      fetchMessages(true);
    } catch {
      // Ignore
    } finally {
      setIsSavingReply(false);
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${msgId}`);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      if (selectedMessage?.id === msgId) setSelectedMessage(null);
    } catch {
      // Ignore
    }
  };

  const totalCount = messages.length;
  const repliedCount = messages.filter((m) => m.status === 'replied').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Inquiries & Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Real-time messages from website contact form, product inquiries, and wholesale questions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchMessages(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Total Inquiries"
          value={String(totalCount)}
          icon={<Mail className="h-5 w-5 text-blue-600" />}
          subtitle="All received messages"
        />
        <StatCard
          title="Unread Messages"
          value={String(unreadCount)}
          icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
          subtitle="Requires attention"
        />
        <StatCard
          title="Responded"
          value={String(repliedCount)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          subtitle="Resolved inquiries"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone, or message content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'unread', label: 'Unread Only' },
              { value: 'read', label: 'Read' },
              { value: 'replied', label: 'Replied' },
            ]}
          />
        </div>
      </div>

      {/* Main Inbox Layout (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Inbox List ({messages.length})</h2>
          </div>

          <div className="divide-y divide-gray-100 max-h-[620px] overflow-y-auto">
            {isLoading && messages.length === 0 ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">No Messages Found</p>
                <p className="text-xs text-gray-500 mt-1">Inquiries submitted from your website will appear here in real-time.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'unread';

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 transition-colors cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-l-4 border-[#2D5A27]'
                        : isUnread
                        ? 'bg-amber-50/30 hover:bg-gray-50 font-semibold'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {isUnread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                        <span className="text-sm font-bold text-gray-900 truncate">{msg.name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono shrink-0">
                        {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-[#2D5A27] font-bold truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{msg.message}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          msg.status === 'unread'
                            ? 'bg-rose-100 text-rose-700'
                            : msg.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {msg.status}
                      </span>
                      {msg.phone && <span className="text-[11px] text-gray-400">{msg.phone}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail & Reply Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header with Actions */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 font-heading">{selectedMessage.subject}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        selectedMessage.status === 'unread'
                          ? 'bg-rose-100 text-rose-700'
                          : selectedMessage.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Received on {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(
                        selectedMessage.id,
                        selectedMessage.status === 'read' ? 'unread' : 'read'
                      )
                    }
                  >
                    {selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sender Details Box */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-400 font-medium">Customer Name</p>
                    <p className="font-bold text-gray-900 text-sm">{selectedMessage.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-400 font-medium">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-bold text-[#2D5A27] hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-gray-400 font-medium">Phone</p>
                      <a href={`tel:${selectedMessage.phone}`} className="font-bold text-gray-900 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Message</label>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gray-200 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Instant Response Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Namaste ${selectedMessage.name}! This is Nature's Mud Nepal following up on your inquiry about "${selectedMessage.subject}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply on WhatsApp</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                )}

                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.subject} - Nature's Mud Nepal`
                  )}&body=${encodeURIComponent(
                    `Namaste ${selectedMessage.name},\n\nThank you for reaching out to Nature's Mud Nepal regarding "${selectedMessage.subject}".\n\n`
                  )}`}
                  className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#23471e] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>

              {/* Internal Admin Note / Reply Log */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Reply className="w-3.5 h-3.5 text-[#2D5A27]" /> Admin Reply / Action Note
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Record your response or internal notes here..."
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
                <Button
                  size="sm"
                  onClick={handleSaveReply}
                  disabled={isSavingReply || !replyText.trim()}
                  className="flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSavingReply ? 'Saving...' : 'Save & Mark Replied'}</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 space-y-2">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Select a message from the left to view details</p>
              <p className="text-xs text-gray-400">You can reply via WhatsApp or Email directly with 1-click.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}