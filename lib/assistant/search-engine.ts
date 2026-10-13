import { ASSISTANT_KNOWLEDGE_BASE, AssistantQA } from '@/lib/data/assistant-knowledge-base';
import { products } from '@/lib/data/products';
import { Product } from '@/lib/types';

export interface AssistantSearchResult {
  item: AssistantQA;
  score: number;
  matchedProduct?: Product;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'of', 'for', 'to', 'from', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'it', 'its', 'this', 'that', 'these', 'those',
  'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will', 'have', 'has', 'had',
  'what', 'how', 'when', 'where', 'why', 'who', 'which', 'and', 'or', 'so', 'if',
  'you', 'your', 'i', 'my', 'we', 'our', 'me', 'us', 'sell', 'get', 'give',
  // Nepali common particles
  'ko', 'ma', 'ki', 'ho', 'cha', 'chha', 'lai', 'bata', 'le', 'ni', 'nai', 'ra', 'va', 'k'
]);

const COMMON_MODIFIERS = new Set(['blue', 'red', 'green', 'black', 'white', 'yellow', 'pure', 'best', 'good', 'top', 'fresh']);

function cleanTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\bnepal\b/g, ' ')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"“”]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export function searchAssistantKnowledge(query: string): AssistantSearchResult[] {
  const qLower = String(query || '').toLowerCase().trim();
  const queryTokens = cleanTokens(query);
  if (queryTokens.length === 0 && qLower.length === 0) return [];

  // Identify if any product is explicitly referenced in query
  let targetedProduct: Product | null = null;
  for (const p of products) {
    const pName = p.name.toLowerCase();
    const pSlugWords = p.slug.replace(/-/g, ' ');
    if (qLower.includes(pName) || qLower.includes(pSlugWords)) {
      targetedProduct = p;
      break;
    }
  }

  const NEPALI_PRODUCT_MAP: Record<string, string[]> = {
    'dates-powder': ['खजुर', 'khajoor', 'khajur'],
    'banana-powder': ['केरा', 'kera'],
    'sweet-potato-powder': ['सखरखण्ड', 'sakharkhanda'],
    'beetroot-powder': ['चुकन्दर', 'chukandar'],
    'carrot-powder': ['गाजर', 'gajar'],
    'moringa-powder': ['सजिउन', 'मोरिङ्गा', 'sajiwan'],
    'freeze-dried-avocado-powder': ['एभोकाडो', 'घिउ फल', 'avocado'],
    'dry-figs-anjeer': ['अन्जिर', 'अञ्जीर', 'anjeer'],
    'himalayan-pink-salt': ['गुलाबी नुन', 'पिंक साल्ट', 'pink salt'],
    'chia-seeds': ['चिया सिड', 'chia'],
    'roasted-almonds': ['हाडे बदाम', 'भुटेको बदाम'],
    'raw-himalayan-almonds': ['काँचो बदाम', 'raw almond'],
    'premium-cashewnuts': ['काजु', 'kaju'],
    'roasted-salted-cashews': ['भुटेको काजु'],
    'walnut-kernels': ['ओखर', 'okhar'],
    'roasted-pistachios': ['पिस्ता', 'pista'],
    'pumpkin-seeds': ['फर्सीको बियाँ', 'फर्सीको बीउ', 'pumpkin seed'],
    'sunflower-seeds': ['सूर्यमुखी', 'sunflower seed'],
    'flax-seeds': ['अलस', 'aalas'],
    'raw-wildflower-honey': ['मह', 'maha'],
    'cold-pressed-mustard-oil': ['तोरीको तेल', 'tori ko tel'],
    'virgin-coconut-oil-500ml': ['नरिवलको तेल', 'nariwal ko tel'],
    'dehydrated-mango': ['सुकेको आँप', 'आँप', 'dried mango'],
    'dehydrated-papaya': ['सुकेको मेवा', 'मेवा', 'dried papaya'],
    'dehydrated-pineapple': ['भुइँकटहर', 'dried pineapple'],
    'dehydrated-kiwi': ['किवि', 'dried kiwi'],
    'dehydrated-apple-slices': ['स्याउ', 'dried apple'],
    'high-altitude-green-tea': ['ग्रीन टी', 'green tea'],
    'makhana-fox-nuts': ['मखाना', 'makhana'],
    'roasted-chana': ['चना', 'chana'],
    'dried-apricots': ['खुर्पानी', 'apricot'],
    'black-raisins': ['किसमिस', 'kismis'],
  };

  if (!targetedProduct) {
    for (const [slug, names] of Object.entries(NEPALI_PRODUCT_MAP)) {
      if (names.some((n) => query.includes(n) || qLower.includes(n))) {
        targetedProduct = products.find((p) => p.slug === slug) || null;
        if (targetedProduct) break;
      }
    }
  }

  // Detect sensitive safety / medical keywords
  const isSafetyQuery = /(diabetes|anemia|cure|cancer|blood pressure|hypertension|botulism|infant.*honey|honey.*baby|baby.*honey|under 6 month|under 6m|insulin)/i.test(
    qLower
  );

  const results: AssistantSearchResult[] = [];

  for (const qa of ASSISTANT_KNOWLEDGE_BASE) {
    let score = 0;

    // Direct phrase match on question
    if (qa.questionEn.toLowerCase().includes(qLower) || qa.questionNp.includes(query)) {
      score += 40;
    }

    // High boost if safety query matches safety QA
    if (isSafetyQuery && qa.id.startsWith('safety-')) {
      score += 60;
    }

    // High boost if targeted product matches qa.productSlug
    if (targetedProduct && qa.productSlug === targetedProduct.slug) {
      score += 50;
    } else if (targetedProduct && qa.productSlug && qa.productSlug !== targetedProduct.slug) {
      // Penalty for mismatched product slug when a specific product was named
      score -= 30;
    }

    // Token match against keywords
    for (const t of queryTokens) {
      if (qa.keywords.some((kw) => kw.includes(t))) score += 12;
      if (qa.nepaliKeywords.some((kw) => kw.includes(t))) score += 15;
      if (qa.romanNepaliKeywords.some((kw) => kw.includes(t))) score += 12;
      if (qa.questionEn.toLowerCase().includes(t)) score += 6;
      if (qa.questionNp.includes(t)) score += 6;
      // Low weight on body text to avoid stop-token noise
      if (qa.answerEn.toLowerCase().includes(t)) score += 1;
      if (qa.answerNp.includes(t)) score += 1;
    }

    // Confidence threshold: at least 40 points required to prevent false positives
    if (score >= 40) {
      let matchedProduct: Product | undefined;
      if (qa.productSlug) {
        matchedProduct = products.find((p) => p.slug === qa.productSlug);
      }
      results.push({ item: qa, score, matchedProduct });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
