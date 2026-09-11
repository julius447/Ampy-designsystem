# hero-2-form — Hero 2:s offertformulär V2 (auktoritet 2, blocker: lead-endpoint)

**Vad:** Redesign av sajtens mest dominanta hero-formulär (alla tjänstesidor) — endast formuläret. Två
förslag i README (V1 "kontakt först" i två skärmar, V2 "en skärm, ingen wizard"); produktionskoden i
`bricks/ampy-offert-form.html` är V2 med "Fler detaljer (valfritt)"-utfäll och en per-sida-resolver
(pathen styr kundtyp, låst tjänst-chip, eljour = Ring-först). **Status:** design GO, blocker = ENDPOINT/
PATCH/honeypot/consent-tidsstämpel; leveranspaket i `Hero2 Form Documentation/`. **Auktoritet:** 2.

Renderat: produktionskoden med `?path=/laddbox/nacka` och `/eljour/solna` + harnessen. Tillstånd mätta
med `a1-form-states.mjs` (default, focus, error via tom submit, checked) → `hero-2-form-states.json`.

![1440 (laddbox/nacka)](skarmdumpar/hero-2-form-desktop.png)
![390](skarmdumpar/hero-2-form-mobile.png)
(Fel-tillstånd: `hero-2-form-desktop-error.png`; eljour: `hero-2-form-eljour-*.png`.)

## Vad jag ser

Ett mörkt glaskort 470 px (radie 27, blur 30, gradient midnight → stål .76) på en mörk förhandsvisningsyta:
titel "Få kostnadsfri rådgivning!" 27 px 400, segment Privat/BRF/Företag (vit, vald ljusblå), glas-chip
"✓ Laddbox i Nacka", vita pillfält (44 h, radie 14) i par (Telefon/E-post, Adress/Postnummer), dashed
"Fler detaljer (valfritt)", custom checkbox med policy-länk i ljus teal, neon-submit "Boka rådgivning" (46 h,
mint → cyan). Mobil: kortet fyller bredden (radie 22), fälten staplas (52 h), submit 54 h. Eljour-sidor
visar i stället en dashed ruta "Akut elfel? Ring oss direkt på 010-265 79 79."

## Tokens (mätt) — avvikelser mot live-ampy-se markerade

| Roll | 1440 | 390 | Mot ap*-tokens |
|---|---|---|---|
| kort | radie 27, padding 22, bg #090b32 + 156.51° → #5eb1bf .76, blur 30, skugga `0 0 38px rgba(181,181,181,.14)` | radie 22, padding 24/20 | 27/22 i ingen skala; skuggan = tredje gråa 16–38 px-idiomet |
| titel | 27 px / 400 / lh 1.25 | 24 px / lh 1.2 | ≠ `--aptext-lm` 28; 400 vs Hero-2-alt 700 |
| subtitle | 14 px / 300 | 15 px | – |
| segment | 16 px 500, h 44, radie 14, vit → vald `#bfe9fb` | 17 px | – |
| label | 13 px / lh 16 | 14 px / lh 18 | – |
| input | 16 px #333, h 44, radie 14, vit, ingen kant; focus `0 0 0 3px rgba(0,169,145,.5)`; fel `0 0 0 2px #00a991` + hjälp `#bff3e6` | 17 px, h 52 | radie 14 ≠ `--apradius-m` 12; fel i teal |
| disclosure | 14 px, h 42, dashed 1 px vit .32, bg vit .08 | 15 px, h 46 | – |
| consent | box 21 radie 6, 1.5 px vit .5; checked teal + bock #042b24; text 12 px .82; länk `#7fe9d3` | 12,5 px | – |
| submit | 18 px 500 #1e1e1e, h 46, radie 14, `282.84° #55ff9a 20% → #00ffda 86%` | 19 px, h 54 | ≠ bibliotekets 16/500/58/radie 16/120° → #5eb1bf |
| avstånd | group 12 · fld 8 · label→fält 5 · consent 12 · submit 14 | 16 · 10 · 6 · 14 · 18 | ≠ `--apspace-*` |
| brytpunkt | `@media 600/601` (README: 480) | | – |

Färger: `#090b32` (= midnight), `#55ff9a` (= neon-mint), `#00a991` (= teal), `#1e1e1e`, `#333` (= ap);
utanför tokens: `#5eb1bf`, `#00ffda`, `#bfe9fb`, `#7fe9d3`, `#bff3e6`, `#b2b2b2`, `#042b24`, `rgba(181,181,181,.14)`.
`--crystal #b6f2ff` definierad men oanvänd.

## Komponenter

| Komponent | En rad |
|---|---|
| Glas-kort | 470 max, midnight + stål-gradient .76, blur 30, radie 27/22 |
| Segment-väljare | 3 × flex 1, h 44, radie 14, vit/ljusblå vald, `aria-checked` |
| Låst tjänst-chip | glas-rad vit .13 + 1 px .18, bock 18 `#7fe9d3` |
| Fält | label 13–14 vit, input 44/52 h radie 14 vit; textarea 62/78; select med svg-pil; par i `row2` |
| Disclosure | dashed glasknapp + body (beskrivning, tidsram, bilder-upload dashed 1.5 px, org.nr) |
| Consent | custom checkbox 21 radie 6 → teal; 12 px text + policy-länk |
| Submit | 100 %, 46/54 h, neon-gradient 282.84°, `#1e1e1e` 18/19 px 500 |
| Noform (eljour) | dashed glasruta radie 20 med tel-länk — Ring-först |
| Done | teal cirkel 56 + bock, h2 23/400, p 15/300 |

## Hantverk att bevara

- Per-sida-resolvern: ett formulär, rätt förval, låst tjänst som chip med "byt", Ring-först på eljour.
- Minsta ringbara lead (namn + telefon + postnummer + GDPR) — allt annat blockerar aldrig.
- Fokusring utan hopp (ingen kant på fältet), custom checkbox med riktig fokus, `aria-checked`-segment,
  honeypot, `≥16 px` input mot iOS-zoom.

## Defekter

1. Submit-gradienten (282.84° → `#00ffda`) motsäger bibliotekets handlingsgradient (120° → `#5eb1bf`);
   Hero_2-alternatives dödade den — två auktoritet-2-källor med olika submit.
2. Radie 14 överallt (README säger 16), kort 27 — tredje radiesystemet.
3. Fel i teal = samma färg som fokus/success; ingen felfärg.
4. Femte tokennamnrummet (`--mid/--sea/--neon1/--neon2/...`), sex färger utan ap-token.
5. Glasytan (156.51° → #5eb1bf .76) dömdes ut av Hero_2-alternatives (kant 1,2:1) men lever här.
6. Brytpunkt 600 i kod vs 480 i README; Google Fonts + gissad font-path; endpoint-blockers; copy `[VERIFY]`.
7. Titeln "Få kostnadsfri rådgivning!" bär ett `!` trots README:s "noll `!`".

## Skiljer sig från andra block

Enda källan med glas-blur (`backdrop-filter: blur(30px)`), custom checkbox och segment-kontroll. Formkortet
i Hero_2-alternatives Z är dess omdesignade efterföljare (mörk navy #16183f, radie 10-fält, 700-titel).
