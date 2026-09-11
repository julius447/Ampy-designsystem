// S2 paritetsprobe: systemets komponent (site/komponenter/*.html, [data-probe]) mot sin kanoniska källa
// (kallor/<repo>/…) vid 1440 och 390. Mäter renderad höjd, padding, radie, typsnitt, färg, bakgrund,
// kant och skugga med getComputedStyle + getBoundingClientRect i Chromium.
// Kör: node site/_probes/s2-parity.mjs   ->  site/_probes/out/s2-parity.json + s2-parity.md
// Serverar repo-roten som tools/shot.mjs. Externa anrop (Google Fonts i några källor) blockeras så att
// körningen är offline-säker; typografiska mått läses ur CSS:en, inte ur fontfilen.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile, mkdir } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const port = 8600 + Math.floor(Math.random() * 300);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
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
const U = f => `http://localhost:${port}/${f}`;

// Källa: url + selektor, eller url + inject (element som bara finns i ett senare steg: skapas med källans klasser i rätt scope).
const EC = 'kallor/Elcentral-lead-magnet/preview/index.html';
const LED = 'kallor/Led-kalkylator/index.html';
const PAIRS = [
  { id: 'btn-primary', namn: 'Primär gradient-CTA', sida: 'knappar', src: { url: 'kallor/CTA-website/index.html', sel: '.btn-offert:not(.btn-offert--block)' } },
  { id: 'btn-ring', namn: 'Tel-ring', sida: 'knappar', src: { url: 'kallor/CTA-website/index.html', sel: '.btn-ring:not(.btn-ring--block)' } },
  { id: 'btn-solid', namn: 'Solid 48 (header-CTA)', sida: 'knappar', src: { url: 'kallor/Website-blocks/Header/index.html', sel: '.hdr .cta' } },
  { id: 'btn-ghost', namn: 'Ghost 48 (elcentral outline)', sida: 'knappar', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<button class="ampy-ec__cta-primary ampy-ec__cta-primary--outline" type="button">Fortsätt</button>' } } },
  { id: 'link', namn: 'Textlänk (elcentral cta-link)', sida: 'knappar', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<button class="ampy-ec__cta-link" type="button">Räkna ut din besparing</button>' } } },
  { id: 'eyebrow', namn: 'Eyebrow med streck', sida: 'text', src: { url: 'kallor/Energycalc/vB/index.html', sel: '.eyebrow' } },
  { id: 'tag', namn: 'Tagg (elcentral pill)', sida: 'text', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<span class="ampy-ec__pill" data-level="success">Låg risk</span>' } } },
  { id: 'stat-label', namn: 'Stat-trio etikett', sida: 'text', src: { url: LED, sel: '.ampy-calc__trio-label' } },
  { id: 'stat-value', namn: 'Stat-trio värde', sida: 'text', src: { url: LED, sel: '.ampy-calc__trio-value' } },
  { id: 'number', namn: 'Hero-siffra', sida: 'text', src: { url: LED, sel: '.ampy-calc__hero-value' } },
  { id: 'unit', namn: 'Hero-enhet', sida: 'text', src: { url: LED, sel: '.ampy-calc__hero-unit' } },
  { id: 'source', namn: 'Källrad', sida: 'text', src: { url: 'kallor/Elkollen/preview/hero.html', wait: '.ampy-bk', inject: { parent: '.ampy-bk', html: '<p class="ampy-bk__source-line">Källa: Elsäkerhetsverket, Elsäkerhetslagen (2016:732) och ELSÄK-FS 2022:1. Beskedet bygger på dina svar och ersätter inte en besiktning på plats.</p>' } } },
  { id: 'proof', namn: 'Proof-rad', sida: 'text', src: { url: 'kallor/Hero-1/index.html', sel: '.vb2__proof' } },
  { id: 'quote-text', namn: 'Citat, text', sida: 'text', src: { url: 'kallor/Testimonials-block/delivery/preview.html', sel: '.att-card__text', wait: '.att-card__text' } },
  { id: 'quote-name', namn: 'Citat, namn', sida: 'text', src: { url: 'kallor/Testimonials-block/delivery/preview.html', sel: '.att-card__name', wait: '.att-card__name' } },
  { id: 'list-li', namn: 'Bocklista, rad', sida: 'text', src: { url: EC, wait: '.ampy-ec__rail-bullet', sel: '.ampy-ec__rail-bullet' } },
  { id: 'step-h3', namn: 'Steg, H3', sida: 'text', src: { url: 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', sel: '.av-step h3' } },
  { id: 'price-amount', namn: 'Prisrad, belopp', sida: 'text', src: { url: 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', sel: '.av-r-total .av-amt' } },
  { id: 'card', namn: 'Ljust kort (eljour samtalskort)', sida: 'ytor', src: { url: 'kallor/Eljour-block/index.html', sel: '.eb__call' } },
  { id: 'card-dark', namn: 'Mörkt resultatkort (LED)', sida: 'ytor', src: { url: LED, sel: '.ampy-calc__card--surface' } },
  { id: 'card-glass', namn: 'Glaskort (thank-you)', sida: 'ytor', src: { url: 'kallor/Thank-you-Offer-accepted/v1/index.html', sel: '.card' } },
  { id: 'frame', namn: 'Navy-ram (hero-1)', sida: 'ytor', src: { url: 'kallor/Hero-1/index.html', sel: '.vb2__frame' } },
  { id: 'label', namn: 'Fältetikett', sida: 'falt', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<label class="ampy-ec__lead-label">E-post</label>' } } },
  { id: 'input', namn: 'Input (elcentral lead-input)', sida: 'falt', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<input class="ampy-ec__lead-input" type="email" placeholder="namn@exempel.se">' } } },
  { id: 'select', namn: 'Select (LED)', sida: 'falt', src: { url: LED, sel: '.ampy-calc__select' } },
  { id: 'textarea', namn: 'Textarea (main-form)', sida: 'falt', src: { url: 'kallor/Ampy-main-form/index.html', sel: '.mf-textarea' } },
  { id: 'check', namn: 'Checkbox (LED ritad)', sida: 'falt', src: { url: LED, sel: '.ampy-calc__lead-consent input', computedOnly: true } },
  { id: 'chip', namn: 'Radio-chip (elcentral option)', sida: 'falt', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<button class="ampy-ec__option" type="button"><span class="ampy-ec__option-body"><span class="ampy-ec__option-title">Nyare än 10 år</span><span class="ampy-ec__option-clarifier">Automatsäkringar och jordfelsbrytare</span></span></button>' } } },
  { id: 'chip-title', namn: 'Radio-chip, titel', sida: 'falt', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<button class="ampy-ec__option" type="button"><span class="ampy-ec__option-body"><span class="ampy-ec__option-title" data-inj>Nyare än 10 år</span></span></button>', sel: '[data-inj]' } } },
  { id: 'segment', namn: 'Segment, spår (LED)', sida: 'falt', src: { url: LED, sel: '.ampy-calc__segmented' } },
  { id: 'segment-option', namn: 'Segment, vald option', sida: 'falt', src: { url: LED, sel: '.ampy-calc__segmented-option[aria-pressed="true"]' } },
  { id: 'range', namn: 'Slider (LED spår + träffyta)', sida: 'falt', src: { url: LED, sel: '.ampy-calc__slider' } },
  { id: 'tick', namn: 'Slider, tick', sida: 'falt', src: { url: LED, sel: '.ampy-calc__slider-tick' } },
  { id: 'stepper-btn', namn: 'Stepper, knapp (energycalc)', sida: 'falt', src: { url: 'kallor/Energycalc/vB/index.html', sel: '.stepbtn' } },
  { id: 'stepper-value', namn: 'Stepper, värde', sida: 'falt', src: { url: 'kallor/Energycalc/vB/index.html', sel: '.stepval' } },
  { id: 'help', namn: 'Hjälptext (LED hint)', sida: 'falt', src: { url: LED, sel: '.ampy-calc__field-hint' } },
  { id: 'error', namn: 'Felrad (elcentral lead-error)', sida: 'falt', src: { url: EC, wait: '.ampy-ec__cta-primary', inject: { parent: '.ampy-ec__block', html: '<p class="ampy-ec__lead-error">Fyll i alla fält.</p>' } } },
];

const PROPS = ['height', 'minHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopLeftRadius', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderTopColor', 'boxShadow', 'textTransform', 'gap'];

async function probe(page, target) {
  await page.goto(U(target.url), { waitUntil: 'domcontentloaded' });
  if (target.wait) { try { await page.waitForSelector(target.wait, { timeout: 8000 }); } catch { /* fortsätt: elementet saknas */ } }
  await page.waitForTimeout(400);
  return page.evaluate(({ target, PROPS }) => {
    let el = null;
    if (target.inject) {
      const parent = document.querySelector(target.inject.parent) || document.body;
      const wrap = document.createElement('div'); wrap.innerHTML = target.inject.html; parent.appendChild(wrap);
      el = target.inject.sel ? wrap.querySelector(target.inject.sel) : wrap.firstElementChild;
    } else el = document.querySelector(target.sel);
    if (!el) return { missing: true };
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const o = { rectH: target.computedOnly ? null : Math.round(r.height * 10) / 10, rectW: target.computedOnly ? null : Math.round(r.width * 10) / 10 };
    for (const p of PROPS) o[p] = cs[p];
    o.fontFamily = (o.fontFamily || '').split(',')[0].replace(/["']/g, '');
    o.backgroundImage = (o.backgroundImage || 'none').replace(/\s+/g, ' ').slice(0, 90);
    o.boxShadow = (o.boxShadow || 'none').replace(/\s+/g, ' ').slice(0, 120);
    return o;
  }, { target, PROPS });
}

const browser = await chromium.launch();
const out = { datum: new Date().toISOString().slice(0, 10), viewports: [1440, 390], par: [] };
for (const vp of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: vp, height: 1000 }, deviceScaleFactor: 1 });
  await ctx.route('**/*', route => { const u = route.request().url(); if (u.startsWith(`http://localhost:${port}/`)) route.continue(); else route.abort(); });
  const page = await ctx.newPage();
  for (const pair of PAIRS) {
    const src = await probe(page, { ...pair.src, computedOnly: pair.src.computedOnly });
    const sys = await probe(page, { url: `site/komponenter/${pair.sida}.html`, sel: `[data-probe="${pair.id}"]`, computedOnly: pair.src.computedOnly });
    let rec = out.par.find(x => x.id === pair.id);
    if (!rec) { rec = { id: pair.id, namn: pair.namn, sida: pair.sida, kalla: pair.src.url + (pair.src.sel ? ' ' + pair.src.sel : ' (injicerad ' + (pair.src.inject && pair.src.inject.html.match(/class="([^"]+)"/)[1].split(' ')[0]) + ')'), vid: {} }; out.par.push(rec); }
    rec.vid[vp] = { src, sys };
  }
  await ctx.close();
}
await browser.close(); server.close();

const px = v => (v == null ? '' : String(v).replace('px', ''));
const rows = [];
rows.push('# S2 paritet: systemet mot källan (1440 / 390)\n');
rows.push(`Mätt ${out.datum} i Chromium av \`site/_probes/s2-parity.mjs\`. Höjd = renderad höjd (getBoundingClientRect), övriga = getComputedStyle. Källorna körs offline (Google Fonts blockerade i tre källor), så typsnittskolumnen visar deklarerat typsnitt; radhöjder som beror på fontfil kan skilja någon pixel.\n`);
rows.push('| Komponent | Källa | Höjd 1440 (källa / system) | Höjd 390 | Padding 1440 (T R B L) | Radie 1440 / 390 | Typsnitt, storlek, vikt (källa vs system) | Färg | Bakgrund / kant | Skugga |');
rows.push('|---|---|---|---|---|---|---|---|---|---|');
for (const r of out.par) {
  const a = r.vid[1440], b = r.vid[390];
  const S = a.src, T = a.sys, S3 = b.src, T3 = b.sys;
  if (S.missing || T.missing) { rows.push(`| ${r.namn} | ${r.kalla} | ${S.missing ? 'källan saknas' : ''} ${T.missing ? 'systemet saknas' : ''} | | | | | | | |`); continue; }
  const pad = o => [o.paddingTop, o.paddingRight, o.paddingBottom, o.paddingLeft].map(px).join(' ');
  rows.push(`| ${r.namn} | \`${r.kalla}\` | ${px(S.rectH)} / ${px(T.rectH)} | ${px(S3.rectH)} / ${px(T3.rectH)} | ${pad(S)} / ${pad(T)} | ${px(S.borderTopLeftRadius)} / ${px(T.borderTopLeftRadius)} ; ${px(S3.borderTopLeftRadius)} / ${px(T3.borderTopLeftRadius)} | ${S.fontFamily} ${px(S.fontSize)} ${S.fontWeight} vs ${T.fontFamily} ${px(T.fontSize)} ${T.fontWeight} (390: ${px(S3.fontSize)} vs ${px(T3.fontSize)}) | ${S.color} vs ${T.color} | ${S.backgroundColor} ${S.backgroundImage !== 'none' ? 'grad' : ''} ${px(S.borderTopWidth)} ${S.borderTopColor} vs ${T.backgroundColor} ${T.backgroundImage !== 'none' ? 'grad' : ''} ${px(T.borderTopWidth)} ${T.borderTopColor} | ${S.boxShadow === 'none' ? 'ingen' : 'ja'} vs ${T.boxShadow === 'none' ? 'ingen' : 'ja'} |`);
}
await mkdir(join(root, 'site/_probes/out'), { recursive: true });
await writeFile(join(root, 'site/_probes/out/s2-parity.json'), JSON.stringify(out, null, 1));
await writeFile(join(root, 'site/_probes/out/s2-parity.md'), rows.join('\n') + '\n');
console.log(rows.join('\n'));
