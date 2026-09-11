# live-ampy-se — sajtens riktiga CSS (auktoritet 1, token-SANNINGEN)

**Vad:** ampy.se:s faktiska stylesheets hämtade 2026-09-11 (`global-variables.css` = Core Framework-tokens,
`theme-style.css`, Bricks `frontend.css`, `site-css.css` = sajtens egna block, fyra `post-*.css`, två
`inline-*.css` = alla `<style>`-block på elcentral- resp. batterilagringssidan) + två live-block extraherade
som markup (ROT-blocket och Grön Teknik-blocket). **Status:** live. **Auktoritet:** 1 — alla andra källor
jämförs mot detta.

Rendering: blocken är bara markup, så jag byggde `inventering/_probes/a1-live-rot.html` / `a1-live-gt.html`
som återskapar live-kaskaden i exakt ordning (inline-block → länkar → inline-block, hämtad ur
`live-source-*.html`), inklusive data-highlight-scriptet. Fjärrtypsnitten på ampy.se är CORS-blockerade från
localhost, så theme-style inlinades utan sina @font-face och Outfit (variabel 100–900) togs från
`kallor/Hero-1/assets/fonts`. Mätning: `a1-tokens-live.mjs` (alla 174 variabler → px vid 1440/390) och
`a1-measure.mjs` (getComputedStyle på riktiga element).

![ROT-blocket 1440](skarmdumpar/live-ampy-se-rot-desktop.png)
![ROT-blocket 390](skarmdumpar/live-ampy-se-rot-mobile.png)
(GT-blocket: `skarmdumpar/live-ampy-se-gt-desktop.png` / `-gt-mobile.png`.)

## Vad jag ser

Desktop: sektion på `#f5f9ff`, ett vitt kort (1280 px, radie 20 px, mjuk grå skugga) med en centrerad
32 px Outfit 400-rubrik där de tre sista orden är teal (`#5eb1bf`), tre steg i rad (penseldragsring 95 px med
siffra, h3 22 px 400, brödtext 18 px 300), och en ljus pastellknapp (cyan `#c7f5ff`, 59 px hög). GT-varianten
är samma block med hela rubriken i gradient (mörk → neongrön → grön), mintgrön knapp (`#e0faeb`) med pil,
och utan vågbakgrund (den ligger i en lazy-bg-klass). Mobil: rubriken centrerad 22,5 px, stegen som rader
(ikon 55 px vänster + text), knapp 100 % bredd.

## Tokenbasen (det viktigaste)

- **rem = 10 px** (`html{font-size:62.5%}` i frontend.css, theme-style.css och core-framework-inline).
  Alla ap*-tokens är clamp() i rem + vw mellan 320 och 1280 px (`--apmin/-max-screen-width`).
- **101 unika `--ap*`-tokens** i `global-variables.css` (174 deklarationer; 47 färg-dubbletter hex→rgb):
  46 färg (17 basfärger + 3×9 alfa-serier + 2), 11 space (4xs→4xl), 15 text (xs→5xl), 6 radie, 5 skugga,
  8 columns, 7 alias (hero-title, post-title, nav-link, header/btn/card/footer-space), 2 screen-width.
  Varje token med uppmätt px vid 1440 och 390 ligger i `live-ampy-se.json → tokens_live`.
- Nyckelvärden @1440 → @390: `--aptext-sm` 16 → 14,1 · `-m` 18 → 16,1 · `-mm` 20 → 18,1 · `-ml` 22 → 20,1 ·
  `-l` 24 → 22,1 · `-lm` 28 → 22,5 · `-xl` 32 → 24,5 · `-2xl` 36 → 26,8 · `-2-5xl` 40 → 28,9 · `-3xl` 48 → 31,3 ·
  `-4xl` 60 → 35,9 · `-5xl` 76 → 42,6. `--apspace-xs` 14 → 10,5 · `-s` 19,8 → 13,3 · `-m` 28 → 16,9 · `-l` 39,6 → 21,5 ·
  `-xl` 56 → 27,3 · `-2xl` 79,2 → 34,8 · `-3xl` 111,9 → 44,4 · `-4xl` 158,3 → 56,8. `--apradius-s` 8 → 6,1 ·
  `-m` 12 → 10,1 · `-l` 20 → 16,3 · `-xl` 32 → 24,5 · `-full` 999rem.
- **Legacy Core Framework-lager i samma fil:** `--space-xs…-section` (11 → 120 px, annan kurva 380→1600),
  `--h1…--h6` (62/47/35/26/20/15 px), `--radius` 16 / `-s` 12 / `-m` 16 / `-l` 24 / `-xl` 36 / `-pill` 9999px /
  `-btn` .3em, `--container-width` 1280, `--max-width` 980/840/640, 30 `--grid-*`.
- **theme-style.css avviker i 11 värden** (`--aptext-m/l/xl/2xl/2-5xl/3xl/4xl` är större: 4xl = 75 px @1440;
  `--apradius-s/m/l/xl` har NEGATIV vw-lutning) och saknar `-sm/-ml/-lm/-3-5xl/-5xl` men har `--aptext-mmm`
  (22 → 20,1). På live laddas dock `<style id="core-framework-frontend-inline">` sist och sätter om alla
  101 ap* till global-variables-värdena → **global-variables.css är den gällande sanningen**; theme-styles
  avvikelser är döda kod (men `--aptext-mmm` lever bara där och används av live-h3).
- **Bricks-paletten** (`--color-2…30`, `--brightgreen #1bd365`, `--blue #4b85fd`) är ett tredje färgsystem
  och det som faktiskt används: `var(--color-N)` 202 gånger mot `var(--ap<färg>)` 36 gånger (alltid med
  hex-fallback, bara i nya block). `--color-15` = #00a88f (≈ teal-core, ej identisk), `--color-3` = #090c34
  (≈ midnight), `--color-2` = #f5f9ff (= sky-mist), `--color-7` = #5eb1bf (fokus/highlight-färgen),
  `--color-13` = #c7f5ff, `--color-23` = #e0faeb, `--color-21` = #57ff9a, `--color-8` = #1f1f1f, `--color-20` = #333.
- Råa hex på live: `#090b32` ×51, `#55ff9a` ×37, `#00a991` ×14, `rgb(9 11 50 / α)` ×162.
- **Skuggtokens är trasiga:** `--apshadow-*` refererar `var(--shadow-primary)` som aldrig definieras (30
  referenser, 0 definitioner) → mätt `box-shadow: none`. Sajtens riktiga kortskugga är rå:
  `0 0 16px 0 rgb(190 190 190 / .19)` ×14 (= #bebebe), varianter /.4 /.36 /.14 och `rgb(241 241 241 / .23)`.
- Typsnitt: Outfit 100–900 + Plus Jakarta Sans 200–800 via @font-face (Core Framework). Body = Outfit 300
  `--aptext-sm`, färg `#363636` (Bricks-default, ingen token), h2-default = `--aptext-2-5xl` 500, ingen
  h1-regel i temat (Bricks 2.4em). Bricolage Grotesque: 0 träffar. `#00fe4a`, `#153236`: 0 träffar.

## Komponenter (live-blocken)

| Komponent | En rad |
|---|---|
| Process-block "tre steg" (ROT/GT) | sky-mist-sektion > vitt kort `--apradius-l` 20 px + skugga `rgba(190,190,190,.19)` 0 0 16px, h2 400 `--aptext-xl` 32 px max-w 70 %, 3-kolumns grid, steg = ikon 95 px (mobil separat 55 px-bild) + h3 `--aptext-mmm` 22 px 400 + p `--aptext-m` 18 px 300, knapp; mobil: steg i rad, knapp 100 % |
| Knapp pastell (`.bricks-button`) | inline-flex, padding legacy `--space-s --space-m` = 16/24 px, `--aptext-sm` 16 px 500, ls .5px, höjd 59 px; ROT: bg `--color-13` #c7f5ff, radie `--apradius-l` 20 px, hover gradient #c7f5ff→#5eb1bf; GT: bg `--color-23` #e0faeb, radie legacy `--radius-s` 12 px, text #090b32, pil-svg 16 px |
| Gradient-rubrik | `-webkit-background-clip:text` + JS `data-highlight="last-3"` wrappar sista tre orden; ROT-gradient = `--color-7` platt, GT = `--color-8 30% → --color-21 60% → --color-22` |
| Live-hero `.home-hero__*` | floating-banner radie 22 px, h1 clamp(36,4.6vw,60) 700 lh 1.07 ls −.018em vit, lead clamp(17,1.55vw,22), CTA min-h 58 padding 11/26 radie 16 (= Hero-1 på live, jämförs i hero-1.md) |
| Produktväljare `.ampy-elfirma` | kort 1:1 radie 20 px, CTA pill 999px 15/32 bg #5eb1bf (= mini-menu på live) |
| Formulär-fixar | fokus: border #5EB1BF + ring rgba(94,177,191,.2) 3 px; checked: 0 0 0 2px #5EB1BF |

## Vad som är bra (bevara)

- Ett komplett fluid-system finns redan: 15 textsteg, 11 spacing-steg, 6 radier, allt clamp() på 10 px-rem —
  det är en bra grund som bara inte används konsekvent.
- Blockens mobilomläggning (steg → rad med ikon vänster, knapp full bredd, rubrik centrerad) är genomtänkt.
- Kortidiomet (vit, 20 px radie, diffus grå 16 px-skugga, sky-mist-sektion) är sajtens igenkännbara yta.

## Defekter

1. `--shadow-primary` odefinierad → alla `--apshadow-*` = none. Kortskuggan är rå #bebebe-rgb.
2. ap-färgtokens är i praktiken oanvända av Bricks-blocken (36 vs 202 palett-referenser + ~265 råa hex).
3. Tre parallella färgsystem (ap*, Bricks-palett, råa hex), två spacing-system (`--apspace` 1482 vs `--space` 324
   referenser) och två radie-system (`--apradius` 120 vs `--radius` 69) — i samma block (knappen: legacy padding,
   ROT-radie ap, GT-radie legacy).
4. theme-style.css:s 11 avvikande tokenvärden (inkl. inverterade radier) överlever bara för att ett senare
   inline-block skriver över dem — skört.
5. `--apspace-4xs` har min > max (5,2 > 4,9 px) → låst på 5,19 px.
6. Färgtokens dubbeldeklareras (hex + rgb); `--h1…h6`, `--logo-width`, `--aphero-title-size`, `--apbtn-space`
   är definierade men refereras 0 gånger.
7. Ingen h1-storlek i temat; body-färg #363636 och fokus-färg #5eb1bf saknar token.
8. Brytpunkter: Bricks-blocken 1024/780/480, site-css 992/768/560, frontend 1320/767/478 — ingen gemensam skala.

## Skiljer sig från andra block

Live är den enda källan där tokens verkligen är fluid clamp() på 10 px-rem och där `--aptext/--apspace`
används rakt av (framför allt i footern). De fristående byggena delar upp sig i två läger: Hero-1/header,
mini-menu, Main_CTA och footer-klonen kör också `html{62.5%}` men med egna px/rem-värden och lokala
token-kopior; CTA-website, Hero_2-alternatives och Hero-2-form är medvetet px-baserade på 16 px-rem och
ska "inte bero på sajtens 62.5 %". Ingen av dem läser `global-variables.css` — se respektive md.
