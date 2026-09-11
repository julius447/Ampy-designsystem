// Playwright-probe: läser getComputedStyle på riktiga element i renderad sida.
// Usage: node inventering/_probes/probe.mjs <config.json>
//   config = { file, query?, out, targets: [{ roll, sel, nth?, props?: [...] , hover?: bool, focus?: bool }] }
//   Serverar repo-roten precis som tools/shot.mjs. Mäter vid 1440x1000 och 390x844.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cfgPath = process.argv[2];
if (!cfgPath) { console.error('usage: node probe.mjs <config.json>'); process.exit(1); }
const cfg = JSON.parse(await readFile(cfgPath, 'utf8'));
const port = 8700 + Math.floor(Math.random() * 200);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let fp = join(root, p);
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' });
    res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r => server.listen(port, r));
const url = `http://localhost:${port}/${cfg.file}${cfg.query || ''}`;
const browser = await chromium.launch();
const DEFAULT_PROPS = ['font-family','font-size','font-weight','line-height','letter-spacing','text-transform','color',
  'background-color','background-image','border-top-width','border-top-style','border-top-color','border-radius',
  'padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-bottom','box-shadow','backdrop-filter',
  'opacity','outline','outline-offset','transition','gap','row-gap','column-gap','max-width','min-height','display','grid-template-columns','text-shadow','filter','fill','stroke','stroke-width'];
const out = { url, viewports: {} };
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  if (cfg.setup) await page.evaluate(cfg.setup);
  const res = {};
  res.__root = await page.evaluate(() => ({
    htmlFontSize: getComputedStyle(document.documentElement).fontSize,
    bodyFont: getComputedStyle(document.body).fontFamily,
    bodyFontSize: getComputedStyle(document.body).fontSize,
    bodyColor: getComputedStyle(document.body).color,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyBgImage: getComputedStyle(document.body).backgroundImage,
    scrollHeight: document.documentElement.scrollHeight,
    fontsLoaded: Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight)
  }));
  if (cfg.tokens) {
    res.__tokens = await page.evaluate((names) => {
      const probe = document.createElement('div'); document.body.appendChild(probe);
      const r = {};
      for (const n of names) {
        probe.style.width = `var(${n})`;
        const cs = getComputedStyle(probe);
        r[n] = { raw: cs.getPropertyValue(n).trim(), px: cs.width };
      }
      probe.remove(); return r;
    }, cfg.tokens);
  }
  for (const t of cfg.targets) {
    const props = t.props || DEFAULT_PROPS;
    const loc = page.locator(t.sel).nth(t.nth || 0);
    const count = await page.locator(t.sel).count();
    if (!count) { res[t.roll] = { sel: t.sel, missing: true }; continue; }
    if (t.hover) { try { await loc.hover({ force: true }); await page.waitForTimeout(350); } catch {} }
    if (t.focus) { try { await loc.focus(); await page.waitForTimeout(350); } catch {} }
    const data = await loc.evaluate((el, { props, pseudo }) => {
      const cs = getComputedStyle(el, pseudo || null);
      const o = {};
      for (const p of props) o[p] = cs.getPropertyValue(p);
      const r = el.getBoundingClientRect();
      o.__rect = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      o.__text = (el.textContent || '').trim().slice(0, 60);
      o.__tag = el.tagName.toLowerCase();
      o.__visible = !!(r.width || r.height) && cs.display !== 'none' && cs.visibility !== 'hidden';
      return o;
    }, { props, pseudo: t.pseudo });
    data.__count = count; data.__sel = t.sel;
    res[t.roll] = data;
    if (t.hover) { try { await page.mouse.move(0, 0); await page.waitForTimeout(300); } catch {} }
    if (t.focus) { try { await page.evaluate(() => document.activeElement && document.activeElement.blur()); } catch {} }
  }
  out.viewports[name] = res;
  await page.close();
}
await browser.close();
server.close();
await writeFile(cfg.out, JSON.stringify(out, null, 1));
console.log('wrote', cfg.out);
