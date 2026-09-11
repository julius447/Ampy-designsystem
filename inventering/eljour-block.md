# eljour-block — "Är något fel med elen?" (symptomblock med samtalskort)

**Vad:** toppblocket på alla eljour-landningssidor. Besökaren trycker på symptomet → ärlig riskförklaring → samtal till
jouren. Ingen form. Ren HTML/CSS/JS, 13 symptom i två nivåer (Akut/Varning), 7 synliga + "Se fler tecken (6)".
**Status:** "sajtens bästa block 23/25", v3 produktionsblock, ägargrindad före go-live. Auktoritet 1.
**Mätning:** `inventering/_probes/eljour-block.mjs` (första akut-raden expanderad) → `_probes/out/eljour-block.json`. Datablad: `eljour-block.json`.

| Desktop 1440 | Mobil 390 |
|---|---|
| ![](skarmdumpar/eljour-block-desktop.png) | ![](skarmdumpar/eljour-block-mobile.png) |

## Det viktigaste i tokens
- **Egen namnrymd** (`--bg`, `--ink`, `--teal`, `--akut-*`, `--varn-*`, `--cta-grad`, `--r`, `--m`) med literaler; ap*-tokens
  refereras aldrig. Träffar mot paletten: `--bg` #f5f9ff = `--apsky-mist`, `--surface` #fff, `--ink` #090b32 = `--apmidnight-blue`,
  `--teal` #00a991 = `--apteal-core`, pulsen #55ff9a = `--apneon-mint`.
- **Utanför tokens:** brödtext `#3b3f59` (94 användningar), soft `#5f6480`, linje `#e6ecf6`, teal-pill `#0a6e58`/tint `#e3f6f1`,
  Akut `#fdeceb/#b3261e/#e24b4a/#f0b9b3`, Varning `#fff4e0/#8a5800/#e3a008`, **CTA-gradient 146° `#055a4b → #08735f → #0a8169`**
  (mörk teal, inte sajtens neonmint-CTA), skuggor `rgba(9,11,50,.07)` och `rgba(4,110,90,.32)`.
- **Typografi (Outfit):** H2 `clamp(2.6rem, 3.3vw, 3.6rem)` = **36/500 lh 1.15 ls −0,015 em** (26 @390), centrerad, max 30ch,
  delad i två radspann; symptomrad `clamp(1.7rem,1.9vw,1.9rem)` = 19/500 (17); risktext 17/400 lh 1.6 max 62ch; trust 15/400
  lh 1.4; lead 15,5/400 lh 1.5; tagg 12/600; statuspill 13/600; not 13/400 lh 1.55; CTA `clamp(1.5rem,1.4vw,1.75rem)` = 17,5/600
  lh 1.1 (15 @390).
- **Spacing (literal):** sektion `clamp(2.8rem,5vw,6.4rem) clamp(1.6rem,4vw,4rem)` = 64/40 (28/16); rubrik mb 36 (24);
  grid 4fr/6fr = 496 | 744, col-gap 40; kort padding 28 (20), inre gap 16; rad 22/26 → 68 hög (18/18 → 60); panel 4/26/26 gap 14;
  trust 18 + 16; CTA 15/20, min-h 58; tagg 4,5/11; "Se fler" 18/16 → 55.
- **Radier:** kort/lista 20 (`--r-l` 2rem, statiskt), CTA 14 (`--r`), säkerhetsruta 10 (`--r-s`), pillar 99rem. **Skuggor:**
  kort `0 1rem 3rem rgba(9,11,50,.07)`; CTA `0 1rem 2.4rem rgba(4,110,90,.32)` + inset highlight. **Rörelse:** `--m` .3s ease
  (grid-rows-ackordeon, chevron 180°, bakgrund), pulser 2 s ease-out, reduced-motion släcker allt.
- **Container:** 1280 (`--eb-max`, = Hero-2). Sektionen transparent på `--bg`.

## Komponenter
- **Delad rubrik** — fråga + instruktion i en h2, 36/500, centrerad.
- **Samtalskort** (4fr) — vitt kort radie 20 + ram + skugga; statuspill → lead → trust-lista (4 teal-ikoner mellan 1 px-linjer) → CTA. **Inte sticky** (ingen `position:sticky` i koden).
- **Statuspill "Jour öppen just nu"** — #e3f6f1 / #0a6e58 13/600, teal puls 9 px.
- **CTA "Ring eljouren 010-265 79 79"** — full bredd 58 hög, radie 14, mörkgrön gradient, vit ram .12, inset-highlight, telefonikon 24; mobil: neonmint-puls på nederkanten.
- **Elsäkerhetsverket-stat** — 13/400 #5f6480 med fet "1 800 elrelaterade bränder" + källa; två DOM-kopior (desktop/mobil).
- **Symptomlista** (6fr) — vitt kort, 13 rader (7 + "Se fler"), prick 10 + etikett 19/500 + tagg-pill + chevron 22; hover #fafcff, öppen #fbfdff.
- **Nivåprick + tagg** — Akut röd / Varning amber.
- **Symptompanel** — risktext 17/400 lh 1.6 (fet kärna), röd säkerhetsruta med 112/1177-länkar, in-panel CTA max 340; `inert` när stängd.
- **"Se fler tecken (6)"** — 55 hög, 15/600 #0a6e58.

## Det som gör blocket bra (bevara)
- Två-nivå-kalibreringen (Akut/Varning) som ärlig triage; varje panel slutar i samtalet, 112/1177 före oss.
- Samtalskortets ordning: status → löfte → fyra konkreta trust-punkter → CTA; grundningsnoten med källa direkt under.
- Grid-rows-ackordeon (0fr→1fr) + inert på stängda paneler + fokusringar på allt — a11y som del av designen.
- Mobil-only puls på CTA (medvetet borttagen på desktop där den skulle dubbleras).
- Längdkontroll med "Se fler (N)" på båda viewports; en öppen panel åt gången.

## Defekter
Se JSON. Viktigast: helt egen tokenrymd (15 av 20 färger utanför ap*), en tredje CTA-stil (mörk teal-gradient), egna
semantiska nivåfärger utan token, radier 14/10 utanför skalan, tredje brödtextbläck (#3b3f59), Google Fonts i preview,
candour-flaggan för "Se fler"-ordningen och "Jour öppen just nu".

## Vad som skiljer sig från andra block
- **H2:** 36/500 lh 1.15 ls −0,015 em — samma 36 px som testimonials/certificates/ROT-GT men **vikt 500** (mot 400/450) och tätare lh.
- **CTA:** den enda källan med mörkgrön gradientknapp (#055a4b→#0a8169) och vit text — ROT-GT-familjen/hero_2 kör neonmint→#5eb1bf
  med mörk text, ROT-live en pastellknapp. Tre primära CTA-språk i tre block.
- **Semantiska färger:** enda blocket med röd/amber-nivåer (Akut/Varning) — paletten saknar helt varningsfärger.
- **Brödtextbläck:** #3b3f59 (nytt) bredvid #333 (ROT-GT-familj), #363636 (live), #0f123c (ROT-GT-wrapper), navy (testimonials).
