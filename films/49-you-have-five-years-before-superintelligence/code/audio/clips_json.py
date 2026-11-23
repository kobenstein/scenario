#!/usr/bin/env python3
"""Film 49 (from Film 66) · <ROOT>clips-geprueft.json + timing.json -> clips.json (code/audio only; NOT copied to <ROOT>audio/, the picture kit reads its own clip format there).
Runs only once the checked clip file exists (the real clips arrive on 23.11. evening). Format as Film 66: clips[] with id, url, dauer_s, wortlaut, wortzeiten
[{wort, t_clip}], bauchbinde, credit. Subtitle cues for a clip: [seconds from the slot start, line <= 34 chars], packed automatically from the checked
word times (a new cue at a comma/full stop when the line already holds >= 14 characters, never over 34). Fillers ('um', 'uh') are dropped.
Without clips-geprueft.json: no clips.json is written (the slots stay without clip subtitles; mix.py and subs.py work without it).
usage: clips_json.py [audio_dir]"""
import json, os, re, sys
A = (sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))).rstrip('/') + '/'
ROOT = os.environ.get('F49ROOT', '/mnt/project-files/scenario/film-vorbereiten/').rstrip('/') + '/'
if not os.path.exists(ROOT + 'clips-geprueft.json'):
    print('no', ROOT + 'clips-geprueft.json', '-> clips.json not written (placeholder slots)'); sys.exit(0)
SRC = {c['id']: c for c in json.load(open(ROOT + 'clips-geprueft.json'))['clips']}
SLOT = {c['id']: c for c in json.load(open(A + 'timing.json'))['slots']}
META = {'C13': ('Yuval Noah Harari', 'Historian, author', "Yuval Noah Harari, 'The end of lifetime careers' (Aug 2026)"),
        'C5': ('Erik Brynjolfsson', 'Stanford Digital Economy Lab', "Stanford Digital Economy Lab, 'We Must Act Now' (Jul 2026)"),
        'C16': ('Yuval Noah Harari', 'Historian, author', "Yuval Noah Harari, 'Who is raising our children?' (Sep 2026)"),
        'C2': ('Bernie Sanders', 'U.S. Senator', "Senator Bernie Sanders, 'Who will own and control the future of AI?' (Jun 2026)")}
FILL = {'um', 'uh', 'um,', 'uh,'}
def pack(wz, maxc=34, minc=14):
    cues, cur, t0 = [], [], None
    for w in wz:
        word = str(w.get('wort', w.get('w', ''))).strip()
        if not word or word.lower() in FILL: continue
        if cur and len(' '.join(cur + [word])) > maxc: cues.append([round(t0, 2), ' '.join(cur)]); cur = []
        if not cur: t0 = float(w['t_clip'])
        cur.append(word)
        if len(' '.join(cur)) >= minc and re.search(r'[,.;:?!]$', word): cues.append([round(t0, 2), ' '.join(cur)]); cur = []
    if cur: cues.append([round(t0, 2), ' '.join(cur)])
    return cues
out = []
for cid, c in SRC.items():
    if cid not in SLOT: print('skip', cid, '(no slot)'); continue
    wz, s = c.get('wortzeiten') or [], SLOT[cid]
    if isinstance(wz, str): wz = json.loads(wz.replace("'", '"'))
    cues = pack(wz)
    assert all(len(l) <= 34 for _, l in cues), cid
    sp, role, src = META.get(cid, ('', '', ''))
    dauer = float(c.get('dauer_s', s['dur']))
    out.append({'id': cid, 'kind': 'clip', 'speaker': sp, 'role': role, 'source': src, 'url': c.get('url'), 'credit': c.get('credit'), 'lower_third': c.get('bauchbinde'),
                'file': f'{cid}.mp4', 'file_in_s': 0.0, 'file_out_s': dauer, 'dur': s['dur'], 'slot_start': s['start'], 'slot_end': s['end'], 'sec': s['sec'],
                'transcript': c.get('wortlaut'), 'burned': False, 'offset': 0, 'fade_in': 0.01, 'fade_out': 0.06, 'gain_db': 0,
                'cues': cues, 'cue_end': round(min(float(wz[-1]['t_clip']) + 0.6, dauer - 0.05), 2) if wz else round(dauer - 0.05, 2)})
json.dump({'_comment': 'Film 49 clip metadata (clips_json.py). The cut files <ROOT>clips/Cn.mp4 ARE the clips (file_in_s 0). Slot = timing.json slots[] (0.6 s air before/after). cues = [seconds from the slot start, subtitle line <= 34 chars] packed from clips-geprueft.json word times.',
           'clips': out}, open(A + 'clips.json', 'w'), indent=1, ensure_ascii=False)
print('clips.json:', [(c['id'], c['slot_start'], c['dur'], len(c['cues'])) for c in out])
