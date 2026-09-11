// site/_review/01-lankar.mjs: länkkontroll över alla 26 sidor (a[href], img/source[src], link[href], script[src],
// svg use[href], inline style url(), CSS url() i site/doc.css + system/**/*.css), ankare (#id i målsidan),
// nav-paritet (samma nav på alla sidor + rätt aria-current efter doc.js), <title>, mall-platshållare, externa URL:er.
// Kör: node site/_review/01-lankar.mjs  -> site/_review/out/lankar.json + sammanfattning i stdout
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, readdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, join, extname, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.md': 'text/markdown' };
const requested = [];
const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let fp = join(root, p);
    if ((await stat(fp)).isDirectory()) fp = join(fp, 'index.html');
    res.writeHead(200, { 'content-type': mime[extname(fp)] || 'application/octet-stream' }); res.end(await readFile(fp));
  } catch { requested.push({ url: req.url, status: 404 }); res.writeHead(404); res.end(); }
});
const port = 8800 + Math.floor(Math.random() * 100);
await new Promise(r => server.listen(port, r));

async function walk(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) { if (['_probes', '_review', '_bygglogg', 'bilder', 'brand'].includes(e.name)) continue; out.push(...await walk(p)); } else if (e.name.endsWith('.html') && e.name !== '_mall.html') out.push(p); } return out; }
const pages = (await walk(join(root, 'site'))).map(p => relative(root, p)).sort();

// ids per html-fil (för ankare), läses direkt ur filen (statiskt) + kompletteras av DOM efter JS
const idCache = new Map();
async function idsOf(relPath) {
  if (idCache.has(relPath)) return idCache.get(relPath);
  const fp = join(root, relPath);
  if (!existsSync(fp)) { idCache.set(relPath, null); return null; }
  const html = await readFile(fp, 'utf8');
  const ids = new Set([...html.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map(m => m[1]));
  // name= på <a name>
  for (const m of html.matchAll(/<a[^>]+name\s*=\s*["']([^"']+)["']/g)) ids.add(m[1]);
  idCache.set(relPath, ids); return ids;
}

const browser = await chromium.launch();
const results = { pages: {}, broken: [], external: [], anchorsMissing: [], placeholders: [], navDiff: [], titles: {}, ariaCurrent: {}, requests404: [] };
let refNav = null;
for (const rel of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const failed = [];
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) failed.push(r.url() + ' -> ' + r.status()); });
  await page.goto(`http://localhost:${port}/${rel}`, { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const refs = [];
    const add = (el, attr, kind) => { const v = el.getAttribute(attr); if (v != null && v !== '') refs.push({ kind, attr, value: v, tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 60), inNav: !!el.closest('.ds-nav') }); };
    document.querySelectorAll('a[href]').forEach(a => add(a, 'href', 'a'));
    document.querySelectorAll('img[src]').forEach(a => add(a, 'src', 'img'));
    document.querySelectorAll('source[src], source[srcset], video[src], video[poster]').forEach(a => { ['src', 'srcset', 'poster'].forEach(at => add(a, at, 'media')); });
    document.querySelectorAll('link[href]').forEach(a => add(a, 'href', 'link'));
    document.querySelectorAll('script[src]').forEach(a => add(a, 'src', 'script'));
    document.querySelectorAll('use').forEach(u => { const v = u.getAttribute('href') || u.getAttribute('xlink:href'); if (v) refs.push({ kind: 'use', attr: 'href', value: v, tag: 'use', text: '', inNav: false }); });
    document.querySelectorAll('[style]').forEach(el => { const s = el.getAttribute('style'); for (const m of s.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) refs.push({ kind: 'style-url', attr: 'style', value: m[2], tag: el.tagName.toLowerCase(), text: '', inNav: false }); });
    document.querySelectorAll('style').forEach(st => { for (const m of st.textContent.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) refs.push({ kind: 'css-url', attr: 'style-el', value: m[2], tag: 'style', text: '', inNav: false }); });
    // images without alt
    const imgNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src'));
    const nav = [...document.querySelectorAll('.ds-nav a')].map(a => ({ text: a.textContent.trim(), href: new URL(a.getAttribute('href'), location.href).pathname, current: a.getAttribute('aria-current') }));
    const navGroups = [...document.querySelectorAll('.ds-nav__group > span')].map(s => s.textContent.trim());
    const title = document.title;
    const h1 = [...document.querySelectorAll('h1')].map(h => h.textContent.trim());
    const placeholders = [];
    const bodyText = document.body.innerText;
    for (const ph of ['SIDTITEL', 'EYEBROW', 'INGRESS', 'TODO', 'FIXME', 'Lorem ipsum', 'lorem ipsum']) { if (bodyText.includes(ph)) placeholders.push(ph); }
    if (title.includes('SIDTITEL')) placeholders.push('title:SIDTITEL');
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({ level: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 50) }));
    return { refs, imgNoAlt, nav, navGroups, title, h1, placeholders, headings, ids: [...document.querySelectorAll('[id]')].map(e => e.id) };
  });
  idCache.set(rel, new Set(data.ids)); // DOM-id:n (efter JS) vinner
  const pageDir = dirname(rel);
  const broken = [], ext = [], anchors = [];
  for (const r of data.refs) {
    const v = r.value.trim();
    if (/^(https?:)?\/\//i.test(v) || /^mailto:|^tel:|^data:|^javascript:/i.test(v)) { if (/^(https?:)?\/\//i.test(v)) ext.push({ page: rel, ...r }); continue; }
    if (v.startsWith('file:')) { broken.push({ page: rel, ...r, why: 'file://-url' }); continue; }
    const [pathPart, hash] = v.split('#');
    let targetRel = rel;
    if (pathPart) {
      const abs = resolve(root, pageDir, pathPart.split('?')[0]);
      targetRel = relative(root, abs);
      let fp = abs;
      if (!existsSync(fp)) { broken.push({ page: rel, ...r, why: 'saknas: ' + targetRel }); continue; }
      const st = await stat(fp); if (st.isDirectory()) { fp = join(fp, 'index.html'); targetRel = relative(root, fp); if (!existsSync(fp)) { broken.push({ page: rel, ...r, why: 'katalog utan index.html: ' + targetRel }); continue; } }
    }
    if (hash != null && hash !== '' && (r.kind === 'a' || r.kind === 'use')) {
      if (r.kind === 'use' && !pathPart) { // inline-sprite i sidan: id måste finnas i DOM
        if (!idCache.get(rel).has(hash)) anchors.push({ page: rel, ...r, why: 'use#id saknas i sidan' });
        continue;
      }
      if (targetRel.endsWith('.svg')) { const svg = await readFile(join(root, targetRel), 'utf8'); if (!new RegExp(`id=["']${hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(svg)) anchors.push({ page: rel, ...r, why: 'symbol saknas i ' + targetRel }); continue; }
      if (!targetRel.endsWith('.html')) continue;
      const ids = await idsOf(targetRel);
      if (ids && !ids.has(hash)) anchors.push({ page: rel, ...r, why: `#${hash} finns inte i ${targetRel}` });
    }
  }
  results.pages[rel] = { refs: data.refs.length, broken: broken.length, external: ext.length, anchorsMissing: anchors.length, imgNoAlt: data.imgNoAlt, title: data.title, h1: data.h1, placeholders: data.placeholders, headings: data.headings, errors, failed, navGroups: data.navGroups, navCount: data.nav.length, navCurrent: data.nav.filter(n => n.current).map(n => n.text) };
  results.broken.push(...broken); results.external.push(...ext); results.anchorsMissing.push(...anchors);
  if (data.placeholders.length) results.placeholders.push({ page: rel, found: data.placeholders });
  results.titles[rel] = data.title;
  results.ariaCurrent[rel] = data.nav.filter(n => n.current).map(n => n.text + ' -> ' + n.href);
  const navKey = data.nav.map(n => n.text + '|' + n.href).join('\n');
  if (refNav == null) refNav = { page: rel, key: navKey, groups: data.navGroups.join('|') };
  else if (navKey !== refNav.key || data.navGroups.join('|') !== refNav.groups) results.navDiff.push({ page: rel, note: 'nav skiljer sig från ' + refNav.page, nav: data.nav.map(n => n.text + '|' + n.href), groups: data.navGroups });
  await page.close();
}
await browser.close(); server.close();
results.requests404 = requested;
await writeFile(join(root, 'site/_review/out/lankar.json'), JSON.stringify(results, null, 1));
const totalRefs = Object.values(results.pages).reduce((a, p) => a + p.refs, 0);
console.log(`sidor: ${pages.length}, referenser: ${totalRefs}, trasiga: ${results.broken.length}, saknade ankare: ${results.anchorsMissing.length}, externa: ${results.external.length}, nav-avvikelser: ${results.navDiff.length}, platshållare: ${results.placeholders.length}, 404 från servern: ${requested.length}`);
for (const b of results.broken) console.log('BROKEN', b.page, b.kind, b.value, b.why);
for (const a of results.anchorsMissing) console.log('ANCHOR', a.page, a.value, a.why, '|', a.text);
for (const p of results.placeholders) console.log('PLACEHOLDER', p.page, p.found.join(','));
for (const n of results.navDiff) console.log('NAVDIFF', n.page, n.note);
for (const [p, d] of Object.entries(results.pages)) { if (d.errors.length || d.failed.length) console.log('ERR', p, JSON.stringify(d.errors), JSON.stringify(d.failed)); if (d.imgNoAlt.length) console.log('NOALT', p, d.imgNoAlt.length, d.imgNoAlt.slice(0, 5).join(' ')); if (d.h1.length !== 1) console.log('H1COUNT', p, d.h1.length, d.h1.join(' | ')); }
console.log('\nTITLAR + aria-current:'); for (const p of pages) console.log(' ', p, '|', results.titles[p], '|', results.ariaCurrent[p].join(', ') || 'INGEN');
console.log('\nEXTERNA:'); const extByPage = {}; for (const e of results.external) { (extByPage[e.page] ||= []).push(e.value); } for (const [p, v] of Object.entries(extByPage)) console.log(' ', p, [...new Set(v)].length, [...new Set(v)].slice(0, 12).join(' '));
