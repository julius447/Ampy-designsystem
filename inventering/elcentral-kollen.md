# Elcentral-kollen (`elcentral-kollen`)

**Vad:** Diagnostiken "Är din elcentral säker?" i rail+stage-familjen: varumärkeskolumn (H1 + lead + 3 trust-bullets + två gradient-CTA:er 1:1 från live + statistikrad) till vänster, vitt kort till höger som går start → 7 frågor (tap-chips, två flerval) → 2×2-besked (Säkerhet/Redo som pills i en tonad zon) → inline-lead. Finns även som **blockläge** (`preview/block.html`, `[data-layout="block"]`) för landningssidan: egen rubrik, band, kortet pinnat till en 560-kvadrat.
**Status:** live v2.26. **Auktoritet: 1.** Ingång `kallor/Elcentral-lead-magnet/preview/index.html` (OBS: previewen bär en header-simulering 66/76px + QA-bar som inte är verktyget), CSS `assets/elcentralkollen.css` (904 rader, `ampy-ec__*`), data i `data/elcentralkollen-data.json`.
**Mätning:** `_probes/elcentral-kollen.config.json` (start, fråga 1, flerval) + `elcentral-verdict/-akut/-oklart.config.json` (tre QA-celler via `?q=`) + census. Data i `elcentral-kollen.json`.

![desktop](skarmdumpar/elcentral-kollen-desktop.png)
![mobil](skarmdumpar/elcentral-kollen-mobile-state-fraga.png)

Fler: `-desktop-state-fraga.png` (option hover), `-desktop-state-fraga-multi.png` (flerval + "Fortsätt"), `-desktop-state-besked.png` (Låg risk / Med lastbalansering), `-desktop-state-besked-akut.png` (Förhöjd risk + röd akut-ruta + "Ring oss"), `-desktop-state-besked-oklart.png`, `-desktop-state-leadform.png`, `-block-desktop.png` / `-block-mobile.png`.

## Tokens: det viktigaste (avvikelser ⚠)

| Roll | Värde | Live-token | Kommentar |
|---|---|---|---|
| Accent (ikoner, valda kanter, bock) | `rgb(0,169,145)` | `--apteal-core` | exakt — men bara som accent, aldrig text |
| ⚠ Knapp / länk-teal | `rgb(0,122,105)` (hover `rgb(0,108,93)`) | — | "strong" för AA; tredje mörk-tealen i biblioteket (EV 0,125,107 · Energycalc 0,128,110) |
| Text primär | `rgb(9,11,50)` | `--apmidnight-blue` | exakt (kitet använder `rgb(15,18,60)`) |
| ⚠ Text sekundär / tertiär | `#5a5d7a` / `#8a8da5` | — | samma som Elkollen |
| ⚠ Ytor / kanter | `#ffffff` / `#f4f5fb` / `#f7f8fc` / `#e3e5ed` / `#ebedf3` | vit = `--appure-white` | övriga utanför |
| Gradient-CTA:er | `120° #55ff9a→#5eb1bf` / `141° #b6f2ff→#5eb1bf`, ink `#0d0d0d`, radius 16, skugga `0 0 16px rgba(241,241,241,.25)` | start `--apneon-mint` / `--apcrystal-blue`; `#5eb1bf` saknar token | 1:1 med live-knapparna (Picasso `elements/buttons`) — men här 58px höga, Picasso-versionen 38px |
| Pills (verdict) | success `rgb(214,240,229)/rgb(6,71,55)` · warning `rgb(250,233,197)/rgb(92,64,5)` · error `rgb(250,224,222)/rgb(124,32,32)` · info `rgb(224,236,248)/rgb(17,82,135)` · neutral `#f4f5fb` + kant `#8a8da5` | — | ⚠ egen palett, AA ≥6.8:1 |
| Accent-stapel / ikoner | `rgb(15,110,86)` / `rgb(135,101,7)` / `rgb(122,22,35)` / `rgb(13,86,140)` | — | ⚠ samma fyra som Elkollen |
| Tint-zoner | `rgb(240,249,245)` / `rgb(252,247,234)` / `rgb(252,243,243)` / `rgb(242,247,251)` / `rgb(248,249,252)` | — | ⚠ |
| Typsnitt | **Plus Jakarta Sans** 500-700 (rubriker, pills, etiketter) + **Outfit** 400-600 (allt annat), self-hostade | Outfit | ⚠ två familjer; GDPR-rent |
| Typskala | fasta `--fs-12…20` (px-namn) + `--fs-title`/`--fs-display` clamp + desktopskala ≥1024 | `--aptext-*` | blocklägets titel/lead och CTA-storleken är 1:1 `--aptext-xl` / `--aptext-mm` / `--aptext-sm` |
| Spacing | `--space-1…13` = 4…32 i 2px-steg; rytm 24(32)/12/8 | `--apspace-*` | ⚠ egen (delad med Elkollen) |
| Radier | 6 / 10 / **14** (kort) / full / 16 (gradient-CTA) | `--apradius-*` | 14 matchar ingen; 10 = m@mobil |
| Skuggor | `rgba(11,13,42, .04/.07/.10)` | — | ⚠ egen navy |
| Fokus | **en** ring `0 0 0 3px rgba(0,122,105,.9)` överallt | — | bäst i biblioteket |
| Container | 1280; blockläge 760 / ≥1280 1fr+560 | 1280 | ✓ |
| Rörelse | 120 / 220 / 300 ms, `cubic-bezier(.2,.6,.2,1)`, stegbyte ±10px | — | |

## Komponentlista (mått @1440 | @390)

- **shell** — grid 44fr/56fr gap 64 (rail 500 / stage 636), padding 56 40 | 24 16; mobil: rail `display:contents` och delarna ordnas runt kortet.
- **rail** — H1 PJS 700 44 | 32 (lh 1.08) → lead Outfit 20 | 18 → 3 bullets Outfit 500 17 + 20px teal-ikon (dolda på mobil) → gradient-CTA:er 240×58 | 358×60 (label vänster, ikon höger; telefon först på mobil) → stat 14/450. Mobil-extra: "Hellre prata med en elektriker direkt?" 17/500.
- **block** — vitt kort 1px `#ebedf3`, radius 14, padding 32 | 20, shadow-md; start + frågor min-height 560 | 600; stegbyten glider ±10px.
- **start** — 120px illustration → "Då sätter vi igång" PJS 700 36 | 21 → solid CTA 320×48 → "Beräknad tid: 2 minuter" 13.
- **crumb + steps** — 7 prickar 18×4 (aktiv 28, mörk teal; klara 70 %-mix), "Tillbaka" 13 höger; verdict: "Tillbaka" + "Börja om" 12.
- **question** — q-title PJS 600 32 | 20 max 26ch; options 64 | 56 hög, radius 10, Outfit 500 18 | 15; hover teal-kant + lyft, vald tint `rgb(240,250,248)`; info-ruta `#f7f8fc` med blå ikon.
- **option--multi** — 22px check-ruta radius 6 (vald teal + vit bock) + outline-"Fortsätt" 48.
- **dualstatus** (signaturen) — tint-zon radius 10 padding 18 | 14, 4px accentstapel, rader "Säkerhet"/"Redo" 15 | 14 + pill; fit-content min 420 ≥1024. 420×123 | 316×96.
- **pill** — PJS 600 18 | 14, padding 8 14 | 6 12, ikon 16 | 14; fem nivåer. "Låg risk" 117×38 | 94×29.
- **result-lede + findings** — lede 18 | 16 max 54ch; "Våra fynd" PJS 600 14; foldable rader ≥44 med ikon 20 färgad + label Outfit 500 18 | 15 + chevron; stagger 45 ms.
- **akut** — röd ruta (`rgb(252,237,238)` + kant `rgba(122,22,35,.38)`) radius 6, label PJS 700 13, text 15.
- **factnote** — amber-ruta (`rgba(135,101,7,.05/.22)`) med källänk.
- **cta-primary--solid / --outline / cta-secondary / cta-link / readmore** — 100 % 48px radius 10 Outfit 600 15; solid mörk teal; outline transparent; secondary 1px kant (⚠ Arial); "Ring oss" med telefonikon; readmore 14 centrerad med understruken länk.
- **share** — 44×44 ikonknapp + meny + toast.
- **stickycta** (mobil) — fixed vit shelf 77px med kortets primära CTA; auto-döljs när kontaktblocket syns.
- **lead** — "Tillbaka till beskedet" → titel PJS 700 20 | 22 → intro 15 → 2-kol grid (label PJS 600 13, input 52 radius 10, fokus mörk teal + ring) → fel 13 rött → submit 54 → samtyckesnot 12 (ingen checkbox) → success-kort.
- **blockläge** — band `#f5f9ff→#fff` padding 80 | 48; rubrik PJS 700 32 | 28 + lead 20 | 18 centrerade; kortet 636×560 | 343×600; ≥1280 grid 1fr/560 (kortet kvadrat); proveniensrad 13.

## Det som gör blocket bra (bevara)

1. Rail-innehållet centreras i en fast 560-box och kortet håller samma höjd på alla frågesteg — inget hoppar, scrollen är lugn, nästa steg landar exakt under den fixa headern.
2. Dualstatus-zonen: tint utan kant + 4px accent + två pills. Beskedet på två axlar läses på en blick, aldrig färg-only (ikon + ord i varje pill).
3. En fokusring (3px `.9`) mätt mot WCAG 2.4.11, forced-colors-block, self-hostade fonter med unicode-range — bäst tillgänglighetshygien i biblioteket.
4. Mobil-ordning utan DOM-kopior (`display:contents` + `order`) och ett kontaktblock som syns på varje vy (anti-lock-in) + sticky-CTA som vet när den ska försvinna.
5. Foldable findings: hela raden är träffyta, inget lämnar DOM.
6. Blockläget: samma kort, bandet tonat exakt mot värdsidans `rgb(245,249,255)`, kortet pinnat till kvadrat så copyn får resten.

## Defekter

1. `cta-secondary` och share-knappen saknar `font-family` → **Arial** (syns i `-besked-akut.png`).
2. Tre "primära" knappstilar i samma kort: gradient-pill 58px (rail) / solid mörk teal 48px / outline — och gradient-knappen är 58px här mot Picassos kanoniska 38px.
3. Två tealer (accent `0,169,145` / knapp `0,122,105`) + egen navy `rgb(11,13,42)` i skuggor.
4. PJS-rubriker medan syskonet Elkollen v7 är Outfit-only.
5. Kortradius 14 matchar ingen token; radius 10 bara `--apradius-m` på mobil.
6. "Tillbaka" 13 + "Börja om" 12 i verdict-crumben sitter ihop med olika storlek och baseline.
7. Typskalans namn är px-värden (`--fs-13`).

## Vad som skiljer sig från andra block

Syskon till Elkollen: samma rail/stage-hero (44/56, gap 64, samma gradient-CTA-recept, samma 2px-spacing, samma accent/tint-fyrfärg). Skillnader: PJS-rubriker (Elkollen Outfit), dualstatus-zon utan kant (Elkollen board med kant + 6px sidostapel + wash), fokusring .9 (Elkollen .25), sticky-CTA på mobil (Elkollen saknar), blockläge. Mot kalkylatorkitet: helt ljust (ingen midnattsyta), verdikt i stället för siffra, `ampy-ec__` i stället för `ampy-calc__`.
