import json, re, sys, glob
outdir = sys.argv[1]; srcs = sys.argv[2:]
ids = {'01a14c2b-d18b-71c1-9bf3-1487d05bf416':'vo-02','01a14c2b-d18c-7f53-a8be-64f9703b317e':'vo-03','01a14c2b-d18e-7982-b604-1861c28463c8':'vo-04','01a14c2b-d1c5-7f22-976f-96f27fcdaa24':'vo-05','01a14c2b-d1c4-7912-a116-06529ceca7bb':'vo-06','01a14c2b-d1c8-72b2-b9b2-33f78b722fa4':'vo-07','01a14c2b-d1ca-7cf0-bee8-aeeaf1088b77':'vo-08','01a14c2b-d1cc-7ce2-b078-1f0be625ff57':'vo-10','01a14c2b-f330-71c1-b63d-ba8827f521fb':'vo-09a','01a14c2b-f331-7471-9d44-5ec266820717':'vo-09b','01a14c2b-f332-78f1-82c6-898ccda3efc5':'vo-09c','01a14c2b-f331-7f61-8e55-950b2c09d3a9':'vo-09d'}
found = {}
def walk(o):
    if isinstance(o, dict):
        rid = o.get('request_id'); r = o.get('result')
        if rid in ids and isinstance(r, dict) and 'timestamps' in r and 'audio' in r:
            found[rid] = r
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
    elif isinstance(o, str) and 'character_start_times' in o:
        try: walk(json.loads(o))
        except Exception: pass
for p in srcs:
    if p.endswith('.jsonl'):
        for line in open(p):
            if 'character_start_times' in line: walk(json.loads(line))
    else:
        try: walk(json.load(open(p)))
        except Exception as e: print('skip', p, e)
for rid, n in ids.items():
    if rid not in found: print(n, 'MISSING'); continue
    r = found[rid]; ts = r['timestamps']; url = r['audio']['url']
    chunks = ts if isinstance(ts, list) else [ts]
    chars = [[ch,a,b] for c in chunks for ch,a,b in zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds'])]
    words, cur = [], None
    for ch, a, b in chars:
        if ch.isspace():
            if cur: words.append(cur); cur = None
            continue
        if cur is None: cur = [ch, a, b]
        else: cur[0] += ch; cur[2] = b
    if cur: words.append(cur)
    words = [w for w in words if not re.fullmatch(r'\[[^\]]*\]', w[0])]
    json.dump({'url': url, 'chars': chars, 'words': words}, open(f'{outdir}/{n}.json', 'w'))
    print(n, url)
