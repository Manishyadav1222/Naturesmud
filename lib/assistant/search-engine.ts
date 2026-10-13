import { ASSISTANT_KNOWLEDGE_BASE, AssistantQA } from '@/lib/data/assistant-knowledge-base';
import { products } from '@/lib/data/products';
import { Product } from '@/lib/types';

export interface AssistantSearchResult {
  item: AssistantQA;
  score: number;
  matchedProduct?: Product;
}

function cleanTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"nepal]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export function searchAssistantKnowledge(query: string): AssistantSearchResult[] {
  const queryTokens = cleanTokens(query);
  if (queryTokens.length === 0) return [];

  const results: AssistantSearchResult[] = [];

  // Match against knowledge base
  for (const qa of ASSISTANT_KNOWLEDGE_BASE) {
    let score = 0;

    // Direct phrase matching
    const qLower = query.toLowerCase();
    if (qa.questionEn.toLowerCase().includes(qLower) || qa.questionNp.includes(query)) {
      score += 15;
    }

    // Token match against keywords
    for (const t of queryTokens) {
      if (qa.keywords.some((kw) => kw.includes(t))) score += 5;
      if (qa.nepaliKeywords.some((kw) => kw.includes(t))) score += 6;
      if (qa.romanNepaliKeywords.some((kw) => kw.includes(t))) score += 5;
      if (qa.questionEn.toLowerCase().includes(t)) score += 2;
      if (qa.answerEn.toLowerCase().includes(t)) score += 1;
      if (qa.answerNp.includes(t)) score += 1;
    }

    if (score > 0) {
      let matchedProduct: Product | undefined;
      if (qa.productSlug) {
        matchedProduct = products.find((p) => p.slug === qa.productSlug);
      }
      results.push({ item: qa, score, matchedProduct });
    }
  }

  // Also check if user specifically asked about any product in catalog
  for (const p of products) {
    if (p.isActive === false) continue;
    const nameLower = p.name.toLowerCase();
    const slugLower = p.slug.toLowerCase();

    let productMatchScore = 0;
    for (const t of queryTokens) {
      if (nameLower.includes(t)) productMatchScore += 4;
      if (slugLower.includes(t)) productMatchScore += 4;
    }

    if (productMatchScore >= 4) {
      // Create a dynamic QA item for this product if not already matched
      const alreadyMatched = results.some((r) => r.matchedProduct?.slug === p.slug);
      if (!alreadyMatched) {
        results.push({
          item: {
            id: `prod-${p.slug}`,
            category: 'product',
            keywords: [p.name.toLowerCase(), p.slug],
            nepaliKeywords: [p.name],
            romanNepaliKeywords: [p.name.toLowerCase()],
            questionEn: `What is the price and details of ${p.name}?`,
            questionNp: `${p.name} को मूल्य र विवरण के हो?`,
            answerEn: `${p.name} is available on NaturesMud Nepal for Rs. ${p.price} (${p.weight}). Prepared with 0% added sugar and 0% preservatives in a food-grade ${p.packing || 'container'}. Fast 24-hour delivery in Kathmandu and cash on delivery across Nepal.`,
            answerNp: `${p.name} नेचर्स मड नेपालमा रु ${p.price} (${p.weight}) मा उपलब्ध छ। ०% केमिकल र ०% प्रिजर्भेटिभ बिना शुद्ध रूपमा तयार पारिएको। काठमाडौँ उपत्यकामा २४ घण्टामै र नेपालभर क्यास अन डेलिभरी उपलब्ध छ।`,
            productSlug: p.slug,
            suggestedAction: {
              type: 'cart',
              label: `Add ${p.name} to Cart (Rs. ${p.price})`,
              productSlug: p.slug,
            },
          },
          score: productMatchScore,
          matchedProduct: p,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
