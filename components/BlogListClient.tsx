'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Search, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import BlogLanguageSwitcher from '@/components/BlogLanguageSwitcher';
import { blogTranslations, blogUiStrings } from '@/lib/data/blog-translations';
import { BlogPost } from '@/lib/types';

interface BlogListClientProps {
  initialPosts: BlogPost[];
}

export default function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    const saved = localStorage.getItem('naturesmud_blog_lang');
    if (saved === 'en' || saved === 'np') {
      setLang(saved);
    }
  }, []);

  const handleLanguageChange = (newLang: 'en' | 'np') => {
    setLang(newLang);
    localStorage.setItem('naturesmud_blog_lang', newLang);
  };

  const ui = blogUiStrings[lang];

  // Map posts according to current language
  const localizedPosts = initialPosts.map((post) => {
    const tr = blogTranslations[post.slug];
    if (lang === 'np' && tr) {
      return {
        ...post,
        title: tr.titleNp || post.title,
        excerpt: tr.excerptNp || post.excerpt,
        category: tr.categoryNp || post.category,
        author: tr.authorNp || post.author,
        date: tr.dateNp || post.date,
        tags: tr.tagsNp || post.tags,
      };
    }
    return post;
  });

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(localizedPosts.map((p) => p.category))).filter(Boolean)];

  // Filter posts
  const filteredPosts = localizedPosts
    .filter((post) => {
      const matchesCat = selectedCategory === 'ALL' || post.category === selectedCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return Number(b.id || 0) - Number(a.id || 0);
    });

  const featured = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);
  const displayedRestPosts = restPosts.slice(0, visibleCount);
  const hasMore = visibleCount < restPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B] w-full max-w-full overflow-x-hidden">
      {/* Top Banner with Language Switcher */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A18] via-[#2D5A27] to-[#1E3A18] text-white py-12 lg:py-16 w-full max-w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9982A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container-nm px-4 relative z-10 max-w-6xl mx-auto">
          {/* Top Bar: Breadcrumb + Language Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <nav className="text-xs sm:text-sm text-white/70" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-[#EBC164] transition-colors">
                    {ui.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#EBC164] font-bold">{ui.breadcrumbBlog}</li>
              </ol>
            </nav>

            <BlogLanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9982A]/20 text-[#EBC164] border border-[#C9982A]/40 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Evidence-Based Nutrition & AI-Era Health Intelligence' : 'वैज्ञानिक पोषण तथा परम्परागत ज्ञान'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight tracking-tight">
              {ui.pageTitle}
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-3 leading-relaxed font-body">
              {ui.pageSubtitle}
            </p>
          </div>

          {/* Search bar inside hero */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(12);
                }}
                placeholder={ui.searchPlaceholder}
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
                {cat === 'ALL' ? ui.filterAll : cat}
              </button>
            ))}
          </div>

          <div className="shrink-0 hidden md:block">
            <span className="text-xs text-gray-500 font-medium">
              {filteredPosts.length} {lang === 'en' ? 'articles' : 'लेखहरू'}
            </span>
          </div>
        </div>
      </section>

      {/* Articles Feed */}
      <main className="container-nm px-4 py-10 sm:py-14 max-w-6xl mx-auto w-full max-w-full overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">{ui.noArticlesFound}</h3>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setVisibleCount(12);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2D5A27] text-white text-xs font-bold hover:bg-[#23471e] transition-colors"
            >
              {lang === 'en' ? 'Reset Filters' : 'फिल्टर हटाउनुहोस्'}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Post Card */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-gray-100 min-h-[260px]">
                  <Image
                    src={featured.image || '/products/naturesmud-all-products-100g.jpg'}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#C9982A] text-white text-xs font-black uppercase tracking-wider shadow-md">
                      ★ {ui.featuredBadge}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                      {featured.category}
                    </span>
                  </div>

                  <h2 className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-gray-900 mt-3 group-hover:text-[#2D5A27] transition-colors leading-tight">
                    {featured.title}
                  </h2>

                  <p className="text-gray-600 text-sm sm:text-base mt-3 line-clamp-3 leading-relaxed font-body">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5 text-gray-700 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#2D5A27]" />
                      {featured.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                      {featured.readTime} {ui.readTimeSuffix}
                    </span>
                    <span>
                      {ui.byAuthor} <strong className="text-gray-800">{featured.author}</strong>
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#2D5A27] group-hover:translate-x-1 transition-transform">
                    <span>{lang === 'en' ? 'Read Full 10-Min Guide' : 'पूर्ण लेख पढ्नुहोस्'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}

            {/* Articles Grid */}
            {displayedRestPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                        <Image
                          src={post.image || '/products/naturesmud-all-products-100g.jpg'}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-3 left-3 text-[11px] font-black text-[#2D5A27] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm z-10">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-5 sm:p-6">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#2D5A27] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#2D5A27]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                        {post.readTime} {ui.readTimeSuffix}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* See More / Load More Pagination Button */}
            {hasMore && (
              <div className="text-center pt-8 pb-4">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#2D5A27] hover:bg-[#23471e] text-white font-heading font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-[#EBC164]" />
                  <span>
                    {lang === 'en'
                      ? `See More Articles (Showing ${displayedRestPosts.length + 1} of ${filteredPosts.length})`
                      : `थप लेखहरू हेर्नुहोस् (${displayedRestPosts.length + 1} / ${filteredPosts.length})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
