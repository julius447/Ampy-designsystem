#!/usr/bin/env python3
"""04 · WCAG-kontrast för kandidatfärgerna mot vit (#ffffff), sky-mist (#f5f9ff) och midnight (#090b32).
Kör: python3 konsolidering/_probes/04-kontrast.py → out/kontrast.json + .md
"""
import json, os
OUT=os.path.join(os.path.dirname(__file__),'out')
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return round((hi+0.05)/(lo+0.05),2)
def blend(fg,alpha,bg):
    fg=fg.lstrip('#'); bg=bg.lstrip('#')
    out=''.join('%02x'%round(int(fg[i:i+2],16)*alpha+int(bg[i:i+2],16)*(1-alpha)) for i in (0,2,4))
    return '#'+out
C={
 'midnight #090b32':'#090b32','teal-core #00a991':'#00a991','teal-deep #007a69 (elcentral/elkollen)':'#007a69','teal #007d6b (EV)':'#007d6b','teal #00806e (energycalc)':'#00806e',
 'teal #0a8f7c (hero-2/eljour focus)':'#0a8f7c','teal #0a6e58 (eljour pill)':'#0a6e58','teal #016a5d (booking)':'#016a5d','teal #018271 (thank-you)':'#018271','teal-hover #008d79 (header)':'#008d79',
 'secondary-teal #5eb1bf':'#5eb1bf','emerald #39c281':'#39c281','neon-mint #55ff9a':'#55ff9a','indigo #282a53 (CTA-text)':'#282a53','ink #0d0d0d (elkollen CTA-text)':'#0d0d0d',
 'navy-ink #3b3f59 (eljour body)':'#3b3f59','navy-muted #565e82 (header/LED muted)':'#565e82','navy-muted #5f6480 (eljour soft)':'#5f6480','#5a5d7a (elkollen secondary)':'#5a5d7a',
 'faint #6a7190 (header)':'#6a7190','faint #646b88 (booking)':'#646b88','faint #686b80 (elkollen tertiary)':'#686b80','faint #8a8da5 (elcentral tertiary)':'#8a8da5',
 'body #363636 (live Bricks)':'#363636','body #333333 charcoal':'#333333','darkest-black #1e1e1e':'#1e1e1e','#0f123c (near-miss midnight)':'#0f123c',
 'error #d64c4c (LED/EV)':'#d64c4c','error #d64040 (elkollen)':'#d64040','error #b3261e (eljour/foto)':'#b3261e','verdict-red #7a1623':'#7a1623','error #e5484d (hero-2)':'#e5484d','error #e00000 (main-form)':'#e00000',
 'amber #f0af38 (LED)':'#f0af38','amber #f0b429 (energycalc)':'#f0b429','verdict-amber #876507':'#876507','verdict-green #0f6e56':'#0f6e56','verdict-blue #0d568c':'#0d568c',
 'google-gold #fbbc04':'#fbbc04','gold #f6b53d (thank-you)':'#f6b53d','line #e6ecf6':'#e6ecf6','line #dbe4f0':'#dbe4f0','line #e3e5ed':'#e3e5ed',
}
bgs={'vit':'#ffffff','sky-mist':'#f5f9ff','midnight':'#090b32','teal-core':'#00a991','secondary-teal':'#5eb1bf','teal-deep':'#007a69'}
rows=[]
for name,h in C.items():
    rows.append(dict(namn=name, hex=h, **{('mot_'+k):cr(h,v) for k,v in bgs.items()}))
alpha=[('midnight .72 på vit', blend('#090b32',.72,'#ffffff')),('midnight .62 på vit', blend('#090b32',.62,'#ffffff')),('midnight .48 på vit (kant)', blend('#090b32',.48,'#ffffff')),
       ('midnight .14 på vit (hairline)', blend('#090b32',.14,'#ffffff')),('midnight .12 på vit (hairline)', blend('#090b32',.12,'#ffffff')),('vit .92 på midnight', blend('#ffffff',.92,'#090b32')),
       ('vit .82 på midnight', blend('#ffffff',.82,'#090b32')),('vit .66 på midnight', blend('#ffffff',.66,'#090b32')),('vit .55 på midnight', blend('#ffffff',.55,'#090b32')),('vit .42 på midnight', blend('#ffffff',.42,'#090b32'))]
arows=[]
for name,h in alpha:
    bg='#ffffff' if 'på vit' in name else '#090b32'
    arows.append(dict(namn=name, blandad=h, kontrast=cr(h,bg)))
json.dump(dict(metod='WCAG 2.x relativ luminans, sRGB; alfa-värden blandade mot underlaget först', solida=rows, alfa=arows), open(os.path.join(OUT,'kontrast.json'),'w'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT,'kontrast.md'),'w') as w:
    w.write('# Kontrast (WCAG)\n\n| färg | hex | vit | sky-mist | midnight | på teal-core | på #5eb1bf | på teal-deep |\n|---|---|---|---|---|---|---|---|\n')
    for r in rows: w.write(f"| {r['namn']} | {r['hex']} | {r['mot_vit']} | {r['mot_sky-mist']} | {r['mot_midnight']} | {r['mot_teal-core']} | {r['mot_secondary-teal']} | {r['mot_teal-deep']} |\n")
    w.write('\n| alfa-blandning | blandad hex | kontrast |\n|---|---|---|\n')
    for r in arows: w.write(f"| {r['namn']} | {r['blandad']} | {r['kontrast']} |\n")
print(open(os.path.join(OUT,'kontrast.md')).read())
