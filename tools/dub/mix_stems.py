#!/usr/bin/env python3
"""Mix a dubbed VO onto the original film's music/SFX bed recovered by stem separation (demucs: drums+bass+other).
The bed already carries the original ducking, so the dub VO is only matched to the loudness of the separated
original vocals and laid on top; light extra ducking hides vocal residue. Two-pass loudnorm -14 LUFS / -1 dBTP.
usage: mix_stems.py <lang_dir> <bed.wav> <orig_vocals>   -> <lang_dir>/mix.wav"""
import json, subprocess, sys
import numpy as np
L, BED, OV = sys.argv[1].rstrip('/') + '/', sys.argv[2], sys.argv[3]; SR = 48000
def load(f, ch=2):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def arms(x):                                  # rms over active (non-silent) 10 ms frames
    m = np.abs(x).max(1); hop = SR // 100; f = [x[i:i + hop] for i in range(0, len(x) - hop, hop) if m[i:i + hop].max() > 0.01]
    return float(np.sqrt(np.mean(np.concatenate(f) ** 2)))
bed = load(BED); N = len(bed)
vo = load(L + 'vo_master.wav')[:N]; vo = np.pad(vo, ((0, N - len(vo)), (0, 0)))
vo *= arms(load(OV)[:N]) / arms(vo)
env = np.abs(vo).max(1); hop = SR // 100
e = np.array([env[i:i + hop].max() for i in range(0, N, hop)]) > 0.02
act = np.zeros(len(e)); a = 0.0
for i, v in enumerate(e): a = min(1, a + .12) if v else max(0, a - .02); act[i] = a
duck = np.interp(np.arange(N), np.arange(len(act)) * hop, act)
mix = vo + bed * (1 - 0.2 * duck)[:, None]    # ~-2 dB extra under the dub voice
P = L + 'premix.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', P], input=mix.astype(np.float32).tobytes(), check=True)
o = subprocess.run(['ffmpeg', '-hide_banner', '-i', P, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(o[o.rfind('{'):o.rfind('}') + 1])
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', P, '-af', af, '-ar', '48000', L + 'mix.wav'], check=True)
print('premix', m['input_i'], 'LUFS -> mix.wav')
