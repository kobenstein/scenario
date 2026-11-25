#!/usr/bin/env python3
"""Film 75 (from Film 69) · subtitle cues for the three clips: pocketsphinx forced alignment of the wording (cuts.json transcript = clips_zeiten.txt,
faster-whisper, re-checked with fal-ai/wizper on the cut sound 25.11.) on the clip sound (<clipwav>/<id>.wav = the cut, clips_wav.py)
-> clips_meta.json (speaker, role, source, url, transcript, cues [[seconds from the clip start, line <= 34]], first/last word, gain_db).
clips_json.py then turns clips_meta.json + timing.json into clips.json (mix.py + subs.py).
CUES = the subtitle lines (exact wording, numbers as digits); SPOKEN = how a token is said where it differs (alignment only).
usage: clip_cues.py [clipwav_dir]"""
import json, os, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
HERE = os.path.dirname(os.path.abspath(__file__))
CW = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/f75/audio/clipwav').rstrip('/')
SRC = {k: v for k, v in json.load(open(os.path.join(HERE, 'cuts.json'), encoding='utf8')).items() if not k.startswith('_')}
CUES = {'C2': ['Citizens and governments', "should not accept the companies'", 'claim that they are', 'trapped in a race.', 'The race is not a law of nature.',
               'It is the product of choices.'],
        'K1': ['…modern humanity is distinguished', 'by Paleolithic emotions', 'and medieval institutions', 'like banks and religions', 'and godlike technology.'],
        'C1': ['…if for every $10', 'we spend on developing', 'artificial intelligence,', 'we could invest at least $1', 'in developing our consciousness,',
               "I think we'll be okay.", 'But this is not the current', 'trajectory we are on.']}
SPOKEN = {'$10': 'ten dollars', '$1': 'one dollar', "companies'": 'companies'}
GAIN = json.load(open(os.path.join(HERE, 'clip_gain.json'))) if os.path.exists(os.path.join(HERE, 'clip_gain.json')) else {}
EXTRA = {'paleolithic': 'P EY L IY AH L IH TH IH K', 'godlike': 'G AA D L AY K'}
norm = lambda w: re.sub(r"[^a-z_']", '', w.lower().replace('’', "'"))
cfg = Config(hmm=get_model_path('en-us/en-us'), dict=get_model_path('en-us/cmudict-en-us.dict'), lm=None, loglevel='FATAL')
dec = Decoder(cfg)
for w, p in EXTRA.items():
    try: dec.add_word(w, p, False)
    except RuntimeError: pass
meta = {}
for cid, lines in CUES.items():
    c = SRC[cid]; dur = round(c['out_s'] - c['in_s'], 2)
    words = ' '.join(lines).split()
    assert [re.sub(r'[^\w$]', '', w).lower() for w in words] == [re.sub(r'[^\w$]', '', w).lower() for w in c['transcript'].split()], (cid, 'cue lines != wording')
    assert all(len(l) <= 34 for l in lines), cid
    sub, first = [], []
    for l in lines:
        first.append(len(sub))
        for w in l.split():
            for p in SPOKEN.get(w.strip('.,…'), w).split(): sub.append(norm(p))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f'{CW}/{cid}.wav', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    dec.set_align_text(' '.join(sub)); dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    seg = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in dec.seg() if x.word not in ('<s>', '</s>', '<sil>') and not x.word.startswith(('[', '<', '+'))]
    assert len(seg) == len(sub), (cid, len(seg), len(sub))
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    quiet = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2) + 1e-12) for i in range(0, len(x) - 160, 160)])) < -46
    def unpause(t):
        i = int(t * 100)
        while i < len(quiet) and quiet[i]: i += 1
        return i / 100
    cues = [[round(max(0.0, unpause(seg[k][1]) - 0.05), 2), l] for k, l in zip(first, lines)]
    meta[cid] = {'speaker': c['speaker'], 'role': c['role'], 'source': c['source'], 'url': c['url'], 'credit': c['credit'], 'transcript': c['transcript'],
                 'file': c['file'], 'file_in_s': c['in_s'], 'file_out_s': c['out_s'], 'fade_in': c.get('fade_in', .01), 'fade_out': c.get('fade_out', .06),
                 'cues': cues, 'cue_end': round(min(seg[-1][2] + 0.4, dur - 0.05), 2), 'word_start': round(seg[0][1], 2), 'word_end': round(seg[-1][2], 2),
                 'gain_db': GAIN.get(cid, 0.0)}
    print(cid, dur, 's · first word', seg[0], '· last word', seg[-1], '·', cues)
json.dump(meta, open(os.path.join(HERE, 'clips_meta.json'), 'w'), indent=1, ensure_ascii=False)
