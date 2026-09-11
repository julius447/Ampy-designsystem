// site/_probes/overflow.mjs <sida.html> [bredd=390]
// Listar element vars högerkant sticker utanför viewporten (orsaken till overflowX i tools/shot.mjs).
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [,, file, wArg] = process.argv;
const w = Number(wArg) || 390;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end(); }
});
const port = 8300 + Math.floor(Math.random() * 300);
await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: 844 } });
await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
const out = await page.evaluate((w) => {
  const rows = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.right > w + 0.5 && r.width > 0) {
      const sel = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
      rows.push({ sel: sel.slice(0, 90), right: Math.round(r.right), width: Math.round(r.width), text: (el.textContent || '').trim().slice(0, 40) });
    }
  }
  return { scrollWidth: document.documentElement.scrollWidth, rows: rows.slice(0, 25) };
}, w);
console.log(JSON.stringify(out, null, 1));
await browser.close(); server.close();
