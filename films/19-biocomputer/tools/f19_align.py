#!/usr/bin/env python3
"""Film 19: forced-align each downloaded TTS take (pocketsphinx, offline) -> audio/vo-<id>.mp3 + vo-<id>.json {words: [[word, start, end]]}.
The fal MCP returns char timestamps only inside the chat (too large to pipe), so word times come from this alignment instead (+-0.05-0.15 s).
usage: f19_align.py <audio_dir> <dl_dir>   (dl_dir holds t00.mp3 ... = i-th spoken segment of segments.json)"""
import json, re, subprocess, sys, os
from pocketsphinx import Decoder, get_model_path
A, DL = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/')
segs = [s for s in json.load(open(A + '/segments.json')) if 'text' in s]
mp = get_model_path(); dic = {l.split()[0] for l in open(mp + '/en-us/cmudict-en-us.dict')}
ALIAS = {'anil': 'anil'}
TAG = re.compile(r'\[[^\[\]]*\]')
def toks(w):
    return [t for t in re.sub(r"[^a-z' -]", '', w.lower()).replace('-', ' ').split() if t.strip("'")]
report = []
for i, s in enumerate(segs):
    mp3 = f'{DL}/t{i:02d}.mp3'; raw = f'{DL}/t{i:02d}.raw'
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 's16le', raw])
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]))
    words = TAG.sub(' ', s['text']).split()
    seq, owner, oov = [], [], []
    for k, w in enumerate(words):
        for t in toks(w):
            if t not in dic: oov.append(t); t = 'the' if len(t) < 4 else t   # unknown word: stand-in (timing only)
            seq.append(t); owner.append(k)
    # OOV stand-ins: use a dictionary word of similar length so the segment gets a plausible duration
    stand = {'friston': 'fist in', 'kagan': 'cabin', 'smirnova': 'smear nova', 'ahnil': 'a neil', 'chatgpt': 'chat g p t'}
    seq2, own2 = [], []
    for t, o in zip(seq, owner):
        for u in (stand.get(t, t)).split():
            seq2.append(u if u in dic else 'the'); own2.append(o)
    d = Decoder(loglevel='FATAL'); d.set_align_text(' '.join(seq2))
    d.start_utt(); d.process_raw(open(raw, 'rb').read(), full_utt=True); d.end_utt()
    segw = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in d.seg() if x.word not in ('<sil>', '</s>', '<s>') and not x.word.startswith('++')]
    if len(segw) != len(seq2): raise SystemExit(f'{s["id"]}: aligned {len(segw)} != {len(seq2)}')
    out = [[w, None, None] for w in words]
    for (_, a, b), o in zip(segw, own2):
        if out[o][1] is None: out[o][1] = a
        out[o][2] = b
    out[-1][2] = max(out[-1][2], min(dur, out[-1][2] + 0.1))
    outw = [[w.replace('Ahnil', 'Anil'), round(a, 3), round(b, 3)] for w, a, b in out]
    json.dump({'source': mp3, 'align': 'pocketsphinx', 'words': outw}, open(f'{A}/vo-{s["id"]}.json', 'w'))
    subprocess.check_call(['cp', mp3, f'{A}/vo-{s["id"]}.mp3'])
    longest = max(outw, key=lambda x: x[2] - x[1])
    n = len(words); wpm = n / (outw[-1][2] - outw[0][1]) * 60
    report.append((s['id'], n, round(dur, 1), round(wpm), longest[0], round(longest[2] - longest[1], 2), oov))
    print(*report[-1])
