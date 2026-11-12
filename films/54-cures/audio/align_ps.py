#!/usr/bin/env python3
"""Film 54 · forced alignment of the ElevenLabs takes with pocketsphinx (offline; fal Whisper results can't be written to disk by the MCP tools).
segments.json + <dl>/vo-<id>.mp3 -> <dl>/vo-<id>.json {words:[[w,start,end]]} with the SCRIPT's words (tags removed, hyphenated words stay ONE word, 'ten-year').
The alignment runs on sub-tokens (split at hyphens); OOV names get ARPAbet pronunciations below. Phones are placed by the Viterbi forced alignment of the
CMU en-us model (10 ms frames); pocketsphinx drops pauses into <sil> entries: word times are the voiced spans. Word end < next start in a gap.
usage: align_ps.py <audio_dir> <dl_dir> [take ids...]"""
import json, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
A, DL = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/'); only = set(sys.argv[3:])
EXTRA = {'amodei': 'AH M OW D EY', "amodei's": 'AH M OW D EY Z', 'anthropic': 'AE N TH R AA P IH K', 'ramakrishnan': 'R AA M AH K R IH SH N AH N',
         'superintelligence': 'S UW P ER IH N T EH L AH JH AH N S', 'venki': 'V EH NG K IY'}
norm = lambda w: re.sub(r"[^a-z']", '', w.lower().replace('’', "'"))
segs = [s for s in json.load(open(f'{A}/segments.json')) if 'text' in s]
cfg = Config(hmm=get_model_path('en-us/en-us'), dict=get_model_path('en-us/cmudict-en-us.dict'), lm=None, loglevel='FATAL')
dec = Decoder(cfg)
for w, p in EXTRA.items(): dec.add_word(w, p, False)
for s in segs:
    if only and s['id'] not in only: continue
    toks = [w for w in re.sub(r'\[[^\]]*\]', ' ', s['text']).split() if norm(w)]   # script words (hyphens kept)
    sub = []   # (token index, normalised sub-token)
    for i, w in enumerate(toks):
        for p in w.split('-'):
            if norm(p): sub.append((i, norm(p)))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f"{DL}/vo-{s['id']}.mp3", '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    dec.set_align_text(' '.join(p for _, p in sub))
    dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    seg = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in dec.seg() if x.word not in ('<s>', '</s>', '<sil>', '[NOISE]', '++NOISE++')]
    seg = [x for x in seg if not x[0].startswith('<') and not x[0].startswith('[')]
    assert len(seg) == len(sub), (s['id'], len(seg), len(sub))
    words = []
    for i, w in enumerate(toks):
        ks = [k for k, (ti, _) in enumerate(sub) if ti == i]
        words.append([w, round(seg[ks[0]][1], 3), round(seg[ks[-1]][2], 3)])
    # energy refinement: a word never starts or ends inside a real pause (10-ms RMS frames below -46 dBFS for >= 40 ms)
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    rms = np.array([np.sqrt(np.mean(x[i:i + 160] ** 2) + 1e-12) for i in range(0, len(x) - 160, 160)])
    quiet = 20 * np.log10(rms) < -46
    runs, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if j - i >= 4: runs.append((i * .01, j * .01))
            i = j
        else: i += 1
    for w in words:
        for a, b in runs:
            if a - .005 <= w[1] < b - .005: w[1] = round(min(b, w[2] - .05), 3)   # starts inside a pause -> after it
            if a + .005 < w[2] <= b + .005: w[2] = round(max(a, w[1] + .05), 3)   # ends inside a pause -> before it
    json.dump({'words': words}, open(f"{DL}/vo-{s['id']}.json", 'w'))
    print(s['id'], len(words), 'words, voice', words[0][1], '-', words[-1][2])
