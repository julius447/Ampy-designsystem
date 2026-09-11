// Skriver ut y-position (desktop 1440 + mobil 390) för varje h2 på en sida, så att skärmdumpar kan beskäras per sektion.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 9200 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
const rel = process.argv[2];
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  const hs = await page.evaluate(() => [...document.querySelectorAll('.ds-main h2, .ds-main h3.ds-h3')].map(h => ({ tag: h.tagName, id: h.id, text: h.textContent.trim().slice(0, 50), y: Math.round(h.getBoundingClientRect().top + scrollY) })));
  console.log(`== ${name} (${rel})`); for (const x of hs) console.log(`${String(x.y).padStart(6)}  ${x.tag} #${x.id}  ${x.text}`);
  await page.close();
}
await browser.close(); server.close();
