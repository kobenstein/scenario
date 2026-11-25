#!/usr/bin/env python3
"""Film 69 · subtitle cues for the five clips: pocketsphinx forced alignment of the checked wording (<ROOT>clips-geprueft.json, Whisper-checked twice at the iMac)
on the clip sound (<clipwav>/<id>.wav = the whole <ROOT>clips/Cn.mp4) -> clips_meta.json (speaker, source, transcript, cues [[seconds from the clip start, line <= 34]]).
clips_json.py then turns clips_meta.json + timing.json into clips.json (mix.py + subs.py).
CUES = the subtitle lines (exact wording, numbers as digits); SPOKEN = how a line is said where it differs (alignment only: '500' -> 'five hundred', OHB, KION).
C4: a second panelist says a quiet 'Nobody.' at ~4.6 s into the clip; it is NOT in the wording and gets no subtitle (coordinator 24.11.); the alignment skips it as noise.
usage: clip_cues.py [clipwav_dir]"""
import json, os, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F70ROOT', '/mnt/project-files/scenario/film-harari/').rstrip('/') + '/'
CW = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/f70/audio/clipwav').rstrip('/')
ONLY_PRINT = os.environ.get('ONLY_PRINT') == '1'   # first pass: print word times in FILE time (to choose the cut in clips_cut.json), write nothing
SRC = {c['id']: c for c in json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8'))}
CUT = json.load(open(os.path.join(HERE, 'clips_cut.json')))
CUES = {'C1': ["My biggest fear is that it's not", 'a specific scenario like AI', 'creating a virus or killer robots.'],
        'C2': ['And we will not be able', 'to understand it anymore.', "Just as cows don't understand", 'checks or stocks,', 'even though these things', 'control their lives.'],
        'C3': ['And if we could solve the trust', 'between humans problems,', 'then it will be relatively easy', 'to solve the AI problem.']}
SPOKEN = {'AI': 'a_i'}
# source info per clip (clips-geprueft.json has url/words/start/end; the rest from clips/clips-zeiten.txt)
INFO = {'C1': {'role': 'Historian and author', 'source': 'Harari x Suleyman, "AI, Consciousness and the Future of Humanity" (2026-11-18)', 'credit': 'YouTube H43e72-2aAs'},
        'C2': {'role': 'Historian and author', 'source': 'The Economist, "Yuval Noah Harari on the dangers of an AI future" (2026-08-22)', 'credit': 'The Economist'},
        'C3': {'role': 'Historian and author', 'source': 'Harari x Suleyman, "AI, Consciousness and the Future of Humanity" (2026-11-18)', 'credit': 'YouTube H43e72-2aAs'}}
# gain_db: the clips are RMS-matched to the voice in mix.py; measured against the VO around them (ebur128) and pulled level after the first mix
GAIN = {'C1': -1.0, 'C2': -1.7, 'C3': -2.0}
EXTRA = {'a_i': 'EY AY'}
norm = lambda w: re.sub(r"[^a-z_']", '', w.lower().replace('’', "'"))
cfg = Config(hmm=get_model_path('en-us/en-us'), dict=get_model_path('en-us/cmudict-en-us.dict'), lm=None, loglevel='FATAL')
dec = Decoder(cfg)
for w, p in EXTRA.items():
    try: dec.add_word(w, p, False)
    except RuntimeError: pass
meta = {}
for cid, lines in CUES.items():
    c = SRC[cid]
    words = ' '.join(lines).split()
    assert [re.sub(r'[^\w]', '', w).lower() for w in words] == [re.sub(r'[^\w]', '', w).lower() for w in c['words'].split()], (cid, 'cue lines != checked wording')
    assert all(len(l) <= 34 for l in lines), cid
    sub, first = [], []   # sub-tokens for the aligner; index of the first sub-token of every cue line
    for l in lines:
        first.append(len(sub))
        for w in l.split():
            for p in SPOKEN.get(w.strip('.,'), w).split(): sub.append(norm(p))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f'{CW}/full/{cid}.wav', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    PAD = 0.0   # (a tightly cut clip fails in the aligner: 'final result does not match the grammar'; so it is aligned on the WHOLE file incl. pre/post roll and the times are shifted by the cut-in)
    dec.set_align_text(' '.join(sub)); dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    seg = [(x.word, x.start_frame / 100 - PAD, (x.end_frame + 1) / 100 - PAD) for x in dec.seg() if x.word not in ('<s>', '</s>', '<sil>') and not x.word.startswith(('[', '<', '+'))]
    assert len(seg) == len(sub), (cid, len(seg), len(sub))
    # a cue starts at its first word, but never inside a pause (10-ms RMS frames below -46 dBFS for >= 40 ms): then at the end of that pause
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    quiet = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2) + 1e-12) for i in range(0, len(x) - 160, 160)])) < -46
    def unpause(t):
        i = int((t + PAD) * 100)
        while i < len(quiet) and quiet[i]: i += 1
        return i / 100 - PAD
    t0 = CUT[cid]['in']
    cues = [[round(max(0.0, unpause(seg[k][1]) - 0.05 - t0), 2), l] for k, l in zip(first, lines)]
    dur = round(CUT[cid]['out'] - CUT[cid]['in'], 2)
    if ONLY_PRINT:
        print(cid, 'FILE time: first word', round(seg[0][1], 2), '· last word ends', round(seg[-1][2], 2), '· cues', [(t, l) for t, l in cues]); continue
    meta[cid] = {'speaker': c['person'], 'role': INFO[cid]['role'], 'source': INFO[cid]['source'], 'url': c['url'], 'credit': INFO[cid]['credit'],
                 'lower_third': f"{c['person'].upper()} · {INFO[cid]['role']} · ORIGINAL FOOTAGE", 'transcript': c['words'], 'cues': cues, 'cue_end': round(dur - 0.05, 2),
                 'word_end': round(seg[-1][2] - t0, 2), 'gain_db': GAIN[cid], 'file_in_s': CUT[cid]['in'], 'file_out_s': CUT[cid]['out']}
    print(cid, dur, 's · first word', round(seg[0][1], 2), '· last word ends', round(seg[-1][2], 2), '·', [(t, l) for t, l in cues])
if not ONLY_PRINT:     json.dump(meta, open(os.path.join(HERE, 'clips_meta.json'), 'w'), indent=1, ensure_ascii=False)
