# eljour-sticky-bar — ring-baren (mobil) + hörnkortet (desktop)

**Vad:** persistent ring-affordans för `tel:+46102657979` på eljour-ytan: en fixed bottenremsa ≤992 px med sajtens
kanoniska ring-knapp (M1, låst) och ett 216×128-hörnkort ≥993 px som alltid är synligt. Leverans = `dist/ampy-callbar.{css,js,php}`;
previewens markup är genererad genom att köra PHP-filen. 63/63 beteendetester i Chromium. Auktoritet 2 (väntar hörnval).
**Mätning:** `inventering/_probes/eljour-sticky-bar.mjs` → `_probes/out/eljour-sticky-bar.json`. Fixed-element kräver viewport-
klippta dumpar (`*-viewport.png`); shot.mjs-fullsidorna finns också. Datablad: `eljour-sticky-bar.json`.

| Mobil 390 (viewport) | Desktop 1440 (viewport, hörnkort nere-höger) |
|---|---|
| ![](skarmdumpar/eljour-sticky-bar-mobile-viewport.png) | ![](skarmdumpar/eljour-sticky-bar-hornkort-viewport.png) |

## Det viktigaste i tokens
- **Baren uppfinner ingenting** — allt är samplat: pillen = sajtens `btn-ring` (gradient 120° `#b6f2ff` [= `--apcrystal-blue`]
  → `#5eb1bf` [utanför tokens], ink `#282a53`, 16/500 + nummer 600, radie 16, 36 px vitt ikonchip med `ampyRing`-puls,
  skuggor inset .55 / 0 2px 4px .06 / 0 10px 26px −6px rgba(94,177,191,.55)); krom `#fff` + hairline `#e6ecf6` + lyft
  `0 -4px 20px rgba(9,11,50,.10)`; gröna forken = byte-identisk med symptomblockets `.eb__cta` (146° `#055a4b→#0a8169`).
- **Allt i px, aldrig rem** (temat kör html 62.5 %). Bar-padding `8px 12px max(env(safe-area-inset-bottom), 16px)` →
  **83 px hög** (1 + 8 + 58 + 16), body `padding-bottom: 83` server-side → CLS 0, **tap-centrum 45 px** från underkanten.
- **Fallback-drift:** `--acb-radius: var(--apradius-m, 14px)` och `--acb-label: var(--aptext-s, 15px)` blir 12 px / 14 px i
  produktion @1440 (10,1 / 12,1 @390) men 14 / 15 i preview — gäller bara forkarna, ring-varianten sätter 16/16 explicit.
- **Hörnkort:** 216×128 (pixelhöjd låst med px-line-heights), fixed 24/24, radie 20, ram `#e6ecf6`, skugga
  `0 10px 30px rgba(9,11,50,.07) + 0 16px 40px .16`, padding 14/16/19; ledtext 14/500 lh 20 `#3b3f59` "Prata med en expert";
  ring-CTA 182×58 med verb 16/500 lh 18 + nummer 13/600 lh 16 tabular + ikonchip 36. `.eb__aside` blir sticky top 104 (88 + 16, [GAP-9]).
- **Rörelse:** inträde `transform .18s ease-out` (translateY 110 % → 0), 400 ms kall period, 0 ms reträtt vid tangentbord;
  ampyRing box-shadow-puls 0 → 9 px vit; hover = brightness/saturate (aldrig translateY på en bottenremsa); reduced-motion släcker.
- **Kontrastgolv i koden:** vit på #0a8169 4,82:1; #282a53 på #5eb1bf 5,51:1; #0a6e58 på vitt 6,2:1 (teal #00a991 2,97:1 förbjuden som text); mint-prick på ring-ytan 1,06:1 → borttagen.

## Komponenter
- **Ring-bar (M1)** — fixed 83 px remsa, en pill 366×58, z 900; utan JS synlig; states: acb-js/is-in/is-cold/is-instant/hover/active/focus.
- **Ikonchip** — 36 px vit cirkel .92, glyf 17, optisk mikro-centrering, ampyRing.
- **Hörnkort** — 216×128 nere-höger (variant vänster, dark 240), alltid synligt, ledtext + ring-CTA staplad verb/nummer.
- **Sticky samtalskort** — symptomblockets vänsterkort får `position:sticky` ≥993 via denna CSS.
- **Grön/dark fork** — avstängda (geo 168 / artikel 11 / akut 3 sidor); dark = navy bg + ghost-genväg 13/600 + 44 px kryss.

## Det som gör blocket bra (bevara)
- Sampling i stället för design: pillen mäts identisk med `getComputedStyle` mot den pixelgodkända knappen på samma sida.
- Renderingskontraktet utan JS + server-printad body-padding (noll CLS) + failsafe 6 s.
- Tap-centrum-regeln (≥45 px) som vann över specens "74 px totalt" — och dokumenterades som namngiven avvikelse.
- Kalla perioden 400 ms (ingen oavsiktlig uppringning) och 0 ms-reträtten under tangentbord.
- Pixelhöjdslåsning i hörnkortet (128,00 inte 127,59) mot halvpixelkanter på 1x-skärmar; optisk balans uppe/nere mätt till Δ 0,08 px.

## Defekter
Se JSON. Viktigast: fallback-driften i forkarna (radie 14→12, text 15→14/12 i produktion), tabular-nums ej samplat (ägargrind),
[GAP-9] header-höjd 88 antagen, hörnval öppet, fem ärvda färger utanför ap*.

## Vad som skiljer sig från andra block
- **Samma sida, två CTA-språk:** symptomblockets gröna gradientknapp (#055a4b→#0a8169, vit text) och barens ring-knapp
  (#b6f2ff→#5eb1bf, mörk text) står i samma viewport på mobil (proof 82 "dubbel-CTA"). Ring-knappen är sajtens kanon (Hero-2/header),
  den gröna är symptomblockets egen.
- **Radie 16** för ring-pillen = ROT-GT-familjens CTA (hero_2) — men hörnkortet 20 och forkarna 14/12: tre radier i en leverans.
- **Enda källan som uttryckligen förbjuder rem** och som mäter tap-ergonomi (45 px) — ett mönster inget annat block har.
