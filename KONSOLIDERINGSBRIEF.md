# Konsolideringsbrief: från 31 inventeringar till EN sanning

Fas 2 av designsystem-rebuilden. Input: allt i `inventering/` (31 källor, md + json, skärmdumpar, probes).
Output: den kanoniska token-sanningen som CSS + tabeller, komponentkartan, och en numrerad beslutslista
till Julius. Ingenting nytt hittas på; varje kanoniskt värde pekar på den källa det kommer ifrån.

## Precedens när källor säger olika

1. **Auktoritet 1 slår 2 slår 3** (kolumnen i `INVENTERINGSBRIEF.md`).
2. Inom auktoritet 1 gäller **ansvarsområde**:
   - Primitiva tokens (färgvärden, apspace, aptext, apradius): `live-ampy-se/global-variables.css` (det Bricks faktiskt kör). `theme-style.css`-avvikelserna är överskrivna live och räknas inte.
   - Hero-typografi och sidans "display"-nivå: **Hero-1** (ägargodkänd "PERFEKTION").
   - Knappar: **CTA-website** (levererat som bibliotek, verbatim i Hero-1, Main_CTA, Hero_2).
   - Header: **Website-blocks** (godkänd).
   - Verktygs-UI (kalkylator, tvåpanel, hero-siffra, segment, slider, details): **Led-kalkylator** (live), sekundärt EV/Energycalc.
   - Diagnostik-UI (rail, frågechips, besked): **Elcentral-lead-magnet** och **Elkollen** (live).
   - Innehållsblock på tjänstesidor (H2-nivå, brödtext, steg, kort): **Eljour-block** ("sajtens bästa", 23/25) + de mätta referensblocken i `rot-gt-cro` (mini-menu-H2 valdes som primär referens i fas 9).
   - Omdömen: **Testimonials-block** (låst). Tillit: **Certificates**. Footer-baslinjen = live.
   - Logo, palettens namn, typsnittsvikternas roller: **Brandbook**, men produktionens accent (teal) är ägarbeslutad sedan 2026-07 (djupanalysen: "teal görs officiell ensam accent"). Cobalt och lime finns inte i produktion.
3. **Frekvens bryter lika**: samma roll, samma auktoritet, olika värden → det värde som flest auktoritet 1–2-källor delar. Skriv alltid ut de andra som "drift".
4. **Rot-gt-calculator/wireframes räknas aldrig** (underkända). Skill-referensen (`reference/`) räknas som dokumentation, inte källa.

## Vad som ska produceras (alla filer i `system/` och `konsolidering/`)

### A. `system/tokens.css` (den enda token-filen)
- **Lager 1, primitiva:** de 101 `--ap*`-tokens **verbatim med sina live-namn och live-värden** (kompatibilitet med Bricks). Lägg till primitiva som saknas men bevisligen bär en roll i ≥2 källor av auktoritet 1–2 (t.ex. sekundärteal `#5eb1bf`, amber för stapel-"före"), namngivna i samma stil (`--ap<namn>`), kommenterade med källorna. Rätta de bevisade buggarna i en kommenterad "fix"-sektion (odefinierad `--shadow-primary` → definiera; `--apspace-4xs` min>max → rätta) och skriv vad som ändrades.
- **Lager 2, semantiska (`--ampy-*`):** ytor (`--ampy-bg-page`, `--ampy-bg-surface`, `--ampy-bg-dark`, `--ampy-bg-glass`), bläck (`--ampy-ink`, `--ampy-ink-muted`, `--ampy-ink-faint`, `--ampy-on-dark…`), handling (`--ampy-action`, `--ampy-action-hover`, `--ampy-action-gradient`, `--ampy-action-on`), tillstånd (`--ampy-success`, `--ampy-warn` (amber, scopad till diagram/besked), `--ampy-error`, `--ampy-focus`), linjer, radie-roller (`--ampy-radius-card`, `-button`, `-field`, `-pill`), skuggor (`--ampy-shadow-card`, `-button`, `-raised`), rörelse (`--ampy-dur-fast/base/slow`, `--ampy-ease`), typografi-roller (`--ampy-font`, `--ampy-text-display/h1/h2/h3/lead/body/small/eyebrow/number/label` som **fluida clamp() i px-baserade rem-oberoende uttryck** så att både 62.5 %- och 16 px-rot fungerar; ange px vid 390/768/1440 i kommentar), vikter (`--ampy-w-display/heading/medium/body`), radavstånd, spärrning, mått (`--ampy-measure`), container/breakpoints, spacing-roller (`--ampy-space-section-y`, `-card`, `-stack-*`, `-inline-*`).
- Varje semantisk token: en radkommentar `/* källa: <slug> (<fil:rad>) ; drift: <värden> */`.
- Filen ska gå att ladda ensam och inte kräva något annat.

### B. `system/base.css`
Reset + `html { font-size: 62.5% }` som sajten (dokumentera), Outfit `@font-face` (self-host, kopiera woff2 till `system/fonts/`), body-typografi, rubrik-roller som klasser (`.ampy-h1` …) OCH som element-standard inom `.ampy` (scoped så systemet kan ligga bredvid Bricks), fokus, reduced-motion, `.ampy-container`, `.ampy-section`.

### C. Tabellerna (`konsolidering/*.md` + `.json`)
1. `farg.md/json`: varje primitiv färg med namn, hex, roll(er), i vilka källor (antal), kontrast mot vit/midnight/sky-mist, semantisk mappning; **driftlistan** ("navy i sex värden", "fem tealer", "#0b1030-bläcket") med rekommenderad kanon och vad som byts ut var.
2. `typografi.md/json`: rollerna (display, h1, h2, h3, lead, body, small, eyebrow, number, label, button) med kanoniskt värde (font, size clamp + px 390/768/1440, weight, lh, ls), källa, och alla uppmätta avvikelser per källa i en matris (källa × roll → px/weight).
3. `spacing.md/json`: apspace-skalan i px vid 390/1440, sektionsrytm (padding-y per blocktyp), kortpadding, gap-skala, container/breakpoints (992/768, @container där det finns), drift.
4. `form-djup-rorelse.md/json`: radier per roll, skuggor (ordagranna värden), linjer/borders, glas (backdrop-filter + rgba), gradienter (kanoniska två: handlingsgradienten och den ljusa auroran; alla övriga som drift), ornament (blixt/"a", vågor/blobbar: var de används), rörelse (durations/easings/lyft), drift.
5. `komponenter-karta.md`: EN rad per komponent (≈35): namn, kanonisk källa (slug + fil), varianter/states, i vilka andra källor den förekommer (med avvikelser), status (kanon / kanon med drift / bara i en källa / saknas). Grupper: handling (knappar primär/sekundär/tertiär/tel-ring/länk), text-element (eyebrow, tag/badge, stat-trio, hero-siffra + enhet, källrad), ytor (ljust kort, mörkt resultatkort, glaskort, navy-ram), fält (input, select, textarea, checkbox/consent, radio-chips, segment, slider, stepper, stepper-år, sökfält), verktyg (tvåpanel-skal, hero-readout, stat-trio, staplar amber/teal, break-even, "Så har vi räknat", lead-formulär inline, tips-chip, popover), diagnostik (rail, frågekort, chips, besked-pill/matris/trafikljus, källrad, dela), block (hero-1, hero-2 S/G/Z/E, mini-menu, ROT/GT-kvittopanel + stegringar, testimonial-kort + slider, certifikat-badge, eljour-symptomlista + call-panel, före/efter, vår process, fotobedömning, visste-du-att, CTA-band, sticky call-bar, footer, header + mega-meny, artikel-komponenter, tack-sidans tidslinje, bokningens sammanfattningskort).
6. `beslut.md`: numrerad lista över allt där kanon inte kan sättas utan Julius: t.ex. accent (teal produktion vs cobalt brandbook → brandbook v2?), rubrikvikt (700 display + 500 H2 som i dag, eller Black 900 enligt boken), body 300 `#363636` (live) vs 400 `#0f123c` (nya block), knappradie 16 vs live Bricks 12/20, teal-kontrast på knapp (2,96:1), mörkt resultatkort med glöd vs platt, den ljusa auroran, JetBrains Mono/Plus Jakarta (kapa?), 62.5 %-rot vs 16 px, `#5eb1bf` som token, Google-stjärnors färg, glasets värden. Varje beslut: alternativen, vad varje källa gör, min rekommendation med skäl, konsekvens.
7. `kanon-sammanfattning.md`: en sida som Julius läser först: "det här är Ampys designsystem i dag, mätt", tio rader.

### D. Bevis
`konsolidering/BEVIS.md`: vilka inventerings-JSON du läste (alla 31), hur du räknade frekvens (skript i `konsolidering/_probes/`), och de tal du inte kunde avgöra.

## Regler
- Läs ALLA `inventering/*.json` och `*.md` innan du skriver ett enda värde. Skriv skript som aggregerar JSON:erna (färgfrekvens över källor, typroller per källa, radier, skuggor) och lägg dem i `konsolidering/_probes/`.
- Ingen ny färg, ingen ny storlek som inte finns i en källa. Vill du föreslå något nytt (t.ex. en mörkare text-teal för kontrast) lägger du det i `beslut.md`, aldrig i `tokens.css` som kanon (får ligga som kommenterat förslag).
- Svenska, inga tankstreck i UI-strängar, "kan" på allt osäkert. Filnamn ASCII.
- Rör inte `inventering/` eller `kallor/`.
- Avsluta med ≤20 rader: filer, de 10 kanoniska besluten du tog (och på vilken precedensregel), de 10 besluten som gick till Julius, det du är osäker på.
