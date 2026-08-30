import BlogListClient from '@/components/BlogListClient';
import { masterBlogCatalog } from '@/lib/data/blogs-database';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Evidence-Based Nutrition & Himalayan Health Blogs | NaturesMud Nepal",
  description: "Comprehensive scientific guides on infant weaning, 0-additive living, Ayurvedic longevity, and Himalayan superfoods.",
  keywords: "dates powder baby food, sweet potato powder weaning, himalayan shilajit resin, organic nepal superfoods, nutrition blogs kathmandu",
};

export default async function BlogPage() {
  let posts: any[] = masterBlogCatalog;

  try {
    const res = await api.get('/blogs?per_page=100');
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

      posts = apiPosts;
    }
  } catch {
    posts = masterBlogCatalog;
  }

  // Ensure strict descending date order (newest first)
  posts.sort((a, b) => {
    const timeA = new Date(a.rawDate || a.date || 0).getTime();
    const timeB = new Date(b.rawDate || b.date || 0).getTime();
    return timeB - timeA;
  });

  return <BlogListClient initialPosts={posts} />;
}