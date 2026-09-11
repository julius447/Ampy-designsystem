#!/usr/bin/env python3
"""01 · Färgfrekvens över alla 30 inventerings-JSON.
Läser inventering/*.json, plockar varje färg ur `farger[].hex` (+ offer_accepted-sektionen),
normaliserar hex/rgb/hsl → #rrggbb (alfa sparas separat), och räknar i hur många KÄLLOR
färgen förekommer, viktat per auktoritet. Skriver out/farg-frekvens.json + .md.
Kör: python3 konsolidering/_probes/01-farg-frekvens.py
"""
import json, glob, os, re, colorsys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
INV = os.path.join(ROOT, 'inventering')
OUT = os.path.join(os.path.dirname(__file__), 'out')

AUTH = {  # auktoritet per källa (INVENTERINGSBRIEF + JSON)
 'live-ampy-se':1,'hero-1':1,'website-blocks':1,'cta-website':1,'led-kalkylator':1,'ev-kalkylator':1,
 'energycalc':1,'elcentral-kollen':1,'elkollen':1,'eljour-block':1,'testimonials-block':1,'brandbook':1,
 'footer-cro':1,'rot-gt-cro':1,  # baslinje/klon = 1 (familjen = 2, markeras via lager)
 'main-cta':2,'hero-2-alternatives':2,'hero-2-form':2,'mini-menu':2,'certificates':2,'eljour-sticky-bar':2,
 'fore-efter-cro':2,'fotobedomningen':2,'main-form':2,'thank-you':2,'booking-confirmation':2,
 'article-template':2,'visste-du-att':2,
 'var-process-cro':3,'battery-calculator':3,'picasso':3,'offer-accepted':3,
}
HEX = re.compile(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b')
RGB = re.compile(r'rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)\s*(?:[,/]\s*(\.?\d*\.?\d+))?\s*\)')
HSL = re.compile(r'hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)')

def norm_hex(h):
    h=h.lower()
    if len(h)==3: h=''.join(c*2 for c in h)
    return '#'+h

def extract(s):
    """returns list of (hex, alpha|None)"""
    found=[]
    for m in HEX.finditer(s): found.append((norm_hex(m.group(1)), None))
    for m in RGB.finditer(s):
        r,g,b=int(m.group(1)),int(m.group(2)),int(m.group(3)); a=m.group(4)
        found.append(('#%02x%02x%02x'%(r,g,b), float(a) if a else None))
    for m in HSL.finditer(s):
        h,sat,l=int(m.group(1))/360,int(m.group(2))/100,int(m.group(3))/100
        r,g,b=colorsys.hls_to_rgb(h,l,sat)
        found.append(('#%02x%02x%02x'%(round(r*255),round(g*255),round(b*255)), None))
    return found

def walk(src, entries, lager=None):
    rows=[]
    for e in entries:
        hexs=e.get('hex') or ''
        if not isinstance(hexs,str): continue
        roll=e.get('roll') or ''
        tok=e.get('token')
        lg=e.get('lager') or lager
        for hx,a in extract(hexs):
            rows.append(dict(kalla=src, hex=hx, alfa=a, roll=roll[:140], token=tok if isinstance(tok,str) else None, lager=lg, fil=e.get('kalla_fil')))
    return rows

rows=[]
for f in sorted(glob.glob(os.path.join(INV,'*.json'))):
    d=json.load(open(f)); src=d.get('kalla') or os.path.basename(f)[:-5]
    rows+=walk(src, d.get('farger',[]))
    if 'offer_accepted' in d:
        rows+=walk('offer-accepted', d['offer_accepted'].get('farger',[]))

# aggregera per hex (solid) — källor, auktoritet, roller
agg={}
for r in rows:
    key=r['hex']
    a=agg.setdefault(key, dict(hex=key, kallor=set(), auk1=set(), auk2=set(), auk3=set(), roller=[], token=None, alfa_varianter=set()))
    a['kallor'].add(r['kalla'])
    au=AUTH.get(r['kalla'],3)
    a['auk%d'%au].add(r['kalla'])
    if r['alfa'] is not None: a['alfa_varianter'].add(r['alfa'])
    if len(a['roller'])<6: a['roller'].append(f"{r['kalla']}: {r['roll'][:70]}")
    if r['token'] and r['token'].startswith('--ap') and ' ' not in r['token'] and not a['token']:
        a['token']=r['token']

out=[]
for k,a in agg.items():
    out.append(dict(hex=k, token=a['token'], antal_kallor=len(a['kallor']), auk1=sorted(a['auk1']), auk2=sorted(a['auk2']), auk3=sorted(a['auk3']),
                    kallor=sorted(a['kallor']), alfa_varianter=sorted(a['alfa_varianter']), roller=a['roller']))
out.sort(key=lambda x:(-x['antal_kallor'], x['hex']))
json.dump(dict(metod='regex över farger[].hex i 30 JSON + offer_accepted; hex/rgb/hsl → #rrggbb; alfa separat; frekvens = antal KÄLLOR (inte förekomster)',
               antal_rader=len(rows), antal_unika=len(out), auktoritet=AUTH, farger=out), open(os.path.join(OUT,'farg-frekvens.json'),'w'), ensure_ascii=False, indent=1)

with open(os.path.join(OUT,'farg-frekvens.md'),'w') as w:
    w.write('# Färgfrekvens (antal källor som bär färgen)\n\n| hex | ap-token | källor | auk1 | auk2 | auk3 | alfa-varianter |\n|---|---|---|---|---|---|---|\n')
    for o in out:
        if o['antal_kallor']<2 and not o['token']: continue
        w.write(f"| {o['hex']} | {o['token'] or ''} | {o['antal_kallor']} | {', '.join(o['auk1'])} | {', '.join(o['auk2'])} | {', '.join(o['auk3'])} | {' '.join(str(x) for x in o['alfa_varianter'])} |\n")
print('rader', len(rows), 'unika', len(out))
for o in out[:45]:
    print(f"{o['hex']}  {o['antal_kallor']:2d}  auk1={len(o['auk1'])} auk2={len(o['auk2'])}  {o['token'] or ''}")
