# Film 14 · Builder-Brief (3 Builder parallel + Lead, ein Checkout) · Stand 2026-10-28

**Vollbau sofort** (Jakob 28.10.: keine Stil-Test-Freigabe nötig). Der ganze Film entsteht im Look des Hooks (`film-kontrolle/render/stiltest-20s.mp4`, 0–42,4 s), gleichzeitig von **B1, B2 und B3**. Der **Lead Bild** (der Thread, der den Stil-Test gebaut hat) baut den Hook und das Finale selbst und hält Kit, Shotliste, Nähte und die Endabnahme.

## 0 · Pflicht vor der ersten Zeile Code
1. **Vier Skills laden** (Skill-Tool) und befolgen:
   - `anthropic-skills:scenario-motion`
   - `anthropic-skills:world-class-motion-design`
   - `anthropic-skills:fluid-motion-design`
   - `anthropic-skills:motion-director-gates`

   Veraltet darin: „Hyperframes“/three.js. Wir zeichnen mit der eigenen Engine in Canvas 2D (2.5D-Karten vor `cam3`).
2. **Lesen**, in dieser Reihenfolge:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (verbindlich)
   2. `docs/MOTION.md`: Welten, **die vier Schlüssel-Anker**, Palette, Budgets, Kit
   3. `docs/shots.md`: deine Shots mit Wort-Ankern, Trägern und Übergängen (bindend); §3 = Karten
   4. `docs/EDITORIAL-KIT.md`: 2.5D-Bühne, API
   5. `/mnt/project-files/scenario/film-kontrolle/vo-v3.txt`: deine Absätze
   6. `/mnt/project-files/scenario/film-kontrolle/faktencheck.md`: nur diese Zahlen
3. **Ansehen:** den Stil-Test `film-kontrolle/render/stiltest-20s.mp4` und `stiltest-20s-kontakt.jpg`, dazu den Code `lib/f14_hook.mjs`. Er ist Muster und Qualitätsziel:
   - eine Plansequenz;
   - Kamera aus `camAt`-Keys auf Wörtern;
   - Reaktionen aus Positionen berechnet;
   - die Zitatkarte als Vorlage für alle Karten;
   - Flug durch eine Öffnung: erst auf die Achse, dann gerade hinein.
4. Arbeitsordner: `/home/user/scenario/films/14-keys`. Abhängigkeiten sind installiert; sonst `npm ci`.

## 1 · Aufteilung (Zeiten aus `timing.json`; im Code nur über Wörter ankern)
| Wer | Chunks | Zeit (s) | Dauer | Inhalt | Welten |
|---|---|---|---|---|---|
| **Lead** | c01, c02 bis 2.03 | 0–41,76 | 42 s | Hook (fertig, Stil-Test) | Rechenzentrum, Schlüsselloch, Zahlenfeld/Datei |
| **B1** | c02 ab 2.04, c03, c04 | 41,76–151,14 | 109 s | wer an die Datei kommt, Rechenkerne, Tresorraum, Zwei-Personen-Karte, Drossel/Sicherheitsbereich, **Startraum (Schlüssel-Anker 2)**, Push in den Bildschirm | Datei innen → Tresor → Diagramm → Startraum |
| **B2** | c05, c06 | 151,14–317,34 | 166 s | der Schläfer (Codeseite, 2023/2024, nicht wegtrainierbar), der Reim-Plan (grab it → rabbit / habit / green), das Mikroskop, Labor-Gebäude, Abo-Satz | Codeseite → Reim-Plan + Linse → Labor bei Nacht |
| **B3** | c07, c08 | 317,34–474,56 | 157 s | **der zweite Schlüssel in fremder Hand (Anker 3)**, Testtabellen OpenAI ⇄ Anthropic, sycophancy, zerbrechlich, die Glasbox (Apertus), Tresor gegen Glas, die Waage | Startraum (Match) → Tabellen → Berge/Glasbox |
| **Lead** | c09 + Endscreen | 474,56–597,24 | 123 s | **Schlüsselbund (Anker 4)**, Epoch-Balken (5 Firmen ≈ 71 %), die Frage, Endscreen | Morgen, Ring ↔ Balken |

Chunk-Grenzen innerhalb einer Gruppe: c02|c03 63,30 · c03|c04 102,04 · c05|c06 235,06 · c07|c08 401,74.

Schlüssel dürfen nur in Shots mit 🔑 in `shots.md` vorkommen: B1 nur 4.05–4.07, B3 nur 7.01–7.03, B2 nie.

**Zu c02 (B1):** B1 setzt den Hook fort. 0–41,76 s ist der Stil-Test und bleibt **unverändert**.
- B1 erweitert `scenes/sc02.mjs` erst ab `T.S('s03', 'So who')`.
- Die Zeichenfunktion des Hooks läuft danach ruhig weiter (Kamera auf dem letzten Key, Drift ~15 %). B1 ruft `hook(hookAnchors(T))(ctx, t)` als Grund auf und baut 2.04–2.06 darauf: Hände aus dem Zahlenfeld, Reim-Blick.
- Ab 3.01 zeichnet B1 die Datei mit `fileShape`/`numberField` selbst weiter, aus demselben Bildzustand.
- Prüfung:
  - `SECS=c01,c02 node render.mjs --snap 5,12,20,30,38,41.7 --dir … --scale .5` sieht aus wie der Kontaktbogen des Stil-Tests;
  - `node tools/seam.mjs --at 41.76` meldet nichts.

## 2 · Die Nähte zwischen den Gruppen (fest, vom Lead definiert)
Jede Gruppen-Naht liegt auf einem **gemeinsamen Bild**, einer *Platte*.
- **Wo:** Die Platten sind fertig: `lib/f14_seams.mjs` (`plateScreen`, `plateWindow`, `plateScale`, `seamWindow`, `SEAM_HALF`, `PLATE_FILE`, `PLATE_WINDOW`, `PLATE_SCALE`). Ansicht: `node tools/seam_plates14.mjs <dir>`. **Tresortür und Glasbox auf `plateScale` sind die Referenz** für B1s `vaultDoor` und B3s `glassBox`.
- **Gleiche Frames:** Beide Seiten zeichnen die Platte aus derselben Funktion mit demselben `t`, also sind die Frames links und rechts identisch.
- **Abgebende Seite:** steuert ihre letzte Bewegung so, dass das Bild in der Platte ankommt, und zeichnet die Platte für `t ∈ [T0 − 0,5, T0)` deckend.
- **Übernehmende Seite:** zeichnet sie für `t ∈ [T0, T0 + 0,5)` und lässt ihre Welt aus ihr wachsen, nie per Blende.

| Naht | T0 (Anker) | Platte | Abgabe | Übernahme |
|---|---|---|---|---|
| **Lead → B1** | `T.S('s03', 'So who')` (≈ 41,76) | keine Platte: B1 zeichnet auf dem Hook weiter (§1) | 2.03: Original (warm) und Kopie (kühl) stehen nebeneinander im Zahlenfeld | 2.04: kühle Hände tauchen aus dem Feld auf und greifen nach der Datei |
| **B1 → B2** | `T.seg('s08').start` (≈ 151,14) | `plateScreen`: **die Datei auf dem Pult-Bildschirm, bildfüllend.** Dunkler Bildschirmrahmen am Bildrand, die warme Datei (`fileShape`) mittig (x 960, y 560, Höhe ~760), ruhige Zahlen darin | 4.08: Die Schlüssel sinken ins Dunkel, Push in den Bildschirm, bis Rahmen und Datei in der Platte stehen | 5.01: **die Datei öffnet sich zum Testblatt** (drei Zeilen, Häkchen auf Polite / Helpful / Flawless) |
| **B2 → B3** | `T.seg('s14').start` (≈ 317,34) | `plateWindow`: **das runde Labor-Fenster**, Kreis r ≈ 300 um (960, 500), warmes Inneres, die Fassade dunkel, du klein unten Mitte | 6.13: ruhiger Halt vor dem Fenster, sanfter Push, bis das Fenster in der Platte steht | 7.01: **im Fenster erscheint der Startraum von 4.05** (Match), Push hinein. B3 nutzt dafür B1s `launchRoom` (siehe §4) |
| **B3 → Lead** | `T.seg('s19').start` (≈ 474,56) | `plateScale`: **die Waage**, Balken waagerecht auf y 420, links die Tresortür (klein, Lichtfugen), rechts die Glasbox, Mitte frei | 8.10: Die Waage kommt nicht zur Ruhe, Tresor und Glasbox rücken an die Schalen | 9.01: **Tresor und Glasbox werden zu Schlüsseln an einem Ring** (Anker 4) |

Nähte innerhalb deiner Gruppe (Chunk zu Chunk) baust du selbst nach demselben Prinzip:
- gleiche Kamera und gleicher Trägerzustand im letzten Frame von cN und im ersten von cN+1;
- am einfachsten eine gemeinsame Zeichenfunktion in deinem eigenen `lib/f14_bN_*.mjs`.

## 3 · Harte Regeln für die Bilder (Jakob, 28.10.)
1. **Kein Computerspiel-Look, kein durchgehendes Motiv.** Der Schlüssel erscheint **nur** an den vier Ankern (`MOTION.md` §2). Jede Station dazwischen hat ihre eigene Welt mit **echten Erklärgrafiken**:

   | Station | Grafik | Wer |
   |---|---|---|
   | Station 1 | **das Zahlenfeld der Gewichte und die Drossel (Egress)** | B1 |
   | Station 2 | **Codezeilen mit dem Jahr 2023/2024** | B2 |
   | Station 3 | **der Reim-Plan als Diagramm** (grab it → rabbit / habit / green) | B2 |
   | Station 4 | **die Testtabellen der zwei Labs nebeneinander** | B3 |
   | Station 5 | **die offene Glasbox mit öffentlicher Dateiliste** | B3 |
   | Finale | **der Epoch-Balken (5 Firmen ≈ 71 %)** | Lead |

2. **Etwa 2/3 Explainer, 1/3 Szene.** Jeder Übergang trägt ein Objekt sichtbar ins nächste Bild. Keine Blenden, keine Fades.
3. **Ruhe:**
   - höchstens ~1 harter Weltwechsel pro Minute;
   - **eine** Hauptbewegung zur Zeit;
   - langsame Kamera, nie Stillstand (kein statisches Stück über 2 s);
   - ein Motiv pro Satz;
   - jedes Bild ist ohne Ton lesbar.
4. **Karten** (Zitat, ON SCREEN) sind gestaltet wie die Amodei-Karte im Stil-Test (`shots.md` §3), nie getippte Folien.
5. **Grafiken bestehen aus Dingen des Films:** Datei, Zahlenfeld, Lichtlinie, Fenster, Ring, du in Gelb. Licht auf Nachtblau, schön genug als Standbild.
   - Verboten: generische Diagramm-Tafeln, Achsenkreuze mit Gitter, Legenden, Folien-Look.
   - Pro Grafik eine Aussage, höchstens eine Zahl und ≤ 6 Wörter plus Quelle.
   - Teile starten versetzt (≥ 0,3 s) und stehen ruhig, solange sie gelesen werden.

## 4 · Was du anfassen darfst und was nicht
- **Nur deine Dateien:**

  | Wer | Szenen | Eigene Module |
  |---|---|---|
  | B1 | `scenes/sc02.mjs` (nur ab 2.04), `sc03.mjs`, `sc04.mjs` | `lib/f14_b1_*.mjs` |
  | B2 | `scenes/sc05.mjs`, `sc06.mjs` | `lib/f14_b2_*.mjs` |
  | B3 | `scenes/sc07.mjs`, `sc08.mjs` | `lib/f14_b3_*.mjs` |
  | Lead | `sc01.mjs`, `sc09.mjs` | `lib/f14_hook.mjs`, `lib/f14_kit.mjs`, `lib/f14_seams.mjs` |

- **Geteilte Welten** (Export-Pflicht, die anderen lesen nur):
  - **B1** exportiert `launchRoom(ctx, t, o)` (Startraum mit Pult, zwei Schlüsselplätze, Hände) und `vaultDoor(ctx, t, o)` aus `lib/f14_b1_rooms.mjs`. Das erste Standbild beider Funktionen geht **bis Ende Tag 1** an den Lead: B3 braucht den Startraum für 7.01, der Lead die Tresortür für 9.01.
  - **B3** exportiert `glassBox(ctx, t, o)` aus `lib/f14_b3_glass.mjs` (der Lead braucht sie für 9.01).
  - Wer eine geteilte Funktion ändert, sagt es im Bericht.
- **Nicht ändern:**
  - `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f14_kit.mjs`, `lib/f14_hook.mjs`, `lib/f14_seams.mjs`, `lib/kit.mjs`;
  - `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`;
  - die Dateien der anderen.
- **Fehlt etwas im Kit oder stört ein Fehler:** in deinem Modul lösen und im Bericht als Kit-Wunsch melden. Kit-Änderungen macht nur der Lead.
- **Eine Szenendatei:** `export default (T, R) => [entries]`, mit `entry = { t, draw(ctx, t), print: K.PRINT13 }`.
  - Ein Chunk ist normalerweise **ein** Eintrag (Plansequenz).
  - Ein zweiter Eintrag ist ein harter Schnitt und nur erlaubt, wenn `shots.md` dort eine Match-Fahrt mit reimendem Träger nennt.
- **Kein Commit, kein Push.** Alle arbeiten im selben Checkout; der Lead committet gezielt. Kein `git checkout`, `git stash` und kein `git reset`.

## 5 · Kit-Stand (nach dem Stil-Test, Details `MOTION.md` §7)
- **`lib/f14_kit.mjs`:**
  - `lightKey`, `keyholePath`, `dataCentre`, `darkHand`, `blueprint`, `fileShape`, `numberField`;
  - `numberField` mit `gather` (0 = Feld, 1 = in der Datei), `file` (aus `fileShape`), `onlyFile`, `cool` (Kopie).
- **`lib/f13_kit.mjs`:** `card`, `cam3`, `camAt`, `aim`, `cardM`, `camDrift`, `trailSpan`, `maskLine`, `measure`, `PRINT13`.
- **`lib/f10_editorial.mjs`:** `P`, `E.ground`, `E.du` (du in Gelb), `E.rad/lin`, `E.nightSky`, `finish`.
- **Gelernt im Stil-Test:**
  - Ausschneiden mit `PathOp` (`a.op(b, PathOp.Difference)`), nicht mit `evenodd`.
  - Lange Linien wachsen mit `sineIO`.
  - Dichte Felder grob halten (92×58 px) und mit der Entfernung ausblenden.
  - Bei Flügen erst auf die Achse schwenken, dann gerade hinein.
- **Speicher:** keine Canvas, kein Pattern pro Frame; gecachte Dinge einmal beim Laden bauen.

## 6 · Rendern (4 Kerne, Speicher im Projektordner ist fast voll)
`SP` = dein eigenes Scratchpad (aus deinem Systemprompt), Arbeitsordner `$SP/f14/bN/`.
- **Nichts Großes nach `/mnt/project-files`:** dorthin nur der Kontaktbogen.
- Auf dem Netz-Mount immer absolute Pfade, nie ganz `/mnt/project-files` durchsuchen, nach dem Schreiben ~10 s warten und dann prüfen.

**Review-Stills** (halbe Größe):

```
cd /home/user/scenario/films/14-keys
SECS=c05 node render.mjs --snap 152,154,156.5 --dir $SP/f14/b2/snap --scale .5
```

Danach einen Kontaktbogen bauen und **ansehen**.

**Video** (volle Qualität):
- Stücke ≤ 20 s, immer mit `--expose-gc`.
- Pro Builder läuft nie mehr als ein Render gleichzeitig.

```
SECS=c05 node --expose-gc render.mjs --out $SP/f14/b2/c05_a.mp4 --from 151.14 --to 171
SECS=c05 node --expose-gc render.mjs --out $SP/f14/b2/c05_b.mp4 --from 171 --to 191
```

Danach mit `ffmpeg -f concat -c copy` zu `$SP/f14/bN/cNN.mp4` zusammensetzen. Zum Anhören mit dem Mix muxen (`film-kontrolle/audio/mix.wav`, `-ss` = Chunk-Start).

**Abgabe je Chunk:**
- Video: `$SP/f14/bN/cNN.mp4`; der Pfad steht im Bericht.
- Kontaktbogen (1 Bild/s, klein): `/mnt/project-files/scenario/film-kontrolle/render/build/cNN_kontakt.jpg`.

## 7 · Pflicht-Prüfungen je Chunk (Werte in den Bericht)
1. **Kontaktbogen angesehen** (1 Bild pro 0,5–1 s plus jeder Übergang) und alles Hässliche oder Unklare behoben. Mindestens 3 Review-Runden. Dabei prüfen:
   - Jedes Bild ist ein Plakat.
   - Satz = Bild.
   - Der Held ist das Hellste.
   - Außerhalb der 🔑-Shots ist kein Schlüssel zu sehen.
   - Text ist lesbar (Handy-Kopie, 390 px breit).
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`:
   - 0 Schnitte (außer geplanten Match-Fahrten);
   - **mafd-Median ≤ ~0,45**;
   - Luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <startsekunde>`: keine LURCH/POP. Ein POP genau auf einem Kornwechsel (alle 3 Bilder) mit sauberem Differenzbild darf bleiben; dann Begründung im Bericht.
4. `ffmpeg -i <cNN.mp4> -vf "scale=1280:720,freezedetect=n=-60dB:d=0.5" -f null -` ergibt 0 Treffer (kein Stillstand).
5. `SECS=cNN,cMM node tools/seam.mjs --at <Grenze>` an jeder Chunk-Grenze und jeder Render-Naht: keine Flags. An den Gruppen-Nähten prüft der Lead mit beiden Seiten.
6. **Ruhe-Regeln** (`MOTION.md` §5):
   - eine Hauptbewegung;
   - kein Stillstand über 2 s;
   - 1,5–3 s Halten nach Akzenten;
   - nichts aus dem Nichts;
   - keine Blenden, kein Fade, kein Slide.
7. **Selbstnote 1–5:** Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Grafik aus Film-Elementen · Text. Nichts unter 4.

## 8 · Ablauf und Bericht
- **Reihenfolge:**
  1. pro Chunk zuerst das ★-Standbild an den Lead (er reicht es an Jakob);
  2. dann der Chunk;
  3. dann die Prüfungen.

  B1 liefert zusätzlich bis Ende Tag 1 die Standbilder von `launchRoom` und `vaultDoor` (§4).
- **Bericht** (kurz, deutsch):
  - Chunks fertig, mit Pfaden zu Videos und Kontaktbögen;
  - Messwerte je Chunk: calm, smooth, freeze, seam;
  - Kit-Wünsche;
  - offene Stellen und Abweichungen von `shots.md`, mit Grund;
  - welche Dateien du angelegt oder geändert hast (damit der Lead gezielt committen kann).
