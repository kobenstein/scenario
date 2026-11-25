#!/usr/bin/env python3
"""Film 75 (from Film 69) · clips_meta.json (clip_cues.py: per clip id speaker/role/source/url/transcript, cut in the source file, subtitle cues
[[seconds from the clip start, line <= 34 chars], ...]) + timing.json -> clips.json (mix.py + subs.py read it; the picture can read file/file_in_s/file_out_s).
usage: clips_json.py [audio_dir]"""
import json, os, sys
A = (sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))).rstrip('/') + '/'
META = json.load(open(A + 'clips_meta.json'))
SLOT = {c['id']: c for c in json.load(open(A + 'timing.json'))['slots']}
out = []
for cid, s in SLOT.items():
    m = META[cid]
    assert all(len(l) <= 34 for _, l in m['cues']), cid
    assert abs((m['file_out_s'] - m['file_in_s']) - s['dur']) < .011, (cid, 'cut length != slot length: rerun make_segments.py + build_vo.py')
    out.append({'id': cid, 'kind': 'clip', **{k: m.get(k) for k in ('speaker', 'role', 'source', 'url', 'credit', 'transcript', 'file', 'file_in_s', 'file_out_s')},
                'dur': s['dur'], 'slot_start': s['start'], 'slot_end': s['end'], 'sec': s['sec'], 'burned': False, 'offset': 0,
                'fade_in': m['fade_in'], 'fade_out': m['fade_out'], 'gain_db': m.get('gain_db', 0),
                'word_start': m['word_start'], 'word_end': m['word_end'], 'cues': m['cues'], 'cue_end': m['cue_end']})
json.dump({'_comment': 'Film 75 clip metadata (clips_json.py from clips_meta.json + timing.json). Slot = timing.json slots[] (0.6 s air before/after); the slot plays the source file '
           'from file_in_s to file_out_s (cuts.json; same in/out for picture and sound); cues = [seconds from the slot start, line]; word_start/word_end = first/last spoken word, s from the slot start.',
           'clips': out}, open(A + 'clips.json', 'w'), indent=1, ensure_ascii=False)
print('clips.json:', [(c['id'], c['slot_start'], c['dur'], len(c['cues'])) for c in out])
