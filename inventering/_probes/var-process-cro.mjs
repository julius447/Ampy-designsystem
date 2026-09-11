import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const spec = [
  { role: 'section', sel: '.ampy-process' },
  { role: 'inner', sel: '.ampy-process__inner' },
  { role: 'h2', sel: '.ampy-process__title' },
  { role: 'sub', sel: '.ampy-process__sub' },
  { role: 'steps', sel: '.ampy-process__steps' },
  { role: 'step', sel: '.ampy-process__step' },
  { role: 'num', sel: '.ampy-process__num' },
  { role: 'num-2', sel: '.ampy-process__num', nth: 1 },
  { role: 'label', sel: '.ampy-process__label' },
  { role: 'chip', sel: '.ampy-process__chip' },
  { role: 'body', sel: '.ampy-process__body' },
  { role: 'body-a', sel: '.ampy-process__body a' },
  { role: 'time', sel: '.ampy-process__time' },
  { role: 'trust', sel: '.ampy-process__trust' },
  { role: 'trust-li', sel: '.ampy-process__trust li' },
  { role: 'handoff', sel: '.ampy-process__handoff' },
  { role: 'handoff-label', sel: '.ampy-process__handoff-label' },
  { role: 'arrow', sel: '.ampy-process__arrow' },
  { role: 'note', sel: '.ampy-process__note' },
  { role: 'card', sel: '.ampy-process__card' },
  { role: 'pv-bar', sel: '.pv-bar' },
];
const extra = () => {
  const r = e => e ? e.getBoundingClientRect() : null;
  const steps = [...document.querySelectorAll('.ampy-process__step')].map(s => ({ y: +r(s).y.toFixed(1), h: +r(s).height.toFixed(1), x: +r(s).x.toFixed(1), w: +r(s).width.toFixed(1) }));
  const gaps = steps.slice(1).map((s, i) => +(s.y - steps[i].y - steps[i].h).toFixed(1));
  const sec = document.querySelector('.ampy-process'); const h2 = document.querySelector('.ampy-process__title'); const stepsEl = document.querySelector('.ampy-process__steps'); const inner = document.querySelector('.ampy-process__inner');
  const g = inner ? getComputedStyle(inner) : null;
  const rail = document.querySelector('.ampy-process--rail .ampy-process__step'); const railBefore = rail ? getComputedStyle(rail, '::before') : null;
  const secH = r(sec).height; const pv = document.querySelector('.pv-bar'); const pvH = pv ? r(pv).height : 0;
  return { secH: +secH.toFixed(1), blockHeightExPreviewBar: +(document.documentElement.scrollHeight - pvH).toFixed(1), steps, gaps, h2ToSteps: h2 && stepsEl ? +(r(stepsEl).top - r(h2).bottom).toFixed(1) : null, innerGrid: g ? g.gridTemplateColumns : null, innerPad: g ? [g.paddingTop, g.paddingRight, g.paddingBottom, g.paddingLeft] : null, railLine: railBefore ? { w: railBefore.width, bg: railBefore.backgroundColor, left: railBefore.left } : null, fonts: [...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.status).slice(0, 6) };
};

const out = {};
for (const [name, file] of [['v2-a-rail', 'kallor/V-r-process-CRO-/v2/a-rail.html'], ['v2-c-tid', 'kallor/V-r-process-CRO-/v2/c-tid.html'], ['v1-a-rail', 'kallor/V-r-process-CRO-/a-rail.html'], ['v1-b-cards', 'kallor/V-r-process-CRO-/b-cards.html'], ['v1-c-tid', 'kallor/V-r-process-CRO-/c-tid.html']]) {
  const r = await measure({ root: repo, file, spec, colourScope: '.ampy-process', extra });
  out[name] = r;
  for (const w of [1440, 390]) {
    const v = r.viewports[w];
    console.log(`\n===== ${name} @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} errors=${v.errors.length}`);
    for (const [role, d] of Object.entries(v.roles)) {
      if (!d) continue;
      console.log(`  ${role.padEnd(13)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} | bd ${d.borderTopWidth} ${d.borderTopColor} | sh ${d.boxShadow.slice(0, 90)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | maxW ${d.maxWidth}`);
    }
    console.log('  extra:', JSON.stringify(v.extra));
    console.log('  colours:', v.colours.slice(0, 20).map(c => `${c.k} ×${c.n}`).join(' ; '));
  }
}
await writeFile(resolve(here, 'out/var-process-cro.json'), JSON.stringify(out, null, 1));
