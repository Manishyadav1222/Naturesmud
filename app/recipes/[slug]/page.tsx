import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { Clock, Users, ChefHat, ArrowLeft, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { recipes, getRecipeBySlug, RECIPE_REDIRECT_MAP } from '@/lib/data/recipes';
import { products } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import RecipeAddIngredientsButton from '@/components/RecipeAddIngredientsButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function matchIngredientToProduct(ingredientLine: string) {
  const lower = ingredientLine.toLowerCase();
  if (!lower.includes('naturesmud')) return null;

  const rules: { match: string[]; slug: string }[] = [
    { match: ['sweet potato powder'], slug: 'sweet-potato-powder' },
    { match: ['dates powder'], slug: 'dates-powder' },
    { match: ['beetroot powder'], slug: 'beetroot-powder' },
    { match: ['carrot powder'], slug: 'carrot-powder' },
    { match: ['banana powder'], slug: 'banana-powder' },
    { match: ['moringa leaf powder', 'moringa powder'], slug: 'moringa-leaf-powder' },
    { match: ['barley grass powder'], slug: 'barley-grass-powder' },
    { match: ['avocado powder'], slug: 'freeze-dried-avocado-powder' },
    { match: ['strawberry powder'], slug: 'strawberry-powder' },
    { match: ['chia seeds'], slug: 'chia-seeds' },
    { match: ['flax seeds'], slug: 'flax-seeds' },
    { match: ['pumpkin seeds'], slug: 'pumpkin-seeds' },
    { match: ['sunflower seeds'], slug: 'sunflower-seeds' },
    { match: ['roasted almonds'], slug: 'roasted-almonds' },
    { match: ['raw almonds', 'himalayan almonds'], slug: 'raw-himalayan-almonds' },
    { match: ['roasted cashew'], slug: 'roasted-cashewnuts' },
    { match: ['cashew nuts', 'premium cashew'], slug: 'premium-cashewnuts' },
    { match: ['pistachio'], slug: 'premium-pistachio-roasted-salted' },
    { match: ['macadamia'], slug: 'macadamia-nuts' },
    { match: ['blueberries'], slug: 'dried-blueberries' },
    { match: ['cranberries'], slug: 'dried-cranberries' },
    { match: ['dehydrated mango', 'sun-dried mango'], slug: 'dehydrated-mango' },
    { match: ['dehydrated pineapple'], slug: 'dehydrated-pineapple' },
    { match: ['dehydrated apple'], slug: 'dehydrated-apple' },
    { match: ['dehydrated sweet papaya', 'papaya'], slug: 'dehydrated-papaya' },
    { match: ['coconut chips'], slug: 'dehydrated-coconut-chips' },
    { match: ['makhana', 'fox nuts'], slug: 'fox-nuts-makhana' },
    { match: ['raisins', 'kismis'], slug: 'golden-raisins-kismis' },
    { match: ['figs', 'anjeer'], slug: 'dry-figs-anjeer' },
    { match: ['apricots'], slug: 'dried-apricots' },
    { match: ['500 ml', '500ml'], slug: 'virgin-coconut-oil-500ml' },
    { match: ['coconut oil'], slug: 'virgin-coconut-oil-180ml' },
    { match: ['mustard oil'], slug: 'pure-natural-yellow-mustard-oil' },
    { match: ['black salt', 'bire noon'], slug: 'pure-himalayan-black-salt-bire-noon' },
    { match: ['pink salt'], slug: 'himalayan-pink-salt' },
    { match: ['shilajit'], slug: 'pure-mountain-himalayan-shilajit-resin' },
    { match: ['trail mix'], slug: 'superfood-trail-mix' },
  ];

  for (const r of rules) {
    if (r.match.some((m) => lower.includes(m))) {
      return products.find((p) => p.slug === r.slug) || null;
    }
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '');

  if (RECIPE_REDIRECT_MAP[slug]) {
    permanentRedirect(RECIPE_REDIRECT_MAP[slug]);
  }

  const recipe = getRecipeBySlug(slug);
  if (!recipe) return {};

  const baseUrl = 'https://naturesmud.shop';
  const canonicalUrl = `${baseUrl}/recipes/${recipe.slug}`;
  const imgUrl = recipe.image?.startsWith('http')
    ? recipe.image
    : `${baseUrl}${recipe.image || '/products/superfood-mix.jpg'}`;

  const rawTitle = recipe.metaTitle || `${recipe.title} | NaturesMud`;
  const finalTitle = rawTitle.length <= 60 ? rawTitle : `${recipe.title.slice(0, 45).trim()} | NaturesMud`;
  const rawDesc = recipe.metaDescription || recipe.excerpt;
  const finalDesc = rawDesc.length <= 155 ? rawDesc : `${rawDesc.slice(0, 152).trim()}...`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: canonicalUrl,
      siteName: 'NaturesMud',
      images: [imgUrl],
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

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '');

  if (RECIPE_REDIRECT_MAP[slug]) {
    permanentRedirect(RECIPE_REDIRECT_MAP[slug]);
  }

  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const matchedBySlugs = (recipe.productSlugs || [])
    .map((ps) => products.find((p) => p.slug === ps))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedProducts =
    matchedBySlugs.length > 0
      ? matchedBySlugs
      : products.slice(0, 3);

  const isBabyRecipe =
    recipe.category.toLowerCase().includes('baby') ||
    recipe.slug.includes('baby') ||
    recipe.title.toLowerCase().includes('6+ months') ||
    recipe.title.toLowerCase().includes('babies');

  const baseUrl = 'https://naturesmud.shop';
  const canonicalUrl = `${baseUrl}/recipes/${recipe.slug}`;
  const imgUrl = recipe.image?.startsWith('http')
    ? recipe.image
    : `${baseUrl}${recipe.image || '/products/superfood-mix.jpg'}`;

  const recipeGalleryImages = Array.from(
    new Set(
      [
        recipe.image || '/products/superfood-mix.jpg',
        ...relatedProducts.flatMap((p) =>
          Array.isArray(p.images) && p.images.length > 0 ? p.images.slice(0, 3) : [p.image]
        ),
      ].filter(Boolean)
    )
  ).slice(0, 8);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              <h1 className="post-title font-heading font-extrabold text-dark mt-3">
                {recipe.title}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                {recipe.excerpt}
              </p>

              {isBabyRecipe && (
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pediatric Feeding Note:</strong> Suitable for infants from 6 months, as advised by your pediatrician. Always introduce single ingredients first and serve lukewarm.
                  </span>
                </div>
              )}

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
            <div>
              <ProductImageGallery
                images={recipeGalleryImages}
                productName={recipe.title}
                badges={['organic']}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Ingredients Card with Direct Product Links */}
              <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-600" />
                    <h2 className="font-heading font-bold text-2xl text-dark">Ingredients Checklist</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    Click any NaturesMud ingredient to view product details
                  </span>
                </div>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, i) => {
                    const matchedProd = matchIngredientToProduct(ingredient);
                    return (
                      <li key={i} className="flex items-start justify-between gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-2xs">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-800 text-sm sm:text-base font-medium">
                            {matchedProd ? (
                              <Link
                                href={`/products/${matchedProd.slug}`}
                                className="text-[#2D5A27] hover:underline font-bold"
                              >
                                {ingredient}
                              </Link>
                            ) : (
                              ingredient
                            )}
                          </span>
                        </div>
                        {matchedProd && (
                          <Link
                            href={`/products/${matchedProd.slug}`}
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#2D5A27] bg-[#2D5A27]/10 px-2.5 py-1 rounded-lg hover:bg-[#2D5A27]/20 transition-colors"
                          >
                            <span>Shop ({matchedProd.weight})</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6">
                  <RecipeAddIngredientsButton products={relatedProducts} />
                </div>
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
                  <Sparkles className="w-4 h-4 text-gold-600" /> Shop Recipe Ingredients
                </h3>
                <p className="text-xs text-gray-600">
                  Official NaturesMud whole-food ingredients used in this recipe:
                </p>
                <RecipeAddIngredientsButton products={relatedProducts} />
                <div className="space-y-4 pt-2">
                  {relatedProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Recipe & BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Recipe',
                '@id': `${canonicalUrl}#recipe`,
                name: recipe.title,
                description: recipe.excerpt,
                image: [imgUrl],
                author: {
                  '@type': 'Organization',
                  '@id': `${baseUrl}/#organization`,
                  name: 'NaturesMud',
                },
                prepTime: `PT${recipe.prepTime}M`,
                cookTime: `PT${recipe.cookTime}M`,
                totalTime: `PT${Number(recipe.prepTime || 5) + Number(recipe.cookTime || 0)}M`,
                recipeYield: `${recipe.servings} servings`,
                recipeCategory: recipe.category,
                recipeCuisine: 'Nepali / Himalayan',
                keywords: Array.isArray(recipe.tags) ? recipe.tags.join(', ') : 'healthy recipe nepal, superfood recipe',
                nutrition: {
                  '@type': 'NutritionInformation',
                  calories: recipe.calories || '195 kcal',
                  servingSize: '1 serving',
                },
                recipeIngredient: recipe.ingredients,
                recipeInstructions: recipe.instructions.map((step, idx) => ({
                  '@type': 'HowToStep',
                  name: `Step ${idx + 1}`,
                  text: step,
                  position: idx + 1,
                })),
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                  { '@type': 'ListItem', position: 2, name: 'Recipes', item: `${baseUrl}/recipes` },
                  { '@type': 'ListItem', position: 3, name: recipe.title, item: canonicalUrl },
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}