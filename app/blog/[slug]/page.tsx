import { notFound, permanentRedirect } from 'next/navigation';
import {
  masterBlogCatalog,
  getBlogPostBySlug,
  BLOG_REDIRECT_MAP,
} from '@/lib/data/blogs-database';
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

  if (BLOG_REDIRECT_MAP[slug]) {
    permanentRedirect(BLOG_REDIRECT_MAP[slug]);
  }

  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const baseUrl = 'https://naturesmud.shop';
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const imgUrl = post.image?.startsWith('http')
    ? post.image
    : `${baseUrl}${post.image || '/products/sweet-potato-powder-100g.jpg'}`;

  const rawTitle = post.metaTitle || `${post.title} | NaturesMud`;
  const finalTitle = rawTitle.length <= 60 ? rawTitle : `${post.title.slice(0, 45).trim()} | NaturesMud`;
  const rawDesc = post.metaDescription || post.excerpt;
  const finalDesc = rawDesc.length <= 155 ? rawDesc : `${rawDesc.slice(0, 152).trim()}...`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDesc,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: canonicalUrl,
      siteName: 'NaturesMud',
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
      images: [imgUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '');

  if (BLOG_REDIRECT_MAP[slug]) {
    permanentRedirect(BLOG_REDIRECT_MAP[slug]);
  }

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = masterBlogCatalog
    .filter((p) => p.id !== post.id && p.category === post.category)
    .concat(masterBlogCatalog.filter((p) => p.id !== post.id && p.category !== post.category))
    .slice(0, 3)
    .map(({ content, faqs, keyTakeaways, wallpapers, ...summary }) => ({
      ...summary,
      content: [],
    }));

  const baseUrl = 'https://naturesmud.shop';
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const imgUrl = post.image?.startsWith('http')
    ? post.image
    : `${baseUrl}${post.image || '/products/sweet-potato-powder-100g.jpg'}`;

  const activeFaqs =
    post.faqs && post.faqs.length > 0
      ? post.faqs
      : [
          {
            question: `What makes NaturesMud superfoods & powders different in Nepal?`,
            answer: `NaturesMud products are crafted from 100% pure whole-food ingredients with 0 artificial additives, 0 preservatives, and 0 added refined sugar, packed fresh in airtight containers.`,
          },
          {
            question: `How should dehydrated fruits and superfood powders be stored in Nepal?`,
            answer: `Store all superfood powders, nuts, seeds, and dehydrated fruits in their tightly sealed jar or pouch in a cool, dry cupboard away from moisture and direct sunlight, always using a dry spoon.`,
          },
          {
            question: `Do you deliver across Kathmandu Valley and outside valley in Nepal?`,
            answer: `Yes, NaturesMud delivers within 24–48 hours across Kathmandu, Lalitpur, and Bhaktapur, and ships nationwide to Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Hetauda, Nepalgunj, Surkhet, and all 77 districts.`,
          },
        ];

  const blogGraphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        image: [imgUrl],
        author: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'NaturesMud',
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'NaturesMud',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/icon-512x512.png`,
          },
        },
        datePublished: post.date,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: activeFaqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <BlogPostClient post={post} relatedPosts={related} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogGraphSchema),
        }}
      />
    </>
  );
}