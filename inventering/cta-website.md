# cta-website — knappbiblioteket (auktoritet 1, levererat som bibliotek)

**Vad:** Ampys "CTA-bibliotek": tre call-to-action-knappar (Ring · Kostnadsfri rådgivning · Kostnadsfri
offert) med en `--block`-modifier, portabla (px, inget 62.5 %-beroende), plus leverans
(`ampy-cta-buttons.css` med self-hostad Outfit 400/500, PHP-shortcodes, 2 Bricks-JSON, katalog-JSON v1.0.0).
Extraherade ur Main CTA-blockets designarbete. **Status:** levererat. **Auktoritet:** 1 — knapp-sanningen.

Renderat: `index.html` (galleri, 1094/1677 px). Mätt: `_probes/out/a1-cta-website.json` (alla sex
instanser + hover).

![1440](skarmdumpar/cta-website-desktop.png)
![390](skarmdumpar/cta-website-mobile.png)

## Vad jag ser

Tre vita kort på sky-mist, varje knapp i auto-bredd och fullbredd. Ring-CTA: blå gradient (ljus cyan →
stål) med vit rund chip och telefonlur till vänster (till höger i `--block`). Rådgivning och offert: grön
gradient (neon-mint → stål) med en liten pil till höger. Alla 58 px höga, 16 px radie, mörk navy text.
Mobil: samma knappar, ingen skalning (16 px text kvar), `--block` 100 % bredd.

## Tokens (mätt) — det gemensamma skelettet

| Egenskap | Värde (alla tre) | Mot ap*-tokens |
|---|---|---|
| höjd | min 58 px (uppmätt 58) | ingen token |
| radie | 16 px | = legacy `--radius` 16; ≠ `--apradius-m` 12 / `-l` 20 |
| text | Outfit 16 px 500 lh 1, `hsl(237 35% 24%)` (= #282a53, uppmätt rgb(40,42,83)) | storlek = `--aptext-sm` @1440 men skalar inte; färg saknar token |
| padding | 11 × 24 (pil-knappar), 11/30/11/12 (ring), `--block` 11 × 22 | ≠ `--apbtn-space` 14 × 19,8; ≠ live Bricks 16 × 24 |
| gap | 16 (pil) / 14 (chip) | ≠ `--apspace-*` |
| gradient grön | `120deg #55ff9a → #5eb1bf` | start = `--apneon-mint`; slut utan token |
| gradient blå | `120deg #b6f2ff → #5eb1bf` | start = `--apcrystal-blue`; slut utan token |
| skugga grön | `inset 0 1px 0 rgba(255,255,255,.45), 0 2px 4px rgba(9,11,50,.06), 0 10px 26px −6px rgba(94,199,160,.45)` | ingen `--apshadow` (de är trasiga på live) |
| skugga blå | samma stack med `.55` inset och glow `rgba(94,177,191,.55)` | – |
| hover | `translateY(−1.5px)`, `saturate(1.06/1.08) brightness(1.02)`, skuggan växer till `0 16px 34px −8px`, pil `scale(1.18)`; `.16s ease` | – |
| chip | 36 px vit `.92`, lur 17 px, puls-ring 2.8 s (`0 → 9px` vit .65 → 0) | – |
| fokus | `3px solid #090b32` offset 3 | = `--apmidnight-blue` |

Bredder @1440: ring 227,6 · rådgivning 242,3 · offert 206,4 · `--block` = slotens 300.

## Komponenter

| Komponent | En rad |
|---|---|
| `btn-ring` | primär ring: tel-länk, blå gradient, vit chip m. lur + puls-ring vänster; `--block` lägger chippen höger |
| `btn-radgivning` | grön gradient + pil 16 px; hover lyft + pil 1.18; README kallar den "sekundär" |
| `btn-offert` | byte-identisk med rådgivning (diff = klassnamn/label/href) |
| `--block` | 100 % bredd, text vänster/ikon höger, `white-space:normal` |

## Hantverk att bevara

- Tre-lagers skuggan (inset-highlight + tät navy + färgad glow) och hover som bara lyfter/mättar — ingen
  färgflipp. Pilen växer, glider inte.
- Puls-ringen på chippen ("linjen är öppen") som enda animation; reduced-motion stänger den.
- Optisk mikro-centrering av luren (`translate(−1px,1px)`).

## Defekter

1. Ingen hierarki: "sekundär" rådgivning = "primär" offert pixel för pixel. Biblioteket saknar
   sekundär/tertiär, storlekar, disabled, ikon-vänster-variant; header-CTA:n (solid teal) och live Bricks
   pastellknappar ligger utanför → ≥4 knappformat på sajten.
2. Hero-1 bär en egen kopia med annan skugga (navy `.40` i st.f. grön glow) och egen mobilskalning
   (15,5/15 px) — den "kanoniska" knappen finns i två versioner.
3. Inga tokens alls; `#5eb1bf`, `hsl(237 35% 24%)`, glow-färgerna och radie 16 hårdkodade.
4. 16 px text utan mobilskalning; padding 11/24 matchar varken `--apbtn-space` eller live-knappen.
5. Telefonnumret hårdkodat i katalog/PHP.

## Skiljer sig från andra block

Enda källan som medvetet är px-portabel (ingen rem-bas) — och enda som dokumenterar ett skelett
("58 px, radie 16, navy-text") som regel. Formuläret (hero-2-form) och kalkylatorerna bygger egna knappar.
