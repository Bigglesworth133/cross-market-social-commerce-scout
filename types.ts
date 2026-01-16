
export interface SearchParams {
  time_window_days: number;
  max_price_usd: number;
}

export interface ScoutProduct {
  product_name: string;
  brand: string;
  category: string;
  niche: string;
  markets: string[];
  price_usd: number;
  buy_link: string;
  evidence_posts: string[];
  virality_score: number; // 1-100
  virality_rationale: string;
  india_check_summary: string;
}

export interface ScoutReport {
  top_5: ScoutProduct[];
  watchlist: {
    product_name: string;
    brand: string;
    reason: string;
  }[];
  logic_breakdown: string;
}
