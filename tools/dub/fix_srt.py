#!/usr/bin/env python3
"""Clean dubbed SRTs: French guillemets split into own cues, tiny tail cues.
usage: fix_srt.py file.srt [...]   (in place)"""
import re, sys, textwrap
def ts(s):
    h,m,r=s.split(':'); s_,ms=r.split(','); return int(h)*3600+int(m)*60+int(s_)+int(ms)/1000
def fmt(t):
    ms=round(t*1000); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); s,ms=divmod(ms,1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
def wrap(t):
    t=' '.join(t.split())
    if len(t)<=42: return t
    ls=textwrap.wrap(t,width=max(34,(len(t)+1)//2+4))
    return '\n'.join(ls)
for f in sys.argv[1:]:
    blocks=[b for b in re.split(r'\n\s*\n',open(f,encoding='utf-8').read().strip()) if b.strip()]
    cues=[]
    for b in blocks:
        L=b.splitlines(); a,z=L[1].split(' --> ')
        cues.append([ts(a.strip()),ts(z.strip()),' '.join(L[2:]).strip(),'\n'.join(L[2:]).strip()])
    # opening guillemet dangling at end -> move to next cue
    for i,c in enumerate(cues[:-1]):
        if re.search(r'[«“]\s*$',c[2]):
            q=re.search(r'([«“])\s*$',c[2]).group(1); c[2]=c[2][:-len(c[2])+c[2].rfind(q)].rstrip()
            cues[i+1][2]=q+(' ' if q=='«' else '')+cues[i+1][2]; c[3]=None; cues[i+1][3]=None
    out=[]
    for c in cues:
        txt=c[2].strip()
        tiny=(not re.search(r'\w',txt)) or (len(txt)<=8 and (c[1]-c[0])<0.6)
        if out and tiny and c[0]-out[-1][1]<0.6:
            sep='' if re.match(r'^[»”.,;:!?)]',txt) else ' '
            if txt.startswith('»'): sep=' '
            out[-1][2]=out[-1][2]+sep+txt; out[-1][1]=c[1]; out[-1][3]=None
        elif txt: out.append(c)
    open(f,'w',encoding='utf-8').write('\n\n'.join(f'{i}\n{fmt(a)} --> {fmt(z)}\n{o if o else wrap(t)}' for i,(a,z,t,o) in enumerate(out,1))+'\n')
    t=open(f,encoding='utf-8').read(); t=re.sub(r' ?«\n','\n« ',t); open(f,'w',encoding='utf-8').write(t)
    print(f, len(cues),'->',len(out))
