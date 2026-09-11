// site/_probes/s3-build.mjs (S3)
// Genererar site/komponenter/verktyg.html och diagnostik.html ur EN källa per exempel: samma markup
// renderas live och skrivs ut (escapad) i kodrutan, så exempel och kod inte kan glida isär.
// Läser site/_probes/out/s3-parity.json (från s3-parity.mjs) om den finns och fyller paritetstabellerna.
// Kör: node site/_probes/s3-build.mjs
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SPR = '../../system/ikoner.svg';
// Produktfoto (Zaptec Go) beskuret ur inventering/skarmdumpar/ev-kalkylator-desktop.png, 96x96, inbäddat (inga externa resurser)
const PHOTO = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCABgAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6pooooAKM18yftYeLfEeheJNDtdH13U9Nhe0aR0tLl4g7biMnaRngV4cnxD8cHr4y8Rn/ALiM3/xVAH6GZozX58p4+8anr4w8Rn/uIzf/ABVSjx34zxz4v8Rf+DGb/wCKoA/QHNFfAS+OfGLdPFviA/8AcRl/+Kp48aeMD/zNniD/AMGEv/xVAH31RXwQPGPi89fFXiD/AMGEv/xVdL8OPF3ip/HWhpL4k1qaN7yNHjmvJHR1JwQVJwaAPtKigUUAFFFFAHyp+1/Hu8V6Cf8Apyb/ANDNeExQ177+1ym7xToJ/wCnN/8A0M14dDFQBWlfycKo3OegPQD1NWtP8PajqyGWOMmIZzLI4jT8yRn8M1JoWnx6pqBac4gRXnlycfIgJ2j3OMD61JqF9LqcnmzbViQYihUfJEvYKP8AJoAc/hG/hjM0KRzovU20wYj/AICDk/kagtZmjZY5zuUnAfuD6H/Gls5Arie1kKSIeHTKkH61tajAupWUWpeWqSO5guNvAZwAQ+O2QfzBoAhW19q6b4d2wHjnQjjpexf+hVh6YpltEySWXKnPXj/62K634fQ48a6If+nyP+dAH2KKKBRQAUUUUAfMP7Wa58S6Ef8Ap0f/ANCNeIqn7tvoa9z/AGr1z4j0H/r1f/0KvE1X923+6aAHeG41klntGbY11btGh9XHzKPxIA/GqpicxsqnY/TJGcGkt9ybXUlWXkEdQa25b/S71TPqZks7nADXEQBSQ+rL2P060AZNraGFFUyFse2B/wDrrfVBb+HQjgh7q43IMfwIPvfnkfhVe0uPDwY7b2TUJRysUa+Wh/3iecfSpLu7lv5/Nk2gABURRhY1HRQOwoGP0WPMdx/12P8A6Ctdl4Bj/wCKy0U4/wCXuP8AnXK6In7u5/67n/0Fa7HwGv8AxWOjf9fSfzoA+shRQKKBBRRRQB81ftWDPiDQj/06v/6FXiij90/+6f5V7d+1WP8AifaCf+naT/0KvFFGY3AH8JoAoRkJHuboBk1PbrK5DuQo7IB/M1XCiRYgeVLAn8Of5ir6UAPaJm2lG2svQ4zUttIXBV12yJwwHQ+49qFFBG27hI6urA+4GCP50DNfQx+7uf8Aruf/AEFa7LwGP+Kx0f8A6+k/nXH6GP3VwccGY4/75Fdn4CGfGWj/APX0lAH1VRQKKBBRRRQB83/tVD/ieaAf+neT/wBCrxWDjmva/wBqof8AE68Pn/phL/MV4rD0oAoyW/lu8GNuPmTntnIP51LFcpnbIQj9Cp/p61fltVulAJKOvKuOo/8ArVUnsrsRlREjt2kVQ2PwJBH4UDJVuIVGS4FLG+C10644Cxqep/8Ark1VtNLvXvEuHRpCilQuwKBnuSTW/YaYUkWe6ZXkX7qD7qH19z70AXtMt2trOONxtfG5h6EnJH64rrfh+M+M9HH/AE8rXNLxXTfDznxtow/6eB/I0AfU9FAooEFFFFAHzj+1X/yGPD3/AFwl/mK8ThNfc+teGdF8ReV/a+l2l/5OfL8+IPsz1xn6Vmf8Kz8GD/mWNJ/8B1oA+OIj0q0nWvr7/hWvg4f8y1pX/gOtL/wrfwf/ANC3pf8A4DrQO58koc4qZPpX1j/wrnwh/wBC5pf/AH4FL/wrrwj/ANC7pn/fgUBc+XkewLDzEnCgD/V4yfzrofh8YG8eaN5AkCeeP9ZjOcGvoD/hXXhH/oXdM/78CrFh4K8OaXdR3dlothb3EfKSRwgMv0NAG1RRRQI//9k=';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const I = (name, size = 16, cls = '') => `<svg class="${cls}" width="${size}" height="${size}" aria-hidden="true"><use href="${SPR}#ik-${name}"/></svg>`;
// Ikoner som saknas i spriten (S2:s fil rörs inte): samma familj, 24-rutnät, stroke 1.75
const inline = {
  bulb: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.8 1 1.3 1 2.5h6c0-1.2.3-1.7 1-2.5A6 6 0 0 0 12 3Z"/></svg>`,
  ext: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>`,
  shield: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  ban: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/></svg>`,
  facebook: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 0 0Z"/></svg>`,
  shareNodes: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>`,
  panel: (s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h3M13 8h3M8 12h3M13 12h3M8 16h3"/></svg>`,
};

let parity = null;
try { parity = JSON.parse(await readFile(resolve(root, 'site/_probes/out/s3-parity.json'), 'utf8')); } catch { parity = null; }

/* ---------- Byggstenar för sidan ---------- */
function example({ id, label, html, code, dark = false, full = true, pad = true, caption = '', codeNote = '' }) {
  const cls = ['ampy', 'ds-demo', full ? 'ds-demo--full' : '', full && pad ? 'ds-demo--kit' : '', dark ? 'ds-demo--dark ampy-on-dark' : ''].filter(Boolean).join(' ');
  const c = code === false ? '' : `<div class="ds-code"><pre><code>${esc(code || html)}</code></pre></div>${codeNote ? `<p class="ds-caption">${codeNote}</p>` : ''}`;
  return `
<div class="${cls}" id="${id}"${label ? ` data-label="${esc(label)}"` : ''}>${label ? `<span class="ds-demo__label ds-demo__label--over">${esc(label)}</span>` : ''}
${html}
</div>
${caption ? `<p class="ds-caption">${caption}</p>` : ''}
${c}`;
}
const h2 = (id, t) => `<h2 class="ds-h2" id="${id}">${t}</h2>`;
const h3 = (id, t) => `<h3 class="ds-h3" id="${id}">${t}</h3>`;
const p = (t, cls = 'ds-p') => `<p class="${cls}">${t}</p>`;
const source = t => `<p class="ds-source">${t}</p>`;
const table = (head, rows) => `<div class="ds-table-wrap"><table class="ds-table"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('\n')}</tbody></table></div>`;
const dodont = (gor, gorInte) => `<div class="ds-dodont"><div><strong>Gör</strong><ul>${gor.map(x => `<li>${x}</li>`).join('')}</ul></div><div><strong>Gör inte</strong><ul>${gorInte.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`;

function parityTable(kit) {
  if (!parity || !parity[kit]) return p('Paritetstabellen fylls av <code>node site/_probes/s3-parity.mjs</code> (inte körd ännu).', 'ds-p ds-p--muted');
  const rows = parity[kit].rows.map(r => {
    const cell = (v, vp) => {
      const s = r.source[vp], k = r.kit[vp];
      const hit = (typeof s === 'number' && typeof k === 'number') ? (Math.abs(s - k) <= (r.tol ?? 1) ? 'is-hit' : 'is-miss') : '';
      return `<td class="${hit}">${fmt(s)} / <strong>${fmt(k)}</strong></td>`;
    };
    return `<tr><td>${r.label}</td>${cell(null, '1440')}${cell(null, '390')}<td>${r.note || ''}</td></tr>`;
  }).join('\n');
  return `<div class="ds-table-wrap"><table class="ds-table"><thead><tr><th>Mått</th><th>1440: källa / <strong>kit</strong></th><th>390: källa / <strong>kit</strong></th><th>Not</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="ds-caption">Källa = ${esc(parity[kit].sourceNote)}. Kit = getComputedStyle/getBoundingClientRect på den här sidans exempel, lyft in i en 1280-ram (${esc(parity[kit].harness)}). Grönt = inom ${parity.tolerance ?? 1} px. Mätt ${esc(parity.when)}.</p>`;
}
const fmt = v => (v === null || v === undefined) ? 'n/a' : (typeof v === 'number' ? String(Math.round(v * 10) / 10).replace('.', ',') : esc(String(v)));

/* ---------- Sidskal (site/_mall.html med ../-prefix för site/komponenter/) ---------- */
function shell({ title, eyebrow, lead, active, extraStyle, body }) {
  const nav = (href, text) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${text}</a>`;
  return `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}: Ampy designsystem</title>
<link rel="stylesheet" href="../../system/ampy.css">
<link rel="stylesheet" href="../doc.css">
<link rel="icon" href="../brand/ampy-glyph-black-201-favicon.png">
<style>
  /* Lokala ds-klasser för den här sidan (S3). Aldrig i doc.css. */
  .ds-main { min-width: 0; }
  .ds-content--wide { max-width: 128rem; }
  .ds-demo--full.ds-demo--kit { padding: var(--ampy-space-m); }
  .ds-demo--full.ds-demo--kit.ds-demo--dark { padding: var(--ampy-space-m); }
  .ds-demo__label--over { z-index: 2; }
  .ds-demo--full > .ds-demo__label--over { top: 0.6rem; right: 1rem; }
  .ds-demo--frame { padding: var(--ampy-space-m); display: block; }
  .ds-demo--frame > * + * { margin-top: var(--ampy-space-s); }
  .ds-demo--frame.ds-demo--dark { color: var(--ampy-on-dark); }
  .ds-inline-row { display: flex; flex-wrap: wrap; gap: var(--ampy-space-s); align-items: flex-start; }
  .ds-inline-row > * { flex: 1 1 28rem; min-width: 0; }
  .ds-table td.is-hit { color: var(--ampy-success-ink); }
  .ds-table td.is-miss { color: var(--ampy-warn-ink); }
  .ds-shot { display: grid; gap: var(--ampy-space-xs); grid-template-columns: 3fr 1fr; align-items: start; margin: var(--ampy-space-xs) 0 var(--ampy-space-s); }
  .ds-shot img { width: 100%; height: auto; border: 1px solid var(--ampy-line); border-radius: var(--ampy-radius-field); background: var(--ampy-bg-surface); }
  .ds-shot figcaption { grid-column: 1 / -1; font-size: var(--ampy-text-small); color: var(--ampy-ink-muted); }
  .ds-dep { border: 1px solid var(--ampy-line-strong); border-left: 4px solid var(--ampy-warn-ink); border-radius: var(--ampy-radius-field); padding: var(--ampy-space-xs) var(--ampy-space-s); margin: var(--ampy-space-xs) 0 var(--ampy-space-m); font-size: var(--ampy-text-small); color: var(--ampy-ink); background: var(--ampy-bg-surface); }
  .ds-dep strong { font-weight: var(--ampy-w-strong); }
  .ds-toc { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0 0 var(--ampy-space-m); padding: 0; list-style: none; }
  .ds-toc a { display: inline-block; padding: 0.5rem 1.1rem; border: 1px solid var(--ampy-line); border-radius: var(--ampy-radius-pill); font-size: var(--ampy-text-small); color: var(--ampy-ink-muted); text-decoration: none; background: var(--ampy-bg-surface); }
  .ds-toc a:hover { color: var(--ampy-ink); border-color: var(--ampy-line-strong); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  @media (max-width: 991px) { .ds-shot { grid-template-columns: 1fr; } }
${extraStyle || ''}
</style>
</head>
<body class="ds-body ampy">
<div class="ds-topbar">
  <a class="ds-brand" href="../index.html" style="margin:0"><span class="ds-brand__mark" aria-hidden="true"><img src="../brand/ampy-glyph-white-834.png" alt="" width="14" height="14"></span><span class="ds-brand__name">Ampy designsystem</span></a>
  <button class="ds-topbar__btn" type="button" data-ds-nav-toggle aria-expanded="false" aria-controls="ds-side">Meny</button>
</div>
<div class="ds-layout">
  <aside class="ds-side" id="ds-side">
    <a class="ds-brand" href="../index.html"><span class="ds-brand__mark" aria-hidden="true"><img src="../brand/ampy-glyph-white-834.png" alt="" width="14" height="14"></span><span><span class="ds-brand__name">Ampy designsystem</span><span class="ds-brand__sub">Mätt ur blockbiblioteket 2026-09-11</span></span></a>
    <nav class="ds-nav" aria-label="Designsystemet">
      <div class="ds-nav__group"><span>Start</span>
        ${nav('../index.html', 'Översikt')}
        ${nav('../beslut.html', 'Beslut som väntar')}
        ${nav('../kod.html', 'Använda systemet')}
      </div>
      <div class="ds-nav__group"><span>Grunder</span>
        ${nav('../grunder/farg.html', 'Färg')}
        ${nav('../grunder/typografi.html', 'Typografi')}
        ${nav('../grunder/spacing.html', 'Spacing och layout')}
        ${nav('../grunder/form-djup.html', 'Form och djup')}
        ${nav('../grunder/rorelse.html', 'Rörelse')}
        ${nav('../grunder/ornament.html', 'Ornament och ikoner')}
      </div>
      <div class="ds-nav__group"><span>Komponenter</span>
        ${nav('index.html', 'Alla komponenter')}
        ${nav('knappar.html', 'Knappar och länkar')}
        ${nav('text.html', 'Textelement')}
        ${nav('ytor.html', 'Ytor och kort')}
        ${nav('falt.html', 'Fält och reglage')}
        ${nav('verktyg.html', 'Kalkylator-kitet')}
        ${nav('diagnostik.html', 'Diagnostik-kitet')}
        ${nav('block.html', 'Block')}
      </div>
      <div class="ds-nav__group"><span>Mönster</span>
        ${nav('../monster/layoutfamiljer.html', 'Layoutfamiljer')}
        ${nav('../monster/tjanstesida.html', 'Tjänstesidans rytm')}
        ${nav('../monster/mobil.html', 'Mobil 390')}
        ${nav('../monster/register.html', 'Register och ton')}
      </div>
      <div class="ds-nav__group"><span>Regler</span>
        ${nav('../regler/rost-i-ui.html', 'Röst i gränssnittet')}
        ${nav('../regler/candour.html', 'Candour-grinden')}
        ${nav('../regler/ai-tells.html', 'AI-tecken som inte får finnas')}
        ${nav('../regler/tillganglighet.html', 'Tillgänglighet')}
      </div>
      <div class="ds-nav__group"><span>Bibliotek</span>
        ${nav('../blockbibliotek.html', 'Blockbiblioteket')}
      </div>
    </nav>
  </aside>
  <main class="ds-main">
    <div class="ds-content ds-content--wide">
      <span class="ds-eyebrow">${esc(eyebrow)}</span>
      <h1 class="ds-h1">${esc(title)}</h1>
      <p class="ds-lead">${lead}</p>
${body}
    </div>
  </main>
</div>
<script src="../doc.js"></script>
</body>
</html>
`;
}

/* ============================================================================
   KALKYLATOR-KITET
   ============================================================================ */
const tip = (text, id) => `<span class="ampy-calc__tipwrap"><button type="button" class="ampy-calc__tip" aria-describedby="${id}" aria-label="Förklaring">i</button><span class="ampy-calc__popover" role="tooltip" id="${id}">${text}</span></span>`;
const segment = (name, opts, checked, label) => `<div class="ampy-segment" role="radiogroup" aria-label="${label}">
${opts.map(o => `  <label class="ampy-segment__option"><input type="radio" name="${name}" value="${o}"${o === checked ? ' checked' : ''}><span>${o}</span></label>`).join('\n')}
</div>`;
const ticks = (vals, active) => `<ul class="ampy-range__ticks" aria-hidden="true">
${vals.map(v => `  <li><button type="button" class="ampy-range__tick${v === active ? ' is-active' : ''}" tabindex="-1">${v}</button></li>`).join('\n')}
</ul>`;

function calcInputCard(pfx) {
  return `<section class="ampy-card ampy-card--flat ampy-card--tight ampy-calc__input" aria-label="Dina värden">
  <div class="ampy-calc__tier ampy-calc__tier--primary">
    <span class="ampy-eyebrow">Vad du byter</span>
    <div class="ampy-calc__field">
      <span class="ampy-calc__q" id="${pfx}-segq">Vem räknar vi för? ${tip('BRF, företag och privatperson räknas olika: vi anpassar armaturtyp, brinntid och pris efter din profil.', pfx + '-tip1')}</span>
      ${segment(pfx + '-seg', ['BRF', 'Företag', 'Privat'], 'BRF', 'Vem räknar vi för?')}
      <p class="ampy-help">Vi räknar för föreningens gemensamma belysning.</p>
    </div>
    <div class="ampy-calc__field ampy-calc__field--prominent">
      <span class="ampy-calc__q">Vad byter du från? ${tip('Välj din nuvarande ljuskälla. Vi jämför mot en likvärdig LED-ersättning med samma ljus.', pfx + '-tip2')}</span>
      <div class="ampy-calc__selector" aria-expanded="false">
        <button type="button" class="ampy-calc__selector-btn" aria-haspopup="listbox">
          <span class="ampy-calc__selector-img">${inline.bulb(24)}</span>
          <span class="ampy-calc__selector-text">
            <span class="ampy-calc__selector-name">Lysrörsarmatur 2×36 W T8 (120 cm)</span>
            <span class="ampy-calc__selector-meta">82 → 34 W, 3600 till 4400 lm</span>
          </span>
          ${I('chevron-down', 20, 'ampy-calc__selector-chevron')}
        </button>
      </div>
    </div>
    <div class="ampy-calc__field ampy-calc__field--prominent">
      <label class="ampy-calc__q" for="${pfx}-antal">Antal armaturer ${tip('Hur många armaturer eller ljuskällor bytet gäller. Dra i reglaget eller klicka på en siffra.', pfx + '-tip3')}</label>
      <span class="ampy-calc__value"><span>80</span><span class="ampy-calc__unit">st</span></span>
      <div class="ampy-range-wrap">
        <input class="ampy-range" id="${pfx}-antal" type="range" min="40" max="400" step="10" value="80" style="--_fill: 11%" aria-valuetext="80 armaturer">
        ${ticks(['40', '80', '160', '280', '400'], '80')}
      </div>
    </div>
  </div>
  <div class="ampy-calc__tier">
    <span class="ampy-eyebrow">Din situation</span>
    <div class="ampy-calc__field">
      <label class="ampy-calc__q ampy-calc__q--strong" for="${pfx}-kontext">Var sitter belysningen? ${tip('Styr brinntiden. Snitt brinntid är ett genomsnitt över alla armaturer, bra när bytet omfattar flera utrymmen.', pfx + '-tip4')}</label>
      <select class="ampy-select" id="${pfx}-kontext">
        <option>Snitt brinntid (12,0 h/dygn)</option>
        <option>Trapphus utan styrning (24,0 h/dygn)</option>
        <option>Garage med närvarostyrning (6,0 h/dygn)</option>
        <option>Kontor (9,0 h/dygn)</option>
      </select>
    </div>
    <div class="ampy-calc__field ampy-calc__field--prominent">
      <label class="ampy-calc__q" for="${pfx}-brinn">Brinntid ${tip('Timmar per dygn som belysningen lyser, i snitt över året.', pfx + '-tip5')}</label>
      <span class="ampy-calc__value ampy-calc__value--sm"><span>12,0</span><span class="ampy-calc__unit">h/dygn</span></span>
      <div class="ampy-range-wrap">
        <input class="ampy-range" id="${pfx}-brinn" type="range" min="0" max="24" step="0.5" value="12" style="--_fill: 50%" aria-valuetext="12 timmar per dygn">
        ${ticks(['0,0 h', '6,0 h', '12,0 h', '18,0 h', '24,0 h'], '12,0 h')}
      </div>
    </div>
    <div class="ampy-calc__field">
      <span class="ampy-calc__q ampy-calc__q--strong">Elprisområde ${tip('Vi använder ett medvetet lågt schablonpris per område (SE1 till SE4). Din verkliga besparing blir snarare högre.', pfx + '-tip6')}</span>
      ${segment(pfx + '-region', ['SE1', 'SE2', 'SE3', 'SE4'], 'SE3', 'Elprisområde')}
    </div>
  </div>
</section>`;
}

const calcReadout = `<div class="ampy-readout">
  <span class="ampy-eyebrow">Årlig besparing</span>
  <span class="ampy-readout__value"><span class="ampy-number">27 752</span><span class="ampy-readout__unit">kr/år</span></span>
  <span class="ampy-readout__sub">Så mycket lägre kan elkostnaden bli, varje år, så länge belysningen lyser.</span>
</div>`;
const calcTrio = `<div class="ampy-stat-trio">
  <div class="ampy-stat"><span class="ampy-stat__label">Energi du kapar</span><span class="ampy-stat__value">16 819<span class="ampy-stat__unit">kWh/år</span></span><span class="ampy-stat__sub">59 % lägre förbrukning</span></div>
  <div class="ampy-stat"><span class="ampy-stat__label">CO₂ du sparar</span><span class="ampy-stat__value">7,8<span class="ampy-stat__unit">ton/år</span></span><span class="ampy-stat__sub">jämfört med nordisk elmix</span></div>
  <div class="ampy-stat"><span class="ampy-stat__label">Uppskattad kostnad</span><span class="ampy-stat__value">120 000<span class="ampy-stat__unit">kr</span></span><span class="ampy-stat__sub">ca 1 500 kr per armatur, inkl. installation</span></div>
</div>`;
const calcCompare = `<div class="ampy-calc__compare">
  <span class="ampy-eyebrow">Vad belysningen kostar per år</span>
  <div class="ampy-calc__compare-row ampy-calc__compare-row--now">
    <span class="ampy-calc__compare-key">I dag</span>
    <span class="ampy-calc__compare-track"><span class="ampy-calc__compare-bar" style="--_w: 100%"></span></span>
    <span class="ampy-calc__compare-val">47 409 kr</span>
  </div>
  <div class="ampy-calc__compare-row ampy-calc__compare-row--after">
    <span class="ampy-calc__compare-key">Med LED</span>
    <span class="ampy-calc__compare-track"><span class="ampy-calc__compare-bar" style="--_w: 41%"></span></span>
    <span class="ampy-calc__compare-val">19 657 kr</span>
  </div>
  <p class="ampy-calc__compare-caption">LED drar <strong>59 % mindre</strong>, skillnaden är din besparing.</p>
</div>`;
const calcCta = `<div class="ampy-calc__cta-stack">
  <button class="ampy-btn ampy-btn--secondary ampy-calc__cta" type="button">Få en skräddarsydd offert ${I('arrow-right', 18, 'ampy-btn__icon')}</button>
</div>`;
const calcLead = (pfx, { open = true, invalid = false } = {}) => `<div class="ampy-calc__cta-stack">
  <form class="ampy-calc__lead" novalidate${open ? '' : ' hidden'}>
    <p class="ampy-calc__lead-intro">Vår belysningsexpert hör av sig med ett offertförslag, oftast inom en arbetsdag.</p>
    <div class="ampy-fields">
      <div class="ampy-field${invalid ? ' is-error' : ''}"><label for="${pfx}-namn">Namn</label><input class="ampy-input" id="${pfx}-namn" name="namn" type="text" autocomplete="name" required${invalid ? ' aria-invalid="true" aria-describedby="' + pfx + '-namn-err"' : ''}>${invalid ? `<p class="ampy-error" id="${pfx}-namn-err">Skriv ditt namn.</p>` : ''}</div>
      <div class="ampy-field"><label for="${pfx}-epost">E-post</label><input class="ampy-input" id="${pfx}-epost" name="epost" type="email" autocomplete="email" inputmode="email" required></div>
      <div class="ampy-field"><label for="${pfx}-tel">Telefon</label><input class="ampy-input" id="${pfx}-tel" name="telefon" type="tel" autocomplete="tel" inputmode="tel" required></div>
      <div class="ampy-field"><label for="${pfx}-postnr">Postnummer</label><input class="ampy-input" id="${pfx}-postnr" name="postnummer" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="6" required></div>
    </div>
    <div class="ampy-calc__hp" aria-hidden="true"><label>Lämna detta fält tomt<input name="company_url" type="text" tabindex="-1" autocomplete="off"></label></div>
    <label class="ampy-check"><input type="checkbox" name="samtycke" required><span class="ampy-check__text">Jag godkänner att Ampy sparar mina uppgifter för att kontakta mig med en offert, enligt <a href="#">integritetspolicyn</a>.</span></label>
    <button class="ampy-btn ampy-btn--secondary ampy-calc__cta" type="submit">Skicka offertförfrågan</button>
    <p class="ampy-calc__lead-fine">Kostnadsfritt och utan förbindelse. <button type="button" class="ampy-calc__lead-cancel">Avbryt</button></p>
  </form>
</div>`;
const calcMethod = (open = false) => `<details class="ampy-calc__method"${open ? ' open' : ''}>
  <summary class="ampy-calc__method-summary">Så har vi räknat ${I('chevron-down', 18)}</summary>
  <div class="ampy-calc__method-body">
    <div class="ampy-calc__method-item"><h3>Årlig besparing</h3><code class="ampy-code">(W_före − W_efter) ÷ 1000 × h/dygn × 365 × antal × elpris</code><p>Ren aritmetik på tal du själv ser och kan justera.</p></div>
    <div class="ampy-calc__method-item"><h3>Energi du kapar</h3><code class="ampy-code">(W_före − W_efter) ÷ 1000 × h/dygn × 365 × antal</code><p>Minskningen i elförbrukning (kWh/år), samma procent som i före/efter-jämförelsen.</p></div>
    <div class="ampy-calc__method-item"><h3>Uppskattad kostnad</h3><code class="ampy-code">pris per armatur × antal</code><p>Material och installation ingår i priset.</p></div>
    <div class="ampy-calc__method-disclaimers"><p>Priser är ex moms och inkl. installation. Exakt pris får du i offerten.</p><p>Elpris: medvetet lågt schablonpris per elprisområde (SE1 till SE4). Watt-, kostnads- och timantaganden är konservativt valda.</p></div>
  </div>
</details>`;

const calcDefault = `<div class="ampy-calc ampy-calc--flush" id="calc-default">
  <header class="ampy-calc__head">
    <h2 class="ampy-calc__title">Vad sparar du på att byta till LED?</h2>
  </header>
  <div class="ampy-calc__main">
    ${calcInputCard('c1')}
    <div class="ampy-calc__stack ampy-calc__stack--sticky">
      <section class="ampy-card ampy-card--dark ampy-card--glow ampy-calc__result" aria-label="Ditt resultat">
        ${calcReadout}
        ${calcTrio}
        <hr class="ampy-divider ampy-divider--tight">
        ${calcCompare}
        <hr class="ampy-divider ampy-divider--tight">
        ${calcCta}
      </section>
      ${calcMethod(false)}
    </div>
  </div>
</div>`;

const calcLeadOpen = `<div class="ampy-calc ampy-calc--flush" id="calc-lead">
  <div class="ampy-calc__main">
    ${calcInputCard('c2')}
    <div class="ampy-calc__stack">
      <section class="ampy-card ampy-card--dark ampy-card--glow ampy-calc__result" aria-label="Ditt resultat">
        ${calcReadout}
        ${calcTrio}
        <hr class="ampy-divider ampy-divider--tight">
        ${calcCompare}
        <hr class="ampy-divider ampy-divider--tight">
        ${calcLead('c2', { open: true, invalid: true })}
      </section>
      ${calcMethod(true)}
    </div>
  </div>
</div>`;

const calcMsgs = `<div class="ampy-calc ampy-calc--flush" id="calc-msgs">
  <div class="ampy-calc__lead">
    <p class="ampy-msg ampy-msg--ok" role="status">Tack. Vi hör av oss inom en arbetsdag.</p>
    <p class="ampy-msg ampy-msg--err" role="alert">Det gick inte att skicka. Prova igen eller ring oss på 010-265 79 79.</p>
  </div>
</div>`;

const calcTipDemo = `<div class="ampy-calc ampy-calc--flush" id="calc-tip">
  <div class="ampy-calc__field" style="padding-bottom: 96px">
    <span class="ampy-calc__q">Andel offentlig laddning <span class="ampy-calc__tipwrap"><button type="button" class="ampy-calc__tip" aria-expanded="true" aria-describedby="tip-open">i</button><span class="ampy-calc__popover" role="tooltip" id="tip-open" data-open>Hur stor del av din laddning som i dag sker på publika laddare. Resten antas ske hemma.</span></span></span>
  </div>
</div>`;

const calcSelectorDemo = `<div class="ampy-calc ampy-calc--flush" id="calc-selector">
  <div class="ampy-calc__field ampy-calc__field--prominent">
    <span class="ampy-calc__q">Laddbox att installera</span>
    <div class="ampy-calc__selector is-open">
      <button type="button" class="ampy-calc__selector-btn" aria-haspopup="listbox" aria-expanded="true">
        <span class="ampy-calc__selector-img ampy-calc__selector-img--photo" aria-hidden="true"><img src="${PHOTO}" alt="" width="48" height="48"></span>
        <span class="ampy-calc__selector-text">
          <span class="ampy-calc__selector-name">Zaptec Go</span>
          <span class="ampy-calc__selector-meta">Kompakt, upp till 22 kW</span>
        </span>
        <span class="ampy-tag ampy-tag--sm ampy-tag--success">Bästsäljare</span>
        ${I('chevron-down', 20, 'ampy-calc__selector-chevron')}
      </button>
      <ul class="ampy-calc__selector-list ampy-calc__selector-list--static" role="listbox" aria-label="Laddbox">
        <li class="ampy-calc__selector-group" role="presentation">Rekommenderade</li>
        <li><button type="button" class="ampy-calc__selector-option is-selected" role="option" aria-selected="true"><span class="ampy-calc__selector-img">${inline.bulb(20)}</span><span class="ampy-calc__selector-option-name">Zaptec Go</span><span class="ampy-tag ampy-tag--sm ampy-tag--success">Bästsäljare</span></button></li>
        <li><button type="button" class="ampy-calc__selector-option" role="option"><span class="ampy-calc__selector-img">${inline.bulb(20)}</span><span class="ampy-calc__selector-option-name">Easee Charge Lite</span><span class="ampy-tag ampy-tag--sm ampy-tag--action">Prisvärd</span></button></li>
        <li class="ampy-calc__selector-group" role="presentation">Företag och BRF</li>
        <li><button type="button" class="ampy-calc__selector-option" role="option"><span class="ampy-calc__selector-img">${inline.bulb(20)}</span><span class="ampy-calc__selector-option-name">Zaptec Pro</span><span class="ampy-tag ampy-tag--sm ampy-tag--neutral">Offert</span></button></li>
        <li><button type="button" class="ampy-calc__selector-option" role="option" aria-disabled="true"><span class="ampy-calc__selector-img">${inline.bulb(20)}</span><span class="ampy-calc__selector-option-name">Garo Entity Pro</span><span class="ampy-calc__selector-option-meta">Slut i lager</span></button></li>
      </ul>
    </div>
  </div>
</div>`;

const calcShareDemo = `<div class="ampy-calc ampy-calc--flush" id="calc-share">
  <div class="ampy-calc__share">
    <div class="ampy-calc__share-pop ampy-calc__share-pop--static" role="menu" aria-label="Dela din kalkyl">
      <button type="button" class="ampy-calc__share-act" role="menuitem">${I('copy', 18)}<span>Kopiera länk</span></button>
      <a class="ampy-calc__share-act" role="menuitem" href="#">${I('mail', 18)}<span>Dela via mejl</span></a>
      <a class="ampy-calc__share-act is-done" role="menuitem" href="#">${inline.facebook(18)}<span>Delad på Facebook</span></a>
    </div>
    <button type="button" class="ampy-calc__share-btn" aria-haspopup="menu" aria-expanded="true">Dela din kalkyl</button>
  </div>
</div>`;

const calcStreams = `<div class="ampy-calc ampy-calc--flush" id="calc-streams">
  <div class="ampy-calc__evidence">
    <span class="ampy-eyebrow">Fyra intäktskällor</span>
    <div class="ampy-calc__streams-bar" role="img" aria-label="Fördelning av årlig avkastning: stödtjänster 40 procent, spotpris 23, effekttoppar 12, egenanvändning 25">
      <span class="ampy-calc__streams-seg" style="--_w: 40%"></span><span class="ampy-calc__streams-seg" style="--_w: 23%"></span><span class="ampy-calc__streams-seg" style="--_w: 12%"></span><span class="ampy-calc__streams-seg" style="--_w: 25%"></span>
    </div>
    <details class="ampy-calc__streams-details" open>
      <summary class="ampy-calc__streams-summary"><span>Se fördelningen</span> ${I('chevron-down', 14)}</summary>
      <ul class="ampy-calc__streams-legend">
        <li class="ampy-calc__stream"><span class="ampy-calc__stream-dot" style="--_c: var(--ampy-action)"></span><span class="ampy-calc__stream-name">Stödtjänster</span><span class="ampy-calc__stream-val">9 300 kr<small>40 %</small></span></li>
        <li class="ampy-calc__stream"><span class="ampy-calc__stream-dot" style="--_c: var(--ampy-success)"></span><span class="ampy-calc__stream-name">Spotpris-arbitrage</span><span class="ampy-calc__stream-val">5 400 kr<small>23 %</small></span></li>
        <li class="ampy-calc__stream"><span class="ampy-calc__stream-dot" style="--_c: var(--_stream-3)"></span><span class="ampy-calc__stream-name">Effekttoppskapning</span><span class="ampy-calc__stream-val">2 800 kr<small>12 %</small></span></li>
        <li class="ampy-calc__stream"><span class="ampy-calc__stream-dot" style="--_c: var(--_stream-4)"></span><span class="ampy-calc__stream-name">Ökad egenanvändning</span><span class="ampy-calc__stream-val">5 800 kr<small>25 %</small></span></li>
      </ul>
    </details>
  </div>
</div>`;

const calcChart = `<div class="ampy-calc ampy-calc--flush" id="calc-chart">
  <div class="ampy-calc__evidence">
    <span class="ampy-eyebrow">Payback-kurva</span>
    <div class="ampy-calc__chart" role="img" aria-label="Ackumulerat resultat över 15 år: återbetald efter 2,4 år, plus 293 087 kronor efter 15 år">
      <div class="ampy-calc__chart-inner">
        <div class="ampy-calc__chart-top"><span class="ampy-calc__chart-corner ampy-calc__chart-corner--end">+293 087 kr</span></div>
        <div class="ampy-calc__chart-plot">
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="340" x2="1000" y2="340" stroke="rgba(255,255,255,.32)" stroke-width="1.5" stroke-dasharray="3.5 3.5"/>
            <polygon points="0,400 0,340 160,340" fill="var(--_zone-loss)"/>
            <polygon points="160,340 1000,340 1000,10" fill="var(--_zone-profit)"/>
            <polyline points="0,400 160,340" fill="none" stroke="var(--ampy-warn)" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
            <polyline points="160,340 1000,10" fill="none" stroke="var(--ampy-action)" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          </svg>
        </div>
        <div class="ampy-calc__chart-axis">
          <span class="ampy-calc__chart-corner ampy-calc__chart-corner--today">I dag</span>
          <span class="ampy-calc__chart-corner ampy-calc__chart-corner--axis-end">15 år</span>
        </div>
        <div class="ampy-calc__be" style="--_be-x: 16%; --_be-y: 0.15">
          <span class="ampy-calc__be-dot"></span>
          <span class="ampy-calc__be-line"></span>
          <div class="ampy-calc__be-label"><span class="ampy-calc__be-caption">Återbetald</span><span class="ampy-calc__be-time">2,4 år</span></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const calcPage = shell({
  title: 'Kalkylator-kitet', eyebrow: 'Komponenter', active: 'verktyg.html',
  lead: 'Tvåpanel-verktyget som räknar åt kunden: vitt inputkort till vänster, mörkt resultatkort till höger. Kanon är LED-kalkylatorn (auktoritet 1); EV och batteri är samma kit med drift. Allt nedan är klassen <code>.ampy-calc</code> komponerad med systemets primitiver.',
  body: `
<ul class="ds-toc">
  <li><a href="#skal">Tvåpanel-skalet</a></li><li><a href="#input">Inputkortet</a></li><li><a href="#resultat">Resultatkortet</a></li><li><a href="#lead">Inline-lead</a></li><li><a href="#tips">Tips-chip och popover</a></li><li><a href="#selector">Produktväljare</a></li><li><a href="#dela">Dela</a></li><li><a href="#battery">Streams-bar och break-even</a></li><li><a href="#paritet">Paritet</a></li><li><a href="#avvikelser">Avvikelser och drift</a></li>
</ul>

<div class="ds-dep"><strong>Komponerat med S2 (falt.css):</strong> segment (<code>.ampy-segment</code>), reglage med ticks (<code>.ampy-range-wrap</code>, <code>.ampy-range</code>, <code>.ampy-range__ticks</code>), select (<code>.ampy-select</code>), lead-fälten (<code>.ampy-fields</code>, <code>.ampy-field</code>, <code>.ampy-input</code>, <code>.ampy-error</code>), samtycke (<code>.ampy-check</code>), meddelanden (<code>.ampy-msg</code>) och hjälptext (<code>.ampy-help</code>) kommer från falt.css, inklusive deras mörka varianter. Kitet självt (verktyg.css) äger bara skalet, tier/fält-rytmen, tips-chipet, väljaren, det prominenta värdet, staplarna, lead-flödet runt fälten, metodkortet, dela och de två batteri-devices.</div>

${h2('skal', 'Tvåpanel-skalet')}
${p('Container 1280, rubrik ovanför, grid 5fr/7fr med gap 20 som blir en kolumn under 960 px containerbredd. Vitt inputkort (<code>.ampy-card--flat --tight</code>) till vänster, mörkt resultatkort (<code>.ampy-card--dark</code>, glöden <code>--glow</code> är tillval per B9) till höger med "Så har vi räknat" som eget vitt kort under. Resultatkolumnen kan vara sticky (<code>.ampy-calc__stack--sticky</code>, energycalc-mönstret).')}
${source('Kanon: led-kalkylator (styles.css:96-134). Finns även i: ev-kalkylator (padding 20 överallt, cqi-brytpunkter), battery-calculator (overflow-defekt 394,9 px på 390), energycalc (egen familj: 1360-shell, sticky inputkort 420, jump-pill). Blockbiblioteket: <a class="ds-a" href="../blockbibliotek.html#led-kalkylator">LED-kalkylatorn</a>.')}
${example({ id: 'ex-calc-default', label: 'Default, 1440 = två kolumner, 390 = staplat', html: calcDefault, code: false })}
<figure class="ds-shot"><img src="../bilder/led-kalkylator-desktop.jpg" alt="LED-kalkylatorn, källans rendering 1440" loading="lazy"><img src="../bilder/led-kalkylator-mobile.jpg" alt="LED-kalkylatorn, källans rendering 390" loading="lazy"><figcaption>Så ser källan ut (LED-kalkylatorn live). Skillnaderna mot kitet ovan står under Avvikelser: Outfit i stället för Plus Jakarta Sans och JetBrains Mono, teal-deep i stället för teal-core på knappen, tokenradier.</figcaption></figure>
${h3('skal-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Token'], [
  ['Container', '1280, padding 19,8 / 14', 'padding 13,3 / 10,5', '<code>--ampy-container</code>, <code>--ampy-space-s</code> / <code>-xs</code> (LED 20/15, 15/10)'],
  ['Grid', '5fr / 7fr, gap 19,8', 'en kolumn, gap 13,3', '<code>--ampy-space-s</code> (LED gap 20); brytpunkt 960 (LED) som containerfråga'],
  ['Inputkort', 'radie 20, padding 19,8, 1 px kant, shadow-subtle', 'radie 16,3, padding 13,3', '<code>.ampy-card--flat --tight</code> (LED radie 20 fast, padding 20/15)'],
  ['Resultatkort', 'radie 20, padding 39,6, gap 28, shadow-raised', 'radie 16,3, padding 16,9 / 13,3, gap 13,3', '<code>.ampy-card--dark</code> + kitets padding (LED 40 / 30; mobil 20 15 / 20)'],
  ['Glöd', 'två radialer teal .28 / emerald .16', 'samma', '<code>--ampy-bg-dark-glow</code> via <code>.ampy-card--glow</code>, tillval (B9)'],
  ['Rubrik', '36 / 700', '26,8 / 700', '<code>--ampy-text-h2</code> (LED PJS 34/24)'],
])}
<div class="ds-code"><pre><code>${esc(`<div class="ampy-calc">
  <header class="ampy-calc__head"><h2 class="ampy-calc__title">Vad sparar du på att byta till LED?</h2></header>
  <div class="ampy-calc__main">
    <section class="ampy-card ampy-card--flat ampy-card--tight ampy-calc__input" aria-label="Dina värden">
      <!-- tiers och fält, se Inputkortet -->
    </section>
    <div class="ampy-calc__stack ampy-calc__stack--sticky">
      <section class="ampy-card ampy-card--dark ampy-card--glow ampy-calc__result" aria-label="Ditt resultat">
        <!-- readout, stat-trio, staplar, CTA, se Resultatkortet -->
      </section>
      <details class="ampy-calc__method">…</details>
    </div>
  </div>
</div>`)}</code></pre></div>
${dodont(
  ['Värde först: resultatet syns från första målning, formuläret öppnas först när CTA:n klickas.', 'En kolumn under 960 px containerbredd; inputkortet överst så att reglagen kommer före siffran på mobil.', 'Tabular-nums på alla siffror så att staplar och belopp står stilla när värdet ändras.'],
  ['Ingen e-postvägg framför resultatet (LED, EV, energycalc gör alla värde-först).', 'Ingen glöd som default på andra mörka ytor; radialerna är kitets tillval (B9).', 'Inga tre typsnitt: Outfit ensam, siffror med tabular-nums (B7).'],
)}

${h2('input', 'Inputkortets sektioner')}
${p('Tier med eyebrow, fråga med tips-chip, segmenterat val, produktväljare med ikon och underrad, prominent värde med reglage och tick-etiketter, native select, och en hårlinje mellan tier 1 och tier 2. Segment, reglage och select är fältprimitiver (S2); kitet äger tier, fråga, hint, prominent värde, ticks och väljaren.')}
${source('Kanon: led-kalkylator (styles.css:137-157 tier/fält, 161-206 väljare, 210-236 värde + reglage, 249-259 segment, 285-290 select). Finns även i: ev-kalkylator (foto-väljare, AC/DC-toggle, tick-marker), energycalc (heat-picker-kort, glidande seg-pill, stepper), battery (segment 33 px hög = under 44-golvet).')}
${example({ id: 'ex-calc-input', label: 'Inputkortet ensamt', html: `<div class="ampy-calc ampy-calc--flush" id="calc-input" style="max-width: 512px">${calcInputCard('c3')}</div>`, codeNote: 'Tips-chipens popover öppnas på hover/fokus i exemplet; i produktion fäster JS den i body med fixed position (EV-mönstret).' })}
${h3('input-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Tier-etikett', 'eyebrow 12 / 600 / .14em', '12', 'LED 15/600/.08em, krymper till eyebrow-rollen (B19)'],
  ['Tier 2-avdelare', 'margin 14 + padding 14 + 1 px', '10,5 + 10,5 + 1', '<code>--ampy-space-xs</code>, <code>--ampy-line</code> (LED 15 + 15)'],
  ['Fråga (tiny)', '13 / 500 dämpad, gap 5', '13', '<code>--ampy-fine</code>, <code>--ampy-space-4xs</code> (LED field-label-tiny 13/500)'],
  ['Fråga (stark)', '14 / 600 ink', '14', '<code>--ampy-text-label</code> (LED PJS 600 15)'],
  ['Tips-chip', '16 × 16, 10/700, 1 px kant', '16 (44 träffyta på touch)', 'kit-egen <code>--_tip</code> (LED 1.6rem), hover teal-deep + vit (B5)'],
  ['Prominent värde', '28 / 700 tnum, enhet 16 / 500 dämpad', '21 / 700, enhet 14,1', 'kit-egen <code>--_mid</code> = LED --fs-xl; enhet small (LED 15)'],
  ['Tick-etiketter', 'min-höjd 32, 13 tnum, aktiv teal-deep 700', 'samma', 'S2 <code>.ampy-range__tick</code> (LED 3.2rem, mono 13, aktiv teal-core: B5)'],
  ['Väljare', '78 hög, ikonruta 56 radie 8, namn 18/600, meta 13', '78, radie 6,1', 'LED 78 / 56 / radie 6, PJS 600 19'],
  ['Segment', 'spår 48 radie 12 padding 4, option 40 radie 8', '48 / 40, radie 10,1 / 6,1', 'S2 <code>.ampy-segment</code> (LED 48/40, radie 12/6)'],
  ['Reglage', 'spår 6, tumme 24 med 3 px teal, träffyta 44', 'samma', 'S2 <code>.ampy-range</code> (LED)'],
  ['Select', '48 hög, radie 12, 16', '48, radie 10,1, 14,1', 'S2 <code>.ampy-select</code> (LED 48, radie 12, Outfit 15)'],
])}
<div class="ds-code"><pre><code>${esc(`<div class="ampy-calc__tier ampy-calc__tier--primary">
  <span class="ampy-eyebrow">Vad du byter</span>
  <div class="ampy-calc__field">
    <span class="ampy-calc__q">Vem räknar vi för?
      <span class="ampy-calc__tipwrap"><button type="button" class="ampy-calc__tip" aria-describedby="t1">i</button><span class="ampy-calc__popover" role="tooltip" id="t1">BRF, företag och privatperson räknas olika.</span></span>
    </span>
    <div class="ampy-segment" role="radiogroup" aria-label="Vem räknar vi för?">
      <label class="ampy-segment__option"><input type="radio" name="seg" checked><span>BRF</span></label>
      <label class="ampy-segment__option"><input type="radio" name="seg"><span>Företag</span></label>
      <label class="ampy-segment__option"><input type="radio" name="seg"><span>Privat</span></label>
    </div>
    <p class="ampy-help">Vi räknar för föreningens gemensamma belysning.</p>
  </div>
  <div class="ampy-calc__field ampy-calc__field--prominent">
    <label class="ampy-calc__q" for="antal">Antal armaturer</label>
    <span class="ampy-calc__value"><span>80</span><span class="ampy-calc__unit">st</span></span>
    <div class="ampy-range-wrap">
      <input class="ampy-range" id="antal" type="range" min="40" max="400" step="10" value="80" style="--_fill: 11%">
      <ul class="ampy-calc__ticks" aria-hidden="true"><li><button type="button" class="ampy-calc__tick" tabindex="-1">40</button></li><li><button type="button" class="ampy-calc__tick is-active" tabindex="-1">80</button></li>…</ul>
    </div>
  </div>
</div>`)}</code></pre></div>
${dodont(
  ['Etiketten ovanför, värdet stort med enheten baseline-satt i mindre och dämpad, reglaget under.', 'Tick-etiketter som klickbara knappar med 32 px höjd; den aktiva i teal-deep 700.', 'Segment med sunk track / raised pill: spår subtil, vald = vit pill + shadow-subtle + teal-deep-text.'],
  ['Aldrig teal-core som text (2,96:1): aktiv tick och segment-text är teal-deep.', 'Ingen tooltip som täcker rubriken på 390 (LED:s defekt); popovern breddkapas till 280 och fästs vid chipet.', 'Inga tick-etiketter under 13 px (EV:s 9 px på mobil är en defekt).'],
)}

${h2('resultat', 'Resultatkortet')}
${p('Eyebrow, hjältesiffra med enhet och undertext (<code>.ampy-readout</code>), stat-trio med underetiketter (<code>.ampy-stat-trio</code>), hårlinje, före/efter-staplarna (kitets signaturenhet: "I dag" amber mot "Med LED" emerald i samma spår, belopp i tabular-nums), hårlinje, CTA. Staplarnas bredd sätts med <code>--_w</code>.')}
${source('Kanon: led-kalkylator (styles.css:293-297 hero, 300-311 trio, 398-412 compare, 325-333 CTA). Finns även i: ev-kalkylator (månadspanel med två 10 px-staplar och "Du sparar"-delta i stället för före/efter-raden; hjältesiffran 38,7 px pga cqi-buggen), battery (streams-bar + payback-kurva, se nedan), energycalc (anchor Outfit 900 52, Sparstaplarna 10 px + mint-band).')}
${example({ id: 'ex-calc-result', label: 'Resultatkortet ensamt', dark: false, html: `<div class="ampy-calc ampy-calc--flush" id="calc-result" style="max-width: 717px"><section class="ampy-card ampy-card--dark ampy-card--glow ampy-calc__result" aria-label="Ditt resultat">
${calcReadout}
${calcTrio}
<hr class="ampy-divider ampy-divider--tight">
${calcCompare}
<hr class="ampy-divider ampy-divider--tight">
${calcCta}
</section></div>` })}
${h3('resultat-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Eyebrow', '12 / 600 / .14em, vit .66', '12', '<code>.ampy-eyebrow</code> på mörkt (LED PJS 600 15 .06em .66)'],
  ['Hjältesiffra', '56 / 700 / lh 1 / −.03em tnum', '38,3', '<code>--ampy-text-number</code> = LED:s clamp exakt (PJS → Outfit)'],
  ['Enhet', '28 / 500 vit .66, baseline-gap 12', '21', '<code>.ampy-readout__unit</code> (LED --fs-xl 28/21)'],
  ['Undertext', '16 vit .66', '14,1', '<code>--ampy-text-small</code> (LED 15)'],
  ['Stat-trio', '3 kolumner, etikett 12 / värde 28 / sub 13; staplas ≤ 560', 'staplad, 10 mellan', '<code>.ampy-stat-trio</code> (LED trio-label 13, value 28, sub 13)'],
  ['Stapelspår', 'höjd 24, radie pill, vit .06; stapel min 16', '24', 'kit-egen <code>--_track</code> (LED 2.4rem), <code>--ampy-on-dark-subtle</code>'],
  ['Nyckel / belopp', 'nyckel 60 bred 13/600, belopp min 90, 16/600 tnum', 'nyckel 50, belopp 75, 13', 'LED 6rem / 9rem (≤ 560: 5 / 7.5), mono 600 15'],
  ['Amber / emerald', '#f0af38 / #39c281', 'samma', '<code>--ampy-warn</code> (bara på mörkt) / <code>--ampy-success</code>'],
  ['CTA', '58 hög, radie 16, 16/600 vit på teal-deep', '58', '<code>.ampy-btn--secondary</code> (LED 50 hög, radie 12, PJS 600 15 på teal-core: B4, B5, B6)'],
])}
<div class="ds-code"><pre><code>${esc(`<section class="ampy-card ampy-card--dark ampy-card--glow ampy-calc__result" aria-label="Ditt resultat">
  ${calcReadout.replace(/\n/g, '\n  ')}
  <div class="ampy-stat-trio">
    <div class="ampy-stat"><span class="ampy-stat__label">Energi du kapar</span><span class="ampy-stat__value">16 819<span class="ampy-stat__unit">kWh/år</span></span><span class="ampy-stat__sub">59 % lägre förbrukning</span></div>
    …
  </div>
  <hr class="ampy-divider ampy-divider--tight">
  ${calcCompare.replace(/\n/g, '\n  ')}
  <hr class="ampy-divider ampy-divider--tight">
  <div class="ampy-calc__cta-stack">
    <button class="ampy-btn ampy-btn--secondary ampy-calc__cta" type="button">Få en skräddarsydd offert <svg class="ampy-btn__icon" width="18" height="18" aria-hidden="true"><use href="…/ikoner.svg#ik-arrow-right"/></svg></button>
  </div>
</section>`)}</code></pre></div>
${dodont(
  ['Siffran är hjälten: eyebrow ovanför, enheten i halva storleken på samma baslinje, undertexten dämpad.', 'Staplarna gör matematiken synlig: kostnadsskillnaden ÄR besparingen, och captionen säger procenten.', 'En hårlinje mellan sektionerna, kortets gap ger luften (margin 0 på linjen).'],
  ['Ingen centrerad vit rubrik på det mörka kortet (AI-slop-defaulten, B9): siffran står till vänster.', 'Ingen andra CTA i samma kort (EV:s "Läs mer om Zaptec Go" renderade teal på midnatt = kontrastdefekt).', 'Inga "≈"-prefix eller ±-spann i hjältesiffran utan att undertexten förklarar dem.'],
)}

${h2('lead', 'Inline-lead: formuläret under CTA:n')}
${p('Klick på CTA:n byter ut knappen mot formuläret på samma mörka kort (LED). Fyra fält i två kolumner från 600 px containerbredd, honeypot, samtyckesruta, submit, finstilt med "Avbryt". Fel visas vid fältet (EV:s inline-fel, inte LED:s samlade meddelande). Nedan: formuläret öppet med ett ogiltigt fält, och metodkortet utfällt.')}
${source('Kanon: led-kalkylator (styles.css:351-396). Finns även i: ev-kalkylator (CTA:n står kvar ovanför formuläret, native checkbox, inline-fel), energycalc (reveal via grid-rows, CTA:n morfar till "Stäng", samtycke som text utan ruta), elcentral/elkollen (lead som eget steg i kortet, 52/48 höga fält, samtyckesnot).')}
${example({ id: 'ex-calc-lead', label: 'Lead-formuläret öppet + ogiltigt fält + metodkortet öppet', html: calcLeadOpen, code: false })}
${example({ id: 'ex-calc-msgs', label: 'Skickat / fel', dark: true, full: false, html: calcMsgs, code: false })}
${h3('lead-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Fält', '48 hög, radie 12, bg vit .05, kant vit .28, 16', '48, radie 10,1, 14,1', 'S2 <code>.ampy-input</code> + kitets mörka yta (LED 48, radie 12, Outfit 15)'],
  ['Etikett', '13 / 500 vit .92', '13', 'S2 <code>.ampy-field > label</code> (14/600), kitet drar ned till LED 13/500'],
  ['Fokus', 'kant neonmint + ring .30', 'samma', '<code>--ampy-focus-on-dark</code> (LED rgb(28,196,175) .35: B14)'],
  ['Fel', 'kant signalröd + ring, text 13/500 #ffb4b6 på mörkt', 'samma', 'S2 <code>.ampy-field.is-error</code> + <code>.ampy-error</code> (LED rgb(214,76,76) 4,2:1: B13)'],
  ['Samtyckesruta', '20 × 20 radie 8, 1,5 px kant vit .28, vald = teal + vit bock', 'samma', 'S2 <code>.ampy-check</code> (LED 18 radie 4 = drift enligt S2)'],
  ['Submit', '58 hög', '58', '<code>.ampy-btn--secondary</code> (LED 48)'],
  ['Metodkortet', 'vit, radie 12, padding 9,9 / 14, summary 18/600 44 hög', 'radie 10,1', 'LED radie 12, padding 10 15, PJS 600 19; items label 14/600, kod <code>.ampy-code</code>, p 13'],
])}
<div class="ds-code"><pre><code>${esc(calcLead('lead', { open: true, invalid: true }))}</code></pre></div>
<div class="ds-code"><pre><code>${esc(calcMethod(true))}</code></pre></div>
${dodont(
  ['Formuläret ersätter knappen och bor på samma kort: kunden lämnar aldrig resultatet.', 'Fel vid fältet i röd tint på mörkt (rött på midnatt läses inte), ringen är samma färg som kanten.', 'Honeypot + novalidate med egen felhantering, aldrig webbläsarens bubblor.'],
  ['Ingen fokusring som samtidigt är teal när kanten är röd (LED:s defekt).', 'Ingen samlad felrad under finstilten, långt från fältet (LED).', 'Ingen e-post som enda fält (battery-prototypens "Maila kalkylen" var en vägg).'],
)}

${h2('tips', 'Tips-chip och popover')}
${p('16 px cirkel med "i" intill etiketten. Hover, fokus och aria-expanded ger teal-deep-yta. Popovern är EV:s: bredd-kapad till 280, midnatt, 13/1.45, radie 6, caret 9 px, 150 ms fade. På touch växer den osynliga träffytan till 44 px utan att cirkeln växer.')}
${source('Kanon: led-kalkylator (styles.css:268-274 chip) + ev-kalkylator (prototype/styles.css:864-935 popover, ersätter LED:s fixed tooltip som täcker H1 på 390). Finns även i: energycalc (15 px slate-ikoner utan tooltip).')}
${example({ id: 'ex-calc-tip', label: 'Popover öppen (aria-expanded="true")', full: false, html: calcTipDemo })}
${dodont(['Chipet är ett riktigt knappelement med aria-describedby till popovern.', 'Popovern fästs vid chipet och kapas i bredd; JS klämmer den mot kanten och siktar careten.', 'Escape och klick utanför stänger.'], ['Ingen tooltip som bara reagerar på hover (touch får inget).', 'Ingen popover bredare än 280 px eller som slab i full bredd.', 'Ingen teal-core-yta med vit text på chipet (2,96:1).'])}

${h2('selector', 'Produktväljare med foto och badge')}
${p('LED:s väljare med ikonruta 56; EV lägger foto 48 × 48 i en vit slot, en badge före chevronen och en scrollbar lista med gruppetiketter, 40 px ikonrutor och tre badge-nivåer. Här renderas listan öppen i flödet (<code>--static</code>).')}
${source('Kanon: led-kalkylator (styles.css:161-206). Finns även i: ev-kalkylator (foto, badge promote / soft / muted, 16 laddboxar, max-height min(50rem, 60vh)), battery (samma som LED).')}
${example({ id: 'ex-calc-selector', label: 'Listan öppen, foto, badges', full: false, html: calcSelectorDemo, codeNote: 'Badge = <code>.ampy-tag--sm</code> med nivå (--success promote, --action soft, --neutral muted). EV:s 10 px-badge lyfts till 12 (eyebrow-golvet).' })}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Knapp', '78 hög, padding 9,9, gap 9,9, radie 12, 1 px kant', '78, radie 10,1', 'LED 78, padding 10, radie 12 (EV 70/65 med foto)'],
  ['Ikonruta / foto', '56 radie 8 subtil bg / 48 vit slot', '56 radie 6,1', 'LED 5.6rem radie 6; EV 4.8rem'],
  ['Namn / meta', '18/600 ellipsis / 13 dämpad', '16,1 / 13', 'LED PJS 600 19 / 13'],
  ['Lista', 'radie 12, shadow-raised, padding 5, max min(440, 60vh)', 'radie 10,1', 'LED min(44rem, 60vh)'],
  ['Option', 'padding 7, radie 8, hover/vald subtil bg, fokus inset 2 px teal-deep', 'samma', 'LED 37,5 hög (utan foto), EV 63 (med foto)'],
])}

${h2('dela', 'Dela-popover')}
${p('Energycalcs tysta textknapp (44 hög, 13/300) med en popover ovanför: 240 bred, chip-yta #11163f, 1 px vit .14, radie 12, tre 44-rader med ikon 18 i mint. Kopierad rad markeras med <code>.is-done</code>. Diagnostikens ljusa variant (ikonknapp + meny) står på diagnostiksidan.')}
${source('Kanon: energycalc (vB/tool.css:467-491). Finns även i: elcentral-kollen (44 × 44 ikonknapp + ljus meny + toast), ev-kalkylator (popover av tooltip-typ).')}
${example({ id: 'ex-calc-share', label: 'Popover öppen', dark: true, full: false, html: calcShareDemo })}

${h2('battery', 'Streams-bar och break-even-kurva (prototyp, ej kanon)')}
${p('De två devices som bara finns i batterikalkylatorn (auktoritet 3, aldrig live). Streams-bar: 24 px pill med fyra segment vars bredd är andelen, legend på begäran. Break-even: tre kurvfria remsor (slutvärde, plot, axel) och ETT HTML-förankrat märke "Återbetald" på <code>--_be-x</code> / <code>--_be-y</code>, så text aldrig kolliderar med kurvan. Belägg, inte kanon: skillen refererar dem, men ingen auk 1-källa bär dem.')}
${source('Belägg: battery-calculator (index.html:666-717 streams, 735-885 chart). LED/EV bär klasserna och <code>--chart-stream-3/4</code> som dött arv.')}
${example({ id: 'ex-calc-streams', label: 'Streams-bar + legend (prototyp)', dark: true, full: false, html: calcStreams })}
${example({ id: 'ex-calc-chart', label: 'Break-even-kurva (prototyp, statisk SVG)', dark: true, full: false, html: calcChart, codeNote: 'Färger: linje amber → teal vid nollgenomgången, zoner i samma tokens i alfa (.18 / .16). Segment 3 och 4 (rgb(122,208,198) / rgb(160,184,196)) saknar token och står som kit-egna.' })}

${h2('paritet', 'Paritet mot källan')}
${p('Kitets exempel ovan mätta i Chromium vid 1440 och 390, i en 1280-ram som motsvarar LED:s container, mot källans uppmätta värden i inventeringen.')}
${parityTable('calc')}

${h2('avvikelser', 'Avvikelser och drift')}
${table(['Var', 'Källan', 'Kitet', 'Skäl'], [
  ['Typsnitt', 'Plus Jakarta Sans (rubrik, etiketter, siffror) + Outfit + JetBrains Mono (inputsiffror)', 'Outfit överallt, siffror med tabular-nums', 'B7, brandbok + live + energycalc + Elkollen v7'],
  ['Bläck', 'rgb(15,18,60) / rgb(86,94,130)', '<code>--ampy-ink</code> midnight / <code>--ampy-ink-muted</code> #565e82', 'near-miss konsolideras (tokens.css)'],
  ['Inputkortets yta', 'rgb(247,249,251)', 'vit', 'near-miss av sky-mist; alla kort är vita (26 källor)'],
  ['CTA', '50 hög, radie 12, PJS 600 15, teal-core + vit (2,96:1)', '58, radie 16, Outfit 600 16, teal-deep + vit (5,3:1)', 'B4 (radie 16), B5 (teal-kontrast), B6 (solid = teal-deep i verktyg)'],
  ['Eyebrows', 'tier 15/600 .08em, hero 15/600 .06em, trio 13/600 .04em', '12/600 .14em', 'B19: ett eyebrow-system'],
  ['Kortradie på mobil', '20 fast', '16,3 (<code>--ampy-radius-card</code>)', 'radien följer tokenkurvan; källan var rem-fast'],
  ['Metodkortets radie', '12', '12 → 10,1 på mobil', '<code>--ampy-radius-field</code>; LED-defekten "12 mot korten 20" kvarstår som avsiktlig hierarki (kortet är sekundärt)'],
  ['Fokusringar', 'sju varianter teal .2 till .35', 'en ring: <code>--ampy-focus-ring</code> (ljust) / neon .30 (mörkt)', 'B14'],
  ['Fel', 'rgb(214,76,76) (4,2:1)', '<code>--ampy-error</code> #b3261e + tint-text på mörkt', 'B13'],
  ['Brytpunkter', '@media 960 / 768 / 600 / 560 / 380', '@container 960 / 600 / 560 på <code>.ampy-calc</code>', 'verktyget svarar på sitt utrymme (EV-mönstret), inte på viewporten'],
  ['Skuggor', 'rgba(15,18,60,.06/.08/.14)', '<code>--ampy-shadow-subtle / -card / -raised</code>', 'en skuggfärg (midnight-alfa), B10'],
])}
${h3('drift', 'Drift i de andra instanserna')}
${table(['Instans', 'Avviker så här'], [
  ['ev-kalkylator (auk 1)', 'Typskalan låst av cqi-buggen (h1 23, hjälte 38,7 avsett 75); mörkad teal rgb(0,125,107) som andra primär; kortpadding 20 överallt (10 på 390); slider 150 ms; CTA 56/17; CTA:n står kvar ovanför formuläret; native checkbox; månadspanel i stället för före/efter-raden; 40 % oanvänd CSS.'],
  ['battery-calculator (auk 3)', 'Samma px-bugg i typskalan (hjälte 44); faint .42 (3,99:1); toggle 30 / segment 33 px höga; inputkortet 394,9 px bred på 390 (overflow); e-postrad som vägg. Bär streams-bar och break-even som enda källa.'],
  ['energycalc (auk 1)', 'Egen kodfamilj (.input/.result/.seg): shell 1360, sticky inputkort 420, anchor Outfit 900 52, native range 28/2 px, glidande seg-pill #00806e, fyra tealer och fyra gråblå utanför tokens, samtycke utan ruta, trust-kort med foto, jump-pill.'],
  ['B9 (glöd)', 'LED, EV, battery har identisk glöd (teal .28 / emerald .16); energycalc tre radialer + inset-highlight; visste-du-att en radial. Kitet: <code>.ampy-card--glow</code> är tillval på resultatkort, aldrig default på andra mörka ytor.'],
])}
${h3('tokens-brister', 'Brister i tokens.css som kitet stötte på')}
<ul class="ds-p" style="padding-left:1.8rem">
  <li>Ingen mellanstorlek 28 / 21 för prominent värde och hjälte-enhet (LED --fs-xl): kit-egen <code>--_mid</code> (samma i text.css).</li>
  <li>Ingen felfärg för text på mörkt (falt.css valde #ffb4b6, kitet ärver den); tokens har bara <code>--ampy-error</code>.</li>
  <li>Ingen chip-yta för mörka popovers (#11163f) och inga chart-färger 3/4: kit-egna med källa.</li>
  <li>Container-brytpunkter finns bara som dokumentation (kan inte läsas i @container): 960 / 600 / 560 skrivna som literaler.</li>
</ul>
` });

/* ============================================================================
   DIAGNOSTIK-KITET
   ============================================================================ */
const railBullets = `<ul class="ampy-list ampy-list--check">
  <li>${I('check', 20)}<span>Byggt på Elsäkerhetslagen och Elsäkerhetsverket</span></li>
  <li>${inline.shield(20)}<span>Registrerat elinstallationsföretag</span></li>
  <li>${I('check-circle', 20)}<span>Ett ärligt besked, byggt på dina egna svar</span></li>
</ul>`;
const rail = (title = 'Är din elcentral säker?', lead = 'Ta reda på om din central är säker och anpassad för framtida installationer.') => `<div class="ampy-diag__rail">
  <h2 class="ampy-diag__rail-title">${title}</h2>
  <p class="ampy-diag__rail-lead">${lead}</p>
  ${railBullets}
  <p class="ampy-diag__rail-ask">Hellre prata med en elektriker direkt?</p>
  <div class="ampy-diag__rail-actions">
    <a class="ampy-btn ampy-btn--block" href="#">Kontakta oss ${I('arrow-up-right', 16, 'ampy-btn__icon')}</a>
    <a class="ampy-btn ampy-btn--ring ampy-btn--block ampy-link--tel" href="tel:+4610265797979"><span class="ampy-btn__chip">${I('phone', 17)}</span><span>010-265 79 79</span></a>
  </div>
  <p class="ampy-diag__rail-stat">Elsäkerhetsverket registrerade 298 händelser 2018 till 2022 där elcentralen var orsaken.</p>
</div>`;
const steps = (cur, total = 7) => `<ul class="ampy-diag__steps" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<li class="ampy-diag__step${i < cur - 1 ? ' is-done' : i === cur - 1 ? ' is-current' : ''}"></li>`).join('')}</ul>`;
const crumbQ = (cur) => `<div class="ampy-diag__crumb">
  <span class="ampy-diag__crumb-left">${steps(cur)}<span class="sr-only">Fråga ${cur} av 7</span></span>
  <button type="button" class="ampy-diag__back">${I('arrow-right', 16)}Tillbaka</button>
</div>`;
const crumbResult = `<div class="ampy-diag__crumb ampy-diag__crumb--result">
  <button type="button" class="ampy-diag__back">${I('arrow-right', 16)}Tillbaka</button>
  <button type="button" class="ampy-diag__restart">Börja om</button>
</div>`;
const startCard = `<section class="ampy-diag__card ampy-diag__card--start" aria-label="Start">
  <div class="ampy-diag__start-illu" aria-hidden="true">${inline.panel(48)}</div>
  <h3 class="ampy-diag__start-title">Då sätter vi igång</h3>
  <button type="button" class="ampy-btn ampy-btn--secondary ampy-btn--compact ampy-diag__start-cta">Starta testet ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
  <p class="ampy-diag__start-time">Beräknad tid: 2 minuter</p>
</section>`;
const chip = (title, { selected = false, clarifier = '', multi = false } = {}) => `<button type="button" class="ampy-chip${multi ? ' ampy-chip--multi' : ''}${selected ? ' is-selected' : ''}"${multi ? ` aria-pressed="${selected}"` : selected ? ' aria-checked="true" role="radio"' : ' role="radio" aria-checked="false"'}>${multi ? `<span class="ampy-chip__check" aria-hidden="true">${I('check', 15)}</span>` : ''}<span class="ampy-chip__body"><span class="ampy-chip__title">${title}</span>${clarifier ? `<span class="ampy-chip__clarifier">${clarifier}</span>` : ''}</span></button>`;
const qCard = `<section class="ampy-diag__card ampy-diag__card--q" data-dir="fwd" aria-label="Fråga 1 av 7">
  ${crumbQ(1)}
  <h3 class="ampy-diag__q">Hur gammalt är huset eller lägenheten?</h3>
  <div class="ampy-chips" role="radiogroup" aria-label="Byggår">
    ${chip('Före 1970', { selected: true })}
    ${chip('1970 till 1990')}
    ${chip('1990 till 2010')}
    ${chip('Efter 2010')}
    ${chip('Osäker', { clarifier: 'Vi räknar försiktigt' })}
  </div>
  <p class="ampy-diag__info">${I('info', 16)}<span>Byggåret säger ofta en hel del om hur gammal elen är. Ungefärligt räcker.</span></p>
</section>`;
const qMultiCard = `<section class="ampy-diag__card ampy-diag__card--q" aria-label="Fråga 5 av 7">
  ${crumbQ(5)}
  <h3 class="ampy-diag__q">Känner du igen något av det här hemma?</h3>
  <p class="ampy-diag__q-sub">Välj alla som stämmer.</p>
  <div class="ampy-chips" role="group" aria-label="Tecken hemma">
    ${chip('Säkringar som löser ut ofta', { multi: true, selected: true })}
    ${chip('Uttag eller strömbrytare som blir varma', { multi: true })}
    ${chip('Lampor som flimrar', { multi: true })}
    ${chip('Bränd lukt eller missfärgade uttag', { multi: true })}
    ${chip('Inget av detta', { multi: true })}
  </div>
  <div class="ampy-diag__multi-foot">
    <button type="button" class="ampy-btn ampy-btn--ghost ampy-btn--compact">Fortsätt ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
  </div>
  <p class="ampy-diag__info">${I('info', 16)}<span>Värme och missfärgning är klassiska tecken på glappkontakt, en lös anslutning som hettar upp. Inget av detta? Det är ett bra svar.</span></p>
</section>`;
const dual = (level, sak, sakLevel, sakIcon, redo, redoLevel, redoIcon) => `<div class="ampy-diag__dual" data-level="${level}" role="group" aria-label="Ditt besked">
  <span class="ampy-diag__dual-accent" aria-hidden="true"></span>
  <div class="ampy-diag__dual-rows">
    <div class="ampy-diag__dual-row"><span class="ampy-diag__dual-axis">Säkerhet</span><span class="ampy-tag ampy-tag--lg ampy-tag--${sakLevel}">${sakIcon}${sak}</span></div>
    <div class="ampy-diag__dual-row"><span class="ampy-diag__dual-axis">Redo</span><span class="ampy-tag ampy-tag--lg ampy-tag--${redoLevel}">${redoIcon}${redo}</span></div>
  </div>
</div>`;
const finding = (kind, label, i, detail = '') => `<li class="ampy-diag__finding ampy-diag__finding--${kind}" style="--i: ${i}">
  <button type="button" class="ampy-diag__finding-head" aria-expanded="false"><span class="ampy-diag__finding-icon">${I(kind === 'ok' ? 'check' : kind === 'warn' ? 'warning' : 'info', 20)}</span><span class="ampy-diag__finding-label">${label}</span>${I('chevron-down', 18, 'ampy-diag__finding-chevron')}</button>
  <div class="ampy-diag__finding-detail" hidden><p>${detail}</p></div>
</li>`;
const shareRow = `<div class="ampy-diag__share-row">
  <span class="ampy-diag__share-anchor"><span class="ampy-diag__share-toast" role="status">Länk kopierad.</span><button type="button" class="ampy-diag__share" aria-haspopup="menu" aria-label="Dela beskedet">${inline.shareNodes(18)}</button></span>
</div>`;
const verdictGreen = `<section class="ampy-diag__card ampy-diag__card--result" aria-label="Ditt besked">
  ${crumbResult}
  <span class="ampy-eyebrow">Ditt besked</span>
  ${dual('success', 'Låg risk', 'success', I('check', 16), 'Med lastbalansering', 'info', I('info', 16))}
  <p class="ampy-diag__lede">Centralen ser trygg ut. Laddboxen behöver bara kombineras med lastbalansering, en liten enhet som fördelar strömmen så inget överbelastas.</p>
  <div class="ampy-diag__findings-head"><h4>Våra fynd</h4><button type="button" class="ampy-link">Visa alla förklaringar</button></div>
  <ul class="ampy-diag__findings">
    ${finding('ok', 'Centralen är utbytt de senaste åren', 0, 'En modern central med automatsäkringar och jordfelsbrytare klarar det mesta som kommer.')}
    ${finding('ok', 'Du har automatsäkringar', 1, 'Automatsäkringar löser ut snabbare och kan återställas utan att bytas.')}
    ${finding('ok', 'Jordfelsbrytare finns', 2, 'Jordfelsbrytaren bryter strömmen vid fel innan någon skadas.')}
    ${finding('info', 'Med 20 A laddar du elbil bäst med lastbalansering', 3, 'Lastbalanseringen sänker laddeffekten när resten av huset drar mycket.')}
  </ul>
  <div class="ampy-diag__cta-zone">
    <button type="button" class="ampy-btn ampy-btn--secondary ampy-btn--compact">Få kostnadsfri rådgivning ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
    <p class="ampy-diag__readmore">Nyfiken på att läsa mer? <a href="#">Se mer om elcentraler</a></p>
  </div>
  ${shareRow}
</section>`;
const verdictAkut = `<section class="ampy-diag__card ampy-diag__card--result" aria-label="Ditt besked">
  ${crumbResult}
  <div class="ampy-diag__akut" role="alert">${I('warning', 18)}<div><p class="ampy-diag__akut-label">Kontrollera detta först</p><p>Du svarade att du känt bränd lukt eller sett missfärgade uttag. Det bör alltid kontrolleras av en elektriker, oavsett vad resten av kollen visar.</p></div></div>
  <span class="ampy-eyebrow">Ditt besked</span>
  ${dual('warning', 'Förhöjd risk', 'warning', I('warning', 16), 'Inget planerat', 'neutral', I('minus', 16))}
  <p class="ampy-diag__lede">Centralen ser ut att klara dagens behov, men något i säkerheten bör kontrolleras innan du går vidare.</p>
  <div class="ampy-diag__cta-zone">
    <a class="ampy-btn ampy-btn--secondary ampy-btn--compact" href="tel:+4610265797979">${I('phone', 16, 'ampy-btn__icon')} Ring oss</a>
    <button type="button" class="ampy-btn ampy-btn--ghost ampy-btn--compact">Få kostnadsfri rådgivning ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
    <p class="ampy-diag__readmore">Nyfiken på att läsa mer? <a href="#">Se mer om elcentraler</a></p>
  </div>
  ${shareRow}
</section>`;
const verdictOklart = `<section class="ampy-diag__card ampy-diag__card--result" aria-label="Ditt besked">
  ${crumbResult}
  <span class="ampy-eyebrow">Ditt besked</span>
  ${dual('info', 'Oklart', 'info', I('info', 16), 'Inget planerat', 'neutral', I('minus', 16))}
  <p class="ampy-diag__lede">Vi ser inga tydliga risker, men en del svar var osäkra. Då kan vi inte ge ett helt grönt besked. En kort besiktning ger dig säkerheten.</p>
  <div class="ampy-diag__findings-head"><h4>Våra fynd</h4><button type="button" class="ampy-link">Visa alla förklaringar</button></div>
  <ul class="ampy-diag__findings">
    ${finding('ok', 'Inga varningstecken i vardagen', 0, 'Inga säkringar som löser ut, inga varma uttag.')}
    ${finding('info', 'Du är osäker på centralens ålder', 1, 'Åldern avgör mycket. En elektriker ser det på fem minuter.')}
    ${finding('info', 'Du är osäker på om det finns en jordfelsbrytare', 2, 'Jordfelsbrytaren är det viktigaste enskilda skyddet.')}
    ${finding('info', 'Du är osäker på huvudsäkringens storlek', 3, 'Står på elräkningen eller på centralen.')}
  </ul>
  <div class="ampy-diag__factnote">${I('info', 16)}<div><p>Jordfelsbrytare har varit krav i nya bostäder sedan 2000.</p><p>Källa: <a href="#">Elsäkerhetsverket</a></p></div></div>
  <div class="ampy-diag__cta-zone">
    <button type="button" class="ampy-btn ampy-btn--ghost ampy-btn--compact">Få kostnadsfri rådgivning ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
    <p class="ampy-diag__readmore">Nyfiken på att läsa mer? <a href="#">Se mer om elcentraler</a></p>
  </div>
  ${shareRow}
</section>`;
const verdictRedDual = `<section class="ampy-diag__card ampy-diag__card--result" aria-label="Ditt besked">
  ${crumbResult}
  <span class="ampy-eyebrow">Ditt besked</span>
  ${dual('error', 'Hög risk', 'error', I('warning', 16), 'Inte redo', 'error', I('close', 16))}
  <p class="ampy-diag__lede">Flera svar pekar på en central som inte klarar dagens belastning. Boka en besiktning innan något mer kopplas in.</p>
  <div class="ampy-diag__cta-zone">
    <a class="ampy-btn ampy-btn--secondary ampy-btn--compact" href="tel:+4610265797979">${I('phone', 16, 'ampy-btn__icon')} Ring oss</a>
    <button type="button" class="ampy-btn ampy-btn--ghost ampy-btn--compact">Få kostnadsfri rådgivning ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
  </div>
</section>`;
const boardCard = (verdict, { title, icon, src = '', summary, rows, caveat = '', tabs }) => `<section class="ampy-diag__card ampy-diag__card--result" data-verdict="${verdict}" aria-label="Besked">
  <div class="ampy-diag__crumb ampy-diag__crumb--result">
    <button type="button" class="ampy-diag__back">${I('arrow-right', 16)}Tillbaka</button>
    <span class="ampy-diag__crumb-sep" aria-hidden="true">|</span>
    <span class="ampy-diag__crumb-job">${tabs.job}</span>
  </div>
  <div class="ampy-diag__judgment">
    <h3 class="ampy-diag__board">${icon}${title}</h3>
    ${src ? `<a class="ampy-diag__src" href="#"><span>${src}</span>${inline.ext(13)}</a>` : ''}
  </div>
  <div class="ampy-diag__tabs" role="tablist">
    <button type="button" class="ampy-diag__tab" role="tab" aria-selected="true">Förklaring</button>
    <button type="button" class="ampy-diag__tab" role="tab" aria-selected="false">${tabs.second}</button>
  </div>
  <div class="ampy-diag__tab-body" role="tabpanel">
    <p class="ampy-diag__summary">${summary}</p>
    <ul class="ampy-diag__rows">
      ${rows.map(([kind, text]) => `<li class="ampy-diag__row ampy-diag__row--${kind}">${I(kind === 'do' ? 'check' : 'close', 18)}<p>${text}</p></li>`).join('\n      ')}
    </ul>
    ${caveat ? `<div class="ampy-diag__caveat">${I('warning', 16)}<p>${caveat}</p></div>` : ''}
  </div>
  <div class="ampy-diag__cta-zone">
    <button type="button" class="ampy-btn ampy-btn--secondary ampy-btn--compact">Boka kostnadsfri rådgivning ${I('arrow-right', 16, 'ampy-btn__icon')}</button>
    <a class="ampy-btn ampy-btn--ghost ampy-btn--compact" href="#">Läs mer om ${tabs.about}</a>
  </div>
  <p class="ampy-source">Källa: Elsäkerhetsverkets föreskrifter (ELSÄK-FS 2017:2) och Elsäkerhetslagen (2016:732). Beskedet bygger på dina svar och ersätter inte en besiktning.</p>
</section>`;
const boardGreen = boardCard('green', { title: 'Det här får du göra själv', icon: I('check', 20), summary: 'Du får byta uttaget, så länge du inte flyttar det eller ändrar typen.', rows: [['do', 'Byta mot ett likadant jordat uttag, högst 16 A, i egen dosa.'], ['dont', 'Flytta uttaget, byta ojordat till jordat eller sätta ett nytt.']], caveat: 'Tillåtet om du vet hur. Är du det minsta osäker, ta in ett företag.', tabs: { job: 'Byta vägguttag', second: 'Tips', about: 'vägguttag' } });
const boardRed = boardCard('red', { title: 'Det här kräver elektriker', icon: inline.ban(20), src: 'Elsäkerhetslagen (2016:732) 27 §', summary: 'Golvvärme är en del av den fasta elanläggningen.', rows: [['do', 'Välja system och planera ytan inför installationen.'], ['dont', 'Värmekabel och anslutning är fast installation och kräver elektriker.']], tabs: { job: 'Installera golvvärme', second: 'Konsekvenser', about: 'golvvärme' } });
const boardYellow = boardCard('yellow', { title: 'Beror på hur det är kopplat', icon: I('warning', 20), src: 'ELSÄK-FS 2017:4', summary: 'Sladd och stickpropp får du byta själv, fast anslutning kräver behörighet.', rows: [['do', 'Byta sladd och stickpropp på en apparat som pluggas in.'], ['dont', 'Koppla in apparaten fast i en kopplingsdosa.']], tabs: { job: 'Ansluta spis', second: 'Konsekvenser', about: 'spisanslutning' } });

const diagEntry = `<div class="ampy-diag ampy-diag--flush" id="diag-entry">
  <div class="ampy-diag__inner">
    ${rail()}
    <div class="ampy-diag__stage">
      ${startCard}
    </div>
  </div>
</div>`;
const diagQ = `<div class="ampy-diag ampy-diag--flush" id="diag-q">
  <div class="ampy-diag__inner">
    ${rail()}
    <div class="ampy-diag__stage">
      ${qCard}
    </div>
  </div>
</div>`;
const solo = (id, card) => `<div class="ampy-diag ampy-diag--flush ampy-diag--solo" id="${id}"><div class="ampy-diag__inner"><div class="ampy-diag__stage">${card}</div></div></div>`;
const diagShare = `<div class="ampy-diag ampy-diag--flush ampy-diag--solo" id="diag-share">
  <div class="ampy-diag__inner"><div class="ampy-diag__share-anchor">
    <ul class="ampy-diag__share-menu ampy-diag__share-menu--static" role="menu" aria-label="Dela beskedet">
      <li><button type="button" class="ampy-diag__share-item" role="menuitem">${I('copy', 18)}Kopiera länk</button></li>
      <li><a class="ampy-diag__share-item" role="menuitem" href="#">${I('mail', 18)}Dela via mejl</a></li>
      <li><a class="ampy-diag__share-item is-hover" role="menuitem" href="#">${I('print', 18)}Skriv ut</a></li>
    </ul>
  </div></div>
</div>`;
const diagSticky = `<div class="ampy-diag ampy-diag--flush" id="diag-sticky">
  <div class="ampy-diag__inner"><div class="ampy-diag__sticky ampy-diag__sticky--static is-visible" role="region" aria-label="Snabbval">
    <div class="ampy-diag__sticky-inner"><button type="button" class="ampy-btn ampy-btn--secondary ampy-btn--compact">Få kostnadsfri rådgivning ${I('arrow-right', 16, 'ampy-btn__icon')}</button></div>
  </div></div>
</div>`;
const diagNojs = `<div class="ampy-diag ampy-diag--flush ampy-diag--solo" id="diag-nojs">
  <div class="ampy-diag__inner"><p class="ampy-diag__nojs"><strong>Kollen behöver JavaScript.</strong> Ring oss på 010-265 79 79 eller skriv till info@ampy.se så hjälper vi dig direkt.</p></div>
</div>`;
const diagBlock = `<div class="ampy-diag ampy-diag--block" id="diag-block">
  <div class="ampy-diag__inner">
    <div class="ampy-diag__blockhead">
      <h2 class="ampy-diag__blockhead-title">Behöver din elcentral bytas?</h2>
      <p class="ampy-diag__blockhead-lead">Besvara sju frågor om din elcentral och få en rekommendation om vad som eventuellt bör åtgärdas.</p>
      ${railBullets}
    </div>
    <div class="ampy-diag__stage">
      ${startCard}
    </div>
    <p class="ampy-diag__blockground">Byggt på Elsäkerhetslagen och Elsäkerhetsverket. Ett ärligt besked, byggt på dina egna svar.</p>
  </div>
</div>`;

const diagPage = shell({
  title: 'Diagnostik-kitet', eyebrow: 'Komponenter', active: 'diagnostik.html',
  lead: 'Rail plus stage: varumärkeskolumnen till vänster, det vita frågekortet till höger. Kunden svarar med tap-chips och får ett besked i ord, aldrig bara i färg. Kanon är Elcentral-kollen (dualstatus-matrisen) och Elkollen (trafikljus-boarden), båda auktoritet 1. Klassen är <code>.ampy-diag</code>.',
  body: `
<ul class="ds-toc">
  <li><a href="#rail">Rail och stage</a></li><li><a href="#fraga">Frågekortet</a></li><li><a href="#dual">Besked: dualstatus</a></li><li><a href="#trafik">Besked: trafikljus</a></li><li><a href="#fynd">Fynd, dela, sticky, no-JS</a></li><li><a href="#block">Blockläge</a></li><li><a href="#paritet">Paritet</a></li><li><a href="#avvikelser">Avvikelser och drift</a></li>
</ul>

<div class="ds-dep"><strong>Komponerat med S2:</strong> svarsalternativen är <code>.ampy-chips</code> / <code>.ampy-chip</code> (falt.css, radio-chips med kanon elcentral-kollen), pills är <code>.ampy-tag</code> (text.css), knapparna <code>.ampy-btn</code> (knappar.css), trust-listan <code>.ampy-list--check</code>, källraden <code>.ampy-source</code>. Kitet självt (diagnostik.css) äger skalet, railen, kortet, crumb och förlopp, frågetiteln, info-rutan, dualstatus-zonen, fynd, akut, factnote, trafikljus-boarden med tabbar och rader, dela, sticky-CTA, blockläget och no-JS-noten.</div>

${h2('rail', 'Rail och stage: startvyn')}
${p('Skalet är en 1280-container (<code>.ampy-diag</code>) med gridet i <code>.ampy-diag__inner</code>: två kolumner 44fr / 56fr och gap 64 från 940 px innehållsbredd (= 992 px viewport i skalet). Railen (H1, lead, tre trust-bullets, två gradient-CTA:er i samma rad, statistikrad) centreras i en 560-box så att den aldrig hoppar mellan steg. Kortet har samma minsta höjd på start och frågor. På mobil packas railen upp: H1, lead, KORTET, "Hellre prata med en elektriker direkt?", telefon först, kontakt, statistik.')}
${source('Kanon: elcentral-kollen (assets/elcentralkollen.css:160-292, "1:1 med Elkollen hero__copy"). Finns även i: elkollen (preview/hero.html: 1180-wrap, H1 40/600 med teal sista rad, 96 px toppspacer). Blockbiblioteket: <a class="ds-a" href="../blockbibliotek.html#elcentral-kollen">Elcentral-kollen</a>, <a class="ds-a" href="../blockbibliotek.html#elkollen">Elkollen</a>.')}
${example({ id: 'ex-diag-entry', label: 'Start, 1440 = rail + stage, 390 = staplat', html: diagEntry, code: false })}
<figure class="ds-shot"><img src="../bilder/elcentral-kollen-desktop.jpg" alt="Elcentral-kollen, källans rendering 1440" loading="lazy"><img src="../bilder/elcentral-kollen-mobile.jpg" alt="Elcentral-kollen, källans rendering 390" loading="lazy"><figcaption>Så ser källan ut (Elcentral-kollen v2.26 i preview-chrome). Skillnader mot kitet: Outfit i stället för Plus Jakarta Sans, kortradie 20 i stället för 14, ring-knappen med vit chip i stället för lur-ikon (kanon = CTA-biblioteket), H1 48 i stället för 44.</figcaption></figure>
${h3('rail-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Shell', '1280, padding 56 / 39,6, grid 44fr / 56fr, gap 64', 'padding 27,3 / 21,5, en kolumn, gap 14', '<code>--ampy-container</code>, <code>--ampy-space-xl</code>, <code>--ampy-gutter</code>; gap 64 kit-egen (källan, tokens xl 56 / 2xl 79)'],
  ['Rail', 'min-höjd 560, innehållet centrerat', 'display: contents, ordnad runt kortet', 'kit-egen <code>--_minh</code> (elcentral --ec-q-minh)'],
  ['H1', '48 / 700 / lh 1.07', '31,3', '<code>--ampy-text-h1</code> (källan PJS 700 44 / 32)'],
  ['Lead', '22 / 400 / 1.58, max 46ch', '17', '<code>--ampy-text-lead</code>, <code>--ampy-measure-lead</code> (källan 20 / 18 lh 1.6: B18)'],
  ['Trust-bullets', '18 / 500 dämpad, ikon 20 teal, rad-gap 19,8', 'dolda', '<code>.ampy-list--check</code> (källan 17/500, gap 16)'],
  ['CTA-rad', 'två .ampy-btn 58 höga, radie 16, flex 1, gap 19,8', 'staplade, 60 höga (padding 22), telefon först', '<code>.ampy-btn--block</code> + <code>--ring</code> (källan 58 / 60, gap 20 / 12)'],
  ['Statistikrad', '16 / 400 dämpad, max 46ch', '14,1 centrerad', '<code>--ampy-text-small</code> (källan 14/450)'],
  ['Startkortet', 'radie 20, padding 28, 1 px kant, shadow-card, min-höjd 560', 'radie 16,3, padding 16,9, min-höjd 600', '<code>.ampy-diag__card</code> (källan radie 14, padding 32 / 20, 0 8px 28px .07)'],
  ['Illustration / rubrik / CTA', '120, h2 36/700, knapp 320 × 48', '110, 26,8, 316 × 48', 'kit-egen <code>--_illu</code>, <code>--ampy-text-h2</code>, <code>.ampy-btn--secondary --compact</code>'],
])}
<div class="ds-code"><pre><code>${esc(`<div class="ampy-diag">
 <div class="ampy-diag__inner">
  <div class="ampy-diag__rail">
    <h2 class="ampy-diag__rail-title">Är din elcentral säker?</h2>
    <p class="ampy-diag__rail-lead">Ta reda på om din central är säker och anpassad för framtida installationer.</p>
    <ul class="ampy-list ampy-list--check">
      <li><svg width="20" height="20" aria-hidden="true"><use href="…/ikoner.svg#ik-check"/></svg><span>Byggt på Elsäkerhetslagen och Elsäkerhetsverket</span></li>
      …
    </ul>
    <p class="ampy-diag__rail-ask">Hellre prata med en elektriker direkt?</p>
    <div class="ampy-diag__rail-actions">
      <a class="ampy-btn ampy-btn--block" href="/kontakt/">Kontakta oss <svg class="ampy-btn__icon" …>…</svg></a>
      <a class="ampy-btn ampy-btn--ring ampy-btn--block ampy-link--tel" href="tel:+4610265797979"><span class="ampy-btn__chip">…</span><span>010-265 79 79</span></a>
    </div>
    <p class="ampy-diag__rail-stat">Elsäkerhetsverket registrerade 298 händelser 2018 till 2022 där elcentralen var orsaken.</p>
  </div>
  <div class="ampy-diag__stage">
    ${startCard.replace(/\n/g, '\n    ')}
  </div>
 </div>
</div>`)}</code></pre></div>
${dodont(
  ['Railens innehåll står stilla: fast 560-box, kortet håller samma höjd på alla frågesteg.', 'Kontaktblocket syns på varje vy (anti-lock-in): kunden kan alltid ringa i stället.', 'Två lika breda knappar med etikett vänster och ikon höger, telefonen först på mobil.'],
  ['Inga faktapåståenden i statistikraden utan källa (candour-grinden; siffran 298 bär länk till Elsäkerhetsverket i källan).', 'Ingen tredje CTA-stil i railen: gradient för sidans konvertering, solid teal-deep inne i kortet (B6).', 'Ingen rail utan H1 på mobil: rubriken förblir sidans enda H1 i tillgänglighetsträdet.'],
)}

${h2('fraga', 'Frågekortet: en fråga i taget')}
${p('Crumb med sju förloppsprickar (18 × 4, aktiv 28) och "Tillbaka", frågetitel i kortrubrikens storlek, svarsalternativ som fullbredds-chips (singelval avancerar direkt, flerval får en check-ruta och "Fortsätt"), och en info-ruta med blå i-ikon. Stegbyten glider ±10 px.')}
${source('Kanon: elcentral-kollen (elcentralkollen.css:344-399, 856-862). Finns även i: elkollen (rumstiles 112 × 2 kolumner, jobblista 52 px, options 72/64 med pil), energycalc (heat-picker-kort 88 px med ikonruta + tänd check, "Vet inte" dashed).')}
${example({ id: 'ex-diag-q', label: 'Fråga 1 av 7, singelval (första valt)', html: diagQ, code: false })}
${example({ id: 'ex-diag-multi', label: 'Fråga 5 av 7, flerval + Fortsätt (bara kortet)', html: solo('diag-multi', qMultiCard), code: false })}
${h3('fraga-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Kortet', 'padding 28, min-höjd 560, radie 20', 'padding 16,9, min-höjd 600, radie 16,3', '<code>.ampy-diag__card--q</code> (källan 32 / 20, radie 14)'],
  ['Förloppsprickar', '18 × 4 radie pill, gap 6; aktiv 28 teal-deep; klar = 70 % teal-deep', 'samma', '<code>--ampy-line</code>, <code>--ampy-action-strong</code>, color-mix 70 %'],
  ['Tillbaka', '13 dämpad, 44 hög, ikon 16', 'samma', '<code>--ampy-fine</code>'],
  ['Frågetitel', '32 / 600 / 1.25 / −.015em, max 26ch', '20', 'kit-egen <code>--_q-fs</code> (källan clamp 26 till 32 / 20 till 24; tokens saknar rollen)'],
  ['Chip', '64 hög, padding 14 / 19,8, radie 12, 1 px kant, titel 18/500', '56, padding 10,5 / 13,3, radie 10,1, titel 16,1', 'S2 <code>.ampy-chip</code> (källan 64 / 56, padding 16 20 / 14 16, radie 10, 18 / 15)'],
  ['Chip vald / hover', 'kant teal + tint teal .08 / kant teal + subtil bg + lyft 1 px', 'samma', 'S2: <code>--ampy-action</code>, <code>--ampy-bg-tint-action</code> (källan rgb(240,250,248))'],
  ['Check-ruta (flerval)', '22 × 22 radie 8, vald = teal + vit bock 15', 'radie 6,1', 'S2 <code>.ampy-chip__check</code> (källan radie 6)'],
  ['Fortsätt', '48 hög outline', '48', '<code>.ampy-btn--ghost --compact</code> (källan cta-primary--outline 48, radie 10)'],
  ['Info-ruta', 'subtil bg, 1 px kant, radie 12, padding 14, ikon 16 info-ink, text 16 dämpad', 'radie 10,1, text 14,1', '<code>--ampy-bg-subtle</code>, <code>--ampy-info-ink</code> (källan 15 / 13)'],
])}
<div class="ds-code"><pre><code>${esc(`<section class="ampy-diag__card ampy-diag__card--q" data-dir="fwd" aria-label="Fråga 1 av 7">
  <div class="ampy-diag__crumb">
    <span class="ampy-diag__crumb-left"><ul class="ampy-diag__steps" aria-hidden="true"><li class="ampy-diag__step is-current"></li><li class="ampy-diag__step"></li>…</ul><span class="sr-only">Fråga 1 av 7</span></span>
    <button type="button" class="ampy-diag__back"><svg width="16" height="16" aria-hidden="true"><use href="…#ik-arrow-right"/></svg>Tillbaka</button>
  </div>
  <h3 class="ampy-diag__q">Hur gammalt är huset eller lägenheten?</h3>
  <div class="ampy-chips" role="radiogroup" aria-label="Byggår">
    <button type="button" class="ampy-chip is-selected" role="radio" aria-checked="true"><span class="ampy-chip__body"><span class="ampy-chip__title">Före 1970</span></span></button>
    <button type="button" class="ampy-chip" role="radio" aria-checked="false"><span class="ampy-chip__body"><span class="ampy-chip__title">1970 till 1990</span></span></button>
    …
  </div>
  <p class="ampy-diag__info"><svg width="16" height="16" aria-hidden="true"><use href="…#ik-info"/></svg><span>Byggåret säger ofta en hel del om hur gammal elen är. Ungefärligt räcker.</span></p>
</section>

<!-- flerval -->
<button type="button" class="ampy-chip ampy-chip--multi is-selected" aria-pressed="true"><span class="ampy-chip__check" aria-hidden="true"><svg …>…</svg></span><span class="ampy-chip__body"><span class="ampy-chip__title">Säkringar som löser ut ofta</span></span></button>`)}</code></pre></div>
${dodont(
  ['Hela raden är träffytan, minst 56 px hög; singelval avancerar direkt utan "Nästa".', 'Förloppet som stapel, siffran bara för skärmläsare ("Fråga 1 av 7").', 'Info-rutan förklarar varför vi frågar, i dämpad text, och gör "Osäker" till ett giltigt svar.'],
  ['Ingen färg på svarsalternativen förrän beskedet finns (Elkollens neutralitet: tiles och lista utan verdict-färg).', 'Inga alternativ som kräver kunskap kunden inte har utan ett "Vet inte".', 'Ingen "Börja om" bredvid "Tillbaka" i frågestegen: bara på beskedet, och nedtonad (12 px).'],
)}

${h2('dual', 'Besked: dualstatus-matrisen (Säkerhet / Redo)')}
${p('Signaturen: en tonad zon utan kant, 4 px accentstapel i sämsta nivåns färg, två rader "Säkerhet" och "Redo" med var sin pill. Varje pill bär ikon + ord, aldrig bara färg. Under: lede, fynd som fällbara rader, eventuell akut-ruta (röd, alltid först i DOM) och factnote (amber), CTA-zon, läs mer, dela.')}
${source('Kanon: elcentral-kollen (elcentralkollen.css:404-441 dualstatus, 428-440 pill, 442 lede, 447-502 fynd/factnote/akut). Pillens fem nivåer är <code>.ampy-tag</code> (text.css, samma källa).')}
${example({ id: 'ex-diag-gron', label: 'GRÖN: Låg risk / Med lastbalansering', html: solo('diag-gron', verdictGreen), code: false })}
${example({ id: 'ex-diag-akut', label: 'GUL + AKUT: Förhöjd risk / Inget planerat, akut-ruta först, Ring oss', html: solo('diag-akut', verdictAkut), code: false })}
${example({ id: 'ex-diag-oklart', label: 'OKLART: info / neutral, factnote med källa', html: solo('diag-oklart', verdictOklart), code: false })}
${example({ id: 'ex-diag-rod-dual', label: 'RÖD i dualstatus: Hög risk / Inte redo (nivån finns i källans CSS, ingen QA-cell renderade den)', html: solo('diag-rod-dual', verdictRedDual), code: false })}
${h3('dual-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Eyebrow "Ditt besked"', '12 / 600 / .14em dämpad', '12', '<code>.ampy-eyebrow</code> (källan PJS 600 12 .06em)'],
  ['Zon', 'padding 18 18 18 16, radie 12, gap 14, fit-content min 420', 'padding 14 14 14 12, full bredd', 'kit-egna literaler (källan), <code>--ampy-radius-field</code>, <code>--_ds-min</code>'],
  ['Tint', 'success rgba(57,194,129,.12) / warn #fff4e0 / error #fdeceb / info rgb(242,247,251) / neutral rgb(248,249,252)', 'samma', '<code>--ampy-success-tint</code>, <code>-warn-tint</code>, <code>-error-tint</code>; info och neutral kit-egna (källan)'],
  ['Accentstapel', '4 px pill, success-ink / warn-ink / error-ink / info-ink', 'samma', 'identiska primitiver (rgb(15,110,86) m.fl.)'],
  ['Axel-etikett', 'min 90 bred, 16 / 500 dämpad', 'min 70, 14,1', '<code>--ampy-text-small</code> (källan 15 / 14)'],
  ['Pill', '18 / 600, padding 9,9 / 14, ikon 16, radie pill', '14 / 600, padding 8,3 / 10,5, ikon 16, nowrap', '<code>.ampy-tag--lg</code> (källan 18/600 8 14; mobil 14 6 12, ikon 14)'],
  ['Lede', '18 / 400 / 1.55 max 54ch', '16,1', '<code>--ampy-text-body</code> (källan 18 / 16, exakt)'],
  ['Akut', '1 px error-ink .38, tint #fdeceb, radie 8, padding 14 / 19,8, etikett 13/700, text 16', 'radie 6,1, text 14,1', '<code>--ampy-error-ink</code>, <code>--ampy-error-tint</code> (källan rgb(252,237,238), radie 6, 14 16, text 15 / 13)'],
  ['Factnote', 'warn-ink .05 bg + .22 kant, radie 8, ikon 16, text 13', 'samma', '<code>--ampy-warn-ink</code> (källan rgba(135,101,7,.05/.22))'],
])}
<div class="ds-code"><pre><code>${esc(`<span class="ampy-eyebrow">Ditt besked</span>
${dual('success', 'Låg risk', 'success', '<svg …>…</svg>', 'Med lastbalansering', 'info', '<svg …>…</svg>')}
<p class="ampy-diag__lede">Centralen ser trygg ut. Laddboxen behöver bara kombineras med lastbalansering.</p>

<!-- akut: alltid först i kortet, före eyebrown -->
<div class="ampy-diag__akut" role="alert"><svg …>…</svg><div><p class="ampy-diag__akut-label">Kontrollera detta först</p><p>Du svarade att du känt bränd lukt …</p></div></div>`)}</code></pre></div>
${dodont(
  ['Sämsta nivån styr zonens tint och accent (worst-of), pillarna behåller sin egen nivå.', 'Ikon + ord i varje pill: beskedet läses utan färgseende.', 'Akut-rutan ligger först i DOM och i vyn, tyngst på skärmen, med "Ring oss" som primär CTA.'],
  ['Ingen ram eller skugga på zonen (den är en tonad yta, inte ett kort i kortet).', 'Inga tre CTA-stilar i samma kort: solid teal-deep primär, outline sekundär, länk tertiär.', 'Inget "Låg risk" i teal: grönt besked är success-ink, teal är handling.'],
)}

${h2('trafik', 'Besked: trafikljus-boarden (Elkollen)')}
${p('Kortet bär <code>data-verdict="green|yellow|red"</code>: 6 px sidostapel längs hela kortet, en topp-wash på 200 px (120 på mobil) som tonar till vitt, en board med ikon + ord i 22/700 på tonad yta med 1 px tonad hårlinje, källrad (bara GUL/RÖD), tabbar med tunn understrykning i beskedets färg, sammanfattning, ✓/✗-rader och (GRÖN) en caveat med amber kant. CTA-zonen är pinnad till kortets golv.')}
${source('Kanon: elkollen (assets/behorighetskollen.css:1223-1290 board + wash, 417-433 källrad, 438-473 tabbar, 488-560 rader + caveat). GUL finns i CSS:en men ingen data använder den. Inbäddat 600-läge = pill-badge på 3 px stapel (behorighetskollen.css:340-411), inte klonat.')}
${example({ id: 'ex-diag-board-gron', label: 'GRÖN: Det här får du göra själv, med caveat', html: solo('diag-board-gron', boardGreen), code: false })}
${example({ id: 'ex-diag-board-rod', label: 'RÖD: Det här kräver elektriker, med källrad', html: solo('diag-board-rod', boardRed), code: false })}
${example({ id: 'ex-diag-board-gul', label: 'GUL: villkorat (CSS-only i källan, ingen data)', html: solo('diag-board-gul', boardYellow), code: false })}
${h3('trafik-anatomi', 'Anatomi')}
${table(['Del', '1440', '390', 'Källa / token'], [
  ['Sidostapel + wash', '6 px accent, wash 200 hög i accent .08/.09/.07', 'wash 120', 'color-mix på <code>--ampy-success/-warn/-error</code> (källan rgba(54,178,92,.08) m.fl.)'],
  ['Board', 'inline-flex, padding 14 / 19,8, radie 12, 1 px accent .45/.40, bg accent .10/.08/.06, 22 / 700', 'padding 10,5 / 13,3, 20 / 700', '<code>--ampy-text-h3</code> (källan 22 / 18, padding 14 18 / 12 16, radie 10)'],
  ['Board-ikon', '20, i accentfärgen', '20', 'success-ink / warn-ink / error-ink'],
  ['Källrad', '12 svag + extern-ikon 13, 24 px träffyta', 'samma', '<code>--ampy-text-eyebrow</code>, <code>--ampy-ink-faint</code>'],
  ['Tabbar', 'gap 28, 16 / 500 dämpad, vald ink + 2 px accent, 44 hög', 'gap 16,9, 14,1', '<code>--ampy-text-small</code> (källan 15/500, gap 24 / 20)'],
  ['Sammanfattning', '18 / 500 ink', '16,1', '<code>--ampy-text-body</code> (källan 17 / 16)'],
  ['Rader ✓/✗', 'ikon 18 (success-ink / svag), text 18 / 400 dämpad, gap 9,9', 'text 16,1', '(källan 16 / 15)'],
  ['Caveat', '3 px warn-ink vänster, ikon 16, text 16 dämpad', '14,1', '(källan rgb(186,117,23), 14)'],
  ['CTA-zon', 'solid 48 + outline 48, gap 14, pinnad till golvet', '48 / 48 (källan 52)', '<code>.ampy-btn--secondary/--ghost --compact</code>'],
])}
<div class="ds-code"><pre><code>${esc(`<section class="ampy-diag__card ampy-diag__card--result" data-verdict="red" aria-label="Besked">
  <div class="ampy-diag__crumb ampy-diag__crumb--result">
    <button type="button" class="ampy-diag__back">…Tillbaka</button><span class="ampy-diag__crumb-sep" aria-hidden="true">|</span><span class="ampy-diag__crumb-job">Installera golvvärme</span>
  </div>
  <div class="ampy-diag__judgment">
    <h3 class="ampy-diag__board"><svg …>…</svg>Det här kräver elektriker</h3>
    <a class="ampy-diag__src" href="…"><span>Elsäkerhetslagen (2016:732) 27 §</span><svg …>…</svg></a>
  </div>
  <div class="ampy-diag__tabs" role="tablist">
    <button type="button" class="ampy-diag__tab" role="tab" aria-selected="true">Förklaring</button>
    <button type="button" class="ampy-diag__tab" role="tab" aria-selected="false">Konsekvenser</button>
  </div>
  <div class="ampy-diag__tab-body" role="tabpanel">
    <p class="ampy-diag__summary">Golvvärme är en del av den fasta elanläggningen.</p>
    <ul class="ampy-diag__rows">
      <li class="ampy-diag__row ampy-diag__row--do"><svg …>…</svg><p>Välja system och planera ytan inför installationen.</p></li>
      <li class="ampy-diag__row ampy-diag__row--dont"><svg …>…</svg><p>Värmekabel och anslutning är fast installation och kräver elektriker.</p></li>
    </ul>
  </div>
  <div class="ampy-diag__cta-zone">
    <button type="button" class="ampy-btn ampy-btn--secondary ampy-btn--compact">Boka kostnadsfri rådgivning …</button>
    <a class="ampy-btn ampy-btn--ghost ampy-btn--compact" href="…">Läs mer om golvvärme</a>
  </div>
  <p class="ampy-source">Källa: …</p>
</section>`)}</code></pre></div>
${dodont(
  ['Grönt hålls skilt från teal: accenten är success-ink, teal är handling (Elkollens dokumenterade regel).', 'Vikt 500 i båda tabblägena så inget skuttar i bredd när man byter.', 'Källraden under boarden på GUL och RÖD: lagrummet syns innan förklaringen.'],
  ['Kortets insida mörknar aldrig: wash på högst 9 % alfa som tonar till vitt.', 'Ingen pill-badge (rgb(116,200,138)) i hero-läget: boarden med tonad hårlinje är kanon.', 'Inga "Konsekvenser" på GRÖN, ingen "Tips" på RÖD: fliken följer beskedet.'],
)}

${h2('fynd', 'Fynd-lista, dela, sticky-CTA och no-JS')}
${p('Fyndraden: ikon 20 i nivåns färg, etikett 18/500, chevron 18 svag; hela raden är en knapp (aria-expanded) och förklaringen fälls ut indragen till etiketten, inget lämnar DOM. Dela: 44 × 44 ikonknapp med ljus meny (170 bred, radie 12, tre 44-rader) och en toast som aldrig flyttar knappen. Sticky-CTA: fixed vit hylla på mobil som speglar kortets primära CTA och gömmer sig när kontaktblocket syns (här renderad statiskt). No-JS-noten visas tills verktyget bootat.')}
${source('Kanon: elcentral-kollen (elcentralkollen.css:464-488 fynd, 618-633 dela, 593-604 sticky). No-JS: elkollen (.ampy-bk__noscript) + energycalc (.noscript-note).')}
${example({ id: 'ex-diag-share', label: 'Dela-meny (ljus)', full: false, html: diagShare })}
${example({ id: 'ex-diag-sticky', label: 'Sticky-CTA (mobil, här statisk i flödet)', full: false, html: diagSticky, codeNote: 'I produktion: <code>position: fixed</code>, klassen <code>.is-visible</code> sätts av JS när beskedet syns och tas bort när kontaktblocket under kortet kommer in i bild. Desktop: aldrig.' })}
${example({ id: 'ex-diag-nojs', label: 'No-JS-not', full: false, html: diagNojs })}
<div class="ds-code"><pre><code>${esc(finding('ok', 'Centralen är utbytt de senaste åren', 0, 'En modern central med automatsäkringar och jordfelsbrytare klarar det mesta som kommer.'))}</code></pre></div>

${h2('block', 'Blockläge: kollen som station på en landningssida')}
${p('Samma kort, men railen ersätts av en centrerad rubrik och lead i ett tonat band (sky-mist som tonar till vitt, padding 80/48), kortet i en kolumn max 636 bred, en proveniensrad under. Från 1280 px containerbredd blir det två kolumner igen: copyn tar resten, kortet pinnas till en 560-kvadrat, trust-bullets kommer tillbaka, proveniensraden försvinner. Den här sidans spalt är 1022 px, så exemplet visar det staplade läget.')}
${source('Kanon: elcentral-kollen (elcentralkollen.css:687-840, preview/block.html). Finns även i: elkollen (inbäddat 600-läge under en sidrubrik "Koppla elen").')}
${example({ id: 'ex-diag-block', label: 'Blockläge (staplat under 1280)', html: diagBlock, code: false, pad: false })}
<figure class="ds-shot"><img src="../bilder/elcentral-kollen-block-desktop.jpg" alt="Elcentral-kollen i blockläge, källans rendering 1440" loading="lazy"><img src="../bilder/elcentral-kollen-block-mobile.jpg" alt="blockläge 390" loading="lazy"><figcaption>Källans blockläge vid 1440 (två kolumner från 1280) och 390.</figcaption></figure>
<div class="ds-code"><pre><code>${esc(`<div class="ampy-diag ampy-diag--block">
  <div class="ampy-diag__inner">
    <div class="ampy-diag__blockhead">
      <h2 class="ampy-diag__blockhead-title">Behöver din elcentral bytas?</h2>
      <p class="ampy-diag__blockhead-lead">Besvara sju frågor om din elcentral och få en rekommendation om vad som eventuellt bör åtgärdas.</p>
      <ul class="ampy-list ampy-list--check">…</ul>   <!-- syns bara >= 1280 -->
    </div>
    <div class="ampy-diag__stage">
      <section class="ampy-diag__card ampy-diag__card--start">…</section>
    </div>
    <p class="ampy-diag__blockground">Byggt på Elsäkerhetslagen och Elsäkerhetsverket. Ett ärligt besked, byggt på dina egna svar.</p>
  </div>
</div>`)}</code></pre></div>

${h2('paritet', 'Paritet mot källan')}
${p('Kitets exempel mätta i Chromium vid 1440 och 390 i en 1280-ram (samma som källans shell), mot källans uppmätta värden i inventeringen.')}
${parityTable('diag')}

${h2('avvikelser', 'Avvikelser och drift')}
${table(['Var', 'Källan', 'Kitet', 'Skäl'], [
  ['Typsnitt', 'Plus Jakarta Sans (H1, frågetitel, pills, etiketter) + Outfit', 'Outfit', 'B7; Elkollen v7 är redan Outfit-only'],
  ['Kortradie', '14', '20 (16,3 på mobil)', 'kort-kanon <code>--ampy-radius-card</code>; 14 matchar ingen token'],
  ['Kortpadding', '32 / 20', '28 / 16,9', '<code>--ampy-space-card</code> (m)'],
  ['Rail-H1 / lead', '44 / 32 och 20 / 18', '48 / 31,3 och 22 / 17', 'rollskalan (h1, lead); B18 flaggar mobilvärdet 17'],
  ['Telefonknappen', 'blå gradient 141°, lur-ikon höger, ingen chip', '<code>.ampy-btn--ring</code>: 120°, vit chip med lur + puls', 'CTA-biblioteket är kanon för knappar; elcentral/elkollen-varianten är drift'],
  ['Gradient-CTA:ernas text', 'Outfit 400, ink #0d0d0d, skugga rgba(241,241,241,.25)', 'Outfit 500, indigo #282a53, tre-lagers skugga', 'CTA-website-receptet (auk 1 för knappar)'],
  ['Solid CTA', '48 hög, radie 10, 15/600', '48 hög (--compact), radie 16, 16/600', 'B4'],
  ['Chip-kant', '#e3e5ed (1,26:1)', '<code>--ampy-line-strong</code> (3,39:1)', 'WCAG 1.4.11 kontrollkant'],
  ['Frågetitel', '32 / 20', '32 / 20 (kit-egen clamp)', 'tokens saknar kortrubrik-rollen; noterad brist'],
  ['Trafikljus-grönt', 'accent rgb(27,132,71) "lövigare"', '<code>--ampy-success-ink</code> rgb(15,110,86), board/wash på <code>--ampy-success</code>', 'en grön familj i tokens; källans lövgrön saknar token'],
  ['Caveat-kant', 'rgb(186,117,23)', '<code>--ampy-warn-ink</code> #876507', 'ingen token för källans amber'],
  ['Fokusring', 'elcentral 3 px .9 / elkollen .25 (1,3:1)', 'en ring <code>--ampy-focus-ring</code> (.9)', 'B14; elkollens .25 var underkänd'],
  ['Brytpunkt', '@media 1024 (viewport)', '@container 940 (kitets innehållsbredd = 992 viewport i 1280-skalet)', 'kanon 992; verktyget svarar på sitt utrymme, inte på fönstret'],
])}
${h3('drift', 'Drift i de andra instanserna')}
${table(['Instans', 'Avviker så här'], [
  ['elkollen (auk 1)', 'Outfit-only; board med sidostapel + wash i stället för dualstatus-zon; fokusring .25; fjärde mörka tealen rgb(0,110,94) på jobblistans hover; ingen sticky-CTA; inbäddat 600-läge med pill-badge; wrap 1180; hero-chrome lever bara i preview-HTML.'],
  ['elcentral-kollen (auk 1)', 'PJS-rubriker; cta-secondary och dela-knappen saknar font-family (Arial); tre primära knappstilar i samma kort; "Tillbaka" 13 + "Börja om" 12 på olika baslinjer.'],
  ['energycalc (auk 1)', 'Egen familj: heat-picker-kort 88 px med ikonruta, glidande seg-pill, stepper, native range; delar bara midnatt/teal och tvåkortslogiken.'],
])}
${h3('tokens-brister', 'Brister i tokens.css som kitet stötte på')}
<ul class="ds-p" style="padding-left:1.8rem">
  <li>Ingen kortrubrik-roll mellan h3 (22) och h2 (36): frågetiteln 32 → 20 är kit-egen.</li>
  <li>Ingen info-tint och neutral-tint för besked-zoner (bara <code>--ampy-info-ink</code>); text.css har samma lucka för info-pillen.</li>
  <li>Gap 64 mellan rail och stage (båda diagnostikerna) saknas i skalan (xl 56 / 2xl 79).</li>
  <li>Kortets min-höjd 560 / 600 och blocklägets 760 / 636 är kit-egna literaler.</li>
  <li>Elkollens lövgröna verdict-accent och caveat-amber saknar tokens: kitet mappar till success-ink och warn-ink.</li>
</ul>
` });

await writeFile(resolve(root, 'site/komponenter/verktyg.html'), calcPage);
await writeFile(resolve(root, 'site/komponenter/diagnostik.html'), diagPage);
console.log('skrev site/komponenter/verktyg.html (' + calcPage.length + ' tecken) och diagnostik.html (' + diagPage.length + ' tecken)' + (parity ? ' med paritetstabeller' : ' UTAN paritetstabeller (kör s3-parity.mjs)'));
