# brandbook — Ampy Brandbook (6).pdf + LOGO/

**Vad det är.** Byråns varumärkesbok, 26 sidor (2000×1125), engelska, pdf daterad 2025-10-01. Täcker
logosystem, palett, gradienter, typsnittsvikter, ikon-/foto-/formregler och applikationer (signaturer,
visitkort, sociala medier, presentationer, bil, kläder, skyltar). Innehåller **inga** UI-regler: inga
typstorlekar, ingen skala, inga avstånd, radier, skuggor, knappar, inget tonavsnitt.

**Status.** Auktoritet 1 för logo/palett/typsnittsregler enligt briefen – med förbehållet nedan: bokens
palett och produktionens ap*-tokens överlappar bara i **tre** färger.

**Ingång.** `~/Desktop/Brandbook/Ampy Brandbook (6).pdf` (läst sida 1–26), `~/Desktop/Brandbook/LOGO/`
(45 PNG + LOGOS.ai). Data: `inventering/brandbook.json`. Kanoniska logofiler kopierade till
`inventering/brand/` (14 st, lista nedan).

## Sidkarta

1 omslag (mesh-gradient) · 2 avdelare LOGO · **3 Logo versions** · **4 Safe zones** · **5 Incorrect uses** ·
6 avdelare COLOURS · **7 Primary colours** · **8 Secondary palette** · **9 Correct colour applications** ·
**10 B&W** · **11 Gradients** · 12 avdelare FONTS (numrerad "02" igen) · **13 Outfit** · **14 Weight roles** ·
15 avdelare GRAPHIC STYLE · **16 Icons** · **17 Photography** · **18 Shapes** · 19 avdelare igen (dubblett) ·
20 e-postsignaturer · 21 visitkort · **22 Social media** · 23 presentationer · 24–25 applikationer · 26 baksida.

## Palett som boken anger (s.7–8) och hur den förhåller sig till de 101 ap*-tokens

| Namn (min benämning) | Hex | RGB / CMYK (tryckt) | Roll enligt boken | ap*-token | I produktion? |
|---|---|---|---|---|---|
| Midnight (primär) | `#090b32` | 9 11 **59** (tryckfel; hex = 50) / 100 96 46 61 | bakgrunder, nyckelytor, rubriker, logo | `--apmidnight-blue` | ja |
| **Cobalt (primär)** | `#326afd` | 50 106 253 / 83 59 0 0 | bokens huvudaccent (ikoner, blixtar, hjälm, bil, skyltar) | **ingen** | **nej** – 0 i live-css, 0 i mina fyra källor (2 filer i artikelmallen) |
| Neon mint (primär) | `#55ff9a` | 85 255 154 / 67 0 71 0 | ljus accent, wordmark på mörkt | `--apneon-mint` | ja – live primärknappens gradientstart |
| Sky mist (primär) | `#f5f9ff` | 245 249 255 / 5 1 0 0 | ljus yta | `--apsky-mist` | ja – sidbakgrund |
| **Sekundär teal** | `#5eb1bf` | 94 177 191 / 70 4 26 0 | stödytor, ikoner, diagram | **ingen** (≠ `--apseafoam-mint #5cc5b6`) | **ja, mycket** – live: `120deg #55ff9a→#5eb1bf` på primärknappen, fokusringar på fält, aktiv tabb, alias `--ap-blue` i site-css; offertmallens `.of-btn-primary` |
| **Sekundär lime** | `#92ec47` | 146 236 71 / 57 0 100 0 | stödfärg | ingen | nej – 0 överallt |
| B&W | ≈`#1e1e1e` / vit | ej angivet | enfärg | (`--apdarkest-black`?) | logo-PNG:erna i tre källor är rent `#000000` |
| **Teal core** | `#00a991` | – | **finns inte i boken** | `--apteal-core` | ja – produktionens primära åtgärdsfärg |
| Emerald, seafoam, mint-surge, crystal-blue, aqua-frost, sublime-green, milk/gray/charcoal | – | – | **finns inte i boken** | 9 tokens | ja |

Godkända färgpar (s.9): vit/midnight · neon-mint/cobalt · midnight/sekundärteal · cobalt/neon-mint ·
midnight/lime · cobalt/sky-mist · midnight/cobalt · midnight/sky-mist · neon-mint/midnight.

**PNG-exporterna i `LOGO/COLOURS/` har andra hex än boken:** cobalt-wordmark `#136cff`, neon `#00ff8e`,
lime `#70ee00`, teal `#37b2c0`, midnight `#090b34` (uppmätt dominant färg per fil). Exporterna är inte
färgsäkra mot s.7–8.

## Gradienter (s.11)

Fyra vertikala referenser: cobalt→midnight · lime→cobalt · sekundärteal→lime · neon-mint→midnight.
Regel: bara officiella färger, vinkel fri, ska ge "energy, dynamism, vibrancy". Omslag/baksida/sociala
medier: mesh av midnight+cobalt+neon+lime med tunna konturlinjer – förlagan till produktionens aurora, som
dock är en ljus omtolkning (sky-mist + teal/crystal-blue/sublime-green-radialer). Ingen av mina fyra källor
använder någon av de fyra referensgradienterna.

## Typografi (s.13–14)

Outfit är enda typsnittet. Tre vikter med roller: **Light** (300) = lång/sekundär text, beskrivningar,
noter, sidfötter · **Medium** (500) = underrubriker, highlights, textblock · **Black** (900) = titlar,
rubriker, "maximum impact". Inga storlekar, radavstånd eller spärrningar anges.

Mot uppmätt praxis: ingen av mina fyra källor sätter en rubrik i 900 (eller 800/700) – h1/h2 ligger på
**500–600** (tack 500, main-form 500, booking/offer 600); skill-referensen kör 800. Light-rollen följs
delvis (booking 300, main-form 200/300, tack 400). Bokens egna sidrubriker är satta i Light/Regular.
Applikationerna använder BLACK-versaler med reklamröst ("POWER UP YOUR HOME", "TURN ON THE TRUST").

## Logosystem (s.3–5, 9–10, 22)

- Tre lockups: **Main Version** (wordmark "ampy", blixt skuren i a:t), **Simple Mark** (a + blixt), **Glyph** (blixt).
- Friyta = bokstaven a:s höjd/bredd runt om; bokstavsmellanrum = 20 % av a:s bredd. **Minsta storlek anges inte.**
- Åtta förbud: färg per bokstav · gradient/textur · rotation · annat typsnitt · enskild bokstavsstorlek · ändrad komposition · disproportionerlig skalning · blixten borttagen/ersatt.
- Sociala profilbilder: bara simple mark eller main logo i godkänd färgvariant.
- Boken visar wordmarken i **midnight**; produktionens logofiler (main-form/booking `ampy-logo-dark.png` 1600×468, tack-sidans `Ampy-logo.png` 701×201, `LOGO/Ampy-nordic-ab-logotyp.png`) är rent **svart `#000000`**. Den midnight-färgade exporten (`AMPY-01.png`, `#090b34`) används inte av någon källa.
- Ingen SVG-export finns (bara `.ai` + PNG); `ampy-article-template/src/components/icons/AmpyLogo.jsx` är en handritad SVG-rekonstruktion.

Kopierat till `inventering/brand/` (fil ← källa, uppmätt färg):
`ampy-wordmark-midnight-701x201.png` ← COLOURS/AMPY-01 (#090b34) · `ampy-wordmark-black-1200x360.png` ←
Ampy-nordic-ab-logotyp (#000) · `ampy-wordmark-black-8082x2364-master.png` ← Ampy-logotype (HUBSPOT)
(#000; samma teckning som produktionens 1600×468) · `ampy-wordmark-white-2917x834.png` ← B&W/Ampy logotype
(#fff; identisk med main-forms `ampy-logo-white.png`) · `ampy-mark-midnight-201.png` ← AMPY-07 ·
`ampy-glyph-midnight-201.png` ← AMPY-08 · `ampy-mark-black-834.png` ← B&W/Ampy-altnerative-logo ·
`ampy-mark-white-834.png` ← B&W/LOGOS-23 · `ampy-glyph-white-834.png` ← B&W/LOGOS-24 ·
`ampy-glyph-black-201-favicon.png` ← B&W/Ampy-favicon · färgvarianter `ampy-wordmark-cobalt/-neonmint/
-springgreen/-secondaryteal-701x201.png` ← AMPY-02/03/05/06 (dokumentation av exportfärgerna).
Ej kopierade: konturvarianter (AMPY-04/13/14) och `LOGO/OTHERS/` (svart wordmark med färgad blixt m.m. –
finns inte i boken).

## Ikoner, foto, former, ton (s.16–18)

- **Ikoner: solida och så enkla som möjligt**, inga komplexa streck (skiftnyckel, blixt, glödlampa, gnistor i cobalt). Alla fyra byggda källor använder **linjeikoner** (stroke 1.6–3, fill none) – tvärtemot boken.
- **Foto:** realistiskt, rent, professionellt, naturliga färger, bra ljus; klarhet/tillit/modernitet; ingen översaturering/filter; riktiga miljöer, elektriker i blå hjälm + skyddsglasögon. Main-forms skymningshus matchar s.17:s husbild (plus platt overlay .55).
- **Former:** härledda ur blixten eller a:t; ramar/lyfter innehåll; inga godtyckliga rotationer. Ingen av källorna använder blixt-/a-former; skill-referensens `bolt.svg` är en egen blixt.
- **Ton:** saknas som avsnitt; enda copyexemplen är engelska versalfraser.

## Defekter / luckor i boken

1. Produktionens primärfärg teal `#00a991` saknas; bokens primära accent cobalt saknas i produktionen – boken och sajten delar bara midnight, neon-mint och sky-mist.
2. Sekundärteal `#5eb1bf` lever i produktion (knappgradient, fokusringar) utan att vara ett token – och tidigare dokumentation kallar den "frånvarande".
3. PNG-exporterna matchar inte bokens hex; wordmarken är svart i produktion, midnight i boken.
4. RGB-tryckfel för midnight; dubbelnumrering; stavfel.
5. Ingen minsta logostorlek, inga typstorlekar/skala, inga radier/avstånd/skuggor, inget tonavsnitt – boken täcker inte UI.
6. "Black" som rubrikvikt används inte i något byggt block; "solida ikoner" följs inte i något byggt block.
7. Ingen vektorexport.
