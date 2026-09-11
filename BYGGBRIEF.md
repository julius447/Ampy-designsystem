# Byggbrief: designsystem-sajten (fas 3)

Målet: en sajt Julius kan öppna och SE hela Ampys designsystem i: grunder, komponenter renderade i alla
tillstånd med kod och källa, mönster, regler, blockbiblioteket som galleri, och besluten som väntar på
honom. Sajten byggs på systemets egna tokens (dogfooding): om sajten ser billig ut är systemet fel.

## Sanningen du bygger på (läs i ordning, innan en rad kod)

1. `konsolidering/kanon-sammanfattning.md`, `konsolidering/beslut.md`
2. `system/tokens.css` + `system/base.css` (den enda token-sanningen; ändra ALDRIG dessa filer, rapportera brister)
3. `konsolidering/farg.md`, `typografi.md`, `spacing.md`, `form-djup-rorelse.md`, `komponenter-karta.md`
4. `inventering/<slug>.md` + `.json` för de källor din del bygger på, och deras skärmdumpar i
   `inventering/skarmdumpar/` (öppna dem; du klonar utseende, du hittar inte på)
5. `site/_mall.html` (sidmallen), `site/doc.css` + `site/doc.js` (dokumentationens egen stil, klar)
6. Källkoden i `kallor/<repo>/` när du klonar en komponent (CSS-värden ordagrant, sedan bundna till tokens)

## Klon-regeln

Varje komponent i `system/components/*.css` är en **klon av sin kanoniska källa** (komponentkartan säger
vilken), omskriven så att värdena kommer från `--ampy-*`-tokens (eller `--ap*`-primitiver) i stället för
literaler. Pixelparitet mot källan vid 1440 och 390 är kravet; en avvikelse ska stå i sidans "Avvikelser"
med skäl (t.ex. "källan använde #0b1030, tokenen är #090b32 enligt beslut 3"). Där kartan säger att en
komponent har drift i andra block listar du driften på sidan.

## Filerna (var och en ägs av EN agent, ingen rör andras)

```
system/ampy.css                       importerar tokens, base och alla components/*.css (S1)
system/components/knappar.css          knappar primär/sekundär/tertiär/tel-ring/länk, storlekar, states (S2)
system/components/text.css             eyebrow, tag/badge, stat-trio, hero-siffra + enhet, källrad, citat, listor (S2)
system/components/ytor.css             ljust kort, mörkt resultatkort, glaskort, navy-ram, avdelare (S2)
system/components/falt.css             input, select, textarea, checkbox/consent, radio-chips, segment, slider, stepper, sökfält, fel/hjälp (S2)
system/components/verktyg.css          tvåpanel-skal, hero-readout, stat-trio, staplar, break-even, "Så har vi räknat", inline-lead, tips-chip, popover (S3)
system/components/diagnostik.css       rail, frågekort, chips, besked-pill/matris/trafikljus, källrad, dela (S3)
system/components/block.css            process-steg med ringar, testimonial-kort + slider-skal, certifikat-badge, symptomlista + call-panel, CTA-band, sticky call-bar, header + mega-meny, footer, hero-1, hero-2 S/G/Z/E-skal, mini-menu, före/efter, snabbfakta, FAQ/details, tabell, artikelkomponenter (S4)
site/index.html                        start (S1)
site/grunder/{farg,typografi,spacing,form-djup,rorelse,ornament}.html   (S1)
site/beslut.html, site/kod.html        (S1)
site/komponenter/index.html + {knappar,text,ytor,falt}.html            (S2)
site/komponenter/{verktyg,diagnostik}.html                              (S3)
site/komponenter/block.html, site/monster/{layoutfamiljer,tjanstesida,mobil,register}.html,
site/regler/{rost-i-ui,candour,ai-tells,tillganglighet}.html, site/blockbibliotek.html   (S4)
```

## Sidmallen och vad varje komponentsida innehåller

Använd `site/_mall.html` ordagrant (kopiera, byt innehåll i `<main>`, sätt `<title>` och aktiv nav-länk).
Per komponent, i den ordningen:
1. **Rubrik + en rad** vad den är och när den används.
2. **Källa:** "Kanon: <slug> (<fil:rad>). Finns även i: <slugs> (avvikelse: …)". Länk till blockbibliotekets kort.
3. **Live-exempel** (riktig HTML med systemets klasser, renderad direkt på sidan inuti `<div class="ampy ds-demo">`), ett per tillstånd/variant: default, hover (visas som en variant med klassen `.is-hover` som speglar hover-stilen), focus-visible, disabled, laddar om det finns, storlekar, på ljus och på mörk yta där komponenten används på båda.
4. **Anatomi:** höjd, padding, radie, typografi, ikonstorlek, mått vid 1440 och 390 (siffror ur inventeringen).
5. **Gör / gör inte:** tre + tre, ur källorna och ägardirektiven (inga tankstreck, ingen gradienttext, teal aldrig som liten text, en primär CTA per yta …).
6. **Kod:** HTML-snutten (`<pre><code>`), med kopiera-knapp (doc.js har den).
7. **Avvikelser i blocken:** driften ur komponentkartan.

## Hantverk (sajten ska själv klara ribban)

- Bara Outfit. Vikter enligt tokens. Aldrig gradient i text, aldrig "·", aldrig tankstreck i UI.
- Luft enligt spacing-tokens, hierarki genom storlek och vikt, teal bara på handling.
- Kontrast: brödtext ≥ 4,5:1, stor text ≥ 3:1. Mät i probe.
- Mobil 390 fungerar (nav som fäll, exempel som staplar eller scrollar horisontellt i egen ram).
- Inga externa resurser (inga CDN:er, inga Google Fonts). Ikoner: inline-SVG, 1,5–2 px stroke, samma familj i alla exempel (S2 skapar `system/ikoner.svg` som sprite; övriga använder den).
- Render-loop: `node tools/shot.mjs site/<sida>.html _shots/<namn>` desktop + mobil, titta, iterera, `errors: []`, `overflowX: false`.

## Leverans per agent

- Filerna ovan.
- `site/_bygglogg/<S>.md`: vad som klonades varifrån, paritetsmått (din komponent vs källan vid 1440/390:
  höjd, padding, radie, färg), avvikelser med skäl, brister i tokens.css du hittade, vad du inte hann.
- Avsluta med ≤15 rader.

## Praktiska noter (tillagda efter skalet byggts)

- Sidmallen `site/_mall.html` ligger i `site/`. För en sida i `site/<mapp>/`: byt `../system/ampy.css` → `../../system/ampy.css`, `doc.css` → `../doc.css`, `doc.js` → `../doc.js`, `brand/` → `../brand/`, och alla nav-länkar får prefixet `../` (t.ex. `../index.html`, `../grunder/farg.html`, `komponenter/knappar.html` → `knappar.html` inom samma mapp).
- Dokumentationens klasser finns i `site/doc.css`: `ds-eyebrow`, `ds-h1/h2/h3`, `ds-lead`, `ds-p`, `ds-small`, `ds-source`, `ds-a`, `ds-grid`, `ds-swatch(__chip/__body/__name/__meta)`, `ds-type-row(__meta/__label)`, `ds-space-row(__bar)`, `ds-table(-wrap)`, `ds-demo(--dark/--stack/--full)` + `ds-demo__label`, `ds-caption`, `ds-dodont`, `ds-code` (kopiera-knapp läggs på automatiskt), `ds-cards/ds-card(__img/__body/__title/__meta)`, `ds-status(--1)`, `ds-decision(__n/__rec)`. Lägg till egna `ds-*`-klasser bara i din egen sidas `<style>` om något saknas, aldrig i doc.css.
- Teal `--ampy-action` används aldrig som textfärg (2,96:1). Text-teal = `--ampy-action-strong`. Eyebrows i dokumentationen är redan rätt.
- Skärmdumpar för blockbiblioteket ligger nedskalade i `site/bilder/<slug>-desktop.jpg` / `-mobile.jpg` (+ tillstånd). Använd dem i galleriet och som "så här ser källan ut"-bild på komponentsidor där det hjälper.
- `system/ampy.css` importerar alla `components/*.css` (tomma platshållare finns; du ersätter din).
