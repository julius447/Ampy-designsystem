# Picasso (`picasso`)

**Vad:** Referensbiblioteket — verbatim-extraherade konkurrentkomponenter (riktig HTML/CSS/JS + preview) bredvid Ampys egna 1:1-baslinjer och en "atomdatabas" (`elements/buttons`). 146 filer, 9 komponentmappar. **Auktoritet: 3** (inspiration, ej kanon). Ingång `kallor/Picasso/README.md`.
**Mätning:** katalogläsning + README:er. Bara Ampy-byggena som rader; externa referenser bara namn/URL. De kanoniska knapparna renderade och mätta (`_probes/picasso.config.json`). Data i `picasso.json`.

![knappdatabasen](skarmdumpar/picasso-desktop.png)
![main-form-prototypen](skarmdumpar/picasso-main-form-desktop.png)

## De fem Ampy-byggena (+ en baslinje)

| # | Bygge | Var | Status | Noterat |
|---|---|---|---|---|
| 1 | **elements/buttons** — `cta-primary` "Kontakta oss" + `cta-phone` | `elements/buttons/` (Bricks-JSON ×2, buttons.css, buttons.html, tokens.css, icons/, preview) | kanonisk atom, "referenseras, regenereras aldrig", verifierad | mätt: **196.5×37.8 \| 272.9×42.8**, padding `--apspace-2xs` / `--space-m` (9.9/24), gap `--apspace-l` 39.6, Outfit 400 `--aptext-sm` 16 \| 14.1, ink `#0d0d0d`, radius `--radius-m` 16, gradient 120° `#55ff9a→#5eb1bf` / 141° `#b6f2ff→#5eb1bf`, glöd `0 0 16px rgba(241,241,241,.25)`, hover −1px + blå skugga + saturate |
| 2 | **main-form/ampy-redesign** — /offert-redesign (trust-panel vänster / form höger) | `components/main-form/ampy-redesign/` + `delivery/{bricks,fluentsnippets,preview}` | design GO; samma bygge som `kallor/Ampy-main-form` (agent 4) | navy-aurora-panel, submit i `#00a991` (ersatte live `#57f1a1`), Outfit self-hostad i delivery; webhook `n8nflows.ampy.se/webhook/Kontakt` |
| 3 | **main-cta** — Main CTA-bandet | `components/main-cta/` (`build/` = 1:1-klon verifierad med computed-style-diff; `redesign/va|vb|vc|cta-lab|cta-textfarg`) | = `kallor/Main_CTA` (annan agent) | ap-token-ren baslinje: sektion `#f5f9ff`, kort `--apradius-l` + `--apspace-l/2xl`, rubrik `--aptext-2-5xl`/500 med teal→blå textgradient `hsl(171 95% 41%)→hsl(189 43% 56%)`, text `--aptext-m`/300 |
| 4 | **testimonials** — omdömesslidern | `components/testimonials/` (`build/`, `delivery/` FluentSnippets + 5 docs, `redesign/a|b`) | = `kallor/Testimonials-block` (annan agent) | kort `#0b0f30→#2d516d` −27°, 360×360, stjärnor `#55ff9a`, rubrik `--aptext-xl` med grön gradient `#1BD365`; README flaggar green→teal-drift |
| 5 | **hero/ampy** — Hero 1 avkodad | `components/hero/ampy/hero-1.bricks.json` + `docs/strategy.md` | = `kallor/Hero-1` (agent 1) | ingen egen rendering |
| (6) | main-form/ampy — nuvarande /offert verbatim | `components/main-form/ampy/current-form.bricks.json` | baslinje | submit `#57f1a1`, "…konsultation!" |

## Externa referenser (namn/URL, inte mätta)

- `hemsol-header` — hemsol.se produktions-header (mega-meny + drawer), verbatim.
- `evify-header` — evify.se (CodyHouse Mega Navigation + Bootstrap 4).
- `mini-menu/evify` + `mini-menu/hemsol` — produktväljar-block under hero.
- `main-form/svea` — sveasolar.se/sv-se/fri-offert (från `__NEXT_DATA__`; exakt CSS = [GAP]).
- `main-form/evify` — evify.se/offert/ (chip-formulär, live-validering, in-place success).
- `hero/evify`, `hero/laddboxkillarna`, `hero/hemsol` — tre konkurrent-heros.

## Det som är värt att bevara

1. Principen "referensera, regenerera aldrig" med alla format en build behöver (Bricks-JSON + CSS + HTML + tokens + preview).
2. Baslinjeklonerna verifierade mot live innan redesign — `main-cta/build` och `testimonials/build` är de enda ställena där live-sajtens **riktiga** `--aptext-*` / `--apspace-*` / `--apradius-*`-bruk går att läsa i kod.
3. Konkurrentreferenser som riktig kod med README som säger vad som är [GAP].

## Defekter / konflikter

1. Den kanoniska CTA-knappen är en **gradient-pill i Outfit 400 på 38px** — kalkylatorkitets primärknapp är en **teal-fylld PJS 600 på 48–56px**, och Elkollen/Elcentral kör **samma gradient-recept på 58px** (padding `2rem 2.4rem`, space-between). Tre "primära" knappar, alla kallade 1:1.
2. Gradienterna (`#55ff9a`/`#5eb1bf`/`#b6f2ff`) är inte kanonisk teal — README flaggar det själv som "single point of change".
3. Bricks-tokens (`--radius-m`, `--space-m`) och ap-tokens (`--apspace-2xs`, `--aptext-sm`) blandas i samma knapp.
4. Fyra av Ampy-byggena dubbleras i egna repon (main-form, main-cta, testimonials, hero-1) — sanningen måste pekas ut.
5. `evify-header/assets/screenshots/` är tom (`.gitkeep`).

## Vad som skiljer sig från andra block

Inte ett block utan biblioteket bakom flera. Två saker spelar roll för systemet: knapp-atomen (38px gradient-pill) och de token-rena baslinjerna som visar hur live faktiskt använder ap-skalan — i motsats till alla fem kalkylatorer/diagnostiker som har egna skalor.
