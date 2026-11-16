# Faktencheck „They're Using AI to Save the World“ (#28) · vo-v4 → vo-v5 · Stand 11.11.2026

**Prüfrahmen:** Upload Sa 14.11.2026, 17:00 Wien. Alle Zeitwörter sind gegen dieses Datum geprüft. Thesen und Rahmungssätze ohne Tatsachengehalt sind nicht gezählt.

**Methode:**
- WebFetch und curl sind für alle Primärseiten gesperrt (ENOTFOUND bzw. Proxy). Betroffen sind u. a. news.un.org, methanedata.unep.org, unep.org, arxiv.org, research.google, science.org, nature.com, jpl.nasa.gov, svs.gsfc.nasa.gov, dtnext.in und onmanorama.com.
- Direkt gelesen: YouTube-oEmbed (Titel, Kanal) und die yt-dlp-Suchliste (Länge, Anfang der Beschreibung) für C1, C3, C4 und C5.
- Alles andere stammt aus frischen WebSearch-Auszügen vom 11.11.2026, die die Primärquelle wiedergeben, meist aus zwei oder mehr Quellen.

**Ampel:**
- grün = belegt.
- gelb = belegt mit Einschränkung: Firmen- oder Behördenangabe, Schluss, nur eine Quelle, umstritten oder zugespitzt.
- rot = falsch oder veraltet.
- offen = ohne Material vom iMac nicht prüfbar.

**Ergebnis:** 95 Aussagen geprüft.
- **Sprechertext:** 86 Aussagen, davon **75 ok / 10 überzogen / 1 falsch**.
- **Clips und Einblendungen:** 9 Aussagen, davon 3 ok / 1 überzogen / 1 falsch (veraltet) / 4 offen.
- **Gesamt:** 78 ok / 11 überzogen / 2 falsch / 4 offen.
- Änderungen: 4 MUSS im Sprechertext plus die Pflicht-Änderung (O-Ton), alles in `vo-v5.txt` eingearbeitet. Dazu 4 MUSS außerhalb des Sprechertexts und 8 KANN.

**Gesamturteil:** Der Film hält. Alle zwölf Geschichten sind echt, die tragenden Zahlen stimmen:
- Te Hiku: zehn Tage, 300 h, erste Māori-Spracherkennung.
- Nazca: 47.410 Vorschläge, Figuren fast verdoppelt.
- Methan: fast neun von zehn Warnungen unbeantwortet.
- Casey Harrell: fast zwei Millionen Wörter.
- Fischerei: drei von vier Booten dunkel.
- GUARDIAN: am Tag vor dem Beben eingeschaltet, 32 Minuten vor dem Pegel.
- Schlangen: hundertmal mehr Tote.
- Baker-Labor: nur Mäuse, nur einzelne Toxine.
- DebunkBot: ein Fünftel, Erratum vom 22.10.2026, Preprint.
- Groundsource: 2,6 Mio. Ereignisse.

Die wichtigsten Funde:
1. **Wyoming „more than four in five“ ist umstritten.** Eine USGS-Reanalyse im selben Journal (2023) hält den Rückgang für nicht belegt.
2. **Methan „The year before, almost none“ ist vom Upload aus falsch.** 2025 lag die Quote schon bei 12 %, die 1 % stammen aus 2024.
3. **Algerien zieht zwei Fakten zusammen.** „Jedes klare Bild“ gilt erst ab 2013, und das Ventil ist nur von einem Blog belegt.
4. **Caseys „now … almost two million“ ist ein Zählstand vom Studienende.** Er nutzt das System weiter.

---

## 1. MUSS-Änderungen im Sprechertext (in `vo-v5.txt` eingearbeitet)

Z. = Zeile in vo-v4.txt/vo-v5.txt (beide 116 Zeilen).

| Nr. | Z. | Alt | Neu | Grund | Quelle |
|---|---|---|---|---|---|
| **M1** | 33 | Eagle deaths there fell by more than four in five. | **A study found** eagle deaths there fell by more than four in five. **Other scientists say one wind farm can't prove that yet.** | **Umstritten, als Tatsache gesagt.** McClure et al. 2021: −82 % gegenüber dem Kontrollpark. Nachanalyse 2022: −85 % (95-%-HDI 12–100 %). Huso & Dalthorp (USGS) 2023 im selben Journal: Die Aussage sei „not supported by the data“, eigene Schätzung −50 % (−159 % bis +89 %, also auch eine Zunahme möglich). Gründe: ein Standort, 4-Jahres-Mittel gegen ein Jahr. Die Autoren widersprechen (Kontrollpark ignoriert). Eine Mehr-Standort-Studie wurde bis 11/2026 nicht gefunden. | Q12, Q13, Q14 |
| **M2** | 46 | In Algeria, **one gas site had leaked in every clear picture for decades**. Months after the alerts, **someone closed a valve.** | In Algeria, **one leak had shown up in every clear picture for over a decade.** Months after the alerts, **it stopped.** | **Zusammengezogen und dünn.** UNEP-MARS-Bericht: eine Fahne „in every high-quality image“, hochwertige Bilder gibt es aber erst ab 2013 (Landsat-8). Für 1999 gibt es nur „evidence“ (Landsat-5). „Jedes klare Bild“ gilt also für gut ein Jahrzehnt, nicht für Jahrzehnte. Die Quelle liegt im Ölfeld Hassi Messaoud, „gas site“ ist unsicher. Das Ventil steht nur bei Data Desk („fixed a valve“, Sonatrach antwortete nicht). UNEP nennt keine Ursache, nur: ab 14.10.2024 keine Emission mehr, „within a few months“ nach den Warnungen von 2024. | Q19, Q20 |
| **M3** | 48 | …still get no answer. **The year before,** almost none got one. | …still get no answer. **Two years ago,** almost none got one. | **Zeitwort, vom Upload aus falsch.** Antwortquote: 2024 „just over one per cent“ (Eye on Methane 2024), 2025 12 %, aktuell 13 % (UNEP 23.6.2026, UN News 7/2026). „Das Jahr davor“ ist im Nov. 2026 das Jahr 2025 mit 12 %. „Nearly nine in ten … still“ bleibt richtig (87 %). | Q21, Q22 |
| **M4** | 58 | But at home, **he has now spoken** almost two million words with it. | But at home, **in under two years, he spoke** almost two million words with it. | **Zeitwort.** Nature Medicine 15.6.2026: „over nearly two years“ zu Hause, >3.800 h, >183.000 Sätze, „close to 2 million words“. Die Zählung endet mit dem Studienzeitraum. Harrell nutzt das System weiter (UC Davis 6/2026). „now … almost two million“ wäre im Nov. 2026 zu niedrig. | Q24 |

**Pflicht-Änderung (Jakobs Entscheidung, keine Faktenfrage):**
- **P1, Z. 115:** `[O-TON JAKOB: "The tool is already here. The question is what we point it at."]` → `The tool is already here. The question is what we point it at.`
- **P2, Z. 116:** `[O-TON JAKOB: "That's why … Then subscribe."]` → `[warm] That's why this channel exists: so that superintelligence goes well for everyone. Want that too? Then subscribe.`
- Prüfung: kein Ich-Satz des Erzählers (nur „what we point it at“), „subscribe“ genau 2× (Z. 60 und 116), 5 Clip-Marken und alle Regie-Tags erhalten.

**MUSS außerhalb des Sprechertexts:**
- **B1 · Einblendung Flood Hub** (text-v4, Abschnitt 5 Nr. 7): „100 Länder/700 Mio. (11/2024)“ ist veraltet. Neu: „river floods up to 7 days ahead · 150+ countries · 2+ billion people (Google)“. Google: „2B people in over 150 countries“. Die 150 Länder schließen Gebiete ein, die nur über „virtual gauges“ abgedeckt sind (Q41).
- **B2 · C3a fehlt in clips.json.** Den Eintrag nachtragen, vermutlich aus derselben Quelle wie C3 (thPhBDVSxz0). Länge mindestens 4 s (§7 verlangt 4–15 s, text-v4 plant 3–4 s). C3a und C3 zusammen höchstens 20 s.
- **B3 · Einblendung #4 (optional)** „Kerala (Walayar): elephants still die · plans the same system (Nov 2026)“. Laut Onmanorama 3.11.2026 planen **Indian Railways** mit der Forstbehörde KI-Warnungen und Unterführungen, nicht der Bundesstaat. Neu: „Walayar (Kerala): railways plan the same system · Nov 2026“. „Elephants still die“ nur mit datierter Meldung (Q32).
- **B4 · Faktenzettel, Staunen-Fakt 3** („leaked … in every clear satellite image for a quarter of a century“) nicht für Beschreibung, Einblendung oder Shorts verwenden. Grund wie M2.

---

## 2. KANN-Änderungen (nicht eingearbeitet)

| Nr. | Z. | Alt | Vorschlag | Grund | Status |
|---|---|---|---|---|---|
| **K1** | 17 | …they read enough Māori **into their phones** to build it. | In just ten days, they **recorded** enough Māori to build it. | Aufgenommen wurde über die Webseite koreromaori.com (RNZ 3/2018). Handys sind nicht ausdrücklich belegt. | empfohlen |
| **K2** | 18 | A company working for big tech wanted recordings like these too, and offered to pay. The station said no. | **Soon, big tech wanted recordings like these too.** The station said no. | Zieht zwei Fakten zusammen. Lionbridge (laut Te Hiku im Auftrag von Google) bot 2018 **Sprechern** Geld, nicht dem Sender, und Te Hiku protestierte öffentlich. Später lehnte Te Hiku Kaufanfragen von Konzernen für die eigenen Daten ab. | offen (Jakob) |
| **K3** | 21 | But this time, the speakers **own** the machine. | But this time, **the machine stays with the speakers.** | Kaitiakitanga-Lizenz: Te Hiku sieht sich als Hüter, nicht als Eigentümer. „own“ ist ein Wort zu stark, als Bild aber vertretbar. | offen |
| **K4** | 34 | That camera can't afford to miss. | **Here, one miss can cost an eagle.** | IdentiFlight übersieht Adler: 2018 6 % falsch-negativ, Kalifornien (PLOS ONE 2023) 77 % erkannt. Nach M1 kann der Satz nach Unfehlbarkeit klingen. | empfohlen |
| **K5** | 67 | Another A.I. reads how ships move, and flags those… | **Another study used A.I. to read** how ships move, and flagged those… | PNAS 2020 mit Daten 2012–2018. Ein laufendes Werkzeug ist nicht belegt, und die Methode wurde kritisiert (PNAS 2021). | offen |
| **K6** | 82 | An A.I. spots the elephant and warns the driver and the rangers. | An A.I. spots the elephant, **and the driver and the rangers get a warning.** | Die KI meldet an den Leitstand. Personal prüft das Bild und ruft die Lokführer an (Anruf, SMS), dazu kommen Hupen und Anzeigetafeln an der Strecke. | offen |
| **K7** | 104 | Most flood deaths come from flash floods. | **Flash floods are the deadliest floods.** | Die WMO ist uneinheitlich: 2025 „nearly 85% of all flooding-related fatalities“, 2020 „85% of flooding cases … highest mortality rate“. Der neue Satz gilt nach beiden Fassungen. | empfohlen |
| **K8** | 115 | The tool is already here. | **[pause]** The tool is already here. | Regie, keine Faktenfrage: Der Stimmwechsel zum O-Ton fällt weg, die Pointe „It was the aim.“ braucht Luft. | offen |

---

## 3. Alle Aussagen

Die Quellen-Kürzel stehen in Abschnitt 6.

**Sprechertext**

| Nr. | Z. | Aussage (kurz) | Ampel · Urteil | Quelle | Anmerkung |
|---|---|---|---|---|---|
| 1 | 3 | Zug bremst im Dunkeln für Elefanten, die der Fahrer nicht sieht | grün · ok | Q29, Q30 | Wärmekameras nachts; >3.280-mal verlangsamt/gestoppt (7/2026) |
| 2 | 4 | Mann in Kalifornien spricht wieder, mit eigener Stimme | grün · ok | Q23 | Stimme aus Aufnahmen vor der ALS |
| 3 | 6 | In Perus Wüste kommen alte Zeichnungen ans Licht | grün · ok | Q16 | Funde laufen weiter |
| 4 | 8 | „same kind of tool that writes your emails“ | grün · ok | Q36 | Rahmung; alles maschinelles Lernen, #2 wörtlich GPT-4 Turbo |
| 5 | 12 | Das letzte Werkzeug lernte aus alten Nachrichten, wo Fluten zuschlagen | grün · ok | Q40 | Groundsource, 12.3.2026 |
| 6 | 14 | winziger Radiosender am äußersten Rand Neuseelands | grün · ok | Q2 | kleiner gemeinnütziger Sender knapp unter der Nordspitze, 2018 elf Mitarbeitende |
| 7 | 14 | „something no tech giant had“: Maschine versteht gesprochenes Māori | gelb · ok | Q1, Q3 | Schluss aus „first ASR for te reo Māori“ (2018). Google konnte te reo 2017 laut Te Taura Whiri nicht erkennen. Keine frühere Konzern-Spracherkennung gefunden. |
| 8 | 15 | Maschine muss eine Sprache stundenlang hören | grün · ok | Q1 | >300 h |
| 9 | 16 | Der Sender bat die eigenen Leute | grün · ok | Q1, Q2 | Kōrero Māori; Kapa-Haka- und Waka-Ama-Gruppen, Preis für die meisten Aufnahmen |
| 10 | 17 | In zehn Tagen genug eingesprochen, um sie zu bauen | grün · ok | Q1, Q2 | 3/2018: >2.500 Menschen, >200.000 Sätze, >300 h → erste Māori-Spracherkennung (DeepSpeech) |
| 11 | 17 | „into their phones“ | gelb · überzogen → K1 | Q6 | Webseite; Handy nicht ausdrücklich belegt |
| 12 | 18 | Firma für Big Tech wollte solche Aufnahmen, bot Geld | gelb · ok | Q4 | Lionbridge 2018, bezahlte te-reo-Sprecher für Spracherkennungs-Aufnahmen; „für Google“ ist eine Te-Hiku-Angabe |
| 13 | 18 | „The station said no.“ | gelb · überzogen → K2 | Q4, Q5 | Angebot ging an Sprecher; Te Hiku protestierte und lehnte später eigene Kaufanfragen ab |
| 14 | 19 | Peter-Lucas Jones leitet den Sender | grün · ok | Q7 | CEO, TIME100 AI 2024 |
| 15 | 21 | „the speakers own the machine“ | gelb · überzogen → K3 | Q5, Q8 | Kaitiakitanga: Hüter, nicht Eigentümer |
| 16 | 23 | KI in Australien, gebaut, um Zeit zu verschwenden | grün · ok | Q9, Q11 | Apate.ai, Ausgründung der Macquarie University |
| 17 | 25 | Forscher hielt einen Betrüger 44 Min hin, beim Familienpicknick | gelb · ok | Q9, Q10 | Kaafar mit Frau und zwei Kindern in einem Park in Sydney (Q9). Macquarie 2023 nennt 40 Min. Nur Gründer-Erzählung. |
| 18 | 25 | In der Zeit beraubte der Betrüger niemand anderen | grün · ok | Q9 | Kaafars eigene Überlegung |
| 19 | 26 | Seine Firma macht das jetzt den ganzen Tag, mit KI-Opfern | grün · ok | Q11 | Kaafar ist Gründer und CEO; Bots mit verschiedenen Altern, Geschlechtern, Persönlichkeiten |
| 20 | 27 | Ein großes Telefonnetz leitet Betrugsanrufe schon direkt an die Bots | gelb · ok | Q11 | TPG Telecom; „nearly 590,000“ (Mitgründer Joffe, TechCrunch 14.10.2026); Firmenzahl, läuft weiter |
| 21 | 30 | Windräder machen sauberen Strom und töten Adler | grün · ok | Q12 | – |
| 22 | 32 | Ein Windpark in Wyoming, Kameras auf Türmen | grün · ok | Q12 | Top of the World (Duke Energy), IdentiFlight |
| 23 | 32 | „In the blink of an eye“ entscheidet eine KI: Adler oder nicht | grün · ok | Q15 | Median 0,4 s bis zur Klassifizierung; neuronales Netz |
| 24 | 32 | Nur die Windräder auf der Flugbahn bremsen | grün · ok | Q12 | automatische Abschaltung einzelner Anlagen |
| 25 | 33 | Adler-Todesfälle dort um mehr als vier Fünftel gesunken | gelb · überzogen → M1 | Q12–Q14 | umstritten |
| 26 | 34 | Peru: Maschine fast immer falsch, hat trotzdem gewirkt | grün · ok | Q16 | 47.410 Vorschläge → 1.309 ausgewählt → 178 direkte Treffer |
| 27 | 36 | KI markierte in Luftbildern Zehntausende Stellen | grün · ok | Q16 | 47.410 |
| 28 | 36 | Fast alle davon waren nichts | grün · ok | Q16 | etwa 36 Vorschläge pro vielversprechendem Kandidaten |
| 29 | 37 | Nur die besten Hinweise vor Ort geprüft, bekannte Figuren fast verdoppelt | grün · ok | Q16 | 303 neue zu 430 bekannten (PNAS-Titel „nearly doubles“); 59 der 303 ohne KI-Hinweis |
| 30 | 38 | Die neuen sind klein und liegen nahe an alten Fußwegen | grün · ok | Q16 | im Schnitt 9 m groß und 43 m vom Weg |
| 31 | 38 | Deutung: große für Rituale, kleine für Vorbeigehende | grün · ok | Q16 | als Deutung des Teams gekennzeichnet |
| 32 | 43 | Methan ist unsichtbar und heizt viel schneller als CO₂ | grün · ok | Q17 | >80-mal stärker über 20 Jahre; „faster“ vereinfacht |
| 33 | 45 | Satelliten für Felder und Wälder sehen Methans Schatten | grün · ok | Q18 | Sentinel-2, Landsat, Kurzwellen-Infrarot |
| 34 | 45 | Jeden Tag durchsucht eine KI die Bilder | grün · ok | Q18 | MARS-S2L, täglich 06:30 GMT, ~3.800 Standorte |
| 35 | 45 | Fachleute prüfen, die UN warnt das Land | grün · ok | Q18, Q21 | Treffer werden geprüft, IMEO benachrichtigt Regierungen |
| 36 | 46 | Algerien: „gas site“, „every clear picture for decades“ | gelb · überzogen → M2 | Q19 | zusammengezogen (hochwertige Bilder erst ab 2013) |
| 37 | 46 | „someone closed a valve“ | gelb · überzogen → M2 | Q19, Q20 | nur eine Quelle („fixed a valve“), UNEP ohne Ursache |
| 38 | 48 | Algerien ist die Ausnahme | grün · ok | Q21, Q22 | – |
| 39 | 48 | Fast neun von zehn Warnungen bleiben unbeantwortet | grün · ok | Q21 | 13 % mit Antwort (6–7/2026) |
| 40 | 48 | „The year before, almost none got one.“ | rot · falsch → M3 | Q22 | vom Upload aus 2025 = 12 %; ~1 % galt 2024 |
| 41 | 52 | Das Hirn schickt die Wörter, die Lippen folgen nicht mehr | grün · ok | Q23 | ALS mit schwerer Sprechstörung |
| 42 | 53 | ALS; „like being trapped“ | grün · ok | Q23 | „It is like you are trapped.“ (UC Davis 8/2024) |
| 43 | 55 | Sensoren dort, wo das Hirn Lippen und Zunge steuert | grün · ok | Q23 | 4 Mikroelektroden-Arrays, linker Gyrus praecentralis, Juli 2023 |
| 44 | 55 | KI lernte, welche Signale welche Laute bedeuten | grün · ok | Q23 | neuronales Netz → Phoneme |
| 45 | 55 | Liest keine Gedanken, nur die versuchten Wörter | grün · ok | Q23 | – |
| 46 | 56 | Spricht in seiner Stimme, gebaut aus Aufnahmen vor der Krankheit | grün · ok | Q23 | – |
| 47 | 58 | Ein Mann, eine Studie, noch keine Behandlung für alle | grün · ok | Q24 | BrainGate2, rekrutiert noch |
| 48 | 58 | „at home, he has now spoken almost two million words“ | gelb · überzogen → M4 | Q24 | Zählstand vom Studienende |
| 49 | 63 | Große Schiffe sollen ihre Position funken, über einen Funk gegen Kollisionen | grün · ok | Q25 | AIS; Pflicht lückenhaft, daher „supposed to“ |
| 50 | 66 | KI verglich jahrelange Radarbilder aus dem All mit dem Funk | grün · ok | Q25 | Sentinel-1 2017–2021, 53 Mrd. AIS-Positionen |
| 51 | 66 | Etwa drei von vier Industrie-Fischerbooten unsichtbar | grün · ok | Q25 | 72–76 %; Boote unter ~15–20 m kaum erfasst |
| 52 | 67 | Dunkel heißt nicht illegal | grün · ok | Q25 | – |
| 53 | 67 | Eine andere KI liest Bewegungen und markiert Zwangsarbeitsrisiko | gelb · überzogen → K5 | Q26 | Studie 2020, 14–26 % Hochrisiko; Präsens, Methode kritisiert |
| 54 | 68 | Ein Risiko, kein Urteil | grün · ok | Q26 | – |
| 55 | 71 | Auf offenem Meer kaum eine Welle | grün · ok | Q27 | – |
| 56 | 73 | Wasser schiebt Luft bis ins All, GPS-Signale kommen später an | grün · ok | Q27, Q28 | Ionosphäre in ~300 km Höhe |
| 57 | 73 | Dieselben Signale, die das Handy nutzt | grün · ok | Q28 | GNSS |
| 58 | 74 | Eine KI lernte, den Fingerabdruck zu lesen | grün · ok | Q27, Q28 | „AI-powered detection algorithms“, Signatur 8 Min nach dem Beben |
| 59 | 74 | NASA schaltete sie am Tag vor dem Beben vor Russland ein | grün · ok | Q27 | JPL: „A day before the quake … deployed … an artificial intelligence to mine signals of interest and an accompanying prototype messaging system“; M8,8 am 29.7.2025 |
| 60 | 76 | NASA-Replay: Welle über Hawaii eine halbe Stunde vor dem ersten Pegel | grün · ok | Q28 | KOKB 18:50 HST, erster Pegel 19:22 HST = 32 Min |
| 61 | 77 | Noch ein Forschungswerkzeug | grün · ok | Q28 | experimentell; keine amtliche NOAA-Einbindung gefunden |
| 62 | 80 | Nachts durch einen Elefantenkorridor in Südindien | grün · ok | Q29 | – |
| 63 | 80 | Wenn das Licht den Elefanten findet, ist es zu spät | gelb · ok | Q29 | Plausibilität, Bremsweg nicht belegt; 11 tote Elefanten seit 2008 |
| 64 | 82 | Kameras auf Türmen sehen Wärme | grün · ok | Q29 | 12 Türme, Wärme- und Normalkameras |
| 65 | 82 | KI erkennt den Elefanten und warnt Fahrer und Förster | gelb · überzogen → K6 | Q31 | Leitstand dazwischen |
| 66 | 82 | Der Zug bremst | grün · ok | Q30 | >3.280-mal verlangsamt/gestoppt |
| 67 | 83 | Seit dem Start laut Behörden kein Elefant vom Zug getötet | gelb · ok | Q29, Q30 | Behördenangabe (9.481 sichere Querungen); bis 11/2026 keine Gegenmeldung gefunden |
| 68 | 84 | Ein viel kleineres Tier tötet in Indien rund hundertmal mehr Menschen | grün · ok | Q33 | ~58.000 Schlangenbiss-Tote im Jahr (Schätzung) gegen ~500–630 durch Elefanten (Regierung) |
| 69 | 86 | Gegengift aus dem Blut von Pferden und Schafen | grün · ok | Q34 | – |
| 70 | 88 | Ein Labor ließ eine KI neue Proteine entwerfen, die das Toxin greifen | grün · ok | Q35 | RFdiffusion, Nature 15.1.2025 |
| 71 | 89 | In Mäusen wirkten sie, die meisten überlebten eine tödliche Dosis | grün · ok | Q35 | 80–100 % Überleben gegen Neurotoxine |
| 72 | 90 | Bisher nur Mäuse, nur einzelne Toxine | grün · ok | Q35 | bis 11/2026 keine Ganzgift-Studie gefunden |
| 73 | 93 | Forscher ließen Gläubige mit einer KI streiten | grün · ok | Q36 | 2.190 Teilnehmende |
| 74 | 94 | Gewöhnlicher Chatbot, antwortete auf die eigenen Gründe | grün · ok | Q36 | GPT-4 Turbo, personalisiert |
| 75 | 95 | David Rand, einer der Forscher | grün · ok | Q36, Q42 | Mitautor, heute Cornell |
| 76 | 97 | Nach einem kurzen Gespräch sank der Glaube um etwa ein Fünftel | grün · ok | Q36 | ~20 %, rund 8 Min, drei Runden |
| 77 | 97 | Monate später noch gesenkt | grün · ok | Q36 | zwei Monate |
| 78 | 98 | Die Autoren fanden Fehler selbst; korrigiert hält der Effekt | grün · ok | Q37 | EoC 11.6.2026, Erratum 22.10.2026: Studie 2 −12,84 statt −12,30 Punkte; nur ein Untergruppen-Vergleich fällt |
| 79 | 100 | Neuere Studie, nicht begutachtet, dasselbe Team | gelb · ok | Q38 | arXiv 8./9.1.2026 (Costello, Rand, Pennycook u. a.); bis 11.11.2026 keine Journal-Fassung gefunden |
| 80 | 100 | Chatbot argumentierte für die Verschwörung, Glaube stieg ebenso stark | grün · ok | Q38 | „as effective at increasing conspiracy belief as decreasing it“ (Preprint) |
| 81 | 104 | Die meisten Hochwasser-Toten durch Sturzfluten | gelb · überzogen → K7 | Q39 | WMO uneinheitlich (Tote vs. Fälle) |
| 82 | 104 | Oft wird dort nichts gemessen, die Maschine hat kaum Lernstoff | grün · ok | Q40 | „data desert“ |
| 83 | 106 | Google zog Millionen frühere Fluten aus alten Nachrichten | grün · ok | Q40 | 2,6 Mio. Ereignisse aus >5 Mio. Berichten, mit Gemini; Stadt-Sturzfluten bis 24 h voraus |
| 84 | 107 | Flussvorhersagen schon bis eine Woche voraus | grün · ok | Q41 | bis 7 Tage |
| 85 | 107 | Warnungen in Suche, Maps und als Handy-Hinweis | grün · ok | Q41 | „where possible“ |
| 86 | 111 | Satelliten, Funk, GPS, Chatbot, Nachrichten: für anderes gebaut | grün · ok | Q18, Q25, Q36, Q40 | – |

**Clips, Einblendungen**

| Nr. | Stelle | Aussage | Ampel · Urteil | Quelle | Anmerkung |
|---|---|---|---|---|---|
| 87 | Z. 5 | C3a, Harrell im Hook | offen | – | fehlt in clips.json; 3–4 s sind kürzer als die 4 s aus §7 → B2 |
| 88 | Z. 20 | C1, Quelle und Sprecher | offen | Q8 | Titel und Kanal per oEmbed bestätigt; Datum und Stelle offen (Abschnitt 4) |
| 89 | Z. 19 | C1-Einordnung „This is how he explained the no.“ | offen | Q8 | trägt nur, wenn Jones im Clip Ablehnung oder Datenhoheit erklärt |
| 90 | Z. 57 | C3, Quelle und Stimme | grün · ok | Q23 | Video von 2024, UC Davis Health |
| 91 | Z. 75 | C4, Quelle | grün · ok | Q28 | SVS 5625; Stärke im Bild prüfen |
| 92 | Z. 96 | C5, Quelle und Einordnung | offen | Q42 | Folge vom 10.2.2026; Stelle muss zur Verschwörungsstudie gehören |
| 93 | #11 | Einblendung: 44 min · Persönlichkeiten · TPG ~590,000 · „all figures: the company“ | gelb · ok | Q9, Q11 | Firmenangaben, als solche markiert |
| 94 | #4 | Einblendung (optional): „Kerala … plans the same system“ | gelb · überzogen → B3 | Q32 | plant Indian Railways |
| 95 | #1 | Einblendung Flood Hub „100 Länder/700 Mio. (11/2024)“ | rot · falsch (veraltet) → B1 | Q41 | heute 150+ Länder, 2+ Mrd. Menschen |

**Zeitwörter gegen den 14.11.2026:**
- already (Z. 27, 44, 107, 115): ok.
- still (Z. 48, 77, 86): ok.
- now (Z. 26): ok.
- now (Z. 58): → M4.
- so far / not yet (Z. 58, 90, 100): ok, Z. 100 vor dem Upload neu prüfen.
- since it went live (Z. 83): ok.
- the year before (Z. 48): → M3.
- months later / later / newer (Z. 97, 98, 100): ok.

---

## 4. Clips C1, C3, C4, C5: Plausibilität und Download-Prüfliste

Wortlaute, Zeitmarken und Musik bleiben ungeprüft, weil Watch-Seite und Untertitel gesperrt sind (Bot-Prüfung). Titel und Kanal sind per oEmbed bestätigt, die Länge per yt-dlp-Suchliste.

| Clip | Quelle (bestätigt) | Plausibilität | Beim Download prüfen |
|---|---|---|---|
| **C1** luhHNVjhGfk | „Accelerating the revitalisation of te reo Māori with AI \| AI FOR GOOD WEBINARS“, Kanal AI for Good (ITU), 7.199 s (1:59:59) | **Gelb.** Der ITU-Hub-Bericht 08/2022 zitiert Jones und Mahelona von „a recent AI for Good webinar“, wohl dieses. Die Beschreibung beginnt aber mit „Large language models are all the rage…“, das Datum ist also nicht bestätigt. Zeitmarken: keine. | Upload-Datum, daraus das Jahr für die Bauchbinde. Die Stelle muss **Jones** sein, nicht Mahelona. Ist „We know what it means losing sovereignty. Data is the new land.“ wörtlich so gesagt? Erklärt der Satz die Ablehnung (±30 s Kontext), sonst passt „This is how he explained the no“ nicht. 4–15 s, keine Musik, keine Moderation darüber. Wenn nichts passt: Zitatkarte „ITU Hub, Aug. 2022“. |
| **C3** thPhBDVSxz0 | „New Brain-Computer Interface (BCI) Allows Man with ALS to 'Speak' Again Using Brain Implant and AI“, UC Davis Health, 287 s (4:47); Beschreibung verlinkt das Update von 2026 (fS4Hb8qjiOU) | **Grün.** Zum NEJM-Artikel 8/2024. UC Davis: Die Wörter wurden „in a voice that sounded like Harrell's before ALS“ vorgelesen. | Eine Stelle, an der nur die **BCI-Stimme** spricht, nicht seine eigene ALS-Stimme und kein Sprecher darüber. **Musikbett unter der Stimme?** Dann nach §7 nur Zitatkarte. Der Bildschirmtext sollte lesbar sein. C3 + C3a ≤ 20 s, C3a ≥ 4 s, beide mit Bauchbinde 2024. 2024 war die Stimme Text-zu-Sprache nach dem Dekodieren, nicht Echtzeit. |
| **C4** rYBX59epPxI | „GUARDIAN Warns Hawaii Early of Incoming Kamchatka Tsunami“, NASA Scientific Visualization Studio, 44 s; Beschreibung „GUARDIAN is a near-real-time ionospheric monitoring software system…“ | **Grün.** Gemeinfrei, stumm unter dem Sprechertext. | Ausschnitt mit Hawaii bzw. Station KOKB. **Eingeblendete Stärke:** Die SVS-Seite 5625 schreibt M8,5, sonst gilt M8,8 → Ausschnitt ohne Zahl oder mit 8,8. Eine eingeblendete Zeit muss zu „half an hour“ passen (32 min). Das „Warns“ aus dem Titel nicht in Bauchbinde oder Text übernehmen, es war keine amtliche Warnung. NASA-Logo nicht als Empfehlung zeigen. Bessere Qualität von svs.gsfc.nasa.gov/5625 (hochkant: 5626). |
| **C5** 5s1IuQe311I | „Scaling Laws: The Persuasion Machine: David Rand on How LLMs Can Reshape Political Beliefs“, Lawfare, 3.349 s (55:49) | **Gelb.** Folge vom 10.2.2026 mit Alan Rozenshtein und Renée DiResta. Lawfare nennt Rand Professor an der **Cornell University**. Die Shownotes nennen die Science-Studie 2024, eine passende Stelle ist also wahrscheinlich vorhanden. | Die Stelle muss die **Verschwörungsstudie** betreffen, nicht die Wahl-Überzeugungsstudien (Nature/Science 2025), sonst stimmt „on why it worked“ nicht. Die Aufnahme ist älter als EoC und Erratum: Nennt Rand Zahlen, müssen sie zum Sprechertext passen (~20 %). Kein Intro-Musikbett. Echtes Video oder Standbild? Bauchbinde: DAVID RAND · Cornell University · co-author, DebunkBot study · ORIGINAL FOOTAGE (Lawfare, 2026). |

Bei allen Clips weiter offen: in/out, transcript, kontext ±30 s, musik und sinn_erhalten in clips.json nachtragen (iMac-Schritt). Danach `clip_check.py`.

---

## 5. Offene Punkte

1. **Clips:** Wortlaute, Zeitmarken und Musik nur über den iMac-Schritt. C3a nachtragen (B2).
2. **Am 13./14.11. vor dem Upload erneut prüfen:**
   - Hat arXiv 2601.05050 inzwischen eine Journal-Fassung? Dann wird „not yet peer-reviewed“ falsch, und Z. 100 lautet: „In a newer study, the same team flipped it: …“.
   - UNEP: Kommt zur COP31 (Antalya, ab 9.11.2026) ein neues „Eye on Methane“, oder nennt der MARS-Snapshot 10/2026 eine Gesamtquote? Liegt die Quote deutlich über 15 %, lautet Z. 48: „Most alerts still get no answer.“
   - Madukkarai: Gibt es eine neue Meldung über einen getöteten Elefanten?
3. **Gesperrte Primärseiten:** Alle Urteile beruhen auf Suchauszügen. Stichproben im Browser lohnen sich: Q14 (Reanalyse), Q19 (MARS Algeria), Q21 (UNEP 6/2026), Q27 (JPL), Q37 (Erratum).
4. **Te Hiku „no tech giant had“** bleibt ein Schluss (gelb). Eine frühere Māori-Spracherkennung eines Konzerns wurde nicht gefunden. Taucht doch eine auf, gilt die Ersatzzeile aus text-v4: „something no machine could do yet“.
5. **Länge:**
   - vo-v5 hat 1.515 Wörter (regel_check), 45 mehr als v4.
   - 31 davon sind die früheren O-Ton-Zeilen, die vorher nicht mitgezählt wurden. Die Sprechzeit ändert sich dadurch kaum.
   - M1 kostet +13 Wörter. K7 und K2 würden wieder kürzen.

---

## 6. Quellen

- Q1 NeurIPS 2020, Te Hiku: https://neurips.cc/virtual/2020/20652
- Q2 NVIDIA-Blog: https://blogs.nvidia.com/blog/te-hiku-media-maori-speech-ai/
- Q3 Google „Say It Tika“ 2017: https://www.teaonews.co.nz/2022/05/16/google-fails-to-deliver-campaign-promise-to-fix-maori-pronunciation-on-google-maps/ · https://www.rnz.co.nz/news/top/531303/why-google-maps-can-t-pronounce-maori-place-names
- Q4 1News 27.8.2018, Lionbridge: https://www.1news.co.nz/2018/08/27/free-te-reo-language-software-developer-upset-about-multinationals-forays
- Q5 Big-Tech-Anfragen abgelehnt, Kaitiakitanga: https://thespinoff.co.nz/atea/29-07-2022/indigenous-data-sovereignty-will-make-the-internet-a-better-place-for-maori · https://thefuturescentre.org/?p=8055
- Q6 RNZ 3/2018, Kōrero Māori über die Webseite: https://www.rnz.co.nz/news/te-manu-korihi/352075/siri-kei-te-pehea-te-ahua-o-te-rangi
- Q7 TIME100 AI 2024: https://time.com/7012841/peter-lucas-jones/
- Q8 ITU Hub 08/2022: https://www.itu.int/hub/2022/08/ai-indigenous-languages-maori-te-reo/
- Q9 Apate, Picknick: https://www.forbes.com.au/covers/magazine/how-a-sydney-professor-built-an-ai-army-to-scam-the-scammers/ · https://www.yourlifechoices.com.au/life/the-picnic-phone-call-that-sparked-a-very-sneaky-revenge/
- Q10 Macquarie 6/2023 (40 Min): https://lighthouse.mq.edu.au/article/june-2023/scamming-the-scammers
- Q11 TechCrunch 14.10.2026, GSMA: https://techcrunch.com/2026/10/14/apate-sends-ai-agents-undercover-to-get-scammed-so-they-can-gather-fraud-intelligence/ · https://www.gsma.com/solutions-and-impact/technologies/security/scams/gsma_study/apate-ai-powered-scam-detection-diversion-and-real-time-threat-intelligence
- Q12 McClure et al. 2021, J Appl Ecol: https://doi.org/10.1111/1365-2664.13831
- Q13 McClure et al. 2022 (−85 %): https://pubs.usgs.gov/publication/70236273
- Q14 Huso & Dalthorp 2023, Reanalyse, und Antwort: https://doi.org/10.1111/1365-2664.14196 · https://pubs.usgs.gov/publication/70248352 · https://doi.org/10.1111/1365-2664.14490
- Q15 McClure et al. 2018 (0,4 s), PLOS ONE 2023: https://tethys.pnnl.gov/sites/default/files/publications/McClure-et-al-2018.pdf · https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0278754
- Q16 Sakai et al., PNAS 2024: https://www.pnas.org/doi/10.1073/pnas.2407652121 · https://heise.de/-9958445
- Q17 UNEP Methan: https://www.unep.org/en/explore-topics/energy/facts-about-methane
- Q18 MARS-S2L: https://arxiv.org/abs/2511.21777
- Q19 UNEP MARS Algeria: https://wedocs.unep.org/bitstream/handle/20.500.11822/46567/MARS_Algeria.pdf?sequence=3 · https://www.unep.org/en/news-and-stories/story/technology-helping-reduce-methane-emissions-more-action-needed
- Q20 Data Desk (Ventil): https://blog.datadesk.eco/p/algeria-methane
- Q21 UNEP 23.6.2026, UN News 7/2026 (13 %): https://www.unep.org/news-and-stories/press-release/unep-partners-ramp-efforts-address-major-methane-leaks-un-chief · https://news.un.org/en/story/2026/07/1168007
- Q22 Eye on Methane 2024 (~1 %) und 2025 (12 %): https://unep.org/interactives/eye-on-methane-2024 · https://www.unep.org/en/news-and-stories/press-release/better-data-driving-action-methane-emissions-more-work-needed
- Q23 UC Davis 8/2024 (NEJM): https://health.ucdavis.edu/welcome/news/headlines/new-brain-computer-interface-allows-man-with-als-to-speak-again/2024/08
- Q24 UC Davis 6/2026 (Nature Medicine, doi 10.1038/s41591-026-04414-6): https://health.ucdavis.edu/news/headlines/brain-computer-interface-enables-independent-accurate-communication-for-man-living-with-als/2026/06
- Q25 Paolo et al., Nature 2024: https://www.nature.com/articles/s41586-023-06825-8
- Q26 McDonald et al., PNAS 2020/21, Kritik 2021: https://www.pnas.org/doi/10.1073/pnas.2016238117 · https://www.pnas.org/doi/10.1073/pnas.2100341118
- Q27 JPL: https://www.jpl.nasa.gov/news/nasas-guardian-tsunami-detection-tech-catches-wave-in-real-time/
- Q28 NASA SVS 5625 und NASA-Feature: https://svs.gsfc.nasa.gov/5625/ · https://www.nasa.gov/science-research/earth-science/see-nasas-guardian-catch-a-tsunami/
- Q29 TN-Regierung 9.2.2024: https://kygcms.tn.gov.in/cms_migrated/document/press_release/pr090224_e_258.pdf
- Q30 DT Next (9.481, null Tote), newkerala 7/2026: https://www.dtnext.in/news/tamilnadu/ai-powered-elephant-alert-system-enables-9481-safe-crossings-records-zero-train-track-deaths · https://www.newkerala.com/news/a/ai-surveillance-helps-prevent-elephant-deaths-coimbatore-railway-472.htm
- Q31 Ablauf Leitstand → Lokführer: https://thesouthfirst.com/news/tn-forest-department-implements-ai-surveillance-system-to-prevent-elephant-deaths/
- Q32 Onmanorama 3.11.2026: https://www.onmanorama.com/news/kerala/2026/11/03/ai-alerts-underpasses-planned-to-make-walayar-tracks-safer-for-elephants.html
- Q33 eLife 2020, Elefanten-Tote (Regierung): https://elifesciences.org/articles/54076 · https://www.newsdrum.in/national/over-2800-killed-in-elephant-attacks-in-india-from-2019-to-2023-govt-9535579
- Q34 WHO Schlangenbiss: https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming
- Q35 Vázquez Torres et al., Nature 2025: https://www.nature.com/articles/s41586-024-08393-x · https://www.ipd.uw.edu/2025/01/neutralizing-deadly-snake-toxins
- Q36 Costello, Pennycook, Rand, Science 2024: https://www.science.org/doi/10.1126/science.adq1814
- Q37 Erratum 22.10.2026, EoC 11.6.2026: https://www.science.org/doi/10.1126/science.aem1178 · https://retractionwatch.com/2026/06/11/science-ai-chatbots-debunk-conspiracy-theories-expression-of-concern/
- Q38 Preprint „bunking“: https://arxiv.org/abs/2601.05050
- Q39 WMO: https://wmo.int/media/news/flash-flood-guidance-system-saves-lives · https://wmo.int/media/news/devastating-floods-highlight-need-and-challenges-warnings
- Q40 Google Groundsource: https://research.google/blog/introducing-groundsource-turning-news-reports-into-data-with-gemini/
- Q41 Google Flood Forecasting: https://sites.research.google/floodforecasting · https://research.google/blog/protecting-cities-with-ai-driven-flash-flood-forecasting/
- Q42 Lawfare, 10.2.2026: https://www.lawfaremedia.org/article/scaling-laws--the-persuasion-machine--david-rand-on-how-llms-can-reshape-political-beliefs
