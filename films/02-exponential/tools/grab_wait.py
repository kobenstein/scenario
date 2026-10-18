"""Extract TTS results (audio url + word timestamps) from a saved wait_for_jobs output.
usage: grab_wait.py <saved.txt> <outdir> idx=name ..."""
import json, re, sys, subprocess
src, outdir = sys.argv[1], sys.argv[2]
names = dict(a.split('=') for a in sys.argv[3:])
d = json.loads(open(src).read())
def find_jobs(o):
    if isinstance(o, dict):
        if 'index' in o and isinstance(o.get('result'), dict): yield o
        for v in o.values(): yield from find_jobs(v)
    elif isinstance(o, list):
        for v in o: yield from find_jobs(v)
for j in find_jobs(d):
    n = names.get(str(j['index']))
    if not n: continue
    r = j['result']
    if 'timestamps' not in r: r = r.get('data', r)
    ts = r['timestamps']; url = r['audio']['url']
    chunks = ts if isinstance(ts, list) else [ts]
    chars = [[c, a, b] for ch in chunks for c, a, b in zip(ch['characters'], ch['character_start_times_seconds'], ch['character_end_times_seconds'])]
    words, cur = [], None
    for c, a, b in chars:
        if c.isspace():
            if cur: words.append(cur); cur = None
            continue
        if cur is None: cur = [c, a, b]
        else: cur[0] += c; cur[2] = b
    if cur: words.append(cur)
    words = [w for w in words if not re.fullmatch(r'\[[^\]]*\]', w[0])]
    json.dump({'url': url, 'chars': chars, 'words': words}, open(f'{outdir}/{n}.json', 'w'))
    subprocess.check_call(['curl', '-sS', '-o', f'{outdir}/{n}.mp3', url.replace('://fal.media', '://v3b.fal.media')])
    print(n, len(words), 'words', url)
