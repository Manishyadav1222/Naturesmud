/**
 * NaturesMud Blog Article Template
 * 
 * COMPLIANCE CHECKLIST FOR BABY/INFANT ARTICLES:
 * □ Uses WHO, UNICEF, AAP or other authoritative pediatric/nutrition sources
 * □ No invented medical/nutritional claims
 * □ No claims that NaturesMud product is appropriate for infants unless labeling explicitly supports
 * □ No claims food: increases intelligence, prevents disease, cures condition, treats deficiency,
 *   improves immunity, makes babies grow faster, guarantees healthy development
 * □ No personalized medical advice
 * □ General educational info clearly distinguished from medical advice
 * □ For allergies, choking hazards, food safety, premature babies, feeding difficulties,
 *   medical conditions → advise consulting pediatric/health professional
 * □ Age ranges used carefully - don't assume recipe for one age works for another
 * □ Prioritize safe texture, preparation, hygiene, age-appropriate feeding
 * □ No "superfood", "brain food", "immune booster" marketing language for babies
 * □ Primary purpose: educate parents, not sell products
 * 
 * SEO REQUIREMENTS:
 * □ Target keyword in title (H1), first 100 words, 2-3 subheadings
 * □ 1500-2500 words for comprehensive coverage
 * □ 4-6 FAQs for FAQPage schema
 * □ 3-5 Key Takeaways
 * □ Table of Contents with anchor links
 * □ Internal links: 3-5 to related articles, 1-2 to product pages
 * □ External links: 2-3 to WHO/UNICEF/AAP authoritative sources
 * □ Featured product CTA (only where product labeling supports age)
 * □ Images: hero (1200x630), step photos, infographics with alt text
 * □ Meta description: 150-160 chars with keyword
 * □ JSON-LD Article + FAQPage schema (handled by page.tsx)
 */

export interface BlogArticleTemplate {
  // Required fields
  id: string;                    
  title: string;                 
  slug: string;                  
  excerpt: string;               
  category: string;              
  date: string;                  
  author: string;                
  readTime: number;              
  featured: boolean;             
  image: string;                 
  tags: string[];                
  
  // Content structure
  keyTakeaways?: string[];        
  content: string[];             
  faqs?: { question: string; answer: string }[];  
  
  // Product linking (ONLY where product labeling explicitly supports age)
  featuredProductSlug?: string;  
  featuredProductName?: string;  
  featuredProductPrice?: number; 
  featuredProductImage?: string; 
  
  // Optional enhancements
  tableOfContents?: { id: string; title: string }[];  
  metaDescription?: string;      
  wallpapers?: Array<{id: string; url: string; title?: string; quote?: string; aspectRatio?: '9:16' | '1:1' | '16:9' | '4:5' | 'any'; downloadUrl?: string}>;
  posters?: Array<{id: string; url: string; title?: string; quote?: string; aspectRatio?: '9:16' | '1:1' | '16:9' | '4:5' | 'any'; downloadUrl?: string}>;
}

/**
 * WHO/UNICEF CITATION HELPERS
 */
export const WHO_COMPLEMENTARY_FEEDING = {
  title: 'WHO: Complementary Feeding',
  url: 'https://www.who.int/health-topics/complementary-feeding',
  keyPoints: [
    'Start at 6 months (180 days) with continued breastfeeding to 2 years or beyond',
    'Feed 2–3 times/day at 6–8 months, 3–4 times/day at 9–11 months, 3–4 meals + 1–2 snacks at 12–24 months',
    'Gradually increase food consistency and variety',
    'Practice responsive feeding — feed slowly, encourage but don\'t force'
  ]
};

export const UNICEF_FEEDING_GUIDE = {
  title: 'UNICEF: Feeding Your Baby (6–24 Months)',
  url: 'https://www.unicef.org/parenting/nutrition/feeding-your-baby-6-24-months',
  keyPoints: [
    'Start with single-ingredient foods, no added salt/sugar',
    'Iron-rich foods critical from 6 months (meat, pulses, fortified cereals)',
    'Vitamin A from orange/yellow fruits and vegetables',
    'Continue breastfeeding alongside solids'
  ]
};

export const AAP_STARTING_SOLIDS = {
  title: 'AAP: Starting Solid Foods',
  url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
  keyPoints: [
    'Most babies ready around 6 months',
    'No need to delay allergenic foods (peanut, egg, dairy) — early introduction may reduce allergy risk',
    'Offer variety of flavors and textures',
    'Avoid added sugars and salt before 12 months'
  ]
};

/**
 * PRODUCT SLUG REFERENCE (from products.ts)
 * Use these exact slugs for featuredProductSlug
 */
export const PRODUCT_SLUGS = {
  // Powders (baby-appropriate)
  sweetPotatoPowder: 'sweet-potato-powder',        
  datesPowder: 'dates-powder',                      
  carrotPowder: 'carrot-powder',
  beetrootPowder: 'beetroot-powder',
  pumpkinPowder: 'pumpkin-powder',                  
  
  // Dried fruits (choking hazard whole - only as powder/puree for babies)
  driedBlueberries: 'dried-blueberries',            
  driedCranberries: 'dried-cranberries',            
  dehydratedMango: 'dehydrated-mango',              
  dehydratedApple: 'dehydrated-apple',              
  
  // Nuts/Seeds (choking hazard whole - only as powder/butter for babies)
  chiaSeeds: 'chia-seeds',                          
  flaxSeeds: 'flax-seeds',                          
  pumpkinSeeds: 'pumpkin-seeds',                    
  almonds: 'almonds',                               
  walnuts: 'walnuts',                               
  cashews: 'cashews',                               
  
  // Oils (safe for babies in small amounts)
  coconutOil: 'premium-coconut-oil',                
  
  // Fitness/Outdoor
  trailMix: 'trail-mix',                            
  roastedAlmonds: 'premium-roasted-almonds',
  beetrootPowderFitness: 'beetroot-powder',
  
  // Bundles
  starterKit: 'starter-kit',                        
  superfoodMix: 'immunity-shield-superfood-mix',
};

/**
 * BABY-SAFE PRODUCT USAGE NOTES
 * Only reference products where preparation makes them age-appropriate
 */
export const BABY_SAFE_PRODUCT_USAGE = {
  'sweet-potato-powder': {
    minAgeMonths: 6,
    preparation: 'Mix 1–2 tsp with breast milk, formula, or warm water to smooth puree. No cooking required.',
    safetyNote: 'Single ingredient, hypoallergenic, naturally smooth texture when mixed.'
  },
  'dates-powder': {
    minAgeMonths: 6,
    preparation: 'Use ½–1 tsp to naturally sweeten purees, porridge, or yogurt. No added sugar.',
    safetyNote: 'Natural fruit sweetener with fiber and minerals. Not a "sugar substitute" — still contains natural fruit sugars.'
  },
  'carrot-powder': {
    minAgeMonths: 6,
    preparation: 'Mix 1 tsp with warm water or breast milk for smooth puree. Rich in beta-carotene.',
    safetyNote: 'Single vegetable ingredient. Introduce after sweet potato if following single-food introduction.'
  },
  'chia-seeds': {
    minAgeMonths: 8,
    preparation: 'Soak ½ tsp in 2 tbsp water/breast milk for 10–15 min until gel forms. Stir into puree.',
    safetyNote: '**Never give dry chia seeds to babies** — they expand and pose choking risk. Always pre-soak to gel consistency.'
  },
  'pumpkin-seeds': {
    minAgeMonths: 8,
    preparation: 'Grind to fine powder. Mix ½ tsp into puree for zinc, magnesium, plant protein.',
    safetyNote: '**Whole seeds are a choking hazard.** Only use finely ground powder for babies 8+ months.'
  },
  'flax-seeds': {
    minAgeMonths: 8,
    preparation: 'Grind fresh (oxidizes quickly). Mix ½ tsp ground flax into puree for omega-3 ALA.',
    safetyNote: '**Whole flax seeds pass undigested.** Must be ground. Store ground flax in freezer.'
  },
  'premium-coconut-oil': {
    minAgeMonths: 6,
    preparation: 'Add ¼–½ tsp to warm puree for healthy fats (MCTs, lauric acid).',
    safetyNote: 'Use sparingly — babies get primary fats from breast milk/formula. Cold-pressed, unrefined.'
  }
};

/**
 * SAFETY DISCLAIMER TEXT - Include in ALL baby articles
 */
export const BABY_CONTENT_DISCLAIMER = `
> **Important Medical Disclaimer:** This article provides general educational information about infant nutrition and feeding practices based on guidelines from the World Health Organization (WHO), UNICEF, and the American Academy of Pediatrics (AAP). It is **not a substitute for personalized medical advice**. Every baby develops differently. For concerns about allergies, choking risks, feeding difficulties, premature birth, growth faltering, or any medical condition, **please consult your pediatrician or a qualified healthcare professional** who can evaluate your child's specific needs.
`;

/**
 * AGE-APPROPRIATE FEEDING REMINDER
 */
export const AGE_APPROPRIATE_REMINDER = `
> **Age & Safety Note:** The information in this article applies to babies **6 months and older** showing signs of readiness for complementary foods (sitting with support, good head control, interest in food, loss of tongue-thrust reflex). **Never give honey, whole nuts, whole grapes, popcorn, or other choking hazards to children under 4 years.** Always supervise meals. Introduce one new food at a time, waiting 3–5 days to watch for allergic reactions. Texture progression: smooth puree (6–7 months) → mashed/lumpy (8–9 months) → soft finger foods (9–12 months) → family foods (12+ months).
`;