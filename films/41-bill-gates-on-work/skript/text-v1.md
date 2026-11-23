# Text v1 · #41 „Bill Gates Changed His Mind About AI and Jobs“ · The Good Takeoff

Stand 23.11.2026 · erste Textfassung (Texter) · Bildtext: HE CHANGED HIS MIND · Hörfassung: `vo-v1.txt`

Grundlagen: `runde2-titel-zitate-geruest-v1.md` Abschnitt 4 (Gerüst v1, von Jakob freigegeben), `faktenzettel.md` (einzige Faktenquelle, Abschnitt 0 geht vor), `clips.json`, `regeln/REGELN.md` (Stand 23.11.), `vibe-brief.md`, `hook-bauplan.md`, `feedback-log.md`, `clip-schritt.md`. Format nach #66 `text-v3.md`. Keine Webrecherche; die Rohrecherche wurde nicht gelesen (REGELN §10). Gegengelesen gegen #25 (`vo-v4.txt`) und per Textsuche gegen die Hörfassungen aller früheren Filme.

Alles im Sprechtext stammt aus dem Faktenzettel. Was darüber hinausgeht (zwei Formulierungen aus Allgemeinwissen, die Deutungen des Films) und alles Dünne oder Offene ist mit [CHECK] markiert und unten in einer Liste gesammelt. Keine Ich-Sätze, kein gesprochenes „AI“, kein Jensen Huang, keine Medizin-Station, kein Flüster-Tag.

## Kopf

| Kennzahl | Wert |
|---|---|
| Gesprochene Wörter | **1.410** (Ziel 1.350–1.500), gezählt ohne Clip-Zeilen und Tags |
| Laufzeit bei 145 Wörtern pro Minute | Sprechtext 9:43 + 4 Clips 31 s + 2 Pausen à 1 s = **10:16**; mit 15 s Endbild **10:31** |
| Grundfrage (Gerüst) | Was hat Bill Gates gesehen, das ihn umgestimmt hat, und was heißt das für deine Arbeit? Im Film: „So what did Bill Gates see?“ (0:22–0:25, einzige Frage in Minute 1). Die zweite Hälfte trägt der Satz davor („Whatever your job is: he means yours too.“). Hörbar beantwortet bei 1:32: „That is what Bill Gates saw: this time, the machine can follow them.“ |
| Letztes Fünftel | beginnt bei **≈ 8:13** (80 % von 10:16), in Station 6 kurz nach Clip C4, in der Zeile „Decide which jobs. …“ (8:03–8:17). Danach: der Zweifel (8:17), die große Antwort (8:35–9:06: übrig geblieben → im Voraus gewählt), die Frage an dich (9:06), Kernsatz 9:54 (96 %). |
| Kernsatz | **„The question is no longer what artificial intelligence can do. It's what goes on the list. And who gets to write it.“** Gepflanzt im Hook: 0:40 „Even where a machine could do it.“ · 0:47 „Think of it as a list.“ · 0:51 „And it hasn't been written yet.“ Gedreht gegenüber dem Gerüst (Faktenzettel 0.7), siehe Abweichungen. |
| Leitgedanke | A, von Jakob gewählt: Der Optimist hat seine Meinung geändert. Seine Antwort ist nicht „stoppen“, sondern eine Entscheidung: welche Arbeit Menschen vorbehalten bleibt. Bisher blieb menschliche Arbeit übrig; jetzt soll sie gewählt werden, und niemand hat die Liste geschrieben. |
| Uhr (§3.2) | Zeitleiste mit drei Stopps, ab 1:54 in der Bildecke: NOW (2:01) · 2–8 YEARS (3:08) · 20 YEARS (5:19) |
| Hook | 61 Wörter bis zum Ende der Frage (0:25), 131 Wörter bis zum Hook-Ende (0:54), Einordnung 0:54, C1 ab 0:56. Minute 1: 1 Frage, 0 Jahreszahlen, Zahlwörter nur „Three years ago“ |
| Titel eingelöst | 0:00 der Satz · 0:04–0:12 vorher/nachher · 0:56 er selbst im O-Ton · 1:04–1:44 was sich geändert hat und warum (bis 1:30 konkret: zwei Essays, ein O-Ton) |
| Clips | C1 ~8 s · C2 ~8 s · C3 ~7 s · C4 ~8 s = **31 s ≈ 5,0 %** von 10:16 (Ziel ≤ 8 %). Abstände (eigener Film dazwischen): C1→C2 137 s · C2→C3 123 s · C3→C4 136 s (alle ≥ 45 s). C2 + C3 aus demselben Video: 15 s (Grenze 2 Clips / 20 s). Alle Dauern geschätzt, Zeitmarken offen. |
| Abo-Aufrufe | 5:08 (Mitte, direkt nach dem Urteil der Gegenprobe) · 10:03 (Schluss, nach dem Kernsatz). „subscribe“ = 2 Treffer, beide mit Mission und als Frage, keiner im Hook, kein QR |
| Gesprochene Zahlen | „nineteen percent“ 2:20 · „two to eight years“ 3:08 · „twenty years“ 5:39 (und im O-Ton C3) · „forty percent“ 7:33. Genau die vier aus dem Faktenzettel, also 4 in gut 10 Minuten. Dazu ohne Rechnen: „Three years ago“ (2 ×), „Three stops“ |
| Längster Satz | 24 Wörter (Regel: nie über ~25) |
| Regel-Check | `python3 tools/regel_check.py films/41-bill-gates-on-work/skript/vo-v1.txt` → **0 Hinweise** (Bann-Liste 0, Fahrplan 0, Minute 1 ohne Treffer, Ich-Sätze 0, Clips 4, Länge im Rahmen). Das Skript zählt 1.414 Wörter, weil es die vier Marken „CLIP:“ mitzählt. Eigene Textsuche: „subscribe“ 2 Treffer, „AI“ 0 Treffer, kein Satz über 25 Wörter. |

Zeiten bei 145 W/min, jeweils Satzanfang, ohne Atempausen zwischen den Stationen (real eher 5 bis 10 s mehr).

**Fundament (REGELN §11)**

1. *Fokus mit „but“:* Das ist eine Geschichte über Bill Gates, der seine Meinung über KI und Jobs geändert hat. Interessant ist: Seine Antwort ist nicht, die Maschinen zu stoppen, sondern eine Liste von Arbeit nur für Menschen, und die hat noch niemand geschrieben.
2. *Frage hinter der Frage:* Wenn Maschinen fast jede Arbeit können: Wer entscheidet, welche Arbeit menschlich bleibt, und mit welcher Begründung?
3. *Die eine Erkenntnis:* Bisher war menschliche Arbeit das, was die Maschine übrig ließ (eine Preisfrage). „Human Reserved“ würde daraus eine Entscheidung im Voraus machen. Für die nächste Schlagzeile „KI kann jetzt X“ heißt das: Gehört X auf die Liste, und wer entscheidet das?
4. *Missverständnisse, die gebrochen werden:* „Technik hat immer neue Jobs geschaffen, also auch diesmal“ (1:32) und „Wer mit den Händen arbeitet, ist sicher“ (3:00–3:08).
5. *Wert:* Mitsprache und Würde (gebraucht werden, 6:40), Fairness im Übergang.

**Warum das geklickt und zu Ende geschaut wird (REGELN §2.5e, aus Gerüst Abschnitt 0)**

- *Titel und Leitgedanke:* Das Muster „berühmter Mensch ändert seine Meinung über KI“ trägt auch ohne große Marke (The Atlantic 1,67 Mio.; OFFSWITCH 142k bei 598 Abos; Decoder 954k bei 43k Abos). Der Film sagt die Titelworte in Sekunde 0 und zeigt vorher/nachher bis 0:12.
- *Hook:* „This is crazy. This is insane.“ war die Zeile, mit der Breaking Points (444k) und die Semafor-Meldung liefen. Sie steht bei 0:25 als harter Schlag direkt nach der Frage.
- *Mitte:* Die Zeitleiste jetzt → 2 bis 8 Jahre → 20 Jahre entspricht dem, was bei Decoder zieht („prepare for 20 years“). Jobs sind unser stärkstes Du-Thema (#25: 74.681 Aufrufe).
- *Schluss:* Die Liste ist die offene Schleife, die die großen Interviews nicht auflösen. Sie wird im Hook geöffnet (0:51) und bleibt bis 9:54 offen.
- *Gegen die Abnutzung (Thema seit August im Umlauf):* neuester Anlass im Hook (0:33, Datumsstempel bis 12.11.) und eine Frage, die noch niemand beantwortet: was auf die Liste kommt und wer sie schreibt.

## Fragen-Kette (Ist-Zeiten)

| # | Zeit | Station | beantwortet | öffnet |
|---|---|---|---|---|
| 0 | 0:00–0:54 | **Hook: Er hat seine Meinung geändert** | Gates hat seine Meinung über KI und Jobs geändert: früher „real, but manageable“, jetzt „far fewer jobs“, kein Job bleibt unberührt, auch deiner. Er nennt es „crazy“ und „insane“ und hört nur Stille. Erster Gewinn: Er will die Maschinen nicht stoppen, sondern Arbeit für Menschen reservieren. Eine Liste („Human Reserved“), die noch nicht geschrieben ist. | Hauptfrage: Was hat er gesehen? Große Schleife (ohne Fragezeichen): Was kommt auf die Liste, und wer schreibt sie? |
| 1 | 0:54–2:01 | **Was hat sich geändert?** (C1 0:56) | Antwort auf die Hauptfrage: kein neues Gerät, sondern ein neues Bild von der Maschine. Vor drei Jahren: Technik kostet Jobs und schafft neue. Jetzt: Diese Technik übertrifft menschliche Intelligenz, also kann sie den Menschen in die neue Arbeit folgen. Er setzt seinen Ruf darauf. | Wo fängt es an? (Die Uhr wird gestellt: drei Stopps.) |
| 2 | 2:01–3:00 | **Stopp 1 „jetzt“: Arbeit am Bildschirm** | Zuerst trifft es Arbeit am Bildschirm (er nennt Telefon-Support, Telemarketing, Buchhaltung). Für eine Gruppe ist das schon messbar: Berufseinsteiger, rund 19 % Rückstand. Aber: Wo die Technik neben Menschen arbeitet, hält die Beschäftigung. | Und wer mit den Händen arbeitet, ist sicher? |
| 3 | 3:00–3:58 | **Stopp 2 „in 2 bis 8 Jahren“: Arbeit mit den Händen** (C2 3:21) | Nein: In zwei bis acht Jahren erwartet er humanoide Roboter auf Baustellen und Feldern. Aber sein Satz beginnt mit „If we don't choose“: Es ist eine Entscheidung, kein Wetter. | Hat er überhaupt recht? (Der dritte Stopp bleibt offen.) |
| 4 | 3:58–5:08 | **Gegenprobe (§1.9a)** | Wer spricht: Mitgründer von Microsoft, warnt vor der Technik, an der seine alte Firma verdient (Gegenlesart: strenge Regeln nützen den Großen). Die Daten: Im ganzen US-Arbeitsmarkt findet Yale (Stand Frühjahr) keinen KI-Effekt; Gates selbst nennt es eine Prognose. Urteil: Richtung plausibel, am Berufseinstieg messbar, Tempo und Ausmaß offen. | Nach dem Abo-Aufruf: Was ist der letzte Stopp, der ihm am meisten Sorgen macht? |
| – | 5:08–5:19 | **Abo-Aufruf 1** | direkt nach der Auflösung der Gegenprobe, mit Mission und als Frage | |
| 5 | 5:19–6:51 | **Stopp 3 „20 Jahre“ + sein Plan, Teil 1 (Steuer)** (C3 5:32) | Der letzte Stopp ist eine Strecke: 20 Jahre Übergang mit Gewinnern und Verlierern. Sein erster Hebel: Heute belohnt das Steuersystem das Ersetzen; wer Menschen ersetzt, soll zahlen (Geld für Umschulung und Absicherung). Einwand Etzioni: wie eine Steuer auf Tastenanschläge. | Geld ersetzt den Lohn. Was ersetzt das Gebrauchtwerden? |
| 6 | 6:51–9:16 | **Die große Antwort: Human Reserved** (C4 7:55) | Arbeit, die wir per Regel Menschen vorbehalten, auch wenn Maschinen sie könnten. Obergrenze nach seinen Worten: 40 %, also stünden die meisten Jobs nicht darauf. Offen, sagt er selbst: wer entscheidet, nach welchen Kriterien, wie man es durchsetzt. Große Antwort (letztes Fünftel): Bisher war menschliche Arbeit das, was übrig blieb; hier würde sie im Voraus gewählt. | Was würdest du auf die Liste setzen, und warum? Wer schreibt sie? |
| 7 | 9:16–10:03 | **Ende** | Am Ende der zwanzig Jahre sieht Gates Überfluss und eine Aufgabe, die bei den Menschen bleibt (sich organisieren, Sinn finden). Sie beginnt mit der Liste, und die schreibt, wer sich zu Wort meldet. | — |
| – | 10:03–10:16 | **Abo-Aufruf 2** | über dem Schlussbild, nach dem Kernsatz | |
| E | 10:16–10:31 | **Endbild 15 s** | Bild und Musik laufen weiter, Endcards | |

- **But/therefore zwischen den Stationen:** Hook (aber: Seine Antwort ist nicht „stoppen“) → 1 (darum: Wo fängt es an?) → 2 (aber: Neben Menschen hält die Beschäftigung; darum: Sind Hände sicher?) → 3 (aber: Sein Satz enthält eine Wahl; darum: Hat er recht?) → 4 (aber: Der Gesamtmarkt zeigt es noch nicht; darum: Richtung plausibel, Tempo offen) → 5 (darum: Wer ersetzt, soll zahlen; aber: Geld ersetzt nicht das Gebrauchtwerden) → 6 (darum: die Liste; aber: Niemand hat sie geschrieben) → 7 (darum: Wer schreibt sie?).
- **Offene Schleifen (höchstens ~90 s Abstand):** 0:22 Hauptfrage (zu: 1:32) · 0:51 die ungeschriebene Liste (zu: Schluss) · 1:54 wo es anfängt · 2:52 sind Hände sicher · 3:52 hat er recht, und der letzte Stopp · 5:19 wie lang · 5:49 welche Politik · 6:40 was Geld nicht ersetzt · 7:14 würdest du Menschen wollen · 7:28 wie lang die Liste wird · 7:50 welche Jobs · 8:03 wer entscheidet · 9:06 dein Grund.
- **Die Uhr tickt hörbar:** „The first is now.“ (1:54) · „So the first stop is the screen.“ (2:52) · „That's the second stop“ (3:08) · „Before the last stop on his timeline“ (3:52) · „That leaves the last stop“ (5:19) · „Now look past those twenty years.“ (9:16).

**Wiederkehrende Bildmittel (Vorschläge, Stil Editorial-Nacht):** die Wand aus Fenstern (jedes erleuchtete Fenster ein Job) · die Liste (hohes Blatt aus Licht, Kopfzeile HUMAN RESERVED, leere Zeilen) · die Zeitleiste mit drei Stopps in der Bildecke · die goldene Linie (was vorbehalten ist) · Zitatkarten mit Quelle und Datum · „du“ als kleine Figur in gelber Regenjacke, alle anderen als schlichte Silhouetten, Roboter nie als Hauptsache (§1.5). Kein Türen-Motiv (#18), keine Preisschilder (#66), kein Stift (#17), kein Schachbrett (#25).

---

## Hook: drei Varianten (0:00 bis ~1:00, REGELN §4)

Alle drei beginnen mit den Titelworten und enden auf derselben Schleife oder einer Zuspitzung davon. Danach folgt in jeder Variante direkt der Einordnungssatz und Clip C1, ohne Pause. Zeiten bei 145 W/min.

### A · „Vorher / Nachher“ (empfohlen, steht im Skript) · 61 Wörter bis zum Ende der Frage (0:25), 131 Wörter bis zum Hook-Ende (0:54)

> `0:00` Bill Gates changed his mind about artificial intelligence and jobs.  
> `0:04` Three years ago, he called the risks real, but manageable.  
> `0:08` Now he warns of far fewer jobs than exist today.  
> `0:12` And he says no job will be left untouched.  
> `0:16` Jobs at a screen. Jobs done by hand. Whatever your job is: he means yours too.  
> `0:22` So what did Bill Gates see?  
> `0:25` His own words: "This is crazy. This is insane."  
> `0:28` What comes back is silence. He says he's deafened by it.  
> `0:33` And he has been saying it for months.  
> `0:36` But his answer is not to stop the machines.  
> `0:40` He wants certain work set aside. For people only. Even where a machine could do it.  
> `0:47` Think of it as a list. He calls it Human Reserved.  
> `0:51` And it hasn't been written yet.  

| Zeit | Regel (§4) | Hook A | Urteil |
|---|---|---|---|
| 0–3 s | Titelworte, Thumbnail-Motiv, These groß | „Bill Gates changed his mind about artificial intelligence and jobs.“ + Bildtext HE CHANGED HIS MIND | erfüllt |
| 3–30 s | erst das Warum mit deinem Einsatz, dann EINE Hauptfrage | 0:04 vorher · 0:08 nachher · 0:12 kein Job unberührt · 0:16 „he means yours too“ · Frage 0:22–0:25 | erfüllt; ein Rückblick-Satz als Titelversprechen (siehe Risiken) |
| 30–50 s | harte Wendung in kurzen Schlägen; nicht erklären, ankündigen, zurückblicken | 0:25 „This is crazy. This is insane.“ · 0:28 Stille · 0:33 „for months“ · 0:36 Wende: nicht stoppen · 0:40 Arbeit nur für Menschen | erfüllt; erstes echtes Ergebnis bei 0:40, also vor 0:45 |
| 50–60 s | erster Gewinn, der die nächste Lücke öffnet; erst danach Kontext oder Beleg (ein Satz) | 0:47 „Think of it as a list. He calls it Human Reserved.“ · 0:51 „And it hasn't been written yet.“ · 0:54 Einordnung · 0:56 C1 | erfüllt; kein Break und keine Pause am Hook-Ende |
| Minute 1 | höchstens eine Zahl, kein Jahr, eine Frage, kein Fahrplan, keine Biografie, kein Firmendetail | Zahlwort nur „Three years ago“ · 0 Jahreszahlen · 1 Frage · kein Fahrplan | erfüllt |

- **Gegentest (§4):**
  - (a) Worum geht es? Bill Gates hat seine Meinung über KI und Jobs geändert: früher „real, but manageable“, jetzt „far fewer jobs“, kein Job bleibt unberührt, auch meiner nicht.
  - (b) Warum ist es echt? Seine eigenen Worte ab 0:25 (Zitatkarte Semafor mit Datum), zwei Essay-Karten im Bild, „he has been saying it for months“ mit vier Datumsstempeln bis 12.11., und bei 0:56 er selbst im O-Ton.
  - (c) Welche Frage ist offen? Was hat er gesehen (einzige Frage, 0:22). Dazu die große Schleife ohne Fragezeichen: Die Liste ist noch nicht geschrieben.
  - (d) Bei 0:45 ein stärkerer Grund zu bleiben als bei 0:30? Ja. Bei 0:30 gibt es eine Frage und zwei harte Wörter. Bei 0:45 ist die unerwartete Wende da (er will die Maschinen nicht stoppen, sondern Arbeit für Menschen freihalten, selbst wo eine Maschine sie könnte), und bis 0:54 hat das Ding einen Namen und ist offen: Steht mein Job darauf?
- **Halt bei 0:30, 0:45, 1:00:** 0:30 das Zitat ist gerade gefallen, die Stille folgt · 0:45 mitten im ersten Gewinn („For people only. Even where a machine could do it.“) · 1:00 Gates ist im Bild und spricht selbst.
- **Risiken von A:**
  - Ein Rückblick-Satz bei 0:04 („Three years ago …“). Er ist das Titelversprechen (vorher/nachher), ein Satz, vor 0:10, ohne Jahreszahl, und steht so im freigegebenen Gerüst.
  - Das Zitat beginnt bei 0:25, also ein paar Sekunden vor der 0:30-Marke (§4: kein Zitat-Wechsel vor 0:30). Es ist kein Wechsel zu einer neuen Person: Gates ist ab Sekunde 0 das Subjekt jedes Satzes.
  - Die Bedingung „without the right policies“ fehlt im Satz bei 0:08 (§4: keine Bedingungen in Minute 1). Sie steht als Fußzeile im Bild und wird bei 1:14 gesprochen; „warns“ trägt sie mit. Nicht zu „there will be far fewer jobs“ verkürzen.
  - „for months“ stimmt für einen Upload ab Mitte November (Aug. bis Nov.).
  - „This is crazy. This is insane.“ steht hier als seine Reaktion auf das, was er sieht. Den Bezug im Semafor-Interview prüfen [CHECK].
  - Die volle Zitat-Zeile („in a state of shock that I'm sort of the first one saying“) wird nicht gesprochen (17 Wörter mitten im teuersten Fenster), sie steht auf der Karte.
  - Die Sekunden 3 bis 22 sind eher Bericht als Szene („he called“, „he warns“, „he says“). Bei einem Personenfilm trägt die Person; der Du-Moment ist 0:16 („he means yours too“), mit dir im Bild.

### B · „Der Alarm“ · 66 Wörter bis zum Ende der Frage (0:27), 144 Wörter (0:59)

> `0:00` Bill Gates changed his mind about artificial intelligence and jobs.  
> `0:04` His words now: "This is crazy. This is insane."  
> `0:07` He means what is coming for work.  
> `0:10` Far fewer jobs than exist today, he warns. And no job left untouched.  
> `0:16` Jobs at a screen. Jobs done by hand. Yours.  
> `0:19` Three years ago, the same man called the risks real, but manageable.  
> `0:24` So what did Bill Gates see?  
> `0:27` Whatever it was, he has put his reputation on it.  
> `0:31` He says he would love to be convinced that he's wrong. But he isn't.  
> `0:37` And what comes back is silence. He says he's deafened by it.  
> `0:42` But his answer is not to stop the machines.  
> `0:45` He wants certain work set aside. For people only. Even where a machine could do it.  
> `0:52` Think of it as a list. He calls it Human Reserved.  
> `0:57` And it hasn't been written yet.  

- **Gegentest:**
  - (a) Worum geht es? Gates hat seine Meinung geändert und nennt das, was auf die Arbeit zukommt, „crazy“ und „insane“.
  - (b) Warum ist es echt? Wörtliches Zitat schon bei 0:04, sein Ruf als Pfand (0:27), Zitatkarten.
  - (c) Welche Frage ist offen? Was hat er gesehen (0:24).
  - (d) Bei 0:45 stärker als bei 0:30? Nur knapp. Zwischen 0:27 und 0:42 stehen drei Zuschreibungen hintereinander (Ruf, „would love to be convinced“, Stille); die Wende kommt erst bei 0:42, der Gewinn bei 0:45.
- **Stärke:** Die marktgeprüfte Zeile („THIS IS INSANE“, Breaking Points 444k) schon in Sekunde 4, höchste Energie in den ersten zehn Sekunden.
- **Risiken:** Zitat vor 0:30 (§4) · Alarm vor dem Warum (Jakob 20.11.: erst das Warum) · der Rückblick steht direkt vor der Frage · Ton näher an Doom als an Staunen (§1.3) · „He means what is coming for work.“ ist eine Deutung des Zitats [CHECK] · verbraucht das Axios-Zitat und „put his reputation on it“, die Station 1 für die Antwort braucht.

### C · „Die Liste zuerst“ · 86 Wörter bis zum Ende der Frage (0:35), 132 Wörter (0:54)

> `0:00` Bill Gates changed his mind about artificial intelligence and jobs.  
> `0:04` Not long ago, he called the risks real, but manageable.  
> `0:08` Now he says no job will be left untouched. Whatever your job is: he means yours too.  
> `0:15` But he is not asking anyone to stop the machines.  
> `0:19` He wants certain work set aside. For people only. Even where a machine could do it.  
> `0:26` Think of it as a list. He calls it Human Reserved.  
> `0:30` So which work goes on that list, and is yours on it?  
> `0:35` He is not calm about this. His own words: "This is crazy. This is insane."  
> `0:41` What comes back is silence. He says he's deafened by it.  
> `0:46` And his list has a ceiling. Even in a very extreme form, he says: forty percent of jobs. No higher.  

- **Gegentest:**
  - (a) Worum geht es? Gates hat seine Meinung geändert und will eine Liste von Arbeit, die Menschen vorbehalten bleibt.
  - (b) Warum ist es echt? Der Name „Human Reserved“, das wörtliche Zitat bei 0:35, seine eigene Obergrenze von 40 %.
  - (c) Welche Frage ist offen? Welche Arbeit kommt auf die Liste, und ist meine dabei (0:30–0:35).
  - (d) Bei 0:45 stärker als bei 0:30? Ja: Die Obergrenze („forty percent … No higher“) macht die Frage schärfer, denn die meisten Jobs stünden nicht darauf.
- **Stärke:** die persönlichste Frage, und genau die, die laut Marktcheck noch niemand beantwortet.
- **Risiken:** Die Hauptfrage weicht vom freigegebenen Gerüst ab (dort: „Was hat er gesehen?“). Der Film beantwortet dann sechs Minuten lang eine andere Frage, bevor die Liste zurückkommt · die 40 % sind verbraucht (der Rate-Moment bei 7:28 entfällt) · „Not long ago“ ist vager als „Three years ago“ · Frage erst bei 0:35 (obere Grenze) · eine Zahl in Minute 1 · die Liste wird erklärt, bevor der Zuschauer weiß, warum Gates Alarm schlägt.

### Empfehlung: A

A löst den Titel in den ersten zwölf Sekunden als Vorher/Nachher ein, stellt genau eine Frage (0:22), setzt die marktgeprüfte Zeile als harten Schlag direkt danach, bringt die Wende bei 0:36 und den ersten Gewinn (die ungeschriebene Liste) bis 0:54. A folgt dem Hook des freigegebenen Gerüsts (Titelworte, Warum, Frage, Zitat als Wende, Liste als erster Gewinn), die Frage wird bei 1:32 hörbar beantwortet, und der Ton bleibt ruhig (Staunen und Hoffnung statt Alarm). B ist die Testvariante, falls die ersten zehn Sekunden mehr Druck brauchen; C nur mit umgebautem Gerüst.

**Warum A geklickt und gehalten wird (§2.5e):** Wer auf „Changed His Mind“ klickt, will zuerst wissen, von was zu was (das Muster von The Atlantic und OFFSWITCH). A liefert das in zwei Sätzen, macht es in Sekunde 16 persönlich („yours too“) und bezahlt bei 0:25 mit der Zeile, die schon einmal 444k getragen hat.

---

## Skript (mit Hook A)

Format je Zeile: **Zeit VO** gesprochener Text · `PICTURE:` was die Animation in diesem Moment zeigt (englisch, für den Bau; ein klares Bild pro Satz, „du“ im Mittelpunkt) · Zeilen mit „·“ sind Notizen für Kritik und Faktencheck. Marken in eckigen Klammern: `[CLIP …]`, `[pause]`, `[SUBSCRIBE CALL …]`, `[END SCREEN …]`. Quelle, Zahl und Datum gehören ins Bild, nicht in den Satz (§1.2).

### 0 · Hook: Er hat seine Meinung geändert (0:00–0:54 · 131 Wörter)

*Beantwortet:* Gates hat seine Meinung über KI und Jobs geändert: früher „real, but manageable“, jetzt „far fewer jobs“, kein Job bleibt unberührt, auch deiner. Er nennt es „crazy“ und „insane“ und hört nur Stille. Erster Gewinn: Er will die Maschinen nicht stoppen, sondern Arbeit für Menschen reservieren. Eine Liste („Human Reserved“), die noch nicht geschrieben ist.  
*Öffnet:* Hauptfrage: Was hat er gesehen? Große Schleife (ohne Fragezeichen): Was kommt auf die Liste, und wer schreibt sie?

**0:00 VO** Bill Gates changed his mind about artificial intelligence and jobs.  
PICTURE: Frame 0 = the approved thumbnail motif, with the big text HE CHANGED HIS MIND. No black frame, no title card, music at full level, burned-in subtitles from the first word. (Until the thumbnail is final: a huge arrow of light bending into a U-turn above a wall of lit windows; you, tiny, in the yellow raincoat, below it.)  
· Titelworte zuerst (§4, 0–3 s). Bildtext = These in 4 Wörtern.

**0:04 VO** Three years ago, he called the risks real, but manageable.  
PICTURE: The wall of small lit windows, each window one job, glowing calmly. You stand small in front of it. Card: “The risks of AI are real but manageable” · Bill Gates, essay. Keep the year tiny (minute 1).  
· Titel des Essays wörtlich, Juli 2023 (Faktenzettel St. 1, sicher). Einziger Rückblick-Satz in Minute 1; er ist das Titelversprechen (vorher/nachher) und steht so im Gerüst.

**0:08 VO** Now he warns of far fewer jobs than exist today.  
PICTURE: The same wall: window after window goes dark. Big text: FAR FEWER JOBS. Small footnote: “… without the right policies” · essay, Aug 26, 2026.  
· „… without the right policies there will be far fewer than exist today.“ (Essay 26.8.2026, sicher). Die Bedingung steht hier nur als Fußzeile im Bild (§4: keine Bedingungen in Minute 1) und wird bei 1:14 gesprochen; „warns“ trägt sie mit.

**0:12 VO** And he says no job will be left untouched.  
PICTURE: A ripple of cold light runs across every window that is still lit. Not one is skipped.  
· Sinngemäß; Wortlaut „There isn't a job that isn't affected.“ ist dünn [CHECK].

**0:16 VO** Jobs at a screen. Jobs done by hand. Whatever your job is: he means yours too.  
PICTURE: Three windows up close, one per sentence: a silhouette at a screen · a silhouette working with their hands · then you, in the yellow raincoat, in your own window. The ripple reaches it.  
· Das Warum mit sichtbarem Einsatz (Jakob 20.11.: erst das Warum, dann die Frage). „screen“ und „by hand“ sind die Saat für Stopp 1 und Stopp 2.

**0:22 VO** So what did Bill Gates see?  
PICTURE: You step back from the wall and look up. One question in huge letters of light: WHAT DID HE SEE?  
· HAUPTFRAGE, einziges Fragezeichen in Minute 1. Hörbar beantwortet bei 1:32.

**0:25 VO** His own words: "This is crazy. This is insane."  
PICTURE: Full-screen quote card; the two sentences slam in one after the other: “This is crazy. This is insane.” · Bill Gates to Semafor, Aug 25, 2026. Small, above them, the rest of his sentence: “I am in a state of shock that I'm sort of the first one saying …”.  
· Print-Interview, darum Zitatkarte statt Clip (clips.json). Kein Sprecherwechsel: Gates ist ab Sekunde 0 die Person des Films. Die marktgeprüfte Zeile („THIS IS INSANE“, Gerüst Abschnitt 0). Bezug von „this“ am Original prüfen [CHECK].

**0:28 VO** What comes back is silence. He says he's deafened by it.  
PICTURE: One small lit figure speaking in a vast dark hall of unlit silhouettes. His words travel out as a wave of light and come back as a flat line. Card: “… I'm just deafened by the silence.”  
· Saat für den Schluss (9:49).

**0:33 VO** And he has been saying it for months.  
PICTURE: Date stamps tick along the flat line: AUG 25 · OCT 22 · NOV 4 · NOV 12, 2026 (Semafor · Decoder · FT Live · CBS Evening News).  
· Neuester Anlass gegen die Abnutzung des Themas (Gerüst Abschnitt 0, Punkt 4). Die Daten stehen im Bild, nicht im Satz (§1.2).

**0:36 VO** But his answer is not to stop the machines.  
PICTURE: A giant OFF switch in the dark. The light moves past it; the switch stays untouched.  
· Harte Wendung (§4, 30–50 s).

**0:40 VO** He wants certain work set aside. For people only. Even where a machine could do it.  
PICTURE: Back at the wall: a line of gold light is drawn around one block of windows. Inside the line, people stay at work; the cold machine light waits outside it.  
· „as AI and robots improve, we'll set aside certain things for only people to do.“ (Essay, sicher). Erstes echtes Ergebnis vor 0:45 (Datenregel 16.11.).

**0:47 VO** Think of it as a list. He calls it Human Reserved.  
PICTURE: The block folds flat into a tall sheet of light: a list. Its heading writes itself: HUMAN RESERVED.  
· „Liste“ ist das Bild des Films für „this domain“ (sein Wort), darum „Think of it as“. Funktioniert auch ohne Bild.

**0:51 VO** And it hasn't been written yet.  
PICTURE: Every line under the heading is empty. You stand small in front of the huge list.  
· Erster Gewinn + große Schleife. Kein Musik-Break, keine Pause, direkt weiter (§4). Ernte: 8:28 („Not one line of it is written“) und Schluss (9:37, Kernsatz).

### 1 · Was hat sich geändert? (0:54–2:01 · 144 Wörter)

*Beantwortet:* Antwort auf die Hauptfrage: kein neues Gerät, sondern ein neues Bild von der Maschine. Vor drei Jahren: Technik kostet Jobs und schafft neue. Jetzt: Diese Technik übertrifft menschliche Intelligenz, also kann sie den Menschen in die neue Arbeit folgen. Er setzt seinen Ruf darauf.  
*Öffnet:* Wo fängt es an? (Die Uhr wird gestellt: drei Stopps.)

**0:54 VO** This is him, late this summer.  
PICTURE: The camera moves into a screen frame. Lower third: BILL GATES · AUG 2026 · ORIGINAL FOOTAGE.  
· Einordnungssatz C1: ein Satz, ohne Kanal-Detail.

[CLIP C1 Bill Gates, eigener Kanal · Einordnung: "This is him, late this summer."]  
· 0:56–1:04 · ~8 s (geschätzt) · „The turbulent era of artificial intelligence is here“ · Kanal Bill Gates · 27.8.2026 · MLeTQWQiOvg · 1:52  
> WORTLAUT OFFEN [CHECK]. Gebraucht wird ein vollständiger Satz, in dem er selbst sagt, dass diese Technik die Arbeit grundlegend verändert und dass die Entscheidungen von jetzt den Ausgang bestimmen.

· Zeitmarke offen [CHECK]. NICHT die Stelle aus #25 (dort K3, „turbulent era“; Faktenzettel 0.8). Ein Clip in der ersten Minute ist erlaubt, wenn er das Titelversprechen belegt (clip-schritt.md): Die Stelle muss das tragen. Trägt sie nicht: A2 (FT Live, 4.11.2026) als neuester Anlass, dann heißt der Einordnungssatz „This is him, this November.“ Die Sprecherzeile danach hängt nicht am Wortlaut.

**1:04 VO** Three years ago, his reasoning was familiar. New technology had always cost jobs, and created new ones. On balance, he was an optimist.  
PICTURE: A simple loop of light, with you watching: a machine takes one window, and a new window lights up beside it. Again. And again. On the last sentence the wall ends up brighter than before. Card: GatesNotes, July 2023.  
· Essay 2023 (sicher): frühere Technik kostete Jobs und schuf neue; insgesamt mehr Gründe zum Optimismus. Kein „for forty years“ (Faktenzettel 0.1).

**1:14 VO** His new essay says: there will be some new jobs. But without the right policies, far fewer than exist today.  
PICTURE: The loop stutters: a few new windows light up, far more stay dark. Quote card: “There will be some new jobs, but without the right policies there will be far fewer than exist today.” · Bill Gates, Aug 26, 2026. The words WITHOUT THE RIGHT POLICIES glow for a moment.  
· Sicher. Saat für 5:49 („Remember his sentence: without the right policies“).

**1:22 VO** What changed is his picture of the machine. This technology, he now says, is different from every technology before it. Because it exceeds human intelligence.  
PICTURE: The loop freezes. A row of earlier machines appears, each one shorter than the human silhouette beside it. Then the newest one grows taller than the person. Source line: CBS Evening News, Nov 12, 2026.  
· Belegt über die Videotitel CBS 12.11. („AI is different than past technologies because it exceeds human intelligence“) und CNN 27.8. („AI is not like past tech“); seinen Wortlaut am Video prüfen [CHECK]. Kein „Tempo“ (Zitat gestrichen), kein „blue-collar“ (dünn).

**1:32 VO** Earlier machines took over tasks, and people moved on to work the machines couldn't do. That is what Bill Gates saw: this time, the machine can follow them.  
PICTURE: You step from a window the machine has taken to the next free one. This time the machine's light follows you, and takes that one too. Text: THIS TIME, THE MACHINE CAN FOLLOW.  
· Hörbare Antwort auf die Hauptfrage (Lehre aus #66: Die Hook-Frage muss hörbar beantwortet werden). Der Gedankengang ist die Erklärung des Films aus seinen zwei Aussagen (übertrifft menschliche Intelligenz; weit weniger Jobs), kein Gates-Zitat: am Essay prüfen, ob er so argumentiert [CHECK]. Bricht das Missverständnis „es entstehen immer neue Jobs“ (§11).

**1:44 VO** He says he would love to be convinced that he's wrong about the job market. But he isn't. He has put his reputation on it.  
PICTURE: Quote card: “I'd love to be convinced that I'm wrong about the job market, but I'm not.” · Bill Gates · Axios, Aug 26, 2026. On the last sentence, a name plate BILL GATES slides under the words FAR FEWER JOBS and locks in place.  
· Axios + Decrypt (sicher), dazu der CNN-Titel „stakes reputation“. In der dritten Person gesprochen, damit kein Ich-Satz entsteht.

**1:54 VO** So where does it begin? His warning comes with a timeline. Three stops. The first is now.  
PICTURE: CLOCK ON: a line of light with three stops draws itself and then stays in the corner of the frame: NOW · 2–8 YEARS · 20 YEARS. You stand at the first stop.  
· Die Uhr des Films (§3.2): drei Stopps. Titel ist bis hier eingelöst (0:56 O-Ton, 1:04–1:22 vorher/nachher, 1:32 das Warum).

### 2 · Stopp 1 „jetzt“: Arbeit am Bildschirm (2:01–3:00 · 141 Wörter)

*Beantwortet:* Zuerst trifft es Arbeit am Bildschirm (er nennt Telefon-Support, Telemarketing, Buchhaltung). Für eine Gruppe ist das schon messbar: Berufseinsteiger, rund 19 % Rückstand. Aber: Wo die Technik neben Menschen arbeitet, hält die Beschäftigung.  
*Öffnet:* Und wer mit den Händen arbeitet, ist sicher?

**2:01 VO** For Gates, the first work to go is work at a screen. He names it: phone support. Telemarketing. Accounting. These systems, he says, do that work cheaper, faster and more accurately.  
PICTURE: Stop NOW grows large. Three screen-lit windows appear, one per word: a headset, a call list, a ledger. Labels: PHONE SUPPORT · TELEMARKETING · ACCOUNTING. On the last sentence the screens speed up while the chairs in front of them empty: CHEAPER · FASTER · MORE ACCURATE. Source: Decoder, Oct 22, 2026.  
· Decoder-Berichte (sicher, sinngemäß). Genaue Begriffe am Original prüfen (accounting oder bookkeeping) [CHECK]. Keine Rangliste (das war #25).

**2:14 VO** And for one group, this stop is no forecast. It shows up in payroll data.  
PICTURE: On the timeline, the marker does not sit ahead of you. It sits exactly on TODAY. A column of payslips of light scrolls past.  
· „for one group“: bewusst eingegrenzt, weil der Gesamtmarkt bei 4:18 das Gegenteil zeigt. Die Quelle steht im Bild, nicht im Satz (§1.2).

**2:20 VO** People in their early twenties, looking for a first job. In the jobs most exposed to artificial intelligence, their employment now trails less exposed jobs by about nineteen percent. A year earlier, the gap was smaller.  
PICTURE: First the face, then the number: a young silhouette holding an application in front of a row of entry-level windows; fewer of them are lit than before. Then two lines of light, the lower one 19% below. Text: −19% · AGES 22–25 · MOST AI-EXPOSED JOBS · Stanford Digital Economy Lab, Aug 2026 · payroll data. A fainter line behind it: 2025: −13%.  
· Erst das Gesicht, dann die Zahl (§11). Einzige Zahl der Station; 13 % und das Alter stehen nur im Bild. Stanford-Update Aug. 2026 (sicher); „trails less exposed jobs“ steht für „unter dem Vergleichswert“, Definition am Original prüfen [CHECK]. ACHTUNG Überschneidung: #25 hatte dieselbe Zahl schon im Hook („almost a fifth behind“, Update Aug. 2026; siehe #25 `faktencheck.md` Nr. 3). Faktenzettel 0.3 nennt sie „neu“. Darum hier nur ein kurzer Rückgriff; neu gegenüber #25 sind der Zuwachs („A year earlier, the gap was smaller“) und der Befund bei 2:41.

**2:35 VO** If that's you, this stop isn't ahead of you. You're standing in it.  
PICTURE: You, in the yellow raincoat, on the first stop of the timeline. The stop glows under your feet.  
· Landung beim Zuschauer.

**2:41 VO** But the same data shows something else. Where the technology works alongside people, instead of in their place, employment holds steady, or grows. Same technology. Used differently.  
PICTURE: Two windows side by side. Left: a machine alone at the desk, the chair empty, the window cold. Right: a person and a machine working together, the window warm, a second one lighting up next to it. The same glowing machine shape sits in both windows. Text: ALONGSIDE PEOPLE: STABLE OR GROWING.  
· Hoffnung im selben Akt (§1.3), aus derselben Studie (sicher). Saat für den Leitgedanken: Es hängt an einer Entscheidung, hier der Firmen.

**2:52 VO** So the first stop is the screen. Which sounds like good news for anyone who works with their hands.  
PICTURE: Timeline: stop 1 gets its label SCREEN WORK. At the second stop, a silhouette with a tool belt leans back, relaxed.  
· Wendung statt Zusammenfassung (§11); öffnet die nächste Frage.

### 3 · Stopp 2 „in 2 bis 8 Jahren“: Arbeit mit den Händen (3:00–3:58 · 120 Wörter)

*Beantwortet:* Nein: In zwei bis acht Jahren erwartet er humanoide Roboter auf Baustellen und Feldern. Aber sein Satz beginnt mit „If we don't choose“: Es ist eine Entscheidung, kein Wetter.  
*Öffnet:* Hat er überhaupt recht? (Der dritte Stopp bleibt offen.)

**3:00 VO** That's the usual comfort. A machine can answer a phone. It can't lay bricks, or bring in a harvest.  
PICTURE: You stand between a phone on one side and, on the other, a half-built wall of bricks and a field. The machine's light reaches only the phone.  
· Das zweite Missverständnis („Handarbeit ist sicher“), ausgesprochen, bevor es gebrochen wird (§11).

**3:08 VO** Gates gives that comfort two to eight years. That's the second stop: his window for humanoid robots on building sites and farms.  
PICTURE: Timeline: the second stop lights up, 2–8 YEARS. A building site and a field with plain human silhouettes at work; far in the background, one small humanoid outline. The people stay the main thing in the frame.  
· Decoder-Berichte (sicher, sinngemäß). Roboter nur klein im Hintergrund (§1.5). „Chirurgie“ wird nicht gesprochen (§2.5c).

**3:17 VO** This fall, on a podcast, he said where that leads.  
PICTURE: Move into the screen frame. Lower third: BILL GATES · DECODER · OCT 2026 · ORIGINAL FOOTAGE.  
· Einordnungssatz C2.

[CLIP C2 Bill Gates, Decoder · Einordnung: "This fall, on a podcast, he said where that leads."]  
· 3:21–3:29 · ~8 s (geschätzt) · „Bill Gates says to prepare for 20 years of tumultuous AI disruption“ · Decoder with Nilay Patel · 22.10.2026 · A0kTUP7fWtk  
> “If we don't choose to massively slow down or stop, then we will have robots that can build houses, grow food, do surgery.”

· Wortlaut laut Berichten (sicher), Zeitmarke offen [CHECK]. „surgery“ bleibt nur im O-Ton, keine Medizin-Szene daraus (§2.5c).

**3:29 VO** Houses. Food. Work done with hands. But go back to how his sentence begins: if we don't choose.  
PICTURE: His sentence as text across the frame. Everything dims except the first words: IF WE DON'T CHOOSE.  
· Greift den Clip auf, damit die Stelle auch ohne genauen Wortlaut hält.

**3:36 [pause]** 1 s

**3:37 VO** He isn't describing the weather. He's describing a decision. Machines like these are built, bought and switched on by people. Gates isn't calling for a stop. But he says it out loud: there is a choice.  
PICTURE: What looked like a dark weather front turns out to be a control panel. Three human silhouettes stand at three levers: BUILD · BUY · SWITCH ON. You stand in front of the panel, looking up at them. The OFF switch from the opening is still there, untouched; above the levers one word lights up: CHOICE.  
· Wer die Macht hat (§11): Hersteller, Käufer, Betreiber. Er selbst fordert keinen Stopp (Faktenzettel Hook). Staunen-Moment des Akts: Die Wahl steht in seinem eigenen Satz.

**3:52 VO** Before the last stop on his timeline, though, a fair question. Is he even right?  
PICTURE: Timeline: the third stop stays dark. A magnifying lens of light moves over his claim. Text: IS HE RIGHT?  
· Öffnet die Gegenprobe; der dritte Stopp bleibt als Schleife offen.

### 4 · Gegenprobe (§1.9a) (3:58–5:08 · 168 Wörter)

*Beantwortet:* Wer spricht: Mitgründer von Microsoft, warnt vor der Technik, an der seine alte Firma verdient (Gegenlesart: strenge Regeln nützen den Großen). Die Daten: Im ganzen US-Arbeitsmarkt findet Yale (Stand Frühjahr) keinen KI-Effekt; Gates selbst nennt es eine Prognose. Urteil: Richtung plausibel, am Berufseinstieg messbar, Tempo und Ausmaß offen.  
*Öffnet:* Nach dem Abo-Aufruf: Was ist der letzte Stopp, der ihm am meisten Sorgen macht?

**3:58 VO** Start with who's talking. Bill Gates co-founded Microsoft, the biggest partner of the company behind ChatGPT. So he is warning about a technology his old company profits from. That makes the warning harder to wave away. Though a skeptic would add: strict rules often suit the biggest players.  
PICTURE: Gates as a plain silhouette, no caricature. Behind him a large building made of windows; a thin line of light links the building to the machines. Lower line: CO-FOUNDER, MICROSOFT. On the last sentence, the biggest building casts its shadow over the small ones beside it.  
· Wer sagt es, mit welchem Interesse, was spricht dagegen (§1.9a; Faktenzettel St. 4). „OpenAI“ wird nicht gesprochen (die Stimme und „AI“). Stand am Upload-Tag prüfen [CHECK].

**4:18 VO** Then the numbers. That gap concerns the youngest workers, in the most exposed jobs. Across the whole American job market, researchers at Yale see something else. As of this spring, their verdict: artificial intelligence is probably not, or not yet, the reason the job market is weakening.  
PICTURE: Two charts of light, you standing between them. Small chart: the −19% gap from before, one age group. Large chart: the whole job market, an almost flat line. Text: “AI Is Probably Not (Yet) the Reason for Labor Market Weakening” · Yale Budget Lab, spring 2026.  
· Yale Budget Lab / Brookings (sicher), ausdrücklich „as of this spring“; neuere Zahl nicht gefunden [CHECK].

**4:38 VO** Their director adds a caution: some companies blame layoffs on the technology when the real reasons lie elsewhere.  
PICTURE: A layoff notice stamped “AI”. The stamp lifts; other reasons show underneath. Source: Martha Gimbel, Yale Budget Lab · Fortune, Feb 2026.  
· Sicher (Fortune, Feb. 2026). Mechanismus statt Bösewicht: kein Firmenname.

**4:45 VO** And Gates doesn't claim otherwise. By his own account, his warning is a forecast. Not a finding in today's numbers.  
PICTURE: Two labels side by side: FORECAST (lit) · FINDING (unlit).  
· Dünn (Semafor, nur sinngemäß) [CHECK]. Sicherheit hörbar kalibriert (§11).

**4:53 VO** So here is what the evidence supports. The direction: plausible. At the start of careers: already measurable. The speed and the size: open. A forecast from a well-informed man. Not a date in your calendar.  
PICTURE: Three stamps land one after another: DIRECTION: PLAUSIBLE · ENTRY LEVEL: MEASURABLE · SPEED AND SIZE: OPEN. Then your wall calendar: no day is circled.  
· Klares Urteil ohne Ich (§1.6, §6.4), wie im Faktenzettel. Auflösung, danach direkt der Abo-Aufruf (§3.8).

### Abo-Aufruf 1 (5:08–5:19 · 28 Wörter)

**5:08 [SUBSCRIBE CALL 1 · MID]**

**5:08 VO** This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. Wherever your job sits on that timeline. Want that too? Then subscribe.  
PICTURE: You on the timeline, among many plain silhouettes standing at different stops, in warm light. Subscribe element. No QR overlay.  
· Mitte, direkt nach der Auflösung, mit Mission und als Frage (§3.8).

### 5 · Stopp 3 „20 Jahre“ + sein Plan, Teil 1 (Steuer) (5:19–6:51 · 204 Wörter)

*Beantwortet:* Der letzte Stopp ist eine Strecke: 20 Jahre Übergang mit Gewinnern und Verlierern. Sein erster Hebel: Heute belohnt das Steuersystem das Ersetzen; wer Menschen ersetzt, soll zahlen (Geld für Umschulung und Absicherung). Einwand Etzioni: wie eine Steuer auf Tastenanschläge.  
*Öffnet:* Geld ersetzt den Lohn. Was ersetzt das Gebrauchtwerden?

**5:19 VO** That leaves the last stop on his timeline. The one that worries him most. It isn't a date. It's a stretch of time. On that same podcast, he said how long.  
PICTURE: The third stop begins to glow, then stretches from a point into a long band of light. Then the screen frame. Lower third: BILL GATES · DECODER · OCT 2026 · ORIGINAL FOOTAGE.  
· Schließt die Schleife von 3:52. Einordnungssatz C3 mit kleinem Rate-Moment („how long“, §4).

[CLIP C3 Bill Gates, Decoder · Einordnung: "On that same podcast, he said how long."]  
· 5:32–5:39 · ~7 s (geschätzt) · wie C2 · Decoder with Nilay Patel · 22.10.2026 · A0kTUP7fWtk  
> “My big concern is this 20-year transition period where they'll have winners and losers and a lot of disruption.”

· Wortlaut laut Berichten (sicher), Zeitmarke offen [CHECK]. Zweiter Clip aus demselben Video: zusammen 15 s (Grenze 2 Clips / 20 s).

**5:39 VO** Twenty years of winners and losers. If you're in the middle of your working life, that's not a transition. That's the rest of it.  
PICTURE: The band, labelled 20 YEARS, is laid over a working life: you walk along it, and it covers the whole rest of your path. Above you, some windows brighten while others go dark.  
· Maßstabswechsel mit Landung beim Zuschauer (§11).

**5:49 VO** Remember his sentence: without the right policies. So which policies? His first is about money.  
PICTURE: The essay card returns; WITHOUT THE RIGHT POLICIES glows again. On the last sentence, a single coin of light drops out of the card.  
· Ernte von 1:14. Hier wird die Gerüst-Frage gestellt: Was ist sein Plan?

**5:55 VO** Today, he argues, the tax system pushes the wrong way. Hire a person, and the company pays taxes on the wage. Replace that person with software, and those taxes disappear.  
PICTURE: A scale of light. Left pan: a person, with a small weight marked TAX hanging on the wage. Right pan: software, no weight. The scale tips toward the software.  
· Mechanismus statt Bösewicht (§11). Sinngemäß; sein Wortlaut „nudges“ ist dünn.

**6:08 VO** His fix: tax the machine's work. A company that replaces people with software or robots pays. The money goes into retraining and a safety net.  
PICTURE: The same weight is hung on the software pan; the scale levels out. From it, light flows to two places: RETRAINING · SAFETY NET.  
· Als Umkehr eines Anreizes erzählt, nicht als Wegnehmen (§1.7). Nur ein Absatz (Faktenzettel 0.5). Genaue Ausgestaltung (worauf die Steuer erhoben wird) am Essay prüfen [CHECK].

**6:18 VO** The artificial intelligence researcher Oren Etzioni says Gates has the diagnosis right, but the prescription wrong, at least in some places. Taxing tokens, the small units these systems work in, is like taxing keystrokes on a typewriter, he says. It counts how hard the machine works. Not whether anyone lost a job.  
PICTURE: Quote card: “I think he has the diagnosis right, but the prescription wrong, at least in some places.” · Oren Etzioni, AI researcher · ABC News, Aug 2026. Then a typewriter: a counter ticks up with every keystroke. Beside it, an empty chair that the counter never sees.  
· Beide Zitate sicher (ABC News, Aug. 2026). Der eine ehrliche Zweifel dieses Akts. „diagnosis“ ist sein Bildwort, kein Medizin-Beispiel (§2.5c). Rolle fürs Bild prüfen (Faktenzettel: Gründer des Allen Institute for AI) [CHECK]. Die Erklärung von „tokens“ ist Allgemeinwissen.

**6:40 VO** And even a perfect tax leaves a gap. Money can replace a paycheck. It can't replace being needed.  
PICTURE: A payslip of light lands on a table. The chair next to it stays empty. You stand beside it, coat on, with nowhere to be.  
· Wert: Würde (§11). Öffnet die Frage für die große Antwort.

**6:47 VO** That's where his second idea comes in. The list.  
PICTURE: The tall sheet of light from the opening returns: HUMAN RESERVED.  
· Ernte aus dem Hook (0:47).

### 6 · Die große Antwort: Human Reserved (6:51–9:16 · 331 Wörter)

*Beantwortet:* Arbeit, die wir per Regel Menschen vorbehalten, auch wenn Maschinen sie könnten. Obergrenze nach seinen Worten: 40 %, also stünden die meisten Jobs nicht darauf. Offen, sagt er selbst: wer entscheidet, nach welchen Kriterien, wie man es durchsetzt. Große Antwort (letztes Fünftel): Bisher war menschliche Arbeit das, was übrig blieb; hier würde sie im Voraus gewählt.  
*Öffnet:* Was würdest du auf die Liste setzen, und warum? Wer schreibt sie?

**6:51 VO** Human Reserved. In his essay, Gates puts it like this: as artificial intelligence and robots improve, we'll set aside certain things for only people to do.  
PICTURE: The list fills the frame, you in front of it. Quote card: “… as AI and robots improve, we'll set aside certain things for only people to do. I've started calling this domain Human Reserved.” · Bill Gates, Aug 26, 2026.  
· Sicher. Gesprochen „artificial intelligence“, auf der Karte sein Wortlaut „AI“.

**7:02 VO** The candidates named so far: looking after children. Sitting on a jury. Making art. And in teaching, a mix: a person stays in charge, and uses the machine as a tool.  
PICTURE: Four faint lines appear on the list, one per sentence, as outlines only: CHILD CARE · JURY · ART · TEACHING (a person in charge). Behind each, a small warm scene with plain human silhouettes.  
· Beispiele aus Berichten (Faktenzettel St. 6). Keine Medizin, keine psychische Betreuung (§2.5c). Menschen bleiben dort bewusst (§1.9).

**7:14 VO** Take the jury. Imagine the verdict is about you. A machine might weigh the evidence faster. Would you still want people to decide?  
PICTURE: A courtroom in flat shapes. You stand alone at the front. On one side a single cold machine light, on the other a row of warm human silhouettes, waiting.  
· Nähe statt Ferne (§11); bewusst nicht das Schach- und nicht das Krankenbett-Bild aus #25 (Faktenzettel 0.7).

**7:24 VO** Human Reserved would turn an answer like that into a rule.  
PICTURE: A line of gold light is drawn around the row of human silhouettes. It holds.  
· Neu gegenüber #25: nicht deine Vorliebe, sondern eine gemeinsame Regel (Faktenzettel 0.7).

**7:28 VO** How long could such a list get? Take a guess.  
PICTURE: The list stretches and shrinks like a ruler: 10%? 50%? 90%?  
· Rate-Moment vor der Zahl (§4).

**7:33 VO** His own ceiling: in a very extreme form, forty percent of jobs could be reserved for humans, at first. And that, he says, is as high as he can get.  
PICTURE: The wall of windows, one hundred of them. The gold line settles around 40. Quote card: “In a very extreme form of it … 40% of jobs could initially be reserved for humans. But that's as high as I can get.” · Bill Gates · Axios, Aug 26, 2026.  
· Axios (sicher). In der dritten Person gesprochen.

**7:45 VO** So even at its most generous, most jobs would not be on it.  
PICTURE: The 60 windows outside the line. You walk along the wall, looking for your own window: inside the line, or outside?  
· Folgerung des Films aus „as high as I can get“ (höchstens 40 %, also mindestens 60 % nicht) [CHECK]. Staunen-Moment: Selbst die großzügigste Liste lässt die Mehrheit draußen.

**7:50 VO** Which ones would? This October, on television, Gates named the task.  
PICTURE: Move into the screen frame (or to a quote card, see the clip note). Lower third: BILL GATES · OCT 2026.  
· Einordnungssatz C4.

[CLIP C4 Bill Gates, CNN · Einordnung: "This October, on television, Gates named the task."]  
· 7:55–8:03 · ~8 s (geschätzt) · „Bill Gates says we must decide which jobs to reserve for humans“ · CNN · 11.10.2026 · cHRCt8YCYPM · 1:19  
> WORTLAUT OFFEN [CHECK]. Belegt ist nur der Videotitel. Gebraucht wird der vollständige Satz, in dem er sagt, dass wir entscheiden müssen, welche Jobs Menschen vorbehalten bleiben.

· Zeitmarke offen [CHECK]. CNN ist laut clip-schritt.md eine rote Quelle (große TV-Sender nur als Zitatkarte) [CHECK]. Vorschlag: als Zitatkarte bauen oder durch A1 (Ezra Klein, 30.9.) oder A2 (FT Live, 4.11.) ersetzen; dann heißt die Einordnung „Which ones would? This fall, Gates named the task.“ Auch mit Zitatkarte bleiben drei echte Clips (C1–C3, Regel: 3–6).

**8:03 VO** Decide which jobs. And by his own account, the hardest parts of that are open. Who decides what belongs on the list. By which criteria. And how to stop companies from replacing people anyway.  
PICTURE: The words DECIDE WHICH JOBS stay on screen from the clip and move to the top of the list. Under them, three empty fields appear, one per sentence: WHO DECIDES? · BY WHICH CRITERIA? · HOW IS IT ENFORCED?  
· „Decide which jobs“ greift den Clip auf; bei anderem Wortlaut anpassen. Faktenzettel St. 6: „Offen, sagt er selbst“ (sicher).

**8:17 VO** Critics add: a line like this is hard to draw, and easy to lobby. And reserved doesn't mean well paid. Care work and teaching often aren't.  
PICTURE: The gold line wobbles as shapes push against it from both sides. Inside the line, a warm window with a very small coin.  
· Der eine ehrliche Zweifel dieses Akts (§3.5, §6.4). Dünn, darum nur sinngemäß und kurz [CHECK].

**8:28 VO** So the list is still an idea. A few candidates. Not one line of it is written.  
PICTURE: The list again: the four candidates are still only outlines. Nothing is filled in.  
· Ernte aus dem Hook („it hasn't been written yet“, 0:51).

**8:35 VO** And still: look at what this idea does to the question. Until now, which jobs stay human was rarely a decision. It was a price. If a machine could do the work for less, the work went to the machine. A human job was whatever was left over.  
PICTURE: The wall of windows again, you in front of it. The machine's light takes window after window, wherever it is cheaper. The few still lit are simply the ones it has not reached yet. Text: WHATEVER WAS LEFT OVER.  
· Nach dem Zweifel das Urteil (§6.4). Deutung des Films (Gerüst St. 6: nicht der Markt entscheidet, sondern wir), kein Gates-Zitat. „rarely“, weil es Ausnahmen gibt (die Jury ist schon heute per Gesetz menschlich). „the question“ bereitet den Kernsatz vor.

**8:55 VO** Human Reserved turns that around. Human work would no longer be what's left over. It would be chosen. In advance. And a rule holds, whatever the price.  
PICTURE: The same wall, in reverse: before the light arrives, a gold line is drawn around a block of windows. Beside it, a cost curve of light keeps falling; the windows inside the line stay lit. Text: CHOSEN. IN ADVANCE.  
· GROSSE ANTWORT und Staunen-Moment des letzten Fünftels. Das „zum ersten Mal“ aus dem Gerüst wird nicht behauptet (nicht im Faktenzettel; siehe Abweichungen).

**9:06 VO** Try a line yourself. Which work would you put on it? And, harder: what is your reason? Because the reason is exactly what's missing.  
PICTURE: You step up to the list. One line lights up and waits for you. Text: WHAT WOULD YOU PUT ON IT? AND WHY?  
· Wende zum Zuschauer (Gerüst St. 6), bewusst nicht als letzter Satz und ohne „tell me in the comments“ (§3.8). Dein Grund = die fehlenden Kriterien.

### 7 · Ende (9:16–10:03 · 111 Wörter)

*Beantwortet:* Am Ende der zwanzig Jahre sieht Gates Überfluss und eine Aufgabe, die bei den Menschen bleibt (sich organisieren, Sinn finden). Sie beginnt mit der Liste, und die schreibt, wer sich zu Wort meldet.  
*Öffnet:* —

**9:16 VO** Now look past those twenty years. At the far end, Gates sees abundance: cheaper homes, cheaper food, because most goods and services would no longer depend on human labor.  
PICTURE: The far end of the 20-year band: warm light, small houses and fields glowing. One short line of text: CHEAPER HOMES · CHEAPER FOOD.  
· Hörbare Zeit-Brücke (§3.6). Überfluss in einem Satz, nicht #66 wiederholen (Faktenzettel 0.4). Decoder-Berichte (sicher, sinngemäß).

**9:28 VO** And one task that stays with people. Humanity, he says, will have to find a way to organize, and to have purpose.  
PICTURE: Many plain silhouettes gather in the warm light, you among them. They face each other, not a machine.  
· Dünn (nur Schlagzeile MSN/Fortune), darum indirekte Rede; Zitatkarte erst nach Prüfung am Original [CHECK]. Sinn nur als offene Aufgabe, nicht als Lehre (§1.8).

**9:37 VO** That task starts with the list. And an unwritten list doesn't stay unwritten. It gets written by whoever speaks up. Companies. Lawmakers. Or the people whose work is on it.  
PICTURE: The list stands in a wide room. Shapes move toward it from three sides, one per word: company towers, a parliament building, then ordinary people, you among them.  
· Wer die Macht hat (§11). Urteil des Films, kein Zitat.

**9:49 VO** And remember what Gates says he hears: silence.  
PICTURE: The dark hall from the opening: one lit figure, speaking alone. Then a second light goes on. A third. One of them wears yellow.  
· Ernte des Hook-Zitats (0:28). Das Bild dreht die Stille in Hoffnung: Es werden mehr Stimmen (§1.3).

**9:53 [pause]** 1 s

**9:54 VO** The question is no longer what artificial intelligence can do. It's what goes on the list. And who gets to write it.  
PICTURE: You in front of the huge list of light. The first line glows, still empty. Text, built in three steps: THE QUESTION IS NO LONGER WHAT AI CAN DO. · IT'S WHAT GOES ON THE LIST. · AND WHO GETS TO WRITE IT.  
· KERNSATZ. Danach kein neuer Gedanke mehr.

### Abo-Aufruf 2 (10:03–10:16 · 32 Wörter)

**10:03 [SUBSCRIBE CALL 2 · END]**

**10:03 VO** This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. And so that everybody gets a say in what stays human. Want that too? Then subscribe.  
PICTURE: The final image holds: the list of light, you and many others in front of it. Subscribe element. No QR overlay.  
· Über dem Schlussbild, nach dem Kernsatz, mit Mission und als Frage (§3.8).

### E · Endbild (10:16–10:31 · 15 s, ohne Stimme)

**10:16 [END SCREEN · 15 s]** Bild und Musik laufen weiter, keine Stimme, kein stummes Standbild.
PICTURE: The list of light, you and many others in front of it; more small lights keep going on in the dark around it. Space for the end cards left and right, subscribe area.

---

## Clips

| Clip | Zeit | Dauer | Quelle | Wortlaut | Stand | Einordnungssatz (VO) | Sprecherzeile danach |
|---|---|---|---|---|---|---|---|
| C1 | 0:56 | ~8 s | „The turbulent era of artificial intelligence is here“ · Kanal Bill Gates · 27.8.2026 · MLeTQWQiOvg · 1:52 | WORTLAUT OFFEN [CHECK]. Gebraucht wird ein vollständiger Satz, in dem er selbst sagt, dass diese Technik die Arbeit grundlegend verändert und dass die Entscheidungen von jetzt den Ausgang bestimmen. | gelb · Wortlaut und Zeitmarke offen · andere Stelle als in #25 | „This is him, late this summer.“ | „Three years ago, his reasoning was familiar.“ (hängt nicht am Wortlaut) |
| C2 | 3:21 | ~8 s | „Bill Gates says to prepare for 20 years of tumultuous AI disruption“ · Decoder with Nilay Patel · 22.10.2026 · A0kTUP7fWtk | “If we don't choose to massively slow down or stop, then we will have robots that can build houses, grow food, do surgery.” | gelb · Wortlaut laut Berichten, Zeitmarke offen | „This fall, on a podcast, he said where that leads.“ | „Houses. Food. Work done with hands. But go back to how his sentence begins: if we don't choose.“ |
| C3 | 5:32 | ~7 s | wie C2 · Decoder with Nilay Patel · 22.10.2026 · A0kTUP7fWtk | “My big concern is this 20-year transition period where they'll have winners and losers and a lot of disruption.” | gelb · Wortlaut laut Berichten, Zeitmarke offen | „On that same podcast, he said how long.“ | „Twenty years of winners and losers.“ |
| C4 | 7:55 | ~8 s | „Bill Gates says we must decide which jobs to reserve for humans“ · CNN · 11.10.2026 · cHRCt8YCYPM · 1:19 | WORTLAUT OFFEN [CHECK]. Belegt ist nur der Videotitel. Gebraucht wird der vollständige Satz, in dem er sagt, dass wir entscheiden müssen, welche Jobs Menschen vorbehalten bleiben. | gelb · Wortlaut offen (nur Videotitel) · **rote Quelle** (CNN): nur als Zitatkarte oder ersetzen | „This October, on television, Gates named the task.“ | „Decide which jobs.“ (hängt am Wortlaut) |

- Summe 31 s ≈ 5,0 % von 10:16 (4,9 % mit Endbild). Ziel ≤ 8 %, hart ≤ 10 %.
- Abstände: C1→C2 137 s · C2→C3 123 s · C3→C4 136 s. Alle ≥ 45 s.
- Jeder Clip hat einen eigenen Einordnungssatz davor und muss mit einem ganzen Satz enden (§7). Bauchbinde: Name · Quelle · Monat/Jahr · ORIGINAL FOOTAGE.
- C1 liegt bei 0:56, also noch in der ersten Minute. Das ist erlaubt, wenn der Clip das Titelversprechen belegt (`clip-schritt.md`). Die gewählte Stelle muss das leisten; die „turbulent era“-Stelle aus #25 ist tabu (Faktenzettel 0.8).
- C4: CNN ist laut Ampel eine rote Quelle. Als Zitatkarte bleiben drei echte Clips (C1–C3), das erfüllt die Regel 3–6. Alternativen aus `clips.json`: A1 (Ezra Klein, 30.9.), A2 (FT Live, 4.11.); A3 (CBS) ist ebenfalls rot.
- Etzioni (A4) und das Semafor-Zitat sind Print- bzw. Telefonquellen: Zitatkarten, keine Clips.
- Kein Clip in Station 2 und 4: Dort tragen Daten (Stanford, Yale), keine Stimmen.

---

## Nach dem Film weiß ich, dass …

1. *(Akt 1 · Die Kehrtwende, 0:00–2:01)* … Bill Gates vor drei Jahren schrieb, die Risiken seien „real, but manageable“, und jetzt „far fewer“ Jobs erwartet, wenn die Politik nicht handelt. Sein Grund: Diese Technik übertrifft menschliche Intelligenz, also kann sie den Menschen auch in die neue Arbeit folgen. Er hat seinen Ruf darauf gesetzt.
2. *(Akt 2 · Die ersten zwei Stopps, 2:01–3:58)* … es laut Gates zuerst die Arbeit am Bildschirm trifft und das bei Berufseinsteigern schon in Lohndaten steht (rund 19 % Rückstand, ein Jahr zuvor weniger), dass aber dort, wo die Technik neben Menschen arbeitet, die Beschäftigung hält oder wächst. Und dass er für Arbeit mit den Händen zwei bis acht Jahre nennt, in einem Satz, der mit „If we don't choose“ beginnt.
3. *(Akt 3 · Die Gegenprobe, 3:58–5:19)* … Forscher in Yale im ganzen US-Arbeitsmarkt (Stand Frühjahr 2026) keinen KI-Effekt finden, dass manche Firmen Entlassungen auf KI schieben, und dass Gates selbst von einer Prognose spricht. Urteil: Richtung plausibel, am Berufseinstieg messbar, Tempo und Ausmaß offen.
4. *(Akt 4 · Zwanzig Jahre und die Steuer, 5:19–6:51)* … Gates mit 20 Jahren Übergang rechnet, dass heute auf Löhne Abgaben anfallen und auf Software nicht, dass er darum die Arbeit der Maschinen besteuern will, und warum ein KI-Forscher das mit einer Steuer auf Tastenanschläge vergleicht.
5. *(Akt 5 · Die Liste, 6:51–10:16, letztes Drittel)* … „Human Reserved“ selbst in Gates' extremster Fassung höchstens 40 % der Jobs umfasst („as high as I can get“), dass er selbst sagt, es sei offen, wer entscheidet und nach welchen Kriterien, und dass noch keine Zeile dieser Liste geschrieben ist.

**Zum Mitnehmen (ein Werkzeug, kein Fakt):** Bei der nächsten Schlagzeile „KI kann jetzt X“ zwei Fragen stellen: Gehört X auf die Liste, und wer entscheidet das?

- **Titel eingelöst bis 1:30:** ja (0:04 vorher, 0:08 nachher, 0:56 O-Ton, 1:14 sein Satz im Wortlaut).
- **Staunen-Stellen (eine in Minute 1, eine pro Akt):** 0:40 Arbeit nur für Menschen, selbst wo eine Maschine sie könnte · 1:32 die Maschine kann folgen · 2:41 dieselbe Technik, anders eingesetzt · 3:29 „if we don't choose“ · 3:58 er warnt vor der Technik, an der seine alte Firma verdient · 5:39 „That's the rest of it.“ · 5:55 Lohn wird besteuert, Software nicht · 7:45 selbst die großzügigste Liste lässt die Mehrheit draußen · 8:55 übrig geblieben → gewählt.
- **Kenner-Test (wer schon drei Gates-Videos gesehen hat):** Neu sind die Lesart „if we don't choose“, die Gegenprobe mit Yale und Gates' eigener Einschränkung, die Folgerung aus den 40 % (die Mehrheit stünde nicht auf der Liste), der Blick „bisher Preis, künftig Regel“ und die Frage, wer die Liste schreibt. Nicht neu (bewusste kurze Rückgriffe): „crazy / insane“, die 20 Jahre, die 19 % (siehe Hinweise zu #25).
- **Zweifel dosiert, dann Urteil (§6.4):** Gegenprobe gebündelt in Station 4 mit Urteil bei 4:53; je ein Einwand in Station 5 (Etzioni) und Station 6 (Kritiker), danach jeweils eine klare Aussage.

---

## Offen: [CHECK]-Liste (für den Faktencheck am iMac)

Reihenfolge nach Zeit. „Sicher / dünn“ wie im Faktenzettel. Laut Faktenzettel stammen alle Wortlaute aus Suchauszügen; die Originale waren aus der Cloud gesperrt.

1. **0:04 „real, but manageable“:** Titel des Essays von Juli 2023 (sicher). Am GatesNotes-Original prüfen (Gerüst Abschnitt 2: gelb).
2. **0:12 „no job will be left untouched“:** dünn (Semafor, nur aus Zusammenfassungen: „There isn't a job that isn't affected.“). Darum sinngemäß und mit „he says“.
3. **0:25 „This is crazy. This is insane.“ und 0:28 „deafened“:** Wortlaut sicher (Semafor 25.8.2026). Prüfen, worauf sich „this“ im Interview bezieht; der Hook stellt es als seine Reaktion auf das dar, was er sieht.
4. **0:33 „for months“ und die Datumsstempel** (Semafor 25.8. · Decoder 22.10. · FT Live 4.11. · CBS 12.11.): Daten sicher. Gilt für einen Upload ab Mitte November.
5. **C1 (0:56):** Wortlaut und Zeitmarke offen. Andere Stelle als #25 (K3). Sie muss das Titelversprechen tragen. Ersatz: A2 (FT Live, 4.11.) mit „This is him, this November.“
6. **1:22 „different from every technology before it. Because it exceeds human intelligence.“:** belegt nur über Videotitel (CBS 12.11., CNN 27.8.). Seinen Wortlaut am Video prüfen.
7. **1:32 „this time, the machine can follow them“:** Erklärung des Films, abgeleitet aus seinen zwei Aussagen. Am Essay prüfen, ob er so argumentiert; sonst „That is what Bill Gates saw“ ändern in „That is the logic behind his warning“.
8. **2:01 phone support · telemarketing · accounting; „cheaper, faster and more accurately“:** sicher, aber nur sinngemäß (Decoder-Berichte). Begriffe am Original prüfen (accounting oder bookkeeping).
9. **2:20 Stanford:** 19 % (sicher), „trails less exposed jobs“ als Wiedergabe von „unter dem Vergleichswert“, „A year earlier, the gap was smaller“ (2025: 13 %), „holds steady, or grows“ (2:41). Definition des Vergleichs am Original prüfen. **Überschneidung:** #25 hatte dieselbe Zahl schon im Hook (siehe Hinweise).
10. **3:08 „two to eight years … humanoid robots on building sites and farms“:** sicher, sinngemäß (Decoder-Berichte).
11. **C2 (3:21) und C3 (5:32):** Wortlaute sicher, Zeitmarken offen. „This fall, on a podcast“ und „On that same podcast“ stimmen für Decoder, 22.10.2026.
12. **3:58 „Microsoft, the biggest partner of the company behind ChatGPT … his old company profits from“:** Faktenzettel St. 4; „the company behind ChatGPT“ ist Allgemeinwissen (so auch in #66). Stand am Upload-Tag prüfen.
13. **4:18 Yale:** sicher, aber „as of this spring“; neuere Zahl suchen. „American“ = US-Arbeitsmarkt. 4:38 „Their director“ = Martha Gimbel (Fortune, Feb. 2026).
14. **4:45 „his warning is a forecast. Not a finding in today's numbers.“:** dünn (Semafor, sinngemäß).
15. **5:55–6:08 Steuer:** Begründung sinngemäß (Wortlaut „nudges“ dünn). „tax the machine's work“ ist die Kurzform des Films für die Token- und Robotersteuer; am Essay prüfen, worauf genau die Steuer erhoben werden soll.
16. **6:18 Etzioni:** beide Zitate sicher (ABC News, Aug. 2026). Rolle für die Einblendung prüfen (Faktenzettel: Gründer des Allen Institute for AI). „It counts how hard the machine works. Not whether anyone lost a job.“ gibt den Faktenzettel wieder („misst Aufwand, nicht Verdrängung“); prüfen, ob das seine Begründung ist. Die Erklärung von „tokens“ ist Allgemeinwissen.
17. **7:02 Kandidaten:** aus Berichten (Kinderbetreuung, Jury, Kunst; Bildung als Mischform). Am Essay prüfen, welche er selbst nennt.
18. **7:33 40 %:** sicher (Axios). 7:45 „most jobs would not be on it“ ist die Folgerung des Films aus „as high as I can get“.
19. **C4 (7:55):** Wortlaut offen (nur der CNN-Titel ist belegt), Zeitmarke offen, und CNN ist eine rote Quelle. „Decide which jobs.“ (8:03) hängt am Wortlaut. „This October, on television“ stimmt für CNN, 11.10.2026.
20. **8:17 Kritik:** dünn (Berichte, Aug. 2026), darum sinngemäß und ohne Namen.
21. **8:35–8:55 „rarely a decision. It was a price … chosen. In advance.“:** Deutung des Films nach dem Gerüst, kein Gates-Zitat.
22. **9:16 Überfluss:** sicher, sinngemäß (Decoder-Berichte). 9:28 „find a way to organize, and to have purpose“: dünn (nur eine Schlagzeile), darum indirekte Rede; Zitatkarte erst nach Prüfung.
23. **9:37 „That task starts with the list … whoever speaks up“:** Urteil des Films, kein Zitat.
24. **Zeitangaben:** „Three years ago“ (Juli 2023), „late this summer“ (27.8.), „This fall“ (22.10.), „This October“ (11.10.), „As of this spring“, „for months“ gelten für einen Upload im November oder Dezember 2026.

---

## Abweichungen vom Gerüst (mit Grund)

1. **Kernsatz gedreht.** Gerüst: „… It's what we decide to keep.“ Hier: „… It's what goes on the list. And who gets to write it.“ Grund: Faktenzettel 0.7 und Auftrag (zu nah an #25: „It's the one we won't hand over“). Neu ist die gemeinsame Entscheidung, die Liste, und wer sie schreibt. Kein Schach, kein „on purpose“.
2. **Station 1 ohne „Tempo“ und ohne „blue-collar“.** Das Tempo-Zitat ist gestrichen, „blue-collar“ ist dünn. Kern der Station ist darum die Art der Maschine („exceeds human intelligence“). Die Breite (Bildschirm und Hände) kommt über Hook (0:16) und Stopp 2.
3. **C1 direkt nach dem Hook (0:56) statt in der Hook-Wende.** Die Wende trägt das Semafor-Zitat als Zitatkarte (Print-Interview, laut `clips.json`). So gibt es zwischen 0:30 und 0:50 keinen Sprecherwechsel.
4. **Hook ohne die Zeile „state of shock … first one saying“.** Sie steht auf der Zitatkarte. Gesprochen hätte sie das erste Ergebnis hinter 0:45 geschoben (Datenregel 16.11.).
5. **Gegenprobe ohne Etzioni; er kommt nur in Station 5.** Eine Stimme pro Station. Die Gegenprobe besteht aus Interesse (Microsoft), Daten (Yale) und Gates' eigener Einschränkung.
6. **Abo-Aufruf 1 direkt nach dem Urteil; die Frage „Was ist sein Plan?“ erst in Station 5** (5:49, „So which policies?“), nach dem Clip zu den 20 Jahren. Die Gerüst-Reihenfolge der Inhalte bleibt.
7. **Station 6: Beispiele ohne psychische Betreuung** (§2.5c), Unterrichten als Mischform wie im Faktenzettel. **Reihenfolge innerhalb der Station** so, dass erst die offenen Punkte und der Zweifel kommen und die große Antwort danach im letzten Fünftel steht. Dazu ein Du-Moment (Jury) und ein Rate-Moment vor den 40 %.
8. **„Zum ersten Mal“ wird nicht behauptet.** Das Gerüst sagt: „Zum ersten Mal entscheidet nicht der Markt …“. Das steht nicht im Faktenzettel und ist angreifbar (die Jury ist schon heute per Gesetz menschlich). Darum „rarely a decision“ und „no longer what's left over. It would be chosen. In advance.“ Das Staunen bleibt, die Behauptung ist weg.
9. **Stanford-Zahl gekürzt.** Faktenzettel 0.3 nennt die 19 % „neu“; #25 hat sie aber schon im Hook („almost a fifth behind“, gleiche Studie, gleicher Stand). Darum nur ein kurzer Rückgriff mit dem, was #25 nicht hatte (der Zuwachs und „alongside people“).
10. **Ende mit Ernte der Stille.** „And remember what Gates says he hears: silence.“ direkt vor dem Kernsatz (Pflanzen und Ernten, §11). Die Aufgabe „organize and have purpose“ nur in indirekter Rede (dünn).
11. **C4 als rote Quelle markiert** (CNN), mit Ersatzvorschlag. Die Stelle im Gerüst bleibt.
12. **Länge:** 1.410 Wörter, 10:16 plus 15 s Endbild (Auftrag: 1.350–1.500 Wörter, ~10 Minuten).

---

## Hinweise

- **Regeln geprüft (REGELN §1–11):**
  - Keine Ich-Sätze. Alle Gates-Zitate mit „I“ stehen in der dritten Person („He says he would love to be convinced …“, „as high as he can get“); wörtlich gesprochen wird nur „This is crazy. This is insane.“
  - „AI“ wird nie gesprochen (0 Treffer), auch nicht in „OpenAI“ („the company behind ChatGPT“). Auf Karten und in Einblendungen steht sein Wortlaut.
  - Bann-Liste und Fahrplan: 0 Treffer. Minute 1: eine Frage, keine Jahreszahl, kein Fahrplan, keine Biografie, kein Firmendetail. Kein Break am Hook-Ende.
  - Abo-Aufruf zweimal, mit Mission und als Frage, nie im Hook, kein QR. Kein „tell me in the comments“; die Frage an den Zuschauer steht bei 9:06 und ist nicht der letzte Satz.
  - §1.9a: Gates bekommt zuerst sein stärkstes Argument (Station 1 bis 3), dann wird geprüft, wer spricht, mit welchem Interesse und was dagegen spricht (Station 4), mit klarem Urteil.
  - §1.3: Jede Bedrohung hat im selben Akt eine Wirksamkeit: Stopp 1 („Same technology. Used differently.“), Stopp 2 („there is a choice“), Stopp 3 (sein Plan), Schluss (die Liste ist offen, weitere Lichter gehen an).
  - §1.7: Die Steuer ist als Umkehr eines Anreizes erzählt, nicht als Wegnehmen. Keine Partei, kein Politikername; an Firmen nur Microsoft (als Interessenlage) und „the company behind ChatGPT“.
  - §1.9 und §2.5c: keine Medizin-Station; „surgery“ fällt nur im O-Ton C2, „diagnosis“ ist Etzionis Bildwort. Betreuung und Unterricht bleiben bei Menschen.
  - §2.5f: kein Jensen Huang.
  - §11: Wer die Macht hat, wird benannt (3:37 bauen, kaufen, einschalten; 9:37 Firmen, Gesetzgeber, die Betroffenen). Sicherheit hörbar kalibriert (measurable / forecast / open).
- **Pflanzen und Ernten:**
  - „it hasn't been written yet“ (0:51) → „Not one line of it is written.“ (8:28) → „an unwritten list doesn't stay unwritten“ (9:37) → „who gets to write it“ (9:54).
  - „deafened“ (0:28) → „what Gates says he hears: silence“ (9:49).
  - „Jobs at a screen. Jobs done by hand.“ (0:16) → Stopp 1 und Stopp 2.
  - „without the right policies“ (1:14) → „Remember his sentence“ (5:49).
  - „Even where a machine could do it.“ (0:40) → Jury (7:14) → „a rule holds, whatever the price“ (8:55).
  - „Not a date in your calendar.“ (4:53) → „It isn't a date. It's a stretch of time.“ (5:19).
- **Überschneidungen mit früheren Filmen:**
  - **#25, wichtig:** Der Hook von #25 hatte bereits „Among young people starting out, the jobs most exposed to A.I. are already almost a fifth behind“ (Stanford-Update Aug. 2026, in #25 `faktencheck.md` Nr. 3 geprüft). Faktenzettel 0.3 von #41 geht von der älteren Fassung aus. Die Stelle ist hier darum auf einen kurzen Rückgriff gekürzt. Wer sie ganz streichen will: 2:14–2:41 raus (−64 Wörter), dann fehlt Station 2 aber ihre einzige Zahl und Station 4 der Bezug („That gap“).
  - #25 nicht wiederholt: keine Rangliste, kein Hinton, kein Radiologe, kein Schach, kein „on purpose“, kein „won't hand over“, nicht die „turbulent era“-Stelle.
  - #15: keine Drei-Tage-Woche. Der Schluss von #15 („So who decides? The companies … The governments … And everyone who votes, negotiates or speaks up at work.“) ist ähnlich gebaut wie 9:37 („Companies. Lawmakers. Or the people whose work is on it.“). Hier bezieht es sich auf die Liste; bei Bedarf „whoever speaks up“ durch „whoever shows up“ ersetzen.
  - #17: Dort fiel in der Mitte „who gets to write the text?“ und das Motiv „pen“. Der Kernsatz hier endet auf „who gets to write it“ (die Liste, vom Faktenzettel so verlangt). Kein Stift-Bild.
  - #66 und #18: Überfluss nur in einem Satz (9:16), keine Preisschilder, kein „rules are written by people you elect“.
  - #19, #5: Steuer nur als ein Block in Station 5, keine Umverteilungsdebatte.
- **Hörfassung `vo-v1.txt`:** nur Sprechtext, ein Absatz pro Station (Leerzeile = Stationswechsel; die zwei Abo-Aufrufe sind eigene Absätze), eine Zeile pro Sprechblock. Clip-Stellen als eigene Zeilen `CLIP: [CLIP Cn …]` (vor der Stimme entfernen), `[pause]` zweimal (nach „if we don't choose.“ und vor dem Kernsatz). Zwischen Hook-Absatz und Station 1 beim Vertonen keine Pause setzen (§4). Kein Flüster-Tag, keine Stil-Tags.
- **Aussprache:** „Etzioni“ (et-see-OH-nee) · „ChatGPT“ (chat-G-P-T) · „Human Reserved“ als Name, beide Wörter betont · „telemarketing“. Zahlen sind ausgeschrieben. Stolperstellen zum Probehören: „These systems, he says, do that work cheaper, faster and more accurately.“ (2:01) · „Taxing tokens, the small units these systems work in, is like taxing keystrokes on a typewriter“ (6:18) · „which jobs stay human was rarely a decision“ (8:35).
- **Kürzen, falls näher an 10:00 gewünscht (zusammen −48 Wörter ≈ −20 s):**
  - 0:33 „And he has been saying it for months.“ (−8; der neueste Anlass steht dann nur im Bild).
  - 4:38 der Satz der Yale-Direktorin (−18).
  - 3:58 „Though a skeptic would add: strict rules often suit the biggest players.“ (−12; dann fehlt die Gegenlesart).
  - 7:02 „And in teaching, a mix: …“ auf „And, with a person in charge, teaching.“ kürzen (−10).
  - Alle vier liegen so, dass die Clip-Abstände ≥ 45 s bleiben.
- **Kernsatz-Alternativen:** „The question is no longer what artificial intelligence can do. It's who writes the list.“ (kürzer) · „… It's what we decide to keep. And who gets to decide.“ (näher am Gerüst, aber näher an #25).
- **Offen für Jakob:**
  - Hook A, B oder C (Empfehlung A).
  - Der gedrehte Kernsatz.
  - C4: Zitatkarte oder Ersatz-Clip.
  - Ob die Stanford-Zahl nach #25 noch einmal vorkommen soll.
  - Die Einlösung des Titels im O-Ton hängt an C1, und dessen Wortlaut ist noch nicht am Video geprüft.
