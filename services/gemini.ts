
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const runAnalystAgent = async (params: { time_window_days: number, max_price_usd: number }, onUpdate: (msg: string) => void) => {
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `You are a Social Commerce Trend Scout specializing in "Viral Arbitrage." 
  Your goal is to find high-novelty, problem-solving products (<= $${params.max_price_usd}) that are exploding on TikTok/Instagram in the UK, USA, BR, or KR but are entirely missing from India.

  CORE AUDIT FILTERS:
  1. VARIETY OVER COSMETICS: Avoid oversaturated beauty products. Prioritize Travel Gear (e.g., hidden-pocket jackets), Home Tech, Kitchen Hacks, Productivity Tools, and Viral Fashion Gadgets.
  2. VIRALITY POTENTIAL: Score products based on "The Scroll-Stop Factor." High virality = Unique utility, visual "wow" moment, or solving a common frustration in a new way.
  3. INDIA GAP CHECK: Ensure the product is not on Amazon.in, Myntra, or Flipkart. We want first-mover advantage.
  4. LINK ACCURACY: Provide the actual product page URL. Use the Thinking Budget to verify.

  JSON SCHEMA (MANDATORY):
  {
    "top_5": [{
      "product_name": "string",
      "brand": "string", 
      "category": "string (e.g., Travel, Home, Tech)",
      "niche": "specific creator niche (e.g., Solo Travelers, Remote Workers)",
      "markets": ["string"],
      "price_usd": number,
      "buy_link": "Direct URL",
      "evidence_posts": ["Social post URL"],
      "virality_score": number (1-100),
      "virality_rationale": "Why will this go viral in India?",
      "india_check_summary": "Verification audit trail"
    }],
    "watchlist": [...],
    "logic_breakdown": "Explanation of search and virality assessment."
  }`;

  const prompt = `Search for diverse viral products (NOT just cosmetics) trending in UK, USA, BR, and KR in the last ${params.time_window_days} days. 
  Look for high-novelty items (Travel hacks, Tech gadgets, Home solutions) priced under $${params.max_price_usd}. 
  Evaluate their "Virality Potential" for the Indian market and verify they are NOT sold in India.`;

  onUpdate("Scanning for high-novelty viral signals...");

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 15000 },
        temperature: 0.2, 
      }
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata
    };
  } catch (err: any) {
    console.error("Scout Failure:", err);
    throw new Error(err.message || "The scout agent failed to find viral gaps.");
  }
};
