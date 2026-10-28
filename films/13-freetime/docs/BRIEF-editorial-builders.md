# Film 13 · Builder-Brief „Editorial-Nacht“ (28.10.2026)

Erst bauen, wenn Jakob den 20-s-Stil-Test freigegeben hat (`/mnt/project-files/scenario/film-zeit/render/stiltest-20s.mp4`).

## Pflicht vor dem ersten Code
1. Skills laden und befolgen: scenario-motion, world-class-motion-design, fluid-motion-design, motion-director-gates. Veraltet darin: „Hyperframes“/three.js (wir zeichnen mit der eigenen Engine in Canvas 2D).
2. Lesen: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (Stil, verbindlich), `docs/MOTION.md` (Welt, Objekte, Palette, Budgets, Kit), `docs/shots.md` (Shots, Wort-Anker, Träger), `docs/EDITORIAL-KIT.md` (2.5D-Bühne, API), `film-zeit/vo-v6.txt`, `film-zeit/faktencheck.md` (nur diese Zahlen).
3. Ansehen: den Stil-Test und seinen Kontaktbogen; `scenes/sc01.mjs` ist das Muster (eine Plansequenz, Kamera aus `camAt`-Keys auf Wörtern, Kausalität aus Positionen).

## Arbeitsregeln
- Eigene Szenen: `scenes/scNN.mjs` (eine Datei pro Chunk, `export default (T, R) => [entries]`). Nur über Wörter ankern.
- Gemeinsame Kits (`lib/f10_editorial.mjs`, `lib/f13_kit.mjs`) nicht ändern; fehlt etwas, in `lib/f13_cNN_*.mjs` bauen und als Kit-Wunsch melden.
- Rendern sparsam: Snapshots/Kontaktbogen in halber Auflösung, `node --expose-gc`, Stücke ≤ 20 s, Zwischenstände nie nach `/mnt/project-files` (nur kleine mp4/jpg).
- Gates je Chunk: Kontaktbogen angesehen und Hässliches behoben; `tools/calm.py`, `tools/smooth.py` (0 Ruckler), `tools/seam.mjs` an den Chunk-Grenzen; Handy-Lesbarkeit der Texte.
- Bericht kurz, deutsch: Chunks fertig, Messwerte, Kit-Wünsche, offene Stellen.
