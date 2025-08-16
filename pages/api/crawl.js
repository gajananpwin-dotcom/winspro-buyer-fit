// pages/api/crawl.js
// Simple same-origin crawler: fetches the start URL, follows internal links that look like
// product/category/application pages, merges cleaned text, and returns { text, pages }.

const MAX_DEFAULT = 8;

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinks(html, base) {
  const hrefs = new Set();
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1].trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    try {
      const u = new URL(href, base);
      hrefs.add(u.toString());
    } catch {}
  }
  return Array.from(hrefs);
}

function looksProducty(pathname) {
  const p = pathname.toLowerCase();
  return [
    "/product", "/products", "/collections", "/category", "/categories",
    "/brand", "/application", "/applications", "/solutions", "/pet", "/feed",
    "/nutrition", "/flavour", "/flavor"
  ].some(k => p.includes(k));
}

export default async function handler(req, res) {
  try {
    const start = req.query.url;
    const max = Math.min(parseInt(req.query.max || MAX_DEFAULT, 10) || MAX_DEFAULT, 20);
    if (!start || !/^https?:\/\//i.test(start)) {
      return res.status(400).json({ error: "Pass ?url=https://example.com and optional &max=10" });
    }

    const startURL = new URL(start);
    const origin = startURL.origin;

    const queue = [startURL.toString()];
    const visited = new Set();
    const pages = [];
    let merged = "";

    while (queue.length && pages.length < max) {
      const url = queue.shift();
      if (visited.has(url)) continue;
      visited.add(url);

      // Same-origin only
      const u = new URL(url);
      if (u.origin !== origin) continue;

      const r = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
          "accept": "text/html,application/xhtml+xml",
        },
      });

      if (!r.ok) continue;
      const html = await r.text();
      const text = cleanText(html);
      if (text) {
        merged += " " + text;
        pages.push(url);
      }

      // discover more links
      const links = extractLinks(html, url);
      for (const L of links) {
        try {
          const t = new URL(L);
          if (t.origin === origin && looksProducty(t.pathname) && !visited.has(t.toString())) {
            queue.push(t.toString());
          }
        } catch {}
      }
    }

    merged = merged.slice(0, 800000); // cap payload
    return res.status(200).json({ text: merged, pages });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
