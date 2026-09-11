// site/_review/03-token-diff.mjs: lager 1 (--ap*) i system/tokens.css mot kallor/live-ampy-se/global-variables.css.
// Parsar båda (custom properties), normaliserar whitespace, jämför värde för värde. Rapporterar: saknade, extra, avvikande.
import { readFile, writeFile } from 'fs/promises';
const norm = s => s.replace(/\s+/g, '').replace(/,0\./g, ',.').replace(/\(0\./g, '(.').toLowerCase();
function parse(css) {
  const m = new Map(); const dup = [];
  // ta bort kommentarer
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const mm of css.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;{}]+)(?:;|(?=\}))/g)) {
    const k = mm[1], v = mm[2].trim();
    if (m.has(k)) dup.push({ k, first: m.get(k), second: v }); else m.set(k, v);
  }
  return { m, dup };
}
const live = parse(await readFile('kallor/live-ampy-se/global-variables.css', 'utf8'));
const tokRaw = await readFile('system/tokens.css', 'utf8');
// tokens.css: sista deklarationen vinner (1b-fixarna överskriver), så ta "last wins" separat
const tokAll = tokRaw.replace(/\/\*[\s\S]*?\*\//g, '');
const tokLast = new Map(); for (const mm of tokAll.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;{}]+)(?:;|(?=\}))/g)) tokLast.set(mm[1], mm[2].trim());
const liveAp = [...live.m.keys()].filter(k => k.startsWith('--ap'));
const tokAp = [...tokLast.keys()].filter(k => k.startsWith('--ap'));
const missing = liveAp.filter(k => !tokLast.has(k));
const extra = tokAp.filter(k => !live.m.has(k));
const differs = [];
for (const k of liveAp) { if (tokLast.has(k) && norm(tokLast.get(k)) !== norm(live.m.get(k))) differs.push({ k, live: live.m.get(k), tokens: tokLast.get(k) }); }
// live-dubbletter (hex sedan rgb) - kontrollera att andra deklarationen är samma färg
const dupAp = live.dup.filter(d => d.k.startsWith('--ap'));
const hexToRgb = h => { const x = h.replace('#', ''); const n = parseInt(x.length === 3 ? x.split('').map(c => c + c).join('') : x, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const dupMismatch = dupAp.filter(d => { const a = d.first.trim(), b = d.second.trim(); if (a.startsWith('#') && b.startsWith('rgb(')) { const r = hexToRgb(a); const s = b.match(/\d+/g).map(Number); return !(r[0] === s[0] && r[1] === s[1] && r[2] === s[2]); } return norm(a) !== norm(b); });
const nonAp = [...live.m.keys()].filter(k => !k.startsWith('--ap'));
const ampyCount = [...tokLast.keys()].filter(k => k.startsWith('--ampy')).length;
const out = { liveApCount: liveAp.length, tokensApCount: tokAp.length, tokensAmpyCount: ampyCount, missing, extra, differs, liveDuplicates: dupAp.length, liveDuplicateMismatch: dupMismatch, liveNonApTokens: nonAp.length, liveNonApSample: nonAp.slice(0, 40), shadowPrimaryInLive: live.m.has('--shadow-primary') };
await writeFile('site/_review/out/token-diff.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify({ ...out, liveNonApSample: undefined }, null, 1));
