import Link from 'next/link';
import { notFound } from 'next/navigation';
import { masterBlogCatalog, getBlogPostBySlug } from '@/lib/data/blogs-database';
import { api } from '@/lib/api';
import BlogPostClient from '@/components/BlogPostClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  return masterBlogCatalog.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '');
  let post: any = null;

  try {
    const res = await api.get(`/blogs/${slug}`);
    if (res.data) {
      post = {
        id: String(res.data.id),
        slug: res.data.slug,
        title: res.data.title,
        excerpt: res.data.excerpt || '',
        content: (() => {
          let c = res.data.content || '';
          if (Array.isArray(c)) return c;
          if (typeof c === 'string') {
            try { 
              const parsed = JSON.parse(c); 
              if (Array.isArray(parsed)) return parsed;
            } catch(e) {}
            return c.split(/\n\s*\n/).filter(Boolean);
          }
          return [c];
        })(),
        image: res.data.featured_image || res.data.image || '/products/sweet-potato-powder-100g.jpg',
        category: res.data.category || 'Superfoods',
        author: res.data.author || "Nature's Mud Clinical Council",
        date: res.data.published_at ? new Date(res.data.published_at).toLocaleDateString('en-US') : 'Recent',
        readTime: 10,
        tags: typeof res.data.tags === 'string' ? JSON.parse(res.data.tags) : res.data.tags || [],
      };
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      return {};
    }
    post = getBlogPostBySlug(slug);
  }

  if (!post) return {};

  return {
    title: `${post.title} | Nature's Mud Organic Superfoods Nepal`,
    description: post.excerpt,
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : 'organic food nepal, baby nutrition, pregnancy care, himalayan superfoods',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '');
  let post: any = null;

  try {
    const res = await api.get(`/blogs/${slug}`);
    const localPost = getBlogPostBySlug(slug);
    if (res.data) {
      post = {
        id: String(res.data.id),
        slug: res.data.slug,
        title: res.data.title,
        excerpt: res.data.excerpt || '',
        content: (() => {
          let c = res.data.content || '';
          if (Array.isArray(c)) return c;
          if (typeof c === 'string') {
            try { 
              const parsed = JSON.parse(c); 
              if (Array.isArray(parsed)) return parsed;
            } catch(e) {}
            return c.split(/\n\s*\n/).filter(Boolean);
          }
          return [c];
        })(),
        image: res.data.featured_image || res.data.image || '/products/sweet-potato-powder-100g.jpg',
        category: res.data.category || 'Superfoods',
        author: res.data.author || "Nature's Mud Clinical Council",
        date: res.data.published_at
          ? new Date(res.data.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Recent',
        readTime: 10,
        tags: typeof res.data.tags === 'string' ? JSON.parse(res.data.tags) : res.data.tags || [],
        wallpapers: res.data.wallpapers || localPost?.wallpapers || [],
        featuredProductName: res.data.featuredProductName || localPost?.featuredProductName,
        featuredProductPrice: res.data.featuredProductPrice || localPost?.featuredProductPrice,
        featuredProductSlug: res.data.featuredProductSlug || localPost?.featuredProductSlug,
        featuredProductImage: res.data.featuredProductImage || localPost?.featuredProductImage,
        faqs: res.data.faqs || localPost?.faqs || [],
      };
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      notFound();
    }
    post = getBlogPostBySlug(slug);
  }

  if (!post) notFound();

  const related = masterBlogCatalog
    .filter((p) => p.id !== post?.id && (p.category === post?.category || true))
    .slice(0, 3);

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f: any) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : null;

  return (
    <>
      <BlogPostClient post={post} relatedPosts={related} />

      {/* JSON-LD Article Schema for Google, ChatGPT, Perplexity & AI Search */}
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
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: "Nature's Mud",
              logo: {
                '@type': 'ImageObject',
                url: 'https://naturesmud.shop/logo.png',
              },
            },
            datePublished: post.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://naturesmud.shop/blog/${post.slug}`,
            },
          }),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}