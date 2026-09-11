// Generisk mätprobe: renderar en källa på 1440 och 390, läser getComputedStyle per roll,
// kör valfria actions (klick/vänta/skärmdump) och skriver JSON.
// Usage: node inventering/_probes/measure.mjs <config.json>
// Config: { file, query, out, scope, cssVars:[...], roles:{roll: selector}, before:[actions], states:[{name, actions, roles}] }
// action: {click: sel} | {wait: ms} | {shot: path} | {eval: "js"} | {fill: [sel, text]} | {select: [sel, value]}
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mapColor } from './tokens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cfg = JSON.parse(await readFile(process.argv[2], 'utf8'));
const port = 8600 + Math.floor(Math.random() * 300);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
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

const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'fontFeatureSettings', 'fontVariantNumeric',
  'color', 'backgroundColor', 'backgroundImage', 'padding', 'margin', 'gap', 'rowGap', 'columnGap', 'borderRadius', 'boxShadow', 'border', 'borderTop', 'borderColor', 'outline',
  'transition', 'animation', 'width', 'height', 'minHeight', 'maxWidth', 'opacity', 'display', 'gridTemplateColumns', 'textAlign', 'backdropFilter', 'textShadow', 'WebkitBackgroundClip', 'WebkitTextFillColor'];

async function measureRoles(page, roles) {
  return page.evaluate(([roles, PROPS]) => {
    const out = {};
    for (const [role, sel] of Object.entries(roles)) {
      const el = document.querySelector(sel);
      if (!el) { out[role] = { selector: sel, missing: true }; continue; }
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const o = { selector: sel, tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60), rect: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } };
      for (const p of PROPS) { const v = cs[p]; if (v != null && v !== '' && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)' && v !== 'static' && v !== 'visible') o[p] = v; }
      if (cs.backgroundColor === 'rgba(0, 0, 0, 0)') o.backgroundColor = 'transparent';
      out[role] = o;
    }
    return out;
  }, [roles, PROPS]);
}
async function readCssVars(page, scope, names) {
  return page.evaluate(([scope, names]) => {
    const el = scope ? document.querySelector(scope) : document.documentElement;
    if (!el) return { missing: scope };
    const cs = getComputedStyle(el); const out = {};
    for (const n of names) out[n] = cs.getPropertyValue(n).trim() || null;
    return out;
  }, [scope, names]);
}
async function colorCensus(page, scope) {
  return page.evaluate((scope) => {
    const rootEl = scope ? document.querySelector(scope) : document.body;
    const count = {};
    const add = (v, k) => { if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') return; count[v] = count[v] || { n: 0, roller: new Set() }; count[v].n++; count[v].roller.add(k); };
    for (const el of rootEl.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      add(cs.color, 'text'); add(cs.backgroundColor, 'bg'); if (cs.borderTopWidth !== '0px') add(cs.borderTopColor, 'border');
    }
    return Object.fromEntries(Object.entries(count).map(([k, v]) => [k, { n: v.n, roller: [...v.roller] }]));
  }, scope);
}
async function run(actions, page, vp, store) {
  for (const a of actions || []) {
    if (a.evalStore) { const v = await page.evaluate(a.evalStore); if (store) store[a.key || 'eval'] = v; }
    if (a.click) { await page.click(a.click, { force: !!a.force }); }
    if (a.hover) { await page.hover(a.hover, { force: true }); }
    if (a.focus) { await page.focus(a.focus); }
    if (a.press) { await page.keyboard.press(a.press); }
    if (a.wait) await page.waitForTimeout(a.wait);
    if (a.eval) await page.evaluate(a.eval);
    if (a.fill) await page.fill(a.fill[0], a.fill[1]);
    if (a.select) await page.selectOption(a.select[0], a.select[1]);
    if (a.scroll) await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), a.scroll);
    if (a.shot) await page.screenshot({ path: a.shot.replace('{vp}', vp), fullPage: a.full !== false });
  }
}

const browser = await chromium.launch();
const result = { url, viewports: {} };
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const vp = { errors, extra: {} };
  await run(cfg.before, page, name, vp.extra);
  vp.docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  if (cfg.cssVars) vp.cssVars = await readCssVars(page, cfg.scope, cfg.cssVars);
  vp.roles = await measureRoles(page, cfg.roles || {});
  if (cfg.census !== false) {
    const c = await colorCensus(page, cfg.scope);
    vp.census = Object.fromEntries(Object.entries(c).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => [k, { ...v, ...mapColor(k) }]));
  }
  vp.states = {};
  for (const st of cfg.states || []) {
    try {
      await run(st.actions, page, name, vp.extra);
      vp.states[st.name] = await measureRoles(page, st.roles || {});
    } catch (e) { vp.states[st.name] = { error: String(e) }; }
  }
  result.viewports[name] = vp;
  await page.close();
}
await browser.close();
server.close();
await writeFile(cfg.out, JSON.stringify(result, null, 1));
console.log('wrote', cfg.out, JSON.stringify({ desktop: { h: result.viewports.desktop.docHeight, errors: result.viewports.desktop.errors }, mobile: { h: result.viewports.mobile.docHeight, errors: result.viewports.mobile.errors } }));
