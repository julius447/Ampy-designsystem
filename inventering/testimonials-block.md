# testimonials-block — omdömesslidern

**Vad:** auto-roterande Google-omdömen som huvudblock på flera landningssidor. Två lager i repot: `index.html` =
**1:1-baslinjeklon av live-startsidan** (2026-07-18, Bricks nested slider) och `delivery/` = **V1 låst 2026-07-19**
(FluentSnippets-paket, `preview.html` visar exakt `ampy-testimonials.{css,js,php}`). `redesign/a|b` pekar på
produktionsfilerna. Auktoritet 1 (V1 låst); baslinjen visar hur live ser ut.
**Mätning:** `inventering/_probes/testimonials-block.mjs` → `_probes/out/testimonials-block.json`. Datablad: `testimonials-block.json`.

| V1 (delivery) | Live-baslinje |
|---|---|
| ![](skarmdumpar/testimonials-block-desktop.png) | ![](skarmdumpar/testimonials-block-live-baseline-desktop.png) |
| ![](skarmdumpar/testimonials-block-mobile.png) | ![](skarmdumpar/testimonials-block-live-baseline-mobile.png) |

## Det viktigaste i tokens (V1)
- **Tokenbunden på riktigt:** all spacing via `--apspace-*` (sektion 2xl/m = 79,2/28 @1440 → xl/s = 27,3/13,3 @390;
  head-mb l = 39,6; kort m/m/l = 28/28/39,6; kropp s = 19,8; namn/divider 2xs = 9,9; nav+badge mt s), rubrik `--aptext-2xl`
  **36/400 lh 1.15 ls −0,01 em** navy, subline `--aptext-m` 18/300 (.68), namn `--aptext-ml` 22/600, datum `--aptext-xs`
  12/400 (**10,1 px @390**), badge-text `--aptext-m`/`--aptext-sm`. Färger `--apmidnight-blue`, `--apneon-mint`, `--apteal-core`.
- **Avvikelser mot ap*:** kortgradient `−27deg #0b0f30 → #2d516d 60 %` (verbatim från live), skugga
  `0 0 16px rgba(190,190,190,.14)`, prickar `#c7d3eb`/`#cfe9d9`, fyllning `--brightgreen #1bd365` (Bricks-palett) → `#00ad48`,
  Google-gult `#fbbc04`; radie via legacy `--radius` 16 px; korttexten har en egen kurva `clamp(1.7rem, .21vw+1.63rem, 1.9rem)`
  = 19 @1440 / 17,1 @390, vikt 300, lh 1.5; mobilrubriken `clamp(2.3rem, 6.4vw, 2.7rem)` = 24,96 @390.
- **Splide:** v4.1.4 self-hostad, loop, perPage 3/2/1 (1024/759), perMove 1, gap 24, interval 4000, speed 500, paus vid
  hover/fokus/touch, inga pilar, egen 4-prick-navigering (24×6 → 44×6 aktiv, gradientfyllning scaleX i takt med autoplay).

## Det viktigaste i tokens (live-baslinje)
- H2 `--aptext-xl` **32/400 lh 1.2 #363636** med "Ampy?" i gradient `--brightgreen → --color-5 (#33995c)`; container 1100
  (Bricks-default), vitt bakgrundskort 900 px radie `--apradius-l` 20 + skugga .19 **bakom** en 1200 px slider (korten sticker
  ut 150 px per sida); kort 383×360 padding `--apspace-m` 28, radie `--radius` 16, samma gradient, namn `--aptext-l` 24/600
  lh 1.3, text `--aptext-m` 18/300 **lh 1.7**, Ionicons-stjärnor 19 px neonmint, Google-G 25 px nere-höger; Splide type slide,
  gap 25, interval 3000, speed 400, rewind, Bricks-paginering 70×10 `#00ad48`. Vitt kort dolt på mobil.

## Komponenter
- **Sektion** — transparent, inner 1200, Outfit 300 navy, wrapper-scopad.
- **Rubrikblock** — h2 36/400 + subline 18/300 (.68), max 720, centrerat; subline dold ≤759.
- **Omdömeskort** — 384×394 (3-upp), min-h 360/340/300, radie 16, mörk gradient, citattecken 56/600 neonmint .55 + Google-G 22 i toppen, text 19/300 vertikalt centrerad, namn 22/600, 1 px avdelare .14, 5 stjärnor 15 px + datum 12/400 .72.
- **Prick-navigering** — 4 pillar, aktiv 44×6 med grön fyllning, träffyta ±12 px, fokus teal.
- **Google-betyg-badge** — 44 px hög länk, 5 gula stjärnor 18 px, "**5 av 5** Betyg på Google" 18/300+600; enda CTA:n.
- Live: **vitt bakgrundskort** 900 (dold mobil), **h2 med gradientord**, **Bricks-kort** utan datum/citattecken, **Splide-paginering**.

## Det som gör blocket bra (bevara)
- Prickarna som fylls i takt med autoplayen (index % 4) — självläkande via `autoplay:playing` + rAF-watchdog; reduced-motion ger statisk markör.
- Kortets tredelning topp/kropp/fot med vertikalt centrerad text och jämn radhöjd (min-height per breakpoint, stretch).
- 44 px träffytor överallt, paus vid hover/fokus/touch, print-invertering, self-hostad Splide, inga font-requests.
- Ett enda konverteringsmål (Google-profilen) — inget påhittat socialt bevis utöver riktiga recensioner.

## Defekter
Se JSON. Viktigast: fem färger utanför ap* (gradient, prickar, fyllning, Google-gult), datum 10,1 px på mobil, egen textkurva,
mobilrubrik och head-marginal som literaler; live: 1100-container, absolut vitt kort med spill, dött inline-skript,
"5 av 5" statiskt (candour-grind i README).

## Vad som skiljer sig från andra block
- **H2:** V1 36/400 lh 1.15 navy (= `--aptext-2xl`) — den referens som ROT-GT-familjen valde ("testimonials 36"); live-baslinjen
  32/400 lh 1.2 #363636 med gradientord som ROT-blockets device.
- **Brödtext-lh:** V1 1.5 (familjestandard) mot live 1.7 (Bricks-default) — samma konflikt som i ROT-GT.
- **Mörk yta:** kortgradienten #0b0f30→#2d516d är en TREDJE mörkblå (ROT-GT-familjens panel rgb(27,29,75), tokenens
  `--apmidnight-blue` #090b32) — tre olika "navy" i tre block.
- **Radie 16 via legacy `--radius`** (inte `--apradius-m` 12 / `-l` 20) — samma 16 som ROT-GT-familjens CTA.
