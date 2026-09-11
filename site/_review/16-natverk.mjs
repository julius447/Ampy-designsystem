// Räknar alla nätverksanrop per sida; flaggar allt som inte går till localhost (externa resurser är förbjudna).
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, readdir } from 'fs/promises';
import { resolve, join, extname, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 9400 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
async function walk(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) { if (['_probes', '_review', '_bygglogg', 'bilder', 'brand'].includes(e.name)) continue; out.push(...await walk(p)); } else if (e.name.endsWith('.html') && e.name !== '_mall.html') out.push(p); } return out; }
const pages = (await walk(join(root, 'site'))).map(p => relative(root, p)).sort();
const browser = await chromium.launch(); let totalExt = 0; let total = 0;
for (const rel of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const urls = []; page.on('request', r => urls.push(r.url()));
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
  const ext = urls.filter(u => !u.startsWith(`http://localhost:${port}/`));
  total += urls.length; totalExt += ext.length;
  console.log(rel.padEnd(40), 'anrop', String(urls.length).padStart(4), 'externa', ext.length, ext.slice(0, 3).join(' '));
  await page.close();
}
console.log('SUMMA anrop', total, 'externa', totalExt);
await browser.close(); server.close();
