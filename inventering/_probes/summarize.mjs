// Kompakt utskrift av en probe-output: per roll, per viewport, de intressanta värdena.
import { readFile } from 'fs/promises';
const o = JSON.parse(await readFile(process.argv[2], 'utf8'));
const keys = process.argv[3] ? process.argv[3].split(',') : null;
const short = (v) => (v || '').toString().replace(/\s+/g, ' ').slice(0, 110);
for (const vp of ['desktop', 'mobile']) {
  const r = o.viewports[vp];
  console.log(`\n===== ${vp} ===== root=${r.__root.htmlFontSize} body=${short(r.__root.bodyFont)} ${r.__root.bodyFontSize} ${r.__root.bodyColor} bg=${r.__root.bodyBg} fonts=${(r.__root.fontsLoaded||[]).slice(0,6).join('|')}`);
  for (const [roll, d] of Object.entries(r)) {
    if (roll.startsWith('__')) continue;
    if (keys && !keys.includes(roll)) continue;
    if (d.missing) { console.log(`- ${roll}: MISSING (${d.sel})`); continue; }
    const rect = d.__rect;
    const bits = [];
    bits.push(`${rect.w}x${rect.h}@${rect.x},${rect.y}${d.__visible ? '' : ' HIDDEN'} n=${d.__count} <${d.__tag}>`);
    if (d['font-size']) bits.push(`font ${d['font-size']}/${d['line-height']} w${d['font-weight']} ls=${d['letter-spacing']} ${d['text-transform']!=='none'?d['text-transform']:''} fam=${short(d['font-family']).split(',')[0]}`);
    bits.push(`color ${d.color}`);
    if (d['background-color'] && d['background-color'] !== 'rgba(0, 0, 0, 0)') bits.push(`bg ${d['background-color']}`);
    if (d['background-image'] && d['background-image'] !== 'none') bits.push(`bgimg ${short(d['background-image'])}`);
    if (d['border-top-width'] && d['border-top-width'] !== '0px') bits.push(`border ${d['border-top-width']} ${d['border-top-style']} ${d['border-top-color']}`);
    if (d['border-radius'] && d['border-radius'] !== '0px') bits.push(`radius ${d['border-radius']}`);
    const pad = [d['padding-top'], d['padding-right'], d['padding-bottom'], d['padding-left']].join(' ');
    if (pad !== '0px 0px 0px 0px') bits.push(`pad ${pad}`);
    if (d['margin-top'] !== '0px' || d['margin-bottom'] !== '0px') bits.push(`margin ${d['margin-top']}/${d['margin-bottom']}`);
    if (d['box-shadow'] && d['box-shadow'] !== 'none') bits.push(`shadow ${short(d['box-shadow'])}`);
    if (d['backdrop-filter'] && d['backdrop-filter'] !== 'none') bits.push(`backdrop ${d['backdrop-filter']}`);
    if (d['text-shadow'] && d['text-shadow'] !== 'none') bits.push(`tshadow ${short(d['text-shadow'])}`);
    if (d['filter'] && d['filter'] !== 'none') bits.push(`filter ${short(d['filter'])}`);
    if (d['outline'] && !/none|0px/.test(d['outline'].split(' ')[0]) ) bits.push(`outline ${d['outline']} off=${d['outline-offset']}`);
    if (d['gap'] && d['gap'] !== 'normal') bits.push(`gap ${d['gap']}`);
    if (d['grid-template-columns'] && d['grid-template-columns'] !== 'none') bits.push(`cols ${short(d['grid-template-columns'])}`);
    if (d['max-width'] && d['max-width'] !== 'none') bits.push(`maxw ${d['max-width']}`);
    if (d['min-height'] && d['min-height'] !== '0px' && d['min-height'] !== 'auto') bits.push(`minh ${d['min-height']}`);
    if (d['transition'] && !/^all 0s/.test(d['transition'])) bits.push(`trans ${short(d['transition'])}`);
    if (d['opacity'] && d['opacity'] !== '1') bits.push(`opacity ${d['opacity']}`);
    if (d['fill'] && d['fill'] !== 'rgb(0, 0, 0)' && d.__tag === 'svg') bits.push(`fill ${d['fill']}`);
    if (d['stroke'] && d['stroke'] !== 'none') bits.push(`stroke ${d['stroke']} ${d['stroke-width']}`);
    if (d['display']) bits.push(`disp ${d['display']}`);
    console.log(`- ${roll}: ${bits.join(' | ')}`);
  }
}
