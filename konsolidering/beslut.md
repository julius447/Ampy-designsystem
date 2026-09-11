# Beslut som inte kan tas utan Julius

Numrerade. Varje punkt: alternativen · vad varje källa gör · min rekommendation med skäl · konsekvens.
Kanon i `system/tokens.css` bär min rekommendation tills du säger något annat; allt märkt "B<n>" i tokens.css pekar hit.
Siffror kommer från `_probes/out/` (frekvens, kontrast, mätning). "Källor" = antal inventeringskällor som bär värdet.

---

## B1 · Accentfärg: teal (produktion) eller cobalt (brandbok)?

- **Alternativ:** (a) teal `#00a991` som ensam accent, brandboken uppdateras (v2); (b) cobalt `#326afd` återinförs enligt boken; (c) båda.
- **Källorna:** teal-core i 25 av 30 källor (12 auk 1); cobalt 0 gånger i live-CSS och 0 i alla byggda block utom artikelmallen (73 användningar som Tailwind "electric"). Brandboken (s.7) har cobalt som primär accent och saknar teal helt. Lime `#92ec47` 0 överallt.
- **Rekommendation:** (a). Ägarbeslutet från djupanalysen 2026-07 ("teal görs officiell ensam accent") är redan taget; det som återstår är att brandboken skrivs om så den slutar motsäga sajten (teal in, cobalt/lime ut eller nedgraderade till "kampanj/tryck").
- **Konsekvens:** artikelmallens `electric` byts till `--apteal-deep` (länkar) / `--apteal-core` (accent). Brandbok v2 = ett eget uppdrag (paletten, gradienterna s.11, ikonfärg s.16).

## B2 · Rubrikvikt: 700 display + 500 H2 (som i dag) eller Black 900 (boken)?

- **Alternativ:** (a) display/h1 700, h2 500, h3 600 (uppmätt praxis); (b) Black 900 på titlar enligt brandbok s.14; (c) 900 bara på hero-siffror (energycalc-modellen).
- **Källorna:** display 700 i hero-1 (ägargodkänd), hero-2, elcentral, LED-siffra; 500 på H2 i 6 källor (400 i 5, 600 i 3); 900 finns bara på energycalcs anchor-siffra; 800 i artikelmallen och mini-menu-prototypen. Brandbokens egna sidrubriker är satta i Light, inte Black.
- **Rekommendation:** (a) med (c) som tillåten variant för hero-siffror. Ingen ägargodkänd yta använder 900; hero-1 är "PERFEKTION" med 700.
- **Konsekvens:** `--ampy-w-display: 700`, `--ampy-w-heading: 500`. Brandbokens vikt-tabell s.14 uppdateras (B1). Rot-gt-familjens 450/550 (variabelfont-mellanlägen) utgår.

## B3 · Brödtext: vilken färg och vikt?

- **Alternativ:** (a) midnight `#090b32` / 300 (min kanon); (b) `#363636` / 300 (live Bricks-default, ingen token); (c) `#3b3f59` / 400 (eljour-familjen, 10,3:1); (d) `#0f123c` / 400 (header, LED-kitet, mini-menu — "nya block"); (e) midnight-alfa .72 / 300 (var-process).
- **Källorna:** navy-familjen i full styrka som brödtext i 11 källor efter konsolidering av near-miss `#0f123c` → midnight (hero-1, website-blocks, LED, EV, elkollen, elcentral, testimonials V1, mini-menu, fore-efter, rot-gt-wrapper, booking `#0b1030`); `#363636` i 3 (live, footer, main-cta); `#3b3f59` i 3 (eljour, fotobedomningen, sticky-bar); `#333` i 2. Vikt 300 på löpande text i 10 källor + brandbokens "Light = lång text"; 400 i 9 (verktyg/diagnostik/CRM).
- **Rekommendation:** (a): ett bläck (midnight) för både rubrik och brödtext, hierarki genom vikt (300 brödtext, 500/600/700 rubriker) — brandbokens modell och energycalcs "single font, hierarchy by weight". Dämpad text får `#565e82`. Alternativet (c) är det bäst dokumenterade (kontrastsiffror i koden) men skapar en tredje navy.
- **Konsekvens:** `--ampy-ink-body: var(--apmidnight-blue)`, `--ampy-w-body: 300`, UI-text 400 (`--ampy-w-ui`). Live body-färgen `#363636` (Bricks-default) skrivs över i temat. Kalkylatorernas `rgb(15,18,60)` byts till midnight (6 enheters skillnad, osynligt).

## B4 · Knappradie: 16 (CTA-biblioteket) eller live Bricks 12/20?

- **Alternativ:** (a) 16 px (CTA-website + 16 källor = legacy `--radius`/`--radius-m` i global-variables); (b) `--apradius-m` 12→10 (LED/EV/energycalc, GT-knappen); (c) `--apradius-l` 20→16 (live ROT-knappen, = kortradien); (d) 14 (hero-2 primitiver, hero-2-form, header 15); (e) pill 999 (thank-you, main-form, mini-menu).
- **Källorna:** 16 i 17 källor (auk 1: cta-website, hero-1, live legacy, testimonials, elkollen, elcentral, energycalc); 20 i 17 (men som KORT-radie); 14 i 11; 12 i 9; pill i 6.
- **Rekommendation:** (a). Knappbiblioteket är auktoritet 1 för knappar, 16 är redan ett live-tokenvärde (legacy `--radius: 16px`) och det mest spridda; en radie mellan fält (12) och kort (20) läser som en egen roll.
- **Konsekvens:** `--ampy-radius-button: 16px` fast (inte clamp). Live ROT-knapp (20) och GT-knapp (12), header-CTA (15), verktygens 12 och hero-2:s 14 ändras. Pill-knappar (thank-you, main-form) = beslut om de ska finnas alls (jag säger nej: en knappform).

## B5 · Teal-kontrast: teal-core som knappyta/text (2,96:1)?

- **Alternativ:** (a) solid knapp = `--apteal-deep #007a69` med vit text (5,27:1), teal-core bara som accent (ikoner, ringar, fyllningar utan text); (b) behåll header-CTA:n teal-core + vit 600 (2,96:1, ägargodkänd header); (c) teal-core-yta med indigo-text `#282a53` (4,58:1 = AA).
- **Källorna:** teal-core + vit text: header (auk 1), LED, energycalc, main-form (gradient runt teal). Mörkad teal + vit: EV `#007d6b`, elcentral/elkollen `#007a69` ("strong, AA"), energycalc seg-pill `#00806e` ("a11y-DERIVED, NOT a new token"). Teal-core som text förbjuds uttryckligen i var-process (2,80:1), fotobedomningen (2,96:1), sticky-bar (2,97:1) och elkollen ("teal aldrig text").
- **Rekommendation:** (a). Tre auk 1-verktyg har redan löst det med `#007a69`; det är den enda mörka tealen som finns i två auk 1-källor. Header-CTA:n får antingen teal-deep-yta eller (c) indigo-text — jag föreslår teal-deep så att solid knapp = en färg överallt.
- **Konsekvens:** header-CTA, LED-CTA, energycalc-CTA, main-form-knappen byter yta till teal-deep (synbar men liten förändring). `--ampy-action` (accent) och `--ampy-action-strong` (text/solid) är två tokens med två regler.

## B6 · Två primära knappar (gradient vs solid) + nödknappen

- **Alternativ:** (a) gradient-CTA i block/hero + solid teal-deep i verktyg/diagnostik/formulär (dagens praxis, två primärer); (b) gradient överallt; (c) solid överallt (gradienten pensioneras); (d) eljourens mörkgröna nödknapp (146° #055a4b→#0a8169) behålls som tredje språk eller blir solid teal-deep.
- **Källorna:** gradient i 10+ källor (auk 1: cta-website, hero-1, elkollen, elcentral rail); solid i 7 (auk 1: header, LED, energycalc, elcentral, elkollen); nödknappen i eljour-block (auk 1), sticky-bar fork, hero-2 E. Picasso, elkollen och elcentral kallar samma gradientknapp "1:1 med live" i tre höjder (38/58/58). Fotobedomningen kör regeln "EN handlingsgradient per block, kvitto-Ring solid navy".
- **Rekommendation:** (a) med regeln "gradient = sidans EN konverterings-CTA, solid teal-deep = alla knappar inne i verktyg/formulär/kort; aldrig två gradienter i samma vy". Nödknappen → solid `--apteal-deep` (4,8:1 vit) så eljour-sidan inte har tre CTA-språk; puls/chip får bära "jour öppen".
- **Konsekvens:** eljour-block, sticky-bar och hero-2 E ändras; Picassos 38 px-variant utgår (58 px = kanon).

## B7 · Plus Jakarta Sans och JetBrains Mono: kapa?

- **Alternativ:** (a) Outfit ensamt, siffror i Outfit med `tabular-nums` (energycalc, rot-gt, booking, hero-2 gör så); (b) behåll PJS för rubriker/UI i kalkylatorkitet + mono för inputsiffror; (c) Outfit + mono bara för inputvärden.
- **Källorna:** Outfit-only i 24 källor inkl. brandboken ("enda typsnittet"), live, energycalc ("single font, hierarchy by weight"), elkollen v7 ("PJS is removed"). PJS i LED, EV, battery, elcentral (rubriker) och footer "5.0" (Bricks-arv). JetBrains Mono i LED/EV/battery inputsiffror. LED laddar Google Fonts två gånger (GDPR-defekt).
- **Rekommendation:** (a). Brandbok + live + det renaste verktyget (energycalc) + Elkollens egen v7-lärdom pekar åt samma håll; tabular-nums löser siffrorna.
- **Konsekvens:** LED/EV/battery/elcentral byter rubriktypsnitt (elcentral skiljer sig från syskonet elkollen i dag); Google-Fonts-anropen försvinner. `--ampy-font-mono` finns bara som kommenterat förslag i tokens.css.

## B8 · Rotstorlek: 62,5 % (10 px) eller 16 px?

- **Alternativ:** (a) sajten behåller `html{62.5%}` och lager 1 (`--ap*`, rem) lever kvar för Bricks; lager 2 (`--ampy-*`) är px-clamp och fungerar i båda rötterna (så är tokens.css byggd); (b) byt sajten till 16 px-rot och konvertera de 101 ap*-tokens; (c) allt i px.
- **Källorna:** 62,5 % på live (theme-style, frontend, core-framework), hero-1-prototyp, testimonials, footer, main-form, thank-you v1. 16 px + px-CSS i CTA-website ("portabel"), hero-2-alternatives ("html{62.5%} är en värdsideregel som inte kan levereras"), hero-2-form, booking/offer, fore-efter, fotobedomningen, sticky-bar ("aldrig rem: en rem-bar med 16 px-antagande blir 37,5 % för liten"), artikelmallen (Tailwind).
- **Rekommendation:** (a) nu — tokens.css är redan rem-oberoende i lager 2, så inget block behöver veta roten. (b) är det renare slutläget men kräver att Bricks-temats 101 tokens och alla `rem`-block skrivs om samtidigt.
- **Konsekvens:** base.css bär `html{62.5%}` som dokumenterad host-regel; FluentSnippets/CRM använder bara `--ampy-*`.

## B9 · Mörkt resultatkort: med radialglöd eller platt?

- **Alternativ:** (a) LED-receptet (två radialer teal .28 / emerald .16) som tokeniserad ytbehandling `--ampy-bg-dark-glow`; (b) platt midnight; (c) energycalcs tre radialer + inset-highlight.
- **Källorna:** glöd i LED, EV, battery (identiskt), energycalc (tre radialer), visste-du-att (en radial). Platt midnight: hero-2 S/E, testimonials (gradient, inte glöd), footer. Du har sagt att du ogillar "mörkt kort + radial glow + centrerad vit rubrik" som default (AI-slop), och skillens egen referens gör exakt det.
- **Rekommendation:** (a) men som *tillval* för verktygens resultatkort (där siffran, inte rubriken, står i mitten) och platt (b) som default för alla andra mörka ytor. Visste-du-att (slutaudit GO) behåller sin ena radial.
- **Konsekvens:** `--ampy-bg-dark` = platt; `--ampy-bg-dark-glow` finns men används bara av kalkylatorkitet + visste-du-att. Testimonials-kortets egen gradient (#0b0f30→#2d516d) → midnight.

## B10 · "Husets" gråa kortskugga eller navy-alfa?

- **Alternativ:** (a) navy-alfa: `0 10px 30px rgba(9,11,50,.07)` (eljour-familjen) för kort, `0 16px 40px .14` för lyfta ytor; (b) live-idiomet `0 0 16px 0 rgba(190,190,190,.19)` (14 förekomster på live, testimonials, main-cta, var-process v2 "husets skugga"); (c) LED-kitets `rgba(15,18,60,.06/.08/.14)`.
- **Källorna:** midnight-alfa som skuggfärg i 21 källor (78 förekomster); grå 190 i 5 källor; near-miss-navyer (15,18,60 / 11,13,42 / 11,16,48) i 12. Rot-gt-familjen och fore-efter avvisar uttryckligen den gråa ("ärver inte sajtens #bebebe-defekt"); var-process adopterar den medvetet. `--apshadow-*` på live är trasiga (odefinierad `--shadow-primary`) och fixas nu med rgba(9,11,50,.10).
- **Rekommendation:** (a). En skuggfärg (midnight) i tre styrkor; grå skugga på blå-tonade ytor ser smutsig ut mot sky-mist.
- **Konsekvens:** live-korten, testimonials, main-cta och var-process byter skugga (mjuk visuell förändring). `--apshadow-xs…xl` blir användbara igen.

## B11 · Den ljusa auroran

- **Alternativ:** (a) behåll som bakgrund bara i kundflödet (tack-sida, offert-accepterad, bokning) — tokeniserad `--ampy-aurora-light`; (b) lyft in den på sajten (sektionsbakgrunder); (c) skrota, sky-mist platt överallt.
- **Källorna:** identisk i thank-you, booking, offer-accepted (aurora-SVG-hörn + fyra radialer på sky-mist). Brandbokens mesh-omslag (midnight+cobalt+neon+lime) är förlagan. Ingen sajtyta använder den; mini-menu har en *mörk* aurora-fallback.
- **Rekommendation:** (a). Den är fin som "bekräftelse-scen" men blir dekor utan funktion på tjänstesidorna (och konkurrerar med foto-heros).
- **Konsekvens:** ingen ändring; tokenen finns för CRM-flödet.

## B12 · Google-stjärnornas färg

- **Alternativ:** (a) Googles gult `#fbbc04` överallt (V7-direktiv 2026-08-06, hero-2-alternatives, testimonials-badge); (b) vita på foto (hero-1, ägargodkänd 07-19); (c) `#f6b53d` (thank-you/offer), `#ffc24b` (main-form), `#f0b429` (energycalc) = tre "guld"; (d) teal (footer live, `--color-15`), neonmint (testimonials-kortens stjärnor).
- **Källorna:** två ägargodkända ytor säger olika (Hero-1 vit vs V7 guld). Senaste direktivet (08-06) är guld.
- **Rekommendation:** (a) `--apgoogle-gold #fbbc04` överallt inkl. Hero-1 (direktivet är senare än godkännandet). Testimonials-kortens neonmint-stjärnor (på mörkt) får bli guld också, för igenkänning.
- **Konsekvens:** hero-1, footer, thank-you/offer, main-form, energycalc byter stjärnfärg. `"5,0"`/`"5 av 5"`/`"3 000+"` är fortfarande [GAP] mot ampy-foretagsdata (candour-gate), det här beslutet gäller bara färgen.

## B13 · Felfärg

- **Alternativ:** (a) `#b3261e` (eljour/fotobedomningen/hero-2 eljour; 6,54:1); (b) LED/EV `rgb(214,76,76)` (4,20:1 — under AA för normal text); (c) elcentral/elkollens `rgb(122,22,35)` (10,7:1, burgundy); (d) skillens gamla regel "fel ritas med teal" (hero-2-form gör så: fel = samma färg som fokus).
- **Källorna:** sex olika röda i auk 1–2, plus teal-fel. Tre kandidater har vardera 2–3 källor.
- **Rekommendation:** (a) som fält-/meddelandefärg, (c) som besked-accent (`--ampy-error-ink`). (d) utgår: ett formulär måste kunna skilja fel från fokus.
- **Konsekvens:** LED/EV/elkollen/main-form/hero-2-form byter felfärg; skill-doktrinen "teal för fel" stryks.

## B14 · Fokusfärg: navy eller teal?

- **Alternativ:** (a) navy `#090b32` 3 px outline offset 3 (CTA-website, booking/offer, fotobedomningen, mini-menu, website-blocks) + neonmint på mörkt; (b) teal 3 px (hero-1 CTA, thank-you, picasso); (c) teal-deep-ring `0 0 0 3px rgba(0,122,105,.9)` på fält (elcentral, "mätt mot WCAG 2.4.11").
- **Källorna:** navy i 6, teal i 3, teal-ringar i alfa (LED sju varianter, elkollen .25 = 1,3:1 underkänd, main-form .30, live Bricks `#5eb1bf` + .2). Booking/offer bytte från teal till navy efter mätning (2,91:1).
- **Rekommendation:** (a) för knappar/länkar/kort, (c) för formulärfält (kant teal-deep + ring). Teal-core som fokus faller på kontrast.
- **Konsekvens:** hero-1, thank-you, LED/EV, elkollen byter fokusstil; live Bricks-formulärens `#5eb1bf`-fokus (fluent_snippet_14) byts.

## B15 · Glasets värden

- **Alternativ:** (a) thank-you: `rgba(255,255,255,.72)` + 1 px vit .9 + `blur(16px) saturate(1.1)` + inset-highlight; (b) booking: `.85` utan blur (renderar utan backdrop-filter, snabbare); (c) hero-2-forms mörka glas (midnight + 156.51° → #5eb1bf .76 + blur 30 — dömt ut av hero-2-alternatives, kant 1,2:1).
- **Källorna:** tre kortrecept i samma kundflöde (tack .72+blur, offert-accepterad .74+blur, bokning .85 utan blur). Mörkt glas bara i fore-efter (chip) och hero-2-form.
- **Rekommendation:** (a) som ljust glas; mörkt glas = fore-efters `rgba(9,11,50,.82) + blur(8px)`. (c) utgår.
- **Konsekvens:** bokningen får blur (eller accepterad avvikelse av prestandaskäl); hero-2 Z-kortet är redan platt navy.

## B16 · `#5eb1bf` som token (brandbokens sekundärteal)?

- **Alternativ:** (a) `--apsecondary-teal` som primitiv (min kanon), tillåten bara som gradientslut, ring-yta och dekor — aldrig text/kant (2,47:1 mot vit); (b) ersätt gradientslutet med teal-core (hero-2-alternatives har det som utkommenterat alternativ `120deg #55ff9a→#00a991`); (c) mini-menus sky-blue pill (`#5eb1bf` → `#74c2ce`) och certificates-gradienten behålls.
- **Källorna:** 17 källor (7 auk 1); live Bricks `--color-7`; brandbok s.8. Tidigare dokumentation kallade den "frånvarande i produktion" (fel). Certificates-gradienten mäter 2,10–2,47:1 mot vit text; mini-menus pill 5,51:1 med mörk text.
- **Rekommendation:** (a). Den ÄR sajtens knapp; att byta gradientslut till teal-core ändrar den ägargodkända heron. Regel: `#5eb1bf` bär aldrig vit text.
- **Konsekvens:** certificates-bandet (vit text på gradienten) behöver mörkare slut eller midnight-yta.

## B17 · H2-storlek: 36 (--aptext-2xl) eller 32 (--aptext-xl) eller 40 (temats default)?

- **Alternativ:** (a) 36/500/1.2/−.01em (kanon); (b) 32/400/1.2 ("8 av 16 live-H2:or", fore-efter, live ROT/GT, footer, elcentral-block); (c) 40/500 (theme-style h2-default, main-cta, var-process, thank-you h1).
- **Källorna:** 36 i 7 källor (eljour, testimonials V1, certificates v2, rot-gt, visste, foto, mini-menu 38); 32 i 6; 40 i 5. Rot-gt-familjen valde 36 som median av mini-menu 38 / content 32 / testimonials 36, samma vecka som fore-efter valde 32 av live-mätning. Certificates README dokumenterar fem H2-storlekar på startsidan (40/500 · 40/600 · 38/500 · 36/400 · 32/400).
- **Rekommendation:** (a). Tokenbunden (`--aptext-2xl`), flest källor, och ligger mellan de två ytterligheterna så både 32- och 40-block rör sig lika mycket. Vikt 500 (eljour + tema) — 400-varianten (testimonials/certificates) ser tunn ut mot 700-display.
- **Konsekvens:** live ROT/GT, fore-efter, footer-h3, elcentral-block växer 32→36; main-cta/var-process/tema krymper 40→36. Sektions-H2 med "kicker" ovanför bär nu hierarkin via eyebrow, inte via storlek.

## B18 · Lead: Hero-1:s clamp(17,1.55vw,22) eller diagnostikens 20/400/1.6?

- **Alternativ:** (a) hero-1 (kanon: 22 desktop → 17 mobil, lh 1.58); (b) 20/400/1.6 (hero-2, elcentral, elkollen: tre auk 1–2-källor); (c) `--aptext-mm` (20→18.1) som tokenbunden kompromiss.
- **Källorna:** hero-1 är ägargodkänd och regel 2 ger den display-nivån; men hero-2-systemet för 260 sidor + båda diagnostikerna kör 20/16–18.
- **Rekommendation:** (a) behålls som kanon (regeln), men jag flaggar att mobilvärdet 17 är lägre än alla andra leads (18–20) och att kurvan ligger platt på 17 ända till 1097 px. Om du vill ha en tokenbunden lead: (c).
- **Konsekvens:** ingen ändring i hero-1; hero-2/elcentral/elkollen skulle krympa 20→17 på mobil om de följer kanon — kanske fel håll.

## B19 · Eyebrow-storlek: 12 px eller 15 px-golvet?

- **Alternativ:** (a) 12 px/600/.14em versal (6 källor); (b) fotobedomningens "noll deklarationer under 15 px" (15/600) + LED tier-label 15; (c) 13/700 (rot-gt-panelens caps).
- **Källorna:** 12 i energycalc, thank-you, offer, booking, elcentral, hero-2 trustrow; 15 i fotobedomningen och LED; 13 i rot-gt; 12.5 i header.
- **Rekommendation:** (a) med regeln "eyebrow är aldrig ensam bärare av information". 12 px versal med .14em läser bra i Outfit; 15 px versal blir en rubrik.
- **Konsekvens:** fotobedomningen/LED krymper eyebrows till 12.

## B20 · Body-elementets storlek: 16 (live `--aptext-sm`) eller 18 (`--aptext-m`)?

- **Alternativ:** (a) body-element = `--aptext-m` 18→16.1 (kanon i base.css); (b) live: body = `--aptext-sm` 16→14.1 och innehåll sätter `--aptext-m` per block.
- **Källorna:** live theme-style body = `--aptext-sm` (14,1 px på mobil, under iOS-golvet 16 och under alla blockens egna värden); alla innehållsblock sätter `--aptext-m` själva (live ROT-steg, post-content, testimonials, certificates, main-cta, rot-gt, visste). Certificates live-mobil visar vad som händer när ett block missar: 14,12 px brödtext.
- **Rekommendation:** (a). Ingen ägargodkänd yta har 14 px brödtext med avsikt; 16 → 18 är den kurva alla nya block ändå skriver in.
- **Konsekvens:** temats `body{font-size:var(--aptext-sm)}` ändras till `--aptext-m`; footer-/knapptext som vill ha 16 pekar på `--ampy-text-small`.

---

## B21 · Teal core som text på midnight?

- **Alternativ:** (a) aldrig text, oavsett yta (fyra källor formulerar "teal aldrig text" ur ljus-kontrasten 2,96:1); (b) tillåten på midnight (6,41:1 mot #090b32) för kicker, readout-enhet och siffra >= 16 px där källan gör så (visste-du-att, battery-calculator, LED "Med LED"-etikett); (c) bara `--ampy-action-strong` överallt.
- **Källorna:** visste-du-att (kicker teal på midnight, auk 2), battery-calculator (readout, auk 3), LED (stapeletikett "Med LED" i emerald, auk 1); regeln "aldrig text" i var-process, fotobedomningen, sticky-bar, elkollen (alla ljus yta).
- **Rekommendation:** (b). Kontrasten är AA på midnight; regeln handlar om ljus yta. Skrivs identiskt i tokens.css (`--ampy-action`), farg.html, tillganglighet.html, ai-tells.html (granskning 2026-09-12, TOKENS-2).
- **Konsekvens:** verktyg.css (chart-etiketter), block.css (visste-du-att-kicker) behåller teal på midnight; ai-tells-exemplet märks "tillåtet per B21". Säger du (a): tre filer byter till `--ampy-on-dark`/`--apneon-mint`.

### Redan avgjort av ägardirektiv (ingår inte i listan, men tokens.css följer dem)

- Outfit stays (B7 följer det). Teal ensam accent (B1 följer). Spacing på befintliga apspace-värden (lager 2 speglar dem, inga nya). Fullbreddsblock tillåtna (`--ampy-container` är inte ett tak). Inga midnattsblå gradient-scrims som yta (scrim-tokens finns bara för foto-veil). Inga tankstreck eller "·" i UI-strängar (base.css/smoke använder inga). Gradienttext ogillas (alla textgradienter = drift, ingen token). "AI-slop-defaulten" (mörkt kort + glöd + centrerad vit rubrik) = B9 gör glöden till tillval.
