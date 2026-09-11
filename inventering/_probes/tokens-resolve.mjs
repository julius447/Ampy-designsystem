// Resolves every --ap* token (and the legacy --space/--h*/--radius tokens) in
// kallor/live-ampy-se/global-variables.css to px at 1440 and 390, with html{font-size:62.5%}
// exactly as theme-style.css sets it on live. Output: inventering/_probes/out/tokens-px.json
import { chromium } from '../../tools/node_modules/playwright/index.mjs';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const css = await readFile(resolve(repo, 'kallor/live-ampy-se/global-variables.css'), 'utf8');
const names = [...new Set([...css.matchAll(/--([a-zA-Z0-9-]+):/g)].map(m => '--' + m[1]))];
const html = `<!doctype html><html><head><style>html{font-size:62.5%}${css}</style></head><body><div id="p"></div></body></html>`;
const browser = await chromium.launch();
const out = { basis: 'html{font-size:62.5%} → 1rem = 10px (theme-style.css + frontend.css på live)', tokens: {} };
for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.setContent(html);
  const vals = await page.evaluate((names) => {
    const el = document.getElementById('p');
    const cs = getComputedStyle(document.documentElement);
    const res = {};
    for (const n of names) {
      const raw = cs.getPropertyValue(n).trim();
      // resolve to px by applying as width (lengths) or as color
      el.style.width = `var(${n})`;
      el.style.color = `var(${n})`;
      const w = getComputedStyle(el).width;
      const c = getComputedStyle(el).color;
      res[n] = { raw, px: /rem|px|vw|clamp|calc/.test(raw) && !/rgb|#/.test(raw) ? parseFloat(w) : null, color: /rgb|#/.test(raw) ? c : null };
      el.style.width = ''; el.style.color = '';
    }
    return res;
  }, names);
  out.tokens[w] = vals;
  await page.close();
}
await browser.close();
// merge into one table
const table = {};
for (const n of names) {
  table[n] = { raw: out.tokens[1440][n].raw, px1440: out.tokens[1440][n].px, px390: out.tokens[390][n].px, color: out.tokens[1440][n].color };
}
await writeFile(resolve(here, 'out/tokens-px.json'), JSON.stringify({ basis: out.basis, table }, null, 1));
for (const [n, v] of Object.entries(table)) {
  if (n.startsWith('--ap')) console.log(n.padEnd(24), v.color ? v.color : `${v.px1440} / ${v.px390}`.padEnd(18), v.raw.slice(0, 60));
}
