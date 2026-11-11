#!/usr/bin/env python3
"""Film 26 · audio/clips.json (slot metadata + subtitle cues for the five interview clips) from <ROOT>clips.json.
Cue lines = the clip wording without speaker tags and filler words (uh, like, repeated words), max 34 characters; cue times are ESTIMATED
(spread over dauer_s by the character position of each cue's first words in the YouTube transcript, +-0.5 s): re-time them on the real footage.
usage: f26_clip_cues.py <audio_dir> [<ROOT>clips.json]"""
import json, re, sys
A = sys.argv[1].rstrip('/'); CJ = sys.argv[2] if len(sys.argv) > 2 else '/mnt/project-files/scenario/film-sparen/clips.json'
CUES = {  # (first raw words, subtitle line); the raw words are searched in order in the transcript
 'C1': [],   # the Short has burned-in subtitles: no cues of our own (coordinator 11.11.)
 'C2': [('Is that', 'Is that then taxed by the', 0.31), ('government', 'government and redistributed as', 1.17), ('some level', 'some level of income as a UHI', 2.75)],   # ends at UHI (cut)
 'C3': [('But next', 'But next year for sure, we will', 1.2), ('have over', 'have over a million robotaxis', 4.43), ('on the road', 'on the road.', 6.11)],
 'C4': [('But again', 'But again, there is no evidence', 0.49), ('from history', 'from history to show that.', 3.29)],   # "Perhaps." cut away
 'C5': [('Young people', 'Young people have come to wonder'), ('what would', 'what would be their lot'), ('when they', 'when they came to old age.'),
        ('The man', 'The man with a job has wondered'), ('how long', 'how long the job would last.')]}
src = {c['id']: c for c in json.load(open(CJ))['clips'] if c.get('kandidat', 'Empfehlung') == 'Empfehlung'}
CUT = json.load(open(CJ.replace('clips.json', 'clips/schnitt.json')))   # real cut lengths (dur) 11.11.
out = {'_comment': 'Film 26 slot metadata (format as films/25-last-job/audio/clips.json). dur = seconds of real footage (null until the clip is cut: build_vo.py then uses the planned dauer_s); '
                   'offset: footage starts this long after the slot opens; cues: [[seconds from the first footage frame, subtitle line]], cue_status estimated = spread over the planned length, re-time on the real footage.'}
for cid, rows in CUES.items():
    c = src[cid]; raw = re.sub(r'\[[^\]]*\]', '', c['transcript']); raw = re.sub(r'\s+', ' ', raw).strip(); L = float(c['dauer_s']); pos = 0; cues = []
    L = float(CUT[cid]['dur']); how = 'whisper' if rows and len(rows[0]) > 2 else 'estimated'
    for row in rows:
        key, line = row[:2]; assert len(line) <= 34, line
        if len(row) > 2: cues.append([row[2], line]); continue
        i = raw.find(key, pos) if key in raw else 0; pos = max(pos, i + 1)
        cues.append([round(i / len(raw) * L, 2), line])
    out[cid] = {'plan': float(c['dauer_s']), 'dur': L, 'offset': 0.0, 'name': c['speaker'].split(' (')[0], 'role': c.get('role', ''), 'source': c['url'], 'text': c['transcript'],
                'cue_status': how, 'cue_timing': how, 'cues': cues}
json.dump(out, open(A + '/clips.json', 'w'), indent=1, ensure_ascii=False)
for k, v in out.items():
    if k != '_comment': print(k, v['name'], v['cues'])
