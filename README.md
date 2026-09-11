# Ampy designsystem

Ampys designsystem, mätt ur blockbiblioteket (31 källor: alla byggda block, kalkylatorer, formulär, sidor,
sajtens riktiga CSS och brandboken) och konsoliderat till EN token-sanning. Klon-först: varje värde och
komponent spårar till en källa. Där källorna säger olika står det som drift, och där bara ägaren kan
avgöra står det som ett beslut (B1–B20).

Sajten: https://julius447.github.io/Ampy-designsystem/

| Mapp | Innehåll |
|---|---|
| `site/` | Designsystem-sajten (grunder, komponenter, mönster, regler, blockbiblioteket, beslut, kod) |
| `system/` | `tokens.css` (101 live ap* + 16 nya primitiver + semantiska ampy-*), `base.css`, `components/*.css`, `ikoner.svg`, `fonts/` |
| `konsolidering/` | Färg, typografi, spacing, form/djup/rörelse som tabeller + JSON, komponentkartan, beslut, bevis |
| `inventering/` | En md + json per källa (mätvärden), tidigare dokumentation prövad |
| `tools/` | `shot.mjs`: statisk server + Playwright, desktop 1440 + mobil 390 |

Källrepona klonas till `kallor/` (ignoreras av git): se `INVENTERINGSBRIEF.md`.
