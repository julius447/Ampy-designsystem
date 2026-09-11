# visste-du-att — "Visste du att…"-blocket (mörkt redaktionellt kort)

**Vad:** det ljusa, inbjudande faktakortet: midnight-kort med teal-kicker + blixt, ACF-rubrik, kort brödtext och en glödlampa
med Ampy-blixten som filament. Levererat som Bricks paste-JSON (`visste-du-att.bricks.json`, byggd av `build-bricks.js`) +
token-bunden CSS (`visste-du-att.css`). Lokal mapp utan git. Auktoritet 2 (slutaudit GO, ägar-items kvar).
**Mätning:** `inventering/_probes/visste-du-att.mjs` → `_probes/out/visste-du-att.json` — mätt två gånger: prototypen som
den är, och med live `global-variables.css` injicerad sist (produktionens tokenvärden). Datablad: `visste-du-att.json`.

| Prototyp 1440 (speglade tokens) | Prototyp 390 |
|---|---|
| ![](skarmdumpar/visste-du-att-desktop.png) | ![](skarmdumpar/visste-du-att-mobile.png) |

Med produktionens tokens: `visste-du-att-prodtokens-desktop.png` / `-mobile.png` (H2 36 i stället för 48).

## Det viktigaste i tokens
- **Ett av få block som binder direkt till ap*:** bakgrund `--apsky-mist`, kort `--apmidnight-blue`, text `--appure-white`,
  kicker `--apteal-core`, radie `--apradius-l`, spacing `--apspace-2xl/-xl/-l/-m/-s`, text `--aptext-l/-2xl/-m`, max-width
  `--apmax-screen-width`. Egna värden: skugga `0 1.2rem 4rem rgba(9,11,50,.18)`, brödtext `rgba(255,255,255,.82)`, glow
  `radial-gradient(58% 70% at 88% 18%, rgba(0,169,145,.42)…) + radial(46% 56% at 96% 4%, rgba(85,255,154,.18)…)`.
- **Tokendrift (den viktigaste mätningen):** prototypens `:root` speglar **theme-style.css-skalan** (`--aptext-2xl 2.2→4.8rem`,
  `--aptext-l 1.8→2.8`, `--aptext-m 1.7→1.8`), inte den skala som vinner på live. Uppmätt @1440: **H2 48 px i prototypen, 36 px med
  produktionens tokens**; kicker 28 → 24; radie 19,76 → 20. @390: H2 23,9 → 26,8; text 17,1 → 16,1. Det godkända utseendet
  renderas alltså inte i Bricks.
- **Typografi (produktion):** kicker `--aptext-l` 24/500 lh 1.2 teal (16,1 @390 via `--aptext-m`); H2 `--aptext-2xl` **36/500
  lh 1.2** vit balance (26,8); brödtext `--aptext-m` 18/300 lh 1.5 .82 max 54ch (16,1).
- **Spacing (produktion):** sektion 79,2/39,6 (21,5/13,3 ≤480), kort padding 79,2 (21,5), grid `1fr | clamp(16rem,22vw,26rem)` = 782 | 260
  gap 79,2; mobil stack med lampa överst, gap 16,9; innehållsgap `--apspace-s` 19,8 (13,3). Lampa 240 → 120 → 96 px.
- **Rörelse:** enter-view fade .3s (IntersectionObserver, runOnce), lampa +.08 s; reduced-motion släcker. Ingen font laddad i prototypen.

## Komponenter
- **Mörkt kort** — 1280, radie 20, padding 79, radial brand-glow uppe-höger (mobil: topp-centrerad), text | lampa.
- **Kicker med blixt** — "Visste du att…" 24/500 teal + 18 px solid blixt.
- **H2 + brödtext (ACF)** — 36/500 vit + 18/300 .82.
- **Lampa** — prototyp: inline-SVG (glas crystal-blue→neonmint→teal, navy filament, halo); produktion: Group-1592-1.png i normalt flöde.

## Det som gör blocket bra (bevara)
- Direktbindning till produktionstokens — inget parallellt tokensystem, bara två egna värden (skugga, alfa-vit).
- Glow som ytbehandling, inte en andra device; blixten som filament = varumärkesmotiv utan ny ikon.
- Grid/stack utan absolut positionering (den gamla swing-animationen och positioneringen bortstädade); ACF-drivet innehåll; färska global-class-ID:n.
- Registret: lätt och inbjudande, inte allvarligt (CLAUDE.md-regel 6).

## Defekter
Se JSON. Viktigast: **speglade tokens från fel skala (theme-style) → H2 48 i prototypen mot 36 i produktion**; ingen Outfit i prototypen;
egen skugga; eyebrow via `--aptext-l` (24 px) utan egen roll; sockelfärger literaler; ägar-items (webp, `_cssCustom`, ACF) öppna.

## Vad som skiljer sig från andra block
- **Mörk yta = `--apmidnight-blue` rakt av** (#090b32) — till skillnad från ROT-GT-panelens rgb(27,29,75), testimonials #0b0f30→#2d516d
  och certificates navy→#5eb1bf: fjärde mörka ytan, men den enda som är tokenens egen färg.
- **H2 36/500** (produktion) — samma 36 som testimonials/certificates/ROT-GT men vikt 500 (som eljour-block); i prototypen 48 (= theme-style `--aptext-2xl`).
- **Enda källan där mätningen visar att previewen och produktionen ger olika pixlar av samma CSS** — beviset på att två `--aptext-*`-skalor lever i kaskaden.
- **Eyebrow-rollen:** här 24 px teal `--aptext-l`; ROT-GT-familjen 13/700 versal; fotobedömningen 15/600 — tre eyebrow-system.
