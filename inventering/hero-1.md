# hero-1 — startsidans hero, riktning B (auktoritet 1, ägargodkänd)

**Vad:** Startsidans section 1: inramad foto-hero (Evify-replikan, "trähuset i blå timme") med header v5
ovanför. Ägargodkänd ("PERFEKTION"), r6 2026-07-19. **Status:** levererad (delivery/ = 1:1 i px) och
installerad på live (`site-css.css .home-hero__*` bär exakt samma värden). **Auktoritet:** 1.

Renderat: `kallor/Hero-1/index.html` (prototyp) + `delivery/preview/index.html` (paritet, identisk höjd
1002/1003). Mätt med `a1-measure.mjs` → `_probes/out/a1-hero-1.json`.

![1440](skarmdumpar/hero-1-desktop.png)
![390](skarmdumpar/hero-1-mobile.png)

## Vad jag ser

Desktop: 76 px sky-mist-header (logo 130 px, tre nav-länkar 18 px 500 centrerade, solid teal CTA 48 px med
pulserande mint-prick), sedan en 22 px-rundad fotoram 1388×876 med midnattsblå gradient från vänster.
H1 60 px Outfit 700 vit på två rader, lead 22 px 400 vit, gradient-CTA "Kostnadsfri rådgivning" (248×58,
mint→stål) och proof-raden nere till höger (G 5,0 ★★★★★ | Över 3 000 installationer per år). Mobil: header
66 px med CTA + burger, ram 370×752 radie 18, H1 36 px på tre rader, lead 15,5 px, CTA 226×52, proof
staplad nere till vänster.

## Tokens (mätt) — avvikelser mot live-ampy-se markerade

| Roll | 1440 | 390 | Källa | Mot ap*-tokens |
|---|---|---|---|---|
| h1 | 60 px / 700 / lh 1.07 / ls −1.08 px | 36 px / lh 1.07 | `clamp(36px,4.6vw,60px)` | ≠ `--aptext-4xl` (60 → 35,9 ≈ men egen clamp) · weight 700 vs live h2 500 |
| lead | 22 px / 400 / lh 1.58 | 15,5 px / lh 1.55 | `clamp(17px,1.55vw,22px)` | ≠ `--aptext-ml` 22→20,1 |
| CTA | 16 px / 500 / lh 1 / ls .08 px | 15 px | 16px, ≤560 15px | ≠ `--aptext-sm` 16→14,1 |
| proof | 14,5 px / 400 | 13,5 px | 14.5px | ≠ `--aptext-s` 14→12,1 |
| nav-länk | 18 px / 500 | – | 1.8rem | ≠ `--apnav-link-size` (= `--aptext-s` 14 px) |
| header-CTA | 16 px / 600, 48 h | 13,5 px / 44 h | 1.6rem/4.8rem | ingen token |
| body | 16 px / 300 / lh 1.5, `#0f123c` | 16 px | header.css 1.6rem | live: `--aptext-sm` 16→14,1, `#363636` |
| CTA padding | 11 × 26, radie 16 | 9 × 22, radie 16 | px | radie 16 ≠ `--apradius-m` 12 / `-l` 20 (= legacy `--radius` 16) |
| ram | radie 22, max-w 1700, h 100svh−76−48 (620–950) | radie 18 | px | 1700 > container 1280; 22 ≠ någon ap-radie |
| section-padding | 20 / 26 / 30 | 10 / 10 / 16 | clamp(px) | ≠ `--apspace-*` |
| avstånd h1→lead→CTA | 18 / 32 | 14 / 26 | px | ≠ `--apspace-*` |
| header | 76 h, wrap 28, container 1280 | 66 h, wrap 16 | rem | 1280 = `--container-width` |

Färger: `--apteal-core #00a991`, `--apmidnight-blue #090b32` (som rgba(9,11,50,α) i 20 varianter),
`--apneon-mint #55ff9a`, `--apsky-mist #f5f9ff`, vit — alla **lokalt omdeklarerade** i style.css/header.css,
inte lästa från sajten. Utanför tokens: `#5eb1bf` (gradientslut, "steel"), `hsl(237 35% 24%)` (CTA-text),
`#0f123c/#565e82/#6a7190` (ink-skalan), `#dbe4f0` (hårlinje), `#008d79` (teal-hover), drawerns `#14151a/#d5d5dc/#73757d`.

Skuggor: CTA `inset 0 1px 0 rgba(255,255,255,.45), 0 2px 4px rgba(9,11,50,.10), 0 14px 32px −8px rgba(9,11,50,.40)`;
header `0 4px 14px −10px rgba(15,18,60,.14)`; header-CTA teal-glow `0 4px 12px −5px rgba(0,169,145,.5)`.
Rörelse: `.16s ease` (CTA), `.2s ease-out` (`--t`, header ×26), pulse-dot 1.6 s, reduced-motion nollar allt.

## Komponenter

| Komponent | En rad |
|---|---|
| Hero-B ram | 22 px radie, foto `object-position 62% 60%`, veil 98° `.68→.46→.12→.02` + 0° `.38→0`; ≤560 byter till 180°-veil nerifrån |
| Text-stack | h1 vit 700 balance (explicit `<br>` ≥993), lead vit .92 + text-shadow, max-w 880 (720 / 640 / none per band) |
| CTA gradient | = CTA-website "radgivning": 120° `#55ff9a→#5eb1bf`, soft-navy text, inset-highlight, pil 16 px skalar 1.18, −1.5 px lyft |
| Proof-rad | 14,5 px vit: G-ikon 16 + "5,0 på Google" + 5 stjärnor 13,5 + 1×15-separator + volymrad; mobil kolumn med 26×1-linje |
| Header v5 | fixed 76 px sky-mist, hårlinje + mjuk skugga, nav 18/500 med teal-tint hover + 2 px underline, solid teal CTA + pulse-dot, 3 mega-menyer, Evify-drawer ≤992 (samma CSS som Website-blocks/Header, se website-blocks.md) |

## Hantverk att bevara

- Veil-gradienten i två lager ger läsbar vit text utan att döda fotot; mobilen byter riktning (nerifrån).
- CTA:ns tre-lagers skugga + inset-highlight + pil-skalning är den mest genomarbetade knappen i biblioteket.
- Fem brytpunktsband med egna h1-clamps (1201+, 993–1200, 561–992, ≤560) — radräkningen är verifierad.
- Hover bara på `(hover:hover) and (pointer:fine)`; reduced-motion respekteras; focus-visible tydlig.

## Defekter

1. Helt frikopplat från sajtens tokens: egna hex-kopior av 5 ap-färger, egna radier (22/16/15/20/14/8), egna
   px-avstånd, egen typskala — inget `var(--ap…)` från global-variables.
2. Två "ink"-färger (#0f123c header/body, #090b32 hero) och tre teal-artade (#00a991, #5eb1bf, #008d79).
3. Proof-siffror hårdkodade (5,0 / 3 000) — `[GAP]` mot ampy-foretagsdata.
4. Header laddar Outfit från Google Fonts i Website-blocks-prototypen, self-host i Hero-1 — två vägar.
5. Body 16 px fast (mobil krymper inte) medan live-temat kör `--aptext-sm` 16 → 14,1.

## Skiljer sig från andra block

Enda blocket som lämnar 1280-containern (ram 1700) och enda med foto-veil. CTA:n är samma som
CTA-website/radgivning; header-CTA:n är däremot en solid teal-knapp (radie 15, 600) — två olika
primärknappar i samma vy.
