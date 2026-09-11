// Article template: Vite/React build made in the scratchpad (never in kallor/). Serve dist/ and measure.
import { measure, fmt, serve } from './lib.mjs';
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const distRoot = '/private/tmp/claude-501/-Users-juliuscallahan-Desktop-Claude-Code/99d99428-a3f5-43ec-9ad9-e358153dd420/scratchpad/article-build/dist';

const spec = [
  { role: 'body', sel: 'body' },
  { role: 'nav', sel: 'header, nav' },
  { role: 'breadcrumb', sel: 'nav[aria-label*="rödsmul" i], nav[aria-label*="readcrumb" i], ol' },
  { role: 'h1', sel: 'h1' },
  { role: 'hero-intro', sel: 'h1 + p, header p' },
  { role: 'byline', sel: '[class*="author" i], [class*="byline" i]' },
  { role: 'toc', sel: 'aside nav, [class*="toc" i], aside' },
  { role: 'toc-link', sel: 'aside a' },
  { role: 'quick-answer', sel: '[class*="quick" i], [id*="quick" i], [id*="snabb" i]' },
  { role: 'article-body', sel: '.article-body' },
  { role: 'p', sel: '.article-body p' },
  { role: 'h2', sel: '.article-body h2' },
  { role: 'h3', sel: '.article-body h3' },
  { role: 'ul', sel: '.article-body ul' },
  { role: 'li', sel: '.article-body li' },
  { role: 'a', sel: '.article-body a' },
  { role: 'strong', sel: '.article-body strong' },
  { role: 'table', sel: 'table' },
  { role: 'th', sel: 'th' },
  { role: 'td', sel: 'td' },
  { role: 'blockquote', sel: 'blockquote' },
  { role: 'figure', sel: 'figure' },
  { role: 'faq-summary', sel: 'details summary, [class*="faq" i] button' },
  { role: 'btn-primary', sel: '.btn-primary' },
  { role: 'btn-secondary', sel: '.btn-secondary' },
  { role: 'footer', sel: 'footer' },
];
const extra = () => {
  const r = e => e ? e.getBoundingClientRect() : null;
  const hs = [...document.querySelectorAll('h1,h2,h3,h4')].slice(0, 40).map(h => { const cs = getComputedStyle(h); return { tag: h.tagName, fs: cs.fontSize, fw: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, color: cs.color, cls: h.className.slice(0, 60), text: h.textContent.trim().slice(0, 40) }; });
  const sections = [...document.querySelectorAll('section, [class*="rounded-2xl"], [class*="rounded-3xl"]')].slice(0, 30).map(s => { const cs = getComputedStyle(s); return { cls: (s.className || '').toString().slice(0, 90), bg: cs.backgroundColor, r: cs.borderRadius, sh: cs.boxShadow.slice(0, 80), pad: cs.padding, w: +r(s).width.toFixed(0) }; });
  const body = document.querySelector('.article-body'); const main = document.querySelector('main') || document.querySelector('article');
  const radii = {}, shadows = {}, colors = {};
  for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); if (cs.borderRadius !== '0px') radii[cs.borderRadius] = (radii[cs.borderRadius] || 0) + 1; if (cs.boxShadow !== 'none') shadows[cs.boxShadow.slice(0, 90)] = (shadows[cs.boxShadow.slice(0, 90)] || 0) + 1; if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors[cs.backgroundColor] = (colors[cs.backgroundColor] || 0) + 1; }
  return { headings: hs, sections, bodyW: r(body)?.width, mainW: r(main)?.width, radii, shadows: Object.entries(shadows).sort((a, b) => b[1] - a[1]).slice(0, 8), bgColors: Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 14), componentsCount: document.querySelectorAll('main section, article section').length };
};
const r = await measure({ root: distRoot, file: 'index.html', spec, colourScope: 'body', extra, beforeMeasure: async (p) => { await p.waitForTimeout(1200); } });
for (const w of [1440, 390]) {
  const v = r.viewports[w];
  console.log(`\n===== article @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} ${v.body.color} ${v.body.backgroundColor} errors=${v.errors.length}`);
  for (const [role, d] of Object.entries(v.roles)) {
    if (!d) { console.log(`  ${role}: null`); continue; }
    console.log(`  ${role.padEnd(13)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} | bd ${d.borderTopWidth} ${d.borderTopColor} | sh ${d.boxShadow.slice(0, 70)} | mt ${d.marginTop} mb ${d.marginBottom} | maxW ${d.maxWidth} | n=${d.count}`);
  }
  console.log('  extra:', JSON.stringify(v.extra).slice(0, 6000));
  console.log('  colours:', v.colours.slice(0, 30).map(c => `${c.k} ×${c.n}`).join(' ; '));
}
await writeFile(resolve(here, 'out/article-template.json'), JSON.stringify(r, null, 1));

const srv = await serve(distRoot); const browser = await chromium.launch();
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(srv.url('index.html'), { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(repo, 'inventering/skarmdumpar', `article-template-${name}.png`), fullPage: true });
  await page.close();
}
await browser.close(); srv.server.close();
