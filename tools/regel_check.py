#!/usr/bin/env python3
"""Prüft ein Off-Text-Skript (vo-*.txt) gegen schreibraum/REGELN.md.

Aufruf: python3 tools/regel_check.py <vo.txt> [weitere vo.txt ...]

Meldet: Bann-Liste, Fahrplan-Sätze, Jahreszahlen der Vergangenheit und Zahlen
in Minute 1, Fragen in Minute 1, Ich-Sätze des Erzählers, Clip-Anzahl, Wortzahl.
Treffer sind Hinweise für den Kritiker, kein automatisches Urteil
(z. B. Dialog einer Figur in einer markierten Szene ist erlaubt).
"""
import re
import sys

WPM = 145  # Wörter pro Minute
BANN = [
    r"\b(nobody|no one|almost nobody|hardly anyone)\b[^.?!]{0,25}\b(talking|noticed|realizes|asks|tells)\b",
    r"what nobody tells", r"the part nobody", r"the real story", r"hidden truth",
    r"what they don'?t want you", r"can'?t stop thinking", r"strangest part",
    r"here'?s the thing", r"here'?s the twist", r"puts it better than",
    r"everything is about to change", r"that'?s about to change",
    r"keep that in mind", r"path (one|two)\b", r"\bpart (one|two|three)\b",
    r"now let'?s look", r"here'?s where it gets", r"just a scenario",
    r"tell me in the comments", r"to wrap up", r"in conclusion",
    r"revolutionary", r"game.?changer", r"terrifying",
]
FAHRPLAN = [r"in the next (\w+ )?minutes", r"in this video", r"most of us (picture|think|imagine)"]
ZAHLWORT = (r"\b\d[\d,.]*\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|"
            r"thirteen|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|"
            r"thousand|million|billion|trillion|percent)\b")


def pruefe(pfad):
    roh = open(pfad, encoding="utf-8").read()
    text = re.sub(r"\[[^\]]*\]", " ", roh)
    woerter = text.split()
    minute1 = " ".join(woerter[:WPM])
    print(f"===== {pfad}  ({len(woerter)} Wörter ≈ {len(woerter)/WPM:.1f} Min)")
    funde = 0
    for muster in BANN + FAHRPLAN:
        for m in re.finditer(muster, text, re.I):
            pos = len(text[:m.start()].split())
            print(f"  BANN/FAHRPLAN  „{m.group(0)}“ bei ~{pos // WPM}:{pos % WPM * 60 // WPM:02d}")
            funde += 1
    jahre = re.findall(r"\b(1[5-9]\d\d|20[01]\d|202[0-5])\b", minute1)
    jahre += re.findall(r"\b(nineteen \w+|two thousand( and)? \w+|twenty (ten|eleven|twelve|"
                        r"thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|"
                        r"twenty-\w+))\b", minute1, re.I)
    if jahre:
        print(f"  MINUTE 1  Jahreszahlen (Rückblick?): {[j if isinstance(j, str) else j[0] for j in jahre]}")
        funde += 1
    zahlen = [m.group(0) for m in re.finditer(ZAHLWORT, minute1, re.I)]
    if len(zahlen) > 2:
        print(f"  MINUTE 1  {len(zahlen)} Zahl-Wörter (Regel: höchstens eine Zahl): {zahlen[:12]}")
        funde += 1
    fragen = minute1.count("?")
    if fragen > 1:
        print(f"  MINUTE 1  {fragen} Fragezeichen (Regel: eine Hauptfrage)")
        funde += 1
    saetze = re.split(r"(?<=[.!?])\s+", text)
    ich = [s.strip() for s in saetze
           if re.search(r"\b(I|I'm|I've|I'd|I'll|my|me)\b", s) and not re.search(r"[\"“”]", s)]
    for s in ich[:8]:
        print(f"  ICH-SATZ?  {s[:90]}")
    funde += len(ich)
    clips = re.findall(r"\[CLIP[^\]]*\]", roh, re.I)
    if not 3 <= len(clips) <= 6:
        print(f"  CLIPS  {len(clips)} (Regel: 3–6)")
        funde += 1
    if not 1150 <= len(woerter) <= 1650:
        print(f"  LÄNGE  {len(woerter)} Wörter (Richtwert 1.300–1.500)")
    print(f"  → {funde} Hinweis(e)")
    return funde


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    gesamt = sum(pruefe(p) for p in sys.argv[1:])
    sys.exit(1 if gesamt else 0)
