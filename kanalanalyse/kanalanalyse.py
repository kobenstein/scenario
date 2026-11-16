#!/usr/bin/env python3
"""Wochen-Kanalanalyse: zieht alle Zahlen eines YouTube-Kanals und legt sie als Snapshot ab.

Ein Aufruf pro Woche:
    python3 kanalanalyse/kanalanalyse.py --config PFAD/kanal.json

Ergebnis im Ordner aus der Einstellungsdatei (ordner/DATUM/):
    daten.json   alle Rohzahlen (Grundlage fuer den Vergleich mit der Vorwoche)
    zahlen.md    die fertig gerechneten Tabellen, aus denen der Bericht geschrieben wird

Rechnen tut nur dieses Skript. Der Bericht (bericht.md) wird danach mit dem Skill
"wochenanalyse" geschrieben: Diagnose, Hypothesen, Logbuch.

Zugang (Umgebungsvariablen, nie ins Repo):
    YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN   OAuth mit yt-analytics.readonly + youtube.readonly
Konkurrenz-Abruf nutzt die oeffentliche Data API (Key setzt der Proxy auf www.googleapis.com;
ohne Proxy: Umgebungsvariable YT_API_KEY).
"""
import argparse, csv, datetime as dt, json, os, re, statistics as st, sys, time
import urllib.error, urllib.parse, urllib.request

TOKEN_URL = "https://accounts.google.com/o/oauth2/token"   # oauth2.googleapis.com ist im Netz gesperrt
ANALYTICS = "https://youtubeanalytics.googleapis.com/v2/reports"
DATA_OAUTH = "https://youtube.googleapis.com/youtube/v3/"     # www.googleapis.com verwirft OAuth im Proxy
DATA_PUBLIC = "https://www.googleapis.com/youtube/v3/"
TODAY = dt.date.today()
LAG = 2            # Analytics hinkt ~2 Tage hinterher
WARN = []          # Hinweise fuer zahlen.md


# ------------------------------------------------------------------ Zugang
def http(url, headers=None, data=None, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=headers or {})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            if e.code in (400, 401, 403, 404) or i == tries - 1:
                raise RuntimeError(f"HTTP {e.code}: {body[:300]}")
        except urllib.error.URLError:
            if i == tries - 1:
                raise
        time.sleep(2 ** i)


def token():
    try:
        body = urllib.parse.urlencode({
            "client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
            "refresh_token": os.environ["YT_REFRESH_TOKEN"], "grant_type": "refresh_token"}).encode()
    except KeyError as e:
        sys.exit(f"Umgebungsvariable fehlt: {e}")
    return http(TOKEN_URL, data=body)["access_token"]


class YT:
    def __init__(self):
        self.h = {"Authorization": f"Bearer {token()}"}

    def data(self, ep, **p):
        return http(DATA_OAUTH + ep + "?" + urllib.parse.urlencode(p), self.h)

    def report(self, start, end, **p):
        p = {"ids": "channel==MINE", "startDate": str(start), "endDate": str(end), **p}
        res = http(ANALYTICS + "?" + urllib.parse.urlencode(p), self.h)
        cols = [c["name"] for c in res.get("columnHeaders", [])]
        return [dict(zip(cols, r)) for r in res.get("rows", [])]


def public(ep, **p):
    if os.environ.get("YT_API_KEY"):
        p["key"] = os.environ["YT_API_KEY"]
    return http(DATA_PUBLIC + ep + "?" + urllib.parse.urlencode(p))


# ------------------------------------------------------------------ Helfer
def dur_s(iso):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "PT0S")
    d, h, mi, s = [int(x or 0) for x in m.groups()]
    return d * 86400 + h * 3600 + mi * 60 + s


def mmss(s):
    s = int(round(s))
    return f"{s // 60}:{s % 60:02d}"


def med(xs):
    xs = [x for x in xs if x is not None]
    return st.median(xs) if xs else None


def fmt(x, nd=0, pct=False):
    if x is None:
        return "–"
    if pct:
        return f"{x:.1f} %"
    return f"{x:,.{nd}f}".replace(",", ".") if nd == 0 else f"{x:.{nd}f}"


def uploads(get, channel_id, n=50):
    ch = get("channels", part="contentDetails,statistics,snippet", id=channel_id)["items"][0]
    pl = ch["contentDetails"]["relatedPlaylists"]["uploads"]
    ids, page = [], None
    while len(ids) < n:
        p = {"part": "contentDetails", "playlistId": pl, "maxResults": 50}
        if page:
            p["pageToken"] = page
        r = get("playlistItems", **p)
        ids += [i["contentDetails"]["videoId"] for i in r.get("items", [])]
        page = r.get("nextPageToken")
        if not page:
            break
    vids = []
    for i in range(0, len(ids[:n]), 50):
        for v in get("videos", part="snippet,statistics,contentDetails,status", id=",".join(ids[i:i + 50])).get("items", []):
            if v.get("status", {}).get("privacyStatus", "public") != "public":
                continue   # geplante/private Filme erst zaehlen, wenn sie live sind
            vids.append({"id": v["id"], "titel": v["snippet"]["title"],
                         "veroeffentlicht": v["snippet"]["publishedAt"][:10],
                         "dauer_s": dur_s(v["contentDetails"]["duration"]),
                         "aufrufe_live": int(v["statistics"].get("viewCount", 0) or 0)})
    return ch, sorted(vids, key=lambda v: v["veroeffentlicht"], reverse=True)


# ------------------------------------------------------------------ Untertitel
def srt(path):
    if not path or not os.path.exists(path):
        return []
    out = []
    sec = lambda t: sum(float(x) * 60 ** i for i, x in enumerate(reversed(t.split(":"))))
    for block in re.split(r"\n\s*\n", open(path, encoding="utf-8", errors="replace").read().strip()):
        lines = block.strip().splitlines()
        tl = next((l for l in lines if "-->" in l), None)
        if not tl:
            continue
        a, b = [x.strip().replace(",", ".") for x in tl.split("-->")]
        text = " ".join(lines[lines.index(tl) + 1:]).strip()
        out.append((sec(a), sec(b), text))
    return out


def line_at(subs, t):
    if not subs:
        return ""
    best = min(subs, key=lambda s: 0 if s[0] <= t <= s[1] else min(abs(s[0] - t), abs(s[1] - t)))
    return best[2][:140]


# ------------------------------------------------------------------ Retention
def retention_points(curve, dauer, subs, cfg):
    """Halte-Werte plus auffaellige Stellen: steilste Abfaelle und Anstiege nach dem Einstieg."""
    curve = sorted(curve, key=lambda c: c["elapsedVideoTimeRatio"])
    if len(curve) < 20:
        return None
    r = [c["audienceWatchRatio"] for c in curve]
    x = [c["elapsedVideoTimeRatio"] for c in curve]
    at = lambda sec: next((r[i] for i in range(len(x)) if x[i] * dauer >= sec), r[-1])
    d = [None] + [r[i - 1] - r[i] for i in range(1, len(r))]
    # Der Einstieg (bis ~1:00) faellt immer steil, er wird ueber 0:30/1:00 bewertet.
    # Danach zaehlt ein Abfall nur, wenn er deutlich steiler ist als seine Umgebung (+-8 Punkte).
    start = next((i for i in range(len(x)) if x[i] * dauer >= cfg.get("stellen_ab_s", 60)), 1)
    ab, an = [], []
    for i in range(start, len(r) - 2):   # letzte Punkte = Abspann, nicht werten
        nb = [d[j] for j in range(max(start, i - 8), min(len(r) - 2, i + 9)) if j != i and d[j] is not None]
        local = max(med(nb) or 0, 0.002)
        if d[i] >= max(local * 3, 0.01):
            ab.append(i)
        elif d[i] <= -0.005:
            an.append(i)
    pick = sorted(ab, key=lambda i: -d[i])[:4] + sorted(an, key=lambda i: d[i])[:2]
    return {
        "s30": at(30), "s60": at(60), "m5": at(300) if dauer > 330 else None,
        "mitte": at(dauer * 0.5), "ende": r[-3],
        "stellen": [{"art": "Abfall" if d[i] > 0 else "Anstieg", "zeit": mmss(x[i] * dauer),
                     "aenderung_pp": round(-d[i] * 100, 1), "satz": line_at(subs, x[i] * dauer)}
                    for i in sorted(pick)],
    }


# ------------------------------------------------------------------ eigener Kanal
def eigene(cfg):
    yt = YT()
    me = yt.data("channels", part="id", mine="true")["items"][0]["id"]
    if me != cfg["kanal_id"]:
        sys.exit(f"Token zeigt auf Kanal {me}, erwartet {cfg['kanal_id']}. Abbruch.")
    ch, vids = uploads(yt.data, me, cfg.get("max_filme", 60))
    lang = [v for v in vids if v["dauer_s"] >= cfg.get("min_laenge_s", 180)]
    merk = {}
    if os.path.exists(cfg["merkmale"]):
        merk = {r["video_id"].strip(): r for r in csv.DictReader(open(cfg["merkmale"], encoding="utf-8"))}
    end = TODAY - dt.timedelta(LAG)
    flt = "video==" + ",".join(v["id"] for v in lang[:200])

    life = {r["video"]: r for r in yt.report(
        "2020-01-01", end, dimensions="video", maxResults=200, sort="-views", filters=flt,
        metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,"
                "subscribersGained,subscribersLost,likes,comments,shares")}

    # Impressionen/CTR liefert die API nicht jedem Kanal -> dann fuer Ausreisser in Studio nachsehen
    ctr = {}
    try:
        ctr = {r["video"]: r for r in yt.report(
            "2020-01-01", end, dimensions="video", maxResults=200, filters=flt,
            metrics="videoThumbnailImpressions,videoThumbnailImpressionsClickRate")}
    except RuntimeError as e:
        WARN.append("Impressionen/CTR nicht per API verfügbar, für Ausreißer in YouTube Studio (Reichweite) nachsehen")

    for v in lang:
        pub = dt.date.fromisoformat(v["veroeffentlicht"])
        v["alter_t"] = (TODAY - pub).days
        v["merkmale"] = merk.get(v["id"], {})
        L = life.get(v["id"], {})
        for k in ("views", "estimatedMinutesWatched", "averageViewDuration", "averageViewPercentage",
                  "subscribersGained", "subscribersLost", "likes", "comments", "shares"):
            v[k] = L.get(k)
        C = ctr.get(v["id"], {})
        v["impressionen"] = C.get("videoThumbnailImpressions")
        v["ctr"] = C.get("videoThumbnailImpressionsClickRate")
        # Aufrufe Tag 1/2/7 (Analytics-Tage, US-Pazifikzeit), kumuliert
        v["tag"] = {}
        if pub <= end:
            cum = 0
            for i, row in enumerate(sorted(yt.report(pub, min(pub + dt.timedelta(6), end), dimensions="day",
                                                     metrics="views", filters=f"video=={v['id']}"),
                                           key=lambda r: r["day"])):
                cum += row["views"]
                v["tag"][i + 1] = cum
        for k in (1, 2, 7):
            v[f"tag{k}"] = v["tag"].get(k) if (end - pub).days + 1 >= k else None
        # Details nur fuer juengere Filme (spart Abfragen)
        v["retention"] = None
        if v["alter_t"] <= cfg.get("detail_tage", 21) and pub <= end:
            tr = yt.report(pub, end, dimensions="insightTrafficSourceType", metrics="views",
                           filters=f"video=={v['id']}")
            tot = sum(r["views"] for r in tr) or 1
            v["traffic"] = {r["insightTrafficSourceType"]: round(100 * r["views"] / tot, 1) for r in tr}
            curve = yt.report(pub, end, dimensions="elapsedVideoTimeRatio",
                              metrics="audienceWatchRatio,relativeRetentionPerformance",
                              filters=f"video=={v['id']};audienceType==ORGANIC")
            ut = v["merkmale"].get("untertitel", "").strip()
            subs = srt(os.path.join(cfg.get("film_ordner", ""), ut)) if ut else []
            v["retention"] = retention_points(curve, v["dauer_s"], subs, cfg)
            v["untertitel_gefunden"] = bool(subs)

    def woche(e):
        s = e - dt.timedelta(6)
        tot = yt.report(s, e, metrics="views,estimatedMinutesWatched,subscribersGained,subscribersLost,"
                                      "averageViewDuration")
        share = lambda dim, rows: {r[dim]: round(100 * r["views"] / (sum(x["views"] for x in rows) or 1), 1)
                                   for r in rows}
        return {"von": str(s), "bis": str(e), **(tot[0] if tot else {}),
                "geraet": share("deviceType", yt.report(s, e, dimensions="deviceType", metrics="views")),
                "alter": {r["ageGroup"]: r["viewerPercentage"]
                          for r in yt.report(s, e, dimensions="ageGroup", metrics="viewerPercentage")},
                "quellen": share("insightTrafficSourceType",
                                 yt.report(s, e, dimensions="insightTrafficSourceType", metrics="views")),
                "abo_status": share("subscribedStatus",
                                    yt.report(s, e, dimensions="subscribedStatus", metrics="views"))}

    return {"kanal": {"id": me, "name": ch["snippet"]["title"],
                      "abos": int(ch["statistics"].get("subscriberCount", 0)),
                      "aufrufe": int(ch["statistics"].get("viewCount", 0))},
            "woche": woche(end), "vorwoche": woche(end - dt.timedelta(7)), "filme": lang}


# ------------------------------------------------------------------ Konkurrenz
def konkurrenz(cfg):
    k = cfg.get("konkurrenz") or {}
    if not os.path.exists(k.get("datei", "")):
        return []
    rows = [r for r in csv.DictReader(open(k["datei"], encoding="utf-8"))
            if all(r.get(a) == b for a, b in (k.get("filter") or {}).items())]
    tage, faktor, out = k.get("tage", 14), k.get("faktor", 3), []
    for r in rows:
        try:
            _, vids = uploads(public, r["channel_id"], 30)
        except Exception as e:
            WARN.append(f"Konkurrenz {r.get('name')} nicht abrufbar")
            continue
        lf = [v for v in vids if v["dauer_s"] >= cfg.get("min_laenge_s", 180)]
        for v in lf:
            v["alter_t"] = (TODAY - dt.date.fromisoformat(v["veroeffentlicht"])).days
        basis = med([v["aufrufe_live"] for v in lf if v["alter_t"] >= 3][:10])
        if not basis:
            continue
        for v in lf:
            if v["alter_t"] <= tage and v["aufrufe_live"] >= faktor * basis:
                out.append({"kanal": r.get("name"), "titel": v["titel"], "id": v["id"],
                            "aufrufe": v["aufrufe_live"], "faktor": round(v["aufrufe_live"] / basis, 1),
                            "alter_t": v["alter_t"], "dauer": mmss(v["dauer_s"])})
    return sorted(out, key=lambda x: -x["faktor"])


# ------------------------------------------------------------------ zahlen.md
def ampel(x, norm):
    if x is None or not norm:
        return "⚪"
    q = x / norm
    return "🟢" if q >= 1.25 else "🔴" if q <= 0.75 else "🟡"


QUELLE = {"SUBSCRIBER": "Startseite/Abo-Feed", "RELATED_VIDEO": "Vorgeschlagen", "YT_SEARCH": "Suche",
          "YT_CHANNEL": "Kanalseite", "NO_LINK_OTHER": "Direkt/unbekannt", "END_SCREEN": "Endcards",
          "EXT_URL": "Extern", "PLAYLIST": "Playlist", "NOTIFICATION": "Glocke", "SHORTS": "Shorts",
          "YT_OTHER_PAGE": "andere YT-Seiten", "ANNOTATION": "Infokarten", "HASHTAGS": "Hashtags"}


def quellen(q, n):
    return ", ".join(f"{QUELLE.get(k, k)} {x:.0f} %" for k, x in sorted(q.items(), key=lambda t: -t[1])[:n])


def pct45(a):
    return sum(v for k, v in a.items() if k in ("age45-54", "age55-64", "age65-"))


def zahlen_md(d, prev, cfg):
    F, n, hm = d["filme"], cfg.get("normal_filme", 10), cfg.get("hauptmass", "tag2")
    for v in F:
        v["abo_pro_1k"] = (1000 * v["subscribersGained"] / v["views"]) if v.get("views") else None
    # Normalwert: dieselben n Filme fuer alle Werte (die juengsten, deren Hauptmass schon feststeht);
    # Tag 7 braucht aeltere Filme und bekommt eigene n.
    basis = [v for v in F if v.get(hm) is not None][:n]
    norm = {k: med([v.get(k) for v in basis])
            for k in ("tag1", "tag2", "averageViewPercentage", "abo_pro_1k", "ctr")}
    norm["tag7"] = med([v["tag7"] for v in F if v.get("tag7") is not None][:n])
    norm["s30"] = med([v["retention"]["s30"] for v in basis if v.get("retention")])
    w, p = d["woche"], d["vorwoche"]
    diff = lambda k: f"{fmt(w.get(k))} ({((w.get(k) or 0) / (p.get(k) or 1) - 1) * 100:+.0f} %)"
    net = lambda x: (x.get("subscribersGained") or 0) - (x.get("subscribersLost") or 0)
    L = [f"# Zahlen {TODAY} · {d['kanal']['name']}", ""]
    if WARN:
        L += ["> Hinweise: " + " · ".join(WARN), ""]
    L += [f"## Kanal-Woche {w['von']} bis {w['bis']} (Klammer: gegenüber Vorwoche)", "",
          f"- Abos gesamt: {fmt(d['kanal']['abos'])}" +
          (f" (letzter Snapshot {prev['datum']}: {fmt(prev['kanal']['abos'])})" if prev else ""),
          f"- Aufrufe: {diff('views')} · Wiedergabestunden: {fmt((w.get('estimatedMinutesWatched') or 0) / 60)}"
          f" · Abos netto: {fmt(net(w))} (Vorwoche {fmt(net(p))})",
          f"- Aufrufe pro neuem Abo: {fmt((w.get('views') or 0) / (w.get('subscribersGained') or 1))}"
          f" (Vorwoche {fmt((p.get('views') or 0) / (p.get('subscribersGained') or 1))})",
          f"- Ø Wiedergabedauer: {mmss(w.get('averageViewDuration') or 0)} (Vorwoche {mmss(p.get('averageViewDuration') or 0)})",
          f"- TV-Anteil: {w['geraet'].get('TV', 0)} % (Vorwoche {p['geraet'].get('TV', 0)} %)"
          f" · Alter 45+: {pct45(w['alter']):.1f} % (Vorwoche {pct45(p['alter']):.1f} %)",
          f"- Aufrufe von Abonnenten: {w['abo_status'].get('SUBSCRIBED', 0)} % (Vorwoche {p['abo_status'].get('SUBSCRIBED', 0)} %)",
          "- Quellen: " + quellen(w["quellen"], 5),
          "",
          f"## Normalwert (Median der letzten {len(basis)} Langfilme mit fertigem {hm.replace('tag', 'Tag ')})", "",
          f"Tag 1: {fmt(norm['tag1'])} · Tag 2: {fmt(norm['tag2'])} · Tag 7: {fmt(norm['tag7'])} · "
          f"Ø gesehen: {fmt(norm['averageViewPercentage'], pct=True)} · Abos pro 1.000 Aufrufe: {fmt(norm['abo_pro_1k'], 1)}"
          f" · Halt nach 0:30: {fmt((norm['s30'] or 0) * 100, pct=True)} · CTR: {fmt(norm['ctr'], pct=True)}",
          "", f"Ampel nach {hm.replace('tag', 'Tag ')}: 🟢 ≥ 125 % des Normalwerts · 🟡 dazwischen · 🔴 ≤ 75 % · ⚪ zu jung", "",
          "## Filme (neueste zuerst)", "",
          "| Ampel | Film | Alter | Tag 1 | Tag 2 | Tag 7 | gesamt | CTR | Ø gesehen | 0:30 | Abos/1k | Merkmale |",
          "|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for v in F[:cfg.get("tabelle_filme", 20)]:
        m, r = v["merkmale"], v.get("retention") or {}
        merk = " · ".join(m.get(k, "") for k in cfg.get("merkmal_spalten", [])) if m else "fehlen"
        L.append(f"| {ampel(v.get(hm), norm[hm])} | {m.get('nr', '')} {v['titel'][:48].replace('|', '/')} | {v['alter_t']} T | "
                 f"{fmt(v.get('tag1'))} | {fmt(v.get('tag2'))} | {fmt(v.get('tag7'))} | {fmt(v.get('views'))} | "
                 f"{fmt(v.get('ctr'), pct=True)} | {fmt(v.get('averageViewPercentage'), pct=True)} | "
                 f"{fmt(r['s30'] * 100, pct=True) if r.get('s30') else '–'} | {fmt(v.get('abo_pro_1k'), 1)} | {merk} |")
    L += ["", "## Trichter je Film (wo hängt es?)", "",
          "CTR schwach = Verpackung · 0:30 schwach = Einstieg · Ø gesehen schwach = Mittelteil · "
          "Abos/1k schwach = Kanalbindung · alles gut, aber wenig Aufrufe = Thema/Ausspielung", ""]
    for v in F:
        r = v.get("retention")
        if not r:
            continue
        flags = []
        if v.get("ctr") and norm["ctr"] and v["ctr"] < 0.8 * norm["ctr"]:
            flags.append("Verpackung")
        if norm["s30"] and r["s30"] < norm["s30"] - 0.05:
            flags.append("Einstieg")
        if v.get("averageViewPercentage") and norm["averageViewPercentage"] and \
                v["averageViewPercentage"] < 0.85 * norm["averageViewPercentage"]:
            flags.append("Mittelteil")
        if v.get("abo_pro_1k") and norm["abo_pro_1k"] and v["abo_pro_1k"] < 0.75 * norm["abo_pro_1k"]:
            flags.append("Kanalbindung")
        if not flags and v.get(hm) and norm[hm] and v[hm] < 0.75 * norm[hm]:
            flags.append("Thema/Ausspielung")
        L += [f"### {v['merkmale'].get('nr', '')} {v['titel']} ({v['alter_t']} T, {mmss(v['dauer_s'])})",
              f"- Engpass: {', '.join(flags) or 'keiner'}",
              f"- Halt: 0:30 {r['s30'] * 100:.0f} % · 1:00 {r['s60'] * 100:.0f} % · "
              f"5:00 {('%.0f %%' % (r['m5'] * 100)) if r.get('m5') else '–'} · Mitte {r['mitte'] * 100:.0f} % · "
              f"Ende {r['ende'] * 100:.0f} %",
              "- Quellen: " + quellen(v.get("traffic", {}), 4)]
        if not v.get("untertitel_gefunden"):
            L.append("- Untertitel fehlen (Spalte untertitel in merkmale.csv), Stellen ohne Satz")
        for s in r["stellen"]:
            L.append(f"  - {s['art']} bei {s['zeit']} ({s['aenderung_pp']:+} Pp.): „{s['satz']}“")
        L.append("")
    k = cfg.get("konkurrenz") or {}
    L += [f"## Konkurrenz-Ausreißer (letzte {k.get('tage', 14)} Tage, ≥ {k.get('faktor', 3)}× Normalwert des Kanals)", ""]
    if d["konkurrenz"]:
        L += ["| Faktor | Kanal | Titel | Aufrufe | Alter | Länge |", "|---|---|---|---|---|---|"]
        L += [f"| {c['faktor']}× | {c['kanal']} | [{c['titel'][:70].replace('|', '/')}](https://youtu.be/{c['id']}) | "
              f"{fmt(c['aufrufe'])} | {c['alter_t']} T | {c['dauer']} |" for c in d["konkurrenz"][:15]]
    else:
        L.append("Keine Ausreißer (oder Konkurrenz nicht eingerichtet).")
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser(description="Wochen-Kanalanalyse: Zahlen ziehen und rechnen")
    ap.add_argument("--config", required=True, help="Einstellungsdatei kanal.json")
    ap.add_argument("--ohne-konkurrenz", action="store_true")
    a = ap.parse_args()
    cfg = json.load(open(a.config, encoding="utf-8"))
    base = os.path.dirname(os.path.abspath(a.config))
    rel = lambda p: os.path.join(base, p)
    cfg["ordner"], cfg["merkmale"] = rel(cfg["ordner"]), rel(cfg["merkmale"])
    cfg["film_ordner"] = rel(cfg.get("film_ordner", "."))
    if (cfg.get("konkurrenz") or {}).get("datei"):
        cfg["konkurrenz"]["datei"] = rel(cfg["konkurrenz"]["datei"])

    d = eigene(cfg)
    d["konkurrenz"] = [] if a.ohne_konkurrenz else konkurrenz(cfg)
    d["datum"], d["hinweise"] = str(TODAY), WARN
    os.makedirs(cfg["ordner"], exist_ok=True)
    old = sorted(x for x in os.listdir(cfg["ordner"]) if re.match(r"\d{4}-\d\d-\d\d$", x) and x < str(TODAY))
    pf = os.path.join(cfg["ordner"], old[-1], "daten.json") if old else ""
    prev = json.load(open(pf, encoding="utf-8")) if pf and os.path.exists(pf) else None
    out = os.path.join(cfg["ordner"], str(TODAY))
    os.makedirs(out, exist_ok=True)
    json.dump(d, open(os.path.join(out, "daten.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(os.path.join(out, "zahlen.md"), "w", encoding="utf-8").write(zahlen_md(d, prev, cfg))
    print(f"OK: {out}/zahlen.md · {len(d['filme'])} Filme · {len(d['konkurrenz'])} Konkurrenz-Ausreißer")
    fehlt = [v for v in d["filme"] if not v["merkmale"]]
    if fehlt:
        print("Ohne Merkmale (in merkmale.csv ergänzen):")
        for v in fehlt:
            print(f"  {v['id']}\t{v['veroeffentlicht']}\t{v['titel']}")
    for w in WARN:
        print("Hinweis:", w)


if __name__ == "__main__":
    main()
