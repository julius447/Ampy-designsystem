import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const spec = [
  { role: 'section', sel: '.eb' },
  { role: 'wrap', sel: '.eb__wrap' },
  { role: 'head', sel: '.eb__head' },
  { role: 'h2', sel: '.eb__title' },
  { role: 'grid', sel: '.eb__grid' },
  { role: 'aside', sel: '.eb__aside' },
  { role: 'call', sel: '.eb__call' },
  { role: 'status', sel: '.eb__status' },
  { role: 'status-pulse', sel: '.eb__status .pulse' },
  { role: 'call-lead', sel: '.eb__call-lead' },
  { role: 'call-lead-b', sel: '.eb__call-lead b' },
  { role: 'trust', sel: '.eb__trust' },
  { role: 'trust-li', sel: '.eb__trust li' },
  { role: 'trust-ic', sel: '.eb__trust-ic' },
  { role: 'cta', sel: '.eb__call .eb__cta' },
  { role: 'cta-txt', sel: '.eb__call .eb__cta-txt' },
  { role: 'cta-b', sel: '.eb__call .eb__cta-txt b' },
  { role: 'cta-ic', sel: '.eb__call .eb__cta-ic' },
  { role: 'cta-dot', sel: '.eb__call .eb__cta-dot' },
  { role: 'ground-d', sel: '.eb__ground--d' },
  { role: 'ground-m', sel: '.eb__ground--m' },
  { role: 'ground-b', sel: '.eb__ground b' },
  { role: 'list', sel: '.eb__list' },
  { role: 'row', sel: '.eb__row' },
  { role: 'row-open', sel: '.eb__row[aria-expanded="true"]' },
  { role: 'dot-akut', sel: '.eb__dot.d-akut' },
  { role: 'dot-varn', sel: '.eb__dot.d-varn' },
  { role: 'label', sel: '.eb__label' },
  { role: 'tag-varn', sel: '.eb__tag.t-varn' },
  { role: 'tag-akut', sel: '.eb__tag.t-akut' },
  { role: 'chev', sel: '.eb__chev' },
  { role: 'panel-pad', sel: '.eb__row[aria-expanded="true"] + .eb__panel .eb__panel-pad' },
  { role: 'risk', sel: '.eb__row[aria-expanded="true"] + .eb__panel .eb__risk' },
  { role: 'safety', sel: '.eb__row[aria-expanded="true"] + .eb__panel .eb__safety' },
  { role: 'safety-a', sel: '.eb__row[aria-expanded="true"] + .eb__panel .eb__safety a' },
  { role: 'act-cta', sel: '.eb__row[aria-expanded="true"] + .eb__panel .eb__act .eb__cta' },
  { role: 'more', sel: '.eb__more' },
];
const extra = () => {
  const r = e => e ? e.getBoundingClientRect() : null;
  const rows = [...document.querySelectorAll('.eb__row')].map(x => +r(x).height.toFixed(1));
  const aside = document.querySelector('.eb__aside'), list = document.querySelector('.eb__list');
  const g = getComputedStyle(document.querySelector('.eb__grid'));
  const el = document.createElement('div'); document.body.appendChild(el); const col = (v) => { el.style.color = v; return getComputedStyle(el).color; };
  const toks = {}; for (const t of ['--bg', '--surface', '--ink', '--ink-body', '--ink-soft', '--teal', '--teal-dark', '--teal-pill', '--teal-tint', '--line', '--akut-bg', '--akut-ink', '--akut-dot', '--akut-line', '--varn-bg', '--varn-ink', '--varn-dot']) toks[t] = col(`var(${t})`);
  el.remove();
  return { rows, asideW: r(aside)?.width, listW: r(list)?.width, gridCols: g.gridTemplateColumns, colGap: g.columnGap, visibleRows: document.querySelectorAll('.eb__item:not(.eb__item--more)').length, hiddenRows: document.querySelectorAll('.eb__item--more').length, toks, ctaGrad: getComputedStyle(document.querySelector('.eb__cta')).backgroundImage };
};
const beforeMeasure = async (page) => { await page.click('#row-laddbox'); await page.waitForTimeout(500); };

const r = await measure({ root: repo, file: 'kallor/Eljour-block/index.html', spec, colourScope: '.eb', extra, beforeMeasure });
for (const w of [1440, 390]) {
  const v = r.viewports[w];
  console.log(`\n===== eljour @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} ${v.body.color} errors=${v.errors.length}`);
  for (const [role, d] of Object.entries(v.roles)) {
    if (!d) { console.log(`  ${role}: null`); continue; }
    console.log(`  ${role.padEnd(12)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} ${d.backgroundImage !== 'none' ? d.backgroundImage.slice(0, 70) : ''} | bd ${d.borderTopWidth} ${d.borderTopColor} | sh ${d.boxShadow.slice(0, 80)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | maxW ${d.maxWidth} | minH ${d.minHeight} | tr ${d.transition.slice(0, 50)}`);
  }
  console.log('  extra:', JSON.stringify(v.extra));
  console.log('  colours:', v.colours.slice(0, 30).map(c => `${c.k} ×${c.n}`).join(' ; '));
}
await writeFile(resolve(here, 'out/eljour-block.json'), JSON.stringify(r, null, 1));
