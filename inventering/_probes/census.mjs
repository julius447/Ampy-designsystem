// Färgcensus i KÄLLKOD: räknar varje färgliteral (hex/rgb/rgba) i givna CSS/HTML/JS-filer, med radnummer
// och token-mappning. Usage: node inventering/_probes/census.mjs <fil> [fil...]
import { readFile } from 'fs/promises';
import { mapColor, parseColor } from './tokens.mjs';

const files = process.argv.slice(2);
const RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;
const totals = {};
for (const f of files) {
  const txt = await readFile(f, 'utf8');
  txt.split('\n').forEach((line, i) => {
    for (const m of line.match(RE) || []) {
      const c = parseColor(m); if (!c) continue;
      const key = c.a === 1 ? `rgb(${c.rgb.join(', ')})` : `rgba(${c.rgb.join(', ')}, ${c.a})`;
      totals[key] = totals[key] || { n: 0, first: `${f.split('/').slice(-2).join('/')}:${i + 1}`, skrivsatt: new Set() };
      totals[key].n++; totals[key].skrivsatt.add(m.toLowerCase());
    }
  });
}
const rows = Object.entries(totals).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => ({ farg: k, antal: v.n, forsta: v.first, skrivsatt: [...v.skrivsatt].slice(0, 3), ...mapColor(k) }));
console.log(JSON.stringify(rows, null, 1));
