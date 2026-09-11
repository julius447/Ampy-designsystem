import { measure, fmt, serve } from './lib.mjs';
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const spec = [
  { role: 'bar', sel: '.acb' },
  { role: 'bar-cta', sel: '.acb__cta' },
  { role: 'bar-txt', sel: '.acb__txt' },
  { role: 'bar-b', sel: '.acb__txt b' },
  { role: 'bar-ic', sel: '.acb__ic' },
  { role: 'bar-ic-svg', sel: '.acb__ic svg' },
  { role: 'card', sel: '.acb-card' },
  { role: 'card-lead', sel: '.acb-card__lead' },
  { role: 'card-cta', sel: '.acb-card__cta' },
  { role: 'card-verb', sel: '.acb-card__verb' },
  { role: 'card-num', sel: '.acb-card__num' },
  { role: 'card-ic', sel: '.acb-card__ic' },
  { role: 'aside-sticky', sel: '.eb__aside' },
  { role: 'body', sel: 'body' },
];
const extra = () => {
  const bar = document.querySelector('.acb'); const card = document.querySelector('.acb-card');
  const r = e => e ? e.getBoundingClientRect() : null;
  const b = getComputedStyle(document.body);
  return { barClasses: bar ? bar.className : null, barRect: r(bar) && { y: r(bar).y, h: r(bar).height, bottomGap: innerHeight - r(bar).bottom }, cardRect: r(card) && { x: r(card).x, y: r(card).y, w: r(card).width, h: r(card).height, rightGap: innerWidth - r(card).right, bottomGap: innerHeight - r(card).bottom }, bodyPadBottom: b.paddingBottom, bodyClass: document.body.className, ctaCenterFromBottom: (() => { const c = document.querySelector('.acb__cta'); return c ? innerHeight - (r(c).top + r(c).height / 2) : null; })(), asidePos: (() => { const a = document.querySelector('.eb__aside'); return a ? getComputedStyle(a).position + ' top:' + getComputedStyle(a).top : null; })(), keyframes: [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } }).filter(x => x.type === 7).map(x => x.name) };
};
const before = async (page) => { await page.waitForTimeout(1500); };

const out = {};
for (const [name, file] of [['mobil-a-eljour', 'kallor/Eljour-sticky-bar/preview/states/a-eljour.html'], ['desktop', 'kallor/Eljour-sticky-bar/preview/states/desktop.html']]) {
  const r = await measure({ root: repo, file, spec, colourScope: 'body', extra, beforeMeasure: before });
  out[name] = r;
  for (const w of [1440, 390]) {
    const v = r.viewports[w];
    console.log(`\n===== ${name} @${w} docH=${v.docH} root=${v.rootFs} errors=${v.errors.length}`);
    for (const [role, d] of Object.entries(v.roles)) {
      if (!d) { console.log(`  ${role}: null`); continue; }
      console.log(`  ${role.padEnd(12)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} ${d.backgroundImage !== 'none' ? d.backgroundImage.slice(0, 70) : ''} | bd ${d.borderTopWidth} ${d.borderTopColor} | sh ${d.boxShadow.slice(0, 110)} | gap ${d.gap} | pos ${d.position} ${d.bottom} z${d.zIndex} | disp ${d.display} | tr ${d.transition.slice(0, 60)}`);
    }
    console.log('  extra:', JSON.stringify(v.extra));
  }
}
await writeFile(resolve(here, 'out/eljour-sticky-bar.json'), JSON.stringify(out, null, 1));

// viewport-clipped screenshots (fixed elements need the real viewport)
const srv = await serve(repo);
const browser = await chromium.launch();
for (const [file, outName, w, h, scrollTo] of [
  ['kallor/Eljour-sticky-bar/preview/states/a-eljour.html', 'eljour-sticky-bar-mobile-viewport', 390, 844, 600],
  ['kallor/Eljour-sticky-bar/preview/states/desktop.html', 'eljour-sticky-bar-hornkort-viewport', 1440, 900, 700],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(srv.url(file), { waitUntil: 'networkidle' });
  await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: resolve(repo, 'inventering/skarmdumpar', outName + '.png') });
  await page.close();
}
await browser.close(); srv.server.close();
