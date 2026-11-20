#!/usr/bin/env python3
"""Film 13 "The AI Bubble Could Pop" · shot list (SINGLE SOURCE). Every shot is anchored to a VO PHRASE, never to a second.
Phrases are searched in the WHOLE film, each one after the previous shot's start (robust to a re-split of the VO segments),
exactly like lib/kit.mjs T.F(phrase, after) / T.seq(). Times come from timing.json.

  python3 tools/shots_bubble.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, rewrites docs/shots.md

Layer: SZENE (a world: place, figures, one hero light) · EXPL (explainer: chart / map / gauge / label, ink and light on night or on
paper) · SZENE>EXPL / EXPL>SZENE (the shot holds the transformation; counts half).
shot(id, layer, start_phrase, [anchor phrases], picture, moves (≤ 2), transition → carrier · position · direction, star)
  start_phrase None = c01 starts at 0; 'END' = the end screen (after the last VO word).
Text on screen: English, short (labels, numbers, sources); "artificial intelligence", never "AI" (exception: the verbatim
Altman quote). Never inside the subtitle zone (y > 910).
"""
import json, re, sys, os

ROOT = os.environ.get('F13ROOT', '/mnt/project-files/scenario/film-blase/').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
def default_timing():
    real = ROOT + 'audio/timing.json'
    return real if os.path.exists(real) and os.path.getsize(real) > 100 else os.path.join(HERE, '..', 'audio', 'timing-provisional.json')
TIMING = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else default_timing()
TM = json.load(open(TIMING))
WORDS = TM['words']
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def find(phrase, after=-1.0):
    """start time of the first occurrence of phrase whose first word starts at or after `after` (last word: prefix match)"""
    q = [norm(p) for p in phrase.split() if norm(p)]
    for i in range(len(WORDS) - len(q) + 1):
        if WORDS[i]['s'] < after - 1e-6: continue
        if all((norm(WORDS[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(WORDS[i + j]['w']) == p) for j, p in enumerate(q)):
            return WORDS[i]['s']
    raise SystemExit(f'phrase not found after {after:.2f}: "{phrase}" ({TIMING})')

VO_END = WORDS[-1]['e']

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, title, light (time of day · the ONE hero light), builder package. The start phrase = the first shot's phrase.
CHUNKS = [
    ('c01', 'Hook · die Blase über dem Rechenzentrum, Altman, es geschah schon einmal, A1', 'Nacht · Held: die goldene Seifenblase aus Banknoten → Gaslampe über dem Tisch → Abend-Dämmerung über der Schiene', 'Lead'),
    ('c02', 'Die Manie: die Brontë-Schwestern, Charlottes Brief, −64 %, Mackay', 'Nacht, Wind über dem Moor · Held: das Pfarrhausfenster / die Kerze auf dem Tisch', 'B1'),
    ('c03', 'A2 die Schiene bleibt, 6.000 Meilen, Greenwich · Schienen aus Glas, 5 % beleuchtet', 'Morgendämmerung im Nebel (A2) → Nacht auf See · Held: der Morgenhimmel → das Licht der einen Faser', 'B1'),
    ('c04', 'Global Crossing, die Nachfrage steigt weiter, das billige Internet erreicht dich, Abo, Bezos', 'Nacht · Held: die Glasfaser-Enden → dein Handy-Licht → der Lichtstrahl im Lagerhaus', 'B1'),
    ('c05', 'Der ehrliche Test: Chips gegen Schienen, fast voll, was bleibt, das Urteil', 'Nacht · Held: die Lebensdauer-Balken (Explainer-Licht)', 'B1'),
    ('c06', 'Die Wand: drei Ziegel, METR geht hindurch, Geld Strom Schulden, Risse am Rand', 'Nacht → Wintermond über dem See · Held: die METR-Kurve → der Mond auf dem Eis', 'B2'),
    ('c07', 'Wer zahlt: deine Stromrechnung, deine Rente, die Schwestern damals und du heute', 'Nacht · Held: die Küchenlampe (du am Tisch) → das Pfarrhausfenster', 'B2'),
    ('c08', 'Die Reste: Notverkauf, 1844 der Penny-Zug, Bedingungen in Ohio, 23 Staaten', 'Nacht · Held: die Lampe über der Auktion → das Siegel (Explainer) → die Küchenlampe', 'B2'),
    ('c09', 'Offene Türen (2009, Stockholm), ein Stück besitzen (Intel), öffentliche Schienen', 'blaue Stunde · Held: das Licht im offenen Kabelschacht → der Wafer → das Alpental', 'B3'),
    ('c10', 'Menschen bauen Schienen (Genossenschaften, B4RN), noch kein Sitz, A3 der Penny-Zug der KI', 'Staub-Abend → grüner Tag → Abend (A3) · Held: die eine Glühbirne → der kleine warme Zug', 'B3'),
    ('c11', 'Niemand gibt etwas ab, die ehrliche Grenze, die offenen Fragen, Nadella, Perez', 'Nacht → Schnee vor Davos · Held: die Waage (Explainer) → das Pult im Fenster → die Plateaus', 'B3'),
    ('c12', 'Die Blase darf platzen, wer fährt mit, A4 der Preis eines Sitzes, Endbild', 'Abenddämmerung (A4) · Held: die Blase ein letztes Mal → die Funken an der neuen Schiene → der ferne Zug', 'B3'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False):
    S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook (Lead) ==========================================================================================================
shot('1.01', 'SZENE', None, ['bubble could pop'],
     '**Erstes Bild = Thumbnail-Motiv.** Nacht, Sterne, viel leerer Himmel. Oben rechts die goldene Seifenblase (`B.bubble`, große Banknoten drehen sich darin), darunter ein langes, flaches Rechenzentrum (`B.dataCenter`, kühle Serverlichter). Unten links du (gelber Regenmantel, Kapuze), winzig, schaust hinauf. Auf **pop** zuckt die Haut der Blase einmal (Zittern 0,3 s).',
     '① langsamer Push auf die Blase ② die Noten drehen', 'Plansequenz (Kran nach unten)', star=True)
shot('1.02', 'SZENE', 'And the people building', ['saying so'],
     'Kran nach unten zum Tor im Zaun: drei Mitarbeitende (Indigo, Lanyard-Ausweise, atmen). Auf **saying so** dreht eine Person den Kopf hoch zur Blase.',
     '① Kran ② Kopf hebt sich', 'Neigung nach oben-links · Träger ein Goldfaden löst sich vom Blasenrand und zieht die Zitat-Grundlinie · oben links · nach links')
shot('1.03', 'EXPL', 'Sam Altman', ['asked it out loud', 'My opinion is yes'],
     '**Zitatkarte (wörtlich)** im Himmel links neben der Blase, kein Rahmen; die Zeilen steigen aus ihrer Grundlinie (Masken-Wipe): „Are we in a phase where investors as a whole are overexcited about AI?“ (auf **asked**), dann allein und größer: „My opinion is yes.“ (auf **yes**, steht ≥ 1,7 s). Quelle `— Sam Altman, August 2025`.',
     '① die Zeilen ② Drift nach links', 'Verwandlung · Träger Grundlinie von „yes“ → Achse des Diagramms · Mitte · nach rechts')
shot('1.04', 'EXPL', 'But the machines', ['Not even a little', 'speeding up'],
     'Aus der Grundlinie wird eine Zeitachse. Zwei Linien: `MONEY` (Papierfarbe) wackelt und knickt auf **Not even a little** nach unten; `CAPABILITY` (Maschinen-Kühl) steigt weiter und schießt auf **speeding up** oben aus dem Bild. Klein: `TASK LENGTH IT HANDLES ALONE · DOUBLES EVERY FEW MONTHS · METR`.',
     '① die zwei Linien ② Schwenk nach rechts', 'Fahrt · Träger die Geldlinie läuft nach rechts in die Blasenhaut · rechts · nach rechts')
shot('1.05', 'SZENE', 'So what happens', ['superintelligence', 'money runs out'],
     'Zurück an der Blase: das Rechenzentrum darunter glüht heller (die Maschinen arbeiten), die Blase zittert (Bewegungsbögen am Rand), auf **money runs out** wird die Haut dünn und flackert.',
     '① Zittern ② Rechenzentrum glüht auf', 'Flug + **Signatur-Flip** · Träger eine Banknote löst sich, taumelt in die Kamera, dreht sich um: Rückseite = Aktienzertifikat · Mitte · nach vorn')
shot('1.06', 'SZENE>EXPL', "It's happened before", ['happened before'],
     'Eine Note löst sich aus der Blase (`detach`), taumelt auf die Kamera zu und **dreht sich um**: ihre Rückseite ist ein Eisenbahn-Aktienzertifikat von 1845 mit Lok-Stempel. Es füllt das Bild → **Papier-Schnitt** (`B.paperPlate`, auf beiden Seiten identisch) → **Weltwechsel 1/min**: Draufsicht auf einen Tisch der 1840er unter einer Gaslampe.',
     '① die Note fliegt und dreht ② –', 'Papier-Schnitt · Träger das Zertifikat (gleiche Lage, gleiche Größe) · Mitte · –')
shot('1.07', 'SZENE', 'A whole country', ['savings', 'new machine'],
     'Draufsicht, Gaslampe (Held) oben links: das Zertifikat auf dem Tisch, Münzen rutschen aus einem Stoffbeutel darauf (**savings**), daneben eine Teetasse. Auf **machine** glüht der Lok-Stempel auf; die Tasse kräuselt sich (das Beben der Maschine).',
     '① Münzen gleiten ② Stempel glüht', 'Plansequenz')
shot('1.08', 'SZENE', 'The bubble burst', ['burst', 'machine won'],
     'Auf **burst** reißt das Zertifikat in Konfetti, das um den Stempel wegfliegt. Der Stempel bleibt; auf **won** wird die gedruckte Lok eine echte (Tinte → Indigo-Körper, Laterne, Dampf) und rollt nach rechts los.',
     '① Konfetti ② die Lok fährt an', 'Fahrt · Träger die Lok · Mitte → rechts · nach rechts')
shot('1.09', 'SZENE>EXPL', 'One of the best-known', ['mass delusion', 'His own newspaper', 'fear a crash'],
     'Die Kamera fährt mit der Lok nach rechts über den Tisch, bis sie über eine aufgeschlagene Zeitung fährt: `THE GLASGOW ARGUS` · `OCTOBER 1845`. **Keine Zitatkarte, kein lesbarer Wortlaut** (Mackay ist paraphrasiert): eine Schreibhand mit Feder unterstreicht auf **newspaper** eine Zeile der Leitartikel-Spalte mit einer Tintenlinie; die Lok verschwindet hinter der Falz.',
     '① Fahrt ② die Feder unterstreicht', 'Plansequenz')
shot('1.10', 'EXPL>SZENE', 'Then the crash came', ['crash', 'Ordinary savers lost'],
     'Auf **crash** stürzt die Unterstreichung ab (Akzent: die Tintenlinie fällt steil über den Spaltenrand nach unten). Sie landet zwischen einer Reihe leerer Stoffbeutel (**savers lost**), die in sich zusammensacken.',
     '① die Linie stürzt ② die Beutel sacken', 'Fahrt + Flug · Träger die Tintenlinie läuft nach rechts, die Kamera fliegt ins Papier · Mitte · nach rechts')
shot('1.11', 'SZENE', 'But what they paid for', ['still running today'],
     '★ **Schienen-Anker A1.** Die Tintenlinie läuft nach rechts, die Kamera fliegt ins Papier (Bild voll Papier, die Linie fest bei y ≈ 700); Tinte flutet von oben und unten: oben wird Abendhimmel, unten Erde, ein Nebelband am Horizont; die Linie wird eine **eiserne Schiene**, Schwellen wachsen. Rechts von der Mitte stehst du. Auf **still running today** gleitet von links ein heutiger Zug heran und hält (Fenster warm).',
     '① Tinte → Abend ② der Zug kommt und hält', 'Plansequenz')
shot('1.12', 'SZENE', 'So when this bubble pops', ['holding the paper', 'who gets to ride'],
     'Ein Papierfetzen der Blase segelt herab in deine Hand (**holding the paper**) und **dreht sich um**: ein Handy mit deinem Fondsauszug (Zahl sinkt, kühl). Die Tür des Zuges öffnet sich vor dir, warmes Licht fällt auf dich (**who gets to ride?**); sie gleitet wieder zu, bis nur ein senkrechter Lichtspalt bleibt.',
     '① Papier → Handy ② die Tür', 'Seam-Plate c01|c02 · Träger der senkrechte Lichtspalt der Tür → das erleuchtete Pfarrhausfenster · Mitte rechts · –')

# ===== c02 · Die Manie (B1) =======================================================================================================
shot('2.01', 'SZENE', 'In a Yorkshire parsonage', ['parsonage', 'three sisters', 'The railway'],
     '**Weltwechsel (über die Seam-Plate):** der Lichtspalt weitet sich zum Fenster eines Pfarrhauses im Moor bei Nacht, Gras im Wind, Wolken. Push durchs Fenster: drei Silhouetten (Indigo, Kleider der 1840er, gesichtslos) an einem Tisch, Schreibpapier, **ein** Aktienzertifikat mit Lok-Stempel (dasselbe wie in c01). Auf **railway** glüht der Stempel kurz.',
     '① Push durchs Fenster ② Kerzenlicht', 'Plansequenz')
shot('2.02', 'SZENE', 'Charlotte, Emily and Anne', ['Charlotte', 'Jane Eyre', 'Wuthering Heights'],
     'Drei Namens-Labels hängen sich an die Silhouetten (`CHARLOTTE · EMILY · ANNE BRONTË`, Linie + Label, Wipe von unten). Auf **Jane Eyre** dreht sich ein Blatt Schreibpapier um und wird ein Buchrücken `JANE EYRE · 1847`, auf **Wuthering** ein zweiter `WUTHERING HEIGHTS · 1847` (die Zukunft, warm).',
     '① Labels ② Blatt → Buchrücken (Flip)', 'Plansequenz')
shot('2.03', 'SZENE', 'Emily runs the money', ['Emily runs', 'nervous'],
     'Nah: Emilys Hand schreibt Zahlen in ein kleines Kontobuch. Auf **nervous** lehnt sich Charlottes Silhouette zurück, die Hände falten sich.',
     '① die Hand schreibt ② Charlotte lehnt sich zurück', 'Verwandlung · Träger Kontobuch → Briefbogen · Mitte · –')
shot('2.04', 'EXPL', 'In January eighteen forty-six', ['January', 'too late'],
     'Charlottes Brief, nah, Federhand: Datum `January 1846` oben; die Feder schreibt in Handschrift „…ere it be too late.“ (Wortlaut belegt, Brief an Margaret Wooler, 30.1.1846) und **stoppt** nach **too late**.',
     '① die Feder schreibt ② stoppt', 'Plansequenz', star=True)
shot('2.05', 'SZENE', "But she won't go", ['sister', 'they hold'],
     'Der Brief wird gefaltet. Über den Tisch: Emilys Hand ruht auf dem Zertifikat (**hold**). Die Kerzenflamme steht ruhig.',
     '① Brief faltet sich ② Flamme', 'Verwandlung · Träger die Oberkante des Zertifikats → die Index-Linie · Mitte · nach rechts')
shot('2.06', 'EXPL', 'Then the bubble bursts', ['bursts', 'eighteen forty-nine', 'two thirds'],
     'Die Oberkante des Zertifikats wird eine Linie: `RAILWAY SHARE INDEX · 1845–1849`. Sie steigt, gipfelt, fällt auf **bursts**; die Fläche darunter leert sich auf ein Drittel (Verlust in kaltem Blau, nie Rot); `−64 %` auf **two thirds**. Quelle klein `ODLYZKO`.',
     '① die Linie fällt ② die Fläche leert sich', 'Verwandlung · Träger die geleerte Fläche zerfällt in Papierblätter, die nach unten sinken · Mitte · nach unten')
shot('2.07', 'SZENE', 'Small savers everywhere', ['holding paper'],
     'Die Blätter fallen in viele Hände (Indigo-Silhouetten: eine mehlige Bäckerhand, eine Pfarrersmanschette, eine Hand mit Schürze); sie halten Zertifikate, die keiner will. Ein stiller Raum, eine Lampe.',
     '① Blätter fallen in Hände ② langsamer Rückzug', 'Verwandlung · Träger ein Zertifikat → die Zeitung aus c01 · Mitte · –')
shot('2.08', 'EXPL', 'And the expert who saw', ['no reason to fear', 'Charles Mackay', 'written the book'],
     'Die Zeitungsseite aus c01 kehrt zurück (`THE GLASGOW ARGUS · OCTOBER 1845`, die unterstrichene Spaltenzeile, **kein Zitat**). Auf **Charles Mackay** Label `CHARLES MACKAY · EDITOR`; auf **book** dreht sich die Seite um (Flip) und wird der Buchdeckel `EXTRAORDINARY POPULAR DELUSIONS AND THE MADNESS OF CROWDS · 1841`.',
     '① Seite → Buch (Flip) ② Label', 'Plansequenz')
shot('2.09', 'SZENE>EXPL', 'The expert missed it', ['missed it', "didn't"],
     'Auf **missed** kühlt der Buchdeckel ab (Licht weicht von ihm). Daneben glüht Charlottes Brief auf dem Tisch im Pfarrhaus: „…ere it be too late.“ (**didn\'t**).',
     '① Licht wandert vom Buch zum Brief', 'Verwandlung · Träger die Tintenzeile unter „too late“ läuft nach rechts und wird der Horizont / die Schiene von A2 · Mitte · nach rechts')

# ===== c03 · A2 und Glas (B1) =====================================================================================================
shot('3.01', 'SZENE', "But one thing didn't vanish", ["didn't vanish", 'The track'],
     '★ **Schienen-Anker A2.** **Weltwechsel:** Morgendämmerung nach dem Krach, Nebel im Tal; die Tintenzeile wird eine frische eiserne Schiene quer durch das Tal, unberührt, Tau glänzt. Kein Zug, kein Bahnsteig. Auf **The track** fängt der Schienenrand das erste Licht.',
     '① Nebel zieht ② langsamer Rückzug', 'Verwandlung · Träger die Schiene hebt sich in die Draufsicht und wird eine Linie auf der Karte · Mitte · nach oben', star=True)
shot('3.02', 'EXPL', 'Those boom years', ['six thousand miles', "today's network"],
     'Karte von Großbritannien (Umriss, Papier auf Nacht): die Strecken der 1840er zeichnen sich in Tinte-Gold (`~6,000 MILES · 1840s`); auf **today\'s network** legt sich das heutige Netz in Kühl darüber; vieles deckt sich.',
     '① Linien zeichnen sich ② zweites Netz', 'Verwandlung · Träger ein Knoten der Karte → das Zifferblatt einer Bahnhofsuhr · Mitte · nach vorn')
shot('3.03', 'EXPL', 'And in eighteen forty-seven', ['crisis', 'Greenwich time', 'one clock'],
     'Eine große Uhr (Held), um sie herum kleine Stadtuhren, jede zeigt eine andere Zeit. Auf **Greenwich time** beginnen sie sich nacheinander einzureihen (eine nach der anderen, langsam, **one clock**). Label `RAILWAYS BEGIN SWITCHING TO GREENWICH TIME · DEC 1847`.',
     '① Zeiger springen nacheinander ② –', 'Plansequenz')
shot('3.04', 'EXPL', 'So was that just luck', ['luck', 'rails behind'],
     'Die Uhren ziehen sich zu einem Punkt `1840s` auf einer Zeitleiste zusammen. Auf **rails behind** wächst rechts ein zweiter, leerer Punkt.',
     '① Zusammenziehen ② neuer Punkt', 'Flug · Träger der zweite Punkt wird das Lichtende einer Glasfaser · rechts · nach vorn')
shot('3.05', 'SZENE', 'Around the year two thousand', ['internet', 'made of glass'],
     '**Weltwechsel (getragen vom Lichtpunkt):** ein Kabelleger auf schwarzer See bei Nacht, das Kabel spult ins Wasser; das Lichtende der Faser leuchtet im Kabel. Label `2000`.',
     '① das Kabel spult ② Wellen', 'Fahrt · Träger das Kabel · Mitte · nach unten')
shot('3.06', 'SZENE', 'Companies laid fibre-optic', ['oceans', 'Far more'],
     'Die Kamera folgt dem Kabel hinab bis zum Meeresboden, wo es sich neben viele andere legt (Bild, keine Datenkarte). Auf **Far more** zeigen die Kabel viele, viele Stränge.',
     '① Abstieg ② –', 'Flug · Träger der Kabelquerschnitt · Mitte · nach vorn')
shot('3.07', 'EXPL', 'By two thousand and one', ['five percent', 'in the dark'],
     'Querschnitt eines Kabelbündels: 100 Glasfasern. Auf **five percent** leuchten 5, 95 bleiben dunkel; `≈ 5 % LIT` · `USA, ESTIMATE 2001`. Auf **in the dark** sinkt das Licht der übrigen noch einmal ab.',
     '① 5 Fasern glühen ② –', 'Verwandlung · Träger das Bündel → ein Zertifikat mit Stempel · Mitte · –')

# ===== c04 · Global Crossing bis Bezos (B1) =======================================================================================
shot('4.01', 'EXPL', 'Then the crash', ['bankrupt', 'sliver'],
     'Der Bündelquerschnitt wird ein Stempel: `GLOBAL CROSSING · BANKRUPT · 2002` landet (kaltes Blau). Daneben ein großer Schuldenbalken `$12.4 BN DEBT`; auf **sliver** ein hauchdünner Balken `$250 M` (`NEW OWNERS, 2002`).',
     '① Stempel ② Balken', 'Plansequenz')
shot('4.02', 'EXPL', 'The old shareholders', ['Nothing'],
     'Ein Stapel Aktienzertifikate: auf **Nothing** drehen sie sich nacheinander um (Flip), die Rückseiten sind leer.',
     '① Flips nacheinander', 'Verwandlung · Träger der letzte leere Bogen → Diagrammfläche · Mitte · –')
shot('4.03', 'EXPL', 'But while the companies', ['crashed', "demand didn't", 'right through the bust'],
     'Zwei Linien: `TELECOM STOCKS` stürzen ab (**crashed**), `INTERNET TRAFFIC` steigt durch den Absturz hindurch weiter (**demand didn\'t**), bis `×4 · USA 1997–2001`.',
     '① Absturz ② Anstieg', 'Verwandlung · Träger die steigende Linie → eine Faser im Bündel · rechts · –')
shot('4.04', 'EXPL', 'And all that spare glass', ['cheap', 'ninety-nine percent'],
     'Das Bündel aus c03: eine dunkle Faser nach der anderen leuchtet auf. Daneben fällt eine Preiskurve: `−99 %` auf **ninety-nine** · `PRICE OF MOVING DATA (US IP TRANSIT) · 1998–2015`.',
     '① Fasern leuchten auf ② Preis fällt', 'Rückzug · Träger eine leuchtende Faser → Straßenverteiler → Router → dein Handy · Mitte · nach hinten')
shot('4.05', 'EXPL>SZENE', "It's the same kind of network", ['reaching you'],
     'Rückzug aus der Faser: durch einen Straßenverteiler, einen Router im Wohnzimmer, bis zu einem Handy in deiner Hand (gelber Ärmel): darauf läuft dieser Film (Fortschrittsbalken).',
     '① Rückzug', 'Plansequenz', star=True)
shot('4.06', 'SZENE', 'This channel exists', ['everyone', 'subscribe'],
     'Ruhig: du am Fenster, das Handy-Licht in deinem Gesicht-Schatten (kein Gesicht), dahinter eine Stadt aus erleuchteten Fenstern. Kein Abo-Knopf-Grafik.',
     '① Fenster der Stadt glimmen ② Push', 'Verwandlung · Träger ein Stadtfenster → Punkt `2000` auf der Zeitleiste · links · –')
shot('4.07', 'EXPL', 'So twice now', ['twice', 'builders tell'],
     'Zeitleiste mit zwei Punkten: `1840s` (Schienen-Icon) und `2000` (Faser-Icon). Auf **builders** zeigt ein dritter Abschnitt nach rechts ins Leere.',
     '① Punkte ② Leiste wächst', 'Flug · Träger der Lichtpunkt → Lichtstrahl im Lagerhaus · rechts · nach vorn')
shot('4.08', 'SZENE>EXPL', 'Jeff Bezos', ['industrial bubble', 'society benefits'],
     'Ein leeres Lagerhaus, Staub sinkt langsam in einem Lichtstrahl (Held). **Zitatkarte** im Dunkel daneben: „a kind of industrial bubble“ · `— Jeff Bezos, Italian Tech Week, October 2025`; auf **society benefits** setzt sich der Staub.',
     '① Staub sinkt ② Zitat', 'Verwandlung · Träger der Lichtstrahl schrumpft zum Punkt `NOW` auf der Zeitleiste · Mitte · –')
shot('4.09', 'EXPL', 'But will the rails stay', ['this time'],
     'Die Zeitleiste kehrt zurück: dritter Punkt `NOW`, leer, pulsiert (Frage).',
     '① Puls', 'Seam-Plate c04|c05 (intern B1) · Träger der Punkt `NOW` → Chip-Symbol am Anfang eines Balkens · Mitte · nach rechts')

# ===== c05 · Der ehrliche Test (B1) ===============================================================================================
shot('5.01', 'EXPL', 'Maybe', ['generations', "doesn't"],
     'Zwei waagrechte Balken auf einer Zeitachse: `RAILS` (Schienen-Icon) läuft rechts aus dem Bild (**generations**); `CHIPS`-Balken wartet noch.',
     '① Balken wächst', 'Plansequenz')
shot('5.02', 'EXPL', 'Chips and hardware', ['Chips', 'three to six years'],
     'Der Chip-Balken wächst und stoppt bei `3–6 YEARS`, wird kalt-blau (veraltet). Eine Säule daneben: `MOST OF THE MONEY · CHIPS & HARDWARE (~60 %) · MCKINSEY`.',
     '① Balken stoppt ② Säule', 'Verwandlung · Träger der Balken faltet sich zu einem Rechenzentrums-Icon · Mitte · –')
shot('5.03', 'EXPL', 'And yet, this', ['dark fibre', 'almost full'],
     'Ein Rechenzentrums-Icon mit Belegungs-Anzeige, die auf **almost full** fast voll steht: `VACANCY 1 %` · `NORTH AMERICA · JLL, YEAR-END 2025`.',
     '① Anzeige füllt sich', 'Flug · Träger ein Lämpchen in der Anzeige → ein Lämpchen im alten Rack · Mitte · nach vorn')
shot('5.04', 'SZENE', 'Even older chips', ['older chips', 'earn money'],
     'Ein altes Server-Rack, kleine Lichter blinken noch. Ein Techniker (Indigo, Lanyard) geht vorbei und nickt (**earn money**).',
     '① der Techniker geht ② Lichter', 'Rückzug · Träger das Rack wird klein, wird eine Halle · –')
shot('5.05', 'SZENE>EXPL', 'And plenty does last', ['Buildings', 'power lines', 'power plants planned'],
     'Feste Dinge in einer Fahrt: eine Betonhalle; Hochspannungsleitungen über einem Feld im Abendrot (**power lines**); eine Solaranlage mit Batteriecontainern. Label `RECORD YEAR · NEW POWER PLANTS · PLANNED · USA 2026 · EIA` (auf **planned**).',
     '① seitliche Fahrt', 'Verwandlung · Träger ein Batteriecontainer → eine Modell-Datei · rechts · –')
shot('5.06', 'EXPL', 'Open models', ['Open models', 'makers fail'],
     'Eine Modell-Datei (`OPEN MODEL WEIGHTS`) leuchtet; das Etikett des Herstellers löst sich ab und fällt (**fail**), die Datei leuchtet weiter.',
     '① Etikett fällt', 'Verwandlung · Träger die Datei → ein Werkzeug in einer Hand · Mitte · –')
shot('5.07', 'SZENE', 'And people who know', ['build all this'],
     'Hände (Indigo) an Kabeln und Klemmen, ein Elektriker, eine Ingenieurin mit Plan.',
     '① die Hände arbeiten', 'Verwandlung · Träger die Dinge aus 5.03–5.07 legen sich auf den langen Balken · Mitte · –')
shot('5.08', 'EXPL', 'So yes, rails will stay', ['too', 'fewer of them', 'most of the money'],
     '★ **Das Urteil:** die Lebensdauer-Balken wieder: auf dem langen Balken (`LASTS`) liegen Halle, Leitungen, Kraftwerke, Modelle, Menschen; auf **fewer** ist er schmal; der breite Geldstrom fließt in den kurzen Chip-Balken (**most of the money**).',
     '① Icons landen ② Geldstrom', 'Seam-Plate c05|c06 (Lead) · Träger der Chip-Balken wird der erste Ziegel einer Wand · Mitte · nach unten', star=True)

# ===== c06 · Die Wand (B2) ========================================================================================================
shot('6.01', 'EXPL', "You'll hear that", ['hitting a wall'],
     'Der Chip-Balken fällt als Ziegel und landet (**wall**). Eine Wand beginnt.',
     '① Ziegel landet', 'Plansequenz')
shot('6.02', 'EXPL', "There's something to that", ['Bigger models', 'text data', 'more slowly'],
     'Drei Ziegel setzen sich nacheinander: `BIGGER MODELS · LESS PAYOFF`, `GOOD TEXT DATA · SCARCE`, `ADOPTION · SLOWER THAN PROMISED`.',
     '① Ziegel setzen sich', 'Plansequenz')
shot('6.03', 'EXPL', 'But the abilities', ['keep climbing', 'hours of human work', 'doubles every few months'],
     'Die METR-Kurve (Log-Skala, `TASK LENGTH · HOURS OF HUMAN WORK`) steigt von links und geht **durch** die Wand (**climbing**). Auf **doubles** `DOUBLES EVERY ~3.5 MONTHS · METR`.',
     '① die Kurve ② Wand bleibt', 'Plansequenz', star=True)
shot('6.04', 'EXPL', 'So the wall', ["isn't intelligence", 'money, power and debt'],
     '**Flip:** die drei Ziegel drehen sich um; ihre Rückseiten: `MONEY` · `POWER` · `DEBT` (auf den Worten).',
     '① Flips', 'Verwandlung · Träger die Wand wird das Eisband eines Sees · Mitte · nach unten')
shot('6.05', 'SZENE', 'And the money side', ['cracking', 'edges'],
     'Ein zugefrorener See unter dem Mond (Held). Auf **cracking** bricht das Eis, aber nur am Ufer (**edges**); die Mitte hält.',
     '① Risse am Ufer ② Mondlicht', 'Verwandlung · Träger die Uferlinie → Kurse am Rand des Diagramms · Mitte · –')
shot('6.06', 'EXPL', "America's broad stock market", ['near its record', 'CoreWeave', 'Oracle'],
     '`S&P 500` ruhig, flach, nahe am Rekord (Stand bei Veröffentlichung prüfen). Am Rand lösen sich zwei dünne Linien und fallen: `COREWEAVE` (auf **CoreWeave**), `ORACLE · ≈ −55 % FROM 52-WEEK HIGH` (auf **Oracle**).',
     '① zwei Linien fallen', 'Fahrt · Träger der Uferriss läuft aus dem Diagramm in einen Stromzähler · rechts · nach rechts')
shot('6.07', 'EXPL>SZENE', 'So if some rails stay', ['who paid'],
     'Der Riss läuft aus dem Diagramm hinaus und endet an einem Haushalts-Stromzähler (das Rädchen dreht sich).',
     '① Riss läuft ② Zähler dreht', 'Seam-Plate c06|c07 (intern B2) · Träger der Stromzähler · Mitte · –')

# ===== c07 · Wer zahlt (B2) =======================================================================================================
shot('7.01', 'SZENE', 'Follow the money', ['close', 'To you'],
     'Der Zähler hängt in einer Küche bei Nacht; Rückzug: du am Tisch (gelber Mantel über der Stuhllehne), die Lampe (Held), auf dem Tisch ein Umschlag: die Stromrechnung (**To you**).',
     '① Rückzug ② die Lampe', 'Verwandlung · Träger das Kabel des Zählers → eine Netzlinie · links · nach oben')
shot('7.02', 'EXPL', 'Start with your power bill', ['power bill', 'stand by'],
     'Eine Netzlinie von einem Kraftwerk teilt sich: ein Ast zu einem Rechenzentrum, einer zu einer Häuserreihe. `PJM · AMERICA\'S LARGEST POWER MARKET`. Auf **stand by** glimmt das Kraftwerk in Bereitschaft.',
     '① Linie teilt sich', 'Verwandlung · Träger der Kraftwerks-Glimmer → ein Balken · links · nach oben')
shot('7.03', 'EXPL', 'In two years', ['tenfold', 'billions', 'data centers'],
     'Zwei Balken: `$29` (2024/25) und `$329` (2026/27) `PER MW-DAY · CAPACITY PRICE` – der zweite mehr als zehnmal so hoch (**tenfold**). Ein Zähler rollt auf `$23 BN` (**billions**) und verteilt sich auf winzige Häuser. Quelle `PJM MARKET MONITOR`.',
     '① Balken ② Zähler', 'Verwandlung · Träger ein Haus → das Handy mit der Spar-App · Mitte · –')
shot('7.04', 'SZENE>EXPL', 'Then your pension', ['pension', 'by default'],
     'Ein Handy in deiner Hand, Spar-App: `DEFAULT FUND`; auf **by default** setzt sich ein Häkchen von selbst.',
     '① Häkchen', 'Verwandlung · Träger der Fondskreis der App → der Index-Ring · Mitte · –')
shot('7.05', 'EXPL', 'And just five tech companies', ['more than a quarter', 'Global funds'],
     'Der Index als Ring (`S&P 500`): fünf Segmente glühen zusammen: `MORE THAN ¼`. Auf **Global funds** führen kleine Fonds-Punkte von außen durch diese fünf Segmente.',
     '① Segmente glühen ② Punkte', 'Verwandlung · Träger ein Segment schrumpft zu einer Banknote der Blase · Mitte · –')
shot('7.06', 'SZENE', 'If you have a savings plan', ['piece of this bubble', 'choosing'],
     '★ Deine Hand (gelber Ärmel) hält, ohne es zu merken, eine winzige Banknote aus der Blase von 1.01; über deiner Hand schwebt, weit weg, die Blase.',
     '① die Note in der Hand ② Push', 'Match-Fahrt · Träger das warme Fensterlicht in deinem Raum → das Pfarrhausfenster von c02 · Mitte · –', star=True)
shot('7.07', 'SZENE', 'Back then', ['three sisters', 'railway paper', 'pension'],
     'Das Pfarrhausfenster von c02, das Zertifikat auf dem Tisch. **Match-Cut durchs Fenster** (gleiche Fensterform, gleiche Stelle) auf ein heutiges Fenster: du auf einem Sofa mit einem Rentenbrief (**pension**).',
     '① Push durchs Fenster ② –', 'Verwandlung · Träger der Rentenbrief → Bieterkarten · Mitte · nach oben')
shot('7.08', 'SZENE', 'And when it pops', ['pops', "what's left"],
     'In einer dunklen Halle heben sich Bieterkarten (**pops**: die erste schnellt hoch).',
     '① Karten heben sich', 'Seam-Plate c07|c08 (intern B2) · Träger die gehobenen Bieterkarten · –')

# ===== c08 · Die Reste, 1844, Ohio (B2) ===========================================================================================
shot('8.01', 'SZENE', 'After a crash', ['go cheap', 'whoever has cash'],
     'Eine Lagerhaus-Auktion: Kabeltrommeln und Server-Racks mit `LOT`-Anhängern, eine Lampe (Held) über dem Pult. Auf **cash** gewinnen wenige Karten alles.',
     '① Karten ② Hammer', 'Verwandlung · Träger ein `LOT`-Anhänger → die Balken aus c04 · Mitte · –')
shot('8.02', 'EXPL', 'Remember Global Crossing', ['Global Crossing', 'sliver'],
     'Die Balken aus 4.01 kehren zurück: `$12.4 BN DEBT` gegen den dünnen `$250 M`.',
     '① Balken', 'Plansequenz')
shot('8.03', 'EXPL', "That isn't a conspiracy", ['fire sales', "don't land with everyone"],
     'Ein Fluss aus Licht: `CRASH` → `CHEAP ASSETS` → `WHOEVER HAS CASH`; auf **everyone**: viele Punkte (Menschen) ringsum bekommen keine Linie.',
     '① der Fluss ② Punkte bleiben dunkel', 'Verwandlung · Träger die dunklen Punkte → Siegellack · Mitte · –')
shot('8.04', 'EXPL', 'But in eighteen forty-four', ['eighteen forty-four', 'Parliament', 'law'],
     'Pergament: `RAILWAY REGULATION ACT · 1844`; auf **law** wird ein Wachssiegel gedrückt (Akzent, kurzer Druck, Ruhe danach).',
     '① Siegel', 'Plansequenz')
shot('8.05', 'EXPL', 'Every new line', ['every weekday', 'roof', 'seat', 'penny a mile'],
     'Auf dem Pergament: `EVERY NEW LINE · EVERY WEEKDAY · EACH WAY`; dann im Takt drei Zeichen: ein Dach (**roof**), ein Sitz (**seat**), eine Penny-Münze (**penny**) → ein gedrucktes Ticket `1d PER MILE`.',
     '① Zeichen im Takt', 'Verwandlung · Träger das Ticket vervielfältigt sich in viele Hände · Mitte · –', star=True)
shot('8.06', 'SZENE', 'People called them', ['parliamentary trains', 'for everyone'],
     'Eine Menge gewöhnlicher Menschen (die Hände aus 2.07), jede Hand hält dasselbe Ticket (`PARLIAMENTARY TRAINS`). Kein Zug, keine Schiene.',
     '① die Tickets heben sich', 'Verwandlung · Träger die Penny-Münze auf dem Ticket · Mitte · nach vorn')
shot('8.07', 'EXPL', 'So what would the penny train', ['penny train of superintelligence'],
     '**Flip:** die Penny-Münze dreht sich, ihre Rückseite ist ein leuchtender Chip.',
     '① Münze dreht', 'Verwandlung · Träger der Chip wird das Siegel auf einem Formular · Mitte · –')
shot('8.08', 'EXPL', 'Back then, the penny train', ['condition', 'conditions too'],
     'Das Pergament von 1844 rückt zur Seite, daneben ein heutiges Genehmigungsformular; beide tragen dasselbe Siegel `CONDITION`.',
     '① Formular schiebt sich herein', 'Verwandlung · Träger das Siegel → ein Stecker an einem Zähler · rechts · –')
shot('8.09', 'EXPL', 'In parts of Ohio', ['Ohio', 'most of the power', 'For years', 'never use it'],
     'Ein Rechenzentrum an einem Zähler: Zeiger rastet bei `85 %` ein (**most of the power**), darunter ein Kalenderstreifen `UP TO 12 YEARS` (**years**); auf **never use it** gehen die Lichter im Rechenzentrum aus, der Zeiger bleibt. Label `AEP OHIO`.',
     '① Zeiger ② Lichter aus', 'Match-Fahrt · Träger der Zähler → der Zähler in deiner Küche (c07) · Mitte · –')
shot('8.10', 'SZENE', 'So if the bubble pops', ['data center', 'kitchen'],
     'Deine Küche aus c07: der Umschlag bleibt dünn, die Lampe bleibt an (**kitchen**).',
     '① Lampe ② Push', 'Verwandlung · Träger der Umschlag → Staaten auf einer Karte · Mitte · –')
shot('8.11', 'EXPL', 'Many other states', ['similar rules', 'protects your bill'],
     'USA-Karte (Umriss): Staaten leuchten nacheinander auf: `23 STATES · LARGE-LOAD TARIFFS · EEI 2026`.',
     '① Staaten leuchten', 'Verwandlung · Träger die Karte wird ein Zaun mit Schild `PUBLIC MONEY` · Mitte · –')
shot('8.12', 'EXPL', 'But what about what public money', ['public money builds'],
     'Ein Zaun mit Schild `PUBLIC MONEY`, dahinter eine geschlossene Tür.',
     '① Push auf die Tür', 'Seam-Plate c08|c09 (Lead) · Träger die geschlossene Tür → die Tür eines Kabelschachts mit Vorhängeschloss · Mitte · –')

# ===== c09 · Offene Türen (B3) ====================================================================================================
shot('9.01', 'EXPL', 'Public money can come', ['open doors', 'two thousand and nine', 'other providers in'],
     'Eine Kabelschacht-Tür mit Vorhängeschloss; ein Stempel `PUBLIC MONEY` landet (**open doors**), das Schloss fällt ab, die Tür schwingt auf; auf **other providers** ziehen viele kleine Pfeile hinein. `US BROADBAND STIMULUS · 2009 · OPEN ACCESS`.',
     '① Stempel ② Pfeile', 'Fahrt · Träger die Pfeile laufen in den Schacht → Stockholmer Straße · Mitte · nach unten')
shot('9.02', 'SZENE', 'Stockholm went further', ['Stockholm', 'three decades', 'all comers'],
     'Stockholm zur blauen Stunde, ein offener Schacht in der Straße (Licht von unten = Held); darin ein städtischer Kanal, viele farbige Leitungen teilen ihn. `STOKAB · CITY-OWNED SINCE 1994 · ABOUT 100 PROVIDERS`.',
     '① Leitungen ② langsamer Push', 'Plansequenz', star=True)
shot('9.03', 'SZENE>EXPL', 'But what if a door', ['closes again', 'own a piece'],
     'Die Schachttür schwingt langsam von selbst zu; eine Hand fängt sie (**own a piece**).',
     '① die Tür ② die Hand', 'Verwandlung · Träger die runde Schachtöffnung → ein Wafer · Mitte · –')
shot('9.04', 'EXPL', 'Last year, in return', ['chip subsidies', 'ten percent', 'Intel', 'what it paid for'],
     'Ein Silizium-Wafer; ein Keil von ~10 % löst sich und gleitet zu einem Rathaus-Icon `PUBLIC`; ein Münzpfeil geht hinein, der Keil kommt zurück. `US GOVERNMENT · ~10 % OF INTEL · AUGUST 2025`. Neutral, kein Held, kein Bösewicht.',
     '① Keil ② Münze', 'Verwandlung · Träger der Wafer wird die Sonne über einem Alpental · Mitte · nach oben')
shot('9.05', 'SZENE>EXPL', 'Some countries lay', ['public rails', 'Switzerland', 'Apertus'],
     'Ein Alpental, dann in einer Supercomputer-Halle (`ALPS · CSCS`); eine Datei `APERTUS · OPEN` verlässt die Halle und kopiert sich auf viele Laptops.',
     '① Fahrt ins Tal ② Kopien', 'Verwandlung · Träger die Laptops → Boote auf einem See aus Chips · Mitte · –')
shot('9.06', 'EXPL', 'India runs a shared pool', ['shared pool', 'start-ups'],
     'Ein gemeinsamer Pool aus Chips als See; kleine Boote (Start-ups) tauchen ein. `INDIAAI COMPUTE · 38,000+ SHARED GPUs`.',
     '① Boote', 'Verwandlung · Träger der See → Karte Europas · Mitte · –')
shot('9.07', 'EXPL', 'Europe is planning', ['giant computing hubs', 'still on paper'],
     'Karte Europas mit umrissenen Standorten; auf **paper** ist die Hälfte nur Blaupause. `UP TO 7 PUBLIC-PRIVATE COMPUTING HUBS · PLANNED`.',
     '① Standorte ② Blaupausen', 'Seam-Plate c09|c10 (intern B3) · Träger ein Blaupausen-Blatt → eine Zeitung von 1932, die über einen Hof weht · –')

# ===== c10 · Menschen bauen, A3 (B3) ==============================================================================================
shot('10.01', 'SZENE', 'And sometimes, people build', ['themselves', 'nineteen thirty-two', 'collapsed'],
     '**Weltwechsel:** eine Zeitung von 1932 weht über einen staubigen Bauernhof (`INSULL EMPIRE COLLAPSES · 1932`), Abendlicht.',
     '① die Zeitung weht', 'Plansequenz')
shot('10.02', 'SZENE', 'Small investors lost', ['lost their savings', 'farmers', 'co-operatives'],
     'Kalenderblätter (Zeitsprung); Bauern stellen gemeinsam einen Holzmast auf; auf **co-operatives** leuchtet in einem Bauernhaus eine Glühbirne (Held).',
     '① der Mast ② die Birne', 'Verwandlung · Träger die Birne vervielfacht sich zu einer Karte · Mitte · –')
shot('10.03', 'EXPL', 'Today, they supply', ['forty-two million'],
     'Die Birne vervielfacht sich zu einer Karte der Genossenschaftsgebiete; Zähler `42 MILLION PEOPLE · ~900 CO-OPS · NRECA`.',
     '① Lichter breiten sich aus', 'Verwandlung · Träger die Karte wird grün → ein Feld in Lancashire · Mitte · –')
shot('10.04', 'SZENE', 'In the north of England', ['trenches', 'own the network'],
     'Ein grünes Feld in Lancashire: Dorfbewohner in Stiefeln graben einen schmalen Graben, ein oranges Leerrohr. `B4RN · ~15,000 HOMES · OWNED BY ITS MEMBERS`.',
     '① graben ② Wind im Gras', 'Verwandlung · Träger das Leerrohr legt sich auf einen Tisch · Mitte · –')
shot('10.05', 'SZENE', 'All of this protects', ['protects the rails', 'seat', 'Not yet'],
     'Die Stücke dieser Station liegen in einer Reihe auf einem Tisch: Zähler, offene Tür, Waferkeil, Apertus-Datei, oranges Rohr; daneben ein leerer Stuhl (**seat**). Kurz und still, ~3 s, das Licht atmet.',
     '① Licht atmet', 'Plansequenz')
shot('10.06', 'SZENE', 'The missing piece', ['penny train of artificial intelligence', 'proposal'],
     '★ **Schienen-Anker A3.** Die Stücke fliegen zusammen und setzen sich als Teile eines kleinen, warm erleuchteten Zuges auf einer Schiene: ein Wagen, Dach und Sitz. Label auf **proposal**: `OUR PROPOSAL · NOT LAW ANYWHERE`. Kein Bahnsteig.',
     '① die Teile fliegen ② der Zug steht', 'Plansequenz', star=True)
shot('10.07', 'EXPL', 'The rule', ['public money', 'tax break', 'grid connection', 'basic service'],
     'Drei Zeichen fallen in einen Ticketdrucker: Münze (**public money**), Steuerbeleg (**tax break**), Netzstecker (**grid connection**); auf **basic service** kommt das Ticket heraus: `ONE BASIC SERVICE`.',
     '① Zeichen fallen ② Ticket', 'Plansequenz')
shot('10.08', 'EXPL', 'For everyone. Good', ['up-to-date', 'small, fixed price', 'Every day'],
     'Das Ticket (Penny-Ticket von heute, `B.ticket`) beschriftet sich: `GOOD, UP-TO-DATE ARTIFICIAL INTELLIGENCE` · `SMALL FIXED PRICE` · `EVERY DAY`.',
     '① Zeilen', 'Fahrt · Träger das Ticket in eine Hand · Mitte · nach links')
shot('10.09', 'SZENE', 'For a student', ['student', 'start-up', 'hospital'],
     'Drei kurze Einsteige-Momente am kleinen Zug (vom Boden, kein Bahnsteig): eine Studentin mit Rucksack, ein Zwei-Personen-Start-up mit Laptop, eine Pflegekraft; jede reicht ein Ticket. Eine Einstellung, die Kamera gleitet am Wagen entlang.',
     '① Fahrt am Wagen ② Einsteigen', 'Verwandlung · Träger das heutige Ticket legt sich neben das von 1844 · Mitte · –')
shot('10.10', 'EXPL', 'The way every new line', ['eighteen forty-four', 'penny train'],
     'Zwei Tickets nebeneinander: `1d PER MILE · 1844` und das neue. Sie reimen (gleiche Form).',
     '① Tickets', 'Verwandlung · Träger die zwei Tickets werden die Schalen einer Waage · Mitte · –')

# ===== c11 · Niemand gibt etwas ab (B3) ===========================================================================================
shot('11.01', 'EXPL', 'Nobody gives up', ['what they own', 'condition on public help', 'before'],
     'Eine Waage: `PUBLIC HELP` | `CONDITION`, im Gleichgewicht, nichts wird von einer Seite genommen. Auf **before** gleiten kleine Karten in eine Reihe: `1844` · `2009` · `STOCKHOLM` · `OHIO` · `INTEL`.',
     '① Waage pendelt aus ② Karten', 'Match-Fahrt · Träger die Karte `2009` → der Rentenbrief · Mitte · –')
shot('11.02', 'SZENE>EXPL', "It won't shield", ['crash', 'still get a seat'],
     'Du auf dem Sofa (c07), in einer Hand der Rentenbrief (Zahl sinkt kühl, **crash**), in der anderen ein Ticket (**seat**, warm).',
     '① die Zahl ② das Ticket glüht', 'Plansequenz')
shot('11.03', 'EXPL', 'What counts', ['good enough', 'price', 'comments', 'before a crash'],
     'Zwei Fragezeichen-Anhänger hängen am Ticket: `GOOD ENOUGH?` und `PRICE?` (auf den Worten); auf **comments** schwingen sie sanft.',
     '① Anhänger schwingen', 'Verwandlung · Träger das Fenster hinter dem Sofa → ein Fenster in Davos · Mitte · –')
shot('11.04', 'SZENE', 'So... was it a bubble', ['bubble', 'Davos', 'Satya Nadella', 'test'],
     'Schnee vor dem Fenster einer Konferenzhalle bei Nacht, ein einzelnes Pult (Held: das Pultlicht). `DAVOS · JANUARY 2026`.',
     '① Schnee ② Push', 'Plansequenz')
shot('11.05', 'EXPL', 'For this not to be a bubble', ['evenly spread'],
     '**Zitatkarte (wörtlich, nur wenn vor dem finalen Render geprüft):** „For this not to be a bubble, by definition, it requires that the benefits of this are much more evenly spread.“ · `— Satya Nadella, Microsoft, Davos, January 2026`. Ungeprüft: nur Label `SATYA NADELLA · DAVOS 2026 · “MUCH MORE EVENLY SPREAD”`.',
     '① die Zeilen', 'Verwandlung · Träger die Grundlinie → Zeitleiste der Technikwellen · Mitte · nach rechts')
shot('11.06', 'EXPL', 'The economist Carlota Perez', ['pattern', 'all of society', 'Golden ages', 'rules were right'],
     'Lange Zeitleiste der Technikwellen: jede mit einer Spitze (Blase), danach ein breites warmes Plateau über vielen kleinen Figuren; auf **rules were right** leuchtet das Plateau nur dort, wo ein Regel-Zeichen davorsteht. `CARLOTA PEREZ · TECHNOLOGICAL REVOLUTIONS AND FINANCIAL CAPITAL`.',
     '① Plateaus ② Fahrt nach rechts', 'Seam-Plate c11|c12 (intern B3) · Träger die letzte Spitze rundet sich zur Blase über dem Rechenzentrum · rechts · –', star=True)

# ===== c12 · Finale (B3) ==========================================================================================================
shot('12.01', 'SZENE', 'The bubble may pop', ['pop', "won't stop"],
     'Die Blase aus dem ersten Bild über dem Rechenzentrum platzt endlich, sanft (**pop**), in treibendes Papier; das Rechenzentrum darunter glüht weiter (**won\'t stop**).',
     '① die Blase platzt ② Noten treiben', 'Plansequenz')
shot('12.02', 'EXPL', 'In twenty years', ['bubble', 'Or rails'],
     'Zwei Wörter schweben zwischen den Noten: `BUBBLE` und `RAILS`; auf **rails** tauschen sie die Plätze.',
     '① Wörter tauschen', 'Verwandlung · Träger die Noten werden ein Börsenticker · Mitte · nach links')
shot('12.03', 'SZENE>EXPL', "That won't be decided", ['stock market', 'who gets to ride'],
     'Ein Ticker läuft vorbei und wird still (**stock market**). Auf **who gets to ride** die Orte des Films, jeweils ein Ticket in einer Hand: deine Küche, das Sofa, die Studentin, die Pflegekraft (eine Fahrt, kein Schnitt).',
     '① Ticker steht ② Fahrt', 'Plansequenz')
shot('12.04', 'SZENE', 'We make these films', ['everyone', 'subscribe'],
     'Ruhig: die Hand mit dem Ticket, Abendlicht; kein Abo-Knopf, keine Schiene, kein Bahnsteig.',
     '① Licht', 'Verwandlung · Träger das Ticket → das leere Preisschild am Ende der neuen Schiene · Mitte · nach hinten')
shot('12.05', 'SZENE', 'The rails are being laid', ['right now', 'price of a seat', 'set yet'],
     '★ **Schienen-Anker A4** (erstes Mal Schiene im Finale): Abenddämmerung; Arbeiterinnen und Arbeiter legen eine neue Schiene zum Horizont, Funken von einem Werkzeug (**right now**). Am Ende der Strecke eine Tafel `PRICE:` mit leerem, glühendem Feld (**price of a seat**). Du stehst daneben.',
     '① Funken ② Rückzug', 'Rückzug in den Endscreen', star=True)
shot('12.06', 'SZENE', 'END', [],
     '**Endscreen (VO-Ende bis Schluss, ≤ 15 s, ohne Stimme, ohne Text, ohne Logo).** Die Schiene läuft in die Dämmerung, weit hinten ein kleiner erleuchteter Zug, der sich langsam bewegt. Obere zwei Drittel offener Himmel. **Frei für die YouTube-Endkarten:** links (x 90–780, y 250–700: „best for viewer“), rechts (x 1140–1830, y 250–700: „latest upload“), Mitte (x 810–1110, y 330–600: Abo-Knopf). Nie statisch: langsamer Rückzug, der Zug, Sterne kommen.',
     '① Rückzug ② der ferne Zug', '–')

# ---------------------------------------------------------------------------------------------------------------------------------
prev = -1.0
for sh in S:
    if sh['start'] is None: sh['a'] = 0.0
    elif sh['start'] == 'END': sh['a'] = round(VO_END + .3, 2)
    else: sh['a'] = find(sh['start'], prev + .01)
    sh['anc'] = [(ph, find(ph, sh['a'] - .01)) for ph in sh['anchors']]
    prev = sh['a']
for i, sh in enumerate(S): sh['b'] = S[i + 1]['a'] if i + 1 < len(S) else TM['duration']
bad = [(s['id'], s['a'], s['b']) for s in S if s['a'] >= s['b']]
assert not bad, bad
for s in S:
    for ph, t in s['anc']:
        if t > s['b'] + 1.5: print(f"WARN {s['id']}: anchor '{ph}' @{t:.2f} lies after the shot end {s['b']:.2f}")
chunks = []
for i, (cid, title, light, pkg) in enumerate(CHUNKS):
    sh = [s for s in S if int(s['id'].split('.')[0]) == i + 1]
    chunks.append(dict(id=cid, title=title, light=light, pkg=pkg, shots=sh, a=sh[0]['a']))
for i, c in enumerate(chunks): c['b'] = chunks[i + 1]['a'] if i + 1 < len(chunks) else TM['duration']

wt = lambda s: 1.0 if s['layer'] == 'EXPL' else .5 if '>' in s['layer'] else 0.0
def share(shots, a=None, b=None):
    tot = ex = 0
    for s in shots:
        x0, x1 = max(s['a'], a if a is not None else s['a']), min(s['b'], b if b is not None else s['b'])
        if x1 > x0: tot += x1 - x0; ex += (x1 - x0) * wt(s)
    return ex / tot if tot else 0
fmt = lambda x: f'{x:.2f}'.replace('.', ',')

if __name__ == '__main__':
    print(f'timing: {TIMING}' + (' (PROVISIONAL)' if TM.get('provisional') else ''))
    print(f"{'chunk':5} {'pkg':4} {'a':>7} {'b':>7} {'dur':>5} {'shots':>5} {'EXPL':>5}")
    for c in chunks: print(f"{c['id']:5} {c['pkg']:4} {c['a']:7.2f} {c['b']:7.2f} {c['b'] - c['a']:5.1f} {len(c['shots']):5} {share(c['shots']):5.0%}")
    print(f"film EXPL share (0–VO end {VO_END:.2f}): {share(S, 0, VO_END):.1%} · incl. end screen {share(S):.1%} · shots {len(S)} · stars {sum(s['star'] for s in S)}")
    if '--md' in sys.argv:
        out = sys.argv[sys.argv.index('--md') + 1]; L = []
        for c in chunks:
            st = [s for s in c['shots'] if s['star']]
            L.append(f"### {c['id']} · {c['title']} · {fmt(c['a'])}–{fmt(c['b'])} ({c['b'] - c['a']:.0f} s) · {c['pkg']} · ★ {st[0]['id'] if st else '–'} · [EXPL] {share(c['shots']):.0%}")
            L.append(f"Licht/Held: {c['light']}\n")
            L.append('| ID | Ebene | Zeit | Start-Phrase · Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |')
            L.append('|---|---|---|---|---|---|---|')
            for s in c['shots']:
                st0 = '–' if s['start'] in (None, 'END') else f"„{s['start']}“"
                anc = ' · '.join(f"**{ph}** @{fmt(t)}" for ph, t in s['anc'])
                lay = '[' + s['layer'].replace('>', '→') + ']'
                L.append(f"| {'**' + s['id'] + ' ★**' if s['star'] else s['id']} | {lay} | {fmt(s['a'])}–{fmt(s['b'])} | {st0}{' · ' + anc if anc else ''} | {s['pic']} | {s['moves']} | {s['tr']} |")
            L.append('')
        txt = open(out).read()
        a, b = txt.index('<!-- SHOTS:BEGIN -->'), txt.index('<!-- SHOTS:END -->')
        chunk_tab = '\n'.join(['| Chunk | Paket | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |', '|---|---|---|---|---|---|---|---|'] +
                              [f"| {c['id']} | {c['pkg']} | {fmt(c['a'])}–{fmt(c['b'])} | {c['b'] - c['a']:.1f} | {c['title']} | {c['light']} | {len(c['shots'])} | {share(c['shots']):.0%} |" for c in chunks])
        src = os.path.basename(os.path.dirname(TIMING.rstrip('/'))) + '/' + os.path.basename(TIMING)
        summary = (f"\n\n**Explainer-Anteil (gemessen, Laufzeit 0–{fmt(VO_END)} s):** {share(S, 0, VO_END):.0%} (mit Endscreen {share(S):.0%}); gemischte Shots zählen halb. Ziel 60–70 %.  "
                   f"\n**Zeiten aus:** `{src}`{' (VORLÄUFIG)' if TM.get('provisional') else ''} · Dauer {TM['duration']:.2f} s · letztes VO-Wort endet {fmt(VO_END)} s.\n")
        txt = txt[:a] + '<!-- SHOTS:BEGIN -->\n' + chunk_tab + summary + '\n' + '\n'.join(L) + '\n' + txt[b:]
        open(out, 'w').write(txt); print('wrote', out)
