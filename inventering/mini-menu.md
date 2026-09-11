# mini-menu — produktväljaren under heron (auktoritet 2, levererad)

**Vad:** Startsidans block 2 "Din elektriker för hela hemmet": centrerad rubrik + tre kvadratiska fotokort
(Elservice · Laddbox · Batterilagring) i Evifys exakta layout med Hemsols hover, i Ampy-skinn.
**Status:** levererad som FluentSnippets `[ampy_elfirma]` + Bricks-JSON, paritetsverifierad, och
installerad på live (`site-css.css .ampy-elfirma`). **Auktoritet:** 2.

**Obs mot briefen:** briefen kallar källan "ljus glas-trio", men det som är levererat och ligger live är
den **mörka fotokorts-trion** (`index.html` = `fluentsnippets/`). Den ljusa glas-trion finns i
`prototype.html` (tidigare utforskning) och inventeras som variant nedan.

Renderat: `index.html`, `fluentsnippets/preview/index.html` (identiska höjder 1000/1418) och
`prototype.html`. Mätt: `_probes/out/a1-mini-menu.json` (+ `-glas.json`).

![1440](skarmdumpar/mini-menu-desktop.png)
![390](skarmdumpar/mini-menu-mobile.png)
(Glas-trion: `mini-menu-prototype-glas-desktop.png`.)

## Vad jag ser

Sky-mist-sektion med 110 px luft, centrerad h2 38 px 500 "Din elektriker för hela hemmet" och en dämpad
lead. Tre 404×404-kort (radie 20) med foton (upplyst hus, laddare på träpanel, hus med solceller) under
en mörk radial-overlay, vit korttitel 30 px 700 och en sky-blue pill "Läs mer →" med svart text. Mobil:
64 px luft, h2 28 px, korten staplade 342×342. Hover: kortet lyfter 4 px, fotot zoomar 1.08, overlayen
djupnar, pillen lyfter och pilen glider.

## Tokens (mätt) — avvikelser mot live-ampy-se markerade

| Roll | 1440 | 390 | Källa | Mot ap*-tokens |
|---|---|---|---|---|
| body | 19 px / 400 / lh 1.6, `#0f123c` | 16,6 px | `clamp(1.6rem,1.5rem+.4vw,1.9rem)` | störst i biblioteket; live body 16→14,1 `#363636` |
| h2 | 38 px / 500 / lh 1.2 / ls −.01em | 28 px | `clamp(2.8rem,2.3rem+1.1vw,3.8rem)` | ≈ `--aptext-2-5xl` (40→28,9) men egen formel |
| lead | 18,5 px / 300 / lh 1.5, `#565e82` | 17,2 px | `clamp(1.7rem,1.62rem+.25vw,1.85rem)` "= --aptext-m" | `--aptext-m` är 18→16,1 — nej |
| korttitel | 30 px / 700 / lh 1.05 / ls −.022em | 20 px | `clamp(2rem,1.5rem+1.1vw,3rem)` | – |
| pill | 16 px / 700 / ls .01em, padding 15×32, pill 999rem, `#5eb1bf` → hover `#74c2ce`, text `#1e1e1e` | 14,2 px, 14×28 | – | färg saknar token; radie = `--apradius-full` |
| kort | 404², radie 20, navy, skugga `0 16px 40px −12px rgba(9,11,50,.28), 0 4px 10px −4px .18` | 342² | – | radie = `--apradius-l` @1440 (fast 20, live 16,3 @390) |
| section | 110 / 64 padding-block, wrap 1320 padding 24 | | clamp | 1320 ≠ 1280 |
| avstånd | h2→lead 24, head→grid 64/48, gap 30/24 | | lokal 8-skala | ≠ `--apspace-*` |
| rörelse | 280 ms `cubic-bezier(.2,.6,.2,1)`, foto 640 ms `(.16,1,.3,1)`, inträde 520 ms stagger | | – | – |

Färger: `#090b32`, `#00a991`, `#39c281`, `#f5f9ff`, `#1e1e1e`, vit (ap-matchade, lokalt omdöpta);
utanför: `#5eb1bf`, `#74c2ce`, `#0f123c`, `#565e82`, fem aurora-navyer (`#0d1350 #06082a #0d1145 #0b0e38 #05061f`).

## Komponenter

| Komponent | En rad |
|---|---|
| Fotokort (`.pcard`) | 1:1, radie 20, navy + bg-image + aurora-fallback, overlay radial `.30→.56`, body-scrim ellips `.60→0`, hela kortet länk |
| Titel + pill | 30/700 vit m. text-shadow; pill sky-blue 16/700 med pil 17 px, glow `rgba(94,177,191,.55)` |
| Hover-rörelse | lyft −4 px 280 ms, foto 1.08 640 ms, overlay 420 ms, titel −2 px, pill −2 px + pil +3 px, bg → `#74c2ce` |
| Inträde | `amp3-rise` 520 ms, stagger 50–360 ms |

Varianter: **prototype.html (ljus glas-trio)** — mörk hero ovanför, sektion med teal eyebrow-linje, h2 44/800,
tre vita kort 368×301 radie 22 padding 36, 4 px teal topplinje vid hover, glyph 64 radie 14 teal-tint,
titel 28/700, desc 16/400, länk 16/600; **masterpiece.html** (asymmetriskt); **evify-clone.html** (1:1-referens).

## Hantverk att bevara

- Aurora-fallbacken (saknat foto → on-brand gradient, aldrig trasig bild) och body-scrimen som garanterar
  AA för vit titel över vilket foto som helst.
- Hover-koreografin i tre hastigheter (kort/foto/overlay) med egna easings.
- Print-läge (ren lista), forced-colors, aspect-ratio-fallback, safe-area, reduced-motion.

## Defekter

1. Sjunde tokennamnrummet (`--ap-navy`, `--ap-blue`, `--ink`, `--s-*`, `--r-*`, `--fs-*`) trots kommentaren
   "values match ampy-design-system/reference/tokens.css".
2. CTA-färgen: README säger teal `#00a991→#1cc4af`, koden säger `#5eb1bf→#74c2ce` ("owner-picked sky-blue") —
   dokument och kod motsäger varandra; färgen saknar ap-token.
3. Egen typskala (body 19!) och egen 8-bas-spacing; container 1320.
4. Fem aurora-navyer och ink-skalan utan tokens; ännu en skugg-stil.
5. Lead-siffran "över 3000 installationer per år" utan `[FACT]`-källa; README-copy ≠ index-copy; URL-GAP
   `/laddboxar/` vs `/laddbox/`.

## Skiljer sig från andra block

Det enda blocket med foto-som-bakgrundslager och Evify-låst geometri; den enda sky-blue pillen (alla andra
CTA:er är gradient eller solid teal).
