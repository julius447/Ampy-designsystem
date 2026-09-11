# Inventeringsbrief: extrahera Ampys designsystem ur blockbiblioteket

Uppdrag från Julius 2026-09-11: "återskapa Ampys designsystem från start, baserat på alla designs vi skapat i
blockbiblioteket: spacing, typografi, färger, komponenter, allting, så att jag kan se vad vi designar
baserat på, och därifrån fixa det fundamentalt."

Fas 1 (den här briefen) är **inventering**: mät vad som faktiskt finns i de byggda blocken. Ingenting
hittas på, ingenting "förbättras". Klon-först: vi beskriver det som är, med källa per värde.

## Källorna (alla ligger i `kallor/`, grunt klonade 2026-09-11 från julius447)

Auktoritet: **1** = ägargodkänd/live/låst (kanon), **2** = levererad/produktionsklar (stark), **3** =
riktningar/prototyp (bara som belägg för mönster, aldrig kanon).

| Slug | Vad | Status (blockbiblioteket 2026-09-08) | Auktoritet | Ingång |
|---|---|---|---|---|
| live-ampy-se | Sajtens riktiga CSS (global-variables.css = de 101 ap*-tokens, theme-style, frontend, site-css) + två live-block extraherade | live | **1** | `kallor/live-ampy-se/` |
| Hero-1 | Startsidans hero, riktning B | ÄGARGODKÄND ("PERFEKTION") | **1** | `kallor/Hero-1/index.html` |
| Website-blocks | Headern (godkänd) + Hero 1 | header godkänd | **1** | `kallor/Website-blocks/` (hitta previewfilen) |
| CTA-website | Knappbiblioteket, 3 kanoniska CTA + katalog-JSON | levererat som bibliotek | **1** | `kallor/CTA-website/index.html` |
| Main_CTA | Primära CTA-bandet (ring), variant B | produktionsklar | 2 | `kallor/Main_CTA/index.html` |
| Hero_2-alternatives | Herosystemet S/G/Z/E v18 för tjänstesidor | slutversion, lanseringsgrindar | 2 | `kallor/Hero_2-alternatives/index.html` |
| Hero-2-form | Hero 2:s offertformulär (V1/V2) | blocker: lead-endpoint | 2 | `kallor/Hero-2-form/index.html` |
| mini-menu | Produktväljaren under hero (ljus glas-trio) | levererat | 2 | `kallor/mini-menu/index.html` |
| Footer-CRO- | Global footer: baslinje (= live) + 3 riktningar | väntar val, B rek | baslinje **1**, riktningar 3 | `kallor/Footer-CRO-/index.html` |
| ROT-GT-CRO- | Avdragsblocken (ROT, GT-produkt, GT-generisk, hemförsäkring), klon + 4 hi-fi | levererat till Chris | 2 (klonen av live = 1) | `kallor/ROT-GT-CRO-/index.html`, `designs/`, `rot.html` |
| Testimonials-block | Omdömesslidern | V1 låst | **1** | `kallor/Testimonials-block/index.html` |
| Certificates | Tillitsblocket, klon + v2 | levererat, paritet | 2 | `kallor/Certificates/index.html`, `redesign/` |
| Eljour-block | Symptomblocket, sticky call-panel | "sajtens bästa block 23/25" | **1** | `kallor/Eljour-block/index.html` |
| Eljour-sticky-bar | Sticky ring-bar mobil + hörnkort | väntar hörnval | 2 | `kallor/Eljour-sticky-bar/index.html` |
| f-re-efter-CRO- | Före/efter med reglage, riktning A | klart | 2 | `kallor/f-re-efter-CRO-/index.html` |
| V-r-process-CRO- | Vår process, 3 riktningar | väntar val | 3 | `kallor/V-r-process-CRO-/index.html` |
| Fotobed-mning-CRO- | Fotobedömningen v1 + v2 | v2 byggd, go/no-go | 2 | `kallor/Fotobed-mning-CRO-/preview/` |
| Led-kalkylator | LED-kalkylatorn, tvåpanel | live, en signering kvar | **1** | `kallor/Led-kalkylator/index.html` |
| EV-Caluclator | Laddboxkalkylatorn | live, datasignering | **1** | `kallor/EV-Caluclator/index.html` |
| Energycalc | Energikalkylatorn vB v36 | live | **1** | `kallor/Energycalc/vB/` |
| Elcentral-lead-magnet | Elcentral-kollen, diagnostik rail+stage | live v2.26 | **1** | `kallor/Elcentral-lead-magnet/index.html` |
| Elkollen | Behörighetskollen | live v7.3.8 | **1** | `kallor/Elkollen/preview/` |
| Battery-calculator | Batterikalkylatorn | prototyp | 3 | `kallor/Battery-calculator/index.html` |
| Ampy-main-form | /offert-formulärets redesign | design GO | 2 | `kallor/Ampy-main-form/index.html` |
| Thank-you-Offer-accepted | Tack-sidan, v1 FINAL | överlämnad | 2 | `kallor/Thank-you-Offer-accepted/index.html` |
| Thank-you-implementation | Tack-sidans implementationspaket | levererat | 2 | `kallor/Thank-you-implementation/index.html` |
| Offer-accepted-preview | Offert-accepterad (CRM-sida) | spegel | 3 | `kallor/Offer-accepted-preview/index.html` |
| Booking-confirmation | Bokningsbekräftelsen (CRM-sida), riktning B | levererad till Yassine | 2 | `kallor/Booking-confirmation/riktning-b-dagen/` |
| ampy-article-template | Artikelmallen, 21 komponenter | 187 filer okommitterade lokalt (klonen är repots läge) | 2 | `kallor/ampy-article-template/index.html` |
| Picasso | Referensbiblioteket + 5 byggen (bl.a. main-form-prototypen) | inspiration, ej kanon | 3 | `kallor/Picasso/` |
| Brandbook | Ampy Brandbook (PDF) + logotyper | varumärkets grund | **1** för logo/palett/typsnittsregler | `~/Desktop/Brandbook/Ampy Brandbook (6).pdf`, `~/Desktop/Brandbook/LOGO/` |
| Tidigare dokumentation | designsystem-skillen (`.claude/skills/ampy-design-system/` SKILL.md, tokens.md, components.md, reference/), `ampy-foretagsdata.md` §9 och §11 | beskrivning, inte sanning | jämförelseunderlag | projektroten `/Users/juliuscallahan/Desktop/Claude Code/` |

Uteslutet ur kanon: `rot-gt-calculator/wireframes/` (byggda i dag, underkända av ägaren: "extremt svag design").
De får användas som **motexempel** i fas 2.

## Vad varje källa ska ge (skriv `inventering/<slug>.md` + `inventering/<slug>.json`)

Mät, gissa inte. Använd grep på CSS/HTML, och Playwright för beräknade stilar (`getComputedStyle`) på riktiga
element i renderad sida. Rendera varje källa desktop 1440 + mobil 390 med `node tools/shot.mjs <path> inventering/skarmdumpar/<slug>`
(skriv `--query` om ingången behöver det). Öppna PNG:erna och titta.

JSON-schema (samma för alla, tomma listor om inget finns):

```json
{
  "kalla": "hero-1", "status": "ägargodkänd", "auktoritet": 1, "ingang": "kallor/Hero-1/index.html",
  "skarmdumpar": ["inventering/skarmdumpar/hero-1-desktop.png", "..."],
  "farger": [{"hex": "#00a991", "token": "--apteal-core", "roll": "primär knapp bg", "antal": 12, "kalla_fil": "style.css:120"}],
  "typografi": [{"roll": "h1", "font": "Outfit", "size": "clamp(4rem, 3rem + 3.2vw, 6.8rem)", "px_desktop": 68, "px_mobil": 40, "weight": 800, "lh": 1.04, "ls": "-0.022em", "kalla_fil": "..."}],
  "spacing": [{"roll": "section-padding-y", "varde": "clamp(...)", "px_desktop": 96, "px_mobil": 56, "token": "--apspace-2xl", "kalla_fil": "..."}],
  "container": [{"roll": "max-width", "varde": "1280px", "kalla_fil": "..."}],
  "radier": [{"roll": "kort", "varde": "20px", "token": "--apradius-l"}],
  "skuggor": [{"roll": "kort", "varde": "0 2px 6px #bebebe", "token": null}],
  "rorelse": [{"roll": "knapp hover", "varde": "all .25s ease"}],
  "breakpoints": ["992px", "768px", "480px"],
  "komponenter": [{"namn": "knapp-primar", "anatomi": "pill, teal bg, vit text, 58px hög, ikon höger", "states": ["default", "hover", "focus"], "html_ref": "index.html:44", "css_ref": "style.css:200-240", "skarmdump_crop": "..."}],
  "signaturenhet": "vad blocket gör som bara det gör",
  "defekter": ["--shadow-primary odefinierad -> #bebebe", "..."],
  "regler_som_ligger_i_koden": ["fullbredd", "reduced-motion", "..."]
}
```

MD-filen (svenska): vad blocket är, status, två skärmdumpar, det viktigaste i tokens (avvikelser mot
live-ampy-se:s ap*-tokens markeras), komponentlistan med en rad per komponent, det som gör blocket bra
(hantverksdetaljer att bevara), defekter, och "vad som skiljer sig från andra block" om du ser det.

## Regler

- Skriv bara i `inventering/`. Rör aldrig `kallor/`.
- Inga påhittade värden. Saknas något: `null` + notering.
- Om en källa har flera riktningar (Footer, Vår process, Hero_2, ROT-GT designs): inventera **baslinjen/den
  valda** fullt, och de andra bara som en rad per riktning under "varianter".
- Avsluta med ≤15 rader: källor klara, de 5 tydligaste mönstren du såg över dina källor, de 5 tydligaste
  konflikterna (samma roll, olika värden), och vad du inte kunde rendera.
