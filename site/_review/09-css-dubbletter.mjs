// Selektorer definierade i mer än en fil i system/components/*.css (+ base.css, doc.css) och egenskapskonflikter.
// Enkel CSS-parser: tar bort kommentarer, går igenom block, håller reda på @media/@container/@supports-kontext.
import { readFileSync, writeFileSync, readdirSync } from 'fs';
const files = ['system/base.css', ...readdirSync('system/components').filter(f => f.endsWith('.css')).map(f => 'system/components/' + f), 'site/doc.css'];
const decls = []; // {file, ctx, selector, prop, value, line}
function parse(file) {
  const raw = readFileSync(file, 'utf8');
  // radnummer: behåll radbrytningar i kommentarer
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  let i = 0; const ctx = []; const n = css.length;
  const lineAt = pos => css.slice(0, pos).split('\n').length;
  while (i < n) {
    const open = css.indexOf('{', i); if (open < 0) break;
    const head = css.slice(i, open).trim();
    const closeIdx = css.indexOf('}', open);
    const nextOpen = css.indexOf('{', open + 1);
    if (head.startsWith('@') && !/^@(font-face|page)/.test(head) && nextOpen > -1 && nextOpen < closeIdx) {
      // at-rule with nested blocks
      ctx.push({ head, depth: 0 }); i = open + 1; continue;
    }
    // declaration block
    const body = css.slice(open + 1, closeIdx);
    const line = lineAt(open);
    const sel = head.replace(/\s+/g, ' ');
    for (const d of body.split(';')) { const m = d.match(/^\s*([a-zA-Z-]+)\s*:\s*([\s\S]+?)\s*$/); if (m) decls.push({ file, ctx: ctx.map(c => c.head).join(' > '), selector: sel, prop: m[1].toLowerCase(), value: m[2].replace(/\s+/g, ' '), line }); }
    i = closeIdx + 1;
    // pop contexts whose closing brace follows
    while (ctx.length) { const rest = css.slice(i).match(/^\s*\}/); if (rest) { ctx.pop(); i += rest[0].length; } else break; }
  }
}
for (const f of files) parse(f);
// per (ctx, selector, prop): filer
const byKey = new Map();
for (const d of decls) { const key = `${d.ctx}||${d.selector}||${d.prop}`; (byKey.get(key) || byKey.set(key, []).get(key)).push(d); }
const crossFile = []; const sameFileDup = [];
for (const [key, arr] of byKey) {
  const filesSet = new Set(arr.map(a => a.file));
  if (filesSet.size > 1) { const values = new Set(arr.map(a => a.value)); crossFile.push({ key, files: [...filesSet], conflict: values.size > 1, entries: arr.map(a => `${a.file}:${a.line} = ${a.value}`) }); }
}
// selektorer (oavsett prop) i flera filer
const selFiles = new Map();
for (const d of decls) { const k = `${d.ctx}||${d.selector}`; (selFiles.get(k) || selFiles.set(k, new Set()).get(k)).add(d.file); }
const multi = [...selFiles].filter(([, s]) => s.size > 1).map(([k, s]) => ({ selector: k, files: [...s] }));
// klassnamn som förekommer (som del av selektor) i flera komponentfiler
const classFiles = new Map();
for (const d of decls) { if (!d.file.includes('components/')) continue; for (const c of d.selector.matchAll(/\.(ampy-[a-zA-Z0-9_-]+)/g)) (classFiles.get(c[1]) || classFiles.set(c[1], new Set()).get(c[1])).add(d.file.replace('system/components/', '')); }
const classMulti = [...classFiles].filter(([, s]) => s.size > 1).map(([c, s]) => ({ klass: c, files: [...s] }));
writeFileSync('site/_review/out/css-dubbletter.json', JSON.stringify({ decls: decls.length, selektorerIFleraFiler: multi, egenskapKonflikter: crossFile.filter(c => c.conflict), egenskapDubbletter: crossFile.filter(c => !c.conflict), klassnamnIFleraKomponentfiler: classMulti }, null, 1));
console.log('deklarationer', decls.length);
console.log('\nSELEKTORER definierade i flera filer:', multi.length); for (const m of multi) console.log(' ', m.files.join(' + '), '|', m.selector.slice(0, 140));
console.log('\nEGENSKAPSKONFLIKTER (samma selektor+prop, olika värde, olika fil):', crossFile.filter(c => c.conflict).length); for (const c of crossFile.filter(c => c.conflict)) console.log(' ', c.key.slice(0, 120), '\n    ', c.entries.join('\n     '));
console.log('\nKLASSNAMN som styls i flera komponentfiler:', classMulti.length); for (const c of classMulti) console.log(' ', c.klass, '|', c.files.join(', '));
