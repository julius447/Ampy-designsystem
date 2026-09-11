// site/_probes/s4-parity.mjs
// Paritetsprobe S4: klonen (site/_probes/s4-harness.html) mot källan, getComputedStyle + getBoundingClientRect
// vid 1440 och 390, för fyra block: processteg (rot-gt d2), testimonial-kort (V1), CTA-band (main-cta B), header (website-blocks).
// Kör: node site/_probes/s4-parity.mjs [--md]   (--md skriver tabellen som markdown till stdout)
// Externa resurser (Google Fonts, ampy.se-bilder i källorna) blockeras så körningen är offline och deterministisk.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const md = process.argv.includes('--md');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  try { let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html'); res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp)); }
  catch { res.writeHead(404); res.end(); }
});
const port = 8700 + Math.floor(Math.random() * 200);
await new Promise(r => server.listen(port, r));
const HARNESS = 'site/_probes/s4-harness.html';

// [namn, källfil, källselektor, klonselektor]
const PAIRS = [
  ['processteg: steg', 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', '.av-step', '#h-avdrag .ampy-step'],
  ['processteg: ring', 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', '.av-step .av-n', '#h-avdrag .ampy-step__n'],
  ['processteg: h3', 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', '.av-step h3', '#h-avdrag .ampy-step__title'],
  ['processteg: text', 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', '.av-step p', '#h-avdrag .ampy-step__text'],
  ['processteg: caps', 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', '.av-steps-cap', '#h-avdrag .ampy-steps__cap'],
  ['testimonial: kort', 'kallor/Testimonials-block/delivery/preview.html', '.att-card', '#h-testimonial .ampy-testimonial'],
  ['testimonial: text', 'kallor/Testimonials-block/delivery/preview.html', '.att-card__text', '#h-testimonial .ampy-testimonial__text'],
  ['testimonial: namn', 'kallor/Testimonials-block/delivery/preview.html', '.att-card__name', '#h-testimonial .ampy-testimonial__name'],
  ['testimonial: rubrik', 'kallor/Testimonials-block/delivery/preview.html', '.att-heading', '#h-testimonial .ampy-slider__heading'],
  ['cta-band: kort', 'kallor/Main_CTA/delivery/preview.html', '.mcta__card', '#h-ctaband .ampy-ctaband__card'],
  ['cta-band: h2', 'kallor/Main_CTA/delivery/preview.html', '.mcta__h', '#h-ctaband .ampy-ctaband__h'],
  ['cta-band: text', 'kallor/Main_CTA/delivery/preview.html', '.mcta__p', '#h-ctaband .ampy-ctaband__p'],
  ['cta-band: ring-CTA', 'kallor/Main_CTA/delivery/preview.html', '.btn-ring', '#h-ctaband .ampy-btn--ring'],
  ['cta-band: porträtt', 'kallor/Main_CTA/delivery/preview.html', '.mcta__media .photo', '#h-ctaband .ampy-ctaband__photo'],
  ['header: bar', 'kallor/Website-blocks/Header/index.html', '.hdr', '#h-header .ampy-header'],
  ['header: nav-länk', 'kallor/Website-blocks/Header/index.html', '.nav__link', '#h-header .ampy-header__link'],
  ['header: CTA', 'kallor/Website-blocks/Header/index.html', '.cta', '#h-header .ampy-header__cta'],
  ['header: logo', 'kallor/Website-blocks/Header/index.html', '.hdr__logo img', '#h-header .ampy-header__logo img'],
];
const PROPS = ['height', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopLeftRadius', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'backgroundImage', 'boxShadow'];

const browser = await chromium.launch();
async function measure(file, sel, w) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1 });
  await page.route('**/*', r => { const u = r.request().url(); if (u.startsWith(`http://localhost:${port}`)) r.continue(); else r.abort(); });
  try { await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'load', timeout: 20000 }); } catch (e) { /* externa resurser kan blockeras */ }
  await page.waitForTimeout(600);
  const out = await page.evaluate(({ sel, props }) => {
    const el = document.querySelector(sel); if (!el) return null;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const o = { width: Math.round(r.width * 10) / 10, height: Math.round(r.height * 10) / 10 };
    for (const p of props) { if (p === 'width' || p === 'height') continue; let v = cs[p]; if (typeof v === 'string' && v.length > 70) v = v.slice(0, 70) + '…'; o[p] = v; }
    return o;
  }, { sel, props: PROPS });
  await page.close();
  return out;
}
const rows = [];
for (const [name, srcFile, srcSel, cloneSel] of PAIRS) {
  for (const w of [1440, 390]) {
    const a = await measure(srcFile, srcSel, w);
    const b = await measure(HARNESS, cloneSel, w);
    rows.push({ name, w, src: a, clone: b });
  }
}
await browser.close(); server.close();

const fmt = v => v == null ? '-' : String(v).replace(/px/g, '').replace(/rgb\((\d+), (\d+), (\d+)\)/g, (m, r, g, b) => '#' + [r, g, b].map(x => (+x).toString(16).padStart(2, '0')).join(''));
const KEY = ['height', 'width', 'paddingTop', 'paddingLeft', 'borderTopLeftRadius', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor'];
if (md) {
  console.log('| block | vp | mått | källa | klon | diff |');
  console.log('|---|---|---|---|---|---|');
  for (const r of rows) for (const k of KEY) {
    const a = r.src ? r.src[k] : null, b = r.clone ? r.clone[k] : null;
    const na = parseFloat(a), nb = parseFloat(b);
    const same = a === b || (Number.isFinite(na) && Number.isFinite(nb) && Math.abs(na - nb) < 0.6);
    const diff = same ? '' : (Number.isFinite(na) && Number.isFinite(nb) ? (nb - na).toFixed(1) : 'avviker');
    console.log(`| ${r.name} | ${r.w} | ${k} | ${fmt(a)} | ${fmt(b)} | ${diff} |`);
  }
} else {
  for (const r of rows) { console.log(`\n== ${r.name} @${r.w}`); for (const k of KEY) console.log(`  ${k.padEnd(20)} källa ${fmt(r.src?.[k]).padEnd(24)} klon ${fmt(r.clone?.[k])}`); }
}
