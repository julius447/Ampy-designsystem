# hero-2-alternatives — herosystemet S/G/Z/E v18 för tjänstesidor (auktoritet 2)

**Vad:** Ersättaren för dagens Hero_2 (identisk på 260 sidor): en hjälte per intent — HERO-S (tjänst, 22 sidor),
HERO-G (ortsida laddbox, 168), HERO-Z (elektriker i ort, formkort), HERO-E (eljour, 57). Levereras som
FluentSnippets i `dist/` (primitiver + en CSS/JS/PHP per hjälte + router) och Bricks-JSON. **Status:**
slutversion v18, lanseringsgrindar öppna (webhook `null`, `#5eb1bf` GAP 21, laddbox-pris, öppettider).
**Auktoritet:** 2.

Renderat: `preview/scen-{s,g,z,e}-1440.html` (riktiga shortcodes, vendorad header som QA-kontext) vid
1440 och 390 (samma fil; `scen-*-390` skiljer bara i ett data-attribut). Mätt per hjälte + Z:s formkort.

![S 1440](skarmdumpar/hero-2-alternatives-s-desktop.png)
![Z 390](skarmdumpar/hero-2-alternatives-z-mobile.png)
(Alla åtta: `hero-2-alternatives-{s,g,z,e}-{desktop,mobile}.png`.)

## Vad jag ser

Alla fyra delar ram (navy, radie 22, 1424 bred, 683 hög @1440; mobil 374×754 radie 18), breadcrumb-rad,
h1 48 px 700 vit, lead 20 px, proof-rad (G 5,0 guldstjärnor | Över 3 000 installationer). S: kvadratisk
elcentralsbild till höger med lätt scrim, grön rådgivnings-CTA. G: fullbredds-foto (stenvägg + laddbox) med
scrim, CTA + ghost-pill "Våra laddboxar". Z: ljusare navy med vågor, blå ring-CTA, och ett mörkt formkort
450×613 med fem vita fält och gradient-submit. E: navy, ring-CTA "Ring eljouren" + vit sekundärknapp, foto
med asymmetrisk radie 72/28, proof-raden får ett tredje segment "Målsättning: på plats inom en timme".
Mobil: allt staplas i kortet; Z:s formkort hamnar under texten (sidhöjd 1520).

## Systemet i primitiverna (det viktigaste)

`dist/ampy-hero-primitives.css` är ett eget mini-designsystem, tokens på wrappern (aldrig `:root`), px
(aldrig rem), `@container` (aldrig `@media`):

| Lager | Värden (mätt/lästa) | Mot ap*-tokens |
|---|---|---|
| ytor | `--ap-navy #090b32`, `--ap-navy-soft #17204a`, `--ap-mist #f5f9ff`, vit | navy = midnight ✔, soft saknas |
| handling | `--ap-teal #00a991`, `--ap-teal-dark #0a8f7c`, `--ap-mint #55ff9a`, `--ap-emerald #39c281` (oanvänd), **`--ap-grad-action` 120° #55ff9a→#5eb1bf** | #5eb1bf/#0a8f7c saknas |
| ink på navy | `#dbe3ec / #c9d4e0 / #aeb9c6 / #8a97a6`, hairline `rgba(255,255,255,.14)`, error `#e5484d` | ingen ap-motsvarighet |
| typskala | h1 **34 / 40 / 48 · 700 · 1.07 · −.008em**, lead **16/25 · 17/27 · 20/32 · 400** — identisk i alla fyra (mätt 48/34, 20/16) | ≠ `--aptext-*` (48 ≈ `-3xl` @1440 men clamp-kurvan annan) |
| radier | card 20 (= `--apradius-l`), field 12, btn 14, pill 999 | men CTA:erna är 16, Z-input 10, Z-kort 16.3/20, E-foto 72/28 |
| höjder | field 56 → 52 ≥768, btn 56 → 52; bibliotekets CTA 58 | – |
| rörelse | `--ap-motion .18s` (tak 300 ms) | – |
| scrim | `--ampy-scrim-bastant` (180° .58→.60→.82 + 98° .28→.05, kontrastmätt) / `-latt` (.06→.22) | enda tokeniserade overlayen i biblioteket |
| knappar | `ampy-btn` (17/600, radie 14) · `--mint` · `--emergency` (146° #055a4b→#0a8169, hover ljusnar inte) · `--ghost` · `link-quiet` · `hgf-call` · **btn-ring / btn-radgivning verbatim ur CTA-website** | – |
| fält | `ampy-field`: 14/600-label, input 16 px navy på vit, 1 px kant, focus 2 px teal + ring .18 utan hopp, invalid 1.5 px röd; `+46`-prefix; kvitto-chip | – |
| proof | `ampy-grow` = Hero-1 verbatim men **alla stjärnor guld #FBBC04** (V7-direktiv) | – |
| breadcrumb | 13/500/18 `--ap-ink-soft`, "›" 8 px, topp 20/40/48 | – |

Z:s formkort (V18, riktning C): yta `#16183f` + 160° ljusdager + 1 px vit .14 + skugga `0 28px 60px −28px
rgba(0,0,0,.65)`, padding 20; titel 24/700, subtitle 14/400 .82, label 13/400 vit (asterisk vit), input 44 h
radie 10 vit `#333` 16 px, focus `0 0 0 3px rgba(0,169,145,.55)`, fel `0 0 0 2px #e24b4a` + `#ffb4b6`,
submit 48–52 h 19/600 `#1e1e1e` på handlingsgradienten radie 16, consent 12 px centrerad med vit länk.
Z-ytan är `#1b1d4b` — en egen navy.

## Komponenter

| Komponent | En rad |
|---|---|
| HERO-S | navy ram; text vänster (crumbs 48/32/0/48, h1, lead, CTA naturlig bredd, proof), bild 619² höger med `scrim--latt`; mobil bild bakom med `scrim--bastant`, 0 24 + 7vh |
| HERO-G | foto fullbredd + scrim, inner 1280 (48/28); CTA + sekundär ghost-pill 999 (13/32, mobil bg vit .06); mobil 20/24 |
| HERO-Z | Z-navy + tre vågor, 40/48/22; ring-CTA; formkort 450 max, min-h 600, fem fält i en kolumn, submit, consent |
| HERO-E | navy, 48/32/56/48; ring-CTA 288×58 + vit sekundär 236×58 radie 16; foto 460×528 radie 72/28; proof + "Målsättning"-segment; mobil sky-mist-yta 12/8 runt kortet |
| Primitiver | h1/lead/btn×4/CTA-kloner/link-quiet/hgf-call/field/chip/trustrow/grow/crumbs/scrim |

## Hantverk att bevara

- Disciplinen: en typskala, en gradient, tokens på wrappern, `@container`, förbud mot lokala typöverrider —
  och allt är dokumenterat i CSS-kommentarerna med ägarbeslut och datum.
- Kontrastmätta scrims som token-pekare (löser "vit text på vit bild" för alla ACF-bilder).
- Fältspråket: fokus utan hopp, ≥16 px mot iOS-zoom, ingen asterisk, hjälptext som förklarar varför,
  honeypot som aldrig är `display:none`, consent före klick.
- Nödknappen som medvetet inte ljusnar vid hover (4,5:1).

## Defekter

1. Fjärde–sjätte tokennamnrummet (`--ap-*` på wrappern, Z-kortets `.aof`-arv `--mid/--sea/--neon1`, E:s
   `--ehe-*/--akut-*/--varn-*`) — samma teal/mint/navy under nya namn igen.
2. Tre navyer (#090b32, #1b1d4b, #16183f) + `--ap-navy-soft #17204a`.
3. Radie-tokens (14/12/20) motsägs av det som används (16/10/16.3→20/72–28).
4. Gulda stjärnor (V7) mot Hero-1:s vita — två godkända källor säger olika.
5. Submit i Z (19/600/52 h, #1e1e1e) ≠ bibliotekets CTA (16/500/58 h, hsl-navy) trots "bibliotekets gradient".
6. `#5eb1bf` legacy-listad men i handlingsgradienten; `#00ffda`, `--ap-emerald` döda; två röda (#e5484d/#e24b4a).
7. Hero-ram 1424/h1 48 vs Hero-1 1700/h1 60 — två hero-ramar med olika skala på samma sajt.
8. Grindar: webhook null, pris 4 190 vs "från ca 5 000", "Vardagar 07-17", recensionsantal.

## Skiljer sig från andra block

Enda källan som formulerar ett systemlager (primitiver) och enda med `@container`-responsivitet. Enda
förekomsten av ghost-pill (G), vit sekundärknapp (E) och mörkgrön nödknapp.
