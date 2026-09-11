// site/_probes/s3-kontrast.mjs (S3)
// Textkontrast i kitens exempel: går igenom varje element med egen text i harness-sidorna (s3-parity.mjs
// måste ha körts), räknar fram effektiv bakgrund (närmaste opaka/alfa-blandade background-color uppåt i
// trädet; gradienter ignoreras = midnight-basen antas) och listar allt under WCAG AA
// (4,5:1 för text < 24 px / < 18,66 px fet, annars 3:1). Skriver site/_probes/out/s3-kontrast.json.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); }
  catch { res.writeHead(404); res.end(); }
});
const port = 8900 + Math.floor(Math.random() * 90);
await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
const files = ['site/_probes/out/s3-harness-calc.html', 'site/_probes/out/s3-harness-diag-entry.html', 'site/_probes/out/s3-harness-diag-q.html', 'site/_probes/out/s3-harness-diag-verdict.html', 'site/komponenter/verktyg.html', 'site/komponenter/diagnostik.html'];
const result = {};
for (const file of files) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  result[file] = await page.evaluate(() => {
    const parse = s => { const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null; };
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
    const midnight = { r: 9, g: 11, b: 50, a: 1 };
    function bgOf(el) {
      // stapla alfa-lager uppåt tills en opak yta hittas
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const cs = getComputedStyle(e);
        const bg = parse(cs.backgroundColor);
        const hasImage = cs.backgroundImage && cs.backgroundImage !== 'none';
        if (bg && bg.a > 0) { layers.push(bg); if (bg.a >= 1) break; }
        if (hasImage && (!bg || bg.a < 1)) { layers.push(e.classList.contains('ampy-card--dark') || e.classList.contains('ds-demo--dark') || e.classList.contains('ampy-calc__popover') ? midnight : { r: 245, g: 249, b: 255, a: 1 }); break; }
      }
      let out = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i--) out = layers[i].a >= 1 ? layers[i] : blend(layers[i], out);
      return out;
    }
    const rows = []; const seen = new Set();
    for (const el of document.querySelectorAll('body *')) {
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'USE', 'CODE', 'PRE'].includes(el.tagName)) continue;
      if (el.closest('pre, .ds-code, .ds-side, .ds-topbar')) continue;
      const own = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[hidden]')) continue;
      const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
      const fg = parse(cs.color); if (!fg) continue;
      const bg = bgOf(el);
      const c = ratio(fg.a < 1 ? blend(fg, bg) : fg, bg);
      const fs = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight) >= 700;
      const large = fs >= 24 || (fs >= 18.66 && bold);
      const need = large ? 3 : 4.5;
      const key = el.className + '|' + cs.color + '|' + Math.round(c * 10);
      if (seen.has(key)) continue; seen.add(key);
      rows.push({ sel: (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase()), text: own.slice(0, 40), fs: Math.round(fs * 10) / 10, weight: cs.fontWeight, color: cs.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, ratio: Math.round(c * 100) / 100, need, ok: c >= need });
    }
    return { total: rows.length, fails: rows.filter(r => !r.ok), lowest: rows.sort((a, b) => a.ratio - b.ratio).slice(0, 8) };
  });
  await page.close();
}
await browser.close(); server.close();
await writeFile(resolve(root, 'site/_probes/out/s3-kontrast.json'), JSON.stringify(result, null, 1));
for (const [f, r] of Object.entries(result)) {
  console.log(`\n${f}: ${r.total} textelement, ${r.fails.length} under AA`);
  for (const x of r.fails) console.log(`  UNDER  ${x.ratio}:1 (behöver ${x.need}) ${x.sel} "${x.text}" ${x.fs}px/${x.weight} ${x.color} på ${x.bg}`);
  console.log('  lägst:', r.lowest.slice(0, 5).map(x => `${x.ratio} ${x.sel} ${x.fs}px`).join(' | '));
}
