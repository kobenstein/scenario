---
name: "scenario-motion"
description: "Bild- und Bewegungsstil des YouTube-Kanals Scenario (Editorial-Grain-Animation in Hyperframes + three.js). Verwenden, sobald Szenen oder Folgen für Scenario animiert, geprüft oder gerendert werden."
---

# Scenario Motion

Regeln für jede animierte Szene des Kanals **Scenario** (cineastische Dokus über Superintelligenz und die gesellschaftliche Transformation, Englisch, 8–12 Min.).
Grundlage: die allgemeinen Prinzipien des Skills `world-class-motion-design` (Träger, Übergabe, Tempo-Kontrast, ein Wow-Moment, Review per Einzelbild). Dieser Skill legt fest, wie sie bei Scenario konkret aussehen. Bei Widerspruch gilt dieser Skill.

Referenzen: Kanal-Bibel (Claude Doc) https://claude.ai/code/artifact/86da6481-04aa-4837-9935-afebf5e5a281 · Stil-Board `/mnt/project-files/scenario/referenzen/pinterest-stil-board.png` · Referenz-Implementierung `style-tests/d2-grain/index.html` im Repo `kobenstein/scenario` (D2 = erster Test mit voller Bewegung; `d-grain` ist die Vorstufe).

## 1. Bildsprache (fix)

**Editorial Grain**, nach dem Vorbild von Brian Stauffer und Risograph-Illustration:
- **Flache Formen** (Silhouetten, Kreise, Ringe, Rechtecke), keine Konturlinien, keine Verläufe ohne Körnung.
- **Jede Fläche hat einen Grain-Verlauf**: zweifarbiger Verlauf, gedithert mit Objekt-Rauschen (Shader `grainMat` aus der Referenz). Licht fällt als Körnung ab, nicht als weicher Blur.
- **Eine Lichtquelle ist der Held** jedes Bildes (Mond/Auge, Fenster, Portal, Feuer, Bildschirm). Alles andere bleibt dunkel und reduziert.
- **Maßstab-Kontrast**: ein winziger Mensch vor etwas Riesigem. Das ist die Kernmetapher des Kanals.
- **2–3 Farben pro Bild** plus Neutraltöne. Pro Szene eine Grundpalette aus der Tabelle; neue Paletten nur, wenn das Skript einen neuen Ort oder eine neue Zeit verlangt.
- **Grain mit Zurückhaltung.** Körnung ist Textur, nie Effekt. Sie soll erst auf den zweiten Blick auffallen. Grenzen: Film-Grain-Overlay auf Zweiern mit Alpha ≤ 0.06; Flächen-Dither nur in Verläufen und Lichtabfällen, nie auf großen ruhigen Flächen und nie über Text oder der Figur; Grain-Zellen ≤ 2 px. Im Zweifel weniger. Prüfen auf einem Handy-Screenshot: Wirkt das Bild verrauscht oder komprimiert, ist es zu viel. Jakob fand das Grain im letzten arireef-Video deutlich zu stark; das ist die Obergrenze, die wir klar unterschreiten.

### Farbcode (bedeutungstragend, nie verletzen)
| Bedeutung | Farbe | Einsatz |
|---|---|---|
| Mensch, Wärme, Handeln | Amber `#ffb35c` (Schatten `#7a3b17`) | die Figur, ihr Licht, Lösungen |
| Maschine, KI, Daten | Cyan `#8fe6ff` / Weißcyan `#d8f7ff` (Tiefe `#0a6f8c`) | Auge, Bildschirme, Strahlen, Ringe |
| Nacht, Welt, Unklarheit | Indigo `#0b0f2a` → Violett `#3b2f6e`, Tinte `#070918` | Himmel, Städte, Hintergründe |
| Text | Creme `#f3efe2`, Sekundär `#a49fc4` | Stempel, Labels |

Kippt eine Szene in Richtung „gutes Ende“ (Lösungsteil), darf die Gesamtpalette wärmer und heller werden (Morgengrauen statt Nacht). Das ist ein bewusstes dramaturgisches Mittel und bleibt dem Lösungsteil vorbehalten.

## 2. Wiederkehrende Elemente (die Marke)

1. **Die Figur („Du“)**: klein, gesichtslos, immer Silhouette, immer in oder an einer Amber-Lichtquelle. Keine Piktogramm- oder Verkehrsschild-Figur: Sie hat eine echte Silhouette mit Haltung (Schultern, Haare/Frisur, Kleidung wie Kittel oder Mantel, gebeugt, sitzend, aufrecht) und ist als Gruppe mit Gelenken gebaut (Hüfte, Oberkörper, Kopf, Arm/Unterarm), damit sie atmen, greifen, sich zurücklehnen und aufschauen kann. Gliedmaßen haben Volumen, keine Strichbeine. Sie bekommt nie Gesicht, Mimik oder Dialog. Sie steht für die Zuschauerin, für den Zuschauer, für die Menschheit. Gesten bleiben minimal (aufschauen, Licht ausschalten, einen Schritt gehen).
2. **Die Maschine als Kreis**: Scheibe, Ringe und Iris. Superintelligenz wird nie als Roboter oder Gehirn gezeigt, sondern als Lichtscheibe, Auge, Ringmuster oder Strahl. Ringe pulsieren nach innen, wenn sie „denkt“.
3. **Der Szenario-Stempel**: die Jahreszahl rollt zu Beginn jedes Szenarios groß ein (Ziffern-Roll, Instrument Serif), landet auf dem gesprochenen Jahr und schrumpft dann als Stempel nach oben links, mit dem Ort darunter (Inter, Versalien, Sperrung 0.32em). Bei einem Zeit- oder Ortssprung rollt der Stempel weiter.
4. **Labels**: Linie plus zweizeiliges Label (Name / Ort), an ein 3D-Objekt im Screen-Space geheftet, Wipe-in von unten.

Typografie: nur Instrument Serif (Zahlen, Titel) und Inter (Labels). Text im Bild nur für Jahr, Ort, Namen, Zahlen und Quellen, nie ganze Sätze.

## 3. Die 12 Prinzipien der Animation (immer anwenden)

Jede Bewegung wird gegen die 12 Prinzipien geprüft, angepasst an flache Formen:
1. **Squash & Stretch**: nur sehr dezent bei Licht und Formen (eine Scheibe „atmet“ beim Aufgehen), nie bei der Figur.
2. **Anticipation**: vor jedem Akzent eine kleine Gegenbewegung oder Vorahnung (der Bildschirm flackert, bevor er ausgeht; ein Lichtspalt, bevor sich das Auge öffnet).
3. **Staging**: pro Moment genau ein Fokus; Licht, Kontrast und Kamera zeigen darauf.
4. **Straight Ahead / Pose to Pose**: Kamera und Hauptformen per Keyposes; Schwärme, Ringe und Partikel prozedural.
5. **Follow Through & Overlapping Action**: Teile einer Gruppe landen versetzt (Ebenen, Ringe, Fasern), Labels ziehen nach.
6. **Slow In & Slow Out**: keine linearen Bewegungen außer konstanter Rotation; schneller Start, langes Ausklingen.
7. **Arcs**: Formen und Kamerafahrten bewegen sich auf Bögen, nicht auf Geraden.
8. **Secondary Action**: in jedem Halt eine kleine Nebenbewegung (Riesenrad dreht sich, Iris-Fasern rotieren).
9. **Timing**: Dauer passt zu Größe und Gewicht. Große Formen sind langsam, kleine schnell.
10. **Exaggeration**: nur beim Wow-Moment, sonst ruhig und präzise.
11. **Solid Drawing**: klare Silhouetten, die auch als Standbild lesbar sind; Tiefe durch Ebenen und Licht.
12. **Appeal**: jedes Standbild ist ein Poster, das man aufhängen würde.

## 4. Kontrast (der Motor jeder Szene)

Jeder Beat nutzt mindestens zwei der drei Kontraste, und der Wow-Moment alle drei:
- **Tempo**: lange ruhige Fahrten gegen wenige harte Akzente.
- **Farbe**: Amber gegen Cyan, Hell gegen Dunkel. Das Helden-Licht ist immer das Hellste im Bild.
- **Komposition**: Groß gegen Klein (Figur gegen Maschine), Leere gegen Dichte, Ruhe gegen Bewegung.

## 5. Raum und Kamera

- **Flache Ebenen im echten 3D-Raum** (three.js PerspectiveCamera, FOV 35). Jedes Motiv besteht aus 3–6 Tiefenebenen (Himmel, Horizont, ferne Stadt, mittlere Ebene, Vordergrund). Parallaxe entsteht von selbst. Ebenen werfen weiche Papierschatten auf die Ebene dahinter, ausgerichtet an der Helden-Lichtquelle.
- Kamerabewegungen sind **langsame Gleitfahrten** mit weichen Eases (smoothstep oder Sine für Fahrten, Quart in-out nur für bewusste Übergänge). Keine Whip-Pans, keine Wackelkamera.
- Jede Bewegung hat einen Grund und gehört zu einer von vier Arten:
  1. **Abstieg/Annäherung** zum Helden-Licht (Einstieg in eine Geschichte),
  2. **Atmender Halt** (minimaler Push während der Erzähler spricht),
  3. **Rückzug** zum Maßstab-Kontrast (winzige Figur, riesige Sache), meist der Wow-Moment,
  4. **Match-Cut über eine Form** (Kreis wird Kreis: Mond → Pupille → Lampe), wenn die Szene wechselt.
- **Jeder Szenenwechsel hat ein Träger-Element**, ohne Ausnahme. Ein Element aus Szene A trägt den Blick in Szene B: eine Form wird zur nächsten (Mond → Pupille → Lampe), ein Licht wandert, eine Linie läuft weiter, die Kamera fliegt in ein Objekt und die nächste Szene liegt darin. Vor dem Bauen wird für jeden Übergang notiert: Träger, Position im Bild, Richtung. Ein harter Schnitt ist nur erlaubt, wenn ein Träger über den Schnitt hinweg reimt (gleiche Form, gleiche Position, gleiche Bewegungsrichtung).

## 6. Timing

- **Zuerst wird das Voice-over geschnitten, dann animiert.** Das VO wird vorab so geschnitten, dass es schon ohne Bild das perfekte Hör-Timing hat: Pausen nach wichtigen Sätzen (0.4–1.2 s), Luft vor Pointen, keine gehetzten Übergänge, Tempo-Wechsel zwischen Erzählung und Erklärung. Erst dieser geschnittene VO-Track ist die Taktvorgabe. Werkzeug: Wort-Timestamps von ElevenLabs (fal `elevenlabs/tts/eleven-v4`, `timestamps: true`), Schnitt per ffmpeg an den Wortgrenzen, danach eine aktualisierte Timing-Datei.
- **Die Stimme bestimmt das Bild.** Jeder Akzent liegt auf einem Wort, Toleranz ±2 Frames bei 30 fps. Die Stimme startet bei VO = 0.6 s (Bild zuerst).
- **Tempo-Kontrast**: lange, ruhige Gleitfahrten (2–4 s) gegen wenige harte Akzente (≤ 3 Frames, zum Beispiel ein Bildschirm, der ausgeht). Pro 30 s höchstens 2 harte Akzente.
- **Ein Wow-Moment pro Szene** (Szene = ein Szenario-Beat, etwa 30–90 s). Er bekommt den größten Maßstab-Sprung, das meiste Licht und den Musik-Höhepunkt.
- Nach jedem Akzent mindestens 0.8 s ruhiger Halt, damit er wirkt.
- **Nichts steht je still (harte Regel).** Weder die Kamera noch irgendein Objekt kommt jemals komplett zum Stillstand. Alles bewegt sich immer minimal, mal schneller, mal langsamer, aber die Geschwindigkeit ist nie null. Umsetzung: Die Kamera bekommt eine permanente, langsame Drift über alle Keyframes (Amplitude proportional zur Distanz, mehrere Sinus mit krummen Frequenzen). Ebenen driften seitlich um Bruchteile einer Einheit, Wolken und Sterne ziehen, Lichter atmen oder flackern minimal, Ringe und Iris drehen sich, die Figur atmet und bewegt den Kopf. Auch ein „Halt“ ist ein langsamer Push. Im Review per Frame-Differenz prüfen: Kein Abschnitt darf zwei identische aufeinanderfolgende Frames haben.

## 7. Ablauf pro Szene

0. **VO schneiden** (siehe Timing) und Timing-Datei erzeugen.
1. **Beat Sheet** aus dem geschnittenen VO: Wort → Zeit → was passiert im Bild. Wow-Moment markieren.
2. **Motiv-Skizze und Übergangskarte**: Helden-Licht, Ebenen, Farbpalette, Position der Figur und für jeden Szenenwechsel das Träger-Element festlegen.
3. **Bauen** als Hyperframes-Komposition (Version 0.8.168 fest): ein pausierter GSAP-Timeline-Proxy treibt `render(t)` deterministisch, kein `Math.random`/`Date.now`, ein Seed-PRNG.
4. **Review per Snapshot** (`npx hyperframes@0.8.168 snapshot --at … --no-end`): alle 0.5 s plus jeder Akzent. Prüfen:
   - Ist die Helden-Lichtquelle zu jeder Zeit klar?
   - Ist jedes Standbild ein gutes Poster?
   - Verdeckt nichts das Auge oder die Figur im Wow-Moment?
   - Ist die Körnung dezent genug (siehe Grenzen oben)? Grain-Zellen ≤ 2 px, sonst `uScale` erhöhen oder Dither senken.
   - Hat jeder Übergang ein sichtbares Träger-Element?
   - Bewegt sich in jedem Frame etwas (keine eingefrorenen Abschnitte)?
   - Sind die 12 Prinzipien eingehalten, vor allem Anticipation, Slow In/Out, Arcs und Follow Through?
   - Sitzen die Akzente auf den Wörtern?
5. **Render** mit 30 fps (`render -f 30`), danach für die Auslieferung mit CRF 20 neu kodieren.
6. **Musik**: Score pro Folge mit fal `fal-ai/elevenlabs/music` und `composition_plan` (Abschnitte an Szenen und VO ausgerichtet, `respect_sections_durations: true`, negative Styles „vocals“). Wow-Momente fallen framegenau auf einen Abschnittswechsel, kleine Versätze werden per ffmpeg korrigiert. Ein wiederkehrendes Kanal-Motiv erklingt am Anfang und im Wow-Moment. Lösungsteil musikalisch wärmer und heller.
7. **Ton** (eigener Schritt): Atmosphäre per Mirelo video-to-audio mit `text_prompt` und `negative_prompt` (Standard-negativ: „music, speech, cartoon whooshes, comedic“), Akzente per Mirelo text-to-audio framegenau gesetzt, Musik darunter, Mix auf −14 LUFS.

## 8. Verboten

- Roboter, Gehirne, Matrix-Code, blaue Platinen und andere Stock-KI-Klischees.
- Gesichter, Lippenbewegung, Figuren mit Mimik; Piktogramm-Figuren mit Strichgliedern.
- Glatte Verläufe ohne Grain, Drop-Shadows, glänzende 3D-Materialien.
- Crossfades als Standard-Übergang, Elemente, die aus dem Nichts aufploppen.
- Eingefrorene Frames: Kamera oder Objekte im kompletten Stillstand.
- Mehr als ein Wow-Moment pro Szene; zwei Lichthelden gleicher Stärke im selben Bild.
- Angst-Ästhetik als Selbstzweck: Bedrohliche Bilder brauchen im selben Szenario einen sichtbaren Gegenpol (Mission: aufklären und Wege zeigen).