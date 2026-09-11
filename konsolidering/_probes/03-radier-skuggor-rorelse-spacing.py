#!/usr/bin/env python3
"""03 · Radier, skuggor, rörelse, spacing, container, brytpunkter — frekvens över 30 JSON.
- radier: alla px-tal i radier[].varde/px_desktop per källa → antal källor per radie, med roll-exempel
- skuggor: ordagranna skuggsträngar + skuggfärgens rgb-triplett (9,11,50 / 15,18,60 / 11,13,42 / 190,190,190 ...)
- rörelse: durations (ms) + easing-funktioner per källa
- spacing: vilka --apspace-* refereras, samt section-padding-y per källa
- container: max-width per källa; breakpoints: alla px-tal
Skriver out/radier.json, out/skuggor.json, out/rorelse.json, out/spacing.json, out/container-breakpoints.json (+ sammanfattning .md)
"""
import json, glob, os, re, collections
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')); INV=os.path.join(ROOT,'inventering'); OUT=os.path.join(os.path.dirname(__file__),'out')
AUTH=json.load(open(os.path.join(OUT,'farg-frekvens.json')))['auktoritet']
srcs={}
for f in sorted(glob.glob(os.path.join(INV,'*.json'))):
    d=json.load(open(f)); srcs[d.get('kalla') or os.path.basename(f)[:-5]]=d

# ---------- radier
rad=collections.defaultdict(lambda: dict(kallor=set(), roller=[]))
PX=re.compile(r'(\d+(?:[.,]\d+)?)\s*px')
for s,d in srcs.items():
    for r in d.get('radier',[]):
        txt=' '.join(str(r.get(k,'')) for k in ('varde','px','px_desktop'))
        vals=set()
        for m in PX.finditer(txt): vals.add(round(float(m.group(1).replace(',','.'))))
        for k in ('px','px_desktop'):
            v=r.get(k)
            if isinstance(v,(int,float)): vals.add(round(v))
        for v in vals:
            if v>200: continue
            rad[v]['kallor'].add(s)
            if len(rad[v]['roller'])<8: rad[v]['roller'].append(f"{s}: {str(r.get('roll'))[:60]}")
radout=sorted([dict(px=k, antal=len(v['kallor']), auk1=sorted(x for x in v['kallor'] if AUTH.get(x,3)==1), kallor=sorted(v['kallor']), roller=v['roller']) for k,v in rad.items()], key=lambda x:(-x['antal'],x['px']))
json.dump(radout, open(os.path.join(OUT,'radier.json'),'w'), ensure_ascii=False, indent=1)

# ---------- skuggor
sh=[]; trip=collections.Counter(); tripsrc=collections.defaultdict(set)
RGBT=re.compile(r'rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)')
for s,d in srcs.items():
    for r in d.get('skuggor',[]):
        v=str(r.get('varde',''))
        sh.append(dict(kalla=s, auk=AUTH.get(s,3), roll=str(r.get('roll'))[:80], varde=v[:220]))
        for m in RGBT.finditer(v):
            t='%s,%s,%s'%m.groups(); trip[t]+=1; tripsrc[t].add(s)
# exakta strängar som delas av >1 källa
exact=collections.defaultdict(set)
for r in sh:
    for piece in re.split(r'\s*[;·]\s*|\s+/\s+', r['varde']):
        piece=piece.strip()
        if 'px' in piece and 'rgb' in piece and len(piece)<120: exact[re.sub(r'\s+',' ',piece)].add(r['kalla'])
json.dump(dict(skuggor=sh, skuggfarg_tripletter=[dict(rgb=k, antal_forekomster=v, kallor=sorted(tripsrc[k])) for k,v in trip.most_common()],
               delade_strangar=[dict(varde=k, kallor=sorted(v)) for k,v in sorted(exact.items(), key=lambda kv:-len(kv[1])) if len(v)>1]),
          open(os.path.join(OUT,'skuggor.json'),'w'), ensure_ascii=False, indent=1)

# ---------- rörelse
dur=collections.defaultdict(set); ease=collections.defaultdict(set); rr=[]
DUR=re.compile(r'(\d*\.?\d+)\s*(ms|s)\b'); EASE=re.compile(r'cubic-bezier\([^)]*\)|ease-out|ease-in-out|linear|\bease\b')
for s,d in srcs.items():
    for r in d.get('rorelse',[]):
        v=str(r.get('varde','')); rr.append(dict(kalla=s, auk=AUTH.get(s,3), roll=str(r.get('roll'))[:60], varde=v[:200]))
        for m in DUR.finditer(v):
            ms=float(m.group(1))*(1000 if m.group(2)=='s' else 1)
            if 50<=ms<=1000: dur[int(round(ms))].add(s)
        for m in EASE.finditer(v): ease[re.sub(r'\s','',m.group(0))].add(s)
json.dump(dict(rader=rr, durations=[dict(ms=k, antal=len(v), kallor=sorted(v)) for k,v in sorted(dur.items(), key=lambda kv:-len(kv[1]))],
               easings=[dict(easing=k, antal=len(v), kallor=sorted(v)) for k,v in sorted(ease.items(), key=lambda kv:-len(kv[1]))]),
          open(os.path.join(OUT,'rorelse.json'),'w'), ensure_ascii=False, indent=1)

# ---------- spacing
tokref=collections.defaultdict(set); secpad=[]; sprows=[]
TOK=re.compile(r'--apspace-[0-9a-z-]+')
for s,d in srcs.items():
    for r in d.get('spacing',[]):
        txt=' '.join(str(r.get(k,'')) for k in ('varde','token'))
        for m in TOK.finditer(txt): tokref[m.group(0)].add(s)
        roll=str(r.get('roll','')).lower()
        sprows.append(dict(kalla=s, auk=AUTH.get(s,3), roll=str(r.get('roll'))[:60], varde=str(r.get('varde'))[:120], px_desktop=r.get('px_desktop'), px_mobil=r.get('px_mobil'), token=r.get('token')))
        if ('sektion' in roll or 'section' in roll) and 'padding' in roll:
            secpad.append(dict(kalla=s, auk=AUTH.get(s,3), varde=str(r.get('varde'))[:100], px_desktop=r.get('px_desktop'), px_mobil=r.get('px_mobil'), token=r.get('token')))
json.dump(dict(apspace_referenser=[dict(token=k, antal=len(v), kallor=sorted(v)) for k,v in sorted(tokref.items(), key=lambda kv:-len(kv[1]))], sektion_padding=secpad, rader=sprows),
          open(os.path.join(OUT,'spacing.json'),'w'), ensure_ascii=False, indent=1)

# ---------- container + breakpoints
cont=[]; bp=collections.defaultdict(set)
for s,d in srcs.items():
    for r in d.get('container',[]): cont.append(dict(kalla=s, auk=AUTH.get(s,3), roll=str(r.get('roll'))[:50], varde=str(r.get('varde'))[:100]))
    for b in d.get('breakpoints',[]):
        for m in re.finditer(r'(\d{3,4})\s*(?:px)?', str(b)):
            v=int(m.group(1))
            if 300<=v<=1800: bp[v].add(s)
json.dump(dict(container=cont, breakpoints=[dict(px=k, antal=len(v), kallor=sorted(v)) for k,v in sorted(bp.items(), key=lambda kv:-len(kv[1]))]),
          open(os.path.join(OUT,'container-breakpoints.json'),'w'), ensure_ascii=False, indent=1)

# ---------- sammanfattning
with open(os.path.join(OUT,'03-sammanfattning.md'),'w') as w:
    w.write('# Radier\n\n| px | källor | auk1 |\n|---|---|---|\n')
    for r in radout[:16]: w.write(f"| {r['px']} | {r['antal']} | {', '.join(r['auk1'])} |\n")
    w.write('\n# Skuggfärg (rgb-triplett) — förekomster\n\n')
    for k,v in trip.most_common(10): w.write(f"- rgb({k}): {v} förekomster i {len(tripsrc[k])} källor: {', '.join(sorted(tripsrc[k]))}\n")
    w.write('\n# Delade skuggsträngar (>1 källa)\n\n')
    for k,v in sorted(exact.items(), key=lambda kv:-len(kv[1])):
        if len(v)>1: w.write(f"- `{k}` — {', '.join(sorted(v))}\n")
    w.write('\n# Durations\n\n')
    for k,v in sorted(dur.items(), key=lambda kv:-len(kv[1]))[:12]: w.write(f"- {k} ms: {len(v)} källor ({', '.join(sorted(v))})\n")
    w.write('\n# Easings\n\n')
    for k,v in sorted(ease.items(), key=lambda kv:-len(kv[1]))[:8]: w.write(f"- `{k}`: {len(v)} källor ({', '.join(sorted(v))})\n")
    w.write('\n# --apspace-referenser\n\n')
    for k,v in sorted(tokref.items(), key=lambda kv:-len(kv[1])): w.write(f"- {k}: {len(v)} ({', '.join(sorted(v))})\n")
    w.write('\n# Brytpunkter\n\n')
    for k,v in sorted(bp.items(), key=lambda kv:-len(kv[1]))[:14]: w.write(f"- {k}: {len(v)} ({', '.join(sorted(v))})\n")
print(open(os.path.join(OUT,'03-sammanfattning.md')).read())
