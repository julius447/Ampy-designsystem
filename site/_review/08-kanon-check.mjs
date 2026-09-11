// Kontrollerar "Kanon: slug (fil:rad)" mot kallor/: finns filen, finns raderna, och vad står där (första raden i intervallet).
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
const map = { 'cta-website': 'CTA-website', 'elcentral-kollen': 'Elcentral-lead-magnet', 'energycalc': 'Energycalc', 'thank-you': 'Thank-you-Offer-accepted', 'led-kalkylator': 'Led-kalkylator', 'elkollen': 'Elkollen', 'hero-1': 'Hero-1', 'testimonials-block': 'Testimonials-block', 'eljour-block': 'Eljour-block', 'fore-efter-cro': 'f-re-efter-CRO-', 'main-form': 'Ampy-main-form', 'ev-kalkylator': 'EV-Caluclator', 'rot-gt-cro': 'ROT-GT-CRO-', 'certificates': 'Certificates', 'eljour-sticky-bar': 'Eljour-sticky-bar', 'main-cta': 'Main_CTA', 'website-blocks': 'Website-blocks', 'footer-cro': 'Footer-CRO-', 'hero-2-alternatives': 'Hero_2-alternatives', 'mini-menu': 'mini-menu', 'fotobedomningen': 'Fotobed-mning-CRO-', 'visste-du-att': 'Website-blocks', 'article-template': 'ampy-article-template', 'var-process-cro': 'V-r-process-CRO-', 'battery-calculator': 'Battery-calculator', 'booking-confirmation': 'Booking-confirmation', 'offer-accepted': 'Offer-accepted-preview', 'picasso': 'Picasso', 'hero-2-form': 'Hero-2-form' };
function findFile(dir, rel) {
  // exakt
  if (existsSync(join(dir, rel))) return join(dir, rel);
  // sök efter suffix
  const base = rel.split('/').pop();
  const hits = [];
  (function walk(d, depth) { if (depth > 6) return; for (const e of readdirSync(d, { withFileTypes: true })) { if (e.name === 'node_modules' || e.name === '.git') continue; const p = join(d, e.name); if (e.isDirectory()) walk(p, depth + 1); else if (p.endsWith('/' + rel) || e.name === base) hits.push(p); } })(dir, 0);
  return hits.find(h => h.endsWith('/' + rel)) || hits[0] || null;
}
const claims = JSON.parse(readFileSync('site/_review/out/kanon-claims.json', 'utf8'));
const out = [];
for (const c of claims) {
  const repo = map[c.slug]; if (!repo) { out.push({ ...c, status: 'slug utan repo-mappning (klass/ej källa)' }); continue; }
  const dir = join('kallor', repo); if (!existsSync(dir)) { out.push({ ...c, status: 'repo saknas: ' + dir }); continue; }
  const fm = c.ref.match(/([A-Za-z0-9_./-]+\.(?:css|html|js))(?::(\d+)(?:-(\d+))?)?/g) || [];
  for (const one of fm) {
    const m = one.match(/([A-Za-z0-9_./-]+\.(?:css|html|js))(?::(\d+)(?:-(\d+))?)?/);
    const file = m[1]; const a = m[2] ? +m[2] : null; const b = m[3] ? +m[3] : a;
    const fp = findFile(dir, file);
    if (!fp) { out.push({ page: c.page, slug: c.slug, file, lines: a ? `${a}-${b}` : '', status: 'FIL SAKNAS', ctx: c.ctx.slice(0, 80) }); continue; }
    const lines = readFileSync(fp, 'utf8').split('\n');
    if (a && a > lines.length) { out.push({ page: c.page, slug: c.slug, file: fp, lines: `${a}-${b}`, status: `RAD UTANFÖR (filen har ${lines.length})` }); continue; }
    const sample = a ? lines.slice(a - 1, Math.min(b, a + 2)).map(l => l.trim().slice(0, 110)).join(' ⏎ ') : '(ingen rad angiven)';
    // extra: leta radnummer som anges i ref-strängen (t.ex. "161-206 väljare")
    out.push({ page: c.page, slug: c.slug, file: fp, lines: a ? `${a}-${b}` : '', status: 'ok', sample, ctx: c.ctx.slice(0, 60) });
    for (const extra of c.ref.matchAll(/(?:,|\s)(\d{2,4})-(\d{2,4})\s+([a-zåäö/ +]+)/g)) { const ea = +extra[1], eb = +extra[2]; if (ea > lines.length) out.push({ page: c.page, slug: c.slug, file: fp, lines: `${ea}-${eb}`, status: `RAD UTANFÖR (${lines.length})` }); else out.push({ page: c.page, slug: c.slug, file: fp, lines: `${ea}-${eb} (${extra[3].trim()})`, status: 'ok', sample: lines.slice(ea - 1, Math.min(eb, ea + 1)).map(l => l.trim().slice(0, 100)).join(' ⏎ ') }); }
  }
}
writeFileSync('site/_review/out/kanon-check.json', JSON.stringify(out, null, 1));
for (const o of out) console.log(`${o.status.padEnd(14)} | ${o.page} | ${o.slug} | ${o.file || ''} ${o.lines || ''} | ${(o.sample || '').slice(0, 150)}`);
