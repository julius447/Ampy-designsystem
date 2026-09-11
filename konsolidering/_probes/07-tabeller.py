#!/usr/bin/env python3
"""07 · Bygger konsolidering/farg.{md,json}, typografi.{md,json}, spacing.{md,json}, form-djup-rorelse.{md,json}
ur probe-utdata (01-06) + kanonbesluten (KANON-dicten nedan). Kör efter 01-06.
"""
import json, os, re, collections
HERE=os.path.dirname(__file__); OUT=os.path.join(HERE,'out'); K=os.path.abspath(os.path.join(HERE,'..'))
ff=json.load(open(os.path.join(OUT,'farg-frekvens.json'))); idx={o['hex']:o for o in ff['farger']}
kon=json.load(open(os.path.join(OUT,'kontrast.json')))
smoke=json.load(open(os.path.join(OUT,'smoke-matt.json')))
l1=json.load(open(os.path.join(OUT,'lager1-ap-tokens.json')))['tokens']
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b); return round((max(la,lb)+0.05)/(min(la,lb)+0.05),2)
def tohex(v):
    v=v.strip().lower()
    if v.startswith('#'): return v
    m=re.match(r'rgba?\((\d+),(\d+),(\d+)',v.replace(' ',''))
    return '#%02x%02x%02x'%tuple(int(m.group(i)) for i in (1,2,3)) if m else None

# ---------------- FÄRG ----------------
ROLL={ # primitiva ap*-färger: roll(er) + semantisk mappning
 '--apmidnight-blue':('mörk yta, all rubrik-/brödtext, fokusring, skuggfärg (alfa)','--ampy-bg-dark, --ampy-ink, --ampy-ink-body, --ampy-focus, --ampy-line (alfa)'),
 '--apteal-core':('accent: ikoner, valda kanter, ringar, fyllningar utan text; solid header-CTA','--ampy-action, --ampy-bg-tint-action (alfa)'),
 '--apemerald-flow':('success, "efter"-stapel, slider-fyllning','--ampy-success'),
 '--apseafoam-mint':('aurora-SVG-stopp (thank-you/offer)','(dekor)'),
 '--apneon-mint':('handlingsgradientens start, pulsprick, EFTER-chip, fokus på mörkt, stjärnor (testimonials-kort)','--ampy-action-gradient, --ampy-focus-on-dark'),
 '--apsublime-green':('ljus aurora (radial .28)','--ampy-aurora-light'),
 '--apmint-surge':('definierad, 0 användningar i källorna','(oanvänd)'),
 '--apcrystal-blue':('ring-gradientens start, ljus aurora (.48), footer-gradient, certificates-våg','--ampy-action-gradient-ring, --ampy-aurora-light'),
 '--apaqua-frost':('definierad, 0 användningar (live --color-29 #e5faff är en annan)','(oanvänd)'),
 '--appure-white':('kort, text på mörkt, alfa-serie på mörkt','--ampy-bg-surface, --ampy-on-dark*'),
 '--apsky-mist':('sidbakgrund, subtil yta, ljus aurora-bas','--ampy-bg-page, --ampy-bg-subtle'),
 '--apmilk-white':('definierad + alfa-serie; 0 användningar i blocken','(oanvänd)'),
 '--apgray-white':('definierad; 0 användningar','(oanvänd)'),
 '--apcharcoal-gray':('live --color-20: brödtext mobil ROT/GT, rot-gt-familjens p, booking body-ink, hero-2 input-text','drift → --ampy-ink-body'),
 '--apdarkest-black':('energycalc ink, rot-gt rubrik-ink, footer h3, mini-menu pill-text, hero-2 Z submit-text','drift → --ampy-ink'),
 '--apdeepest-blue':('definierad; 0 användningar','(oanvänd)'),
 '--appure-black':('main-form asterisk; logo-PNG:er (#000)','(punkt)'),
}
TILLAGG=[('--apsecondary-teal','#5eb1bf'),('--apteal-deep','#007a69'),('--apteal-tint','#e3f6f1'),('--apindigo','#282a53'),('--apnavy-ink','#3b3f59'),('--apnavy-muted','#565e82'),('--apnavy-faint','#6a7190'),('--apamber','#f0af38'),('--apsignal-red','#b3261e'),('--apsignal-red-tint','#fdeceb'),('--apamber-tint','#fff4e0'),('--apverdict-green','#0f6e56'),('--apverdict-amber','#876507'),('--apverdict-red','#7a1623'),('--apverdict-blue','#0d568c'),('--apgoogle-gold','#fbbc04')]
TROLL={'--apsecondary-teal':('handlingsgradientens slut, ring-gradientens slut, live fokus/highlight (--color-7), mini-menu pill, certificates gradient','--ampy-action-gradient(-ring)'),
 '--apteal-deep':('solid knapp med vit text, textlänk, sista H1-rad (diagnostik)','--ampy-action-strong'),'--apteal-tint':('pill/chip-yta (eljour-familjen)','(pill)'),
 '--apindigo':('knapptext på gradient','--ampy-ink-on-action, --ampy-action-gradient-on'),'--apnavy-ink':('brödtext i eljour-familjen','drift → --ampy-ink-body (B3)'),
 '--apnavy-muted':('dämpad text','--ampy-ink-muted'),'--apnavy-faint':('svag text','--ampy-ink-faint'),'--apamber':('"före"-stapel, varning i diagram','--ampy-warn'),
 '--apsignal-red':('fel, akut','--ampy-error'),'--apsignal-red-tint':('fel-/akut-bakgrund','--ampy-error-tint'),'--apamber-tint':('varnings-bakgrund','--ampy-warn-tint'),
 '--apverdict-green':('besked-accent + success-text','--ampy-success-ink'),'--apverdict-amber':('besked-accent + varningstext','--ampy-warn-ink'),'--apverdict-red':('besked-accent + akut-text','--ampy-error-ink'),'--apverdict-blue':('besked-accent info','--ampy-info-ink'),'--apgoogle-gold':('Google-stjärnor','(stjärnor, B12)')}
rows=[]
for t in l1:
    n=t['name']; hx=tohex(t['value']) if not n.startswith(('--apspace','--aptext','--apradius','--apshadow','--apcolumns','--apmin','--apmax','--aphero','--appost','--apnav','--apheader','--apbtn','--apcard','--apfooter')) else None
    if not hx: continue
    base=re.sub(r'-\d+$','',n); alfa=re.search(r'-(\d+)$',n)
    f=idx.get(hx,{}); r=ROLL.get(base,('(alfa-variant)','(alfa-variant)'))
    rows.append(dict(namn=n, hex=hx if not alfa else f"{hx} @ .{alfa.group(1).zfill(2) if len(alfa.group(1))==1 else alfa.group(1)}", lager='1', roll=r[0] if not alfa else f'alfa {alfa.group(1)} % av {base}', antal_kallor=f.get('antal_kallor',0) if not alfa else None, auk1=f.get('auk1',[]) if not alfa else None,
                     kontrast_vit=cr(hx,'#ffffff') if not alfa else None, kontrast_midnight=cr(hx,'#090b32') if not alfa else None, kontrast_skymist=cr(hx,'#f5f9ff') if not alfa else None, semantik=r[1] if not alfa else '(alfa)'))
for n,hx in TILLAGG:
    f=idx.get(hx,{}); r=TROLL[n]
    rows.append(dict(namn=n, hex=hx, lager='1c', roll=r[0], antal_kallor=f.get('antal_kallor',0), auk1=f.get('auk1',[]), kontrast_vit=cr(hx,'#ffffff'), kontrast_midnight=cr(hx,'#090b32'), kontrast_skymist=cr(hx,'#f5f9ff'), semantik=r[1]))
DRIFT=[
 dict(grupp='Navy i sju värden', varden=['#090b32 (--apmidnight-blue, 29 källor)','#0f123c (hero-1/website-blocks/LED/EV/mini-menu/rot-gt, 7)','#0b1030 (thank-you/booking/offer, 3)','#090c34 (main-cta, Bricks --color-3)','#1b1d4b (rot-gt-panel/hero-2 Z, Bricks --color-18)','#16183f, #17204a (hero-2 Z-kort/navy-soft)','#00011e/#01021f/#010033 (footer), #0b0f30→#2d516d (testimonials), #0d1350…#05061f (mini-menu aurora)'], kanon='--apmidnight-blue #090b32 för ALLA mörka ytor och allt bläck', byts_ut='#0f123c → midnight (near-miss, 6 enheter); #0b1030 → midnight; #090c34 → midnight; rot-gt/hero-2 Z-panel #1b1d4b → midnight (eller --ampy-bg-dark-glow); testimonials-gradient → midnight + glöd (B9); footer-gradient → midnight (B-lista: footer riktning)'),
 dict(grupp='Fem tealer (plus fem till)', varden=['#00a991 teal-core (25)','#5eb1bf brandbokens sekundärteal (17)','#007a69 elcentral/elkollen "strong" (2 auk 1)','#007d6b EV','#00806e/#00b89e/#00c4a7/#19c39e energycalc','#0a8f7c/#0a6e58 eljour-familjen (4/3)','#016a5d/#017666/#018271 CRM-flödet','#1cc4af LED/main-form (oanvänd)','#008d79 header hover','#00a88f Bricks --color-15 (footer 5.0)'], kanon='TVÅ tealer: --apteal-core (accent, aldrig text) + --apteal-deep #007a69 (text, länk, solid knapp med vit text). --apsecondary-teal #5eb1bf bara som gradientslut/ring (aldrig text, 2,47:1).', byts_ut='alla mörka tealer → --apteal-deep; #00c4a7 (teal på mörkt) → --apteal-core (6,41:1 på midnight räcker); #1cc4af → bort; #00a88f → --apteal-core; hover → --ampy-action-hover #008d79'),
 dict(grupp='#0b1030-bläcket och de andra bläcken', varden=['#0b1030 + rgba(11,16,48,.62/.44) (thank-you, booking, offer)','#0f123c (7)','#1f1f1f live ROT h2 (--color-8)','#1e1e1e (energycalc, rot-gt rubrik, footer h3)','#363636 live body (Bricks-default)','#333 (rot-gt p, booking, hero-2 input)','#3b3f59 eljour-familjen','#171717/#4d4d4d/#6a6a6a main-form (Svea)','#1a1d2e article'], kanon='--ampy-ink = midnight; --ampy-ink-body = midnight (B3); --ampy-ink-muted = #565e82; --ampy-ink-faint = #6a7190', byts_ut='#0b1030/#0f123c/#1f1f1f/#1e1e1e/#171717 → --ampy-ink; #363636/#333/#3b3f59/#4d4d4d/#1a1d2e → --ampy-ink-body (B3); rgba(11,16,48,.62)/#5f6480/#5a5d7a/#51607a/#6a6a6a → --ampy-ink-muted; #646b88/#686b80/#8a8da5 → --ampy-ink-faint'),
 dict(grupp='Dämpad text (muted) i sex värden', varden=['#565e82 (8: header, LED, EV, mini-menu, rot-gt, booking)','#5f6480 (3: eljour, foto, sticky)','#5a5d7a (2: elkollen, elcentral)','#51607a energycalc','rgba(11,16,48,.62) thank-you','rgba(9,11,50,.72) var-process'], kanon='--apnavy-muted #565e82 (6,33:1)', byts_ut='de andra fem → --ampy-ink-muted'),
 dict(grupp='Hairlines i nio värden', varden=['#e6ecf6 (eljour-familjen)','#dbe4f0 (header)','#e3e5ed/#ebedf3 (elkollen/elcentral)','rgba(15,18,60,.12) (LED-kitet)','rgba(9,11,50,.14) (var-process)','rgba(11,16,48,.09/.16/.48) (booking)','#eaeef5 (fore-efter)','#e1e8f4/#d7deeb/#dbe4f2/#eef2f9/#e3e9f5 (energycalc)','#d5d5dc (drawer)'], kanon='--ampy-line rgba(9,11,50,.14) (dekorativ) + --ampy-line-strong rgba(9,11,50,.48) (kontrollkant ≥3:1)', byts_ut='alla solida hairlines → --ampy-line; fältkanter #e3e5ed (1,26:1) → --ampy-line-strong'),
 dict(grupp='Fel/varning: sex röda, tre amber, tre gröna', varden=['röd: #b3261e (3), rgb(214,76,76) LED/EV (2, 4,2:1), rgb(214,64,64) elkollen, #e00000 main-form, #e5484d/#e24b4a hero-2, #ff8a8a energycalc, teal (hero-2-form)','amber: #f0af38 LED/EV, #f0b429 energycalc, #f5af19 elkollen/elcentral, #e3a008 eljour-prick, #8a6116 booking','grön: #39c281 emerald (9), #1f9d6b main-form, rgb(54,178,92)/rgb(27,132,71) elkollen, #1bd365/#00ad48 testimonials, #0f6e56 elcentral/elkollen text'], kanon='--ampy-error #b3261e (6,54:1), --ampy-error-ink #7a1623; --ampy-warn #f0af38 (diagram/mörkt), --ampy-warn-ink #876507; --ampy-success #39c281 (fyllning), --ampy-success-ink #0f6e56', byts_ut='LED/EV rgb(214,76,76) → #b3261e (4,2:1 underkänd som text); hero-2-form fel-i-teal → #b3261e; testimonials #1bd365/#00ad48 → --apemerald-flow; energycalc #f0b429 → --apamber'),
 dict(grupp='Kortskuggor i fem familjer', varden=['rgba(190,190,190,.19/.14/.4) "husets" (live, testimonials, main-cta, var-process)','rgba(15,18,60,.06/.08/.14) LED-kitet','rgba(9,11,50,…) eljour-familjen, fore-efter, certificates, thank-you, visste, mini-menu','rgba(11,13,42,.04/.07/.10) elkollen/elcentral','rgba(11,16,48,…) booking; rgba(181,181,181,.14) hero-2-form; rgba(241,241,241,.25) picasso-glöd'], kanon='EN skuggfärg: midnight-alfa. --ampy-shadow-card 0 10px 30px rgba(9,11,50,.07); -raised 0 16px 40px .14; -subtle 0 1px 2px .06', byts_ut='alla gråa (190/181/241) och near-miss-navyer (15,18,60 / 11,13,42 / 11,16,48) → rgba(9,11,50,x). Beslut B10 om husets grå skugga.'),
 dict(grupp='Gradienter: 14 → 2', varden=['120° #55ff9a→#5eb1bf (handling, 10+)','120° #b6f2ff→#5eb1bf (ring)','ljus aurora (thank-you/booking/offer)','282.84° #55ff9a→#00ffda (hero-2-form)','135° #00b89c→#018271 (thank-you knapp)','100° #009e88→#17c6a0 (main-form knapp)','146° #055a4b→#0a8169 (eljour nödknapp)','145° #c7f5ff→#5eb1bf (live ROT hover)','90° #090b32→#5eb1bf (certificates)','−51° #70becb→#bbf5ff→#b6f2ff (prefooter)','−17° #00011e→#090b32 (footer)','−27° #0b0f30→#2d516d (testimonials-kort)','GT-rubrik #1f1f1f→#57ff9a→#33995c; main-cta text hsl(171 95% 41%)→#5eb1bf; main-form rubrik #12b09a→#55d199','92°/135° article (#326afd→#55ff9a)'], kanon='--ampy-action-gradient (120° neon-mint → sekundärteal, med ring-varianten) + --ampy-aurora-light. Allt annat = drift.', byts_ut='knapp-gradienterna i hero-2-form/thank-you/main-form → --ampy-action-gradient; textgradienter → bort (ägaren ogillar gradienttext); nödknappen → --apteal-deep solid (B6); certificates/footer/testimonials-ytor → midnight (+ glöd)'),
 dict(grupp='Cobalt och lime (brandbok) vs teal (produktion)', varden=['#326afd cobalt: 0 i live, 73 i artikelmallen (Tailwind electric)','#92ec47 lime: 0 överallt','#00a991 teal-core: saknas i brandboken'], kanon='teal (ägarbeslut 2026-07) — se B1', byts_ut='artikelmallens electric #326afd → --apteal-deep (länkar) / --apteal-core (accent)'),
]
json.dump(dict(metod='farg-frekvens.json (01) + kontrast (04) + kanonmappning; kontrast = WCAG mot vit/midnight/sky-mist', primitiva=rows, drift=DRIFT), open(os.path.join(K,'farg.json'),'w'), ensure_ascii=False, indent=1)
with open(os.path.join(K,'farg.md'),'w') as w:
    w.write('# Färg: kanon, källor, kontrast, drift\n\nUnderlag: `_probes/out/farg-frekvens.json` (682 färgrader ur 30 JSON, 257 unika), `_probes/out/kontrast.json`. Antal = antal KÄLLOR som bär färgen (inte förekomster). Semantik = vilken `--ampy-*`-roll som pekar på primitiven.\n\n## Primitiva färger (lager 1 = live verbatim, lager 1c = tillägg med ≥2 källor auk 1–2)\n\n| token | hex | lager | roll(er) | källor | auk 1 | mot vit | mot sky-mist | mot midnight | semantik |\n|---|---|---|---|---|---|---|---|---|---|\n')
    for r in rows:
        if r['antal_kallor'] is None: continue
        w.write(f"| `{r['namn']}` | {r['hex']} | {r['lager']} | {r['roll']} | {r['antal_kallor']} | {len(r['auk1'])} | {r['kontrast_vit']} | {r['kontrast_skymist']} | {r['kontrast_midnight']} | {r['semantik']} |\n")
    w.write('\nAlfa-serierna (`--apmilk-white-5…90`, `--apdarkest-black-5…90`, `--appure-black-5…90`, 30 tokens) ligger i lager 1 verbatim; ingen källa använder dem (blocken skriver egna rgba(255,255,255,x)/rgba(9,11,50,x)). Se `--ampy-on-dark-*` för de alfa-steg som faktiskt används (.92/.66/.55/.14/.06).\n\n')
    w.write('## Semantisk mappning (lager 2)\n\n| roll | token | värde | kommentar |\n|---|---|---|---|\n')
    for roll,tok,val,kom in [('sidyta','--ampy-bg-page','--apsky-mist','21 källor'),('kort','--ampy-bg-surface','--appure-white','26 källor'),('subtil yta','--ampy-bg-subtle','--apsky-mist','"två ytor"-regeln (fotobedomningen, energycalc)'),('mörk yta','--ampy-bg-dark','--apmidnight-blue','+ --ampy-bg-dark-glow (LED-receptet) — B9'),('glas','--ampy-bg-glass','rgba(255,255,255,.72) + blur(16px)','thank-you — B15'),
        ('bläck','--ampy-ink','--apmidnight-blue','rubriker, strong'),('brödtext','--ampy-ink-body','--apmidnight-blue','B3'),('dämpad','--ampy-ink-muted','--apnavy-muted #565e82','6,33:1'),('svag','--ampy-ink-faint','--apnavy-faint #6a7190','4,80:1'),('text på gradient','--ampy-ink-on-action','--apindigo #282a53','5,51:1 på #5eb1bf'),
        ('accent','--ampy-action','--apteal-core','aldrig som text (2,96:1)'),('text/solid','--ampy-action-strong','--apteal-deep #007a69','5,27:1'),('hover','--ampy-action-hover','#008d79','header'),('handlingsgradient','--ampy-action-gradient','120° #55ff9a → #5eb1bf','CTA-website'),('ring-gradient','--ampy-action-gradient-ring','120° #b6f2ff → #5eb1bf','CTA-website'),
        ('success','--ampy-success / -ink / -tint','#39c281 / #0f6e56 / rgba(57,194,129,.12)',''),('varning','--ampy-warn / -ink / -tint','#f0af38 / #876507 / #fff4e0','warn scopad till diagram/besked'),('fel','--ampy-error / -ink / -tint','#b3261e / #7a1623 / #fdeceb','B13'),('info','--ampy-info-ink','#0d568c',''),('fokus','--ampy-focus / -on-dark / -ring','#090b32 / #55ff9a / 0 0 0 3px rgba(0,122,105,.9)','B14'),
        ('linje','--ampy-line / -strong','rgba(9,11,50,.14) / .48','kontrollkant ≥3:1')]:
        w.write(f'| {roll} | `{tok}` | {val} | {kom} |\n')
    w.write('\n## Driftlistan — vad som byts ut var\n\n')
    for d in DRIFT:
        w.write(f"### {d['grupp']}\n\n- Uppmätt: " + ' · '.join(d['varden']) + f"\n- **Kanon:** {d['kanon']}\n- **Byts ut:** {d['byts_ut']}\n\n")

# ---------------- TYPOGRAFI ----------------
tm=json.load(open(os.path.join(OUT,'typ-matris.json')))
def px(tok):
    return {w: smoke[str(w)]['px'].get(tok) for w in (390,768,1440)}
TYP=[
 ('display','--ampy-text-display','clamp(36px, 4.6vw, 60px)',700,'1.07','-0.018em','hero-1 (assets/style.css:38-46 .hero__h1) = live site-css .home-hero__heading','hero-2-alternatives 34/40/48·700·1.07·-.008em; elcentral rail-h1 44/700; elkollen hero-h1 40/600; energycalc anchor 52/900; article 48/800; --aptext-4xl 35.9→60'),
 ('h1','--ampy-text-h1','clamp(30px, 1.88vw + 24px, 48px) (= --aptext-3xl)',700,'1.07','-0.015em','hero-2-alternatives (primitives 2b, 48 ≥1200) + article 48 + booking 46/600 + elcentral 44/700','elkollen 40/600/1.18; thank-you h1 40/500 (--aptext-2-5xl); theme-style h1 = --aptext-4xl 60 (refereras ej)'),
 ('h2','--ampy-text-h2','clamp(26px, 1.04vw + 22.7px, 36px) (= --aptext-2xl)',500,'1.2','-0.01em','eljour-block (index.html:33 36/500/1.15/-.015) + testimonials V1 (--aptext-2xl 400/1.15/-.01) + certificates v2 (400/1.2/-.01) + rot-gt (450/1.2/-.01) + visste-du-att (500/1.2) + fotobedomningen (36/500) + mini-menu (38/500/1.2/-.01)','32/400 (--aptext-xl: live ROT/GT, fore-efter, footer h3, elcentral block, testimonials live); 40/500 (--aptext-2-5xl: temats default, main-cta, var-process); 30/700 article; theme lh 1.4'),
 ('h3','--ampy-text-h3','clamp(20px, 0.21vw + 19.3px, 22px) (= --aptext-ml)',600,'1.25','-0.01em','live ROT/GT-steg (--aptext-ml/--aptext-mmm 22/400) + elkollen (--fs-22 600) + var-process (22/500) + testimonials namn (22/600)','rot-gt 19→23/450; energycalc 20/500; booking 24/600; elcentral q-title 32/600 (PJS); live mobil lh 1'),
 ('lead','--ampy-text-lead','clamp(17px, 1.55vw, 22px)',400,'1.58','normal','hero-1 (assets/style.css:48-55 .hero__sub) = live .home-hero__text','hero-2 16/17/20·400·1.6; elcentral 20/18 400 1.6; elkollen 20/16; 18/300 (testimonials subline, certificates, visste); 18.5/300 mini-menu; 18/200 main-form'),
 ('body','--ampy-text-body','clamp(16px, 0.21vw + 15.3px, 18px) (= --aptext-m)',300,'1.5','normal','live (.rot__text-basic --aptext-m 18/300, .brxe-post-content) + testimonials V1 (300/1.5) + certificates (300/1.55) + rot-gt ("paragrafstandard = --aptext-m, 300, 1.5") + main-cta + visste-du-att + fore-efter tagline','live body-element = --aptext-sm 16/300/1.7 (#363636); eljour 17/400/1.6; var-process 17/300/1.5; mini-menu 19/400; LED 19/400; thank-you 18/400; booking 16/400; main-form 16/400; article 18/400/1.7'),
 ('small','--ampy-text-small','clamp(14px, 0.21vw + 13.3px, 16px) (= --aptext-sm)',400,'1.5','normal','live theme-style body/.bricks-button/footer-länkar (--aptext-sm) + thank-you (betyg/ghost) + testimonials badge + elkollen (16 knapp/input, 15 sekundär, 14 meta)','hero-1 proof 14.5/13.5; elcentral 13–15; fotobedomningen 15 (golv); testimonials datum --aptext-xs 12→10.1 (defekt)'),
 ('eyebrow','--ampy-text-eyebrow','12px (fast)',600,'1.5','0.14em uppercase','energycalc (--ty-eyebrow 12/500/.14em) + thank-you cta-eyebrow (12/600/.14em) + offer (12/600/.14em) + booking (12/700/.12em) + elcentral (12/600/.06em)','header 12.5/600/.14em; rot-gt caps 13/700/.12em; LED tier 15/600/.08em; fotobedomningen 15/600/.02em; visste kicker 24/500 (--aptext-l); article 10–15/700–800/.2em'),
 ('number','--ampy-text-number','clamp(38px, 1.989vw + 30.54px, 56px)',700,'1','-0.03em tabular-nums','led-kalkylator (styles.css:295 hero-number --fs-4xl, PJS 700) → Outfit','energycalc anchor 52/35.7 Outfit 900 (-.02em); EV/battery avsett 75 (bugg → 38.7/44); LED trio 28/700; rot-gt total 20→24/700; booking 26→30/700'),
 ('label','--ampy-text-label','14px (fast)',600,'1.4','normal','hero-2-alternatives (primitives:488 14/600 lh 20) + elkollen (--fs-14 600) + main-form (14/500)','LED 15/600 (PJS); elcentral 13/600; booking 13.5/600; fotobedomningen 15/500; energycalc 12/400; hero-2-form 13–14/400'),
 ('button','--ampy-text-button','16px (fast)',500,'1','normal','cta-website (*.css:13 16px/500/lh 1) = main-cta, rot-gt, fotobedomningen; live .bricks-button (--aptext-sm/500/ls .5px); picasso (--aptext-sm/400)','hero-1 15.5/15 mobil; header-CTA 16/600; elcentral/LED 15/600; EV 17/600; hero-2 ampy-btn 17/600; energycalc 18/500; hero-2 Z submit 19/600; mini-menu pill 16/700'),
]
typ=[]
for roll,tok,size,wt,lh,ls,src,drift in TYP:
    p=px(tok); typ.append(dict(roll=roll, token=tok, font='Outfit', size=size, px_390=p[390], px_768=p[768], px_1440=p[1440], weight=wt, lh=lh, ls=ls, kalla=src, drift=drift))
matris=tm['matris']; roles=tm['roller']
json.dump(dict(metod='kanon = KONSOLIDERINGSBRIEF-precedens + typ-matris.json (02) frekvens; px mätta i Chromium (06-smoke-matt.mjs)', roller=typ, vikter=dict(display=700,heading=500,strong=600,medium=500,ui=400,body=300), matris_kalla_x_roll=matris, frekvens=tm['frekvens']), open(os.path.join(K,'typografi.json'),'w'), ensure_ascii=False, indent=1)
with open(os.path.join(K,'typografi.md'),'w') as w:
    w.write('# Typografi: roller, kanon, källor, matris\n\nUnderlag: `_probes/out/typ-matris.json` (401 typografirader ur 30 JSON, 267 klassade till 11 roller), px mätta i Chromium på `system/_smoke.html` (`_probes/out/smoke-matt.json`). Ett typsnitt: **Outfit** (brandbok s.13 + live + 24 källor). Plus Jakarta Sans (LED/EV/battery/elcentral rubriker, footer "5.0") och JetBrains Mono (kalkylatorernas inputsiffror) är drift → beslut B7.\n\n## Kanon per roll\n\n| roll | token | storlek (px-clamp) | px 390 / 768 / 1440 | vikt | lh | ls | källa | drift (uppmätt i andra källor) |\n|---|---|---|---|---|---|---|---|---|\n')
    for t in typ: w.write(f"| **{t['roll']}** | `{t['token']}` | `{t['size']}` | {t['px_390']} / {t['px_768']} / {t['px_1440']} | {t['weight']} | {t['lh']} | {t['ls']} | {t['kalla']} | {t['drift']} |\n")
    w.write('\nVikter: `--ampy-w-display` 700 · `--ampy-w-heading` 500 (h2) · `--ampy-w-strong` 600 (h3, etiketter) · `--ampy-w-medium` 500 (knappar) · `--ampy-w-ui` 400 · `--ampy-w-body` 300. Brandbokens Black 900 används i inget byggt block utom energycalcs anchor-siffra → beslut B2.\n\nRadavstånd: display/h1 1.07 · h2 1.2 · h3 1.25 · lead 1.58 · body 1.5 · UI 1.4 · knapp/siffra 1. Spärrning: display −.018em · rubrik −.01em · siffra −.03em · eyebrow +.14em.\n\n')
    w.write('## Frekvens per roll (antal källor auk 1–2 som delar värdet)\n\n| roll | vikt | lh | px@1440 | ls |\n|---|---|---|---|---|\n')
    for ro in roles:
        f=tm['frekvens'][ro]; fmt=lambda l: ', '.join(f'{k}×{v}' for k,v in l[:5])
        w.write(f"| {ro} | {fmt(f['vikt'])} | {fmt(f['lh'])} | {fmt(f['px1440'])} | {fmt(f['ls'])} |\n")
    w.write('\n## Matris källa × roll (första uppmätta raden per roll: px@1440/px@390 · vikt · lh · font)\n\n| källa | '+' | '.join(roles)+' |\n|---|'+'---|'*len(roles)+'\n')
    order=sorted(matris, key=lambda s:(ff['auktoritet'].get(s,3), s))
    for s in order:
        cells=[]
        for ro in roles:
            l=matris[s].get(ro)
            if not l: cells.append(''); continue
            r=l[0]; cells.append(f"{r['px_desktop'] or '?'}/{r['px_mobil'] or '?'} {r['weight']} {r['lh']} {(r['font'] or '').split(' ')[0]}")
        w.write(f"| {s} ({ff['auktoritet'].get(s,3)}) | "+' | '.join(cells)+' |\n')
    w.write('\nOklassade rader (134 st: kvittorader, chips, tabbar, tooltips m.m.) ligger i `_probes/out/typ-rader.json`.\n')

# ---------------- SPACING ----------------
sp=json.load(open(os.path.join(OUT,'spacing.json'))); cb=json.load(open(os.path.join(OUT,'container-breakpoints.json')))
AP=['--apspace-4xs','--apspace-3xs','--apspace-2xs','--apspace-xs','--apspace-s','--apspace-m','--apspace-l','--apspace-xl','--apspace-2xl','--apspace-3xl','--apspace-4xl']
skala=[]
for t in AP:
    p=px(t); ref=next((x for x in sp['apspace_referenser'] if x['token']==t), None)
    skala.append(dict(token=t, px_390=p[390], px_768=p[768], px_1440=p[1440], ampy=t.replace('--apspace','--ampy-space'), referenser=ref['antal'] if ref else 0, kallor=ref['kallor'] if ref else []))
ROLLER=[('sektion vertikalt','--ampy-space-section-y','2xl (79.2 / 34.8)','testimonials, visste-du-att, fore-efter, footer, certificates live (5; 3 auk 1)','xl 56 (certificates v2, prefooter, main-cta, elcentral, var-process); l 39.6 (theme .brxe-section); 64/28 eljour; 110/64 mini-menu; 60/0 main-form; 40/48 fotobedomningen'),
 ('sektion horisontellt / gutter','--ampy-space-section-x = --ampy-gutter','l (39.6 / 21.5)','theme-style .brxe-section, visste-du-att, footer','m 28 testimonials; 40/16 eljour/main-cta/elcentral; 28/16 header; 24 mini-menu/energycalc; 15/10 LED'),
 ('kortpadding','--ampy-space-card','m (28 / 16.9)','testimonials kort, eljour (28/20), live testimonials, certificates inner','20 LED input/EV; 32 elcentral/elkollen/energycalc; 40 LED resultat; 24 mini-menu/booking; 79 visste'),
 ('kortpadding stort','--ampy-space-card-lg','l (39.6 / 21.5)','LED resultatkort 40, energycalc ≥1200 40, var-process 40','56 GT (xl); 112 ROT (3xl); 52/56 thank-you'),
 ('stack xs','--ampy-space-stack-xs','2xs (9.9 / 8.3)','testimonials h2→subline, thank-you ghost, var-process 10 inom grupp',''),
 ('stack sm','--ampy-space-stack-sm','xs (14 / 10.5)','certificates h2→p, energycalc head→innehåll 16, hero-1 h1→lead 18',''),
 ('stack','--ampy-space-stack','s (19.8 / 13.3)','thank-you rubrik→ingress, visste innehållsgap, testimonials kortkropp, eljour inre gap 16','24 thank-you kort-gap; 20 var-process syskon'),
 ('stack lg','--ampy-space-stack-lg','l (39.6 / 21.5)','testimonials rubrikblock-mb, fore-efter h2-mb, eljour rubrik-mb 36, hero-1 lead→CTA 32','44 rot-gt H2-mb'),
 ('stack xl','--ampy-space-stack-xl','xl (56 / 27.3)','var-process zon 56','64 mini-menu head→grid; 79 visste grid-gap'),
 ('inline xs','--ampy-space-inline-xs','3xs (7 / 6.6)','footer li 7, testimonials meta 8, hero-1 proof g-row 9',''),
 ('inline sm','--ampy-space-inline-sm','2xs (9.9 / 8.3)','header nav-gap 10, main-form etikett→fält 8, LED gap 7.5–10',''),
 ('inline','--ampy-space-inline','xs (14 / 10.5)','cta-website gap 16/14, hero-1 proof-gap 14, footer row-gap 14',''),
 ('inline lg','--ampy-space-inline-lg','s (19.8 / 13.3)','live steg-grid gap, certificates kolumngap "≥ radien"',''),
 ('rutnätsgap','--ampy-space-gap','m (28 / 16.9)','fore-efter par-gap, live GT-grid, certificates 28, testimonials 24, mini-menu 30',''),
 ('rutnätsgap stort','--ampy-space-gap-lg','l (39.6 / 21.5)','main-cta 43, eljour 40, fotobedomningen 43.7','64 elcentral/elkollen shell; 56 var-process; 79 rot-gt/visste')]
json.dump(dict(metod='apspace-värden ur global-variables.css, px mätta i Chromium (06); roller = KONSOLIDERINGSBRIEF-precedens + spacing.json (03) referensfrekvens', skala=skala, roller=[dict(roll=a,token=b,varde=c,kalla=d,drift=e) for a,b,c,d,e in ROLLER], sektion_padding_per_kalla=sp['sektion_padding'], container=cb['container'], breakpoints=cb['breakpoints'], kanon_container='1280px (14 källor); fullbredd tillåten (ägardirektiv 2026-08-14)', kanon_breakpoints=[992,768,480], extra_breakpoints=[1200,560]), open(os.path.join(K,'spacing.json'),'w'), ensure_ascii=False, indent=1)
with open(os.path.join(K,'spacing.md'),'w') as w:
    w.write('# Spacing: apspace-skalan, sektionsrytm, kortpadding, gap, container, brytpunkter\n\nUnderlag: `_probes/out/spacing.json` (03), `_probes/out/container-breakpoints.json`, px mätta i Chromium (06). Djupanalysens verdikt: konsolidera på **befintliga apspace-värden, bygg inte om värdena** — lager 2 speglar dem i px (rem-oberoende).\n\n## Skalan (11 steg, live-värden; fix: 4xs)\n\n| ap-token | --ampy | px 390 | px 768 | px 1440 | refereras i (källor) |\n|---|---|---|---|---|---|\n')
    for s in skala: w.write(f"| `{s['token']}` | `{s['ampy']}` | {s['px_390']} | {s['px_768']} | {s['px_1440']} | {s['referenser']}: {', '.join(s['kallor'])} |\n")
    w.write('\n`--apspace-4xs` var trasig (min > max → 5.19 px fast); rättad till 4.9 → 5.2 px i tokens.css lager 1b.\n\n## Roller\n\n| roll | token | värde (px 1440 / 390) | källa | drift |\n|---|---|---|---|---|\n')
    for a,b,c,d,e in ROLLER: w.write(f'| {a} | `{b}` | {c} | {d} | {e} |\n')
    w.write('\n## Sektionsrytm per blocktyp (uppmätt padding-y, desktop / mobil)\n\n| källa | auk | värde | px desktop | px mobil | token |\n|---|---|---|---|---|---|\n')
    for r in sp['sektion_padding']: w.write(f"| {r['kalla']} | {r['auk']} | {r['varde']} | {r['px_desktop']} | {r['px_mobil']} | {r['token'] or ''} |\n")
    w.write('\n## Container\n\nKanon **1280 px** (`--container-width`, `--apmax-screen-width`, theme `.brxe-container`; 14 källor). Fullbredd är tillåten (ägardirektiv 2026-08-14: 1280 är inte ett tak) — hero-1 1700, hero-2 1424. Textmått `--ampy-container-text` 980 (legacy `--max-width`). Drift: 1320 mini-menu, 1360 energycalc, 1180 elkollen, 1100 live testimonials (Bricks-default), 1088 article, 780 booking, 520 thank-you.\n\n| källa | roll | värde |\n|---|---|---|\n')
    for c in cb['container'][:40]: w.write(f"| {c['kalla']} | {c['roll']} | {c['varde']} |\n")
    w.write('\n## Brytpunkter\n\nKanon **992 / 768 / 480** (som max-width: 991 / 767 / 479 — Bricks skriver 991/767/478). Föredra `@container` mot blockets egen bredd (hero-2-alternatives, EV, fore-efter, fotobedomningen, main-cta-leverans gör det). Extra steg som förekommer: 1200 (hero-1-band, energycalc, hero-2), 560 (hero-1/header/LED/EV mobil-fintrim).\n\n| px | källor |\n|---|---|\n')
    for b in cb['breakpoints'][:16]: w.write(f"| {b['px']} | {b['antal']}: {', '.join(b['kallor'])} |\n")

# ---------------- FORM / DJUP / RÖRELSE ----------------
rad=json.load(open(os.path.join(OUT,'radier.json'))); sk=json.load(open(os.path.join(OUT,'skuggor.json'))); ro=json.load(open(os.path.join(OUT,'rorelse.json')))
RAD=[('small','--ampy-radius-small','= --apradius-s 8→6.1','LED/EV/energycalc/elkollen/elcentral 6 (tooltip, tick, option, chip)','4 LED checkbox; 8 main-form input; 9 energycalc'),
 ('field','--ampy-radius-field','= --apradius-m 12→10.1','LED/EV/hero-2/fotobedomningen 12','10 elkollen/elcentral/hero-2 Z; 14 booking/hero-2-form; 8 main-form'),
 ('button','--ampy-radius-button','16px','cta-website + 16 källor (= legacy --radius/--radius-m)','live 20 (ROT) / 12 (GT); header 15; LED/EV/energycalc 12; elkollen/elcentral 10; hero-2 14; pill (thank-you, main-form, mini-menu) — B4'),
 ('card','--ampy-radius-card','= --apradius-l 20→16.3','live + LED/EV/energycalc/eljour/certificates/visste/fore-efter/foto/mini-menu/main-cta (17 källor)','14 elkollen/elcentral; 22 hero-ram/booking/rot-gt-panel; 27 hero-2-form; 15 main-form; 16 testimonials (legacy)'),
 ('card-lg','--ampy-radius-card-lg','= --apradius-xl 32→24.5','thank-you (--apradius-xl), rot-gt block 32, offer-accepted','hero-1 A-variant 32/28'),
 ('pill','--ampy-radius-pill','999px (= --apradius-full)','live, testimonials, thank-you, mini-menu, hero-2, fotobedomningen','99rem eljour; 9999px legacy/article')]
SK=[('subtle','--ampy-shadow-subtle','0 1px 2px rgba(9,11,50,.06)','LED/EV --shadow-sm (15,18,60 → midnight)','.04 elcentral/elkollen/foto/article'),
 ('card','--ampy-shadow-card','0 10px 30px rgba(9,11,50,.07)','eljour-block --shadow-card (= 0 1rem 3rem), fotobedomningen mittlager, eljour-sticky-bar hörnkort','"husets" 0 0 16px 0 rgba(190,190,190,.19) (live ×14, testimonials .14, main-cta .4, var-process); elcentral 0 8px 28px rgba(11,13,42,.07); booking 0 18px 44px .09; visste 0 1.2rem 4rem .18; tredelade (fore-efter .04/.06/.05, certificates .10/.10/.07, foto .04/.07/.10, mini-menu) — B10'),
 ('raised','--ampy-shadow-raised','0 16px 40px rgba(9,11,50,.14)','LED/EV/battery --shadow-lg (resultatkort, lista, tooltip; 15,18,60 → midnight) + sticky-bar 0 16px 40px .16','rot-gt 0 24px 50px -10px .18; thank-you 0 3rem 7rem .12; mini-menu 0 16px 40px -12px .28'),
 ('button','--ampy-shadow-button','inset 0 1px 0 rgba(255,255,255,.45), 0 2px 4px rgba(9,11,50,.06), 0 10px 26px -6px rgba(94,199,160,.45)','cta-website = rot-gt, fotobedomningen, hero-2','hero-1:s kopia (navy .40 i st.f. grön glöd); picasso/elkollen/elcentral 0 0 16px rgba(241,241,241,.25)'),
 ('button hover','--ampy-shadow-button-hover','inset 0 1px 0 rgba(255,255,255,.5), 0 3px 6px rgba(9,11,50,.07), 0 16px 34px -8px rgba(94,199,160,.55)','cta-website',''),
 ('ring-button','--ampy-shadow-button-ring','inset 0 1px 0 rgba(255,255,255,.55), 0 2px 4px rgba(9,11,50,.06), 0 10px 26px -6px rgba(94,177,191,.55)','cta-website = main-cta, eljour-sticky-bar',''),
 ('solid teal glow','--ampy-shadow-glow-action','0 4px 12px -5px rgba(0,169,145,.5)','header-CTA (hero-1/website-blocks)','thank-you 0 1rem 2.4rem .3; energycalc hover -.8rem .42; main-form .45'),
 ('photo','--ampy-shadow-photo','0 18px 40px -20px rgba(9,11,50,.26)','main-cta porträtt','hero-2 Z 0 28px 60px -28px rgba(0,0,0,.65)'),
 ('--apshadow-xs…xl (fixade)','--apshadow-*','0 1px 2px / 0 1.5px 3px / 0 2px 6px / 0 3px 12px / 0 6px 48px var(--shadow-primary)','global-variables.css + --shadow-primary rgba(9,11,50,.10) (thank-you v1)','var none på live (odefinierad --shadow-primary)')]
LINJER=[('hairline','--ampy-line','rgba(9,11,50,.14)','var-process (enda hairline), LED .12 (15,18,60), fore-efter/certificates inset .07','#e6ecf6 eljour-familjen, #dbe4f0 header, #e3e5ed/#ebedf3 elkollen/elcentral, energycalc fem värden'),('kontrollkant','--ampy-line-strong','rgba(9,11,50,.48) (3,39:1)','booking (WCAG 1.4.11)','#5f6480 fotobedomningen (5,8:1); #e3e5ed elkollen/elcentral inputs (1,26:1); 2px transparent main-form'),('på mörkt','--ampy-on-dark-line','rgba(255,255,255,.14)','LED hr, hero-2 --ap-hairline, EV','.12 energycalc; .16/.18 rot-gt')]
GLAS=[('ljust glaskort','--ampy-bg-glass + --ampy-glass-border + --ampy-glass-blur','rgba(255,255,255,.72) · 1px rgba(255,255,255,.9) · blur(16px) saturate(1.1) · inset 0 1px 0 rgba(255,255,255,.6)','thank-you v1 (auk 2)','offer-accepted .74 + blur 16; booking .85 UTAN blur; website-blocks go-cirkel .16 + blur 4 — B15'),('mörkt glas','--ampy-bg-glass-dark','rgba(9,11,50,.82) + blur(8px) saturate(150%) + 1px rgba(255,255,255,.16)','fore-efter chip/ledtråd','hero-2-form #090b32 + 156.51° → #5eb1bf .76 + blur 30 (underkänd av hero-2-alternatives)')]
GRAD=[('handlingsgradient','--ampy-action-gradient','linear-gradient(120deg, #55ff9a 0%, #5eb1bf 100%)','cta-website = hero-1, rot-gt, foto, hero-2, elkollen, elcentral, picasso, booking shared (10+)'),('ring-gradient','--ampy-action-gradient-ring','linear-gradient(120deg, #b6f2ff 0%, #5eb1bf 100%)','cta-website = main-cta, sticky-bar, hero-2 Z/E (141° i picasso/elkollen/elcentral)'),('ljus aurora','--ampy-aurora-light','4 radialer (teal .12/.08, crystal-blue .48, sublime-green .28) på sky-mist','thank-you = booking = offer'),('mörk glöd (ytbehandling)','--ampy-bg-dark-glow','radial teal .28 @90% -10% + emerald .16 @-10% 110%','LED = EV = battery; drift energycalc 3 radialer, visste-du-att teal .42 + neon .18')]
ORN=[('blixt (varumärkesglyf)','visste-du-att kicker (18 px solid blixt-SVG, "sanktionerat motiv"); brandbok s.3/16/18 (glyph, ikoner, former ur blixten/a:t); skill-reference bolt.svg (egen, ej byråns)','enda blocket i produktion som bär blixten; brandbokens ikonregel "solida" bryts överallt (linjeikoner stroke 1.6–3)'),
 ('vågor','live ROT programmatic-bg-overlay-blue.svg (80 % nere-höger) + GT Vector-2-2.svg (404); rot-gt-familjen tre hero-vågor #eef4fc/#e6eff9 masktonade; main-cta Vector-3 bg-våg 44 % + overlay-våg 50 %; certificates v2 tre inline-SVG-band (#b6f2ff .30 / #fff .26 / #8fd4e0 .44); hero-2 Z tre vågor; footer shape-divider (död)','ingen tokeniserad form; certificates-regeln "inline-SVG med preserveAspectRatio=none så den aldrig klipps" är den enda hållbara'),
 ('blobbar','rot-gt-panelen tre blobbar #0b0d2a/#010328 ("ur heron"); article LeadMagnet glow-blob','#010328 = livedefekt enligt hero-2 ("ALDRIG")'),
 ('aurora-hörn (SVG)','thank-you/offer/booking aurora-top/bottom.svg (crystal-blue/sublime-green → sky-mist; seafoam → teal)','bara CRM-/tack-flödet'),
 ('puls','header CTA pulse-dot (10 px mint, 1.6 s); ring-CTA ampyRing (2.8 s vit ring); eljour statuspill 2 s + mobil-CTA-puls; thank-you halo 4 s infinite','tre olika pulser; halo är enda oändliga animationen utanför chippen'),
 ('penseldragsringar','live ROT/GT handritade ring-SVG 95/55 px + JS-streckade connector-linjer #5eb1bf→#1d234e','ersatt i rot-gt-familjen av förloppsbåge (teal stroke 3)'),
 ('foto-veil','hero-1 --ampy-scrim-hero (98° .68→.02 + 0° .38→0); hero-2 scrim-bastant/-latt (kontrastmätta); main-form platt .55; energycalc trust 103° .94→.28; mini-menu radial .30→.56 + body-scrim','')]
MOT=[('fast','--ampy-dur-fast','160ms','cta-website (.16s) = hero-1, main-cta, rot-gt, foto, live hero-CTA (8)','150 LED/EV/elkollen/booking (9); 120 elcentral; 140 energycalc; 180 hero-2'),('base','--ampy-dur-base','200ms','header --t .2s ease-out (26 användningar) + thank-you, main-form, mini-menu, elkollen, elcentral (11)','220 energycalc/elcentral/booking; 240 elkollen; 280 mini-menu/main-form'),('slow','--ampy-dur-slow','300ms','LED slider/staplar, eljour --m, energycalc --t-slow, Bricks fadeIn 0.3 s (13); "tak 300 ms" (hero-2, foto)','350 testimonials; 400 rot-gt; 520/640 mini-menu'),('ease','--ampy-ease','cubic-bezier(.2,.6,.2,1)','live site-css --ease + mini-menu, energycalc, elcentral, elkollen, main-form, footer (7)','cubic-bezier(.2,0,.2,1) LED-kitet; cubic-bezier(.16,.84,.44,1) thank-you/booking; "ease" i CTA-shorthand'),('ease-out','--ampy-ease-out','cubic-bezier(.16,1,.3,1)','energycalc, mini-menu, main-form','ease-out (header); cubic-bezier(.33,1,.68,1) thank-you'),('lyft','--ampy-lift','translateY(-1.5px)','cta-website = hero-1, rot-gt, foto, main-cta','-1 picasso/elcentral/EV; -2 energycalc/certificates/thank-you; -4 mini-menu kort; 0 sticky-bar (aldrig på bottenremsa)'),('hover-filter','--ampy-hover-filter','saturate(1.06) brightness(1.02)','cta-website','saturate(1.08) ring; 1.05 picasso; brightness(1.06) main-form; opacity .92 LED/EV'),('reveal-stagger','(ej token)','40 → 260/280 ms i 40–60 ms-steg (LED/EV), 45 ms (energycalc/elcentral), 50–360 ms (mini-menu)','LED, EV, energycalc, elcentral, mini-menu','ingen kanon — mönster: reveal 300 ms opacity + 6–12 px translateY, staggat'),('reduced-motion','(base.css)','alla auk 1-källor nollställer animation + transition','hero-1, cta-website, LED, EV, energycalc, elcentral, elkollen, eljour, testimonials','article-template saknar (defekt)')]
json.dump(dict(metod='radier.json/skuggor.json/rorelse.json (03) + kanon; ordagranna värden ur källfilerna', radier=[dict(roll=a,token=b,varde=c,kalla=d,drift=e) for a,b,c,d,e in RAD], radier_frekvens=rad[:16], skuggor=[dict(roll=a,token=b,varde=c,kalla=d,drift=e) for a,b,c,d,e in SK], skuggfarg_tripletter=sk['skuggfarg_tripletter'], delade_skuggstrangar=sk['delade_strangar'], linjer=[dict(roll=a,token=b,varde=c,kalla=d,drift=e) for a,b,c,d,e in LINJER], glas=[dict(roll=a,token=b,varde=c,kalla=d,drift=e) for a,b,c,d,e in GLAS], gradienter=[dict(roll=a,token=b,varde=c,kalla=d) for a,b,c,d in GRAD], ornament=[dict(typ=a,var=b,not_=c) for a,b,c in ORN], rorelse=[dict(roll=a,token=b,varde=c,kalla=d,drift=e) for a,b,c,d,e in MOT], durations=ro['durations'], easings=ro['easings']), open(os.path.join(K,'form-djup-rorelse.json'),'w'), ensure_ascii=False, indent=1)
with open(os.path.join(K,'form-djup-rorelse.md'),'w') as w:
    w.write('# Form, djup, rörelse: radier, skuggor, linjer, glas, gradienter, ornament, rörelse\n\nUnderlag: `_probes/out/radier.json`, `skuggor.json`, `rorelse.json` (03). Alla värden ordagranna ur källfilerna; skuggfärgen är konsoliderad till midnight-alfa där källan hade en near-miss-triplett (15,18,60 / 11,13,42 / 11,16,48 → 9,11,50).\n\n## Radier per roll\n\n| roll | token | värde | källa | drift |\n|---|---|---|---|---|\n')
    for a,b,c,d,e in RAD: w.write(f'| {a} | `{b}` | {c} | {d} | {e} |\n')
    w.write('\nFrekvens (antal källor per radievärde): '+' · '.join(f"{r['px']} px ×{r['antal']}" for r in rad[:10])+'\n\n## Skuggor (ordagranna)\n\n| roll | token | värde | källa | drift |\n|---|---|---|---|---|\n')
    for a,b,c,d,e in SK: w.write(f'| {a} | `{b}` | `{c}` | {d} | {e} |\n')
    w.write('\nSkuggfärg-tripletter i källorna: '+' · '.join(f"rgb({t['rgb']}) ×{t['antal_forekomster']} i {len(t['kallor'])} källor" for t in sk['skuggfarg_tripletter'][:8])+'\n\n## Linjer\n\n| roll | token | värde | källa | drift |\n|---|---|---|---|---|\n')
    for a,b,c,d,e in LINJER: w.write(f'| {a} | `{b}` | {c} | {d} | {e} |\n')
    w.write('\n## Glas\n\n| roll | token | värde | källa | drift |\n|---|---|---|---|---|\n')
    for a,b,c,d,e in GLAS: w.write(f'| {a} | `{b}` | {c} | {d} | {e} |\n')
    w.write('\n## Gradienter (kanoniska två + ytbehandling) — allt annat är drift (se farg.md driftlistan "14 → 2")\n\n| roll | token | värde | källa |\n|---|---|---|---|\n')
    for a,b,c,d in GRAD: w.write(f'| {a} | `{b}` | `{c}` | {d} |\n')
    w.write('\n## Ornament (var de används)\n\n| typ | var | notering |\n|---|---|---|\n')
    for a,b,c in ORN: w.write(f'| {a} | {b} | {c} |\n')
    w.write('\n## Rörelse\n\n| roll | token | värde | källa | drift |\n|---|---|---|---|---|\n')
    for a,b,c,d,e in MOT: w.write(f'| {a} | `{b}` | {c} | {d} | {e} |\n')
    w.write('\nDurations i källorna: '+' · '.join(f"{d['ms']} ms ×{d['antal']}" for d in ro['durations'][:10])+'. Easings: '+' · '.join(f"`{e['easing']}` ×{e['antal']}" for e in ro['easings'][:6])+'.\n')
print('skrev farg/typografi/spacing/form-djup-rorelse (.md + .json)')
