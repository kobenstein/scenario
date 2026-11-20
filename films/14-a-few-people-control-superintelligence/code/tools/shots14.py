#!/usr/bin/env python3
"""Film 14 shot list (single source): every shot anchored to a VO WORD, never to a second. Times come from timing.json.
  python3 tools/shots14.py [timing.json] [--md docs/shots.md]   prints chunk table + explainer share + world changes, writes the shot list.
Layer: SZENE (world) · EXPL (explainer: light on night) · SZENE>EXPL / EXPL>SZENE (the shot holds the transformation; counts half).
A shot runs from the start of its first word (seg, phrase) to the start of the next shot. Anchors: [(seg, phrase), …] accent words.
Seg 'Q1' = the silent quote-card slot (timing.json clips); seg 'end' = the end screen after the VO.
KEY = one of the four key anchors (the key / the keys / the key ring may be seen ONLY in shots marked KEY; owner rule 28.10.).
"""
import json, re, sys

TIMING = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '/mnt/project-files/scenario/film-kontrolle/audio/timing.json'
TM = json.load(open(TIMING))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
LAST = list(TM['sections'])[-1]

def find(seg, phrase, nth=0, after=None):
    # after: the first hit at or after this second (anchors of a shot are searched from the shot's start, not the section's)
    ws = [w for w in TM['words'] if w['sec'] == seg]; q = [norm(p) for p in phrase.split() if norm(p)]; hit = 0
    for i in range(len(ws) - len(q) + 1):
        if all((norm(ws[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(ws[i + j]['w']) == p) for j, p in enumerate(q)):
            if after is not None and ws[i]['s'] < after - .01: continue
            if hit == nth: return ws[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found: {seg} "{phrase}"')

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, title, first segment, light (the hero light of the chunk), world(s)
CHUNKS = [
    ('c01', 'Hook I · der Schlüssel vor dem Rechenzentrum, Amodei-Zitat, Schlüssel und Schloss', 's00', 'Nacht · Held: der Schlüssel aus Licht (Gold) · Zitat in Creme'),
    ('c02', 'Hook II · durchs Schlüsselloch: die riesige Datei, die Kopie, der Reim-Blick', 's03', 'Nacht innen · Held: die Datei aus Licht (die Gewichte)'),
    ('c03', 'Station 1a · Milliarden Zahlen, die Tresortür, zwei Personen, die zweite Unterschrift', 's05', 'Nacht · Held: die Datei → die Tresortür (zwei Lichter im Schloss) → deine Schreibtischlampe'),
    ('c04', 'Station 1b · die Drossel, die Zwei-Personen-Regel (Schlüssel-Anker 2)', 's06', 'Nacht · Held: der Datenfaden durch die Drossel → zwei Schlüssel im Startraum'),
    ('c05', 'Station 2 · der Schläfer: 2023 sicher / 2024 Lücken, nicht wegtrainierbar, die Grenze', 's08', 'Nacht · Held: die Codezeilen aus Licht, das Jahresdatum'),
    ('c06', 'Station 3 · der Reim-Plan (rabbit / habit / green), das Mikroskop, wer prüft', 's11', 'Nacht · Held: das Wort im Plan → die Linse'),
    ('c07', 'Station 4 · der zweite Schlüssel in fremder Hand, Testtabellen, Sycophancy, zerbrechlich (Anker 3)', 's14', 'Nacht → Tageslicht auf den Tabellen · Held: der wandernde Schlüssel → die Tabellen'),
    ('c08', 'Station 5 · die Glasbox (Apertus), Tresor gegen Glas', 's17', 'erstes Morgenlicht in den Bergen · Held: die Glasbox'),
    ('c09', 'Finale · der Schlüsselbund, Epoch-Balken, die Frage, Endscreen (Anker 4)', 's19', 'Morgendämmerung → warmer Morgen · Held: der Schlüsselbund'),
]

# shots: (id, layer, (seg, first phrase), [anchors], picture, moves, transition, star, key)
S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False, key=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star, key=key))

# ===== c01 · Hook I (gebaut: Stil-Test) =========================================================================================
shot('1.01', 'SZENE', ('s00', None), [('s00', 'keys'), ('s00', 'superintelligence')],
     '**Thumbnail-Motiv · Schlüssel-Anker 1.** Nacht, Sterne. Links ein einzelner **Schlüssel aus Licht** (Gold, das Hellste), er schwebt und dreht sich langsam um die Längsachse. Rechts ein **riesiges Rechenzentrum**: dunkler Monolith bis über den Bildrand, Reihen winziger kühler Rack-Lichter. Unten klein du (gelbe Regenjacke), schaust zum Schlüssel hinauf. Auf **keys** atmet der Schlüssel heller; auf **superintelligence** erwachen die Rack-Lichter von links nach rechts.',
     '① langsamer Push ② Rack-Lichter erwachen', 'Plansequenz', star=True, key=True)
shot('1.02', 'SZENE', ('s00', "You'd expect"), [('s00', 'people building'), ('s00', 'Every part')],
     'Eine **Blaupause** (dünne Creme-Linien) zeichnet den Umriss des Gebäudes nach (verstanden), auf **Every part** teilt ein Raster die Fassade in alle Teile.',
     '① Linien zeichnen ② Push endet', 'Fahrt · Träger Goldfaden steigt aus dem Ring des Schlüssels · links · nach oben (Neigung)', key=True)
shot('1.03', 'EXPL', ('Q1', None), [],
     '**Zitatkarte (stumme Lücke, 5,5 s):** die Kamera neigt sich in den Himmel; der Goldfaden wird die senkrechte Regel, dann steigen zwei Zeilen von ihrer Grundlinie: „…we do not understand how our own / AI creations work.“ · darunter `— Dario Amodei, CEO of Anthropic` · `“The Urgency of Interpretability”, April 2025`. Unten am Rand glimmt der Ring des Schlüssels.',
     '① Neigung ② Zeilen steigen', 'Plansequenz')
shot('1.04', 'EXPL', ('s01', None), [('s01', 'plainly'), ('s01', "don't understand")],
     'Das Zitat steht (lesen). Auf **don\'t understand** werden die Worte „do not understand“ warm (Gold statt Creme).',
     '① drei Worte glühen', 'Plansequenz · die Zeilen sinken, der Faden zieht sich in den Schlüssel zurück · nach unten')
shot('1.05', 'SZENE', ('s02', None), [('s02', 'key'), ('s02', 'lock'), ('s02', "can't see")],
     'Neigung zurück. **They hold the key:** eine schlichte Menschenhand (Indigo-Silhouette, Randlicht, kein Gelb) kommt von links unten und nimmt den Schlüssel am Ring, dreht ihn waagrecht, die Spitze zeigt aufs Gebäude. **They built the lock:** in der Fassade öffnet sich ein **Schlüsselloch** (Creme-Rand). **Can\'t see inside:** innen nur Schwarz.',
     '① Hand nimmt, zielt ② Schlüsselloch öffnet sich', 'Plansequenz', key=True)
shot('1.06', 'SZENE', ('s02', 'So can'), [('s02', 'control'), ('s02', 'superintelligence')],
     'Rückzug zum Maßstab: du winzig unten, das riesige Gebäude mit dem schwarzen Schlüsselloch, links die Hand mit dem Schlüssel.',
     '① Rückzug', 'Flug durchs Schlüsselloch · Träger Schlüsselloch · Mitte rechts · nach vorn', key=True)

# ===== c02 · Hook II ============================================================================================================
shot('2.01', 'SZENE>EXPL', ('s03', None), [('s03', 'Everything'), ('s03', 'weights')],
     'Die Kamera fliegt **durch das Schlüsselloch** (eine Fahrt, ~4 s, Quart). Drinnen: ein Nachtfeld aus **Zahlen** (Creme, leise atmend) = die Gewichte. Auf **weights** ist das Feld überall.',
     '① Flug', 'Plansequenz')
shot('2.02', 'EXPL', ('s03', 'In essence'), [('s03', 'giant'), ('s03', 'file')],
     'Die nächsten Zahlen fließen in Bögen zusammen; ein Goldfaden umfährt sie: **eine riesige Datei aus Licht** (Dokument mit Eselsohr), innen warm. Label `THE WEIGHTS`.',
     '① Zahlen sammeln sich ② Umriss', 'Plansequenz')
shot('2.03', 'EXPL', ('s03', 'Copy'), [('s03', 'Copy'), ('s03', 'you have')],
     '**Copy it:** der Umriss klont sich und gleitet in flachem Bogen 600 px nach rechts, mit allen Zahlen (kühl): die Kopie ist genauso voll. Original und Kamera bleiben (Ruhe: kein Zoom über dem dichten Feld).',
     '① Klon gleitet', 'Plansequenz · Stil-Test endet hier (~42,4 s)')
shot('2.04', 'EXPL', ('s03', 'So who'), [('s03', 'reach'), ('s03', 'file')],
     'Beide Dateien stehen; um sie herum tauchen aus dem Zahlenfeld kleine kühle Hände-Silhouetten auf, die nach der Datei greifen (Indigo, nur Randlicht). Die Originaldatei leuchtet warm.',
     '① Hände greifen', 'Plansequenz')
shot('2.05', 'EXPL', ('s04', None), [('s04', 'inside'), ('s04', 'rhyme')],
     '**Reim-Blick (nur angerissen):** Kamera taucht in die Originaldatei; die Zahlen ordnen sich zu zwei leeren Zeilen aus Licht (Grundlinien). Auf **rhyme** schreibt sich die erste Zeile als Lichtstrich (noch ohne Text).',
     '① Push in die Datei ② Zeile', 'Plansequenz')
shot('2.06', 'EXPL', ('s04', 'Before the second'), [('s04', 'picked'), ('s04', 'planning'), ('s04', 'who gets')],
     'Am **Ende** der noch leeren zweiten Zeile glüht ein Punkt auf, **bevor** die Zeile beginnt (das Ziel ist schon gewählt) · `PLANNING AHEAD`. Auf **who gets to look** weitet sich der Blick: die Datei steht wieder klein im Feld.',
     '① Zielpunkt glüht ② Rückzug', 'Plansequenz → c03 · Träger die Datei · Mitte')

# ===== c03 · Station 1a ==========================================================================================================
shot('3.01', 'EXPL', ('s05', None), [('s05', 'billions'), ('s05', 'training')],
     'Rückzug aus der Datei: das Zahlenfeld wird unendlich (der Zähler `BILLIONS OF NUMBERS` als Lichtzahl, keine Zahl erfinden). Auf **training** wellt eine Lichtwelle durch das Feld, die Werte verschieben sich (gelernt).',
     '① Rückzug ② Welle', 'Plansequenz')
shot('3.02', 'EXPL', ('s05', 'Whoever has'), [('s05', 'computing power'), ('s05', 'run the model')],
     'Die Datei gleitet nach links in einen **Block aus Rechenkernen** (Rechteck aus kleinen Lichtquadraten). Auf **run the model** dreht ein **Ring aus Licht** (die Maschine, kühl-creme) an.',
     '① Datei gleitet ② Ring dreht an', 'Verwandlung · Träger Datei → Tresorfach · Mitte · nach hinten')
shot('3.03', 'SZENE', ('s05', 'So the first'), [('s05', 'oldest'), ('s05', 'touch')],
     '**Weltwechsel: der Tresorraum.** Die Datei gleitet in ein Fach hinter einer **runden Tresortür** (riesig, flach, Lichtfugen im Kreis), die sich schließt. Auf **touch** liegt das Licht nur noch in den Fugen.',
     '① Tür schließt ② Fahrt zurück', 'Plansequenz')
shot('3.04', 'SZENE', ('s05', "It's tempting"), [('s05', 'master'), ('s05', 'pocket'), ('s05', 'different')],
     'Vor der Tür eine einzelne Silhouette (Indigo), ihre Manteltasche glimmt (das Bild „ein Generalschlüssel“, **kein Schlüssel gezeichnet**). Auf **different** schwenkt die Kamera auf das Schloss: es hat **zwei** Lichtfelder.',
     '① Schwenk', 'Plansequenz')
shot('3.05', 'SZENE>EXPL', ('s05', 'At Anthropic'), [('s05', 'May'), ('s05', 'Never one')],
     'Die Silhouette legt ihre Hand auf ein Feld: es leuchtet halb, die Tür bleibt zu. Daneben wächst die **Bildtext-Karte** von ihrer Grundlinie: „two-party authorization for model weight access“ · `ANTHROPIC · MAY 2025` (Creme, Serif, Quelle Inter).',
     '① Hand auf Feld ② Karte steigt', 'Plansequenz')
shot('3.06', 'SZENE', ('s05', 'Opening the'), [('s05', 'two people'), ('s05', 'yes')],
     'Eine zweite Silhouette tritt von rechts dazu, Hand aufs zweite Feld: beide Felder warm, auf **yes** öffnet ein Lichtspalt die Tür (kein Schlüssel).',
     '① zweite Figur ② Tür spaltet', 'Fahrt · Träger Lichtspalt → Schreibtischlampe · Mitte · nach unten')
shot('3.07', 'SZENE', ('s05', "If you've"), [('s05', 'second signature'), ('s05', 'slower'), ('s05', 'point')],
     '**Du** an einem Schreibtisch unter einer Lampe (der Lichtspalt wird der Lampenkegel), ein Blatt aus Licht mit zwei Unterschriftslinien; die erste ist fertig, du wartest auf die zweite. Auf **slower** läuft eine kleine Sanduhr-Uhr (Zeiger), auf **point** erscheint die zweite Unterschrift.',
     '① deine Haltung ② zweite Linie', 'Verwandlung · Träger Lampenkreis → Grenze des Sicherheitsbereichs (Kreis) · Mitte · –')

# ===== c04 · Station 1b ==========================================================================================================
shot('4.01', 'EXPL', ('s06', None), [('s06', 'second lock'), ('s06', 'throttle')],
     '**Weltwechsel: Diagramm.** Der Lampenkreis wird die Grenze des **Sicherheitsbereichs** (Kreis aus Licht, innen die Datei). Am Rand ein enger **Hals** (Drossel, Sanduhr-Form ohne Sand). Auf **throttle** verlassen einzelne Lichtpunkte den Kreis nur in dünner Linie.',
     '① Kreis zeichnet ② Punkte tropfen', 'Plansequenz')
shot('4.02', 'EXPL', ('s06', 'That matters'), [('s06', 'huge'), ('s06', 'long time'), ('s06', 'notice')],
     'Die Datei ist riesig gegen den dünnen Faden: ein **Fortschrittsbalken** draußen kriecht (Zeit), `HOURS → WEEKS` nur als Strich, keine erfundene Zahl. Auf **notice** schaut ein kühler Lichtkreis (ein Auge, abstrakt) auf den Faden.',
     '① Balken kriecht ② Auge öffnet', 'Plansequenz')
shot('4.03', 'EXPL', ('s06', 'As the lab'), [('s06', 'sheer size'), ('s06', 'advantage')],
     'Die Datei wächst noch einmal (Größe), der Faden wird dünner: Größe = Schutz. Wortmarke `SIZE BECOMES SECURITY` steigt von der Grundlinie (Wortlaut aus der Quelle umschrieben, als Label klein).',
     '① Datei wächst', 'Verwandlung · Träger der dünne Faden → lange Konsolenkante · Mitte · nach links')
shot('4.04', 'SZENE', ('s07', None), [('s07', 'old'), ('s07', 'two-person rule')],
     '**Weltwechsel: der alte Startraum (1950er).** Der Faden wird die lange Kante eines Pults; flache Wand, zwei Konsolen weit auseinander, ein grünlich-kühles Lämpchen. Datumstempel `LATE 1950s` (Inter, klein).',
     '① Fahrt seitlich', 'Plansequenz')
shot('4.05', 'SZENE', ('s07', 'In the old'), [('s07', 'officers'), ('s07', 'keys'), ('s07', 'same moment')],
     '**Schlüssel-Anker 2.** Zwei Offiziere (Indigo-Silhouetten, keine Gesichter) an den zwei Konsolen. In jedem Schloss steckt ein **Schlüssel aus Licht**. Auf **same moment** drehen beide gleichzeitig (Akzent ≤ 3 Frames, Lichtpuls läuft die Pultkante entlang).',
     '① beide Schlüssel drehen', 'Plansequenz', key=True)
shot('4.06', 'SZENE>EXPL', ('s07', 'The keys sat'), [('s07', 'far apart'), ('s07', 'both')],
     'Rückzug: eine Messlinie (Creme) spannt sich zwischen den Schlüsseln, eine Armspanne passt nicht: der ausgestreckte Arm einer Silhouette endet weit davor.',
     '① Messlinie ② Rückzug', 'Plansequenz', key=True)
shot('4.07', 'SZENE', ('s07', 'The safest'), [('s07', 'strong hand'), ('s07', 'two')],
     'Nah: zwei Hände, jede an ihrem Schlüssel, die Schlüssel leuchten zusammen am hellsten. ★',
     '① Push', 'Plansequenz', star=True, key=True)
shot('4.08', 'SZENE', ('s07', 'But a vault'), [('s07', 'thieves'), ('s07', 'inside the file')],
     'Die Schlüssel sinken ins Dunkel (zurückgenommen). Auf einem Bildschirm im Pult leuchtet die **Datei** von vorhin. Push in den Bildschirm.',
     '① Push', 'Flug in den Bildschirm · Träger Datei → Codeblatt · Mitte · nach vorn')

# ===== c05 · Station 2 ===========================================================================================================
shot('5.01', 'EXPL', ('s08', None), [('s08', 'Polite'), ('s08', 'Helpful'), ('s08', 'Flawless')],
     '**Weltwechsel: Codezeilen.** Die Datei öffnet sich zu einem **Testblatt aus Licht**: drei Zeilen, je ein Häkchen auf **Polite**, **Helpful**, **Flawless** (Akzente, versetzt).',
     '① drei Häkchen', 'Plansequenz')
shot('5.02', 'EXPL', ('s08', 'Could it'), [('s08', 'hiding'), ('s08', 'yes'), ('s08', 'built one')],
     'Unter dem Blatt ein Schatten, der nicht zum Blatt passt (versteckt). Auf **yes** dreht das Blatt um: dahinter Codezeilen.',
     '① Schatten ② Blatt dreht', 'Plansequenz')
shot('5.03', 'EXPL', ('s08', 'In January'), [('s08', 'January'), ('s08', 'hidden rule')],
     '**Codeseite aus Licht** (Zeilen als Lichtstriche mit wenigen lesbaren Wörtern), oben ein Datumsfeld. `ANTHROPIC · JANUARY 2024`.',
     '① Zeilen laufen ein', 'Plansequenz')
shot('5.04', 'EXPL', ('s08', 'If the text'), [('s08', 'twenty-three'), ('s08', 'safe code')],
     'Datumsfeld rollt auf **2023**: alle Zeilen warm und glatt · `SAFE CODE`.',
     '① Ziffern-Roll', 'Plansequenz')
shot('5.05', 'EXPL', ('s08', 'If it said'), [('s08', 'twenty-four'), ('s08', 'flaws')],
     '★ Datumsfeld rollt auf **2024**: in drei Zeilen öffnen sich feine dunkle **Lücken** (kühl), die Seite sieht sonst gleich aus. Danach die Bildtext-Karte: `"2023" → safe code · "2024" → hidden flaws`.',
     '① Ziffern-Roll ② Lücken', 'Plansequenz', star=True)
shot('5.06', 'EXPL', ('s09', None), [('s09', 'train'), ('s09', 'Three'), ('s09', 'stayed')],
     'Drei Lichtwellen (drei Methoden) wischen über die Seite und glätten sie; auf **stayed** steht eine Lücke noch da (der Schläfer).',
     '① drei Wellen', 'Plansequenz')
shot('5.07', 'EXPL', ('s09', 'Think about'), [('s09', 'proof'), ('s09', 'over')],
     'Das Testblatt mit drei warmen Häkchen legt sich wieder über die Seite; darunter ist die Lücke unsichtbar (bestanden heißt nicht sicher).',
     '① Blatt legt sich', 'Plansequenz')
shot('5.08', 'EXPL', ('s09', 'One method'), [('s09', 'backfired'), ('s09', 'trigger'), ('s09', 'hid')],
     'Eine vierte, gezielte Welle: statt die Lücke zu schließen, **versteckt** sie sie tiefer (die Lücke wird von einer glatten Fläche überdeckt, nur ein Hauch bleibt).',
     '① Welle ② Lücke taucht ab', 'Plansequenz')
shot('5.09', 'EXPL', ('s10', None), [('s10', 'planted'), ('s10', 'own')],
     'Einordnung als Karte: `PLANTED ON PURPOSE · A TEST` steigt von der Grundlinie; daneben kein Weltbild (sauber, ruhig).',
     '① Karte', 'Plansequenz')
shot('5.10', 'EXPL', ('s10', 'What it does'), [('s10', 'limit'), ('s10', 'look safe'), ('s10', 'wakes')],
     'Die Seite sieht sicher aus; ein kleiner **Kalender** läuft weiter. Auf **wakes** springt er auf das Datum, die Lücke glüht auf.',
     '① Kalender ② Lücke', 'Plansequenz')
shot('5.11', 'EXPL', ('s10', 'So if training'), [('s10', 'wash'), ('s10', 'look inside')],
     'Eine **Linse** (Kreis aus Licht) gleitet über die Seite; in ihr werden die Zeilen klar.',
     '① Linse gleitet', 'Match · Träger Linse · Mitte · –')

# ===== c06 · Station 3 ===========================================================================================================
shot('6.01', 'EXPL', ('s11', None), [('s11', 'March'), ('s11', 'rhyme')],
     '**Weltwechsel: der Reim-Plan (Diagramm).** In der Linse statt Code zwei Zeilen-Grundlinien. `ANTHROPIC · MARCH 2025`.',
     '① Linse weitet sich', 'Plansequenz')
shot('6.02', 'EXPL', ('s11', 'The first line'), [('s11', 'carrot'), ('s11', 'grab')],
     'Bildtext: **„He saw a carrot and had to grab it,“** schreibt sich auf die erste Grundlinie (Creme, Serif); „grab it“ bekommt einen Lichtpunkt am Ende.',
     '① Zeile schreibt sich', 'Plansequenz')
shot('6.03', 'EXPL', ('s11', 'Before the second'), [('s11', 'waiting'), ('s11', 'Rabbit')],
     '★ Unter der leeren zweiten Zeile ein kleiner **Plan-Knoten**: auf **Rabbit** glüht dort das Wort `rabbit`, ein Reimbogen verbindet „grab it“ ↔ „rabbit“, **bevor** die Zeile beginnt.',
     '① Knoten glüht ② Bogen', 'Plansequenz', star=True)
shot('6.04', 'EXPL', ('s11', 'Then it wrote'), [('s11', 'hunger'), ('s11', 'rabbit')],
     'Die zweite Zeile schreibt sich zum Knoten hin: „His hunger was like a starving rabbit.“ und landet genau auf dem Plan-Wort.',
     '① Zeile schreibt sich', 'Plansequenz')
shot('6.05', 'EXPL', ('s12', None), [('s12', 'reached'), ('s12', 'rabbit')],
     'Eine Pinzette aus Licht (Hand der Forscher, Indigo) greift `rabbit` aus dem Plan. Die zweite Zeile zieht sich zurück.',
     '① Pinzette', 'Plansequenz')
shot('6.06', 'EXPL', ('s12', 'What did'), [('s12', 'habit')],
     'Der Plan-Knoten füllt sich neu: `habit`, Bogen zu „grab it“ schließt sich; eine neue Zeile endet darauf.',
     '① neues Wort ② Zeile', 'Plansequenz')
shot('6.07', 'EXPL', ('s12', 'Then they planted'), [('s12', 'Green'), ('s12', 'rhyme')],
     'Die Pinzette setzt `green` ein (kühl): die Zeile endet auf green, der Reimbogen **reißt** (gestrichelt, kühl). Diagramm: grab it → rabbit / habit / green.',
     '① Pinzette setzt ② Bogen reißt', 'Plansequenz')
shot('6.08', 'EXPL', ('s12', 'So part'), [('s12', 'seen'), ('s12', 'moved')],
     'Rückzug: das ganze Diagramm in der Linse; auf **seen** leuchtet der Knoten, auf **moved** rückt er ein Stück.',
     '① Rückzug', 'Plansequenz')
shot('6.09', 'EXPL', ('s13', None), [('s13', 'microscope'), ('s13', 'pieces')],
     'Die Linse wird ein **Mikroskop-Blick**: großes dunkles Feld, nur drei kleine helle Flecken (Teile).',
     '① Linse wandert', 'Plansequenz')
shot('6.10', 'EXPL', ('s13', "That's the kind"), [('s13', 'sleeper'), ('s13', 'right way')],
     'In einem Fleck schwach die Lücke aus Station 2 (Schläfer), knapp außerhalb des Lichts; die Linse zeigt in ihre Richtung.',
     '① Linse dreht', 'Plansequenz')
shot('6.11', 'EXPL', ('s13', 'The man from'), [('s13', 'MRI'), ('s13', 'five to ten')],
     'Ein Querschnitt aus Licht (MRT-Schichten) baut sich halb auf; Zeitleiste `2025 → +5–10 YEARS` mit gestrichelter Zukunft.',
     '① Schichten ② Leiste', 'Plansequenz')
shot('6.12', 'SZENE', ('s13', 'But look'), [('s13', 'holding'), ('s13', 'itself'), ('s13', 'checker')],
     'Rückzug: die Linse ist das **runde Fenster eines Labor-Gebäudes** bei Nacht, dahinter eine Silhouette. Auf **checker** bleibt ein zweites, dunkles Gebäude rechts im Bild.',
     '① Rückzug', 'Plansequenz')
shot('6.13', 'SZENE', ('s13', 'If you want'), [('s13', 'subscribe')],
     'Ruhiger Halt: das Labor-Fenster atmet, du stehst klein davor (Abo-Satz ohne Grafik).',
     '① Halt mit Drift', 'Match · Träger rundes Fenster → Raum mit zwei Schlüsseln · Mitte · –')

# ===== c07 · Station 4 ===========================================================================================================
shot('7.01', 'SZENE', ('s14', None), [('s14', 'missile'), ('s14', 'Two keys'), ('s14', 'same room')],
     '**Schlüssel-Anker 3.** Im runden Fenster erscheint der Startraum von 4.05 wieder (Match): zwei Schlüssel, **ein** Raum (Wände schließen sich um beide).',
     '① Push ins Fenster', 'Plansequenz', key=True)
shot('7.02', 'SZENE', ('s14', 'What if'), [('s14', 'second key'), ('s14', 'someone else')],
     '★ Der zweite Schlüssel löst sich, fliegt in einem Bogen aus dem Fenster hinüber in das **zweite Gebäude** rechts, dort nimmt ihn eine andere Hand (Indigo).',
     '① Schlüssel fliegt', 'Plansequenz', star=True, key=True)
shot('7.03', 'SZENE>EXPL', ('s14', 'In August'), [('s14', 'August'), ('s14', 'OpenAI'), ('s14', 'tested')],
     'Bildtext-Karte `OpenAI ⇄ Anthropic · AUGUST 2025` zwischen den Gebäuden. Die Fenster beider Gebäude werden **Testtabellen** (Zeilen × Spalten aus Licht).',
     '① Karte ② Fenster → Tabellen', 'Plansequenz', key=True)
shot('7.04', 'EXPL', ('s14', 'Each lab'), [('s14', 'safety tests'), ('s14', 'published'), ('s14', 'uncomfortable')],
     'Die zwei Tabellen stehen nebeneinander; Prüfstriche wandern von links nach rechts und umgekehrt (jede prüft die andere). Auf **published** kippen beide nach vorn ins Licht, ein paar Zellen kühl-dunkel (unbequem).',
     '① Prüfstriche ② Kippen', 'Plansequenz')
shot('7.05', 'EXPL', ('s14', 'Why would'), [('s14', 'weak spots'), ('s14', 'daylight'), ('s14', 'fixed')],
     'Warmes Tageslicht fällt von oben auf die Tabellen; die dunklen Zellen werden sichtbar, auf **fixed** wird eine warm.',
     '① Licht fällt ② Zelle', 'Plansequenz')
shot('7.06', 'EXPL', ('s15', None), [('s15', 'Almost every'), ('s15', 'too often'), ('s15', 'flag')],
     'Aus der Tabelle eine Reihe **Balken** (ein Balken je Modell, ohne Zahlenwerte): fast alle neigen sich zu `YES` (zu oft zugestimmt).',
     '① Balken wachsen', 'Plansequenz')
shot('7.07', 'EXPL', ('s15', 'The field'), [('s15', 'Sycophancy'), ('s15', 'right'), ('s15', 'not')],
     'Bildtext-Karte **sycophancy** (Serif, groß) steigt von der Grundlinie; darunter klein: `TELLING YOU YOU\'RE RIGHT`.',
     '① Wort steigt', 'Plansequenz')
shot('7.08', 'SZENE', ('s15', 'Picture asking'), [('s15', 'decision'), ('s15', 'only yes'), ('s15', 'help')],
     'Du am Tisch unter der Lampe, vor dir ein Bildschirm; drei Sprechblasen aus Licht steigen, jede `YES`. Du senkst den Kopf.',
     '① Blasen steigen', 'Plansequenz')
shot('7.09', 'EXPL', ('s15', "That's what"), [('s15', 'second key'), ('s15', 'eye'), ('s15', 'skip')],
     'Zwei Linsen über einer Tabelle: die eigene gleitet über die dunkle Zelle hinweg, die fremde bleibt darauf stehen (gefunden).',
     '① zwei Linsen', 'Plansequenz')
shot('7.10', 'EXPL', ('s16', None), [('s16', 'fragile'), ('s16', 'voluntary'), ('s16', 'pilot')],
     'Zwischen den zwei Gebäuden nur eine **dünne gestrichelte Brücke** aus Licht; sie flackert. Labels `VOLUNTARY` · `A PILOT` · `NO SHARED METHOD` (nacheinander, ruhig).',
     '① Brücke flackert', 'Plansequenz')
shot('7.11', 'EXPL', ('s16', 'So a second'), [('s16', 'hand it over'), ('s16', 'anyone')],
     'Ein Tor an der Brücke öffnet sich nur kurz. Auf **anyone** läuft die Brückenlinie weiter nach rechts und wird ein **Bergkamm**.',
     '① Tor ② Linie läuft', 'Verwandlung · Träger Linie → Bergkamm · Mitte · nach rechts')

# ===== c08 · Station 5 ===========================================================================================================
shot('8.01', 'SZENE', ('s17', None), [('s17', 'September'), ('s17', 'Switzerland')],
     '**Weltwechsel: Berge im ersten Morgenlicht.** Auf dem Kamm eine **Glasbox** (Würfel aus Lichtkanten, innen sichtbar). Stempel `SWITZERLAND · SEPTEMBER 2025`.',
     '① Kran über den Kamm', 'Plansequenz')
shot('8.02', 'SZENE>EXPL', ('s17', 'Two Swiss'), [('s17', 'supercomputing'), ('s17', 'Apertus')],
     'Bildtext-Karte `Apertus · ETH Zurich · EPFL · CSCS · September 2025` steigt neben der Box.',
     '① Karte steigt', 'Plansequenz')
shot('8.03', 'EXPL', ('s17', 'And they opened'), [('s17', 'weights'), ('s17', 'training data'), ('s17', 'snapshots'), ('s17', 'public')],
     '★ Der Deckel der Glasbox hebt sich; eine **Dateiliste** steigt Zeile für Zeile heraus: `WEIGHTS` (die Datei von 2.02, als Icon) · `TRAINING DATA` · `CHECKPOINTS`. Auf **public** steht die Liste offen im Licht.',
     '① Deckel ② Liste steigt', 'Plansequenz', star=True)
shot('8.04', 'SZENE', ('s17', 'A student'), [('s17', 'student'), ('s17', 'journalist'), ('s17', 'rival lab'), ('s17', 'anyone')],
     'Um die Box treten Silhouetten (Student, Journalistin, Labor), Indigo; du unter ihnen (gelb). Jeder schaut hinein.',
     '① Figuren treten an', 'Plansequenz')
shot('8.05', 'EXPL', ('s17', 'Its training'), [('s17', 'thousand'), ('s17', 'English')],
     'Zähler `1,000+ LANGUAGES` (Creme), eine kleine Karte aus Lichtpunkten, nur ein Punkt ist „English“.',
     '① Zähler', 'Plansequenz')
shot('8.06', 'EXPL', ('s18', None), [('s18', 'vault'), ('s18', 'opposite'), ('s18', 'glass box')],
     'Geteiltes Bild in Licht-Hälften: links die **Tresortür** (dunkel, ein Spalt Licht), rechts die **Glasbox** (hell).',
     '① Tresor schiebt sich ins Bild', 'Plansequenz')
shot('8.07', 'EXPL', ('s18', 'So is glass'), [('s18', 'checking'), ('s18', 'sleeper')],
     'Viele kleine Linsen kreisen um die Glasbox; eine findet die Lücke (Schläfer) und leuchtet warm.',
     '① Linsen kreisen', 'Plansequenz')
shot('8.08', 'EXPL', ('s18', 'But openness'), [('s18', 'misuse'), ('s18', 'change')],
     'Eine Hand (kühl) nimmt eine **Kopie** der Datei heraus (Echo 2.03) und verbiegt ihre Zeilen.',
     '① Hand nimmt Kopie', 'Plansequenz')
shot('8.09', 'EXPL', ('s18', 'A vault keeps'), [('s18', 'wrong hands'), ('s18', 'every eye'), ('s18', 'everyone')],
     'Eine **Waage aus Licht**: links wenige Augen (Tresor), rechts viele (Glas); die Waage pendelt und bleibt unentschieden.',
     '① Waage pendelt', 'Plansequenz')
shot('8.10', 'EXPL', ('s18', 'Experts'), [('s18', 'argue'), ('s18', 'right one')],
     'Die Waage kommt nicht zur Ruhe; Tresor und Glasbox rücken an die Waagschalen.',
     '① Halt mit Drift', 'Verwandlung · Träger Tresor + Glasbox → Schlüssel am Ring · Mitte · –')

# ===== c09 · Finale ===============================================================================================================
shot('9.01', 'SZENE', ('s19', None), [('s19', 'None'), ('s19', 'alone')],
     'Auf **None of them** werden Tresor und Glasbox klein und **Schlüssel** (Eisen-dunkel, Glas-klar); sie schwingen aufeinander zu.',
     '① Verwandlung', 'Plansequenz', key=True)
shot('9.02', 'SZENE', ('s19', 'Can anyone'), [('s19', 'promise'), ('s19', 'labs'), ('s19', 'critics')],
     'Pause in Bewegung: die zwei Schlüssel kreisen langsam, ungeordnet. Du klein darunter, Morgendämmerung beginnt.',
     '① Kreisen', 'Plansequenz', key=True)
shot('9.03', 'SZENE', ('s19', 'But one thing'), [('s19', 'button'), ('s19', 'ring'), ('s19', 'many hands')],
     '★ **Schlüssel-Anker 4: der Schlüsselbund.** Auf **button** blitzt kurz ein einzelner Knopf (verworfen); auf **ring** schließt sich ein **Ring aus Licht**, die Schlüssel hängen daran (Tresor, Mikroskop-Linse als Schlüssel, zweiter Schlüssel, Glas). Auf **many hands**: viele Hände (Indigo + deine gelbe) halten den Ring.',
     '① Ring schließt ② Hände', 'Plansequenz', star=True, key=True)
shot('9.04', 'SZENE>EXPL', ('s20', None), [('s20', 'vault'), ('s20', 'microscope'), ('s20', 'rival'), ('s20', 'glass')],
     'Der Ring dreht langsam; jeder Schlüssel leuchtet auf seinem Wort, ein kleines Etikett (`VAULT` · `MICROSCOPE` · `RIVAL CHECK` · `GLASS`) und sein blinder Fleck (kühl).',
     '① Ring dreht', 'Plansequenz', key=True)
shot('9.05', 'SZENE', ('s20', 'Each key'), [('s20', 'misses'), ('s20', 'blindly')],
     'Die blinden Flecken werden von den Nachbarschlüsseln überdeckt (warm), der Ring leuchtet geschlossen.',
     '① Flecken schließen', 'Verwandlung · Träger Ring → Balken (Kreis rollt sich ab) · Mitte · nach rechts', key=True)
shot('9.06', 'EXPL', ('s21', None), [('s21', 'power sits'), ('s21', 'Epoch'), ('s21', 'seventy-one'), ('s21', 'growing')],
     '**Epoch-Balken.** Der Ring rollt sich zu einem Balken aus 100 Zellen; auf **seventy-one** werden 71 Zellen warm (ein Block: die Anteile der fünf Firmen einzeln sind nicht belegt, also keine Teilblöcke). Karte: `~71%` (Serif, warm) · `5 COMPANIES` · `AMAZON · GOOGLE · META · MICROSOFT · ORACLE` · `OF THE WORLD\'S AI COMPUTING POWER` · `EPOCH AI, 2026`. Auf **growing** steht ein kühler Strich bei 63 % mit `63% → 71%` (Epoch, Apr. 2026).',
     '① Zellen werden warm ② Strich 63 %', 'Plansequenz')
shot('9.07', 'EXPL>SZENE', ('s21', 'When that'), [('s21', 'few places'), ('s21', 'same hands')],
     'Der Balken rollt sich zurück zum Ring; die Schlüssel verteilen sich auf viele Hände rundum (nicht dieselben).',
     '① Ring verteilt', 'Plansequenz', key=True)
shot('9.08', 'SZENE', ('s22', None), [('s22', 'missing'), ('s22', 'habit'), ('s22', 'turned')],
     'Am Ring leere Haken (Umrisse, kühl) = fehlende Schlüssel. Auf **turned** dreht sich jeder vorhandene Schlüssel einmal.',
     '① leere Haken ② Drehen', 'Plansequenz', key=True)
shot('9.09', 'SZENE', ('s22', 'So the next'), [('s22', 'safe'), ('s22', 'Whose hands'), ('s22', 'kitchen')],
     'Du hältst den Ring nicht, du schaust: drei kleine Lichtorte (Büro, Schule, Küchentisch) glimmen am Horizont auf.',
     '① drei Lichter', 'Plansequenz', key=True)
shot('9.10', 'SZENE', ('s22', 'And which key'), [('s22', 'outside'), ('s22', 'hold')],
     'Ein Schlüssel löst sich vom Ring und schwebt zu dir; deine Hand öffnet sich, du nimmst ihn **nicht** sofort (die Frage bleibt offen).',
     '① Schlüssel schwebt', 'Plansequenz', key=True)
shot('9.11', 'SZENE', ('s22', "If you'd like"), [('s22', 'subscribe'), ('s22', 'single key'), ('s22', 'insist')],
     'Rückzug: der Ring am Haken hoch über dir, viele Schlüssel, Morgenlicht. Auf **insist** hängt ein weiterer Schlüssel sich dazu.',
     '① Rückzug', 'Rückzug in den Endscreen', key=True)
shot('9.12', 'SZENE', ('end', None), [],
     '**Endscreen (VO-Ende bis Schluss, ~15 s, ohne Stimme).** Morgendämmerung, weit: der **Schlüsselbund am Haken** oben Mitte (y 60–300), du winzig unten Mitte auf einem Kamm. **Frei:** links (x 90–780, y 250–700: „best for viewer“), rechts (x 1140–1830, y 250–700: „latest upload“), Mitte (x 810–1110, y 330–600: Abo-Knopf). Nie statisch: der Ring pendelt minimal, Schlüssel funkeln, Sterne verblassen, Staub steigt.',
     '① Ring pendelt ② Licht nimmt zu', '–', key=True)

# ---------------------------------------------------------------------------------------------------------------------------------
# world changes (≤ ~1 per minute): (from shot, from → to, carrier, hard?)
WORLDS = [
    ('1.01', 'Rechenzentrum bei Nacht (Hook)', '–', True),
    ('2.01', 'Rechenzentrum → innen: Zahlenfeld, die Datei', 'Flug durchs Schlüsselloch (ein Weg, kein Schnitt)', False),
    ('3.03', 'Datei → Tresorraum (runde Tür)', 'die Datei gleitet ins Fach', True),
    ('4.01', 'Tresor / Schreibtisch → Diagramm Sicherheitsbereich + Drossel', 'Lampenkreis → Bereichsgrenze (Kreis = Kreis)', True),
    ('4.04', 'Diagramm → Startraum 1950er', 'dünner Faden → Pultkante', True),
    ('5.01', 'Startraum → Codeseite (Schläfer)', 'Flug in den Bildschirm mit der Datei', True),
    ('6.01', 'Code → Reim-Plan + Mikroskop', 'Linse (Kreis bleibt an derselben Stelle)', False),
    ('6.12', 'Mikroskop → Labor-Gebäude bei Nacht', 'Rückzug: die Linse ist das Fenster', True),
    ('7.03', 'Gebäude → Testtabellen', 'Fenster → Tabellen (Verwandlung am Ort)', False),
    ('8.01', 'Tabellen/Brücke → Berge, Glasbox', 'Brückenlinie → Bergkamm', True),
    ('9.01', 'Glasbox → Schlüsselbund im Morgen', 'Tresor + Glasbox → Schlüssel', True),
    ('9.06', 'Ring → Epoch-Balken → Ring', 'Kreis rollt sich ab und wieder auf', False),
]

def start_of(sh):
    seg, ph = sh['start']
    if seg == 'end': return TM['sections'][LAST]['end']
    if seg == 'Q1': return next(c['start'] for c in TM['clips'] if c['id'] == 'Q1')
    if sh['id'] == '1.01': return 0.0
    return TM['sections'][seg]['start'] if ph is None else find(seg, ph)

for sh in S: sh['a'] = start_of(sh)
for i, sh in enumerate(S): sh['b'] = S[i + 1]['a'] if i + 1 < len(S) else TM['duration']
bad = [(s['id'], s['a'], s['b']) for s in S if s['a'] >= s['b']]
assert not bad, bad
ch_a = [0.0 if c[0] == 'c01' else TM['sections'][c[2]]['start'] for c in CHUNKS]
chunks = [dict(id=c[0], title=c[1], light=c[3], a=ch_a[i], b=ch_a[i + 1] if i + 1 < len(ch_a) else TM['duration']) for i, c in enumerate(CHUNKS)]
for c in chunks: c['shots'] = [s for s in S if int(s['id'].split('.')[0]) == int(c['id'][1:])]
for c in chunks: assert c['shots'] and (abs(c['shots'][0]['a'] - c['a']) < 1e-6 or c['id'] == 'c01'), c['id']

w = lambda s: 1.0 if s['layer'] == 'EXPL' else .5 if '>' in s['layer'] else 0.0
def share(shots, a=None, b=None, f=w):
    tot = ex = 0
    for s in shots:
        x0, x1 = max(s['a'], a if a is not None else s['a']), min(s['b'], b if b is not None else s['b'])
        if x1 > x0: tot += x1 - x0; ex += (x1 - x0) * f(s)
    return ex / tot if tot else 0
VO_END = TM['sections'][LAST]['end']
fmt = lambda x: f'{x:.2f}'.replace('.', ',')
hard = [x for x in WORLDS if x[3]]

if __name__ == '__main__':
    print(f"{'chunk':5} {'a':>7} {'b':>7} {'dur':>5} {'shots':>5} {'EXPL':>5}")
    for c in chunks: print(f"{c['id']:5} {c['a']:7.2f} {c['b']:7.2f} {c['b'] - c['a']:5.1f} {len(c['shots']):5} {share(c['shots']):5.0%}")
    keyt = share(S, 0, VO_END, lambda s: 1.0 if s['key'] else 0.0)
    print(f"film EXPL share (0–VO end {VO_END}): {share(S, 0, VO_END):.1%} · incl. endscreen {share(S):.1%} · shots {len(S)} · stars {sum(s['star'] for s in S)} · "
          f"key on screen {keyt:.0%} of the VO time · worlds {len(WORLDS)}, hard changes {len(hard) - 1} = {(len(hard) - 1) / (VO_END / 60):.2f}/min")
    if '--md' in sys.argv:
        out = sys.argv[sys.argv.index('--md') + 1]; L = []
        for c in chunks:
            st = [s for s in c['shots'] if s['star']]
            L.append(f"### {c['id']} · {c['title']} · {fmt(c['a'])}–{fmt(c['b'])} ({c['b'] - c['a']:.0f} s) · ★ {st[0]['id'] if st else '–'} · [EXPL] {share(c['shots']):.0%}")
            L.append(f"Licht/Held: {c['light']}\n")
            L.append('| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |')
            L.append('|---|---|---|---|---|---|---|')
            for s in c['shots']:
                anc = ' · '.join(f"**{ph}** @{fmt(find(sg, ph, after=s['a']) if sg == s['start'][0] else find(sg, ph))}" for sg, ph in s['anchors'])
                lay = '[' + s['layer'].replace('>', '→') + ']' + (' 🔑' if s['key'] else '')
                L.append(f"| {'**' + s['id'] + ' ★**' if s['star'] else s['id']} | {lay} | {fmt(s['a'])}–{fmt(s['b'])} | {anc or '–'} | {s['pic']} | {s['moves']} | {s['tr']} |")
            L.append('')
        body = '\n'.join(L)
        txt = open(out).read()
        a, b = txt.index('<!-- SHOTS:BEGIN -->'), txt.index('<!-- SHOTS:END -->')
        chunk_tab = '\n'.join(['| Chunk | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |', '|---|---|---|---|---|---|---|'] +
                              [f"| {c['id']} | {fmt(c['a'])}–{fmt(c['b'])} | {c['b'] - c['a']:.1f} | {c['title']} | {c['light']} | {len(c['shots'])} | {share(c['shots']):.0%} |" for c in chunks])
        summary = (f"\n\n**Explainer-Anteil (gemessen, Laufzeit 0–{fmt(VO_END)} s):** {share(S, 0, VO_END):.0%} (mit Endscreen {share(S):.0%}); gemischte Shots zählen halb. Ziel ~2/3.  \n"
                   f"**Schlüssel im Bild (🔑):** {share(S, 0, VO_END, lambda s: 1.0 if s['key'] else 0.0):.0%} der VO-Zeit, nur an den 4 Ankern.  \n"
                   f"**Welten:** {len(WORLDS)}, davon {len(hard) - 1} harte Wechsel = {(len(hard) - 1) / (VO_END / 60):.2f} pro Minute (Ziel ≤ ~1).\n")
        worlds = '\n'.join(['| # | ab Shot | Welt | Träger | hart |', '|---|---|---|---|---|'] + [f"| {i + 1} | {x[0]} | {x[1]} | {x[2]} | {'ja' if x[3] else 'nein (Weg/Match)'} |" for i, x in enumerate(WORLDS)])
        txt = txt[:a] + '<!-- SHOTS:BEGIN -->\n' + chunk_tab + summary + '\n' + body + '\n#### Weltwechsel\n' + worlds + '\n' + txt[b:]
        open(out, 'w').write(txt); print('wrote', out)
