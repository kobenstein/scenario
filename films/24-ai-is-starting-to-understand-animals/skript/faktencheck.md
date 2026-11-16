# Faktencheck „AI Can Now Hear What Animals Feel“ (vo-v4 → vo-v5), Stand 9.11.2026

**Prüfrahmen:** Geprüft ist `vo-v4.txt` (von Jakob freigegeben, mit dem neuen Hook und der Deutschland-Zeile von heute). Upload ist Do 12.11.2026, alle Zeitwörter sind gegen dieses Datum geprüft:
- „only a few years away/off“: bis 2030 sind es gut drei (Anfang 2030) bis gut vier Jahre (Ende 2030). Stimmt.
- „This past summer“: Sommer 2026. Island fing die ersten Finnwale in der Nacht 21./22.6.2026, die Saison lief bis in den September. Gilt bis Sommer 2027.
- „now“ (Deutschland): BMLEH-Ernährungsreport 2025, vorgestellt am 27.11.2025. Er ist die neueste Ausgabe; einen Report 2026 gibt es noch nicht.
- „for four decades“: Wild Dolphin Project seit 1985, also 41 Jahre.
- „Twelve years later“: 1970 → 1982.
- „has joined in“: DolphinGemma seit 14.4.2025.
- „still unclaimed“: Stand 11/2026.
- „admits“: AP, 15.1.2025.

**Methode:** Direktabrufe sind in dieser Sitzung gesperrt.
- WebFetch scheitert mit ENOTFOUND an www.bmleh.de und www.tageskarte.io. Laut Werkzeug liegen sie außerhalb der erlaubten Netzdomänen; danach habe ich keine weiteren WebFetch-Versuche gemacht.
- curl über den Proxy bekommt 403 bei bmleh.de, earthspecies.org, nature.com, peerj.com, export.arxiv.org, api.crossref.org, Europe PMC, en.wikipedia.org und bmel-statistik.de.
- Erreichbar war nur YouTube oEmbed. Darüber habe ich Titel und Kanal der Clip-Videos bestätigt.

Jede Aussage ist deshalb über Suchauszüge (WebSearch) aus dem Index der Originalseiten geprüft, wo möglich gegen zwei unabhängige Wiedergaben. arxiv-Papers (AVES 2210.14493, NatureLM 2411.07186) sind nur über Suchauszüge, OpenReview und das ICASSP-Video von ESP gelesen (Ersatzquellen). Die Belegtabelle in `text-v4.md` habe ich nicht übernommen, sondern gegengeprüft.

**Urteile:**
- BELEGT
- ÜBERDEHNT: ein Wort oder eine Zuschreibung zu stark
- FALSCH
- DÜNN: nur eine Quelle, nur Firmenangabe, Einzelfall, oder der Clip ist noch nicht abgehört

Deutung, Frage und Szenario sind nicht gezählt (Sammelzeile am Ende von Abschnitt 3).

**Ergebnis:** 67 Tatsachenaussagen geprüft: **56 BELEGT, 4 ÜBERDEHNT, 0 FALSCH, 7 DÜNN.** Fünf der sieben DÜNN-Stellen sind Clip-Ansagen, die erst nach dem Abhören durch den Clip-Agenten belegt sind.
- Daraus folgen **4 MUSS-Änderungen**. Sie sind in `vo-v5.txt` eingearbeitet; die Wortzahl bleibt gleich (1.409 laut Prüfskript).
- Dazu kommen **5 KANN-Vorschläge**, nicht eingearbeitet.
- Die deutschen Zahlen stimmen mit dem Ernährungsreport 2025 überein, auch die Altersgruppe (14–29 Jahre: 20 %, Abschnitt 5).
- Einen verschwiegenen Interessenkonflikt gibt es nicht (Abschnitt 6).
- Alle [prüfen]-Punkte aus `text-v4.md` sind in Abschnitt 4 abgearbeitet.
- Ampel: `ampel/ampel.html` zeigt die 10 heikelsten Aussagen (6 grün, davon 4 erst nach M1–M4; 4 gelb; 0 rot) und die Clip-Hinweise C1–C5. Dieselben 10 Sätze im Wortlaut von vo-v5 stehen für den Zweitprüfer in `ampel/aussagen.json`.

---

## 1. MUSS-Änderungen (in vo-v5.txt eingearbeitet)

| Nr. | Zeile | Alt | Neu | Grund | Quelle |
|---|---|---|---|---|---|
| M1 | 57 | **Their A.I. found** that the clicks are built from a few parts, like rhythm and tempo. | **They found** that the clicks are built from a few parts, like rhythm and tempo. | **Zuschreibung zu stark.** Das Pottwal-„Alphabet“ (Rhythmus, Tempo, Rubato, Ornament) kam laut MIT aus „new visualization and data analysis techniques“. Mitautor Jacob Andreas schrieb die Ergebnisse den „really good visualizations“ von Pratyusha Sharma zu, nicht dem „very simple“ Algorithmus (The Register, 9.5.2024). „Their A.I. found“ macht daraus eine KI-Entdeckung. Der Befund selbst ist belegt (8.719 Codas, Zeile 58). −1 Wort. | https://www.nature.com/articles/s41467-024-47221-8 · https://news.mit.edu/2024/csail-ceti-explores-sperm-whale-alphabet-0507 · https://www.theregister.com/2024/05/09/ai_whale_language/ |
| M2 | 65 | …zebra finches sort their calls **by meaning, not by sound.** | …zebra finches sort their calls **by meaning more than by sound.** | **Ein Wort zu stark.** Die Finken unterscheiden alle rund 11 Ruftypen akustisch. Ihre Verwechslungen folgen aber eher dem gemeinsamen Verhaltenskontext, als die akustische Ähnlichkeit erwarten lässt (Elie, Theunissen u. a., *Science* 389:1210, 18.9.2025). Die Coller-Stiftung schreibt „according to meaning more so than acoustics“. „Not by sound“ bestreitet den Klang ganz. „Couch/sofa“ (Zeile 66) passt weiter. +1 Wort. | https://doi.org/10.1126/science.ads8482 · https://www.jeremycollerfoundation.org/news-and-insights/press-releases/scientists-win-us100-000-in-2026-coller-dolittle-prize |
| M3 | 68 | They can **pick out** names, feelings, even what's going on. | They can **pick up on** names, feelings, even what's going on. | **Ein Wort zu stark, dazu ein Widerspruch zur Folgezeile.** Bei den Elefanten sagte ein Random Forest den Empfänger eines Rufs in gut einem Viertel der Fälle richtig voraus (Wiedergabe: 27,5 % gegen 8 % Zufall). Den „Namen“ selbst hat niemand im Ruf isoliert. Die Chor-Kontexte erkennt die ESP-A.I. nur besser als Zufall. „Pick out names“ klingt, als höre die Maschine den Namen heraus. Dann könnte sie sagen, wen ein Ruf meint, und das widerspricht Zeile 69 („Not one of them can tell you what a single call says.“). „Pick up on“ heißt: Sie bemerkt die Spur. +1 Wort. | https://www.nature.com/articles/s41559-024-02420-w · https://www.nature.com/articles/s41598-026-68525-3 |
| M4 | 73 | Sounds their parents understand **instantly**: upset, hungry, calling for Mom or Dad. | Sounds their parents understand: upset, hungry, calling for Mom or Dad. | **Unbelegtes Verstärkerwort.** Die Studie (Taub, Arnon, Ilany, Knörnschild, Ram, Yovel, *Current Biology* 2026) nimmt Kleinkind-Laute, weil Menschen sie „at least partially“ verstehen (TAU/EurekAlert). „Instantly“ steht in keiner Quelle und ist stärker als „teilweise“. Die drei Kontexte stimmen: Not, nach Mama oder Papa rufen, Essen verlangen. −1 Wort. | https://www.cell.com/current-biology/abstract/S0960-9822(26)00810-9 · https://www.eurekalert.org/news-releases/1144253 |

Sonst ist `vo-v5.txt` identisch mit `vo-v4.txt`. Unverändert sind alle Marker (2 × SOUND, 5 × CLIP, 3 × pause), beide Abo-Aufrufe und der Hook.

---

## 2. KANN-Änderungen (nicht eingearbeitet, Entscheidung Texter/Jakob)

| Nr. | Zeile | Alt | Vorschlag | Grund | Quelle |
|---|---|---|---|---|---|
| K1 | 48 | …and could **often** read the room… | …and could **sometimes** read the room… | Der Kontext ist besser als Zufall erkennbar, laut Auszügen aber nur mäßig genau; im Chor wurden Let's-Go-Rumbles nur zu 4 % richtig erkannt, Begrüßungen dagegen gut. Die genauen Werte konnte ich nicht lesen (nature.com gesperrt). Für „often“ spricht, dass das Beispiel „a greeting“ der gut erkannte Fall ist. Gleiche Wortzahl. | https://www.nature.com/articles/s41598-026-68525-3 |
| K2 | 61 | …recordings **one scientist** has made for four decades. | …recordings **one scientist's team** has made for four decades. | Es ist das Archiv des Wild Dolphin Project (seit 1985, Team unter Denise Herzing). „She“ in Zeile 62 bleibt richtig. +1 Wort. | https://blog.google/innovation-and-ai/products/dolphingemma/ |
| K3 | 60 | **Nearby,** in the Bahamas… | **Up north,** in the Bahamas… | Von Dominica zu den Bahamas sind es rund 1.900 km (offener Punkt 5 in `text-v4.md`). +1 Wort. | – |
| K4 | 115 | Near ships, sperm whales already change their calls. | Near ships **in the Caribbean,** sperm whales already change their calls. | Der Befund stammt von 13 Pottwalen vor Dominica, nicht aus Neuseeland. Im Neuseeland-Block kann man ihn falsch zuordnen. +3 Wörter. Mindestens die REAL-Karte um DOMINICA ergänzen (Abschnitt 7). | https://doi.org/10.1016/j.ecoinf.2026.103881 |
| K5 | 36 | So **the team** clips tiny recorders onto wild animals. | So **the team and its partners** clip tiny recorders onto wild animals. | Die Krähen-Tags hat die Universität León angebracht; ESP lieferte die Auswertung (Voxaboxen). Zeile 50 („With a local university“) sagt es richtig. +3 Wörter. | https://link.springer.com/article/10.1007/s10071-025-02018-0 |

---

## 3. Vollständige Aussagen-Tabelle

Die Zeilennummern sind in `vo-v4.txt` und `vo-v5.txt` gleich.

| Nr. | Zeile | Aussage (Kurzform) | Status | Befund | Quelle(n) |
|---|---|---|---|---|---|
| 1 | 1 | Forscher versuchen zu übersetzen, was Tiere sagen | BELEGT | Project CETI heißt „Cetacean Translation Initiative“; ESP will „decode non-human communication“. | https://www.projectceti.org/ · https://earthspecies.org/faq |
| 2 | 2 | Der erste Schritt klappt: A.I. hört, was sie fühlen | BELEGT (Hinweis) | „Feel“ heißt hier gute oder schlechte Stimmung (Valenz), keine einzelnen Gefühle. Schweine: 91,5 % (Briefer 2022). Sieben Huftierarten: 89,5 % (Lefèvre, Sypherd, Briefer, *iScience* 2025). Die Etiketten stammen aus dem Kontext der Aufnahme (z. B. Säugen gegen Kastration). Das Titelversprechen ist gedeckt, die Zuspitzung bleibt. | https://www.nature.com/articles/s41598-022-07174-8 · https://www1.bio.ku.dk/english/news/2024-2025/ai-unlocks-the-emotional-language-of-animals |
| 3 | 4–8 | Zwei Schweine: ruhiges, tiefes Grunzen positiv, hohes Quieken negativ | BELEGT | Hohe Laute (Schreie, Quieken) kamen häufiger in negativen Situationen, tiefe in beiden. Für den Hook zwei echte, beschriftete Laute aus dem Studien-Datensatz nehmen. Laut Author Correction 2023 liegt er als beschriftete Audio-Datenbank auf Zenodo; die Lizenz ist offen. | https://www.sciencedaily.com/releases/2022/03/220307082325.htm · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10620233/ |
| 4 | 9–10 | A.I. trifft „nine times out of ten“ | BELEGT | Neuronales Netz auf Spektrogrammen: 91,5 % für die Valenz, 81,5 % für den Kontext (klassisches Verfahren: 61,7 %). | https://www.nature.com/articles/s41598-022-07174-8 |
| 5 | 11 | „Feelings, yes. Words, not yet.“ | BELEGT | Stand 11/2026 ist kein Tierruf belegt übersetzt; der Coller-Hauptpreis ist unvergeben. | https://phys.org/news/2026-09-ai-struggles-decipher-animal-language.html |
| 6 | 12 | Ein kleines Team in Kalifornien | BELEGT | Sitz Berkeley (Oxford Street). AP 1/2025: Das Forschungsteam hat rund 7 Personen und soll sich mindestens verdoppeln. Aggregatoren 2025/26: 21–39 Beschäftigte auf mehreren Kontinenten. „Small“ bleibt vertretbar. | https://phys.org/news/2025-01-ai-humans-animals-reconnect-nature.html · https://www.forbes.com/sites/phoebeliu/2024/10/17/this-nonprofit-wants-to-use-ai-to-understand-animal-communicationand-two-billionaires-are-backing-it/ |
| 7 | 12 | „For every species on Earth“ | BELEGT als Ziel (Zuspitzung) | ESP baut „species-agnostic“ Basismodelle („the GPT-4's of animal communication“); das Ziel ist nichtmenschliche Kommunikation allgemein. „Every species“ steht so nicht bei ESP. | https://earthspecies.org/2024/10/17/earth-species-project-secures-17m-in-grants-to-apply-frontier-ai-to-decoding-animal-communication/ |
| 8 | 13 | Ziel: Durchbrüche bis 2030 | BELEGT | ESP: „an ambitious fundraising effort to fuel AI-driven breakthroughs in animal communication by 2030“. Es ist das Ziel einer Spendenkampagne, kein Versprechen. | wie 7 |
| 9 | 15–17 | Ruf einer nie gehörten Art → richtige Art, nicht immer, aber weit öfter als Zufall | BELEGT (Firmenangabe, peer-reviewed) | NatureLM-audio. Im ESP-Blog: 20 % bei der Wahl unter 200 nie gehörten Arten (Zufall 0,5 %). Im Paper (ICLR 2025, arXiv v2): 34,3 % gegen 0,5 %. Das Modell wählt aus einer Liste von Artnamen. Im Off steht keine Zahl. | https://earthspecies.org/2024/11/11/introducing-naturelm-audio-an-audio-language-foundation-model-for-bioacoustics/ · https://arxiv.org/abs/2411.07186 |
| 10 | 18–19 | Einer der Gründer erfand den Infinite Scroll | BELEGT | Aza Raskin, 2006; ESP hat er 2017 mitgegründet. „Probably used today“ ist Deutung. | https://mastersofscale.com/video/he-invented-infinite-scroll-and-says-he-regrets-it/ · https://time.com/6240144/aza-raskin-ai-animals-social-media |
| 11 | 20 | Er baut jetzt A.I., die Tieren zuhört | BELEGT | Raskin ist Mitgründer und laut GuideStar (3/2026) Präsident. CEO ist seit 3/2026 Steven VanRoekel. | https://www.guidestar.org/profile/82-5167508 · https://earthspecies.org/2026/03/04/introducing-earth-species-projects-new-ceo/ |
| 12 | 21 | Nicht zum Plaudern mit dem Hund, sondern um zu verstehen, was Tiere einander sagen | BELEGT | Jane Lawton (ESP) laut AP: Ziel ist kein „translator that will allow us to speak to other species“. Hinweis: Mit McGill testet ESP im Labor A.I.-Antworten an Zebrafinken. | https://phys.org/news/2025-01-ai-humans-animals-reconnect-nature.html |
| 13 | 22 | „Here he is.“ (C1) | DÜNN (offen) | Raskin muss im Ausschnitt selbst sprechen. Prüft der Clip-Agent (Abschnitt 8). | https://www.youtube.com/watch?v=4Id5aTlYkHg |
| 14 | 24 | 10 Mio. $ vom LinkedIn-Mitgründer | BELEGT | Reid Hoffman über seine Aphorism Foundation; dazu 7 Mio. $ von der Waverley Street Foundation, 17.10.2024. | wie 7 · Forbes (wie 6) |
| 15 | 26–28 | Ein Baby bekommt keine Wortliste, hört monatelang zu und merkt, welche Laute wiederkehren und zusammengehören | BELEGT (vereinfacht) | Saffran, Aslin, Newport, *Science* 274:1926 (1996): 8 Monate alte Babys finden nach 2 Minuten Hören Wortgrenzen aus der Silbenstatistik. | https://pubmed.ncbi.nlm.nih.gov/8943209/ |
| 16 | 30–31 | Die A.I. des Teams hört einen Berg Aufnahmen ohne Bedeutung, verdeckt Stücke und rät | BELEGT | AVES (Hagiwara, ESP; ICASSP 2023): selbstüberwacht und HuBERT-basiert, sagt maskierte Stücke in unannotiertem Audio voraus. arxiv ist gesperrt, gelesen über Suchauszug und ESP-Video. | https://arxiv.org/abs/2210.14493 · https://www.youtube.com/watch?v=9i-_CEhoCzw |
| 17 | 33 | Muster erscheinen: Rufe, die wiederkehren und zusammengehören | BELEGT (vereinfacht) | So arbeiten selbstüberwachte Einbettungen (`recherche-v1.md` A8). | wie 16 |
| 18 | 34–35 | Die Maschine sieht nicht, worum es geht | BELEGT | Es sind reine Audio-Modelle. Taub 2026: Bedeutung braucht Verhaltensbeobachtung, Playbacks und teils Hirnmessung. | https://www.eurekalert.org/news-releases/1144253 |
| 19 | 36–37 | Das Team klemmt winzige Rekorder an wilde Tiere: Ruf plus Verhalten | BELEGT (→ K5) | 52 MiniDTAGs (Mikrofon, Beschleunigungs-, Magnet- und Drucksensor) an wilden Rabenkrähen. Angebracht hat sie die Universität León, ausgewertet wurde mit ESP. | https://link.springer.com/article/10.1007/s10071-025-02018-0 |
| 20 | 39 | 2030 ist nur noch wenige Jahre entfernt | BELEGT | Bei Upload 3 bis 4 Jahre. | – |
| 21 | 41 | Andere Forscher fanden in Kenia: Elefanten rufen einander beim Namen | BELEGT | Pardo, Wittemyer u. a., *Nat. Ecol. Evol.* 8:1353 (10.6.2024): „name-like calls“, 469 Rumbles aus Samburu und Amboseli. ESP war nicht beteiligt. | https://www.nature.com/articles/s41559-024-02420-w |
| 22 | 42 | Playback: Sie antwortet schneller und geht zum Lautsprecher | BELEGT | 17 Elefanten gingen auf den Lautsprecher zu und riefen „significantly faster“ zurück, wenn der Ruf ihnen galt. Die Mittelwerte (128 s, 87 s, 2,3×) sind nicht bestätigt, werden aber nicht gesprochen. | wie 21 · https://scienceblog.com/t-elephants-name-like-rumbles-playback/ |
| 23 | 43 | „They caught it on camera.“ (C2) | DÜNN (offen) | CSU-Video MXITyX9PPJM „Scientists Call Elephant by Name, and She Calls Back“; die Videos stammen laut CSU von Pardo, Wittemyer und Bend. Ob es ein Playback mit Antwort zeigt, prüft der Clip-Agent. | https://www.youtube.com/watch?v=MXITyX9PPJM · https://newsmediarelations.colostate.edu/2024/06/10/elephants-have-names-for-each-other-like-people-do-new-study-shows/ |
| 24 | 46 | Auch in Kenia ging das ESP weiter | BELEGT („further“ = Deutung) | Mahon, Pardo, Miron, Chemla, Granli, Njiraini, Moss, Keen, Poole, *Sci. Rep.* 16:27961 (1.10.2026), ESP mit ElephantVoices. Pardo, Poole, Granli und Moss stehen auch auf der Namen-Studie. | https://www.nature.com/articles/s41598-026-68525-3 · https://earthspecies.org/2026/10/01/new-study-machine-learning-reveals-that-elephant-choruses-encode-behavior/ |
| 25 | 47 | Elefantenfamilien rumpeln oft gleichzeitig | BELEGT | 902 Aufnahmen von Einzel- und Chor-Rumbles, 84 Elefanten, 39 Familien, Amboseli. Smithsonian: „often produce choruses“. | wie 24 · https://www.smithsonianmag.com/smart-news/african-elephants-often-produce-choruses-of-low-pitched-rumbles-now-scientists-are-using-ai-to-decode-the-joint-vocalizations-180989620/ |
| 26 | 48 | A.I. hörte den ganzen Chor und konnte oft die Lage lesen: Begrüßung, Kalb trösten | DÜNN (→ K1) | Die Chöre wurden als Ganzes analysiert, ohne Einzelrufe zu trennen. Unter den sechs Kontexten sind Begrüßung und „comforting and reassuring calves“ (Coo-Rumble). Der Kontext war besser als Zufall erkennbar, laut Auszügen aber nur mäßig genau; Let's-Go-Rumbles wurden im Chor nur zu 4 % richtig erkannt. | wie 24 · https://www.elephantvoices.org/the-elephant-ethogram/coo-rumble |
| 27 | 50 | Mit einer örtlichen Universität kamen die Rekorder an wilde Krähen | BELEGT | Universität León (Baglione, Canestrari): drei Brutzeiten, frei lebende, kooperativ brütende Rabenkrähen in Nordspanien. | wie 19 |
| 28 | 51 | Über 100.000 Rufe, viele leise Familien-Murmler, die normale Mikrofone verpassen | BELEGT | Über 127.000 Rufe erwachsener Krähen (Voxaboxen, ESP), dazu Küken. Laut Studie verpassen „traditional directional microphones“ meist die Nahrufe; ESP: „from quiet murmurs to long-distance signals“. *Animal Cognition*, online 29.10.2025. | wie 19 · https://earthspecies.org/2025/12/15/unlocking-avian-secrets-how-tiny-biologgers-are-revealing-the-hidden-communication-of-carrion-crows/ |
| 29 | 52 | Jeder Ruf kommt mit dem, was der Vogel gerade tat | BELEGT | Der Tag zeichnet Bewegung, Magnetfeld und Druck mit auf. „Comes with“ beschreibt die Daten, kein Ergebnis. | wie 19 |
| 30 | 53 | Die Schweine: ein anderes Team, auch in Europa | BELEGT | Geleitet von der Universität Kopenhagen (Briefer), mit ETH Zürich, INRAE und anderen. | https://science.ku.dk/english/press/news/2022/pig-grunts-reveal-their-emotions/ |
| 31 | 54 | Tausende Rufe, von der Geburt bis zur Schlachtung | BELEGT | 7.414 Laute von 411 Schweinen. | wie 4 |
| 32 | 56 | In der Karibik hört ein anderes Team Pottwalen zu | BELEGT | Project CETI vor Dominica. | https://www.projectceti.org/ |
| 33 | 57 | Ihre A.I. fand Bausteine wie Rhythmus und Tempo | ÜBERDEHNT → M1 | Siehe M1. | siehe M1 |
| 34 | 58 | Gemischt ergeben sie viel mehr Ruf-Arten als erwartet | BELEGT | „Nearly an order of magnitude“ mehr unterscheidbare Codas (die Autoren laut ABC News). Vorher waren beim Ostkaribik-Clan 21 Coda-Typen bekannt. | https://abcnews.com/International/sperm-whales-communicate-complex-phonetic-alphabet-study-finds/story?id=110033871 |
| 35 | 60 | Google auf den Bahamas: Autovervollständigung mit Delfinlauten | BELEGT (→ K3) | DolphinGemma (14.4.2025, mit Georgia Tech und dem WDP) sagt den wahrscheinlich nächsten Laut voraus. Dass die Gewichte offen veröffentlicht sind, ist nicht bestätigt; das wird nicht gesprochen. | https://blog.google/innovation-and-ai/products/dolphingemma/ |
| 36 | 61 | Gelernt aus Aufnahmen, die eine Forscherin seit vier Jahrzehnten macht | BELEGT (vereinfacht, → K2) | Das WDP forscht seit 1985 unter Herzing; rund 40 Jahre Audio und Video von Atlantischen Fleckendelfinen. | wie 35 · https://www.smithsonianmag.com/smart-news/google-is-training-a-new-ai-model-to-decode-dolphin-chatter-and-potentially-talk-back-180986434/ |
| 37 | 62–63 | „Here's what she hopes for.“ (C3) | DÜNN (offen) | Den Wortlaut „The goal would be to one day speak Dolphin“ gibt es bisher nur aus der Presse; das Google-Video 1bgL4b7VT8M hat einen Hype-Titel. Prüft der Clip-Agent. | https://www.youtube.com/watch?v=1bgL4b7VT8M · https://www.entrepreneur.com/business-news/google-uses-dolphingemma-ai-to-decode-dolphin-communication/490753 |
| 38 | 64 | Googles Modell ist für Delfine gebaut, ESP will eins für jede Art | BELEGT | Trainiert auf WDP-Daten von Fleckendelfinen; ESP baut artübergreifende Modelle. | wie 35 · wie 7 |
| 39 | 65 | Zebrafinken sortieren nach Bedeutung, nicht nach Klang | ÜBERDEHNT → M2 | Siehe M2. „Another scientist … in California“ stimmt: Julie Elie, UC Berkeley, Coller-Dolittle-Preis 2026. | siehe M2 |
| 40 | 68 | Maschinen „pick out names, feelings, even what's going on“ | ÜBERDEHNT → M3 | Siehe M3. | siehe M3 |
| 41 | 69 | Keine Maschine kann sagen, was ein einzelner Ruf sagt | BELEGT | Es gibt keine belegte Übersetzung. Auch bei CETI ist die Bedeutung der Codas unbekannt (Petri, 10/2026). | https://news.northeastern.edu/2026/10/22/how-to-speak-whale/ |
| 42 | 72 | Forscher testeten A.I. an Aufnahmen von Kleinkindern | BELEGT | Taub u. a., *Curr. Biol.* 2026, R900–R901, DOI 10.1016/j.cub.2026.06.064: ein klassisches Verfahren und zwei tiefe Netze (auf Tierlaute bzw. Erwachsenensprache trainiert). | https://www.cell.com/current-biology/abstract/S0960-9822(26)00810-9 |
| 43 | 73 | Laute, die Eltern „instantly“ verstehen: Not, Hunger, Mama oder Papa | ÜBERDEHNT → M4 | Siehe M4. | siehe M4 |
| 44 | 74 | Die besten Systeme konnten sie nicht nach Bedeutung sortieren | BELEGT (Hinweis) | Die tiefen Netze schlugen das klassische Verfahren, trennten aber Laute mit gleicher Bedeutung und warfen verschiedene zusammen. „The best systems“ meint die besten der getesteten, nicht die besten der Welt; im Zusammenhang vertretbar. | https://phys.org/news/2026-09-ai-struggles-decipher-animal-language.html |
| 45 | 76 | Ein Preis, Millionen wert, für das erste echte Zwei-Wege-Gespräch | BELEGT | Coller Dolittle Challenge (seit 30.5.2024): 10 Mio. $ als Beteiligung oder 500.000 $ bar. Bedingung: Das Tier kommuniziert selbstständig, ohne zu merken, dass es mit Menschen spricht. | https://jeremycollerfoundation.org/press-releases/10-million-prize-for-interspecies-two-way-communication-using-generative-ai-models-announced/ |
| 46 | 77 | Noch nicht vergeben | BELEGT | 2026 ging nur der Jahrespreis (100.000 $) an Julie Elie. Eine Vergabe des Hauptpreises ist nicht gemeldet. | wie 39 (JCF 26.6.2026) |
| 47 | 78 | Vor Alaska antwortete ein Buckelwal 20 Minuten lang auf einen aufgezeichneten Ruf | BELEGT (Einzelfall) | Twain, August 2021, Frederick Sound; McCowan u. a., *PeerJ* 11:e16349 (29.11.2023), drei Phasen. Die Autoren sprechen vom „first such communicative exchange“. „The closest thing yet?“ ist unsere Wertung. | https://peerj.com/articles/16349 · https://safinacenter.org/blog/conversing-with-a-humpback-whale-named-twain |
| 48 | 79 | C4 zeigt den Austausch | DÜNN (offen) | WhaleSETI-Video 3cvSLNn8RZk „Conversation with Twain: Groundbreaking Encounter with Humpback Whale“. Ob es Originalton von 2021 ist, prüft der Clip-Agent. | https://www.youtube.com/watch?v=3cvSLNn8RZk |
| 49 | 80 | Ein Wal, ein Ruf, ein Mal | BELEGT | Ein Tier, ein Ruftyp („whup/throp“), eine Begegnung. | wie 47 |
| 50 | 81 | ESP räumt ein, nicht immer zu erkennen, wann seine A.I. richtig liegt | BELEGT | AP (15.1.2025) in eigener Formulierung: ESP „won't know when its model gets it absolutely right“. Es ist kein wörtliches ESP-Zitat; die Zitatkarte als AP beschriften. | wie 12 |
| 51 | 83 | Heute gibt es keinen Übersetzer, weder für Wale noch für Elefanten oder Hunde | BELEGT | Keine validierte Übersetzung; Hunde-„Übersetzer“-Apps sind wissenschaftlich nicht belegt. | wie 5 |
| 52 | 89 | 1970: Eine Walgesang-Platte wird das meistverkaufte Naturalbum | BELEGT | Guinness: „Biggest-selling nature album“, erschienen 1970, über 125.000 Exemplare. | https://www.guinnessworldrecords.com/world-records/642116-biggest-selling-nature-album |
| 53 | 90 | Zwölf Jahre später stimmen Staaten für eine Walfang-Pause; sie gilt noch | BELEGT | IWC-Moratorium vom 23.7.1982 (25:7), in Kraft seit 1985/86 und bis heute. Ausnahmen: Norwegen (Einspruch), Island (Vorbehalt), Japan (2019 aus der IWC ausgetreten). | https://iwc.int/commercial · https://news.mongabay.com/short-article/2026/02/global-moratorium-on-whaling-a-defining-moment-turns-40/ |
| 54 | 91 | Nicht der einzige Grund, aber der Soundtrack der Bewegung | BELEGT (Einordnung) | Guinness: Die Platte „helped kick-start“ Save the Whales. Historiker sehen mehrere Ursachen (Burnett 2012). | wie 52 |
| 55 | 94 | Deutschland: etwa 9 von 100 essen gar kein Fleisch | BELEGT | Ernährungsreport 2025: 7 % vegetarisch, 2 % vegan (Selbstauskunft). Details in Abschnitt 5. | https://www.bmleh.de/SharedDocs/Downloads/DE/Broschueren/ernaehrungsreport-2025.pdf?__blob=publicationFile&v=4 |
| 56 | 94 | Unter 30 ist es jeder Fünfte | BELEGT | 14–29 Jahre: 20 % vegan oder vegetarisch. | wie 55 · https://www.gemeinsamgutessen.de/service/aktuelles/ernaehrungsreport-2025-gestiegene-lebensmittelpreise-fuehren-zu-mehr-preissensibilitaet |
| 57 | 95 | Trotzdem essen 9 von 10 Deutschen Fleisch | BELEGT (abgeleitet) | 100 − 9 = 91 %, darin 37 % Flexitarier. | wie 55 |
| 58 | 100 | Diesen vergangenen Sommer jagte Island wieder Finnwale | BELEGT | Hvalur hf fing die ersten Finnwale in der Nacht 21./22.6.2026, die ersten seit 2023. Saisonende mit 93 Finnwalen (Quote 150). | https://www.icelandreview.com/news/iceland-whaling-season-ends-93-fin-whales-2026/ · https://www.ifaw.org/international/press-releases/first-fin-whales-killed-as-icelands-brutal-whaling-industry-resumes |
| 59 | 101 | Das Fleisch-Paradox | BELEGT | Begriff von Loughnan, Haslam und Bastian (2010). | wie 60 |
| 60 | 102 | Wer ans Leid erinnert wird, spricht Nutztieren weniger Geist zu | BELEGT | Bastian, Loughnan, Haslam, Radke, *PSPB* 2012, Studie 2: Fleischesser, die an die Verbindung von Fleisch und Leid erinnert wurden. Die Replikation 2024 war laut FORRT erfolgreich. | https://pubmed.ncbi.nlm.nih.gov/21980158/ · https://forrt.org/flora-replication-atlas/doi/10.1177/0146167211424291/ |
| 61 | 110 | Die A.I. hört schon, wie sich die Stimmen angleichen, wenn die Familie zu planen scheint | DÜNN | Angleichung gab es nur in 3 von 6 Kontexten (Cadenced, Contact, Greeting), nicht bei Let's-Go. Cadenced-Rumbles dienen wohl dem Konsens über einen Plan; „seems to plan“ ist gedeckt. Die Funktion ist unbewiesen, Playbacks gab es nicht, es ist eine einzige Studie. | wie 24 |
| 62 | 112 | Raskin hat eine Warnung dazu (C5) | DÜNN (offen) | Prüft der Clip-Agent. Die Warnung geben Kurzfassungen wieder (AI 101). Die StarTalk-Folge 4Id5aTlYkHg heißt „The AI Alignment Problem & Its Solutions, with Aza Raskin“. | https://www.youtube.com/watch?v=4Id5aTlYkHg · https://www.youtube.com/watch?v=Ml4v2vh5SoE |
| 63 | 115 | Bei Schiffsnähe ändern Pottwale ihre Rufe; ob Reden oder Stress, ist unklar | BELEGT (→ K4) | Diamant, Gruber, Gero, Beguš, *Ecol. Inform.* 97:103881 (2026): 13 Wale vor Dominica, Tags von 2014–2016. Bei Schiffslärm gab es mehr a-Codas und schnellere Codas; die Ursache ist offen. | https://doi.org/10.1016/j.ecoinf.2026.103881 · https://www.nationalgeographic.com/environment/article/sperm-whale-communication-near-ships |
| 64 | 116 | Māori- und Pazifik-Anführer haben Wale zu Rechtspersonen erklärt | BELEGT (Erklärung, kein Gesetz) | He Whakaputanga Moana, 28.3.2024, Rarotonga. Im Text: „Whales, as legal persons, possess inherent rights …“. | https://www.teaonews.co.nz/2024/03/28/maori-king-and-other-indigenous-pacific-leaders-sign-up-to-granting-whales-legal-personhood/ · https://insideclimatenews.org/news/05022026/maori-scientist-daniel-hikuroa-legal-rights-of-whales/ |
| 65 | 116 | Ein Abgeordneter dort will das zu Recht machen | BELEGT | Tohorā Oranga Bill von Teanau Tuiono (Grüne), am 5.2.2026 als Member's Bill eingereicht. Er liegt im Losverfahren; eine erste Lesung habe ich nicht gefunden. „Wants to“ stimmt. | https://www.teaonews.co.nz/2026/02/07/green-mp-seeks-recognition-of-tohorawhales-as-legal-persons/ · https://www.greens.org.nz/green_member_s_bill_to_recognise_the_personhood_of_tohor |
| 66 | 128 | 2030 ist nur noch wenige Jahre entfernt | BELEGT | Wie Nr. 20. | – |
| 67 | 129–130 | Ein Teil ist schon da: A.I. kann sie jetzt hören | BELEGT | Wie Nr. 2 und 4. | wie 4 |
| – | 14, 25, 29, 32, 38, 40, 45, 49, 55, 59, 66–67, 70–71, 75, 82, 87–88, 93, 96–99, 103–109, 111, 113–114, 117–127, 131 | Fragen, Analogien (Autovervollständigung, Couch/Sofa, Familie beim Abendessen), Deutungssätze der Tour, Szenario Day 1, Year 1 und Year 10, Superintelligenz-Bogen, Kernsatz | Deutung / Szenario | Als solche erkennbar, im Bild markiert. Gestützt sind: „never been easier“ (37 % Flexitarier) und „products … good or cheap enough“ (Ernährungsreport 2025: 59 % achten auf günstige Preise, Geschmack ist das wichtigste Kriterium). Die „teams all over the world“ sind alle real (Kenia, Spanien, Europa, Karibik, Bahamas, Kalifornien). | https://www.zdfheute.de/panorama/verbraucher-preise-lebensmittel-ernaehrungsreport-100.html |

---

## 4. [prüfen]-Punkte aus text-v4.md, abgearbeitet

| Punkt | Ergebnis |
|---|---|
| F2 Hook-Laute | Der Datensatz von Briefer u. a. 2022 liegt laut Author Correction (Nov. 2023) als beschriftete Audio-Datenbank auf Zenodo. Zenodo ist hier gesperrt, die Lizenz deshalb am Original prüfen. Zweite Quelle: Die Datenbank zu Lefèvre u. a. 2025 (sieben Huftierarten) ist ebenfalls öffentlich. |
| F7 Mitarbeiterzahl | Laut AP (1/2025) rund 7 Forschende. Aggregatoren 2025/26 nennen 21 (LinkedIn), ~31 (LeadIQ) und 39 (RocketReach) Beschäftigte. „Small team“ bleibt vertretbar, im Off steht keine Zahl. |
| F8 NatureLM | Im Blog 20 % (Wahl unter 200 nie gehörten Arten), im Paper (ICLR 2025, arXiv v2) 34,3 %, Zufall jeweils 0,5 %. Im Off steht keine Zahl. Gut so. |
| F21 Playback-Mittelwerte | 128 s, 87 s und 2,3× habe ich nicht bestätigt. Belegt ist: 17 Tiere gingen „significantly faster“ auf den Lautsprecher zu und riefen zurück. Die Werte werden nicht gesprochen. |
| F22 Zeigt C2 ein Playback? | Der Titel („Scientists Call Elephant by Name, and She Calls Back“) und die CSU-Angabe (Videos von Pardo, Wittemyer, Bend) sprechen dafür. Abhören muss der Clip-Agent. |
| F27 „nearly an order of magnitude“ | Bestätigt (die Autoren laut ABC News). |
| F29 Krähen: Zahl und DOI | „Capturing vocal communication in a free-living corvid: high-resolution data from low-impact miniaturized tags“, *Animal Cognition*, online 29.10.2025, DOI 10.1007/s10071-025-02018-0. 52 MiniDTAGs, über 127.000 Rufe erwachsener Krähen. Bestätigt. |
| F32 C3 Wortlaut | Bisher nur aus der Presse. Muss der Clip-Agent abhören. |
| F40 Twain-Datum | August 2021, Frederick Sound, Südost-Alaska. Bestätigt, wird nicht gesprochen. |
| F51 Einwand Produkte | Gestützt durch den Ernährungsreport 2025: 59 % achten beim Einkauf auf günstige Preise, Geschmack ist das wichtigste Kriterium. |
| F57 C5 Wortlaut | Muss der Clip-Agent abhören (Abschnitt 8). |
| F59 Schiffslärm: Titel, DOI | „Evidence for the influence of shipping underwater radiated noise on sperm whale coda structure“, *Ecological Informatics* 97:103881 (2026), DOI 10.1016/j.ecoinf.2026.103881. 13 Wale vor Dominica. |
| F61 Tohorā Oranga Bill | Am 5.2.2026 als Member's Bill eingereicht; er liegt im Losverfahren. Eine Ziehung oder erste Lesung habe ich bis 9.11.2026 nicht gefunden. „Wants to make that law“ stimmt. |
| N5 AVES (arXiv 2210.14493) | Selbstüberwacht und HuBERT-basiert, sagt maskierte Stücke in unannotiertem Audio voraus, ICASSP 2023. arxiv ist gesperrt; gelesen über Suchauszug und das ESP-Video 9i-_CEhoCzw. |
| N7·DE Altersgruppe 14–29 | Bestätigt, siehe Abschnitt 5. |
| Gesperrte Hosts (earthspecies.org) | Weiter gesperrt. Die ESP-Angaben (17 Mio. $, 2030, NatureLM, Krähen, Chöre) sind über Suchauszüge der ESP-Seiten, AP, Forbes und die Papers gelesen. |
| Hinweis zu `text-v4.md` | Die Faktenliste ist teils veraltet. F49/F50 (Gallup) sind durch N7·DE ersetzt. Im Kenner-Test steht noch „Gallup-Rückgang“, in §11 „about four in a hundred“. Beim nächsten Stand nachziehen. |

---

## 5. Deutsche Zahlen: BMLEH-Ernährungsreport 2025

- **Quelle:** „Deutschland, wie es isst – Der BMLEH-Ernährungsreport 2025“, vorgestellt von Minister Alois Rainer am 27.11.2025. Repräsentative forsa-Befragung von rund 1.000 Personen ab 14 Jahren; der Report erscheint seit 2015 jährlich.
- **Ernährungsweise (Selbstauskunft):**
  - 7 % vegetarisch und 2 % vegan, zusammen 9 %, also „about nine in a hundred“. Stimmt.
  - 37 % Flexitarier, die nur gelegentlich Fleisch essen.
  - Täglich Fleisch oder Wurst essen 24 % (2015: 34 %, 2024: 23 %), Männer 32 %, Frauen 17 %.
- **Altersgruppe:**
  - „Bei den jüngsten Befragten (14 bis 29 Jahre) ernähren sich 20 % vegan oder vegetarisch“, der Anteil sinkt mit dem Alter. „One in five“ stimmt.
  - Zum Vergleich: Der Report 2024 (Erhebung Mai 2024) nennt für diese Gruppe 14 % vegetarisch und 6 % vegan, ebenfalls 20 %.
- **„Nine in ten Germans eat meat“:** abgeleitet, 100 − 9 = 91 %, Flexitarier eingeschlossen. Stimmt.
- **Wie geprüft:** bmleh.de ist für WebFetch und curl gesperrt. Gelesen habe ich die Zahlen über Suchauszüge aus dem Index des Original-PDFs (bmleh.de, Broschüre und forsa-Tabellenband). Bestätigt wurden sie durch drei Wiedergaben: Bundeszentrum für Kita- und Schulverpflegung (gemeinsamgutessen.de), milchland.de und Galaxus (8.12.2025). Den Befragungszeitraum 2025 und die Seitenzahl konnte ich nicht lesen.
- **Grenzen:**
  - Es ist eine Selbstauskunft.
  - Die Gruppe 14–29 ist bei n ≈ 1.000 eine kleine Teilstichprobe (grob ±6 Punkte); „one in five“ ist als Rundung in Ordnung.
  - „Under-thirties“ heißt hier 14–29, denn befragt wurde ab 14. Im Bild deshalb „AGE 14–29“ statt „UNDER 30“ (Abschnitt 7).
- **Aktualität:** Der Report 2025 ist bei Upload die neueste Ausgabe. Der Vorjahresbericht erschien am 27.11.; erscheint ein Report 2026 vor dem Upload, die Zahlen tauschen.

Quellen: https://www.bmleh.de/SharedDocs/Downloads/DE/Broschueren/ernaehrungsreport-2025.pdf?__blob=publicationFile&v=4 · https://www.bmleh.de/SharedDocs/Downloads/DE/_Ernaehrung/forsa-ernaehrungsreport-2025-tabellen.pdf?__blob=publicationFile&v=2 · https://www.gemeinsamgutessen.de/service/aktuelles/ernaehrungsreport-2025-gestiegene-lebensmittelpreise-fuehren-zu-mehr-preissensibilitaet · https://milchland.de/ernaehrungsreport-2025-milchprodukte-fester-bestandteil-des-alltags/ · https://www.galaxus.ch/de/page/frauen-essen-weniger-fleisch-und-achten-mehr-auf-tierwohl-40792 · https://www.lebensmittelzeitung.net/politik/nachrichten/ernaehrungsreport-2025-minister-rainer-lehnt-neue-staatliche-abgaben-auf-lebensmittel-ab-188025

---

## 6. Interessenkonflikte

Kein Konflikt ist verschwiegen. Zur Einordnung:
- **Aza Raskin (C1, C5):** Er ist ESP-Mitgründer und laut GuideStar Präsident, spricht also für die eigene Organisation. Im Film heißt er „one of the team's founders“, die Bauchbinde nennt ESP. Er ist außerdem Mitgründer des Center for Humane Technology.
- **ESP-Ergebnisse:** NatureLM, die Chöre und die Krähen stammen aus ESP-eigenen Papers und Blogs. Peer-reviewed sind Sci. Rep. 2026, Animal Cognition 2025 und ICLR 2025. Die NatureLM-Prozentwerte sind Eigenangaben und widersprechen sich (20 % gegen 34,3 %); der Film nennt keine Zahl.
- **Reid Hoffman:** Das Geld kam über seine Aphorism Foundation. Laut Forbes gab er schon zuvor rund 1 Mio. $ pro Jahr. Im Film offen genannt.
- **C3:** Es ist ein Werbevideo von Google mit Hype-Titel; Herzing ist Googles Projektpartnerin. Bauchbinde „GOOGLE 2025“, den Titel nicht zeigen (wie geplant).
- **Kleinkinder-Test:** Mitautor Yossi Yovel leitet auch die Jury des Coller-Preises. Für die Aussage spielt das keine Rolle.
- **Zurücksprechen:** ESP testet mit McGill im Labor selbst A.I.-Antworten an Zebrafinken (AP 2025; Preprint ZF-AIM 2026). Raskins Warnung (C5) betrifft Wildtiere und Wale. Das ist kein Widerspruch, aber gut zu wissen, falls in den Kommentaren gefragt wird.

---

## 7. Folgen für Bild, Zitatkarten und Begleittexte

- **3:12 Nadel:** „EARTH SPECIES PROJECT · AMBOSELI“ besser „ESP + ELEPHANTVOICES · AMBOSELI“. Die Chor-Studie entstand gemeinsam mit ElephantVoices und dem Amboseli Trust.
- **4:06 CETI-Grafik:** Die Regler bleiben, aber ohne A.I.-Box als Entdecker (M1).
- **4:49 Finken:** wenn Text, dann „MORE BY MEANING THAN BY SOUND“ (M2).
- **5:59 Zitatkarte:** Es ist eine AP-Formulierung, kein ESP-Zitat. Wortlaut: ESP „won't know when its model gets it absolutely right“ (AP, Jan. 2025).
- **6:55 Deutschland-Raster:**
  - „UNDER 30“ → „AGE 14–29“.
  - Quelle klein: „BMLEH ERNÄHRUNGSREPORT 2025 · FORSA“.
  - „9 IN 100 · GERMANY 2025“ bleibt.
- **8:08 REAL-Karte:** bleibt; optional „IN 3 OF 6 CONTEXTS“.
- **8:34 REAL-Karte Schiffslärm:** „DOMINICA · 13 WHALES“ ergänzen (K4).
- **5:36 Preis:** „UP TO $10M“ bleibt richtig ($10M Beteiligung oder $500K bar).
- **7:23 Island:** „ICELAND · JUNE 2026 · FIN WHALES“ bleibt richtig (Saison bis Sept., 93 Finnwale).
- **Beschreibung:** Quellenliste aus Abschnitt 3 übernehmen; für die Schweine Briefer u. a. 2022 und Lefèvre u. a. 2025.

---

## 8. Clips C1–C5: was belegt sein muss

Den Wortlaut prüft der Clip-Agent; hier steht nur, was der Off-Text voraussetzt. Titel und Kanal sind per YouTube oEmbed bestätigt.

| Clip | Video | Der Off-Text setzt voraus |
|---|---|---|
| C1 | StarTalk, https://www.youtube.com/watch?v=4Id5aTlYkHg („The AI Alignment Problem & Its Solutions, with Aza Raskin \| StarTalk“) | Raskin spricht selbst im Bild („Here he is.“), und zwar darüber, was ESP will: verstehen, was Tiere einander sagen. Die Folge handelt vor allem von KI-Alignment; der Ausschnitt muss aus dem ESP-Teil kommen. Datum (laut `text-v4.md` 7.11.2026), Musik und Content-ID prüfen. Reserve: ESP-Kanal https://www.youtube.com/watch?v=rjvsl0mhqTk |
| C2 | Colorado State University, https://www.youtube.com/watch?v=MXITyX9PPJM („Scientists Call Elephant by Name, and She Calls Back“) | Ein echtes Playback im Feld mit Antwort oder Annäherung der Elefantin, keine Nachstellung. Sonst passt „They caught it on camera.“ nicht. |
| C3 | Google, https://www.youtube.com/watch?v=1bgL4b7VT8M | Herzing sinngemäß „The goal would be to one day speak Dolphin“, bisher nur aus der Presse. Hype-Titel nicht zeigen. |
| C4 | WhaleSETI, https://www.youtube.com/watch?v=3cvSLNn8RZk („Conversation with Twain …“) | Originalaufnahme von Playback und Antwort (August 2021), keine nachgebaute Tonspur. Die „twenty minutes“ im Off sind die Dauer des Austauschs, nicht des Clips. |
| C5 | StarTalk wie C1 | Raskins Warnung vor dem Zurücksprechen: Ein künstlicher Wal könnte eine sehr alte Walkultur stören. Ohne „QAnon“. Nennt er eine Zahl („30 million years“, so in den AI-101-Shorts https://www.youtube.com/watch?v=Ml4v2vh5SoE), ist das seine Behauptung und nicht geprüft; dann herausschneiden oder klar als seine Aussage stehen lassen. Prüfen, ob die Shorts aus StarTalk stammen oder aus einem anderen Gespräch. |

---

## 9. Regel-Prüfung (Python)

`/home/user/scenario/tools/regel_check.py` gibt es nicht. Ausgeführt habe ich deshalb `python3 /mnt/project-files/scenario/schreibraum/regel_check.py vo-v5.txt`:

```
===== vo-v5.txt  (1409 Wörter ≈ 9.7 Min)
  MINUTE 1  9 Zahl-Wörter (Regel: höchstens eine Zahl): ['One', 'two', 'One', 'one', 'nine', 'ten', 'twenty', 'thirty', 'One']
  ICH-SATZ?  The first step already works: A.I.
  ICH-SATZ?  A.I.
  ICH-SATZ?  Their A.I.
  ICH-SATZ?  Now he's building A.I.
  ICH-SATZ?  The team's A.I.
  ICH-SATZ?  Their A.I.
  ICH-SATZ?  Their A.I.
  ICH-SATZ?  Its A.I.
  → 14 Hinweis(e)          (Exit-Code 1; vo-v4: 15, weil „Their A.I. found“ weggefallen ist)
```

**Bewertung:** Alle 14 Hinweise sind bekannte Fehlalarme.
- **Zahl-Wörter in Minute 1:** Echte Zahlen sind nur „nine times out of ten“ und „twenty thirty“. Beide hat Jakob am 9.11. verlangt (`text-v4.md`, Abweichungen). „One/two/one“ zählen die Schweine oder sind Pronomen. Minute 1 endet bei „… One of the team's founders invented something you've“.
- **13 × ICH-SATZ?:** Das Skript trennt Sätze am Punkt in „A.I.“. Gegenprobe mit ersetztem „A.I.“: kein „I“, „my“ oder „me“, also kein Ich-Satz.
- **Ohne Treffer:** Bann-Liste und Fahrplan. Keine Jahreszahl der Vergangenheit vor 1:00. „Twenty thirty“ bei 0:27 ist ein Zieljahr in der Zukunft; REGELN §4 verbietet nur Jahreszahlen der Vergangenheit, und Jakob hat es verlangt.
- **Fragezeichen in Minute 1:** eins (die Hauptfrage).
- **Clips:** 5. **Länge:** 1.409 Wörter.

**Weitere Textsuchen in vo-v5.txt:**
- „subscribe“ = 2, beide mit Mission und als Frage, unverändert.
- Flüster-Tags ([softly], [whispers], [quietly], [hushed]): 0.
- „AI“ ohne Punkte: 0; „A.I.“: 13.
- Marker unverändert: 2 × SOUND, 5 × CLIP, 3 × [pause].
- Bann-Muster „no one“ in „no one to ask“ (Zeile 25) ist eine Tatsache, kein Bann-Muster (wie in `text-v4.md` vermerkt).

---

## 10. Offene Punkte

1. **Clips C1–C5** abhören (Clip-Agent, Abschnitt 8). Bis dahin sind fünf Ansagen DÜNN.
2. **Hook-Laute:** zwei beschriftete Laute aus dem Datensatz von Briefer u. a. 2022 (Zenodo); die Lizenz am Original prüfen.
3. **KANN K1–K5:** Entscheidung Texter/Jakob. K4 (Dominica) mindestens im Bild umsetzen.
4. **Hosts freigeben oder von Hand gegenlesen:**
   - bmleh.de: Report-PDF, Seite mit 14–29 und Befragungszeitraum
   - nature.com: Genauigkeiten der Chor-Studie zu K1
   - earthspecies.org: 17-Mio.-Mitteilung im Volltext
   - Zenodo: Lizenz der Schweine-Laute
5. **Ernährungsreport 2026:** Erscheint er vor dem Upload, die Zahlen in Zeile 94–95 tauschen.
6. **`text-v4.md` Faktenliste nachziehen:** Gallup (F49/F50) raus, N7·DE rein; dazu die Bildnotizen aus Abschnitt 7.
