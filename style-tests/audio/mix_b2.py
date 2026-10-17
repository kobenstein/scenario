#!/usr/bin/env python3
"""B2 sound mix: VO (George) + music + Mirelo accents + city ambience -> -14 LUFS, muxed onto the B2 video.

Usage: python3 mix_b2.py [video_in] [video_out]
Downloads missing audio into /mnt/project-files/scenario/audio/b2/, picks the best
of each accent's variants (sharpest onset, lowest noise floor), mixes and muxes with -c:v copy.
"""
import json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
AUD = "/mnt/project-files/scenario/audio/b2"
VIN = sys.argv[1] if len(sys.argv) > 1 else "/mnt/project-files/scenario/stil-tests/B2-papier-diorama-motion.mp4"
VOUT = sys.argv[2] if len(sys.argv) > 2 else "/mnt/project-files/scenario/stil-tests/B2-papier-diorama-mit-ton.mp4"

b2 = json.load(open(os.path.join(HERE, "b2-urls.json")))
T = b2["timing_video_s"]
os.makedirs(AUD, exist_ok=True)


def fetch(name, url):
    p = os.path.join(AUD, name)
    if not os.path.exists(p) or os.path.getsize(p) == 0:
        urllib.request.urlretrieve(url, p)
    return p


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-3000:])
    return r


def stats(path):
    """Peak vs. noise floor (dB) and seconds until the first transient."""
    err = run(["ffmpeg", "-hide_banner", "-i", path, "-af",
               "astats=metadata=1:reset=0,silencedetect=n=-40dB:d=0.02", "-f", "null", "-"]).stderr
    peak = float(re.findall(r"Peak level dB: (-?[\d.inf]+)", err)[-1])
    floor = re.findall(r"Noise floor dB: (-?[\d.inf]+)", err)
    floor = float(floor[-1]) if floor and floor[-1] not in ("-inf", "inf") else -90.0
    onset = re.search(r"silence_end: ([\d.]+)", err)
    return peak, floor, float(onset.group(1)) if onset and err.find("silence_start: 0") >= 0 else 0.0


def best(key):
    paths = [fetch(f"{key}_{i}.wav", u) for i, u in enumerate(b2[key], 1)]
    scored = []
    for p in paths:
        peak, floor, onset = stats(p)
        scored.append((peak - floor, -onset, p))
    scored.sort(reverse=True)
    choice = scored[0]
    print(f"{key}: {os.path.basename(choice[2])} (dynamic {choice[0]:.1f} dB, onset {-choice[1]:.2f}s)")
    return choice[2], -choice[1]


vo = fetch("vo_george.mp3", json.load(open(os.path.join(HERE, "urls.json")))["george"])
music = fetch("music.mp3", b2["music"])
pop, pop_on = best("paper_pop")
off, off_on = best("screen_off")
eye, eye_on = best("eye_open")
amb, _ = best("city_ambience")

dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIN]).stdout)
ms = lambda s: max(0, int(round(s * 1000)))
sw = T["eye_open"]

# Inputs: 0 video, 1 vo, 2 music, 3 pop, 4 off, 5 eye, 6 ambience
fc = f"""
[1:a]aresample=48000,loudnorm=I=-16:TP=-2:LRA=7,adelay={ms(T['vo_offset'])}:all=1,apad,asplit=2[vo][vokey];
[2:a]aresample=48000,loudnorm=I=-24:TP=-4,volume='if(lt(t,{sw}),1,min(3.2,1+2.2*(t-{sw})/0.6))':eval=frame[mus0];
[mus0][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1[mus];
[3:a]aresample=48000,atrim=start={pop_on},asetpts=PTS-STARTPTS,volume=0.55,asplit=2[p1][p2];
[p1]adelay={ms(T['paper_pop'][0])}:all=1[pa];
[p2]adelay={ms(T['paper_pop'][1])}:all=1[pb];
[4:a]aresample=48000,atrim=start={off_on},asetpts=PTS-STARTPTS,volume=0.8,adelay={ms(T['screen_off'])}:all=1[so];
[5:a]aresample=48000,atrim=start={eye_on},asetpts=PTS-STARTPTS,volume=0.7,afade=t=in:d=0.6,adelay={ms(T['eye_slit'])}:all=1[eo];
[6:a]aresample=48000,atrim=0:{dur},loudnorm=I=-38:TP=-9,afade=t=in:d=1.0,afade=t=out:st={dur-1.2}:d=1.2[am];
[vo][mus][pa][pb][so][eo][am]amix=inputs=7:duration=first:normalize=0,atrim=0:{dur},afade=t=out:st={dur-0.8}:d=0.8[pre]
"""


def render(extra, out_args):
    return run(["ffmpeg", "-hide_banner", "-y", "-i", VIN, "-i", vo, "-i", music, "-i", pop, "-i", off,
                "-i", eye, "-stream_loop", "-1", "-i", amb, "-filter_complex", fc.strip().replace("\n", "") + extra] + out_args)


# Pass 1: measure, pass 2: linear loudnorm to -14 LUFS / -1 dBTP.
err = render(";[pre]loudnorm=I=-14:TP=-1:LRA=11:print_format=json[a]",
             ["-map", "[a]", "-f", "null", "-"]).stderr
m = json.loads(err[err.rfind("{"):err.rfind("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
render(f";[pre]{ln},aresample=48000[a]",
       ["-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart", "-shortest", VOUT])
check = run(["ffmpeg", "-hide_banner", "-i", VOUT, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
print(VOUT, re.findall(r"I:\s+(-?[\d.]+) LUFS", check)[-1], "LUFS")
