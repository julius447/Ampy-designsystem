// visste-du-att lives outside the repo (/Users/.../Claude Code/visste-du-att). Served from its own root.
import { measure, fmt, serve } from './lib.mjs';
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const vdaRoot = '/Users/juliuscallahan/Desktop/Claude Code/visste-du-att';
const liveTokens = await readFile(resolve(repo, 'kallor/live-ampy-se/global-variables.css'), 'utf8');

const spec = [
  { role: 'section', sel: '.visste-du-att' },
  { role: 'card', sel: '.visste-du-att__card' },
  { role: 'content', sel: '.visste-du-att__content' },
  { role: 'kicker', sel: '.visste-du-att__kicker' },
  { role: 'kicker-svg', sel: '.visste-du-att__kicker svg' },
  { role: 'h2', sel: '.visste-du-att__heading' },
  { role: 'text', sel: '.visste-du-att__text' },
  { role: 'media', sel: '.visste-du-att__media' },
  { role: 'bulb', sel: '.visste-du-att__bulb' },
];
const extra = () => {
  const c = document.querySelector('.visste-du-att__card'); const cs = getComputedStyle(c); const before = getComputedStyle(c, '::before');
  const el = document.createElement('div'); document.body.appendChild(el);
  const px = (v) => { el.style.width = v; return parseFloat(getComputedStyle(el).width); };
  const toks = {}; for (const t of ['--aptext-l', '--aptext-2xl', '--aptext-m', '--apspace-2xl', '--apspace-s', '--apspace-l', '--apradius-l']) toks[t] = px(`var(${t})`);
  el.remove();
  return { grid: cs.gridTemplateColumns, gap: cs.gap, glow: before.backgroundImage.slice(0, 220), toks, visible: c.classList.contains('is-visible') };
};
const before = async (page) => { await page.evaluate(() => document.getElementById('vdaCard')?.classList.add('is-visible')); await page.waitForTimeout(400); };

const out = {};
// 1) prototype as-is (mirrored theme-style tokens)
out.prototyp = await measure({ root: vdaRoot, file: 'index.html', spec, colourScope: '.visste-du-att', extra, beforeMeasure: before });
// 2) same page with the LIVE global-variables.css injected last (production token values)
out.prod_tokens = await measure({ root: vdaRoot, file: 'index.html', spec, colourScope: '.visste-du-att', extra, beforeMeasure: async (page) => { await page.addStyleTag({ content: liveTokens }); await before(page); } });
for (const [name, r] of Object.entries(out)) for (const w of [1440, 390]) {
  const v = r.viewports[w];
  console.log(`\n===== ${name} @${w} docH=${v.docH} root=${v.rootFs} errors=${v.errors.length}`);
  for (const [role, d] of Object.entries(v.roles)) {
    if (!d) { console.log(`  ${role}: null`); continue; }
    console.log(`  ${role.padEnd(10)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} | sh ${d.boxShadow.slice(0, 60)} | gap ${d.gap} | maxW ${d.maxWidth} | tr ${d.transition.slice(0, 50)}`);
  }
  console.log('  extra:', JSON.stringify(v.extra));
  console.log('  colours:', v.colours.slice(0, 16).map(c => `${c.k} ×${c.n}`).join(' ; '));
}
await writeFile(resolve(here, 'out/visste-du-att.json'), JSON.stringify(out, null, 1));

// screenshots (shot.mjs can't serve outside the repo)
const srv = await serve(vdaRoot); const browser = await chromium.launch();
for (const [name, w, h] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(srv.url('index.html'), { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.screenshot({ path: resolve(repo, 'inventering/skarmdumpar', `visste-du-att-${name}.png`), fullPage: true });
  await page.addStyleTag({ content: liveTokens }); await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(repo, 'inventering/skarmdumpar', `visste-du-att-prodtokens-${name}.png`), fullPage: true });
  await page.close();
}
await browser.close(); srv.server.close();
