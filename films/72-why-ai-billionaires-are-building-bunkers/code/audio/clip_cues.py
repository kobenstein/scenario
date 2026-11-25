#!/usr/bin/env python3
"""Film 72 (1:1 from Film 73 / 69) · subtitle cues for the four clips: pocketsphinx forced alignment of the checked wording (<ROOT>clips-geprueft.json 'wording')
on the clip sound (<clipwav>/<id>.wav = the whole <ROOT>clips/Cn.mp4) -> clips_meta.json (speaker, source, transcript, cues [[seconds from the clip start, line <= 34]]).
clips_json.py then turns clips_meta.json + timing.json into clips.json (mix.py + subs.py). All four clips of clips-geprueft.json are used (film order C1, C2, C3, C2b).
CUES = the subtitle lines (exact wording, numbers as digits); SPOKEN = how a word is said where it differs (alignment only: '2032' -> 'twenty thirty two', '70s' -> 'seventies').
Clips have no burned-in captions; C2 / C2b carry a MODERN | WISDOM bug bottom left (clips-geprueft.json note).
gain_db: the clips are RMS-matched to the voice in mix.py; GAIN pulls them to within +-1 LU of the VO around them (measured with ebur128 after the first mix with the real clips).
A missing clip wav = no cues for that clip (placeholder slot): it is skipped and keeps no clips_meta entry.
usage: clip_cues.py [clipwav_dir]"""
import json, os, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F72ROOT', '/mnt/project-files/scenario/film-bunker/').rstrip('/') + '/'
CW = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/f72/audio/clipwav').rstrip('/')
G = json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8')); SRC = {c['id']: c for c in (G if isinstance(G, list) else G['clips'])}
CUES = {'C1': ["I don't have what I would call", 'a bunker, but it has been', 'on my mind. Not because of AI,', 'but just because of like,', 'people are dropping bombs', 'in the world again,'],
        'C2': ['Right now, the AI company leaders', 'are building bunkers.', 'A lot of people who are wealthy', 'are building bunkers.'],
        'C3': ["And they're like, they hadn't even", 'really considered that before.', 'Like, how do I maintain control', 'of my security force', 'once my money is worthless?'],
        'C2b': ["Don't build bunkers, write laws.", 'Be invested in the future.', "Don't defect on the future.", 'Be invested in the future.']}
SPOKEN = {'AI': 'a_i'}   # spoken as the letters A I (alignment only)
WHO = {'C1': ('Sam Altman', 'CEO, OpenAI', 'podcast'), 'C2': ('Tristan Harris', 'former Google design ethicist', 'podcast'),
       'C3': ('Douglas Rushkoff', 'writer', 'podcast'), 'C2b': ('Tristan Harris', 'former Google design ethicist', 'podcast')}
GAIN = {'C1': 0.0, 'C2': 0.0, 'C3': 0.0, 'C2b': 0.0}   # ebur128 after the first mix with the real clips: pull each clip to within +-1 LU of the VO around it (see README)
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
    assert [re.sub(r'[^\w]', '', w).lower() for w in words] == [re.sub(r'[^\w]', '', w).lower() for w in c['wording'].split()], (cid, 'cue lines != checked wording')
    assert all(len(l) <= 34 for l in lines), cid
    if not os.path.exists(f'{CW}/{cid}.wav'): print(cid, 'no clip wav: skipped (placeholder)'); continue
    sub, first = [], []   # sub-tokens for the aligner (hyphenated words split); index of the first sub-token of every cue line
    for l in lines:
        first.append(len(sub))
        for w in l.split():
            for p in SPOKEN.get(w.strip('.,'), w).replace('-', ' ').split():
                if norm(p): sub.append(norm(p))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f'{CW}/{cid}.wav', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    dec.set_align_text(' '.join(sub)); dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    seg = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in dec.seg() if x.word not in ('<s>', '</s>', '<sil>') and not x.word.startswith(('[', '<', '+'))]
    assert len(seg) == len(sub), (cid, len(seg), len(sub))
    # a cue starts at its first word, but never inside a pause (10-ms RMS frames below -46 dBFS for >= 40 ms): then at the end of that pause
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    quiet = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2) + 1e-12) for i in range(0, len(x) - 160, 160)])) < -46
    def unpause(t):
        i = int(t * 100)
        while i < len(quiet) and quiet[i]: i += 1
        return i / 100
    dur = len(x) / 16000
    cues = [[round(max(0.0, unpause(seg[k][1]) - 0.05), 2), l] for k, l in zip(first, lines)]
    name, role, kind = WHO[cid]
    meta[cid] = {'speaker': name, 'role': role, 'source': f"{c['channel']} ({c['upload_date']})", 'url': f"https://www.youtube.com/watch?v={c['video_id']}&t={int(sum(float(a) * 60 ** i for i, a in enumerate(reversed(c['start'].split(':')))))}s",
                 'credit': c['channel'], 'lower_third': f'{name} · {role}', 'transcript': c['wording'], 'cues': cues,
                 'cue_end': round(min(seg[-1][2] + 0.4, dur - 0.05), 2), 'word_end': round(seg[-1][2], 2), 'gain_db': GAIN[cid]}
    print(cid, round(dur, 2), 's · first word', round(seg[0][1], 2), '· last word ends', round(seg[-1][2], 2), '·', [(t, l) for t, l in cues])
json.dump(meta, open(os.path.join(HERE, 'clips_meta.json'), 'w'), indent=1, ensure_ascii=False)
