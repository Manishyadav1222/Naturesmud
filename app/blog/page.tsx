import BlogListClient from '@/components/BlogListClient';
import { masterBlogCatalog } from '@/lib/data/blogs-database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: {
    absolute: 'Superfood, Baby Weaning & Nutrition Guides | NaturesMud',
  },
  description:
    'Read in-depth Nepali nutrition guides on baby weaning (from 6M), Dates Powder, Beetroot, Moringa, Dry Fruits, Seeds & monsoon food storage in Nepal.',
  alternates: {
    canonical: 'https://naturesmud.shop/blog',
  },
  openGraph: {
    title: 'Superfood, Baby Weaning & Nutrition Guides | NaturesMud',
    description:
      'Read in-depth Nepali nutrition guides on baby weaning (from 6M), Dates Powder, Beetroot, Moringa, Dry Fruits, Seeds & monsoon food storage in Nepal.',
    url: 'https://naturesmud.shop/blog',
    siteName: 'NaturesMud',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = [...masterBlogCatalog]
    .sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return timeB - timeA;
    })
    .map(({ content, faqs, keyTakeaways, wallpapers, ...summary }) => ({
      ...summary,
      content: [],
    }));

  return <BlogListClient initialPosts={posts} />;
}