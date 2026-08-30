'use client';

import React, { useState } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Select } from '@/components/admin/Select';
import { EmptyState } from '@/components/admin/EmptyState';
import { CircleAlert, Save, Store, Globe, Truck, Settings as SettingsIcon, Shield, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'NaturesMud',
    tagline: 'Pure Food · Real Nature · 0 Additives · 0 Preservatives',
    supportEmail: 'support@naturesmud.com',
    supportPhone: '+977-1-5550123',
    address: 'Kathmandu, Nepal',
    whatsapp: '+977-9713888002',
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
  });

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (key: string, value: string) => {
    setSettings((prev: typeof settings) => ({ ...prev, [key]: value }));
  };

  const tabsList = [
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