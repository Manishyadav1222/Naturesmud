import Link from 'next/link';
import type { Metadata } from 'next';
import { categories } from '@/lib/data/categories';
import { products as localProducts, normalizeProduct, mergeLiveProductsWithCatalog, searchProductsCatalog } from '@/lib/data/products';
import { formatUnitPrice, getProductDossier } from '@/lib/data/product-seo-dossier';
import { ProductCard } from '@/components/ProductCard';
import { ProductSortSelect } from '@/components/ProductSortSelect';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryHubMeta {
  title: string; // <= 60 chars
  description: string; // <= 155 chars
  h1: string;
  introParagraph: string; // 100-150 words explaining how to pick between products in this category
  guideTitle: string;
  guideBody: string;
  bestFor: string[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
}

const CATEGORY_SEO_META: Record<string, CategoryHubMeta> = {
  'dried-fruits': {
    title: 'Dehydrated Fruits Price in Nepal | 0 Sugar | NaturesMud',
    description:
      'Buy 100% natural dehydrated fruits in Nepal (Rs. 415–690): Mango, Pineapple, Apple, Berries, Figs & Dates. 0 added sugar, 0 sulfur. Fast Nepal delivery.',
    h1: 'Naturally Dehydrated Fruits in Nepal',
    introParagraph:
      'Choosing the right dehydrated fruit depends on how your household plans to enjoy it. For crisp school tiffin and office desk snacking without sticky syrup, choose Dehydrated Apple Rings (Rs. 510 / 100 GM) or Dehydrated Coconut Chips (Rs. 475 / 100 GM). If you prefer chewy tropical fruit after lunch or on Himalayan treks, pick Dehydrated Mango (Rs. 595 / 100 GM), Dehydrated Pineapple (Rs. 590 / 100 GM), Dehydrated Papaya (Rs. 450 / 80 GM), or vibrant Dehydrated Dragon Fruit (Rs. 690 / 100 GM). For morning oats, yogurt bowls, and baking, tart Dried Blueberries (Rs. 650 / 100 GM) and Dried Cranberries (Rs. 415 / 100 GM) balance creamy grains, while sun-dried Dry Figs / Anjeer (Rs. 690 / 200 GM) and Dried Dates / Khajoor (Rs. 450 / 200 GM) work best for overnight soaking with warm milk.',
    guideTitle: 'Why Choose NaturesMud Naturally Dehydrated Fruits Over Commercial Candied Dry Fruit?',
    guideBody:
      'Most commercial dried fruits sold in supermarkets are boiled in refined sugar syrup and treated with sulfur dioxide (E220) to artificially preserve color. NaturesMud dehydrated fruits—including Himalayan Apple Rings, Mango, Pineapple, Papaya, Dragon Fruit, Dried Blueberries, Cranberries, Coconut Chips, Dry Figs (Anjeer), and Dried Dates (Khajoor)—are gently dehydrated at low temperatures with 0 added sugar, 0 preservatives, and 0 sulfur.',
    bestFor: [
      'Clean office desk snacking & school tiffin boxes in Kathmandu & Pokhara',
      'Lightweight, high-energy trail fuel for Himalayan trekking & hiking',
      'Morning oatmeal, chia seed pudding, smoothie bowls & festive gifting',
    ],
    faqs: [
      {
        q: 'Do NaturesMud dehydrated fruits contain added sugar or sulfur dioxide (सुकेको फलफूलमा चिनी मिसाइएको छ)?',
        a: 'No. Every NaturesMud dehydrated fruit is gently dried from ripe whole fruit with 0% refined sugar syrup, 0% sulfur dioxide (E220), and 0% artificial food coloring.',
      },
      {
        q: 'Which dehydrated fruit is best for kids’ school tiffin in Nepal?',
        a: 'Dehydrated Apple Rings (Rs. 510 / 100 GM), Dehydrated Mango (Rs. 595 / 100 GM), and Dried Blueberries (Rs. 650 / 100 GM) are the most popular non-messy school tiffin snacks for children.',
      },
      {
        q: 'How should I store dehydrated fruits during the Nepali monsoon (असार–भदौ)?',
        a: 'Because naturally dehydrated fruit contains zero chemical moisture blockers, always reseal the pouch or transfer slices into an airtight glass jar immediately after opening and store in a cool cupboard.',
      },
      {
        q: 'How fast is delivery for dehydrated fruits in Kathmandu and outside the valley?',
        a: 'We deliver across Kathmandu, Lalitpur, and Bhaktapur within 24–48 hours (Rs. 100 fee; free above Rs. 3,000) and to Pokhara, Chitwan, Butwal, Biratnagar, and all 77 districts in 2–5 business days.',
      },
    ],
    relatedLinks: [
      { label: 'Dehydrated Fruits vs Sugared Dry Fruit Guide', href: '/blog/freeze-dried-vs-dehydrated-fruits-nutrition-comparison' },
      { label: 'Dry Fruits Price in Nepal Buying Guide', href: '/blog/dry-fruits-price-in-nepal-2026-wholesale-retail-guide' },
      { label: 'Healthy Superfood Recipes', href: '/recipes' },
    ],
  },
  powders: {
    title: 'Pure Superfood & Baby Weaning Powders in Nepal | NaturesMud',
    description:
      'Shop 100% pure fruit & superfood powders in Nepal (Rs. 400–1,395): Sweet Potato, Dates, Banana, Avocado, Strawberry, Beetroot, Carrot & Moringa. 0 sugar.',
    h1: 'Pure Superfood & Fruit/Vegetable Powders in Nepal',
    introParagraph:
      'Selecting the right NaturesMud whole-food powder depends on your kitchen goal. For smooth infant weaning porridge (लिटो, जाउलो, खीर — from 6 months, as advised by your pediatrician), start with gentle, single-ingredient Sweet Potato Powder (Rs. 510 / 100 GM), Banana Powder (Rs. 650 / 100 GM), Carrot Powder (Rs. 490 / 100 GM), or creamy Freeze Dried Avocado Powder (Rs. 790 / 80 GM). To sweeten porridge, milk, or baking without refined white sugar, use 100% whole-fruit Dates Powder (Rs. 400 / 100 GM). For vibrant smoothies, yogurt bowls, and natural cake frosting, Freeze Dried Strawberry Powder (Rs. 1,395 / 80 GM) delivers real berry aroma, while Beetroot Powder (Rs. 430 / 100 GM) and shade-dried Moringa Leaf Powder / सजिवन पातको पाउडर (Rs. 690 / 100 GM) provide concentrated daily vegetable and leaf nutrition.',
    guideTitle: 'Single-Ingredient Himalayan Superfood Powders for Baby Weaning, Smoothies & Daily Nutrition',
    guideBody:
      'NaturesMud Superfood Powders are crafted from 100% real fruits, roots, and botanical leaves—Freeze Dried Avocado Powder, Freeze Dried Strawberry Powder, Banana Powder, Moringa Leaf Powder (Sajiwan / Sahijan), Sweet Potato Powder, Beetroot Powder, Carrot Powder, and Dates Powder. Every UV-protective glass jar contains a single whole-food ingredient with 0 maltodextrin, 0 artificial flavors, 0 preservatives, and 0 refined sugar.',
    bestFor: [
      'Wholesome infant weaning porridge (lito, jaulo, kheer) from 6 months, as advised by your pediatrician',
      'Natural whole-fruit sweetening with 100% Dates Powder instead of white sugar',
      'Daily smoothies, yogurt bowls, rotis & pre-workout drinks (Beetroot & Moringa)',
    ],
    faqs: [
      {
        q: 'Are NaturesMud powders suitable for babies (बच्चाको लिटोको लागि उपयुक्त छ)?',
        a: 'Yes. Our single-ingredient Banana, Sweet Potato, Carrot, Dates, and Freeze Dried Avocado powders contain 100% pure whole food with zero added sugar, salt, or maltodextrin. Introduce from 6 months, as advised by your pediatrician.',
      },
      {
        q: 'What is Moringa Leaf Powder called in Nepali?',
        a: 'In Nepal, Moringa oleifera is known as सजिवन (Sajiwan) or सहिजन (Sahijan), and locally also called शीतलचिनी (Shitalchini). Our Moringa Leaf Powder is shade-dried from young green leaves.',
      },
      {
        q: 'Why are Freeze Dried Strawberry and Avocado Powders packed in 80 GM jars?',
        a: 'Freeze-drying removes water by vacuum sublimation at sub-zero temperatures, producing a lighter, lower-density powder that fills the same reusable glass jar volume at 80 GM net weight.',
      },
      {
        q: 'How do I prevent pure fruit powders from clumping in humid weather?',
        a: 'Because we use 0% chemical anti-caking agents (no silicon dioxide), always use a bone-dry spoon, avoid holding the open jar over steaming pots, and close the lid tightly after every scoop.',
      },
    ],
    relatedLinks: [
      { label: 'Baby Weaning Food Chart in Nepal (6–12M)', href: '/blog/baby-food-nepal-6-months-chart-weaning-guide' },
      { label: 'Banana & Weaning Porridge Guide in Nepal', href: '/blog/banana-powder-in-nepal-baby-food-smoothies-baking-guide' },
      { label: 'Moringa Powder Guide in Nepal', href: '/blog/moringa-powder-benefits-nepal-how-to-use-daily' },
    ],
  },
  nuts: {
    title: 'Mountain Nuts Price in Nepal | Almonds, Cashews | NaturesMud',
    description:
      'Order whole nuts online in Nepal (Rs. 750–1,250): Raw & Roasted Almonds, Cashews, Pistachios, Macadamia & Superfood Trail Mix. Fast delivery across Nepal.',
    h1: 'Premium Mountain Nuts & Trail Mixes in Nepal',
    introParagraph:
      'Picking the right nut depends on whether you prefer morning soaking, oil-free desk snacking, or Himalayan trail fuel. If you soak almonds overnight in water (भिजाएको बदाम) or blend homemade almond milk, choose unpasteurized Raw Almonds (Rs. 750 / 200 GM). For ready-to-eat crunch with afternoon chiya or coffee without deep-frying oil, pick dry Roasted Almonds (Rs. 750 / 200 GM) or dry Roasted Cashew Nuts (Rs. 750 / 150 GM). For creamy kheer, festive sweets, and homemade cashew butter, raw whole W240 Premium Cashew Nuts (Rs. 750 / 200 GM) blend smoothly. When you want gourmet snacking or festive Dashain/Tihar gifting, choose Premium Pistachio Roasted & Salted (Rs. 1,250 / 200 GM), buttery Macadamia Nuts (Rs. 1,100 / 200 GM), or our 6-in-1 Superfood Trail Mix (Rs. 790 / 200 GM).',
    guideTitle: 'Unbleached, Crunch-Locked Whole Nuts Packed Fresh for Nepali Households',
    guideBody:
      'From unpasteurized Raw Almonds (ideal for overnight soaking) to slow dry-roasted Almonds, Cashews, Pistachios, Macadamia Nuts, and our signature Superfood Trail Mix, NaturesMud nuts are graded for whole-kernel quality and freshness without palm-oil frying or chemical bleaching.',
    bestFor: [
      'Morning soaked almonds (badam) for students, professionals & families',
      'Oil-free dry-roasted evening snacking & post-workout plant protein',
      'Dashain, Tihar, Bhai Tika & corporate wellness gift hampers in Nepal',
    ],
    faqs: [
      {
        q: 'What is the difference between Raw Almonds and Roasted Almonds (काँचो र भुटेको बदाम)?',
        a: 'Both cost Rs. 750 for 200 GM. Choose Raw Almonds if you soak almonds overnight in water and peel the skin in the morning; choose dry Roasted Almonds for immediate crunchy snacking without soaking.',
      },
      {
        q: 'Why is Roasted Cashew Nuts 150 GM while raw Premium Cashew Nuts is 200 GM at Rs. 750?',
        a: 'Slow dry-roasting removes natural kernel moisture and requires small-batch artisan roasting labor, so Roasted Cashew Nuts is packed at 150 GM while raw W240 Premium Cashew Nuts is packed at 200 GM.',
      },
      {
        q: 'Are NaturesMud roasted nuts fried in palm or vegetable oil?',
        a: 'Never. All NaturesMud roasted nuts are slow dry-roasted in hot air with zero added cooking oil, palm oil, or MSG.',
      },
      {
        q: 'What is inside the Superfood Trail Mix (Rs. 690 / 200 GM)?',
        a: 'It combines whole almonds, cashew nuts, raw green pumpkin seeds, black chia seeds, dried blueberries, and dried cranberries with zero added sugar.',
      },
    ],
    relatedLinks: [
      { label: 'Dry Fruits Price in Nepal Buying Guide', href: '/blog/dry-fruits-price-in-nepal-2026-wholesale-retail-guide' },
      { label: 'Healthy Superfood Combos & Gift Packs', href: '/offers' },
      { label: 'Interactive 2026 Price List', href: '/catalog' },
    ],
  },
  seeds: {
    title: 'Chia, Pumpkin, Flax Seeds & Makhana Price Nepal | NaturesMud',
    description:
      'Buy pure superfood seeds in Nepal (Rs. 390–650): Chia Seeds (300g), Pumpkin Seeds (300g), Flax Seeds / Alash (200g) & Makhana (50g). Fast Nepal delivery.',
    h1: 'Organic Superfood Seeds & Makhana in Nepal',
    introParagraph:
      'Each seed in our collection serves a distinct daily kitchen role. If you want a morning hydration gel, lemon-chia water, or overnight pudding rich in soluble fiber and plant Omega-3, choose raw Black Chia Seeds (Rs. 495 / 300 GM Glass Jar). If you want a crunchy, high-zinc and magnesium topping for oatmeal, salads, or evening snacking, pick Raw Green Pumpkin Seeds / फर्सीको बिया (Rs. 650 / 300 GM Glass Jar). For traditional Nepali roasted chhop (आलसको छोप) or freshly ground lignan-rich flour in rotis, choose whole Brown Flax Seeds / Alash (Rs. 570 / 200 GM). And when you want a light, low-calorie roasted evening snack instead of fried chips or biscuits, pop Makhana / Fox Nuts (Rs. 390 / 50 GM) in a dry pan with a drop of ghee.',
    guideTitle: 'Plant Omega-3, Zinc & Prebiotic Fiber: Essential Daily Seeds for Nepali Kitchens',
    guideBody:
      'Seeds are concentrated whole-food sources of trace minerals, plant protein, and essential fatty acids. Our seed lineup includes raw hydrophilic Black Chia Seeds, AAA-grade Raw Green Pumpkin Seeds, whole Brown Flax Seeds (Alash), and crunchy lotus-seed Makhana (Fox Nuts)—cleaned and packed without preservatives.',
    bestFor: [
      'Overnight chia seed puddings & morning lemon-chia hydration water',
      'Daily zinc & magnesium intake from raw green pumpkin seed kernels',
      'Light pan-toasted Makhana snacking & traditional Nepali Alash ko Chhop',
    ],
    faqs: [
      {
        q: 'How much do Chia Seeds and Pumpkin Seeds cost per 100g at NaturesMud?',
        a: 'Both come in large 300 GM glass jars: Chia Seeds is Rs. 495 (Rs. 165 per 100g) and Raw Green Pumpkin Seeds is Rs. 650 (Rs. 216.67 per 100g).',
      },
      {
        q: 'Should I eat Flax Seeds (आलस) whole or ground?',
        a: 'Lightly dry-roast and grind Flax Seeds into a coarse powder (or traditional Nepali Alash ko Chhop) before eating so your body can absorb the Omega-3 ALA and lignans inside the seed hull.',
      },
      {
        q: 'How do I prepare Makhana (Fox Nuts) for evening chiya snacking?',
        a: 'Dry-roast Makhana in a heavy pan over low heat for 5–6 minutes with 1/2 teaspoon of ghee or virgin coconut oil and a pinch of Himalayan Pink Salt until crisp.',
      },
      {
        q: 'Can I combine Chia Seeds, Pumpkin Seeds, and Flax Seeds daily?',
        a: 'Yes! Many customers soak 1 tbsp Chia Seeds in morning water, top their breakfast oats with 1 tbsp Pumpkin Seeds, and enjoy roasted Flax Seed chhop with lunch dal-bhat.',
      },
    ],
    relatedLinks: [
      { label: 'Chia Seeds Price & Daily Uses in Nepal', href: '/blog/chia-seeds-price-in-nepal-benefits-weight-loss-guide' },
      { label: 'Healthy Superfood Recipes', href: '/recipes' },
      { label: 'Explore Seed & Superfood Combos', href: '/offers' },
    ],
  },
  oils: {
    title: 'Extra Virgin Coconut Oil Price in Nepal | 500ml & 180ml',
    description:
      'Buy pure cold-pressed Extra Virgin Coconut Oil in Nepal: 180ml (Rs. 650) & 500ml (Rs. 1,750). Unrefined, chemical-free for baby massage, cooking & hair.',
    h1: 'Cold-Pressed Extra Virgin Coconut Oil in Nepal',
    introParagraph:
      'NaturesMud Cold-Pressed Extra Virgin Coconut Oil (नरिवलको तेल) is extracted from fresh coconut milk without heat, hexane solvents, bleaching, or deodorizing, and is offered in two convenient pack sizes so you can match your household usage. Choose the compact 180 ML jar (Rs. 650 — Rs. 361.11 per 100ml) if you want a dedicated jar for your baby’s massage table, bedside skincare, morning Ayurvedic oil pulling (गण्डूष), or travel bag. Choose the family-value 500 ML jar (Rs. 1,750 — Rs. 350 per 100ml) if your household uses virgin coconut oil daily for clean sautéing, baking, bulletproof coffee, hair oiling, and full-body winter moisturizing.',
    guideTitle: 'Unrefined Cold-Pressed Virgin Coconut Oil — Culinary, Baby Care & Ayurvedic Purity',
    guideBody:
      'Unlike refined, bleached, and deodorized (RBD) commercial coconut oils extracted from dried copra using high heat and chemical solvents, NaturesMud Extra Virgin Coconut Oil is cold-pressed from fresh coconut milk below 40°C. It retains its natural Lauric Acid (MCT) profile and gentle fresh coconut aroma.',
    bestFor: [
      'Clean everyday cooking, baking, oatmeal & bulletproof coffee',
      'Gentle, chemical-free baby skin massage & winter skin moisturizing',
      'Ayurvedic morning oil pulling (Gandusha) & deep hair/scalp conditioning',
    ],
    faqs: [
      {
        q: 'Which size of Extra Virgin Coconut Oil should I buy — 180 ML or 500 ML?',
        a: 'Both contain the exact same cold-pressed unrefined oil. Pick 180 ML (Rs. 650) for baby massage, skincare, or travel; pick 500 ML (Rs. 1,750) for everyday kitchen cooking and family use.',
      },
      {
        q: 'Why does pure virgin coconut oil solidify in Kathmandu winters?',
        a: 'Pure unrefined coconut oil naturally solidifies below 24°C (76°F) and melts back into a crystal-clear liquid in warm weather. Solidification in winter is a natural sign of unrefined purity.',
      },
      {
        q: 'Is this coconut oil safe for both cooking and newborn baby massage?',
        a: 'Yes. Because it is 100% food-grade cold-pressed extra virgin coconut oil with zero mineral oil, parabens, or synthetic fragrance, it is suitable for both kitchen cooking and gentle baby skin massage.',
      },
    ],
    relatedLinks: [
      { label: 'Virgin Coconut Oil Uses for Baby, Hair & Cooking', href: '/blog/cold-pressed-virgin-coconut-oil-and-mustard-oil-guide-nepal' },
      { label: 'Baby Weaning Food Chart in Nepal (6–12M)', href: '/blog/baby-food-nepal-6-months-chart-weaning-guide' },
      { label: 'View Complete 2026 Price List', href: '/catalog' },
    ],
  },
  'salts-spices': {
    title: 'Himalayan Pink Salt, Bire Noon & Shilajit Price in Nepal',
    description:
      'Shop unrefined Himalayan Pink Salt (Rs. 250), Black Salt / Bire Noon (Rs. 220) & Pure Himalayan Shilajit Resin (Rs. 1,995) in Nepal. Fast delivery.',
    h1: 'Pure Himalayan Salts & High-Altitude Shilajit Resin in Nepal',
    introParagraph:
      'Our Himalayan mineral collection brings unrefined mountain salts and traditional high-altitude resin directly to your kitchen. For everyday dal, tarkari, soups, and morning lemon-electrolyte water without chemical bleaching or synthetic anti-caking agents, choose Himalayan Pink Salt / सिधे नुन (Rs. 250 / 200 GM — Rs. 125 per 100g). When you want the classic tangy, sulfurous aroma for fresh fruit chaat, cucumber salad, raita, jaljeera, or Nepali tomato-timur achar, pick Himalayan Black Salt / बिरे नुन (Rs. 220 / 200 GM — Rs. 110 per 100g). And for adults seeking a traditional Surya-Tapi purified high-altitude mineral resin to dissolve in warm morning water or milk, choose Pure Himalayan Shilajit Resin (Rs. 1,995 / 20 GM UV Glass Jar).',
    guideTitle: 'Ancient Unrefined Himalayan Mineral Salts & Traditional Surya-Tapi Shilajit',
    guideBody:
      'Replace heavily bleached industrial table salt with NaturesMud unrefined Himalayan Pink Salt (Sindhe Noon) and traditional Himalayan Black Salt (Bire Noon), and explore authentic high-altitude Pure Himalayan Shilajit Resin packed in a UV-protective glass jar.',
    bestFor: [
      'Everyday mineral-rich cooking & morning electrolyte water with Pink Salt',
      'Tangy fruit salads, lemon-water, raita & Nepali chutneys with Bire Noon',
      'Traditional morning warm-water or milk ritual for adults with Shilajit Resin',
    ],
    faqs: [
      {
        q: 'What is the difference between Himalayan Pink Salt (सिधे नुन) and Black Salt (बिरे नुन)?',
        a: 'Himalayan Pink Salt (Rs. 250 / 200 GM) has a clean, balanced mineral taste for everyday cooking. Himalayan Black Salt / Bire Noon (Rs. 220 / 200 GM) is kiln-fired with herbs, giving it a savory sulfurous aroma ideal for fruit salads, raita, and chutneys.',
      },
      {
        q: 'Do NaturesMud salts contain iodine or chemical anti-caking agents?',
        a: 'No. Both salts are 100% unrefined rock salts with zero synthetic anti-caking agents or bleaching chemicals. If your physician recommends dietary iodine supplementation, pair unrefined rock salt with iodine-rich foods.',
      },
      {
        q: 'How is Pure Himalayan Shilajit Resin (Rs. 1,995 / 20 GM) used?',
        a: 'Adults dissolve a pea-sized portion (250–300 mg) in warm (not boiling) water or milk once daily. Not recommended for children, pregnant or nursing women.',
      },
    ],
    relatedLinks: [
      { label: 'Shilajit Price in Nepal & Purity Identification Guide', href: '/blog/how-to-test-pure-himalayan-shilajit-resin-at-home-nepal' },
      { label: 'Interactive 2026 Price List', href: '/catalog' },
      { label: 'Explore All Products', href: '/products' },
    ],
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';
  const catMeta = category ? CATEGORY_SEO_META[category] : null;

  const title = catMeta
    ? catMeta.title
    : 'Pure Himalayan Superfoods, Powders & Dry Fruits in Nepal';
  const description = catMeta
    ? catMeta.description
    : 'Shop 32 pure NaturesMud foods in Nepal: dehydrated fruits, baby weaning & superfood powders, mountain nuts, seeds, coconut oil & salts. Fast Nepal delivery.';
  const canonicalUrl = category
    ? `${baseUrl}/category/${encodeURIComponent(category)}`
    : `${baseUrl}/products`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'NaturesMud Nepal',
      type: 'website',
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string; search?: string }>;
}) {
  const { category, sort, q, search } = await searchParams;
  const searchQuery = (q || search || '').trim();
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';

  let allProducts: Product[] = mergeLiveProductsWithCatalog(null);
  try {
    const res = await api.get('/products', {
      params: { per_page: 100, nocache: 1, _t: Date.now() },
    });
    const rawList = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];
    if (rawList.length > 0) {
      allProducts = mergeLiveProductsWithCatalog(rawList);
    }
  } catch {
    allProducts = mergeLiveProductsWithCatalog(null);
  }

  let filtered = allProducts;
  if (category) {
    filtered = filtered.filter(
      (p) => p.categorySlug === category || p.category?.toLowerCase() === category.toLowerCase()
    );
  }
  if (searchQuery) {
    filtered = searchProductsCatalog(filtered, searchQuery);
  }

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sort === 'popular') filtered = filtered.filter((p) => p.isBestSeller);

  const activeCategoryObj = category ? categories.find((c) => c.slug === category) : null;
  const activeSeoMeta = category ? CATEGORY_SEO_META[category] : null;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': category
          ? `${baseUrl}/category/${category}#collection`
          : `${baseUrl}/products#collection`,
        name: activeSeoMeta?.h1 || activeCategoryObj?.name || 'Pure Himalayan Superfoods in Nepal',
        description:
          activeSeoMeta?.description ||
          'Explore 100% natural dehydrated fruits, pure superfood powders, raw mountain nuts, seeds, and cold-pressed virgin oils across Nepal.',
        url: category ? `${baseUrl}/category/${category}` : `${baseUrl}/products`,
        isPartOf: { '@id': `${baseUrl}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: filtered.length,
          itemListElement: filtered.slice(0, 32).map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: p.official_label_name || p.name,
            url: `${baseUrl}/products/${p.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${baseUrl}/products` },
          ...(activeCategoryObj
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: activeCategoryObj.name,
                  item: `${baseUrl}/category/${activeCategoryObj.slug}`,
                },
              ]
            : []),
        ],
      },
      ...(activeSeoMeta?.faqs && activeSeoMeta.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${baseUrl}/category/${category}#faq`,
              mainEntity: activeSeoMeta.faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* Header */}
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link href="/products" className="hover:text-[#3A6B35]">Products</Link></li>
                  {activeCategoryObj && (
                    <>
                      <li aria-hidden="true">/</li>
                      <li className="text-[#3A6B35] font-medium">{activeCategoryObj.name}</li>
                    </>
                  )}
                </ol>
              </nav>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#2B2B2B] tracking-tight">
                {activeSeoMeta?.h1 ||
                  (category
                    ? activeCategoryObj?.name || category
                    : 'Pure Himalayan Superfoods in Nepal')}
              </h1>
              <p className="text-gray-700 mt-3 max-w-3xl text-sm sm:text-base leading-relaxed">
                {activeSeoMeta?.introParagraph ||
                  'Explore all 32 NaturesMud whole-food products in Nepal—crafted with 0% refined sugar, 0% artificial preservatives, and 0% synthetic dyes. Compare official label weights, unit prices per 100g/100ml, and Nepali kitchen uses across our dehydrated fruits, single-ingredient baby weaning & superfood powders, raw and dry-roasted mountain nuts, seeds, cold-pressed virgin coconut oil, and Himalayan mineral salts.'}
              </p>
            </div>

            {/* Quick Catalog Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3D2F] hover:bg-[#2D5A27] text-white text-xs sm:text-sm font-heading font-bold shadow-sm transition-all"
              >
                Interactive Price List
              </Link>
              <a
                href="/api/catalog/download"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9982A] hover:bg-[#B88720] text-[#1B3D2F] text-xs sm:text-sm font-heading font-bold shadow-sm transition-all"
              >
                Download Catalog (PDF)
              </a>
            </div>
          </div>

          {/* 🎉 Glowing Dashain Offer Strip on Shop Page */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#5a0b0b] via-[#8b1515] to-[#1a3826] p-4 sm:p-5 text-white border-2 border-amber-400/60 shadow-lg dashain-glow-box flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-[#4a0808] text-[10px] font-black uppercase tracking-wider">
                🎉 Dashain Blessings &amp; Health · Valid Till Dashain End
              </div>
              <p className="font-heading text-base sm:text-xl font-black text-amber-200 dashain-glow-text">
                🚚 Free Delivery Over Rs. 3,000 · 🎁 Free Delivery + Free Pink Salt Over Rs. 5,000+
              </p>
              <p className="text-xs text-amber-100/90">
                Order any NaturesMud superfoods and unlock Free Delivery over Rs. 3,000 + a Free Himalayan Pink Salt (200g) jar on orders over Rs. 5,000+!
              </p>
            </div>
            <Link
              href="/offers"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#4a0808] font-heading font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
            >
              View Dashain Offer &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-gray-100 bg-white sticky top-16 lg:top-20 z-30 shadow-sm w-full max-w-full overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto w-full max-w-full no-scrollbar">
          <Link
            href="/products"
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !category
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c.slug
                  ? 'bg-[#3A6B35] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> pure whole-food products
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs sm:text-sm text-gray-600">Sort by:</label>
              <ProductSortSelect defaultValue={sort} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-[#F8F4EC]/50 rounded-3xl p-6 sm:p-8 border border-dashed border-gray-200">
              <p className="font-heading font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800">No products found</p>
              <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-md mx-auto">Try a different category filter or browse our entire catalog.</p>
              <Link href="/products" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#3A6B35] text-white font-semibold text-xs sm:text-sm hover:bg-[#2d5429] transition-colors shadow-sm">
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((product, idx) => (
                <ProductCard key={product.id || product.slug} product={product} index={idx} />
              ))}
            </div>
          )}

          {/* Category Price, Weight & Unit-Price Comparison Table */}
          {filtered.length > 0 && (
            <div className="mt-14 bg-white rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-sm">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1A3826] mb-2">
                {activeCategoryObj
                  ? `${activeCategoryObj.name} — Price, Net Weight & Unit Price Comparison in Nepal`
                  : 'All 32 NaturesMud Products — Price, Net Weight & Unit Price Comparison in Nepal'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-5">
                Compare official physical label names, Nepali names, net pack weights, NPR prices, and calculated unit prices across this category.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-stone-200 bg-[#FAF7F2] text-[#1A3826] font-heading font-bold">
                      <th className="py-3 px-3">Official Label Name</th>
                      <th className="py-3 px-3">Nepali Name</th>
                      <th className="py-3 px-3">Net Weight</th>
                      <th className="py-3 px-3">Price (NPR)</th>
                      <th className="py-3 px-3">Unit Price</th>
                      <th className="py-3 px-3">Packaging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filtered.map((p) => {
                      const d = getProductDossier(p.slug);
                      const officialName = p.official_label_name || p.name;
                      const weightStr = p.weight || '100 GM';
                      const unitPriceStr = formatUnitPrice(p.price, weightStr);
                      return (
                        <tr key={p.slug} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#1A3826]">
                            <Link href={`/products/${p.slug}`} className="hover:underline">
                              {officialName}
                            </Link>
                          </td>
                          <td className="py-3 px-3 text-gray-600">
                            {d ? `${d.nepaliNameDevanagari} (${d.nepaliNameRoman})` : '—'}
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-800">{weightStr}</td>
                          <td className="py-3 px-3 font-bold text-[#1A3826]">Rs. {p.price.toLocaleString('en-NP')}</td>
                          <td className="py-3 px-3 text-gray-700">{unitPriceStr}</td>
                          <td className="py-3 px-3 text-gray-600">{p.packing || 'Food-Grade Pack'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category Buying Guide & SEO Context Block */}
          <div className="mt-10 bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-stone-200/80">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1A3826] mb-3">
              {activeSeoMeta?.guideTitle ||
                'Why Nepali Families Trust NaturesMud Pure Superfoods, Powders & Dehydrated Fruits'}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
              {activeSeoMeta?.guideBody ||
                'Every NaturesMud product is crafted with a strict 0-Additive, 0-Preservative, and 0-Refined-Sugar standard. Whether you are preparing single-ingredient weaning porridge for a baby (from 6 months, as advised by your pediatrician), replacing refined white sugar with 100% Dates Powder, packing lightweight dehydrated fruits for a Himalayan trek, or stocking your family pantry with raw mountain almonds, chia seeds, pumpkin seeds, and cold-pressed virgin coconut oil, we deliver pure whole foods directly to your doorstep across Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Hetauda, Nepalgunj, and Surkhet.'}
            </p>
            {activeSeoMeta?.bestFor && (
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-[#7A5230] mb-2.5">
                  Ideal Daily Uses in Nepal:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeSeoMeta.bestFor.map((item, i) => (
                    <li
                      key={i}
                      className="bg-white rounded-xl p-3.5 text-xs sm:text-sm text-gray-700 border border-stone-200/60 font-medium"
                    >
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category FAQs */}
            {activeSeoMeta?.faqs && activeSeoMeta.faqs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-stone-200/80">
                <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1A3826] mb-4">
                  Frequently Asked Questions — {activeCategoryObj?.name} in Nepal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSeoMeta.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200/70">
                      <h4 className="font-heading font-bold text-sm sm:text-base text-[#1A3826] mb-1.5">
                        {faq.q}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-stone-200/80 text-xs sm:text-sm font-semibold text-[#3A6B35]">
              {(activeSeoMeta?.relatedLinks || [
                { label: 'View Complete 2026 Price List', href: '/catalog' },
                { label: 'Explore Superfood Combo Offers', href: '/offers' },
                { label: 'Browse Healthy Superfood Recipes', href: '/recipes' },
                { label: 'Read Nutrition & Weaning Guides', href: '/blog' },
              ]).map((link, idx) => (
                <Link key={idx} href={link.href} className="hover:underline">
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
    </>
  );
}