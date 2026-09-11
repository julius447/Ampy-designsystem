# Batterikalkylatorn v7 (`battery-calculator`)

**Vad:** Enfils-prototypen "Vad tjänar du på ett solcellsbatteri?" — ursprunget till hela `ampy-calc__*`-kitet (LED:s CSS säger "matches Ampy's battery calculator"). Inventerad **bara som belägg** för de två devices som saknas i LED/EV: **streams-bar** ("Fyra intäktskällor") och **payback-kurvan med break-even-markör**.
**Status:** prototyp, ej live. **Auktoritet: 3** — mönsterbelägg, aldrig kanon. Ingång `kallor/Battery-calculator/index.html` (CSS rad 28–1506 inline, JS rad 1886–3234).
**Mätning:** `_probes/battery-calculator.config.json` → `.measure.json` (inkl. overflow-mätning + SVG-noder), census `_probes/census-battery.json`. Data i `battery-calculator.json`.

![desktop](skarmdumpar/battery-calculator-desktop.png)
![mobil](skarmdumpar/battery-calculator-mobile.png)

## Tokens: det viktigaste

Samma tokenblock som EV (near-miss-navy `rgb(15,18,60)`, `rgb(86,94,130)`, `rgb(247,249,251)`, `rgb(234,239,243)`, kant `.12`, spacing 5/7.5/10/15/20/30, radier 6/12/20, skuggor `rgba(15,18,60,…)`) med tre skillnader: tealen är **inte** mörkad (`rgb(0,169,145)` = `--apteal-core` i knappar), faint är `.42` (LED/EV höjde till `.55`), och typskalan har **samma px-bugg** som EV men vw-baserad (`(100vw−320px)/960` → hjälte 44px i stället för 75).

Chart-paletten (ingen i tokens utom teal/emerald):

| Roll | Värde | Token |
|---|---|---|
| stream-1 Stödtjänster | `rgb(0,169,145)` | `--apteal-core` |
| stream-2 Spotpris-arbitrage | `rgb(57,194,129)` | `--apemerald-flow` |
| stream-3 Effekttoppskapning | `rgb(122,208,198)` | ⚠ egen |
| stream-4 Ökad egenanvändning | `rgb(160,184,196)` | ⚠ egen |
| line-loss / zone-loss | `rgb(240,175,56)` / `.18` | ⚠ amber |
| line-profit / zone-profit | `rgb(0,169,145)` / `.16` | teal + alfa |
| nollinje / be-line | vit `.32` streckad 3,5 / vit `.34` streckad | ⚠ |

## Komponentlista (bara de två devices + avvikelser)

- **streams-bar** — 675×24 | 363×24, radius full, spår vit `.06`, fyra segment med `width ∝ andel` (300 ms); "Se fördelningen" (Outfit 500 12 `.66`) fäller ut legend 1 → 2 kol ≥600: 12px prick + namn Outfit 500 12 + värde mono 600 12 + procent mono 10 `.42`.
- **payback-kurva** — `.ampy-calc__chart` bg `.06` radius 12, aspect 2.5:1 (mobil 1.45:1), min-height 320 | 340; tre remsor: topp 32px (slutvärde mono 700 17 teal/amber, höger) → plot (SVG: streckad nollinje, zone-polygoner, linje amber→teal, start-/slutprick) → axel 44px ("I dag" / "15 år" PJS 500 15 `.66`); **be-marker** = ett HTML-element på `--be-x` (clamp 8–92 %): 12px teal prick på `--be-y-frac`, streckad linje ner, "Återbetald" PJS 500 14 + "2,4 år" PJS 700 15 teal. States `is-loss`, `is-no-payback`, `is-no-be`, `is-be-early`.
- **Kit-avvikelser mot LED/EV** — toggle-option 30px och segment-option 33px höga (ingen min-height 40/44), stepper som pill (knappar 36), e-postrad = input 48 + "Maila kalkylen" outline 48, CTA 56px/17px.

## Det som gör blocket bra (bevara)

1. Chart-arkitekturen med tre kurvfria remsor och ett enda break-even-element — etiketter kan fysiskt inte kollidera med kurvan.
2. Färgsignalen amber→teal vid nollgenomgången med låg-opacitetsfyllningar av samma tokens.
3. Streams-paletten: teal/grön-familj + kall neutral, inga varma toner; legend på begäran.

## Defekter

1. Typskalan låst av px-buggen (hjälte 44px).
2. **Mobil overflow:** inputkortet 394.9px i 390px viewport → horisontell scroll (`overflowX: true`).
3. Faint `.42` (AA-fel som LED/EV rättade); toggle 30px / segment 33px under 44-golvet.
4. All CSS inline (1478 rader) + Google Fonts + tre familjer.

## Vad som skiljer sig från andra block

Ursprunget. LED bytte streams/payback mot före/efter-staplar, rättade skalan, höjde faint; EV mörkade tealen, gick över till cqi (behöll buggen) och bytte kurvan mot månadspanelen. Battery är den enda källan för "revenue streams bar" och "break-even chart" som `ampy-design-system`-skillen refererar till.
