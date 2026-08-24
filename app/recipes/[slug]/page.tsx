import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Users, ChefHat, ArrowLeft, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { recipes } from '@/lib/data/recipes';
import { products, getProductById } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let recipe = recipes.find((r) => r.slug === slug);

  if (!recipe) {
    try {
      const res = await api.get(`/recipes/${slug}`);
      if (res.data) {
        recipe = {
          id: String(res.data.id),
          slug: res.data.slug,
          title: res.data.title,
          excerpt: res.data.excerpt || '',
          category: res.data.category || 'Healthy Food',
          image: res.data.featured_image || '/products/superfood-mix.jpg',
          prepTime: Number(res.data.prep_time || 10),
          cookTime: Number(res.data.cook_time || 10),
          servings: Number(res.data.servings || 2),
          difficulty: res.data.difficulty || 'Easy',
          ingredients: Array.isArray(res.data.ingredients) ? res.data.ingredients : [],
          instructions: Array.isArray(res.data.instructions) ? res.data.instructions : [],
          tags: res.data.tags || [],
        };
      }
    } catch {
      // fallback
    }
  }

  if (!recipe) return {};

  return {
    title: `${recipe.title} | Nature's Mud Organic Recipes Nepal`,
    description: recipe.excerpt,
    keywords: recipe.tags?.join(', ') || 'healthy recipes nepal, baby food recipe, organic recipes',
    openGraph: {
      title: recipe.title,
      description: recipe.excerpt,
      images: [recipe.image],
    },
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let recipe = recipes.find((r) => r.slug === slug);

  if (!recipe) {
    try {
      const res = await api.get(`/recipes/${slug}`);
      if (res.data) {
        recipe = {
          id: String(res.data.id),
          slug: res.data.slug,
          title: res.data.title,
          excerpt: res.data.excerpt || '',
          category: res.data.category || 'Healthy Food',
          image: res.data.featured_image || '/products/superfood-mix.jpg',
          prepTime: Number(res.data.prep_time || 10),
          cookTime: Number(res.data.cook_time || 10),
          servings: Number(res.data.servings || 2),
          difficulty: res.data.difficulty || 'Easy',
          ingredients: Array.isArray(res.data.ingredients) ? res.data.ingredients : [],
          instructions: Array.isArray(res.data.instructions) ? res.data.instructions : [],
          tags: res.data.tags || [],
        };
      }
    } catch {
      // fallback
    }
  }

  if (!recipe) notFound();

  const relatedProducts = products.slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-b from-[#F8F4EC] to-white border-b border-gray-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-semibold line-clamp-1">{recipe.title}</li>
            </ol>
          </nav>
          <Link href="/recipes" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" /> All Recipes
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-dark mt-3 leading-tight">
                {recipe.title}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                {recipe.excerpt}
              </p>
              <div className="flex flex-wrap gap-3 mt-6 text-xs sm:text-sm text-gray-700 font-medium">
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-sm">
                  <Clock className="w-4 h-4 text-primary" /> {recipe.prepTime} min prep
                </span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-sm">
                  <Clock className="w-4 h-4 text-primary" /> {recipe.cookTime} min cook
                </span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-sm">
                  <Users className="w-4 h-4 text-primary" /> {recipe.servings} servings
                </span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-sm">
                  <ChefHat className="w-4 h-4 text-primary" /> {recipe.difficulty}
                </span>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative aspect-[4/3] bg-gray-50">
              <Image
                src={recipe.image || '/products/naturesmud-all-products-100g.jpg'}
                alt={recipe.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Ingredients Card */}
              <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                  <h2 className="font-heading font-bold text-2xl text-dark">Ingredients Checklist</h2>
                </div>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-2xs">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-800 text-sm sm:text-base font-medium">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions Card */}
              <div className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <h2 className="font-heading font-bold text-2xl text-dark mb-6">Step-by-Step Instructions</h2>
                <ol className="space-y-5">
                  {recipe.instructions.map((instruction, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
                        {i + 1}
                      </span>
                      <div className="pt-1">
                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed">{instruction}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sidebar Recommended Ingredients */}
            <div>
              <div className="bg-[#F8F4EC] rounded-3xl p-6 sticky top-24 border border-gray-100 space-y-4">
                <h3 className="font-heading font-bold text-lg text-dark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-600" /> Recommended Products
                </h3>
                <p className="text-xs text-gray-500">Crafted with 100% Pure Himalayan Wholesomeness:</p>
                <div className="space-y-4 pt-2">
                  {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Recipe Schema for Google Rich Search Cards */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Recipe',
            name: recipe.title,
            description: recipe.excerpt,
            image: [recipe.image],
            author: {
              '@type': 'Organization',
              name: "Nature's Mud Culinary Team",
            },
            prepTime: `PT${recipe.prepTime}M`,
            cookTime: `PT${recipe.cookTime}M`,
            recipeYield: `${recipe.servings} servings`,
            recipeCategory: recipe.category,
            recipeIngredient: recipe.ingredients,
            recipeInstructions: recipe.instructions.map((step, idx) => ({
              '@type': 'HowToStep',
              text: step,
              position: idx + 1,
            })),
          }),
        }}
      />
    </>
  );
}