// site/_probes/s3-parity.mjs (S3)
// Paritetsprobe: kitet (site/komponenter/verktyg.html + diagnostik.html) mot källorna vid 1440 och 390.
// 1) Lyfter ut sidans egna exempel (#calc-default, #diag-entry, #diag-q, #diag-gron, #diag-akut, #diag-board-rod)
//    till en harness i site/_probes/out/ med samma 1280-ram som källorna (LED container / elcentral shell).
// 2) Mäter getBoundingClientRect + getComputedStyle i Chromium (Playwright) vid 1440x1000 och 390x844.
// 3) Källvärden = inventeringens mätningar (inventering/_probes/*.measure.json, samma metod, fonter laddade).
// Skriver site/_probes/out/s3-parity.json (+ .md). Kör sedan node site/_probes/s3-build.mjs så att tabellerna hamnar på sidorna.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile, mkdir } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = resolve(root, 'site/_probes/out');
await mkdir(outDir, { recursive: true });
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let fp = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp));
  } catch { res.writeHead(404); res.end(); }
});
const port = 8600 + Math.floor(Math.random() * 300);
await new Promise(r => server.listen(port, r));
const browser = await chromium.launch();

/* ---------- 1) harness ur sidornas exempel ---------- */
async function extract(file, ids) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
  const html = await page.evaluate(ids => ids.map(id => document.getElementById(id)?.outerHTML || ''), ids);
  await page.close();
  return html.map(h => h.replace(/\.\.\/\.\.\/system\//g, '../../../system/').replace(/ ampy-(calc|diag)--flush/g, ''));
}
const harness = (title, body) => `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="../../../system/ampy.css"><style>body{margin:0;background:#f5f9ff}.ampy-diag--solo{margin-inline:auto}</style></head>
<body class="ampy">${body}</body></html>`;
const [calcDefault] = await extract('site/komponenter/verktyg.html', ['calc-default']);
const [diagEntry, diagQ, diagGron, diagAkut, diagRod] = await extract('site/komponenter/diagnostik.html', ['diag-entry', 'diag-q', 'diag-gron', 'diag-akut', 'diag-board-rod']);
await writeFile(resolve(outDir, 's3-harness-calc.html'), harness('S3 harness: kalkylator', calcDefault));
await writeFile(resolve(outDir, 's3-harness-diag-entry.html'), harness('S3 harness: diagnostik start', diagEntry));
await writeFile(resolve(outDir, 's3-harness-diag-q.html'), harness('S3 harness: diagnostik fråga', diagQ));
await writeFile(resolve(outDir, 's3-harness-diag-verdict.html'), harness('S3 harness: diagnostik besked', diagGron + diagAkut + diagRod));

/* ---------- 2) mätning ---------- */
const num = v => (v === null || v === undefined) ? null : Math.round(parseFloat(v) * 10) / 10;
async function measure(file, spec) {
  const out = {};
  for (const [vp, w, h] of [['1440', 1440, 1000], ['390', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    out[vp] = await page.evaluate(spec => {
      const r = {};
      for (const [key, sel, prop, pseudo] of spec) {
        const el = document.querySelector(sel);
        if (!el) { r[key] = null; continue; }
        if (prop === 'w' || prop === 'h') { const b = el.getBoundingClientRect(); r[key] = prop === 'w' ? b.width : b.height; continue; }
        if (prop.startsWith('--')) { r[key] = getComputedStyle(el).getPropertyValue(prop).trim(); continue; }   /* pseudo-element ::-webkit-slider-thumb går inte att läsa via API (samma begränsning i inventeringen): läs falt.css custom properties */
        const cs = getComputedStyle(el, pseudo || null);
        r[key] = cs[prop];
      }
      r._errors = [];
      return r;
    }, spec);
    out[vp]._errors = errors;
    out[vp]._overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.close();
  }
  return out;
}

const calcSpec = [
  ['input-w', '#calc-default .ampy-calc__input', 'w'], ['input-h', '#calc-default .ampy-calc__input', 'h'],
  ['result-w', '#calc-default .ampy-calc__result', 'w'], ['result-h', '#calc-default .ampy-calc__result', 'h'],
  ['input-pad', '#calc-default .ampy-calc__input', 'paddingTop'], ['input-radius', '#calc-default .ampy-calc__input', 'borderTopLeftRadius'],
  ['result-pad', '#calc-default .ampy-calc__result', 'paddingTop'],
  ['title-fs', '#calc-default .ampy-calc__title', 'fontSize'],
  ['hero-fs', '#calc-default .ampy-number', 'fontSize'], ['hero-lh', '#calc-default .ampy-number', 'lineHeight'],
  ['unit-fs', '#calc-default .ampy-readout__unit', 'fontSize'],
  ['trio-fs', '#calc-default .ampy-stat__value', 'fontSize'],
  ['track-h', '#calc-default .ampy-calc__compare-track', 'h'], ['bar-h', '#calc-default .ampy-calc__compare-bar', 'h'], ['key-w', '#calc-default .ampy-calc__compare-key', 'w'],
  ['segment-h', '#calc-default .ampy-segment', 'h'], ['segopt-h', '#calc-default .ampy-segment__option', 'h'],
  ['thumb-w', '#calc-default .ampy-range', '--_thumb'], ['track-range-h', '#calc-default .ampy-range', '--_track-h'],
  ['select-h', '#calc-default .ampy-select', 'h'],
  ['selector-h', '#calc-default .ampy-calc__selector-btn', 'h'], ['selector-img', '#calc-default .ampy-calc__selector-img', 'w'],
  ['tip-w', '#calc-default .ampy-calc__tip', 'w'],
  ['cta-h', '#calc-default .ampy-calc__cta', 'h'], ['cta-radius', '#calc-default .ampy-calc__cta', 'borderTopLeftRadius'],
  ['method-h', '#calc-default .ampy-calc__method', 'h'],
  ['tick-h', '#calc-default .ampy-range__tick', 'h'],
];
const diagSpec = (pfx) => [
  ['rail-w', `${pfx} .ampy-diag__rail`, 'w'], ['stage-w', `${pfx} .ampy-diag__stage`, 'w'],
  ['card-w', `${pfx} .ampy-diag__card`, 'w'], ['card-h', `${pfx} .ampy-diag__card`, 'h'],
  ['card-pad', `${pfx} .ampy-diag__card`, 'paddingLeft'], ['card-radius', `${pfx} .ampy-diag__card`, 'borderTopLeftRadius'],
  ['title-fs', `${pfx} .ampy-diag__rail-title`, 'fontSize'], ['lead-fs', `${pfx} .ampy-diag__rail-lead`, 'fontSize'],
  ['railbtn-h', `${pfx} .ampy-diag__rail-actions .ampy-btn`, 'h'], ['railbtn-w', `${pfx} .ampy-diag__rail-actions .ampy-btn`, 'w'],
  ['startcta-h', `${pfx} .ampy-diag__start-cta`, 'h'], ['startcta-w', `${pfx} .ampy-diag__start-cta`, 'w'],
  ['starttitle-fs', `${pfx} .ampy-diag__start-title`, 'fontSize'], ['illu-w', `${pfx} .ampy-diag__start-illu`, 'w'],
  ['q-fs', `${pfx} .ampy-diag__q`, 'fontSize'], ['chip-h', `${pfx} .ampy-chip`, 'h'], ['chip-fs', `${pfx} .ampy-chip__title`, 'fontSize'], ['chip-radius', `${pfx} .ampy-chip`, 'borderTopLeftRadius'],
  ['step-cur-w', `${pfx} .ampy-diag__step.is-current`, 'w'], ['step-h', `${pfx} .ampy-diag__step`, 'h'],
  ['dual-w', `${pfx} .ampy-diag__dual`, 'w'], ['dual-h', `${pfx} .ampy-diag__dual`, 'h'], ['accent-w', `${pfx} .ampy-diag__dual-accent`, 'w'],
  ['pill-h', `${pfx} .ampy-diag__dual .ampy-tag`, 'h'], ['pill-fs', `${pfx} .ampy-diag__dual .ampy-tag`, 'fontSize'],
  ['lede-fs', `${pfx} .ampy-diag__lede`, 'fontSize'], ['finding-fs', `${pfx} .ampy-diag__finding-label`, 'fontSize'], ['finding-icon', `${pfx} .ampy-diag__finding-icon svg`, 'w'],
  ['cta-h', `${pfx} .ampy-diag__cta-zone .ampy-btn`, 'h'],
  ['akut-h', `${pfx} .ampy-diag__akut`, 'h'],
  ['board-h', `${pfx} .ampy-diag__board`, 'h'], ['board-fs', `${pfx} .ampy-diag__board`, 'fontSize'], ['board-w', `${pfx} .ampy-diag__board`, 'w'],
  ['tabs-h', `${pfx} .ampy-diag__tabs`, 'h'], ['summary-fs', `${pfx} .ampy-diag__summary`, 'fontSize'], ['row-fs', `${pfx} .ampy-diag__row p`, 'fontSize'],
];
const kitCalc = await measure('site/_probes/out/s3-harness-calc.html', calcSpec);
const kitEntry = await measure('site/_probes/out/s3-harness-diag-entry.html', diagSpec('#diag-entry'));
const kitQ = await measure('site/_probes/out/s3-harness-diag-q.html', diagSpec('#diag-q'));
const kitGron = await measure('site/_probes/out/s3-harness-diag-verdict.html', diagSpec('#diag-gron'));
const kitAkut = await measure('site/_probes/out/s3-harness-diag-verdict.html', diagSpec('#diag-akut'));
const kitRod = await measure('site/_probes/out/s3-harness-diag-verdict.html', diagSpec('#diag-board-rod'));
await browser.close(); server.close();

/* ---------- 3) källvärden ur inventeringen ---------- */
const J = async f => JSON.parse(await readFile(resolve(root, 'inventering/_probes', f), 'utf8'));
const led = await J('led-kalkylator.measure.json');
const ec = await J('elcentral-kollen.measure.json');
const ecV = await J('elcentral-verdict.measure.json');
const ecA = await J('elcentral-akut.measure.json');
const bkR = await J('elkollen-rod.measure.json');
const vp = { '1440': 'desktop', '390': 'mobile' };
const role = (j, v, r) => j.viewports[vp[v]].roles?.[r] || null;
const st = (j, v, s, r) => j.viewports[vp[v]].states?.[s]?.roles?.[r] || j.viewports[vp[v]].states?.[s]?.[r] || null;
const rect = (o, k) => o?.rect ? num(o.rect[k]) : null;
const px = v => v === null || v === undefined ? null : num(String(v).split(' ')[0]);

const S = {};
for (const v of ['1440', '390']) {
  S[v] = {
    'input-w': rect(role(led, v, 'card-input'), 'w'), 'input-h': rect(role(led, v, 'card-input'), 'h'),
    'result-w': rect(role(led, v, 'card-surface'), 'w'), 'result-h': rect(role(led, v, 'card-surface'), 'h'),
    'input-pad': px(role(led, v, 'card-input')?.padding), 'input-radius': px(role(led, v, 'card-input')?.borderRadius),
    'result-pad': px(role(led, v, 'card-surface')?.padding),
    'title-fs': px(role(led, v, 'h1')?.fontSize),
    'hero-fs': px(role(led, v, 'hero-number')?.fontSize), 'hero-lh': px(role(led, v, 'hero-number')?.lineHeight),
    'unit-fs': px(role(led, v, 'hero-unit')?.fontSize), 'trio-fs': px(role(led, v, 'trio-value')?.fontSize),
    'track-h': rect(role(led, v, 'compare-track'), 'h'), 'bar-h': rect(role(led, v, 'compare-bar-now'), 'h'), 'key-w': rect(role(led, v, 'compare-key-now'), 'w'),
    'segment-h': rect(role(led, v, 'segmented'), 'h'), 'segopt-h': rect(role(led, v, 'segmented-option'), 'h'),
    'thumb-w': rect(role(led, v, 'slider-thumb'), 'w'), 'track-range-h': rect(role(led, v, 'slider-track'), 'h'),
    'select-h': rect(role(led, v, 'select'), 'h'),
    'selector-h': rect(role(led, v, 'selector-button'), 'h'), 'selector-img': rect(role(led, v, 'selector-img'), 'w'),
    'tip-w': rect(role(led, v, 'tip'), 'w'),
    'cta-h': rect(role(led, v, 'btn-primary-lg'), 'h'), 'cta-radius': px(role(led, v, 'btn-primary-lg')?.borderRadius),
    'method-h': rect(role(led, v, 'methodology'), 'h'), 'tick-h': rect(role(led, v, 'slider-tick'), 'h'),
    // diagnostik
    'rail-w': rect(role(ec, v, 'rail'), 'w'), 'stage-w': rect(role(ec, v, 'stage'), 'w'),
    'card-w': rect(role(ec, v, 'block-start'), 'w'), 'card-h': rect(role(ec, v, 'block-start'), 'h'),
    'card-pad': v === '1440' ? 32 : 20, 'card-radius': px(role(ec, v, 'block-start')?.borderRadius),
    'title-fs': px(role(ec, v, 'rail-heading')?.fontSize), 'lead-fs': px(role(ec, v, 'rail-lead')?.fontSize),
    'railbtn-h': rect(role(ec, v, 'rail-contact'), 'h'), 'railbtn-w': rect(role(ec, v, 'rail-contact'), 'w'),
    'startcta-h': rect(role(ec, v, 'start-cta'), 'h'), 'startcta-w': rect(role(ec, v, 'start-cta'), 'w'),
    'starttitle-fs': px(role(ec, v, 'start-heading')?.fontSize), 'illu-w': rect(role(ec, v, 'start-illu'), 'w'),
    'q-fs': px(st(ec, v, 'question-1', 'q-title')?.fontSize), 'chip-h': rect(st(ec, v, 'question-1', 'option'), 'h'), 'chip-fs': px(st(ec, v, 'question-1', 'option-title')?.fontSize), 'chip-radius': px(st(ec, v, 'question-1', 'option')?.borderRadius),
    'step-cur-w': rect(st(ec, v, 'question-1', 'step-current'), 'w'), 'step-h': rect(st(ec, v, 'question-1', 'step-current'), 'h'),
    'dual-w': rect(role(ecV, v, 'dualstatus'), 'w'), 'dual-h': rect(role(ecV, v, 'dualstatus'), 'h'), 'accent-w': rect(role(ecV, v, 'dualstatus-accent'), 'w'),
    'pill-h': rect(role(ecV, v, 'pill-success'), 'h'), 'pill-fs': px(role(ecV, v, 'pill-success')?.fontSize),
    'lede-fs': px(role(ecV, v, 'result-lede')?.fontSize), 'finding-fs': px(role(ecV, v, 'finding-label')?.fontSize), 'finding-icon': rect(role(ecV, v, 'finding-icon-ok'), 'w'),
    'cta-h-diag': rect(role(ecV, v, 'cta-solid'), 'h'),
    'akut-h': rect(role(ecA, v, 'akut'), 'h'),
    'board-h': rect(role(bkR, v, 'badge'), 'h'), 'board-fs': px(role(bkR, v, 'badge')?.fontSize), 'board-w': rect(role(bkR, v, 'badge'), 'w'),
    'tabs-h': rect(role(bkR, v, 'tabs'), 'h'), 'summary-fs': px(role(bkR, v, 'summary')?.fontSize), 'row-fs': px(role(bkR, v, 'row-text')?.fontSize),
    'dual-w-akut': rect(role(ecA, v, 'dualstatus'), 'w'), 'dual-h-akut': rect(role(ecA, v, 'dualstatus'), 'h'),
  };
}
// LED-källans h1 fontSize ligger under 'h1' (kitet: title-fs), diagnostikens under rail-heading: dela upp
const ledTitle = { '1440': px(role(led, '1440', 'h1')?.fontSize), '390': px(role(led, '390', 'h1')?.fontSize) };

const row = (label, key, kit, tol = 1, note = '', srcKey = key, srcOverride = null) => ({
  label, key, tol, note,
  source: { '1440': srcOverride ? srcOverride['1440'] : S['1440'][srcKey], '390': srcOverride ? srcOverride['390'] : S['390'][srcKey] },
  kit: { '1440': num(kit['1440'][key]), '390': num(kit['390'][key]) },
});
const K = kitCalc;
const calcRows = [
  row('Inputkort bredd', 'input-w', K, 2, 'grid 5fr/7fr med gap 19,8 (LED 20)'),
  row('Resultatkort bredd', 'result-w', K, 2),
  row('Inputkort höjd', 'input-h', K, 40, 'Outfit i st.f. PJS/mono, eyebrows 12 i st.f. 15, ticks 32; innehållsberoende'),
  row('Resultatkort höjd', 'result-h', K, 40, 'CTA 58 i st.f. 50, padding 39,6/16,9 i st.f. 40/20'),
  row('Inputkort padding', 'input-pad', K, 1, '--ampy-space-s (LED 20 / 15)'),
  row('Inputkort radie', 'input-radius', K, 1, '--ampy-radius-card 20 -> 16,3 (LED 20 fast)'),
  row('Resultatkort padding', 'result-pad', K, 1, '--ampy-space-l 39,6 / m 16,9 (LED 40 / 20)'),
  row('Rubrik (px)', 'title-fs', K, 1, 'h2-rollen 36/26,8 (LED PJS 34/24)', 'title-fs', ledTitle),
  row('Hjältesiffra (px)', 'hero-fs', K, 0.5, '--ampy-text-number = LED:s clamp'),
  row('Hjältesiffra radhöjd', 'hero-lh', K, 0.5),
  row('Enhet (px)', 'unit-fs', K, 0.5, 'kit-egen --_mid = LED --fs-xl'),
  row('Trio-värde (px)', 'trio-fs', K, 0.5, 'text.css --_mid'),
  row('Stapelspår höjd', 'track-h', K, 0.5, 'signaturen: 24'),
  row('Stapel höjd', 'bar-h', K, 0.5),
  row('Stapelnyckel bredd', 'key-w', K, 1, '60 / 50 (mobil: auto med min 50)'),
  row('Segment spår höjd', 'segment-h', K, 0.5, 'falt.css'),
  row('Segment option höjd', 'segopt-h', K, 0.5, 'falt.css'),
  row('Reglage tumme', 'thumb-w', K, 0.5, 'falt.css --_thumb (pseudo-elementet kan inte mätas via API, källan mättes som DOM-element)'),
  row('Reglage spår höjd', 'track-range-h', K, 0.5, 'falt.css --_track-h'),
  row('Select höjd', 'select-h', K, 0.5, 'falt.css'),
  row('Väljare höjd', 'selector-h', K, 1),
  row('Väljare ikonruta', 'selector-img', K, 0.5),
  row('Tips-chip', 'tip-w', K, 0.5),
  row('Tick-etikett höjd', 'tick-h', K, 0.5, 'falt.css'),
  row('CTA höjd', 'cta-h', K, 0.5, '.ampy-btn 58 (LED 50): B4/B6, avsiktlig'),
  row('CTA radie', 'cta-radius', K, 0.5, '16 (LED 12): B4, avsiktlig'),
  row('Metodkort höjd (stängd)', 'method-h', K, 4, 'summary 18/600 med 44 px träffyta (LED 19/600)'),
];
const diagRows = [
  row('Rail bredd', 'rail-w', kitEntry, 2, '44fr/56fr gap 64 i 1280-skalet'),
  row('Stage bredd', 'stage-w', kitEntry, 2),
  row('Startkort bredd', 'card-w', kitEntry, 2),
  row('Startkort höjd', 'card-h', kitEntry, 1, 'min-höjd 560 / 600'),
  row('Kort padding', 'card-pad', kitEntry, 1, '--ampy-space-card 28 / 16,9 (källan 32 / 20)'),
  row('Kort radie', 'card-radius', kitEntry, 1, '--ampy-radius-card 20 / 16,3 (källan 14): avsiktlig'),
  row('Rail-H1 (px)', 'title-fs', kitEntry, 1, 'h1-rollen 48 / 31,3 (källan PJS 44 / 32)'),
  row('Rail-lead (px)', 'lead-fs', kitEntry, 1, 'lead-rollen 22 / 17 (källan 20 / 18)'),
  row('Rail-CTA höjd', 'railbtn-h', kitEntry, 1, '.ampy-btn 58 (mobil 60)'),
  row('Rail-CTA bredd', 'railbtn-w', kitEntry, 2, 'två lika breda, gap 19,8 (källan 20)'),
  row('Start-CTA höjd', 'startcta-h', kitEntry, 0.5, '.ampy-btn--compact 48'),
  row('Start-CTA bredd', 'startcta-w', kitEntry, 1, 'max 320'),
  row('Startrubrik (px)', 'starttitle-fs', kitEntry, 1, 'h2-rollen 36 / 26,8 (källan 36 / 20,9)'),
  row('Illustration', 'illu-w', kitEntry, 0.5, 'kit-egen --_illu 120 (källan 120 / 110)'),
  row('Frågetitel (px)', 'q-fs', kitQ, 0.5, 'kit-egen clamp 32 -> 20'),
  row('Chip höjd', 'chip-h', kitQ, 0.5, 'falt.css 64 / 56'),
  row('Chip titel (px)', 'chip-fs', kitQ, 1.5, 'falt.css body 18 / small 14,1 (källan 18 / 15)'),
  row('Chip radie', 'chip-radius', kitQ, 1, 'falt.css --ampy-radius-field 12 / 10,1 (källan 10)'),
  row('Förloppsprick aktiv bredd', 'step-cur-w', kitQ, 0.5),
  row('Förloppsprick höjd', 'step-h', kitQ, 0.5),
  row('Dualstatus bredd (GRÖN)', 'dual-w', kitGron, 2, 'fit-content min 420 (>= 600 containerbredd) / full bredd'),
  row('Dualstatus höjd (GRÖN)', 'dual-h', kitGron, 3, 'padding 18/16, pills 18 (mobil 14)'),
  row('Accentstapel', 'accent-w', kitGron, 0.5),
  row('Pill höjd', 'pill-h', kitGron, 1.5, 'text.css .ampy-tag--lg (källan 37,6 / 28,8)'),
  row('Pill text (px)', 'pill-fs', kitGron, 0.5, 'text.css 18 / 14,1 (källan 18 / 14)'),
  row('Lede (px)', 'lede-fs', kitGron, 0.5, 'body-rollen 18 / 16,1 (källan 18 / 16)'),
  row('Fynd-etikett (px)', 'finding-fs', kitGron, 1.5, 'body 18 / 16,1 (källan 18 / 15)'),
  row('Fynd-ikon', 'finding-icon', kitGron, 0.5, '20 (källan 20 / 18)'),
  row('Kortets CTA höjd', 'cta-h', kitGron, 0.5, '.ampy-btn--compact 48', 'cta-h-diag'),
  row('Akut-ruta höjd', 'akut-h', kitAkut, 8, 'text 16 / 14,1 (källan 15 / 13); radbrytning'),
  row('Dualstatus bredd (GUL)', 'dual-w', kitAkut, 2, '', 'dual-w-akut'),
  row('Board höjd (RÖD, elkollen)', 'board-h', kitRod, 1.5, 'h3-rollen 22 / 20,1 (källan 22 / 18)'),
  row('Board text (px)', 'board-fs', kitRod, 0.5, '(källan 22 / 18)'),
  row('Board bredd', 'board-w', kitRod, 12, 'Outfit i st.f. Outfit 700 (samma), padding 14/19,8 (källan 14 18 / 12 16)'),
  row('Tabbar höjd', 'tabs-h', kitRod, 0.5, '44'),
  row('Sammanfattning (px)', 'summary-fs', kitRod, 1.5, 'body 18 / 16,1 (källan 17 / 16)'),
  row('Rad ✓/✗ (px)', 'row-fs', kitRod, 2, 'body 18 / 16,1 (källan 16 / 15)'),
];
const when = new Date().toISOString().slice(0, 16).replace('T', ' ');
const result = {
  when, tolerance: 1,
  calc: { sourceNote: 'inventering/_probes/led-kalkylator.measure.json (Chromium 1440x1000 / 390x844, Google Fonts laddade)', harness: 'site/_probes/out/s3-harness-calc.html: .ampy-calc utan --flush = 1280 + padding 19,8/14, som LED:s container', rows: calcRows, errors: { '1440': K['1440']._errors, '390': K['390']._errors }, overflowX: { '1440': K['1440']._overflowX, '390': K['390']._overflowX } },
  diag: { sourceNote: 'inventering/_probes/elcentral-kollen / elcentral-verdict / elcentral-akut / elkollen-rod .measure.json (samma metod)', harness: 'site/_probes/out/s3-harness-diag-*.html: .ampy-diag utan --flush = 1280 + padding 56/39,6, som elcentrals shell', rows: diagRows, errors: { '1440': kitEntry['1440']._errors, '390': kitEntry['390']._errors }, overflowX: { '1440': kitEntry['1440']._overflowX || kitQ['1440']._overflowX || kitGron['1440']._overflowX, '390': kitEntry['390']._overflowX || kitQ['390']._overflowX || kitGron['390']._overflowX } },
};
await writeFile(resolve(outDir, 's3-parity.json'), JSON.stringify(result, null, 1));
const f = v => v === null || v === undefined ? 'n/a' : String(Math.round(v * 10) / 10).replace('.', ',');
let md = `# S3 paritet (${when})\n\n`;
for (const kit of ['calc', 'diag']) {
  md += `## ${kit === 'calc' ? 'Kalkylator-kitet vs led-kalkylator' : 'Diagnostik-kitet vs elcentral-kollen / elkollen'}\n\n| Mått | 1440 källa / kit | 390 källa / kit | Not |\n|---|---|---|---|\n`;
  for (const r of result[kit].rows) md += `| ${r.label} | ${f(r.source['1440'])} / ${f(r.kit['1440'])} | ${f(r.source['390'])} / ${f(r.kit['390'])} | ${r.note} |\n`;
  md += `\nerrors: ${JSON.stringify(result[kit].errors)} overflowX: ${JSON.stringify(result[kit].overflowX)}\n\n`;
}
await writeFile(resolve(outDir, 's3-parity.md'), md);
console.log(md);
