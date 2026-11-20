#!/usr/bin/env python3
"""Check (and optionally fix) the description head of every long film on The Good Takeoff.

Rule (Jakob, 11.11. and 15.11.2026): every long film description starts with
  paragraph 1: hook
  paragraph 2: COFFEE line (Buy Me a Coffee)
  paragraph 3: COURSE line (film course)
and ends with the SPONSOR line (Passionfroot storefront, Jakob 19.11.2026).
This applies to public, private AND scheduled videos. Run it before every release
and after every upload (also for re-uploads / new versions of a film).

Usage:
  python3 tools/check_descriptions.py          # report only, exit 1 if anything is wrong
  python3 tools/check_descriptions.py --fix    # back up and repair the head where it is wrong

Needs env vars YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN.
Uses youtube.googleapis.com (www.googleapis.com/youtube/v3 is rewritten by the
session proxy and loses the OAuth token, "mine" then fails with 401).
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import date

CHANNEL = "UCozIWUuVxpyDVkNUXaOqPFg"
COFFEE = ("✨ ☕ If you want superintelligence to benefit everyone, you can support this "
          "channel here: https://buymeacoffee.com/thegoodtakeoff")
COURSE = ("✨ 🎬 Want to learn how these films are made? I'll share everything I know soon: "
          "https://aistronauts.at/film-course")
SPONSOR = "Want to sponsor a film? passionfroot.me/the-good-takeoff"
MAX_LEN = 4990  # YouTube limit is 5000 characters
BACKUP_DIR = "/mnt/project-files/scenario/buymeacoffee/backup"
BASE = "https://youtube.googleapis.com/youtube/v3/"


def token():
    data = urllib.parse.urlencode(dict(
        client_id=os.environ["YT_CLIENT_ID"], client_secret=os.environ["YT_CLIENT_SECRET"],
        refresh_token=os.environ["YT_REFRESH_TOKEN"], grant_type="refresh_token")).encode()
    return json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data))["access_token"]


TOKEN = None


def api(path, params, method="GET", body=None):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method=method,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": "Bearer " + TOKEN,
                                          "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


def is_long(duration):
    # ISO 8601, e.g. PT10M5S; Shorts are under a minute and have no M part
    return "H" in duration or "M" in duration


def head_ok(desc):
    p = desc.split("\n\n")
    # links decide; wording may be shortened where the 5000-character limit forced it
    return (len(p) >= 3 and p[1].startswith("✨ ☕") and "buymeacoffee.com/thegoodtakeoff" in p[1]
            and p[2].startswith("✨ 🎬") and "aistronauts.at/film-course" in p[2])


def split_tags(desc):
    paras = [p for p in desc.rstrip().split("\n\n") if "passionfroot.me/the-good-takeoff" not in p]
    tags = [paras.pop()] if paras and paras[-1].lstrip().startswith("#") else []
    return paras, tags


def tail_ok(desc):
    # Jakob 19.11.: sponsor line as the last paragraph (only hashtags may follow)
    paras = desc.rstrip().split("\n\n")
    if paras and paras[-1].lstrip().startswith("#"):
        paras = paras[:-1]
    return bool(paras) and paras[-1] == SPONSOR


def repaired(desc):
    if head_ok(desc):
        return with_sponsor(desc)
    return with_sponsor(new_head(desc))


def with_sponsor(desc):
    paras, tags = split_tags(desc)
    return "\n\n".join(paras + [SPONSOR] + tags)


def new_head(desc):
    paras = desc.split("\n\n")
    hook, rest = paras[0], paras[1:]
    # drop any old coffee / course paragraphs wherever they are
    rest = [p for p in rest
            if "buymeacoffee.com/thegoodtakeoff" not in p and "aistronauts.at/film-course" not in p]
    return "\n\n".join([hook, COFFEE, COURSE] + rest)


def main():
    global TOKEN
    fix = "--fix" in sys.argv
    TOKEN = token()
    ch = api("channels", {"part": "id,contentDetails", "mine": "true"})["items"][0]
    if ch["id"] != CHANNEL:
        sys.exit(f"Wrong channel {ch['id']}, expected {CHANNEL}. Stop.")
    uploads = ch["contentDetails"]["relatedPlaylists"]["uploads"]
    ids, page = [], None
    while True:
        p = {"part": "contentDetails", "playlistId": uploads, "maxResults": 50}
        if page:
            p["pageToken"] = page
        r = api("playlistItems", p)
        ids += [i["contentDetails"]["videoId"] for i in r["items"]]
        page = r.get("nextPageToken")
        if not page:
            break
    bad = []
    for i in range(0, len(ids), 50):
        for v in api("videos", {"part": "snippet,status,contentDetails", "id": ",".join(ids[i:i + 50])})["items"]:
            if not is_long(v["contentDetails"]["duration"]):
                continue
            s = v["snippet"]
            ok = head_ok(s["description"]) and tail_ok(s["description"])
            state = v["status"]["privacyStatus"] + (" " + v["status"]["publishAt"] if v["status"].get("publishAt") else "")
            print(f"{'OK    ' if ok else 'FEHLT '} {v['id']} [{state}] {s['title']}")
            if not ok:
                bad.append(v)
    if not bad:
        print("Alle Langfilme haben Kaffee-Zeile + Kurs-Zeile als Absatz 2 und 3 und die Sponsor-Zeile am Schluss.")
        return 0
    if not fix:
        print(f"{len(bad)} Film(e) ohne korrekten Beschreibungskopf oder ohne Sponsor-Zeile. Mit --fix reparieren.")
        return 1
    for v in bad:
        s = v["snippet"]
        new = repaired(s["description"])
        if len(new) > MAX_LEN:
            print(f"ZU LANG {v['id']}: {len(new)} Zeichen nach Reparatur. Bitte von Hand kürzen (z. B. Kommentar-Frage).")
            continue
        os.makedirs(BACKUP_DIR, exist_ok=True)
        with open(f"{BACKUP_DIR}/{v['id']}-{date.today().isoformat()}.txt", "w") as f:
            f.write(s["description"])
        snip = {k: s[k] for k in ("title", "categoryId", "tags", "defaultLanguage", "defaultAudioLanguage") if k in s}
        snip["description"] = new
        api("videos", {"part": "snippet"}, "PUT", {"id": v["id"], "snippet": snip})
        print(f"REPARIERT {v['id']} {s['title']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
