// Viewport-skärmdump vid given scroll-y (undviker artefakter i 130 000 px höga full-page-PNG:er).
// node site/_review/15-shot-at.mjs <sida> <desktop|mobile> <y> <ut> [höjd=1000] [scale=0.5]
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 9300 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
const [,, rel, vp, yArg, out, hArg, sArg] = process.argv;
const w = vp === 'mobile' ? 390 : 1440; const h = Number(hArg) || (vp === 'mobile' ? 844 : 1000); const scale = Number(sArg) || 0.5;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 * scale });
await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
await page.evaluate(y => window.scrollTo(0, y), Number(yArg)); await page.waitForTimeout(400);
await page.screenshot({ path: `site/_review/out/crops/${out}.png` });
console.log(out, w, h, 'y=' + yArg);
await browser.close(); server.close();
