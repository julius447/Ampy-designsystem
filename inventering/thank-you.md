# thank-you — tack-sidan efter /offert (v1 FINAL + implementationspaketet)

**Vad det är.** Bekräftelsesidan som `/offert`-formuläret redirectar till. Ett centrerat glaskort
(max 520 px, `rgba(255,255,255,.72)` + `blur(16px)`) på en sky-mist-bakgrund med fyra aurora-radialer och
två fixerade aurora-SVG-hörn. I kortet: animerad teal-bock med pulserande neon-mint-halo → h1
"Din förfrågan har blivit mottagen!" → ingress → 5 guldstjärnor + "5 av 5 · Betyg på Google" → hårlinje →
pill-knapp "Utforska våra eltjänster" → under kortet ghost-länken "Till startsidan".

**Status.** v1 FINAL överlämnad (riktning A "Samlat kort"), auktoritet 2. `Thank-you-implementation/` är
samma design översatt till px och scopad under `.ampy-tack` (verifierat: ≤1 px skillnad utom två punkter,
se defekter); dess `styles.css`/`script.js` är byte-identiska med `Thank-you-Offer-accepted/deliver/`.
`v2/`, `v3/` = ovalda riktningar (ej inventerade). `shared/tokens.css` = `global-variables.css` ordagrant
(diff-verifierat) – **den enda av mina fyra källor som binder till riktiga ap*-tokens** (17 referenser).

**Ingång.** `kallor/Thank-you-Offer-accepted/v1/index.html` + `v1/styles.css` (108 rader). Rot 62.5 %.
Data: `inventering/thank-you.json`.

| Desktop 1440 | Mobil 390 |
|---|---|
| ![](skarmdumpar/thank-you-desktop.png) | ![](skarmdumpar/thank-you-mobile.png) |

Implementationen: `skarmdumpar/thank-you-implementation-desktop.png` / `-mobile.png`.

## Det viktigaste i tokens (✗ = avvikelse mot ap*)

| Roll | Uppmätt (1440 / 390) | ap*-token |
|---|---|---|
| Sidbakgrund | `#f5f9ff` + radialer teal .12/.08, crystal-blue .48, sublime-green .28 (`background-attachment: fixed`) | `--apsky-mist`, `--apteal-core`, `--apcrystal-blue`, `--apsublime-green` (alfa) |
| Aurora-SVG | stopp `#b6f2ff/#a0fbc9 → #f5f9ff` och `#5cc5b6 → #00a991 → #5cc5b6`, opacity .8, 400/280 px → 200/150 | `--apcrystal-blue`, `--apsublime-green`, `--apseafoam-mint`, `--apteal-core` |
| h1 | `--aptext-2-5xl` **40 px** / ≤520 `--aptext-xl` 24.5 px; 500; lh 1.14; ls −0.018em; `#0b1030` | ✓ storlek · ✗ bläck (2 nyanser från midnight) |
| Ingress | `--aptext-m` 18 / 16.1 px, 400, lh 1.5, `rgba(11,16,48,.62)` | ✓ storlek · ✗ färg |
| Betygstext / knapp / ghost | `--aptext-sm` 16 / 14.1 px (400 / 600 / 500) | ✓ |
| Kort | max 520; padding 52/56 → 36/24; gap 24 → 20; radie `--apradius-xl` 32 → `--apradius-l` 16.3; kant `rgba(255,255,255,.9)`; skugga `0 3rem 7rem rgba(9,11,50,.12)` + inset-highlight; `backdrop-filter blur(16px) saturate(1.1)` | ✓ radier · ✗ skugga egen (midnight @.12) |
| Bock | 104 / 88 px; disk `#55FF9A` @.2 + vit stroke 24 @.18; bock `#00A991` stroke 12; halo neon-mint .30→0 | `--apneon-mint`, `--apteal-core` |
| Stjärnor | 16 px `#f6b53d` | ✗ (main-form: `#ffc24b`) |
| Primärknapp | pill `--apradius-full`, padding 14/28 → **48 px** (251 bred), gradient 135° `#00b89c→#018271`, skugga teal .30 (hover .38, −2 px) | ✗ gradientstopp utanför tokens |
| Ghost | padding `--apspace-2xs --apspace-s` (9.9/19.8 → 8.3/13.3), hover `#018271` på teal .08 | ✓ spacing · ✗ hoverfärg |
| Hårlinje | 60×1 px, transparent → teal .35 → transparent | `--apteal-core` |
| Fokus | `a:focus-visible` 3 px solid `#00a991`, offset 3, radie `--apradius-m` | `--apteal-core` |
| Spacing | sida `clamp(2.4rem,4vw,4.8rem) var(--apspace-m)` (48/28 → 24/16.9); rubrik↔ingress `--apspace-s`; övriga gap egna clamps | delvis |
| Brytpunkt | 520 px | ✗ (inte 480) |
| Rörelse | disk 640 ms + bock 560 ms (delay 300) med `cubic-bezier(.16,.84,.44,1)`; halo 4 s **infinite**; knapp 200 ms; reduced-motion: allt statiskt och synligt | – |

## Komponenter (en rad per komponent)

- **Sidskal med aurora** – body-gradienter + två `position:fixed` SVG-hörn (aria-hidden).
- **Glaskort** – flex-kolumn centrerad, 24 px gap, glas + blur, radie 32/16.
- **Animerad bock** – SVG viewBox 174: disk skalar in, bock ritas med stroke-dash, halo pulserar; `prefers-reduced-motion` visar allt direkt.
- **Hero** – h1 med hårdkodad `<br>` + `white-space: nowrap` på desktop (`text-wrap: balance` på mobil), ingress i mjukt bläck; gap `--apspace-s`.
- **Betygsrad** – `role="img"` + aria-label på stjärnorna; strong 600 i fullt bläck.
- **Hårlinje-divider** – 60 px teal-gradient.
- **Primärknapp** – inline-flex pill med pil-SVG (`fill: currentColor`) som glider 3 px på hover.
- **Ghost-länk** – pill-padding utan kant, låg emfas, i samma centrerade grupp som kortet (alltid i viewport).

## Det som gör blocket bra

- EN signaturrörelse (bocken) med korrekt reduced-motion-fallback; inget annat rör sig utom halo.
- Kort + ghost centreras som grupp på 100dvh: "Till startsidan" hamnar aldrig under viken, ingen scroll.
- Glaskortet med inset-highlight + 1 px vit kant läser som glas även på den ljusa auroran.
- Riktiga ap*-tokens för typskalan, radierna och två avstånd – den mest token-trogna av mina källor.
- a11y: fokusring, aria-labels, dekor aria-hidden; implementationen är px-konverterad så den inte kräver 62.5 %-rot.

## Defekter

1. LÅSTA BRIEF.md kräver 3-stegsstegen "Så här händer det nu", tillitsraden "3 000+ installationer/år" och "Medan du väntar"-etiketten – v1 FINAL saknar alla tre; `.cta-eyebrow`-CSS ligger kvar orphan. Stegen finns i stället på offer-accepted.
2. BRIEF länkar CTA:n till `/elinstallation/` (⚑ confirm) – byggd v1 länkar till `/elservice`.
3. Eget bläck `#0b1030` / `rgba(11,16,48,x)` i stället för `--apmidnight-blue`/`--apdarkest-black`; `--ink-faint` oanvänd.
4. Knappgradient `#00b89c→#018271` och `--teal-deep #018271` utanför tokens (briefens "måste lösa till teal" uppfylls i andan, inte i token).
5. Stjärnguld `#f6b53d` utanför tokens.
6. `--shadow-primary` definieras men `--apshadow-*` används aldrig; kortskuggan är egen.
7. v1 sätter ingen body-storlek – ostylad text blir 10 px.
8. Implementation ≠ v1: ghost-padding fast 9/16 px (v1 fluid) och betygsraden flyttad in i intro-blocket (+38 px). I övrigt 1:1.
9. Halo loopar för evigt (enda oändliga animationen i mina källor).
10. Google Fonts-request i den fristående sidan (README: produktionen har Outfit globalt).

## Vad som skiljer sig från andra block

Samma "aurora + glaskort + teal + Outfit"-språk som offer-accepted och bokningen – men tre olika kortrecept
(`.72` + blur här, `.74` + blur på offer-accepted, `.85` **utan** blur på bokningen), två fokusfärger (teal
här, navy på de två CRM-sidorna), två bockstorlekar (104 vs 86 px) och två knappgradienter i samma flöde.
