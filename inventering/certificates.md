# certificates — tillitsblocket ("Behörigheten bakom varje jobb")

**Vad:** det mörka bandet med certifikat-/partnerkort. Två lager: `index.html` = **1:1-klon av live** ("Certifikat och
partners", 6 kort, mätt 0 diffar av 9 160 egenskaper) och `redesign/` = **v2** (låst ägarbeslut 2026-08-06: bakgrund B
"Strömfält", ny h2 + brödtext, 4 märken i 2×2). `delivery/` = Chris-paketet av v2. Auktoritet 2 (levererat, paritet).
**Mätning:** `inventering/_probes/certificates.mjs` → `_probes/out/certificates.json`. Datablad: `certificates.json`.

| v2 (redesign) | Live-baslinje |
|---|---|
| ![](skarmdumpar/certificates-desktop.png) | ![](skarmdumpar/certificates-live-baseline-desktop.png) |
| ![](skarmdumpar/certificates-mobile.png) | ![](skarmdumpar/certificates-live-baseline-mobile.png) |

## Det viktigaste i tokens
- **Yta:** `linear-gradient(90deg, #090b32, #5eb1bf)` — navy = `--apmidnight-blue`, **#5eb1bf är utanför tokens** (samma
  blågröna som ROT-GT:s connector-linjer och hero_2-CTA:ns slutfärg). v2 mobil vrider den till 180° (navy 0–34 % → #5eb1bf)
  så ljusänden hamnar bakom korten (2,10 → 7,32:1 uppmätt).
- **Vågor v2:** tre inline-SVG-band `#b6f2ff` (= `--apcrystal-blue`, .30), `#fff` (.26), `#8fd4e0` (utanför tokens, .44) med
  `preserveAspectRatio="none"` + radial ljusglugg rgba(255,255,255,.10). Live: `partner-section-overlay.svg` 90 % hög,
  `object-fit: cover` → klipps 568 → 319 px (kantig).
- **Typografi v2:** h2 `--aptext-2xl` **36/400 lh 1.2 ls −0,01 em** vit, balance (synkad mot "Så funkar det"; README
  dokumenterar startsidans spann 40/500 · 40/600 · 38/500 · 36/400 · 36/400 · gamla blocket 32/400 = minst på sidan);
  p `--aptext-m` 18/300, **lh 1.55 ≥901** (1.7 bas, 1.6 mobil), max 48ch (567 px). Live: h3 `--aptext-xl` 32/400 lh 1.3;
  p 18/300 lh 1.7, **14,12 px på mobil** (odefinierad `--text-m` → body).
- **Spacing:** v2 sektion `--apspace-xl` 56 (vertikalt; live `--apspace-2xl` 79,2 — 46,4 px flyttade till korten), margin
  legacy `--space-l` 36; text↔kort `--apspace-m` 28; h2→p `--apspace-xs` 14; grid column-gap `--apspace-s` 19,8 (≥ radie),
  row-gap 16 literal; kort 236×113 padding 16/18 (mobil 160×96, 12/14). Live: kort 113,6×90,6 padding `--apspace-s`, gap 15/16.
- **Radie:** `--apradius-l` 20 (16,3 @390) i båda. **Skugga v2:** `0 2px 10px rgba(9,11,50,.10), 0 12px 34px .10, inset 0 0 0 1px .07`;
  live: ingen. **Blockhöjd låst 354 px** @1440 (live 354,58).
- **Logotyper v2:** höjd per märke på optisk bläckmassa: IN 35, ESV 70, ID06 43, Trygg-Hansa 28 (mobil 25/56/30/20).

## Komponenter
- **Tillitssektion .cert** — fullbredd 354 px, gradient, tre vågor, ljusglugg, isolation.
- **Intro** — h2 36/400 + p 18/300 lh 1.55 max 48ch; centrerad/34ch på mobil.
- **Märkeskort ×4** — vit länk 236×113, radie 20, tre-lagers skugga + 1 px hårlinje, hover −2 px, tvåtonsring focus, scroll-margin 96.
- **Märkesgrid** — 2×2, max 492, gap 19,8/16.
- Live: **sektion "Certifikat och partners"** — h3 32/400, p 75 %, 3×2 kort utan skugga, 6 logotyper 14–49 px.

## Det som gör blocket bra (bevara)
- Bläck-normaliseringen (canvas-mätt tom yta + optisk massa) — det enda sättet att få fyra främmande logotyper att väga lika.
- Höjdlåset som designbeslut: större kort utan att sidan växer.
- Vågen som oklippbar inline-SVG; gradientparet på blocket (inte :root) så CSS:en aldrig kan ge ett osynligt block.
- Tvåtonsringen (vit + navy) som klarar 3:1 över hela gradienten; hover bara för riktiga pekare; scroll-margin mot sticky-baren.
- "Kolumngap ≥ radie"-regeln och 23-bredders svep utan änkor/klippning.

## Defekter
Se JSON. Viktigast: #5eb1bf utanför tokens och för ljus för vit text; legacy `--space-l`; row-gap literal; tredje skuggfamiljen
(rgba(9,11,50)); live-blocket: 32 px-rubrik, 14,12 px mobiltext, klippt våg, Rexel 404, logotyper med inbyggd luft; ID06-filen [GAP].

## Vad som skiljer sig från andra block
- **H2-referensen:** v2 = 36/400 lh 1.2 (samma som testimonials V1 och ROT-GT-familjen men vikt 400, inte 450) — README:s
  uppmätta tabell är den tydligaste dokumentationen av att startsidan kör **fem olika H2-storlekar/vikter** (40/500, 40/600, 38/500, 36/400, 32/400).
- **Brödtext-lh:** 1.55 (v2 desktop) — ett fjärde värde bredvid 1.5 (ROT-GT/testimonials V1), 1.7 (Bricks/live) och 1.4 (ROT-GT mobil).
- **Mörk yta:** gradient navy→#5eb1bf — en fjärde "mörk" yta bredvid `--apmidnight-blue`, rgb(27,29,75) och #0b0f30→#2d516d.
- **Skuggfamilj:** rgba(9,11,50,…) tre lager + inset hårlinje — ingen annan källa har inset-hårlinje.
