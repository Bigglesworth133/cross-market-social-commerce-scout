
import React, { useState, useMemo } from 'react';
import { runAnalystAgent } from './services/gemini';
import { SearchParams, ScoutProduct, ScoutReport } from './types';

const Header = () => (
  <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-3">
      <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>
      <div>
        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">VIRAL SCOUT</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Niche Product Arbitrage</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Analysis Mode</span>
        <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Virality Potential Ranking
        </span>
      </div>
    </div>
  </header>
);

const GroundingCitations: React.FC<{ grounding: any }> = ({ grounding }) => {
  if (!grounding || !grounding.groundingChunks) return null;
  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Discovery Sources</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {grounding.groundingChunks.map((chunk: any, i: number) => {
          const web = chunk.web;
          if (!web) return null;
          return (
            <a key={i} href={web.uri} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="text-[10px] font-bold text-indigo-600 truncate mb-1">{web.title || 'Source'}</div>
              <div className="text-[9px] text-slate-400 truncate">{web.uri}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

const ProductTable: React.FC<{ items: ScoutProduct[], title: string, color: string }> = ({ items, title, color }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-8">
      <div className={`${color} px-6 py-4 border-b border-slate-100 flex justify-between items-center`}>
        <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
        <span className="text-[9px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Global Gaps</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-bold text-slate-500 uppercase text-[10px]">Category & Niche</th>
              <th className="px-6 py-3 font-bold text-slate-500 uppercase text-[10px]">Product Details</th>
              <th className="px-6 py-3 font-bold text-slate-500 uppercase text-[10px]">Virality Score</th>
              <th className="px-6 py-3 font-bold text-slate-500 uppercase text-[10px]">India Status</th>
              <th className="px-6 py-3 font-bold text-slate-500 uppercase text-[10px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-indigo-600 font-black text-[10px] uppercase tracking-tighter mb-1">{item.category}</div>
                  <div className="text-slate-400 text-[9px] font-bold uppercase italic">{item.niche}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{item.product_name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">{item.brand} — ${item.price_usd}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-4 border-indigo-50 flex items-center justify-center font-black text-indigo-600 text-xs">
                      {item.virality_score}%
                    </div>
                    <div className="max-w-[150px] text-[9px] text-slate-500 leading-tight italic line-clamp-2">
                      {item.virality_rationale}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[10px] text-slate-600 leading-relaxed font-medium">
                    <span className="text-emerald-600 font-black uppercase block mb-1">Gap Verified</span>
                    {item.india_check_summary}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href={item.buy_link} target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-black text-[9px] uppercase px-4 py-2.5 rounded-xl hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all block text-center">
                    Shop
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<{ report: any }> = ({ report }) => {
  const data = useMemo(() => {
    try {
      const jsonMatch = report.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]) as ScoutReport;
    } catch (e) { console.warn("Parse error", e); }
    return null;
  }, [report]);

  if (!data) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tighter">Viral Audit</h2>
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
          {report.text}
        </div>
        <GroundingCitations grounding={report.grounding} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-indigo-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-black bg-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full tracking-widest uppercase border border-indigo-500/20">
              High Virality Alert
            </span>
            <span className="text-[10px] font-black bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full tracking-widest uppercase border border-emerald-500/20">
              India Gaps Found
            </span>
          </div>
          <h2 className="text-4xl font-black mb-6 leading-[1.1] tracking-tighter">
            Next-gen viral products identified for first-mover advantage.
          </h2>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Scout Logic</p>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {data.logic_breakdown || "Analyzing cross-platform velocity for high-utility, diverse product categories with zero Indian marketplace presence."}
            </p>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-20%] w-[50%] h-[140%] bg-indigo-600/30 blur-[120px] rounded-full rotate-45"></div>
      </div>

      <ProductTable items={data.top_5} title="Top 5 Viral Gap Products" color="bg-indigo-600" />

      {data.watchlist?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8">
          <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-6">Signals to Watch</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.watchlist.map((w, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-200/50">
                <div className="font-bold text-slate-900 text-sm mb-1">{w.product_name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{w.brand}</div>
                <p className="text-[10px] text-amber-700 mt-2 font-medium italic">Status: {w.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <GroundingCitations grounding={report.grounding} />
    </div>
  );
};

const App: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({ time_window_days: 7, max_price_usd: 50 });
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [report, setReport] = useState<any>(null);

  React.useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const resp = await fetch('/data/latest_report.json');
      if (resp.ok) {
        const data = await resp.json();
        // Wrap it in a structure the Dashboard expects (text and grounding)
        // or modify Dashboard to accept raw json
        setReport({ text: JSON.stringify(data), grounding: null });
      }
    } catch (e) {
      console.error("Failed to load local report", e);
    }
  };

  const handleSearch = async () => {
    if (!apiKey) {
      alert("Please enter a Gemini API Key to start scouting.");
      return;
    }
    setIsLoading(true);
    setReport(null);
    setStatusMessage('Scanning Niche Trends...');
    try {
      const result = await runAnalystAgent(apiKey, params, (msg) => setStatusMessage(msg));
      setReport(result);
    } catch (err: any) {
      setReport({ text: `### Failed to Scan\n\n${err.message}` });
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-xl shadow-slate-200/40 sticky top-24">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Arbitrage Setup</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase mb-3 tracking-tighter">Gemini API Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500"
                  />
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[9px] text-indigo-600 font-bold mt-2 block underline">Get free key here</a>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase mb-3 tracking-tighter">Signal Window</label>
                  <select
                    value={params.time_window_days}
                    onChange={(e) => setParams({ ...params, time_window_days: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-black outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value={7}>Last 7 Days</option>
                    <option value={15}>Last 15 Days (Better Variety)</option>
                    <option value={30}>Last 30 Days (Full Market)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase mb-3 tracking-tighter">Budget Threshold</label>
                  <div className="relative">
                    <span className="absolute left-5 top-[1.1rem] text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={params.max_price_usd}
                      onChange={(e) => setParams({ ...params, max_price_usd: parseInt(e.target.value) })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-5 py-4 text-sm font-black outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all disabled:bg-slate-100 disabled:text-slate-400 active:scale-95"
                >
                  {isLoading ? 'Agent Mapping...' : 'Scout Viral Gaps'}
                </button>
              </div>
            </div>

            <div className="p-6 bg-indigo-600 rounded-[32px] text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Strategy Tip</h4>
              <p className="text-[10px] font-medium leading-relaxed opacity-90">
                Diversify your search by increasing the Signal Window. Longer windows capture high-utility gear that trends consistently over single spikes.
              </p>
            </div>
          </aside>

          <section className="lg:col-span-9">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-48 text-center">
                <div className="relative mb-10">
                  <div className="w-20 h-20 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                  </div>
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em] mb-4">Analyzing Virality & Gaps</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{statusMessage}</p>
              </div>
            ) : report ? (
              <ResultsDashboard report={report} />
            ) : (
              <div className="flex flex-col items-center justify-center py-48 bg-white rounded-[60px] border-2 border-dashed border-slate-200 text-center">
                <div className="bg-slate-50 p-8 rounded-full mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-300"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Niche Scout Active</h3>
                <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">
                  Start scouting to find cross-market viral products across Travel, Home, and Tech niches that haven't hit India yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
