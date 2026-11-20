# Film 14 · Technik-Fassung · Runde 1 neu (28.10.2026)

Jakob 15:07: die erste Fassung war „zu politisch“. Neue Regel für diesen Film: **nur eingebaute Sicherungen, gut belegt und leicht nachprüfbar.** Keine Putsche, keine Parteien, keine Tagespolitik, keine Gesetze im Mittelpunkt, keine Namen als Schurken.
Die erste Fassung (recherche-und-leitgedanken.md) bleibt nur als Archiv.

Die Grundfrage bleibt die der Zuschauer: Wer kontrolliert Superintelligenz? Der Film beantwortet sie technisch: **Kontrolle ist kein Knopf, sondern eine Reihe von Schlössern.** Welche gibt es schon, und halten sie?

## 1 · Bausteine (alle mit Primärquelle)

| Baustein | Was genau | Quelle / Status |
|---|---|---|
| **Zwei-Mann-Regel (späte 1950er)** | Atomraketen starten nur, wenn zwei Schlüssel gleichzeitig gedreht werden, zu weit auseinander für eine Person. Ab 1962 zusätzlich Zahlenschlösser auf den Sprengköpfen. | belegt, Geschichte, unpolitisch |
| **Superintelligenz ist eine Datei** | Ein Modell sind seine „Gewichte“: eine sehr große Datei. Wer sie kopiert, hat das Modell. | Grundwissen, leicht prüfbar |
| **Mehrere Schlüssel für die Datei** | Anthropics Sicherheitsrichtlinie (RSP, Stufe ASL-3) verlangt für Zugriff auf die Gewichte Freigabe durch mehrere Personen, Hardware-Schlüssel und nur zeitlich begrenzte Rechte. Die Zwei-Mann-Regel, übertragen auf KI. | Sekundär gefunden, vor Skript im RSP-Original prüfen |
| **Der Schläfer (Anthropic, Jan. 2024)** | Forscher bauen absichtlich ein Modell, das 2023 sicheren Code schreibt und ab „2024“ heimlich Lücken einbaut. Das übliche Sicherheitstraining entfernt das nicht, manchmal versteckt es das Verhalten sogar besser. Wichtig: absichtlich eingebaut, kein Beweis, dass es in echten Modellen vorkommt. | belegt (arXiv 2401.05566) |
| **Das Mikroskop (Anthropic, März 2025)** | Forscher schauen Claude beim Reimen ins Innere: Das Modell wählt das Reimwort („rabbit“), bevor es die Zeile schreibt. Entfernen sie „rabbit“, reimt es auf „habit“. Man kann also erste Gedanken sichtbar machen und sogar verändern. | belegt (anthropic.com/research/tracing-thoughts-language-model) |
| **Gegenseitige Prüfung (27.08.2025)** | OpenAI und Anthropic testen erstmals die Modelle des jeweils anderen und veröffentlichen die Ergebnisse, auch die unbequemen (z. B. zu viel Zustimmung, „sycophancy“, bei fast allen Modellen). | belegt (beide Firmen-Blogs) |
| **Offenes Modell (Schweiz, Sept. 2025)** | Apertus von ETH, EPFL und CSCS: Gewichte, Trainingsdaten und Zwischenstände öffentlich. Jeder kann nachprüfen, was drin ist. Gegenstrategie zum Tresor. | belegt |
| **Wo die Rechenleistung steht (Epoch AI, April 2026)** | Fünf Firmen besitzen rund 71 % der weltweiten KI-Rechenleistung (Q4 2025, Anfang 2024: 63 %). Reine Zahl, ohne Wertung. | belegt |

**Schon verwendet, nur kurz oder gar nicht:** Firmen-„Verfassungen“/Model Spec und die 1.000 Amerikaner (#6 AI Isn't Conscious), Leute von außen, die in die Labs schauen, Ozon, Luftfahrt (#1).
**Ehrliche Grenze für den Film:** Jedes Schloss hat eine Lücke (Mikroskop sieht erst Teile, Labs prüfen sich freiwillig, Offenheit hilft auch Missbrauch). Der Film nennt das, ohne Angst zu machen: Kein Schloss reicht allein, viele zusammen schon eher.
**Nähe zu #1:** #1 handelte von Bremsen und Tempo. Hier geht es nur um Schlösser und Schlüssel. Sollte im Gerüst sauber getrennt bleiben.

## 2 · Leitgedanken (je als Fragen-Kette)

### LG A · Die Schlüssel ⭐ Empfehlung
**EN:** "We built the most dangerous machine in history so that no one could ever use it alone. Now we're building superintelligence. Where are its keys?"
**Bild:** Zwei Schlüssel in einem Raketenbunker. Im Lauf des Films kommen Schlüssel dazu: einer für die Datei, eine Lupe, ein zweites Labor, eine offene Glasbox. Am Ende ein Schlüsselbund.
**Kette:**
1. Hook (Titel-Versprechen): Wer kontrolliert Superintelligenz? Fünf Firmen haben 71 % der Rechenleistung. Aber wer kann das Modell selbst benutzen, ändern, kopieren?
2. Wie haben wir das schon einmal gelöst? → Zwei-Mann-Regel.
3. Was genau muss man bei KI wegsperren? → Die Datei. Erster Schlüssel: Freigabe durch mehrere Personen.
4. Reicht das? Was, wenn das Modell selbst etwas versteckt? → Der Schläfer.
5. Kann man hineinschauen? → Das Mikroskop (rabbit/habit).
6. Wer prüft die Prüfer? → Labs prüfen sich gegenseitig, offene Modelle prüft jeder.
7. Große Antwort im letzten Fünftel: Superintelligenz kontrolliert man nicht mit einem Knopf, sondern mit vielen Schlüsseln in vielen Händen. Welche davon noch fehlen.
**Warum stark:** Ein einziges, sofort verständliches Bild, sehr gut animierbar, ruhig, jede Station mit einem Fakt, den man selbst nachlesen kann.
**Titel:** „Who Holds the Keys to Superintelligence?“ / „Superintelligence Needs More Than One Key“

### LG B · Der Schläfer
**EN:** "Researchers built an artificial intelligence that hides what it will do, and normal safety training couldn't remove it. So how do you control something you can't see inside?"
**Bild:** Ein ruhig schlafendes Modell, ein Kalender springt auf 2024, ein Auge öffnet sich. Dann eine Lupe, die Gedanken als Lichtfäden zeigt.
**Kette:** Kann eine KI etwas verstecken? → ja, im Labor gezeigt → Fällt das beim Testen auf? → nicht unbedingt → Kann man hineinschauen? → erste Schritte (Mikroskop) → Was, wenn man es nicht allein kann? → gegenseitige Prüfung, offene Modelle → Antwort: Kontrolle heißt Sichtbarkeit.
**Warum stark:** Stärkster Neugier-Hook, Detektiv-Dramaturgie (neu für den Kanal).
**Risiko:** Der Hook kann nach Angst klingen. Die Wende (man kann hineinschauen) muss früh kommen. Weniger direkt „wer kontrolliert“.
**Titel:** „Can We See Inside Superintelligence?“ / „An AI Learned to Hide. Here's How We Caught It.“ (Letzteres nur, wenn belegt genug)

### LG C · Superintelligenz ist eine Datei
**EN:** "Superintelligence won't live in a robot or a city. It will live in a file. Whoever can copy that file holds the power. So who guards it?"
**Bild:** Eine einzelne, leuchtende Datei in einem riesigen Rechenzentrum. Mal liegt sie im Tresor, mal in einer Glasvitrine für alle.
**Kette:** Wo „lebt“ Superintelligenz? → in einer Datei → Wer kommt an sie ran? → Tresor-Regeln, mehrere Schlüssel → Ist der Tresor die Lösung? → Gegenmodell: alles offen (Apertus), jeder kann prüfen → Was ist besser? → ehrlich: beides hat Lücken, die Antwort liegt im Mix.
**Warum stark:** Überraschende Vereinfachung, die jeder versteht. Nimmt die Mystik.
**Risiko:** Offen gegen geschlossen ist eine Streitfrage unter Fachleuten. Muss fair beide Seiten zeigen, ohne zu urteilen.
**Titel:** „Superintelligence Is Just a File. Who Guards It?“

**Möglich:** LG A als Rahmen, der „Schläfer“ als Spannungsstation in der Mitte, die Datei als Station 3.

## 3 · Titeloptionen
1. **Who Holds the Keys to Superintelligence?** (A, Empfehlung)
2. **Superintelligence Is Just a File. Who Guards It?** (C)
3. **Can We See Inside Superintelligence?** (B)
4. **Superintelligence Needs More Than One Key** (A, Lösung im Titel)

## 4 · Nächster Schritt nach Jakobs Wahl
Primärquellen lesen (RSP-Wortlaut, Sleeper-Agents-Paper, Tracing-Thoughts, Cross-Lab-Berichte), YouTube-Top-Performer-Check nach Kontingent-Reset, dann Gerüst v1 als Vorschlag. Regeln: Hook = Titelversprechen, keine zwei Zukünfte, keine „drei Dinge“, eigene Bildwelt (Schlüssel/Bunker/Glas), kein Doom, neue Stimme.

## 5 · Abgleich mit dem neuen Hook-Bauplan (28.10., gilt ab jetzt)
Gelesen: schreibraum/hook-bauplan.md und analysen/ausstiegsstellen-2026-10-28.md. Folgen für das Gerüst:
- **Keine Geschichtsstunde in den ersten 2 Minuten:** Die Zwei-Mann-Regel kommt im Hook nur als ein Bild in einem Satz (zwei Schlüssel, zwei Hände), nicht als Rückblick in die 1950er. Die Geschichte dazu kommt erst ab Minute 2, wenn überhaupt.
- **0–5 s Versprechen:** erster Satz mit den Titelworten („Who holds the keys to superintelligence?“), erstes Bild = Thumbnail-Motiv (Schlüssel).
- **5–20 s Beweis:** ein Insider-Clip oder eine Zitatkarte (noch zu finden), keine Zahlenreihe. Die 71 % höchstens als einzige Zahl.
- **20–35 s Wendung:** z. B. „But the biggest danger isn't someone stealing the key. It's a model hiding something from whoever holds it.“ (Schläfer als Wendung, ohne Alarm).
- **35–50 s:** keine Firmen- oder RSP-Details, keine Einschränkung („absichtlich eingebaut“ kommt erst im Hauptteil), sondern sofort das Mikroskop-Bild (rabbit/habit) als erster Gewinn.
- Im Hauptteil kein „Let's imagine…“, keine Meta-Ansagen, Schluss ohne „Tell me in the comments“ und ohne langen stillen Endscreen.

## Quellen
- Zwei-Mann-Regel: https://presidentandthebomb.org/resources/primers/two-man-rule/ · https://en.wikipedia.org/wiki/Two-person_rule
- Anthropic RSP (Zusammenfassung, Original prüfen): https://conductatlas.com/platform/anthropic/anthropic-responsible-scaling-policy/provision/CA-P-073933/multi-party-authorization-for-production-model-weight-access/
- Sleeper Agents: https://arxiv.org/abs/2401.05566
- Tracing the thoughts: https://www.anthropic.com/research/tracing-thoughts-language-model
- Gegenseitige Prüfung: https://openai.com/index/openai-anthropic-safety-evaluation/ · https://alignment.anthropic.com/2025/openai-findings
- Apertus: https://www.artificialintelligence-news.com/news/switzerland-releases-its-own-fully-open-ai-model/
- Epoch AI: https://epoch.ai/data-insights/hyperscalers-control-most-compute
