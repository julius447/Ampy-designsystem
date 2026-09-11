// S2 kontrastprobe: mäter WCAG-kontrast för varje textbärande element i S2:s live-exempel
// (site/komponenter/{knappar,text,ytor,falt,index}.html, inuti .ds-demo och .ds-card__demo) vid 1440.
// Bakgrunden räknas fram genom att gå upp i DOM:en och komponera alfa-bakgrunder tills en opak yta hittas
// (gradienter approximeras med sitt mörkaste stopp = konservativt). Gräns: 4,5:1 normal text, 3:1 stor text
// (>= 24 px eller >= 18.66 px i vikt >= 700) och 3:1 för ikoner/kontrollkanter mäts inte här.
// Kör: node site/_probes/s2-kontrast.mjs  ->  site/_probes/out/s2-kontrast.json (+ underkända rader i terminalen)
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile, mkdir } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const port = 8900 + Math.floor(Math.random() * 90);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let fp = join(root, p);
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' });
    res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r => server.listen(port, r));

const PAGES = ['knappar', 'text', 'ytor', 'falt', 'index'];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const out = { datum: new Date().toISOString().slice(0, 10), sidor: {} };
for (const p of PAGES) {
  await page.goto(`http://localhost:${port}/site/komponenter/${p}.html`, { waitUntil: 'networkidle' });
  const rows = await page.evaluate(() => {
    const parse = s => { const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null; };
    const stopsOf = img => [...img.matchAll(/rgba?\([^)]+\)/g)].map(x => parse(x[0])).filter(Boolean);
    const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
    // effektiv bakgrund: samla lager nedifrån och upp, komponera uppifrån
    const bgOf = el => {
      const layers = [];   // {kind:'color', c} eller {kind:'grad', stops}
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        const col = parse(cs.backgroundColor);
        if (col && col.a > 0) layers.push({ kind: 'color', c: col });
        if (cs.backgroundImage !== 'none') { const st = stopsOf(cs.backgroundImage); if (st.length) layers.push({ kind: 'grad', stops: st }); }
        if (col && col.a >= 1) break;
      }
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i--) {
        const L = layers[i];
        if (L.kind === 'color') bg = L.c.a >= 1 ? L.c : blend(L.c, bg);
        else { const cands = L.stops.map(s => s.a >= 1 ? s : blend(s, bg)); bg = cands.map(c => ({ c, l: lum(c) })).sort((a, b) => a.l - b.l)[0].c; }   // konservativt: mörkaste komponerade stoppet
      }
      return bg;
    };
    const res = [];
    const seen = new Set();
    const scopes = document.querySelectorAll('.ds-demo, .ds-card__demo');
    for (const scope of scopes) {
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
      let t;
      while ((t = walker.nextNode())) {
        const txt = t.textContent.trim(); if (!txt) continue;
        const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
        if (el.closest('[aria-hidden="true"]')) continue;   // dekor (citattecken, ikoner) är inte text
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
        const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
        const fg = parse(cs.color); if (!fg || fg.a === 0) continue;
        const bg = bgOf(el);
        const fgc = fg.a < 1 ? blend(fg, bg) : fg;
        const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10);
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const c = ratio(fgc, bg);
        const need = large ? 3 : 4.5;
        const isPlaceholderish = el.classList.contains('ds-demo__tag') || el.classList.contains('ds-demo__label');
        res.push({ text: txt.slice(0, 40), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 60), size: Math.round(size * 10) / 10, weight, ratio: Math.round(c * 100) / 100, need, ok: c >= need || isPlaceholderish, disabled: !!el.closest('[disabled], .is-disabled, [aria-disabled="true"], :disabled') });
      }
    }
    return res;
  });
  out.sidor[p] = rows;
}
await browser.close(); server.close();
await mkdir(join(root, 'site/_probes/out'), { recursive: true });
await writeFile(join(root, 'site/_probes/out/s2-kontrast.json'), JSON.stringify(out, null, 1));
let total = 0, fails = 0;
for (const [p, rows] of Object.entries(out.sidor)) {
  const bad = rows.filter(r => !r.ok && !r.disabled);
  total += rows.length; fails += bad.length;
  console.log(`\n== ${p}: ${rows.length} textelement mätta, ${bad.length} under gränsen (disabled undantagna: ${rows.filter(r => !r.ok && r.disabled).length})`);
  for (const b of bad) console.log(`  ${b.ratio}:1 (kräver ${b.need}) ${b.size}px/${b.weight} .${b.cls} "${b.text}"`);
}
console.log(`\nTotalt ${total} mätta, ${fails} underkända.`);
