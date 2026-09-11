// site/_probes/s3-shot.mjs <sida.html> <outprefix> <selektor> [<selektor> ...] [--w 1440|390]
// Skärmdumpar enskilda exempel (element-screenshot) på S3:s sidor för render-loopen. Desktop + mobil.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const only = args.includes('--w') ? Number(args[args.indexOf('--w') + 1]) : 0;
const [file, prefix, ...sels] = args.filter((a, i, arr) => a !== '--w' && arr[i - 1] !== '--w');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end(); }
});
const port = 8500 + Math.floor(Math.random() * 300);
await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
const out = {};
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  if (only && only !== w) continue;
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  for (const sel of sels) {
    const el = page.locator(sel).first();
    const safe = sel.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    try { await el.screenshot({ path: `${prefix}-${safe}-${name}.png` }); out[`${safe}-${name}`] = await el.evaluate(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; }); }
    catch (e) { out[`${safe}-${name}`] = 'saknas: ' + String(e).slice(0, 80); }
  }
  out[name + '-errors'] = errors;
  out[name + '-overflowX'] = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.close();
}
await browser.close(); server.close();
console.log(JSON.stringify(out, null, 1));
