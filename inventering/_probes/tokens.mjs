// Token-sanning: kallor/live-ampy-se/global-variables.css (de 101 --ap*-tokens).
// Används av measure.mjs + census.mjs för att mappa uppmätta färger/radier/typstorlekar till tokens.
// Inget hittas på: en färg mappas bara om den är EXAKT samma (alpha-varianter markeras separat).

export const AP_COLORS = [
  ['--apmidnight-blue', [9, 11, 50]],
  ['--apteal-core', [0, 169, 145]],
  ['--apemerald-flow', [57, 194, 129]],
  ['--apseafoam-mint', [92, 197, 182]],
  ['--apneon-mint', [85, 255, 154]],
  ['--apsublime-green', [160, 251, 201]],
  ['--apmint-surge', [157, 225, 236]],
  ['--apcrystal-blue', [182, 242, 255]],
  ['--apaqua-frost', [221, 249, 253]],
  ['--appure-white', [255, 255, 255]],
  ['--apsky-mist', [245, 249, 255]],
  ['--apmilk-white', [245, 245, 245]],
  ['--apgray-white', [217, 217, 217]],
  ['--apcharcoal-gray', [51, 51, 51]],
  ['--apdarkest-black', [30, 30, 30]],
  ['--apdeepest-blue', [14, 15, 21]],
  ['--appure-black', [0, 0, 0]],
];
// Alpha-varianter som FINNS som tokens (5..90 i steg om 10, plus 5)
const ALPHA_FAMILIES = { '--apmilk-white': true, '--apdarkest-black': true, '--appure-black': true };
const ALPHA_STEPS = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

export function parseColor(str) {
  if (!str) return null;
  const s = str.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3})$/);
  if (m) return { rgb: [...m[1]].map(c => parseInt(c + c, 16)), a: 1 };
  m = s.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (m) return { rgb: [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)), a: m[2] ? parseInt(m[2], 16) / 255 : 1 };
  m = s.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.%]+))?\s*\)$/);
  if (m) {
    let a = m[4] == null ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
    return { rgb: [+m[1], +m[2], +m[3]].map(Math.round), a: +a.toFixed(3) };
  }
  return null;
}

export function mapColor(str) {
  const c = parseColor(str);
  if (!c) return { token: null, note: 'kunde inte tolka' };
  if (c.a === 0) return { token: null, note: 'transparent' };
  for (const [tok, rgb] of AP_COLORS) {
    if (rgb[0] === c.rgb[0] && rgb[1] === c.rgb[1] && rgb[2] === c.rgb[2]) {
      if (c.a === 1) return { token: tok, note: null };
      if (ALPHA_FAMILIES[tok] && ALPHA_STEPS.some(a => Math.abs(a - c.a) < 0.005)) {
        return { token: `${tok}-${Math.round(c.a * 100)}`, note: null };
      }
      return { token: null, note: `= ${tok} @ ${Math.round(c.a * 100)} % alpha (alpha-varianten finns inte som token)` };
    }
  }
  return { token: null, note: 'utanför tokens' };
}

// Fluid ap-tokens utvärderade vid 1440 / 390 (1rem = 10px, --base-font:10). Beräknat ur clamp() i global-variables.css.
function clampPx(minRem, vw, addRem, maxRem, width) {
  const v = vw * width / 100 + addRem * 10;
  const lo = minRem * 10, hi = maxRem * 10;
  if (lo > hi) return lo; // CSS: clamp med min>max ger min
  return Math.min(hi, Math.max(lo, v));
}
export const AP_TEXT = {
  '--aptext-xs': [1, 0.21, 0.93, 1.2], '--aptext-s': [1.2, 0.21, 1.13, 1.4], '--aptext-sm': [1.4, 0.21, 1.33, 1.6],
  '--aptext-m': [1.6, 0.21, 1.53, 1.8], '--aptext-mm': [1.8, 0.21, 1.73, 2], '--aptext-ml': [2, 0.21, 1.93, 2.2],
  '--aptext-l': [2.2, 0.21, 2.13, 2.4], '--aptext-lm': [2.2, 0.63, 2, 2.8], '--aptext-xl': [2.4, 0.83, 2.13, 3.2],
  '--aptext-2xl': [2.6, 1.04, 2.27, 3.6], '--aptext-2-5xl': [2.8, 1.25, 2.4, 4], '--aptext-3xl': [3, 1.88, 2.4, 4.8],
  '--aptext-3-5xl': [3.2, 2.08, 2.53, 5.2], '--aptext-4xl': [3.4, 2.71, 2.53, 6], '--aptext-5xl': [4, 3.75, 2.8, 7.6],
};
export const AP_SPACE = {
  '--apspace-4xs': [0.52, -0.03, 0.53, 0.49], '--apspace-3xs': [0.66, 0.05, 0.64, 0.7], '--apspace-2xs': [0.82, 0.18, 0.76, 0.99],
  '--apspace-xs': [1.02, 0.39, 0.9, 1.4], '--apspace-s': [1.28, 0.73, 1.05, 1.98], '--apspace-m': [1.6, 1.25, 1.2, 2.8],
  '--apspace-l': [2, 2.04, 1.35, 3.96], '--apspace-xl': [2.5, 3.23, 1.47, 5.6], '--apspace-2xl': [3.13, 4.99, 1.53, 7.92],
  '--apspace-3xl': [3.91, 7.59, 1.48, 11.19], '--apspace-4xl': [4.88, 11.4, 1.23, 15.83],
};
export const AP_RADIUS = {
  '--apradius-xs': [0.4, 0, 0.4, 0.4], '--apradius-s': [0.6, 0.21, 0.53, 0.8], '--apradius-m': [1, 0.21, 0.93, 1.2],
  '--apradius-l': [1.6, 0.42, 1.47, 2], '--apradius-xl': [2.4, 0.83, 2.13, 3.2],
};
export function tokenTable(table, width) {
  const out = {};
  for (const [k, v] of Object.entries(table)) out[k] = +clampPx(...v, width).toFixed(2);
  return out;
}
// Närmaste token för ett px-värde vid given bredd (tolerans 1px) — annars null
export function nearestToken(table, px, width, tol = 1) {
  const t = tokenTable(table, width);
  let best = null;
  for (const [k, v] of Object.entries(t)) if (Math.abs(v - px) <= tol && (best == null || Math.abs(v - px) < Math.abs(t[best] - px))) best = k;
  return best;
}
export function radiusToken(px) {
  if (px >= 400) return '--apradius-full';
  const d = nearestToken(AP_RADIUS, px, 1440, 0.5), m = nearestToken(AP_RADIUS, px, 390, 0.5);
  if (d && m && d === m) return d;
  if (d) return `${d} (endast desktop-värdet)`;
  if (m) return `${m} (endast mobil-värdet)`;
  return null;
}
