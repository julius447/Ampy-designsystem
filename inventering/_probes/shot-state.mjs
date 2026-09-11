// Skärmdump efter ett setup-script (för states: fel, success, fokus, öppna paneler).
// Usage: node inventering/_probes/shot-state.mjs <file> <outprefix> "<setup js>" [clipSelector]
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [,, file, prefix, setup, clipSel] = process.argv;
const port = 8900 + Math.floor(Math.random() * 90);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { const p = decodeURIComponent(new URL(req.url, 'http://x').pathname); let fp = join(root, p); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  if (setup) await page.evaluate(setup);
  await page.waitForTimeout(500);
  if (clipSel) { const loc = page.locator(clipSel).first(); await loc.scrollIntoViewIfNeeded(); await loc.screenshot({ path: `${prefix}-${name}.png` }); }
  else await page.screenshot({ path: `${prefix}-${name}.png`, fullPage: true });
  await page.close();
}
await browser.close(); server.close(); console.log('ok', prefix);
