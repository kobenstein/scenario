#!/usr/bin/env python3
"""Film 68 · clips_meta.json (hand-filled when the real cuts are in: per clip id speaker/role/source/url/transcript + subtitle cues
[[seconds from the clip start, line <= 34 chars], ...], from the checked wording) + timing.json -> clips.json (code/audio only; mix.py + subs.py read it).
No clips_meta.json / no entry for a slot = no clip subtitles for it (placeholder slots). Do NOT keep Film 66's clips.json here: subs.py would print its lines.
usage: clips_json.py [audio_dir]"""
import json, os, sys
A = (sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))).rstrip('/') + '/'
META = json.load(open(A + 'clips_meta.json')) if os.path.exists(A + 'clips_meta.json') else {}
SLOT = {c['id']: c for c in json.load(open(A + 'timing.json'))['slots']}
out = []
for cid, s in SLOT.items():
    m = META.get(cid)
    if not m or s.get('placeholder'): print(cid, 'skipped (placeholder or no metadata)'); continue
    assert all(len(l) <= 34 for _, l in m.get('cues', [])), cid
    out.append({'id': cid, 'kind': 'clip', **{k: m.get(k) for k in ('speaker', 'role', 'source', 'url', 'credit', 'lower_third', 'transcript')},
                'file': s.get('file'), 'file_in_s': 0.0, 'file_out_s': s['dur'], 'dur': s['dur'], 'slot_start': s['start'], 'slot_end': s['end'], 'sec': s['sec'],
                'burned': False, 'offset': 0, 'fade_in': 0.01, 'fade_out': 0.06, 'gain_db': m.get('gain_db', 0),
                'cues': m.get('cues', []), 'cue_end': m.get('cue_end', round(s['dur'] - 0.05, 2))})
json.dump({'_comment': 'Film 68 clip metadata (clips_json.py from clips_meta.json). Slot = timing.json slots[] (0.6 s air before/after); cues = [seconds from the slot start, line].',
           'clips': out}, open(A + 'clips.json', 'w'), indent=1, ensure_ascii=False)
print('clips.json:', [(c['id'], c['slot_start'], c['dur'], len(c['cues'])) for c in out])
