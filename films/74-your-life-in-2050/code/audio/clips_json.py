#!/usr/bin/env python3
"""Film 63 · clips_cfg.json + timing.json (+ <clipwav>/<id>.wav when cut) -> clips.json (code/audio only, read by mix.py and subs.py).
Subtitle cues for the clips: [seconds from the slot start, line <= 34 chars]. No checked word times yet (clips not cut, 24.11.): each line starts at its share
of the characters across the clip's voiced span (-40 dBFS, 10-ms frames; placeholder = 0.15 s .. dur - 0.25 s). Once the clips are in and Whisper-checked,
replace by real word times if a cue visibly runs early or late.
usage: clips_json.py [audio_dir] [clipwav_dir]"""
import json, os, subprocess, sys
import numpy as np
A = (sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))).rstrip('/') + '/'
CW = (sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/f63/audio/clipwav').rstrip('/')
CFG = json.load(open(A + 'clips_cfg.json')); SLOT = {c['id']: c for c in json.load(open(A + 'timing.json'))['slots']}
out = []
for cid, c in CFG.items():
    if not cid.startswith('C'): continue
    s = SLOT[cid]; f = f'{CW}/{cid}.wav'
    if os.path.exists(f):
        x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
        on = np.nonzero(20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2)) for i in range(0, len(x) - 160, 160)]) + 1e-9) > -40)[0]
        v0, v1 = on[0] * .01, (on[-1] + 1) * .01
    else: v0, v1 = .15, s['dur'] - .25
    L = [len(l) for l in c['cues']]; acc = np.concatenate([[0], np.cumsum(L)]) / sum(L)
    cues = [[round(v0 + (v1 - v0) * acc[k], 2), line] for k, line in enumerate(c['cues'])]
    assert all(len(l) <= 34 for _, l in cues), cid
    out.append({'id': cid, 'kind': 'clip', 'speaker': c['speaker'], 'role': c['role'], 'source': c['source'], 'url': c['url'], 'src_start': c['src_start'], 'src_end': c['src_end'],
                'lower_third': c['lower_third'], 'file': f'{cid}.mp4', 'placeholder': s.get('placeholder', False), 'dur': s['dur'], 'slot_start': s['start'], 'slot_end': s['end'], 'sec': s['sec'],
                'transcript': ' '.join(c['cues']), 'burned': False, 'offset': 0, 'fade_in': 0.01, 'fade_out': 0.06, 'gain_db': 0, 'cues': cues, 'cue_end': round(v1 + .2, 2)})
json.dump({'_comment': 'Film 63 clip metadata (clips_json.py). placeholder true = the clip is not cut yet, its slot is silent. cues = [seconds from the slot start, subtitle line <= 34 chars].',
           'clips': out}, open(A + 'clips.json', 'w'), indent=1, ensure_ascii=False)
print('clips.json:', [(c['id'], c['slot_start'], c['dur'], 'PLACEHOLDER' if c['placeholder'] else 'real') for c in out])
