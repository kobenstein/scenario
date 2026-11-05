# Film 13 · Builder-Brief (3 Builder parallel, ein Checkout) · Stand 2026-10-28

Jakob hat den 20-s-Stil-Test freigegeben („sieht eigentlich gut aus – kannst so den ganzen Film machen“). Der ganze Film entsteht jetzt in genau diesem Look, von **drei Buildern gleichzeitig: B1, B2 und B3**. Lead Bild ist der Thread, der den Stil-Test gebaut hat; er hält Kit, Shotliste und Nähte.

## 0 · Pflicht vor der ersten Zeile Code
1. **Vier Skills laden** (Skill-Tool) und befolgen: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Veraltet darin: „Hyperframes“/three.js. Wir zeichnen mit der eigenen Engine in Canvas 2D (2.5D-Karten vor `cam3`).
2. **Lesen**, in dieser Reihenfolge:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (verbindlich)
   2. `docs/MOTION.md` (Welt, Objekte, Palette, Budgets, Kit)
   3. `docs/shots.md` (deine Shots mit Wort-Ankern, Trägern und Übergängen; bindend)
   4. `docs/EDITORIAL-KIT.md` (2.5D-Bühne, API)
   5. `/mnt/project-files/scenario/film-zeit/vo-v6.txt` (deine Absätze)
   6. `/mnt/project-files/scenario/film-zeit/faktencheck.md` (nur diese Zahlen)
3. **Ansehen:** den Stil-Test `/mnt/project-files/scenario/film-zeit/render/stiltest-20s.mp4` und `stiltest-20s-kontakt.jpg`, dazu den Code `scenes/sc01.mjs`. Er ist das Muster und das Qualitätsziel:
   - eine Plansequenz;
   - Kamera aus `camAt`-Keys auf Wörtern;
   - Reaktionen aus Positionen berechnet;
   - Text steigt ruhig von der Grundlinie.

## 1 · Aufteilung (Zeiten aus `timing.json`, Stand vo-v6; im Code nur über Wörter ankern)
| Builder | Chunks | Zeit (s) | Dauer | Inhalt |
|---|---|---|---|---|
| **B1** | c01 ab 1.07, c02, c03, c04, c05, c06 | 21,8–236,70 | 215 s | Hook-Rest (Bullauge, Umschlag, Handy, Menge), Berkeley, „a lie? → No.“, Arbeitsjahr, Wasser, Waschmaschine/Cowan/E-Mail/Microsoft, Linder, „this machine is different“, Berkeley-Jongleur, Hassabis |
| **B2** | c07, c08, c09, c10 | 236,70–448,88 | 212 s | Battle Creek 1930 (Kellogg 8 → 6, Hunnicutt), **der Sommerabend (Herzstück)**, wie es verrutschte, kein Bösewicht, Mission, Firmen (Vier-Tage-Woche, Zeit-Dividende, Krankenhaus) |
| **B3** | c11, c12, c13, c14 + Endscreen | 448,88–625,48 | 177 s | Recht auf Abschalten, Keynes, wer entscheidet, du (Zeit kaufen, 2 von 100, die erste Stunde), wann die Regeln kamen, das Finale (Garten, Abendessen, Kind am Fluss, Wald) und der Endscreen (≤ 15 s) |

Chunk-Grenzen innerhalb einer Gruppe: c01|c02 33,44 · c02|c03 63,48 · c03|c04 95,68 · c04|c05 144,20 · c05|c06 178,00 · c07|c08 294,02 · c08|c09 351,48 · c09|c10 399,24 · c11|c12 495,96 · c12|c13 534,00 · c13|c14 582,52 · VO-Ende 609,58.

**Zu c01:** B1 setzt den Hook fort. Die Einstellung 0–21,8 s ist freigegeben und bleibt **unverändert**.
- B1 erweitert `scenes/sc01.mjs` nur ab 21,8 s: neue Zustände und Kamera-Keys nach `a.but + 1`, Shots 1.07–1.11. Bis 21,8 s ändert sich kein Pixel.
- Prüfung: `SECS=c01 node render.mjs --snap 5,12,18,21.7 --dir … --scale .5` sieht aus wie der Kontaktbogen des Stil-Tests, und `tools/seam.mjs --at 21.8` meldet nichts.

## 2 · Die Nähte zwischen den Gruppen (fest, vom Lead definiert)
Die zwei Gruppen-Nähte liegen auf einem **gemeinsamen Bild**, einer *Platte* aus `lib/f13_seams.mjs`. Beide Seiten zeichnen die Platte aus derselben Funktion mit demselben `t`, also sind die Frames links und rechts der Naht identisch. Ansicht: `node tools/seam_plates.mjs <dir>`.
- Die abgebende Seite steuert ihre letzte Bewegung so, dass das Bild in der Platte ankommt, und zeichnet die Platte für `t ∈ [T0 − 0,5, T0)` deckend über alles.
- Die übernehmende Seite zeichnet sie für `t ∈ [T0, T0 + 0,5)` und lässt ihre Welt aus ihr wachsen: Die Platte zieht sich zurück oder wird zu einem Ding der neuen Welt, nie per Blende.
- Hilfen: `seamWindow(t, T0)` und `SEAM_HALF`.

| Naht | T0 (Anker) | Platte | Abgabe (Ende der Gruppe davor) | Übernahme (Anfang der Gruppe danach) |
|---|---|---|---|---|
| **B1 → B2** | `T.seg('s10').start` (≈ 236,70) | `plateGlass`: **im Glas**. Goldner Dunst des Sandes, der Sandfaden fällt senkrecht durch die Bildmitte (x 960), links eine Glaskante. | 6.09: du vor der großen Sanduhr, dein Mantel spiegelt sich im Glas. Push ins untere Glas, bis der Faden in der Bildmitte senkrecht steht und der Dunst das Bild füllt. | 7.01: Die Kamera sinkt durch den Dunst, **der Sandfaden wird der Fluss** von Battle Creek, von oben gesehen. Die Winterstadt mit Fabrik wächst um den Fluss. `BATTLE CREEK · MICHIGAN`. |
| **B2 → B3** | `T.seg('s18').start` (≈ 448,88) | `plateSheet`: **das Blatt, nah**. Ein Blatt aus Licht unter einer Lampe füllt das Bild, linke Kante bei x ≈ 190, zwei geschriebene Goldzeilen (die zweite ist gerade fertig). | 10.07: Das Flurlicht fällt aufs Blatt, der Stift schreibt die zweite Zeile, die Kamera senkt sich aufs Blatt, bis es das Bild füllt. | 11.01: Die Kamera hebt sich, **das Blatt ist das Tischtuch** des Abendtischs unter der Lampe (Held). Silhouetten und du, ein Handy leuchtet und dreht sich um. |

Nähte innerhalb deiner Gruppe (Chunk zu Chunk) baust du selbst nach demselben Prinzip:
- gleiche Kamera und gleicher Trägerzustand im letzten Frame von cN und im ersten von cN+1;
- am einfachsten eine gemeinsame Zeichenfunktion in deinem eigenen `lib/f13_bN_*.mjs`;
- Übergang und Träger stehen in `shots.md`.

## 3 · Harte Regel: Grafiken aus den Elementen des Films (Jakob, 28.10. 15:25)
> „aus den Elementen auch schöne Grafiken bauen, die das visualisieren, was gesagt wird“

- **Jede Explainer-Grafik wird aus den Dingen des Films gebaut:**
  - der Sanduhr;
  - ihrem Goldsand;
  - dem Goldfaden;
  - der Lichthand (Maschine);
  - dem Ring (Maschine/KI);
  - dem Blatt aus Licht (Regel);
  - dir in Gelb.
- **Beispiele:**
  - Sand rieselt in Balken und häuft sich zu Kurven (Höhe = Wert).
  - Der Faden zeichnet Zeitleisten, Achsen und Ländergrenzen.
  - Stunden sind Sandkörner oder kleine Sanduhren (z. B. 2 von 100 = zwei goldene unter 98 dunklen).
  - Ein Arbeitstag ist ein Glas, das sich von 8 auf 6 Teilstriche leert.
  - Eine Waage trägt Münzen gegen eine Sanduhr.
  - Der Ring zählt Monate.
- **Jede Grafik zeigt genau, was der Satz sagt:** die Zahl, den Vergleich, das Vorher/Nachher. Sie ist ohne Ton lesbar. Pro Grafik eine Aussage, höchstens eine Zahl und ≤ 6 Wörter plus Quelle.
- **Verboten:** generische Diagramm-Tafeln, Rahmen, Achsenkreuze mit Gitter, Folien-Look, Legenden. Eine Grafik ist **Licht auf Nachtblau**, schön genug als Standbild, im Editorial-Nacht-Look.
- Jede Grafik wächst aus einem Ding der Welt und geht in eines zurück (Träger in `shots.md`). Sie startet versetzt (≥ 0,3 s zwischen Teilen) und steht ruhig, solange sie gelesen wird.

## 4 · Was du anfassen darfst und was nicht
- **Nur deine Dateien:**
  - B1: `scenes/sc01.mjs` (ab 21,8 s) und `scenes/sc02.mjs` … `sc06.mjs`;
  - B2: `scenes/sc07.mjs` … `sc10.mjs`;
  - B3: `scenes/sc11.mjs` … `sc14.mjs`;
  - dazu deine eigenen Module `lib/f13_b1_*.mjs`, `lib/f13_b2_*.mjs` oder `lib/f13_b3_*.mjs`.
- **Nicht ändern:**
  - `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f13_seams.mjs`, `lib/kit.mjs`;
  - `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`;
  - die Dateien der anderen Builder.
- **Fehlt etwas im Kit oder stört ein Fehler:** in deinem Modul lösen und im Bericht als Kit-Wunsch melden. Kit-Änderungen macht nur der Lead.
- **Eine Szenendatei:** `export default (T, R) => [entries]`, mit `entry = { t, draw(ctx, t), print: K.PRINT13 }`.
  - Ein Chunk ist normalerweise **ein** Eintrag (Plansequenz).
  - Ein zweiter Eintrag ist ein harter Schnitt und nur erlaubt, wenn `shots.md` dort eine Match-Fahrt mit reimendem Träger nennt.
- **Kein Commit, kein Push.** Alle drei arbeiten im selben Checkout; der Lead bzw. der Koordinator committet. Kein `git checkout`, `git stash` und kein `git reset` (das träfe die Arbeit der anderen).

## 5 · Kit-Stand (nach dem Stil-Test)
- `E.lightHand(ctx, m, t, { pose, spread, curl, lum, dust })`:
  - Die Hand ist jetzt eine **deckende warme Goldform**.
  - `lum` (0–1) regelt die Helligkeit: Sie sinkt Richtung Goldschatten und wird nie durchsichtig.
  - Normal `lum ≈ .76`, zurückgenommen ≈ .4. Sie bleibt immer dunkler als der Sand der Sanduhr.
  - `tone: 'blue'` gibt den alten Film-10-Look und ist in Film 13 nicht erlaubt.
- **Himmel:** tiefes Indigo wie die Film-11-Thumbnails.
  - `E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], …)`, Aufhellung nur mit `P.ind1`, kein `P.blue0`-Teppich.
  - Ziel-Luma (calm.py) 40–60 im Mittel, der Held hell.
- **Finish:** `K.PRINT13 = { grain: 14, floor: 4, vig: .5 }`. Das Korn wechselt mit 10 Hz (jedes 3. Bild).
- `lib/f13_kit.mjs`: `hourglass` (inkl. `hold`, `crack`, `leak`), `trailSpan`, `maskLine`, `measure`, `textGrains`, `sandGrains`, `ledge`/`ledgeY`.
- `lib/f13_seams.mjs`: `plateGlass`, `plateSheet`, `seamWindow`.
- **Speicher:** keine Canvas, kein Pattern pro Frame. Gecachte Dinge einmal beim Laden bauen.

## 6 · Rendern (4 Kerne, 15 GB für alle drei)
`SP` = dein eigenes Scratchpad (aus deinem Systemprompt). Arbeitsordner `$SP/f13/bN/`. Nichts Großes nach `/mnt/project-files`.

**Review-Stills** (halbe Größe):

```
cd /home/user/scenario/films/13-freetime
SECS=c07 node render.mjs --snap 237,238.5,240 --dir $SP/f13/b2/snap --scale .5
```

Danach einen Kontaktbogen bauen und **ansehen**.

**Video** (volle Qualität):
- Stücke ≤ 20 s, immer mit `--expose-gc`.
- Pro Builder läuft nie mehr als ein Render gleichzeitig.

```
SECS=c07 node --expose-gc render.mjs --out $SP/f13/b2/c07_a.mp4 --from 236.7 --to 256
SECS=c07 node --expose-gc render.mjs --out $SP/f13/b2/c07_b.mp4 --from 256 --to 276
```

Danach mit `ffmpeg -f concat -c copy` zu `$SP/f13/bN/cNN.mp4` zusammensetzen.

**Abgabe je Chunk:**
- Video: `$SP/f13/bN/cNN.mp4`; der Pfad steht im Bericht.
- Kontaktbogen (1 Bild/s, klein): `/mnt/project-files/scenario/film-zeit/render/build/cNN_kontakt.jpg`.

## 7 · Pflicht-Prüfungen je Chunk (Werte in den Bericht)
1. **Kontaktbogen angesehen** (1 Bild pro 0,5–1 s plus jeder Übergang) und alles Hässliche oder Unklare behoben. Mindestens 3 Review-Runden. Dabei prüfen:
   - Jedes Bild ist ein Plakat.
   - Satz = Bild.
   - Der Held ist das Hellste.
   - Du bist nie abgeschnitten, außer in einer bewussten Fahrt.
   - Text ist lesbar (Handy-Kopie 390 px breit).
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`:
   - 0 Schnitte (außer geplanten Match-Fahrten);
   - mafd-Median ≤ ~0,45 (Stil-Test: 0,44);
   - Luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <startsekunde>`: **0 Ruckler** (keine LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <Grenze>` an jeder Chunk-Grenze und jeder Render-Naht: keine Flags. B1 zusätzlich bei 21,8 s. An den Gruppen-Nähten prüft der Lead mit beiden Seiten.
5. **Ruhe-Regeln** (`MOTION.md` §5):
   - 1–2 bewegte Hauptelemente;
   - kein Stillstand über 2 s;
   - 1,5–3 s Halten nach Akzenten;
   - nichts aus dem Nichts;
   - keine Blenden, kein Fade, kein Slide.
6. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Grafik aus Film-Elementen · Text. Nichts unter 4.

## 8 · Bericht (kurz, deutsch)
- Chunks fertig, mit Pfaden zu Videos und Kontaktbögen.
- Messwerte je Chunk: calm, smooth, seam.
- Kit-Wünsche.
- Offene Stellen und Abweichungen von `shots.md`, mit Grund.
- Welche Dateien du angelegt oder geändert hast (damit der Lead gezielt committen kann).
