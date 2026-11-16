# Film 13 · „The AI Bubble Could Pop. Superintelligence Won't Stop.“ · Motion-Regeln (Lead-Brief für alle Builder)

Stand 2026-10-28 (Lead Bild, v1). The Good Takeoff, Englisch, 1920×1080, 30 fps, ~10:39 VO + Endscreen.
- **Text:** `film-blase/vo-v3.txt` (nach Faktencheck, eckige Klammern werden nicht gesprochen).
- **Timing:** `film-blase/audio/timing.json` (Wortzeiten global in s; Abschnitte `00a` … `08c`). Vorher: `audio/timing-provisional.json` im Repo (automatischer Wechsel, `lib/kit.mjs timingFile()`).
- **Bindende Shotliste:** `shots.md` (Quelle `tools/shots_bubble.py`). **Stil:** `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (gilt vor allem anderen). **Faktencheck:** `film-blase/faktencheck.md`.

**Leitgedanke (ein GEDANKE, kein Bildmotiv):** *Die Blase kann platzen. Was bleibt, sind die Schienen. Die Frage ist, wer mitfahren darf.* Die Schiene zeigt sich nur an **vier Ankern** (§3). Überall sonst bekommt jeder Satz sein eigenes Bild.

Lies das ganz, bevor du eine Zeile Code schreibst. Der Film ist **gezeichnet** (Canvas 2D in Node, 2.5D-Karten vor einer Perspektivkamera): keine KI-Bilder, kein Bild-zu-Video, kein Footage, kein Spiel-3D.

---

## 0 · Status
- Produktion in einem Durchgang, ohne Stil-Test (Jakob). **Qualitätsreferenz:** `scenes/sc01.mjs` (c01, Hook, 0–56,9 s, vom Lead gebaut) und ihr Kontaktbogen `film-blase/bild/c01_kontakt.png`.
- `tools/kit_sheet.mjs` zeichnet jedes Motiv des Kits auf ein Blatt (`node tools/kit_sheet.mjs $SP/kit.jpg`): die visuelle API.
- Fehlende Chunks rendern als Platzhalter (`lib/stub.mjs`).
- **Immer über Phrasen ankern, nie über Sekunden:** `T.F('still running today')` (erste Stelle im ganzen Film), `T.F(phrase, after)` (erste Stelle ab Zeit `after`), `T.FE(…)` (Wortende), oder sequenziell `const at = T.seq(R.a); at('Then the crash'); at('anyway')`. Das VO kann neu geschnitten werden; die Phrasen ziehen mit.

## 1 · Motion-DNA (eine Zelle: ruhig + weich, Editorial)
| | |
|---|---|
| Energie | ruhige Doku; ein Akzent auf dem Schlüsselwort, dann 1,5–3 s lebendiges Halten. Tempo-Kontrast 3–5×. |
| Easing | Auftritte/Landungen expo-out, Abgänge expo-in, Bewegungen quart in-out, **Kamera sinus-S** (`camAt` mit `'s'`). Nie linear außer Mechanik (Räder, Zeiger, Ticker). Überschwingen ≤ 3 %. |
| Basiseinheit | **0,4 s.** Mikroakzent 0,25–0,35 · Auftritt 0,4–0,7 · Hand/Flip 0,8–1,2 · Kamera ≥ 1,6, Fahrten 2,5–4 s. Passt eine Fahrt nicht zwischen zwei Wörter: früher anfangen, nie schneller. |
| Physik | Papier ist leicht (taumelt, segelt, Flip mit Nachschwingen), Eisen und Münzen schwer (kurzer harter Stopp), Licht weich. Berührt A B, reagiert B 40–120 ms später, kleiner. |
| Formen | flache Formen auf 2.5D-Ebenen, Körnung in den Lichtabfällen, ein Held-Licht. |
| Kamera | langsame Gleitfahrten, Push, Kran, Rückzug, Fahrt mit dem Träger. Keine Achterbahn, kein Flug durch Körper, keine Whip-Pans. |
| Übergänge | Plansequenz · Verwandlung · Flip · Fahrt mit dem Träger · Flug in eine Fläche · Papier-Schnitt (§5). **Keine Blenden, kein Fade, kein Slide, kein Wischer.** |
| Signatur | **der Flip** (§4). |

## 2 · Palette (Basis `E.P` aus `lib/f10_editorial.mjs`, Akzente `B.COL` aus `lib/bubble_kit.mjs`)
| Rolle | Farbe | Verwendung |
|---|---|---|
| Nacht, Grund | `#080b27` `#0a1334` `#0e112c` | Himmel, Explainer-Grund (tiefes Indigo, kein Mittelblau) |
| Gold (Held-Licht) | Kern `#fefde2`, Halo `#ead295` `#dec688`, Schatten `#9e7d54` | die Blase, Lampen, Kerze, Laterne, Zug-Fenster, Hervorhebung |
| **Papier** | `paper0 #efe5c6` … `paper3 #5f5640` | Banknoten, Zertifikate, Zeitungen, Briefe, Tickets, Geldlinie |
| **Tinte** | `ink #161b3c`, `ink2 #2c3159` | Druck, Handschrift, die Tintenlinie, die gedruckte Lok |
| **Salbei** | `sage #9db095` | nur die Guillochen der Banknoten (ein Hauch Geld) |
| **Maschine (kühl)** | `cool #cfd8f0`, `cool2 #8f9cc8`, `coolDeep #3e4d86` | Serverlichter, Fähigkeits-Kurve, Handy-Bildschirm, Glasfaser |
| **Verlust** | `loss #33497a` | was fällt, was verloren ist (kaltes Blau, **nie Rot**) |
| Du | `#f2b632` (Regenmantel) | nur du, sonst niemand trägt Gelb |
| Schrift | Creme `#fefcde`, Labels `P.halo2` | Instrument Serif (Zahlen, Zitate), Inter 600 (Labels, Quellen) |

Grain: `K.PRINT13 = { grain 14, floor 4, vig .5 }`, 10 Hz. Korn ist Textur, nie Effekt. Luma-Mittel 40–60.

## 3 · Die vier Schienen-Anker (sonst keine Schiene, kein Gleis, **kein Bahnsteig vor A4**)
| Anker | Shot | Phrase | Bild |
|---|---|---|---|
| **A1** | 1.11–1.12 | „still running today“ | Die Tintenlinie wird im Papier zur eisernen Schiene in der Abenddämmerung; ein heutiger Zug gleitet heran und hält bei dir; die Tür öffnet sich („who gets to ride?“) und schließt sich zum Lichtspalt. |
| **A2** | 3.01 | „The track“ | Morgendämmerung nach dem Krach, Nebel; eine frische Schiene quer durchs Tal, unberührt, kein Zug. |
| **A3** | 10.06–10.09 | „penny train of artificial intelligence“ | Die Stücke vom Tisch fliegen zu einem kleinen warmen Zug zusammen: ein Wagen, Dach, Sitz. Einsteigen vom Boden. |
| **A4** | 12.05–12.06 | „The rails are being laid right now“ | Abenddämmerung, eine neue Schiene wird gelegt, Funken, die Tafel `PRICE:` mit leerem Feld; Endscreen: ferner Zug. |
Die Lok von 1845 (1.08, aus dem Stempel) fährt **über den Tisch**, nicht auf einer Schiene. Zugbilder in c08 (parliamentary trains) zeigen Menschen und Tickets, keinen Zug.

## 4 · Durchgehende Objekte und die Signatur
1. **Die goldene Seifenblase aus Banknoten** (`B.bubble`, Held des Hooks und des Finales). Klarer Goldfilm, wenige große Noten drehen sich darin. Zustände: `tremble` (zittert, Bewegungsbögen), `thin` (Film flackert), `pop` (platzt, Noten treiben), `detach` (eine Note verlässt sie). Sie öffnet den Film (1.01 = Thumbnail) und platzt in 12.01. Dazwischen nur als Erinnerung (7.06: eine winzige Note in deiner Hand).
2. **Das Rechenzentrum** (`B.dataCenter`): lang, flach, kühle Serverlichter; `lum` = wie hart die Maschinen arbeiten. Es glüht immer weiter, auch wenn die Blase platzt (12.01).
3. **Papier** (`B.paperFill`, Banknote, Zertifikat, Zeitung, Brief, Ticket): das Geld und die Versprechen. Das Zertifikat mit Lok-Stempel ist das Bindeglied 1845 ↔ heute.
4. **Die Tintenlinie** (`B.inkLine`) = die **Trägerlinie** des Films: sie unterstreicht, stürzt ab (Krach), wird Achse, Kurve, Zeitleiste, Horizont und an A1/A2 die Schiene. Explainer-Linien sind Tinte (auf Papier) oder Licht (auf Nacht), dieselbe Geste.
5. **Der Flip = die Signatur.** Ein flaches Ding dreht sich um, seine Rückseite ist das Nächste (`B.flip(ctx, u, …, front, back)`). Banknote → Zertifikat (1.06), Papierfetzen → Handy (1.12), Blatt → Buchrücken (2.02), Zeitung → Buch (2.08), Zertifikate → leer (4.02), Ziegel → MONEY/POWER/DEBT (6.04), Penny → Chip (8.07). Pro Minute höchstens ~2 Flips, damit er Signatur bleibt.
6. **Du** (`E.du()`, gelber Regenmantel mit Kapuze, gesichtslos, klein): die Zuschauerin, der Zuschauer. Steht im ersten Bild unter der Blase, hält an A1 das Papier, in c04 das Handy, in c07 die Rechnung und den Rentenbrief, in c11 das Ticket. Andere Menschen: Indigo-Silhouetten (`B.worker`, `E.person`), atmen, natürliche Arme.
7. **Das Ticket** (`B.ticket`): 1844 `1d PER MILE` und der heutige Penny-Zug. Es kehrt im Finale in jeder Hand wieder.

## 5 · Weltwechsel und Träger (≤ ~1 harter Weltwechsel pro Minute)
Ein **Weltwechsel** ist ein neuer Ort oder eine neue Zeit. Jeder hat einen Träger (Form, Position, Richtung bleiben); keiner ist ein harter Schnitt ohne Reim. Geplant sind 12 Weltwechsel in 10,6 min (≈ 1,1/min); alle anderen Übergänge bleiben in der Welt (Plansequenz, Verwandlung).

| # | Wo | Von → nach | Träger |
|---|---|---|---|
| 1 | 1.06 | Rechenzentrum heute → Tisch 1845 | Note → Flip → Zertifikat füllt das Bild → **Papier-Schnitt** (`B.paperPlate`, identische Frames) |
| 2 | 1.11 | Tisch/Zeitung → Abend-Schiene (A1) | Kamera fliegt ins Papier, die Tintenlinie bleibt bei y ≈ 700 und wird die Schiene; Tinte flutet zu Himmel/Erde |
| 3 | c01→c02 | Schiene → Pfarrhaus | **Seam-Plate** Lichtspalt der Zugtür → Pfarrhausfenster (`lib/bubble_seams.mjs`) |
| 4 | 3.01 | Pfarrhaus → Morgental (A2) | Tintenzeile unter „too late“ → Horizont → Schiene |
| 5 | 3.05 | Karte/Uhren → Kabelleger auf See | Lichtpunkt der Zeitleiste → Lichtende der Faser |
| 6 | 4.05–4.08 | Kabel → dein Handy → Lagerhaus | Rückzug aus der Faser (eine Fahrt) · Lichtpunkt → Lichtstrahl |
| 7 | 6.05 | Wand (Explainer) → zugefrorener See | die Wand senkt sich zum Eisband |
| 8 | 7.01 | Zähler → deine Küche | der Zähler selbst (Rückzug) |
| 9 | 7.07 | Pfarrhausfenster → heutiges Fenster | Match-Cut auf der Fensterform |
| 10 | 8.01 | Bieterkarten → Lagerhaus-Auktion | die Karten selbst (Seam-Plate c07/c08 intern B2) |
| 11 | 9.02 / 9.05 | Schacht → Stockholm · Wafer → Alpental | Pfeile in den Schacht · Wafer als Sonne |
| 12 | 10.01 | Blaupause → Bauernhof 1932 | ein Blatt weht |
| (13) | 12.05 | Finale-Hände → A4 | Ticket → leeres Preisschild |

**Papier-Schnitt:** wo die Welt hart wechselt und ein Blatt Papier das Bild füllt, zeichnen beide Seiten `B.paperPlate(ctx, t)` mit demselben `t` über volle Deckung (identische Frames, kein Fade). calm.py zählt dort keinen Schnitt.

## 6 · Regeln gegen Hektik (messbar)
- **Bewegungsbudget:** höchstens 1–2 bewegte Hauptelemente gleichzeitig, die Kamera zählt mit. Umgebungsleben (Atmen, Sterne, Staub, Korn, Drift via `cameraFloat`, blinkende Serverlichter) zählt nicht.
- **Ein Motiv pro Satz**, das Bild zeigt, was der Satz sagt. **Nichts aus dem Nichts:** jedes Element wird gereicht, wächst, fällt herein, dreht sich um (Flip) oder steigt von einer Grundlinie auf (Masken-Wipe `K.maskLine`). **Nie halbtransparent einblenden.**
- **Kein Stillstand > 2 s; Halten 1,5–3 s nach jedem Akzent.** Text steht ruhig, solange er gelesen wird (≥ 1,5 s, ≥ Zeichen/12 s).
- **Hook ohne Pause, ohne Titelkarte:** 0:35–0:57 läuft ohne Halt von Mackay über den Krach in A1 und weiter in c02.
- **Messung vor jedem Bericht:** `python3 tools/calm.py <mp4> --scale 1280:720` (Ziel ≤ 0,9 harte Schnitte/min, mafd-Median ≤ ~0,45, Luma 40–60), `python3 tools/smooth.py <mp4> <start>` (**0 Ruckler**), `SECS=… node tools/seam.mjs --at <t>` an jeder Naht.

## 7 · Text im Bild, Grafiken, Fakten
- **Explainer-Anteil 60–70 %** (gemessen in `shots.md`, derzeit 62 %). Explainer sind echte Grafiken: Index-Absturz, 5 % beleuchtete Fasern, Lebensdauer Chip gegen Schiene, Kapazitätspreis, Index-Ring, Tarif-Zeiger, Karten. Sie sind aus den Dingen des Films gebaut (Papier, Tinte, Noten, Münzen, Tickets, Serverlicht) und ohne Ton lesbar. Keine Folien-Tafeln, kein Gitter, keine Legenden.
- **Schrift:** Zahlen und Zitate Instrument Serif (Creme, warmes Glühen), Labels und Quellen Inter 600 (`P.halo2`). Zahl ≥ 120 px, Label ≥ 34 px, Quelle ≥ 24 px. Höchstens eine Zahl und ≤ 6 Wörter plus Quelle pro Grafik.
- **„artificial intelligence“, nie „AI“** im Bild. Einzige Ausnahme: das wörtliche Altman-Zitat.
- **Untertitel-Zone frei:** kein Text unter y = 910 (unterste ~170 px).
- **Zitatkarten (wörtlich):** Altman (1.03): „Are we in a phase where investors as a whole are overexcited about AI?“ · „My opinion is yes.“ · `— Sam Altman, August 2025`. Bezos (4.08): „a kind of industrial bubble“ · `— Jeff Bezos, Italian Tech Week, October 2025`. Nadella (11.05): nur wörtlich, wenn vor dem finalen Render geprüft (Faktencheck Z. 61), sonst Label.
- **Mackay:** paraphrasiert. Seine Zeitung zeigen (`THE GLASGOW ARGUS · OCTOBER 1845`, Leitartikel-Spalte unterstrichen), **keine Zitatkarte, kein lesbarer Wortlaut**.
- **Beschriftungen nach Faktencheck (bindend):** `≈ 5 % LIT · USA, ESTIMATE 2001` (keine Weltkarte der Ozeankabel als Daten) · `PRICE OF MOVING DATA · 1998–2015` (−99 %) · `RAILWAYS BEGIN SWITCHING · DEC 1847` · `RECORD YEAR … PLANNED` · `EVERY NEW LINE · EVERY WEEKDAY · EACH WAY` · `MORE THAN ¼` (nicht 30 %) · `23 STATES` · `STOKAB … ABOUT 100 PROVIDERS` · `ORACLE ≈ −55 % FROM 52-WEEK HIGH` · `VACANCY 1 % · JLL, YEAR-END 2025` · `AEP OHIO · 85 % · UP TO 12 YEARS` · `$12.4 BN` / `$250 M` · `−64 %` (Railway-Index 1845–1849) · `METR · DOUBLES EVERY ~3.5 MONTHS`. „27 countries“ nicht zeigen (schwach belegt).

## 8 · Kit
- `lib/f10_editorial.mjs` (Bühne, unverändert aus Film 10/13): `card`, `cam3`, `camAt`, `camDrift`, `aim`, `project`, `F0` (Tiefen: Himmel 40000, Mitte 4000–6000, Fokus F0 = 1700) · `P` · `du()` · `person()` · `glowText` · `halo` · `dust` · `castShadow` · `nightSky` · `stars` · Explainer: `counter`, `bars`, `curve`, `pie`, `timeline`, `flow`, `compare`, `icon`, `lightShape` · `finish`.
- `lib/base_kit.mjs`: `PRINT13`, `trailSpan`, `maskLine` (Zeile steigt aus der Grundlinie), `measure`, `textGrains`, `sandGrains`.
- `lib/bubble_kit.mjs` (dieser Film): `COL` · `paperFill` · `paperPlate` · `banknote` · `bubble` · `dataCenter` · `worker` · `loco` · `certificate` · `coin` · `purse` · `teacup` · `newspaper` · `quill` · `inkLine` · `rail` · `train` · `phone` · `fundScreen` · `ticket` · `flip` · `mist`. Signaturen im Kopf der Datei; Ansicht `tools/kit_sheet.mjs`.
- `lib/bubble_seams.mjs` (Lead): die Platten an den Gruppen-Nähten (`BRIEF-builders.md` §2).
- **Speicher:** keine Canvas, kein Pattern pro Frame (Leck in `@napi-rs/canvas`). Renders mit `node --expose-gc`, Stücke ≤ 20 s.

## 9 · Endscreen (12.06, ≤ 15 s nach dem VO-Ende)
Die Schiene von A4 läuft in die Dämmerung, weit hinten ein kleiner erleuchteter Zug, der sich langsam bewegt. Obere zwei Drittel offener Himmel. Kein Text, kein Logo. **Freiflächen:** links x 90–780, y 250–700 („best for viewer“), rechts x 1140–1830, y 250–700 („latest upload“), Mitte x 810–1110, y 330–600 (Abo-Knopf). Nie statisch: langsamer Rückzug, der ferne Zug, Sterne kommen.
**Achtung:** `timing.json` hat derzeit 15,9 s nach dem letzten Wort (Ende 654,24, letztes Wort 638,34). Das Bild bleibt bis zum Ende lebendig; die Länge regelt der Ton-Thread.

## 10 · Gates (in dieser Reihenfolge)
1. Plan zuerst: Shot in `tools/shots_bubble.py` (Start-Phrase, Anker, Bild, 1–2 Bewegungen, Übergang mit Träger), `shots.md` neu schreiben (`python3 tools/shots_bubble.py --md docs/shots.md`). Änderungen am Plan meldest du dem Lead.
2. Bauen, dann anschauen: Standbilder alle ~0,5 s um jede Fahrt und eines pro Satz (`render.mjs --snap … --scale .5`, Kontaktbogen). Mindestens 3 Review-Runden.
3. Messen (§6), Werte in den Bericht.
4. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Text · Fakten. Nichts unter 4.
