import { measure, fmt } from './lib.mjs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');

const v1Spec = [
  { role: 'section', sel: '.ampy-testimonials' },
  { role: 'inner', sel: '.ampy-testimonials__inner' },
  { role: 'head', sel: '.att-head' },
  { role: 'h2', sel: '.att-heading' },
  { role: 'sub', sel: '.att-sub' },
  { role: 'slider', sel: '.att-slider' },
  { role: 'list', sel: '.splide__list' },
  { role: 'slide', sel: '.splide__slide', nth: 1 },
  { role: 'card', sel: '.att-card', nth: 1 },
  { role: 'card-top', sel: '.att-card__top' },
  { role: 'quote', sel: '.att-card__quote' },
  { role: 'google', sel: '.att-card__google' },
  { role: 'body', sel: '.att-card__body' },
  { role: 'text', sel: '.att-card__text' },
  { role: 'name', sel: '.att-card__name' },
  { role: 'divider', sel: '.att-card__divider' },
  { role: 'stars', sel: '.att-card__stars' },
  { role: 'star', sel: '.att-card__stars svg' },
  { role: 'date', sel: '.att-card__date' },
  { role: 'nav', sel: '.att-nav' },
  { role: 'dot', sel: '.att-dot', nth: 1 },
  { role: 'dot-active', sel: '.att-dot.is-active' },
  { role: 'dot-fill', sel: '.att-dot.is-active .att-dot__fill' },
  { role: 'rating', sel: '.att-rating' },
  { role: 'badge', sel: '.att-badge' },
  { role: 'badge-star', sel: '.att-badge__stars svg' },
  { role: 'badge-text', sel: '.att-badge__text' },
  { role: 'badge-strong', sel: '.att-badge__text strong' },
];
const v1Extra = () => {
  const cards = [...document.querySelectorAll('.att-card')].map(c => { const r = c.getBoundingClientRect(); return { x: +r.x.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; });
  const slides = [...document.querySelectorAll('.splide__slide')];
  const vis = slides.filter(s => { const r = s.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; }).length;
  const gap = cards.length > 1 ? +(cards[1].x - cards[0].x - cards[0].w).toFixed(1) : null;
  const cfg = window.__attSplide ? null : null;
  const dots = [...document.querySelectorAll('.att-dot')].map(d => { const r = d.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), active: d.classList.contains('is-active') }; });
  const h2 = document.querySelector('.att-heading'); const sub = document.querySelector('.att-sub'); const slider = document.querySelector('.att-slider');
  const r = e => e ? e.getBoundingClientRect() : null;
  return { cardCount: cards.length, visibleSlides: vis, gap, cards: cards.slice(0, 4), dots, h2ToSub: h2 && sub ? +(r(sub).top - r(h2).bottom).toFixed(1) : null, headToSlider: (sub || h2) && slider ? +(r(slider).top - r(sub && getComputedStyle(sub).display !== 'none' ? sub : h2).bottom).toFixed(1) : null, splideVersion: window.Splide && window.Splide.VERSION || null };
};

const baseSpec = [
  { role: 'section', sel: 'section.testimonial' },
  { role: 'container', sel: '.testimonial__container' },
  { role: 'white-bg', sel: '.testimonial__white-bg' },
  { role: 'block', sel: '.testimonial__block' },
  { role: 'h2', sel: '.testimonial__heading' },
  { role: 'h2-accent', sel: '.testimonial__heading span' },
  { role: 'slider', sel: '.testimonial__slider-nested' },
  { role: 'card', sel: '.testimonial__testimonial-card', nth: 0 },
  { role: 'card-div', sel: '.testimonial__div' },
  { role: 'name', sel: '.testimonial__name' },
  { role: 'text', sel: '.testimonial__text-basic' },
  { role: 'stars', sel: '.testimonial__stars' },
  { role: 'star', sel: '.testimonial__stars i' },
  { role: 'google', sel: '.testimonial__testimonial-card svg, .testimonial__testimonial-card img' },
  { role: 'pagination', sel: '.splide__pagination' },
  { role: 'page-dot', sel: '.splide__pagination__page' },
  { role: 'page-dot-active', sel: '.splide__pagination__page.is-active' },
];
const baseExtra = () => {
  const cards = [...document.querySelectorAll('.testimonial__testimonial-card')].map(c => { const r = c.getBoundingClientRect(); return { x: +r.x.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; });
  const gap = cards.length > 1 ? +(cards[1].x - cards[0].x - cards[0].w).toFixed(1) : null;
  const el = document.createElement('div'); document.body.appendChild(el);
  const col = (v) => { el.style.color = v; return getComputedStyle(el).color; };
  const out = { cardCount: cards.length, gap, cards: cards.slice(0, 3), brightgreen: col('var(--brightgreen)'), color5: col('var(--color-5)'), white: col('var(--white)') };
  el.remove();
  const slider = document.querySelector('.testimonial__slider-nested');
  out.sliderData = slider ? (slider.getAttribute('data-splide') || '').slice(0, 400) : null;
  return out;
};

const out = {};
for (const [name, file, spec, scope, extra] of [
  ['v1', 'kallor/Testimonials-block/delivery/preview.html', v1Spec, '.ampy-testimonials', v1Extra],
  ['baseline', 'kallor/Testimonials-block/index.html', baseSpec, 'section.testimonial', baseExtra],
]) {
  const r = await measure({ root: repo, file, spec, colourScope: scope, extra });
  out[name] = r;
  for (const w of [1440, 390]) {
    const v = r.viewports[w];
    console.log(`\n===== ${name} @${w} docH=${v.docH} root=${v.rootFs} body=${v.body.fontSize}/${v.body.fontWeight} ${v.body.fontFamily.slice(0, 20)} errors=${v.errors.length}`);
    for (const [role, d] of Object.entries(v.roles)) {
      if (!d) { console.log(`  ${role}: null`); continue; }
      console.log(`  ${role.padEnd(12)} ${fmt(d)} | pad ${d.paddingTop} ${d.paddingRight} ${d.paddingBottom} ${d.paddingLeft} | r ${d.borderRadius} | bg ${d.backgroundColor} ${d.backgroundImage !== 'none' ? d.backgroundImage.slice(0, 60) : ''} | sh ${d.boxShadow.slice(0, 60)} | gap ${d.gap} | mt ${d.marginTop} mb ${d.marginBottom} | minH ${d.minHeight} | tr ${d.transition.slice(0, 50)} | "${d.text.slice(0, 26)}"`);
    }
    console.log('  extra:', JSON.stringify(v.extra));
    console.log('  colours:', v.colours.slice(0, 30).map(c => `${c.k} ×${c.n}`).join(' ; '));
  }
}
await writeFile(resolve(here, 'out/testimonials-block.json'), JSON.stringify(out, null, 1));
