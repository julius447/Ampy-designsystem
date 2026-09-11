# Form, djup, rörelse: radier, skuggor, linjer, glas, gradienter, ornament, rörelse

Underlag: `_probes/out/radier.json`, `skuggor.json`, `rorelse.json` (03). Alla värden ordagranna ur källfilerna; skuggfärgen är konsoliderad till midnight-alfa där källan hade en near-miss-triplett (15,18,60 / 11,13,42 / 11,16,48 → 9,11,50).

## Radier per roll

| roll | token | värde | källa | drift |
|---|---|---|---|---|
| small | `--ampy-radius-small` | = --apradius-s 8→6.1 | LED/EV/energycalc/elkollen/elcentral 6 (tooltip, tick, option, chip) | 4 LED checkbox; 8 main-form input; 9 energycalc |
| field | `--ampy-radius-field` | = --apradius-m 12→10.1 | LED/EV/hero-2/fotobedomningen 12 | 10 elkollen/elcentral/hero-2 Z; 14 booking/hero-2-form; 8 main-form |
| button | `--ampy-radius-button` | 16px | cta-website + 16 källor (= legacy --radius/--radius-m) | live 20 (ROT) / 12 (GT); header 15; LED/EV/energycalc 12; elkollen/elcentral 10; hero-2 14; pill (thank-you, main-form, mini-menu) — B4 |
| card | `--ampy-radius-card` | = --apradius-l 20→16.3 | live + LED/EV/energycalc/eljour/certificates/visste/fore-efter/foto/mini-menu/main-cta (17 källor) | 14 elkollen/elcentral; 22 hero-ram/booking/rot-gt-panel; 27 hero-2-form; 15 main-form; 16 testimonials (legacy) |
| card-lg | `--ampy-radius-card-lg` | = --apradius-xl 32→24.5 | thank-you (--apradius-xl), rot-gt block 32, offer-accepted | hero-1 A-variant 32/28 |
| pill | `--ampy-radius-pill` | 999px (= --apradius-full) | live, testimonials, thank-you, mini-menu, hero-2, fotobedomningen | 99rem eljour; 9999px legacy/article |

Frekvens (antal källor per radievärde): 16 px ×17 · 20 px ×17 · 14 px ×11 · 12 px ×9 · 6 px ×8 · 10 px ×7 · 22 px ×7 · 8 px ×6 · 15 px ×4 · 32 px ×4

## Skuggor (ordagranna)

| roll | token | värde | källa | drift |
|---|---|---|---|---|
| subtle | `--ampy-shadow-subtle` | `0 1px 2px rgba(9,11,50,.06)` | LED/EV --shadow-sm (15,18,60 → midnight) | .04 elcentral/elkollen/foto/article |
| card | `--ampy-shadow-card` | `0 10px 30px rgba(9,11,50,.07)` | eljour-block --shadow-card (= 0 1rem 3rem), fotobedomningen mittlager, eljour-sticky-bar hörnkort | "husets" 0 0 16px 0 rgba(190,190,190,.19) (live ×14, testimonials .14, main-cta .4, var-process); elcentral 0 8px 28px rgba(11,13,42,.07); booking 0 18px 44px .09; visste 0 1.2rem 4rem .18; tredelade (fore-efter .04/.06/.05, certificates .10/.10/.07, foto .04/.07/.10, mini-menu) — B10 |
| raised | `--ampy-shadow-raised` | `0 16px 40px rgba(9,11,50,.14)` | LED/EV/battery --shadow-lg (resultatkort, lista, tooltip; 15,18,60 → midnight) + sticky-bar 0 16px 40px .16 | rot-gt 0 24px 50px -10px .18; thank-you 0 3rem 7rem .12; mini-menu 0 16px 40px -12px .28 |
| button | `--ampy-shadow-button` | `inset 0 1px 0 rgba(255,255,255,.45), 0 2px 4px rgba(9,11,50,.06), 0 10px 26px -6px rgba(94,199,160,.45)` | cta-website = rot-gt, fotobedomningen, hero-2 | hero-1:s kopia (navy .40 i st.f. grön glöd); picasso/elkollen/elcentral 0 0 16px rgba(241,241,241,.25) |
| button hover | `--ampy-shadow-button-hover` | `inset 0 1px 0 rgba(255,255,255,.5), 0 3px 6px rgba(9,11,50,.07), 0 16px 34px -8px rgba(94,199,160,.55)` | cta-website |  |
| ring-button | `--ampy-shadow-button-ring` | `inset 0 1px 0 rgba(255,255,255,.55), 0 2px 4px rgba(9,11,50,.06), 0 10px 26px -6px rgba(94,177,191,.55)` | cta-website = main-cta, eljour-sticky-bar |  |
| solid teal glow | `--ampy-shadow-glow-action` | `0 4px 12px -5px rgba(0,169,145,.5)` | header-CTA (hero-1/website-blocks) | thank-you 0 1rem 2.4rem .3; energycalc hover -.8rem .42; main-form .45 |
| photo | `--ampy-shadow-photo` | `0 18px 40px -20px rgba(9,11,50,.26)` | main-cta porträtt | hero-2 Z 0 28px 60px -28px rgba(0,0,0,.65) |
| --apshadow-xs…xl (fixade) | `--apshadow-*` | `0 1px 2px / 0 1.5px 3px / 0 2px 6px / 0 3px 12px / 0 6px 48px var(--shadow-primary)` | global-variables.css + --shadow-primary rgba(9,11,50,.10) (thank-you v1) | var none på live (odefinierad --shadow-primary) |

Skuggfärg-tripletter i källorna: rgb(9,11,50) ×78 i 21 källor · rgb(15,18,60) ×25 i 10 källor · rgb(255,255,255) ×25 i 14 källor · rgb(0,169,145) ×17 i 10 källor · rgb(94,177,191) ×9 i 8 källor · rgb(190,190,190) ×8 i 5 källor · rgb(0,0,0) ×7 i 4 källor · rgb(11,13,42) ×7 i 2 källor

## Linjer

| roll | token | värde | källa | drift |
|---|---|---|---|---|
| hairline | `--ampy-line` | rgba(9,11,50,.14) | var-process (enda hairline), LED .12 (15,18,60), fore-efter/certificates inset .07 | #e6ecf6 eljour-familjen, #dbe4f0 header, #e3e5ed/#ebedf3 elkollen/elcentral, energycalc fem värden |
| kontrollkant | `--ampy-line-strong` | rgba(9,11,50,.48) (3,39:1) | booking (WCAG 1.4.11) | #5f6480 fotobedomningen (5,8:1); #e3e5ed elkollen/elcentral inputs (1,26:1); 2px transparent main-form |
| på mörkt | `--ampy-on-dark-line` | rgba(255,255,255,.14) | LED hr, hero-2 --ap-hairline, EV | .12 energycalc; .16/.18 rot-gt |

## Glas

| roll | token | värde | källa | drift |
|---|---|---|---|---|
| ljust glaskort | `--ampy-bg-glass + --ampy-glass-border + --ampy-glass-blur` | rgba(255,255,255,.72) · 1px rgba(255,255,255,.9) · blur(16px) saturate(1.1) · inset 0 1px 0 rgba(255,255,255,.6) | thank-you v1 (auk 2) | offer-accepted .74 + blur 16; booking .85 UTAN blur; website-blocks go-cirkel .16 + blur 4 — B15 |
| mörkt glas | `--ampy-bg-glass-dark` | rgba(9,11,50,.82) + blur(8px) saturate(150%) + 1px rgba(255,255,255,.16) | fore-efter chip/ledtråd | hero-2-form #090b32 + 156.51° → #5eb1bf .76 + blur 30 (underkänd av hero-2-alternatives) |

## Gradienter (kanoniska två + ytbehandling) — allt annat är drift (se farg.md driftlistan "14 → 2")

| roll | token | värde | källa |
|---|---|---|---|
| handlingsgradient | `--ampy-action-gradient` | `linear-gradient(120deg, #55ff9a 0%, #5eb1bf 100%)` | cta-website = hero-1, rot-gt, foto, hero-2, elkollen, elcentral, picasso, booking shared (10+) |
| ring-gradient | `--ampy-action-gradient-ring` | `linear-gradient(120deg, #b6f2ff 0%, #5eb1bf 100%)` | cta-website = main-cta, sticky-bar, hero-2 Z/E (141° i picasso/elkollen/elcentral) |
| ljus aurora | `--ampy-aurora-light` | `4 radialer (teal .12/.08, crystal-blue .48, sublime-green .28) på sky-mist` | thank-you = booking = offer |
| mörk glöd (ytbehandling) | `--ampy-bg-dark-glow` | `radial teal .28 @90% -10% + emerald .16 @-10% 110%` | LED = EV = battery; drift energycalc 3 radialer, visste-du-att teal .42 + neon .18 |

## Ornament (var de används)

| typ | var | notering |
|---|---|---|
| blixt (varumärkesglyf) | visste-du-att kicker (18 px solid blixt-SVG, "sanktionerat motiv"); brandbok s.3/16/18 (glyph, ikoner, former ur blixten/a:t); skill-reference bolt.svg (egen, ej byråns) | enda blocket i produktion som bär blixten; brandbokens ikonregel "solida" bryts överallt (linjeikoner stroke 1.6–3) |
| vågor | live ROT programmatic-bg-overlay-blue.svg (80 % nere-höger) + GT Vector-2-2.svg (404); rot-gt-familjen tre hero-vågor #eef4fc/#e6eff9 masktonade; main-cta Vector-3 bg-våg 44 % + overlay-våg 50 %; certificates v2 tre inline-SVG-band (#b6f2ff .30 / #fff .26 / #8fd4e0 .44); hero-2 Z tre vågor; footer shape-divider (död) | ingen tokeniserad form; certificates-regeln "inline-SVG med preserveAspectRatio=none så den aldrig klipps" är den enda hållbara |
| blobbar | rot-gt-panelen tre blobbar #0b0d2a/#010328 ("ur heron"); article LeadMagnet glow-blob | #010328 = livedefekt enligt hero-2 ("ALDRIG") |
| aurora-hörn (SVG) | thank-you/offer/booking aurora-top/bottom.svg (crystal-blue/sublime-green → sky-mist; seafoam → teal) | bara CRM-/tack-flödet |
| puls | header CTA pulse-dot (10 px mint, 1.6 s); ring-CTA ampyRing (2.8 s vit ring); eljour statuspill 2 s + mobil-CTA-puls; thank-you halo 4 s infinite | tre olika pulser; halo är enda oändliga animationen utanför chippen |
| penseldragsringar | live ROT/GT handritade ring-SVG 95/55 px + JS-streckade connector-linjer #5eb1bf→#1d234e | ersatt i rot-gt-familjen av förloppsbåge (teal stroke 3) |
| foto-veil | hero-1 --ampy-scrim-hero (98° .68→.02 + 0° .38→0); hero-2 scrim-bastant/-latt (kontrastmätta); main-form platt .55; energycalc trust 103° .94→.28; mini-menu radial .30→.56 + body-scrim |  |

## Rörelse

| roll | token | värde | källa | drift |
|---|---|---|---|---|
| fast | `--ampy-dur-fast` | 160ms | cta-website (.16s) = hero-1, main-cta, rot-gt, foto, live hero-CTA (8) | 150 LED/EV/elkollen/booking (9); 120 elcentral; 140 energycalc; 180 hero-2 |
| base | `--ampy-dur-base` | 200ms | header --t .2s ease-out (26 användningar) + thank-you, main-form, mini-menu, elkollen, elcentral (11) | 220 energycalc/elcentral/booking; 240 elkollen; 280 mini-menu/main-form |
| slow | `--ampy-dur-slow` | 300ms | LED slider/staplar, eljour --m, energycalc --t-slow, Bricks fadeIn 0.3 s (13); "tak 300 ms" (hero-2, foto) | 350 testimonials; 400 rot-gt; 520/640 mini-menu |
| ease | `--ampy-ease` | cubic-bezier(.2,.6,.2,1) | live site-css --ease + mini-menu, energycalc, elcentral, elkollen, main-form, footer (7) | cubic-bezier(.2,0,.2,1) LED-kitet; cubic-bezier(.16,.84,.44,1) thank-you/booking; "ease" i CTA-shorthand |
| ease-out | `--ampy-ease-out` | cubic-bezier(.16,1,.3,1) | energycalc, mini-menu, main-form | ease-out (header); cubic-bezier(.33,1,.68,1) thank-you |
| lyft | `--ampy-lift` | translateY(-1.5px) | cta-website = hero-1, rot-gt, foto, main-cta | -1 picasso/elcentral/EV; -2 energycalc/certificates/thank-you; -4 mini-menu kort; 0 sticky-bar (aldrig på bottenremsa) |
| hover-filter | `--ampy-hover-filter` | saturate(1.06) brightness(1.02) | cta-website | saturate(1.08) ring; 1.05 picasso; brightness(1.06) main-form; opacity .92 LED/EV |
| reveal-stagger | `(ej token)` | 40 → 260/280 ms i 40–60 ms-steg (LED/EV), 45 ms (energycalc/elcentral), 50–360 ms (mini-menu) | LED, EV, energycalc, elcentral, mini-menu | ingen kanon — mönster: reveal 300 ms opacity + 6–12 px translateY, staggat |
| reduced-motion | `(base.css)` | alla auk 1-källor nollställer animation + transition | hero-1, cta-website, LED, EV, energycalc, elcentral, elkollen, eljour, testimonials | article-template saknar (defekt) |

Durations i källorna: 300 ms ×13 · 200 ms ×11 · 150 ms ×9 · 160 ms ×8 · 280 ms ×7 · 180 ms ×6 · 220 ms ×5 · 250 ms ×4 · 400 ms ×3 · 260 ms ×3. Easings: `ease` ×18 · `ease-out` ×8 · `cubic-bezier(.2,.6,.2,1)` ×5 · `linear` ×5 · `ease-in-out` ×3 · `cubic-bezier(.16,.84,.44,1)` ×2.
