#!/usr/bin/env python3
"""Anteil-Check für Interview-Clips (docs/clip-schritt.md).

Aufruf: python3 tools/clip_check.py <clips.json> <timing.json | Laufzeit in s>
Exit 1, wenn eine harte Grenze verletzt ist.
"""
import json
import sys
from collections import defaultdict


def secs(t):
    if isinstance(t, (int, float)):
        return float(t)
    parts = [float(p) for p in str(t).split(":")]
    s = 0.0
    for p in parts:
        s = s * 60 + p
    return s


def film_duration(arg):
    try:
        return float(arg)
    except ValueError:
        pass
    with open(arg) as f:
        t = json.load(f)
    for key in ("duration", "total", "length", "total_duration"):
        if isinstance(t, dict) and key in t:
            return float(t[key])
    words = t.get("words") if isinstance(t, dict) else t
    if words:
        last = words[-1]
        return float(last.get("end", last.get("e", 0)))
    raise SystemExit("Laufzeit nicht gefunden: Sekunden direkt angeben")


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    with open(sys.argv[1]) as f:
        data = json.load(f)
    clips = data.get("clips", data if isinstance(data, list) else [])
    total = film_duration(sys.argv[2])
    errors, warns = [], []

    per_source = defaultdict(float)
    count_source = defaultdict(int)
    clip_sum = 0.0
    for c in clips:
        d = secs(c["out"]) - secs(c["in"])
        clip_sum += d
        per_source[c.get("url", "?")] += d
        count_source[c.get("url", "?")] += 1
        if d > 20:
            errors.append(f"{c['id']}: {d:.1f} s > 20 s")
        elif d > 15 or d < 4:
            warns.append(f"{c['id']}: {d:.1f} s außerhalb 4–15 s")
        if c.get("ampel") == "rot":
            errors.append(f"{c['id']}: Ampel rot, nur Zitatkarte")
        if not c.get("einordnung"):
            errors.append(f"{c['id']}: kein Einordnungssatz")
        if not c.get("transcript"):
            errors.append(f"{c['id']}: kein Transkript")
    for url, s in per_source.items():
        if count_source[url] > 2 or s > 20:
            errors.append(f"Quelle {url}: {count_source[url]} Clips, {s:.1f} s (max 2 / 20 s)")
    if not 3 <= len(clips) <= 6:
        warns.append(f"{len(clips)} Clips (Ziel 3–6)")

    share = clip_sum / total * 100 if total else 0
    if share > 10:
        errors.append(f"Anteil {share:.1f} % > 10 %")
    elif share > 8:
        warns.append(f"Anteil {share:.1f} % über Ziel 8 %")

    print(f"{len(clips)} Clips, {clip_sum:.1f} s von {total:.0f} s = {share:.1f} %")
    for w in warns:
        print("GELB", w)
    for e in errors:
        print("ROT ", e)
    print("ROT" if errors else ("GELB" if warns else "GRÜN"))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
