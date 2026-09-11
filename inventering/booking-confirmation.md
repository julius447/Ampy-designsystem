# booking-confirmation — bokningsbekräftelsen (riktning B "Dagen") + offert-accepterad

**Vad det är.** Den CRM-renderade sidan kunden får när offerten är accepterad och tiden bokad. Ett 780 px
brett dokument (ingen sajtheader, ingen nav) på sky-mist-aurora: dokumenthuvud (svart wordmark + pill
"Bokning #B-2026-0431" + "Offert #2026-0187") → fyra vita kort i kolumn: **1) datumet som H1** med
"Imorgon,"-prefix, tid och adress som två faktabrickor · **2) elektrikern** (avatar + namn + roll) och
arbetslistan med bockar + fällbar materiallista · **3) beställningen** som kvitto (rader, TILLÄGG-tagg,
tonad totalplatta 12 750 kr, fällbara villkor) · **4) "Behöver du höra av dig?"** med tre sekundärknappar
(Ställ en fråga / Föreslå en ny tid / Avboka) som öppnar paneler med fält + navy skicka-knapp → sidfot med
org.nr och telefon. Fyra tillstånd via `bokning.status`.

**Status.** Riktning B levererad till Yassine (HANDOVER.md 2026-09-02), auktoritet 2. Syskon till
offertmallen (`Ampy-nordic/offert-mall` v7.9, privat): laddar tokens.css → **shared.css (offertmallens
1157 rader, ~19 % används)** → bokning.css (233 rader). Riktning A/C = frysta utkast (ej inventerade).

**Ingång.** `kallor/Booking-confirmation/riktning-b-dagen/index.html`. Rot **16 px** – ingen 62.5 %; all
CSS i px. Data: `inventering/booking-confirmation.json` (offer-accepted som `offer_accepted`-sektion).

| Desktop 1440 | Mobil 390 |
|---|---|
| ![](skarmdumpar/booking-confirmation-desktop.png) | ![](skarmdumpar/booking-confirmation-mobile.png) |

Panel öppen + materiallista + fältfel: `skarmdumpar/booking-confirmation-panel-desktop.png` / `-mobile.png`.

## Det viktigaste i tokens (✗ = avvikelse mot ap*)

`tokens.css` (= global-variables.css) laddas "för paritet" men **refereras 0 gånger**; shared.css deklarerar
en egen layer: `--navy #090b32`, `--teal #00a991`, `--teal-deep #018271`, `--teal-ink #016a5d`,
`--teal-link #017666`, `--teal-soft #e0f5f2`, `--ink #0b1030`, `--ink-soft rgba(11,16,48,.62)`,
`--body-ink #333`, `--muted #565e82`, `--faint #646b88`, `--line .09 / --line-soft .16 / --line-strong .48`,
`--r-md 14 / --r-lg 22 / --r-xl 32`, `--shadow-1/2/3`, `--card-glass .74`, `--card-border .9`,
`--ease cubic-bezier(.16,.84,.44,1)`.

| Roll | Uppmätt (1440 / 390) | ap*-token |
|---|---|---|
| Body | Outfit 16 px 400 lh 1.5 `#0b1030` på `#f5f9ff` + samma fyra aurora-radialer som tack-sidan | ✗ bläck · ✓ `--apsky-mist` |
| Eyebrow "VI KOMMER" | 12 px 700, ls .12em, uppercase, `#646b88` | ✗ |
| H1 datum | `clamp(30px, 5.5vw, 46px)` **46 / 30 px**, 600, lh 1.05, ls −0.025em | ✗ egen clamp (≈ `--aptext-3xl` 48/31) |
| H2 kortrubrik (`.of-h2`) | `clamp(20px, .8vw+17px, 24px)` 24 / 20.1 px, 600, lh 1.2, mb 16 | ✗ (≈ `--aptext-l` 24/22) |
| Momentrubrik h3 / beskrivning | 16.5 px 600 / 15 px **300** `#333` | ✗ halvpixlar; `#333` = `--apcharcoal-gray` ✓ |
| Faktatext | 16 px 500, tid 700 tabular-nums; bricka 34 px `#e0f5f2` + kant teal .24, radie 14, glyf 18 px stroke 2.1 `#016a5d` | ✗ teal-soft/teal-ink egna |
| Elektriker | avatar 64 (56) px, navy-gradient `#090b32→#1b2050`, ring `0 0 0 3px #fff, 0 0 0 4.5px rgba(0,169,145,.35)`; namn 20 (18.5) px 600; roll 14.5 px 400 | ✗ |
| Kort | `rgba(255,255,255,.85)` + kant `.9`, radie **22**, skugga `0 18px 44px rgba(9,11,50,.09)` + inset; padding 32/32 → 24/16; **ingen backdrop-filter** | ✗ radie mellan `-l` 20 och `-xl` 24.5 |
| Kvitto | rader 15 px, prickad `--line`; tagg 11 px 700 `.1em`; totalplatta `#e0f5f2` radie 14, etikett 12/700, not 13/500, belopp `clamp(26px,3.4vw,30px)` 700 navy | ✗ |
| Sekundärknapp | 52 px, radie **16**, kant 1.5 px `rgba(11,16,48,.48)`, vit .7, 15 px 500; expanded = navy-kant + skugga; disabled .45 | ✗ |
| Fält | 48 px (textarea 96), 1.5 px kant line-strong, radie 14, 16 px text, placeholder `#646b88`; fel = kant `#8a6116` | ✗ ingen varningstoken |
| Skicka-knapp | full bredd 48 px, radie 14, **solid navy `#090b32`**, 15.5 px 600, hover `#12174a` −1 px | ✓ `--apmidnight-blue` (medvetet aldrig teal) |
| Pill i huvudet | 13 px 600 `#016a5d` på teal .08, kant .18, 5/12, radie 999 | ✗ teal-ink |
| Fokus | `:focus-visible` outline 3 px `#090b32` offset 3 (fält offset 2 + navy kant); forced-colors Highlight | ✓ midnight (tack-sidan: teal) |
| Spacing | deklarerad skala **4/8/12/16/24/32/48/64**; flöde 48 (32), kort-syskon 16, rubrik→innehåll 24, avdelare 24/24, knappgrid gap 12 | ✗ ingen `--apspace-*` |
| Brytpunkter | 680 (knappar på rad), 480 (telefon), 359 (huvudet bryts), max-height 620, print | ✗ (992/768/480 saknas utom 480) |
| Rörelse | panel fade .22 s, pil .18 s, knappar .15–.16 s; reduced-motion nollar allt | – |

## Komponenter (en rad per komponent)

- **Dokumenthuvud** – logo 24 px (svart 1600×468 PNG), pill + sekundär referens; 64 px hög; ≤480 56 px och wrap.
- **Kort** – vit .85, radie 22, mjuk skugga; fyra i kolumn med 48 px gap; print utan skugga.
- **Datum-hero** – eyebrow → h1 datum (+ "Imorgon," i teal-ink på egen rad, räknat i kundens lokala tid) → dold statusrad → avdelare → faktapar.
- **Faktarad** – 34 px rundad kvadrat-bricka + 18 px linjeglyf + text med första raden optiskt centrerad (`padding-top: calc((34px − 1.45em)/2)`).
- **Elektriker-rad** – avatar (foto eller person-glyf) + namn/roll, ingen ram, linje under.
- **Arbetslista (`.of-work`)** – 26 px bock-cirkel (`#e0f5f2`, 13 px bock stroke 3) + h3 + valfri p; moment med beskrivning får +8 till nästa.
- **Expander (`<details>`)** – material (2-kolumns grid, 6 px teal-punkter) och villkor (13.5/300 + bokarens text på dashed platta + 44 px länk); chevron roterar; öppna vid print.
- **Beställningskvitto** – rader + TILLÄGG-tagg + totalplatta i två avsiktliga lägen (rad ≥480, stapel <480).
- **Sekundärknapp ×3** – i grid: 1 kolumn, ≥680 tre kolumner med panelen över hela raden (`order`).
- **Svarspanel** – h3 + hint + fält (datum/select/textarea) + navy skicka-knapp + statusrad (block `#8a6116` / ok `#017666`); `is-done` gråar fälten.
- **Sidfot** – 12.5 px `#646b88`, org.nr + telefonlänk med 44 px träffyta.
- **Print** – bara `@media print`; ingen print-knapp, **ingen ICS/kalenderfil**.

## Det som gör blocket bra

- En uttalad avståndsskala (4/8/12/16/24/32/48/64) och tre rytmregler skrivna i CSS-huvudet – det enda blocket i mina källor med en deklarerad spacing-doktrin.
- Kontrastarbete med siffror i kommentarerna: `#8a90ac` → `#646b88` (3,07 → 4,97:1), kontrollkanter .16 → .48 (1,41 → 3,1:1), teal-ring 2,91:1 → navy.
- Fokus via `outline` (överlever egna box-shadows) + forced-colors; 44–48 px träffytor; 16 px i fält.
- Totalplattan som EN komponent i TVÅ avsiktliga lägen i stället för radbrytningsstyrd layout.
- `overflow-wrap: anywhere` på CRM-text, `textContent` i stället för `innerHTML`, sidan påstår aldrig mer än "mottaget".
- Det mänskliga: elektrikern utan ram ("en hälsning från en människa"), priset som kvittens utan betalkrav.

## Defekter

1. Produktionstokens laddas men används inte; egen tokenlayer i px med 16 px-rot (kan inte samexistera med sajtens 62.5 %-rot utan konvertering).
2. Eget bläck `#0b1030` (delat med tack/offer) + `--heading-ink #1e1e1e` definierad men oanvänd.
3. Fyra egna tealnyanser (`#016a5d`, `#017666`, `#018271`, `#e0f5f2`); `--apteal-core` bara i alfa.
4. Tre radier i samma kort (fält 14, knapp 16, kort 22) – ingen ligger på token-stegen.
5. Kortet är inte glas trots "glaskort"-språket – tre olika kortrecept i kundflödet.
6. shared.css bär ~81 % oanvänd offertmall-CSS, inkl. `.of-btn-primary` med brandbokens `#55ff9a→#5eb1bf`.
7. Två fokusfärger i samma flöde (navy här, teal på tack-sidan).
8. Typskala med halvpixlar (12.5 / 13.5 / 14.5 / 15.5 / 16.5 / 18.5) – ingen fluid skala utom h1/h2/total.
9. Ingen ICS/kalender, ingen synlig utskriftsknapp.

## Offert-accepterad (kallor/Offer-accepted-preview, auktoritet 3 – publik spegel)

| Desktop 1440 | Mobil 390 |
|---|---|
| ![](skarmdumpar/offer-accepted-desktop.png) | ![](skarmdumpar/offer-accepted-mobile.png) |

Samma sidskal som tack-sidan (aurora-SVG:er + radialer, glaskort `.74` + blur 16, radie 24–32 i px), men
**sektionerat**: bock 86 px + h1 36/27 px 600 + referens-pill → 1 px linje → eyebrow "SÅ HÄR GÅR VI VIDARE"
(12 px 600 `.14em` `#018271`) + **vertikal 3-stegsstege** (42 px gradient-noder `#018271→#016a5d` med 3 px vit
inset-ring, 2 px teal-linje nod→nod, rubrik 17/600, small 14/400; gruppen `width: fit-content` centrerad) →
1 px linje → stjärnor 14 px + "5 av 5 i betyg på Google" 13.5 px + "Ring 010-265 79 79" (understruken 44 px
länk). Fokus navy (teal mätte 2,91:1). Print-läge. 0 ap*-referenser; samma egna bläck/teal som bokningen.
Stegen är den komponent tack-sidans brief efterfrågade.

## Vad som skiljer sig från andra block

Enda blocket med **fasta px och 16 px-rot**, enda med deklarerad spacing-skala, enda med **solid navy**
primärknapp (skicka) och navy fokusring, enda med `<details>`-expanders, kvitto-rader och formulärfält i
CRM-stil (48 px, radie 14). Den mest "dokument"-lika ytan: max 780 px, ingen nav, inga exits.
