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
| 7 | Animation | Szenen in Code (Hyperframes + three.js), ein Bild pro Satz, 60–70 % Erklärgrafik, Ton, Untertitel | `regeln/REGELN.md` §13, Skill `scenario-motion`, `stil/`, `tools/clip_check.py` |
| 8 | Thumbnails | drei Varianten A/B/C für Test & Compare | Skill `good-takeoff-thumbnails` |
| 9 | Upload | geplant 17:00 Wien, Beschreibung mit Kaffee-, Kurs- und Sponsor-Zeile (Passionfroot), Endcards | `tools/check_descriptions.py` |

Ab Freigabe des Skripts läuft alles in einem Zug durch bis zum geplanten Upload.

## Die Filme

| Film | Titel auf YouTube | Video | Datum | Stand |
|---|---|---|---|---|
| [#1](films/01-the-arrival-of-superintelligence/) | The Arrival of Superintelligence | [f7gCA_dk_g0](https://youtu.be/f7gCA_dk_g0) | 2026-10-19 | online |
| [#2](films/02-a-share-of-ai-for-everyone/) | The Plan to Give Everyone a Share of AI | [q6CGAq-mTNE](https://youtu.be/q6CGAq-mTNE) | 2026-10-20 | online |
| [#3](films/03-ai-progress-is-going-vertical/) | AI Progress Is Going Vertical | [x_lfHqJwyBw](https://youtu.be/x_lfHqJwyBw) | 2026-10-21 | online |
| [#4](films/04-a-million-geniuses/) | 1,000,000 Geniuses are joining the workforce very soon | [DFMHW2tnPoA](https://youtu.be/DFMHW2tnPoA) | 2026-10-22 | online |
| [#5](films/05-you-dont-have-to-work-anymore/) | You Don't Have to Work Anymore | [5mc-SfxErnU](https://youtu.be/5mc-SfxErnU) | 2026-10-23 | online |
| [#6](films/06-ai-that-feels-nothing/) | We're Falling for AI That Feels Nothing | [RKkNmDgTd7s](https://youtu.be/RKkNmDgTd7s) | 2026-10-24 | online |
| [#7](films/07-the-limits-of-physics/) | AI Is About to Hit the Limits of Physics | [xfK7wvBdXsw](https://youtu.be/xfK7wvBdXsw) | 2026-10-25 | online |
| [#8](films/08-how-to-survive-the-singularity/) | How to Survive the Singularity | [yLhJuJEDuB0](https://youtu.be/yLhJuJEDuB0) | 2026-10-26 | online |
| [#9](films/09-one-person-with-ai/) | One Person With AI Now Does the Work of a Company | [bbrROdt6SUE](https://youtu.be/bbrROdt6SUE) | 2026-10-27 | online |
| [#10](films/10-superintelligence-is-getting-a-body/) | Superintelligence Is Getting a Body | [CjxjwTG2a7s](https://youtu.be/CjxjwTG2a7s) | 2026-10-29 | online |
| [#11](films/11-ai-is-making-us-dumber/) | AI Is Making Us Dumber. It Doesn't Have to. | [XvRIEZTw2oA](https://youtu.be/XvRIEZTw2oA) | 2026-10-28 | online |
| [#13](films/13-the-ai-bubble-could-pop/) | The AI Bubble Could Pop. Superintelligence Won't Stop. | [ZZzg5VLMj1w](https://youtu.be/ZZzg5VLMj1w) | 2026-10-31 | online |
| [#14](films/14-a-few-people-control-superintelligence/) | A Few People Control Superintelligence | [pELUtjWTwwU](https://youtu.be/pELUtjWTwwU) | 2026-11-01 | online |
| [#15](films/15-ai-isnt-giving-us-free-time/) | AI Isn't Giving Us Free Time | [_AG3q_63RUU](https://youtu.be/_AG3q_63RUU) | 2026-11-02 | online |
| [#16](films/16-ai-is-speeding-up-science/) | AI Is Speeding Up Science | [6echbi3VZcA](https://youtu.be/6echbi3VZcA) | 2026-11-03 | online |
| [#17](films/17-the-rules-written-for-an-ais-mind/) | The Rules Written for an AI's Mind | [CIIivE-85yw](https://youtu.be/CIIivE-85yw) | 2026-11-04 | online |
| [#18](films/18-ai-will-end-capitalism/) | AI Will End Capitalism | [i9rTcXGJkpc](https://youtu.be/i9rTcXGJkpc) | 2026-11-06 | online |
| [#19](films/19-how-to-survive-the-ai-crash/) | How to Survive the AI Crash | [M-drqvpF33g](https://youtu.be/M-drqvpF33g) | 2026-11-07 | online |
| [#20](films/20-the-first-generation-that-wont-grow-old/) | The First Generation That Won't Grow Old | [V_AtD5Z8vCc](https://youtu.be/V_AtD5Z8vCc) | 2026-11-08 | online |
| [#21](films/21-the-rise-of-biocomputers/) | The Rise of Biocomputers | [gTWNBnMhpdc](https://youtu.be/gTWNBnMhpdc) | 2026-11-09 | online |
| [#22](films/22-the-singularity-was-predicted-for-this-friday/) | The Singularity Was Predicted for This Friday | [05AvM4DjAlg](https://youtu.be/05AvM4DjAlg) | 2026-11-10 | online |
| [#23](films/23-a-day-in-2037-with-superintelligence/) | A Day in 2037 With Superintelligence | [jkDBk8QFcyY](https://youtu.be/jkDBk8QFcyY) | 2026-11-11 | online |
| [#24](films/24-ai-is-starting-to-understand-animals/) | AI Is Starting to Understand Animals | [xSXiEu--jzg](https://youtu.be/xSXiEu--jzg) | 2026-11-12 | online |
| [#25](films/25-ai-is-taking-jobs-in-this-order/) | AI Is Taking Jobs in This Order | [zbcbdu2TGjo](https://youtu.be/zbcbdu2TGjo) | 2026-11-13 | online |
| [#27](films/27-why-elon-says-saving-money-is-pointless/) | Why Elon Says Saving Money Is Pointless | [KTnlD992PaA](https://youtu.be/KTnlD992PaA) | 2026-11-15 | online |
| [#28](films/28-theyre-using-ai-to-save-the-world/) | They're Using AI to Save the World | [rG4SWSRea7I](https://youtu.be/rG4SWSRea7I) | 2026-11-14 | online |
| [#29](films/29-ai-is-bringing-back-the-mammoth/) | AI Is Bringing Back the Mammoth | [X_ZFORcbVgA](https://youtu.be/X_ZFORcbVgA) | 2026-11-20 | online |
| [#31](films/31-superhuman-ai-is-coming-next-year/) | Superhuman AI Is Coming Next Year | [IO6-9l56jSg](https://youtu.be/IO6-9l56jSg) | 2026-11-18 | online |
| [#41](films/41-bill-gates-on-work/) | Bill Gates Changed His Mind About AI and Jobs | [GIa1407KO7c](https://youtu.be/GIa1407KO7c) | 2026-11-26 | geplant 17:00 Wien |
| [#49](films/49-you-have-five-years-before-superintelligence/) | You Have 5 Years to Get Ready for AI | [C331gMzZwrw](https://youtu.be/C331gMzZwrw) | 2026-11-24 | online |
| [#54](films/54-ai-just-gave-disease-a-10-year-deadline/) | AI Just Gave Disease a 10-Year Deadline | [Tzttxz97Lxc](https://youtu.be/Tzttxz97Lxc) | 2026-11-16 | online |
| [#55](films/55-the-ai-youre-not-allowed-to-use/) | The AI You're Not Allowed to Use | [-VWTQPoo8Y8](https://youtu.be/-VWTQPoo8Y8) | 2026-11-19 | online |
| [#59](films/59-a-superintelligence-lab-goes-public/) | A Superintelligence Lab Goes Public | [6eC7pLUo4eM](https://youtu.be/6eC7pLUo4eM) | 2026-11-17 | online |
| [#63](films/63-the-pope-says-ai-wont-save-you/) | The Pope Says AI Won't Save You | [aFcLFCuo4WA](https://youtu.be/aFcLFCuo4WA) | 2026-11-27 | geplant 17:00 Wien |
| [#65](films/65-ai-can-now-call-you-in-your-moms-voice/) | AI Can Now Call You in Your Mom's Voice | [3LGRxckPbyY](https://youtu.be/3LGRxckPbyY) | 2026-11-21 | online |
| [#66](films/66-sam-altman-says-everything-will-get-cheap/) | Sam Altman Says Everything Will Get Cheap | [FgI_80-ny8k](https://youtu.be/FgI_80-ny8k) | 2026-11-22 | online |
| [#67](films/67-metas-ai-chief-says-superintelligence-is-arriving/) | Meta's AI Chief Says Superintelligence Is Arriving | [_OUo4xvQyMQ](https://youtu.be/_OUo4xvQyMQ) | 2026-11-23 | online |
| [#68](films/68-the-ai-race-will-be-decided-by-2027/) | The AI Race Will Be Decided by 2027 | [cFUJC__Wyqs](https://youtu.be/cFUJC__Wyqs) | 2026-11-28 | geplant 17:00 Wien |
| [#69](films/69-europe-can-still-win-the-ai-race/) | Europe Can Win the AI Race | [wkFG5z3R_YM](https://youtu.be/wkFG5z3R_YM) | 2026-11-25 | online |
| [#70](films/70-harari-biggest-fear-about-ai/) | Harari's Biggest Fear About AI Isn't Robots | [fmOZpMc3SuU](https://youtu.be/fmOZpMc3SuU) | 2026-11-30 | geplant 17:00 Wien |
| [#71](films/71-max-tegmarks-12-endings-for-ai/) | Max Tegmark's 12 Endings for AI | [V3pH9kY6eiI](https://youtu.be/V3pH9kY6eiI) | 2026-12-04 | geplant 17:00 Wien |
| [#72](films/72-why-ai-billionaires-are-building-bunkers/) | Why AI Billionaires Are Building Bunkers | (Upload folgt) | 2026-12-07 | im Bau |
| [#73](films/73-the-first-generation-that-wont-die/) | The First Generation That Won't Die | [oQ2cZnK_H1c](https://youtu.be/oQ2cZnK_H1c) | 2026-11-29 | geplant 17:00 Wien |
| [#74](films/74-your-life-in-2050/) | Your Life in 2050 If We Get AI Right | [j07Zvy5tri4](https://youtu.be/j07Zvy5tri4) | 2026-12-03 | geplant 17:00 Wien |
| [#75](films/75-our-minds-arent-ready-for-superintelligence/) | Our Minds Aren't Ready for Superintelligence | [CUleHDTSFMU](https://youtu.be/CUleHDTSFMU) | 2026-12-08 | geplant 17:00 Wien |
| [#76](films/76-your-kids-will-grow-up-with-superintelligence/) | Your Kids Will Grow Up With Superintelligence | [RJhPXezGSSQ](https://youtu.be/RJhPXezGSSQ) | 2026-12-05 | geplant 17:00 Wien |
| [#77](films/77-agi-the-final-human-invention/) | AGI: The Final Human Invention | [9nPYHmqpFk8](https://youtu.be/9nPYHmqpFk8) | 2026-12-01 | geplant 17:00 Wien |
| [#78](films/78-what-did-ilya-see/) | What Did Ilya See? | [e79-Z-pkCRI](https://youtu.be/e79-Z-pkCRI) | 2026-12-02 | geplant 17:00 Wien |
| [#79](films/79-your-life-in-2050-the-ai-worst-case/) | Your Life in 2050: The AI Worst Case | [M516TSgrKC8](https://youtu.be/M516TSgrKC8) | 2026-12-06 | geplant 17:00 Wien |

#12 gibt es nicht als Film. Fehlende Nummern sind Ideen oder geparkte Filme (Liste im Projektordner `themen/nummern-liste.md`).
Stand der Tabelle: 26.11.2026 (geprüft mit `tools/check_descriptions.py` gegen YouTube). Jeden Tag erscheint ein Film um 17:00 Wien.
Die Nummer bleibt die feste ID eines Films, auch wenn sich der Titel ändert.

Jeder Filmordner hat eine `README.md` mit Link, Herkunft und der Liste der großen Dateien, die nicht im Repo liegen.

## Was wo liegt

| Was | Wo |
|---|---|
| Skripte, Regeln, Code, Titel, Beschreibungen, Thumbnail-Vorschauen | **hier im Repo** |
| Film-Master, Audio, Musik, große Bilder, Interview-Clips, Quellen-PDFs (alles über 1 MB) | Google Drive, Ordner „#NN Titel“ (1 Film · 2 Thumbnails · 3 Rohmaterial · 4 Texte) |
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
