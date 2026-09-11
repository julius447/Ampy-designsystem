# Granskning av designsystem-sajten (red team), 2026-09-12

Granskare: en agent, ensam, inga underagenter. Ingen fil i `site/` (utom `site/GRANSKNING.md` + `site/_review/`) eller `system/` är ändrad.
Allt nedan är mätt med proberna i `site/_review/` (JSON i `site/_review/out/`), inte läst ur byggloggarna. Där jag inte har mätt står det.

**Verdikt: SHIPBAR MED FIX.** Sajten ser ut som ett premium-designsystem och är sann mot sina källor i allt jag stickprovade (0 fel i 199 färgkontroller, 0 fel i 55 semantiska tokenrader, 101/101 live-tokens identiska, 65 av 65 fil:rad-hänvisningar hittade). Det som måste rättas innan Julius ser den: en påhittad hero-copy på en ägargodkänd hjälte, 26 döda djuplänkar från komponentöversikten, en mobilnav som tangentbordet kan gå in i när den är stängd, fem `--ampy-*`-tokens som bor utanför tokens.css, och en motsägelse mellan sajtens regel "teal core är aldrig text" och fyra kloner som sätter teal core som text.

## Vad jag gjorde (och inte gjorde)

| Steg | Bevis |
|---|---|
| Läste BYGGBRIEF, kanon-sammanfattning, komponentkartan, tokens.css, S1 till S4 | ja |
| Renderade alla 26 sidor desktop 1440 + mobil 390 (`tools/shot.mjs`) | `_shots/rev-*.png`, `site/_review/out/render.log`: 26/26 `errors: []`, `overflowX: false` |
| Länkkontroll över 2 089 referenser i 26 sidor, ankare, `use`-symboler, bilder, `../inventering` | `01-lankar.mjs` -> `out/lankar.json` |
| Nätverkskontroll: alla anrop vid sidladdning | `16-natverk.mjs`: 571 anrop, 0 externa |
| Lager 1-diff tokens.css mot `kallor/live-ampy-se/global-variables.css` | `03-token-diff.mjs` -> `out/token-diff.json` |
| Sanningsprobe farg.html: 42 swatchar x (hex<->token, antal källor + auk 1, tre kontraster) | `05-sanning-farg.mjs` -> `out/sanning-farg.json`: 199 kontroller, 0 fel |
| Semantiska tabellen på farg.html mot radkommentarerna i tokens.css | `06-sanning-semantisk.mjs`: 55 rader, 0 fel |
| "Kanon: slug (fil:rad)" på alla sju komponentsidor mot `kallor/` | `07/08-kanon-*.mjs` -> `out/kanon-check.json`: 54 påståenden, 65 fil:rad-intervall, alla finns; innehållet stämmer i 20 stickprov |
| Spacing-skalan (11 rader), radier (8 tal), typografins frekvenstabell, beslutssidan (20/20) mot JSON/md | manuellt mot `konsolidering/*.json`, `_probes/out/*.json`, `beslut.md` |
| Dubbletter/konflikter i `system/**/*.css` + doc.css | `09-css-dubbletter.mjs`: 5 736 deklarationer |
| Kontrast + teal-som-text på 26 sidor, 9 322 textnoder | `10-kontrast-teal.mjs` -> `out/kontrast*.json` |
| Tangentbord/mobilnav/details/kopiera/alt/etiketter | `11-tangentbord.mjs`, `17-details.mjs` |
| Skärmdumpar granskade med ögonen | index (allt), knappar (2 segment), fält (1), block (14 desktop-vyer + 16 mobil-vyer + 4 källbilder), verktyg (2), toppen av 21 sidor i montage |
| **Inte gjort:** varje anatomisiffra (stickprov ~15), S2/S3/S4:s egna paritetsprober (bara lästa), tablet-bredder, live GitHub Pages, JS-beteenden i klonerna utöver details/nav/kopiera | |

## Siffrorna

- Länkar: 2 089 referenser, **5 trasiga** (alla i blockbibliotek.html), **26 saknade ankare** (alla från komponenter/index.html), 27 externa `href` (alla dokumenterade Pages-URL:er + ampy.se i blockbiblioteket, + ett kodexempel), 0 externa anrop vid laddning, 0 platshållare (SIDTITEL/EYEBROW/INGRESS), 0 `file://`-konstruktioner, `<title>` satt på 26/26, nav identisk på 26/26, `aria-current` rätt på 26/26 (satt av doc.js), 0 `<img>` utan alt.
- Token-diff: live 101 `--ap*`, tokens.css 118 `--ap*` (101 + alias `--aptext-mmm` + 16 nya), **0 saknade, 1 avvikande** (`--apspace-4xs`, den dokumenterade 1b-fixen), 134 `--ampy-*`. Sajtens siffror "101 + 16 + 134" stämmer.
- Kontrast (26 sidor, 9 322 textnoder): 14 riktiga underkända par (11 farg.html, 2 layoutfamiljer, 1 avsiktligt motexempel), 5 textnoder i teal core, 270 noder på foto/gradient (ej mätta, S2/S3 mäter 0 fel med sina gradientkompositörer; ögat hittar inget).
- CSS: 0 egenskapskonflikter mellan filer; 2 selektorer definierade i två filer; 5 `--ampy-*` definierade utanför tokens.css.
- Sidhöjder desktop/mobil: block 66 596 / 84 493 px, verktyg 24 277 / 30 505, diagnostik 22 997 / 28 214, farg 18 856 / 27 746, beslut 13 515 / 18 111. Övriga under 14 000.

---

## Lins 1: STRUKTUR

| Nivå | Fynd | Bevis | Fix |
|---|---|---|---|
| Major | **26 döda djuplänkar** från "Alla komponenter": `komponenter/index.html:206-253` pekar på `verktyg.html#tvapanel/#staplar/#streams-bar/#break-even/#sa-har-vi-raknat/#lead-inline/#popover`, `diagnostik.html#fragekort/#dualstatus/#trafikljus/#dela/#sticky-cta`, `block.html#hero-1 … #bock` (19 st); målsidorna har andra id:n (`#skal`, `#dual`, `#trafik`, `#hero1`, `#picker` …) och block-sidans 19 doc-rubriker har inga id:n alls. `#bock` har inget mål: komponenten finns inte. | `out/lankar.json` -> `anchorsMissing` | Ge S3/S4-sidornas `.ds-h2` id enligt S2:s lista (bygglogg S2 "Ankare som index.html länkar till") ELLER byt href i index till befintliga id (mappning i punchlistan). |
| Major | **5 trasiga länkar** i blockbiblioteket: `blockbibliotek.html:411` `../inventering/thank-you-implementation.md` + `.json`, `:422` `../inventering/offer-accepted.md` + `.json`, `:483` `../inventering/tidigare-dokumentation.json`. Filerna finns inte (inventeringen har `thank-you.md/.json`, ingen offer-accepted, ingen json för tidigare dokumentation). | `out/lankar.json` -> `broken` | thank-you-implementation -> `thank-you.md/.json`; offer-accepted -> "mätt i thank-you.json (spegel)"; tidigare-dokumentation: ta bort JSON-länken. |
| Major | `komponenter/block.html`: en 66 596 px hög sida utan ett enda ankare på sina 19 doc-sektioner och utan innehållsförteckning. Sidan kan inte länkas in i, inte skannas. | `13-sektioner.mjs`: alla H2 med `id=""` | Se punchlista S4-1: id + "På den här sidan"-lista överst (19 länkar) eller dela sidan i tre. |
| Minor | `aria-current` sätts bara av doc.js vid körning; ingen sida bär det statiskt (mallen sa "sätt aktiv nav-länk"). Utan JS: ingen markering. | `lankar.json` -> `ariaCurrent` är satt i DOM, `grep aria-current site/**/*.html` = 0 | Sätt attributet i markup per sida (byggskripten har listan). |
| Minor | Två ikonstrategier: S2:s fem sidor bär en inline-kopia av hela spriten (22 symboler x 5 sidor, identiska i dag, `md5 7297a3…`), övriga åtta använder `<use href="../../system/ikoner.svg#…">`. Kodexemplen visar tre olika sökvägar: `/system/ikoner.svg` (knappar:277/282, text:353/373, falt:433), `system/ikoner.svg` (kod.html:117/164), `../../system/ikoner.svg` (S3/S4). Rot-absolut `/system/…` fungerar inte under `/Ampy-designsystem/` på Pages. | grep | En konvention i alla kodexempel (`system/ikoner.svg#ik-…` + noten "relativt sajtroten"); ta bort inline-kopiorna eller motivera dem i kod.html. |
| Minor | Källistan på startsidan (`index.html:162-166`) räknar rot-gt-cro två gånger (auk 1 och 2) och saknar visste-du-att (auk 2); kortet säger "30 källor", biblioteket har 33 kort, ingressen säger 31. | `farg-frekvens.json` -> 31 slugs inkl. visste-du-att | Lista rot-gt-cro en gång med "(1 klonen / 2 familjen)", lägg till visste-du-att, säg "31 källor, 33 kort (två speglar + jämförelseunderlag)". |
| Minor | Rubrikhierarki: demo-h1 ger 2 h1 på typografi.html:138 och ytor.html:209, 4 på block.html (:1194, :1282, :1972); beslut.html:94 hoppar h1 -> h3; diagnostik hoppar h2 -> h4 inne i en demo. | `lankar.json` -> `headings` | Demo-rubriker som `<p class="ampy-display">`/`<p class="ampy-h1">` (rollklasserna finns för det), eller `role="presentation"` på demo-rubriker; beslut: `h3` -> `h2`. |
| OK | 26/26 title, nav, 0 platshållare, 0 externa resurser, 0 `file://`, 0 img utan alt, 0 JS-fel, 0 overflow. | | |

## Lins 2: SANNING / PROVENIENS

| Nivå | Fynd | Bevis | Fix |
|---|---|---|---|
| **Blocker** | **Hero-1:s ägargodkända copy är utbytt mot påhittad.** `block.html:1194-1195` (+ kodrutan :1243-1244) visar "Elektrikern som gör ditt hem redo för framtiden" / "Elservice, laddbox och batterilagring, utfört av behöriga elektriker med fast pris och ROT eller grön teknik inräknat." Källan `kallor/Hero-1/index.html:268-269`: "Elinstallationer i hemmet, gjort ordentligt." / "Våra egna behöriga elektriker hjälper dig i hela Sverige, med allt från elfel och elcentraler till laddbox och batterilagring." Heron är "PERFEKTION"-godkänd; "fast pris" finns i ingen källa för blocket. Klon-regeln: "du klonar utseende, du hittar inte på." Samma mönster i hero-2 S (`:1282` "Byta elcentral med fast pris och ROT-avdrag", källan `Hero_2-alternatives/preview` "Ny elcentral installerad med 30 % ROT-avdrag") och mini-menu-leaden ("… fast pris och avdraget inräknat", källan `mini-menu/index.html:163`). | grep + källfiler | Klistra källcopyn ordagrant i alla tre. Där candour-grinden stryker en siffra (mini-menu "över 3000"): behåll meningen och sätt en synlig `[GAP]`-tagg i demon, hitta inte på ny copy. |
| Major | **Teal core som text** i fyra kloner trots sajtens regel ("aldrig text", farg.html, tillganglighet.html): `verktyg.css:271` (`__chart-corner--end` "+293 087 kr", 16,9 px), `verktyg.css:281` (`__be-time` "2,4 år", 16 px), `block.css:965` (`.ampy-vda__kicker` "Visste du att", 22 px), `ai-tells.html:193` (inline `style="color:var(--ampy-action)"` i sidans RÄTT-exempel). Alla på midnight (6,41:1, klarar AA) men regeln säger aldrig. | `out/kontrast.json` -> `teal` | Beslut åt ena hållet: (a) skriv regeln "teal core är aldrig text på ljus yta; på midnight tillåten för kicker/siffra >= 16 px (6,41:1)" på farg + tillganglighet, eller (b) byt till `--ampy-on-dark`/`--apneon-mint` i de fyra ställena. (a) följer källorna (visste-du-att, battery). |
| Minor | 10 av 17 block på block.html anger "Kanon: slug (fil)" utan `:rad` (certificates, eljour-sticky-bar, main-cta, footer-cro, hero-2-alternatives, mini-menu, fore-efter-cro, fotobedomningen, visste-du-att, article-template). Briefen: `<fil:rad>`. `visste-du-att.css` finns dessutom inte i `kallor/` (lokal mapp utan git) och sidan säger inte var den bor. | `out/kanon-check.json` -> `utanRad` | Lägg till radintervall (S4:s parity-probe har dem) och "källa: lokal mapp ~/Desktop/…, ej i kallor" för visste-du-att. |
| Minor | typografi.html "Frekvens per roll" skriver "32 (4), 32.0 (2)", "22 (3), 22.0 (2)", "40 (1), 40.0 (1)", "60.0 (1), 60 (1)": probe-artefakt ur `typ-matris.json` (strängnycklar). Effekt: H3-raden visar "20 (3), 22 (3), 22.0 (2)" fast 22 har 5 källor mot 20:s 3. | `typ-matris.json` -> `frekvens.h3.px1440` | Slå ihop numeriskt lika nycklar i sidans tabell; rapportera till konsolideringen (02-typ-matris.py). |
| Minor | Osignerade siffror renderas i klonerna: "5 av 5"/"5,0 på Google" (block 36 st, text 6, ytor 2), "Över 3 000 installationer per år" (hero-1, hero-2, proof-rad), "inom 24 timmar" (falt 4). Alla är `[GAP]` mot ampy-foretagsdata, flaggade i captions men synliga som fakta i exemplen. | grep | Antingen neutral demo-copy ("Betyg på Google", "Installationer per år: [GAP]") eller en synlig `[GAP]`-tagg (ampy-tag--neutral) i själva exemplet. |
| Minor | Etikett/option-mismatch: "Var sitter belysningen?" med option "Snitt brinntid (12,0 h/dygn)" (falt.html select-demon x3, verktyg.html inputkortet). LED-källan har platsalternativ under den etiketten. | skärmdump `crops/komponenter-falt-desktop-02.png`, `crops/vk-skal.png` | Byt option till "Trapphus och korridor (12 h/dygn)" e.d. ur LED:s data. |
| OK | Lager 1 = live (101/101). Farg.html: 42 swatchar, 199 kontroller, 0 fel. Semantiska tabellen: 55 rader ordagrant ur tokens.css. Spacing 11/11, radier 8/8, beslut 20/20 mot md. Anatomisiffror stickprovade i källorna: 58/11-24/16 (CTA), 44fr/56fr + gap 64 + prickar 18x4 (elcentral), trio 13/600 + 28/700 (LED), pill 18 (elcentral :882). | | |

## Lins 3: KONSISTENS MELLAN AGENTERNA

| Nivå | Fynd | Bevis | Fix |
|---|---|---|---|
| Major | **Fem `--ampy-*`-tokens bor utanför tokens.css** ("den enda tokenfilen"): `text.css:22` `--ampy-fine: 13px` (används av block.css, diagnostik.css, verktyg.css), `falt.css:41-43` `--ampy-field-h/-fs/-track` (+ `:90-91`, `:356`), `block.css:828` `--ampy-ba-pos`. En Bricks-sida som laddar bara block.css utan text.css tappar 13 px-rollen. | `grep -- "--ampy-[a-z-]*:" system/components` | Flytta till tokens.css: `--ampy-text-fine: 13px` (9 källor), `--ampy-field-h: 48px`, `--ampy-field-fs: 16px`, `--ampy-field-track: rgba(9,11,50,.07)`; `--ampy-ba-pos` -> `--_pos`. |
| Major | **Skalets brister lappas lokalt i 26 av 26 sidor** i stället för i doc.css: `.ds-main { min-width: 0 }` på alla 26; `.ds-demo--stack` överskuggad på 19 sidor på tre olika sätt (S2 `> :not(.ds-demo__label) { width: 100% }`; S4 `flex-wrap: nowrap` + `> * { width: 100% }` (block.html:38-39) som gör att den absoluta etiketten sträcks 100 % och sticker ut ur ramen: synligt på "FAQ + tabell"-demon, `crops/zoom-label.png`); `.ds-two` definierad separat på 11 sidor; `.ds-status--2/--3/--x/--no/--flow` lokalt på 3 sidor; regler-sidornas `<style>` är fyra kopior (48 ds-klasser, två varianter, md5 f75f…/def2…), monster-sidornas fyra kopior (27). | grep, `13-sektioner`, skärmdump | Fixa i doc.css + mallen (punchlista SKAL-1 till 6) och stryk lokala kopior. |
| Minor | Namndrift på samma roll: `.ampy-range-value` (falt.css:309, 22/700 = h3) mot `.ampy-calc__value` (verktyg.css:120, 28/700 via `--_mid`) klonar samma LED-rad (`styles.css:210`); `--_mid` (28 -> 21) definieras i både text.css (stat-trio) och verktyg.css. | grep | `--ampy-text-mid: clamp(21px, …, 28px)` i tokens; `.ampy-range-value` tar den; en definition. |
| Minor | Tagg-tints: `.ampy-tag--warning/--error/--success` (text.css) bygger på tint-tokens som är ljusare än elcentrals pill-bakgrunder (rgb(250,233,197)/rgb(250,224,222)/rgb(214,240,229)); i diagnostikens beskedzon (som bär källans zon-tint) försvinner varningspillen nästan (S3 flaggade, kvarstår). | S3.md + `crops` | Tokens får ett starkare tint-steg (`--ampy-warn-tint-strong` …) eller `.ampy-tag` tar källans pill-värden och zonen behåller den ljusare. |
| Minor | `@media` mot `@container`: falt.css har 9 `@media` (600/1024 viewport) medan verktyg (5), diagnostik (9) och block (13) kör `@container`. Chips/fält i ett smalt kit i brett fönster får desktopmått. | grep | falt.css: `@container` mot närmaste kit (`container-type: inline-size` på `.ampy-fields`), fallback `@media` bara utanför kit. |
| Minor | `.ampy-on-dark` sätter ingen textfärg (base.css:79 sätter bara fokusfärg); mörka demos behöver `.ds-demo--dark { color }`; `.ampy-eyebrow` definieras i två filer (base.css:54 + text.css:25-28); den mörka selektorlistan `:where(.ampy-on-dark, .ampy--dark, .ampy-section--dark, .ampy-card--dark, .ampy-frame, .ampy-band--dark)` är kopierad i fyra S2-filer. | grep | `.ampy-on-dark { color: var(--ampy-on-dark) }` + `p`/`small`-regler i base.css; gör `ampy-on-dark` till den ENDA mörka skopklassen (ytor sätter den i markup) så listan blir en selektor. |
| Minor | base.css:41 `img, svg, video { display: block }` tvingar ikoner i löptext till block; bara `.ampy-source svg` överskuggar; alla andra ikoner överlever för att föräldern är flex. | grep | `.ampy svg[width] { display: inline-block; vertical-align: -0.15em }` (ikoner) och block bara för `img/video`. |
| Minor | Sidanatomi skiljer sig: S2:s fyra sidor har EN "Kod" (allt i ett block: knappar 24 rader/5 snuttar, falt 49/7), EN "Anatomi", EN "Gör/gör inte" per sida; S3/S4 har det per komponent (block: 19/19/19/21). Briefen sa per komponent; kopieraknappen på S2-sidorna kopierar allt. S3:s sidor saknar hover-varianter (0 `.is-hover`). | grep | S2: dela kod + gör/gör inte per komponent (eller minst en `ds-code` per komponent); S3: `.is-hover` på chip, option, tick, knapp. |
| OK | 5 736 deklarationer, 0 egenskapskonflikter, inline-spritekopiorna identiska med `system/ikoner.svg`, ikonfamiljen konsekvent (stroke 1,75 x 20, star fylld, google fast). | | |

## Lins 4: DOKTRIN / AI-TECKEN

| Nivå | Fynd | Bevis | Fix |
|---|---|---|---|
| Major | Se Lins 2: teal core som text i fyra kloner mot sajtens egen regel. | | |
| Minor | Hård `<br>` i hero-1-H1 (`block.html:1194` "…som gör<br>ditt hem…") ger en ensam rad "gör" på 390 (`crops/mb-hero1-zoom.png`); källan bryter efter kommatecknet. | skärmdump | Följer av Blocker-fixen (källcopy + `<br>` efter "hemmet,"). |
| Minor | Kommersiella löften som demo-copy: "fast pris" x3 (hero-1-lead, hero-2 S H1, mini-menu-lead), ej i källorna. | grep | Ingår i Blocker-fixen. |
| OK | Tankstreck i UI-text: 0 (4 träffar = citerade motexempel på regler-sidorna + grep-kommandot). "·": 0 i UI (6 = motexempel/regeltext). Gradienttext: bara i "gör inte"-demos (typografi.html:34 `.ds-gradtext`, regler `.ds-wrong__grad`). Mörkt kort + radialglöd + centrerad vit rubrik: bara som `.ds-wrong--slop` (motexempel), aldrig i doc-UI:t. "!": 67 st på 14 sidor, alla i riktiga recensioner, regeltext eller motexempel; 0 i dokumentationens egen röst. Midnight-scrims: bara på foto. | grep över `out/text/*.txt` | |

## Lins 5: KONTRAST + TILLGÄNGLIGHET

| Nivå | Fynd | Bevis | Fix |
|---|---|---|---|
| Major | **Stängd mobilnav ligger kvar i tabbordningen.** Under 992 px är `.ds-side` `translateX(-100%)` (doc.css:110) men `visibility: visible`, inte `inert`: tredje Tab-tryckningen hamnar på "Ampy designsystem" vid x = -287, sedan 30+ osynliga länkar. | `out/tangentbord.json` -> `tabSequence`, `focusInsideClosedNav` | doc.css: `.ds-side:not(.is-open) { visibility: hidden }` + `transition: transform …, visibility 0s linear var(--ampy-dur-base)`; eller doc.js togglar `inert`. |
| Minor | Öppen drawer: ingen stängknapp, ingen backdrop, fokus flyttas inte in, bakgrunden scrollar; Escape fungerar och återställer fokus (bra). | `afterEnter` | Backdrop-knapp (`aria-label="Stäng meny"`) som stänger, fokus till första länken vid öppning, `overflow: hidden` på body medan öppen. |
| Minor | farg.html:24-27 alfa-rampernas etiketter (12 px/300) mäter 2,12 till 4,42:1 mot rampens egna steg: 10 par under 4,5. | `out/kontrast.json` -> farg | Etiketten under rutan i `--ampy-ink-muted`, eller `aria-hidden` på siffran och en tabell bredvid. |
| Minor | layoutfamiljer.html:24 `.ds-diagram__meta` (11,5 px, `--ampy-ink-faint`) inuti `.ds-diagram__box--dark` = 3,96:1 (2 st). | `out/kontrast-del2.json` | `.ds-diagram__box--dark .ds-diagram__meta { color: var(--ampy-on-dark-muted) }`. |
| Minor | `.ds-code__copy` (doc.css:85): 33 px hög med 14 px text på mobil (< 44); transparent bakgrund gör att varje kontrastprobe (S1:s, S3:s, min) läser den som 1,04:1 (falsk träff, verkligt par vit .66 på midnight 8,45:1). | `11-tangentbord.mjs` -> `copy.minHeight` | `min-height: 4.4rem` under `(pointer: coarse)` + `background: var(--ampy-bg-dark)` så proberna mäter rätt. |
| OK | 26/26 img har alt. details/summary: 6 st, fokuserbara och togglar. 0 fält utan label, 0 knappar/länkar utan namn (4 sidor). Fokusring 3 px navy synlig på länkar och knappar; neon-mint på mörkt. Rubrikordning rätt utanför demo-h1 (Lins 1). 9 322 textnoder: 0 AA-fel utöver raderna ovan och det avsiktliga motexemplet `p.ds-teal-wrong`. | | |

## Lins 6: HANTVERK (smakprovet, skrivna svar)

**Ser sajten själv ut som ett premium-designsystem?** Ja. Hierarkin är ren (Outfit, ett bläck, teal bara på handling, eyebrows i text-teal), luften följer tokens, doc-kromet är tyst och lämnar plats åt exemplen, mobilen håller (0 overflow på 26 sidor, sidonav som fäll). Det ser inte ut som ett generiskt AI-formulär: inga glöd-kort, inga centrerade vita rubriker i doc-UI:t, inga "·". Det som drar ned: (1) de 26 döda djuplänkarna gör att "Alla komponenter" känns trasig så fort man klickar, (2) block.html är en rulle på 66 000 px, (3) små glapp som den utsträckta demo-etiketten på FAQ-demon, orphan-raden "gör" i heron på mobil, fältetiketten som inte matchar sitt val, (4) startsidans kort använder slumpade källbilder (ROT-blocket som bild för "Grunder", eljour för "Regler") i stället för något som visar sidgruppens innehåll.

**Är sidor för långa att skanna?** block.html (66 596 / 84 493 px), verktyg (24 277 / 30 505), diagnostik (22 997 / 28 214), farg (18 856 / 27 746). Förslag för block: dela i tre sidor efter komponentkartans familjer, `block-innehall.html` (processteg, kvittopanel, avdrag, testimonial, certifikat, eljour, före/efter, vår process, fotobedömning, visste du att), `block-skal.html` (header, footer, hero-1, hero-2, mini-menu, CTA-band, sticky call-bar) och `block-crm.html` (artikel, tidslinje, bokning), var och en med "På den här sidan"-lista överst och ankare per block; komponentöversikten länkar rakt in. Minsta åtgärd: ankare + sticky innehållsförteckning på den befintliga sidan. verktyg/diagnostik klarar sig med en innehållsförteckning. farg: proveniens-tabellen (5 300 px) bakom `<details>` per grupp.

**De fem svagaste klonerna mot sina källbilder (`site/bilder/`):**
1. **Header/mega-meny** (block.html:936-948): kolumnikonerna Shovel/glödlampa/fönster är ersatta med `ik-info` för "Belysning", `ik-map-pin` för "Kök och badrum", `ik-clock` för "Akut och service". Semantiskt fel ikon på tre av fyra kolumner; källan (`website-blocks-desktop.jpg`) läser rätt. Fix: tre nya symboler i spriten (lampa, kran/kök, blixt-akut) eller inga ikoner alls i klonen med noten "källans ikoner".
2. **Fotobedömningens kort** (block.html:1641): "kameraglyfen" i eyebrown är ett förstoringsglas (`ik-search`). En fotobedömning med en sök-ikon. Fix: `ik-camera` i spriten (24-rutnät, 1,75).
3. **Hero-1** (block.html:1194): påhittad copy (Blocker), orphan-raden "gör" på mobil, och ramen 520 px (`--short`) gör att H1 hamnar högt upp mot källans nedre tredjedel. Fix: källcopy + låt doc-demon köra 620 px så kompositionen läses som källan.
4. **Testimonial-kortet** (block.html:409-419): platt midnight och radie 20 mot den låsta V1:ns -27° gradient `#0b0f30 -> #2d516d` och radie 16 (`testimonials-block-desktop.jpg`). Källan är auktoritet 1 och LÅST; klonen tillämpar B9/B4 innan Julius svarat. Fix: rendera källan ordagrant (gradient, 16) som kanon och visa "platt + 20" som B9-alternativ bredvid, eller tvärtom med tydlig etikett.
5. **Artikelkomponenterna** (block.html:1836 ff): 6 av 21 klonade, demo-etiketten "FAQ + tabell" utsträckt utanför ramen (`crops/zoom-label.png`), kodrutorna på en rad per element (300+ tecken) så ingen kan läsa dem. Fix: etikett-regeln (SKAL-3), radbryt kodgeneratorn, och säg överst "6 av 21, resten som bild".

**Skulle en 55-årig villaägare känna igen Ampy?** I klonerna ja: gradientknappen, midnight, huset i skymning, Outfit, teal-checkarna är sajten han sett. Doc-kromet är avsiktligt neutralt (bara glyfen uppe till vänster) och det är rätt: systemet ska inte konkurrera med exemplen. Det enda som skulle förvirra honom är att heron säger något annat än på ampy.se.

**Fem saker som höjer upplevd kvalitet mest (i ordning):**
1. Laga skalet en gång i doc.css (min-width, stack-etiketten, `.ds-two`, statusfärger, mobilnav som är `inert` när stängd) och stryk 26 lokala lappar: allt blir identiskt på alla sidor.
2. Ankare + innehållsförteckning på block/verktyg/diagnostik och en komponentöversikt vars 34 djuplänkar landar rätt.
3. Källcopy ordagrant i hjältarna och mini-menyn, `[GAP]`-taggar synliga i exemplen där siffror saknas.
4. Kod per komponent med egen kopieraknapp på S2-sidorna, en ikonkonvention i alla exempel, radbrutna kodrutor på block-sidan.
5. Avgör teal-som-text-regeln och skriv den likadant på farg, tillganglighet, ai-tells och i de fyra klonerna.

## Lins 7: KOMPLETTHET MOT BRIEFEN

| Sida (ägare) | Briefen begär | Finns | Saknas / avvikelse |
|---|---|---|---|
| index (S1) | start, tio raderna, kort, källor, "så här är det byggt" | allt | källistan felräknad (Lins 1) |
| grunder/farg (S1) | swatchar med token, källa, drift, kontrast | 42 swatchar, alfa-tabeller, semantisk tabell 55 rader | rampetiketternas kontrast; 18 856 px |
| grunder/typografi, spacing, form-djup, rorelse, ornament (S1) | tokens renderade med källa och drift | ja, mäter sig själva i webbläsaren | frekvenstabellens dubbletter (typografi) |
| beslut, kod (S1) | B1-B20 ur beslut.md, hur systemet laddas | 20/20, rek. stämmer; kod: ladda, skop, konvention, lager, klon-regel, verktyg | kod.html: ikonsökväg utan `../`; beslut: h1 -> h3 |
| komponenter/index (S2) | 70 komponenter, status, källa, länk | 70 i sju grupper (6/9/7/10/10/9/19), status 33 kanon/31 drift/5 bara-en/3 saknas | 26 av 34 djuplänkar döda; "Bekräftelse-bock" listad som kanon men aldrig byggd |
| knappar, text, ytor, falt (S2) | per komponent: rubrik, Källa fil:rad, live per tillstånd (default/hover/focus/disabled/laddar/storlek, ljus+mörk), anatomi 1440/390, gör/gör inte 3+3, kod med kopiera, avvikelser | tillstånd: knappar 12 hover/9 fokus/4 disabled/4 laddar, mörk yta på alla fyra; anatomi, gör/gör inte, avvikelser | anatomi/gör-gör-inte/kod EN per sida, inte per komponent; text.html utan hover-varianter |
| verktyg, diagnostik (S3) | samma | per komponent (verktyg 4 anatomi/5 gör/12 kod, diagnostik 4/4/9), paritetstabell, driftlista | inga hover-varianter (0 `.is-hover` i verktyg, 2 i diagnostik); EV:s månadspanel, AC/DC-toggle, elcentrals lead-steg, elkollens inbäddade 600-läge (S3 erkänner); id:n avviker från S2:s ankarlista |
| block (S4) | 19 blockfamiljer | 19 sektioner, alla med Källa/anatomi/gör/kod/avvikelser | hero-2 G/Z/E bara bild; header Produkter/Lösningar/drawer bara bild; artikel 6 av 21; bokningens paneler/sekundärknappar/expanders; fotobedömningens formläge ("fem staplar, en tänd" = signaturdevisen) finns varken här eller i falt; **bekräftelse-bocken (animerad) finns inte alls**; footer riktning B; inga sektions-id |
| monster x4, regler x4, blockbibliotek (S4) | sidorna | finns, 33 kort med auktoritet + länkar | 5 trasiga inventeringslänkar; regler/monster-stilar kopierade 4 + 4 gånger |
| system/components (S2-S4) | klon av kanon, tokenbunden, paritet vid 1440/390 | S2 37 par, S3 kit i harness, S4 139/196 identiska (avvikelserna = beslut) | 5 `--ampy-*` utanför tokens.css; teal-text; `.ampy-on-dark` utan färg |

**Byggarnas egna "inte gjort" (S1-S4), konsoliderat:** farg/typografi ej omarbetade (S1) · hover/fokus/laddning bara som klasser, reduced-motion ej renderat, ring-lur = spritens 24-rutnät, varianter ej paritetsmätta (S2) · EV månadspanel/AC-DC/tick-marker, elcentrals lead-steg, elkollens 600-läge, energycalcs egen familj, ingen JS (popover, dela, fällbara fynd, sticky, stegbyten), blocklägets två kolumner bara i harness, sticky resultatkolumn otestad i Bricks (S3) · hero-2 G/Z/E, header Produkter/Lösningar/drawer, footer B, fotobedömningens tvåkolumn + formläge, bokningens sekundärknappar/paneler/expanders, artikelns hero/lead magnet/share/related/footer, paritetsprobe 18 par (S4). **Komponentkartan utan renderat exempel:** bekräftelse-bock (animerad), fotobedömningens "fem staplar", EV månadspanel, hero-2 G/Z/E, header Produkter/Lösningar/drawer, artikelns 15 återstående komponenter, bokningens paneler, footerns riktningar.

---

## PUNCHLISTA (i körordning, grupperad per ägarfil; Blockers först i varje grupp)

### S4 (block.css, block.html, monster/*, regler/*, blockbibliotek.html)

1. **[Blocker] block.html:1194-1195 och :1243-1244:** ersätt H1 med `Elinstallationer i hemmet,<br> gjort ordentligt.` och lead med `Våra egna behöriga elektriker hjälper dig i hela Sverige, med allt från elfel och elcentraler till laddbox och batterilagring.` (kallor/Hero-1/index.html:268-269, ordagrant). Samma på :1282 (hero-2 S: `Ny elcentral installerad med 30 % ROT-avdrag` ur preview) och mini-menu-leaden (:1371 och kodrutan :1415, `Med över [GAP] installationer per år hjälper vi dig med elinstallationer, laddbox och batterilagring, allt under ett och samma tak.` med `[GAP]` som synlig tagg). Uppdatera kodrutorna (genereras ur demon).
2. **[Major] block.html: sektions-id.** Sätt `id` på de 19 `.ds-blk .ds-h2`: `process`, `kvitto`, `avdrag`, `testimonials`, `certifikat`, `eljour`, `sticky-call-bar`, `cta-band`, `header`, `footer`, `hero-1`, `hero-2`, `mini-menu`, `fore-efter`, `var-process`, `fotobedomningen`, `visste-du-att`, `artikel`, `tidslinje`, `bokning` (flytta demo-id:n `#hero1/#hero2/#picker/#ba/#afk/#vda/#cert/#callbar/#ctaband/#steg` till demo-elementen eller döp om dem så doc-id:n blir S2:s lista). Lägg en "På den här sidan"-lista (`<nav aria-label="På den här sidan">`) direkt under ingressen.
3. **[Major] block.css:965** `.ampy-vda__kicker` teal core som text: antingen regeländring (se TOKENS-2) eller `color: var(--ampy-on-dark)` + blixten i teal.
4. **[Major] blockbibliotek.html:411, 422, 483:** byt `../inventering/thank-you-implementation.md` -> `../inventering/thank-you.md` (och `.json`); offer-accepted: ersätt länkarna med texten "ingen egen inventering, mätt i thank-you.json (spegel)"; ta bort `tidigare-dokumentation.json`-länken.
5. **[Major] block.html:38-39:** byt `.ds-demo--stack > * { width: 100% }` till `.ds-demo--stack > :not(.ds-demo__label) { width: 100% }` (eller stryk när SKAL-2 landar). Verifiera "FAQ + tabell"-etiketten.
6. **[Minor] block.html:936-948:** mega-menyns kolumnikoner: lägg `ik-lamp`, `ik-kitchen` (kran), `ik-bolt-alert` i spriten (S2 äger spriten: beställ) eller ta bort ikonerna och skriv "källans ikoner Shovel/light-bulb/window laddas från ampy.se" i captionen. `block.html:1641`: `ik-camera` i stället för `ik-search`.
7. **[Minor] block.html:409-431:** testimonial: rendera V1:s gradient `linear-gradient(-27deg, #0b0f30, #2d516d)` och radie 16 som kanon (auk 1, låst) och lägg "platt midnight, radie 20 (B9/B4)" som andra variant med etikett, tills B9 är svarat.
8. **[Minor] block.html:** kodgeneratorn radbryter inte: en rad per element med 300+ tecken (artikel, tidslinje, bokning). Bryt vid varje `<`-öppning på ny nivå.
9. **[Minor] block.html:** lägg `:rad` på de tio Kanon-raderna utan radnummer (S4-parity har dem) och "lokal mapp, ej i kallor" på visste-du-att.
10. **[Minor] block.html:** synlig `[GAP]`-tagg (`.ampy-tag--neutral`) intill "5,0 på Google" / "Över 3 000 installationer per år" i hero-1-, hero-2- och proof-demon i stället för bara caption. Alternativt "Betyg på Google" utan tal.
11. **[Minor] block.html:** bygg det som index utlovar som kanon: **bekräftelse-bocken** (thank-you v1/styles.css:49-58, 104/88 px, halo 4 s, reduced-motion statisk) som `.ampy-tick`; fotobedömningens formläge "fem staplar, en tänd" (eller flytta löftet till falt och länka).
12. **[Minor] regler/*.html + monster/*.html:** stryk de kopierade `<style>`-blocken (48 resp. 27 ds-klasser x 4) till förmån för doc.css-tillägg (SKAL-5) eller en delad `site/regler.css`/`monster.css`.
13. **[Minor] regler/ai-tells.html:193:** ta bort `style="color:var(--ampy-action)"` eller etikettera exemplet "teal core på midnight, 6,41:1, tillåtet per regel X" beroende på TOKENS-2.
14. **[Minor] monster/layoutfamiljer.html:24:** `.ds-diagram__box--dark .ds-diagram__meta { color: var(--ampy-on-dark-muted) }`.
15. **[Minor] block.html:** demo-h1 (:1194, :1282, :1972) -> `<p class="ampy-display">`/`<p class="ampy-h1">` med `role="heading" aria-level="1"` borttaget, så sidan har en h1. (Samma i ytor.html:209 och typografi.html:138, S2/S1.)

### S2 (knappar.css, text.css, ytor.css, falt.css, ikoner.svg, komponenter/index.html + fyra sidor)

1. **[Major] komponenter/index.html:206-253:** byt href till befintliga id: `verktyg.html#skal` (tvåpanel), `#resultat` (staplar, så-har-vi-räknat), `#calc-streams` (streams-bar), `#calc-chart` (break-even), `#lead` (lead-inline), `#tips`, `#dela` (popover), `#selector`; `diagnostik.html#rail`, `#fraga` (frågekort), `#dual` (dualstatus), `#trafik` (trafikljus), `#diag-share` (dela), `#diag-sticky` (sticky-cta); block: enligt S4-2 (eller S4:s nuvarande `#hero1 #hero2 #picker #steg/#kvitto/#avdrag #testimonial #cert #eljour #ba #process #afk #vda #ctaband #callbar #footer #header #artikel #tidslinje #bk-day`). `#bock`: markera "saknas, se S4-11" tills byggd. Kör `node site/_review/01-lankar.mjs` = 0 saknade ankare.
2. **[Major] text.css:22, falt.css:41-43/90-91/356:** flytta `--ampy-fine`, `--ampy-field-h`, `--ampy-field-fs`, `--ampy-field-track` till tokens.css (TOKENS-1) och referera; behåll inga `--ampy-*`-deklarationer i components/.
3. **[Minor] knappar/text/ytor/falt.html:** en `ds-code` (+ gör/gör inte) per komponent i stället för en per sida; kopieraknappen ska ge en komponent.
4. **[Minor] knappar.html:277/282, text.html:353/373, falt.html:433:** `/system/ikoner.svg#…` -> `system/ikoner.svg#…` (relativt sajtroten) med samma not som kod.html; ta bort de fem inline-spritekopiorna (23 KB per sida) när sajten bara körs över http, eller behåll och skriv skälet i kod.html.
5. **[Minor] falt.css:** `@media (min-width: 600px|1024px)` (:58, :192, :197) -> `@container` mot `.ampy-fields`/kit (`container-type: inline-size`), så chips i ett smalt kit inte får desktopmått.
6. **[Minor] falt.css:309** `.ampy-range-value`: ta `--ampy-text-mid` (TOKENS-3) i stället för h3-storleken så den = `.ampy-calc__value`.
7. **[Minor] text.css `.ampy-tag--warning/--error/--success`:** starkare tint (TOKENS-4) eller källans pill-värden, så pillen syns i beskedzonen.
8. **[Minor] falt.html/select-demon (3 st):** option-text som matchar "Var sitter belysningen?" (LED:s platsalternativ).
9. **[Minor] ikoner.svg:** lägg `ik-camera`, `ik-lamp`, `ik-kitchen`, `ik-linkedin/instagram/facebook` (block-footern inlinar dem i dag) så alla sidor delar en familj.
10. **[Minor] text.html:** hover-varianter (`.is-hover`) på länk, källrad-länk, tagg `--live`.

### S3 (verktyg.css, diagnostik.css, verktyg.html, diagnostik.html)

1. **[Major] verktyg.css:271 och :281:** teal core som text (`__chart-corner--end`, `__be-time`): `--ampy-on-dark` (eller `--apneon-mint` för "återbetald") tills TOKENS-2 ger annat besked; `is-loss` behåller amber.
2. **[Minor] verktyg.html/diagnostik.html:** sätt de id S2:s ankarlista väntar sig (eller ta S2-1) och lägg "På den här sidan" överst (24 277 / 22 997 px).
3. **[Minor] verktyg.html inputkortet:** option-texten under "Var sitter belysningen?" (samma som S2-8).
4. **[Minor] verktyg.css/diagnostik.css:** `.is-hover`-varianter för chip, option, tick, tips-chip, knapp i kortet, som S2-sidorna har.
5. **[Minor] verktyg.css:** `--_mid` -> `--ampy-text-mid` (TOKENS-3); zon-alfor, popover-skugga, chart-färger 3/4 stannar som `--_` (rimligt) men listas i tokens-brister på sidan (finns).

### S1 (index, grunder/*, beslut, kod)

1. **[Minor] index.html:162-166:** källistan: rot-gt-cro en gång "(1 klonen av live / 2 familjen)", lägg till visste-du-att under auktoritet 2, ändra "30 KÄLLOR" på bibliotekskortet till "31 källor, 33 kort".
2. **[Minor] grunder/farg.html:24-27:** rampetiketterna: flytta siffran under rutan i `--ampy-ink-muted` (ljus ramp) / `--ampy-on-dark-muted` utanför rutan (mörk), eller `aria-hidden` + tabell.
3. **[Minor] grunder/typografi.html "Frekvens per roll":** slå ihop "32"/"32.0", "22"/"22.0", "40"/"40.0", "60"/"60.0" innan topp-3 räknas (H3 blir "22 (5), 20 (3)").
4. **[Minor] grunder/typografi.html:138:** demo-h1 -> `<p class="ampy-h1">`.
5. **[Minor] kod.html:117/164:** `system/ikoner.svg#…` gäller från sajtroten; skriv "från site/ blir det `../system/…`" och visa den relativa formen som i S3/S4:s exempel.
6. **[Minor] beslut.html:94:** `h3` -> `h2` (hoppet h1 -> h3).
7. **[Minor] index.html kortbilder:** välj bilder som visar gruppen (farg-swatchar för Grunder, knappsidan för Komponenter, en regel-tabell för Regler) i stället för slumpade källskärmdumpar.

### SKAL (site/doc.css, site/doc.js, site/_mall.html)

1. **[Major] doc.css:110 (mobil):** `.ds-side { visibility: hidden; transition: transform var(--ampy-dur-base) var(--ampy-ease), visibility 0s linear var(--ampy-dur-base); }` + `.ds-side.is-open { visibility: visible; transition-delay: 0s; }`. doc.js: när öppen, flytta fokus till första nav-länken; lägg en backdrop-knapp `<button class="ds-backdrop" aria-label="Stäng meny">` som stänger; `document.body.style.overflow = 'hidden'` medan öppen.
2. **[Major] doc.css:12:** `.ds-main { min-width: 0; }` (stryk sedan raden i 26 sidor). doc.css:69: `.ds-demo--stack { flex-wrap: nowrap } .ds-demo--stack > :not(.ds-demo__label) { width: 100%; min-width: 0 }` (stryk 19 lokala varianter).
3. **[Minor] doc.css:** lägg till `.ds-two` (grid 1fr 1fr, gap xs, 1 kolumn under 992), `.ds-status--2/--3/--x` (faint/warn/error-ink), `.ds-demo__label--over`, `.ds-toc` ("På den här sidan"), så inga sidor behöver egna kopior.
4. **[Minor] doc.css:85 `.ds-code__copy`:** `background: var(--ampy-bg-dark)` (proberna mäter rätt) och `@media (pointer: coarse) { min-height: 4.4rem }`.
5. **[Minor] _mall.html:** sätt `aria-current="page"` statiskt i sidorna (doc.js blir fallback), och lägg en `<nav class="ds-toc">`-plats efter ingressen.
6. **[Minor] doc.css `.ds-cards`:** `repeat(auto-fill, minmax(28rem, 1fr))` ger 3 + 1 vid fyra kort (S1 löste lokalt); ge `--ds-cols` som sidan kan sätta.

### TOKENS (system/tokens.css, system/base.css)

1. **[Major] tokens.css:** lägg till `--ampy-text-fine: 13px` (finstilt, nio källor), `--ampy-field-h: 48px`, `--ampy-field-fs: 16px` (iOS-golv), `--ampy-field-track: rgba(9,11,50,.07)` (LED rgb(234,239,243) på vitt) med källa/drift-kommentar; komponentfilerna refererar dem (S2-2).
2. **[Major] regeln om teal core som text (beslut för Julius, förslag):** "Teal core är aldrig text på ljus yta (2,96:1). På midnight (6,41:1) tillåten för kicker, readout-enhet och siffra >= 16 px där källan gör så (visste-du-att, battery)." Skriv den identiskt i tokens.css-kommentaren (`--ampy-action`), farg.html, tillganglighet.html och ai-tells.html. Om Julius säger nej: S3-1, S4-3, S4-13.
3. **[Minor] tokens.css:** `--ampy-text-mid: clamp(21px, 0.78vw + 9.8px, 28px)` (LED `--fs-xl` 28 -> 21: stat-värde, enhet, prominent värde) så `--_mid` försvinner ur två filer.
4. **[Minor] tokens.css:** ett starkare tint-steg för besked-pillar (`--ampy-warn-tint-strong: rgb(250,233,197)`, `--ampy-error-tint-strong: rgb(250,224,222)`, `--ampy-success-tint-strong: rgb(214,240,229)`, elcentral pill-bg) och `--ampy-info-tint: rgb(224,236,248)`.
5. **[Minor] base.css:79:** `.ampy-on-dark { color: var(--ampy-on-dark) } .ampy-on-dark p { color: var(--ampy-on-dark-soft) } .ampy-on-dark small { color: var(--ampy-on-dark-muted) }`; base.css:41: `display: block` bara för `img, video`; `svg` blir `inline-block; vertical-align: -0.15em` med block via komponentklass där det behövs.
6. **[Minor] tokens.css (S1-S4:s samlade önskelista, ej rättad):** ikonstorlekar 16/18/20/24 + streck 1,75; reveal-stagger 40-60 ms; puls-längder 1,6/2/2,8/4 s; kortlyft -2 px; 17 px-rollen (fyra källor); radie 22 (tre auk 1-2-källor); solid hårlinje #e6ecf6/#dbe4f0; felfärg för text på mörkt (#ffb4b6 literal i dag); teal-deep-hover rgb(0,108,93); popover-skugga; gap 64. Lista dem i kod.html under "kända luckor" tills de tas.

---

## Kort till Julius

Sajten är sann (0 fel i 199 färgkontroller, 101/101 live-tokens, 65/65 fil:rad hittade) och ser ut som ett riktigt system. Innan du tittar på klonerna: heron säger inte det ampy.se säger (påhittad copy, fixas på fem minuter), och "Alla komponenter" leder fel i 26 av 34 klick. Tjugo beslut väntar på dig som förut; ett till kommer härifrån: får teal core vara text på midnight (6,41:1) som i Visste-du-att och batterikalkylatorn, eller aldrig?
