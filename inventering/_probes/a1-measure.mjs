// Agent 1 generic measurer. Usage: node a1-measure.mjs <url-or-path> <out.json> '<json role→selector map>' [--hover sel] [--wait ms]
// Records getComputedStyle for the first match of each selector at 1440 and 390, plus the CSS custom properties
// resolved on :root that start with --ap (to see which token set the page carries).
import { withPage, measureFn } from './a1-lib.mjs';
import { writeFile } from 'fs/promises';
const [,, target, outFile, mapJson, ...rest] = process.argv;
const sels = JSON.parse(mapJson);
const hoverSel = rest.includes('--hover') ? rest[rest.indexOf('--hover') + 1] : null;
const waitMs = rest.includes('--wait') ? Number(rest[rest.indexOf('--wait') + 1]) : 300;
const r = await withPage(target, async (page, name, w) => {
  await page.waitForTimeout(waitMs);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const base = await page.evaluate(measureFn, sels);
  let hover = null;
  if (hoverSel) {
    try { await page.hover(hoverSel, { timeout: 2000 }); await page.waitForTimeout(400); hover = (await page.evaluate(measureFn, { hover: hoverSel })).hover; } catch (e) { hover = { error: String(e).slice(0, 120) }; }
  }
  const root = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const names = new Set();
    for (const sh of document.styleSheets) { try { for (const rule of sh.cssRules) { if (rule.style) for (const p of rule.style) if (p.startsWith('--')) names.add(p); } } catch {} }
    const out = {}; for (const n of [...names].sort()) out[n] = cs.getPropertyValue(n).trim();
    return { htmlFontSize: cs.fontSize, bodyBg: getComputedStyle(document.body).backgroundColor, bodyFont: getComputedStyle(document.body).fontFamily, docHeight: document.documentElement.scrollHeight, vars: out };
  });
  return { viewport: w, root, elements: base, hover };
});
await writeFile(outFile, JSON.stringify(r, null, 1));
const show = (o) => o ? `${o.fontSize}/${o.fontWeight}/${o.lineHeight}/${o.letterSpacing} ${o.fontFamily.split(',')[0]} color=${o.color} bg=${o.background} pad=${o.padding} r=${o.borderRadius} sh=${o.boxShadow.slice(0,60)} ${o.w}x${o.h}` : 'null';
for (const vp of ['desktop', 'mobile']) { console.log(`== ${vp} (html ${r[vp].root.htmlFontSize}, body ${r[vp].root.bodyFont.split(',')[0]} on ${r[vp].root.bodyBg}, height ${r[vp].root.docHeight})`); for (const [k, v] of Object.entries(r[vp].elements)) console.log(`  ${k.padEnd(18)} ${show(v)}`); if (r[vp].hover) console.log(`  ${'HOVER'.padEnd(18)} ${show(r[vp].hover)}`); if (r[vp].__errors.length) console.log('  errors:', r[vp].__errors.slice(0,3)); }
