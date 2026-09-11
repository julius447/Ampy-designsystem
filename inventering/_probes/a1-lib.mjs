// Shared helper for the inventory probes: static server for the repo root + Playwright.
// Same approach as tools/shot.mjs. Import: import { withPage, ROOT } from './_lib.mjs'
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.php': 'text/html; charset=utf-8' };

export async function startServer() {
  // port 0 = OS-assigned free port (other agents run servers in parallel)
  const server = createServer(async (req, res) => {
    try {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let fp = join(ROOT, p);
      if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
      res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' });
      res.end(await readFile(fp));
    } catch { res.writeHead(404); res.end('not found'); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return { server, port, base: `http://127.0.0.1:${port}/` };
}

// Runs fn(page, viewportName) for desktop 1440x1000 and mobile 390x844. Returns {desktop, mobile}.
export async function withPage(url, fn, viewports = [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const { server, base } = await startServer();
  const browser = await chromium.launch();
  const out = {};
  try {
    for (const [name, w, h] of viewports) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(url.startsWith('http') ? url : base + url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      out[name] = await fn(page, name, w);
      out[name].__errors = errors;
      await page.close();
    }
  } finally { await browser.close(); server.close(); }
  return out;
}

// Browser-side helper source: measure computed styles of the first element matching each selector.
export const MEASURE_SRC = `
(sels) => {
  const pick = (el) => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0,80),
      text: (el.innerText || el.value || '').trim().slice(0, 60),
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
      color: cs.color, background: cs.backgroundColor, backgroundImage: cs.backgroundImage.slice(0,200),
      padding: cs.padding, margin: cs.margin, gap: cs.gap, borderRadius: cs.borderRadius, border: cs.border, boxShadow: cs.boxShadow,
      transition: cs.transition, backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter, opacity: cs.opacity,
      textTransform: cs.textTransform, display: cs.display, maxWidth: cs.maxWidth, minHeight: cs.minHeight,
      w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10, x: Math.round(r.left), y: Math.round(r.top + scrollY)
    };
  };
  const out = {};
  for (const [role, sel] of Object.entries(sels)) {
    try { const el = document.querySelector(sel); out[role] = el ? pick(el) : null; } catch (e) { out[role] = { error: String(e) }; }
  }
  return out;
}`;

// A real function object (Playwright serialises fn.toString()) so page.evaluate(measureFn, sels) works.
export const measureFn = new Function('return ' + MEASURE_SRC.trim())();
