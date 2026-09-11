// Räknar färgliterals i givna filer och mappar mot --ap*-tokens i global-variables.css.
// Usage: node inventering/_probes/colors.mjs <file> [file...]
import { readFileSync } from 'fs';
const gv = readFileSync('kallor/live-ampy-se/global-variables.css', 'utf8');
const tok = {};
for (const m of gv.matchAll(/--(ap[a-z0-9-]+):(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))/g)) {
  const name = '--' + m[1]; const v = m[2];
  const key = norm(v); if (!key) continue;
  if (!tok[key]) tok[key] = name; // första namnet vinner (hex-versionen kommer först)
}
function norm(v) {
  v = v.trim().toLowerCase().replace(/\s+/g, '');
  let m;
  if ((m = v.match(/^#([0-9a-f]{3})$/))) return 'rgb:' + m[1].split('').map(c => parseInt(c + c, 16)).join(',') + ':1';
  if ((m = v.match(/^#([0-9a-f]{6})$/))) { const h = m[1]; return 'rgb:' + [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(',') + ':1'; }
  if ((m = v.match(/^#([0-9a-f]{8})$/))) { const h = m[1]; return 'rgb:' + [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(',') + ':' + (parseInt(h.slice(6, 8), 16) / 255).toFixed(2).replace(/\.?0+$/, ''); }
  if ((m = v.match(/^rgba?\(([\d.]+),([\d.]+),([\d.]+)(?:,([\d.]+))?\)$/))) return 'rgb:' + [m[1], m[2], m[3]].map(Number).join(',') + ':' + (m[4] === undefined ? '1' : String(Number(m[4])));
  return null;
}
const files = process.argv.slice(2);
const counts = {};
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)) {
      const key = norm(m[0]); if (!key) continue;
      const rec = counts[key] ||= { literals: new Set(), n: 0, where: [] };
      rec.literals.add(m[0]); rec.n++; if (rec.where.length < 4) rec.where.push(`${f.split('/').pop()}:${i + 1}`);
    }
  });
}
const rows = Object.entries(counts).map(([key, r]) => {
  const [, rgb, a] = key.split(':');
  const exact = tok[key];
  const base = tok['rgb:' + rgb + ':1'];
  return { key, rgb, alpha: a, n: r.n, literals: [...r.literals].join(' '), token: exact || null, basToken: !exact && base ? base : null, where: r.where.join(' ') };
}).sort((x, y) => y.n - x.n);
for (const r of rows) console.log(`${String(r.n).padStart(3)}  ${r.literals.padEnd(34)} ${(r.token || (r.basToken ? r.basToken + ' @' + r.alpha : '— utanför tokens')).padEnd(34)} ${r.where}`);
console.log(JSON.stringify(rows));
