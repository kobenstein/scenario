# Film 13 „The AI Bubble Could Pop“ · Builder-Brief (3 Builder parallel, ein Checkout) · Stand 2026-10-28

Jakob hat die volle Produktion in einem Durchgang freigegeben, ohne Stil-Test. Der Lead Bild hat Plan, Kit, Nähte und **c01 (Hook, 0–56,9 s) als Qualitätsreferenz** gebaut. Den Rest bauen **B1, B2 und B3** gleichzeitig. Der Lead hält Kit, Shotliste und die Gruppen-Nähte.

## 0 · Pflicht vor der ersten Zeile Code
1. **Vier Skills laden** (Skill-Tool) und befolgen: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Veraltet darin: „Hyperframes“/three.js. Wir zeichnen mit der eigenen Engine in Canvas 2D (2.5D-Karten vor `cam3`).
2. **Lesen**, in dieser Reihenfolge:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (verbindlich)
   2. `docs/MOTION.md` (Leitgedanke, 4 Schienen-Anker, Flip, Palette, Weltwechsel, Budgets, **Fakten-Beschriftungen §7**)
   3. `docs/shots.md` (deine Shots mit Phrasen-Ankern, Trägern und Übergängen; bindend)
   4. `docs/EDITORIAL-KIT.md` (2.5D-Bühne, API)
   5. `/mnt/project-files/scenario/film-blase/vo-v3.txt` (deine Absätze) und `faktencheck.md` (nur diese Zahlen)
3. **Ansehen:** `scenes/sc01.mjs` (das Muster), den Kontaktbogen `/mnt/project-files/scenario/film-blase/bild/c01_kontakt.png` und das Kit-Blatt (`node tools/kit_sheet.mjs $SP/kit.jpg`). c01 zeigt:
   - drei Welten in **einem** Eintrag, getragen (Flip der Note → Papier-Match; Flug ins Papier → Tintenflut; Kamera endet auf der Seam-Plate);
   - Kamera aus `camAt`-Keys auf Phrasen, `aim(F0, x, y, s, sx, sy)` für Ausschnitte;
   - Reaktionen aus Positionen berechnet (der Note-Abflug aus `B.bubblePoses`, die Hand fängt das Papier an `E.du(...).R`);
   - Text steigt ruhig aus der Grundlinie (`K.maskLine`).

## 1 · Aufteilung (Zeiten aus `timing.json`; im Code nur über Phrasen ankern)
| Paket | Chunks | Zeit (s) | Dauer | Inhalt |
|---|---|---|---|---|
| **Lead** | c01 | 0–56,86 | 57 s | fertig (Referenz) |
| **B1** | c02, c03, c04, c05 | 56,86–257,90 | 201 s | Brontës, Charlottes Brief, −64 %, Mackay · **A2** · Glasfaser, 5 % · Global Crossing, Nachfrage, −99 %, dein Handy, Abo, Bezos · Chip gegen Schiene, fast voll, was bleibt, das Urteil |
| **B2** | c06, c07, c08 | 257,90–439,20 | 181 s | die Wand (METR, MONEY/POWER/DEBT), der See, S&P/CoreWeave/Oracle · Stromrechnung, Rente, Index-Ring, Pfarrhaus → Sofa · Auktion, 1844 Penny-Zug, Ohio, 23 Staaten |
| **B3** | c09, c10, c11, c12 + Endscreen | 439,20–654,24 | 215 s | offene Türen, Stockholm, Intel, Apertus/Indien/Europa · Genossenschaften, B4RN, **A3** · Waage, offene Fragen, Nadella, Perez · Blase platzt, **A4**, Endscreen |

Chunk-Grenzen (Start-Phrasen in `film.mjs CHUNKS`): c02 „In a Yorkshire parsonage“ · c03 „But one thing didn't vanish“ · c04 „Then the crash“ · c05 „Maybe“ · c06 „You'll hear that“ · c07 „Follow the money“ · c08 „After a crash“ · c09 „Public money can come“ · c10 „And sometimes, people build“ · c11 „Nobody gives up“ · c12 „The bubble may pop“. **12 Chunks** (statt ~11): so bleibt jeder Chunk unter ~75 s.

## 2 · Die Nähte zwischen den Paketen (fest, vom Lead; `lib/bubble_seams.mjs`)
Eine Gruppen-Naht liegt auf einer *Platte*: beide Seiten zeichnen sie aus derselben Funktion mit demselben `t`, also sind die Frames links und rechts identisch. Ansicht: `node tools/seam_plates.mjs $SP/plates.jpg`.
- Die abgebende Seite führt ihre letzte Bewegung so, dass das Bild in der Platte ankommt, und zeichnet die Platte für `t ∈ [T0 − 0,5, T0)` deckend.
- Die übernehmende Seite zeichnet sie für `t ∈ [T0, T0 + 0,5)` und lässt ihre Welt aus ihr wachsen (Platte zieht sich zurück oder wird ein Ding der neuen Welt; nie per Blende). Hilfen: `seamWindow(t, T0)`, `SEAM_HALF`.
- **Aufruf immer mit T0:** `S.plateSlit(ctx, t, T0)`, `S.plateBrick(ctx, t, T0)`, `S.plateDoor(ctx, t, T0)`. Jede Platte schiebt langsam ein (`plateZoom(t, T0) = exp(PLATE_PUSH · (t − (T0 − 0,5)))`, 5 %/s, Fokus = Spalt / Balken / Tür): genau 1 bei `T0 − 0,5`, wo die abgebende Kamera landet. Die übernehmende Seite übernimmt diesen Push mit derselben Geschwindigkeit (kein Stopp an der Naht). Ohne T0 ist die Platte statisch (seam.mjs meldet dann FROZEN).
- `plateSlit` trägt außerdem `S.slitLife(ctx, x, y, sc, t, k)` (atmendes Licht + Staub im Spalt, Bildschirmraum). B1 zeichnet es nach `T0 + 0,5` weiter (k von 1 abklingen lassen oder ins Fensterlicht überführen), sonst springt das Licht.

| Naht | T0 | Platte | Abgabe | Übernahme |
|---|---|---|---|---|
| **c01 → c02** (Lead → B1) | `R.a` von c02 (= `T.F('In a Yorkshire parsonage')`) | `plateSlit`: die Zugtür von A1, 8× nah, fast zu: dunkle Türflügel, links/rechts das warme Fensterband, ein senkrechter Lichtspalt bei x 1140 (`S.SLIT`). | fertig (c01 endet exakt darauf; Tür schließt auf „ride?“ und landet auf dem Spalt). | 2.01: Der Spalt weitet sich zum erleuchteten Fenster des Pfarrhauses; die Kamera fliegt weiter hinein, die Flügel werden der Fensterrahmen; draußen Moor und Wind. |
| **c05 → c06** (B1 → B2) | `T.F("You'll hear that")` | `plateBrick`: der kurze, kalte CHIP-Balken allein auf der Zeitachse, Mitte (`S.BRICK`), Label `CHIPS · 3–6 YEARS`. | 5.08: Das Urteil räumt ab: alles außer dem Chip-Balken verlässt das Bild (Lebensdauer-Balken rollt nach rechts hinaus, Icons sinken), Kamera zentriert den Balken. | 6.01: Der Balken fällt als Ziegel, landet (Akzent auf „wall“), die Wand beginnt. |
| **c08 → c09** (B2 → B3) | `T.F('Public money can come')` | `plateDoor`: eine geschlossene Kabelschacht-Tür, frontal, Mitte, Vorhängeschloss, Lampe darüber (`S.DOOR`). | 8.12: Zaun mit Schild `PUBLIC MONEY` vor einer Tür; Push durch den Zaun auf die Tür, bis sie die Platte ist. | 9.01: Der Stempel `PUBLIC MONEY` landet auf der Tür, das Schloss fällt, die Tür schwingt auf. |

Nähte **innerhalb** deines Pakets baust du selbst nach demselben Prinzip (gleiche Kamera und gleicher Trägerzustand im letzten Frame von cN und im ersten von cN+1; am einfachsten eine gemeinsame Zeichenfunktion in deinem Modul). Übergang und Träger stehen in `shots.md`.

## 3 · Harte Regeln (Jakob + Faktencheck)
- **Mischung Szene/Explainer:** pro Satz das, was ihn am besten erklärt; Explainer-Anteil 60–70 % (`shots.md` misst ihn). Explainer sind **echte Grafiken** (Index-Absturz, 5 % beleuchtete Fasern, Lebensdauer Chip/Schiene, Kapazitätspreis-Balken, Index-Ring, Tarif-Zeiger, Karten), gebaut aus den Dingen des Films (Papier, Tinte, Noten, Münzen, Tickets, Serverlicht), ohne Ton lesbar. Keine Folien, kein Gitter, keine Legenden.
- **Jeder Übergang hat einen Träger.** Keine Blende, kein Fade, kein Wischer, kein Slide. ≤ ~1 harter Weltwechsel pro Minute (`MOTION.md` §5).
- **Ruhig:** langsame Kamera, max. 1–2 bewegte Hauptelemente, Halten 1,5–3 s nach Akzenten, kein Stillstand > 2 s, nichts halbtransparent einblenden. Kein Spiel-/Achterbahn-Look, keine KI-Bilder.
- **Figuren leben:** atmen, natürliche Arme (`B.worker`, `E.person`, `E.du`). **Nur du trägt Gelb.**
- **Schiene nur an A2 (B1, 3.01), A3 (B3, 10.06–10.09), A4 (B3, 12.05–12.06).** Kein Bahnsteig vor A4. Die parliamentary trains (c08) zeigen Menschen und Tickets, keinen Zug.
- **Text:** im Bild „artificial intelligence“, nie „AI“ (nur das wörtliche Altman-Zitat in c01 darf). Kein Text unter y = 910 (Untertitel). Nur Werte aus `faktencheck.md`, Beschriftungen exakt wie `MOTION.md` §7 (u. a. `USA, ESTIMATE 2001`, `1998–2015`, `23 STATES`, `ABOUT 100 PROVIDERS`, `EVERY NEW LINE · EVERY WEEKDAY`, `MORE THAN ¼`, `BEGIN SWITCHING · DEC 1847`, `PLANNED`, `ORACLE ≈ −55 % FROM 52-WEEK HIGH`, `JLL, YEAR-END 2025`).
- **Mackay (B1, 2.08):** paraphrasiert. Seine Zeitung (`THE GLASGOW ARGUS · OCTOBER 1845`, aus c01) und sein Buch zeigen, **keine Zitatkarte, kein lesbarer Wortlaut.**
- **Nadella (B3, 11.05):** Zitatkarte nur wörtlich, wenn vor dem finalen Render geprüft; sonst Label.
- **Endscreen (B3, 12.06):** ≤ 15 s, bewegt, Freiflächen für die YouTube-Endkarten (`MOTION.md` §9). `timing.json` hat derzeit 15,9 s nach dem letzten Wort; das Bild bleibt bis zum Ende lebendig.

## 4 · Was du anfassen darfst und was nicht
- **Nur deine Dateien:** B1 `scenes/sc02.mjs` … `sc05.mjs`; B2 `scenes/sc06.mjs` … `sc08.mjs`; B3 `scenes/sc09.mjs` … `sc12.mjs`; dazu eigene Module `lib/b1_*.mjs`, `lib/b2_*.mjs`, `lib/b3_*.mjs`.
- **Nicht ändern:** `lib/f10_editorial.mjs`, `lib/base_kit.mjs`, `lib/bubble_kit.mjs`, `lib/bubble_seams.mjs`, `lib/kit.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `scenes/sc01.mjs`, die Dateien der anderen.
- **Fehlt etwas im Kit:** in deinem Modul lösen und im Bericht als Kit-Wunsch melden.
- **Szenendatei:** `export default (T, R) => [entries]`, `entry = { t, draw(ctx, t), print: K.PRINT13 }`. Ein Chunk ist normalerweise **ein** Eintrag (Plansequenz, wie c01). Ein zweiter Eintrag ist ein harter Schnitt und nur erlaubt zwischen identischen Frames (Papier-Match, Platte).
- **Anker:** `const at = T.seq(R.a); const a = { x: at('phrase'), … }` oder `T.F('phrase', after)`; Wortende `T.FE`. **Nie Sekunden.**
- **Kein Commit, kein Push.** Kein `git checkout`, `git stash`, `git reset` (das träfe die Arbeit der anderen). Der Lead bzw. der Koordinator committet.

## 5 · Kit (Kurzfassung, Details in den Dateiköpfen)
- `lib/bubble_kit.mjs` (`B.`): `COL` · `paperFill` · `paperPlate` · `banknote` · `bubble` / `bubblePoses` · `dataCenter` · `worker` · `loco` · `certificate` · `coin` · `purse` · `teacup` · `newspaper` (o.mast, o.date, o.open) · `quill` · `inkLine` · `rail` · `train` · `phone` + `fundScreen` · `ticket` · `flip` · `mist`.
- `lib/base_kit.mjs` (`K.`): `PRINT13`, `trailSpan`, `maskLine`, `measure`, `textGrains`, `sandGrains`.
- `lib/f10_editorial.mjs` (`E.`): Bühne (`card`, `cam3`, `camAt`, `camDrift`, `aim`, `project`, `F0`), `P`, `du`, `person`, `glowText`, `halo`, `dust`, `ground`, `castShadow`, `nightSky`, `stars`, `catmull`, Explainer (`counter`, `bars`, `curve`, `pie`, `timeline`, `flow`, `compare`, `icon`, `lightShape`).
- **Speicher:** keine Canvas, kein Pattern pro Frame (napi-Leck); Gecachtes einmal beim Laden bauen; `Path2D` pro Frame ist ok.

## 6 · Rendern (4 Kerne für alle)
`SP` = dein Scratchpad. Arbeitsordner `$SP/f13/bN/`. Nichts Großes nach `/mnt/project-files`.
```
cd /home/user/scenario/films/13-bubble
SECS=c02 node render.mjs --snap 57,58.5,60 --dir $SP/f13/b1/snap --scale .5          # Review-Stills
SECS=c02 node --expose-gc render.mjs --out $SP/f13/b1/c02_a.mp4 --from 56.86 --to 76   # Video in Stücken ≤ 20 s
```
Stücke mit `ffmpeg -f concat -c copy` zu `$SP/f13/bN/cNN.mp4` zusammensetzen. Pro Builder nie mehr als ein Render gleichzeitig.
**Abgabe je Chunk:** Video `$SP/f13/bN/cNN.mp4` (Pfad im Bericht) und Kontaktbogen (1 Bild/s, klein) `/mnt/project-files/scenario/film-blase/bild/cNN_kontakt.png` (Ordner existiert; nach dem Schreiben ~10 s warten und neu lesen, das Netz-Laufwerk).

## 7 · Pflicht-Prüfungen je Chunk (Werte in den Bericht)
1. **Kontaktbogen angesehen** (1 Bild pro 0,5–1 s plus jeder Übergang), Hässliches und Unklares behoben, mindestens 3 Runden: jedes Bild ein Plakat · Satz = Bild · der Held ist das Hellste · Text lesbar (Handy-Kopie 390 px) · nichts unter y 910.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: **≤ 0,9 harte Schnitte/min** (Ziel 0), mafd-Median ≤ ~0,45, Luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <startsekunde>`: **0 Ruckler** (keine LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <Grenze>` an jeder Chunk-Grenze und jeder Render-Naht: keine Flags. Die Gruppen-Nähte prüft der Lead mit beiden Seiten.
5. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Grafik aus Film-Elementen · Text · Fakten. Nichts unter 4.

## 8 · Bericht (kurz, deutsch)
Chunks fertig mit Pfaden (Videos, Kontaktbögen) · Messwerte je Chunk (calm, smooth, seam) · Kit-Wünsche · Abweichungen von `shots.md` mit Grund · angelegte/geänderte Dateien.
