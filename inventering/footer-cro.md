# footer-cro — global footer: baslinje (= live, auktoritet 1) + tre riktningar (3)

**Vad:** Sajtens footer i tre zoner (ljus prefooter "Populära kategorier" · mörk footer · footer-bar).
`baseline.html` är en 1:1-återskapning av live (42/42 computed values identiska, ikonfonter ersatta med
inline-SVG). Riktning A (rättad baslinje), B (speglad meny, ★ rekommenderad) och C (kontakt först) väntar
ägarval. **Auktoritet:** baslinje 1, riktningar 3.

Renderat: baslinje + A/B/C vid 1440/390. Mätt: baslinjen (`_probes/out/a1-footer-cro.json`).

![Baslinje 1440](skarmdumpar/footer-cro-baseline-desktop.png)
![Baslinje 390](skarmdumpar/footer-cro-baseline-mobile.png)
(Riktningar: `footer-cro-riktning-{a,b,c}-{desktop,mobile}.png`.)

## Vad jag ser

Prefooter: diagonal cyan-gradient (stål → isblå), "Populära kategorier" 32 px 600, fem kolumner utan spalt
med 20 px-rubriker och 16 px 300-länkar i mörkgrått. Footer: navy-gradient med inre skugga upptill; logo
130 px, brand-text 16 px, fem vita sociala ikoner, "G 5.0 ★★★★★" i teal (Plus Jakarta Sans!), och tre
länkkolumner (Mer om Ampy · Kundtjänst · "Få en kostnadsfri konsultation!" med adress/mejl/telefon).
Bar: nästan svart, copyright 12 px vänster, tre policy-länkar 14 px höger. Mobil: allt staplat (1976 px
högt), prefooter-kolumnerna en och en, Google-raden centrerad, bar-länkarna i kolumn.

## Tokens (mätt) — baslinjen

| Roll | 1440 | 390 | Källa | Mot ap*-tokens |
|---|---|---|---|---|
| prefooter h3 | 32 px / 600, `#1e1e1e` | 24,5 / 500 | `--aptext-xl` | ✔ token (färg = darkest-black) |
| prefooter h4 | 20 / 500, `#363636` | 20,1 (`--aptext-ml` @478 — hoppar upp) | `--aptext-mm` | ✔ token; färg utan token |
| prefooter länk | 16 / 300 | 14,1 | `--aptext-sm` | ✔ |
| footer h | 24 / 500 vit | 22,1 | `--aptext-l` | ✔ |
| footer länk | 16 / 400 | 14,1 | `--aptext-sm` | ✔ |
| brand-text | 16 px fast / 300 / lh 1.4 | 16 | px | fast, skalar inte |
| Google "5.0" | 16 / **Plus Jakarta Sans 800** uppercase, `rgb(0,168,143)` | 14,1 | `--aptext-sm` | typsnitt + färg (`--color-15`) utan token |
| copyright / policy | 12 (`--aptext-xs`) / 14 px fast | 10,1 / 14 | | policy fast |
| prefooter padding | 56 · 39,6 · 39,6 | 27,3 · 21,5 | `--apspace-xl/-l` | ✔ |
| footer padding | 79,2 · 39,6 | 34,8 · 21,5 | `--apspace-2xl/-l` | ✔ |
| gap/marginal | row-gap 24, grid-mb 36 (fasta), kolumn-gap 60/50 fast, li 7, block 14 | | legacy `--space-m/-l` + px | blandat |
| kolumner | brand 384 (30 %) · links 768 (60 %) · kontakt 50 % | 100 % | % | – |
| sociala | a 53,8 h (padding 9,9), svg 20, gap 9,9 | 50,6 h | `--apspace-2xs` | träffytan styr kolumnhöjden |
| bar | 68 h (5,2 + 19,8 padding) | 126,9 h | `--apspace-4xs/-s` | ✔ |
| brytpunkter | 991 / 767 / 478 | | Bricks | = Bricks-skalan (inte site-css:s 992/768/560) |

Färger: gradienter `−51deg #70becb → #bbf5ff → #b6f2ff → #70becb` (prefooter) och `−17deg #00011e → #090b32`
(footer) + `inset 0 8px 8px #010033`, bar `#01021f`. Tokenmatchade: `#b6f2ff` (crystal-blue), `#090b32`
(midnight), `#1e1e1e`, vit. Utan token: `#70becb`, `#bbf5ff`, `#00011e`, `#01021f`, `#010033`, `#363636`,
`rgb(0,168,143)`. Inga radier, ingen rörelse i baslinjen.

## Komponenter

| Komponent | En rad |
|---|---|
| Prefooter | cyan-gradient, h3 `--aptext-xl` 600, 5-grid gap 0 (mobil 2 → 1), h4 `--aptext-mm` 500, länkar `--aptext-sm` 300 |
| Footer brand | logo 130×37 (max 50 %), text 16/300 max-w 85 %, 5 sociala 20 px i 53,8 px-ankare, Google-rad G 29 + "5.0" PJS 800 teal + 5 teal-stjärnor 18 |
| Footer länkkolumner | 60 % flex-end, gap 60/50, h `--aptext-l` 500, länkar `--aptext-sm` 400, kontakt-rader med 16×18-ikoner |
| Footer-bar | `#01021f`, copyright `--aptext-xs`, 3 policy-länkar 14 px, gap `--apspace-l` |

Varianter (en rad var): **A** rättad baslinje — telefonrad överst + hårlinje, Google-raden i Outfit/vit
"5,0 på Google", ikon-linjerade kontaktrader, `minmax(0,1fr)`. **B ★** speglad meny — prefootern speglar
headerns taxonomi ("Hitta rätt": Tjänster · Produkter · Lösningar · Elektriker nära dig), mörk zon Mer om
Ampy · Avdrag 2026 · Gratis rådgivning, bar "© 2026 Ampy Nordic AB". **C** kontakt först — ljus zon =
handlingszon (kontaktblock utan ram + Hitta rätt), slank mörk zon med Följ oss. **v2.html** ersatt.

## Hantverk att bevara

- Baslinjen är mätt, inte gissad (42/42) — och dess defekter är dokumenterade i ANALYS.md.
- Riktningarna behåller exakt samma href-mängd; telefonraden överst är redan ägargodkänd.
- Prefootern är sajtens enda konsekventa användare av `--aptext-*`/`--apspace-*` rakt av.

## Defekter (baslinjen = live)

1. Fyra "nästan-navy" utan tokens (`#00011e`, `#01021f`, `#010033`, + gradientens `#70becb/#bbf5ff`).
2. Plus Jakarta Sans 800 för "5.0" — enda förekomsten; färgen är Bricks `--color-15`, inte teal-core.
3. Blandade enheter: fluid ap-tokens + fasta Bricks-legacy (`--space-m/-l`) + råa px (16, 14, 60/50).
4. Sociala ankarens padding styr kolumnhöjden (201 px) av misstag; prefooter-grid utan spalt; h4 växer på mobil.
5. `#363636`/`#1e1e1e` utan token; "Få en kostnadsfri konsultation!" med `!`; shape divider död.
6. Fakta: adress Hägersten vs Solna `[GAP]`, "5.0" hårdkodat, org.nr saknas.

## Skiljer sig från andra block

Enda blocket med pastell-cyan-gradientyta och med Plus Jakarta Sans; enda som använder Bricks-brytpunkterna
991/767/478 rakt av.
