import BlogListClient from '@/components/BlogListClient';
import { blogPosts as localBlogPosts } from '@/lib/data/content';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Blog | Nutrition, Health & Organic Living | Nature\'s Mud',
  description: 'Expert articles on nutrition, health tips, lifestyle, and organic living from Nature\'s Mud.',
};

export default async function BlogPage() {
  let posts: any[] = localBlogPosts;

  try {
    const res = await api.get('/blogs');
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      posts = res.data.data.map((p: any) => ({
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || p.short_description || '',
        category: p.category || 'Nutrition',
        image: p.featured_image || p.image || '/products/cranberries.jpg',
        date: p.published_at
          ? new Date(p.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Recent',
        readTime: Number(p.read_time || 5),
        author: p.author?.name || p.author || 'Nature\'s Mud Team',
        featured: p.is_featured || false,
      }));
    }
  } catch {
    posts = localBlogPosts;
  }

  return <BlogListClient initialPosts={posts} />;
}