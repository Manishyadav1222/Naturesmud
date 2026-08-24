'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Select } from '@/components/admin/Select';
import { EmptyState } from '@/components/admin/EmptyState';
import { CircleAlert, ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, Check } from 'lucide-react';
import MediaUploader from '@/components/admin/MediaUploader';

export default function AdminRecipeNewPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'skincare',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'EASY',
    ingredients: [''],
    instructions: [''],
    nutrition: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasPermission(PERMISSIONS.MANAGE_RECIPES)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to create recipes."
      />
    );
  }

  const handleChange = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'title' && !form.slug) {
      const newSlug = value.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setForm(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleArrayChange = (key: 'ingredients' | 'instructions', index: number, value: string) => {
    setForm(prev => {
      const arr = [...prev[key]];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key: 'ingredients' | 'instructions') => {
    setForm(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const removeArrayItem = (key: 'ingredients' | 'instructions', index: number) => {
    setForm(prev => {
      const arr = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: arr.length > 0 ? arr : [''] };
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      setIsSaving(true);
      setError(null);

      // Parse nutrition if provided (simple key=value pairs, one per line)
      let nutrition: Record<string, string | number> = {};
      if (form.nutrition.trim()) {
        const lines = form.nutrition.split('\n');
        for (const line of lines) {
          const [key, value] = line.split(':').map(s => s.trim());
          if (key && value) {
            nutrition[key.toLowerCase()] = Number(value) || value;
          }
        }
      }

      const payload = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage || null,
        category: form.category,
        prepTime: Number(form.prepTime) || 0,
        cookTime: Number(form.cookTime) || 0,
        servings: Number(form.servings) || 1,
        difficulty: form.difficulty,
        ingredients: form.ingredients.map(i => i.trim()).filter(Boolean),
        instructions: form.instructions.map(i => i.trim()).filter(Boolean),
        nutrition,
        status: form.status,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
      };

      const res = await api.post('/recipes', payload);
      const id = (res as { id?: string; data?: { id?: string } })?.id || (res as { data?: { id?: string } })?.data?.id;
      router.push(id ? `/admin/recipes/${id}` : '/admin/recipes');
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
      else setError('Failed to create recipe');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";
  const labelCls = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/recipes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Recipe</h1>
            <p className="mt-1 text-sm text-gray-500">Create a new culinary recipe.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/recipes')}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Recipe
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <Input
                    placeholder="Enter recipe title"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <Input
                    placeholder="auto-generated"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Excerpt</label>
                  <Textarea
                    placeholder="Short summary of the recipe"
                    value={form.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description / Content</label>
                  <textarea
                    className={`${inputCls} min-h-[200px] font-mono text-xs leading-relaxed`}
                    placeholder="Write a detailed description of the recipe..."
                    value={form.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Ingredients</h3>
              <div className="space-y-2">
                {form.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder={`Ingredient ${idx + 1}`}
                      value={ing}
                      onChange={(e) => handleArrayChange('ingredients', idx, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('ingredients', idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem('ingredients')}>
                  <Plus className="h-4 w-4" />
                  Add Ingredient
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Instructions</h3>
              <div className="space-y-2">
                {form.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
                      {idx + 1}
                    </span>
                    <Textarea
                      placeholder={`Step ${idx + 1}`}
                      value={inst}
                      onChange={(e) => handleArrayChange('instructions', idx, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('instructions', idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem('instructions')}>
                  <Plus className="h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Nutrition Facts</h3>
              <Textarea
                placeholder={'Calories: 250\nProtein: 8\nCarbs: 15\nFat: 20'}
                value={form.nutrition}
                onChange={(e) => handleChange('nutrition', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-400">Enter one nutrient per line: name: value</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>SEO Title</label>
                  <Input value={form.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>SEO Description</label>
                  <Textarea value={form.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <MediaUploader
                label="Cover Image"
                value={form.coverImage}
                onChange={(url) => handleChange('coverImage', url)}
                defaultAspectRatio="16:9"
                folder="recipes"
                hint="Adjust to 16:9 Banner, 9:16 Reel, or 1:1 Square"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Details</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Status</label>
                  <Select
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    options={[
                      { value: 'DRAFT', label: 'Draft' },
                      { value: 'PUBLISHED', label: 'Published' },
                    ]}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <Select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={[
                      { value: 'skincare', label: 'Skincare' },
                      { value: 'wellness', label: 'Wellness' },
                      { value: 'diy', label: 'DIY' },
                      { value: 'lifestyle', label: 'Lifestyle' },
                    ]}
                  />
                </div>
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <Select
                    value={form.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                    options={[
                      { value: 'EASY', label: 'Easy' },
                      { value: 'MEDIUM', label: 'Medium' },
                      { value: 'HARD', label: 'Hard' },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Prep (min)</label>
                    <Input
                      type="number"
                      min="0"
                      value={String(form.prepTime)}
                      onChange={(e) => handleChange('prepTime', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Cook (min)</label>
                    <Input
                      type="number"
                      min="0"
                      value={String(form.cookTime)}
                      onChange={(e) => handleChange('cookTime', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Servings</label>
                  <Input
                    type="number"
                    min="1"
                    value={String(form.servings)}
                    onChange={(e) => handleChange('servings', Number(e.target.value))}
                  />
                </div>
                {form.status === 'PUBLISHED' && (
                  <div className="flex items-center gap-2 rounded-lg bg-lime-50 p-3 text-sm text-lime-700">
                    <Check className="h-4 w-4" />
                    This recipe will be public immediately.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}