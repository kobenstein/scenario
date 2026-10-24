# Film 10 · Builder-Brief „Editorial-Nacht“ (24.10.2026, ersetzt den Look-Teil von BRIEF-builders.md)

## Pflicht vor dem ersten Code
1. Skills laden (Skill-Tool) und befolgen: anthropic-skills:scenario-motion, anthropic-skills:world-class-motion-design, anthropic-skills:fluid-motion-design, anthropic-skills:motion-director-gates. Veraltet darin: „Hyperframes“ (eigene Engine).
2. Lesen: /mnt/project-files/scenario/stil/STIL-editorial-nacht.md (Stil, verbindlich), bild/EDITORIAL-KIT.md (Kit-API, 2.5D-Bühne, Shot-Übersetzung), bild/shots.md (Träger-Übergänge, Anker, Explainer-Momente), bild/MOTION.md §13 (Explainer-Ebene), bild/BRIEF-builders.md (Mess-Gates, Ruhe-Regeln, Clip-Slots), vo-v3.txt, faktencheck.md („Für Bild und Schnitt“ = korrekte Zahlen).
3. Ansehen: stills/editorial/vergleich.jpg, K1–K3.jpg und bewegungstest.mp4 (Kontaktbogen davon ziehen). Das ist das Qualitätsziel: Zeichenqualität der Film-11-Thumbnails.

## Stilregeln (Kurz)
- Flache Editorial-Illustration, Korn statt Detail, EINE große Lichtform pro Bild als Held, die kleine gesichtslose Figur „du“ im gelben Regenmantel als Zuschauer-Stellvertreterin. Niemand sonst trägt Gelb; andere Menschen indigo Silhouetten.
- Motive frei pro Satz: das Bild, das den Satz am besten zeigt (nicht die alte 3D-Talwelt nachzeichnen). Die Träger-Logik (welches Objekt führt ins nächste) aus shots.md bleibt.
- Mix: Welt-Szenen ↔ Explainer aus Licht (~35–45 %), verbunden durch ein Träger-Objekt. Keine Blenden, keine Wischer, nichts poppt auf.
- 2.5D: Ebenen in echter Tiefe vor cam3/card (siehe EDITORIAL-KIT §2), Kamerafahrten erzeugen Parallaxe; Übergänge als Fahrt in eine Lichtform bzw. Objekt-Verwandlung.
- Ruhe: max 1–2 bewegte Hauptelemente, Halte-Momente 1,5–3 s pro Satz, langsame Kamera mit ease; harte Schnitte im ganzen Film ≤3 (nur in Absprache mit dem Lead); mafd-Median ≤0,5 je Abschnitt (calm.py).
- Clips (echtes Footage) bleiben in ihren Slots mit „ORIGINAL FOOTAGE“-Kennung im neuen Look.
- Inhalt: kein Musk/Tesla/Optimus; Roboter pflegen keine Menschen (sie übernehmen Dinge, damit Menschen Zeit füreinander haben); Fairness = Miteigentum, nie Wegnehmen; „artificial intelligence“ statt „AI“.

## Arbeitsregeln
- Gemeinsames Kit lib/f10_editorial.mjs NICHT ändern (es wird parallel vom Kit-Lead verbessert, API bleibt stabil). Fehlt etwas: in eigenem Modul lib/f10_cNN_*.mjs bauen und im Bericht als Kit-Wunsch melden.
- Eigene Szenen: scenes/scNN.mjs für deine Chunks, Einträge in film.mjs mit print:{editorial:true}. Nur deine Dateien anfassen (gleicher Checkout wie die anderen Builder). Nicht committen, nicht pushen – der Lead committet.
- Daten-ROOT: /tmp/claude-0/-home-user-scenario/8f7dada6-ac99-5c7e-b4ef-eebec3e810be/scratchpad/film10/ (audio/timing.json, vo_master.wav, clips).
- Rendern sparsam: Prüfung per Snapshots/Kontaktbogen in halber Auflösung, node --expose-gc, ≤20-s-Stücke, nie zwei Renders gleichzeitig von dir (4 Kerne, 15 GB für alle Builder).
- Gates je Chunk vor Abgabe: Kontaktbogen 1 Bild/2 s angesehen; jeder Explainer in 3 Phasen (Objekt → Verwandlung → Grafik) geprüft; Handy-Lesbarkeit (390 px breit); calm.py-Werte; keine Ruckler (tools/smooth.py); Übergabe-Frame an den Chunk-Grenzen mit Nachbar-Chunk abgestimmt (Kamera/Träger laut shots.md).
- Ausgabe: render/cNN/preview.mp4 (720p) je Chunk im Daten-ROOT, plus Kontaktbogen nach /mnt/project-files/scenario/film-roboter/stills/build/cNN_kontakt.jpg.
- Bericht kurz, deutsch: Chunks fertig, Messwerte, Kit-Wünsche, offene Stellen, Tokens.
