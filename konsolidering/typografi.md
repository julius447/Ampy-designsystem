# Typografi: roller, kanon, källor, matris

Underlag: `_probes/out/typ-matris.json` (401 typografirader ur 30 JSON, 267 klassade till 11 roller), px mätta i Chromium på `system/_smoke.html` (`_probes/out/smoke-matt.json`). Ett typsnitt: **Outfit** (brandbok s.13 + live + 24 källor). Plus Jakarta Sans (LED/EV/battery/elcentral rubriker, footer "5.0") och JetBrains Mono (kalkylatorernas inputsiffror) är drift → beslut B7.

## Kanon per roll

| roll | token | storlek (px-clamp) | px 390 / 768 / 1440 | vikt | lh | ls | källa | drift (uppmätt i andra källor) |
|---|---|---|---|---|---|---|---|---|
| **display** | `--ampy-text-display` | `clamp(36px, 4.6vw, 60px)` | 36 / 36 / 60 | 700 | 1.07 | -0.018em | hero-1 (assets/style.css:38-46 .hero__h1) = live site-css .home-hero__heading | hero-2-alternatives 34/40/48·700·1.07·-.008em; elcentral rail-h1 44/700; elkollen hero-h1 40/600; energycalc anchor 52/900; article 48/800; --aptext-4xl 35.9→60 |
| **h1** | `--ampy-text-h1` | `clamp(30px, 1.88vw + 24px, 48px) (= --aptext-3xl)` | 31.33 / 38.44 / 48 | 700 | 1.07 | -0.015em | hero-2-alternatives (primitives 2b, 48 ≥1200) + article 48 + booking 46/600 + elcentral 44/700 | elkollen 40/600/1.18; thank-you h1 40/500 (--aptext-2-5xl); theme-style h1 = --aptext-4xl 60 (refereras ej) |
| **h2** | `--ampy-text-h2` | `clamp(26px, 1.04vw + 22.7px, 36px) (= --aptext-2xl)` | 26.75 / 30.67 / 36 | 500 | 1.2 | -0.01em | eljour-block (index.html:33 36/500/1.15/-.015) + testimonials V1 (--aptext-2xl 400/1.15/-.01) + certificates v2 (400/1.2/-.01) + rot-gt (450/1.2/-.01) + visste-du-att (500/1.2) + fotobedomningen (36/500) + mini-menu (38/500/1.2/-.01) | 32/400 (--aptext-xl: live ROT/GT, fore-efter, footer h3, elcentral block, testimonials live); 40/500 (--aptext-2-5xl: temats default, main-cta, var-process); 30/700 article; theme lh 1.4 |
| **h3** | `--ampy-text-h3` | `clamp(20px, 0.21vw + 19.3px, 22px) (= --aptext-ml)` | 20.11 / 20.91 / 22 | 600 | 1.25 | -0.01em | live ROT/GT-steg (--aptext-ml/--aptext-mmm 22/400) + elkollen (--fs-22 600) + var-process (22/500) + testimonials namn (22/600) | rot-gt 19→23/450; energycalc 20/500; booking 24/600; elcentral q-title 32/600 (PJS); live mobil lh 1 |
| **lead** | `--ampy-text-lead` | `clamp(17px, 1.55vw, 22px)` | 17 / 17 / 22 | 400 | 1.58 | normal | hero-1 (assets/style.css:48-55 .hero__sub) = live .home-hero__text | hero-2 16/17/20·400·1.6; elcentral 20/18 400 1.6; elkollen 20/16; 18/300 (testimonials subline, certificates, visste); 18.5/300 mini-menu; 18/200 main-form |
| **body** | `--ampy-text-body` | `clamp(16px, 0.21vw + 15.3px, 18px) (= --aptext-m)` | 16.11 / 16.91 / 18 | 300 | 1.5 | normal | live (.rot__text-basic --aptext-m 18/300, .brxe-post-content) + testimonials V1 (300/1.5) + certificates (300/1.55) + rot-gt ("paragrafstandard = --aptext-m, 300, 1.5") + main-cta + visste-du-att + fore-efter tagline | live body-element = --aptext-sm 16/300/1.7 (#363636); eljour 17/400/1.6; var-process 17/300/1.5; mini-menu 19/400; LED 19/400; thank-you 18/400; booking 16/400; main-form 16/400; article 18/400/1.7 |
| **small** | `--ampy-text-small` | `clamp(14px, 0.21vw + 13.3px, 16px) (= --aptext-sm)` | 14.11 / 14.91 / 16 | 400 | 1.5 | normal | live theme-style body/.bricks-button/footer-länkar (--aptext-sm) + thank-you (betyg/ghost) + testimonials badge + elkollen (16 knapp/input, 15 sekundär, 14 meta) | hero-1 proof 14.5/13.5; elcentral 13–15; fotobedomningen 15 (golv); testimonials datum --aptext-xs 12→10.1 (defekt) |
| **eyebrow** | `--ampy-text-eyebrow` | `12px (fast)` | 12 / 12 / 12 | 600 | 1.5 | 0.14em uppercase | energycalc (--ty-eyebrow 12/500/.14em) + thank-you cta-eyebrow (12/600/.14em) + offer (12/600/.14em) + booking (12/700/.12em) + elcentral (12/600/.06em) | header 12.5/600/.14em; rot-gt caps 13/700/.12em; LED tier 15/600/.08em; fotobedomningen 15/600/.02em; visste kicker 24/500 (--aptext-l); article 10–15/700–800/.2em |
| **number** | `--ampy-text-number` | `clamp(38px, 1.989vw + 30.54px, 56px)` | 38.3 / 45.81 / 56 | 700 | 1 | -0.03em tabular-nums | led-kalkylator (styles.css:295 hero-number --fs-4xl, PJS 700) → Outfit | energycalc anchor 52/35.7 Outfit 900 (-.02em); EV/battery avsett 75 (bugg → 38.7/44); LED trio 28/700; rot-gt total 20→24/700; booking 26→30/700 |
| **label** | `--ampy-text-label` | `14px (fast)` | 14 / 14 / 14 | 600 | 1.4 | normal | hero-2-alternatives (primitives:488 14/600 lh 20) + elkollen (--fs-14 600) + main-form (14/500) | LED 15/600 (PJS); elcentral 13/600; booking 13.5/600; fotobedomningen 15/500; energycalc 12/400; hero-2-form 13–14/400 |
| **button** | `--ampy-text-button` | `16px (fast)` | 16 / 16 / 16 | 500 | 1 | normal | cta-website (*.css:13 16px/500/lh 1) = main-cta, rot-gt, fotobedomningen; live .bricks-button (--aptext-sm/500/ls .5px); picasso (--aptext-sm/400) | hero-1 15.5/15 mobil; header-CTA 16/600; elcentral/LED 15/600; EV 17/600; hero-2 ampy-btn 17/600; energycalc 18/500; hero-2 Z submit 19/600; mini-menu pill 16/700 |

Vikter: `--ampy-w-display` 700 · `--ampy-w-heading` 500 (h2) · `--ampy-w-strong` 600 (h3, etiketter) · `--ampy-w-medium` 500 (knappar) · `--ampy-w-ui` 400 · `--ampy-w-body` 300. Brandbokens Black 900 används i inget byggt block utom energycalcs anchor-siffra → beslut B2.

Radavstånd: display/h1 1.07 · h2 1.2 · h3 1.25 · lead 1.58 · body 1.5 · UI 1.4 · knapp/siffra 1. Spärrning: display −.018em · rubrik −.01em · siffra −.03em · eyebrow +.14em.

## Frekvens per roll (antal källor auk 1–2 som delar värdet)

| roll | vikt | lh | px@1440 | ls |
|---|---|---|---|---|
| display | 700×4, 800×1, 600×1, 900×1, 500×1 | 1.07×3, 1.08×2, 1.0 (48 px) / 1.08×1, 1.18 / 1.15×1, 1.14×1 | 40×2, 48×1, 44×1, 52×1, 60.0×1 | -0.02em×2, -0.018em×2, -0.025em (−1,2 px)×1, -0.015em / -0.012em×1, -1.08px×1 |
| h1 | 600×3, 700×2, None×1 | 1.2×2, 1.05×1, normal×1, 1.15×1, 1.4×1 | 46×1, 28×1, 40×1, 23.22×1, 34×1 | -0.015em×3, None×2, -0.025em×1 |
| h2 | 500×6, 400×5, 600×3, 700×2, fråga 300 (#3b3f59) · svar 500 (#090b32)×1 | 1.2×7, 1.15×3, 1.2 / 1.333×1, 1.11×1, 1.25×1 | 36×7, 32×4, 32.0×2, 30×1, 24×1 | normal×6, -0.015em×4, -0.01em×4, -0.025em×1, -0.02em×1 |
| h3 | 600×5, 400×2, 500×2, 700 / 600 / 600×1, 700×1 | 1.3×4, 1.25×2, None×2, normal×2, 1.4×1 | 20×3, 22×3, 22.0×2, 32.0×1, 16.5×1 | normal×5, None×4, -0.01em×3, -0.015em×1, -0.025em×1 |
| lead | 400×9, 300×4, 600×1, 500 / 400×1, 600 / 400 / 400 / 400×1 | None×4, 1.55×3, 1.58×2, 1.5×2, 1.4 / 1.625×1 | 18×5, 20×3, 16×2, 13.0×2, 15×1 | normal×9, None×6 |
| body | 400×11, 300×8, 500×4, 600×4, 400, b 600×1 | 1.5×11, None×5, 1.7×3, normal×3, 1.6×3 | 16×9, 18×5, 17×4, 19×4, 18.0×3 | normal×11, None×10, -0.005em×1 |
| small | 400×10, 500×3, 300×3, 600×2, 400, namn 600×1 | None×5, 1.5×4, 1.45×3, normal×3, 1.2×2 | 13×4, 14×4, 12×3, 22×2, 13.5×2 | None×7, normal×6, -0.01em×1, -0.008em×1, 0.02em×1 |
| eyebrow | 600×6, 500×3, 700×2, 700–800×1, 400×1 | 1.5×4, None×4, normal×2, 1.2×2, 20px×1 | 12×4, 11.0×2, 15×2, 13×2, 11×1 | 0.06em×3, 0.04em×2, 0.02em×2, 0.2–0.25em versal×1, 0.12em uppercase×1 |
| number | 700×3, 400×1, 700 / 500 / 700×1 | 1.3×2, 1.0×2, 1.5×1, 1.1×1 | 15×1, 12.0×1, 20.07×1, 38.72×1, 28×1 | -0.01em×2, -0.03em×2, normal×1, 0.1em uppercase / normal / -0.02em×1, -0.012em×1 |
| label | 500×6, 600×3, 400×2, 500 / 400×1, 700 / 400×1 | None×4, 1.5×3, 1.35×2, 1.5 / 1.6×1, 1.25 / 1.35×1 | 13.5×2, 13.0×2, 16×2, 15×2, 13×2 | None×6, normal×3, 0.02em×2, 0.01em×2, -0.005em / 0×1 |
| button | 500×13, 600×10, 400×3, 300×1, 700×1 | 1×6, None×6, normal×4, 1.3×2, 1.1×2 | 16×10, 16.0×5, 15×4, 18×2, 18.0×2 | normal×10, None×9, 0.5px×2, 0.08px×1, 0.16px×1 |

## Matris källa × roll (första uppmätta raden per roll: px@1440/px@390 · vikt · lh · font)

| källa | display | h1 | h2 | h3 | lead | body | small | eyebrow | number | label | button |
|---|---|---|---|---|---|---|---|---|---|---|---|
| cta-website (1) |  | 28/28 600 normal Outfit |  |  |  | 16/16 300 None Outfit |  |  |  |  | 16/16 500 1 Outfit |
| elcentral-kollen (1) | 44/32 700 1.08 Plus |  | 36/20.9 700 1.15 Plus | 20/22 700 1.2 Plus | 20/18 400 1.6 (mobil 1.55) Outfit | 18/15 500 1.4 Outfit | 14/14 450 1.6 Outfit | 12/12 600 None Plus |  | 18/15 500 / 400 1.5 / 1.6 Outfit | 16/14.12 400 1 Outfit |
| eljour-block (1) |  |  | 36/26 500 1.15 Outfit |  |  | 19/17 500 normal Outfit |  | 12/12 600 normal Outfit |  |  | 17.5/15 600 1.1 Outfit |
| elkollen (1) | 40/28 600 1.18 / 1.15 Outfit | 40/29.75 600 1.15 Outfit |  | 22/20 600 1.25 Outfit | 20/16 400 1.6 / 1.5 Outfit | 16.0/15.0 600 / 400 1.35 / 1.45 Outfit | 17/? 500 1.45 Outfit |  |  | 17.0/16.0 600 / 400 1.25 / 1.35 Outfit | 16/14.12 400 1 Outfit |
| energycalc (1) | 52/35.7 900 1.08 Outfit |  |  | 20/20 500 1.15 Outfit | 15.5/15.5 300 1.55 Outfit | 16/16 400 normal Outfit | 13.5/13.5 300 1.55 Outfit | 12/12 500 None Outfit |  | 16/16 500 1.35 Outfit | 18/16.17 500 None Outfit |
| ev-kalkylator (1) |  | 23.22/23.94 700 1.2 Plus |  | 12.23/12.01 600 None Plus | 12.23/12.0 600 / 400 / 400 / 400 None PJS | 18.27/17.06 600 None Plus | 10.23/10.01 600 1.2 Outfit | 10.23/10.01 500 None Outfit | 20.07/18.1 700 1.3 JetBrains | 10.23/10.01 500 None Outfit | 17.12/17.01 600 None Plus |
| footer-cro (1) |  |  | 32.0/24.54 600 normal Outfit | 20.0/20.12 500 normal Outfit |  |  | 12.0/10.12 400 normal Outfit |  |  |  |  |
| hero-1 (1) | 60.0/36.0 700 1.07 Outfit |  |  |  | 22.0/15.5 400 1.58 Outfit | 16/16 300 1.5 Outfit | 14.5/13.5 400 1.0 Outfit |  |  |  | 16.0/15.0 500 1.0 Outfit |
| led-kalkylator (1) |  | 34/24.17 700 1.2 Plus |  |  | 13.0/12.0 500 / 400 / 400 / 400 None Outfit | 19/16.05 600 None Plus | 13/12.02 400 1.5 Outfit | 15/13.03 600 1.5 Outfit | 28/21.11 700 1.3 JetBrains | 13/12.02 500 1.5 Outfit | 15/13.03 600 None Plus |
| live-ampy-se (1) | 60/36 700 1.07 Outfit | ?/? None 1.4 Outfit | 40/28.88 500 1.4 Outfit | 22.0/18.12 400 1.3 Outfit | 22/17 400 1.58 Outfit | 16/14.12 300 1.7 Outfit |  |  |  |  | 16.0/14.12 500 1.7 Outfit |
| rot-gt-cro (1) |  |  | 32/22.46 400 1.3 desktop / 1.2 mobil Outfit | 22/18.12 400 (ROT) / 500 (GT mobil) 1.3 desktop / 1 mobil Outfit |  | 16/14.12 300 1.7 (Bricks frontend body) Outfit | 13.5/13.5 400 1.5 AvdragOutfit | 13/13 700 1.5 AvdragOutfit | 23.04/20 700 1.1 AvdragOutfit |  | 16/14.12 500 1.7 (ärvd) → 59,2 px hög Outfit |
| testimonials-block (1) |  |  | 36/24.96 400 1.15 Outfit | 22/20.12 600 normal Outfit | 18/? 300 normal Outfit | 19/17.12 300 1.5 Outfit | 12/10.12 400 normal Outfit |  |  |  |  |
| website-blocks (1) |  |  |  |  |  | 16/16 300 1.5 Outfit |  | 12.5/? 600 1.5 Outfit |  |  | 16/13.5 600 1.5 Outfit |
| article-template (2) | 48/36 800 1.0 (48 px) / 1.08 Outfit |  | 30/24 700 1.2 / 1.333 Outfit | 20/20 600 1.4 Outfit | 20/16 400 1.4 / 1.625 Outfit | 16/16 400 1.65 Outfit | 13/13 400, namn 600 tight Outfit | 11.0/? 700–800 normal Outfit |  |  |  |
| booking-confirmation (2) |  | 46/30 600 1.05 Outfit | 24/20.12 600 1.2 Outfit | 16.5/16.5 600 1.3 / 1.5 Outfit |  | 16/16 400 1.5 Outfit | 16.5/16.5 600 / 300 1.5 / 1.55 Outfit | 12/12 700 1.5 Outfit | 15/15 400 1.5 Outfit | 13.5/13.5 600 1.5 Outfit | 15/15 500 normal Outfit |
| certificates (2) |  |  | 36/26.76 400 1.2 Outfit | 32/24.54 400 1.3 Outfit |  |  |  |  |  |  |  |
| fore-efter-cro (2) |  |  | 32/24.54 400 1.2 Outfit |  | 18/16.12 400 1.45 Outfit |  | 14/12.12 600 1 Outfit |  |  |  |  |
| fotobedomningen (2) |  |  | 36/28 fråga 300 (#3b3f59) · svar 500 (#090b32) 1.18 / 1.15 desktop Outfit |  | 18/? 300 1.55 Outfit | 17/17 400 1.45 Outfit |  | 15/15 600 20px Outfit |  | 15/15 500 20px Outfit | 16/16 500 1 Outfit |
| hero-2-alternatives (2) | 48.0/34.0 700 1.07 Outfit |  |  |  | 20.0/16.0 400 1.6 Outfit |  | 13/13 500 1.38 Outfit |  |  | 13/14 400 None Outfit | 16/16 500 1 Outfit |
| hero-2-form (2) |  |  |  |  |  |  | 14.0/15.0 300 1.3 Outfit |  |  | 13.0/14.0 400 1.23 Outfit | 16.0/17.0 500 normal Outfit |
| main-cta (2) |  |  | 40.0/24.0 500 1.1 Outfit |  |  | 18.0/16.12 300 1.6 Outfit |  |  |  |  | 16.0/16.0 500 1.0 Outfit |
| main-form (2) |  |  | 26/21.9 500 1.35 Outfit |  | 18/16.17 200 1.3 Outfit | 16/16 400 1.5 Outfit | 12/12 300 1.5 Outfit |  |  | 14/15 500 1.35 Outfit | 16/16 500 normal Outfit |
| mini-menu (2) |  |  | 38.0/28.0 500 1.2 Outfit |  | 18.5/17.18 300 1.5 Outfit | 19/16.56 400 1.6 Outfit |  |  |  |  | 16.0/14.17 700 1.6 Outfit |
| thank-you (2) | 40/24.54 500 1.14 Outfit |  |  |  | 18/16.12 400 1.5 Outfit | 10/10 400 normal Outfit |  |  |  |  | 16/14.12 600 normal Outfit |
| visste-du-att (2) |  |  | 36.0/26.8 500 1.2 Outfit |  |  | 18/16.1 300 1.5 Outfit |  | 24.0/16.1 500 1.2 Outfit |  |  |  |
| battery-calculator (3) |  | 25.03/22.19 700 None Plus |  |  |  | 12.23/12.01 500 None Outfit | 14.0/13.39 500 / 700 None Plus |  | 44.08/40.26 700 1.0 Plus |  | 17.12/17.01 600 None Plus |
| offer-accepted (3) |  | 36/27 600 1.16  |  |  |  |  | 17/17 600 / 400 1.35 / 1.4  | 12/12 600 None  |  |  |  |
| picasso (3) |  |  |  |  |  |  |  |  |  |  | 16/14.12 400 1 Outfit |
| var-process-cro (3) |  |  | 40/28 500 1.05 desktop / 1.1 mobil Outfit | 22/19 500 1.2 Outfit | 16/15 400 1.45 Outfit | 17/17 500 1.5 (ärvd) Outfit | 14/? 400 1 Outfit | 12/11 500 1.45 Outfit |  | 20.0/19.0 600 på alla fyra (v2: 'fem roller på 600 gör H2:ans 500 till blockets lättaste feta') 1.25 / 1.25 / 1 / 1.3 Outfit |  |

Oklassade rader (134 st: kvittorader, chips, tabbar, tooltips m.m.) ligger i `_probes/out/typ-rader.json`.
