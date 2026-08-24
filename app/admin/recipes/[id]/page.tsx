'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { formatNumber, formatDate, timeAgo } from '@/lib/admin/utils';
import {
  ArrowLeft, CircleAlert, Pencil, ChefHat, Eye, Calendar, Clock, Users, Star, List, Utensils, Globe
} from 'lucide-react';

interface RecipeDetail {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  category?: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ingredients: string[];
  instructions: string[];
  nutrition?: Record<string, string | number> | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminRecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = hasPermission(PERMISSIONS.MANAGE_RECIPES);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<{ data: RecipeDetail }>(`/recipes/${params.id}`);
        setRecipe(res.data);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.message);
        else setError('Failed to load recipe');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchRecipe();
  }, [params.id]);

  const handleChangeStatus = async (status: string) => {
    if (!recipe || !canManage) return;
    try {
      await api.put(`/recipes/${recipe.id}`, { status });
      setRecipe({ ...recipe, status: status as RecipeDetail['status'] });
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <EmptyState
        icon={<ChefHat className="h-12 w-12 text-red-400" />}
        title="Recipe not found"
        description={error || 'This recipe could not be found.'}
        action={<Button size="sm" onClick={() => router.push('/admin/recipes')}>Back to Recipes</Button>}
      />
    );
  }

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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/recipes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
              {getStatusBadge(recipe.status)}
            </div>
            <p className="mt-1 text-sm text-gray-500">/recipes/{recipe.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/recipes/${recipe.id}/edit`)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <Globe className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <Eye className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Views</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(recipe.views)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50">
              <Clock className="h-5 w-5 text-lime-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="text-lg font-bold text-gray-900">{recipe.prepTime + recipe.cookTime} min</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
              <Users className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Servings</p>
              <p className="text-lg font-bold text-gray-900">{recipe.servings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <ChefHat className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Difficulty</p>
              <div className="mt-1">{getDifficultyBadge(recipe.difficulty)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {recipe.coverImage && (
            <Card className="overflow-hidden">
              <img src={recipe.coverImage} alt={recipe.title} className="aspect-video w-full object-cover" />
            </Card>
          )}
          {recipe.excerpt && (
            <Card>
              <CardContent className="pt-6">
                <p className="border-l-4 border-lime-500 pl-4 text-base italic text-gray-600">
                  {recipe.excerpt}
                </p>
              </CardContent>
            </Card>
          )}
          {recipe.content && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Description</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{recipe.content}</p>
              </CardContent>
            </Card>
          )}

          {recipe.ingredients.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <List className="h-4 w-4" />
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-500" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {recipe.instructions.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Utensils className="h-4 w-4" />
                  Instructions
                </h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Workflow</h3>
              <div className="space-y-2">
                {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleChangeStatus(status)}
                    disabled={!canManage}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      recipe.status === status
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                    {recipe.status === status && <ChefHat className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Nutrition Facts</h3>
                <div className="space-y-2">
                  {Object.entries(recipe.nutrition).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2 text-sm">
                      <span className="capitalize text-gray-500">{key}</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {recipe.seoTitle && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO</h3>
                <p className="mb-2 text-sm font-medium text-gray-800">{recipe.seoTitle}</p>
                {recipe.seoDescription && (
                  <p className="text-sm text-gray-500">{recipe.seoDescription}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-gray-800">{timeAgo(recipe.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-medium text-gray-800">{timeAgo(recipe.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800 capitalize">{recipe.category || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prep / Cook</span>
                  <span className="font-medium text-gray-800">{recipe.prepTime} / {recipe.cookTime} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}