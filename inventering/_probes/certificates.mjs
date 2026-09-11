import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const v2Spec = [
  { role: 'section', sel: '.cert' },
  { role: 'inner', sel: '.cert__inner' },
  { role: 'intro', sel: '.cert__intro' },
  { role: 'h2', sel: '.cert__heading' },
  { role: 'p', sel: '.cert__text' },
  { role: 'marks', sel: '.cert__marks' },
  { role: 'mark', sel: '.cert__mark' },
  { role: 'mark-in', sel: '.cert__mark--in img' },
  { role: 'mark-esv', sel: '.cert__mark--esv img' },
  { role: 'mark-id06', sel: '.cert__mark--id06 img' },
  { role: 'mark-th', sel: '.cert__mark--th img' },
  { role: 'glow', sel: '.cert__glow' },
  { role: 'bg', sel: '.cert__bg' },
  { role: 'bg-svg', sel: '.cert__bg svg' },
];
const v2Extra = () => {
  const marks = [...document.querySelectorAll('.cert__mark')].map(m => { const r = m.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; });
  const h2 = document.querySelector('.cert__heading'), p = document.querySelector('.cert__text');
  const lines = (el) => { const range = document.createRange(); range.selectNodeContents(el); return [...new Set([...range.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.top)))].length; };
  const svg = document.querySelector('.cert__bg svg');
  const fills = svg ? [...svg.querySelectorAll('[fill], [stop-color]')].map(e => e.getAttribute('fill') || e.getAttribute('stop-color')).filter(Boolean).slice(0, 12) : null;
  const gap = marks.length > 1 ? { col: +(marks[1].x - marks[0].x - marks[0].w).toFixed(1), row: marks.length > 2 ? +(marks[2].y - marks[0].y - marks[0].h).toFixed(1) : null } : null;
  return { marks, gap, h2Lines: lines(h2), pLines: lines(p), svgFills: fills, sectionH: document.querySelector('.cert').getBoundingClientRect().height };
};

const baseSpec = [
  { role: 'section', sel: 'section.certificates' },
  { role: 'container', sel: '.certificates__container' },
  { role: 'block', sel: '.certificates__block' },
  { role: 'h3', sel: '.certificates__heading' },
  { role: 'p', sel: '.certificates__text-basic' },
  { role: 'grid', sel: '.certificates__partners' },
  { role: 'card', sel: '.certificates__div' },
  { role: 'logo', sel: '.certificates__logo' },
  { role: 'bg-image', sel: '.certificates__bg-image' },
];
const baseExtra = () => {
  const cards = [...document.querySelectorAll('.certificates__div')].map(m => { const r = m.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; });
  const gap = cards.length > 3 ? { col: +(cards[1].x - cards[0].x - cards[0].w).toFixed(1), row: +(cards[3].y - cards[0].y - cards[0].h).toFixed(1) } : null;
  const logos = [...document.querySelectorAll('.certificates__logo')].map(i => ({ src: i.getAttribute('src').split('/').pop(), w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height }));
  return { cards, gap, logos, sectionH: document.querySelector('section.certificates').getBoundingClientRect().height };
};

const out = {};
for (const [name, file, spec, scope, extra] of [
  ['v2', 'kallor/Certificates/redesign/index.html', v2Spec, '.cert', v2Extra],
  ['baseline', 'kallor/Certificates/index.html', baseSpec, 'section.certificates', baseExtra],
]) {
  const r = await measure({ root: repo, file, spec, colourScope: scope, extra });
  out[name] = r;
  for (const w of [1440, 390]) {
    const v = r.viewports[w];
    console.log(`\n===== ${name} @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} errors=${v.errors.length}`);
    for (const [role, d] of Object.entries(v.roles)) {
      if (!d) { console.log(`  ${role}: null`); continue; }
      console.log(`  ${role.padEnd(10)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} ${d.backgroundImage !== 'none' ? d.backgroundImage.slice(0, 80) : ''} | sh ${d.boxShadow.slice(0, 90)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | maxW ${d.maxWidth} | tr ${d.transition.slice(0, 40)}`);
    }
    console.log('  extra:', JSON.stringify(v.extra));
    console.log('  colours:', v.colours.slice(0, 24).map(c => `${c.k} ×${c.n}`).join(' ; '));
  }
}
await writeFile(resolve(here, 'out/certificates.json'), JSON.stringify(out, null, 1));
