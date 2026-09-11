// Tangentbordsprobe (mobil 390): Meny-knappen i tabbordning, öppnar/stänger, Escape, fokus in i stängd off-canvas-nav?,
// details/summary fokuserbara, kopiera-knappar fokuserbara + fungerar (clipboard-stub), fokusring synlig (outline).
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => { try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); } catch { res.writeHead(404); res.end(); } });
const port = 9100 + Math.floor(Math.random() * 90); await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();
const out = {};
for (const rel of ['site/index.html', 'site/komponenter/knappar.html', 'site/grunder/rorelse.html', 'site/komponenter/verktyg.html']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
  const r = {};
  // 1) Tab-ordning från start: vad får fokus först, andra, tredje?
  const seq = [];
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => { const a = document.activeElement; const rect = a.getBoundingClientRect(); return `${a.tagName.toLowerCase()}${a.className ? '.' + String(a.className).split(' ')[0] : ''} "${(a.textContent || '').trim().slice(0, 24)}" x=${Math.round(rect.x)} synlig=${rect.x + rect.width > 0 && rect.x < 390}`; })); }
  r.tabSequence = seq;
  // 2) Fokus hamnar i stängd sidonav? (translateX(-100%) = utanför skärmen men fokuserbar)
  r.focusInsideClosedNav = await page.evaluate(() => { const links = [...document.querySelectorAll('.ds-side a')]; links[2].focus(); const a = document.activeElement; const side = document.querySelector('.ds-side'); const cs = getComputedStyle(side); return { focused: a === links[2], sideVisibility: cs.visibility, sideTransform: cs.transform, inert: side.hasAttribute('inert'), ariaHidden: side.getAttribute('aria-hidden') }; });
  // 3) Meny-knappen: klick öppnar, aria-expanded, Escape stänger
  const btn = page.locator('[data-ds-nav-toggle]');
  r.menuVisible = await btn.isVisible();
  await btn.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  r.afterEnter = await page.evaluate(() => ({ expanded: document.querySelector('[data-ds-nav-toggle]').getAttribute('aria-expanded'), open: document.querySelector('.ds-side').classList.contains('is-open'), transform: getComputedStyle(document.querySelector('.ds-side')).transform, hasCloseBtn: !!document.querySelector('.ds-side [data-ds-nav-close], .ds-side button'), focusMovedIntoNav: document.querySelector('.ds-side').contains(document.activeElement), bodyScrollLocked: getComputedStyle(document.body).overflow === 'hidden', backdrop: !!document.querySelector('.ds-backdrop, [data-ds-backdrop]') }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  r.afterEscape = await page.evaluate(() => ({ expanded: document.querySelector('[data-ds-nav-toggle]').getAttribute('aria-expanded'), open: document.querySelector('.ds-side').classList.contains('is-open'), focusOnBtn: document.activeElement === document.querySelector('[data-ds-nav-toggle]') }));
  // 4) details/summary
  r.details = await page.evaluate(() => { const d = [...document.querySelectorAll('details')]; return { count: d.length, summaryFocusable: d.slice(0, 3).map(x => { const s = x.querySelector('summary'); if (!s) return 'ingen summary'; s.focus(); return document.activeElement === s; }) }; });
  // 5) kopiera-knappar
  r.copy = await page.evaluate(() => { const b = [...document.querySelectorAll('.ds-code__copy')]; if (!b.length) return { count: 0 }; b[0].focus(); const focusable = document.activeElement === b[0]; const cs = getComputedStyle(b[0]); return { count: b.length, focusable, tabindex: b[0].tabIndex, minHeight: b[0].getBoundingClientRect().height, fontSize: cs.fontSize }; });
  // 6) fokusring synlig på en länk i innehållet (outline när :focus-visible)
  r.focusRing = await page.evaluate(() => { const a = document.querySelector('.ds-main a.ds-a, .ds-main a'); if (!a) return null; a.focus(); const cs = getComputedStyle(a); return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor }; });
  // 7) touch targets: knappar/länkar < 44 px höga i .ds-main
  r.smallTargets = await page.evaluate(() => { const els = [...document.querySelectorAll('.ds-main a, .ds-main button')]; const small = els.filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.height < 32; }); return { total: els.length, under32: small.length, sample: small.slice(0, 5).map(e => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${Math.round(e.getBoundingClientRect().height)}px "${(e.textContent || '').trim().slice(0, 20)}"`) }; });
  out[rel] = r; console.log(rel, JSON.stringify(r, null, 1));
  await page.close();
}
await browser.close(); server.close();
await writeFile(join(root, 'site/_review/out/tangentbord.json'), JSON.stringify(out, null, 1));
