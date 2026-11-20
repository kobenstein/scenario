#!/usr/bin/env python3
"""Film 19: forced-align each downloaded TTS take (pocketsphinx, offline) -> audio/vo-<id>.mp3 + vo-<id>.json {words: [[word, start, end]]}.
The fal MCP returns char timestamps only inside the chat (too large to pipe), so word times come from this alignment instead (+-0.05-0.15 s).
usage: f19_align.py <audio_dir> <dl_dir>   (dl_dir holds t00.mp3 ... = i-th spoken vo-v3 segment of segments.json)
       f19_align.py <audio_dir> <dl_dir> s20 cta1 cta2   (vo-v4: only these takes, dl_dir holds s20.mp3 …; the other takes stay untouched)"""
import json, re, subprocess, sys, os
from pocketsphinx import Decoder, get_model_path
A, DL = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/')
IDS = sys.argv[3:]
segs = [s for s in json.load(open(A + '/segments.json')) if 'text' in s and (s['id'] in IDS if IDS else not (s.get('src') or s.get('cta')))]
mp = get_model_path(); dic = {l.split()[0] for l in open(mp + '/en-us/cmudict-en-us.dict')}
ALIAS = {'anil': 'anil'}
TAG = re.compile(r'\[[^\[\]]*\]')
def toks(w):
    return [t for t in re.sub(r"[^a-z' -]", '', w.lower()).replace('-', ' ').split() if t.strip("'")]
report = []
def tts_words(r):
    """word [w, start, end] from ElevenLabs char timestamps (audio tags like [softly] skipped), as tools/save_tts.py"""
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
for i, s in enumerate(segs):
    stem = s['id'] if IDS else f't{i:02d}'
    mp3 = f'{DL}/{stem}.mp3'; raw = f'{DL}/{stem}.raw'
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 's16le', raw])
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]))
    words = TAG.sub(' ', s['text']).split()
    seq, owner, oov = [], [], []
    for k, w in enumerate(words):
        for t in toks(w):
            if t not in dic: oov.append(t); t = 'the' if len(t) < 4 else t   # unknown word: stand-in (timing only)
            seq.append(t); owner.append(k)
    # OOV stand-ins: use a dictionary word of similar length so the segment gets a plausible duration
    stand = {'friston': 'fist in', 'kagan': 'cabin', 'smirnova': 'smear nova', 'ahnil': 'a neil', 'chatgpt': 'chat g p t', 'superintelligence': 'super intelligence'}
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
    how = 'pocketsphinx'
    if IDS and os.path.exists(f'{DL}/{stem}.result.json'):   # vo-v4: the TTS char timestamps (saved fal result) beat the alignment
        tw = tts_words(json.load(open(f'{DL}/{stem}.result.json'))['result'])   # (pocketsphinx put "Anil Seth" 0.7 s early in s20)
        if len(tw) == len(outw):
            d = max(abs(x[1] - y[1]) for x, y in zip(outw, tw)); print(s['id'], 'tts vs pocketsphinx: max start diff', round(d, 2))
            outw = [[x[0], round(y[1], 3), round(min(y[2], dur), 3)] for x, y in zip(outw, tw)]; how = 'tts-timestamps'
    json.dump({'source': mp3, 'align': how, 'words': outw}, open(f'{A}/vo-{s["id"]}.json', 'w'))
    subprocess.check_call(['cp', mp3, f'{A}/vo-{s["id"]}.mp3'])
    longest = max(outw, key=lambda x: x[2] - x[1])
    n = len(words); wpm = n / (outw[-1][2] - outw[0][1]) * 60
    report.append((s['id'], n, round(dur, 1), round(wpm), longest[0], round(longest[2] - longest[1], 2), oov))
    print(*report[-1])
