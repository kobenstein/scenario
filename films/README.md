# Filme

Ein Ordner pro Film, Name `NN-titel` (NN = feste Filmnummer, Titel wie auf YouTube).

```
NN-titel/
  README.md       Link, Datum, Herkunft, was nicht im Repo liegt
  skript/         Off-Text (vo-vN.txt), Text, Gerüst, Faktenzettel, Faktencheck, clips.json (je neueste Fassung)
  code/           Animations-Code: film.mjs, engine.mjs, scenes/, lib/, audio/*.json (Timing), render.mjs
  verpackung/     youtube.md (Titel, Beschreibung, Tags), Thumbnail-Varianten A/B/C, Notizen
```

`filme.json` ist das Verzeichnis aller Filme (Nummer, Ordner, Video-ID, Quellen im Projektordner).
Ein neuer Film bekommt dort einen Eintrag, sein Code wird direkt unter `films/NN-titel/code/` committet.

Hinweis: Der Code der Filme liest Audio und Bilder teils aus dem Projektordner (`/mnt/project-files/scenario/film-…`).
Für ein neues Rendern müssen diese Dateien dort (oder aus Drive) wieder vorhanden sein.
