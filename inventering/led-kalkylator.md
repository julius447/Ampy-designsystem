# LED-kalkylatorn (`led-kalkylator`)

**Vad:** Tvåpanels-kalkylatorn "Vad sparar du på att byta till LED?" — ljust inputkort (segmented control, selector med ikon, två egna sliders med tick-etiketter, native select, info-chips) till vänster, mörkt midnattskort med hjältesiffra, stat-trio, före/efter-staplar och CTA till höger, plus ett separat "Så har vi räknat"-kort.
**Status:** live, en signering kvar. **Auktoritet: 1.** Ingång `kallor/Led-kalkylator/index.html` + `styles.css` (434 rader, BEM `ampy-calc__*`). CSS-huvudet säger själv: "matches Ampy's battery calculator, same design system" — det här är kitets mest kompletta och renaste instans.
**Mätning:** `inventering/_probes/led-kalkylator.config.json` → `led-kalkylator.measure.json` (getComputedStyle 1440 + 390, sex states), källcensus `_probes/census-led.json`. Data i `led-kalkylator.json`.

![desktop](skarmdumpar/led-kalkylator-desktop.png)
![mobil](skarmdumpar/led-kalkylator-mobile.png)

Fler states: `-desktop-state-selector.png` (listan öppen), `-desktop-state-leadform.png` / `-leadform-invalid.png` (formuläret utfällt, tomt skickat), `-mobile-state-tooltip.png` (i-chip aktiv + slider-fokusring).

## Tokens: det viktigaste (avvikelser mot live `--ap*` markerade ⚠)

| Roll | Värde i LED | Live-token | Kommentar |
|---|---|---|---|
| Primär accent | `rgb(0,169,145)` | `--apteal-core` | exakt |
| Mörk yta | `rgb(9,11,50)` + två radialglöd (teal .28 / emerald .16) | `--apmidnight-blue` | exakt bas; glöden är alfa-varianter som saknar token |
| Success / "Med LED" | `rgb(57,194,129)` | `--apemerald-flow` | exakt |
| ⚠ Text primär | `rgb(15,18,60)` | — | near-miss av midnight `rgb(9,11,50)`, 114 användningar |
| ⚠ Text sekundär | `rgb(86,94,130)` | — | utanför tokens, 59 användningar |
| ⚠ Sidyta / kort | `rgb(247,249,251)` | — | near-miss av `--apsky-mist rgb(245,249,255)` |
| ⚠ Subtil yta (spår) | `rgb(234,239,243)` | — | utanför tokens |
| ⚠ Amber "I dag" | `rgb(240,175,56)` | — | utanför tokens (kitets varningsfärg) |
| ⚠ Sekundär accent | `rgb(28,196,175)` | — | bara i lead-formulärets fokus/bock |
| ⚠ Kant | `rgba(15,18,60,.12)` | — | utanför tokens |
| Vit-på-mörkt | `.94 / .66 / .55 / .28 / .14 / .06 / .05` av vit | — | sju alfa-steg utan token |
| Typsnitt | **Plus Jakarta Sans** (rubrik/UI/siffror) + **Outfit** (brödtext) + **JetBrains Mono** (inputsiffror) | Outfit | ⚠ tre familjer, Google Fonts laddas två gånger |
| Typskala | egna `--fs-xs…4xl`, äkta vw-lutning: 13/15/19/24/28/34/44/56 px @1440, 12/13/16/18/21/24/29/38 @390 | `--aptext-*` | ⚠ ingen storlek matchar `--aptext-*` exakt (h1 34 vs 36, hjälte 56 vs 60) |
| Spacing | fast: 5 / 7.5 / 10 / 15 / 20 / 30 / 40 px | `--apspace-*` (fluid) | ⚠ ingen matchar |
| Radier | 6 / 12 / 20 / full (+4 på checkbox) | `--apradius-s/m/l/full/xs` | matchar bara i ena änden av clamp (6 = s@mobil, 12 = m@desktop, 20 = l@desktop) |
| Skuggor | `0 1px 2px / 0 4px 12px / 0 16px 40px rgba(15,18,60, .06/.08/.14)` | `--apshadow-*` | ⚠ egna; live-tokens är trasiga (odefinierad `--shadow-primary`) |
| Container | 1280px | `--container-width 1280px` | exakt |
| Rörelse | 150 / 300 ms, `cubic-bezier(.2,0,.2,1)`, reveal-stagger 40→260 ms | — | kitets egna |

## Komponentlista (en rad per komponent, mått @1440 | @390)

- **card-input** — vitt kort, 1px kant, radius 20, padding 20 | 15, gap 15, shadow-sm. 512×848 | 370×806.
- **card-surface** — midnatt + radialglöd, radius 20, padding 40 | 20/15, gap 30 | 20, shadow-lg. 717×589 | 370×634.
- **tier / tier-label** — versal Outfit 600 15px ls .08em; andra tiern får 1px avdelare med 15+15 luft.
- **field-label-tiny / field-label / field-hint** — Outfit 500 13 sekundär / PJS 600 15 primär / Outfit 13 sekundär; fält-gap 5 (prominent 7.5).
- **tip + tooltip** — 16px cirkel (PJS 700 10px), hover = teal bg; tooltip fixed midnatt 13px/1.45, padding 7.5 10, radius 6, max 280px.
- **segmented** — spår 48px (bg `rgb(234,239,243)`, radius 12, padding 4, gap 4), options 40px PJS 600 15 radius 6; aktiv = vit pill + shadow-sm + teal text.
- **selector** — 78px knapp (ikonruta 56 radius 6, PJS 600 19 namn + Outfit 13 meta, chevron 20); lista radius 12, shadow-lg, max-height min(44rem,60vh), versala gruppetiketter, 37.5px options, mono-meta höger.
- **value-prominent + unit** — JetBrains Mono 700 28 (sm 19) tnum, enhet Outfit 500 15 sekundär, baseline-gap 6.
- **slider** — 44px träffyta, spår 6px inset 12, fill teal→emerald, thumb 24 med 3px teal kant + shadow-md, tick-knappar 32px mono 13 (aktiv teal 700); 300 ms transitions, avstängda under drag.
- **select** — 48px, radius 12, Outfit 15.
- **hero** — eyebrow PJS 600 15 versal (.66) → siffra PJS 700 56 | 38 lh 1.0 ls −.03em + enhet PJS 500 28 | 21 (.66) → sub Outfit 15 (.66); gap 7.5.
- **trio** — 3 kolumner (column-gap 15, row-gap 2), label Outfit 600 13 versal, värde PJS 700 28 + enhet Outfit 500 15, sub Outfit 13 (.55); ≤560 staplas med 10px.
- **internal-divider** — 1px `rgba(255,255,255,.14)`.
- **compare** (signaturen) — key 60px Outfit 600 13 (amber/emerald), spår 24px `rgba(255,255,255,.06)` full radie, bar min 16, belopp mono 600 15 min-width 90, caption 13 med vit strong.
- **btn--primary (--lg --block)** — PJS 600 15, min-height 50 (bas 48), radius 12, teal bg, shadow-md, ikon 18; hover opacity .92, active .82 + 1px ner, fokus ring 4px teal .35.
- **lead-form** — ersätter CTA:n vid klick: intro (.66) → 2-kol grid ≥600 (etikett Outfit 500 13, input 48px radius 12 bg vit .05 kant .28) → honeypot → ritad checkbox 18 (bock via clip-path i `rgb(28,196,175)`) → submit 48 → finstilt (.55) med "Avbryt" → msg ok/err.
- **methodology** — eget vitt kort radius 12 padding 10 15, summary PJS 600 19 med ▾, items (h3 PJS 600 15 / code mono 600 13 på subtil bg / p Outfit 13), disclaimers avdelade med 1px.
- **Oanvänt arv** — toggle, stepper, badge, streams-bar, field--solar, `--chart-stream-3/4` finns i CSS men inte i markup.

## Det som gör blocket bra (bevara)

1. Kortlogiken: ljust input 5fr / mörkt resultat 7fr, reveal-staggat, glöd som ger djup utan bild.
2. Enhets-typografin (stor siffra + baseline-satt dämpad enhet) används konsekvent i tre nivåer: input-värde, hjälte, trio.
3. Slidern är den bästa i kitet: 44px träffyta, tick-etiketter som knappar, 1:1-följning under drag, fokusring på thumb.
4. Segmented "sunk track / raised pill" — samma anatomi i alla fyra kalkylatorer.
5. Före/efter-staplarna gör matematiken synlig (kostnadsskillnad = besparing) utan diagrambibliotek.
6. Värde först: formuläret är stängt tills CTA:n klickas; sr-only-sammanfattning med aria-live; reduced-motion nollställer allt.

## Defekter

1. Tre typsnittsfamiljer mot sajtens Outfit; Google Fonts laddas två gånger (link + @import) trots GDPR-invarianten i Elcentral-kollen.
2. Hjältesiffran/trio-värdena har klassen `ampy-calc__t-mono` men renderas i Plus Jakarta Sans (familjen skrivs över rad 295/305); inputsiffrorna är JetBrains Mono → två sifferstilar.
3. Near-miss-färger: `rgb(15,18,60)` vs midnight, `rgb(247,249,251)` vs sky-mist.
4. Sju olika fokusringar för samma roll.
5. Ogiltigt lead-fält visar teal fokusring och röd kant samtidigt; felmeddelandet ligger under finstilten, inte vid fältet.
6. Tip-knappen 16×16 utan touch-förstoring; tooltipen täcker H1 på 390.
7. Dött arv från batterikalkylatorn (toggle/stepper/badge/streams/chart-tokens).
8. CTA 50px vs lead-submit 48px; metodkortet radius 12 vs korten 20.

## Vad som skiljer sig från andra block

LED är förlagan, men EV och Battery driver: resultatkort-padding 40 (LED) vs 20 (EV/Battery); LED:s typskala har äkta vw-lutning medan EV/Battery har px-buggen som låser skalan nära golvet; teal `rgb(0,169,145)` (LED/Battery) vs mörkad `rgb(0,125,107)` (EV); slider 300 ms (LED) vs 150 ms (EV); selector-ikon 56 vs 48; CTA 50/15px vs 56/17px; LED:s CTA byts ut mot formuläret, EV:s står kvar ovanför. Energycalc och Elkollen/Elcentral tillhör andra familjer (Outfit-only, egna klassnamn).
