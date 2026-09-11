// dumpar innerText av alla sidor till site/_review/out/text/<namn>.txt (för läsning + grep av dokumentets synliga text)
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, readdir, writeFile, mkdir } from 'fs/promises';
import { resolve, join, extname, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 8900 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
async function walk(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) { if (['_probes', '_review', '_bygglogg', 'bilder', 'brand'].includes(e.name)) continue; out.push(...await walk(p)); } else if (e.name.endsWith('.html') && e.name !== '_mall.html') out.push(p); } return out; }
const pages = (await walk(join(root, 'site'))).map(p => relative(root, p)).sort();
await mkdir(join(root, 'site/_review/out/text'), { recursive: true });
const browser = await chromium.launch();
for (const rel of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
  const txt = await page.evaluate(() => document.querySelector('.ds-main').innerText);
  const name = rel.replace(/^site\//, '').replace(/\//g, '-').replace(/\.html$/, '');
  await writeFile(join(root, 'site/_review/out/text', name + '.txt'), txt);
  console.log(name, txt.length);
  await page.close();
}
await browser.close(); server.close();
