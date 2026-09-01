'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Select } from '@/components/admin/Select';
import { EmptyState } from '@/components/admin/EmptyState';
import { CircleAlert, Save, Store, Globe, Truck, Settings as SettingsIcon, Shield, CheckCircle, Zap, MessageSquare } from 'lucide-react';

export default function AdminSettingsPage() {
  const { hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('automation');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'NaturesMud',
    tagline: 'Pure Food · Real Nature · 0 Additives · 0 Preservatives',
    supportEmail: 'support@naturesmud.com',
    supportPhone: '+977-1-5550123',
    address: 'Kathmandu, Nepal',
    whatsapp: '+977-9819844486',
    facebook: 'https://facebook.com/naturesmud',
    instagram: 'https://instagram.com/naturesmud',
    tiktok: 'https://tiktok.com/@naturesmud',
    currency: 'NPR',
    taxRate: '13',
    shippingFee: '150',
    freeShippingThreshold: '10000',
    lowStockThreshold: '10',
    orderPrefix: 'NM',
    maintenance: 'false',
    analytics: 'true',
    seoTitle: 'NaturesMud — Pure Himalayan Superfoods & Whole Food Nutrition Nepal',
    seoDescription: 'Authentic pure Himalayan superfoods, whole food powders, and dehydrated fruits with 0 additives and 0 preservatives.',
    announcement: 'Free shipping on orders over Rs. 10,000!',
    callmebotApiKey: '',
    metaAccessToken: '',
    metaPhoneNumberId: '',
    telegramBotToken: '',
    telegramChatId: '',
    customGatewayUrl: '',
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch(() => {});
  }, []);

  const canManage = hasPermission(PERMISSIONS.MANAGE_SETTINGS);

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to modify settings."
      />
    );
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // Non-blocking
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setSettings((prev: typeof settings) => ({ ...prev, [key]: value }));
  };

  const tabsList = [
    { id: 'automation', label: 'WhatsApp & Automation', icon: Zap },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'store', label: 'Store', icon: Save },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'social', label: 'Social & Contact', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage store configuration and preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-lime-600">
              <CheckCircle className="h-4 w-4" />
              Changes saved
            </span>
          )}
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabsList.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {activeTab === 'automation' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#2D5A27]" />
                  Automated Background WhatsApp & Push Notifications
                </h3>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  Configure how Nature's Mud Nepal automatically dispatches order invoices, customer notifications, and mobile alert pings whenever a new order is received.
                </p>
              </div>

              {/* Business WhatsApp Number */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Business WhatsApp Alert Number</label>
                  <Input
                    placeholder="+977-9819844486"
                    value={settings.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-gray-500">The destination phone number where automatic order notifications are sent.</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CallMeBot WhatsApp API Key <span className="text-emerald-600 font-bold">(100% Free Auto-Send)</span>
                  </label>
                  <Input
                    placeholder="e.g. 849201"
                    value={settings.callmebotApiKey || ''}
                    onChange={(e) => updateField('callmebotApiKey', e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    Get instant background WhatsApp messages on every order without Meta verification!
                  </p>
                </div>
              </div>

              {/* CallMeBot 30-Second Guide Card */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5 text-amber-900">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span>📱</span> How to activate 100% Free Automatic WhatsApp in 30 seconds:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-amber-800 text-[11px]">
                  <li>Open your WhatsApp on phone (<span className="font-mono font-bold">+977 9819844486</span>).</li>
                  <li>Send this exact message to CallMeBot: <span className="font-mono bg-white px-1.5 py-0.5 rounded border font-bold">I allow callmebot to send me messages</span> to number: <span className="font-mono font-bold">+34 644 44 20 48</span> or <span className="font-mono font-bold">+34 644 97 54 81</span>.</li>
                  <li>CallMeBot will immediately reply to you on WhatsApp with your personal <strong>apikey</strong>.</li>
                  <li>Paste that API Key in the field above and click <strong>Save Changes</strong>. That's it! Every new order will instantly ding your WhatsApp automatically!</li>
                </ol>
              </div>

              {/* Meta Cloud API Configuration */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Meta WhatsApp Cloud API (Optional Enterprise)</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Meta Access Token</label>
                    <Input
                      type="password"
                      placeholder="EAAG..."
                      value={settings.metaAccessToken || ''}
                      onChange={(e) => updateField('metaAccessToken', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Meta Phone Number ID</label>
                    <Input
                      placeholder="1092837465..."
                      value={settings.metaPhoneNumberId || ''}
                      onChange={(e) => updateField('metaPhoneNumberId', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Telegram Instant Mobile Alerts (Free) */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Telegram Instant Order Alerts (Free Push Alerts with Sound)</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Telegram Bot Token</label>
                    <Input
                      type="password"
                      placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                      value={settings.telegramBotToken || ''}
                      onChange={(e) => updateField('telegramBotToken', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Telegram Chat ID</label>
                    <Input
                      placeholder="987654321"
                      value={settings.telegramChatId || ''}
                      onChange={(e) => updateField('telegramChatId', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Store Name</label>
                  <Input value={settings.storeName} onChange={(e) => updateField('storeName', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Tagline</label>
                  <Input value={settings.tagline} onChange={(e) => updateField('tagline', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Announcement Bar</label>
                <Input value={settings.announcement} onChange={(e) => updateField('announcement', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
                <Select value={settings.currency} onChange={(e) => updateField('currency', e.target.value)} options={[
                  { value: 'NPR', label: 'NPR - Nepalese Rupee' },
                  { value: 'USD', label: 'USD - US Dollar' },
                ]} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
                <Input type="number" value={settings.taxRate} onChange={(e) => updateField('taxRate', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                <Input type="number" value={settings.lowStockThreshold} onChange={(e) => updateField('lowStockThreshold', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Order ID Prefix</label>
                <Input value={settings.orderPrefix} onChange={(e) => updateField('orderPrefix', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Fee</label>
                <Input type="number" value={settings.shippingFee} onChange={(e) => updateField('shippingFee', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Free Shipping Threshold</label>
                <Input type="number" value={settings.freeShippingThreshold} onChange={(e) => updateField('freeShippingThreshold', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <Input value={settings.supportPhone} onChange={(e) => updateField('supportPhone', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" value={settings.supportEmail} onChange={(e) => updateField('supportEmail', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                <Textarea value={settings.address} onChange={(e) => updateField('address', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Facebook</label>
                <Input value={settings.facebook} onChange={(e) => updateField('facebook', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Instagram</label>
                <Input value={settings.instagram} onChange={(e) => updateField('instagram', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">TikTok</label>
                <Input value={settings.tiktok} onChange={(e) => updateField('tiktok', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">SEO Title</label>
                <Input value={settings.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">SEO Description</label>
                <Textarea value={settings.seoDescription} onChange={(e) => updateField('seoDescription', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Maintenance Mode</label>
                <Select value={settings.maintenance} onChange={(e) => updateField('maintenance', e.target.value)} options={[
                  { value: 'false', label: 'Disabled' },
                  { value: 'true', label: 'Enabled' },
                ]} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Analytics</label>
                <Select value={settings.analytics} onChange={(e) => updateField('analytics', e.target.value)} options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' },
                ]} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}