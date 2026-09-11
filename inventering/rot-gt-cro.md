# rot-gt-cro — avdragsblocken (ROT / Grön Teknik / hemförsäkring)

**Vad:** processblocket "Sänk kostnaden … genom X % avdrag" som ligger på alla 22 tjänstesidor + de programmatiska
sidorna, i två lager: (a) **1:1-klonen av live** (`rot.html` = /elservice/elcentral/, `gron-teknik.html` =
/batterilagring/; auktoritet 1) och (b) **den levererade familjen** D2 "Kvittot först" (`designs/d2-kvittot-forst.html`
bas + `gt-produkt` + `gt-generisk` + `hemforsakring`; auktoritet 2, levererad till Chris, 278 sidor mappade i
`handover/blockmappning.csv`).
**Status:** levererat; klonen är kanon för hur live ser ut i dag.
**Mätning:** `inventering/_probes/rot-gt-cro.mjs` → `_probes/out/rot-gt-cro.json` (getComputedStyle @1440 och @390).
Datablad: `inventering/rot-gt-cro.json`.

| Live ROT (klon) | Familjen D2 (bas) |
|---|---|
| ![](skarmdumpar/rot-gt-cro-rot-live-desktop.png) | ![](skarmdumpar/rot-gt-cro-d2-rot-desktop.png) |
| ![](skarmdumpar/rot-gt-cro-rot-live-mobile.png) | ![](skarmdumpar/rot-gt-cro-d2-rot-mobile.png) |

Övriga skärmdumpar: `rot-gt-cro-gt-live-*`, `rot-gt-cro-gt-produkt-*`, `rot-gt-cro-gt-generisk-*`, `rot-gt-cro-hemforsakring-*`.

## Det viktigaste i tokens

### Live-klonen (så ser sajten ut i dag)
- **Rotstorlek:** `html{font-size:62.5%}` → 1 rem = 10 px. Body = `--aptext-sm` 16 px @1440 / **14,12 px @390**, vikt 300,
  lh 1.7 och färg **#363636** kommer från Bricks `frontend.css body`, inte från någon ap*-token.
- **H2:** `--aptext-xl` = **32 px/400, lh 1.3** @1440; ≤767 byter mediaregeln till `--aptext-lm` = **22,46 px, lh 1.2**.
  Elementregeln `.brxe-417657` säger `--aptext-lm` (28 px) men förlorar i kaskaden. Färg = Bricks `--color-8` **#1f1f1f**
  (≠ `--apdarkest-black` #1e1e1e). ROT: JS (`heading-highlight.js`) lägger `--color-7` #5fb1bf-gradient på de sista 3
  orden; GT: hel gradient `--color-8` 30 % → `--color-21` #57ff9a 60 % → `--color-22` #33995c. Inga av dessa är ap*-tokens.
- **H3:** `--aptext-ml` 22 px/400 lh 1.3 → mobil `--aptext-mm` 18,12 px, **lh 1**, GT-mobil vikt 500.
- **P:** ROT `--aptext-m` 18 px/300 lh 1.7 · GT `--aptext-sm` 16 px/300 → båda 14,12 px/300 lh 1.4 `--color-20` (#333) på mobil.
- **Spacing (allt via tokens, men två system):** sektion `--apspace-l` 39,6 px; kort ROT `--apspace-3xl` 111,9 px /
  GT `--apspace-xl` 56 px; kortets row-gap `--apspace-l`; steg-grid ROT `--apspace-s` 19,8 / GT `--apspace-m` 28;
  mobil-horisontellt via Core-Framework-legacy `--space-xs` 9,0 / `--space-s` 13,0; knapp `--space-s --space-m` (16/24).
- **Radie:** kort + ROT-knapp `--apradius-l` 20 px (16,3 @390); GT-knapp `--radius-s` 12 px (legacy).
- **Skugga:** ROT-kort literal `0 0 16px rgba(190,190,190,.19)`; GT-kort ingen. `--shadow-primary` är odefinierad →
  hela `--apshadow-*`-skalan är död på live.
- **Knappar:** ROT bg `--color-13` #c7f5ff / text #363636; GT bg `--color-23` #e0faeb / text #090b32 (= `--apmidnight-blue`
  som literal). 16/500, ls 0,5 px, lh 1.7 ärvd → **59,2 px hög**. Mobil: full bredd, margin-top `--apspace-l`.
- **Konkurrerande tokenskala:** `theme-style.css` deklarerar en annan `--aptext-*`-skala (xl 36, 2xl 48, l 28,
  m 17→18, egen `--aptext-mmm`) och inverterade radie-clampar; `global-variables.css`/core-framework-blocket vinner
  på live, men `--aptext-mmm` (22 px) finns bara i theme-style.

### Familjen D2 (levererad)
- Egen namnrymd `--av-*` med **literaler** — ap*-tokens refereras aldrig, men värdena är valda mot dem:
  `--av-navy` #090b32 = `--apmidnight-blue`, `--av-teal` #00a991 = `--apteal-core`, `--av-heading-ink` #1e1e1e =
  `--apdarkest-black`, `--av-body-ink` #333 = `--apcharcoal-gray`, `--av-offwhite` #f5f9ff = `--apsky-mist`.
  **Utanför tokens:** `--av-ink` #0f123c (wrappertext), `--av-muted` #565e82, `--av-teal-soft` #e0f5f2, panelens
  rgb(27,29,75) (= Bricks `--color-18`, "hero-receptet"), blobbar #0b0d2a/#010328, vågor #eef4fc/#e6eff9, CTA-gradient
  #55ff9a (= `--apneon-mint`) → #5eb1bf, CTA-text hsl(237 35 % 24 %).
- **Typografi (slutspec 2026-08-15/16, uppmätt):** H2 `clamp(26px, 1.04vw + 22.7px, 36px)` = `--aptext-2xl`-kurvan i px,
  **vikt 450**, lh 1.2, ls −0,01 em, balance; accent 550 + 2 px understrykning offset 5. H3 `clamp(19→23)`/450 lh 1.25
  (ingen ap-token). P `clamp(16→18)`/300 lh 1.5 = `--aptext-m`-kurvan ("= testimonials .att-sub exakt"). Caps 13/700
  0,12 em. Kvittorad 17 (400/600/700). Pill 14,5/600. Not 13,5/400. Total `clamp(20,1.6vw,24)`/700 lh 1.1. CTA 16/500 lh 1.
  Kommentaren i d2 rad 125 dokumenterar referensmätningen: **mini-menu 38 · content-block 32 · testimonials 36 · temats
  sidnivå-h2 40** → medianen 36 vald. (Briefens "28→38/500, 18,5/300" finns inte i klonen — noterat som null i JSON.)
- **Spacing:** block `clamp(44px,5.4cqi,100px) clamp(24px,4.4cqi,80px)` → 74,7/60,9 @1440, 28/16 @390; grid
  `minmax(0,1fr) clamp(480px,37cqi,530px)` gap `clamp(48,6.3cqi,96)` → 700,8 | 480, gap 79,4; H2 mb 44 (40); caps mb 36 (22);
  steg↔steg 44 (28) — **samma som H2→steg, ingen kontrast @1440**; panel 41,8/31,7 (24/14); kvittorytm 16/16/20/20/32/24; CTA 58 hög.
- **Radier utanför ap-skalan:** block 32 (mobil 22), panel 22, totalplatta 14, CTA 16, pillar 999.
- **Skuggor:** block `0 24px 50px -10px rgba(15,18,60,.18), 0 8px 16px -6px .10`; panel `0 6px 16px -4px .10, 0 2px 6px .06`;
  CTA inset-highlight + 0 10px 26px −6px rgba(94,199,160,.45).

## Komponenter (en rad per komponent)
- **Live avdragskort** — vit container 1280, radie 20, våg-SVG 80 % nere-höger, fadeIn på enterView.
- **Live H2 med markering** — 32/400 centrerad 70 %; ROT sista-3-ord-gradient via JS, GT hel-gradient.
- **Live processrad 1-2-3** — handritade penselringar 95 px (55 mobil) + JS-injicerade streckade gradientlinjer #5EB1BF→#1D234E.
- **Live steg** — ikon (margin-top −15) + h3 22/400 + p 18/300 (ROT) / 16/300 (GT), centrerat; mobil vänsterställd rad.
- **Live knapp "Läs mer om …"** — ljus pastellknapp, 59 px, ROT/GT olika färg, radie och ikon.
- **av-block** — fullbreddskort, tre masktonade hero-vågor, 2-kolumns cqi-grid; staplar ≤1024 cqi.
- **H2-mallen** — "[jobb] (+ i [Ort]) med [sats] % [avdragsnamn]", accent svart 550 understruken.
- **STEG FÖR STEG-caps** — 13/700 0,12 em #565e82.
- **Stegring variant F** — 46/36 px, navy siffra, teal förloppsbåge 1/3→2/3→hel i samma spår som connectorn (2 px rgba(0,169,145,.2)).
- **Steg** — grid 46px 1fr, col-gap 20/16, row-gap 6; h3 23/450, p 18/300 max 58ch.
- **Kvittopanel (mörk)** — 480–530 px, rgb(27,29,75) + 3 blobbar, radie 22; caps-rubrik, prickade ledare, pill, chip, totalplatta rgba(255,255,255,.08) radie 14, finstilt .70, avdelare .16, CTA.
- **Offert-pill** — #f5f9ff, ram .16, 14,5/600 navy, 4×15.
- **Avdragschip** — #e0f5f2, navy 17/700 — bara för kanonsatser.
- **CTA primär** — hero_2-knappen: 58 hög, radie 16, gradient 120° neonmint→#5eb1bf, pil 18 px, hover −1,5 px.
- **Preview-krom** — levereras aldrig.

## Det som gör blocket bra (bevara)
- Kvittometaforen: prickade ledare, pill-värden, chip och totalplatta — läsbar på 3 sekunder utan interaktion.
- Förloppsringen som fylls 1/3 → 2/3 → hel och delar spår med connectorn: märke och linje är en idé.
- Optisk linjering av ringen mot H3:ns versalband (`--av-nmt` ur radhöjden, 0,02 em), inte ett gissat pixelavdrag.
- Container-queries mot blocket (inte viewport) — spalterna följer kortets bredd i Bricks 1280-container.
- Robusthetslagren: print (ramar bär formen), forced-colors (systempalett), reduced-motion inkl. pseudoelement, `@supports`-fallback.
- Ett typografiskt system i panelen (13/17/14,5/13,5/20–24) desktop OCH mobil; radetiketter kliver in i caps-rollen när panelen är smal.
- H2-mallen och ordbudgeten som familjekontrakt (NOTES.md "FAMILJEKONTRAKT").

## Defekter
Se `rot-gt-cro.json → defekter` (12 st). De tyngsta: död `--apshadow-*`-skala (odefinierad `--shadow-primary`); två
konkurrerande `--aptext-*`-skalor i kaskaden; H2 32/28/22 + temats 40 = fyra värden för en roll; H2-färg #1f1f1f ≠
token; ROT/GT = två rubrikdevices och två knappar (+ två 404-assets); mobil-h3 lh 1 och body 14,12 px; familjen ligger
helt utanför ap*-variablerna (avsiktligt, men det gör att Bricks-tokens inte styr blocket).

## Vad som skiljer sig från andra block
- **H2-storlek:** live 32/400 (`--aptext-xl`) mot familjens 36/450 (`--aptext-2xl`) — familjen valde medianen av
  mini-menu 38, content-block 32, testimonials 36 (temats h2 = 40/500). Vikt 450/550 finns inte i något annat block.
- **Färger:** live-blocket är det enda som bär Bricks-palettens `--color-7/-13/-21/-22/-23` (blågrön, pastellblå,
  pastellgrön); familjen introducerar rgb(27,29,75) (heropanelens mörkblå) som kortyta, vilket inte är `--apmidnight-blue`.
- **Dekor:** live = programmatic-bg-overlay-blue.svg (80 %, nere-höger) + handritade penselringar; familjen = hero_2:s tre
  vågformer i ljus ton (65/45/50 %, masktonade) + heroblobbarna i panelen. Ingen glaseffekt, ingen blur.
- **Knapp:** live-knappen är en ljus pastellknapp (59 px, radie 20/12), familjen använder hero_2:s gradient-CTA (58 px, radie 16).
