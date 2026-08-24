'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Modal } from '@/components/admin/Modal';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StatCard } from '@/components/admin/StatCard';
import { formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  Truck,
  Plus,
  Search,
  CircleAlert,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Package,
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  isActive: boolean;
  leadTime: number;
  _count?: { inventoryItems: number };
  createdAt: string;
  updatedAt: string;
}

interface SupplierForm {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
  leadTime: string;
}

const EMPTY_FORM: SupplierForm = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  isActive: true,
  leadTime: '7',
};

export default function AdminSuppliersPage() {
  const { hasPermission } = useAdminAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canManageSuppliers = hasPermission(PERMISSIONS.MANAGE_SUPPLIERS);

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ data: Supplier[] }>('/suppliers');
      setSuppliers(res.data || []);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load suppliers');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = suppliers.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.contactPerson || '').toLowerCase().includes(q);
  });

  const openCreateModal = () => {
    setEditingSupplier(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      country: supplier.country || '',
      isActive: supplier.isActive,
      leadTime: String(supplier.leadTime),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSuppliers) return;

    try {
      setIsSaving(true);
      setFormError(null);
      const payload = {
        name: formData.name,
        contactPerson: formData.contactPerson || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        country: formData.country || null,
        isActive: formData.isActive,
        leadTime: parseInt(formData.leadTime) || 7,
      };

      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, payload);
      } else {
        await api.post('/suppliers', payload);
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      if (err instanceof ApiClientError) setFormError(err.message);
      else setFormError('Failed to save supplier');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !canManageSuppliers) return;
    try {
      setIsDeleting(true);
      await api.delete(`/suppliers/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!hasPermission(PERMISSIONS.MANAGE_SUPPLIERS)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage suppliers."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(suppliers.length)} suppliers
          </p>
        </div>
        {canManageSuppliers && (
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Suppliers" value={formatNumber(suppliers.length)} icon={<Truck className="h-5 w-5 text-primary-600" />} />
        <StatCard title="Active" value={formatNumber(suppliers.filter(s => s.isActive).length)} icon={<Package className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Inactive" value={formatNumber(suppliers.filter(s => !s.isActive).length)} icon={<Package className="h-5 w-5 text-gray-400" />} />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : filteredSuppliers.length === 0 ? (
        <EmptyState
          icon={<Truck className="h-12 w-12 text-gray-300" />}
          title="No suppliers found"
          description="Add suppliers to track product sourcing and lead times."
          action={canManageSuppliers ? <Button onClick={openCreateModal}>Add Supplier</Button> : undefined}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                            <Truck className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                            <p className="text-xs text-gray-500">{supplier.contactPerson || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          {supplier.email && (
                            <p className="flex items-center gap-1.5 text-gray-600">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              {supplier.email}
                            </p>
                          )}
                          {supplier.phone && (
                            <p className="flex items-center gap-1.5 text-gray-600">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              {supplier.phone}
                            </p>
                          )}
                          {!supplier.email && !supplier.phone && <span className="text-gray-400">No contact info</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {[supplier.city, supplier.country].filter(Boolean).join(', ') || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{supplier.leadTime} days</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-primary-50 text-primary-700 border-primary-200">
                          {formatNumber(supplier._count?.inventoryItems || 0)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          supplier.isActive
                            ? 'bg-lime-50 text-lime-700 border-lime-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        )}>
                          {supplier.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {canManageSuppliers && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => openEditModal(supplier)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setDeleteTarget(supplier)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <CircleAlert className="h-4 w-4" />
              {formError}
            </div>
          )}

          <Input label="Company Name *" name="name" value={formData.name} onChange={handleInputChange} required />
          <Input label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>

          <Textarea label="Address" name="address" value={formData.address} onChange={handleInputChange} rows={2} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
            <Input label="Country" name="country" value={formData.country} onChange={handleInputChange} />
          </div>

          <Input label="Lead Time (days)" name="leadTime" type="number" value={formData.leadTime} onChange={handleInputChange} />

          <label className="flex items-center justify-between rounded-xl border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Active</p>
              <p className="text-xs text-gray-500">Allow purchasing from this supplier</p>
            </div>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingSupplier ? 'Save Changes' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will unlink all associated inventory items.`}
        confirmLabel="Delete Supplier"
        cancelLabel="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}