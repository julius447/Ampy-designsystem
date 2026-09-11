// farg.html "Semantiska lagret"-tabellen (token | pekar på | källa | drift) mot tokens.css (värde + radkommentar "källa: ... ; drift: ...")
import { readFileSync, writeFileSync } from 'fs';
const html = readFileSync('site/grunder/farg.html', 'utf8');
const tokRaw = readFileSync('system/tokens.css', 'utf8');
const rows = new Map();
for (const line of tokRaw.split('\n')) {
  const m = line.match(/^\s*(--ampy-[a-z0-9-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/);
  if (!m) continue;
  const [, name, value, comment = ''] = m;
  let kalla = '', drift = '';
  const km = comment.match(/källa:\s*(.*?)(?:\s*;\s*drift:\s*(.*))?$/);
  if (km) { kalla = km[1].trim(); drift = (km[2] || '').trim(); } else { kalla = comment; }
  rows.set(name, { value: value.trim(), kalla, drift, comment });
}
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const findings = []; let n = 0;
const tableStart = html.indexOf('Semantiska lagret'); const table = html.slice(tableStart);
for (const m of table.matchAll(/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g)) {
  const tokenCell = strip(m[1]); const token = (tokenCell.match(/--ampy-[a-z0-9-]+/) || [])[0]; if (!token) continue;
  n++;
  const pekar = strip(m[2]), kalla = strip(m[3]), drift = strip(m[4]);
  const t = rows.get(token);
  if (!t) { findings.push({ token, typ: 'token saknas i tokens.css' }); continue; }
  const valNorm = t.value.replace(/\s+/g, ' ');
  const pekarClean = pekar.replace(/…$/, '');
  if (!valNorm.startsWith(pekarClean.slice(0, Math.min(pekarClean.length, 30)))) findings.push({ token, typ: 'pekar≠värde', sida: pekar.slice(0, 60), tokens: valNorm.slice(0, 60) });
  const kNorm = t.kalla.replace(/\s+/g, ' ');
  if (kalla && kNorm && !(kNorm.startsWith(kalla.slice(0, 40)) || kalla.startsWith(kNorm.slice(0, 40)))) findings.push({ token, typ: 'källa≠kommentar', sida: kalla.slice(0, 90), tokens: kNorm.slice(0, 90) });
  const dNorm = t.drift.replace(/\s+/g, ' ');
  if (drift && dNorm && !(dNorm.startsWith(drift.slice(0, 40)) || drift.startsWith(dNorm.slice(0, 40)))) findings.push({ token, typ: 'drift≠kommentar', sida: drift.slice(0, 90), tokens: dNorm.slice(0, 90) });
  if (!drift && dNorm) findings.push({ token, typ: 'drift saknas på sidan', tokens: dNorm.slice(0, 90) });
}
// vilka --ampy-tokens i tokens.css saknas i tabellen?
const inTable = new Set([...table.matchAll(/<td[^>]*>[^<]*<code>(--ampy-[a-z0-9-]+)/g)].map(m => m[1]));
const missing = [...rows.keys()].filter(k => !inTable.has(k));
writeFileSync('site/_review/out/sanning-semantisk.json', JSON.stringify({ rader: n, avvikelser: findings, saknasITabellen: missing }, null, 1));
console.log('rader', n, 'avvikelser', findings.length, 'tokens.css-rader som saknas i tabellen:', missing.length, missing.join(' '));
for (const f of findings) console.log(JSON.stringify(f));
