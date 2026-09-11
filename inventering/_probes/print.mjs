// Kompakt utskrift av measure.json: en rad per roll, D=1440 / M=390 när de skiljer sig.
import { readFile } from 'fs/promises';
const r = JSON.parse(await readFile(process.argv[2], 'utf8'));
const only = process.argv[3]; // valfritt: bara ett state-namn eller "base"
const d = r.viewports.desktop, m = r.viewports.mobile;
const short = (k, v) => {
  if (k === 'fontFamily') return v.split(',')[0].replace(/"/g, '');
  if (k === 'transition' && v === 'all') return null;
  if ((k === 'border' || k === 'borderTop') && /^0px/.test(v)) return null;
  if (k === 'backgroundImage') return v.length > 220 ? v.slice(0, 220) + '…' : v;
  if (k === 'outline' && / none /.test(v)) return null;
  if (k === 'WebkitTextFillColor') return null;
  return v;
};
const KEYS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'fontFeatureSettings', 'color', 'backgroundColor', 'backgroundImage', 'padding', 'gap', 'rowGap', 'columnGap', 'borderRadius', 'boxShadow', 'border', 'borderTop', 'outline', 'transition', 'animation', 'minHeight', 'maxWidth', 'gridTemplateColumns', 'opacity', 'backdropFilter', 'WebkitTextFillColor'];
function line(role, o, mo) {
  if (!o || o.missing) return `${role}: SAKNAS ${o && o.selector}`;
  const parts = [];
  for (const k of KEYS) {
    if (o[k] == null) continue;
    let v = short(k, o[k]); if (v == null) continue;
    if (mo && mo[k] != null && mo[k] !== o[k]) v += ' |M ' + short(k, mo[k]);
    parts.push(`${k}=${v}`);
  }
  parts.push(`box=${o.rect.w}x${o.rect.h}` + (mo && !mo.missing ? ` |M ${mo.rect.w}x${mo.rect.h}` : ''));
  return `${role} [${o.tag}] "${o.text.slice(0, 32)}"\n   ${parts.join('; ')}`;
}
if (!only || only === 'base') {
  if (d.cssVars) console.log('== cssVars:', JSON.stringify(d.cssVars));
  console.log('== docHeight D', d.docHeight, 'M', m.docHeight, 'errors', JSON.stringify(d.errors));
  if (d.extra && Object.keys(d.extra).length) console.log('== extra D', JSON.stringify(d.extra), '\n== extra M', JSON.stringify(m.extra));
  for (const role of Object.keys(d.roles)) console.log(line(role, d.roles[role], m.roles[role]));
}
for (const st of Object.keys(d.states || {})) {
  if (only && only !== st) continue;
  console.log('== STATE ' + st);
  if (d.states[st].error) { console.log('   ERROR', d.states[st].error.slice(0, 200)); continue; }
  for (const role of Object.keys(d.states[st])) console.log(line(role, d.states[st][role], m.states[st] && m.states[st][role]));
}
if (!only || only === 'census') {
  console.log('== census (computed, desktop) top 30');
  for (const [k, v] of Object.entries(d.census).slice(0, 30)) console.log(`   ${k}  n=${v.n}  ${v.roller.join('/')}  → ${v.token || 'null'} ${v.note || ''}`);
}
