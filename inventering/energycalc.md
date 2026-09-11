# Energikalkylatorn vB v36 (`energycalc`)

**Vad:** Värmepumpskalkylatorn — vitt sticky inputkort (heat-picker med 9 ikonkort + "Vet inte", native range, glidande pill-segment, stepper, utfällbara sub-sliders) till vänster; midnattskort med aurora, eyebrow med streck, anchor i Outfit 900, story bar, "Sparstaplarna", CTA + dela, inline-formulär och metodik till höger, plus ett fotobaserat trust-kort under. Egen kodfamilj: inte `ampy-calc__*` utan `.input/.result/.seg/.sp-*`.
**Status:** live vB v36. **Auktoritet: 1.** Ingång `kallor/Energycalc/vB/index.html`, CSS `vB/tool.css` (728 rader), fonter self-hostade i `kallor/Energycalc/fonts/`.
**Mätning:** `_probes/energycalc.config.json` → `energycalc.measure.json` (fem states + pseudo-element), census `_probes/census-energycalc.json`. Native range-thumb gick inte att läsa via API — värden från `tool.css:200-215`. Data i `energycalc.json`.

![desktop](skarmdumpar/energycalc-desktop.png)
![mobil](skarmdumpar/energycalc-mobile.png)

Fler states: `-desktop-state-leadform.png` (CTA morfad till "Stäng", formulär i kortet, metodik öppen), `-desktop-state-share.png` (dela-popover).

## Tokens: det viktigaste (avvikelser ⚠)

| Roll | Värde i Energycalc | Live-token | Kommentar |
|---|---|---|---|
| Accent (CTA, valda kanter, ikoner, fokus) | `#00a991` | `--apteal-core` | exakt, 57 användningar |
| ⚠ Teal på mörkt | `#00c4a7` (storybar, sp-fill, sp-val, citattecken) | — | "WCAG-teal", utanför tokens |
| ⚠ Vald pill | `#00806e` (seg-pill) + hover `#00b89e` | — | tredje/fjärde tealen; koden säger själv "NOT a new token… owned by the designsystem-konsolidering program" |
| Mörk yta | `#090b32` + aurora (`#00c4a7` .22, neon .10, midnatt .40) | `--apmidnight-blue` | exakt bas |
| Text mörk | `#1e1e1e` | `--apdarkest-black` | exakt (inte midnatt som i kitet) |
| Ikonruta | `#f5f9ff` | `--apsky-mist` | exakt |
| Neon (fokus på mörkt, rec-kant) | `#55ff9a` | `--apneon-mint` | exakt |
| ⚠ Grå skala | `#51607a` muted / `#7c86b0` slate / `#aeb8d4` subtext / `#8a93b5` footnote | — | fyra egna gråblå |
| ⚠ Mint | `#9fe1cb` | — | nära `--apsublime-green` `rgb(160,251,201)` men inte samma |
| ⚠ Kanter | `#e1e8f4 / #d7deeb / #dbe4f2 / #eef2f9 / #e3e9f5` | — | fem närliggande |
| ⚠ Amber | `#f0b429` | — | kitets amber är `rgb(240,175,56)` |
| ⚠ Fel | `#ff8a8a` | — | egen |
| Typsnitt | **Outfit only**, vikter 300/500/900, self-hostad | Outfit | ✓ familj; vikterna 300/900 finns inte i kitet |
| Typskala | 10.5 / 12 / 13.5 / 15.5 / 16 / 20 fast + lead `clamp(18→22)` + display `clamp(32→52)` | `--aptext-*` | ⚠ egen |
| Spacing | 4px-grid `--sp-1…9` = 4/8/12/16/20/24/32/40/56 | `--apspace-*` | ⚠ egen men konsekvent |
| Radier | 6 / 9 / 12 / 16 / 20 / pill | `--apradius-*` | 6, 12, 16, 20 matchar i ena änden |
| ⚠ Shell | 1360px | 1280px | bredare än sajten |
| Skuggor | navy-tonade dubbelskuggor `--shadow-1/2/3`, `--shadow-teal`, ringar .28/.30 | — | egna |
| Rörelse | 140 / 220 / 300 ms, stagger 45 ms, `cubic-bezier(.2,.6,.2,1)` / `(.16,1,.3,1)` | — | egna |

## Komponentlista (mått @1440 | @390)

- **input** — vitt kort 420px fast, sticky top 24, padding 32 | 20, radius 20, shadow-2. 420×1250 | 366×1299.
- **gearhead** — versal Outfit 500 12 ls .14em; grupp 2 avdelas med hairline + 24/32 luft.
- **hp-card** (heat-picker) — 2-kol grid gap 10; kort 88px min, padding 12, 1px `#d7deeb`, radius 12; ikonruta 40 (34) radius 9 sky-mist + teal-ikon; vald = teal kant + `#f2fbf8` + ring .28 + tänd 20px check; "Vet inte" dashed 44px.
- **lbl / lbl-val / lbl-soft / antag** — fråga Outfit 500 16 med slate-ikon, hjälpare 13.5/300, värde höger 16/500, "(antagande)" 10.5.
- **range** — native, 44px; spår 8px `#e3e9f5`; thumb 28 vit + 2px teal; fokus ring .28 + outline.
- **seg** — knappar 44 (48 på mobil) 1px kant radius 6, Outfit 400 13.5; glidande `.seg-pill` `#00806e` under vald (vit text).
- **stepper** — 1px kant radius 6, knappar 44×44, värde Outfit 500 20.
- **result** — midnatt, radius 20, padding 40 (≥1200) | 16, shadow-3, aurora ::before + inset-highlight ::after. 852×949 | 366×1040.
- **eyebrow** — 24×2 streck `#19c39e` + Outfit 500 12 versal ls .14em `#5dcaa5`.
- **anchor-num** — Outfit **900** 52 | 35.7, lh 1.08, ls −.02em, tnum; enhet Outfit 300 16 subtext.
- **storybar + legend** — 36 | 32px radius 9: `#00c4a7` / `#9fe1cb` / slate .38 med 1px midnatt-.5 mellan; legend prickar 10px radius 3, text 13.5/300, tal 500 vit.
- **spark / sp-item** (signaturen) — h2 Outfit 500 20; rader bg vit .02 + 1px .06 radius 12; rekommendation = neon-kant .55 + teal-bg .06 + ring .10 + mint-flagga "★ Vår rekommendation"; namn 16, värde 16/500 `#00c4a7`; spår 10 | 12px `#0c1040` med fill `#00c4a7` + band mint .34; utfällt: 1px .12, verdict 15.5/300 max 62ch, statrader 13.5/300 → 15.5/500 med 1px .08 mellan.
- **cta** — 100 %, teal, Outfit 500 18 | 16.2, padding 16, min-height 52 (57 | 54 mätt), radius 12; hover −2px + `#00b89e` + teal-skugga; morfar till ghost "Stäng" när formuläret öppnas.
- **share-btn / share-pop** — textknapp 44 hög 13.5/300; popover 240px `#11163f` radius 12 med tre 44px rader.
- **lead-inline** — reveal via grid-rows; body `#11163f` radius 16 padding 20; titel Outfit 500 20; ≥992 2-kol grid; fält 44 hög radius 9 bg vit .04 kant .12 (fokus neon + ring; fel `#ff8a8a`); submit = `.cta`; samtycke som text under knappen (ingen checkbox).
- **method** — details 44px summary 13.5 (15 på mobil) med mint-caret 90°; body 13.5/300 max 70ch + legal 10.5.
- **trust** — foto + midnattsveil (103°, .94→.28) radius 20 shadow-3; 72px citattecken `#00c4a7` @.55; citat Outfit 500 22 | 18; 5 stjärnor `#f0b429`; divider 44 %; stat 15.5/500. 852×283 | 366×264.
- **jump-pill** (≤991) — fixed midnatt-pill 46px med teal 34px chip, Outfit 500 15.

## Det som gör blocket bra (bevara)

1. **En familj, vikt-hierarki**: Outfit 300/500/900 self-hostad — det renaste typsystemet i biblioteket och det enda GDPR-rena bland kalkylatorerna.
2. **4px-grid med dokumenterad rytm** (8 label→kontroll, 16 head→innehåll, 24 grupp→grupp).
3. **Aurora + inset-highlight** ger djup utan bild; trust-kortet återanvänder samma radie/skuggfamilj så sömmen läses sömlös.
4. **Glidande seg-pill** och **grid-rows-reveal** (0fr→1fr) — rörelse utan height-mätning.
5. **Heat-picker-korten** med tänd check och dashed "Vet inte"; sticky inputkort + jump-pill som pekar mot resultatet.
6. Print-, `@supports`-, safe-area- och hover:hover-regler; måttcap i ch på all löptext; reduced-motion nollställer tokens.

## Defekter

1. 16 egna nyanser utanför tokens — bara 7 av 71 färgliteraler mappar till `--ap*`; fyra tealer, fyra gråblå, fem kantfärger.
2. Shell 1360px mot sajtens 1280.
3. Tokens på `:root` och oprefixade klassnamn (`.cta`, `.input`, `.result`) — kollisionsrisk i Bricks.
4. `body` 400 mot `--w-body` 300: två brödtextvikter.
5. Amber `#f0b429` ≠ kitets `rgb(240,175,56)`; native range (28px/2px) ≠ kitets slider (24px/3px).
6. Trust-kortets "5 av 5" och "3 000+ installationer om året" är faktapåståenden som kräver ägarbekräftelse (koden hävdar sanktion) — ligger utanför inventeringen men flaggas.

## Vad som skiljer sig från andra block

Egen kodfamilj som bara delar midnatt/teal och tvåkortslogiken med LED/EV/Battery. Närmast Elkollen i typsnitt (Outfit-only) men tyngre (900) och ljusare (300). Enda kalkylatorn med native range, foto-trustkort, jump-pill och samtycke-utan-checkbox. Den "Sparstaplarna"-devicen (låg = solid, upp till = band) finns ingen annanstans.
