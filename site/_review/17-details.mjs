import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 9500 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
for (const rel of ['site/komponenter/verktyg.html', 'site/komponenter/block.html', 'site/komponenter/diagnostik.html', 'site/grunder/rorelse.html']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const d = [...document.querySelectorAll('details')];
    const res = d.slice(0, 40).map(x => { const s = x.querySelector('summary'); if (!s) return 'INGEN SUMMARY'; s.focus(); const foc = document.activeElement === s; const cs = getComputedStyle(s); const before = x.open; s.click(); const toggled = x.open !== before; x.open = before; return `${foc ? 'fokus ok' : 'EJ FOKUS'} ${toggled ? 'toggle ok' : 'EJ TOGGLE'} outline=${cs.outlineStyle} h=${Math.round(s.getBoundingClientRect().height)}`; });
    const counts = {}; res.forEach(x => counts[x] = (counts[x] || 0) + 1);
    // knappar utan tillgängligt namn
    const unnamed = [...document.querySelectorAll('.ds-main button, .ds-main a')].filter(e => !(e.textContent || '').trim() && !e.getAttribute('aria-label') && !e.querySelector('[aria-label], title') && !e.getAttribute('title')).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ').slice(0, 2).join('.'));
    const unnamedCounts = {}; unnamed.forEach(x => unnamedCounts[x] = (unnamedCounts[x] || 0) + 1);
    // form-fält utan label
    const inputs = [...document.querySelectorAll('.ds-main input:not([type=hidden]), .ds-main select, .ds-main textarea')];
    const unlabeled = inputs.filter(i => { const id = i.id; const byFor = id && document.querySelector(`label[for="${CSS.escape(id)}"]`); const wrap = i.closest('label'); return !byFor && !wrap && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'); }).map(i => `${i.tagName.toLowerCase()}[type=${i.type}]${i.className ? '.' + String(i.className).split(' ')[0] : ''}`);
    const ul = {}; unlabeled.forEach(x => ul[x] = (ul[x] || 0) + 1);
    return { details: d.length, summary: counts, inputs: inputs.length, unlabeled: ul, unnamed: unnamedCounts };
  });
  console.log(rel, JSON.stringify(r));
  await page.close();
}
await browser.close(); server.close();
