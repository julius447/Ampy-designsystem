# tidigare-dokumentation — vad skillen och ampy-foretagsdata §9/§11 påstår, mot det uppmätta

**Jämförelseunderlag, inte sanning.** Källor: `.claude/skills/ampy-design-system/SKILL.md` (160 rader),
`tokens.md` (175), `components.md` (203), `reference/index.html` + `reference.css` + `tokens.css`, samt
`ampy-foretagsdata.md` §9 (rad 785–925) och §11 (rad 985–1077). Sanningen jag mäter mot:
`kallor/live-ampy-se/global-variables.css` (101 `--ap*`-tokens, rot 10 px) + övriga live-css + mina fyra
inventerade källor (main-form, thank-you, booking-confirmation/offer-accepted, brandbook).

Rendering av skill-referensen: `skarmdumpar/skill-reference-desktop.png` / `-mobile.png` (2547 px hög,
inga konsolfel, ingen horisontell overflow).

## 1. Vad dokumenten påstår (sammanfattning)

**Tokennamn och skalor.** `ap*`-ramverket på `html{font-size:62.5%}` är auktoritativt. Färgtriad teal
`#00a991` / midnight `#090b32` / emerald `#39c281` + neon-mint `#55ff9a`, sky-mist `#f5f9ff`, vit,
`#1e1e1e`; stödtoner seafoam/mint-surge/crystal-blue/aqua-frost/sublime-green; neutraler med opacitetsramper.
Typskala `--aptext-xs…4xl` "10→12 … 40→75 px" (tabell i tokens.md §2a och §9.4), H1–H6-regler, body Outfit
300 `--aptext-m`. Spacing `--apspace-3xs…4xl` (~6.6→158 px), radier xs 4 / s 6→8 / m 10→12 / l 16→20 /
xl 24→32 / full, skuggor `--apshadow-xs…xl` på odefinierad `--shadow-primary` → "faller tillbaka till
`#bebebe`". Container 1280, brytpunkter 992/768/480, motion ≤300 ms (`.aptransition-global` 0.3 s, `.button`
0.25 s, fadeIn runOnce). Cobalt `#326afd` + `#5eb1bf` + `#92ec47` "frånvarande i produktion".

**Komponentlista.** A1 eyebrow · A2 hero (kalkylator-tvåpane / diagnostik-rail) · A3 stat-trio · A4
logo-wall · A5 problemkort · A6 jämförelsetabell · A7 processteg · A8 grundarcitat · A9 lead-form (4 fält) ·
A10 footer · A11 consent; B `ampy-calc__*`-kit (~118 BEM-klasser: hero15, streams-bar, break-even, inputs,
selector, trust scaffolding, type helpers, lead capture); C build-chassi + instrumentering.

**Regler.** Outfit Black (`.apfont-900`) för rubriker / Medium 500 / Light 300; en accent (teal); ett
signaturdevice per asset; ornament bara ur blixt/a-familjen; inga em-dash i UI; självhostade fonter; inget
`--apspace-4xs`; ingen `@media 380px`; fel-/varningstoken "do-not-ship" – fel ritas med teal; fullbredds-
block (ägardirektiv 2026-08-14); "banned default": mörkt kort + radial glow + gradient-ikon + centrerad vit
rubrik.

**Referensen (`reference/`).** Egen tokenfil (`--ap-navy/-teal/-teal-bright #1cc4af/-green/-mint/-offwhite`,
`--ink #0f123c`, `--fs-hero clamp(4rem, 3rem + 3.2vw, 6.8rem)`, `--s-1…10`, `--r-sm…xl 0.8/1.4/2.2/3.2rem`,
`--shadow-1/2/3`, `--aurora`) och en sida med navy-aurora-hero + stat-trio + ljust "candour"-kort + CTA-band.

## 2. Påstående vs uppmätt

| # | Påstående (var) | Uppmätt | Utfall |
|---|---|---|---|
| 1 | Rot `html{font-size:62.5%}`, 1 rem = 10 px (SKILL, tokens.md, §9) | `theme-style.css` och `frontend.css`: `html{font-size:62.5%}`; `--base-font:10` | **stämmer** |
| 2 | 101 tokens heter `--ap*` och triaden är teal/midnight/emerald/neon-mint/sky-mist/vit/`#1e1e1e` (tokens.md §1a) | alla sju finns med exakt hex i global-variables.css; midnight = `--color-3 hsl(237 69% 12%)` (±2), sky-mist = `--color-2` (exakt), neon-mint = `--color-21` (±2), `#1e1e1e` = `--color-8` (±1) | **stämmer** |
| 3 | Typskalan: `--aptext-m` 17→18, `-l` 18→28, `-xl` 20→36, `-2xl` 22→48, `-2-5xl` 26→54, `-3xl` 26→60, `-4xl` 40→75 px (tokens.md §2a, §9.4 – "theme stylesheet is authoritative") | global-variables.css: `-m` **16→18**, `-l` **22→24**, `-xl` **24→32**, `-2xl` **26→36**, `-2-5xl` **28→40**, `-3xl` **30→48**, `-4xl` **34→60**, `-5xl` 40→76 (uppmätt @1440: 18/24/32/36/40/48/60/76) | **stämmer inte** – hela tabellen utom xs/s |
| 4 | "Registret listar extra steg (`aptext-sm/-ml/-lm/-3-5xl/-5xl`) som stylesheeten INTE emitterar – ignorera dem" (tokens.md §2a) | global-variables.css emitterar `--aptext-sm`, `-mm`, `-ml`, `-lm`, `-3-5xl`, `-5xl`; live `body{font-size:var(--aptext-sm)}` använder ett av dem | **stämmer inte** |
| 5 | H1 = 4xl/1.1 · H2 = 3xl/1.2 med tema-override 2-5xl wt 500 · H3 = 2xl/1.3 · H4 = xl/1.3 · H5 = l/1.3 · H6 = m/1.4 (§9.4, tokens.md §2b) | theme-style.css: exakt dessa sex regler + `h2{font-size:var(--aptext-2-5xl);font-weight:500}` | **stämmer** (men px-värdena i #3 är fel, så "H2 26→54" ≠ verkliga 28→40) |
| 6 | Body = Outfit vikt 300, `--aptext-m` (SKILL, tokens.md §2b) | `body{font-size:var(--aptext-sm);font-family:"Outfit";font-weight:300}`; `.brxe-post-content{font-size:var(--aptext-m)}` | **stämmer delvis** – body är `sm` (14→16), bara post-content är `m` |
| 7 | Blockquote vikt 600, lh 1.25 (tokens.md §2b) | theme-style.css: `blockquote{…font-size:var(--aptext-mm);font-weight:600;line-height:1.25}` | **stämmer** |
| 8 | Utilities `.apfont-100…900`, `.apline-height-xs…xl` = 1/1.2/1.3/1.4/1.5 (§9.4) | finns ordagrant i theme-style.css | **stämmer** |
| 9 | Plus Jakarta Sans laddad men oanvänd (§9.4) | 13 `@font-face` + en `:root`-referens, ingen selektor använder den | **stämmer** |
| 10 | Bricolage Grotesque på `.h2/.h3` med råa px, Inter 1×, `.button #00fe4a/#153236`, 45 px-rubriker (§9.2, §9.4, components.md D) | 0 träffar i något klonat live-css | **ej verifierbart** (källan var Bricks-exporter som inte finns i kallor) |
| 11 | Spacing `--apspace-3xs…4xl` ≈ 6.6→7 … 48.8→158 px (§9.5) | uppmätt @390/@1440: 6.6/7 · 8.3/9.9 · 10.5/14 · 13.3/19.8 · 16.9/28 · 21.5/39.6 · 27.3/56 · 34.8/79.2 · 44.4/111.9 · 56.8/158.3 | **stämmer** |
| 12 | `--apspace-4xs` felformad, "kollapsar till ~0.49 rem / ~4.9 px" (§9.5, §11.4) | clamp med min > max ⇒ returnerar **min** 0.52 rem = **5.19 px** vid båda bredderna | **stämmer att den är felformad; värdet är 5.2 px, inte 4.9** |
| 13 | Radier xs 4 / s 6→8 / m 10→12 / l 16→20 / xl 24→32 / full 999 rem (§9.5) | uppmätt 4 / 6.1→8 / 10.1→12 / 16.3→20 / 24.5→32 / 9990 px | **stämmer** |
| 14 | `--shadow-primary` refereras 5× men definieras aldrig (§9.5, §11.4) | 5 referenser i global-variables.css (20 över alla klonade filer), 0 definitioner | **stämmer** |
| 15 | "…så komponenter faller tillbaka till rå `#bebebe`" / "de-facto kortskugga = `0 2px 6px #bebebe`" (SKILL, tokens.md §4b/§6a, §11.4) | testat i Chromium: `box-shadow: var(--apshadow-m)` med odefinierad `--shadow-primary` beräknas till **`none`**; `#bebebe` förekommer **0 gånger** i alla 14 klonade live-filer | **stämmer inte** – fallbacken är "ingen skugga", och `#bebebe` finns inte i kallor |
| 16 | Dangling `--base` / `--base-light` / `--base-ultra-dark` (§11.4) | refereras 1× vardera i global-variables.css, definieras ingenstans | **stämmer** |
| 17 | Container 1280 px (`--container-width`, `--apmax-screen-width`) (§9.5) | båda = 1280px | **stämmer** |
| 18 | Brytpunkter 992 / 768 / 480 px (SKILL, §9.5, §11.4) | theme-style: 992, 780, 768; site-css: 992, 993–1200, 769, 560; frontend (Bricks): 767, 478. Ingen `480` | **stämmer delvis** – 992 och 768 ja; 480 finns inte (478 Bricks / 560 site-css) |
| 19 | 380 px är clamp-ankare, inte brytpunkt (§11.4) | `--container-min-width:380px`, legacy-clamps `(100vw - 380px)`; ingen `@media 380` | **stämmer** |
| 20 | `.aptransition-global{transition:all 0.3s}` (§9.5) | ordagrant i theme-style.css | **stämmer** |
| 21 | `.button` 0.25 s (§9.5) | ingen `.button`-regel i klonade filer | **ej verifierbart** |
| 22 | fadeIn ~0.3 s runOnce per sektion (§9.5) | live-source-elcentral.html: 57 `runOnce`, `animationType:fadeIn`, `animationDuration:0.3` (Bricks interactions) | **stämmer** |
| 23 | Cobalt `#326afd`, `#5eb1bf`, `#92ec47` "ABSENT from production" (SKILL, tokens.md §1d, §9.2) | `#326afd`: 0 i live-css ✓; `#92ec47`: 0 ✓; **`#5eb1bf`: i 7 live-css-filer** – primärknappens gradient `120deg #55ff9a→#5eb1bf`, fokusringar, aktiv tabb, alias `--ap-blue` i site-css; dokumenten nämner själva "certificates 90° #090b32→#5eb1bf" och offertmallens `.of-btn-primary` använder den | **stämmer inte för `#5eb1bf`** |
| 24 | "green-button neon-mint→teal 120°" (tokens.md §5, §9.3) | live: `#55ff9a → #5eb1bf` (brandbokens sekundärteal), inte `#00a991` | **stämmer inte** (fel slutfärg) |
| 25 | `--brightgreen #1BD365`, `--blue #4b85fd` legacy (§9.2) | båda i inline-elcentral/-batterilagring.css | **stämmer** |
| 26 | Paletten har dubbletter: `--color-5/12/22` = hsl(144 50% 40%), `--color-10/25` = hsl(171 95% 41%) (tokens.md §1b) | Booking-confirmation/assets/tokens.css (color-palettes verbatim): exakt så | **stämmer** |
| 27 | Legacy `--h1` 50→62 … `--h6` 12→15, `--space-xs…section` (tokens.md §2d, §3) | global-variables.css: `--h1 clamp(5rem…6.2rem)` osv. | **stämmer** |
| 28 | Outfit Black = `.apfont-900` för rubriker (SKILL, §9.4 "brandbook weight roles") | brandboken s.14 säger Black; **inget byggt block** använder 700–900 för rubriker (500–600 överallt); skill-referensen själv använder `--w-black: 800` | **stämmer som brandboksregel, stämmer inte som praxis** |
| 29 | Lead-form = Namn / E-post / Telefon / Postnummer + otickad GDPR-checkbox + honeypot (components.md A9) | main-form (live via `[data-mf]`): Förnamn + Efternamn + E-post + Telefon + Adress(+postnr/ort) + Meddelande, samtycke som textrad **utan checkbox**, honeypot `company_url` ✓ | **stämmer inte** för fältuppsättning och consent-checkbox; stämmer för honeypot |
| 30 | Fel i formulär ritas med `--apteal-core` (border + hjälptext), aldrig egen röd (SKILL, tokens.md §6b) | main-form: `#e00000` + `rgba(209,73,91)`; booking: `#8a6116`; live site-css `[data-mf] .mf-invalid` `#e00000` | **stämmer inte** – varje byggt block har egen fel-/varningsfärg |
| 31 | Fokusring = teal (`--focus-ring: var(--apteal-core)`, reference `--ring` teal .28) | tack-sidan teal ✓; booking + offer-accepted **navy** (teal mätte 2,91:1) | **stämmer delvis** |
| 32 | Standardkort = `--apradius-l` 16→20 (SKILL, tokens.md §4a) | main-form 15 px; tack 32/16; booking 22; offer 24–32; skill-reference 22 | **stämmer inte** – inget byggt kort använder 16→20 |
| 33 | Fullbredds-block: 1280 är inte längre taket (SKILL, direktiv 2026-08-14) | main-form 1220, tack 520, booking 780, offer 540 – alla smalare än 1280; regeln är oprövad i mina källor | **ej verifierbart** här |
| 34 | Inga em-dash i UI (SKILL) | live-source-elcentral.html: 13 "—"; main-form success använder "–" (en-dash) | **stämmer delvis** (live bryter regeln) |
| 35 | Självhostade fonter, inga Google Fonts (SKILL) | live: `@font-face` från `wp-content/uploads/core-framework/fonts/Outfit-*.woff2` ✓; booking/offer självhostade ✓; main-form-prototyp, tack v1/impl och skill-referensen laddar Google Fonts | **stämmer i produktion, inte i prototyperna** |
| 36 | `ampy-calc__*` ≈ 118 BEM-klasser, "CSS är [GAP]" (§9.7, components.md B) | 105 unika `ampy-calc__*` i klonade live-filer; CSS:en finns i Led-kalkylator/EV (agent 3:s område) | **stämmer i sak** (antal 105 här) |
| 37 | Reference `tokens.css` = "den kompletta premium-uttrycket av ap*" (SKILL) | den definierar 60+ egna namn (`--ap-teal-bright #1cc4af`, `--ink #0f123c`, `--fs-*`, `--s-*`, `--r-*`) och refererar **0** riktiga `--ap*`-tokens; `--ap-navy-2 #0d1145`, `--bg-subtle #eaeff3` finns inte i produktion | **stämmer inte** – det är en parallell tokenlayer, samma mönster som main-form/booking |
| 38 | Reference = guldstandard att imitera; "banned default = mörkt kort + radial glow + centrerad vit rubrik" (SKILL) | referensens CTA-band är exakt: mörkt rundat kort (`--aurora` radialer) + centrerad vit h2 + blixt-vattenstämpel (egen `bolt.svg`, inte brandbokens glyf) | **motsäger sig själv** |
| 39 | Brandbokens gradienter: cobalt→navy, lime→cobalt, spring-green→teal, spring-green→navy/teal (§9.3) | s.11: cobalt→midnight, lime→cobalt, **sekundärteal `#5eb1bf`→lime**, neon-mint→midnight | **stämmer delvis** (nr 3 och 4 har fel färgnamn) |
| 40 | Brandbokens "rgb 9,11,59" är tryckfel (§9.2) | s.7 trycker 9 11 59; hex ger 9 11 50 | **stämmer** |
| 41 | Logo-don'ts (8), friyta = a, mellanrum 20 % av a, profilbildsregel (§9.1) | s.4, s.5, s.22 ordagrant | **stämmer** |
| 42 | Ikoner solida/enkla; former ur blixt/a; foto realistiskt (§9.6) | s.16–18 ✓; men inget byggt block följer ikonregeln (linjeikoner överallt) | **stämmer som regel, inte som praxis** |
| 43 | "Two canonical layout families" (kalkylator två-pane / diagnostik-rail) är de enda som skeppas (§11.3) | mina fyra källor är varken: 50/50 foto+form, centrerat glaskort, dokumentkolumn 780 | **stämmer inte** – minst tre familjer till finns |

## 3. Vad jag drar av jämförelsen

1. **Skalorna är rätt namngivna men fel siffersatta.** Token-namnen, radierna, spacing och H-reglerna stämmer;
   typskalans px-tabell (och därmed "H1 40→75") är fel i både tokens.md och §9.4, och de "extra stegen" finns.
2. **Skuggmyten.** `--shadow-primary` är odefinierad (rätt), men följden är *ingen* skugga, inte `#bebebe`;
   `#bebebe` finns inte i något klonat live-css. Alla byggda block skriver egna rgba-skuggor i navy.
3. **`#5eb1bf` är produktionens verkliga knapp-/fokusfärg**, inte "frånvarande". Den saknar bara token.
4. **Dokumenten beskriver en lead-form, en felfärg, en kortradie och två layoutfamiljer som inget byggt block
   följer.** Praxis: fyra block, fyra primärknappar, fyra kortrecept, tre bläck, två fokusfärger.
5. **Skill-referensen är inte byggd på ap*** – den är en femte parallell tokenlayer (och main-form, booking
   och offer-accepted är tre till). Bara tack-sidan v1 binder till riktiga tokens.
6. **Outfit Black-regeln** kommer från brandboken, inte från något byggt block; praxis är 500–600.
