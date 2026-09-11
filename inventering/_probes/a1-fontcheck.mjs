import { withPage } from './a1-lib.mjs';
const r = await withPage(process.argv[2], async (page) => page.evaluate(async () => {
  await document.fonts.ready;
  const faces = [...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`);
  const q = s => { const el = document.querySelector(s); if (!el) return null; const cs = getComputedStyle(el); return { ff: cs.fontFamily, fw: cs.fontWeight, fs: cs.fontSize }; };
  return { faces: faces.slice(0, 40), body: q('body'), h2: q('h2'), h3: q('h3'), p: q('p'), btn: q('.bricks-button') };
}), [['desktop', 1440, 1000]]);
console.log(JSON.stringify(r.desktop, null, 1));
