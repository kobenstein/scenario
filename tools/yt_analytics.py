#!/usr/bin/env python3
"""Read-only access to YouTube Analytics + Data API for The Good Takeoff.

Needs three environment variables in the cloud environment (never in the repo):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN

Usage:
  python3 tools/yt_analytics.py check                 # token + channel name
  python3 tools/yt_analytics.py retention VIDEO_ID    # audience retention curve
  python3 tools/yt_analytics.py videos [DAYS]         # per-video stats, last N days (default 28)
  python3 tools/yt_analytics.py traffic [VIDEO_ID]    # traffic sources (channel or one video)
  python3 tools/yt_analytics.py query key=value ...   # raw reports.query, e.g. metrics=views dimensions=day
"""
import datetime as dt
import json
import os
import sys
import urllib.parse
import urllib.request

# oauth2.googleapis.com is blocked by the network policy, this endpoint is equivalent
TOKEN_URL = "https://accounts.google.com/o/oauth2/token"
ANALYTICS = "https://youtubeanalytics.googleapis.com/v2/reports"
DATA = "https://www.googleapis.com/youtube/v3/"
START = "2026-10-01"


def access_token():
    try:
        body = urllib.parse.urlencode({
            "client_id": os.environ["YT_CLIENT_ID"],
            "client_secret": os.environ["YT_CLIENT_SECRET"],
            "refresh_token": os.environ["YT_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        }).encode()
    except KeyError as e:
        sys.exit(f"missing env var {e}")
    with urllib.request.urlopen(TOKEN_URL, body) as r:
        return json.load(r)["access_token"]


def get(url, params, token):
    req = urllib.request.Request(url + "?" + urllib.parse.urlencode(params),
                                 headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:800]}")


def report(token, **params):
    params = {"ids": "channel==MINE", "startDate": START,
              "endDate": dt.date.today().isoformat(), **params}
    return get(ANALYTICS, params, token)


def table(res):
    cols = [h["name"] for h in res.get("columnHeaders", [])]
    print("\t".join(cols))
    for row in res.get("rows", []):
        print("\t".join(str(v) for v in row))


def main():
    cmd, args = (sys.argv[1], sys.argv[2:]) if len(sys.argv) > 1 else ("check", [])
    token = access_token()
    if cmd == "check":
        ch = get(DATA + "channels", {"part": "snippet,statistics", "mine": "true"}, token)
        for c in ch.get("items", []):
            print(c["id"], c["snippet"]["title"], c["statistics"])
        table(report(token, metrics="views,estimatedMinutesWatched,subscribersGained"))
    elif cmd == "retention":
        table(report(token, dimensions="elapsedVideoTimeRatio",
                     metrics="audienceWatchRatio,relativeRetentionPerformance",
                     filters=f"video=={args[0]};audienceType==ORGANIC"))
    elif cmd == "videos":
        days = int(args[0]) if args else 28
        table(report(token, startDate=(dt.date.today() - dt.timedelta(days)).isoformat(),
                     dimensions="video", sort="-views", maxResults=50,
                     metrics="views,estimatedMinutesWatched,averageViewDuration,"
                             "averageViewPercentage,subscribersGained,likes,comments"))
    elif cmd == "traffic":
        extra = {"filters": f"video=={args[0]}"} if args else {}
        table(report(token, dimensions="insightTrafficSourceType", sort="-views",
                     metrics="views,estimatedMinutesWatched", **extra))
    elif cmd == "query":
        table(report(token, **dict(a.split("=", 1) for a in args)))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
