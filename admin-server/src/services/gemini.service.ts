import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client only if the API key is present
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
  : null;

export const generateProductDescription = async (productName: string, keywords: string[] = []): Promise<string> => {
  if (!ai) {
    console.warn('Gemini API key not configured. Returning fallback description.');
    return `Premium ${productName} sourced from nature, perfect for your health and wellness routine.`;
  }

  try {
    const keywordText = keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}.` : '';
    const prompt = `You are an expert copywriter for an organic and premium e-commerce brand called "Nature's Mud". You write engaging, SEO-friendly, and concise product descriptions.
    
Write a compelling 2-paragraph product description for an organic product named "${productName}". ${keywordText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });

    return response.text || '';
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw new Error('Failed to generate product description.');
  }
};

export const analyzeCustomerReviewSentiment = async (reviewText: string): Promise<'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'> => {
  if (!ai) {
    return 'NEUTRAL';
  }

  try {
    const prompt = `Analyze the sentiment of the following customer review. Respond with exactly one word: POSITIVE, NEUTRAL, or NEGATIVE.

Review: "${reviewText}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.0,
        maxOutputTokens: 10,
      }
    });

    const sentiment = response.text?.trim().toUpperCase();
    if (sentiment === 'POSITIVE' || sentiment === 'NEGATIVE') {
      return sentiment as 'POSITIVE' | 'NEGATIVE';
    }
    return 'NEUTRAL';
  } catch (error) {
    console.error('Error analyzing sentiment with Gemini:', error);
    return 'NEUTRAL';
  }
};
