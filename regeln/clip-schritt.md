# Interview-Clips (Original Footage) im Produktionsablauf

Gilt für jeden neuen Film ab 6.11.2026 (Jakob). Laufende Filme werden nicht umgebaut, außer Jakob will es.

## Worum es geht

Jeder Film bekommt echte Interview-Clips (O-Töne), weil eine echte Stimme einen Gedanken stärker belegt als der Sprecher und weil sichtbare echte Menschen den Kanal weniger nach „Schablonen-Ware“ aussehen lassen. Gleichzeitig dürfen die Clips die Monetarisierung nicht gefährden.

YouTube nennt keinen festen erlaubten Prozentsatz. Die echten Risiken sind:

1. **Content-ID-Anspruch** auf einen Clip: Die Einnahmen dieses Videos gehen an den Rechteinhaber, oder das Video wird gesperrt.
2. **„Wiederverwendete Inhalte“** (YPP), wenn fremdes Material den Film trägt statt unsere eigene Arbeit.

Deshalb gilt eine eigene, vorsichtige Grenze mit Puffer: **Ziel ≤ 8 % der Laufzeit, harte Grenze 10 %.**

## Die Grenzen

| Regel | Wert |
|---|---|
| Clips pro Film | 3–6 |
| Länge pro Clip | 4–15 s (Ziel 6–12 s), nie über 20 s |
| Anteil am Film | Ziel ≤ 8 %, hart ≤ 10 % (10-Min-Film: Ziel ≤ 48 s, hart ≤ 60 s) |
| Aus einem Quellvideo | höchstens 2 Clips und zusammen ≤ 20 s |
| Abstand | zwischen zwei Clips mindestens 45 s eigener Film |
| Einordnung | jeder Clip hat einen eigenen VO-Satz davor oder danach (wer, wann, warum es zählt) |
| Hook | ein Clip in den ersten 60 s ist erlaubt, wenn er das Titelversprechen belegt |

## Wo im Ablauf (siehe Gesamtablauf: Max-Zone / High-Zone)

**Max-Zone**

- **3 Gerüst:** Im Gerüst 3–5 Clip-Stellen markieren. Gute Stellen: der Beleg für eine überraschende Behauptung („Er hat es selbst gesagt“), ein Wendepunkt, eine Gegenstimme. Kein Clip als bloße Deko.
- **4 Recherche → Clip-Zettel:** Die Recherche liefert pro Clip-Stelle 1–2 Kandidaten in `clips.json` (Format unten): Quelle, genaue Zeitmarken, wörtliches Transkript, Ampel, Kontext ±30 s.
- **5 Skript:** Der Texter setzt die gewählten Clips als `[CLIP C1]` mit wörtlichem Text ins Skript und schreibt den Einordnungssatz. Der Kritiker prüft: trägt jeder Clip die Geschichte, und ist der Anteil unter der Grenze?
- **6 Hörfassung:** Den O-Ton echt einschneiden, damit Jakob die Clips bei der Freigabe mithört.
- **7 Faktencheck:** Jeder Clip kommt auf die Ampelseite: Wortlaut stimmt mit dem Transkript überein, Datum, und die Aussage ist nicht aus dem Zusammenhang gerissen (Kontext ±30 s gelesen).

**High-Zone**

- **Shotliste:** Clips als eigene Zeilen. Übergang ohne Blende: Die Animation führt in einen Rahmen oder Bildschirm hinein, in dem der Clip läuft, und danach wieder heraus.
- **Download:** yt-dlp mit Cookies (Weg im Projektgedächtnis), genau die Zeitmarken plus 1 s Rand, Ton prüfen.
- **Bild:** neben dem Namen Rolle + Jahr + „ORIGINAL FOOTAGE“. Eigene englische Untertitel wie beim Sprecher; vorhandene eingebrannte Untertitel im Clip vermerken (`burned: true`).
- **Mix:** Musik unter dem Clip stark ducken, keine SFX über dem O-Ton.
- **Anteil-Check vor dem Render:** `python3 tools/clip_check.py <clips.json> <timing.json>` muss grün sein.

**Upload**

- Beschreibung: Block `ORIGINAL FOOTAGE (marked in the film, nothing in it is generated)` mit Sprecher, Quelle und Link pro Clip, vor `SOURCES`. Die YPP-Zeile lautet dann: „Every animation in this film was built from scratch for it, in code: no stock footage, no AI-generated images or video. Clips marked ORIGINAL FOOTAGE are real recordings, credited below. The narration uses a synthetic voice.“
- Nach dem privaten Upload in Studio unter **Prüfungen / Urheberrecht** nachsehen (Jakob oder per Remote Control am iMac), bevor das Video öffentlich wird. Gibt es einen Anspruch: Clip durch eine Zitatkarte ersetzen und neu hochladen.

## Quellen-Ampel

- **Grün:** offizielle Kanäle der Labs und Firmen (OpenAI, Anthropic, Google DeepMind, Microsoft, Nvidia, Meta), Anhörungen der US-Regierung und des Kongresses (Bundeswerke sind gemeinfrei, C-SPAN aber nicht), Videos mit Lizenz CC BY, Uni-Vorträge.
- **Gelb (kurz halten, gut einordnen):** Podcasts und Interviews unabhängiger Creator, Konferenzen (WEF, Summits), Nachrichtenagenturen.
- **Rot (nur Zitatkarte):** große TV-Sender (CBS/60 Minutes, CNBC, CNN, BBC, Fox), NC-Lizenzen (TED), Filme und Dokus, jeder Clip mit Musik im Hintergrund (Content ID erkennt Musik am sichersten).

## Fair-Use-Kurzprüfung pro Clip

1. Kommentieren oder analysieren wir den Clip (nicht nur zeigen)?
2. Ist er kurz, und ist es nicht der Kern- oder Höhepunkt des Originals?
3. Ersetzt unser Film das Original nicht?
4. Bleibt die Aussage im Ausschnitt so, wie sie gemeint war?

Viermal ja, sonst Zitatkarte.

## clips.json

Pro Film in `audio/clips.json`:

```json
{
  "clips": [
    {
      "id": "C1",
      "speaker": "Dario Amodei",
      "role": "CEO, Anthropic",
      "source_title": "…",
      "channel": "Anthropic",
      "url": "https://www.youtube.com/watch?v=…",
      "date": "2026-05-14",
      "in": "00:12:31.400",
      "out": "00:12:40.900",
      "transcript": "wörtlich, was gesagt wird",
      "ampel": "gruen",
      "slot": "nach Satz 'Then the people building it said it out loud.'",
      "einordnung": "der VO-Satz, der den Clip einordnet",
      "burned": false
    }
  ]
}
```
