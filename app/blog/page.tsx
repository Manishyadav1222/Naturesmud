import BlogListClient from '@/components/BlogListClient';
import { masterBlogCatalog } from '@/lib/data/blogs-database';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Himalayan Superfood, Baby Weaning & Clean Nutrition Blog',
  description:
    'Read practical guides on infant weaning (6m+), natural sugar-free sweetening with dates powder, freeze-dried avocado & strawberry powders, moringa benefits, and monsoon food storage in Nepal.',
  keywords:
    'dates powder baby food nepal, sweet potato powder weaning nepal, avocado powder benefits, moringa powder nepal, healthy snacks kathmandu, naturesmud blog',
  alternates: {
    canonical: 'https://naturesmud.shop/blog',
  },
  openGraph: {
    title: 'Himalayan Superfood, Baby Weaning & Clean Nutrition Blog | NaturesMud Nepal',
    description:
      'Practical guides on infant weaning, natural sweeteners, dehydrated fruits, superfood powders, and healthy living across Nepal.',
    url: 'https://naturesmud.shop/blog',
    siteName: 'NaturesMud Nepal',
    type: 'website',
  },
};

export default async function BlogPage() {
  let posts: any[] = masterBlogCatalog;

  try {
    const res = await api.get('/blogs?per_page=200');
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      const apiPosts = res.data.data.map((p: any) => ({
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || p.short_description || '',
        content: Array.isArray(p.content) ? p.content : [p.content || ''],
        category: p.category || 'Nutrition',
        image: p.featured_image || p.image || '/products/sweet-potato-powder-100g.jpg',
        date: p.published_at
          ? new Date(p.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Recent',
        rawDate: p.published_at || p.created_at || '',
        readTime: Number(p.read_time || 10),
        author: p.author?.name || p.author || "NaturesMud Clinical Council",
        featured: p.is_featured === true || (p.slug && p.slug.startsWith('healthy-raksha-bandhan')),
        isFeatured: p.is_featured === true,
      }));

      // Merge apiPosts with masterBlogCatalog so all comprehensive articles are preserved
      const mergedMap = new Map<string, any>();
      for (const p of masterBlogCatalog) {
        if (p.slug) mergedMap.set(p.slug, p);
      }
      for (const p of apiPosts) {
        if (p.slug) {
          const local = mergedMap.get(p.slug);
          mergedMap.set(p.slug, {
            ...local,
            ...p,
            title: p.title || local?.title,
            excerpt: p.excerpt || local?.excerpt,
            image: p.image || local?.image,
            category: p.category || local?.category,
            author: p.author || local?.author,
          });
        }
      }
      posts = Array.from(mergedMap.values());
    }
  } catch {
    posts = masterBlogCatalog;
  }

  // Ensure strict descending date and ID order (newest first)
  posts.sort((a, b) => {
    const timeA = new Date(a.rawDate || a.date || 0).getTime();
    const timeB = new Date(b.rawDate || b.date || 0).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return Number(b.id || 0) - Number(a.id || 0);
  });

  return <BlogListClient initialPosts={posts} />;
}