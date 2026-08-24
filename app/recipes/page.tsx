import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users } from 'lucide-react';
import { recipes as localRecipes } from '@/lib/data/recipes';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Healthy Recipes | Nature\'s Mud',
  description: 'Delicious and healthy recipes using Nature\'s Mud organic products. Breakfast, smoothies, snacks, and desserts.',
};

export default async function RecipesPage() {
  let recipeList: any[] = localRecipes;

  try {
    const res = await api.get('/recipes');
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      recipeList = res.data.data.map((r: any) => ({
        id: String(r.id),
        title: r.title,
        slug: r.slug,
        category: r.category || 'Healthy Snack',
        image: r.featured_image || r.image || '/products/superfood-mix.jpg',
        prepTime: Number(r.prep_time || 15),
        servings: Number(r.servings || 2),
        excerpt: r.excerpt || r.description || '',
      }));
    }
  } catch {
    recipeList = localRecipes;
  }

  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Recipes</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Healthy Recipes</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Delicious, nutritious recipes crafted with Nature's Mud organic ingredients.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipeList.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className="group bg-[#F8F4EC] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={recipe.image || '/products/naturesmud-all-products-100g.jpg'}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-[#3A6B35] uppercase tracking-wide">{recipe.category}</span>
                  <h2 className="font-heading font-semibold text-lg mt-1 group-hover:text-[#3A6B35] transition-colors">{recipe.title}</h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{recipe.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recipe.prepTime} min</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {recipe.servings} servings</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}