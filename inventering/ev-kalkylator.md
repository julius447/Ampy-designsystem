# Laddbox-kalkylatorn (`ev-kalkylator`)

**Vad:** "Hur mycket sparar du på att ladda hemma?" — samma tvåkorts-kit som LED (`ampy-calc__*`), men med två produktväljare (bil med foto, 16 laddboxar med foto + badge), två sliders, AC/DC-toggle, SE-segment, och ett resultatkort där månadspanelen (publik vs hemma-stapel + "Du sparar") är signaturen. CSS-huvudet kallar sig fortfarande "Battery Calculator CSS" — det är batterikitet med EV-innehåll.
**Status:** live, datasignering kvar. **Auktoritet: 1.** Ingång `kallor/EV-Caluclator/index.html` → `prototype/index.html`, CSS `prototype/styles.css` (1175 rader).
**Mätning:** `_probes/ev-kalkylator.config.json` + `ev-popover.config.json` → `.measure.json`; pseudo-element-läsning av staplarna; census `_probes/census-ev.json`. Data i `ev-kalkylator.json`.

![desktop](skarmdumpar/ev-kalkylator-desktop.png)
![mobil](skarmdumpar/ev-kalkylator-mobile.png)

Fler states: `-desktop-state-selector.png` (16-boxlistan med foton och badges), `-desktop-state-popover.png` (i-popover), `-mobile-state-leadform.png` (formulär + inline-fel + metodik öppen).

## Tokens: det viktigaste (avvikelser ⚠)

| Roll | Värde i EV | Live-token | Kommentar |
|---|---|---|---|
| ⚠ Primär accent (knappar, aktiva states, slider, badge) | **`rgb(0,125,107)`** | — | mörkad teal "för AA"; ägarflaggad lokal kopia. `--apteal-core` finns kvar bara i kortglöd + chart-tokens |
| Mörk yta | `rgb(9,11,50)` + samma radialglöd som LED | `--apmidnight-blue` | exakt |
| Success | `rgb(57,194,129)` | `--apemerald-flow` | exakt |
| ⚠ Amber | `rgb(240,175,56)` → `rgb(214,150,40)` i stapeln | — | utanför tokens |
| ⚠ Text / ytor / kant | `rgb(15,18,60)` / `rgb(86,94,130)` / `rgb(247,249,251)` / `rgb(234,239,243)` / `rgba(15,18,60,.12)` | — | samma near-miss-set som LED |
| Typsnitt | PJS + Outfit + JetBrains Mono | Outfit | ⚠ tre familjer |
| ⚠ Typskala | `clamp(MIN, MIN + (MAX−MIN)·((100cqi−320px)/960), MAX)` | `--aptext-*` | **BUGG:** divisionen ger px, inte faktor → h1 23px (avsett 48), hjälte 38.7px (avsett 75). LED-CSS:en dokumenterar samma bugg som rättad |
| Spacing | 5 / 7.5 / 10 / 15 / 20 / 30 px | `--apspace-*` | ⚠ fast skala |
| Radier | 6 / 12 / 20 / full | `--apradius-*` | matchar i ena änden |
| Skuggor | som LED + popover `.18` | — | egna |
| Brytpunkter | **container queries** (cqi) 960/768/600/560/500/480/420 + `pointer: coarse` | — | unikt i kitet |
| Rörelse | 150 / 300 ms; slider helt på 150 ms; reveal 40→280 ms | — | snabbare slider än LED |

## Komponentlista (mått @1440 | @390)

- **header** — versal label Outfit 500 10px + h1 PJS 700 23px (buggen).
- **card-input / card-surface** — padding 20 / gap 15 på båda (≤600cqi 15/10, ≤420 10). 525×745 / 735×762 | 374×695 / 374×751.
- **selector-button--prominent** — 70px | 65px; foto 48×48 radius 6 (vit bakgrund via `:has(photo)`), namn PJS 600 17, best Outfit 10, badge före chevron.
- **selector-list** — 500px hög scroll-lista, 63px options med foto + badge; max-height min(50rem,60vh).
- **badge** — pill 20px, Outfit 600 10: promote solid mörk teal / soft teal-wash / muted outline.
- **value-prominent** — JetBrains Mono 700 20px (låst av buggen), enhet Outfit 500 12; `.is-snap`-blink.
- **slider** — spår 6px, thumb 24 + osynlig 44px träffyta, fill scaleX 150ms, tick-knappar Outfit 10 (9px på mobil) + `tick--marker` 2×6px streck för omärkta stopp.
- **toggle (AC/DC)** — pill-spår 48, option 64×40 PJS 600 12; aktiv solid mörk teal + vit.
- **segmented (SE1–SE4)** — 48/40 som LED + inset 1px ring på aktiv.
- **tip + popover** — 16px i (44px träffyta på touch); popover i body: 280px max, bg midnatt, Outfit 13/1.45, radius 6, caret.
- **hero15** — eyebrow PJS 600 12 versal → "≈ 17 276" PJS 700 38.7 | 26.2 + "kr/år" PJS 500 20 | 17 → sub Outfit 12 i .94.
- **trio (2 tiles)** — 1.2fr 1fr ≥560cqi; label Outfit 500 10 versal / värde PJS 700 18 (10-årstile 20) / sub 10.
- **monthly** (signaturen) — panel bg vit .06 radius 12 padding 15: label 10 versal, värde PJS 700 18 (amber / emerald), stapel 10px (spår .08 + inset ring .14; publik amber-gradient, hemma teal→emerald) och delta-rad "Du sparar" PJS 700 20 emerald. 693×244 | 352×229.
- **savings-breakdown** — JS-inline box bg .06 radius 12: label Outfit 10 / värde mono 600 12 färgad.
- **cta-stack** — primär PJS 600 17, 56px, mörk teal, shadow-md; sekundär "Läs mer om Zaptec Go" 48px bg .06 + kant .28 — ⚠ texten blir `rgb(0,125,107)` på midnatt (global `.ampy-calc a` vinner).
- **lead-form** — sektion bg .06 radius 12 padding 10; CTA:n står kvar ovanför; 2-kol ≥600cqi; input 48px bg midnatt kant .28; inline-fel Outfit 10 röd under varje fält; native checkbox 20px accent-color; success/error-box.
- **methodology** — som LED.
- **Oanvänt i markup** — cumulative-callout, spec-table, trust-strip, streams (bar/legend), info-note, locked-value, btn--secondary/ghost/outline: kitets fulla vokabulär ligger i filen.

## Det som gör blocket bra (bevara)

1. Container queries + `pointer: coarse` — verktyget svarar på sitt utrymme och ger touch ≥44px överallt utan visuell förändring.
2. Slidern landar thumb + fill samtidigt (150 ms), pan-y i vila, scaleX på kompositorn, tick-marker för omärkta stopp.
3. Produktväljaren: riktiga foton i 48px kvadrat, tre badge-nivåer med semantik, scrollbar lista med overscroll-contain.
4. Popover-mönstret (body-nivå, caret, Escape, edge-clamp, px-fallbacks) — bättre än LED:s tooltip.
5. Inline-fel per fält + `accent-color`-checkbox: minsta möjliga egen CSS för formulärets states.
6. Staircase-typografi hjälte → 10-år/delta → värden.

## Defekter

1. **Typskalan låst av cqi-buggen** (h1 23px, hjälte 38.7px, tick 9px på mobil).
2. **Två primära tealer i kitet**: `rgb(0,125,107)` här, `rgb(0,169,145)` i LED/Battery.
3. Sekundärknappens text i mörk teal på midnatt (kontrast).
4. Standalone: `body` utan `margin:0` → 8px vit ram; container `padding: 20px 0` → korten går kant i kant på 390.
5. Kortpadding 10px på mobil (≤420cqi) — tätast i kitet.
6. ~40 % oanvänd CSS.
7. Två "sub"-vitheter för samma roll (.94 hero-sub vs .55 trio-sub).

## Vad som skiljer sig från andra block

Mot LED: mörk teal, låst skala, 20px kort-padding överallt, cqi, 150 ms slider, foto-selector, månadspanel i stället för före/efter-rad, inline-fel + native checkbox, CTA 56/17 mot 50/15, CTA:n kvar ovanför formuläret. Mot Battery: samma CSS-stam (samma fel i typskalan, samma tokens) men Battery behåller `rgb(0,169,145)` och streams/payback-devicen som EV tog bort.
