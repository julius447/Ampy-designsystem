# article-template — artikelmallen (21 komponenter)

**Vad:** SEO-artikelmall i React + Vite + Tailwind: sticky header, breadcrumb, navy-hero, byline, sticky TOC, "Snabbt svar",
sektioner med bild/citat/pro-tip/tabell/diagram/lead-magnet, FAQ (JSON-LD), recensions-CTA, delning, relaterade artiklar,
footer + en separat Bricks-överlämning av tabellen (`handover-ampy-tabell/`). Auktoritet 2.
**Mätning:** repot är en Vite-app utan `dist/`; kopierad till scratchpad, `npm install` + `vite build`, sedan
`inventering/_probes/article-template.mjs` mot `dist/` → `_probes/out/article-template.json`. `kallor/` orörd. Datablad: `article-template.json`.

| Desktop 1440 (topp) | Mitt i artikeln |
|---|---|
| ![](skarmdumpar/article-template-desktop-topp.png) | ![](skarmdumpar/article-template-desktop-mitt.png) |

Hela sidan: `article-template-desktop.png` (10 450 px), `article-template-mobile.png` (15 768 px), FAQ: `article-template-desktop-faq.png`.

## Det viktigaste i tokens
- **Egen Tailwind-palett, inte ap*:** träffar bara på `#090b32` (navy), `#f5f9ff` (cloud-100), `#55ff9a` (ampy-300), `#fff`.
  **Utanför:** `electric #326afd` — "primary blue" för länkar, TOC-ikon, tabellrubriker, brand-* (73 användningar; finns inte i
  Ampys palett), brödtext `#1a1d2e`, navy-skalan `#141a47/#2a3268/#6b78a3/#a4adc9/#d2d6e8/#eef0f8`, cloud `#eaf0fb/#dde5f4`,
  ampy `#ebfff3/#2ee378/#15c45c/#0a9e48`, "teal" `#5eb1bf`, gradienter blå→grön.
- **Rot 16 px + rem-skala** (inte 62.5 % + fluid clamps): inget värde är fluid; allt bryter vid Tailwind sm/lg.
- **Typografi:** H1 **48/800 lh 1.0 ls −0,025 em** (36 mobil) vit på navy; H2 **30/700 lh 1.2** (24 mobil) mt 48 mb 20;
  H3 20/600 lh 1.4 med 3 px neonmint-kant; "Populära artiklar" 36/700; brödtext **18/400 lh 1.7 #1a1d2e** mb 20; listor 17/400;
  länkar #326afd med 1,5 px understrykning; eyebrows 10–15/700–800 versal .2–.25 em; TOC 15,5/500; byline 13; citat 18 + 40/700-citattecken;
  tabell 14,4 / thead 10,9 versal .07 em.
- **Mått:** container 1088, artikel 704 + TOC 320 sticky; header 102 (topbar 36 + nav 66); footer 56/32; kort padding 24–48, marginaler 24–48.
- **Radier:** 16 (rounded-2xl, 12 kort), 24 (lead magnet/takeaways/CTA), 9999 (57 pillar/avatarer), 8/6/12. **Skuggor:** shadow-card
  `0 1px 2px rgba(9,11,50,.04), 0 4px 12px .06`, cardLg, glow (blå/grön fokus), Tailwind shadow-sm. **Rörelse:** fadeUp .4 s,
  transition-colors 150 ms, smooth scroll, 3 px progressbar — ingen reduced-motion.

## Komponenter (en rad per komponent)
- **SiteNav** — topbar (Google 5.0, "200+ omdömen", telefon) + nav 66 px med neonmint "Få offert"-pill.
- **Breadcrumb** — 14 px, electric-länkar.
- **ArticleHero** — navy-band, H1 48/800 vit + intro 20/400 .85 max 672.
- **AuthorBlock** — tre avatarer, Skriven/Redigerad/Faktagranskad av, "Verifierad av expert", datum, lästid.
- **TableOfContents** — sticky vitt kort 320, länkar 15,5/500, aktiv = electric på #eef3ff radie 8.
- **QuickAnswer + KeyTakeaways** — "SNABBT SVAR"-kort med 4 px neonmint-kant, H2 30/700, numrerade takeaways.
- **ContentSection** — H2 + aspect-video-bild (cloud-200 platshållare) + prose; H3 med grön kant.
- **Quote** — 18/400 + navy-200-citattecken 40/700, avatar + titel.
- **ProTip** — centrerat kort 32/40, "PRO TIP" 15/700 .22 em, text max 58ch, knapp.
- **ComparisonTable / TiltChart** — kort med cloud-100-huvud, electric eyebrow 11/800, tabell resp. linjediagram.
- **LeadMagnet / PersonalStory** — navy-kort radie 24 padding 48 med glow-blob, eyebrow 10/800.
- **FAQ** — accordion + FAQPage JSON-LD, svar 14,5 px.
- **CTAReview** — kort radie 24, H3 32/700, vit pill-knapp.
- **ShareBar / RelatedArticles / SiteFooter** — ikoner; 3–4 kort 341 px radie 16; navy-footer med H4 11/800 neonmint.
- **Bricks-tabell** — scopad `.ampy-table`, max 44rem, ram #d7e0ef radie 16, huvud #fafcff, celler 1rem, scroll-wrapper, ingen JS.

## Det som gör blocket bra (bevara)
- E-E-A-T-skelettet: byline med tre roller + verifierad-badge + uppdaterad + lästid + FAQ-schema — färdiga ytor som artikelröst-/SEO-troupen behöver.
- "Snabbt svar" med key takeaways före brödtexten; sticky TOC med aktiv markering och nested H3.
- Tabell-överlämningen: scopad, JS-fri, aldrig bredare än brödtexten, scroll-wrapper.
- Datadriven mall — en datafil driver hela sidan.

## Defekter
Se JSON. Viktigast: egen palett med **#326afd som primär blå** (finns inte hos Ampy), rot 16 px/rem utan fluid skala, vikter 700/800,
brödtext 400 (sajten 300), sex textstorlekar under 16 px, Google Fonts, hårdkodat socialt bevis ("5.0", "200+ omdömen" — [GAP]),
ingen reduced-motion, egna header/footer-kopior, femte skuggfamiljen.

## Vad som skiljer sig från andra block
- **Enda källan med en egen *primärfärg* utanför varumärket** (#326afd) och med vikt 700/800 som rubrikkanon.
- **H1/H2/H3 = 48/30/20 med lh 1.0/1.2/1.4** — ett tredje typsystem bredvid ap*-clamparna och Vår process-v2:s 40/22/17.
- **Brödtext 18/400 lh 1.7** — närmast Bricks-defaultens lh 1.7 (live), men vikt 400 mot allas 300.
- **Rot 16 px** (som ROT-GT-familjens wrapper och före/efter — men de kompenserar med px; Tailwind gör det inte).
