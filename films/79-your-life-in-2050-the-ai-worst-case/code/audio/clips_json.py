#!/usr/bin/env python3
"""Film 79 (from Film 74 / 63) · clips_cfg.json + timing.json + <clipwav>/<id>.wav -> clips.json (read by subs.py). 
Subtitle cues for the clips: [seconds from the slot start, line <= 34 chars]. Each line starts on its first word, found by a pocketsphinx forced alignment of the
cut clip against 'align' (the heard wording); if the alignment fails, each line starts at its share of the characters across the voiced span (-40 dBFS).
usage: clips_json.py [audio_dir] [clipwav_dir]"""
import json, os, subprocess, sys
import numpy as np
A = (sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))).rstrip('/') + '/'
CW = (sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/f79/clips').rstrip('/')
CFG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'clips_cfg.json'))); SLOT = {c['id']: c for c in json.load(open(A + 'timing.json'))['slots']}
def align(f, text):
    """word start times (s) of text in the wav (pocketsphinx forced alignment, en-us); None if it fails"""
    try:
        from pocketsphinx import Decoder, Config, get_model_path
        d = Decoder(Config(hmm=get_model_path('en-us/en-us'), dict=get_model_path('en-us/cmudict-en-us.dict'), lm=None, loglevel='FATAL'))
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'])
        d.set_align_text(text); d.start_utt(); d.process_raw(raw, full_utt=True); d.end_utt()
        return [x.start_frame / 100 for x in d.seg() if not x.word.startswith(('<', '[', '+'))]
    except Exception as e: print('align failed', f, e); return None
out = []
for cid, c in CFG.items():
    if not cid.startswith('C') or cid not in SLOT: continue
    s = SLOT[cid]; f = f'{CW}/{cid}.wav'
    if os.path.exists(f):
        x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
        on = np.nonzero(20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2)) for i in range(0, len(x) - 160, 160)]) + 1e-9) > -40)[0]
        v0, v1 = on[0] * .01, (on[-1] + 1) * .01
    else: v0, v1 = .15, s['dur'] - .25
    L = [len(l) for l in c['cues']]; acc = np.concatenate([[0], np.cumsum(L)]) / sum(L)
    cues = [[round(v0 + (v1 - v0) * acc[k], 2), line] for k, line in enumerate(c['cues'])]
    st = align(f, c['align']) if os.path.exists(f) and c.get('align') else None
    if st and len(st) == len(c['align'].split()):   # line k starts on its first word
        n = 0
        for k, line in enumerate(c['cues']): cues[k][0] = round(max(0.0, st[n] - .05), 2); n += len(line.split())
        v1 = max(v1, st[-1] + .3)
    assert all(len(l) <= 34 for _, l in cues), cid
    out.append({'id': cid, 'kind': 'clip', 'speaker': c['speaker'], 'role': c['role'], 'source': c['source'], 'url': c['url'], 'src_start': c['src_start'], 'src_end': c['src_end'],
                'lower_third': c['lower_third'], 'file': c['file'], 'placeholder': s.get('placeholder', False), 'fallback': c.get('fallback', False), 'dur': s['dur'], 'slot_start': s['start'], 'slot_end': s['end'], 'sec': s['sec'],
                'transcript': ' '.join(c['cues']), 'burned': False, 'offset': 0, 'fade_in': 0.01, 'fade_out': 0.06, 'gain_db': 0, 'cues': cues, 'cue_end': round(v1 + .2, 2)})
json.dump({'_comment': 'Film 79 clip metadata (clips_json.py). placeholder true = the clip is not cut yet, its slot is silent. cues = [seconds from the slot start, subtitle line <= 34 chars].',
           'clips': out}, open(A + 'clips.json', 'w'), indent=1, ensure_ascii=False)
print('clips.json:', [(c['id'], c['slot_start'], c['dur'], 'PLACEHOLDER' if c['placeholder'] else 'real') for c in out])
