'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Baby,
  Heart,
  Truck,
  Sparkles,
} from 'lucide-react';
import { faqs } from '@/lib/data/content';
import { classNames } from '@/lib/utils';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>('f-baby-1');

  const categories = [
    'All',
    'Baby Care & Nutrition',
    'Mothercare & Pregnancy',
    'Superfoods & Honey',
    'Dry Fruits & Oils',
    'Orders & Shipping',
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F8F4EC] to-white border-b border-gray-100 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="text-sm text-gray-500 mb-4 inline-block" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-semibold">Frequently Asked Questions</li>
            </ol>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wider uppercase mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Knowledge Base & Guidance</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-dark tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Find expert answers about our chemical-free Himalayan superfoods, safe baby weaning nutrition, pregnancy mothercare, and nationwide delivery across Nepal.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, e.g. baby porridge, honey crystallization, delivery time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenId(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-[#F8F4EC] hover:bg-[#efe9dd] text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-3.5">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-white border-primary/30 shadow-md ring-1 ring-primary/10'
                        : 'bg-[#FAF7F0] hover:bg-[#F5EFE3] border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-heading font-semibold text-sm sm:text-base text-dark flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                        {faq.question}
                      </span>
                      <span
                        className={classNames(
                          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
                          isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-200/60 text-gray-600'
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pl-13 pt-1 border-t border-gray-100/60">
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-[#FAF7F0] rounded-2xl p-6">
                <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="font-semibold text-dark text-base">No matching questions found</p>
                <p className="text-gray-500 text-sm mt-1">
                  We couldn't find any results for "{searchQuery}". Please try another keyword or browse our category tabs above.
                </p>
              </div>
            )}
          </div>

          {/* Quick Support / Contact Cards */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="text-center mb-8">
              <h3 className="font-heading font-bold text-2xl text-dark">Still Have Questions?</h3>
              <p className="text-gray-600 text-sm mt-1">Our certified nutritionists and support team are here to assist you.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#F8F4EC] border border-gray-100 flex flex-col items-center text-center">
                <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </span>
                <p className="font-semibold text-dark text-sm">Call Us</p>
                <p className="text-xs text-gray-500 mt-0.5">Sun–Fri, 9am–6pm</p>
                <a href="tel:+9779713888002" className="text-primary text-xs font-bold mt-2 hover:underline">
                  +977 9713888002
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F4EC] border border-gray-100 flex flex-col items-center text-center">
                <span className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <p className="font-semibold text-dark text-sm">WhatsApp Chat</p>
                <p className="text-xs text-gray-500 mt-0.5">Instant Advice</p>
                <a href="https://wa.me/9779819844486" target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold mt-2 hover:underline">
                  Chat on WhatsApp →
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F4EC] border border-gray-100 flex flex-col items-center text-center">
                <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </span>
                <p className="font-semibold text-dark text-sm">Email Support</p>
                <p className="text-xs text-gray-500 mt-0.5">Response within 24 hrs</p>
                <Link href="/contact" className="text-primary text-xs font-bold mt-2 hover:underline">
                  Send a Message →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema for Google & ChatGPT AI Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}