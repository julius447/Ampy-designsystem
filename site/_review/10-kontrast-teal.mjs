// Kontrast + teal-som-text-probe över valda sidor (desktop 1440). För varje element med egen text: färg, effektiv bakgrund
// (närmaste opaka ancestor-bakgrund; alfa blandas), storlek/vikt -> WCAG-krav 4,5 / 3. Rapporterar underkända par, "okänd yta"
// (background-image i kedjan) och alla textnoder vars färg är teal-core rgb(0,169,145).
// Kör: node site/_review/10-kontrast-teal.mjs [sida ...]  -> site/_review/out/kontrast.json
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 9000 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['site/index.html', 'site/grunder/farg.html', 'site/grunder/typografi.html', 'site/komponenter/knappar.html', 'site/komponenter/falt.html', 'site/komponenter/verktyg.html', 'site/komponenter/diagnostik.html', 'site/komponenter/block.html', 'site/komponenter/text.html', 'site/komponenter/ytor.html', 'site/beslut.html', 'site/blockbibliotek.html'];
const browser = await chromium.launch();
const all = {};
for (const rel of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const parse = s => { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
    const cr = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
    const fails = [], unknown = [], teal = []; let checked = 0;
    const descr = el => { const t = el.tagName.toLowerCase(); const c = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''; return t + c; };
    const path = el => { const parts = []; let e = el; while (e && e !== document.body && parts.length < 4) { parts.push(descr(e)); e = e.parentElement; } return parts.reverse().join(' > '); };
    const walker = document.createTreeWalker(document.querySelector('.ds-main') || document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    let node;
    while ((node = walker.nextNode())) {
      const txt = node.textContent.replace(/\s+/g, ' ').trim(); if (txt.length < 2) continue;
      const el = node.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (el.closest('script,style,noscript,pre.ds-hidden')) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const rect = el.getBoundingClientRect(); if (rect.width === 0 || rect.height === 0) continue;
      const fg = parse(cs.color); if (!fg) continue;
      // hidden by overflow/opacity?
      let op = 1, e2 = el; while (e2) { const o = parseFloat(getComputedStyle(e2).opacity); if (!isNaN(o)) op *= o; e2 = e2.parentElement; } if (op < 0.05) continue;
      // text-fill transparent (gradient text)?
      if (cs.webkitTextFillColor && cs.webkitTextFillColor.includes('rgba(0, 0, 0, 0)')) { unknown.push({ path: path(el), txt: txt.slice(0, 40), why: 'gradienttext' }); continue; }
      // effektiv bakgrund
      let bg = null, layers = [], e = el, hasImage = false;
      while (e) { const c = getComputedStyle(e); if (c.backgroundImage && c.backgroundImage !== 'none') { hasImage = true; break; } const b = parse(c.backgroundColor); if (b && b.a > 0) { layers.push(b); if (b.a >= 1) { break; } } e = e.parentElement; }
      if (hasImage) { unknown.push({ path: path(el), txt: txt.slice(0, 40), color: cs.color, why: 'background-image i kedjan' }); if (cs.color === 'rgb(0, 169, 145)') teal.push({ path: path(el), txt: txt.slice(0, 50), fontSize: cs.fontSize }); continue; }
      if (!layers.length || layers[layers.length - 1].a < 1) layers.push({ r: 255, g: 255, b: 255, a: 1 });
      bg = layers[layers.length - 1]; for (let i = layers.length - 2; i >= 0; i--) bg = blend(layers[i], bg);
      const fgc = fg.a < 1 ? blend(fg, bg) : fg;
      const ratio = cr(fgc, bg);
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      checked++;
      if (cs.color === 'rgb(0, 169, 145)') teal.push({ path: path(el), txt: txt.slice(0, 50), fontSize: cs.fontSize, ratio: +ratio.toFixed(2) });
      if (ratio < need) fails.push({ path: path(el), txt: txt.slice(0, 50), color: cs.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, ratio: +ratio.toFixed(2), need, fontSize: size, weight });
    }
    return { checked, fails, unknown, teal };
  });
  all[rel] = r;
  console.log(rel, 'kontrollerade', r.checked, 'UNDERKÄNDA', r.fails.length, 'okänd yta', r.unknown.length, 'teal-core som text', r.teal.length);
  for (const f of r.fails) console.log('   FAIL', f.ratio, '<', f.need, '|', f.color, 'på', f.bg, '|', f.fontSize + 'px/' + f.weight, '|', f.path, '|', f.txt);
  for (const t of r.teal) console.log('   TEAL', t.fontSize, '|', t.path, '|', t.txt);
  await page.close();
}
await browser.close(); server.close();
await writeFile(join(root, 'site/_review/out/kontrast.json'), JSON.stringify(all, null, 1));
