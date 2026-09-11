// Shared probe helpers for the inventory (agent 2).
// Serves an arbitrary root directory statically (like tools/shot.mjs) and exposes a
// measure() that runs getComputedStyle on selector→role maps at 1440 and 390.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.php': 'text/plain' };

export async function serve(root) {
  const server = createServer(async (req, res) => {
    try {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let fp = join(root, p);
      if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
      res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' });
      res.end(await readFile(fp));
    } catch { res.writeHead(404); res.end('not found'); }
  });
  const port = 8600 + Math.floor(Math.random() * 400);
  await new Promise(r => server.listen(port, r));
  return { server, port, url: (file, query = '') => `http://localhost:${port}/${file}${query}` };
}

export const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'textAlign',
  'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderRadius',
  'boxShadow', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom',
  'gap', 'rowGap', 'columnGap', 'width', 'height', 'maxWidth', 'minHeight', 'display', 'gridTemplateColumns',
  'transition', 'opacity', 'textDecorationLine', 'textDecorationThickness', 'textUnderlineOffset', 'outline', 'backdropFilter', 'position', 'top', 'bottom', 'zIndex', 'fontVariantNumeric'];

// Runs in the page. spec = [{role, sel, nth?}]
export function pageProbe({ spec, props }) {
  const out = {};
  for (const { role, sel, nth = 0 } of spec) {
    const els = document.querySelectorAll(sel);
    const el = els[nth];
    if (!el) { out[role] = null; continue; }
    const cs = getComputedStyle(el);
    const o = { sel, count: els.length };
    for (const p of props) o[p] = cs[p];
    const r = el.getBoundingClientRect();
    o.rect = { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    o.text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    o.fsPx = parseFloat(cs.fontSize);
    o.lhRatio = cs.lineHeight === 'normal' ? 'normal' : +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(3);
    out[role] = o;
  }
  return out;
}

// Runs in the page: collects every computed colour in scope with usage counts.
export function pageColours(scopeSel) {
  const scope = scopeSel ? document.querySelector(scopeSel) : document.body;
  if (!scope) return null;
  const els = [scope, ...scope.querySelectorAll('*')];
  const tally = {};
  const add = (k, v) => { if (!v || v === 'none' || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') return; const key = k + ' ' + v; tally[key] = (tally[key] || 0) + 1; };
  for (const el of els) {
    const cs = getComputedStyle(el);
    add('color', cs.color);
    add('bg', cs.backgroundColor);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') add('bgimg', cs.backgroundImage.slice(0, 160));
    if (cs.borderTopStyle !== 'none' && parseFloat(cs.borderTopWidth) > 0) add('border', cs.borderTopColor);
    if (cs.boxShadow && cs.boxShadow !== 'none') add('shadow', cs.boxShadow.slice(0, 160));
    if (el instanceof SVGElement) { add('svg-fill', cs.fill); if (cs.stroke && cs.stroke !== 'none') add('svg-stroke', cs.stroke); }
  }
  // only count text colours for elements that actually have direct text
  return Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ k, n }));
}

export async function measure({ root, file, query = '', spec, colourScope, viewports = [[1440, 1000], [390, 844]], extra, beforeMeasure }) {
  const srv = await serve(root);
  const browser = await chromium.launch();
  const result = { file, viewports: {} };
  for (const [w, h] of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(srv.url(file, query), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    if (beforeMeasure) await beforeMeasure(page, w);
    const data = await page.evaluate(pageProbe, { spec, props: PROPS });
    const colours = await page.evaluate(pageColours, colourScope || null);
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const rootFs = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
    const bodyFs = await page.evaluate(() => { const cs = getComputedStyle(document.body); return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily, lineHeight: cs.lineHeight, color: cs.color, backgroundColor: cs.backgroundColor }; });
    const extraData = extra ? await page.evaluate(extra) : undefined;
    result.viewports[w] = { docH, rootFs, body: bodyFs, errors, roles: data, colours, extra: extraData };
    await page.close();
  }
  await browser.close();
  srv.server.close();
  return result;
}

export function fmt(r) {
  if (!r) return 'null';
  return `${r.fontFamily.split(',')[0].replace(/"/g, '')} ${r.fontSize}/${r.fontWeight} lh:${r.lineHeight}(${r.lhRatio}) ls:${r.letterSpacing} ${r.textTransform !== 'none' ? r.textTransform + ' ' : ''}${r.color} ${r.rect.w}x${r.rect.h}`;
}
