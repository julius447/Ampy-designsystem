// Agent 1: header states — desktop with "Tjänster" mega open + "Produkter" + "Lösningar", mobile with drawer open. Screenshots + measurements.
import { withPage, measureFn } from './a1-lib.mjs';
import { writeFile } from 'fs/promises';
const [,, target, prefix] = process.argv;
const r = await withPage(target, async (page, name, w) => {
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const out = {};
  if (name === 'desktop') {
    for (const [i, id] of [['tjanster', 0], ['produkter', 1], ['losningar', 2]]) {
      const btn = page.locator('.nav__link').nth(id);
      await btn.click(); await page.waitForTimeout(450);
      await page.screenshot({ path: `${prefix}-desktop-mega-${i}.png`, fullPage: false });
      out['mega_' + i] = await page.evaluate(measureFn, { mega: '.nav__item.open .mega', mega_in: '.nav__item.open .mega__in', mcol_title: '.nav__item.open .mcol__title', mitem: '.nav__item.open .mitem', ptile: '.nav__item.open .ptile', ptile_strong: '.nav__item.open .ptile__t strong', ptile_img: '.nav__item.open .ptile__img', gzone_label: '.nav__item.open .gzone__label', gitem: '.nav__item.open .gitem', lcard: '.nav__item.open .lcard', lcard_h4: '.nav__item.open .lcard h4', lcard_p: '.nav__item.open .lcard p', go: '.nav__item.open .go', nav_link_open: '.nav__item.open .nav__link' });
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    }
    // sticky/scroll tighten
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(400);
    out.scrolled = await page.evaluate(measureFn, { header: '.hdr', header_in: '.hdr__in', logo: '.hdr__logo img' });
  } else {
    await page.locator('.burger').click(); await page.waitForTimeout(450);
    await page.screenshot({ path: `${prefix}-mobile-drawer.png`, fullPage: false });
    out.drawer = await page.evaluate(measureFn, { drawer: '.drawer', eyebrow: '.drawer__eyebrow', acc_head: '.acc__head', acc_sub_head: '.acc--sub .acc__head', m_item: '.m-item', drawer_cta: '.drawer__cta', burger_close: '.burger__close', dim: '.dim' });
    await page.locator('.acc__head').first().click(); await page.waitForTimeout(400);
    await page.locator('.acc--sub .acc__head').first().click(); await page.waitForTimeout(400);
    await page.screenshot({ path: `${prefix}-mobile-drawer-open.png`, fullPage: false });
    out.drawer_open = await page.evaluate(measureFn, { m_item: '.acc.open .acc--sub.open .m-item', acc_body: '.acc.open > .acc__body' });
  }
  return out;
});
await writeFile(`${prefix}-states.json`, JSON.stringify(r, null, 1));
const show = (o) => o ? `${o.fontSize}/${o.fontWeight}/${o.lineHeight}/${o.letterSpacing} color=${o.color} bg=${o.background} pad=${o.padding} r=${o.borderRadius} sh=${(o.boxShadow||'').slice(0,50)} ${o.w}x${o.h} ${o.textTransform}` : 'null';
for (const vp of ['desktop','mobile']) for (const [state, els] of Object.entries(r[vp])) { if (state === '__errors') continue; console.log(`== ${vp} ${state}`); for (const [k, v] of Object.entries(els)) console.log(`  ${k.padEnd(16)} ${show(v)}`); }
