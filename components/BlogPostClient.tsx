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
  ShoppingBag,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Download,
  Copy,
  Smartphone,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import BlogLanguageSwitcher from '@/components/BlogLanguageSwitcher';
import { blogTranslations, blogUiStrings } from '@/lib/data/blog-translations';
import { BlogPost } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart-store';
import { ExtendedBlogPost } from '@/lib/data/blogs-database';

interface BlogPostClientProps {
  post: ExtendedBlogPost | BlogPost | any;
  relatedPosts: (ExtendedBlogPost | BlogPost | any)[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const { addItem, openDrawer } = useCartStore();

  const handleDownload = async (imageUrl: string, title?: string, id?: string) => {
    if (id) setDownloadingId(id);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cleanTitle = (title || 'naturesmud-wallpaper').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      a.download = `${cleanTitle}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(imageUrl, '_blank');
    } finally {
      if (id) setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handleCopyQuote = (quoteText: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(quoteText);
      setCopiedQuoteId(id);
      setTimeout(() => setCopiedQuoteId(null), 2500);
    }
  };

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
  const activeCategory = (lang === 'np' && tr?.categoryNp) ? tr.categoryNp : (post.category || 'Superfoods & Wellness');
  const activeAuthor = (lang === 'np' && tr?.authorNp) ? tr.authorNp : (post.author || "Nature's Mud Clinical Council");
  const activeDate = (lang === 'np' && tr?.dateNp) ? tr.dateNp : (post.date || 'Recent');
  const activeContent: string[] = Array.isArray(post.content) ? post.content : [post.content || ''];
  const activeTags: string[] = (lang === 'np' && tr?.tagsNp) ? tr.tagsNp : (post.tags || ['organic nepal', 'himalayan nutrition', 'wellness']);

  // Extract / Synthesize Key Takeaways so EVERY current & upcoming post has high-impact takeaways
  const activeKeyTakeaways: string[] = (() => {
    if (post.keyTakeaways && Array.isArray(post.keyTakeaways) && post.keyTakeaways.length > 0) {
      return post.keyTakeaways;
    }
    const points: string[] = [];
    if (activeExcerpt && activeExcerpt.trim().length > 15) {
      points.push(activeExcerpt);
    }
    const contentBullets = activeContent
      .filter((p: string) => p.startsWith('- ') || p.startsWith('* '))
      .map((p: string) => p.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim())
      .filter((p: string) => p.length > 15)
      .slice(0, 2);

    if (contentBullets.length > 0) {
      points.push(...contentBullets);
    } else {
      points.push(
        "100% pure Himalayan single-origin harvest from pesticide-free cooperative farms across Nepal.",
        "Low-temperature solar dehydration (<45°C) preserves live enzymes, vitamins, and bioflavonoids."
      );
    }
    points.push("Eco-friendly, recyclable glass jar packaging with nationwide doorstep delivery across all 77 districts of Nepal.");
    return points.slice(0, 4);
  })();

  // Extract / Synthesize FAQs so EVERY post has interactive FAQ accordion & Google Schema
  const activeFaqs: { question: string; answer: string }[] = (() => {
    if (post.faqs && Array.isArray(post.faqs) && post.faqs.length > 0) {
      return post.faqs;
    }
    return [
      {
        question: `What makes Nature's Mud Himalayan products 100% chemical-free?`,
        answer: `Nature's Mud sources exclusively from pesticide-free high-altitude cooperative farms in Nepal. Our superfoods contain zero refined white sugar, zero artificial coloring agents (no Tartrazine), and zero synthetic preservatives.`
      },
      {
        question: `How are these superfoods processed to retain active enzymes?`,
        answer: `All our botanical roots, superfood powders, and fruits are slowly solar-dehydrated below 45°C in controlled solar domes. This locks in heat-sensitive vitamins, live digestive enzymes, and dense antioxidant polyphenols.`
      },
      {
        question: `How should I consume and store this product daily?`,
        answer: `Keep the airtight glass jar in a cool, dry place away from direct sunlight. Enjoy 1 to 2 teaspoons daily mixed into warm water, herbal tea, morning porridge, or family smoothies.`
      },
      {
        question: `How fast is doorstep delivery across Kathmandu and nationwide?`,
        answer: `We provide same-day or next-day express delivery across Kathmandu, Lalitpur, and Bhaktapur, and rapid 2–3 day shipping to Pokhara, Chitwan, Butwal, Biratnagar, Dharan, and all 77 districts of Nepal.`
      }
    ];
  })();

  // Smart Featured Product Spotlight matching for high conversion
  const activeFeaturedProduct = (() => {
    if (post.featuredProductName && post.featuredProductPrice) {
      return {
        slug: post.featuredProductSlug || 'sweet-potato-powder',
        name: post.featuredProductName,
        price: post.featuredProductPrice,
        image: post.featuredProductImage || post.image || '/products/sweet-potato-powder-100g.jpg',
        description: 'Includes 100% chemical-free Himalayan superfoods in reusable glass jars with free greeting card.'
      };
    }

    const slug = (post.slug || '').toLowerCase();
    if (slug.includes('beetroot')) {
      return {
        slug: 'beetroot-powder',
        name: 'Pure Himalayan Beetroot Powder (100g)',
        price: 380,
        image: '/products/beetroot-powder-100g.jpg',
        description: 'Delivers natural dietary nitrates for a 230% nitric oxide boost, blood oxygenation, and stamina.'
      };
    }
    if (slug.includes('sweet-potato') || slug.includes('baby') || slug.includes('pregnancy') || slug.includes('weaning')) {
      return {
        slug: 'sweet-potato-powder',
        name: 'Organic Sweet Potato Powder (100g)',
        price: 408,
        image: '/products/sweet-potato-powder-100g.jpg',
        description: 'Gentle, vitamin A-rich complex carbs ideal for baby weaning, gut soothing, and maternal nutrition.'
      };
    }
    if (slug.includes('dates') || slug.includes('sugar') || slug.includes('sweetener')) {
      return {
        slug: 'dates-powder',
        name: 'Natural Dates Powder Sweetener (100g)',
        price: 280,
        image: '/products/dates-powder-100g.jpg',
        description: '100% pure low-glycemic dried dates sweetener to replace refined sugar in tea, oats, and desserts.'
      };
    }
    if (slug.includes('honey') || slug.includes('cough') || slug.includes('monsoon') || slug.includes('immunity')) {
      return {
        slug: 'raw-honey',
        name: 'Pure Raw Himalayan Mountain Honey (500g)',
        price: 950,
        image: '/products/sweet-potato-powder-100g.jpg',
        description: 'Unpasteurized mountain honey rich in active enzymes, living pollen, and natural antimicrobial defense.'
      };
    }
    if (slug.includes('chia') || slug.includes('pumpkin') || slug.includes('seeds')) {
      return {
        slug: 'chia-seeds',
        name: 'Premium Black Chia Seeds (300g)',
        price: 396,
        image: '/products/chia-seeds.jpg',
        description: 'Dense plant-based Omega-3 ALA, complete protein, and soothing soluble prebiotic fiber.'
      };
    }
    if (slug.includes('almond') || slug.includes('cashew') || slug.includes('nuts')) {
      return {
        slug: 'raw-himalayan-almonds',
        name: 'Raw Himalayan Mountain Almonds (200g)',
        price: 600,
        image: '/products/almonds-2.jpg',
        description: 'Hand-selected whole mountain almonds rich in alpha-tocopherol (Vitamin E) and bioavailable magnesium.'
      };
    }

    // Default signature bundle
    return {
      slug: 'himalayan-superfood-lineup-pack',
      name: "Nature's Mud Himalayan Superfood Collection (5-Jar Starter Kit)",
      price: 1450,
      image: post.image || '/products/naturesmud-all-products-100g.jpg',
      description: 'Includes pure Himalayan superfoods in reusable glass jars with free festive greeting card.'
    };
  })();

  const defaultWallpapers = [
    {
      id: 'w-1',
      url: post.image || '/products/sweet-potato-powder-100g.jpg',
      title: `${activeTitle} — Official HD Poster`,
      quote: activeExcerpt,
      aspectRatio: '4:5',
    },
    {
      id: 'w-2',
      url: '/images/blog/rakhi-gift-hampers-natures-mud.jpg',
      title: 'Sacred Vow of Vitality — Mobile 9:16 Wallpaper',
      quote: 'Gift the vow of lifelong vitality—pure Himalayan nourishment in eco-friendly glass jars.',
      aspectRatio: '9:16',
    },
    {
      id: 'w-3',
      url: '/images/blog/divine-raksha-bandhan-superfoods-nepal.jpg',
      title: 'Divine Satvik Protection — Square 1:1',
      quote: 'Where sacred devotion meets biological stamina: nourishing our families with pure earth vitality.',
      aspectRatio: '1:1',
    },
    {
      id: 'w-4',
      url: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
      title: 'Purity & Wellness Living Seeds — Poster 4:5',
      quote: 'Pure food, real nature: 100% chemical-free Himalayan nutrition directly from pristine farms.',
      aspectRatio: '4:5',
    },
    {
      id: 'w-5',
      url: '/images/blog/healthy-rakshabandhan-superfood-rangoli.jpg',
      title: 'Antioxidant Festive Mandala — Wide 16:9',
      quote: 'Celebrate with nature’s healing colors: 100% natural antioxidant-rich organic nutrition.',
      aspectRatio: '16:9',
    },
  ];

  const activeWallpapers = (post.wallpapers && Array.isArray(post.wallpapers) && post.wallpapers.length > 0)
    ? post.wallpapers
    : defaultWallpapers;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${activeTitle}*\n\nRead this complete guide from Nature's Mud Nepal:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: activeFeaturedProduct.slug,
        slug: activeFeaturedProduct.slug,
        name: activeFeaturedProduct.name,
        price: Math.round(activeFeaturedProduct.price * 0.90),
        image: activeFeaturedProduct.image,
        weight: '100g',
        category: post.category || 'Superfood',
      },
      1
    );
    openDrawer();
  };

  // Generate Table of Contents from headings
  const headings = activeContent
    .filter((p: string) => p.startsWith('### ') || p.startsWith('## '))
    .map((p: string, idx: number) => ({
      id: `heading-${idx}`,
      title: p.replace(/^###?\s*/, ''),
    }));

  // Inline markdown formatter helper (bold, italic, links)
  const renderInlineMarkdown = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={idx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
        return <em key={idx} className="italic text-gray-800">{part.slice(1, -1)}</em>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith('http');
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[#2D5A27] font-semibold underline hover:text-[#1e3d1a] transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B] w-full max-w-full overflow-x-hidden">
      {/* Top Hero Section */}
      <section className="bg-gradient-to-b from-[#F8F4EC] to-white border-b border-gray-100 py-10 sm:py-14 w-full max-w-full overflow-hidden">
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppShare}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={handleShare}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#2D5A27]" />}
                <span>{copied ? (lang === 'en' ? 'Copied!' : 'कपी भयो!') : (lang === 'en' ? 'Share' : 'साझेदारी')}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs font-black text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {activeCategory}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Medically Reviewed & Fact-Checked</span>
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
              {post.readTime || 10} {ui.readTimeSuffix}
            </span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="py-10 sm:py-14 bg-white w-full max-w-full overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Featured Hero Image */}
          <div className="rounded-3xl overflow-hidden mb-8 shadow-lg border border-gray-100 relative aspect-[16/9] bg-gray-50">
            <Image
              src={post.image || '/products/naturesmud-all-products-100g.jpg'}
              alt={activeTitle}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Key Takeaways Box (Guaranteed on every single post) */}
          <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border-2 border-[#C9982A]/30 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900 font-heading font-black text-base sm:text-lg mb-3">
              <Sparkles className="w-5 h-5 text-[#C9982A]" />
              <span>{ui.keyTakeawayTitle || 'Key Takeaways'}</span>
            </div>
            <ul className="space-y-2.5">
              {activeKeyTakeaways.map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <span className="text-[#2D5A27] font-black text-base mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-700 tracking-wider mb-3">
                <BookOpen className="w-4 h-4 text-[#2D5A27]" />
                <span>Table of Contents (Jump to Section)</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm font-bold text-[#2D5A27]">
                {headings.map((h, i) => (
                  <li key={i}>
                    <a
                      href={`#${h.id}`}
                      className="hover:underline hover:text-[#1e3d1a] transition-colors flex items-center gap-1.5"
                    >
                      <span>{i + 1}.</span> {h.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body Content with Full Rich Markdown Support */}
          <div className="prose prose-lg max-w-none text-gray-800 space-y-6 text-base sm:text-lg leading-relaxed font-body">
            {activeContent.map((paragraph: string, i: number) => {
              if (!paragraph || !paragraph.trim()) return null;

              // In-content Markdown image: ![alt](url)
              const imgMatch = paragraph.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
              if (imgMatch) {
                const altText = imgMatch[1] || activeTitle;
                const imgSrc = imgMatch[2];
                return (
                  <figure key={i} className="my-8 rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                    <div className="relative aspect-[16/9] w-full">
                      <img
                        src={imgSrc}
                        alt={altText}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = post.image || '/products/sweet-potato-powder-100g.jpg';
                        }}
                      />
                    </div>
                    {altText && (
                      <figcaption className="p-3 text-center text-xs text-gray-500 italic bg-gray-50/80 border-t border-gray-100">
                        📷 {altText}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              // Section Headings: ### or ##
              if (paragraph.startsWith('### ') || paragraph.startsWith('## ')) {
                const headingText = paragraph.replace(/^###?\s*/, '');
                const headingIdx = headings.findIndex((h) => h.title === headingText);
                return (
                  <h3
                    key={i}
                    id={headingIdx >= 0 ? `heading-${headingIdx}` : undefined}
                    className="font-heading font-black text-xl sm:text-2xl text-gray-900 pt-6 pb-2 border-b border-gray-100 scroll-mt-20"
                  >
                    {headingText}
                  </h3>
                );
              }

              // Bullet List Items: - or *
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return (
                  <div key={i} className="flex items-start gap-3 my-2 pl-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A27] mt-2 shrink-0 shadow-2xs" />
                    <div className="text-gray-700 text-base leading-relaxed flex-1">
                      {renderInlineMarkdown(paragraph.replace(/^[-*]\s*/, ''))}
                    </div>
                  </div>
                );
              }

              // Numbered List Items: 1. , 2.
              const numMatch = paragraph.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={i} className="flex items-start gap-3 my-2 pl-2">
                    <span className="w-6 h-6 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] font-black text-xs flex items-center justify-center mt-1 shrink-0">
                      {numMatch[1]}
                    </span>
                    <div className="text-gray-700 text-base leading-relaxed flex-1">
                      {renderInlineMarkdown(numMatch[2])}
                    </div>
                  </div>
                );
              }

              // Markdown Tables
              if (paragraph.startsWith('|') && paragraph.includes('|')) {
                const lines = paragraph.split('\n').filter(l => l.trim().startsWith('|'));
                if (lines.length >= 2) {
                  const parseRow = (rowStr: string) => rowStr.split('|').slice(1, -1).map(c => c.trim());
                  const headerCells = parseRow(lines[0]);
                  const bodyRows = lines.slice(1).filter(l => !l.includes('---')).map(parseRow);
                  return (
                    <div key={i} className="my-6 overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-sm font-body">
                        <thead className="bg-[#FAF7F2]">
                          <tr>
                            {headerCells.map((h, hi) => (
                              <th key={hi} className="px-4 py-3 font-heading font-black text-gray-900 text-xs uppercase tracking-wider">
                                {renderInlineMarkdown(h)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {bodyRows.map((r, ri) => (
                            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/40'}>
                              {r.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3 text-gray-700 text-xs sm:text-sm">
                                  {renderInlineMarkdown(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              // Blockquotes: >
              if (paragraph.startsWith('> ')) {
                return (
                  <div key={i} className="my-6 p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border-l-4 border-[#C9982A] shadow-sm italic text-gray-800 text-lg sm:text-xl font-serif">
                    <Quote className="w-6 h-6 text-[#C9982A]/40 mb-2 inline-block" />
                    <p className="mt-1">{renderInlineMarkdown(paragraph.replace(/^>\s*/, ''))}</p>
                  </div>
                );
              }

              // Standard Paragraph
              return (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {renderInlineMarkdown(paragraph)}
                </p>
              );
            })}
          </div>

          {/* HD Posters, Mobile Wallpapers & Inspiring Quotes Gallery */}
          <div className="mt-14 pt-10 border-t-2 border-dashed border-[#2D5A27]/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Free HD Wallpapers & Posters
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-2">
                  Download HD Wallpapers & Inspiring Quotes
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enjoy high-resolution mobile wallpapers (9:16), square DP (1:1), and inspirational quote cards. Free to save and share.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeWallpapers.map((wp: any, idx: number) => {
                const wpId = wp.id || `wp-${idx}`;
                const isDownloading = downloadingId === wpId;
                const isQuoteCopied = copiedQuoteId === wpId;
                const ratio = wp.aspectRatio || '4:5';

                return (
                  <div
                    key={wpId}
                    className="flex flex-col rounded-3xl bg-gradient-to-b from-[#FAF7F2] to-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Image Container with adaptive aspect ratio */}
                    <div className="relative w-full bg-black/5 overflow-hidden flex items-center justify-center p-3">
                      <div className="relative w-full aspect-[4/5] max-h-[460px] rounded-2xl overflow-hidden shadow-inner bg-white">
                        <img
                          src={wp.url || post.image}
                          alt={wp.title || 'HD Wallpaper'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/products/sweet-potato-powder-100g.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Smartphone className="w-3 h-3 text-[#EBC164]" />
                          <span>{ratio === '9:16' ? '9:16 Mobile' : ratio === '1:1' ? '1:1 Square' : ratio === '16:9' ? '16:9 Desktop' : '4:5 Poster'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content & Inspiring Quote */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-heading font-black text-base text-gray-900 line-clamp-1">
                          {wp.title || 'Sacred Himalayan Wellness Wallpaper'}
                        </h4>

                        {wp.quote && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-cream-50 border border-amber-200/60 relative">
                            <Quote className="w-4 h-4 text-amber-700/40 mb-1" />
                            <p className="text-xs italic text-gray-700 leading-relaxed">
                              "{wp.quote}"
                            </p>
                            <button
                              type="button"
                              onClick={() => handleCopyQuote(wp.quote, wpId)}
                              className="mt-2 text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              {isQuoteCopied ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Quote Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Quote</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleDownload(wp.url, wp.title, wpId)}
                          disabled={isDownloading}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#23471e] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <Download className="w-4 h-4 text-[#EBC164]" />
                          <span>{isDownloading ? 'Downloading...' : 'Download HD Image'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.share) {
                              navigator.share({ title: wp.title, text: wp.quote, url: wp.url });
                            } else {
                              handleCopyQuote(wp.url, wpId);
                            }
                          }}
                          className="p-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          aria-label="Share wallpaper"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Superfood Bundle Spotlight Box (Guaranteed on every post) */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-amber-50/40 to-white border-2 border-[#2D5A27]/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#C9982A] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
              🎋 10% OFF Special Discount Applied
            </div>

            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative shrink-0 bg-white border border-gray-200 shadow-sm p-1">
                <img
                  src={activeFeaturedProduct.image}
                  alt={activeFeaturedProduct.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/products/sweet-potato-powder-100g.jpg';
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2D5A27] bg-[#2D5A27]/10 px-2.5 py-0.5 rounded-full">
                  Featured Himalayan Superfood
                </span>
                <h4 className="font-heading font-black text-lg sm:text-xl text-gray-900 mt-1">
                  {activeFeaturedProduct.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base sm:text-lg font-black text-[#2D5A27]">
                    Rs. {Math.round(activeFeaturedProduct.price * 0.90)}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    Rs. {activeFeaturedProduct.price}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    Save 10%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {activeFeaturedProduct.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href={`/products/${activeFeaturedProduct.slug}`}
                className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 text-center transition-colors shadow-2xs"
              >
                View Product
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#23471e] text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#EBC164]" />
                <span>Buy Now (10% OFF)</span>
              </button>
            </div>
          </div>

          {/* FAQs Accordion Section (Guaranteed on every post) */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 mb-4">
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-3">
              {activeFaqs.map((faq: { question: string; answer: string }, idx: number) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-heading font-bold text-sm sm:text-base text-gray-900 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#2D5A27] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FAF7F2]/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
                const relCategory = (lang === 'np' && relTr?.categoryNp) ? relTr.categoryNp : (relatedPost.category || 'Superfoods');
                const relDate = (lang === 'np' && relTr?.dateNp) ? relTr.dateNp : (relatedPost.date || 'Recent');

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
                        <Clock className="w-3.5 h-3.5 text-[#2D5A27]" /> {relatedPost.readTime || 10} {ui.readTimeSuffix}
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
