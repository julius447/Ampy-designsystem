// site/_probes/contrast.mjs
// Räknar WCAG-kontrast (relativ luminans, sRGB) för färgtokens i system/tokens.css mot vit,
// midnight och sky-mist, och skriver resultatet till site/_probes/out/contrast.json.
// Fyller sedan de markerade zonerna i site/grunder/farg.html (swatch-rutnät, alfa-tabell)
// så att varje siffra på sidan kommer från tokens.css + konsolidering/farg.json, inte från hand.
// Kör: node site/_probes/contrast.mjs   (idempotent, kan köras om när tokens.css ändras)
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const tokensCss = readFileSync(resolve(root, 'system/tokens.css'), 'utf8');
const farg = JSON.parse(readFileSync(resolve(root, 'konsolidering/farg.json'), 'utf8'));
const pagePath = resolve(root, 'site/grunder/farg.html');

// ---------- färgparsning ----------
function parse(str) {
  str = str.trim();
  let m;
  if ((m = str.match(/^#([0-9a-f]{6})$/i))) {
    const n = parseInt(m[1], 16);
    return { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  if ((m = str.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/i))) {
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  }
  throw new Error('kan inte tolka färg: ' + str);
}
const toHex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
function blend(fg, bg) { // fg med alfa över opak bg
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}
function lum(c) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}
function contrast(fg, bg) {
  const c = fg.a < 1 ? blend(fg, bg) : fg;
  const l1 = lum(c), l2 = lum(bg);
  return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
}

// ---------- tokens ur tokens.css (lager 1 + 1c + färgtokens i lager 2) ----------
const tokenValue = {};
for (const m of tokensCss.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)) tokenValue[m[1]] = m[2].trim();
const resolveVar = v => { let s = v, g = 0; while (/var\(/.test(s) && g++ < 8) s = s.replace(/var\((--[a-z0-9-]+)\)/i, (_, n) => tokenValue[n] || _); return s; };

const REF = {
  vit: parse('#ffffff'),
  midnight: parse(tokenValue['--apmidnight-blue']),
  skymist: parse(tokenValue['--apsky-mist']),
};
const fargByToken = Object.fromEntries(farg.primitiva.map(p => [p.namn, p]));

// Grupper: namn, ap-token (eller literal), ampy-tokens, roll (ur farg.json om finns), extra text
const groups = [
  { id: 'karnan', rubrik: 'Kärnan', text: 'De fem färger som bär nästan allt: 29, 26, 25, 22 och 21 källor av 30.', items: [
    { t: '--apmidnight-blue', namn: 'Midnight' },
    { t: '--appure-white', namn: 'Vit' },
    { t: '--apteal-core', namn: 'Teal core' },
    { t: '--apneon-mint', namn: 'Neon mint' },
    { t: '--apsky-mist', namn: 'Sky mist' },
  ] },
  { id: 'tealer', rubrik: 'Tealer och gröna toner', text: 'Två tealer är kanon: teal core som accent, teal deep som text och solid knapp. Resten är gradientstopp, aurora eller definierade men oanvända.', items: [
    { t: '--apteal-core', namn: 'Teal core' },
    { t: '--apteal-deep', namn: 'Teal deep' },
    { t: '--ampy-action-hover', namn: 'Teal hover', literal: true, ampy: '--ampy-action-hover', roll: 'hover på solid teal-knapp (header-CTA)', kallor: 'hero-1 + website-blocks (header.css:13)', semantik: '--ampy-action-hover' },
    { t: '--apsecondary-teal', namn: 'Sekundärteal (brandbok s.8)' },
    { t: '--apteal-tint', namn: 'Teal tint' },
    { t: '--apemerald-flow', namn: 'Emerald flow' },
    { t: '--apseafoam-mint', namn: 'Seafoam mint' },
    { t: '--apmint-surge', namn: 'Mint surge', roll: 'definierad i global-variables.css; 0 användningar i blocken (bara brandbokens jämförelselista)', kallor: '1 (brandbook-inventeringen)', semantik: '(oanvänd)' },
    { t: '--apcrystal-blue', namn: 'Crystal blue' },
    { t: '--apsublime-green', namn: 'Sublime green' },
    { t: '--apaqua-frost', namn: 'Aqua frost' },
  ] },
  { id: 'navy', rubrik: 'Navy och bläck', text: 'Ett bläck (midnight) för rubrik och brödtext, en dämpad och en svag ton. Navy-ink, darkest-black och charcoal är drift som byts ut (beslut B3).', items: [
    { t: '--apmidnight-blue', namn: 'Midnight (bläck)' },
    { t: '--apindigo', namn: 'Indigo (knapptext på gradient)' },
    { t: '--apnavy-muted', namn: 'Navy muted' },
    { t: '--apnavy-faint', namn: 'Navy faint' },
    { t: '--apnavy-ink', namn: 'Navy ink (drift, B3)' },
    { t: '--apdarkest-black', namn: 'Darkest black (drift)' },
    { t: '--apdeepest-blue', namn: 'Deepest blue' },
  ] },
  { id: 'tillstand', rubrik: 'Tillstånd', text: 'Fyllning, bläck och tint per tillstånd. Fyllningarna är för staplar, ikoner och ytor utan text; texten sätts alltid i -ink-varianten.', items: [
    { t: '--apemerald-flow', namn: 'Success (fyllning)', ampy: '--ampy-success' },
    { t: '--apverdict-green', namn: 'Success ink', ampy: '--ampy-success-ink' },
    { t: '--ampy-success-tint', namn: 'Success tint', literal: true, ampy: '--ampy-success-tint', roll: 'bakgrund bakom success-ikon/besked', kallor: 'main-form (styles.css:238)', semantik: '--ampy-success-tint' },
    { t: '--apamber', namn: 'Varning (fyllning)', ampy: '--ampy-warn' },
    { t: '--apverdict-amber', namn: 'Varning ink', ampy: '--ampy-warn-ink' },
    { t: '--apamber-tint', namn: 'Varning tint', ampy: '--ampy-warn-tint' },
    { t: '--apsignal-red', namn: 'Fel (fält, meddelande)', ampy: '--ampy-error' },
    { t: '--apverdict-red', namn: 'Fel ink (besked)', ampy: '--ampy-error-ink' },
    { t: '--apsignal-red-tint', namn: 'Fel tint', ampy: '--ampy-error-tint' },
    { t: '--apverdict-blue', namn: 'Info ink', ampy: '--ampy-info-ink' },
    { t: '--apgoogle-gold', namn: 'Google-gult (stjärnor, B12)' },
  ] },
  { id: 'gra', rubrik: 'Grå och vita', text: 'Live definierar fyra grå/vita som inget block använder. Charcoal och pure black förekommer men är drift.', items: [
    { t: '--appure-white', namn: 'Pure white' },
    { t: '--apsky-mist', namn: 'Sky mist' },
    { t: '--apmilk-white', namn: 'Milk white' },
    { t: '--apgray-white', namn: 'Gray white' },
    { t: '--apcharcoal-gray', namn: 'Charcoal gray (drift)' },
    { t: '--appure-black', namn: 'Pure black' },
  ] },
  { id: 'brandbok', rubrik: 'Brandbokens färger som inte används', text: 'Bokens primära accent och stödfärg finns inte i produktionen (0 träffar i live-CSS). Beslut B1.', items: [
    { t: '#326afd', namn: 'Cobalt (brandbok s.7)', literal: true, roll: 'bokens huvudaccent: ikoner, blixt-former, hjälm, bil, skyltar', kallor: '2 (brandbook + artikelmallen som Tailwind "electric", 73 användningar)', semantik: 'inte i produktion', ampy: '(inget token)' },
    { t: '#92ec47', namn: 'Lime (brandbok s.8)', literal: true, roll: 'stödfärg i boken, gradient 2', kallor: '1 (brandbook)', semantik: 'inte i produktion', ampy: '(inget token)' },
  ] },
];

const ampyMap = {}; // primitiv -> ampy-tokens som pekar dit (ur tokens.css lager 2)
for (const [name, val] of Object.entries(tokenValue)) {
  if (!name.startsWith('--ampy-')) continue;
  const m = val.match(/^var\((--ap[a-z0-9-]+)\)$/);
  if (m) (ampyMap[m[1]] = ampyMap[m[1]] || []).push(name);
}

const fmt = n => n.toFixed(2).replace('.', ',');
const cls = n => (n >= 4.5 ? 'is-aa' : n >= 3 ? 'is-lg' : 'is-no');
// Husregeln: aldrig tankstreck eller punktavskiljare i UI. Källtexterna använder dem; de skrivs om här.
const clean = s => String(s).replace(/\s*—\s*/g, ': ').replace(/\s*–\s*/g, ' till ').replace(/\s*·\s*/g, ', ');
const esc = s => clean(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const out = { metod: 'WCAG 2.x relativ luminans (sRGB); alfa blandas mot underlaget först. Källa för hex: system/tokens.css. Källor/roller: konsolidering/farg.json.', referens: { vit: '#ffffff', midnight: toHex(REF.midnight), skymist: toHex(REF.skymist) }, grupper: [] };
const html = {};

for (const g of groups) {
  const rows = [];
  let frag = '';
  for (const it of g.items) {
    const raw = it.literal ? (it.t.startsWith('--') ? tokenValue[it.t] : it.t) : tokenValue[it.t];
    if (!raw) throw new Error('token saknas i tokens.css: ' + it.t);
    const c = parse(resolveVar(raw));
    const f = it.literal ? null : fargByToken[it.t];
    const kv = contrast(c, REF.vit), km = contrast(c, REF.midnight), ks = contrast(c, REF.skymist);
    const hex = c.a < 1 ? `${toHex(c)} @ ${c.a}` : toHex(c);
    const ampy = it.ampy || (ampyMap[it.t] ? ampyMap[it.t].join(', ') : (f && f.semantik) || '');
    const roll = it.roll || (f && f.roll) || '';
    const kallor = it.kallor || (f && f.antal_kallor != null ? `${f.antal_kallor} källor${f.auk1 && f.auk1.length ? ` (${f.auk1.length} auk 1)` : ''}` : '');
    rows.push({ namn: it.namn, token: it.t, hex, ampy, roll, kallor, mot_vit: kv, mot_midnight: km, mot_skymist: ks });
    const light = lum(c.a < 1 ? blend(c, REF.vit) : c) > 0.7;
    frag += `<div class="ds-swatch">
  <div class="ds-swatch__chip${light ? ' ds-swatch__chip--light' : ''}" style="background:${c.a < 1 ? raw : toHex(c)}"></div>
  <div class="ds-swatch__body">
    <span class="ds-swatch__name">${esc(it.namn)}</span>
    <span class="ds-swatch__meta">${esc(hex)}</span>
    <span class="ds-swatch__meta">${esc(it.literal && !it.t.startsWith('--') ? '(inget ap-token)' : it.t)}</span>
    ${ampy ? `<span class="ds-swatch__meta ds-swatch__sem">${esc(ampy)}</span>` : ''}
    ${roll ? `<span class="ds-swatch__roll">${esc(roll)}</span>` : ''}
    ${kallor ? `<span class="ds-swatch__roll">${esc(kallor)}</span>` : ''}
    <span class="ds-contrast"><span class="${cls(kv)}">vit ${fmt(kv)}</span><span class="${cls(km)}">midnight ${fmt(km)}</span><span class="${cls(ks)}">sky ${fmt(ks)}</span></span>
  </div>
</div>
`;
  }
  out.grupper.push({ id: g.id, rubrik: g.rubrik, rader: rows });
  html[g.id] = frag;
}

// ---------- alfa-tabell: on-dark-serien och midnight-alfa på vit ----------
const alfa = [
  ['--ampy-on-dark', 'midnight'], ['--ampy-on-dark-soft', 'midnight'], ['--ampy-on-dark-muted', 'midnight'], ['--ampy-on-dark-faint', 'midnight'], ['--ampy-on-dark-line', 'midnight'], ['--ampy-on-dark-subtle', 'midnight'],
  ['--ampy-line', 'vit'], ['--ampy-line-strong', 'vit'], ['--ampy-bg-tint-action', 'vit'], ['--ampy-bg-glass', 'skymist'], ['--ampy-bg-glass-dark', 'vit'],
];
let alfaHtml = '';
out.alfa = [];
for (const [tok, bgName] of alfa) {
  const c = parse(resolveVar(tokenValue[tok]));
  const bg = REF[bgName];
  const mixed = c.a < 1 ? blend(c, bg) : c;
  const k = contrast(c, bg);
  const bgLabel = { vit: 'vit', midnight: 'midnight', skymist: 'sky-mist' }[bgName];
  out.alfa.push({ token: tok, varde: tokenValue[tok], pa: bgLabel, blandad: toHex(mixed), kontrast: k });
  alfaHtml += `<tr><td><code>${tok}</code></td><td><code>${esc(resolveVar(tokenValue[tok]))}</code></td><td>${bgLabel}</td><td><span class="ds-dot" style="background:${toHex(mixed)}"></span><code>${toHex(mixed)}</code></td><td class="${cls(k)}">${fmt(k)}:1</td></tr>\n`;
}
html.alfa = alfaHtml;

// ---------- semantiska lagret: token -> primitiv -> källa -> drift, ordagrant ur tokens.css-kommentarerna ----------
const semGroups = [
  ['Ytor', ['--ampy-bg-page', '--ampy-bg-surface', '--ampy-bg-subtle', '--ampy-bg-dark', '--ampy-bg-dark-glow', '--ampy-bg-glass', '--ampy-glass-border', '--ampy-glass-blur', '--ampy-bg-glass-dark', '--ampy-bg-tint-action']],
  ['Bläck på ljust', ['--ampy-ink', '--ampy-ink-body', '--ampy-ink-muted', '--ampy-ink-faint', '--ampy-ink-on-action']],
  ['Bläck på mörkt', ['--ampy-on-dark', '--ampy-on-dark-soft', '--ampy-on-dark-muted', '--ampy-on-dark-faint', '--ampy-on-dark-line', '--ampy-on-dark-subtle']],
  ['Handling', ['--ampy-action', '--ampy-action-strong', '--ampy-action-hover', '--ampy-action-on', '--ampy-action-gradient', '--ampy-action-gradient-ring', '--ampy-action-gradient-on']],
  ['Tillstånd', ['--ampy-success', '--ampy-success-ink', '--ampy-success-tint', '--ampy-warn', '--ampy-warn-ink', '--ampy-warn-tint', '--ampy-error', '--ampy-error-ink', '--ampy-error-tint', '--ampy-info-ink', '--ampy-focus', '--ampy-focus-on-dark', '--ampy-focus-ring']],
  ['Linjer', ['--ampy-line', '--ampy-line-strong', '--ampy-line-on-dark']],
];
const lineOf = {};
for (const line of tokensCss.split('\n')) {
  const m = line.match(/^\s*(--ampy-[a-z0-9-]+):\s*([^;]+);\s*\/\*\s*([\s\S]*?)\*\/\s*$/);
  if (m) lineOf[m[1]] = { varde: m[2].trim(), kommentar: m[3].trim() };
}
let semHtml = '';
out.semantik = [];
for (const [rubrik, toks] of semGroups) {
  semHtml += `<tr class="ds-table__group"><th colspan="4">${esc(rubrik)}</th></tr>\n`;
  for (const t of toks) {
    const l = lineOf[t];
    if (!l) throw new Error('semantisk token saknas/utan kommentar: ' + t);
    const [kallaRaw, driftRaw] = l.kommentar.split(/\s*;\s*drift:\s*/);
    const kalla = kallaRaw.replace(/^källa:\s*/i, '');
    const drift = driftRaw || '';
    const beslut = (l.kommentar.match(/B(?:ESLUT|eslut)\s*B?(\d+)/) || [])[1];
    const prim = (l.varde.match(/^var\((--ap[a-z0-9-]+)\)$/) || [])[1];
    const resolved = resolveVar(l.varde);
    let chip = '';
    try { const c = parse(resolved); chip = `<span class="ds-dot" style="background:${resolved}"></span>`; } catch { chip = /gradient/.test(resolved) ? `<span class="ds-dot" style="background:${resolved.replace(/;.*$/, '')}"></span>` : ''; }
    out.semantik.push({ grupp: rubrik, token: t, varde: l.varde, primitiv: prim || null, kalla, drift, beslut: beslut ? 'B' + beslut : null });
    semHtml += `<tr><td class="ds-nowrap"><code>${t}</code>${beslut ? ` <a class="ds-a ds-beslut-tag" href="../beslut.html#b${beslut}">B${beslut}</a>` : ''}</td><td${prim ? ' class="ds-nowrap"' : ''}>${chip}<code>${esc(prim || (l.varde.length > 44 ? l.varde.slice(0, 42) + '…' : l.varde))}</code></td><td>${esc(kalla)}</td><td>${esc(drift) || '<span class="ds-small">ingen</span>'}</td></tr>\n`;
  }
}
html.semantik = semHtml;

// ---------- driftlistan ur farg.json ----------
let driftHtml = '';
for (const d of farg.drift) {
  driftHtml += `<tr><td><strong>${esc(d.grupp)}</strong></td><td><ul class="ds-list">${d.varden.map(v => `<li>${esc(v)}</li>`).join('')}</ul></td><td>${esc(d.kanon)}</td><td>${esc(d.byts_ut)}</td></tr>\n`;
}
html.drift = driftHtml;

// ---------- tealmatris: alla tealer i källorna mot vit/sky/midnight (ur 04-kontrast.py) ----------
const kontrast = JSON.parse(readFileSync(resolve(root, 'konsolidering/_probes/out/kontrast.json'), 'utf8'));
let tealHtml = '';
for (const r of kontrast.solida.filter(r => /teal|emerald|neon-mint/i.test(r.namn))) {
  tealHtml += `<tr><td><span class="ds-dot" style="background:${r.hex}"></span>${esc(r.namn)}</td><td class="${cls(r.mot_vit)}">${fmt(r.mot_vit)}</td><td class="${cls(r['mot_sky-mist'])}">${fmt(r['mot_sky-mist'])}</td><td class="${cls(r.mot_midnight)}">${fmt(r.mot_midnight)}</td></tr>\n`;
}
html.tealmatris = tealHtml;

mkdirSync(resolve(root, 'site/_probes/out'), { recursive: true });
writeFileSync(resolve(root, 'site/_probes/out/contrast.json'), JSON.stringify(out, null, 1));

// ---------- fyll sidan ----------
let page = readFileSync(pagePath, 'utf8');
let filled = 0;
for (const [id, frag] of Object.entries(html)) {
  const re = new RegExp(`(<!--@${id}:start-->)[\\s\\S]*?(<!--@${id}:end-->)`);
  if (!re.test(page)) { console.warn('markör saknas i farg.html: ' + id); continue; }
  page = page.replace(re, `$1\n${frag}$2`);
  filled++;
}
writeFileSync(pagePath, page);
console.log(JSON.stringify({ grupper: out.grupper.map(g => `${g.id}: ${g.rader.length}`), alfa: out.alfa.length, zonerFyllda: filled }));
