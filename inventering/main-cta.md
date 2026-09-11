# main-cta — CTA-bandet "Prata med en elektriker inom 60 sekunder!" (auktoritet 2, version B låst)

**Vad:** Det primära ring-bandet: vitt kort med gradient-rubrik, brödtext, EN ring-CTA med puls-chip,
Edvin-porträttet och två brand-vågor. Ett konverteringsmål (samtalet), inget formulär, ingen sekundär knapp.
**Status:** version B låst (B1-linjering vald), delivery = scopad px-CSS med `@container`-brytpunkter,
shortcode och Bricks-JSON; öppna punkter: self-host-fonter, bild-URL:er, `[GAP]` 60-sekunderslöftet.
**Auktoritet:** 2.

Renderat: `index.html` + `delivery/preview.html` (identisk höjd). Mätt: `_probes/out/a1-main-cta.json`.

![1440](skarmdumpar/main-cta-desktop.png)
![390](skarmdumpar/main-cta-mobile.png)

## Vad jag ser

Desktop: sky-mist-sektion, vitt kort 1280×458 (radie 20, diffus grå skugga). Vänster: h2 40 px Outfit 500
midnight med "inom 60 sekunder!" i teal→blå gradient (radbryt efter "60" ≥1300), brödtext 18 px 300, blå
ring-CTA 228×58 med vit chip. Höger: Edvins porträtt 320×366 (radie 20, ljus kant, mjuk skugga) med en
ljusblå våg som klipper in nere till höger; en större våg-siluett bakom. Mobil: bild överst (292 px),
rubrik 24 px centrerad, brödtext 16 px, CTA 100 % med chippen till höger.

## Tokens (mätt) — avvikelser mot live-ampy-se markerade

| Roll | 1440 | 390 | Källa | Mot ap*-tokens |
|---|---|---|---|---|
| h2 | 40 px / 500 / lh 1.1 / ls −.4 px, `#090c34` | 24 px / lh 1.16 | `clamp(2.8rem,1.25vw+2.4rem,4rem)` | ≈ `--aptext-2-5xl` (40 → 28,9) men egen formel; färg ≠ `--apmidnight-blue` (#090b32) |
| gradient-span | `hsl(171 95% 41%) 15% → hsl(189 43% 56%) 85%` | – | `.grad` | inga ap-tokens (= Bricks `--color-10` → `--color-7`) |
| brödtext | 18 px / 300 / lh 1.6, `#363636`, 52ch | 16,1 px | `clamp(1.6rem,.21vw+1.53rem,1.8rem)` | = `--aptext-m`:s exakta formel, återuppfunnen lokalt |
| CTA | 16 px / 500, 58 h, radie 16, padding 11/30/11/12 | 100 %, chip höger | = CTA-website `btn-ring` | ingen token |
| kort | padding 46 × 65 (clamp), gap 43, radie 20 | 20/20/28, radie 16 | `clamp(…)` + lokal `--radius-l` | radie-clamp ≠ `--apradius-l`-formeln (samma @1440) |
| section | 56 × 40 | 28 × 16 | `clamp(28px,4vw,56px) clamp(16px,3vw,40px)` | ≠ `--apspace-*` |
| foto | 320×366, radie 20, `0 18px 40px −20px rgba(9,11,50,.26)` + 1 px vit .55 | 292×335 | px/aspect | – |
| kortskugga | `0 0 16px rgba(190,190,190,.4)` | | rå | live-idiomet, otokeniserat |

Färger: `#f5f9ff` (= sky-mist), `#b6f2ff` (= crystal-blue, ring-start), vit; utanför tokens: `hsl(237 69% 12%)`,
`hsl(171 95% 41%)`, `hsl(171 100% 33%)` (oanvänd), `hsl(189 43% 56%)` = #5eb1bf, `#363636`,
`hsl(237 35% 24%)`, `rgba(94,177,191,α)`.

## Komponenter

| Komponent | En rad |
|---|---|
| CTA-band | sky-mist > vitt kort 1280 radie 20 > grid 1fr/400: text-stack (gap 16, CTA +12) + porträtt-figur; bg-våg 44 % nere-höger |
| Gradient-rubrik | span med `background-clip:text`, `box-decoration-break:clone`; fallbacks för @supports, forced-colors, print |
| Ring-CTA | = CTA-website btn-ring; mobil `row-reverse` fullbredd (lokal reimplementation av `--block`) |
| Porträtt-figur | 80 % av 400-kolumn, aspect 320/366, `object-position 50% 46%`, ljusring + fallskugga, overlay-våg 50 % |

## Hantverk att bevara

- Ett mål: betygsraden togs bort för att den konkurrerade — blocket har en enda interaktiv yta.
- Porträttets ljusring (border, inte inset-skugga, för `<img>`) + riktad midnattsskugga med negativ spread.
- Forcerad radbrytning bara där kolumnen rymmer rad 1 (≥1300) — verifierad mot orphan.
- Fallback-stacken för gradient-text (no-support, forced-colors, print) är den mest kompletta i biblioteket.
- Leveransen bryter mot egen container-bredd (`@container`), inte viewport — rätt för Bricks-kolumner.

## Defekter

1. Färgtokens i hsl som nästan är ap-färger (#090c34 ≠ #090b32; teal-bright ≠ teal-core) — blocket ärver
   Bricks-paletten, inte ap-tokens; `--teal` definierad men oanvänd.
2. Lokala `--radius-l/--radius-m` skuggar live-temats legacy-namn med andra värden.
3. `--aptext-m`-formeln kopierad i stället för refererad; kortskugga och section-padding otokeniserade.
4. "inom 60 sekunder!" = operativt löfte utan verifiering (`[GAP]`); telefonnummer hårdkodat.
5. Gradient-rubrikens kontrast ~2:1 (ägaraccepterad).
6. Hårdkodade font-sökvägar i leveransen; Google Fonts i prototypen.

## Skiljer sig från andra block

Ursprunget till ring-CTA:n och till gradient-span-mönstret (kopierat till Hero 2 och tack-sidan). Enda
blocket med porträttfoto + våg-overlay som bildgrammatik.
