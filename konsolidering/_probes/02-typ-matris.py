#!/usr/bin/env python3
"""02 · Typografimatris: källa × roll → px@1440 / px@390 / vikt / lh / ls / font.
Läser typografi[] i alla 30 JSON, klassar varje rad till en kanonisk roll via nyckelord i `roll`,
och skriver out/typ-matris.json + .md (matris) samt out/typ-rader.json (alla rader, oklassade också).
Frekvens per roll: vilka vikter/lh/ls-värden flest källor delar (auktoritet 1–2 räknas).
"""
import json, glob, os, re, collections
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')); INV=os.path.join(ROOT,'inventering'); OUT=os.path.join(os.path.dirname(__file__),'out')
AUTH=json.load(open(os.path.join(OUT,'farg-frekvens.json')))['auktoritet']

RULES=[  # (roll, regex på roll-texten, lowercase)
 ('display', r'^h1 \(\.hero__h1\)|hero__h1|h1 \(hero|home-hero__heading|h1 \(\.ampy-h1\)|rail-heading|anchor-num|h1 \(hero, på navy\)'),
 ('number',  r'hero-number|hero15-number|hero-value|anchor-num|totalbelopp|value-prominent \(|belopp'),
 ('h1',      r'^h1\b|h1 \(|h1 datum|page-heading|page-head'),
 ('h2',      r'^h2\b|h2 \(|h2 kort|h2 \'|h2 med|h2 \(rot|h2 form|rubrik.*h2|blockhead-title|q-title \(fråger|start-heading|prefooter sektionsrubrik'),
 ('h3',      r'^h3\b|h3 \(|h3 process|stegrubrik|entry-title|q-title|kortrubrik|selector-name \(|arbetsmoment|footer kolumnrubrik|prefooter kolumnrubrik|spark-h|lead-title|namn$|^namn'),
 ('lead',    r'^lead|lead \(|ingress|rail-lead|hero__sub|hero-intro|subline|sub \(|lead-sub|tagline|lead live'),
 ('body',    r'^body|^p \(|^p rot|^p gt|brödtext|korttext|risktext|body \(|risk|option-title|info-rad|summary \(|faktatext|statusrad|trust-punkter|samtalskortets lead|symptomrad|row-text|listor'),
 ('button',  r'cta|knapp|btn|submit|primärknapp|sekundärknapp|skicka-knapp|pill.*läs mer|hero__btn|ring-|ampy-btn'),
 ('eyebrow', r'eyebrow|caps|kicker|tier-label|gearhead|header-label|evidence-label|versal|tidsstämpel|w-cap|tagg|result-eyebrow|monthly-col-label|trio-label'),
 ('label',   r'label|etikett|lbl|field-label'),
 ('small',   r'proof|finstilt|not |not$|datum|consent|samtyck|source-line|källrad|sidfot|copyright|policy|hint|meta|byline|crumb|stat |trust|badge|chip|caption|help|clarifier|subtitle|footnote|share-btn|method|disclaimer|small'),
]
def classify(roll):
    r=roll.lower()
    for name,rx in RULES:
        if re.search(rx,r): return name
    return None
def num(x):
    if isinstance(x,(int,float)): return x
    if isinstance(x,str):
        m=re.match(r'\s*([\d.,]+)',x)
        if m:
            try: return float(m.group(1).replace(',','.'))
            except: return None
    return None

rows=[]
for f in sorted(glob.glob(os.path.join(INV,'*.json'))):
    d=json.load(open(f)); src=d.get('kalla') or os.path.basename(f)[:-5]
    lst=d.get('typografi',[])
    if 'offer_accepted' in d: lst=lst+[dict(t,lager='offer-accepted') for t in d['offer_accepted'].get('typografi',[])]
    for t in lst:
        roll=t.get('roll') or ''
        rows.append(dict(kalla=src if t.get('lager')!='offer-accepted' else 'offer-accepted', auk=AUTH.get(src,3), roll=roll, kanon=classify(roll),
            font=t.get('font'), size=t.get('size'), px_desktop=num(t.get('px_desktop')), px_mobil=num(t.get('px_mobil')),
            weight=t.get('weight'), lh=t.get('lh'), ls=t.get('ls'), color=t.get('color'), fil=t.get('kalla_fil')))
json.dump(rows, open(os.path.join(OUT,'typ-rader.json'),'w'), ensure_ascii=False, indent=1)

# matris källa × roll (första träffen per roll och källa, plus alla i lista)
mat=collections.defaultdict(lambda: collections.defaultdict(list))
for r in rows:
    if r['kanon']: mat[r['kalla']][r['kanon']].append(r)
roles=['display','h1','h2','h3','lead','body','small','eyebrow','number','label','button']
def cell(lst):
    if not lst: return ''
    r=lst[0]; w=r['weight']; 
    return f"{r['px_desktop'] or '?'}/{r['px_mobil'] or '?'} {w} lh{r['lh']} {r['font'].split(' ')[0] if r['font'] else ''}"
with open(os.path.join(OUT,'typ-matris.md'),'w') as w:
    w.write('# Typografimatris (px@1440/px@390 vikt lh font) — första raden per roll och källa\n\n| källa | auk | '+' | '.join(roles)+' |\n|---|---|'+'---|'*len(roles)+'\n')
    for src in sorted(mat, key=lambda s:(AUTH.get(s,3),s)):
        w.write(f"| {src} | {AUTH.get(src,3)} | "+' | '.join(cell(mat[src][ro]) for ro in roles)+' |\n')
# frekvens per roll: vikt, lh, storlek@1440 (auk 1–2)
freq={}
for ro in roles:
    W=collections.Counter(); L=collections.Counter(); S=collections.Counter(); F=collections.Counter(); LS=collections.Counter()
    for src in mat:
        if AUTH.get(src,3)>2: continue
        seen=set()
        for r in mat[src][ro]:
            k=('w',str(r['weight']))
            if k not in seen: W[str(r['weight'])]+=1; seen.add(k)
            k=('l',str(r['lh']))
            if k not in seen: L[str(r['lh'])]+=1; seen.add(k)
            k=('s',str(r['px_desktop']))
            if k not in seen: S[str(r['px_desktop'])]+=1; seen.add(k)
            k=('f',(r['font'] or '').split(' ')[0])
            if k not in seen: F[(r['font'] or '').split(' ')[0]]+=1; seen.add(k)
            k=('ls',str(r['ls']))
            if k not in seen: LS[str(r['ls'])]+=1; seen.add(k)
    freq[ro]=dict(vikt=W.most_common(8), lh=L.most_common(8), px1440=S.most_common(10), font=F.most_common(4), ls=LS.most_common(6))
json.dump(dict(metod='typografi[].roll klassad med regex → 11 roller; frekvens = antal källor (auk 1–2) som delar värdet; första raden per roll/källa i matrisen',
               roller=roles, frekvens=freq, matris={s:{ro:[dict(px_desktop=r['px_desktop'],px_mobil=r['px_mobil'],weight=r['weight'],lh=r['lh'],ls=r['ls'],font=r['font'],roll=r['roll'],size=r['size']) for r in mat[s][ro]] for ro in roles if mat[s][ro]} for s in mat}),
          open(os.path.join(OUT,'typ-matris.json'),'w'), ensure_ascii=False, indent=1)
print('rader',len(rows),'klassade',sum(1 for r in rows if r['kanon']))
for ro in roles:
    print(ro, 'vikt',freq[ro]['vikt'][:5],'| lh',freq[ro]['lh'][:5],'| px',freq[ro]['px1440'][:6],'| ls',freq[ro]['ls'][:4])
