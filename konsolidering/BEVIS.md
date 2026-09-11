# BEVIS — vad som lästes, hur det räknades, vad som inte gick att avgöra

## 1. Lästa inventeringar (31 källor)

Alla 30 JSON + alla 30 MD i `inventering/` samt `inventering/tidigare-dokumentation.md`:

article-template · battery-calculator · booking-confirmation (inkl. `offer_accepted`-sektionen) · brandbook · certificates · cta-website · elcentral-kollen · eljour-block · eljour-sticky-bar · elkollen · energycalc · ev-kalkylator · footer-cro · fore-efter-cro · fotobedomningen · hero-1 · hero-2-alternatives · hero-2-form · led-kalkylator · live-ampy-se · main-cta · main-form · mini-menu · picasso · rot-gt-cro · testimonials-block · thank-you · var-process-cro · visste-du-att · website-blocks · tidigare-dokumentation.

Dessutom läst direkt ur `kallor/` för ordagranna värden: `live-ampy-se/global-variables.css` (lager 1), `Hero-1/assets/style.css` (veil, h1, lead, CTA-kopia), `CTA-website/{radgivning,ring}-cta/*.css` (knappkanon), `Hero_2-alternatives/dist/ampy-hero-primitives.css` (scrim-tokens, primitiver), `Thank-you-Offer-accepted/v1/styles.css` (aurora, glas, `--shadow-primary`). Öppnade skärmdumpar (auktoritet 1): hero-1, website-blocks, cta-website, live-ampy-se ROT, led-kalkylator, ev-kalkylator, energycalc, elcentral-kollen, elkollen, eljour-block, testimonials-block, footer-cro baseline (desktop; kontaktark i scratchpad), plus röktestets egna PNG:er. Rot-gt-calculator/wireframes: inte använda (underkända).

## 2. Skript (alla i `konsolidering/_probes/`, utdata i `_probes/out/`)

| skript | gör | utdata |
|---|---|---|
| `01-farg-frekvens.py` | regex över `farger[].hex` i 30 JSON (+ offer_accepted): hex/rgb/hsl → #rrggbb, alfa separat; **frekvens = antal KÄLLOR** (inte förekomster), viktat med auktoritet | `farg-frekvens.json/.md` (682 rader, 257 unika) |
| `02-typ-matris.py` | `typografi[].roll` klassad med regex till 11 roller; matris källa × roll; frekvens per roll för vikt/lh/px/ls (auk 1–2) | `typ-matris.json/.md`, `typ-rader.json` (401 rader, 267 klassade) |
| `03-radier-skuggor-rorelse-spacing.py` | radie-px per källa; skuggsträngar + rgb-tripletter + delade exakta strängar; durations/easings; `--apspace`-referenser; sektion-padding; container; brytpunkter | `radier.json`, `skuggor.json`, `rorelse.json`, `spacing.json`, `container-breakpoints.json`, `03-sammanfattning.md` |
| `04-kontrast.py` | WCAG-kontrast för 44 kandidatfärger mot vit / sky-mist / midnight / teal-ytor + alfa-blandningar | `kontrast.json/.md` |
| `05-tokens-lager1.py` | parsar `global-variables.css`: 148 deklarationer → 101 unika `--ap*` (47 dubbletter hex/rgb, alla identiska); genererar lager 1 verbatim | `lager1-ap-tokens.css/.json` |
| `06-smoke-matt.mjs` | Chromium 390/768/1440 på `system/_smoke.html`: alla 101 ap* resolvar (0 saknade), 0 konsolfel, Outfit laddad, ingen x-overflow; px för varje `--ampy-text/space/radius` + alla rem-tokens; jämför lager 1 mot live-mätningen (`live-ampy-se.json.tokens_live`) | `smoke-matt.json` |
| `07-tabeller.py` | bygger `farg/typografi/spacing/form-djup-rorelse.{md,json}` ur 01–06 + kanon-dicten | de fyra tabellparen |
| `tools/shot.mjs` | renderade `system/_smoke.html` desktop + mobil | `konsolidering/_probes/smoke-desktop.png`, `smoke-mobile.png` |

Så räknades frekvens: en färg/ett värde får +1 per källfil där det förekommer i inventeringens `farger[]`/`typografi[]`/`radier[]`/`skuggor[]`/`rorelse[]`, oavsett hur många gånger inom filen. Auktoritet ur INVENTERINGSBRIEF (rot-gt-cro räknas 1 för klonen, footer 1 för baslinjen). Värden som bara finns i `roll`-text eller `komponenter[]` räknas inte av skripten (begränsning) — de plockades manuellt i MD-läsningen och står som "drift" i tabellerna.

## 3. Verifiering av tokens.css

- Lager 1: 101 namn/värden identiska med `global-variables.css` (05); i Chromium ger de samma px vid 1440 och 390 som live-inventeringen (`smoke-matt.json.lager1_vs_live.avvikelser = []`, enda medvetna avvikelsen är `--apspace-4xs` 5,19 → 4,9/5,2).
- Lager 2 mätt (px vid 390 / 768 / 1440): display 36 / 36 / 60 · h1 31,3 / 38,4 / 48 · h2 26,8 / 30,7 / 36 · h3 20,1 / 20,9 / 22 · lead 17 / 17 / 22 · body 16,1 / 16,9 / 18 · small 14,1 / 14,9 / 16 · eyebrow 12 · siffra 38,3 / 45,8 / 56 · label 14 · knapp 16; vikter 700/700/500/600/400/300/400/600/700/600/500 som avsett; färger midnight, muted `rgb(86,94,130)`, knapptext indigo `rgb(40,42,83)`.
- Röktest-PNG:erna (desktop 1440×1481, mobil 390×2075) granskade: hierarkin läses display > h1 > h2 > h3 > lead > body > small; knappar, fält, mörkt kort och färgremsan renderar; inget spill.
- Kommentarbalans i tokens.css kontrollerad (178 öppna / 178 stängda). Filen laddas ensam (röktestet laddar bara tokens.css + base.css).

## 4. Tal jag inte kunde avgöra (ligger i `beslut.md` eller som notering)

1. **Brödtextens färg/vikt** — 11 vs 3 vs 3 källor men de tre grupperna representerar tre hela familjer (navy-full, live-grå, eljour); frekvens säger midnight/300, regel 2 (eljour) säger `#3b3f59`/400 → B3.
2. **Felröd** — `#b3261e` (3) / `rgb(214,76,76)` (2 auk 1) / `rgb(122,22,35)` (2 auk 1): tre-vägs-lika; avgjort på kontrast (6,54 / 4,20 / 10,68) → B13.
3. **Fast duration** — 150 ms (9 källor, verktyg) vs 160 ms (8, knappbiblioteket): satt 160 på knappregeln; skillnaden är omärkbar.
4. **H2-storlek** — 36 (7) / 32 (6) / 40 (5): tre nästan lika högar, avgjort på tokenbindning + regel 2 → B17. **H2 lh** 1.15 (eljour + testimonials, båda auk 1) vs 1.2 (fem auk 2) → 1.2 på frekvensregeln.
5. **Lead** — Hero-1:s 22→17 (regel 2) mot 20/16–18 i tre andra källor → B18.
6. **Eyebrow-storlek** 12 vs 15 → B19; **label** 14 vs 15/13 (satt 14 på tre källor, mot LED:s 15).
7. **Sektion-padding** — `2xl` (5 källor) vs `xl` (5): avgjort på antal auk 1-källor (3 vs 2).
8. **Solid knapp-teal** — teal-core (3 auk 1) vs teal-deep (3 auk 1): avgjort på kontrast → B5.
9. **`--apspace-4xs`:s avsikt** — jag antog att ändpunkterna (4,9/5,2) är rätt och lutningen fel; kan lika gärna vara tvärtom (Core Framework-generatorn). Enda användning: footer-bar.
10. **Ska lager 2 referera lager 1 via `var()`?** Jag valde px-clamp (rem-oberoende, fore-efters modell) med "= --apspace-x"-kommentar; det gör att en ändring i Bricks' ap-värde inte slår igenom i `--ampy-*` automatiskt. Om Julius vill ha ett-värde-en-plats: byt till `var(--apspace-…)` och kräv 62,5 %-rot (B8).
11. **Elcentral-kollens verdict-tinter** (fem tint-ytor) och Elkollens grön/röd/gul-ramper finns bara i en källa vardera — inte tokeniserade (bara accent-kvartetten som delas av båda).
12. **Fonten**: `system/fonts/Outfit-VariableFont_wght.woff2` antas vara Googles variabla 100–900 (fontTools fanns inte för att läsa fvar-axeln); röktestet bekräftar att 300/500/600/700 renderar i olika vikter.
13. **Skriptens regex-klassning** av typografiroller är grov (267 av 401 rader); matrisen är underlag, kanon sattes efter MD-läsningen. Oklassade rader ligger i `typ-rader.json`.
