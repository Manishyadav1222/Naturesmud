'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  ChefHat,
  Plus,
  Search,
  CircleAlert,
  Eye,
  Pencil,
  Trash2,
  Clock,
  Star,
  FileText,
} from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: string | null;
  cookingTime: number;
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  isFeatured: boolean;
  author?: { firstName: string; lastName: string } | null;
  publishedAt?: string | null;
  createdAt: string;
}

interface RecipeResponse {
  data: Recipe[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export default function AdminRecipesPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageRecipes = hasPermission(PERMISSIONS.MANAGE_RECIPES);

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api.get<RecipeResponse>(`/recipes?${params.toString()}`);
      setRecipes(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load recipes');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleToggleFeatured = async (recipe: Recipe) => {
    if (!canManageRecipes) return;
    try {
      await api.put(`/recipes/${recipe.id}`, { isFeatured: !recipe.isFeatured });
      fetchRecipes();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  const handleDelete = async (recipe: Recipe) => {
    if (!canManageRecipes) return;
    if (!confirm(`Delete "${recipe.title}"?`)) return;
    try {
      await api.delete(`/recipes/${recipe.id}`);
      fetchRecipes();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (!canManageRecipes) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage recipes."
      />
    );
  }

  const publishedCount = recipes.filter(r => r.status === 'PUBLISHED').length;
  const draftCount = recipes.filter(r => r.status === 'DRAFT').length;
  const totalViews = recipes.reduce((sum, r) => sum + r.views, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-lime-50 text-lime-700 border-lime-200">Published</Badge>;
      case 'DRAFT':
        return <Badge className="bg-accent-50 text-accent-700 border-accent-200">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-gray-50 text-gray-500 border-gray-200">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Easy</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
      case 'HARD':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Hard</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(pagination.total)} recipes total
          </p>
        </div>
        <Button size="sm" onClick={() => router.push('/admin/recipes/new')}>
          <Plus className="h-4 w-4" />
          New Recipe
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Published" value={formatNumber(publishedCount)} icon={<FileText className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Drafts" value={formatNumber(draftCount)} icon={<ChefHat className="h-5 w-5 text-accent-600" />} />
        <StatCard title="Total Views" value={formatNumber(totalViews)} icon={<Eye className="h-5 w-5 text-primary-600" />} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              placeholder="All Statuses"
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
                <Skeleton className="h-20 w-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={<ChefHat className="h-12 w-12 text-gray-300" />}
          title="No recipes found"
          description="Create your first recipe to start sharing culinary content."
          action={<Button onClick={() => router.push('/admin/recipes/new')}>New Recipe</Button>}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipe</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {recipe.coverImage ? (
                            <img src={recipe.coverImage} alt={recipe.title} className="h-12 w-16 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
                              <ChefHat className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{recipe.title}</p>
                            <p className="text-xs text-gray-500">
                              /recipes/{recipe.slug} · {recipe.author ? `${recipe.author.firstName} ${recipe.author.lastName}` : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(recipe.status)}</td>
                      <td className="px-6 py-4">{getDifficultyBadge(recipe.difficulty)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5" />
                          {recipe.cookingTime} min
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(recipe.views)}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleFeatured(recipe)}>
                          <Star className={cn(
                            'h-5 w-5',
                            recipe.isFeatured ? 'text-accent-500 fill-accent-500' : 'text-gray-300 hover:text-gray-400'
                          )} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(recipe.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/recipes/${recipe.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/recipes/${recipe.id}/edit`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(recipe)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}