import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Sparkles, BookOpen } from 'lucide-react';
import { blogPosts } from '@/lib/data/content';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    try {
      const res = await api.get(`/blogs/${slug}`);
      if (res.data) {
        post = {
          id: String(res.data.id),
          slug: res.data.slug,
          title: res.data.title,
          excerpt: res.data.excerpt || '',
          content: [res.data.content || ''],
          image: res.data.featured_image || '/products/cranberries.jpg',
          category: res.data.category || 'Superfoods',
          author: res.data.author || 'Nature\'s Mud Experts',
          date: res.data.published_at ? new Date(res.data.published_at).toLocaleDateString('en-US') : 'Recent',
          readTime: 6,
          tags: res.data.tags || [],
        };
      }
    } catch {
      // fallback
    }
  }

  if (!post) return {};

  return {
    title: `${post.title} | Nature's Mud Organic Superfoods Nepal`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || 'organic food nepal, baby nutrition, pregnancy care, himalayan superfoods',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
    },
  };
}

import BlogPostClient from '@/components/BlogPostClient';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    try {
      const res = await api.get(`/blogs/${slug}`);
      if (res.data) {
        post = {
          id: String(res.data.id),
          slug: res.data.slug,
          title: res.data.title,
          excerpt: res.data.excerpt || '',
          content: Array.isArray(res.data.content) ? res.data.content : [res.data.content || ''],
          image: res.data.featured_image || '/products/cranberries.jpg',
          category: res.data.category || 'Superfoods',
          author: res.data.author || 'Nature\'s Mud Experts',
          date: res.data.published_at ? new Date(res.data.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          readTime: 6,
          tags: res.data.tags || ['organic food nepal', 'superfoods'],
        };
      }
    } catch {
      // fallback
    }
  }

  if (!post) notFound();

  const related = blogPosts.filter((p) => p.id !== post?.id && (p.category === post?.category || true)).slice(0, 3);

  return (
    <>
      <BlogPostClient post={post} relatedPosts={related} />

      {/* JSON-LD Article Schema for Google, ChatGPT & AI Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: [post.image],
            author: {
              '@type': 'Organization',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: "Nature's Mud",
              logo: {
                '@type': 'ImageObject',
                url: 'https://naturesmud.com/logo.png',
              },
            },
            datePublished: post.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://naturesmud.com/blog/${post.slug}`,
            },
          }),
        }}
      />
    </>
  );
}