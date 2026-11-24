#!/usr/bin/env python3
"""Film 41 (from Film 67 / 66 / 59) · clip sound for build_vo.py / mix.py: the cut clip files in CLIPS (default films/41-assets/clips/Cn.mp4, already cut on the iMac,
clips-geprueft.json; the whole file is the clip; C4-alt-* are ignored) -> <out_dir>/<id>.wav (48 kHz stereo), loudness-normalised to -20 LUFS (two-pass loudnorm, linear)
with short fades (in 30 ms / out 60 ms) — Film 67 did this in cut_clips.py on the mp4; here the mp4s belong to the clip step, so only the wav is normalised.
Only slots that segments.json knows (C1..C3); a missing file = the slot stays a silent placeholder.
usage: clips_wav.py <out_dir> [clips_dir]"""
import glob, json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1].rstrip('/'); CLIPS = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F41CLIPS', os.path.normpath(os.path.join(HERE, '../../../41-assets/clips')))).rstrip('/')
os.makedirs(OUT, exist_ok=True)
def measure(f):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-vn', '-af', 'loudnorm=I=-20:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return json.loads(o[o.rfind('{'):o.rfind('}') + 1])
for s in json.load(open(os.path.join(HERE, 'segments.json'))):
    if not s.get('clip'): continue
    fs = [f for f in sorted(glob.glob(f"{CLIPS}/{s['id']}.*")) if f.rsplit('.', 1)[1].lower() in ('mp4', 'mov', 'm4a', 'wav', 'mp3', 'mkv', 'webm')]
    if not fs:
        if os.path.exists(f"{OUT}/{s['id']}.wav"): os.remove(f"{OUT}/{s['id']}.wav")
        print(s['id'], 'no clip file: silent placeholder', s['dur'], 's'); continue
    m = measure(fs[0]); d = s['dur']
    af = (f"loudnorm=I=-20:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
          f":offset={m['target_offset']}:linear=true,aresample=48000,afade=t=in:d=0.03,afade=t=out:st={d - 0.06:.3f}:d=0.06")
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', fs[0], '-vn', '-af', af, '-ac', '2', '-ar', '48000', f"{OUT}/{s['id']}.wav"])
    print(s['id'], os.path.basename(fs[0]), d, 's, was', m['input_i'], 'LUFS ->', measure(f"{OUT}/{s['id']}.wav")['input_i'])
