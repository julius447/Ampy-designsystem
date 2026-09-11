import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const spec = [
  { role: 'section', sel: '.afk' },
  { role: 'kort', sel: '.afk__kort' },
  { role: 'eyebrow', sel: '.afk__eyebrow' },
  { role: 'eyebrow-glyf', sel: '.afk__eyebrow .afk__glyf' },
  { role: 'h2', sel: '.afk__h2' },
  { role: 'h2-fraga', sel: '.afk__h2-fraga' },
  { role: 'h2-svar', sel: '.afk__h2-svar' },
  { role: 'lead', sel: '.afk__lead' },
  { role: 'info', sel: '.afk__info' },
  { role: 'info-text', sel: '.afk__info-text' },
  { role: 'info-akut', sel: '.afk__info-rad--akut .afk__info-text' },
  { role: 'info-glyf', sel: '.afk__info-glyf .afk__glyf' },
  { role: 'tel', sel: '.afk__tel' },
  { role: 'guide-rubrik', sel: '.afk__guide-rubrik' },
  { role: 'sakerhet', sel: '.afk__sakerhet .afk__info-text' },
  { role: 'foto-stapel', sel: '.afk__stapel--foto' },
  { role: 'chip', sel: '.afk__chip' },
  { role: 'stapel-text', sel: '.afk__stapel-text' },
  { role: 'ansvar', sel: '.afk__ansvar' },
  { role: 'label', sel: '.afk__label' },
  { role: 'input', sel: '.afk__input' },
  { role: 'submit', sel: '.afk__submit' },
  { role: 'submit-glyf', sel: '.afk__submit .afk__glyf' },
  { role: 'candour', sel: '.afk__candour' },
  { role: 'gdpr', sel: '.afk__gdpr' },
  { role: 'gdpr-a', sel: '.afk__gdpr a' },
  { role: 'form', sel: '.afk__form' },
  { role: 'faltpar', sel: '.afk__faltpar' },
];
const extra = () => {
  const r = e => e ? e.getBoundingClientRect() : null;
  const staplar = [...document.querySelectorAll('.afk__stapel, .afk__input, .afk__submit')].map(s => ({ cls: s.className.split(' ')[0], h: +r(s).height.toFixed(1), w: +r(s).width.toFixed(1) }));
  const kort = getComputedStyle(document.querySelector('.afk__kort'));
  return { staplar, kortGrid: kort.gridTemplateColumns, kortGap: kort.columnGap, kortW: r(document.querySelector('.afk__kort')).width, formW: r(document.querySelector('.afk__form'))?.width, bodyW: document.body.getBoundingClientRect().width };
};
const out = {};
for (const [name, file, w] of [['mobil', 'kallor/Fotobed-mning-CRO-/v2/preview/_vy-m-elcentral.html', 390], ['desktop', 'kallor/Fotobed-mning-CRO-/v2/preview/_vy-d-elcentral.html', 1440]]) {
  const r = await measure({ root: repo, file, spec, colourScope: '.afk', extra, viewports: [[w, w === 390 ? 844 : 1000]] });
  out[name] = r;
  const v = r.viewports[w];
  console.log(`\n===== ${name} @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} errors=${v.errors.length}`);
  for (const [role, d] of Object.entries(v.roles)) {
    if (!d) { console.log(`  ${role}: null`); continue; }
    console.log(`  ${role.padEnd(12)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} ${d.backgroundImage !== 'none' ? d.backgroundImage.slice(0, 60) : ''} | bd ${d.borderTopWidth} ${d.borderTopColor} | sh ${d.boxShadow.slice(0, 100)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | maxW ${d.maxWidth} | minH ${d.minHeight} | tr ${d.transition.slice(0, 40)}`);
  }
  console.log('  extra:', JSON.stringify(v.extra));
  console.log('  colours:', v.colours.slice(0, 26).map(c => `${c.k} ×${c.n}`).join(' ; '));
}
await writeFile(resolve(here, 'out/fotobedomningen.json'), JSON.stringify(out, null, 1));
