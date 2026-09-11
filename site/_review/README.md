# site/_review: granskningens prober och bevis (2026-09-12)

Kör från repo-roten. Playwright ligger i `tools/node_modules`.

| Probe | Gör | Ut |
|---|---|---|
| `01-lankar.mjs` | länkar, ankare, use-symboler, bilder, nav-paritet, title, platshållare, alt, rubrikordning på 26 sidor | `out/lankar.json` |
| `02-render.sh` | `tools/shot.mjs` på alla 26 sidor -> `_shots/rev-*` | `out/render.log`, `out/render.jsonl` |
| `03-token-diff.mjs` | lager 1 `--ap*` i tokens.css mot live global-variables.css | `out/token-diff.json` |
| `04-text-dump.mjs` | innerText per sida (för grep av synlig text) | `out/text/*.txt` |
| `05-sanning-farg.mjs` | farg.html:s swatchar mot tokens.css + farg-frekvens.json + egen kontrastberäkning | `out/sanning-farg.json` |
| `06-sanning-semantisk.mjs` | farg.html:s semantiska tabell mot radkommentarerna i tokens.css | `out/sanning-semantisk.json` |
| `07-kanon-extract.mjs` + `08-kanon-check.mjs` | "Kanon: slug (fil:rad)" på komponentsidorna mot kallor/ | `out/kanon-claims.json`, `out/kanon-check.json` |
| `09-css-dubbletter.mjs` | selektorer i flera filer, egenskapskonflikter, klassnamn i flera komponentfiler | `out/css-dubbletter.json` |
| `10-kontrast-teal.mjs` | WCAG-kontrast + teal core som text per textnod | `out/kontrast.json` (12 sidor), `out/kontrast-del2.json` (14 sidor) |
| `11-tangentbord.mjs` | mobilnav i tabbordning, Meny/Escape, details, kopiera, fokusring, små träffytor | `out/tangentbord.json` |
| `12-crop.py`, `14-crop-region.py`, `15-shot-at.mjs` | beskärning av full-page-PNG och viewport-skott vid scroll-y | `out/crops/*.png` |
| `13-sektioner.mjs` | y-position för varje h2 på en sida (desktop + mobil) | stdout |
| `16-natverk.mjs` | alla nätverksanrop per sida, externa flaggas | stdout (571 anrop, 0 externa) |
| `17-details.mjs` | details/summary, fält utan label, knappar utan namn | stdout |
| `out/sammanfattning.json` | räknade totaler | |

Rapporten: `site/GRANSKNING.md`.
