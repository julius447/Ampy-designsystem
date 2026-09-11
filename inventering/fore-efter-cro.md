# fore-efter-cro — före/efter-blocket, riktning A "Reglaget"

**Vad:** rent bevisblock: två kvadratiska före/efter-ramar sida vid sida med varsin söm som besökaren drar; EN H2, en
avslutande tagline, 0 asks. Ägaren valde riktning A 2026-08-17 (B "Bevisparet" och C "Journalen" avförda). Levererat som
FluentSnippets-trio (`dist/01-…css`, `02-…php` med shortcode + ACF, `03-…js`) och kodgranskat (nio defekter rättade).
Bilderna är illustrationer tills fotobiblioteket finns. Auktoritet 2.
**Mätning:** `inventering/_probes/fore-efter-cro.mjs` → `_probes/out/fore-efter-cro.json`. Datablad: `fore-efter-cro.json`.

| Desktop 1440 | Mobil 390 |
|---|---|
| ![](skarmdumpar/fore-efter-cro-desktop.png) | ![](skarmdumpar/fore-efter-cro-mobile.png) |

No-JS-läget: `fore-efter-cro-nojs-*.png` (paren staplas FÖRE över EFTER, allt läsbart).

## Det viktigaste i tokens
- **Egen namnrymd `--ampyfe-*` i px som speglar ap*-kurvorna exakt:** `--ampyfe-text-rubrik clamp(24, .83vw+21.3, 32)` =
  `--aptext-xl`, `text-m` = `--aptext-m`, `text-s` = `--aptext-s`, `space-2xs…2xl` = `--apspace-*`, `radie-l` = `--apradius-l`.
  Blocket är alltså tokentroget i värde men frikopplat i namn ("px, inte rem — ärver aldrig värdinnans rotstorlek").
- **Färger:** `#00a991` (= `--apteal-core`: spår, fokus, radial-dis .055), `#090b32` (= `--apmidnight-blue`: text, chip .82,
  ledtråd .82, understrykning), `#55ff9a` (= `--apneon-mint`: EFTER-chip), `#f5f9ff` (= `--apsky-mist`). **Utanför tokens:**
  ramens `#eaeef5`, skuggorna (`rgba(9,11,50,.04/.06/.05)` + inset .07, söm .18/.28, handtag .32, chip .18, tumme .3), glas
  `rgba(9,11,50,.82)` + `backdrop-filter blur(8/10px) saturate(150%)`.
- **H2: 32/400 lh 1.2 ls normal** (24,5 @390), centrerad, balance, accent = nowrap + `::after`-linje 0.075em. Kommentaren
  dokumenterar mätningen 2026-08-17: **8 av 16 H2:or på /elservice/elcentral/ kör `--aptext-xl`/400/1.2/normal** (content-block,
  faq, services-loop, visste-du-att, ce-block, footer-seo); temats h2 (2-5xl/500) skrivs över av varje block.
- **Tagline** 18/400 lh 1.45 navy .78 max 62ch (kommentar: "när H2:an gick från 40/500 till 32/400 låg taglinen på 22 px för nära").
- **Spacing:** sektion 79,2/19,8 (34,8/13,3), H2 mb 39,6 (21,5), par-gap 28 (21,5 staplat), chip-offset 14 (10,5), tagline mt 39,6.
  Ram 626×626 @1440 / 363×363 @390, radie 20 (16,3). Handtag 52 (46), ledtråd 46 px under, reglage 44 hög/spår 6/tumme 26.
- **Rörelse:** `--ampyfe-pos` som `@property <percentage>` (initial 35 %); transition 260 ms cubic-bezier(.22,.61,.36,1) bara
  vid tangentbord/klick (`.ar-mjuk`), aldrig under drag; ledtråden tonar ut .25 s; reduced-motion släcker.
- **Container queries:** wrapper ≤680 cqi staplar, figur ≤420 cqi krymper handtag/chip; `@supports`-fallback 720/520 vw.

## Komponenter
- **Sektion** — sky-mist + radial teal-dis, padding 79/20, inner 1280, Outfit 300.
- **H2 med understruken accent** — 32/400, `::after`-linje i navy.
- **Före/efter-ram ×2** — kvadrat, radie 20, tredelad skugga + hårlinje; EFTER bas, FÖRE klippt med `clip-path inset(0 calc(100% − pos) 0 0)`.
- **Chip FÖRE/EFTER** — 14/600 .12em versal; navy-glas resp. neonmint; klipps spegelvänt med sömmen.
- **Sömlinje + handtag** — 2 px vit + 52 px vit cirkel med ‹› och tunn ring; fokusring 4 px teal via `:has()`.
- **Ledtråd** — glaspill "Dra för att jämföra", clampad 102 px från kanterna, tonar ut vid beröring.
- **Reglage** — `input[type=range]` 44 px hög, tvåfärgat spår, 26 px tumme med navy-kant; aria-label + describedby.
- **Tagline** — en mening som binder ihop två utgångslägen.
- **No-JS-läge** — staplade bilder, gap 4, kontroller dolda.

## Det som gör blocket bra (bevara)
- Renderingskontraktet: två riktiga `<img>` med width/height, synliga utan JS, reglaget som ren enhancement.
- Symmetrin i klippningen: chip-lagret klipps spegelvänt så en söm dragen hela vägen tar sin etikett med sig.
- `@property`-driven position med transition bara när fingret inte är i sömmen.
- Ramen äger pekaren (bilder `pointer-events:none`, `touch-action: pan-y pinch-zoom`) — inget kapat scroll, ingen tappad drag.
- Container-queries mot blockets och parets egen bredd; konsistensregeln (samma ram, samma ljus, bara jobbet skiljer).
- 0 asks och ask-taket respekterat — blocket kan ligga var som helst utan att röra sidans budget.

## Defekter
Se JSON. Viktigast: parallell tokennamnrymd (värdetrogen men namnfrämmande); H2-målet 32/400 står mot ROT-GT/certificates 36;
egna skuggor + #eaeef5; blur-glas utan token; Google Fonts i preview; [GAP] inga riktiga foton (ACF-grinden vägrar osignerade par).

## Vad som skiljer sig från andra block
- **H2-mål:** 32/400 (`--aptext-xl`, "8 av 16 live-H2:or") — ROT-GT-familjen (36/450, "medianen av mini-menu/content/testimonials")
  och certificates v2 (36/400, "Så funkar det") landade på 36. Samma vecka, tre olika belägg, två storlekar.
- **Accent-device:** understrykning via `::after` 0.075em (bara linje) — ROT-GT-familjen använder `text-decoration` 2 px + vikt 550;
  live-ROT en färggradient; testimonials-live ett gradientord. Fyra accentdevices för "sista orden i H2".
- **Glas:** enda blocket med backdrop-filter-glas (chip + ledtråd); mini-menu ("ljus glas-trio") tillhör agent 1:s urval.
- **Tagline-roll:** 18/400 lh 1.45 .78 — en femte brödtextvariant (ROT-GT 300/1.5, certificates 300/1.55, eljour 400/1.6, live 300/1.7).
