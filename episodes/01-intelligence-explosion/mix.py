#!/usr/bin/env python3
"""Episode 01 sound mix: cut VO + 3 music cues + Mirelo accents/foley -> -14 LUFS, muxed onto the (subtitled) video.

Usage: python3 mix.py <video_in> <video_out>
Inputs (in /mnt/project-files/scenario/folge-01/audio/): music-a/b/c.mp3 (see audio/music.json), sfx/*.wav listed in audio/sfx.json,
the VO master from audio/vo-master.wav (repo).
Rules (Jakob): accents must be clearly audible, so the music ducks briefly under each accent; VO always intelligible.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
AUD = "/mnt/project-files/scenario/folge-01/audio"
VIN, VOUT = sys.argv[1], sys.argv[2]
T = json.load(open(os.path.join(HERE, "film", "timing.json")))
SPLIT_AB = [s for s in T["sections"] if s["id"] == "endings"][0]["start"]   # cyan FILL carrier
SPLIT_BC = [s for s in T["sections"] if s["id"] == "yourpart"][0]["start"]
sfxp = os.path.join(HERE, "audio", "sfx.json")
SFX = json.load(open(sfxp)) if os.path.exists(sfxp) else []   # [{file, t, gain, trim?}]
# music automation: (start, end, gain) multiplies the music bed (e.g. the whispered "Again." drop)
AUTO = [(29.5, 36.7, 0.18), (332.2, 337.8, 1.6)]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-3000:])
    return r


dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIN]).stdout)
ms = lambda s: max(0, int(round(s * 1000)))
X = 0.35  # crossfade at cue splices
inputs = ["-i", VIN, "-i", os.path.join(HERE, "audio", "vo-master.wav"),
          "-i", f"{AUD}/music-a.mp3", "-i", f"{AUD}/music-b.mp3", "-i", f"{AUD}/music-c.mp3"]
auto = "*".join(f"(1-{1 - g}*between(t,{a},{b}))" for a, b, g in AUTO)
fc = [
    "[1:a]aresample=48000,apad,asplit=2[vo][vokey]",
    f"[2:a]aresample=48000,atrim=0:{SPLIT_AB + X},asetpts=PTS-STARTPTS[ma]",
    f"[3:a]aresample=48000,atrim=0:{SPLIT_BC - SPLIT_AB + X},asetpts=PTS-STARTPTS[mb]",
    "[4:a]aresample=48000[mc]",
    f"[ma][mb]acrossfade=d={X}:c1=tri:c2=tri[mab]",
    f"[mab][mc]acrossfade=d={X}:c1=tri:c2=tri,loudnorm=I=-23:TP=-4,volume='{auto}':eval=frame[mus0]",
]
# accents: each becomes its own stream; a copy of all accents also ducks the music (sidechain) so they cut through
labels, keys = [], []   # beds (continuous foley) are mixed in but do not duck the music; accents do
for k, s in enumerate(SFX):
    inputs += ["-i", os.path.join(AUD, "sfx", s["file"])]
    idx = 5 + k
    fc.append(f"[{idx}:a]aresample=48000,atrim=start={s.get('trim', 0)},asetpts=PTS-STARTPTS,volume={s.get('gain', 1.0)},"
              f"adelay={ms(s['t'])}:all=1,apad[s{k}]")
    (labels if s.get("bed") else keys).append(f"[s{k}]")
if keys:   # accents: one copy into the mix, one as sidechain key
    fc.append(f"{''.join(keys)}amix=inputs={len(keys)}:normalize=0,asplit=2[acc][fxkey]")
    labels.append("[acc]")
if labels:
    fc.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0[fx]")
    if keys:
        fc.append("[mus0][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450[mus1]")
        fc.append("[mus1][fxkey]sidechaincompress=threshold=0.05:ratio=4:attack=5:release=300[mus]")
    else:
        fc.append("[mus0][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450[mus]")
    fc.append(f"[vo][mus][fx]amix=inputs=3:duration=first:normalize=0,atrim=0:{dur},afade=t=out:st={dur - 1.5}:d=1.5[pre]")
else:
    fc.append("[mus0][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450[mus]")
    fc.append(f"[vo][mus]amix=inputs=2:duration=first:normalize=0,atrim=0:{dur},afade=t=out:st={dur - 1.5}:d=1.5[pre]")
graph = ";".join(fc)


def render(extra, out_args):
    return run(["ffmpeg", "-hide_banner", "-y"] + inputs + ["-filter_complex", graph + extra] + out_args)


# pass 1: measure, pass 2: linear loudnorm to -14 LUFS / -1 dBTP
err = render(";[pre]loudnorm=I=-14:TP=-1:LRA=11:print_format=json[a]", ["-map", "[a]", "-f", "null", "-"]).stderr
m = json.loads(err[err.rfind("{"):err.rfind("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
render(f";[pre]{ln},aresample=48000[a]", ["-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                                          "-movflags", "+faststart", "-shortest", VOUT])
check = run(["ffmpeg", "-hide_banner", "-i", VOUT, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
print(VOUT, re.findall(r"I:\s+(-?[\d.]+) LUFS", check)[-1], "LUFS")
