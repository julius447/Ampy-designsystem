// site/_review/05-sanning-farg.mjs: farg.html:s swatchar (hex, ap-token, antal källor, auk1, kontrast mot vit/midnight/sky)
// mot system/tokens.css (hex <-> tokennamn) + konsolidering/_probes/out/farg-frekvens.json (antal_kallor, auk1) + egen kontrastberäkning.
import { readFileSync, writeFileSync } from 'fs';
const html = readFileSync('site/grunder/farg.html', 'utf8');
const tok = readFileSync('system/tokens.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tokens = new Map(); for (const m of tok.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;{}]+)(?:;|(?=\}))/g)) tokens.set(m[1], m[2].trim());
const freq = JSON.parse(readFileSync('konsolidering/_probes/out/farg-frekvens.json', 'utf8'));
const byHex = new Map(freq.farger.map(f => [f.hex.toLowerCase(), f]));
const lum = h => { const n = parseInt(h.slice(1), 16); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255); };
const cr = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const fmt = x => x.toFixed(2).replace('.', ',');
// swatchar: block av <div class="ds-swatch"...> ... </div>
const swatches = [];
const re = /<div class="ds-swatch[^"]*"[\s\S]*?<span class="ds-swatch__name">([^<]+)<\/span>\s*<span class="ds-swatch__meta">([^<]+)<\/span>\s*<span class="ds-swatch__meta">([^<]+)<\/span>([\s\S]*?)(?=<div class="ds-swatch[^"]*"|<\/section>|<h2|<h3)/g;
for (const m of html.matchAll(re)) {
  const name = m[1].trim(), hex = m[2].trim().toLowerCase(), token = m[3].trim(), rest = m[4];
  const txt = rest.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const cnt = txt.match(/(\d+) källor \((\d+) auk 1\)/);
  const cons = [...txt.matchAll(/(vit|midnight|sky) (\d+,\d+)/g)].map(x => [x[1], x[2]]);
  swatches.push({ name, hex, token, antal: cnt ? +cnt[1] : null, auk1: cnt ? +cnt[2] : null, cons, txt: txt.slice(0, 160) });
}
const bg = { vit: '#ffffff', midnight: '#090b32', sky: '#f5f9ff' };
const findings = [];
let checked = 0;
for (const s of swatches) {
  // 1) token -> hex i tokens.css
  if (s.token.startsWith('--') && tokens.has(s.token)) {
    let v = tokens.get(s.token); let guard = 0; while (v.startsWith('var(') && guard++ < 5) v = tokens.get(v.slice(4, -1)) || v;
    if (/^#/.test(v) && v.toLowerCase() !== s.hex) findings.push({ swatch: s.name, typ: 'hex≠token', sida: s.hex, tokens: v, token: s.token });
    checked++;
  } else if (s.token.startsWith('--')) findings.push({ swatch: s.name, typ: 'token saknas i tokens.css', token: s.token });
  // 2) antal källor mot farg-frekvens.json
  const f = byHex.get(s.hex);
  if (s.antal != null) {
    checked++;
    if (!f) findings.push({ swatch: s.name, typ: 'hex saknas i farg-frekvens.json', hex: s.hex, sida: s.antal });
    else if (f.antal_kallor !== s.antal || (f.auk1 || []).length !== s.auk1) findings.push({ swatch: s.name, typ: 'antal≠json', sida: `${s.antal} (${s.auk1} auk1)`, json: `${f.antal_kallor} (${(f.auk1 || []).length} auk1)` });
  }
  // 3) kontrast
  if (/^#[0-9a-f]{6}$/.test(s.hex)) for (const [k, v] of s.cons) { checked++; const c = fmt(cr(s.hex, bg[k])); if (c !== v) findings.push({ swatch: s.name, typ: 'kontrast≠beräknad', yta: k, sida: v, beraknad: c }); }
}
writeFileSync('site/_review/out/sanning-farg.json', JSON.stringify({ swatchar: swatches.length, kontroller: checked, avvikelser: findings, swatches }, null, 1));
console.log('swatchar', swatches.length, 'kontroller', checked, 'avvikelser', findings.length);
for (const f of findings) console.log(JSON.stringify(f));
