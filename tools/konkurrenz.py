#!/usr/bin/env python3
"""Konkurrenz-Tracker fuer The Good Takeoff.

Drei Schritte, alle ueber die YouTube Data API (Key setzt der Proxy auf www.googleapis.com):

  discover  Breite Suche (Suchbegriffe in suche.json) + Seeds -> kandidaten-DATUM.csv
            mit allen Kanaelen, die noch NICHT in stammdaten.csv stehen und thematisch passen.
            Kosten: 100 Einheiten je Suche (Tageskontingent 10.000).
  snapshot  Kennzahlen fuer alle Kanaele in stammdaten.csv -> snapshots/DATUM.csv
            Kosten: ca. 2-3 Einheiten je Kanal.
  delta     Vergleicht den neuesten Snapshot mit dem vorigen -> deltas/DATUM.md
            (neu / wachsend / schrumpfend / eingeschlafen / verschwunden).

Ablauf monatlich: discover -> Kandidaten sichten und passende in stammdaten.csv eintragen
(naehe, stil, themen) -> snapshot -> delta.

Aufruf:  python3 tools/konkurrenz.py snapshot [--dir PFAD]
Standard-Ordner: /mnt/project-files/scenario/analysen/konkurrenz
"""
import argparse, csv, datetime as dt, json, os, re, statistics as st, sys, time
import urllib.parse, urllib.request, urllib.error

API = "https://www.googleapis.com/youtube/v3/"
DEFAULT_DIR = "/mnt/project-files/scenario/analysen/konkurrenz"
OWN_ID = "UCozIWUuVxpyDVkNUXaOqPFg"
NOW = dt.datetime.now(dt.timezone.utc)
TODAY = NOW.strftime("%Y-%m-%d")
UNITS = {"n": 0}

AI_RE = re.compile(
    r"\b(ai|a\.i\.|agi|asi|superintelligen\w*|artificial intelligence|singularity|chatgpt|gpt-?\d|openai|"
    r"anthropic|claude|gemini|llms?|deepmind|machine learning|neural|robots?|humanoids?|automation|automated|"
    r"post-?labou?r|ubi|universal basic income|transhuman\w*|neuralink|kurzweil|altman|hinton|"
    r"intelligence explosion|ai 2027|takeover|data cent(er|re)s?)\b", re.I)
FUTURE_RE = re.compile(
    r"\b(future|20[3-9]\d|21\d\d|next (decade|\d+ years)|what if|will (end|replace|change)|"
    r"longevity|aging|immortal\w*|abundance|utopia|dystopia|civili[sz]ation|humanity|jobs?)\b", re.I)


# ---------------------------------------------------------------- API
def api(ep, **p):
    url = API + ep + "?" + urllib.parse.urlencode(p)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                UNITS["n"] += 100 if ep == "search" else 1
                return json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            if e.code == 403 and "quota" in body.lower():
                sys.exit(f"API-Kontingent erschoepft (bisher ~{UNITS['n']} Einheiten). Morgen erneut.")
            if e.code == 404:
                return {"items": []}
            if attempt == 3:
                raise RuntimeError(f"{ep} {e.code}: {body[:300]}")
        except Exception:
            if attempt == 3:
                raise
        time.sleep(2 ** attempt)


def dur_s(iso):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "PT0S")
    d, h, mi, s = [int(x or 0) for x in m.groups()]
    return d * 86400 + h * 3600 + mi * 60 + s


def ts(s):
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00"))


def channels(ids):
    out = {}
    ids = list(dict.fromkeys(ids))
    for i in range(0, len(ids), 50):
        r = api("channels", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]), maxResults=50)
        for c in r.get("items", []):
            out[c["id"]] = c
    return out


def recent_videos(ch, n=50):
    """Letzte n Uploads (eine Seite = 50) mit Statistik und Dauer."""
    pl = ch["contentDetails"]["relatedPlaylists"].get("uploads")
    if not pl:
        return []
    items = api("playlistItems", part="contentDetails", playlistId=pl, maxResults=min(n, 50)).get("items", [])
    vids = [it["contentDetails"]["videoId"] for it in items]
    if not vids:
        return []
    vs = api("videos", part="snippet,statistics,contentDetails", id=",".join(vids)).get("items", [])
    out = []
    for v in vs:
        out.append({
            "id": v["id"], "title": v["snippet"]["title"], "pub": ts(v["snippet"]["publishedAt"]),
            "views": int(v["statistics"].get("viewCount", 0) or 0), "dur": dur_s(v["contentDetails"].get("duration")),
            "lang": v["snippet"].get("defaultAudioLanguage") or v["snippet"].get("defaultLanguage") or "",
            "live": v["snippet"].get("liveBroadcastContent", "none"),
        })
    return sorted(out, key=lambda x: x["pub"], reverse=True)


def metrics(ch, vids):
    s, sn = ch["statistics"], ch["snippet"]
    lf = [v for v in vids if v["dur"] >= 180]
    sh = [v for v in vids if v["dur"] < 180]
    age = lambda v: (NOW - v["pub"]).days
    lf30 = [v for v in lf if age(v) <= 30]
    lf90 = [v for v in lf if age(v) <= 90]
    # Uploads/Woche ueber 90 Tage; wenn die 50 Uploads nicht 90 Tage abdecken, ueber die abgedeckte Spanne
    span = min(90, max(1, age(vids[-1]))) if vids else 90
    lf_span = [v for v in lf if age(v) <= span]
    ai_lf = [v for v in lf if AI_RE.search(v["title"])]
    fut_lf = [v for v in lf if AI_RE.search(v["title"]) or FUTURE_RE.search(v["title"])]
    top30 = max(lf30, key=lambda v: v["views"]) if lf30 else None
    top90 = max(lf90, key=lambda v: v["views"]) if lf90 else None
    last10 = [v["views"] for v in lf if age(v) >= 3][:10]
    langs = [v["lang"][:2] for v in vids if v["lang"]]
    return {
        "datum": TODAY,
        "channel_id": ch["id"],
        "name": sn["title"],
        "handle": sn.get("customUrl", ""),
        "land": sn.get("country", ""),
        "sprache": max(set(langs), key=langs.count) if langs else "",
        "start": sn.get("publishedAt", "")[:10],
        "abos": int(s.get("subscriberCount", 0) or 0) if not s.get("hiddenSubscriberCount") else "",
        "aufrufe_gesamt": int(s.get("viewCount", 0) or 0),
        "videos_gesamt": int(s.get("videoCount", 0) or 0),
        "letzter_upload": vids[0]["pub"].strftime("%Y-%m-%d") if vids else "",
        "erster_longform_in_50": lf[-1]["pub"].strftime("%Y-%m-%d") if lf else "",
        "longform_30t": len(lf30),
        "shorts_30t": len([v for v in sh if age(v) <= 30]),
        "longform_pro_woche": round(len(lf_span) / span * 7, 2),
        "aufrufe_longform_30t": sum(v["views"] for v in lf30),
        "aufrufe_longform_90t": sum(v["views"] for v in lf90),
        "median_letzte10": int(st.median(last10)) if last10 else 0,
        "median_laenge_min": round(st.median([v["dur"] for v in lf]) / 60, 1) if lf else 0,
        "ki_anteil": round(len(ai_lf) / len(lf), 2) if lf else 0,
        "zukunft_anteil": round(len(fut_lf) / len(lf), 2) if lf else 0,
        "n_longform_50": len(lf),
        "top30_titel": top30["title"] if top30 else "",
        "top30_aufrufe": top30["views"] if top30 else "",
        "top30_url": f"https://youtu.be/{top30['id']}" if top30 else "",
        "top90_titel": top90["title"] if top90 else "",
        "top90_aufrufe": top90["views"] if top90 else "",
        "top90_url": f"https://youtu.be/{top90['id']}" if top90 else "",
    }


SNAP_FIELDS = ["datum", "channel_id", "name", "handle", "naehe", "stil", "themen", "land", "sprache", "start",
               "abos", "aufrufe_gesamt", "videos_gesamt", "letzter_upload", "erster_longform_in_50",
               "longform_30t", "shorts_30t", "longform_pro_woche", "aufrufe_longform_30t", "aufrufe_longform_90t",
               "median_letzte10", "median_laenge_min", "ki_anteil", "zukunft_anteil", "n_longform_50",
               "top30_titel", "top30_aufrufe", "top30_url", "top90_titel", "top90_aufrufe", "top90_url"]
STAMM_FIELDS = ["channel_id", "name", "handle", "naehe", "stil", "themen", "notiz", "quelle", "aufgenommen"]


def read_csv(path):
    if not os.path.exists(path):
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_csv(path, rows, fields):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


# ---------------------------------------------------------------- discover
def discover(d, args):
    cfg = json.load(open(os.path.join(d, "suche.json"), encoding="utf-8"))
    known = {r["channel_id"] for r in read_csv(os.path.join(d, "stammdaten.csv"))}
    ignore = set(cfg.get("ignorieren", []))
    after = (NOW - dt.timedelta(days=cfg.get("tage", 120))).strftime("%Y-%m-%dT%H:%M:%SZ")
    hits = {}  # channel_id -> set(queries)
    queries = cfg["suchen"][: args.max_suchen] if args.max_suchen else cfg["suchen"]
    for q in queries:
        for order in cfg.get("sortierungen", ["relevance"]):
            r = api("search", part="snippet", q=q, type="video", maxResults=50, order=order,
                    publishedAfter=after, relevanceLanguage="en", videoDuration="medium")
            for it in r.get("items", []):
                hits.setdefault(it["snippet"]["channelId"], set()).add(q)
            r = api("search", part="snippet", q=q, type="video", maxResults=50, order=order,
                    publishedAfter=after, relevanceLanguage="en", videoDuration="long")
            for it in r.get("items", []):
                hits.setdefault(it["snippet"]["channelId"], set()).add(q)
        print(f"  {q!r}: {len(hits)} Kanaele bisher, ~{UNITS['n']} Einheiten", file=sys.stderr)
    for s in cfg.get("seeds", []):
        hits.setdefault(s, set()).add("seed")
    cand_ids = [c for c in hits if c not in known and c not in ignore and c != OWN_ID]
    chs = channels(cand_ids)
    rows = []
    for cid, ch in chs.items():
        subs = int(ch["statistics"].get("subscriberCount", 0) or 0)
        if subs < cfg.get("min_abos", 1000):
            continue
        vids = recent_videos(ch)
        if not vids:
            continue
        m = metrics(ch, vids)
        if m["n_longform_50"] < 3 or m["ki_anteil"] < cfg.get("min_ki_anteil", 0.25):
            continue
        if m["sprache"] and m["sprache"] != "en":
            continue
        if (NOW - vids[0]["pub"]).days > cfg.get("max_tage_inaktiv", 180):
            continue
        m["treffer_suchen"] = len(hits[cid])
        m["suchen"] = " | ".join(sorted(hits[cid]))[:300]
        rows.append(m)
    rows.sort(key=lambda r: (-(r["treffer_suchen"]), -(r["abos"] or 0)))
    out = os.path.join(d, f"kandidaten-{TODAY}.csv")
    write_csv(out, rows, ["treffer_suchen", "suchen"] + SNAP_FIELDS)
    print(f"{len(hits)} Kanaele gefunden, {len(rows)} neue Kandidaten -> {out} (~{UNITS['n']} Einheiten)")


# ---------------------------------------------------------------- snapshot
def snapshot(d, args):
    stamm = read_csv(os.path.join(d, "stammdaten.csv"))
    if args.nur:
        stamm = [r for r in stamm if r["naehe"] in args.nur.split(",")]
    ids = [r["channel_id"] for r in stamm] + [OWN_ID]
    chs = channels(ids)
    rows = []
    for r in stamm + [{"channel_id": OWN_ID, "naehe": "eigener Kanal", "stil": "Code-Animation", "themen": ""}]:
        ch = chs.get(r["channel_id"])
        if not ch:
            rows.append({"datum": TODAY, "channel_id": r["channel_id"], "name": r.get("name", ""),
                         "naehe": r["naehe"], "stil": r.get("stil", ""), "themen": "NICHT GEFUNDEN (geloescht/umbenannt?)"})
            continue
        m = metrics(ch, recent_videos(ch))
        m.update({k: r.get(k, "") for k in ("naehe", "stil", "themen")})
        rows.append(m)
    out = os.path.join(d, "snapshots", f"{TODAY}.csv")
    write_csv(out, rows, SNAP_FIELDS)
    print(f"{len(rows)} Kanaele -> {out} (~{UNITS['n']} Einheiten)")


# ---------------------------------------------------------------- delta
def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def fmt(n):
    if n is None:
        return "–"
    n = float(n)
    if abs(n) >= 1e6:
        return f"{n / 1e6:.1f} Mio".replace(".", ",")
    if abs(n) >= 1e4:
        return f"{n / 1e3:.0f}k"
    return f"{n:,.0f}".replace(",", ".")


def delta(d, args):
    snaps = sorted(f for f in os.listdir(os.path.join(d, "snapshots")) if f.endswith(".csv"))
    if len(snaps) < 2:
        print("Erst ein Snapshot vorhanden, noch kein Vergleich moeglich.")
        return
    new_f, old_f = snaps[-1], (args.gegen + ".csv" if args.gegen else snaps[-2])
    new = {r["channel_id"]: r for r in read_csv(os.path.join(d, "snapshots", new_f))}
    old = {r["channel_id"]: r for r in read_csv(os.path.join(d, "snapshots", old_f))}
    days = max(1, (dt.date.fromisoformat(new_f[:10]) - dt.date.fromisoformat(old_f[:10])).days)
    L = [f"# Konkurrenz-Veraenderung {old_f[:10]} -> {new_f[:10]} ({days} Tage)", ""]
    grow = []
    for cid, n in new.items():
        o = old.get(cid)
        if not o or n.get("themen", "").startswith("NICHT GEFUNDEN"):
            continue
        a1, a0 = num(n["abos"]), num(o["abos"])
        if a1 is None or a0 is None:
            continue
        grow.append((a1 - a0, (a1 - a0) / a0 * 100 if a0 else 0, n, a0, a1))
    new_ch = [n for c, n in new.items() if c not in old]
    gone = [o for c, o in old.items() if c not in new or new[c].get("themen", "").startswith("NICHT GEFUNDEN")]
    sleeping = [n for c, n in new.items() if c in old and num(n.get("longform_30t")) == 0 and num(old[c].get("longform_30t") or 0) > 0]
    woke = [n for c, n in new.items() if c in old and num(n.get("longform_30t") or 0) > 0 and num(old[c].get("longform_30t")) == 0]

    def row(g):
        dabs, dpct, n, a0, a1 = g
        return (f"| {n['name']} | {n['naehe']} | {fmt(a0)} -> {fmt(a1)} | {'+' if dabs >= 0 else ''}{fmt(dabs)} "
                f"({dpct:+.0f} %) | {n['longform_30t']} | {fmt(num(n['aufrufe_longform_30t']))} |")
    hdr = "| Kanal | Naehe | Abos | Veraenderung | Filme 30 T. | Aufrufe neuer Filme 30 T. |\n|---|---|---|---|---|---|"
    for title, key in [("Am staerksten gewachsen (absolut)", lambda g: -g[0]),
                       ("Am staerksten gewachsen (prozentual, ab 1.000 Abos)", lambda g: -g[1])]:
        L += [f"## {title}", "", hdr]
        sel = [g for g in grow if title.endswith("absolut)") or g[3] >= 1000]
        L += [row(g) for g in sorted(sel, key=key)[:15]] + [""]
    shrink = [g for g in grow if g[0] < 0]
    if shrink:
        L += ["## Abos verloren", "", hdr] + [row(g) for g in sorted(shrink, key=lambda g: g[0])[:10]] + [""]
    L += ["## Neu in der Liste", ""] + ([f"- {n['name']} ({n['naehe']}, {fmt(num(n['abos']))} Abos, Start {n['start']})" for n in new_ch] or ["- keine"]) + [""]
    L += ["## Eingeschlafen (kein Long-Form in 30 Tagen, vorher schon)", ""] + ([f"- {n['name']} (letzter Upload {n['letzter_upload']})" for n in sleeping] or ["- keine"]) + [""]
    L += ["## Wieder aktiv", ""] + ([f"- {n['name']}" for n in woke] or ["- keine"]) + [""]
    L += ["## Verschwunden / nicht mehr abrufbar", ""] + ([f"- {o['name']}" for o in gone] or ["- keine"]) + [""]
    tops = sorted([n for n in new.values() if num(n.get("top30_aufrufe")) and AI_RE.search(n.get("top30_titel", ""))],
                  key=lambda n: -num(n["top30_aufrufe"]))[:15]
    L += ["## Groesste KI-Filme der letzten 30 Tage (bester Film je Kanal)", "", "| Aufrufe | Kanal | Film |", "|---|---|---|"]
    L += [f"| {fmt(num(n['top30_aufrufe']))} | {n['name']} | [{n['top30_titel']}]({n['top30_url']}) |" for n in tops]
    out = os.path.join(d, "deltas", f"{new_f[:10]}.md")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write("\n".join(L) + "\n")
    print(f"-> {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("schritt", choices=["discover", "snapshot", "delta"])
    ap.add_argument("--dir", default=DEFAULT_DIR)
    ap.add_argument("--max-suchen", type=int, default=0, help="discover: nur die ersten N Suchbegriffe")
    ap.add_argument("--nur", default="", help="snapshot: nur diese Naehe-Stufen, z. B. direkt,angrenzend")
    ap.add_argument("--gegen", default="", help="delta: gegen diesen Snapshot (YYYY-MM-DD) statt den vorigen")
    a = ap.parse_args()
    {"discover": discover, "snapshot": snapshot, "delta": delta}[a.schritt](a.dir, a)
