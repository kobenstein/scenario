"""Mix Episode 1: VO master, three music cues ducked under the voice, ambience and accents.
Every stem is normalized to a reference loudness first, then placed with a gain in dB.
Output: mix/mix.wav at -14 LUFS."""
import json, subprocess, numpy as np, pathlib
EP = pathlib.Path(__file__).resolve().parent.parent
A = EP / "audio"
SR = 48000
DUR = 734.3

def load(p, lufs=-20.0):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-af", f"loudnorm=I={lufs}:TP=-2:LRA=20",
                          "-ar", str(SR), "-ac", "2", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()

def db(g): return 10 ** (g / 20)

def fade(x, fin, fout):
    n = len(x); i = np.arange(n)
    env = np.ones(n, np.float32)
    if fin > 0: env = np.minimum(env, i / (fin * SR))
    if fout > 0: env = np.minimum(env, (n - i) / (fout * SR))
    return x * np.clip(env, 0, 1)[:, None]

out = np.zeros((int(DUR * SR), 2), np.float32)
def place(x, t, g=0.0, fin=0.0, fout=0.0, until=None):
    if until is not None: x = x[: int((until - t) * SR)]
    x = fade(x, fin, fout) * db(g)
    s = int(t * SR); e = min(len(out), s + len(x))
    out[s:e] += x[: e - s]

# voice: build_vo.py wrote it at -16 LUFS on the film timeline (lead included)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(A / "vo-master.wav"), "-ar", str(SR), "-ac", "2",
                      "-f", "f32le", "-"], capture_output=True, check=True).stdout
vo = np.frombuffer(raw, np.float32).reshape(-1, 2)
vo = vo[: len(out)]

# ducking envelope from the word timings: music dips while George speaks
tim = json.load(open(EP / "film" / "timing.json"))
speak = np.zeros(int(DUR * 100) + 1, np.float32)  # 10 ms grid
for w in tim["words"]:
    speak[int((w["s"] - 0.15) * 100): int((w["e"] + 0.35) * 100)] = 1
k = np.ones(40) / 40  # 400 ms smoothing
speak = np.convolve(speak, k, "same").clip(0, 1)
duck_db = -7.0 * speak
duck = np.repeat(db(duck_db), SR // 100)[: len(out)]
if len(duck) < len(out): duck = np.pad(duck, (0, len(out) - len(duck)), constant_values=1)

music = np.zeros_like(out)
def mplace(p, t, g, fin, fout, until=None):
    x = load(p, -20)
    if until is not None: x = x[: int((until - t) * SR)]
    x = fade(x, fin, fout) * db(g)
    s = int(t * SR); e = min(len(music), s + len(x)); music[s:e] += x[: e - s]
mplace(A / "music-a.mp3", 0.0, -6, 0.5, 4.0, until=290.5)
mplace(A / "music-b.mp3", 288.5, -6, 2.0, 3.0, until=554.4)
mplace(A / "music-c.mp3", 552.4, -5, 2.0, 6.0)
out += music * duck[:, None]

# ambience beds, looped with crossfade
def bed(p, t0, t1, g):
    x = load(p, -20); L = len(x); xf = int(2 * SR)
    n = int((t1 - t0) * SR); y = np.zeros((n, 2), np.float32); pos = 0
    ramp = np.linspace(0, 1, xf, dtype=np.float32)[:, None]
    while pos < n:
        seg = x.copy(); seg[:xf] *= ramp; seg[-xf:] *= ramp[::-1]
        e = min(n, pos + L); y[pos:e] += seg[: e - pos]; pos += L - xf
    place(y, t0, g, 4, 4)
bed(A / "sfx-night.wav", 0.0, 612.0, -17)
bed(A / "sfx-dawn.wav", 606.0, DUR, -15)

S = {n: load(A / f"sfx-{n}.wav", -20) for n in ["whoosh", "boom", "switch", "jet", "tape", "pencil"]}
for t in [144.5, 709.0, 338.5, 405.1, 454.8, 491.3]: place(S["whoosh"], t, -9)
for t in [101.1, 156.9, 709.7]: place(S["boom"], t, -6, 0, 1.5)
place(S["switch"], 309.7, -8)
place(S["jet"], 133.0, -16, 1.5, 2.5)
place(S["jet"], 465.5, -17, 1.5, 2.5)
place(S["tape"], 85.4, -10, 0, 0.8)
place(S["pencil"], 21.3, -14, 0.5, 1.5)

out += vo if len(vo) == len(out) else np.pad(vo, ((0, len(out) - len(vo)), (0, 0)))
tmp = EP / "mix" / "premix.f32"
out.astype(np.float32).tofile(tmp)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(tmp),
                "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-ar", str(SR), str(EP / "mix" / "mix.wav")], check=True)
tmp.unlink()
print("ok")
