#!/usr/bin/env python3
"""Film 66 · <ROOT>clips-geprueft.json + timing.json -> clips.json (code/audio only; NOT copied to <ROOT>audio/, the picture kit reads its own clip format there).
Subtitle cues for the clips: [seconds from the slot start, line <= 34 chars], times = the checked word times (t_clip) of the first word of the phrase.
Fillers dropped in the subtitles (allowed by the brief, sense unchanged): 'It, it' -> 'It', 'um', 'I mean', 'like', 'you know', false start 'we should be ... about'.
usage: clips_json.py [audio_dir]"""
import json, os, sys
A = (sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))).rstrip('/') + '/'
ROOT = os.environ.get('F66ROOT', '/mnt/project-files/scenario/film-geld-nach-si/').rstrip('/') + '/'
SRC = {c['id']: c for c in json.load(open(ROOT + 'clips-geprueft.json'))['clips']}
SLOT = {c['id']: c for c in json.load(open(A + 'timing.json'))['slots']}
META = {'C1': ('Sam Altman', 'CEO, OpenAI', 'OpenAI Town Hall with Sam Altman (OpenAI, Jan 2026)'),
        'C2': ('Elon Musk', 'CEO, Tesla & SpaceX', 'The Builders with Walter Isaacson (Oct 2026)'),
        'C3': ('Demis Hassabis', 'CEO, Google DeepMind', 'Lex Fridman Podcast #475 (Jul 2025)'),
        'C4': ('Daron Acemoglu', 'Economist, MIT, Nobel 2024', 'World Economic Forum, Radio Davos (Oct 2026)')}
# (index of the word whose t_clip starts the cue, line)
CUES = {'C1': [(0, 'It looks like on the whole,'), (7, 'given certainly progress'), (10, 'with work you can do'), (15, 'in front of a computer,'),
               (20, 'but also what looks like'), (25, 'it will soon happen with robotics'), (31, 'and a bunch of other things,'), (38, "we're going to have"),
               (42, 'massively deflationary pressure')],
        'C2': [(0, 'As you heard me say,'), (10, "I don't think money's going"), (16, 'to matter in the future.'), (21, 'Anyone will be able to have'),
               (29, 'any goods and services'), (33, 'that they want.')],
        'C3': [(0, '…but it will at least remove'), (7, 'one of the big vectors,'), (14, 'which is scarcity of resources,'), (21, 'including land and more materials'),
               (26, 'and energy.'), (35, 'I sometimes call it,'), (40, 'and others call it,'), (45, 'this kind of radical abundance')],
        'C4': [(0, 'One telltale sign of automation'), (5, "is that labor's share"), (9, 'of value added in industry,'), (14, "or labor's share"),
               (17, 'in national income,'), (20, 'is going down.')]}
out = []
for cid, c in SRC.items():
    wz, s = c['wortzeiten'], SLOT[cid]
    cues = [[round(wz[i]['t_clip'], 2), line] for i, line in CUES[cid]]
    assert all(len(l) <= 34 for _, l in cues), cid
    sp, role, src = META[cid]
    out.append({'id': cid, 'kind': 'clip', 'speaker': sp, 'role': role, 'source': src, 'url': c['url'], 'credit': c.get('credit'), 'lower_third': c.get('bauchbinde'),
                'file': f'{cid}.mp4', 'file_in_s': 0.0, 'file_out_s': c['dauer_s'], 'dur': s['dur'], 'slot_start': s['start'], 'slot_end': s['end'], 'sec': s['sec'],
                'transcript': c['wortlaut'], 'burned': False, 'offset': 0, 'fade_in': 0.01, 'fade_out': 0.06, 'gain_db': 0,
                'cues': cues, 'cue_end': round(min(wz[-1]['t_clip'] + 0.6, c['dauer_s'] - 0.05), 2)})
json.dump({'_comment': 'Film 66 clip metadata (clips_json.py). The cut files <ROOT>clips/Cn.mp4 ARE the clips (file_in_s 0). Slot = timing.json slots[] (0.6 s air before/after). cues = [seconds from the slot start, subtitle line <= 34 chars] from clips-geprueft.json word times.',
           'clips': out}, open(A + 'clips.json', 'w'), indent=1, ensure_ascii=False)
print('clips.json:', [(c['id'], c['slot_start'], c['dur'], len(c['cues'])) for c in out])
