
import React, { useMemo, useState } from "react";
import { Loader2, Link as LinkIcon, ClipboardList, Sparkles, Check, Copy } from "lucide-react";

const PORTFOLIO = [
  { id: "rice-syrup", name: "Rice Syrup", category: "Natural Sweeteners", aliases: ["brown rice syrup", "rice malt syrup", "glucose syrup (rice)", "liquid sweetener"], industries: ["bakery", "confectionery", "beverages", "snacks", "infant food", "sauces"] },
  { id: "maltodextrin", name: "Maltodextrin", category: "Functional Ingredients", aliases: ["carrier solid", "spray-drying carrier", "DE 10", "DE 18"], industries: ["beverages", "flavours", "nutrition", "pharma", "bakery", "confectionery"] },
  { id: "tapioca-starch", name: "Tapioca Starch", category: "Functional Ingredients", aliases: ["cassava starch", "modified starch", "thickener E1400", "starch binder"], industries: ["bakery", "confectionery", "sauces", "ready meals", "noodles", "pet food"] },
  { id: "guar-gum", name: "Guar Gum", category: "Functional Ingredients", aliases: ["E412", "stabilizer", "thickener", "galactomannan"], industries: ["bakery", "dairy", "ice cream", "sauces", "pet food", "pharma"] },
  { id: "psyllium-husk", name: "Psyllium Husk", category: "Functional Ingredients", aliases: ["ispaghula", "fibre", "husk", "mucilage"], industries: ["nutrition", "bakery", "cereals", "pet food"] },
  { id: "rice-protein-70", name: "Rice Protein 70%", category: "Plant Proteins", aliases: ["rice protein concentrate", "RPC 70", "plant protein"], industries: ["sports nutrition", "meal replacement", "bakery", "pet food", "alt meats"] },
  { id: "pea-protein", name: "Pea Protein", category: "Plant Proteins", aliases: ["pisum sativum protein", "yellow pea protein", "plant protein"], industries: ["alt meats", "sports nutrition", "bakery", "snacks"] },
  { id: "soy-protein", name: "Soya Protein", category: "Plant Proteins", aliases: ["soy protein isolate", "soy concentrate", "textured soy"], industries: ["alt meats", "bakery", "snacks", "pet food"] },
  { id: "curcumin", name: "Turmeric Extract (Curcumin)", category: "Herbal Extracts & Botanicals", aliases: ["curcumin 95%", "curcuminoids", "turmeric extract"], industries: ["nutrition", "pharma", "functional foods", "cosmetics"] },
  { id: "ashwagandha", name: "Ashwagandha Extract", category: "Herbal Extracts & Botanicals", aliases: ["withania somnifera", "KSM-66 style", "sensoril style"], industries: ["nutrition", "pharma", "functional foods"] },
  { id: "ginger", name: "Ginger Extract", category: "Herbal Extracts & Botanicals", aliases: ["zingiber officinale", "gingerols", "ginger extract"], industries: ["beverages", "nutrition", "pharma"] },
  { id: "neem", name: "Neem Extract", category: "Herbal Extracts & Botanicals", aliases: ["azadirachta indica", "neem leaf extract"], industries: ["cosmetics", "ayurveda", "functional foods"] },
  { id: "tulsi", name: "Tulsi (Holy Basil) Extract", category: "Herbal Extracts & Botanicals", aliases: ["ocimum sanctum", "holy basil"], industries: ["nutrition", "ayurveda", "beverages"] },
  { id: "capsaicin", name: "Capsaicin (Chilli Extract)", category: "Phytogenics (Feed/Pet)", aliases: ["capsicum extract", "oleoresin capsicum"], industries: ["pet food", "feed", "seasonings"] },
  { id: "liquorice", name: "Liquorice Extract", category: "Phytogenics (Feed/Pet)", aliases: ["glycyrrhiza glabra", "licorice extract"], industries: ["pet food", "feed", "nutrition"] },
  { id: "moringa", name: "Moringa Powder", category: "Superfoods", aliases: ["moringa leaf powder", "moringa oleifera"], industries: ["nutrition", "beverages", "functional foods"] },
  { id: "amla", name: "Amla Powder", category: "Superfoods", aliases: ["emblica officinalis", "indian gooseberry"], industries: ["nutrition", "functional foods", "ayurveda"] },
  { id: "fenugreek-saponins", name: "Fenugreek Saponins", category: "Functional Ingredients", aliases: ["trigonella foenum-graecum", "fenugreek extract"], industries: ["nutrition", "functional foods", "pet food"] },
  { id: "prebiotics", name: "Prebiotic Fibres", category: "Functional Ingredients", aliases: ["FOS", "inulin", "prebiotic"], industries: ["nutrition", "dairy", "beverages"] },
  { id: "protein-meals", name: "Protein Meals (Rice/Soy)", category: "Agri-Based Ingredients", aliases: ["rice DDGS", "rice gluten", "soybean meal"], industries: ["pet food", "feed"] },
  { id: "veg-fats", name: "Vegetable Fats/Oils (Non-GMO)", category: "Agri-Based Ingredients", aliases: ["rice bran oil", "refined oils", "non-gmo oils"], industries: ["bakery", "snacks", "pet food"] },
  { id: "fruit-veg-powders", name: "Fruit & Vegetable Powders", category: "Agri-Based Ingredients", aliases: ["spray-dried powders", "dehydrated powders", "mango powder", "spinach powder"], industries: ["beverages", "bakery", "snacks", "nutrition"] }
];

const INDUSTRY_TRIGGERS = {
  "pet food": ["pet food", "dog food", "cat food", "animal nutrition", "feed", "kibble"],
  "feed": ["animal feed", "premix", "feed mill", "feed additive"],
  "bakery": ["bakery", "biscuit", "cookies", "bread", "cakes", "gluten-free"],
  "confectionery": ["confectionery", "chocolate", "candies", "sweets"],
  "beverages": ["beverage", "drink", "juice", "ready-to-drink", "RTD", "smoothie"],
  "dairy": ["dairy", "ice cream", "yogurt", "cheese"],
  "nutrition": ["nutrition", "nutraceutical", "dietary supplement", "sports nutrition", "protein bar", "meal replacement"],
  "pharma": ["pharma", "pharmaceutical", "excipient", "capsule", "tablet"],
  "flavours": ["flavour", "flavor", "aroma", "fragrance", "F&F", "flavour house", "fragrance"],
  "cosmetics": ["cosmetic", "personal care", "skincare"],
  "sauces": ["sauce", "condiment", "ketchup", "dressing", "syrup"],
  "snacks": ["snack", "chips", "extruded", "puffs"],
  "alt meats": ["plant-based", "meat alternative", "vegan burger", "meat analog"]
};

const FINISHED_PRODUCT_INFER = [
  { cues: ["protein bar", "sports nutrition", "meal replacement", "vegan protein"], suggest: ["rice-protein-70", "pea-protein", "maltodextrin"], note: "High-protein formats benefit from plant proteins and carriers." },
  { cues: ["gluten-free", "celiac", "free-from"], suggest: ["rice-protein-70", "tapioca-starch", "guar-gum"], note: "Gluten-free bakery needs structure and binding." },
  { cues: ["ice cream", "frozen dessert", "dairy alternative"], suggest: ["guar-gum", "maltodextrin", "rice-syrup"], note: "Stabilizers and bulking agents improve texture." },
  { cues: ["sauce", "ketchup", "dressing", "gravy"], suggest: ["tapioca-starch", "guar-gum", "rice-syrup"], note: "Viscosity and body from starches/gums; sweetness balancing from rice syrup." },
  { cues: ["chocolate", "confectionery", "candy"], suggest: ["rice-syrup", "maltodextrin", "fruit-veg-powders"], note: "Sweetening and carriers for flavours and inclusions." },
  { cues: ["pet food", "kibble", "animal nutrition"], suggest: ["rice-protein-70", "psyllium-husk", "protein-meals", "capsaicin", "liquorice"], note: "Protein, fibre, and phytogenics for palatability/gut health." },
  { cues: ["flavour", "flavor", "fragrance", "aroma"], suggest: ["maltodextrin", "rice-syrup", "herbal extracts"], note: "Carriers and natural actives for F&F applications." }
];

const normalize = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
const containsAny = (text, needles) => {
  const t = normalize(text);
  return needles.some(n => t.includes(n));
};

function guessRegionFromUrl(url) {
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    const host = u.hostname;
    if (host.endsWith(".com") || host.endsWith(".us") || host.endsWith(".ca")) return "US";
    if (host.endsWith(".uk") || host.endsWith(".ie") || host.endsWith(".eu") || host.endsWith(".de") || host.endsWith(".nl") || host.endsWith(".be") || host.endsWith(".fr") || host.endsWith(".se") || host.endsWith(".no") || host.endsWith(".dk")) return "UK/EU";
    return "Other";
  } catch {
    return "Other";
  }
}

function analyze(textRaw) {
  const text = normalize(textRaw);
  const industriesFound = Object.entries(INDUSTRY_TRIGGERS)
    .filter(([_, cues]) => containsAny(text, cues))
    .map(([k]) => k);

  const scores = {};
  const reasons = {};

  PORTFOLIO.forEach(p => {
    scores[p.id] = 0;
    reasons[p.id] = [];

    const aliasHits = p.aliases.filter(a => text.includes(a));
    if (aliasHits.length) {
      scores[p.id] += aliasHits.length * 3;
      reasons[p.id].push(`Mentions/aliases found: ${aliasHits.join(", ")}`);
    }

    const indHits = industriesFound.filter(ind => p.industries.includes(ind));
    if (indHits.length) {
      scores[p.id] += indHits.length * 2;
      reasons[p.id].push(`Industry fit: ${indHits.join(", ")}`);
    }
  });

  FINISHED_PRODUCT_INFER.forEach(rule => {
    if (containsAny(text, rule.cues)) {
      rule.suggest.forEach(id => {
        if (scores[id] !== undefined) {
          scores[id] += 4;
          reasons[id].push(`Finished-product cues → ${rule.note}`);
        }
      });
    }
  });

  const ranked = PORTFOLIO
    .map(p => ({ item: p, score: scores[p.id] || 0, reasons: reasons[p.id] }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  ranked.forEach(r => { r.reasons = Array.from(new Set(r.reasons)); });
  return { industriesFound, ranked };
}

function generateOutreach({ region, company, ranked }) {
  const top = ranked.slice(0, 6).map(r => r.item.name);
  const list = top.join(", ");
  if (region === "US") {
    return `Thanks for connecting. As ${company} scales in your category, we supply India-origin ingredients like ${list}. If this aligns with your current needs, happy to share specs and pricing via email.`;
  }
  return `Thank you for connecting. For ${company}, we can supply India-origin ingredients such as ${list}. If this aligns with your current needs, I’d be glad to share specifications and pricing by email.`;
}

export default function Home() {
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [siteText, setSiteText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const [copyOk, setCopyOk] = useState(false);

  const region = useMemo(() => guessRegionFromUrl(url), [url]);

  async function tryFetch() {
    setFetching(true);
    setResult(null);
    try {
      const target = url.includes("://") ? url : `https://${url}`;
      const res = await fetch(target, { method: "GET" });
      const html = await res.text();
      const textOnly = html
        .replace(/<script[\s\S]*?<\/script>/g, " ")
        .replace(/<style[\s\S]*?<\/style>/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;/g, " ")
        .slice(0, 400000);
      setSiteText(prev => prev?.length ? prev : textOnly);
    } catch (e) {
      console.warn("Fetch blocked by CORS or failed.", e);
    } finally {
      setFetching(false);
    }
  }

  function runAnalysis() {
    const text = siteText || "";
    if (!text.trim()) {
      alert("Paste some website text first (or try the Fetch button).");
      return;
    }
    const out = analyze(text);
    setResult(out);
  }

  const outreach = useMemo(() => {
    if (!result || result.ranked.length === 0) return "";
    return generateOutreach({ region, company: company || "your company", ranked: result.ranked });
  }, [result, region, company]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 p-6">
      <div className="max-w-5xl mx-auto grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Winspro Buyer‑Fit Finder</h1>
          <div className="text-sm text-slate-500">MVP · URL/Text Analyzer + Pitch Generator</div>
        </header>

        <div className="shadow-sm rounded-2xl bg-white border">
          <div className="p-4 md:p-6 grid gap-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Company Name</label>
                <input className="border rounded-md p-2" placeholder="e.g., Kerry Group" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2"><LinkIcon className="w-4 h-4"/>Company Website URL</label>
                <div className="flex gap-2">
                  <input className="border rounded-md p-2 w-full" placeholder="e.g., www.example.com" value={url} onChange={e => setUrl(e.target.value)} />
                  <button onClick={tryFetch} disabled={!url || fetching} className="px-3 py-2 border rounded-md bg-slate-900 text-white whitespace-nowrap flex items-center gap-2">
                    {fetching ? <Loader2 className="w-4 h-4 animate-spin"/> : <ClipboardList className="w-4 h-4"/>}
                    Fetch
                  </button>
                </div>
                <div className="text-xs text-slate-500">If the fetch is blocked by CORS, paste key content (About/Products/Industries) below.</div>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Website Text (paste here if needed)</label>
              <textarea rows={8} className="border rounded-md p-2" placeholder="Paste visible text from the company's site: About, Products, Industries, Applications…" value={siteText} onChange={e => setSiteText(e.target.value)} />
              <div className="text-xs text-slate-500">Tip: Include product descriptions, industry pages, and application notes for best results.</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={runAnalysis} className="px-3 py-2 border rounded-md bg-emerald-600 text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4"/>Analyze
              </button>
              <span className="text-xs text-slate-500">Region guess: <span className="font-medium">{region}</span> (influences tone of the outreach draft)</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 shadow-sm rounded-2xl bg-white border">
              <div className="p-4 md:p-6 grid gap-3">
                <h2 className="text-lg font-semibold">Suggested Products to Pitch</h2>
                <div className="text-sm text-slate-600">Ranked by relevance score based on keywords, industry fit, and finished-product inference.</div>
                <div className="grid gap-3">
                  {result.ranked.map((r, idx) => (
                    <div key={r.item.id} className="border rounded-xl p-3 hover:shadow-sm transition">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{idx + 1}. {r.item.name} <span className="text-slate-400 text-xs">· {r.item.category}</span></div>
                        <div className="text-xs px-2 py-1 rounded-full bg-slate-100">Score {r.score}</div>
                      </div>
                      {r.reasons.length > 0 && (
                        <ul className="list-disc pl-5 mt-2 text-sm text-slate-700 space-y-1">
                          {r.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {result.ranked.length === 0 && (
                    <div className="text-sm text-slate-500">No strong matches yet. Try pasting more detailed site content (product/application pages).</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:col-span-2 gap-6">
              <div className="shadow-sm rounded-2xl bg-white border">
                <div className="p-4 md:p-6 grid gap-3">
                  <h3 className="text-lg font-semibold">Detected Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {(result.industriesFound.length ? result.industriesFound : ["—"]).map(ind => (
                      <span key={ind} className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{ind}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shadow-sm rounded-2xl bg-white border">
                <div className="p-4 md:p-6 grid gap-3">
                  <h3 className="text-lg font-semibold">Outreach Draft (50–60 words)</h3>
                  <textarea rows={6} className="border rounded-md p-2" value={outreach} onChange={()=>{}} />
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border rounded-md bg-slate-100 flex items-center gap-2" onClick={async ()=>{
                      await navigator.clipboard.writeText(outreach);
                      setCopyOk(true);
                      setTimeout(()=>setCopyOk(false), 1500);
                    }}>
                      {copyOk ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                      Copy
                    </button>
                    <div className="text-xs text-slate-500">Tone adapts to {region}. Edit as you like.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="shadow-sm rounded-2xl bg-white border">
          <div className="p-4 md:p-6 grid gap-2">
            <h4 className="text-base font-semibold">How this works (MVP)</h4>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li><b>Quick scan:</b> We try to fetch the homepage HTML. Some sites block cross‑origin requests; if so, paste text manually.</li>
              <li><b>Inference engine:</b> Scores are based on keyword matches (aliases), industry alignment, and finished‑product cues (e.g., protein bars → plant proteins).</li>
              <li><b>Portfolio-aware:</b> Mapped to Winspro’s catalogue (sweeteners, plant proteins, gums/starches, botanicals, phytogenics, superfoods, agri‑ingredients).</li>
              <li><b>Outreach draft:</b> Auto‑generates a 50–60 word message with UK/EU vs US tone differences.</li>
            </ul>
            <div className="text-xs text-slate-500">Next: plug a serverless crawler (Browserless/ScrapingBee), multi‑page crawl, spec sheets, pricing bands, and CRM export.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
