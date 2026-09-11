# main-form — /offert-formulärets redesign (Ampy-main-form)

**Vad det är.** Kontakt-/offertformuläret för `/offert`: ett 50/50-kort (max 1220 px) där vänster halva är
ett helbleed-skymningsfoto med platt mörk overlay, vit logotyp, testimonial-citat, Google-betyg och tre
"Vad händer sen"-steg, och höger halva är en vit formulärpanel (Förnamn, Efternamn, E-post, Telefon,
adress-combobox med manuellt fallback, Meddelande, pill-knapp, samtyckesrad). Layout, skala och neutraler är
enligt CSS-huvudet **"matched 1:1 to Svea Solar's fri-offert"** – Ampys eget är fotot, loggan, copyn,
betyget och tealen.

**Status.** Design GO (auktoritet 2 enligt briefen) – **men uppmätt live:** `kallor/live-ampy-se/site-css.css` innehåller 94 `[data-mf="…"]`-regler med exakt prototypens värden (knappgradient, radie 999, kortradie 15, fält 1.6/1.8 rem, fokus teal 3 px .30, etiketter `#4d4d4d`, `!important` rakt igenom) och `live-source-batterilagring.html` bär `data-mf`-attributen. Formuläret är alltså i praktiken live som Bricks-form + overrides. `delivery/` innehåller samma design 1:1 som FluentSnippets (px,
`@container`, självhostad Outfit) och som Bricks-paste-JSON. `README.md` beskriver en ÄLDRE version
(navy-aurora trust-panel, chips, kundtyp-select, ett namnfält) som **inte** är den byggda – index.html är
den Svea-matchade fotoversionen med två namnfält och utan chips.

**Ingång.** `kallor/Ampy-main-form/index.html` + `css/styles.css` (289 rader) + `js/app.js`. Rot 62.5 %
(1 rem = 10 px). Data: `inventering/main-form.json`.

| Desktop 1440 | Mobil 390 |
|---|---|
| ![](skarmdumpar/main-form-desktop.png) | ![](skarmdumpar/main-form-mobile.png) |

Tillstånd (fel, giltigt, fokus, manuell adress öppen, webhook-fel): `skarmdumpar/main-form-fel-desktop.png`.
In-place success: `skarmdumpar/main-form-success-desktop.png`.

## Det viktigaste i tokens (avvikelser mot live-ampy-se:s ap* markerade med ✗)

| Roll | Uppmätt (1440 / 390) | ap*-token |
|---|---|---|
| Body / inputtext | Outfit 16 px 400, lh 1.5 / 1.2, `#171717` | ✗ utanför tokens (Svea; ≈ `--apdarkest-black #1e1e1e` men inte lika) |
| Rubrik h2 | 26 / 21.9 px, 500, lh 1.35, `#4d4d4d`; sista ordet gradient 92° `#12b09a→#33c48c→#55d199` | ✗ färg och gradientstopp utanför tokens |
| Ingress | 18 / 16.2 px, **200**, lh 1.3, `#4d4d4d`, max 560 px centrerad | ✗ |
| Citat på foto | 33 / 29.4 px, 500, lh 1.3, ls −0.005em, vit + text-shadow | – |
| Etikett | 14 px 500 `#4d4d4d`, asterisk `#000` | ✗ / `--appure-black` |
| Samtycke | 12 px 300 `#6a6a6a` | ✗ |
| Fält | bg `#f7f7f7`, 2 px transparent kant, radie 8, padding 16/18 → **55 px hög** | ✗ bg; radie = `--apradius-s` bara @1440 |
| Fokus | kant `#00a991` + ring `0 0 0 3px rgba(0,169,145,.30)` | `--apteal-core` |
| Fel / giltigt | kant `#e00000` / `rgba(31,157,107,.5)`; feedback 13 px `#e00000`; banner på `rgba(209,73,91,.08)` | ✗ inga fel-/ok-tokens finns; två röda, två gröna |
| Primärknapp | full bredd pill, gradient 100° `#009e88→#00b597→#17c6a0`, 16 px 500 vit, padding 16/32 → **52 px**, skugga `0 1rem 2.4rem -.8rem rgba(0,169,145,.45)` | ✗ ingen stop är `#00a991`; radie ≈ `--apradius-full` |
| Kort | max 1220, radie **15 px**, skugga `0 1rem 3rem -1.8rem rgba(15,18,60,.12)`; mobil radie 0 | ✗ 15 ligger mellan `--apradius-m` 12 och `-l` 16–20 |
| Overlay | `rgba(6,8,26,.55)` platt över fotot | ✗ |
| Sidbakgrund | `#f4f5f7` | ✗ ≠ `--apsky-mist #f5f9ff` |
| Stjärnor | `#ffc24b` | ✗ (tack-sidan: `#f6b53d`) |
| Midnight `#090b32` | definierad som `--ap-navy`, **0 användningar** | – |
| Spacing | sektion 60/24 → 0 på mobil; formulärpanel 42/48 → 28/20 med 16 px ränna; grid gap 20 rad / 32 kol; etikett→fält 8; stegblock mobil 32/34/36 | ✗ ingen `--apspace-*`; bara 8 ≈ `--apspace-2xs` |
| Brytpunkter | 768 (stapling), 460 (1 kolumn), 461–768 (stegen 3-upp) | ✗ inte 992/768/480 |
| Rörelse | 200 / 280 ms, `cubic-bezier(.2,.6,.2,1)`; kort fade 0.5 s (bara opacity); spinner 0.7 s; reduced-motion nollar allt | – |

`var(--ap…)`-referenser till riktiga produktionstokens: **0**. Fyra egna alias (`--ap-teal` ×4, `--ap-green` ×1,
`--ap-offwhite` ×1) och en Svea-neutralskala bär hela ytan.

## Komponenter (en rad per komponent)

- **Sektionsskal** – flex-centrerat, 60/24 desktop, 0 mobil, bakgrund `#f4f5f7`.
- **Kort 50/50 med helbleed-foto** – `<img>` object-fit cover (50 % 52 %) + platt overlay bakom båda panelerna; mobil: kolumn, radie/skugga bort, fotot bakom allt.
- **Logotyp** – vit wordmark-PNG (2917×834 = brandbokens `B&W/Ampy logotype.png`) 26 px hög, absolut 29/29, drop-shadow; dold på mobil.
- **Testimonial-block** – citat 33 px/500 → 5 stjärnor 18 px + "5 av 5 · Betyg på Google" 14 px/300 → "3 000+ …" 15 px (bara desktop); gap 15.
- **"Vad händer sen"-steg** – desktop: 3-kolumns grid nederst i fotopanelen (linjeikon 22 px stroke 1.6 över 14 px/500 text); mobil: egen lista under kortet, rad-layout 20 px ikon + 15 px text.
- **Formulärhuvud** – h2 med gradient-text på sista ordet + ingress 200; gap 10, mb 24.
- **Formulärgrid** – 2 kolumner (241 px @1440), gap 20/32, `--full` spänner båda; 1 kolumn ≤460.
- **Fält** – label 14/500 + input + feedback (13 px röd, fel-ikonen avstängd per ägare); gap 8.
- **Input/textarea** – 55 px hög, 8 px radie, grå fyllning; states default / focus / is-valid / is-invalid / placeholder `#6a6a6a`; textarea 70 min, ingen resize.
- **Adress-combobox** – pin-ikon 18 px `#999`, `padding-left 44`, bg `#f4f4f5`; textlänk "Ange adress manuellt"↔"Sök efter adress" 13 px; dropdown (vit, radie 8, skugga, max 260, träff 15 px med teal `<mark>`); manuell box (1 px ram, radie 10, 3 fält).
- **Primärknapp** – 52 px pill full bredd, teal-gradient, pil 19 px; hover brightness 1.06 + −1 px + pil +4 px; `is-loading` med 20 px spinner; disabled .7.
- **Samtyckesrad** – 12 px/300 grå, ingen checkbox (samtycke genom inskick).
- **Felbanner** – `role=alert`, 13.5 px röd på rosa platta, radie 8, telefon i fetstil.
- **Success-kort** – ersätter formuläret in-place: 64 px cirkel `rgba(57,194,129,.12)` + 32 px bock `#39c281`, h3 22/600, text 16, meta 14.
- **Honeypot** – `company_url`, 1×1 off-screen, tabindex −1.

## Det som gör blocket bra (hantverk att bevara)

- 2 px transparent kant på fälten så fokus/fel aldrig flyttar layouten; fokusring i teal på grått fält.
- Formuläret som vitt kort över fotot på mobil (16 px ränna, 15 px radie) i stället för att stapla en tom fotobanner.
- Stegblocket landar under knappen på mobil, där tummen är; "3 000+" döljs på mobil (ägarbeslut).
- Kortets intro-animation är enbart opacity (transform + radie + overflow flashar hörn i Safari).
- In-place success utan redirect men **aldrig** falsk success vid tom inskickning; honeypot + fail-closed-spårning (events bara med Cookiebot-marketing).
- 16 px text i fält (iOS zoomar inte), placeholder valt för AA, adress-combobox med tangentbordsnavigering.

## Defekter

1. 0 riktiga ap*-tokens; hela neutral-, fält- och bakgrundsskalan är Svea-hex utanför systemet.
2. Midnight definierad men aldrig använd – blocket har inget midnight alls; sidbakgrund `#f4f5f7` är en nära-dubblett av sky-mist.
3. Knapp- och rubrikgradienterna saknar token-stopp; `--apteal-core` finns bara i fokusring/markering.
4. Två felröda (`#e00000` + `rgba(209,73,91)`), två ok-gröna (`#1f9d6b` + `#39c281`), två stjärnguld i flödet (`#ffc24b` här, `#f6b53d` på tack-sidan).
5. Kortradie 15 px och knapphöjd 52 px ligger utanför token-stegen; ingen `--apspace-*`.
6. Ingen egen `:focus-visible` på knapp/länkar (bara UA-ringen).
7. Prototypen laddar Google Fonts; logo-PNG 2917×834 för 26 px.
8. README beskriver en annan (äldre) design än den byggda.

## Vad som skiljer sig från andra block

Det enda av mina fyra källor med **foto** och med **grått bläck** (`#171717/#4d4d4d`) i stället för det
navy-bläck (`#0b1030`) som tack-sidan, offer-accepted och bokningen delar. Det enda med kortradie 15 och
knapp som pill med **gradient** i teal-familjen (tack-sidan: `#00b89c→#018271`; bokningen: solid navy;
offertmallen: `#55ff9a→#5eb1bf`). Fyra block, fyra primärknappar.
