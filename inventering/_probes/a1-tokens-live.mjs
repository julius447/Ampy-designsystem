// Agent 1: resolve every custom property in kallor/live-ampy-se/global-variables.css to px at 1440 and 390,
// with html{font-size:62.5%} (frontend.css/theme-style.css) — and again with theme-style.css's :root layered
// on top in live load order (global-variables.min.css THEN theme-style-ampy.min.css), to show what live really computes.
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { readFile, writeFile } from 'fs/promises';
const gv = await readFile('kallor/live-ampy-se/global-variables.css', 'utf8');
const ts = await readFile('kallor/live-ampy-se/theme-style.css', 'utf8');
const tsRoot = ts.slice(ts.indexOf('html{font-size:62.5%}')).match(/:root\{[^}]*\}/)[0];
// ordered unique names (last declaration wins, as in the cascade)
const decl = [...gv.matchAll(/(--[a-zA-Z0-9\-]+)\s*:\s*([^;}]+)/g)].map(m => [m[1], m[2].trim()]);
const lastVal = new Map(); for (const [n, v] of decl) lastVal.set(n, v);
const firstVal = new Map(); for (const [n, v] of decl) if (!firstVal.has(n)) firstVal.set(n, v);
const names = [...lastVal.keys()];
const browser = await chromium.launch();
const resolve = async (css, w) => {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.setContent(`<!doctype html><html><head><style>html{font-size:62.5%}${css}</style></head><body><div id="p"></div></body></html>`);
  const r = await page.evaluate((names) => {
    const el = document.getElementById('p'); const cs = getComputedStyle(el); const out = {};
    for (const n of names) {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      let px = null, color = null, shadow = null;
      el.style.cssText = '';
      const isLen = /rem|px|vw|clamp|calc|em/.test(raw) && !/repeat|minmax|rgb|#|hsl/.test(raw);
      const twoVal = (raw.match(/clamp\(/g) || []).length >= 2;
      if (isLen && !twoVal) {
        el.style.setProperty('width', `var(${n})`); const v = cs.width; if (v && v !== 'auto') px = Math.round(parseFloat(v) * 100) / 100;
      }
      if (/rgb|#|hsl/.test(raw) && !/px/.test(raw)) { el.style.setProperty('background-color', `var(${n})`); color = cs.backgroundColor; }
      if (n.includes('shadow')) { el.style.setProperty('box-shadow', `var(${n})`); shadow = cs.boxShadow; }
      let pad = null; if (twoVal) { el.style.setProperty('padding', `var(${n})`); pad = cs.padding; }
      out[n] = { raw: raw.replace(/\s+/g,''), px, color, shadow, pad };
    }
    return out;
  }, names);
  await page.close(); return r;
};
const A1440 = await resolve(gv, 1440), A390 = await resolve(gv, 390);
const B1440 = await resolve(gv + tsRoot, 1440), B390 = await resolve(gv + tsRoot, 390);
const tokens = names.map(n => ({
  name: n, value: lastVal.get(n),
  value_first_decl: firstVal.get(n) !== lastVal.get(n) ? firstVal.get(n) : undefined,
  px_at_1440: A1440[n].px, px_at_390: A390[n].px,
  color: A1440[n].color && A1440[n].color !== 'rgba(0, 0, 0, 0)' ? A1440[n].color : undefined,
  shadow_computed: A1440[n].shadow ?? undefined,
  padding_px_1440: A1440[n].pad ?? undefined, padding_px_390: A390[n].pad ?? undefined,
  live_after_theme_style: (B1440[n].raw !== A1440[n].raw) ? { value: B1440[n].raw, px_at_1440: B1440[n].px, px_at_390: B390[n].px, padding_px_1440: B1440[n].pad ?? undefined, padding_px_390: B390[n].pad ?? undefined } : undefined,
}));
await writeFile('inventering/_probes/out/a1-tokens-live.json', JSON.stringify({ note: 'html{font-size:62.5%} => 1rem=10px. px measured via getComputedStyle(width) at 1440 and 390.', count_all: tokens.length, count_ap: tokens.filter(t => t.name.startsWith('--ap')).length, tokens }, null, 1));
await browser.close();
console.log('tokens', tokens.length, 'ap*', tokens.filter(t => t.name.startsWith('--ap')).length);
for (const t of tokens) if (t.name.startsWith('--ap') || /^--(space|h\d|radius|container|max-width|text-line|heading-line|logo)/.test(t.name)) console.log(t.name.padEnd(24), String(t.px_at_1440 ?? t.padding_px_1440 ?? t.color ?? '').padStart(10), String(t.px_at_390 ?? t.padding_px_390 ?? '').padStart(8), t.live_after_theme_style ? `  LIVE(theme-style wins): ${t.live_after_theme_style.px_at_1440 ?? t.live_after_theme_style.padding_px_1440} / ${t.live_after_theme_style.px_at_390 ?? t.live_after_theme_style.padding_px_390}` : '', t.shadow_computed ? ` shadow=${t.shadow_computed}` : '');
