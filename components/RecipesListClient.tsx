'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Search, ChefHat, Sparkles, ArrowRight } from 'lucide-react';
import { Recipe } from '@/lib/types';

interface RecipesListClientProps {
  initialRecipes: Recipe[];
}

export default function RecipesListClient({ initialRecipes }: RecipesListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(initialRecipes.map((r) => r.category))).filter(Boolean)];

  // Filter recipes
  const filteredRecipes = initialRecipes.filter((recipe) => {
    const matchesCat = selectedCategory === 'ALL' || recipe.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filteredRecipes[0];
  const restRecipes = filteredRecipes.slice(1);
  const displayedRestRecipes = restRecipes.slice(0, visibleCount);
  const hasMore = visibleCount < restRecipes.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B] w-full max-w-full overflow-x-hidden">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A18] via-[#2D5A27] to-[#1E3A18] text-white py-12 lg:py-16 w-full max-w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9982A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container-nm px-4 relative z-10 max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs sm:text-sm text-white/70 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#EBC164] transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#EBC164] font-bold">Recipes</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9982A]/20 text-[#EBC164] border border-[#C9982A]/40 text-xs font-bold uppercase tracking-wider mb-4">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Clean Whole-Food Himalayan Kitchen</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight tracking-tight">
              Healthy Himalayan Recipes
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-3 leading-relaxed font-body">
              100+ easy, nutrient-dense recipes crafted with Nature&apos;s Mud organic sweet potato powder, dates powder, raw mountain honey, seeds, and dried fruits.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(12);
                }}
                placeholder="Search recipes (e.g. pancakes, smoothie, oats, baby food)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-medium border-2 border-transparent focus:border-[#C9982A] focus:outline-none shadow-lg"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setVisibleCount(12);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs w-full max-w-full overflow-hidden">
        <div className="container-nm px-4 py-3 max-w-6xl mx-auto flex items-center justify-between gap-4 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat === 'ALL' ? 'All Recipes' : cat}
              </button>
            ))}
          </div>

          <div className="shrink-0 hidden md:block">
            <span className="text-xs text-gray-500 font-medium">
              {filteredRecipes.length} recipes
            </span>
          </div>
        </div>
      </section>

      {/* Main Recipes Grid */}
      <main className="container-nm px-4 py-10 sm:py-14 max-w-6xl mx-auto w-full max-w-full overflow-hidden">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No recipes found</h3>
            <p className="text-xs text-gray-500 mt-1">Try searching for different ingredients or reset filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setVisibleCount(12);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2D5A27] text-white text-xs font-bold hover:bg-[#23471e] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Recipe Card */}
            {featured && (
              <Link
                href={`/recipes/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-gray-100 min-h-[260px]">
                  <Image
                    src={featured.image || '/products/sweet-potato-powder-100g.jpg'}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#C9982A] text-white text-xs font-black uppercase tracking-wider shadow-md">
                      ★ Featured Recipe
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center">
                  <span className="text-xs font-black text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-lg uppercase tracking-wider w-fit">
                    {featured.category}
                  </span>

                  <h2 className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-gray-900 mt-3 group-hover:text-[#2D5A27] transition-colors leading-tight">
                    {featured.title}
                  </h2>

                  <p className="text-gray-600 text-sm sm:text-base mt-3 line-clamp-3 leading-relaxed font-body">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5 text-gray-700 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                      {featured.prepTime + (featured.cookTime || 0)} mins total
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Users className="w-3.5 h-3.5 text-[#2D5A27]" />
                      {featured.servings} Servings
                    </span>
                    <span className="text-xs font-bold text-[#C9982A] bg-[#C9982A]/10 px-2.5 py-0.5 rounded-full">
                      {featured.difficulty || 'Easy'}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#2D5A27] group-hover:translate-x-1 transition-transform">
                    <span>View Step-by-Step Recipe & Ingredients</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}

            {/* Recipe Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRestRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                    <Image
                      src={recipe.image || '/products/superfood-mix.jpg'}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-black text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {recipe.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-black text-base sm:text-lg text-gray-900 group-hover:text-[#2D5A27] transition-colors leading-snug line-clamp-2">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-body">
                        {recipe.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-bold text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                        {recipe.prepTime + (recipe.cookTime || 0)} min
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users className="w-3.5 h-3.5 text-[#2D5A27]" />
                        {recipe.servings} servings
                      </span>
                      <span className="font-bold text-[#2D5A27] group-hover:translate-x-0.5 transition-transform">
                        Cook &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-3.5 rounded-2xl bg-[#2D5A27] text-white text-sm font-bold shadow-md hover:bg-[#23471e] hover:shadow-lg transition-all cursor-pointer"
                >
                  Load More Recipes ({restRecipes.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
