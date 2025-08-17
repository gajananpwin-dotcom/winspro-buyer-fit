import React, { useMemo, useState } from "react";
import { Loader2, Link as LinkIcon, ClipboardList, Sparkles, Check, Copy, ListTree } from "lucide-react";

/* ---------------- Winspro Portfolio ---------------- */
const PORTFOLIO = [
  { id: "rice-syrup", name: "Rice Syrup", category: "Natural Sweeteners", aliases: ["brown rice syrup","rice malt syrup","glucose syrup (rice)","liquid sweetener"], industries: ["bakery","confectionery","beverages","snacks","infant food","sauces"] },
  { id: "maltodextrin", name: "Maltodextrin", category: "Functional Ingredients", aliases: ["carrier solid","spray-drying carrier","DE 10","DE 18"], industries: ["beverages","flavours","nutrition","pharma","bakery","confectionery"] },
  { id: "tapioca-starch", name: "Tapioca Starch", category: "Functional Ingredients", aliases: ["cassava starch","modified starch","thickener E1400","starch binder"], industries: ["bakery","confectionery","sauces","ready meals","noodles","pet food"] },
  { id: "guar-gum", name: "Guar Gum", category: "Functional Ingredients", aliases: ["E412","stabilizer","thickener","galactomannan","guar flour"], industries: ["bakery","dairy","ice cream","sauces","pet food","pharma"] },
  { id: "psyllium-husk", name: "Psyllium Husk", category: "Functional Ingredients", aliases: ["ispaghula","fibre","husk","mucilage","psyllium fiber"], industries: ["nutrition","bakery","cereals","pet food"] },
  { id: "rice-protein-70", name: "Rice Protein 70%", category: "Plant Proteins", aliases: ["rice protein concentrate","RPC 70","plant protein"], industries: ["sports nutrition","meal replacement","bakery","pet food","alt meats"] },
  { id: "pea-protein", name: "Pea Protein", category: "Plant Proteins", aliases: ["pisum sativum protein","yellow pea protein","plant protein"], industries: ["alt meats","sports nutrition","bakery","snacks"] },
  { id: "soy-protein", name: "Soya Protein", category: "Plant Proteins", aliases: ["soy protein isolate","soy concentrate","textured soy"], industries: ["alt meats","bakery","snacks","pet food"] },
  { id: "curcumin", name: "Turmeric Extract (Curcumin)", category: "Herbal Extracts & Botanicals", aliases: ["curcumin 95%","curcuminoids","turmeric extract"], industries: ["nutrition","pharma","functional foods","cosmetics"] },
  { id: "ashwagandha", name: "Ashwagandha Extract", category: "Herbal Extracts & Botanicals", aliases: ["withania somnifera","KSM-66 style","sensoril style","ashwagandha root extract"], industries: ["nutrition","pharma","functional foods"] },
  { id: "ginger", name: "Ginger Extract", category: "Herbal Extracts & Botanicals", aliases: ["zingiber officinale","gingerols","ginger extract"], industries: ["beverages","nutrition","pharma"] },
  { id: "neem", name: "Neem Extract", category: "Herbal Extracts & Botanicals", aliases: ["azadirachta indica","neem leaf extract","neem kernel"], industries: ["cosmetics","ayurveda","functional foods"] },
  { id: "tulsi", name: "Tulsi (Holy Basil) Extract", category: "Herbal Extracts & Botanicals", aliases: ["ocimum sanctum","holy basil","tulsi extract"], industries: ["nutrition","ayurveda","beverages"] },
  { id: "capsaicin", name: "Capsaicin (Chilli Extract)", category: "Phytogenics (Feed/Pet)", aliases: ["capsicum extract","oleoresin capsicum","chilli extract"], industries: ["pet food","feed","seasonings"] },
  { id: "liquorice", name: "Liquorice Extract", category: "Phytogenics (Feed/Pet)", aliases: ["glycyrrhiza glabra","licorice extract"], industries: ["pet food","feed","nutrition"] },
  { id: "moringa", name: "Moringa Powder", category: "Superfoods", aliases: ["moringa leaf powder","moringa oleifera"], industries: ["nutrition","beverages","functional foods"] },
  { id: "amla", name: "Amla Powder", category: "Superfoods", aliases: ["emblica officinalis","indian gooseberry"], industries: ["nutrition","functional foods","ayurveda"] },
  { id: "fenugreek-saponins", name: "Fenugreek Saponins", category: "Functional Ingredients", aliases: ["trigonella foenum-graecum","fenugreek extract"], industries: ["nutrition","functional foods","pet food"] },
  { id: "prebiotics", name: "Prebiotic Fibres", category: "Functional Ingredients", aliases: ["FOS","inulin","prebiotic"], industries: ["nutrition","dairy","beverages"] },
  { id: "protein-meals", name: "Protein Meals (Rice/Soy)", category: "Agri-Based Ingredients", aliases: ["rice DDGS","rice gluten","soybean meal","rice protein meal"], industries: ["pet food","feed"] },
  { id: "veg-fats", name: "Vegetable Fats/Oils (Non-GMO)", category: "Agri-Based Ingredients", aliases: ["rice bran oil","non-gmo oils","refined vegetable oil"], industries: ["bakery","snacks","pet food"] },
  { id: "fruit-veg-powders", name: "Fruit & Vegetable Powders", category: "Agri-Based Ingredients", aliases: ["spray-dried powders","dehydrated powders","mango powder","spinach powder"], industries: ["beverages","bakery","snacks","nutrition"] }
];

/* ---------------- India dominance dataset (EDITABLE) ---------------- */
const INDIA_DOMINANCE = {
  "guar-gum":           { global: true, eu: true, us: true, note: "India is a leading global source of guar gum." },
  "psyllium-husk":      { global: true, eu: true, us: true, note: "India supplies the vast majority of psyllium." },
  "curcumin":           { global: true, eu: true, us: true, note: "India dominates turmeric/curcumin exports." },
  "ashwagandha":        { global: true, eu: true, us: true, note: "Flagship Indian botanical with strong demand." },
  "moringa":            { global: true, eu: true, us: true, note: "India is a primary origin for moringa." },
  "amla":               { global: true, eu: true, us: true, note: "Core Ayurveda ingredient; India-led supply." },
  "neem":               { global: true, eu: true, us: true, note: "India-origin neem extracts widely traded." },
  "tulsi":              { global: true, eu: true, us: true, note: "Holy basil (tulsi) is India-centric." },
  "capsaicin":          { global: true, eu: true, us: true, note: "Chilli extracts from India have strong export flow." },
  "veg-fats":           { global: true, eu: true, us: true, note: "Rice bran oil/veg oils: strong India supply." },
  "protein-meals":      { global: true, eu: true, us: true, note: "Rice/soy meals/gluten: competitive India exports." },

  "rice-syrup":         { global: false, eu: false, us: false },
  "maltodextrin":       { global: false, eu: false, us: false },
  "tapioca-starch":     { global: false, eu: false, us: false },
  "pea-protein":        { global: false, eu: false, us: false },
  "soy-protein":        { global: false, eu: false, us: false },
  "prebiotics":         { global: false, eu: false, us: false },
  "fruit-veg-powders":  { global: false, eu: false, us: false },
  "ginger":             { global: false, eu: false, us: false },
  "liquorice":          { global: false, eu: false, us: false },
  "rice-protein-70":    { global: false, eu: false, us: false },
};

/* ---------- “Why from India” + “Use in product” helpers ---------- */
const INDIA_ADVANTAGE = {
  "guar-gum": "India is the leading origin for guar seed & milling, with mature export processing and competitive pricing.",
  "psyllium-husk": "India supplies the vast majority of psyllium globally with standardized grades and steady container flows.",
  "curcumin": "Turmeric cultivation & extraction are India-centric; Indian processors dominate curcumin capacity.",
  "ashwagandha": "Core Ayurveda crop with India-led cultivation and branded extract capabilities.",
  "moringa": "Large farm base and dehydration capacity in India; consistent leaf powder/export.",
  "amla": "India is the natural origin with established powder/extract supply chains.",
  "neem": "India-led sourcing and extraction know-how for neem leaves and kernels.",
  "tulsi": "Holy basil is India-origin with reliable farming and processing clusters.",
  "capsaicin": "Strong Indian chilli crop + oleoresin extraction ecosystem.",
  "veg-fats": "India has competitive non-GMO vegetable oils (e.g., rice bran oil) and refining capacity.",
  "protein-meals": "India exports rice/soy meals & DDGS/gluten at scale with attractive values.",

  // optional notes for non-dominant items if you show them
  "rice-syrup": "Competitive alt-sweetener supply from Asia; India is growing but not dominant.",
  "maltodextrin": "Large Asian capacity; India is competitive for certain specs/lots.",
  "tapioca-starch": "Primary dominance is in SE Asia; India can supply limited volumes.",
  "pea-protein": "Dominance mainly in EU/NA/CN; India is emerging.",
  "soy-protein": "Major processors outside India; India supplies related meals.",
  "prebiotics": "EU/NA/CN dominate inulin/FOS; India capacity limited.",
  "fruit-veg-powders": "Dehydration widely available; India strong on some fruits/veg but not dominant.",
  "ginger": "India is a key grower, but processing/export dominance varies by grade.",
  "liquorice": "Raw root originates outside India; some Indian processing exists.",
  "rice-protein-70": "Manufacturing exists; not a dominant India export compared to others."
};

const USE_NOTES = {
  "pet food": "binding, texture & palatability; fibre for gut health; plant proteins for protein claims.",
  "feed": "phytogenic actives and proteins for performance and gut support.",
  "bakery": "structure, moisture control, and gluten-free binding; sweetness where needed.",
  "confectionery": "sweetening, bulking and flavour carriers.",
  "beverages": "flavour carriers, natural actives, and light mouthfeel/viscosity.",
  "dairy": "stabilization, body and freeze–thaw performance.",
  "nutrition": "actives for claims (botanicals), plant proteins, and carriers for blends.",
  "pharma": "excipients/stabilizers and standardized botanical actives.",
  "flavours": "spray-dry carriers and natural extracts.",
  "cosmetics": "botanical actives and natural functional agents.",
  "sauces": "viscosity/shine, suspension and sweetness balancing.",
  "snacks": "binding/expansion control and seasoning carriers.",
  "alt meats": "plant proteins and binders for texture."
};

function buildWhy({ id, company, industriesFound = [], dominance, roleInfo }) {
  const whyIndia = dominance?.global
    ? (INDIA_ADVANTAGE[id] || "India offers reliable origin, scalable capacity and competitive ocean freight.")
    : "India can be a competitive secondary origin depending on spec and lot size.";
  const topInd = industriesFound[0];
  const useLine = topInd ? USE_NOTES[topInd] : "functional performance in your formulas (binding, stability, or actives).";
  const traderHint = (roleInfo?.role === "Trader" || roleInfo?.role === "Mixed")
    ? " Suitable for import & resale due to stable specs and logistics."
    : "";
  return {
    whyIndia,
    use: `Use in ${company || "your products"}: ${useLine}${traderHint}`
  };
}

/* ---------------- Trader vs Manufacturer detection ---------------- */
const TRADER_CUES = ["trader","trading","distributor","wholesale","wholesaler","importer","exporter","supplier","merchant","reseller","stockist","sourcing"];
const MAKER_CUES  = ["manufactur","factory","plant","we make","our brand","brand owner","production","oem","odm","our facility","r&d","lab","formulation"];
function detectRole(text) {
  const t = text.toLowerCase();
  const trHits = TRADER_CUES.filter(w => t.includes(w)).length;
  const mkHits = MAKER_CUES.filter(w => t.includes(w)).length;
  if (trHits && mkHits) return { role: "Mixed", trHits, mkHits };
  if (trHits) return { role: "Trader", trHits, mkHits };
  if (mkHits)  return { role: "Manufacturer", trHits, mkHits };
  return { role: "Unknown", trHits, mkHits };
}

/* ---------------- A/B/C scores (heuristics) ---------------- */
const A_INDIA = {
  "guar-gum": 9, "psyllium-husk": 10, "rice-protein-70": 7, "rice-syrup": 7,
  "maltodextrin": 7, "tapioca-starch": 6, "pea-protein": 5, "soy-protein": 6,
  "curcumin": 10, "ashwagandha": 9, "ginger": 8, "neem": 9, "tulsi": 9,
  "capsaicin": 7, "liquorice": 6, "moringa": 9, "amla": 9,
  "fenugreek-saponins": 8, "prebiotics": 6, "protein-meals": 8,
  "veg-fats": 7, "fruit-veg-powders": 7
};
const B_EU = {
  "guar-gum": 9, "psyllium-husk": 8, "rice-protein-70": 8, "rice-syrup": 7,
  "maltodextrin": 9, "tapioca-starch": 8, "pea-protein": 9, "soy-protein": 8,
  "curcumin": 7, "ashwagandha": 6, "ginger": 8, "neem": 5, "tulsi": 6,
  "capsaicin": 7, "liquorice": 7, "moringa": 6, "amla": 6,
  "fenugreek-saponins": 6, "prebiotics": 9, "protein-meals": 8,
  "veg-fats": 9, "fruit-veg-powders": 8
};
const C_TYPE = { default: "Plant-based" };
function getABC(id) { return { A: A_INDIA[id] ?? 6, B: B_EU[id] ?? 6, C: C_TYPE[id] ?? C_TYPE.default }; }

/* ---------------- Utilities ---------------- */
const normalize = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
const containsAny = (text, needles) => needles.some(n => normalize(text).includes(n));
function guessRegionFromUrl(url) {
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    const host = u.hostname;
    if (host.endsWith(".com") || host.endsWith(".us") || host.endsWith(".ca")) return "US";
    if (host.endsWith(".uk") || host.endsWith(".ie") || host.endsWith(".eu") || host.endsWith(".de") || host.endsWith(".nl") || host.endsWith(".be") || host.endsWith(".fr") || host.endsWith(".se") || host.endsWith(".no") || host.endsWith(".dk")) return "UK/EU";
    return "Other";
  } catch { return "Other"; }
}

/* ---------------- Product extraction from URLs + text ---------------- */
const PRODUCT_HINT_WORDS = [
  "dog food","cat food","treat","treats","kibble","biscuits","cookies","bar","protein bar","drink","beverage","sauce","gravy","powder","capsule","tablet","snack","chips","granola","bread","cake","yogurt","ice cream","ready to drink","meal"
];

function titleCase(s) {
  return s.replace(/\s+/g, " ").trim().toLowerCase()
    .replace(/\b([a-z])/g, (m, c) => c.toUpperCase());
}

function slugToName(url) {
  try {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    if (!segs.length) return "";
    const last = segs[segs.length - 1].replace(/[-_]+/g, " ").replace(/\d+/g, " ").trim();
    return titleCase(last);
  } catch { return ""; }
}

function extractProductCandidates(text, pages = []) {
  const t = " " + normalize(text) + " ";
  const fromUrls = Array.from(new Set(
    pages
      .filter(p => /product|collection|category/i.test(p))
      .map(slugToName)
      .filter(x => x && x.length > 2 && !/^(products?|collections?|category)$/i.test(x))
  ));

  const fromText = [];
  PRODUCT_HINT_WORDS.forEach(h => {
    const re = new RegExp(`([A-Z][A-Za-z0-9&'’\\- ]{2,60})\\s+${h.replace(/ /g, "\\s+")}`, "g");
    let m; 
    while ((m = re.exec(text))) {
      const cand = titleCase(m[1]);
      if (cand && cand.length <= 60) fromText.push(cand);
    }
  });

  const merged = Array.from(new Set([...fromUrls, ...fromText])).slice(0, 60);
  // Also keep lowercase forms for quick search
  const mergedLower = merged.map(x => normalize(x));
  return { names: merged, namesLower: mergedLower };
}

function mapIngredientToProducts(fullTextLower, candidates, aliasesLower) {
  // returns top 3 product names with best proximity to aliases
  const scores = candidates.names.map((name, i) => {
    const nl = candidates.namesLower[i];
    const pIdx = fullTextLower.indexOf(nl);
    let best = Infinity;
    let aliasHits = 0;
    aliasesLower.forEach(a => {
      const ai = fullTextLower.indexOf(a);
      if (ai !== -1) {
        aliasHits++;
        if (pIdx !== -1) best = Math.min(best, Math.abs(pIdx - ai));
      }
    });
    const productHit = pIdx !== -1 ? 1 : 0;
    const score = (aliasHits * 5) + (productHit * 3) + (best === Infinity ? 0 : 1000 / (1 + best));
    return { name, score, aliasHits, productHit };
  });
  return scores
    .filter(s => s.aliasHits > 0 || s.productHit > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.name);
}

/* ---------------- Analyzer ---------------- */
function analyze(textRaw) {
  const text = normalize(textRaw);
  const industriesFound = Object.entries(INDUSTRY_TRIGGERS).filter(([_, cues]) => containsAny(text, cues)).map(([k]) => k);

  const scores = {}; const reasons = {};
  PORTFOLIO.forEach(p => {
    scores[p.id] = 0; reasons[p.id] = [];
    const aliasHits = p.aliases.filter(a => text.includes(a));
    if (aliasHits.length) { scores[p.id] += aliasHits.length * 3; reasons[p.id].push(`Mentions/aliases: ${aliasHits.join(", ")}`); }
    const indHits = industriesFound.filter(ind => p.industries.includes(ind));
    if (indHits.length) { scores[p.id] += indHits.length * 2; reasons[p.id].push(`Industry fit: ${indHits.join(", ")}`); }
  });
  FINISHED_PRODUCT_INFER.forEach(rule => {
    if (containsAny(text, rule.cues)) {
      rule.suggest.forEach(id => {
        if (scores[id] !== undefined) { scores[id] += 4; reasons[id].push(`Finished-product cues → ${rule.note}`); }
      });
    }
  });

  // Role detection influences scoring
  const roleInfo = detectRole(text);
  if (roleInfo.role === "Trader" || roleInfo.role === "Mixed") {
    const boostIds = ["guar-gum","psyllium-husk","curcumin","ashwagandha","moringa","amla","neem","tulsi","capsaicin","veg-fats","protein-meals"];
    boostIds.forEach(id => { if (scores[id] !== undefined) scores[id] += 2; });
  }

  const ranked = PORTFOLIO
    .map(p => ({ item: p, score: scores[p.id] || 0, reasons: Array.from(new Set(reasons[p.id])) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return { industriesFound, ranked, roleInfo };
}

/* ---------------- Industry triggers + finished-product inference ---------------- */
const INDUSTRY_TRIGGERS = {
  "pet food": ["pet food","dog food","cat food","animal nutrition","feed","kibble"],
  "feed": ["animal feed","premix","feed mill","feed additive"],
  "bakery": ["bakery","biscuit","cookies","bread","cakes","gluten-free"],
  "confectionery": ["confectionery","chocolate","candies","sweets"],
  "beverages": ["beverage","drink","juice","ready-to-drink","RTD","smoothie"],
  "dairy": ["dairy","ice cream","yogurt","cheese"],
  "nutrition": ["nutrition","nutraceutical","dietary supplement","sports nutrition","protein bar","meal replacement"],
  "pharma": ["pharma","pharmaceutical","excipient","capsule","tablet"],
  "flavours": ["flavour","flavor","aroma","fragrance","F&F","flavour house","fragrance"],
  "cosmetics": ["cosmetic","personal care","skincare"],
  "sauces": ["sauce","condiment","ketchup","dressing","syrup"],
  "snacks": ["snack","chips","extruded","puffs"],
  "alt meats": ["plant-based","meat alternative","vegan burger","meat analog"]
};

const FINISHED_PRODUCT_INFER = [
  { cues: ["protein bar","sports nutrition","meal replacement","vegan protein"], suggest: ["rice-protein-70","pea-protein","maltodextrin"], note: "High-protein formats need plant proteins + carriers." },
  { cues: ["gluten-free","celiac","free-from"], suggest: ["rice-protein-70","tapioca-starch","guar-gum"], note: "Gluten-free bakery needs structure/binding." },
  { cues: ["ice cream","frozen dessert","dairy alternative"], suggest: ["guar-gum","maltodextrin","rice-syrup"], note: "Stabilizers/bulking improve texture." },
  { cues: ["sauce","ketchup","dressing","gravy"], suggest: ["tapioca-starch","guar-gum","rice-syrup"], note: "Viscosity + sweetness balancing." },
  { cues: ["chocolate","confectionery","candy"], suggest: ["rice-syrup","maltodextrin","fruit-veg-powders"], note: "Sweetening + carriers for inclusions." },
  { cues: ["pet food","kibble","animal nutrition"], suggest: ["rice-protein-70","psyllium-husk","protein-meals","capsaicin","liquorice"], note: "Protein, fibre, phytogenics." },
  { cues: ["flavour","flavor","fragrance","aroma"], suggest: ["maltodextrin","rice-syrup","herbal extracts"], note: "Carriers + actives for F&F." }
];

/* ---------------- Outreach generator ---------------- */
function generateOutreach({ region, company, ranked, roleInfo }) {
  const top = ranked.slice(0, 6).map(r => r.item.name);
  const list = top.join(", ");
  const traderLine = (roleInfo?.role === "Trader" || roleInfo?.role === "Mixed")
    ? "If you’re importing for resale, we can supply India-dominant SKUs with consistent specs."
    : "";
  if (region === "US") {
    return `Thanks for connecting. For ${company}, we supply India-dominant ingredients (${list}) with strong export flow to EU & US. ${traderLine} Happy to share specs and pricing.`;
  }
  return `Thank you for connecting. For ${company}, we can supply India-dominant ingredients (${list}) with strong export flow to EU & US. ${traderLine} I’d be glad to share specifications and pricing.`;
}

/* ---------------- Component ---------------- */
export default function Home() {
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [siteText, setSiteText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const [copyOk, setCopyOk] = useState(false);
  const [maxPages, setMaxPages] = useState(10);
  const [pagesList, setPagesList] = useState([]);

  // Toggles
  const [indiaOnly, setIndiaOnly] = useState(true);
  const [strictEUUS, setStrictEUUS] = useState(true);

  const region = useMemo(() => guessRegionFromUrl(url), [url]);
  const fullTextLower = useMemo(() => normalize(siteText), [siteText]);

  async function tryFetch() {
    if (!url) return;
    setFetching(true);
    setResult(null);
    try {
      const api = `/api/crawl?url=${encodeURIComponent(url)}&max=${encodeURIComponent(maxPages)}`;
      const res = await fetch(api);
      const data = await res.json();
      if (data?.text) {
        setSiteText(data.text);
        setPagesList(data.pages || []);
      } else {
        alert(data?.error || "Could not fetch text. Paste content manually.");
      }
    } catch (e) {
      console.warn("Server crawl failed.", e);
      alert("Server crawl failed. Copy-paste page text and Analyze.");
    } finally {
      setFetching(false);
    }
  }

  function runAnalysis() {
    const text = siteText || "";
    if (!text.trim()) { alert("Paste some website text first (or click Fetch to crawl)."); return; }
    const out = analyze(text);
    setResult(out);
  }

  // Filter India-dominant + enrich with ABC + dominance + why/use + product mapping
  const filtered = useMemo(() => {
    if (!result) return null;

    const checkDominance = (id) => {
      const d = INDIA_DOMINANCE[id];
      if (!d) return false;
      if (!d.global) return false;
      if (strictEUUS) return !!(d.eu && d.us);
      return !!(d.eu || d.us);
    };

    const candidates = extractProductCandidates(siteText, pagesList);

    const enrich = result.ranked.map(r => {
      const abc = getABC(r.item.id);
      const dominance = INDIA_DOMINANCE[r.item.id];
      // Find likely products that use this ingredient (heuristic proximity)
      const aliasesLower = r.item.aliases.map(a => normalize(a));
      const productsUsed = mapIngredientToProducts(fullTextLower, candidates, aliasesLower);
      const why = buildWhy({
        id: r.item.id,
        company,
        industriesFound: result.industriesFound,
        dominance,
        roleInfo: result.roleInfo
      });
      return { ...r, ...abc, dominance, why, productsUsed };
    });

    const kept = indiaOnly ? enrich.filter(r => checkDominance(r.item.id)) : enrich;
    const removed = indiaOnly ? enrich.filter(r => !checkDominance(r.item.id)) : [];
    return { kept, removed, candidates, roleInfo: result.roleInfo };
  }, [result, indiaOnly, strictEUUS, siteText, pagesList, company, fullTextLower]);

  const outreach = useMemo(() => {
    if (!filtered || filtered.kept.length === 0) return "";
    return generateOutreach({ region, company: company || "your company", ranked: filtered.kept, roleInfo: filtered.roleInfo });
  }, [filtered, region, company]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Winspro Buyer-Fit Finder</h1>
          <div className="text-sm text-slate-500">India-Dominant Filter · Trader Detection · Product Usage</div>
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
                  <input className="border rounded-md p-2 w-full" placeholder="e.g., https://www.example.com/products" value={url} onChange={e => setUrl(e.target.value)} />
                  <button onClick={tryFetch} disabled={!url || fetching} className="px-3 py-2 border rounded-md bg-slate-900 text-white whitespace-nowrap flex items-center gap-2">
                    {fetching ? <Loader2 className="w-4 h-4 animate-spin"/> : <ClipboardList className="w-4 h-4"/>}
                    Fetch
                  </button>
                </div>
                <div className="text-xs text-slate-500">Server crawl follows internal product/category/application links up to “Max pages”.</div>
                <div className="flex items-center gap-2 text-sm">
                  <ListTree className="w-4 h-4"/><span>Max pages:</span>
                  <input type="number" min={3} max={20} value={maxPages} onChange={e => setMaxPages(parseInt(e.target.value || "10", 10))} className="border rounded-md p-1 w-16" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="col-span-2 grid gap-2">
                <label className="text-sm font-medium">Website Text (auto-filled by Fetch; you can also paste)</label>
                <textarea rows={8} className="border rounded-md p-2" placeholder="Merged text from crawled pages will appear here…" value={siteText} onChange={e => setSiteText(e.target.value)} />
                {!!pagesList.length && (
                  <div className="text-xs text-slate-500">Crawled {pagesList.length} pages. First few: {pagesList.slice(0, 5).join("  ·  ")}</div>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Filters</label>
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" checked={indiaOnly} onChange={e => setIndiaOnly(e.target.checked)} />
                  Only show India-dominant (Global + EU + US)
                </label>
                <label className="text-sm flex items-center gap-2 ml-6">
                  <input type="checkbox" checked={strictEUUS} onChange={e => setStrictEUUS(e.target.checked)} />
                  Require BOTH EU & US (untick = EU OR US)
                </label>
                {filtered?.roleInfo && (
                  <div className="text-xs text-slate-600 mt-2">
                    Detected role: <b>{filtered.roleInfo.role}</b> (signals: trader {filtered.roleInfo.trHits}, maker {filtered.roleInfo.mkHits})
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={runAnalysis} className="px-3 py-2 border rounded-md bg-emerald-600 text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4"/>Analyze
              </button>
              <span className="text-xs text-slate-500">Region guess: <span className="font-medium">{region}</span> (affects outreach tone)</span>
            </div>
          </div>
        </div>

        {filtered && (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Kept (India-dominant) */}
            <div className="md:col-span-3 shadow-sm rounded-2xl bg-white border">
              <div className="p-4 md:p-6 grid gap-3">
                <h2 className="text-lg font-semibold">India-Dominant Ingredients to Pitch</h2>
                <div className="text-sm text-slate-600">Must be India-dominant globally and {strictEUUS ? "to EU **and** US" : "to EU or US"}.</div>

                <div className="grid gap-3">
                  {filtered.kept.length === 0 && <div className="text-sm text-slate-500">No items passed the filter. Untick “Require BOTH EU & US” or turn off the filter to see all matches.</div>}

                  {filtered.kept.map((r, idx) => (
                    <div key={r.item.id} className="border rounded-xl p-3 hover:shadow-sm transition">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="font-medium">
                          {idx + 1}. {r.item.name} <span className="text-slate-400 text-xs">· {r.item.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-slate-100">Relevance {r.score}</span>
                          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">A {r.A}</span>
                          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">B {r.B}</span>
                          <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700">C {r.C}</span>
                        </div>
                      </div>

                      {r.dominance?.note && (
                        <div className="text-xs text-slate-600 mt-1">Export note: {r.dominance.note}</div>
                      )}

                      {r.reasons?.length > 0 && (
                        <ul className="list-disc pl-5 mt-2 text-sm text-slate-700 space-y-1">
                          {r.reasons.map((reason, i) => (<li key={i}>{reason}</li>))}
                        </ul>
                      )}

                      {/* NEW: rationale + product usage */}
                      <div className="mt-2 text-sm text-slate-700 space-y-1">
                        <div><b>Why import from India:</b> {r.why.whyIndia}</div>
                        <div><b>Use in product:</b> {r.why.use}</div>
                        {r.productsUsed?.length > 0 && (
                          <div><b>Likely used in (from this site):</b> {r.productsUsed.join(", ")}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outreach + Excluded */}
            <div className="grid md:col-span-2 gap-6">
              <div className="shadow-sm rounded-2xl bg-white border">
                <div className="p-4 md:p-6 grid gap-3">
                  <h3 className="text-lg font-semibold">Outreach Draft (mentions India dominance)</h3>
                  <textarea rows={8} className="border rounded-md p-2" value={outreach} onChange={()=>{}} />
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border rounded-md bg-slate-100 flex items-center gap-2" onClick={async ()=>{
                      await navigator.clipboard.writeText(outreach);
                      setCopyOk(true);
                      setTimeout(()=>setCopyOk(false), 1500);
                    }}>
                      {copyOk ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {indiaOnly && filtered.removed.length > 0 && (
                <div className="shadow-sm rounded-2xl bg-white border">
                  <div className="p-4 md:p-6 grid gap-3">
                    <h3 className="text-lg font-semibold">Excluded (not India-dominant)</h3>
                    <div className="text-xs text-slate-600">Matched the site but filtered out by India-dominant rule.</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {filtered.removed.map(r => <li key={r.item.id}>{r.item.name}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
