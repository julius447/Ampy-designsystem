// Agent 1: Hero-2-form states — default, focus, error (submit empty), expanded disclosure, checked consent.
import { withPage, measureFn } from './a1-lib.mjs';
import { writeFile } from 'fs/promises';
const [,, target, prefix] = process.argv;
const SEL = { host: '.aof-host', aof: '.aof', card: '.aof .card', title: '.aof .title', subtitle: '.aof .subtitle', seg_btn: '.aof .seg button', seg_on: '.aof .seg button[aria-checked="true"]', gchip: '.aof .gchip', label: '.aof label.l', req: '.aof label.l .req', input: '.aof input.inp', textarea: '.aof textarea.inp', disc_btn: '.aof .disc>button', consent_box: '.aof .consent input', consent_txt: '.aof .consent span', consent_link: '.aof .consent a', btn: '.aof .btn-primary', help: '.aof .fld.err .help', upload: '.aof .upload' };
const r = await withPage(target, async (page, name) => {
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const out = { default: await page.evaluate(measureFn, SEL) };
  await page.locator('.aof input.inp').first().focus(); await page.waitForTimeout(300);
  out.focus = await page.evaluate(measureFn, { input_focus: '.aof input.inp:focus' });
  await page.locator('.aof .disc>button').first().click().catch(() => {}); await page.waitForTimeout(300);
  await page.locator('.aof .btn-primary').first().click().catch(() => {}); await page.waitForTimeout(500);
  out.error = await page.evaluate(measureFn, { err_input: '.aof .fld.err .inp', err_help: '.aof .fld.err .help', textarea: '.aof textarea.inp', upload: '.aof .upload', select: '.aof select.inp' });
  await page.screenshot({ path: `${prefix}-${name}-error.png`, fullPage: true });
  await page.locator('.aof .consent input').first().check().catch(() => {}); await page.waitForTimeout(200);
  out.checked = await page.evaluate(measureFn, { consent_checked: '.aof .consent input:checked' });
  return out;
});
await writeFile(`${prefix}-states.json`, JSON.stringify(r, null, 1));
const show = (o) => o ? `${o.fontSize}/${o.fontWeight}/${o.lineHeight} color=${o.color} bg=${o.background} bgimg=${(o.backgroundImage||'none').slice(0,60)} pad=${o.padding} r=${o.borderRadius} border=${(o.border||'').slice(0,40)} sh=${(o.boxShadow||'').slice(0,70)} ${o.w}x${o.h} blur=${o.backdropFilter}` : 'null';
for (const vp of ['desktop','mobile']) for (const [state, els] of Object.entries(r[vp])) { if (state === '__errors') continue; console.log(`== ${vp} ${state}`); for (const [k, v] of Object.entries(els)) console.log(`  ${k.padEnd(14)} ${show(v)}`); }
