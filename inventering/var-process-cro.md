# var-process-cro — "Vår process / Så funkar det" (3 riktningar + v2-omtag)

**Vad:** ombyggnad av processblocket som ligger på 212 sidor (på 132 direkt före MainContact-formuläret). Tre divergenta
riktningar byggda som kod: **A Tidslinjen** (rek.), **B Kompaktkort**, **C Tidsstämplad lista**. Efter ägarens dom ("AI-slop,
låg finess, klumpigt") gjordes **v2** för A och C med en skriven byggspec (sex teckengrader, tre vikter, en hairline, en skugga,
en rytmstege). Väntar riktningsval + fem GAP-signaturer. Auktoritet 3 (mönsterbelägg, aldrig kanon). Ingen baslinjeklon av
dagens block finns i repot.
**Mätning:** `inventering/_probes/var-process-cro.mjs` → `_probes/out/var-process-cro.json`. Datablad: `var-process-cro.json`.
v2 A inventerad fullt; v2 C och v1 A/B/C som rader under `varianter`.

| v2 A desktop 1440 | v2 A mobil 390 |
|---|---|
| ![](skarmdumpar/var-process-cro-desktop.png) | ![](skarmdumpar/var-process-cro-mobile.png) |

Övriga: `var-process-cro-v2-c-tid-*`, `var-process-cro-v1-a-rail-*`, `-v1-b-cards-*`, `-v1-c-tid-*`.

## Det viktigaste i tokens (v2 A)
- **Färger — nästan helt inom paletten:** `#090b32` (= `--apmidnight-blue`, "aldrig #010328"), `rgba(9,11,50,.72)` brödtext
  (7,7:1), `rgba(9,11,50,.14)` = blockets **enda hairline**, `#00a991` (= `--apteal-core`) **bara** som 2 px öppningsring på
  steg 1 (aldrig text, mätt 2,80:1), `#f5f9ff` (= `--apsky-mist`) yta, `#fff` kort. Skugga = "husets" `0 0 16px 0 rgba(190,190,190,.19)`
  (samma som MainCTA/testimonials/ROT-live) — den skugga ROT-GT-familjen och före/efter uttryckligen förkastade.
- **Typografi (px, self-hostad Outfit):** H2 **40/500 lh 1.05 ls −0,018 em** desktop (28/1.1/−0,012 mobil), vänsterställd;
  h3 22/500 lh 1.2 (19 mobil); brödtext **17/300 lh 1.5** — ändras aldrig över brytpunkten; löfteschip 17/500 inline;
  tidsstämpel 12/500 versal +0,08 em; siffra 13/500; bevisrad 14/400 lh 1; överlämning 17/500 +0,005 em. Mått i em (27em = 64 tecken).
- **Rytm:** 10 · 20 · 28 · 40 · 56 · 80 (= `--apspace-2xs…2xl` @1440, hårdkodade) — 10 inom grupp, 20/28 syskon, 40/56 zon,
  80 botten; sektion 56/40/80 (24/0/28 mobil), kort 40/80/48 (32/20/36), steg-gap 28 (20), etikett→text 10.
- **Layout:** kort 1280, radie 20 (16; 0 ≤479 kant i kant); desktop-grid 32 % | 1fr, gap 56: masthead vänster (358 px),
  stegen höger (706 px); medaljong 24 px, indrag 40, räls 1 px. Blockhöjd @390: A 707 px, C 760 (krav ≤780; dagens 1 165–1 200).
- **Rörelse:** ingen; enterView-skydd via `!important`; hover = teal-understrykning.

## Komponenter
- **Processkort** — vitt 1280-kort med husets skugga; masthead + steg i grid.
- **H2 "Vad som händer sen"** — 40/500, ingen ingress.
- **Räls-steg ×4 (A)** — 24 px medaljong (steg 1 teal-ring), 1 px räls i samma spår, h3 + brödtext med inline-löfteschip.
- **Bevisrad** — "Registrerat elinstallationsföretag | Ansvarsförsäkrad" 14/400, dold <768.
- **Överlämning** — textlänk 17/500 + pil, 48 px träffyta, till #main-contact.
- **Tid-steg ×4 (C)** — högerställd tidsstämpel-kolumn + söm; steg 1 teal-sträcka.
- **v1 A/B/C** — se `varianter` (40 px teal-fylld medaljong, 4 kolumner; kort 305×172 med inset-teal; tid-lista med 3 px teal-kant).

## Det som gör blocket bra (bevara)
- Byggspecens diagnos-metod: räkna grader, vikter, radavstånd, alfa-värden, tjocklekar — "ser ut som ett system och beter
  sig som en hög lokala beslut" är den exakta signaturen för genererad kod.
- Accentbudgeten: en enda teal-användning, på det som betyder något (öppningen), inte på bockar.
- Zon/syskon-kvoten 2,0 och "botten ≈ 1,5× toppen" som uttalade lagar; radlängd i em eftersom ch ljuger i Outfit.
- Anti-teater-grinden körd på riktigt (all brödtext dold → 4 av 4 husägarfrågor besvarade av rubriker + chips).
- Renderingskontraktet mot enterView; noll JS; överlämningen som länk, inte knapp, för att inte konkurrera med formuläret.

## Defekter
Se JSON. Viktigast: ingen baslinjeklon; H2 40/500 = femte H2-målet i urvalet; 17 px brödtext utanför ap-ändpunkterna;
husets skugga adopterad medan andra leveranser förkastar den; v1:s no-op-clamp (36 vs 40) och padding-drift (48 vs 79,2);
bevisraden offrad <768; fem öppna GAP-signaturer som avgör om chippen får renderas.

## Vad som skiljer sig från andra block
- **H2:** 40/500 lh 1.05 (v2) — störst och tätast i urvalet, vänsterställd (alla andra centrerar); v1 hade 40/500 lh 1.15 + ingress.
- **Brödtext 17 px** — mellan `--aptext-m`:s 16 och 18; alla andra block landar på kurvan 16→18.
- **Teal-disciplin:** enda källan som skriver ut regeln "teal aldrig som text (2,80:1)"; eljour-block/testimonials använder teal/mint som text-/ikonfärg.
- **Kortet kant i kant ≤479** (radie 0, sidopadding 0) — unikt; övriga block behåller 10–16 px marginal på mobil.
- **Husets skugga** (rgba(190,190,190,.19)) — här ett medvetet val; i ROT-GT-familjen och före/efter en dokumenterad defekt att undvika.
