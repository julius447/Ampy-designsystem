// Extraherar "Kanon: <slug> (<fil:rad>)"-påståenden ur komponentsidorna (renderad text) -> lista med slug + fil + rader
import { readFileSync, writeFileSync } from 'fs';
const pages = ['knappar', 'text', 'ytor', 'falt', 'verktyg', 'diagnostik', 'block'];
const out = [];
for (const p of pages) {
  const txt = readFileSync(`site/_review/out/text/komponenter-${p}.txt`, 'utf8');
  for (const m of txt.matchAll(/Kanon:\s*([^\n]{0,400})/g)) {
    const s = m[1];
    // fånga "slug (fil:rad[-rad])" eller "namn slug (fil:rad)"
    for (const mm of s.matchAll(/([a-z0-9-]+)\s*\(([^()]*?\.(?:css|html|js|md)[^()]*?)\)/g)) out.push({ page: p, slug: mm[1], ref: mm[2], ctx: s.slice(0, 160) });
  }
}
writeFileSync('site/_review/out/kanon-claims.json', JSON.stringify(out, null, 1));
console.log(out.length); for (const o of out) console.log(o.page, '|', o.slug, '|', o.ref);
