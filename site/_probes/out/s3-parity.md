# S3 paritet (2026-09-11 22:46)

## Kalkylator-kitet vs led-kalkylator

| Mått | 1440 källa / kit | 390 källa / kit | Not |
|---|---|---|---|
| Inputkort bredd | 512,5 / 513,4 | 370 / 369 | grid 5fr/7fr med gap 19,8 (LED 20) |
| Resultatkort bredd | 717,5 / 718,8 | 370 / 369 |  |
| Inputkort höjd | 848,1 / 822,8 | 806,1 / 766,2 | Outfit i st.f. PJS/mono, eyebrows 12 i st.f. 15, ticks 32; innehållsberoende |
| Resultatkort höjd | 589,1 / 600,1 | 634,1 / 604,1 | CTA 58 i st.f. 50, padding 39,6/16,9 i st.f. 40/20 |
| Inputkort padding | 20 / 19,8 | 15 / 13,3 | --ampy-space-s (LED 20 / 15) |
| Inputkort radie | 20 / 20 | 20 / 16,3 | --ampy-radius-card 20 -> 16,3 (LED 20 fast) |
| Resultatkort padding | 40 / 39,6 | 20 / 16,9 | --ampy-space-l 39,6 / m 16,9 (LED 40 / 20) |
| Rubrik (px) | 34 / 36 | 24,2 / 26,8 | h2-rollen 36/26,8 (LED PJS 34/24) |
| Hjältesiffra (px) | 56 / 56 | 38,3 / 38,3 | --ampy-text-number = LED:s clamp |
| Hjältesiffra radhöjd | 56 / 56 | 38,3 / 38,3 |  |
| Enhet (px) | 28 / 28 | 21,1 / 21,1 | kit-egen --_mid = LED --fs-xl |
| Trio-värde (px) | 28 / 28 | 21,1 / 21,1 | text.css --_mid |
| Stapelspår höjd | 24 / 24 | 24 / 24 | signaturen: 24 |
| Stapel höjd | 24 / 24 | 24 / 24 |  |
| Stapelnyckel bredd | 60 / 60 | 50 / 50 | 60 / 50 (mobil: auto med min 50) |
| Segment spår höjd | 48 / 48 | 48 / 48 | falt.css |
| Segment option höjd | 40 / 40 | 40 / 40 | falt.css |
| Reglage tumme | 24 / 24 | 24 / 24 | falt.css --_thumb (pseudo-elementet kan inte mätas via API, källan mättes som DOM-element) |
| Reglage spår höjd | 6 / 6 | 6 / 6 | falt.css --_track-h |
| Select höjd | 48 / 48 | 48 / 48 | falt.css |
| Väljare höjd | 78 / 77,8 | 78 / 74,6 |  |
| Väljare ikonruta | 56 / 56 | 56 / 56 |  |
| Tips-chip | 16 / 16 | 16 / 16 |  |
| Tick-etikett höjd | 32 / 32 | 32 / 32 | falt.css |
| CTA höjd | 50 / 58 | 50 / 58 | .ampy-btn 58 (LED 50): B4/B6, avsiktlig |
| CTA radie | 12 / 16 | 12 / 16 | 16 (LED 12): B4, avsiktlig |
| Metodkort höjd (stängd) | 60,5 / 65,8 | 56,1 / 62,6 | summary 18/600 med 44 px träffyta (LED 19/600) |

errors: {"390":[],"1440":[]} overflowX: {"390":false,"1440":false}

## Diagnostik-kitet vs elcentral-kollen / elkollen

| Mått | 1440 källa / kit | 390 källa / kit | Not |
|---|---|---|---|
| Rail bredd | 499,8 / 500,2 | 0 / 0 | 44fr/56fr gap 64 i 1280-skalet |
| Stage bredd | 636,2 / 636,6 | 358 / 347,1 |  |
| Startkort bredd | 636,2 / 636,6 | 358 / 347,1 |  |
| Startkort höjd | 560 / 560 | 600 / 600 | min-höjd 560 / 600 |
| Kort padding | 32 / 28 | 20 / 16,9 | --ampy-space-card 28 / 16,9 (källan 32 / 20) |
| Kort radie | 14 / 20 | 14 / 16,3 | --ampy-radius-card 20 / 16,3 (källan 14): avsiktlig |
| Rail-H1 (px) | 44 / 48 | 32 / 31,3 | h1-rollen 48 / 31,3 (källan PJS 44 / 32) |
| Rail-lead (px) | 20 / 22 | 18 / 17 | lead-rollen 22 / 17 (källan 20 / 18) |
| Rail-CTA höjd | 58 / 58 | 60,1 / 60 | .ampy-btn 58 (mobil 60) |
| Rail-CTA bredd | 239,9 / 245,2 | 358 / 347,1 | två lika breda, gap 19,8 (källan 20) |
| Start-CTA höjd | 48 / 48 | 48 / 48 | .ampy-btn--compact 48 |
| Start-CTA bredd | 320 / 320 | 316 / 311,3 | max 320 |
| Startrubrik (px) | 36 / 36 | 20,9 / 26,8 | h2-rollen 36 / 26,8 (källan 36 / 20,9) |
| Illustration | 120 / 120 | 110 / 110 | kit-egen --_illu 120 (källan 120 / 110) |
| Frågetitel (px) | 32 / 32 | 20 / 20 | kit-egen clamp 32 -> 20 |
| Chip höjd | 64 / 64 | 56 / 56 | falt.css 64 / 56 |
| Chip titel (px) | 18 / 18 | 15 / 14,1 | falt.css body 18 / small 14,1 (källan 18 / 15) |
| Chip radie | 10 / 12 | 10 / 10,1 | falt.css --ampy-radius-field 12 / 10,1 (källan 10) |
| Förloppsprick aktiv bredd | 28 / 28 | 28 / 28 |  |
| Förloppsprick höjd | 4 / 4 | 4 / 4 |  |
| Dualstatus bredd (GRÖN) | 420 / 420 | 316 / 311,3 | fit-content min 420 (>= 600 containerbredd) / full bredd |
| Dualstatus höjd (GRÖN) | 123,2 / 132,8 | 95,6 / 93,9 | padding 18/16, pills 18 (mobil 14) |
| Accentstapel | 4 / 4 | 4 / 4 |  |
| Pill höjd | 37,6 / 41,4 | 28,8 / 28,8 | text.css .ampy-tag--lg (källan 37,6 / 28,8) |
| Pill text (px) | 18 / 18 | 14 / 14 | text.css 18 / 14,1 (källan 18 / 14) |
| Lede (px) | 18 / 18 | 16 / 16,1 | body-rollen 18 / 16,1 (källan 18 / 16) |
| Fynd-etikett (px) | 18 / 18 | 15 / 16,1 | body 18 / 16,1 (källan 18 / 15) |
| Fynd-ikon | 20 / 20 | 18 / 20 | 20 (källan 20 / 18) |
| Kortets CTA höjd | 48 / 48 | 48 / 48 | .ampy-btn--compact 48 |
| Akut-ruta höjd | 102 / 104,4 | 136,1 / 132,5 | text 16 / 14,1 (källan 15 / 13); radbrytning |
| Dualstatus bredd (GUL) | 420 / 420 | 316 / 311,3 |  |
| Board höjd (RÖD, elkollen) | 56,4 / 56,4 | 47,6 / 47,2 | h3-rollen 22 / 20,1 (källan 22 / 18) |
| Board text (px) | 22 / 22 | 18 / 20,1 | (källan 22 / 18) |
| Board bredd | 311,3 / 313,9 | 262,7 / 279,5 | Outfit i st.f. Outfit 700 (samma), padding 14/19,8 (källan 14 18 / 12 16) |
| Tabbar höjd | 44 / 44 | 44 / 44 | 44 |
| Sammanfattning (px) | 17 / 18 | 16 / 16,1 | body 18 / 16,1 (källan 17 / 16) |
| Rad ✓/✗ (px) | 16 / 18 | 15 / 16,1 | body 18 / 16,1 (källan 16 / 15) |

errors: {"390":[],"1440":[]} overflowX: {"390":false,"1440":false}

