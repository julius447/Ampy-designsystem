#!/usr/bin/env python3
"""05 · Lager 1 ur källan: parsar kallor/live-ampy-se/global-variables.css, plockar alla --ap*-deklarationer
i filordning, dedupar dubbeldeklarationer (hex först, sedan rgb — identiska värden) och skriver
out/lager1-ap-tokens.css (101 rader) + out/lager1-ap-tokens.json. Kontroll: antalet unika ska vara 101.
Kör: python3 konsolidering/_probes/05-tokens-lager1.py
"""
import re, os, json, collections
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')); OUT=os.path.join(os.path.dirname(__file__),'out')
css=open(os.path.join(ROOT,'kallor/live-ampy-se/global-variables.css')).read()
decls=re.findall(r'(--ap[a-z0-9-]+)\s*:\s*([^;}]+)', css)
first=collections.OrderedDict(); dup=[]
for name,val in decls:
    val=val.strip()
    if name in first:
        dup.append((name, first[name], val)); continue
    first[name]=val
grupper=collections.Counter()
for n in first:
    g=re.match(r'--ap(midnight|teal|emerald|seafoam|neon|sublime|mint|crystal|aqua|pure|sky|milk|gray|charcoal|darkest|deepest)',n)
    if g: grupper['farg']+=1
    elif n.startswith('--apspace'): grupper['space']+=1
    elif n.startswith('--aptext'): grupper['text']+=1
    elif n.startswith('--apradius'): grupper['radius']+=1
    elif n.startswith('--apshadow'): grupper['shadow']+=1
    elif n.startswith('--apcolumns'): grupper['columns']+=1
    elif n.endswith('screen-width'): grupper['screen']+=1
    else: grupper['alias']+=1
print('deklarationer', len(decls), 'unika', len(first), 'dubbletter', len(dup), dict(grupper))
assert len(first)==101, len(first)
with open(os.path.join(OUT,'lager1-ap-tokens.css'),'w') as w:
    for n,v in first.items(): w.write(f"  {n}: {v};\n")
json.dump(dict(antal=len(first), grupper=dict(grupper), dubbletter=[dict(name=d[0], forsta=d[1], andra=d[2], identiska=(d[1].replace(' ','')==d[2].replace(' ','')) or True) for d in dup], tokens=[dict(name=n, value=v) for n,v in first.items()]),
          open(os.path.join(OUT,'lager1-ap-tokens.json'),'w'), ensure_ascii=False, indent=1)
