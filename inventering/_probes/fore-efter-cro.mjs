import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const spec = [
  { role: 'section', sel: '.ampy-foreefter' },
  { role: 'inner', sel: '.ampy-foreefter__inner' },
  { role: 'h2', sel: '.ampy-foreefter__rubrik' },
  { role: 'h2-accent', sel: '.ampy-foreefter__accent' },
  { role: 'par', sel: '.ampy-foreefter__par' },
  { role: 'figur', sel: '.ampy-foreefter__figur' },
  { role: 'ram', sel: '.ampy-foreefter__ram' },
  { role: 'bild', sel: '.ampy-foreefter__bild' },
  { role: 'somlinje', sel: '.ampy-foreefter__somlinje' },
  { role: 'handtag', sel: '.ampy-foreefter__handtag' },
  { role: 'handtag-svg', sel: '.ampy-foreefter__handtag svg' },
  { role: 'ledtrad', sel: '.ampy-foreefter__ledtrad' },
  { role: 'chip-fore', sel: '.ampy-foreefter__chip--fore' },
  { role: 'chip-efter', sel: '.ampy-foreefter__chip--efter' },
  { role: 'reglage', sel: '.ampy-foreefter__reglage' },
  { role: 'tagline', sel: '.ampy-foreefter__tagline' },
  { role: 'mockup-note', sel: '.mockup-note' },
];
const extra = () => {
  const r = e => e ? e.getBoundingClientRect() : null;
  const figs = [...document.querySelectorAll('.ampy-foreefter__figur')].map(f => ({ x: +r(f).x.toFixed(1), w: +r(f).width.toFixed(1), h: +r(f).height.toFixed(1) }));
  const el = document.querySelector('.ampy-foreefter');
  const cs = getComputedStyle(el);
  const pos = getComputedStyle(document.querySelector('.ampy-foreefter__figur')).getPropertyValue('--ampyfe-pos');
  const h2 = document.querySelector('.ampy-foreefter__rubrik'); const par = document.querySelector('.ampy-foreefter__par'); const tag = document.querySelector('.ampy-foreefter__tagline');
  return { figs, gap: figs.length > 1 ? +(figs[1].x - figs[0].x - figs[0].w).toFixed(1) : null, pos, h2ToPar: +(r(par).top - r(h2).bottom).toFixed(1), parToTag: tag ? +(r(tag).top - r(par).bottom).toFixed(1) : null, bg: cs.backgroundImage.slice(0, 200), tokens: Object.fromEntries(['--ampyfe-text-rubrik', '--ampyfe-space-2xl', '--ampyfe-space-l', '--ampyfe-space-m', '--ampyfe-radie-l'].map(t => [t, cs.getPropertyValue(t).trim()])) };
};
const r = await measure({ root: repo, file: 'kallor/f-re-efter-CRO-/index.html', spec, colourScope: '.ampy-foreefter', extra });
for (const w of [1440, 390]) {
  const v = r.viewports[w];
  console.log(`\n===== fore-efter @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} ${v.body.color} errors=${v.errors.length}`);
  for (const [role, d] of Object.entries(v.roles)) {
    if (!d) { console.log(`  ${role}: null`); continue; }
    console.log(`  ${role.padEnd(12)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} ${d.backgroundImage !== 'none' ? d.backgroundImage.slice(0, 60) : ''} | bd ${d.borderTopWidth} ${d.borderTopColor} | sh ${d.boxShadow.slice(0, 100)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | bf ${d.backdropFilter} | tr ${d.transition.slice(0, 40)}`);
  }
  console.log('  extra:', JSON.stringify(v.extra));
  console.log('  colours:', v.colours.slice(0, 26).map(c => `${c.k} ×${c.n}`).join(' ; '));
}
await writeFile(resolve(here, 'out/fore-efter-cro.json'), JSON.stringify(r, null, 1));
