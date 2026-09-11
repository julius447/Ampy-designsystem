# fotobedomningen — Avslutskortet (.afk), Fotobedömningen v2

**Vad:** generiskt fotobedömningsblock som bär hela konverteringen självt: bild + namn + telefon + adress + riktig submit +
kvitto i samma kort. Ersätter v1 (repots rot) helt. Generiskt via tre axlar (tjänst-slug, löftesklass K0–K4, fotoobjekt),
fem placements, ingen tyst fallback. Previewens markup är bytes ur `dist/afk-backend.php`. Auktoritet 2 (byggd, go/no-go =
den dubbla bilduppladdningen).
**Mätning:** `inventering/_probes/fotobedomningen.mjs` → `_probes/out/fotobedomningen.json` (previewens body låst till 390/1280).
Datablad: `fotobedomningen.json`.

| Mobil 390 (tjänstesida elcentral, K1) | Desktop 1280-vy |
|---|---|
| ![](skarmdumpar/fotobedomningen-mobile.png) | ![](skarmdumpar/fotobedomningen-desktopvy-desktop.png) |

Kvittot: `fotobedomningen-kvitto-mobile.png`. Alla vyer: `fotobedomningen-alla-vyer-desktop.png`. v1 (ersatt): `fotobedomningen-v1-desktop.png`.

## Det viktigaste i tokens
- **Två ytor, en gradient:** band `#f5f9ff` (= `--apsky-mist`) och kort `#fff`; submitens `linear-gradient(120deg, #55ff9a, #5eb1bf)`
  (neonmint = `--apneon-mint`, #5eb1bf utanför) är blockets **enda** gradient, skugga och rörelse — samplad ur `ampy-cta-buttons.css`.
- **Ink-trio delad med eljour-block/sticky-bar:** `#090b32` (= `--apmidnight-blue`, 19,00:1), `#3b3f59` (10,29:1), `#5f6480`
  (5,80:1 — både mjuk text OCH kontrollkant). Linje `#e6ecf6` bara dekorativ (1,19:1). Teal `#00a991` (= `--apteal-core`) bara som
  linjeglyf, `#0a8f7c` för meningsbärande glyf (3,58:1 mot tint `#e3f6f1`), fel `#b3261e`/`#fdeceb`, CTA-ink `#282a53`.
- **Typografi (px, ≥15 överallt):** eyebrow 15/600 .02em; H2 **28 → 36 (≥900 cqi)** lh 1.18/1.15 ls −.015em, tvåfärgad (fråga 300
  `#3b3f59` + svar 500 navy); lead 18/300 lh 1.55 (bara desktop); löften 17/400 lh 1.45; noter/etiketter/candour/GDPR 15 (300–600);
  staplar 17/400 (text 500); submit 16/500 lh 1; kvittorubrik 20/500.
- **Spacing:** band 40/16/48; kort 358 padding 24/20 (desktop: grid 480 | 724 gap 43,7, formulärkort padding 32); glyf-grid 26 + 13;
  info padding 14, row-gap 10; **fem staplar 52/52/52/52/58**; fält-rytm 8/16/14/6/14/10; vald stapel 68; scroll-margin 96.
- **Radiestege med semantik:** 999 chip · 12 fält · 16 handling · 20 kort (+10 på chip/thumb). **Skugga:** kort tredelad rgba(9,11,50,.04/.07/.10);
  submit inset-highlight + rgba(94,199,160,.45). **Rörelse:** tak 300/160 ms, hover −1,5 px + saturate, progress 200 ms, kvitto-puls 2,8 s.
- **Layout:** `@container afk ≥900` bygger tvåkolumns-kortet; ingen viewport-@media för layout.

## Komponenter
- **Band + kort** — sky-mist-band, vitt kort 358 radie 20; desktop: vänsterpanel utan yta + högerkort.
- **Eyebrow + tvåfärgad H2** — "Fotobedömning" med kamera; "Osäker på elcentralen? / Du får besked av en behörig elektriker."
- **Info-rader** — klocka/bock/varningstriangel mellan hårlinjer; akut-rad med fet telefonlänk (43,75 px träffyta) + 112.
- **Guide + säkerhetsrad** — "Så blir bilden användbar": tre bockar + fet varning.
- **Fotoruta (stapel 1)** — 52 px kall stapel med teal-tint-chip; vald: 68 px vit med thumb, två rader, 44 px kryss, 3 px progress.
- **Fält ×3 (staplar 2–4)** — etikett 15/500 + 52 px input; fel + invalid-kant; desktop-par namn/telefon.
- **Submit (stapel 5)** — 58 px gradientknapp, naken pil, "Skicka och bli uppringd".
- **Candour + GDPR** — 15/300 grå med integritetspolicy-länk.
- **Kvitto** — bock 40 px, "Tack. Din bild är inskickad." 20/500, ärende-id, löftesrad, candour; solid navy Ring-knapp med teal-chip.
- **Igenkänningsrouter (K0)** — details + 56 px rader med kontrollkant (ortssidor).

## Det som gör blocket bra (bevara)
- Signaturdevisen "fem staplar, en tänd" — identiska kalla staplar gör att den enda varma ytan bär hela handlingen.
- Kontrastdisciplinen som regler i filen: kontrollkant ≥3:1 (därför #5f6480, inte #e6ecf6), teal aldrig som text/kant, fokus 19:1, aldrig mint mot vitt.
- Radiestege med semantik, noll deklarationer under 15 px, två ytor, en gradient, tak på rörelse.
- Fungerar utan JS; file-input dold utan `display:none`; `:where()`-resets som inte äter blockets marginaler; scroll-margin mot sticky-baren.
- Candour-texten ("En bild säger mycket, men inte allt") under submiten på alla vyer; ansvars- och säkerhetsrad per löftesklass.

## Defekter
Se JSON. Viktigast: egen tokenrymd där bara fem färger matchar ap*; #5f6480 med två semantiker; radier 16/10 utanför skalan;
H2 28/36 med blandad vikt = ny H2-variant; brödtext 17/400 lh 1.45; Google Fonts i preview; desktop-vyn låst till 1280; [GAP] dubbel uppladdning.

## Vad som skiljer sig från andra block
- **Primär-CTA = hero_2-gradienten** (som ROT-GT-familjen och sticky-barens ring-knapp) men i **58/16 px-formen med naken pil** —
  och kvittot använder en **solid navy** Ring-knapp med teal-chip: en fjärde knappstil.
- **Fältstil:** enda källan i urvalet med formulärfält — 52 px, #f5f9ff, 1 px #5f6480, radie 12 — ett kontrakt inget annat block har att jämföra med.
- **H2 tvåfärgad med vikt 300/500** — unikt device (övriga: understrykning, gradientord, vikt 550, hel-gradient).
- **Ink-trio #090b32/#3b3f59/#5f6480** är gemensam med eljour-block och sticky-bar (samma "eljour-familj"), men skiljer sig från
  ROT-GT (#1e1e1e/#333/#0f123c/#565e82) och Vår process (navy + navy .72) — tre olika textfärgsystem i urvalet.
