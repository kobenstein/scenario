#!/usr/bin/env python3
"""Film 73 (1:1 from Film 69) · subtitle cues for the three clips: pocketsphinx forced alignment of the checked wording (<ROOT>clips-geprueft.json 'wording')
on the clip sound (<clipwav>/<id>.wav = the whole <ROOT>clips/Cn.mp4) -> clips_meta.json (speaker, source, transcript, cues [[seconds from the clip start, line <= 34]]).
clips_json.py then turns clips_meta.json + timing.json into clips.json (mix.py + subs.py). C3b of clips-geprueft.json is not used (not in vo-v3).
CUES = the subtitle lines (exact wording, numbers as digits); SPOKEN = how a word is said where it differs (alignment only: '2032' -> 'twenty thirty two', '70s' -> 'seventies').
C1: Whisper hears 'look through'; the checked word is 'live' (clips-geprueft.json note). C4: burned-in captions in the source; the picture covers the bottom 180 px.
gain_db: the clips are RMS-matched to the voice in mix.py; GAIN pulls them to within +-1 LU of the VO around them (measured with ebur128 after the first mix with the real clips).
A missing clip wav = no cues for that clip (placeholder slot): it is skipped and keeps no clips_meta entry.
usage: clip_cues.py [clipwav_dir]"""
import json, os, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F73ROOT', '/mnt/project-files/scenario/film-73-wont-die/').rstrip('/') + '/'
CW = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/f73/audio/clipwav').rstrip('/')
G = json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8')); SRC = {c['id']: c for c in (G if isinstance(G, list) else G['clips'])}
CUES = {'C1': ['So, by roughly 2032,', 'when you live through a year,', "you'll get back an entire year", 'from scientific progress.'],
        'C3': ['Leaky integrate-and-fire is, like,', 'one of the simpler neuron models.', 'So you take kind of, like,', 'an okay connectome.',
               'I should say, the connectome', 'scan also not perfect.'],
        'C4': ['But of course, when you think', 'about working into your 70s', 'in a three-stage life,', 'a full-time education,', 'full-time work,',
               'full-time retirement,', "that's obviously", 'not going to work.']}
SPOKEN = {'2032': 'twenty thirty two', '70s': 'seventies'}
WHO = {'C1': ('Ray Kurzweil', 'inventor and futurist', 'MIT lecture'), 'C3': ('Michael Andregg', 'CEO, Eon Systems', 'podcast'),
       'C4': ('Lynda Gratton', 'London Business School', 'interview')}
GAIN = {'C1': 0.0, 'C3': 0.0, 'C4': 0.0}
EXTRA = {'connectome': 'K AH N EH K T OW M', 'integrate': 'IH N T AH G R EY T'}
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
