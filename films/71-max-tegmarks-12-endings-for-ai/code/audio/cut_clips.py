#!/usr/bin/env python3
"""Film 71 (from Film 68) · cut the five interview clips out of the iMac source windows films/71-assets/clips/Cn.mp4 (clips-geprueft-imac.json: line_start_s / line_end_s,
seconds inside the window) -> <scratch>/cut/Cn.mp4 (video re-encoded frame-exact at its own frame rate, H.264 CRF 18, + AAC 192k 48 kHz stereo; audio loudness-normalised
to -20 LUFS single pass; fades in 30 ms / out 60 ms) + cut_clips.json here (in/out per clip, for the picture step: same cut from the same source).
In/out points: the json line times, moved onto the real speech boundaries from a 20-ms RMS scan + Whisper word times on the windows (fal-ai/whisper, 25.11.):
  C1 21.6-28.6 -> 21.50-28.85: 'This is in the rearview mirror ... this summer.' (a short click at 21.3 stays out; next speech 29.45)
  C2 50.7-59.3 -> 51.45-59.55: starts on 'P(doom)' in the 20-ms dip after the 'my my my' stutter (coordinator: clean start ~51.4); 'It's very low' at 60.45 stays out
  C4 17.8-23.9 -> 17.72-24.15: 'So, the goal of of these companies ... than us.' (pause 17.45-17.78 before it)
  C5 31.4-39.1 -> 31.30-39.40: 'we may have to pace ... capability levels' ('or' before 31.1 stays out; next speech 39.75)
  C6 19.7-28.0 -> 20.10-28.35: 'We know that ... It's for us to decide.' 'road.' ends ~19.6 and its hall tail decays to -43 dB at 20.15; 'We' starts 20.22
     (the iMac's 19.5 would keep the end of 'road'). Hall echo with a -29 dB floor: gentle downward expander (agate, ratio 2, range -10 dB) before loudnorm.
Checked: pocketsphinx alignment of the wording on every cut (clip_cues.py: all words, nothing extra).
usage: cut_clips.py [ids...]"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '../../../71-assets/clips'))
OUT = os.environ.get('F71CUT', '/tmp/claude-0/f71/audio/cut').rstrip('/')
CUT = {'C1': (21.50, 28.85), 'C2': (51.45, 59.55), 'C4': (17.72, 24.15), 'C5': (31.30, 39.40), 'C6': (20.10, 28.35)}
GATE = {'C6': 'agate=threshold=0.03:ratio=2:range=0.316:attack=5:release=180:knee=4,'}   # threshold ~-30 dBFS, at most -10 dB on the hall floor
J = {c['id']: c for c in json.load(open(f'{SRC}/clips-geprueft-imac.json'))['clips']}
os.makedirs(OUT, exist_ok=True)
meta = {}
for c, (a, b) in CUT.items():
    meta[c] = {'source': f'films/71-assets/clips/{c}.mp4', 'video': J[c]['video'], 'window': J[c]['window'], 'in_s': a, 'out_s': b, 'dur': round(b - a, 3),
               'imac_line_s': [J[c]['line_start_s'], J[c]['line_end_s']], 'audio': GATE.get(c, '') + 'loudnorm I=-20, fade 0.03 / 0.06', 'cut_file': f'{OUT}/{c}.mp4'}
    if len(sys.argv) > 1 and c not in sys.argv[1:]: continue
    d = round(b - a, 3)
    af = f'{GATE.get(c, "")}loudnorm=I=-20:TP=-2:LRA=11,afade=t=in:d=0.03,afade=t=out:st={d - 0.06:.3f}:d=0.06,aresample=48000'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a}', '-i', f'{SRC}/{c}.mp4', '-t', f'{d}', '-af', af, '-ac', '2',
                    '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'{OUT}/{c}.mp4'], check=True)
    print(c, a, '->', b, '=', d, 's')
json.dump({'_comment': 'Film 71 clip cuts (cut_clips.py). Seconds inside the iMac source window films/71-assets/clips/Cn.mp4. The slot length in timing.json = dur (ffprobe of the cut).',
           'clips': meta}, open(os.path.join(HERE, 'cut_clips.json'), 'w'), indent=1, ensure_ascii=False)
