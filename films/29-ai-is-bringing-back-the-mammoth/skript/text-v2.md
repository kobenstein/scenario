# Film #29 · „AI Is Bringing Back the Mammoth“ · Text v2

Stand 19.11.2026 · Überarbeitung von `text-v1.md` nach `kritik-v1.md` · alle Fakten gegen `recherche-v2.md` geprüft (Ergebnis: `kritik-v1.md`, Abschnitt 8) · Hook A aus `hooks-v1.md`, in drei Zeilen geändert

Off-Text 1.446 Wörter ≈ 9:58 bei 145 Wörtern pro Minute (so rechnet das Prüfskript), mit Clip C1 (10 s) ≈ 10:08. Bei 150 Wörtern pro Minute (so rechnete v1) ≈ 9:48 mit Clip. Dazu 15 s Endscreen. Reine Sprechfassung: `vo-v2.txt`. Die Zeiten unten gelten für 145 Wörter pro Minute.

- **Leitgedanke:** Zwischen Elefant und Mammut liegen 1,4 Millionen Unterschiede. Die KI sucht die wenigen, die zählen, und dieselben Werkzeuge entscheiden mit, welche Tiere von heute bleiben.
- **Kernsatz:** “The mammoth is the poster. The freezer is the ark.” Der Hook pflanzt Zaun, kleine Hand und Poster, der Schluss erntet alle drei.
- **Titel-Einlösung:** 0:36–0:41 die Aufgabe der Maschine in einem Satz, 0:41–0:45 die Testmäuse, 0:58–1:36 der Plan und der Teil der Maschine, konkret (was die KI tut: 1:15–1:27).
- **Uhr:** Zähler oben im Bild: 1.400.000 → 1.600 → 150+ → 7 (Station 2), Dodo-Zähler 1 → 70 → 2.300 (Station 3), am Schluss steht er auf 1 (eine Stimme).
- **Zitate:** 1 Clip (C1), 3 Zitatkarten. Gesprochen wird nur die Karte Shapiro. Die Karten IUCN und Lamm stehen nur im Bild, der Sprecher fasst sie zusammen.
- **Abo-Aufruf:** zweimal, mit Mission, als Frage (nach der Dodo-Auflösung und über dem Schlussbild). Kein QR.
- **Prüfskript:** `regel_check.py vo-v2.txt` meldet 1 Hinweis: „CLIPS 1 (Regel: 3–6)“. Sonst nichts.

## Was sich gegenüber v1 geändert hat

1. **Hook:** „the first answers are already alive“ → „the first test animals“. Die Aufgabe der Maschine steht jetzt in einem Satz im Hook („So the search for the few that matter went to a machine“). „Mice today. A mammoth, not yet.“ ist ersetzt durch „The mice were the rehearsal. The real job is an elephant.“
2. **Station 1** ist von 50 s Kontext (Dauerfrost, „why the mammoth“) auf den Plan und den Teil der Maschine umgebaut. Was die KI tut, steht jetzt bei 1:15 statt bei 2:09.
3. **Station 2:** Der Zähler bleibt, aber die Maus zählt nicht mehr als „7 von 150“. Dazu ein Satz Fachkritik und das Urteil („the mice prove the editing... not the list“).
4. **Brücke zum Dodo** sagt offen, warum der Film das Tier wechselt: Für das Mammut hat Colossal diesen Schritt nicht gezeigt, für den Dodo schon.
5. **Station 3:** Auflösung und Abo-Aufruf 1 stehen jetzt direkt hintereinander, die Küken kommen danach als Brücke zur nächsten Frage.
6. **Station 4:** Erst die Frage, dann die Antwort. Nur noch ein gesprochenes Zitat (Shapiro). Die Jahreszahlen-Kette ist auf zwei gekürzt, „No mammoth. No embryo.“ ist gestrichen.
7. **Station 5:** Elefanten-Impfung mit Bezug zum Zuschauer (Zoos in Nordamerika) und mit dem belegten Geld-Bezug („Colossal helped pay for“). Die unbelegte 100-Millionen-Zahl ist gestrichen.
8. **Schluss:** keine Ankündigungs-Frage mehr, die KI kommt im Urteil vor, Abo-Aufruf 2 ohne „We“.

---

## HOOK · 0:00–0:58

*Grundfrage: Welche Unterschiede machen aus einem Elefanten ein Mammut? Aufgabe der Maschine bei 0:36–0:41, erstes Ergebnis (Mäuse) bei 0:41–0:45.*

[BILD: Thumbnail-Motiv ab Frame 1: Mammut aus leuchtenden DNA-Linien, davor winzige Figur; großer Text „AI IS REVIVING THE MAMMOTH“; Musik steht sofort, kein Schwarzbild]
[calm, conversational] Artificial intelligence is bringing back the mammoth.

[BILD: Zaun im Schnee, große Hand hält kleine Hand, beide von hinten; Einblendung „SCENARIO · EARLY 2030s“; hinter dem Zaun hebt eine rotbraune Fellsilhouette den Kopf, Atemwolke]
A few winters from now, you're standing at a fence in the snow. There's a small hand in yours. And behind the fence, the animal from the poster above that child's bed... lifts its head. Red-brown fur. Small ears. Breath steaming in the cold.

[BILD: Silhouette zerfällt in einen DNA-Strang aus Lichtpunkten; Zähler oben erscheint: 1.400.000; klein „Cell Reports, 2015“]
[curious] That animal doesn't exist yet. Between an elephant and a mammoth, there are about 1.4 million differences in their DNA. Which ones make a mammoth?

[BILD: eine Hand greift in die Lichtpunkte und fasst nichts; dann fährt ein Raster darüber, die meisten Punkte verlöschen, wenige bleiben hell]
[thoughtful] No human can check them all. No lab can change them all. So the search for the few that matter went to a machine.

[BILD: Wollmäuse auf einer Hand (Colossal-Material, Ampel prüfen; „ORIGINAL FOOTAGE“)]
And the first test animals are already alive. Mice... with long, woolly, mammoth-style fur.

[BILD: die Maus neben dem Umriss eines Asiatischen Elefanten; dann zurück zum Zaun, neben dem Kind leuchten Umrisse heutiger Tiere auf; kein Musik-Break, es geht direkt weiter]
[calm, conversational] The mice were the rehearsal. The real job is an elephant. And the same tools will help decide which of today's animals that child still gets to see.

## STATION 1 · 0:58–1:51 · Der Plan und der Teil der Maschine (Titel-Einlösung)

*Beantwortet: Wer macht das, was ist der Plan, was genau tut die Maschine? Öffnet: Warum gibt es dann noch kein Mammut?*

[BILD: Karte mit Punkt Dallas, Labor; ein Mammut im Eisblock wird durchgestrichen; daneben ein Asiatischer Elefant, an dem Fell als Linien aufleuchtet]
The mice belong to a company in Dallas called Colossal. And its plan is not to thaw out a frozen mammoth. The plan is to take the mammoth's living cousin, the Asian elephant... and rewrite its DNA for the cold.

[BILD: Mammut- und Elefanten-Strang nebeneinander, ein Raster gleicht sie ab und markiert wenige Stellen; am Elefanten leuchten nacheinander Fell, Fettschicht und kleine Ohren; klein „as reported, Sept 2026“]
[thoughtful] And the machine's part in that plan? As reported this year, artificial intelligence combs through mammoth and elephant DNA... and flags the differences most likely to build a trait. The thick fur. The layer of fat. The small ears.

[BILD: eine kurze Liste aus leuchtenden Zeilen entsteht; die Pipette daneben bleibt unberührt]
It doesn't change a single gene. It writes the list.

[BILD: Dauerfrostboden im Querschnitt, Stoßzahn im Eis; ein Raster füllt sich mit 100 kleinen Mammuts; Einblendung „~100 mammoth genomes (per Colossal)“]
[calm, conversational] And it has plenty to read. Frozen ground kept mammoth DNA for thousands of years... and Colossal says it now holds about a hundred mammoth genomes. A hundred full sets of DNA.

[BILD: die 100 Mammut-Symbole stehen, die Landschaft dahinter bleibt leer]
[curious] So why is there still no mammoth?

## STATION 2 · 1:51–3:31 · Lesen ist leicht, Verstehen nicht (der Zähler fällt)

*Beantwortet: Warum es noch kein Mammut gibt. Öffnet: Woher weiß eine Maschine, welche Unterschiede zählen?*

[BILD: Buchstabenreihen laufen durch; Zähler groß: 1.400.000; die meisten Lichtpunkte werden grau]
[thoughtful] Because reading was never the hard part. Knowing what it means is. Start the count at 1.4 million. Most of those differences probably change nothing you would ever see.

[BILD: Zähler fällt auf 1.600; die übrigen Punkte ordnen sich zu Gen-Blöcken; klein „Cell Reports, 2015“]
Only some of them change what a gene actually builds. One study found those in about sixteen hundred genes.

[BILD: das Raster aus Station 1 sortiert die Gen-Blöcke zu einer Rangliste; Zähler fällt auf 150+; Einblendung „TIME, Aug 24, 2026 (as reported)“, Quelle am Original prüfen]
Still far too many to rebuild. This is where the machine's ranking comes in... and the count drops again. Colossal's own list, by the latest reports? More than a hundred and fifty genes.

[BILD: Zähler fällt auf 7; Wollmaus-Foto; Einblendung „Colossal preprint, March 2025“]
[curious] And tested in a living animal so far? Only in those mice. Seven genes, changed at once.

[BILD: die Wollmaus neben einer gewöhnlichen Labormaus mit langem Fell; Einblendung „T. Herridge, BBC Science Focus, 2025“ (Wortlaut prüfen)]
[thoughtful] Critics add a caution. Genes like these were already known to change a mouse's coat. So the mice prove the editing... not the list.

[BILD: zwei Zahlen mit Lücke dazwischen: 7 … 150; dann Porträt, Einblendung „Ben Lamm, CEO, Colossal“]
From seven genes in a mouse... to more than a hundred and fifty in an elephant. And the man who runs Colossal, Ben Lamm, has every reason to promise that a machine will close that gap overnight. He doesn't.

[CLIP C1 · Ben Lamm bei Peter Diamandis, Moonshots #297, 30.9.2026 · 00:34:53–00:35:03, ca. 10 s · “The foundation models and AI models aren't quite looking at the entire tree of life, and they're not going to magically overnight give us a genome and give us an answer.” · Ampel gelb, Wortlaut bisher nur aus einem Fremdtranskript, am Ton prüfen · Einblendung „ORIGINAL FOOTAGE“ + Name]

[BILD: kurze Liste aus leuchtenden Zeilen; eine Hand im Laborhandschuh prüft die erste Zeile]
[thoughtful] No magic. Nothing overnight. The machine doesn't hand over a mammoth. It hands over a short list... and somebody has to test it.

[BILD: die Liste bleibt stehen; dahinter eine geschlossene Kiste mit Mammut-Zeichen, daneben öffnet sich eine zweite mit einem Dodo-Schädel; Einblendung „Colossal, Oct 14, 2026“]
[curious] But how would a machine even know which differences matter? For the mammoth, Colossal has not shown that step in public. This October, it did... for a different animal. A bird. The dodo.

## STATION 3 · 3:31–5:11 · Der Blick in die Maschine: der Dodo (mit Abo-Aufruf 1)

*Beantwortet: Woher weiß eine Maschine, was zählt? Öffnet: Ist das, was herauskommt, ein Mammut?*

[BILD: links 100 Mammut-Symbole, rechts ein einziger Dodo]
[calm, conversational] And the dodo is the harder case. For the mammoth, there are about a hundred genomes. For the dodo, there is exactly one.

[BILD: der eine Dodo allein im Dunkeln]
[curious] One bird. Nothing to compare it with. So where does a machine begin?

[BILD: 70 Vogelschädel als Raster, Messpunkte leuchten auf (klein: „541 points per skull“); Schnabelformen gehen ineinander über; Einblendung „per Colossal · not peer-reviewed“]
With the living. Colossal says its model, called GenoMorph, studied more than seventy living bird species... their DNA, and the exact shape of their skulls. That is how it learned which switches in the DNA shape a beak.

[BILD: Dodo-Schädel, am DNA-Strang leuchten viele Punkte; neuer Zähler: 2.300]
Then it turned to the dodo... and came back with about twenty-three hundred candidates.

[BILD: Punkte mit offenem Ausgang, Zellschale unter dem Mikroskop; Einblendung „Colossal: candidates, not proof“]
[thoughtful] Twenty-three hundred places in the DNA that might have shaped that famous beak. Might. Colossal itself says this is not proof. Every candidate still has to prove itself in the lab.

[BILD: lebende Vögel ziehen über den Dodo-Schädel hinweg]
So that is how a machine finds the differences that matter. It doesn't know them. It learns them... from animals that are still alive.

[BILD: ruhiges Zwischenbild im Kanal-Look, dezenter Abo-Hinweis; kein QR]
[calm, conversational] Today, the machine writes a list. The machines that follow will be asked for far more. This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. Want that too? Then subscribe.

[BILD: durchsichtige Kunstschale mit Küken (Colossal/AP, Mai 2026; Ampel prüfen); Einblendung „26 chicks · per Colossal“]
[thoughtful] A list is not an animal, of course. Somebody still has to grow one... and a bird grows in an egg. This spring, the company says, live chicks hatched from a shell no bird ever laid... clear as glass, made by a 3D printer.

[BILD: Liste vollständig abgehakt; ein Gehegetor öffnet sich, Schatten eines großen Tiers]
[curious] So suppose all of it works. Every pick, right. Is the animal that walks out... a mammoth?

## STATION 4 · 5:11–6:43 · Die Lektion der Schattenwölfe (ehrlicher Block)

*Beantwortet: Was kommt wirklich heraus, und wann? Öffnet: Ist ein Elefant im Fell der ganze Gewinn?*

[BILD: drei helle Wölfe im Schnee (Colossal-Material, Ampel prüfen)]
[calm, conversational] There is a way to check. Three animals made by editing a living relative are already alive.

[BILD: Namen als Einblendung: Romulus, Remus, Khaleesi; Grauwolf-Strang mit 20 markierten Stellen, Einblendung „20 edits · 14 genes“; Zahn „13,000 years“, Ohrknochen „72,000 years“; dann die Wölfe im Lauf, Einblendung „per Colossal, Oct 2026“]
Romulus, Remus and Khaleesi. Colossal presented them as dire wolves... a wolf that died out thousands of years ago. They began as gray wolf cells. Twenty edits went in... guided by DNA from a tooth thirteen thousand years old. Colossal says the oldest are now two years old, healthy, and hunting as a pack.

[BILD: ein Wolf blickt in die Kamera]
[curious] So are they dire wolves?

[ZITATKARTE, nur im Bild: “The three animals produced by Colossal are not dire wolves.” · IUCN SSC Canid Specialist Group, 18.4.2025 (F13) · darüber Schriftzug „IUCN Red List“]
[thoughtful] Wolf experts at the union behind the Red List of threatened species say no. And Colossal's own chief scientist, Beth Shapiro, has put it just as plainly.

[ZITATKARTE, gesprochen: “Our animals are gray wolves.” · Beth Shapiro, chief scientist, Colossal · Live Science, 2025 (recherche-v2, 2.8 und 5.1) · voller Satz und Datum am Original prüfen · Clip-Option C5 nur, wenn sie den Satz dort sagt und keine Musik darunter liegt]
"Our animals are gray wolves."

[BILD: links leuchten Fell, Fett und Ohren; rechts verblasst das Skelett des Originals]
[calm, conversational] That is what "bringing back" means today. The traits come back. The species does not.

[BILD: der Zaun aus dem Hook; die Silhouette wird als Elefant im Mammutfell erkennbar]
And it tells you what would really stand behind that fence. An Asian elephant... with a mammoth's fur, fat, and small ears. An elephant built for the cold.

[BILD: Zeitstrahl: 2028 durchgestrichen, daneben „early 2030s“; Einblendung „TIME, Aug 24, 2026“]
And not soon. The first calf was once promised for twenty twenty-eight. Now Colossal says the early twenty-thirties... and its chief executive says there is no hard date.

[ZITATKARTE, nur im Bild: “We don't have a hard date. Not 2036, but not 2030 either.” · Ben Lamm, TIME, 24.8.2026 (F1) · Wortlaut bisher aus einem Suchauszug, am Original prüfen · Clip-Option C4, sobald der Wortlaut am Ton geprüft ist]

[BILD: leeres Ultraschallbild; Kalender, 22 Monate laufen durch; klein „as of Nov 2026“]
[wry] That is a hope, not a timetable. So far, nobody has reported a mammoth embryo... or a pregnant elephant. And an elephant carries her calf for almost two years.

[BILD: der Zaun; dahinter ein einzelner zotteliger Elefant, klein in weiter Schneelandschaft]
[curious] So is one shaggy elephant, years behind schedule, really what all of this is for?

## STATION 5 · 6:43–8:51 · Die Wendung: Tiere, die es noch gibt

*Beantwortet: Wofür das alles? Öffnet: Wer entscheidet, und was bleibt für das Kind am Zaun?*

[BILD: heutige Tiere im Kanal-Look, lebendig und nah]
[thoughtful] It isn't. The bigger prize is the animals that are still here. And the mammoth itself shows why.

[BILD: Wrangelinsel auf der Karte, daneben Pyramiden als Silhouette; Einblendung „~4,000 years ago · Cell, 2024“; dann zerfallen DNA-Stränge in Schnipsel]
The last mammoths died only about four thousand years ago, on a remote island in the Arctic. The great pyramids of Egypt were already standing. But nobody was there to freeze a single living cell. The ice kept only broken DNA. That is why every trait has to be rebuilt... difference by difference.

[BILD: Labor im Look der 1980er, ein Röhrchen wandert in den Stickstofftank; Einblendung „Willa“]
[calm, conversational] Now take an American animal that got luckier. In the nineteen-eighties, somebody froze living cells from a black-footed ferret named Willa.

[BILD: geklonter Schwarzfußiltis mit Jungen (USFWS-Material, Ampel prüfen); Einblendung „U.S. Fish & Wildlife Service“]
Decades later, those cells became living clones. According to U.S. wildlife officials, one of them had babies two years ago... and last year, her babies had babies of their own.

[BILD: Stammbaum: Willa, Klon, Junge, Enkel]
[wry] A ferret from the nineteen-eighties... has grandchildren.

[BILD: Tankdeckel öffnet sich, Kältenebel]
No short list. No guesswork. Just a freezer, opened in time.

[BILD: viele Tanks, darüber Karte der USA; Einblendung „~2,300 listed species · FWS / NYT, June 2026“; Genomdaten strömen ins Netz]
[calm, conversational] Now scale that up. The U.S. government and Colossal plan to freeze cells from every species on the country's endangered list. Every one. And the genomes are meant to go online, free.

[BILD: Wald und Tankraum nebeneinander; dann das Raster aus Station 3 über lebenden Tieren]
[thoughtful] A freezer is not a forest. It protects no habitat. But think about what the machine learns from. The living. Every genome saved is one more lesson in which differences matter. Every species that vanishes unread... is a lesson gone for good.

[BILD: Asiatische Elefantenkuh mit Kalb im Zoo; Impfung (Clip-Option C6 Houston Zoo, Wortlaut und Musik prüfen); Einblendung „Journal of Virology, July 28, 2026 · co-funded by Colossal“]
Even the mammoth depends on the living. Its mother would be an Asian elephant... and her species is endangered too. In North American zoos, the leading killer of her calves is a virus. This summer, researchers reported on a vaccine that Colossal helped pay for. Two young elephants who got it caught the virus... and came through without treatment.

[BILD: das Kalb läuft zur Herde]
Two calves are a first sign, not proof. But the road to a mammoth begins with keeping elephants alive.

[BILD: ruhige Einblendung „49,505 threatened species · IUCN Red List 2026“]
And the elephant is not alone. This year's Red List counts almost fifty thousand species as threatened.

## GROSSE ANTWORT · 8:51–10:08 (mit Kernsatz und Abo-Aufruf 2)

*Löst Grundfrage und Du-Bezug ein. Offen bleibt bewusst: Wer entscheidet?*

[BILD: Mammut aus DNA-Linien (Thumbnail-Motiv), einzelne Merkmale leuchten auf und wandern auf einen Elefanten]
[thoughtful] So here is what the evidence says. Artificial intelligence is helping to bring back the mammoth's traits... in an elephant. Not the mammoth itself.

[BILD: Mammut-Plakat, Kameras davor; Schwenk auf einen unscheinbaren Kühlraum; über den Tanks läuft das Raster der Maschine]
The mammoth draws the cameras and the money. The rescue itself happens somewhere quieter. In a freezer... and in a machine that is learning to read what's inside.

[BILD: Zaun im Schnee, große und kleine Hand; Einblendung „SCENARIO · EARLY 2030s“; der Elefant im Mammutfell hebt den Kopf]
[calm, conversational] So stand at that fence once more. Maybe, in the early twenty-thirties, there really is a small hand in yours... and an elephant in a mammoth's coat lifts its head.

[BILD: offene Tundra hinter dem Zaun; Einblendung „IUCN Congress, Oct 2025: moratorium rejected by one vote“; der Zähler aus Station 2 steht jetzt auf 1]
Should it ever walk free on the tundra? Last year, the union behind the Red List voted on a pause for genetically modified wild animals. The pause failed... by a single vote. So who decides?

[BILD: das Kind, erwachsen, zwischen Elefant, Iltis und Vögeln; an der Wand hängt noch das Poster]
[thoughtful] Whatever the answer, the prize was never one mammoth. It is that child, grown up, in a world where elephants, ferrets, and thousands of others are still alive... not just on a poster.

[BILD: Poster und Kühltank nebeneinander; Kernsatz als großer Text]
The mammoth is the poster. The freezer is the ark.

[BILD: Schlussbild: Zaun, Schnee, die Fellsilhouette dreht den Kopf; Abo-Hinweis, kein QR]
[calm, conversational] These films exist so that the arrival of superintelligence goes well for everybody... and for everything that lives here with us. Want that too? Then subscribe.

## ENDSCREEN · 10:08–10:23

[BILD: Schlussbild läuft 15 s weiter (Zaun, Schnee, Atemwolke), Musik bleibt, freie Flächen für die Endcards]

---

## Vorbehalte für den Faktencheck

Die Tabelle mit allen geprüften Fakten steht in `kritik-v1.md`, Abschnitt 8. Hier steht nur, was vor der Stimme noch am Original zu prüfen ist, und was der Text dann tut.

1. **Wichtigste Prüfung: die Rolle der KI beim Mammut** („As reported this year, artificial intelligence combs through mammoth and elephant DNA...“). `recherche-v2.md` 2.3 stützt das nur über Zweitquellen zu TIME (24.8.2026). Eine benannte Mammut-KI wie GenoMorph gibt es öffentlich nicht, das sagt der Text selbst („Colossal has not shown that step in public“). TIME im Original lesen.
2. **„More than a hundred and fifty genes“:** TIME nur über Dexerto (27.9.2026). Hält die Zahl nicht, heißt die Zeile „This is where the machine's ranking comes in... and the list gets shorter.“ und die Lücke-Zeile „From seven genes in a mouse... to a far longer list in an elephant.“ Der Zähler springt dann von 1.600 direkt auf die 7.
3. **Clip C1:** Wortlaut am Ton prüfen. Die Zeile danach („No magic. Nothing overnight.“) lehnt sich an „magically overnight“ an. Fällt der Clip, fallen auch „And the man who runs Colossal ... He doesn't.“ und „No magic. Nothing overnight.“ Der Rest schließt ohne Lücke an.
4. **Kritik an der Wollmaus:** `recherche-v2.md` 2.8 schreibt „alle Edits waren schon als Haar-Gene bei Mäusen bekannt“ (Herridge, BBC Science Focus 3/2025). Der Text sagt bewusst nur „Genes like these“. Wortlaut am Original prüfen. Fällt der Satz, bleibt „So the mice prove the editing... not the list.“ als Urteil des Films stehen.
5. **Zitatkarte Shapiro:** Zitat und Titel sind in `recherche-v2.md` als [sicher] geführt (Live Science, 4/2025). Den vollen Satz am Original lesen: Geht er nach „gray wolves“ weiter, bekommt die Karte Auslassungspunkte.
6. **Zitatkarte Lamm** („We don't have a hard date...“): Wortlaut aus einem Suchauszug zu TIME. Der Sprecher sagt nur „there is no hard date“.
7. **Iltis:** FWS-Original gegenlesen (Klon Antonia, Würfe 2024, Würfe ihrer Jungen 2025). Das Todesjahr von Willa kommt im Text nicht vor.
8. **Stand-Sätze am Tag vor der Veröffentlichung neu prüfen:** „nobody has reported a mammoth embryo... or a pregnant elephant“ und „Colossal has not shown that step in public“ (beide Stand 16.11.2026).
9. **Ein Klick genügt:** Colossal sitzt in Dallas (in `recherche-v2.md` nur indirekt über Dallas Innovates und den Lagerort der Biobank). Die Pyramiden-Datierung (um 2560 v. Chr., also rund 500 Jahre vor den letzten Mammuts). Die Wrangelinsel liegt in der Arktis.
10. **Firmenangaben sind hörbar zugeordnet** („Colossal says“, „the company says“, „Colossal itself says“, „Colossal presented“): 100 Genome, GenoMorph, Küken, Schattenwölfe, Termin.
11. **Eigene Schlüsse des Films, keine Belege:** „Every genome saved is one more lesson in which differences matter“ (folgt aus F7), „in a machine that is learning to read what's inside“ und die Brücke zum Abo-Aufruf („The machines that follow will be asked for far more“).
12. **Zeitangaben** („this year“, „this October“, „this spring“, „this summer“, „last year“, „two years ago“, „this year's Red List“) stimmen für eine Veröffentlichung bis 31.12.2026.
13. **Clips:** Nur C1 hat einen Wortlaut. Clip-Optionen nach der Ton-Prüfung: C4 statt der Karte Lamm, C5 statt der Karte Shapiro, C6 im Elefanten-Absatz. Dann wären es 3 bis 4 Clips, zusammen unter 45 s.
14. **Zahl im Hook:** „1.4 million“ steht in Ziffern, damit das Prüfskript sie als eine Zahl zählt.

## Abweichungen vom Gerüst

- Station 1 beantwortet nicht mehr „Warum gerade das Mammut?“, sondern „Was ist der Plan, und was tut die Maschine?“. Dauerfrost und die 100 Genome stehen dort in zwei Sätzen.
- Der Pyramiden-Fakt steht wie in v1 in Station 5 (REGELN §1.4: keine Geschichte in den ersten 2 Minuten).
- Reihenfolge in Station 5 wie in v1: Iltis → Biobank → Elefant.
- Die Küken stehen hinter dem Abo-Aufruf 1 und führen zur Frage „Is the animal that walks out... a mammoth?“.
- Nicht verwendet: Elefanten-Hautzellen, „3× längeres Fell“, F9-Zitat, die 100 Millionen Dollar der Stiftung, das Lamm-Zitat als gesprochener Satz. Die 541 Messpunkte, die 26 Küken und die rund 2.300 Listen-Einträge stehen nur im Bild.
