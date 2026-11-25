#!/usr/bin/env python3
"""Film 76 · exact cuts of the four interview clips C1 C2 C4 C5. Source = the buffered files films/76-assets/clips/Cn.mp4 (1 s of buffer before and after, clips.json);
output = <out_dir>/Cn.mp4 (default /tmp/claude-0/f76/clips, copied to <ROOT>clips/ by hand): video re-encoded frame-exact (H.264 CRF 18, AAC 192k), audio loudness-normalised to
-20 LUFS single pass, fade in 30 ms / out 50-60 ms. The sources are NOT overwritten (the picture code reads them).
In/out points: moved onto the real speech boundaries from a 10-ms RMS scan (pauses) + pocketsphinx forced alignment + Whisper words (fal-ai/whisper chunk_level word on the buffered file),
so every cut starts inside the pause before the first word and ends inside the pause after the last word; whole sentences, fillers (uh, um, doubled words) stay in the sound.
  C1 Gopnik   in 0.97 (dip -48 dB between the breath and 'And' at 1.02)  out 18.22 ('intelligence' ends 18.13, noise floor to 18.30, next 'And' 18.33)
  C2 Susskind in 0.90 (silence -65 dB, 'And' at 0.99)                    out 8.06  ('dead end' ends ~7.95, silence to 8.68; cut BEFORE 'And I want to give you an example')
  C4 Acemoglu in 0.74 (gap -45 dB after the false start 'AI is going to be,' 'the' 0.82, 'direction' 0.98)  out 12.32 ('exercised' ends ~12.2, silence to 12.52 where the host says 'And so')
  C5 Susskind in 0.99 (dip -44 dB after the previous sentence's last word 'work' 0.81-0.93, quiet 'And' at 1.03, 'so' 1.20; first try 0.76 left 'work' in)  out 10.03 ('do' ends 9.99; 'particularly' follows after a 20-ms dip: the sentence goes on, this is the agreed cut)
usage: cut_clips.py [out_dir] [ids...]"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '../../../76-assets/clips'))
OUT = (sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else '/tmp/claude-0/f76/clips').rstrip('/')
CUT = {'C1': (0.97, 18.22, 0.06), 'C2': (0.90, 8.06, 0.06), 'C4': (0.74, 12.32, 0.06), 'C5': (0.99, 10.03, 0.05)}   # id: (in s, out s, fade-out s) inside the buffered file
os.makedirs(OUT, exist_ok=True)
for c, (a, b, fo) in CUT.items():
    if len(sys.argv) > 2 and c not in sys.argv[2:]: continue
    d = round(b - a, 3)
    af = f'loudnorm=I=-20:TP=-2:LRA=11,afade=t=in:d=0.03,afade=t=out:st={d - fo:.3f}:d={fo},aresample=48000'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a}', '-i', f'{SRC}/{c}.mp4', '-t', f'{d}', '-af', af,
                    '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'{OUT}/{c}.mp4'], check=True)
    print(c, a, '->', b, '=', d, 's')
