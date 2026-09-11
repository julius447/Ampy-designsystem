# website-blocks — headern v5 (auktoritet 1, godkänd)

**Vad:** Sajtens header/navigation-redesign: en ren sky-mist-bar med tre mega-menyer (Tjänster · Produkter ·
Lösningar), solid teal CTA med pulserande mint-prick, sid-dim vid öppen meny, och en Evify-mönstrad
mobil-drawer. Repot innehåller också "Hero-1 Documentation" (= kopia av Hero-1/delivery, se hero-1.md).
**Status:** header godkänd (r3-feedback inarbetad), leverans = FluentSnippets 3-fil + 3 Bricks-JSON.
**Auktoritet:** 1.

Header-CSS:en i `Header/index.html` är tecken-identisk med `Hero-1/assets/header.css` (verifierat), så
Hero-1 och headern är EN källa. Leveransen `delivery/fluentsnippets/styles.css` är samma värden ×10 i px,
scopad `.ampy-hdr-root`, self-hostad Outfit 300–800, utan `html{62.5%}`.

Renderat: prototyp + leverans-preview (desktop 1881/1876 px, mobil 1647/1755 — höjden är demo-scaffolding),
tre öppna mega-menyer och drawern stängd/öppen via `a1-header-states.mjs`.

![Tjänster öppen 1440](skarmdumpar/website-blocks-desktop-mega-tjanster.png)
![Drawer öppen 390](skarmdumpar/website-blocks-mobile-drawer-open.png)
(Fler: `website-blocks-desktop.png`, `-mobile.png`, `-desktop-mega-produkter.png`, `-desktop-mega-losningar.png`,
`-mobile-drawer.png`, `-delivery-*.png`.)

## Vad jag ser

Desktop: 76 px hög bar i sajtens bakgrundsfärg med hårlinje under, logo 130 px, tre nav-länkar 18 px 500
centrerade, "Gratis rådgivning" solid teal 48 px med grön prick. Öppen Tjänster: ett fullbredds-ark i samma
sky-mist med fyra kolumner (ikon + 18 px 600-titel, länkar 15,5 px i dämpad ink), 350 px högt, sidan
bakom dimmas. Produkter: två produktfoto-tiles + en "GUIDER & VERKTYG"-kolumn. Lösningar: fyra fotokort med
mörk gradient och vit rubrik. Mobil: 66 px bar med CTA + burger; drawern är ett vitt högerark med
"MENY"-eyebrow, platta accordions och en teal "Ring en expert"-knapp.

## Tokens (mätt) — avvikelser mot live-ampy-se markerade

| Roll | Värde | Mot ap*-tokens |
|---|---|---|
| header-höjd | 76 px / 66 px (≤992) | ingen token (`--apheader-space` är padding 19,8 px) |
| container | 1280 px, padding 28 (16 mobil) | = `--container-width`; padding ≠ `--apspace-*` |
| nav-länk | 18 px / 500 / ink #0f123c, padding 0 26 | ≠ `--apnav-link-size` (14 px) |
| CTA | 48 px h, padding 0 26, radie 15, 16 px 600 vit, bg #00a991, glow rgba(0,169,145,.5) | radie 15 ≠ `--apradius-m` 12 / `-l` 20; font ≠ `--aptext-sm` |
| mega-ark | bg #f5f9ff, padding 36/28, skugga 0 22px 36px −28px rgba(15,18,60,.20) | bg = `--apsky-mist` (som `--ap-offwhite`) |
| kolumntitel / länk / undertext | 18/600 · 15,5/400 #565e82 · 13,5 #6a7190 | 15,5 och 13,5 finns inte i ap-textskalan (14/16) |
| produkt-tile | bild 170×124 radie 14, namn 21/600, em 15, go-pil teal | 21 px ≠ `--aptext-ml` 22 |
| eyebrow | 12,5 px 600 uppercase ls .14em #6a7190 | ≠ `--aptext-xs` 12 |
| lösnings-kort | 291×230 radie 20, h4 20/600 vit ls −.01em, p 14/400, go 36 glas | radie 20 = `--apradius-l` (samman­träffande) |
| drawer | 440 max vit; eyebrow 11 px; acc 19/400 #14151a; sub 18/500; leaf 16/400; CTA 56 h 18/600 radie 15 | egen Evify-skala, inga tokens |
| radier | `--r-sm` 8 · `--r-md` 14 · `--r-lg` 20 · `--r-btn` 15 | ap: 4/8/12/20/32 — 14 och 15 saknas |
| rörelse | `--t` .2s ease-out ×26; pulse 1.6 s; kort .25/.45 s | live har ingen rörelsetoken |

Färger: ap-matchade `#00a991`, `#090b32`, `#55ff9a`, `#f5f9ff`, vit (lokalt omdöpta till `--ap-teal`,
`--ap-navy`, `--ap-mint`, `--ap-offwhite`, `--ap-white`). Utanför tokens: ink-skalan `#0f123c / #565e82 /
#6a7190`, hårlinje `#dbe4f0`, hover-teal `#008d79`, drawer-skalan `#14151a / #d5d5dc / #73757d / #9a9aa0 /
#e7ecf4 / #3c4260`, glas `rgba(255,255,255,.16)`. `--ap-green #39c281` definieras men används aldrig.

## Komponenter

| Komponent | En rad |
|---|---|
| Header-bar | fixed 76 px sky-mist, 1 px #dbe4f0 + `0 4px 14px −10px rgba(15,18,60,.14)`; seam försvinner när mega är öppen |
| Nav-länk | 18/500, chevron 13 px .55; hover/open = teal-tint bg `.09` + 2 px teal underline, chevron 180° |
| CTA + pulse-dot | solid teal 48 px, radie 15, 600; `::after` 10 px mint-prick med ring-animation 1.6 s; hover #008d79 utan rörelse |
| Mega Tjänster | 4 kolumner delade av 1 px `rgba(15,18,60,.10)`; ikon 22 px; länk hover teal + `.06`-tint, radie 8 |
| Mega Produkter | 1040-kluster: 2 foto-tiles (radie 20 hover-tint) + guider-kolumn 260 med uppercase-eyebrow |
| Mega Lösningar | 4 fotokort radie 20, gradient 183° `.04→.84`, glas-cirkel go 36 px; hover lyft −4 px, bild 1.05 |
| Drawer | vitt högerark 440, eyebrow MENY, accordions med 1 px #d5d5dc, sub med ikon 24, leaf indrag 38, teal foot-CTA 56 px |
| Burger | 46×46, tre streck 24×3 navy; öppen = X på #e7ecf4-platta radie 14 |

## Hantverk att bevara

- Ark-och-bar som en yta (samma färg, hårlinje, seam bort vid öppning) — ger lugn utan boxar.
- Pulse-dot under CTA:n är sajtens enda "levande" detalj; hover utan rörelse på CTA:n är ett medvetet val.
- A11y-lagret: aria-expanded/controls, Escape, focus-return, hover-gating, reduced-motion, safe-area.
- Brytpunkter ända ned till 339 px med logo-/CTA-trappa.

## Defekter

1. Tredje tokennamnrummet (`--ap-teal` osv.) — och PORT-NOTES föreslår ett fjärde (`--aphdr-`).
2. Ink-skalan och drawer-skalan är två gråskalor utan tokens; body-ink #0f123c ≠ hero-midnight #090b32.
3. Tre primärknappar i samma vy-familj: header-CTA (solid, radie 15, 600), hero-CTA (gradient, radie 16, 500),
   drawer-CTA (solid, radie 15, 600, 56 h).
4. nav 18 px mot live-token 14 px; 15,5/13,5/12,5/21 px finns inte i ap-textskalan.
5. Scroll-tighten som README nämner finns inte i koden (76 px före och efter scroll).
6. Google Fonts i prototyp/preview (GDPR), self-host i leverans.

## Skiljer sig från andra block

Enda blocket med ett eget interaktionslager (JS-engine, timers, drawer) och det enda som definierar en
rörelsetoken (`--t`). Delar header-CSS byte för byte med Hero-1.
