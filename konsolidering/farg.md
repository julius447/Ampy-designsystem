# Färg: kanon, källor, kontrast, drift

Underlag: `_probes/out/farg-frekvens.json` (682 färgrader ur 30 JSON, 257 unika), `_probes/out/kontrast.json`. Antal = antal KÄLLOR som bär färgen (inte förekomster). Semantik = vilken `--ampy-*`-roll som pekar på primitiven.

## Primitiva färger (lager 1 = live verbatim, lager 1c = tillägg med ≥2 källor auk 1–2)

| token | hex | lager | roll(er) | källor | auk 1 | mot vit | mot sky-mist | mot midnight | semantik |
|---|---|---|---|---|---|---|---|---|---|
| `--apmidnight-blue` | #090b32 | 1 | mörk yta, all rubrik-/brödtext, fokusring, skuggfärg (alfa) | 29 | 14 | 19.0 | 17.98 | 1.0 | --ampy-bg-dark, --ampy-ink, --ampy-ink-body, --ampy-focus, --ampy-line (alfa) |
| `--apteal-core` | #00a991 | 1 | accent: ikoner, valda kanter, ringar, fyllningar utan text; solid header-CTA | 25 | 12 | 2.96 | 2.81 | 6.41 | --ampy-action, --ampy-bg-tint-action (alfa) |
| `--apemerald-flow` | #39c281 | 1 | success, "efter"-stapel, slider-fyllning | 9 | 5 | 2.28 | 2.16 | 8.33 | --ampy-success |
| `--apseafoam-mint` | #5cc5b6 | 1 | aurora-SVG-stopp (thank-you/offer) | 3 | 1 | 2.08 | 1.96 | 9.15 | (dekor) |
| `--apneon-mint` | #55ff9a | 1 | handlingsgradientens start, pulsprick, EFTER-chip, fokus på mörkt, stjärnor (testimonials-kort) | 22 | 11 | 1.3 | 1.23 | 14.61 | --ampy-action-gradient, --ampy-focus-on-dark |
| `--apsublime-green` | #a0fbc9 | 1 | ljus aurora (radial .28) | 4 | 1 | 1.23 | 1.16 | 15.5 | --ampy-aurora-light |
| `--apcrystal-blue` | #b6f2ff | 1 | ring-gradientens start, ljus aurora (.48), footer-gradient, certificates-våg | 15 | 5 | 1.23 | 1.16 | 15.5 | --ampy-action-gradient-ring, --ampy-aurora-light |
| `--apaqua-frost` | #ddf9fd | 1 | definierad, 0 användningar (live --color-29 #e5faff är en annan) | 1 | 1 | 1.1 | 1.04 | 17.23 | (oanvänd) |
| `--appure-white` | #ffffff | 1 | kort, text på mörkt, alfa-serie på mörkt | 26 | 13 | 1.0 | 1.06 | 19.0 | --ampy-bg-surface, --ampy-on-dark* |
| `--apsky-mist` | #f5f9ff | 1 | sidbakgrund, subtil yta, ljus aurora-bas | 21 | 10 | 1.06 | 1.0 | 17.98 | --ampy-bg-page, --ampy-bg-subtle |
| `--apmilk-white` | #f5f5f5 | 1 | definierad + alfa-serie; 0 användningar i blocken | 1 | 1 | 1.09 | 1.03 | 17.42 | (oanvänd) |
| `--apgray-white` | #d9d9d9 | 1 | definierad; 0 användningar | 1 | 1 | 1.41 | 1.34 | 13.46 | (oanvänd) |
| `--apcharcoal-gray` | #333333 | 1 | live --color-20: brödtext mobil ROT/GT, rot-gt-familjens p, booking body-ink, hero-2 input-text | 6 | 3 | 12.63 | 11.96 | 1.5 | drift → --ampy-ink-body |
| `--apdarkest-black` | #1e1e1e | 1 | energycalc ink, rot-gt rubrik-ink, footer h3, mini-menu pill-text, hero-2 Z submit-text | 9 | 5 | 16.67 | 15.78 | 1.14 | drift → --ampy-ink |
| `--apdeepest-blue` | #0e0f15 | 1 | definierad; 0 användningar | 0 | 0 | 19.13 | 18.11 | 1.01 | (oanvänd) |
| `--appure-black` | #000000 | 1 | main-form asterisk; logo-PNG:er (#000) | 2 | 1 | 21.0 | 19.88 | 1.11 | (punkt) |
| `--apsecondary-teal` | #5eb1bf | 1c | handlingsgradientens slut, ring-gradientens slut, live fokus/highlight (--color-7), mini-menu pill, certificates gradient | 17 | 7 | 2.47 | 2.33 | 7.7 | --ampy-action-gradient(-ring) |
| `--apteal-deep` | #007a69 | 1c | solid knapp med vit text, textlänk, sista H1-rad (diagnostik) | 2 | 2 | 5.27 | 4.98 | 3.61 | --ampy-action-strong |
| `--apteal-tint` | #e3f6f1 | 1c | pill/chip-yta (eljour-familjen) | 3 | 1 | 1.12 | 1.06 | 16.93 | (pill) |
| `--apindigo` | #282a53 | 1c | knapptext på gradient | 6 | 3 | 13.58 | 12.85 | 1.4 | --ampy-ink-on-action, --ampy-action-gradient-on |
| `--apnavy-ink` | #3b3f59 | 1c | brödtext i eljour-familjen | 3 | 1 | 10.29 | 9.74 | 1.85 | drift → --ampy-ink-body (B3) |
| `--apnavy-muted` | #565e82 | 1c | dämpad text | 8 | 5 | 6.33 | 5.99 | 3.0 | --ampy-ink-muted |
| `--apnavy-faint` | #6a7190 | 1c | svag text | 2 | 2 | 4.8 | 4.54 | 3.96 | --ampy-ink-faint |
| `--apamber` | #f0af38 | 1c | "före"-stapel, varning i diagram | 3 | 2 | 1.93 | 1.82 | 9.85 | --ampy-warn |
| `--apsignal-red` | #b3261e | 1c | fel, akut | 3 | 1 | 6.54 | 6.19 | 2.91 | --ampy-error |
| `--apsignal-red-tint` | #fdeceb | 1c | fel-/akut-bakgrund | 3 | 1 | 1.14 | 1.08 | 16.62 | --ampy-error-tint |
| `--apamber-tint` | #fff4e0 | 1c | varnings-bakgrund | 2 | 1 | 1.09 | 1.03 | 17.43 | --ampy-warn-tint |
| `--apverdict-green` | #0f6e56 | 1c | besked-accent + success-text | 2 | 2 | 6.2 | 5.87 | 3.06 | --ampy-success-ink |
| `--apverdict-amber` | #876507 | 1c | besked-accent + varningstext | 2 | 2 | 5.39 | 5.1 | 3.52 | --ampy-warn-ink |
| `--apverdict-red` | #7a1623 | 1c | besked-accent + akut-text | 2 | 2 | 10.68 | 10.11 | 1.78 | --ampy-error-ink |
| `--apverdict-blue` | #0d568c | 1c | besked-accent info | 2 | 2 | 7.7 | 7.29 | 2.47 | --ampy-info-ink |
| `--apgoogle-gold` | #fbbc04 | 1c | Google-stjärnor | 2 | 1 | 1.71 | 1.62 | 11.12 | (stjärnor, B12) |

Alfa-serierna (`--apmilk-white-5…90`, `--apdarkest-black-5…90`, `--appure-black-5…90`, 30 tokens) ligger i lager 1 verbatim; ingen källa använder dem (blocken skriver egna rgba(255,255,255,x)/rgba(9,11,50,x)). Se `--ampy-on-dark-*` för de alfa-steg som faktiskt används (.92/.66/.55/.14/.06).

## Semantisk mappning (lager 2)

| roll | token | värde | kommentar |
|---|---|---|---|
| sidyta | `--ampy-bg-page` | --apsky-mist | 21 källor |
| kort | `--ampy-bg-surface` | --appure-white | 26 källor |
| subtil yta | `--ampy-bg-subtle` | --apsky-mist | "två ytor"-regeln (fotobedomningen, energycalc) |
| mörk yta | `--ampy-bg-dark` | --apmidnight-blue | + --ampy-bg-dark-glow (LED-receptet) — B9 |
| glas | `--ampy-bg-glass` | rgba(255,255,255,.72) + blur(16px) | thank-you — B15 |
| bläck | `--ampy-ink` | --apmidnight-blue | rubriker, strong |
| brödtext | `--ampy-ink-body` | --apmidnight-blue | B3 |
| dämpad | `--ampy-ink-muted` | --apnavy-muted #565e82 | 6,33:1 |
| svag | `--ampy-ink-faint` | --apnavy-faint #6a7190 | 4,80:1 |
| text på gradient | `--ampy-ink-on-action` | --apindigo #282a53 | 5,51:1 på #5eb1bf |
| accent | `--ampy-action` | --apteal-core | aldrig som text (2,96:1) |
| text/solid | `--ampy-action-strong` | --apteal-deep #007a69 | 5,27:1 |
| hover | `--ampy-action-hover` | #008d79 | header |
| handlingsgradient | `--ampy-action-gradient` | 120° #55ff9a → #5eb1bf | CTA-website |
| ring-gradient | `--ampy-action-gradient-ring` | 120° #b6f2ff → #5eb1bf | CTA-website |
| success | `--ampy-success / -ink / -tint` | #39c281 / #0f6e56 / rgba(57,194,129,.12) |  |
| varning | `--ampy-warn / -ink / -tint` | #f0af38 / #876507 / #fff4e0 | warn scopad till diagram/besked |
| fel | `--ampy-error / -ink / -tint` | #b3261e / #7a1623 / #fdeceb | B13 |
| info | `--ampy-info-ink` | #0d568c |  |
| fokus | `--ampy-focus / -on-dark / -ring` | #090b32 / #55ff9a / 0 0 0 3px rgba(0,122,105,.9) | B14 |
| linje | `--ampy-line / -strong` | rgba(9,11,50,.14) / .48 | kontrollkant ≥3:1 |

## Driftlistan — vad som byts ut var

### Navy i sju värden

- Uppmätt: #090b32 (--apmidnight-blue, 29 källor) · #0f123c (hero-1/website-blocks/LED/EV/mini-menu/rot-gt, 7) · #0b1030 (thank-you/booking/offer, 3) · #090c34 (main-cta, Bricks --color-3) · #1b1d4b (rot-gt-panel/hero-2 Z, Bricks --color-18) · #16183f, #17204a (hero-2 Z-kort/navy-soft) · #00011e/#01021f/#010033 (footer), #0b0f30→#2d516d (testimonials), #0d1350…#05061f (mini-menu aurora)
- **Kanon:** --apmidnight-blue #090b32 för ALLA mörka ytor och allt bläck
- **Byts ut:** #0f123c → midnight (near-miss, 6 enheter); #0b1030 → midnight; #090c34 → midnight; rot-gt/hero-2 Z-panel #1b1d4b → midnight (eller --ampy-bg-dark-glow); testimonials-gradient → midnight + glöd (B9); footer-gradient → midnight (B-lista: footer riktning)

### Fem tealer (plus fem till)

- Uppmätt: #00a991 teal-core (25) · #5eb1bf brandbokens sekundärteal (17) · #007a69 elcentral/elkollen "strong" (2 auk 1) · #007d6b EV · #00806e/#00b89e/#00c4a7/#19c39e energycalc · #0a8f7c/#0a6e58 eljour-familjen (4/3) · #016a5d/#017666/#018271 CRM-flödet · #1cc4af LED/main-form (oanvänd) · #008d79 header hover · #00a88f Bricks --color-15 (footer 5.0)
- **Kanon:** TVÅ tealer: --apteal-core (accent, aldrig text) + --apteal-deep #007a69 (text, länk, solid knapp med vit text). --apsecondary-teal #5eb1bf bara som gradientslut/ring (aldrig text, 2,47:1).
- **Byts ut:** alla mörka tealer → --apteal-deep; #00c4a7 (teal på mörkt) → --apteal-core (6,41:1 på midnight räcker); #1cc4af → bort; #00a88f → --apteal-core; hover → --ampy-action-hover #008d79

### #0b1030-bläcket och de andra bläcken

- Uppmätt: #0b1030 + rgba(11,16,48,.62/.44) (thank-you, booking, offer) · #0f123c (7) · #1f1f1f live ROT h2 (--color-8) · #1e1e1e (energycalc, rot-gt rubrik, footer h3) · #363636 live body (Bricks-default) · #333 (rot-gt p, booking, hero-2 input) · #3b3f59 eljour-familjen · #171717/#4d4d4d/#6a6a6a main-form (Svea) · #1a1d2e article
- **Kanon:** --ampy-ink = midnight; --ampy-ink-body = midnight (B3); --ampy-ink-muted = #565e82; --ampy-ink-faint = #6a7190
- **Byts ut:** #0b1030/#0f123c/#1f1f1f/#1e1e1e/#171717 → --ampy-ink; #363636/#333/#3b3f59/#4d4d4d/#1a1d2e → --ampy-ink-body (B3); rgba(11,16,48,.62)/#5f6480/#5a5d7a/#51607a/#6a6a6a → --ampy-ink-muted; #646b88/#686b80/#8a8da5 → --ampy-ink-faint

### Dämpad text (muted) i sex värden

- Uppmätt: #565e82 (8: header, LED, EV, mini-menu, rot-gt, booking) · #5f6480 (3: eljour, foto, sticky) · #5a5d7a (2: elkollen, elcentral) · #51607a energycalc · rgba(11,16,48,.62) thank-you · rgba(9,11,50,.72) var-process
- **Kanon:** --apnavy-muted #565e82 (6,33:1)
- **Byts ut:** de andra fem → --ampy-ink-muted

### Hairlines i nio värden

- Uppmätt: #e6ecf6 (eljour-familjen) · #dbe4f0 (header) · #e3e5ed/#ebedf3 (elkollen/elcentral) · rgba(15,18,60,.12) (LED-kitet) · rgba(9,11,50,.14) (var-process) · rgba(11,16,48,.09/.16/.48) (booking) · #eaeef5 (fore-efter) · #e1e8f4/#d7deeb/#dbe4f2/#eef2f9/#e3e9f5 (energycalc) · #d5d5dc (drawer)
- **Kanon:** --ampy-line rgba(9,11,50,.14) (dekorativ) + --ampy-line-strong rgba(9,11,50,.48) (kontrollkant ≥3:1)
- **Byts ut:** alla solida hairlines → --ampy-line; fältkanter #e3e5ed (1,26:1) → --ampy-line-strong

### Fel/varning: sex röda, tre amber, tre gröna

- Uppmätt: röd: #b3261e (3), rgb(214,76,76) LED/EV (2, 4,2:1), rgb(214,64,64) elkollen, #e00000 main-form, #e5484d/#e24b4a hero-2, #ff8a8a energycalc, teal (hero-2-form) · amber: #f0af38 LED/EV, #f0b429 energycalc, #f5af19 elkollen/elcentral, #e3a008 eljour-prick, #8a6116 booking · grön: #39c281 emerald (9), #1f9d6b main-form, rgb(54,178,92)/rgb(27,132,71) elkollen, #1bd365/#00ad48 testimonials, #0f6e56 elcentral/elkollen text
- **Kanon:** --ampy-error #b3261e (6,54:1), --ampy-error-ink #7a1623; --ampy-warn #f0af38 (diagram/mörkt), --ampy-warn-ink #876507; --ampy-success #39c281 (fyllning), --ampy-success-ink #0f6e56
- **Byts ut:** LED/EV rgb(214,76,76) → #b3261e (4,2:1 underkänd som text); hero-2-form fel-i-teal → #b3261e; testimonials #1bd365/#00ad48 → --apemerald-flow; energycalc #f0b429 → --apamber

### Kortskuggor i fem familjer

- Uppmätt: rgba(190,190,190,.19/.14/.4) "husets" (live, testimonials, main-cta, var-process) · rgba(15,18,60,.06/.08/.14) LED-kitet · rgba(9,11,50,…) eljour-familjen, fore-efter, certificates, thank-you, visste, mini-menu · rgba(11,13,42,.04/.07/.10) elkollen/elcentral · rgba(11,16,48,…) booking; rgba(181,181,181,.14) hero-2-form; rgba(241,241,241,.25) picasso-glöd
- **Kanon:** EN skuggfärg: midnight-alfa. --ampy-shadow-card 0 10px 30px rgba(9,11,50,.07); -raised 0 16px 40px .14; -subtle 0 1px 2px .06
- **Byts ut:** alla gråa (190/181/241) och near-miss-navyer (15,18,60 / 11,13,42 / 11,16,48) → rgba(9,11,50,x). Beslut B10 om husets grå skugga.

### Gradienter: 14 → 2

- Uppmätt: 120° #55ff9a→#5eb1bf (handling, 10+) · 120° #b6f2ff→#5eb1bf (ring) · ljus aurora (thank-you/booking/offer) · 282.84° #55ff9a→#00ffda (hero-2-form) · 135° #00b89c→#018271 (thank-you knapp) · 100° #009e88→#17c6a0 (main-form knapp) · 146° #055a4b→#0a8169 (eljour nödknapp) · 145° #c7f5ff→#5eb1bf (live ROT hover) · 90° #090b32→#5eb1bf (certificates) · −51° #70becb→#bbf5ff→#b6f2ff (prefooter) · −17° #00011e→#090b32 (footer) · −27° #0b0f30→#2d516d (testimonials-kort) · GT-rubrik #1f1f1f→#57ff9a→#33995c; main-cta text hsl(171 95% 41%)→#5eb1bf; main-form rubrik #12b09a→#55d199 · 92°/135° article (#326afd→#55ff9a)
- **Kanon:** --ampy-action-gradient (120° neon-mint → sekundärteal, med ring-varianten) + --ampy-aurora-light. Allt annat = drift.
- **Byts ut:** knapp-gradienterna i hero-2-form/thank-you/main-form → --ampy-action-gradient; textgradienter → bort (ägaren ogillar gradienttext); nödknappen → --apteal-deep solid (B6); certificates/footer/testimonials-ytor → midnight (+ glöd)

### Cobalt och lime (brandbok) vs teal (produktion)

- Uppmätt: #326afd cobalt: 0 i live, 73 i artikelmallen (Tailwind electric) · #92ec47 lime: 0 överallt · #00a991 teal-core: saknas i brandboken
- **Kanon:** teal (ägarbeslut 2026-07) — se B1
- **Byts ut:** artikelmallens electric #326afd → --apteal-deep (länkar) / --apteal-core (accent)

