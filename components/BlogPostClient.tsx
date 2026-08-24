'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Tag,
  Share2,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';
import BlogLanguageSwitcher from '@/components/BlogLanguageSwitcher';
import { blogTranslations, blogUiStrings } from '@/lib/data/blog-translations';
import { BlogPost } from '@/lib/types';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const [copied, setCopied] = useState(false);

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

  // Resolve current post based on active language
  const tr = blogTranslations[post.slug];
  const activeTitle = (lang === 'np' && tr?.titleNp) ? tr.titleNp : post.title;
  const activeExcerpt = (lang === 'np' && tr?.excerptNp) ? tr.excerptNp : post.excerpt;
  const activeCategory = (lang === 'np' && tr?.categoryNp) ? tr.categoryNp : post.category;
  const activeAuthor = (lang === 'np' && tr?.authorNp) ? tr.authorNp : post.author;
  const activeDate = (lang === 'np' && tr?.dateNp) ? tr.dateNp : post.date;
  const activeContent = (lang === 'np' && tr?.contentNp) ? tr.contentNp : post.content;
  const activeTags = (lang === 'np' && tr?.tagsNp) ? tr.tagsNp : post.tags;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B]">
      {/* Top Hero Section */}
      <section className="bg-gradient-to-b from-[#F8F4EC] to-white border-b border-gray-100 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar: Breadcrumb + Language Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-200/60">
            <nav className="text-xs sm:text-sm text-gray-500" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-[#2D5A27] transition-colors">
                    {ui.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="hover:text-[#2D5A27] transition-colors">
                    {ui.breadcrumbBlog}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#2D5A27] font-bold line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {activeTitle}
                </li>
              </ol>
            </nav>

            <BlogLanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />
          </div>

          <div className="flex items-center justify-between gap-4 my-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#2D5A27] font-bold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{ui.backToAll}</span>
            </Link>

            <button
              onClick={handleShare}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#2D5A27]" />}
              <span>{copied ? (lang === 'en' ? 'Link Copied!' : 'लिङ्क कपी भयो!') : (lang === 'en' ? 'Share Article' : 'साझेदारी गर्नुहोस्')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs font-black text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {activeCategory}
            </span>
            <span className="text-xs text-gray-400">
              {lang === 'en' ? '100% Pure Himalayan Wholesomeness' : '१००% शुद्ध हिमाली प्राकृतिक पोषण'}
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-gray-900 mt-3 leading-tight">
            {activeTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1.5 text-gray-700 font-medium">
              <User className="w-4 h-4 text-[#2D5A27]" />
              <span>{ui.byAuthor}</span> <strong className="text-gray-900">{activeAuthor}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-gray-700">
              <Calendar className="w-4 h-4 text-[#2D5A27]" />
              {activeDate}
            </span>
            <span className="flex items-center gap-1.5 text-gray-700">
              <Clock className="w-4 h-4 text-[#2D5A27]" />
              {post.readTime} {ui.readTimeSuffix}
            </span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="py-10 sm:py-14 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden mb-10 shadow-lg border border-gray-100 relative aspect-[16/9] bg-gray-50">
            <Image
              src={post.image || '/products/naturesmud-all-products-100g.jpg'}
              alt={activeTitle}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Key Takeaways Box */}
          <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border-2 border-[#C9982A]/30 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900 font-heading font-black text-base sm:text-lg mb-2">
              <Sparkles className="w-5 h-5 text-[#C9982A]" />
              <span>{ui.keyTakeawayTitle}</span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-body">
              {activeExcerpt}
            </p>
          </div>

          {/* Body Content */}
          <div className="prose prose-lg max-w-none text-gray-800 space-y-6 text-base sm:text-lg leading-relaxed font-body">
            {activeContent.map((paragraph, i) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={i}
                    className="font-heading font-black text-xl sm:text-2xl text-gray-900 pt-6 pb-2 border-b border-gray-100"
                  >
                    {paragraph.replace(/^###\s*/, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <div key={i} className="flex items-start gap-2.5 my-2 pl-2">
                    <span className="w-2 h-2 rounded-full bg-[#2D5A27] mt-2.5 shrink-0" />
                    <p className="text-gray-700 text-base leading-relaxed">
                      {paragraph.replace(/^-\s*/, '')}
                    </p>
                  </div>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={i} className="font-bold text-gray-900 text-base sm:text-lg">
                    {paragraph.replace(/^\*\*|\*\*$/g, '')}
                  </p>
                );
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-gray-100">
            <span className="text-xs font-bold uppercase text-gray-400 mr-2">{ui.tagsLabel}</span>
            {activeTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-[#F8F4EC] px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-700 hover:bg-[#ece5d8] transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-[#2D5A27]" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#F8F4EC] border-t border-gray-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
                  {ui.relatedTitle}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{ui.relatedSubtitle}</p>
              </div>
              <Link
                href="/blog"
                className="text-xs sm:text-sm text-[#2D5A27] font-bold hover:underline"
              >
                {ui.viewAllRelated}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relTr = blogTranslations[relatedPost.slug];
                const relTitle = (lang === 'np' && relTr?.titleNp) ? relTr.titleNp : relatedPost.title;
                const relExcerpt = (lang === 'np' && relTr?.excerptNp) ? relTr.excerptNp : relatedPost.excerpt;
                const relCategory = (lang === 'np' && relTr?.categoryNp) ? relTr.categoryNp : relatedPost.category;
                const relDate = (lang === 'np' && relTr?.dateNp) ? relTr.dateNp : relatedPost.date;

                return (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all border border-gray-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                        <Image
                          src={relatedPost.image || '/products/naturesmud-all-products-100g.jpg'}
                          alt={relTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-3 left-3 text-[11px] font-bold text-[#2D5A27] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-sm z-10">
                          {relCategory}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#2D5A27] transition-colors line-clamp-2">
                          {relTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                          {relExcerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 flex items-center gap-3 text-xs text-gray-400 border-t border-gray-50">
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#2D5A27]" /> {relDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#2D5A27]" /> {relatedPost.readTime} {ui.readTimeSuffix}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
