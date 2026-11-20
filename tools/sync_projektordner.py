#!/usr/bin/env python3
"""Holt Regeln, Skripte und Verpackung aus dem Projektordner ins Repo.

Der Projektordner (/mnt/project-files/scenario) ist der Arbeitsplatz der Film-Threads,
das Repo ist das aufgeräumte Archiv. Dieses Skript gleicht beides ab:

  regeln/                 <- schreibraum/REGELN.md + Begleitdateien, stil/STIL-editorial-nacht.md
  films/NN-…/skript/      <- neueste Fassung jeder Textdatei aus den Quellen in films/filme.json
  films/NN-…/verpackung/  <- Thumbnail-Notizen (titel.md) und mit --youtube Titel/Beschreibung/Tags live

Aufruf:
  python3 tools/sync_projektordner.py              # Regeln + alle Filme
  python3 tools/sync_projektordner.py 54           # nur Film #54
  python3 tools/sync_projektordner.py --youtube    # zusätzlich youtube.md per API (YT_* Env-Vars)

Neuer Film: Eintrag in films/filme.json ergänzen (nr, ordner, video, skript_quellen, thumbnail_quelle),
Code direkt unter films/NN-…/code/ committen.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PF = Path(os.environ.get("SCENARIO_PROJEKTORDNER", "/mnt/project-files/scenario"))
REGELN = ["schreibraum/REGELN.md", "schreibraum/hook-bauplan.md", "schreibraum/vibe-brief.md",
          "schreibraum/treffer-check.md", "schreibraum/feedback-log.md", "schreibraum/regeln-befund-2026-11-06.md",
          "schreibraum/clip-schritt.md"]
STIL = ["stil/STIL-editorial-nacht.md"]
TEXT = (".md", ".txt", ".json", ".srt")
MAX_TEXT = 400_000
VER = re.compile(r"^(.*?)[-_]?v(\d+)(?:-[a-z]+)?(\.[a-z]+)$")


def neueste(dateien):
    """von name-v1/-v2/… nur die höchste Fassung"""
    best = {}
    for p in dateien:
        m = VER.match(p.name)
        key, v = ((m.group(1) + m.group(3)), int(m.group(2))) if m else (p.name, 0)
        if key not in best or v > best[key][0]:
            best[key] = (v, p)
    return sorted(p for _, p in best.values())


def textdateien(quelle):
    if ":" in quelle:                      # "schreibraum:film-04" = Dateien in schreibraum, die mit film-04 beginnen
        d, prefix = quelle.split(":")
        kandidaten = [p for p in (PF / d).iterdir() if p.is_file() and p.name.startswith(prefix)]
    elif (PF / quelle).is_file():
        kandidaten = [PF / quelle]
    else:
        kandidaten = [p for p in (PF / quelle).iterdir() if p.is_file()]
    kandidaten = [p for p in kandidaten if p.suffix.lower() in TEXT and p.stat().st_size <= MAX_TEXT
                  and "hoerfassung" not in p.name and not p.name.startswith("texter-")]
    return neueste(kandidaten)


def kopiere(src, ziel):
    neu = src.read_bytes()
    if ziel.exists() and ziel.read_bytes() == neu:
        return False
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_bytes(neu)
    return True


def thumbnail_notizen(quelle):
    if quelle.startswith("final:"):
        return None
    d = PF / quelle[3:] if quelle.startswith("pf:") else PF / "thumbnails" / quelle
    return d / "titel.md" if (d / "titel.md").exists() else None


def youtube(filme):
    data = urllib.parse.urlencode(dict(
        client_id=os.environ["YT_CLIENT_ID"], client_secret=os.environ["YT_CLIENT_SECRET"],
        refresh_token=os.environ["YT_REFRESH_TOKEN"], grant_type="refresh_token")).encode()
    token = json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data))["access_token"]
    ids = ",".join(f["video"] for f in filme)
    url = "https://youtube.googleapis.com/youtube/v3/videos?" + urllib.parse.urlencode(
        {"part": "snippet,status,contentDetails", "id": ids})
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + token})
    return {v["id"]: v for v in json.load(urllib.request.urlopen(req))["items"]}


def youtube_md(f, v):
    s, st = v["snippet"], v["status"]
    datum = (st.get("publishAt") or s["publishedAt"])[:10]
    return (f"# #{f['nr']} · {s['title']}\n\n"
            f"- Video: https://youtu.be/{f['video']}\n- Veröffentlicht: {datum} ({st['privacyStatus']})\n"
            f"- Länge: {v['contentDetails']['duration'][2:].lower()}\n\n"
            f"## Titel\n\n{s['title']}\n\n## Beschreibung\n\n```\n{s['description']}\n```\n\n"
            f"## Tags\n\n{', '.join(s.get('tags', [])) or '–'}\n")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    filme = json.load(open(REPO / "films/filme.json"))
    if args:
        filme = [f for f in filme if str(f["nr"]) in args]
    geaendert = []
    if not args:
        for r in REGELN:
            if kopiere(PF / r, REPO / "regeln" / Path(r).name):
                geaendert.append("regeln/" + Path(r).name)
        for r in STIL:
            if kopiere(PF / r, REPO / "stil" / Path(r).name):
                geaendert.append("stil/" + Path(r).name)
    yt = youtube(filme) if "--youtube" in sys.argv else {}
    for f in filme:
        ziel = REPO / "films" / f["ordner"]
        for q in f["skript_quellen"]:
            for p in textdateien(q):
                if kopiere(p, ziel / "skript" / p.name):
                    geaendert.append(f"{f['ordner']}/skript/{p.name}")
        notiz = thumbnail_notizen(f["thumbnail_quelle"])
        if notiz and kopiere(notiz, ziel / "verpackung/thumbnail-titel-notizen.md"):
            geaendert.append(f"{f['ordner']}/verpackung/thumbnail-titel-notizen.md")
        if f["video"] in yt:
            out = ziel / "verpackung/youtube.md"
            neu = youtube_md(f, yt[f["video"]])
            if not out.exists() or out.read_text() != neu:
                out.write_text(neu)
                geaendert.append(f"{f['ordner']}/verpackung/youtube.md")
    print("\n".join(geaendert) or "Alles aktuell.")
    print(f"{len(geaendert)} Datei(en) aktualisiert. Danach: git add -A && git commit")


if __name__ == "__main__":
    main()
