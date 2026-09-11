// Probe: ROT-GT-CRO- — live clones (rot.html, gron-teknik.html) + delivered family (designs/*.html)
import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const liveSpec = (p) => [
  { role: 'section', sel: `section.${p}` },
  { role: 'container', sel: `.${p}__container` },
  { role: 'h2', sel: `h2.${p}__main-heading, h2.${p}__gt-heading` },
  { role: 'h2-accent', sel: `h2.${p}__main-heading span, h2.${p}__gt-heading span` },
  { role: 'grid', sel: `.process-grid` },
  { role: 'step', sel: `.process-content` },
  { role: 'icon-desktop', sel: `.process-icon.icon-desktop` },
  { role: 'icon-mobile', sel: `.process-icon.icon-mobile` },
  { role: 'h3', sel: `h3.${p}__heading` },
  { role: 'p', sel: `.${p}__text-basic p` },
  { role: 'button', sel: `a.${p}__button` },
  { role: 'button-svg', sel: `a.${p}__button svg` },
  { role: 'connector', sel: `.process-grid svg, .process-grid canvas, .process-grid .connector, [class*="connector"]` },
];
const tokenProbe = () => {
  const cs = getComputedStyle(document.documentElement);
  const el = document.createElement('div'); document.body.appendChild(el);
  const px = (v) => { el.style.width = v; return parseFloat(getComputedStyle(el).width); };
  const res = {};
  for (const t of ['--aptext-sm', '--aptext-m', '--aptext-mm', '--aptext-mmm', '--aptext-ml', '--aptext-lm', '--aptext-xl', '--aptext-2xl', '--apspace-s', '--apspace-m', '--apspace-l', '--apspace-xl', '--apspace-3xl', '--apradius-l', '--space-xs', '--space-s', '--space-m']) res[t] = { raw: cs.getPropertyValue(t).trim(), px: px(`var(${t})`) };
  el.style.color = 'var(--color-7)'; res['--color-7'] = getComputedStyle(el).color;
  el.style.color = 'var(--color-8)'; res['--color-8'] = getComputedStyle(el).color;
  el.style.color = 'var(--color-13)'; res['--color-13'] = getComputedStyle(el).color;
  el.style.color = 'var(--color-20)'; res['--color-20'] = getComputedStyle(el).color;
  el.style.color = 'var(--color-21)'; res['--color-21'] = getComputedStyle(el).color;
  el.style.color = 'var(--color-22)'; res['--color-22'] = getComputedStyle(el).color;
  el.style.color = 'var(--color-23)'; res['--color-23'] = getComputedStyle(el).color;
  el.style.backgroundColor = 'var(--shadow-primary)'; res['--shadow-primary'] = getComputedStyle(el).backgroundColor;
  // connector lines injected by JS
  const grid = document.querySelector('.process-grid');
  const injected = grid ? [...grid.children].filter(c => !c.classList.contains('process-content')).map(c => ({ tag: c.tagName, cls: c.className && c.className.baseVal !== undefined ? c.className.baseVal : c.className, style: (c.getAttribute('style') || '').slice(0, 200), html: c.outerHTML.slice(0, 300) })) : null;
  const h2 = document.querySelector('h2');
  const h2html = h2 ? h2.innerHTML.slice(0, 300) : null;
  el.remove();
  return { tokens: res, injected, h2html };
};

const famSpec = [
  { role: 'wrapper', sel: '.ampy-avdrag' },
  { role: 'block', sel: '.av-block' },
  { role: 'grid', sel: '.av-grid' },
  { role: 'h2', sel: '.av-h2' },
  { role: 'h2-accent', sel: '.av-h2 .av-accent' },
  { role: 'steps-cap', sel: '.av-steps-cap' },
  { role: 'steps', sel: '.av-steps' },
  { role: 'step', sel: '.av-step' },
  { role: 'step-ring', sel: '.av-step .av-n' },
  { role: 'step-arc', sel: '.av-step .av-n .av-arc' },
  { role: 'step-trk', sel: '.av-step .av-n .av-trk' },
  { role: 'h3', sel: '.av-step h3' },
  { role: 'p', sel: '.av-step p' },
  { role: 'panel', sel: '.av-panel' },
  { role: 'panel-cap', sel: '.av-p-cap' },
  { role: 'row', sel: '.av-r-row' },
  { role: 'row-lbl', sel: '.av-r-row .av-lbl' },
  { role: 'row-dots', sel: '.av-r-row .av-dots' },
  { role: 'row-amt', sel: '.av-r-row .av-amt' },
  { role: 'offert-pill', sel: '.av-offert-pill' },
  { role: 'deduct-amt', sel: '.av-r-row.av-deduct .av-amt' },
  { role: 'total', sel: '.av-r-total' },
  { role: 'total-label', sel: '.av-r-total .av-t-label' },
  { role: 'total-amt', sel: '.av-r-total .av-amt' },
  { role: 'total-note', sel: '.av-r-total .av-t-note' },
  { role: 'fine', sel: '.av-fine' },
  { role: 'cta-wrap', sel: '.av-cta-wrap' },
  { role: 'cta', sel: '.av-cta' },
  { role: 'cta-arrow', sel: '.av-cta .av-cta-arrow' },
  { role: 'tel', sel: '.av-tel a, .av-sec-link a, .av-tel, .av-sec-link' },
  { role: 'wave-1', sel: '.av-hero-w1' },
  { role: 'wave-2', sel: '.av-hero-w2' },
  { role: 'wave-3', sel: '.av-hero-w3' },
  { role: 'blob-a', sel: '.av-blob-a' },
  { role: 'preview-label', sel: '.wf-label' },
];
const famExtra = () => {
  const b = document.querySelector('.av-block'); const g = document.querySelector('.av-grid'); const left = document.querySelector('.av-left'); const panel = document.querySelector('.av-panel');
  const r = (e) => e ? e.getBoundingClientRect() : null;
  const cs = b ? getComputedStyle(b) : null;
  const h2 = document.querySelector('.av-h2'); const cap = document.querySelector('.av-steps-cap'); const steps = document.querySelectorAll('.av-step');
  const rows = [...document.querySelectorAll('.av-r-row')].map(x => +x.getBoundingClientRect().height.toFixed(1));
  const stepGap = steps.length > 1 ? +(r(steps[1]).top - r(steps[0]).bottom).toFixed(1) : null;
  const h2ToCap = h2 && cap ? +(r(cap).top - r(h2).bottom).toFixed(1) : null;
  const gridCols = g ? getComputedStyle(g).gridTemplateColumns : null;
  return { blockPad: cs ? [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft] : null, blockRect: r(b) && { w: r(b).width, h: r(b).height }, gridCols, gap: g ? getComputedStyle(g).gap : null, leftW: r(left)?.width, panelW: r(panel)?.width, stepGap, h2ToCap, rows, h2Lines: (() => { if (!h2) return null; const range = document.createRange(); range.selectNodeContents(h2); const ys = [...new Set([...range.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.top)))]; return ys.length; })() };
};

const out = {};
for (const [name, file, spec, scope, extra] of [
  ['rot-live', 'kallor/ROT-GT-CRO-/rot.html', liveSpec('rot'), 'section.rot', tokenProbe],
  ['gt-live', 'kallor/ROT-GT-CRO-/gron-teknik.html', liveSpec('gron-teknik'), 'section.gron-teknik', tokenProbe],
  ['d2-rot', 'kallor/ROT-GT-CRO-/designs/d2-kvittot-forst.html', famSpec, '.ampy-avdrag', famExtra],
  ['gt-produkt', 'kallor/ROT-GT-CRO-/designs/gt-produkt.html', famSpec, '.ampy-avdrag', famExtra],
  ['gt-generisk', 'kallor/ROT-GT-CRO-/designs/gt-generisk.html', famSpec, '.ampy-avdrag', famExtra],
  ['hemforsakring', 'kallor/ROT-GT-CRO-/designs/hemforsakring.html', famSpec, '.ampy-avdrag', famExtra],
]) {
  const r = await measure({ root: repo, file, spec, colourScope: scope, extra });
  out[name] = r;
  for (const w of [1440, 390]) {
    const v = r.viewports[w];
    console.log(`\n===== ${name} @${w}  docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} ${v.body.fontFamily.slice(0, 30)} errors=${v.errors.length}`);
    for (const [role, d] of Object.entries(v.roles)) {
      if (!d) { console.log(`  ${role}: null`); continue; }
      console.log(`  ${role.padEnd(14)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} | sh ${d.boxShadow.slice(0, 70)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | "${d.text.slice(0, 30)}"`);
    }
    if (v.extra) console.log('  extra:', JSON.stringify(v.extra).slice(0, 1500));
    console.log('  colours:', v.colours.slice(0, 40).map(c => `${c.k} ×${c.n}`).join(' ; '));
  }
}
await writeFile(resolve(here, 'out/rot-gt-cro.json'), JSON.stringify(out, null, 1));
