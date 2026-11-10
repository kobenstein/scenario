#!/usr/bin/env python3
"""Film 25 (as tools/f24_align.py): forced-align each downloaded TTS take (pocketsphinx, offline) -> audio/vo-<id>.mp3 + vo-<id>.json {words: [[word, start, end]]}.
Same method as films/19-biocomputer/tools/f19_align.py (the fal MCP only returns char timestamps inside the chat, too large to pipe), +-0.05-0.15 s.
The takes were requested without TTS timestamps (a 30-s take is ~15 kB of character times in the chat); if <dl>/<id>.result.json (the saved fal
result with 'timestamps') exists, those TTS times win over the alignment.
usage: f24_align.py <audio_dir> <dl_dir> [id ...]   (dl_dir holds <id>.mp3 for every spoken take of segments.json)"""
import json, re, subprocess, sys, os, unicodedata
from pocketsphinx import Decoder, get_model_path
A, DL = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/')
IDS = sys.argv[3:]
segs = [s for s in json.load(open(A + '/segments.json')) if 'text' in s and (not IDS or s['id'] in IDS)]
mp = get_model_path(); dic = {l.split()[0] for l in open(mp + '/en-us/cmudict-en-us.dict')}
TAG = re.compile(r'\[[^\[\]]*\]')
def toks(w):
    w = unicodedata.normalize('NFKD', w).encode('ascii', 'ignore').decode()
    return [t for t in re.sub(r"[^a-z' -]", '', w.lower()).replace('-', ' ').split() if t.strip("'")]
# words the dictionary does not know -> spoken stand-ins (timing only); 'ai' = A.I.
DIGITS = {'2016': 'twenty sixteen'}   # digits in the script as the voice speaks them
STAND = {'ai': 'a i', 'jakob': 'jacob', 'superintelligence': 'super intelligence', 'linkedin': 'linked in', "linkedin's": 'linked ins', 'maori': 'mouth ree', 'autocomplete': 'auto complete'}
def tts_words(r):
    chars = [x for c in (r['timestamps'] if isinstance(r['timestamps'], list) else [r['timestamps']]) for x in zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds'])]
    words, cur, tag = [], None, False
    for ch, a, b in chars:
        if ch == '[': tag = True
        if tag:
            if ch == ']': tag = False
            continue
        if ch.isspace():
            if cur: words.append(cur); cur = None
            continue
        if cur is None: cur = [ch, a, b]
        else: cur[0] += ch; cur[2] = b
    if cur: words.append(cur)
    return words
for s in segs:
    stem = s['id']; mp3 = f'{DL}/{stem}.mp3'; raw = f'{DL}/{stem}.raw'
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 's16le', raw])
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]))
    words = TAG.sub(' ', s['text']).split()
    seq, owner, oov = [], [], []
    for k, w in enumerate(words):
        for t in toks(DIGITS.get(re.sub(r'[^0-9]', '', w), w) if re.search(r'[0-9]', w) else w):
            for u in STAND.get(t, t).split():
                if u not in dic: oov.append(u); u = 'the'
                seq.append(u); owner.append(k)
    d = Decoder(loglevel='FATAL'); d.set_align_text(' '.join(seq))
    d.start_utt(); d.process_raw(open(raw, 'rb').read(), full_utt=True); d.end_utt()
    segw = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in d.seg() if x.word not in ('<sil>', '</s>', '<s>') and not x.word.startswith('++')]
    if len(segw) != len(seq): raise SystemExit(f'{s["id"]}: aligned {len(segw)} != {len(seq)}')
    out = [[w, None, None] for w in words]
    for (_, a, b), o in zip(segw, owner):
        if out[o][1] is None: out[o][1] = a
        out[o][2] = b
    out[-1][2] = max(out[-1][2], min(dur, out[-1][2] + 0.1))
    outw = [[w, round(a, 3), round(b, 3)] for w, a, b in out]
    how = 'pocketsphinx'
    if os.path.exists(f'{DL}/{stem}.result.json'):
        tw = tts_words(json.load(open(f'{DL}/{stem}.result.json'))['result'])
        if len(tw) == len(outw):
            outw = [[x[0], round(y[1], 3), round(min(y[2], dur), 3)] for x, y in zip(outw, tw)]; how = 'tts-timestamps'
    json.dump({'source': mp3, 'align': how, 'words': outw}, open(f'{A}/vo-{s["id"]}.json', 'w'))
    subprocess.check_call(['cp', mp3, f'{A}/vo-{s["id"]}.mp3'])
    longest = max(outw, key=lambda x: x[2] - x[1]); n = len(words); wpm = n / (outw[-1][2] - outw[0][1]) * 60
    print(s['id'], n, round(dur, 1), 'wpm', round(wpm), 'first', outw[0][1], 'last end', outw[-1][2], 'longest', longest[0], round(longest[2] - longest[1], 2), 'oov', oov)
