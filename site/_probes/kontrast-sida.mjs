// site/_probes/kontrast-sida.mjs <sida.html> [bredd=1440]
// Mäter WCAG-kontrast för varje textbärande element på en sida: färg mot närmaste solida bakgrund
// (ancestor med background-color utan alfa; alfa blandas mot nästa lager). Element på foto/gradient
// (background-image) rapporteras som "okänd yta" i stället för att gissas. Skriver ut alla par under
// 4,5:1 (normal text) respektive 3:1 (stor text: >= 24 px, eller >= 18,66 px och vikt >= 700) + summering.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [,, file, wArg] = process.argv;
const w = Number(wArg) || 1440;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  try {
    let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end(); }
});
const port = 8600 + Math.floor(Math.random() * 300);
await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: 900 } });
await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const out = await page.evaluate(() => {
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(',').map(Number); return { r, g, b, a }; };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const hex = (c) => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const bgOf = (el) => {
    const layers = []; let node = el; let unknown = false;
    while (node && node !== document.documentElement.parentNode) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') { unknown = true; }
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
      node = node.parentElement;
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (const l of layers.reverse()) bg = l.a >= 1 ? l : blend(l, bg);
    return { bg, unknown };
  };
  const rows = []; const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'USE'].includes(el.tagName)) continue;
    const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
    let fg = parse(cs.color); if (!fg) continue;
    const { bg, unknown } = bgOf(el);
    if (fg.a < 1) fg = blend(fg, bg);
    const size = parseFloat(cs.fontSize); const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const rt = ratio(fg, bg);
    const sel = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
    const key = sel + '|' + hex(fg) + '|' + hex(bg) + '|' + unknown;
    if (seen.has(key)) continue; seen.add(key);
    rows.push({ sel: sel.slice(0, 70), text: el.textContent.trim().slice(0, 40), fg: hex(fg), bg: hex(bg), size: Math.round(size * 10) / 10, weight, ratio: Math.round(rt * 100) / 100, need, ok: unknown ? null : rt >= need, unknown });
  }
  return rows;
});
const fails = out.filter(r => r.ok === false);
const unknown = out.filter(r => r.unknown);
console.log(JSON.stringify({ file, width: w, par: out.length, underkanda: fails.length, okand_yta: unknown.length, fails, okand: unknown.map(u => ({ sel: u.sel, text: u.text, fg: u.fg })) }, null, 1));
await browser.close(); server.close();
