# Spacing: apspace-skalan, sektionsrytm, kortpadding, gap, container, brytpunkter

Underlag: `_probes/out/spacing.json` (03), `_probes/out/container-breakpoints.json`, px mätta i Chromium (06). Djupanalysens verdikt: konsolidera på **befintliga apspace-värden, bygg inte om värdena** — lager 2 speglar dem i px (rem-oberoende).

## Skalan (11 steg, live-värden; fix: 4xs)

| ap-token | --ampy | px 390 | px 768 | px 1440 | refereras i (källor) |
|---|---|---|---|---|---|
| `--apspace-4xs` | `--ampy-space-4xs` | 4.91 | 5.02 | 5.19 | 1: footer-cro |
| `--apspace-3xs` | `--ampy-space-3xs` | 6.59 | 6.78 | 7 | 2: footer-cro, testimonials-block |
| `--apspace-2xs` | `--ampy-space-2xs` | 8.3 | 8.97 | 9.89 | 7: footer-cro, fore-efter-cro, main-form, picasso, testimonials-block, thank-you, var-process-cro |
| `--apspace-xs` | `--ampy-space-xs` | 10.52 | 11.98 | 14 | 5: certificates, footer-cro, fore-efter-cro, picasso, testimonials-block |
| `--apspace-s` | `--ampy-space-s` | 13.34 | 16.09 | 19.8 | 9: certificates, footer-cro, fore-efter-cro, live-ampy-se, picasso, rot-gt-cro, testimonials-block, thank-you, visste-du-att |
| `--apspace-m` | `--ampy-space-m` | 16.88 | 21.59 | 28 | 9: certificates, footer-cro, fore-efter-cro, live-ampy-se, picasso, rot-gt-cro, testimonials-block, thank-you, visste-du-att |
| `--apspace-l` | `--ampy-space-l` | 21.45 | 29.16 | 39.59 | 7: footer-cro, fore-efter-cro, live-ampy-se, picasso, rot-gt-cro, testimonials-block, visste-du-att |
| `--apspace-xl` | `--ampy-space-xl` | 27.3 | 39.5 | 56 | 6: certificates, footer-cro, live-ampy-se, rot-gt-cro, testimonials-block, visste-du-att |
| `--apspace-2xl` | `--ampy-space-2xl` | 34.75 | 53.61 | 79.19 | 6: certificates, footer-cro, fore-efter-cro, testimonials-block, var-process-cro, visste-du-att |
| `--apspace-3xl` | `--ampy-space-3xl` | 44.39 | 73.08 | 111.89 | 2: live-ampy-se, rot-gt-cro |
| `--apspace-4xl` | `--ampy-space-4xl` | 56.75 | 99.84 | 158.3 | 0:  |

`--apspace-4xs` var trasig (min > max → 5.19 px fast); rättad till 4.9 → 5.2 px i tokens.css lager 1b.

## Roller

| roll | token | värde (px 1440 / 390) | källa | drift |
|---|---|---|---|---|
| sektion vertikalt | `--ampy-space-section-y` | 2xl (79.2 / 34.8) | testimonials, visste-du-att, fore-efter, footer, certificates live (5; 3 auk 1) | xl 56 (certificates v2, prefooter, main-cta, elcentral, var-process); l 39.6 (theme .brxe-section); 64/28 eljour; 110/64 mini-menu; 60/0 main-form; 40/48 fotobedomningen |
| sektion horisontellt / gutter | `--ampy-space-section-x = --ampy-gutter` | l (39.6 / 21.5) | theme-style .brxe-section, visste-du-att, footer | m 28 testimonials; 40/16 eljour/main-cta/elcentral; 28/16 header; 24 mini-menu/energycalc; 15/10 LED |
| kortpadding | `--ampy-space-card` | m (28 / 16.9) | testimonials kort, eljour (28/20), live testimonials, certificates inner | 20 LED input/EV; 32 elcentral/elkollen/energycalc; 40 LED resultat; 24 mini-menu/booking; 79 visste |
| kortpadding stort | `--ampy-space-card-lg` | l (39.6 / 21.5) | LED resultatkort 40, energycalc ≥1200 40, var-process 40 | 56 GT (xl); 112 ROT (3xl); 52/56 thank-you |
| stack xs | `--ampy-space-stack-xs` | 2xs (9.9 / 8.3) | testimonials h2→subline, thank-you ghost, var-process 10 inom grupp |  |
| stack sm | `--ampy-space-stack-sm` | xs (14 / 10.5) | certificates h2→p, energycalc head→innehåll 16, hero-1 h1→lead 18 |  |
| stack | `--ampy-space-stack` | s (19.8 / 13.3) | thank-you rubrik→ingress, visste innehållsgap, testimonials kortkropp, eljour inre gap 16 | 24 thank-you kort-gap; 20 var-process syskon |
| stack lg | `--ampy-space-stack-lg` | l (39.6 / 21.5) | testimonials rubrikblock-mb, fore-efter h2-mb, eljour rubrik-mb 36, hero-1 lead→CTA 32 | 44 rot-gt H2-mb |
| stack xl | `--ampy-space-stack-xl` | xl (56 / 27.3) | var-process zon 56 | 64 mini-menu head→grid; 79 visste grid-gap |
| inline xs | `--ampy-space-inline-xs` | 3xs (7 / 6.6) | footer li 7, testimonials meta 8, hero-1 proof g-row 9 |  |
| inline sm | `--ampy-space-inline-sm` | 2xs (9.9 / 8.3) | header nav-gap 10, main-form etikett→fält 8, LED gap 7.5–10 |  |
| inline | `--ampy-space-inline` | xs (14 / 10.5) | cta-website gap 16/14, hero-1 proof-gap 14, footer row-gap 14 |  |
| inline lg | `--ampy-space-inline-lg` | s (19.8 / 13.3) | live steg-grid gap, certificates kolumngap "≥ radien" |  |
| rutnätsgap | `--ampy-space-gap` | m (28 / 16.9) | fore-efter par-gap, live GT-grid, certificates 28, testimonials 24, mini-menu 30 |  |
| rutnätsgap stort | `--ampy-space-gap-lg` | l (39.6 / 21.5) | main-cta 43, eljour 40, fotobedomningen 43.7 | 64 elcentral/elkollen shell; 56 var-process; 79 rot-gt/visste |

## Sektionsrytm per blocktyp (uppmätt padding-y, desktop / mobil)

| källa | auk | värde | px desktop | px mobil | token |
|---|---|---|---|---|---|
| certificates | 2 | var(--apspace-xl) var(--apspace-xl) · ≤900 vertikalt var(--apspace-2xl) · ≤389 sidopadding 18px | 56 / 56 | 34.8 / 27.3 | --apspace-xl · --apspace-2xl |
| certificates | 2 | var(--apspace-2xl) var(--apspace-xl) | 79.2 / 56 | 34.8 / 27.3 | --apspace-2xl / --apspace-xl |
| eljour-block | 1 | clamp(2.8rem, 5vw, 6.4rem) clamp(1.6rem, 4vw, 4rem) | 64 / 40 | 28 / 16 |  |
| fore-efter-cro | 2 | var(--ampyfe-space-2xl) var(--ampyfe-space-s) = clamp(31.3px, 4.99vw + 15.3px, 79.2px) clamp(12.8px, | 79.2 / 19.8 | 34.8 / 13.3 | = --apspace-2xl / --apspace-s i px |
| fotobedomningen | 2 | 40px 16px 48px (mobil + desktop) | 40 / 16 / 48 | 40 / 16 / 48 |  |
| hero-1 | 1 | clamp(12px,1.6vw,20px) clamp(14px,2vw,26px) clamp(20px,2.6vw,30px); ≤992: 10px 10px 16px | 20 26 30 | 10 10 16 |  |
| live-ampy-se | 1 | var(--apspace-l) alla sidor | 39.59 | 21.45 | --apspace-l |
| live-ampy-se | 1 | padding-inline var(--space-xs) (LEGACY-token) | None | 9.02 | --space-xs (legacy Core Framework, ej ap*) |
| main-cta | 2 | clamp(28px,4vw,56px) clamp(16px,3vw,40px) | 56 40 | 28 16 |  |
| main-form | 2 | clamp(2.4rem, 1rem + 4vw, 6rem) clamp(1.2rem, 0.6rem + 2vw, 2.4rem); 0 ≤768px | 60 / 24 | 0 |  |
| mini-menu | 2 | clamp(6.4rem,4rem+6vw,11rem) → 110 @1440 / 64 @390 | 110 | 64 |  |
| rot-gt-cro | 1 | var(--apspace-l) alla sidor · mobil: vertikalt --apspace-xl? nej — uppmätt 27,3 px = --apspace-xl@39 | 39.6 | 27.3 / 9.0 | --apspace-l (desktop) · --space-xs (Core Framework-legacy, mobil) |
| testimonials-block | 1 | var(--apspace-2xl) var(--apspace-m) · tablett --apspace-xl --apspace-m · ≤759 --apspace-xl --apspace | 79.2 / 28 | 27.3 / 13.3 | --apspace-2xl/-m · --apspace-xl/-s |
| testimonials-block | 1 | var(--apspace-l) 0 · mobil --apspace-l/--apspace-xl + --apspace-3xs | 39.6 / 0 | 21.5–27.3 / 6.6 | --apspace-l/-xl/-3xs |
| var-process-cro | 3 | 24px 20px 28px · ≥992 56px 40px 80px · ≤479 sidopadding 0 (kortet går kant i kant) | 56 / 40 / 80 | 24 / 0 / 28 |  |
| var-process-cro | 3 | 40px 20px + padding-bottom var(--apspace-2xl, 48px) (=31,4 @390 / 72,7 @1440 — 'beviset visar 48 och | 56 / 40 / 72.7 | 40 / 20 / 31.4 | --apspace-2xl |
| visste-du-att | 2 | var(--apspace-2xl) var(--apspace-l) · ≤992 --apspace-xl --apspace-m · ≤480 --apspace-l --apspace-s | 79.2 / 39.6 | 21.5 / 13.3 | --apspace-2xl/-l · -xl/-m · -l/-s |

## Container

Kanon **1280 px** (`--container-width`, `--apmax-screen-width`, theme `.brxe-container`; 14 källor). Fullbredd är tillåten (ägardirektiv 2026-08-14: 1280 är inte ett tak) — hero-1 1700, hero-2 1424. Textmått `--ampy-container-text` 980 (legacy `--max-width`). Drift: 1320 mini-menu, 1360 energycalc, 1180 elkollen, 1100 live testimonials (Bricks-default), 1088 article, 780 booking, 520 thank-you.

| källa | roll | värde |
|---|---|---|
| article-template | sidcontainer | 1088 px (Tailwind max-w + px), artikel 704 + TOC 320 (gap 64) |
| battery-calculator | max-width | 128rem |
| battery-calculator | mobil-overflow | DEFEKT: inputkortet 394.9px brett i 390px viewport → scrollWidth 413 (overflowX true); orsak: kortet |
| booking-confirmation | sidans max-width | 780px (bk-shell), centrerad – uppmätt 724px innehåll @1440 (780 − 2×28) |
| booking-confirmation | kortens innehållsbredd | 658px @1440 (724 − 2×32 − 2px kant); 325px @390 |
| booking-confirmation | offer-accepted kort | max-width 540px; sektion padding clamp(24px,3vw,34px) clamp(24px,4vw,48px) |
| certificates | inner max-width | var(--container-width, 1280px) |
| certificates | text/kort-kolumner | flex 1 1 0 vardera, kort max 492 → text får överskottet (760 px @1440) |
| certificates | container | 1280 (Bricks), textblock 626, grid 370,8 |
| cta-website | galleri | max-width 1000px, kort 20px radie, slots 1fr/350px |
| elcentral-kollen | shell max-width | 128rem (1280px) |
| elcentral-kollen | blockläge shell | 76rem (760px) centrerad; ≥1280 128rem tvåkolumn med kortet pinnat till 56rem kvadrat |
| elcentral-kollen | blockläge stage | max-width 63.6rem |
| elcentral-kollen | start-cta max-width | 32rem; mobil/tablet CTA:er cap 44rem centrerade |
| elcentral-kollen | scroll-offset | --ec-scroll-offset 7.8rem (66px header + 12) / ≥993: 8.8rem |
| eljour-block | wrap max-width | --eb-max 128rem = 1280 px (= Hero-2) |
| eljour-sticky-bar | bar | position:fixed left 0 right 0 bottom 0, z-index 900 (under Bricks offcanvas 1001); ≤992 px |
| eljour-sticky-bar | hörnkort | position:fixed right 24 bottom 24 (variant .acb-card--left), z 900; ≥993 px |
| elkollen | hero .wrap | 118rem (1180px) — smalare än sajtens 1280 |
| elkollen | inbäddat kort | --block-max-width 60rem (600px) 'calm line length' |
| elkollen | hero-läge kort | max-width none, fyller högerkolumnen (625px @1440) |
| elkollen | --ampy-header-h | scroll-anchor-offset satt av värden (preview 44px) |
| energycalc | --shell-max | 136rem = 1360px ('premium shell') — bredare än sajtens 1280 |
| energycalc | inputkort | 42rem fast (420px), sticky top 24px |
| energycalc | resultatkolumn | flex 1 (852px @1440) |
| energycalc | måttcap | sp-verdict 62ch, method-body 70ch, trust-quote 30ch, lead-field 48rem |
| ev-kalkylator | max-width | 128rem (1280px) |
| ev-kalkylator | container-query-kontext | .ampy-calc-outer { container-type: inline-size; container-name: ampy } — alla brytpunkter i cqi |
| ev-kalkylator | selector-list max-height | min(50rem, 60vh) (16 laddboxar) |
| ev-kalkylator | popover max-width | min(280px, calc(100vw - 24px)) |
| ev-kalkylator | body | standalone saknar body{margin:0} → 8px vit ram runt verktyget |
| footer-cro | container | 1280px |
| footer-cro | brand-text | max-width 85 % |
| fore-efter-cro | inner max-width | 1280px, margin auto |
| fore-efter-cro | container queries | wrapper container 'ampyfe' (≤680 staplar), varje figur container 'ampyfefig' (≤420 krymper handtag/l |
| fotobedomningen | kort max-width | 358 mobil · 1280 desktop (≥900 cqi); container-type inline-size på .afk |
| hero-1 | hero frame max-width | 1700px (bredare än sajtens 1280) |
| hero-1 | hero frame höjd | calc(100svh − var(--header-h) − 48px), min 620 max 950; ≤992: min 520, −26px |
| hero-1 | content max-width | 880px (993–1200: 720; 561–992: 640; ≤560: none) |
| hero-1 | header container | --container 128rem = 1280px |

## Brytpunkter

Kanon **992 / 768 / 480** (som max-width: 991 / 767 / 479 — Bricks skriver 991/767/478). Föredra `@container` mot blockets egen bredd (hero-2-alternatives, EV, fore-efter, fotobedomningen, main-cta-leverans gör det). Extra steg som förekommer: 1200 (hero-1-band, energycalc, hero-2), 560 (hero-1/header/LED/EV mobil-fintrim).

| px | källor |
|---|---|
| 767 | 10: certificates, elcentral-kollen, elkollen, footer-cro, hero-2-alternatives, live-ampy-se, main-cta, mini-menu, rot-gt-cro, testimonials-block |
| 768 | 9: battery-calculator, elkollen, ev-kalkylator, hero-2-alternatives, led-kalkylator, live-ampy-se, main-cta, main-form, var-process-cro |
| 480 | 9: booking-confirmation, eljour-block, eljour-sticky-bar, energycalc, ev-kalkylator, hero-2-form, live-ampy-se, rot-gt-cro, visste-du-att |
| 992 | 9: eljour-block, eljour-sticky-bar, energycalc, hero-1, hero-2-alternatives, live-ampy-se, var-process-cro, visste-du-att, website-blocks |
| 560 | 8: battery-calculator, booking-confirmation, ev-kalkylator, hero-1, hero-2-alternatives, led-kalkylator, live-ampy-se, website-blocks |
| 1024 | 7: article-template, elcentral-kollen, elkollen, live-ampy-se, main-cta, rot-gt-cro, testimonials-block |
| 991 | 7: certificates, energycalc, footer-cro, hero-2-alternatives, live-ampy-se, rot-gt-cro, testimonials-block |
| 600 | 5: battery-calculator, ev-kalkylator, hero-2-alternatives, hero-2-form, led-kalkylator |
| 478 | 4: certificates, footer-cro, live-ampy-se, testimonials-block |
| 993 | 4: elcentral-kollen, eljour-sticky-bar, hero-1, website-blocks |
| 1200 | 4: energycalc, hero-1, hero-2-alternatives, live-ampy-se |
| 960 | 3: battery-calculator, ev-kalkylator, led-kalkylator |
| 900 | 3: certificates, fotobedomningen, rot-gt-cro |
| 520 | 3: elcentral-kollen, fore-efter-cro, thank-you |
| 561 | 3: hero-1, hero-2-alternatives, live-ampy-se |
| 400 | 3: hero-1, rot-gt-cro, website-blocks |
