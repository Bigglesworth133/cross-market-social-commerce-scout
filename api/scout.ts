import { GoogleGenAI } from "@google/genai";

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API Key not configured on server' }), { status: 500 });
    }

    try {
        const { params } = await req.json();
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Search for diverse viral products (Travel hacks, Tech gadgets, Home solutions) trending in UK, USA, BR, and KR in the last ${params.time_window_days} days. Find 10 candidates. Return a JSON report with top_5 gap products and a watchlist.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: "You are a Social Commerce Trend Scout specializing in 'Viral Arbitrage.' Your goal is to find high-novelty, problem-solving products (<= $50) that are exploding on TikTok/Instagram in the UK, USA, BR, or KR but are missing from India.",
                tools: [{ googleSearch: {} }],
            }
        });

        return new Response(JSON.stringify({
            text: response.text,
            grounding: response.candidates?.[0]?.groundingMetadata
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("Scout Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
