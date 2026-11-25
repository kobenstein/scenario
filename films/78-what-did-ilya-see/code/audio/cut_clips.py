#!/usr/bin/env python3
"""Film 67 · cut the interview clips C1-C4 out of the 60 s source windows (films/78-assets/clips/Cn-<name>.mp4, clips.md) -> films/78-assets/clips/Cn.mp4
(video re-encoded frame-exact, H.264 CRF 18, + AAC 192k; audio loudness-normalised to -20 LUFS single pass, so the quiet Tao lecture (-35 dB mean) comes up; fades in 30 ms / out 60 ms).
In/out points: clips.md quote windows, moved onto the real speech boundaries from a 10-ms RMS scan (pauses), with ~0.15 s handles where the pause allows it;
C1 ends inside the 0.16 s gap after "very close" (Wang runs on into "and this is ..."), so there the handle is only ~0.1 s;
C3 starts in the 0.1 s dip between "And" and "it hasn't" (handle ~0.07 s + 30 ms fade). Checked: pocketsphinx alignment of the quote
on the cut file (all words, nothing extra) + Whisper on the cut. make_segments.py then reads the slot lengths from Cn.mp4.
usage: cut_clips.py [clips_dir or ""] [ids...]"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
D = (sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else os.path.normpath(os.path.join(HERE, '../../../78-assets/clips'))).rstrip('/')
CUT = {   # id: (source, in s, out s)   clips.md window -> boundary
    'C1': ('C1-wang', 15.83, 26.20),     # 0:15.9-0:26.2  speech 15.98 .. 'close' ~26.08 | 'and this' 26.24
    'C2': ('C2-maynard', 25.49, 36.40),  # 0:26.0-0:35.6  'So,' starts 25.64; 'numbers' (its final s) decays to 36.26, next 'So we're' at 36.52
    'C3': ('C3-tao', 20.19, 29.27),      # 0:20.2-0:29.4  drops the leading 'And' (19.84-20.14, dip at 20.20), 'it' at 20.26 .. 'explain it' 29.12, silence to 29.48
    'C4': ('C4-lecun', 0.06, 6.75),      # 0:00.2-0:06.5  speech 0.08 .. 'happen' ~6.6, silence to 6.98
}
for c, (src, a, b) in CUT.items():
    if len(sys.argv) > 2 and c not in sys.argv[2:]: continue
    d = round(b - a, 3)
    af = f'loudnorm=I=-20:TP=-2:LRA=11,afade=t=in:d=0.03,afade=t=out:st={d - 0.06:.3f}:d=0.06,aresample=48000'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a}', '-i', f'{D}/{src}.mp4', '-t', f'{d}', '-af', af,
                    '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'{D}/{c}.mp4'], check=True)
    print(c, src, a, '->', b, '=', d, 's')
