# The Good Takeoff · Film-System

Ein YouTube-Kanal, der jeden Tag einen animierten Dokumentarfilm (8–12 Minuten, Englisch) über Superintelligenz
und ihre Folgen für unsere Gesellschaft veröffentlicht. Recherche, Skript, Animation, Ton und Upload laufen mit Claude,
Jakob gibt Thema, Gerüst und Skript frei.

Dieses Repo ist das ganze System an einem Ort: **jeder Film**, **die Regeln**, **die Werkzeuge**.

```
films/      ein Ordner pro Film:  NN-titel/  skript/ · code/ · verpackung/
regeln/     wie ein Film geschrieben wird (REGELN.md zuerst) + die drei Claude-Skills
stil/       Bildstil „Editorial-Nacht“ + die Stil-Tests, aus denen er entstanden ist
tools/      Prüf-, Render-, Upload- und Analyse-Werkzeuge
```

## Der Ablauf eines Films

| # | Schritt | Ergebnis | Regel / Werkzeug |
|---|---|---|---|
| 1 | Thema + Treffer-Check | Thema mit Nachfrage (≥100k Aufrufe in der Nische, ~30 Tage) | `regeln/treffer-check.md` |
| 2 | Verpackung zuerst | Titel, Thumbnail-Idee, 2–3 Leitgedanken → **Jakob wählt** | `regeln/REGELN.md` §2, §9 |
| 3 | Gerüst | Fragen-Kette mit Hook und Auflösung → **Jakob gibt frei** | `regeln/hook-bauplan.md` |
| 4 | Recherche | Faktenzettel + 3–6 Interview-Clips (`clips.json`) | `regeln/clip-schritt.md` |
| 5 | Skript | Off-Text `vo-vN.txt`, Kritik, Hörfassung → **Jakob gibt frei** | Skill `scenario-script`, `tools/regel_check.py` |
| 6 | Faktencheck | Ampelseite mit Zweitprüfer | `skript/faktencheck*.md` |
| 7 | Animation | Szenen in Code (Hyperframes + three.js), Ton, Untertitel | Skill `scenario-motion`, `stil/`, `tools/clip_check.py` |
| 8 | Thumbnails | drei Varianten A/B/C für Test & Compare | Skill `good-takeoff-thumbnails` |
| 9 | Upload | geplant 17:00 Wien, Beschreibung mit Kaffee-, Kurs- und Sponsor-Zeile (Passionfroot), Endcards | `tools/check_descriptions.py` |

Ab Freigabe des Skripts läuft alles in einem Zug durch bis zum geplanten Upload.

## Die Filme

| Film | Titel auf YouTube | Online seit |
|---|---|---|
| [#1](films/01-the-arrival-of-superintelligence/) | The Arrival of Superintelligence | 2026-10-19 |
| [#2](films/02-a-share-of-ai-for-everyone/) | The Plan to Give Everyone a Share of AI | 2026-10-20 |
| [#3](films/03-ai-progress-is-going-vertical/) | AI Progress Is Going Vertical | 2026-10-21 |
| [#4](films/04-a-million-geniuses/) | 1,000,000 Geniuses are joining the workforce very soon | 2026-10-22 |
| [#5](films/05-you-dont-have-to-work-anymore/) | You Don't Have to Work Anymore | 2026-10-23 |
| [#6](films/06-ai-that-feels-nothing/) | We're Falling for AI That Feels Nothing | 2026-10-24 |
| [#7](films/07-the-limits-of-physics/) | AI Is About to Hit the Limits of Physics | 2026-10-25 |
| [#8](films/08-how-to-survive-the-singularity/) | How to Survive the Singularity | 2026-10-26 |
| [#9](films/09-one-person-with-ai/) | One Person With AI Now Does the Work of a Company | 2026-10-27 |
| [#10](films/10-superintelligence-is-getting-a-body/) | Superintelligence Is Getting a Body | 2026-10-29 |
| [#11](films/11-ai-is-making-us-dumber/) | AI Is Making Us Dumber. It Doesn't Have to. | 2026-10-28 |
| [#13](films/13-the-ai-bubble-could-pop/) | The AI Bubble Could Pop. Superintelligence Won't Stop. | 2026-10-31 |
| [#14](films/14-a-few-people-control-superintelligence/) | A Few People Control Superintelligence | 2026-11-01 |
| [#15](films/15-ai-isnt-giving-us-free-time/) | AI Isn't Giving Us Free Time | 2026-11-02 |
| [#16](films/16-ai-is-speeding-up-science/) | AI Is Speeding Up Science | 2026-11-03 |
| [#17](films/17-the-rules-written-for-an-ais-mind/) | The Rules Written for an AI's Mind | 2026-11-04 |
| [#18](films/18-ai-will-end-capitalism/) | AI Will End Capitalism | 2026-11-06 |
| [#19](films/19-how-to-survive-the-ai-crash/) | How to Survive the AI Crash | 2026-11-07 |
| [#20](films/20-the-first-generation-that-wont-grow-old/) | The First Generation That Won't Grow Old | 2026-11-08 |
| [#21](films/21-the-rise-of-biocomputers/) | The Rise of Biocomputers | 2026-11-09 |
| [#22](films/22-the-singularity-was-predicted-for-this-friday/) | The Singularity Was Predicted for This Friday | 2026-11-10 |
| [#23](films/23-a-day-in-2037-with-superintelligence/) | A Day in 2037 With Superintelligence | 2026-11-11 |
| [#24](films/24-ai-is-starting-to-understand-animals/) | AI Is Starting to Understand Animals | 2026-11-12 |
| [#25](films/25-ai-is-taking-jobs-in-this-order/) | AI Is Taking Jobs in This Order | 2026-11-13 |
| [#27](films/27-why-elon-says-saving-money-is-pointless/) | Why Elon Says Saving Money Is Pointless | 2026-11-15 |
| [#28](films/28-theyre-using-ai-to-save-the-world/) | They're Using AI to Save the World | 2026-11-14 |
| [#54](films/54-ai-just-gave-disease-a-10-year-deadline/) | AI Just Gave Disease a 10-Year Deadline | 2026-11-16 |

#12 gibt es nicht als Film, #26 und #29–#53 sind Ideen (Liste im Projektordner `themen/nummern-liste.md`).
Die Nummer bleibt die feste ID eines Films, auch wenn sich der Titel ändert.

Jeder Filmordner hat eine `README.md` mit Link, Herkunft und der Liste der großen Dateien, die nicht im Repo liegen.

## Was wo liegt

| Was | Wo |
|---|---|
| Skripte, Regeln, Code, Titel, Beschreibungen, Thumbnail-Vorschauen | **hier im Repo** |
| Film-Master, Audio, Musik, große Bilder | Google Drive, Ordner „#NN Titel“ (1 Film · 2 Thumbnails · 3 Rohmaterial · 4 Texte) |
| Arbeitsstand laufender Filme | Projektordner `/mnt/project-files/scenario/`, mit `tools/sync_projektordner.py` ins Repo holen |

## Werkzeuge

| Werkzeug | Wofür |
|---|---|
| `tools/sync_projektordner.py` | Regeln + Skripte + Verpackung aus dem Projektordner ins Repo holen (`--youtube`: Titel/Beschreibung live) |
| `tools/regel_check.py` | Off-Text gegen die Regeln prüfen (Floskeln, Minute 1, Ich-Sätze, Clips, Länge) |
| `tools/clip_check.py` | Anteil der Interview-Clips am Film (Ziel ≤ 8 %, hart 10 %) |
| `tools/check_descriptions.py` | Beschreibungskopf aller Langfilme prüfen, `--fix` repariert |
| `tools/render-fast.mjs` | Hyperframes-Komposition schnell rendern (auch parallel über GitHub Actions `render`) |
| `tools/yt_analytics.py` | YouTube-Analytics-Abfragen |
| `tools/konkurrenz.py` | Konkurrenz-Kanäle erfassen und vergleichen |
| `tools/dub/` | Synchronfassungen (Übersetzen, Sprechen, Mischen) |
| `tools/shorts/` | Shorts (9:16) aus den Langfilmen schneiden |

Zugangsdaten (YouTube, ElevenLabs, fal) stehen nur als Umgebungsvariablen in der Claude-Umgebung, nie im Repo.
