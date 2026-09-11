# Behörighetskollen / Elkollen v7.3.8 (`elkollen`)

**Vad:** "Får du göra eljobbet själv? Kolla innan du kopplar." — 4-slides-tratten: sex rumstiles → neutral jobblista → (villkorsfråga) → verdikt som GRÖN/RÖD board med sidostapel, tabbar (Förklaring / Konsekvenser eller Tips), källrad och CTA-par pinnat till kortets golv → inline-lead. Två lägen: **hero** (`preview/hero.html`, split-hero 44/56 med Bricks-chrome, light-tema valt) och **inbäddat** (`preview/index.html`, 600px-kort under en sidrubrik).
**Status:** live v7.3.8. **Auktoritet: 1.** CSS `assets/behorighetskollen.css` (1408 rader, `ampy-bk__*`, Outfit-only, laddar inga fonter — värdens jobb), data i `data/behorighetskollen-data.json` (26 jobb, bara green/red; GUL finns i CSS men används inte).
**Mätning:** `_probes/elkollen.config.json` (start, tile-hover, jobblista) + `elkollen-gron/-rod/-fraga.config.json` (via `?jobb=`) + pseudo-element (sidostapel/wash) + census. Data i `elkollen.json`.

![desktop](skarmdumpar/elkollen-desktop.png)
![mobil](skarmdumpar/elkollen-mobile.png)

Fler: `-desktop-state-jobblista.png`, `-desktop-state-fraga.png`, `-desktop-state-gron.png` / `-mobile-state-gron.png` (Det här får du göra själv + Tips), `-desktop-state-rod.png` (Det här kräver elektriker + Konsekvenser), `-desktop-state-leadform.png`, `-embedded-desktop.png` (inbäddat läge).

## Tokens: det viktigaste (avvikelser ⚠)

| Roll | Värde | Live-token | Kommentar |
|---|---|---|---|
| Accent (chips, ikoner, hover-kant, fokus) | `rgb(0,169,145)` | `--apteal-core` | exakt, aldrig text |
| ⚠ Knapp-teal | `rgb(0,122,105)` (solid CTA, H1:s teal-rad) | — | mörkad |
| ⚠ Länk-teal | `rgb(0,110,94)` (job-row hover-label) | — | **fjärde** mörka tealen i biblioteket |
| Text primär | `rgb(9,11,50)` | `--apmidnight-blue` | exakt |
| ⚠ Text sekundär / tertiär | `#5a5d7a` / `rgb(104,107,128)` | — | tertiär mörkad från `#8a8da5` för AA |
| ⚠ Sidyta / kanter | `#f4f5fb` / `#e3e5ed` / `#ebedf3` | — | samma som Elcentral |
| ⚠ Grönt verdikt | accent `rgb(27,132,71)`, board `rgba(54,178,92,.10)`, kant `.45`, wash `.08`; ✓-ikon `rgb(15,110,86)` | — | medvetet "lövigare" än teal |
| ⚠ Rött verdikt | accent `rgb(122,22,35)`, board `rgba(214,64,64,.06)`, kant `rgba(150,40,50,.4)`, wash `.07` | — | |
| ⚠ Gult (CSS only) | accent `rgb(135,101,7)`, board `rgba(245,175,25,.08)` | — | ingen data använder |
| Hero-knappar | `120° #55ff9a→#5eb1bf` / `141° #b6f2ff→#5eb1bf`, ink `#0d0d0d`, radius 16, 58px | start-tokens neon-mint / crystal-blue | 1:1 Picasso-receptet, men 58px mot Picassos 38px |
| Typsnitt | **Outfit only** 400/500/600/700 | Outfit | ✓ — verktyget laddar inga fonter |
| Typskala | fasta `--fs-11…30` (px-namn), mobil = per-element-overrides | `--aptext-*` | ⚠ egen; hero-H1 `clamp(3.4rem, 3.2vw, 4rem)` = 40 \| 28 i chrome |
| Spacing | `--space-1…13` 4…32 i 2px-steg | `--apspace-*` | ⚠ (delad med Elcentral) |
| Radier | 6 / 10 / 14 (kort) / full / 16 (hero-btn) | | 14 utanför |
| Skuggor | `rgba(11,13,42,.04/.06/.10)` + kort `0 2px 4px .04, 0 18px 40px .09` | — | ⚠ egen navy |
| ⚠ Fokus | `0 0 0 3px rgba(0,169,145,.25)` | — | ~1.3:1 på vit (Elcentral höjde sin till .9 av just detta skäl) |
| Container | hero `.wrap` 1180; inbäddat kort 600 | 1280 | ⚠ |
| Rörelse | 150 ms ease; kort 240 ms, judgment 280 ms, min-height 200 ms | — | |

## Komponentlista (mått @1440 | @390)

- **hero** (chrome) — grid 44fr/56fr gap 64 med 96px topp-spacer (vänsterkolumnen pinnad); H1 Outfit 600 40 | 28 med teal sista rad; sub 20 | 16 max 46ch; 3 trust-bullets 17/500 (dolda på mobil); två `hero__btn` 235×58 | 358×60 (telefon först på mobil under "Hellre prata med en elektriker direkt?" 15/600).
- **block** — vitt kort radius 14, 1px `#ebedf3`, padding 32 | 16-20, min-height 560 (mobil content-sized), cta-zone/source-line pinnade till golvet. 625×562 | 358×525.
- **entry** — "Var i hemmet gäller det?" Outfit 600 22 | 20; 6 tiles 2-kol gap 12 | 10: 112 | 92px, radius 10, chip 40 | 36 cirkel teal .08 med 20px ikon, label 600 17 | 16, sub 14 | 13 tertiär; hover teal-kant + lyft. Källrad 13 | 11 tertiär.
- **joblist** — rader 52 | 48px radius 6, 20px teal-ikon + Outfit 500 16 | 15 + pil; hover `#f4f5fb` + label `rgb(0,110,94)`; ingen verdict-färg.
- **crumb** — "Tillbaka · Jobbtitel" 14 (500 / 600), 44px.
- **question** — q-title 22 | 20; options 72 | 64px radius 10 med title 600 16 | 15 + clarifier 14 | 13 + pil; info-ruta `#f4f5fb`.
- **verdict-board** (signaturen) — 6px sidostapel längs hela kortet + 200 | 120px topp-wash; board = h2 Outfit 700 22 | 18 med 20px ikon, padding 14 18 | 12 16, 1px tonad kant, radius 10; källrad 12 tertiär (röd/gul); summary 500 17 | 16; tabbar 500 15 med 2px indikator i verdict-färg (gap 24 | 20); rader ✓/✗ 16 | 15 med 18px ikon; grön caveat med 3px `rgb(186,117,23)`-kant; CTA-zon: solid `rgb(0,122,105)` 48 | 52 + outline 48 | 52 ("Läs mer om golvvärme"). Badge 311×56 | 263×48.
- **judgment** (inbäddat läge) — 3px stapel + pill-badge (`rgb(116,200,138)/rgb(4,52,44)` grön, `rgb(240,149,149)/rgb(80,19,19)` röd) Outfit 700 20 | 15.
- **lead** — "Tillbaka till beskedet" 14 → titel 600 22 | 20 → intro 15 → 2-kol grid (label 600 14, input 48 radius 10, fokus teal + ring .25) → fel 500 14 `rgb(214,64,64)` → submit 48 | 52 → finstilt 13.
- **page-head** (inbäddat, utanför verktyget) — H2 "Koppla elen" Outfit 600 40 | 30 + lead.

## Det som gör blocket bra (bevara)

1. Outfit-only med vikt-semantik (400/500/600/700) — det ena av två Outfit-rena verktyg (Energycalc det andra).
2. Trattens neutralitet: tiles → lista utan verdict-färg → besked. Färgen kommer först när svaret finns.
3. Verdict-familjen i fyra nivåer (accent / kant / bg / wash) och grönt som hålls skilt från teal — dokumenterad teal-regel i CSS:en.
4. Kortet håller samma mått S1–S4 och CTA-zonen är pinnad till golvet; mobil content-sized med scroll-anchor mot värdens header.
5. Tabbar utan breddskuttning (500 i båda states).
6. `hero__btn`-receptet (label vänster / ikon höger, `flex: 1`, gradient utan kant) — samma som Elcentral och Picasso.

## Defekter

1. Fokusring `.25` ≈ 1.3:1 — under WCAG 2.4.11 (syskonet rättade).
2. Fjärde mörka tealen (`rgb(0,110,94)`) + `rgb(0,122,105)` + accent `rgb(0,169,145)`.
3. Två verdict-utföranden i samma CSS (pill vs board); `--fs-24/--fs-30` oanvända; GUL utan data.
4. Kortradius 14 utanför tokens; `.wrap` 1180 mot 1280.
5. Hero-chrome (H1, sub, trust, knappar) lever bara i preview-HTML — Bricks måste reproducera manuellt.
6. Egen navy `rgb(11,13,42)` i skuggor; `*`-markören svart utan token; tile-knappen ärver Arial (bara spans sätter Outfit).

## Vad som skiljer sig från andra block

Syskon till Elcentral-kollen (samma hero-recept, spacing, accent/tint-logik, kortradius, mörk knapp-teal), men Outfit-only, board med sidostapel + wash i stället för dualstatus-zon, svag fokusring, ingen sticky-CTA, inbäddat 600px-läge i stället för blockläge. Elcentral kopierade sin rail härifrån ("1:1 with Elkollen hero__copy"). Mot kalkylatorerna: ljust-only, inga siffror, ingen midnattsyta.
