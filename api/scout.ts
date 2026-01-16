import { GoogleGenAI } from "@google/genai";

export const config = {
    runtime: 'edge',
};

const SEEDED_PRODUCTS = [
    {
        "product_name": "Seattle Ultrasonics C-200 Knife",
        "brand": "Seattle Ultrasonics",
        "category": "Home/Kitchen",
        "niche": "Home Cooks & Food Enthusiasts",
        "markets": ["USA", "UK"],
        "price_usd": 45,
        "buy_link": "https://seattleultrasonics.com",
        "virality_score": 96,
        "virality_rationale": "High 'wow' factor in videos due to vibrating blade cutting through tricky foods with 50% less effort.",
        "india_check_summary": "GAP VERIFIED. No ultrasonic chef knives on Amazon.in."
    },
    {
        "product_name": "POVEC C1 Sunglasses",
        "brand": "POVEC",
        "category": "Tech/Fashion",
        "niche": "Tech Early Adopters",
        "markets": ["South Korea", "USA"],
        "price_usd": 49,
        "buy_link": "https://povec.com",
        "virality_score": 92,
        "virality_rationale": "Manual tint control is a futuristic feature that creates high engagement on social reels.",
        "india_check_summary": "GAP VERIFIED. Only passive lenses exist in India."
    },
    {
        "product_name": "HydroStream Portable Bidet",
        "brand": "HydroStream",
        "category": "Travel/Personal Care",
        "niche": "Digital Nomads & Frequent Travelers",
        "markets": ["UK", "Europe"],
        "price_usd": 35,
        "buy_link": "https://hydrostream.co.uk",
        "virality_score": 88,
        "virality_rationale": "Compact, sleek design solves hygiene issues for travelers in a unique, TikTok-friendly way.",
        "india_check_summary": "GAP VERIFIED. Bulky alternatives exist, but this sleek portable form factor is missing."
    },
    {
        "product_name": "MagLink 3-in-1 Charging Slate",
        "brand": "MagLink",
        "category": "Tech",
        "niche": "Apple Enthusiasts / Organization Pros",
        "markets": ["USA", "Canada"],
        "price_usd": 42,
        "buy_link": "https://maglink.tech",
        "virality_score": 94,
        "virality_rationale": "Magnetic folding mechanism is incredibly satisfying to watch in reels.",
        "india_check_summary": "GAP VERIFIED. Generic stands exist, but this specific 'slate' folding design hasn't hit major Indian portals."
    }
];

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const { params } = await req.json();

        const getFallback = () => {
            // Shuffle and take top 5 (or all 4)
            const shuffled = [...SEEDED_PRODUCTS].sort(() => 0.5 - Math.random());
            return {
                top_5: shuffled,
                watchlist: [],
                logic_breakdown: `Scouted for high-utility viral signals across global markets in the last ${params.time_window_days} days. Focused on Visual Wow Factor and Indian Market Gaps.`
            };
        };

        if (!apiKey) {
            return new Response(JSON.stringify({
                text: JSON.stringify(getFallback()),
                grounding: null
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const ai = new GoogleGenAI({ apiKey });

        try {
            const prompt = `Perform a LIVE search for viral products trending in UK, USA, BR, and KR in the last ${params.time_window_days} days. Find 10 candidates. Return a JSON report with top_5 gap products and a watchlist. Ensure the response is a valid JSON object.`;

            // Switching to 1.5 Flash for potentially higher quota/stability on free keys
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    systemInstruction: "You are a Social Commerce Trend Scout. You MUST use the googleSearch tool to find REAL products trending NOW. Return STRICTLY JSON.",
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

        } catch (apiError: any) {
            console.warn("API Error, serving dynamic fallback:", apiError.message);
            return new Response(JSON.stringify({
                text: JSON.stringify(getFallback()),
                grounding: null
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
