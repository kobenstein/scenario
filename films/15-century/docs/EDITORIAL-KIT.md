# Editorial-Kit („Editorial-Nacht“) · für die Builder (übernommen aus Film 10/13, gilt für Film 15)

Stand 2026-10-28 (Film 15). Das Kit stammt aus Film 10 (dort von Jakob freigegeben: K1–K3 „nice“) und lief in Film 13. Für Film 15 gilt zusätzlich: `lib/f15_kit.mjs` liefert die Film-15-Bausteine (Papierband, Schachtel mit zehn Fächern, Phiole, Kapsel, Zelle, Spritze, Ring, Erbgut-Zeilen, Zahlenblock; siehe `MOTION.md` §7) und `lib/f15_seams.mjs` die Platten an den Nähten. Die Sanduhr aus `f13_kit` gehört zu Film 13 und kommt hier nicht vor. Pfade unten, die auf `stills/`, `tools/editorial_*.mjs` oder Film-10/13-Module zeigen, sind Vorlagen.
- **Code:** `films/15-century/lib/f10_editorial.mjs` (+ `lib/f15_kit.mjs`, `lib/f15_seams.mjs`). Builder importieren für das Bild **nur** diese Module. Die alten Module `f10_valley`, `f10_hall` und `f10_figs` bleiben liegen, werden aber nicht gezeichnet.
- **Vorlagen:**
  - die Stills: `stills/editorial/K1.jpg`, `K2.jpg`, `K3.jpg`, `vergleich.jpg`
  - die 20-s-Stilreferenz: `stills/editorial/bewegungstest.mp4`
  - der Code dazu: `tools/editorial_proto.mjs`
  - ein kleines Beispiel mit 2.5D-Shot und Explainer: `tools/editorial_demo.mjs`
- **Verbindlicher Stil:** `stil/STIL-editorial-nacht.md`

## 1. Die Regeln

1. **Eine Idee pro Bild und ein Motiv pro Satz.** Das Motiv darf vom alten 3D-Plan abweichen: Wähle pro Satz das Bild, das am besten zum Skript passt. Die alte Welt wird nicht nachgezeichnet. Aus `shots.md` gelten weiter:
   - das Timing (Wort → Bild),
   - die Träger-Logik (`A → B · Position · Richtung`),
   - die Clip-Slots,
   - die Inhaltsregeln.
2. **EINE große Lichtform** ist der Held jedes Bildes: Lichthand, Scheibe, Fenster, Tor, Lichtspur oder Karte aus Licht. Sie ist das Hellste im Bild. Zwei gleich starke Lichter sind verboten.
3. **Eine kleine Figur.** „du“ steht vor der Lichtform, ist 12–25 % der Bildhöhe groß und hat nie ein Gesicht.
4. **Viel Nachtraum.** Mindestens 40 % des Bildes sind ruhige dunkle Fläche. Wenig Detail: keine Möbel, keine Texturen, keine Menschenmengen. Eine Menge wird zu Lichtpunkten.
5. **Gelb trägt nur „du“** (`P.coat`). Andere Menschen sind schlichte Silhouetten in Indigo oder Blau, ohne Gelb und ohne Gesicht (`person()` gibt es bewusst nicht: zeichne sie mit `robot()`-ähnlichen Flächen in `P.ind2` oder als `du()` mit Überschreibung, siehe §6).
6. **Roboter** sind schlichte Silhouetten ohne Gesicht und ohne Logo (`robot()`), mit Randlicht von der Lichtform. Nicht erlaubt:
   - Musk, Tesla oder Optimus;
   - Roboter, die Menschen pflegen.
7. **Licht erzählt:** Warm/Gold heißt Mensch, gelernt oder gut. Kühles Blau-Creme heißt Maschine, noch nicht oder kalt. Gegensätze zeigst du als Licht-Hälften.
8. **Ruhe:**
   - Höchstens 1–2 Elemente bewegen sich gleichzeitig. Dazu kommt die Kamera.
   - Es gibt keine Blenden und keine Wipes.
   - Nichts steht still: Nutze `camDrift`, die Lichtform atmet, die Figur atmet.
   - Akzente liegen auf dem Wort (±2 Frames).
9. **Speicher:**
   - Pro Frame entsteht kein neues Canvas, kein Pattern und kein `drawImage(Canvas)`.
   - Das Korn wird einmal berechnet (`prepareEditorial()`).
   - Gerendert wird mit `node --expose-gc` in Stücken von ≤ 20 s.

## 2. Die Bühne: 2.5D-Ebenen vor einer Perspektivkamera

Flache Formen stehen als **Karten in echter Tiefe**. Das Modell ist dasselbe wie bei der Engine-Kamera `view3`: Position x/y/z, Brennweite f, Blick entlang +z.

Jede Karte zeichnest du in **Design-Koordinaten**, also als 1920×1080-Layout, so wie es die Heimkamera `cam3()` sieht. Dann bekommt sie eine Tiefe Z.

- Steht die Kamera daheim, sieht jede Karte genau wie entworfen aus.
- Bewegt sich die Kamera, entsteht echte Parallaxe.
- Ein Dolly (z wächst) vergrößert nahe Karten schneller als ferne.
- Passiert die Kamera eine Karte, fliegt sie hindurch: Die Karte wird übersprungen.

```js
import * as E from '../lib/f10_editorial.mjs';
const c = E.camDrift(E.camAt(t, KEYS, SUN.Z), t);         // Kamera aus Keyframes + Dauer-Drift
E.card(ctx, c, 40000, () => { E.nightSky(ctx); E.stars(ctx, 9, 160, t); });
E.card(ctx, c, 9000,  () => E.lightForm(ctx, 'disc', 920, 210, 520, 520, t));
E.card(ctx, c, 4000,  () => E.ground(ctx, [[-200, 760], [700, 700], [2100, 690]]));
E.card(ctx, c, E.F0,  () => { E.ground(ctx, …); E.du(ctx, 760, 862, 190, { look: 1 }); });
E.lightFlood(ctx, a);   // nur beim Flug IN die Lichtform
E.finish(ctx, t);       // Vignette + Korn (oder über film.mjs, siehe §5)
```

**Tiefen (Konvention)**
| Ebene | Z | Beispiele |
|---|---|---|
| Himmel | 40000 | Nacht-Verlauf, Sterne, große weiche Bögen |
| Horizont / Lichtform fern | 9000 | Sonne, ferne Kämme, Lichtkarte des Tals |
| Mitte | 4000 | Hügel, Hallenwand, zweite Silhouetten |
| **Fokus** | **1700 = `F0`** | du, Roboter, Lichthand, Boden, auf dem sie stehen |
| Vordergrund | 1100 | dunkle Kante, Ast, Geländer: unscharf mit `ctx.filter = 'blur(8px)'` |
| Linse | 700 | Staub, Lichtflecken (selten) |

Verwende 3–5 Karten pro Bild, nicht mehr.

**Kamera-API**
- `cam3({x, y, z, f, roll})` gibt eine Kamera zurück; daheim ist es `cam3()`.
- `camAt(t, [[t0, cam], [t1, cam, ease], …], refZ)` liefert die Keyframes.
  - Die Easings sind `'s'` (Sinus, Standard), `'q'` (Quart in-out), `'i'` (expo in, für den Flug in ein Licht) und `'o'` (expo out, für den Flug heraus).
  - z wird logarithmisch zur Referenzkarte interpoliert. Ein Flug fühlt sich dadurch wie konstante Fahrt an.
- `aim(Z, u, v, s, sx, sy)` gibt die Kamera zurück, die den Design-Punkt (u,v) der Karte Z am Bildpunkt (sx,sy) mit s-facher Vergrößerung zeigt. Damit baust du Flüge IN Lichtformen und präzise Rahmungen.
- `project(c, Z, u, v)` liefert den Bildpunkt eines Design-Punkts, etwa für Labels im Screen-Space.
- `camDrift(c, t, amt)` ist die Dauer-Drift. Sie gehört auf jede Kamera.

**Typische Fahrten**
1. **Atmender Halt:** z +80…+300 über 4–8 s mit Sinus. Die Lichtform atmet.
2. **Rückzug zum Maßstab-Kontrast:** Start mit `aim(F0, figurX, figurY, 3)`, Ende `cam3()`. Die kleine Figur wird klein vor der großen Lichtform.
3. **Flug IN die Lichtform (der Übergang):**
   - Keyframe `aim(Z_licht, u, v, 60)` mit Easing `'i'`.
   - Dazu `lightFlood(ctx, smooth(span(k, 4, 40)))` mit k = Vergrößerung der Lichtkarte.
   - Die nächste Szene startet mit `aim(Z_neu, u2, v2, 60)` und fährt mit `'o'` heraus, auch hier mit `lightFlood`.
   - An der Schnittstelle sind beide Frames volles Licht, also identisch: ein Schnitt ohne Blende.
   - Das ist der Standard-Übergang zwischen zwei Welt-Motiven.
4. **Seitwärts-Truck:** x ±200 über 3–5 s. Die Parallaxe trennt die Ebenen und zeigt das nächste Motiv, das schon auf derselben Karte liegt.
5. **Match über eine Form:** Kreis wird Kreis (Sonne → Becherrand → Anteil-Ring), Linie wird Kurve (Lichtspur → Kurve). Die Form bleibt an derselben Bildposition, nur die Karte darum wechselt.

## 3. Bausteine (API)

**Palette `P`.** Die Werte stehen exakt so im Stil-Dokument:
- Nacht: `night0`, `night1`, `night2`
- Indigo: `ind0`, `ind1`, `ind2`
- Blau: `blue0`, `blue1`, `blue2`
- Lichtkern: `core0`, `core1`
- Halo: `halo0`, `halo1`, `halo2`
- Goldschatten: `shade0`, `shade1`
- `coat` (nur „du“) und `cream` (Schrift)

Helfer: `rgba(hex, a)`, `mixHex(a, b, x)`, `lin()` und `rad()` (Verläufe).

**Mathe.** `clamp`, `lerp`, `span(t, a, b)`, `smooth`, `sineIO`, `quartIO`, `expoIn`, `expoOut`, `drift(t, amp, seed)`, `prng(seed)`.

**Welt**
- `nightSky(ctx, stops?)` füllt den Grund mit einem Verlauf.
- `stars(ctx, seed, n, t, box?, a?)` zeichnet Sterne, die gecacht sind und funkeln.
- `ground(ctx, [[x,y]…], {stops, rim, rimW})` zeichnet eine Fläche mit beleuchteter Oberkante: Hügel, Boden, Kante.
- `castShadow(ctx, x, y, w, len, ang, a)` wirft einen langen Schatten weg vom Licht.
- `lightPool(ctx, x0, x1, y, spread, depth, a)` legt einen Lichtteppich auf den Boden, etwa vor einem Fenster.

**Licht**
- `lightForm(ctx, kind, x, y, w, h, t, {a, breath, dust, mullions, seed})` zeichnet die Lichtform:
  - Arten: `'disc'`, `'window'`, `'gate'`, `'ring'`.
  - Aufbau: blaue Aura, warmer Rand, Körper mit Verlauf und Stipple-Staub. Die Funktion gibt den Pfad zurück.
- `lightHand(ctx, handMatrix(wristX, wristY, angle, palmLen, flip), t, {a})` zeichnet die riesige Hand aus Licht; die Zeigefingerspitze ist `HAND_TIP` (lokal) und wird mit `applyM` umgerechnet. Beispiel: K1.
- `trail(ctx, pts, u, {w, a, spark})` zeichnet die Lichtspur. `pts` ist `[[x, y, breite], …]`, glätten kannst du sie mit `catmull(pts, n)`. Der Rückgabewert ist der Kopf.
- `halo(ctx, x, y, r, a, col, core)` zeichnet einen weichen, additiven Glow für kleine Lichter.
- `glowFill(ctx, path, blur, a, col)` legt einen weichgezeichneten Glow entlang einer Form.
- `dust(ctx, seed, n, cx, cy, rx, ry, t, a, col)` streut goldenen Stipple-Staub. Er ist gecacht und bleibt beim Hineinfliegen ein Punkt.
- `rays(ctx, cx, cy, r0, r1, n, a, rot)` zeichnet sehr leise Strahlen.
- `lightFlood(ctx, a)` macht den ganzen Frame zu Licht, beim Flug hinein.

**Figuren.** Beide sind aus Gelenken gebaut und haben kein Gesicht. Die Rückgabe sind die Handpositionen `{R, L}` im Raum des Aufrufers, für Spuren und Becher.
- `du(ctx, x, y, h, o)` zeichnet die Zuschauerin:
  - `dir` ±1 gibt die Blickrichtung an.
  - `walk` ist die Phase in rad und erzeugt den Gang.
  - `armR` und `armL` sind `[Schulter, Ellbogen]`, als Winkel ab senkrecht unten; + heißt nach vorn.
  - `look` (0..1) hebt den Kopf.
  - `light` (±1) gibt die Lichtseite an.
  - `back` (0..1) steht für Gegenlicht.
  - Dazu kommen `headset` und `cup: 'R'`.
  - Heben: `armR: [1.35, 2.55]`. Arm vor: `[1.75, 1.95]`. Gehen: `walk: t * 5.5`.
- `robot(ctx, x, y, h, o)` zeichnet den Roboter:
  - `dir`, `light`, `armR` und `armL` wie oben;
  - `rim` ist die Farbe des Randlichts, `body` und `joint` die Flächenfarben, dazu `cup` und `alpha`.

**Schrift.** `glowText(ctx, s, x, y, {size, serif, align, col, a, spacing, glow})` setzt Creme mit warmem Glühen. Größen stehen in `TYPE`: hero 168, num 120, mid 80, label 34, small 28, src 22. Es gibt nur Jahr, Ort, Namen, Zahlen und Quellen, nie Sätze.

**Finish.** `finish(ctx, t, {grain = 30, floor = 7, vig = .5})` legt Vignette und vorberechnetes Korn darüber. Das Korn wirkt am stärksten in den Mitteltönen, was den Stipple-Look ergibt, und wechselt mit 12 Bildern pro Sekunde. `prepareEditorial()` rufst du einmal zu Beginn auf.

**Explainer als Licht.** Jeder nimmt `u` (0..1, wie weit gewachsen) und wird vom Wort getrieben. Warm heißt Mensch, gelernt oder gut; kühl heißt Maschine oder noch nicht.
- `counter(ctx, t, {x, y, from, to, u, size, label, pre, post, fmt})` zeigt eine Zahl in Creme (Serif).
- `bars(ctx, t, {x, y, w, h, values, max, lit[], labels[], u})` lässt Balken aus Licht vom Boden wachsen.
- `curve(ctx, t, {rect, data, xr, yr, u, dashFrom, xTicks, yTicks})` zeichnet eine Kurve als Lichtspur; die Prognose ist gepunktet. Typisch ist der Match von der Lichtspur der Welt zu dieser Kurve.
- `pie(ctx, t, {x, y, r, parts: [{v, lit, label}], u})` zeigt Anteile als Lichtring. Typisch ist der Match Sonne/Becherrand → Ring.
- `section(ctx, t, {x, y, w, layers: [{h, label, lit}], u})` zeigt einen Querschnitt als Schichten, etwa Hand, Akku oder Boden.
- `lightMap(ctx, t, {pts: [[x, y, lit]], route: [[x, y]], u, size, w})` zeigt eine Karte aus Lichtpunkten mit Lichtspur, wie das Tal in K2.

Die Explainer stehen auf derselben Bühne wie die Welt. Sie liegen als Karte auf Z = `F0` und wachsen aus einem Objekt der Welt heraus: Die Spur wird Kurve, der Becherrand wird Ring, die Punkte des Tals werden Zähler.

## 4. Einen Shot aus shots.md übersetzen

`shots.md` beschreibt die Shots noch als 3D-Welt (Tal, Halle, Wohnzimmer, Weinberg). So übersetzt du sie:

1. **Lies den Satz, nicht die alte Kulisse.** Frag dich: Welche EINE Idee trägt der Satz? Wähle dazu die Lichtform, also das Bild, das man als Poster aufhängen würde.
2. **Reduziere radikal.** Aus der alten Kulisse wird ein Ort-Zeichen:
   - Die Halle wird ein großes Fenster in dunkler Wand.
   - Das Tal wird eine Karte aus Licht.
   - Das Wohnzimmer wird ein Fenster mit Lampenkreis.
   - Der Weinberg wird Reihen als Lichtlinien am Hang.
   - Eine Fabrik wird eine Wand mit einem Tor.
   - Eine Menge wird zu Lichtpunkten.
3. **Lege die Figur fest.** Der Sprecher sagt „you“: dann erlebt **du** es (staunen, heben, fragen, gehen). Bei anderen Menschen nimmst du eine Silhouette in Indigo; Gelb bleibt „du“ vorbehalten.
4. **Behalte den Träger.** Der Träger aus `shots.md` (`A → B · Position · Richtung`) wird übersetzt, meist in eine dieser Formen:
   - Lichtform → Flug hinein;
   - Lichtspur → Linie, Kurve oder Spur;
   - Kreis → Kreis;
   - Punkt → Punkte.
5. **Plane die Kamera.** Pro Motiv gibt es genau eine Fahrt aus §2 (Halt, Rückzug, Flug, Truck oder Match).
6. **Prüfe den Frame:**
   - Ist er ein Poster?
   - Ist die Lichtform das Hellste?
   - Sind ≥ 40 % des Bildes Nacht?
   - Ist die Figur sofort zu finden?
   - Gibt es höchstens zwei bewegte Elemente?

**Beispiele (aus dem Prototyp)**
| shots.md (alt, 3D) | Satz | Editorial-Motiv |
|---|---|---|
| 1.01 Hook, Rennen im Tal | „Superintelligence is getting a body.“ | K1: eine Hand aus Licht berührt die erhobene Hand eines kleinen Roboters, du stehst daneben auf einer Kante. Rechts die Lichtform, links Platz für den Titel. |
| Milliarde, Tal von oben | „A billion robots … learning from ours.“ | K2: das Tal bei Nacht als Karte aus Tausenden Lichtpunkten (kühl). Eine warme Spur geht von deiner Hand aus und macht die Punkte warm. |
| Die Halle öffnet sich | „a trainer in a headset lifts a cup. A robot copies the move.“ | K3: ein riesiges Hallenfenster in dunkler Fläche. Du bist die Trainerin mit Headset und hebst den Becher. Die Bewegung fliegt als Lichtbogen zum Roboter, der sie kopiert. Bei „Again“ bleiben Echo-Bögen. |
| Übergänge | – | K1 → K2: Flug in den Funken an der Fingerspitze, heraus aus dem Licht an deiner Hand. K2 → K3: Flug in das Hallenfenster am Ende der Spur, heraus aus dem großen Fenster. |

## 5. Einbau in film.mjs

- Der Eintrag eines Chunks bekommt `print: { editorial: true }`. Optional sind `grain`, `floor` und `vig`.
  - `film.mjs` ruft dann `finish()` aus dem Kit auf, statt das Indigo-LUT mit dem Print-Finish anzuwenden.
  - Ruf `finish()` in `draw()` deshalb **nicht** selbst auf.
- `draw(ctx, t)` zeichnet die Karten über `card()` und verwendet zum Schluss bei Bedarf `lightFlood()`.
- Schnitte sind harte `cut`s zwischen identischen Frames. Am einfachsten ist das beim Flug durch das Licht, denn beide Seiten zeigen dann volles Licht.
- Für die Prüfung stehen bereit:
  - Snapshots mit `SECS=c0x node render.mjs --snap …`;
  - `tools/calm.py` gegen Grow Forever;
  - Frame-Differenzen gegen Stillstand.
- Rendern: `node --expose-gc render.mjs --from A --to B` in Stücken von ≤ 20 s.
- Die Geschwindigkeit liegt bei etwa 250 ms pro Frame in 1080p. Die Korn-Pixelpässe kosten etwa 40 ms davon.

## 6. Bekannte Grenzen (bitte ersetzen oder ausbauen)

- **Lichthand:**
  - Sie ist ein Union-Pfad mit gespreizten Fingern und hat nur eine Pose.
  - Für „Hände halten“ oder „Hand öffnet sich“ braucht sie Posen-Parameter, etwa Fingerkrümmung und Daumen.
  - Als Silhouette wirkt sie noch etwas wie ein Handschuh. Besser wären weichere Knöchel und eine Handfläche mit Verlauf.
- **„du“:**
  - Der Mantel ist eine einfache A-Linie, und es gibt nur eine Kopfansicht (Rücken / ¾).
  - Es fehlen eine Seitenansicht im Gehen und Sitzen/Hocken (Thumbnail b).
  - Andere Menschen: Hier fehlt eine `person()` in Indigo ohne Mantel.
- **Roboter:** Er wirkt wie eine Holz-Gliederpuppe. Er braucht eine eigene, wiedererkennbare Silhouette (Helmkopf, breitere Brust) und Varianten für Arm, Greifer und Hand.
- **Prototyp-Kamera:** `tools/editorial_proto.mjs` nutzt noch die einfache `plane()`-Parallaxe (2D-Zoom pro Ebene). Neue Shots bauen auf `card()` und `cam3()` auf (echte Perspektive, siehe `tools/editorial_demo.mjs`).
- **Explainer:** Sie sind funktional, aber noch nicht im Film geprüft. Die Schriftgrößen müssen auf dem Handy geprüft werden (Labels ≥ 28 px).
