// site/_probes/typo-matt.mjs
// Mäter rollskalan på site/grunder/typografi.html i Chromium vid 390 / 768 / 1440 (getComputedStyle på
// [data-role]-elementen), skriver site/_probes/out/typo-matt.json och fyller tabellen "Uppmätt på den här
// sidan". Fyller också H2-matrisen och frekvenstabellen ur konsolidering/typografi.json.
// Kör: node site/_probes/typo-matt.mjs   (idempotent)
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile, mkdir } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pagePath = resolve(root, 'site/grunder/typografi.html');
const typografi = JSON.parse(await readFile(resolve(root, 'konsolidering/typografi.json'), 'utf8'));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end(); }
});
const port = 8400 + Math.floor(Math.random() * 300);
await new Promise(r => server.listen(port, r));

const kanon = Object.fromEntries(typografi.roller.map(r => [r.roll, r]));
const browser = await chromium.launch();
const out = { metod: 'Chromium (Playwright), getComputedStyle på [data-role] i site/grunder/typografi.html; Outfit self-hostad från system/fonts', viewports: {} };
for (const w of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(`http://localhost:${port}/site/grunder/typografi.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  out.viewports[w] = await page.evaluate(() => {
    const r = {};
    for (const el of document.querySelectorAll('[data-role]')) {
      const cs = getComputedStyle(el);
      r[el.dataset.role] = { fontSize: +parseFloat(cs.fontSize).toFixed(2), fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, fontFamily: cs.fontFamily.split(',')[0].replace(/"/g, ''), lhRatio: +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2) };
    }
    return r;
  });
  await page.close();
}
await browser.close(); server.close();
await mkdir(resolve(root, 'site/_probes/out'), { recursive: true });
await writeFile(resolve(root, 'site/_probes/out/typo-matt.json'), JSON.stringify(out, null, 1));

const sv = n => String(n).replace('.', ',');
const esc = s => String(s).replace(/\s*—\s*/g, ': ').replace(/\s*–\s*/g, ' till ').replace(/\s*·\s*/g, ', ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const roles = ['display', 'h1', 'h2', 'h3', 'lead', 'body', 'small', 'eyebrow', 'number', 'label', 'button'];
const label = { display: 'Display', h1: 'H1', h2: 'H2', h3: 'H3', lead: 'Lead', body: 'Body', small: 'Small', eyebrow: 'Eyebrow', number: 'Siffra', label: 'Label', button: 'Knapp' };
let rows = '';
for (const role of roles) {
  const k = kanon[role];
  const m = w => out.viewports[w][role];
  const hit = (w, target) => Math.abs(m(w).fontSize - target) <= 0.1 ? 'is-hit' : 'is-miss';
  const ls = m(1440).letterSpacing === 'normal' ? 'normal' : sv((parseFloat(m(1440).letterSpacing) / m(1440).fontSize).toFixed(3)) + 'em';
  rows += `<tr><td>${label[role]}</td><td class="${hit(390, k.px_390)}">${sv(m(390).fontSize)}</td><td class="${hit(768, k.px_768)}">${sv(m(768).fontSize)}</td><td class="${hit(1440, k.px_1440)}">${sv(m(1440).fontSize)}</td><td>${m(1440).fontWeight}</td><td>${sv(m(1440).lhRatio)}</td><td>${ls}</td><td>${sv(k.px_390)} / ${sv(k.px_768)} / ${sv(k.px_1440)}</td></tr>\n`;
}

// H2-matrisen: alla källor som har en h2-rad
let h2 = '';
for (const [kalla, roller] of Object.entries(typografi.matris_kalla_x_roll)) {
  for (const r of roller.h2 || []) {
    const auk = { 'article-template': 2, 'booking-confirmation': 2, 'offer-accepted': 3, certificates: 2, 'cta-website': 1, 'elcentral-kollen': 1, 'eljour-block': 1, elkollen: 1, energycalc: 1, 'ev-kalkylator': 1, 'footer-cro': 1, 'hero-1': 1, 'led-kalkylator': 1, 'live-ampy-se': 1, 'rot-gt-cro': 1, 'testimonials-block': 1, 'website-blocks': 1, 'fore-efter-cro': 2, fotobedomningen: 2, 'hero-2-alternatives': 2, 'hero-2-form': 2, 'main-cta': 2, 'main-form': 2, 'mini-menu': 2, 'thank-you': 2, 'visste-du-att': 2, 'battery-calculator': 3, picasso: 3, 'var-process-cro': 3 }[kalla] ?? '';
    h2 += `<tr><td class="ds-nowrap">${esc(kalla)} (${auk})</td><td class="ds-nowrap">${esc(r.px_desktop)} / ${esc(r.px_mobil)}</td><td>${esc(r.weight)}</td><td>${esc(r.lh)}</td><td>${esc(r.ls)}</td><td>${esc(r.font)}</td><td>${esc(r.roll)}</td></tr>\n`;
  }
}

// Frekvens per roll (tre vanligaste per kolumn)
let fq = '';
const top = arr => (arr || []).slice(0, 3).map(([v, n]) => `${esc(v === 'None' ? 'ej angivet' : v)} (${n})`).join(', ');
for (const role of roles) {
  const f = typografi.frekvens[role];
  if (!f) continue;
  fq += `<tr><td>${label[role]}</td><td>${top(f.vikt)}</td><td>${top(f.lh)}</td><td>${top(f.px1440)}</td><td>${top(f.ls)}</td></tr>\n`;
}

let page = await readFile(pagePath, 'utf8');
const fill = (id, frag) => { const re = new RegExp(`(<!--@${id}:start-->)[\\s\\S]*?(<!--@${id}:end-->)`); if (!re.test(page)) throw new Error('markör saknas: ' + id); page = page.replace(re, `$1\n${frag}$2`); };
fill('typomatt', rows); fill('h2matris', h2); fill('frekvens', fq);
await writeFile(pagePath, page);
console.log(JSON.stringify({ roller: roles.length, h2rader: (h2.match(/<tr>/g) || []).length, px1440: Object.fromEntries(roles.map(r => [r, out.viewports[1440][r].fontSize])), px390: Object.fromEntries(roles.map(r => [r, out.viewports[390][r].fontSize])) }));
