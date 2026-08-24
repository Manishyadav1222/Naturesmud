'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Textarea } from '@/components/admin/Textarea';
import { Modal } from '@/components/admin/Modal';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  Layers,
  Plus,
  Search,
  CircleAlert,
  Pencil,
  Trash2,
  FolderTree,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  image: string;
  isActive: boolean;
  sortOrder: string;
}

const EMPTY_FORM: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  parentId: '',
  image: '',
  isActive: true,
  sortOrder: '0',
};

export default function AdminCategoriesPage() {
  const { hasPermission } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canManageCategories = hasPermission(PERMISSIONS.MANAGE_CATEGORIES);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ data: Category[] }>('/categories/tree');
      setCategories(res.data || []);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load categories');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const flattenCategories = (cats: Category[], depth = 0): Array<Category & { depth: number }> => {
    let result: Array<Category & { depth: number }> = [];
    for (const cat of cats) {
      result.push({ ...cat, depth });
      if (cat.children && cat.children.length > 0 && expanded.has(cat.id)) {
        result = result.concat(flattenCategories(cat.children, depth + 1));
      }
    }
    return result;
  };

  const filteredCategories = flattenCategories(categories).filter(cat => {
    if (!search) return true;
    const q = search.toLowerCase();
    return cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q);
  });

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || '',
      image: category.image || '',
      isActive: category.isActive,
      sortOrder: String(category.sortOrder || 0),
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

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const allCategoriesList = flattenCategories(categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageCategories) return;

    try {
      setIsSaving(true);
      setFormError(null);

      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || null,
        parentId: formData.parentId || null,
        image: formData.image || null,
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setFormError(err.message);
      } else {
        setFormError('Failed to save category');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !canManageCategories) return;
    try {
      setIsDeleting(true);
      await api.delete(`/categories/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    if (!canManageCategories) return;
    try {
      await api.put(`/categories/${category.id}`, { isActive: !category.isActive });
      fetchCategories();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  if (!hasPermission(PERMISSIONS.MANAGE_CATEGORIES)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to view categories."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(categories.length)} top-level categories
          </p>
        </div>
        {canManageCategories && (
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Categories Table */}
      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="h-12 w-12 text-gray-300" />}
          title="No categories found"
          description="Create your first category to organize products."
          action={canManageCategories ? (
            <Button onClick={openCreateModal}>Add Category</Button>
          ) : undefined}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3" style={{ paddingLeft: `${category.depth * 24}px` }}>
                          {category.children && category.children.length > 0 ? (
                            <button
                              onClick={() => toggleExpand(category.id)}
                              className="rounded-lg p-1 hover:bg-gray-100"
                            >
                              {expanded.has(category.id) ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          ) : (
                            <span className="w-6" />
                          )}
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="h-10 w-10 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                              <Layers className="h-5 w-5 text-primary-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{category.name}</p>
                            {category.description && (
                              <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-600">{category.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-primary-50 text-primary-700 border-primary-200">
                          {formatNumber(category._count?.products || 0)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleActive(category)}>
                          <Badge className={cn(
                            category.isActive
                              ? 'bg-lime-50 text-lime-700 border-lime-200'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          )}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{category.sortOrder}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {canManageCategories && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setDeleteTarget(category)}
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
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <CircleAlert className="h-4 w-4" />
              {formError}
            </div>
          )}

          <Input
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <div className="flex gap-2">
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="auto-generated"
            />
            <Button type="button" variant="outline" className="mt-6" onClick={generateSlug}>
              Generate
            </Button>
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />

          <Select
            label="Parent Category"
            name="parentId"
            value={formData.parentId}
            onChange={handleInputChange}
            options={allCategoriesList
              .filter(c => c.id !== editingCategory?.id)
              .map(c => ({ value: c.id, label: `${'— '.repeat(c.depth)}${c.name}` }))}
            placeholder="None (top level)"
          />

          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://..."
          />

          <Input
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={handleInputChange}
          />

          <label className="flex items-center justify-between rounded-xl border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Active</p>
              <p className="text-xs text-gray-500">Show this category in the store</p>
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
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Products in this category will be uncategorized.`}
        confirmLabel="Delete Category"
        cancelLabel="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}