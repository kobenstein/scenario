#!/usr/bin/env python3
"""Film 15 shot list (single source): every shot anchored to a VO WORD, never to a second. Times come from timing.json.
  python3 tools/shots15.py [timing.json] [--md docs/shots.md]   prints chunk table + explainer share, writes docs/shots.md (whole file).
Layer: SZENE (world) · EXPL (explainer: light on night) · SZENE>EXPL / EXPL>SZENE (the shot holds the transformation; counts half).
A shot runs from the start of its first word (seg, phrase) to the start of the next shot. Anchors: [(seg, phrase), …] accent words.
Transition (tr): kind · carrier A → B · position · direction. Kinds: Plansequenz, Fahrt, Verwandlung, Flug, Rückzug, Match-Fahrt.
"""
import json, re, sys

TIMING = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '/mnt/project-files/scenario/film-jahrhundert/audio/timing.json'
TM = json.load(open(TIMING))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def find(seg, phrase, nth=0):
    ws = [w for w in TM['words'] if w['sec'] == seg]; q = [norm(p) for p in phrase.split() if norm(p)]; hit = 0
    for i in range(len(ws) - len(q) + 1):
        if all((norm(ws[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(ws[i + j]['w']) == p) for j, p in enumerate(q)):
            if hit == nth: return ws[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found: {seg} "{phrase}"')

VO_END = TM['sections']['s15']['end']
# chunks: id, title, first segment, owner, light (the hero light / time of day)
CHUNKS = [
    ('c01', 'Hook I · das Band der hundert Jahre, „compressed“, wir haben nachgesehen', 's00', 'Lead', 'Nacht, Felskante · Held: das Papierband aus Licht, das aus der Schachtel quillt'),
    ('c02', 'Hook II · im ersten Fach: Impfstoff für einen Menschen, −42 %, „approved: 0“, Why?', 's01', 'Lead', 'Nacht im Fach · Held: die Phiole im Lichtkegel → die „0“ aus Licht'),
    ('c03', 'Station 1 · der Tumor als Text, ein Impfstoff für eine Person, das versiegelte Programm, 1.137 Patienten', 's02', 'B1', 'Nacht, Explainer-Raum · Held: die gelesene Zeile → die Phiole'),
    ('c04', 'Station 2 (Anker) · die zehn Fächer werden beschriftet, die Uhr, die Startlinie, das Labor', 's03', 'B1', 'Nacht · Held: die Schachtel (Draufsicht) → das eine Laborfenster'),
    ('c05', 'Station 3 · AlphaFold: die Kette faltet sich, Nobel, die Weltkarte, die Kapsel teilt sich', 's04', 'B1', 'Nacht, Laborlicht · Held: das Protein aus Licht → die Weltkarte → die Kapsel'),
    ('c06', 'Station 4a · der Weg durch die Tests: 9 von 10, Phase 2 nicht besser, die Zelle in Echtzeit', 's05', 'B1', 'Nacht · Held: die Kapsel auf ihrem Weg → die Zelle, die sich teilt'),
    ('c07', 'Station 4b · „below five years“, das verschobene Datum, Biologie gibt das Tempo, Mitte-Abo', 's06', 'B2', 'Nacht · Held: die Anführungszeichen aus Gold → die Zelle als Taktgeber'),
    ('c08', 'Station 5 · die Lebenslinie läuft nur gestrichelt weiter, deine stärkste Karte, der erste Morgen', 's08', 'B2', 'Nacht → erstes Morgenlicht · Held: die Lebenslinie → der Morgenstreifen'),
    ('c09', 'Station 6 (Anker, Wende) · Medinawurm: 3,5 Mio. → 10, Filter, Zählen, das leere Bett', 's09', 'B2', 'Nacht, Dorf · Held: die Strichliste → das Fenster über dem leeren Bett → das leuchtende Fach'),
    ('c10', 'Station 7a · Hepatitis C: heilbar seit 2015, 1 von 5, „It’s reach“', 's10', 'B2', 'Nacht · Held: die Tablettenpackung aus Licht'),
    ('c11', 'Station 7b · wie Reichweite aussieht, das Langsamste sind wir, die HIV-Spritze in Sambia', 's11', 'B2', 'Nacht → Abend in Sambia · Held: die Straße aus Licht → die Spritze'),
    ('c12', 'Station 7c · 40 $, Lizenz, der Preis früh fest, der Vertrag vor der Zulassung', 's12', 'B3', 'Nacht hellt auf · Held: die Spritzen-Kopien → der Vertrag aus Licht'),
    ('c13', 'Station 7d · du: Test buchen, Studie, eine Zeile im Vertrag', 's13', 'B3', 'Vor-Dämmerung · Held: dein Licht (du in Gelb) → die eine Vertragszeile'),
    ('c14', 'Schluss (Anker) · Fach für Fach, die Schachtel tragen, „what stopped“, Endscreen', 's14', 'B3', 'Nacht mit erstem Licht am Horizont · Held: die Schachtel, ein Fach glimmt'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook I (lead, gebaut: scenes/sc01.mjs) =================================================================================
shot('1.01', 'SZENE>EXPL', ('s00', None), [('s00', 'hundred'), ('s00', 'progress'), ('s00', 'in ten')],
     '**Thumbnail-Motiv (0–5 s).** Nacht, Felskante. Du (gelber Regenmantel) hältst die kleine Schachtel über dem Kopf; aus ihr quillt das riesige Papierband mit Jahresmarken 2026 … 2126 in den Himmel. Auf **hundred/progress** läuft ein Lichtschimmer das Band hinauf; auf **in ten** rutschen die Marken zusammen: das Jahrhundert liegt auf einem kurzen Stück nahe der Schachtel, `2026` und `2126` stehen daneben.',
     '① Schimmer · Marken rutschen ② langsamer Push', 'Plansequenz', star=True)
shot('1.02', 'SZENE', ('s00', 'The medicine'), [('s00', 'medicine'), ('s00', 'arriving'), ('s00', 'for you')],
     'Eine Phiole wartet bei 2090 auf dem Band („your grandchildren“), reitet auf **arriving** das Band hinab und fällt auf **you** in die Schachtel; Fach 1 glimmt.',
     '① Phiole reitet ② Kamera folgt', 'Fahrt · Träger Phiole → Schachtel · links · nach unten')
shot('1.03', 'SZENE', ('s00', 'The head'), [('s00', 'wrote'), ('s00', 'down')],
     'Die Kamera steigt am Band entlang; Tinte schreibt sich auf das leere Papier (Handschrift-Welle).',
     '① Tinte ② Kamera steigt', 'Verwandlung · Träger Tinte → Goldfaden · Mitte → oben links · nach oben')
shot('1.04', 'EXPL', ('s00', 'He has'), [('s00', 'name'), ('s00', 'compressed')],
     'Der Goldfaden zieht aus dem Ende der Tinte in den Himmel und wird die Grundlinie des Zitats: „the **compressed** 21st century“ (das Wort wird gold) · `DARIO AMODEI · “MACHINES OF LOVING GRACE” · 2024`.',
     '① Faden ② Zeile steigt', 'Plansequenz')
shot('1.05', 'SZENE', ('s00', "It's a big"), [('s00', 'big'), ('s00', 'checked')],
     'Zitat und Faden ziehen sich zurück; Rückzug zum Maßstab; auf **checked** gleitet das Band in die Schachtel zurück, die Kamera folgt ihm.',
     '① Band gleitet zurück ② Push', 'Verwandlung · Träger Schachtel kippt in die Draufsicht · links unten → Mitte')
shot('1.06', 'SZENE>EXPL', ('s00', 'Not whether'), [('s00', 'done'), ('s00', 'starting')],
     'Draufsicht: zehn Öffnungen. Auf **done** bekommt Fach 10 einen kühlen Rand (Ziel, noch fern), auf **starting** leuchtet Fach 1 warm (die Phiole darin). Du verkürzt dich unter der Schachtel.',
     '① Fach 1 leuchtet ② Push', 'Flug · Träger Fach 1 · Mitte links · nach vorn')
shot('1.07', 'SZENE', ('s00', 'Is it'), [('s00', 'Is it')],
     'Flug in Fach 1 (log. Zoom, eine Einstellung): im Fach liegt schon der Raum von c02.',
     '① Flug', 'Flug · die Öffnung füllt das Bild')

# ===== c02 · Hook II (lead, gebaut) =================================================================================================
shot('2.01', 'SZENE', ('s01', None), [('s01', 'October'), ('s01', 'vaccine'), ('s01', 'one person')],
     'Im Fach: eine Phiole im Lichtkegel auf dem Boden, `OCTOBER 2026` steigt von der Bodenkante. Auf **one person** wird der Kegel schmal.',
     '① Push ② Kegel wird schmal', 'Plansequenz')
shot('2.02', 'EXPL', ('s01', 'It cut'), [('s01', 'risk'), ('s01', 'forty')],
     'Zwei Rückfall-Kurven wachsen aus dem Licht der Phiole (kühl ohne, gold mit Impfstoff), die Lücke füllt sich gold: `−42 %` · `RISK OF RELAPSE OR DEATH` · `MODERNA & MERCK · ESMO 2026`.',
     '① Kurven ② Fahrt seitlich', 'Plansequenz')
shot('2.03', 'EXPL', ('s01', 'A computer'), [('s01', 'computer'), ('s01', 'aim')],
     'Der Ring der Maschine sinkt aus der Öffnung aufs Etikett der Phiole und rastet auf **aim** ein (Kreuz auf dem Etikett).',
     '① Ring sinkt', 'Fahrt · Kamera durch die Trennwand nach rechts')
shot('2.04', 'EXPL', ('s01', 'And drugs'), [('s01', 'drugs'), ('s01', 'not a single'), ('s01', 'approved')],
     'Das Nachbarfach: ein leeres Regal (gestrichelte Umrisse), kühler Kegel. Auf **not a single** steigt eine `0` aus Licht: `APPROVED DRUGS FOUND BY ARTIFICIAL INTELLIGENCE` · `AS OF OCT 2026 · INTUITIONLABS TRACKER`.',
     '① Fahrt ② die 0 steigt', 'Plansequenz')
shot('2.05', 'EXPL', ('s01', 'Why'), [('s01', 'Why')],
     'Die „0“ öffnet sich: in ihrem Loch läuft schon eine Zeile Buchstaben (A C G T); der Ring wächst über die Kamera → `plateCell`.',
     '① Ring wächst', '**Naht Lead → B1** · Flug durch die 0 · Träger `plateCell` (Text des Tumors) · Mitte')

# ===== c03 · Station 1 (B1) =========================================================================================================
shot('3.01', 'EXPL', ('s02', None), [('s02', 'reads'), ('s02', 'letter by letter'), ('s02', 'text')],
     'Aus `plateCell`: neun Zeilen A C G T füllen die Nacht, die mittlere hell, ein kühler Lese-Cursor (Ring der Maschine, klein) bei x 960; die Zeilen laufen links (lesen). Auf **text** zieht die Kamera leicht zurück: es ist eine Seite.',
     '① Zeilen laufen ② Rückzug', 'Plansequenz')
shot('3.02', 'EXPL', ('s02', 'It picks'), [('s02', 'marks'), ('s02', 'only this one'), ('s02', 'carries')],
     'Der Cursor hält an Stellen: hinter einzelnen Buchstaben glimmen Goldmarken auf (versetzt, 80 ms). Die markierten Buchstaben heben sich aus der Seite und reihen sich zu einer Liste: `UP TO 34 MARKS` · `ONLY IN THIS CANCER` · `MODERNA 10-K · 2025`.',
     '① Marken glimmen ② Liste reiht sich', 'Verwandlung · Träger Goldmarken → Körner · Mitte · nach unten')
shot('3.03', 'SZENE>EXPL', ('s02', 'From that list'), [('s02', 'vaccine'), ('s02', 'one person'), ('s02', 'Nobody')],
     'Die Marken fallen als Goldkörner in **eine** Phiole (dieselbe wie im Hook), sie füllt sich. **Nobody else:** sie steht allein in ihrem Kegel, die Nacht ringsum leer.',
     '① Körner fallen ② Phiole füllt sich', 'Rückzug · Träger Phiole → dein Licht · Mitte · nach hinten')
shot('3.04', 'SZENE', ('s02', 'Medicine that'), [('s02', 'reads you'), ('s02', 'average')],
     'Rückzug: die Phiole steht in **deinem** Lichtkegel, du (gelb) daneben. Dahinter, im Dunkeln, eine Reihe gleicher kühler Umriss-Silhouetten (der Durchschnitt); auf **average** bleiben sie kühl, nur dein Kegel ist warm.',
     '① Rückzug ② die Reihe erscheint aus dem Dunkel (Licht streift sie)', 'Verwandlung · Träger Etikett der Phiole → versiegelter Umschlag · Mitte · –')
shot('3.05', 'EXPL', ('s02', 'Is that'), [('s02', 'artificial'), ('s02', 'machine learning'), ('s02', 'secret'), ('s02', 'check')],
     'Das Etikett faltet sich zu einem versiegelten Umschlag (`paperLabel` `ALGORITHM`, Siegel aus Gold). Auf **machine learning** steigt `“MACHINE LEARNING” · MODERNA`; auf **check** kreist der kühle Ring außen um den Umschlag und findet keinen Weg hinein.',
     '① Faltung ② Ring kreist', 'Plansequenz')
shot('3.06', 'EXPL', ('s02', 'And the vaccine'), [('s02', 'approved'), ('s02', 'longer'), ('s02', 'known')],
     'Neben dem Umschlag ein leeres Stempelfeld (gestrichelt) `APPROVED`. Die Gold-Kurve aus dem Hook läuft weiter und wird nach 2 Jahren gestrichelt: `OVERALL SURVIVAL · DATA IMMATURE` · `ESMO 2026`.',
     '① Kurve wird gestrichelt', 'Verwandlung · Träger Gold-Kurve zerfällt in Lichtpunkte · rechts · nach unten')
shot('3.07', 'EXPL', ('s02', 'But it isn'), [('s02', 'lucky'), ('s02', 'thousand')],
     'Die Kurve zerfällt in ein ruhiges Feld kleiner Lichtpunkte (Patienten), das von links nach rechts aufgeht: `1,137` · `PATIENTS IN THE TRIAL` · `INTERPATH-001 · ESMO 2026`.',
     '① Feld geht auf', 'Plansequenz')
shot('3.08', 'SZENE>EXPL', ('s02', 'If a computer'), [('s02', 'read'), ('s02', 'list')],
     'Das Feld zieht sich in die Phiole zurück; das Papier-Etikett löst sich, flattert nach oben rechts und wird auf **list** der erste Papierstreifen auf der Schachtel (c04).',
     '① Etikett fliegt', 'Fahrt · Träger Papierstreifen → Schachtel (Draufsicht) · oben rechts · nach oben')

# ===== c04 · Station 2 · Anker 2 (B1) ===============================================================================================
shot('4.01', 'EXPL', ('s03', None), [('s03', 'box'), ('s03', 'Ten'), ('s03', 'each year')],
     '**Anker 2.** Die Schachtel in Draufsicht, groß, das Band gefaltet darin. Auf **Ten** schreibt sich in jedes Fach eine Jahreszahl `1` … `10` (Tinte, versetzt 60 ms, Leserichtung).',
     '① Ziffern ② Push', 'Plansequenz')
shot('4.02', 'SZENE>EXPL', ('s03', 'And this is'), [('s03', 'promise'), ('s03', 'inside')],
     'Der Deckel öffnet sich ganz; das gefaltete Band hebt sich aus den Fächern und gibt sie frei.',
     '① Deckel ② Band hebt sich', 'Plansequenz')
shot('4.03', 'EXPL', ('s03', 'Prevent or cure'), [('s03', 'infectious'), ('s03', 'cancers'), ('s03', "Alzheimer's"), ('s03', 'mental'), ('s03', 'double'), ('s03', 'poorer')],
     'Je Satz landet ein Papierstreifen (`paperLabel`) vor einem Fach und schreibt sich: `INFECTIONS` · `CANCER` · `ALZHEIMER’S` · `MENTAL ILLNESS` · `LIFESPAN ×2` · `POORER COUNTRIES`. Vier Fächer bleiben leer. Kein Licht in den Fächern (es ist ein Versprechen).',
     '① ein Streifen nach dem anderen', 'Verwandlung · Träger Schachtel → Zifferblatt darüber · Mitte · nach oben')
shot('4.04', 'EXPL', ('s03', 'The clock'), [('s03', 'clock'), ('s03', 'written'), ('s03', 'good enough')],
     'Über der Schachtel ein Zifferblatt aus Licht (Stoppuhr), Zeiger auf 0. Auf **written** steht er still neben dem Streifen `ESSAY · 2024`; auf **good enough** zittert er, startet aber nicht.',
     '① Zeiger zittert', 'Plansequenz')
shot('4.05', 'EXPL', ('s03', 'He calls'), [('s03', 'powerful'), ('s03', 'earliest'), ('s03', 'twenty-six')],
     'Der Ring der Maschine bildet sich hinter der Uhr: `POWERFUL ARTIFICIAL INTELLIGENCE`; auf **twenty-six** `EARLIEST: ~2026` · `DARIO AMODEI · 2024`.',
     '① Ring bildet sich', 'Verwandlung · Träger Zifferblatt kippt flach → Startlinie am Boden · Mitte · nach unten')
shot('4.06', 'SZENE', ('s03', 'So you'), [('s03', 'finish'), ('s03', 'start')],
     'Das Zifferblatt kippt und wird eine Startlinie aus Licht am Boden. Du stehst darauf; vor dir verliert sich eine lange Bahn im Dunkeln (das Jahrhundert), keine Ziellinie in Sicht.',
     '① Kran zurück ② du schaust', 'Plansequenz')
shot('4.07', 'SZENE', ('s03', 'And at the start'), [('s03', 'pharmacy'), ('s03', 'lab')],
     'An der Bahn zwei Häuser: eine Apotheke (Kreuz dunkel) bleibt dunkel; auf **lab** geht ein Laborfenster warm an. Push ins Fenster.',
     '① Fenster geht an ② Push', 'Flug · Träger Laborlampe · rechts · nach vorn')

# ===== c05 · Station 3 (B1) =========================================================================================================
shot('5.01', 'EXPL', ('s04', None), [('s04', 'AlphaFold'), ('s04', 'shape'), ('s04', 'machines')],
     'Unter der Laborlampe: eine Perlenkette aus Licht (Aminosäuren) faltet sich auf **shape** zu einem Protein-Band (flach, Editorial). `ALPHAFOLD` als kleines Label.',
     '① Kette faltet sich', 'Plansequenz')
shot('5.02', 'EXPL', ('s04', 'Its makers'), [('s04', 'Nobel')],
     'Das gefaltete Protein wirft einen runden Schatten aus Licht, der zur Medaille wird: `NOBEL PRIZE IN CHEMISTRY` · `2024`.',
     '① Medaille prägt sich', 'Verwandlung · Träger Medaille → Erdscheibe → Weltkarte · Mitte · –')
shot('5.03', 'EXPL', ('s04', 'But the real news'), [('s04', 'uses'), ('s04', 'million'), ('s04', 'free')],
     'Die Medaille dreht sich zur Erdscheibe und entrollt sich zur Weltkarte aus Lichtpunkten. Punkte gehen in Ländern mit niedrigem und mittlerem Einkommen auf: `>1 MILLION` · `USERS IN LOW- AND MIDDLE-INCOME COUNTRIES` · `GOOGLE DEEPMIND`. Auf **free** kein Preisschild.',
     '① Punkte gehen auf', 'Plansequenz')
shot('5.04', 'EXPL', ('s04', 'A breakthrough'), [('s04', 'trickle'), ('s04', 'everywhere')],
     'Erst ein dünner Lichtfaden, der von oben auf einen Punkt tropft (trickle) und abreißt; auf **everywhere** regnet das Licht überall zugleich auf die Karte.',
     '① Tropfen ② Regen', 'Verwandlung · Träger Lichter sammeln sich → Kapsel · Mitte · –')
shot('5.05', 'EXPL', ('s04', 'But a tool'), [('s04', 'cure'), ('s04', 'splits')],
     'Die Lichter der Karte ziehen sich zu einer Kapsel aus Licht zusammen; auf **splits** teilt sie sich in zwei Hälften (links warm, rechts kühl) → optional `platePill`.',
     '① Sammeln ② Teilen', 'Verwandlung · Träger Kapsel (`platePill`, intern) · Mitte · –')

# ===== c06 · Station 4a (B1) ========================================================================================================
shot('6.01', 'SZENE>EXPL', ('s05', None), [('s05', 'Follow'), ('s05', 'pharmacy'), ('s05', 'people')],
     'Die Hälften schließen sich, die Kapsel rollt los auf einem Weg aus Licht; weit hinten ein kleines Apothekenfenster. Auf dem Weg zwei Tore (Ringe aus Licht).',
     '① Kapsel rollt ② Fahrt mit', 'Plansequenz')
shot('6.02', 'EXPL', ('s05', 'The first asks'), [('s05', 'safe'), ('s05', 'help')],
     'Tor 1 bekommt sein Wort `SAFE?`, Tor 2 `DOES IT HELP?` (steigen von ihrer Grundlinie).',
     '① Wörter steigen', 'Plansequenz')
shot('6.03', 'EXPL', ('s05', 'Drugs found'), [('s05', 'first test'), ('s05', 'nine'), ('s05', 'half')],
     'Zwei Ströme zu je zehn Kapseln vor Tor 1: oben gold (gefunden mit KI), unten kühl (üblich). Oben gehen 9 durch, unten 5: `9 IN 10` · `PASS THE FIRST TEST` · `JAYATUNGA ET AL. · DRUG DISCOVERY TODAY 2024`.',
     '① Ströme ziehen', 'Fahrt · Träger die Kapseln → Tor 2 · Mitte · nach rechts')
shot('6.04', 'EXPL', ('s05', 'And the second'), [('s05', 'second test'), ('s05', 'no better'), ('s05', 'small')],
     'An Tor 2 kommen aus beiden Strömen gleich wenige durch: `NO BETTER IN TEST 2` · `SMALL SAMPLE · SAME SOURCE`.',
     '① Ströme', 'Plansequenz')
shot('6.05', 'EXPL', ('s05', 'But it shows'), [('s05', 'limit')],
     'Rückzug: hinter Tor 2 ist der Weg lang und dunkel, die Apotheke weit. Hier sitzt die Grenze.',
     '① Rückzug', 'Plansequenz')
shot('6.06', 'EXPL', ('s05', 'A computer can'), [('s05', 'faster'), ('s05', 'body'), ('s05', 'years')],
     'Links der kühle Ring der Maschine, schnell kreisend; rechts eine einzige Zelle aus Licht, die sich in Echtzeit teilt (sehr langsam). Auf **years** Push auf die Zelle → `plateDivide`.',
     '① Ring kreist ② Push auf die Zelle', '**Naht B1 → B2** · Push · Träger `plateDivide` (eine Zelle, die sich teilt) · Mitte')

# ===== c07 · Station 4b (B2) ========================================================================================================
shot('7.01', 'EXPL', ('s06', None), [('s06', 'June'), ('s06', 'researcher')],
     'Aus `plateDivide`: die Zelle teilt sich fertig, die zwei Tochterzellen treiben auseinander und werden die zwei goldenen Anführungszeichen einer Zitatkarte. `JUNE 2026 · AI FOR SCIENCE EVENT`.',
     '① Teilung ② Zeichen gleiten', 'Plansequenz')
shot('7.02', 'EXPL', ('s06', 'I think'), [('s06', 'compression'), ('s06', 'data')],
     'Zitat Zeile für Zeile (wortgenau): „I think we really will see a large compression. But we still need the clinical trial data.“ · `GLP-1 RESEARCHER · ANTHROPIC EVENT · JUNE 2026` (Name erst nach Gegenhören, `faktencheck.md` #17).',
     '① Zeilen steigen', 'Plansequenz')
shot('7.03', 'EXPL', ('s06', 'And then'), [('s06', 'below'), ('s06', 'five years')],
     'Das Zitat sinkt; fünf Jahresblätter aus Licht stehen nebeneinander. Eine Hand aus Licht drückt sie zusammen, sie geben nach, bleiben aber fünf: `BELOW 5 YEARS?` (nur „5“ als Zahl).',
     '① Blätter werden gedrückt', 'Verwandlung · Träger Blätter → Kalenderleiste · Mitte · –')
shot('7.04', 'EXPL', ('s06', 'Even the boldest'), [('s06', 'dates'), ('s06', 'twenty-five'), ('s06', 'moved'), ('s06', 'twenty-six')],
     'Eine Kalenderleiste; ein Klebezettel `FIRST TESTS IN PEOPLE: END 2025`. Auf **moved** löst er sich und klebt eine Jahreslänge weiter: `END 2026` · `REUTERS · JAN 2026`.',
     '① Zettel wandert', 'Plansequenz')
shot('7.05', 'SZENE>EXPL', ('s06', 'That isn'), [('s06', 'failure'), ('s06', 'biology'), ('s06', 'pace')],
     'Neben dem Zettel teilt sich wieder eine Zelle, ruhig, im Takt: jede Teilung ein Schlag. Der Zettel wackelt mit (Biologie gibt das Tempo).',
     '① Zelle teilt sich im Takt', 'Rückzug · Träger die Zellen → warme Punkte einer weiten Nacht · Mitte · nach hinten')
shot('7.06', 'SZENE', ('s07', None), [('s07', 'all of us'), ('s07', 'subscribe')],
     '**Mitte-Abo.** Rückzug: die Zellen werden zu warmen Lichtern einer weiten nächtlichen Ebene (viele Orte, „all of us“). **Frei:** unten rechts x 1280–1840, y 760–980 (Abo-Einblendung). Ruhige Drift.',
     '① Rückzug ② Lichter atmen', 'Verwandlung · Träger ein Licht → Startpunkt der Lebenslinie · Mitte links · nach rechts')

# ===== c08 · Station 5 (B2) =========================================================================================================
shot('8.01', 'EXPL', ('s08', None), [('s08', 'too big'), ('s08', 'one part')],
     'Aus einem Licht zieht eine Goldlinie nach rechts: eine Lebenslinie, `~75 YEARS` (Ende des 20. Jh.) · `ESSAY · 2024` (Trend, auf den Amodei sich stützt).',
     '① Linie zieht', 'Plansequenz')
shot('8.02', 'EXPL', ('s08', 'Doubling'), [('s08', 'Doubling'), ('s08', 'None'), ('s08', 'bet')],
     'Auf **Doubling** läuft die Linie gleich lang weiter, aber nur gestrichelt. Auf **None**: `CLINICAL EVIDENCE: NONE`. Auf **bet** wird das Label `A BET, NOT A FORECAST`.',
     '① Strich läuft gestrichelt', 'Verwandlung · Träger gestrichelte Linie → Karte in deiner Hand · Mitte · nach unten')
shot('8.03', 'SZENE', ('s08', 'If you'), [('s08', 'skeptical'), ('s08', 'card'), ('s08', 'fair')],
     'Die gestrichelte Linie faltet sich zu einer Karte aus Licht und gleitet in deine Hand (du in Gelb, nah). Du hältst sie ruhig: deine stärkste Karte.',
     '① Karte gleitet ② deine Hand', 'Rückzug · Träger Karte → Horizont · unten · nach hinten')
shot('8.04', 'SZENE', ('s08', 'But judging'), [('s08', 'ten-year'), ('s08', 'morning')],
     'Rückzug in eine weite Landschaft vor Tagesanbruch: auf **morning** ein dünner erster Lichtstreifen am Horizont, sonst noch Nacht.',
     '① Rückzug ② Morgenstreifen', 'Plansequenz')
shot('8.05', 'SZENE>EXPL', ('s08', 'But if it does'), [('s08', 'start'), ('s08', 'notice')],
     'Push auf den Morgenstreifen, bis er eine einzelne Linie ist: ein Strich in einem Notizbuch (die Strichliste, c09).',
     '① Push', 'Match-Fahrt · Träger Horizontstrich → Zählstrich · Mitte · –')

# ===== c09 · Station 6 · Anker 3, Wende (B2) =======================================================================================
shot('9.01', 'EXPL', ('s09', None), [('s09', 'eighty-six'), ('s09', 'Guinea'), ('s09', 'million')],
     'Der Strich ist einer von unzähligen: eine Wand aus Strichlisten füllt das Bild (Kreide auf Nacht). `3.5 MILLION` · `CASES A YEAR · 1986` · `THE CARTER CENTER`.',
     '① Striche wachsen ② Rückzug', 'Plansequenz')
shot('9.02', 'EXPL', ('s09', 'In twenty twenty-five'), [('s09', 'twenty-five'), ('s09', 'Ten'), ('s09', 'planet')],
     'Die Striche fallen als Kreidestaub zu Boden, Reihe für Reihe, bis zehn bleiben: `10` · `CASES · 2025`. Rückzug: die zehn Striche auf einer Erdscheibe.',
     '① Staub fällt ② Rückzug', 'Fahrt · Träger Kreidestaub → Wasser im Krug · Mitte · nach unten')
shot('9.03', 'SZENE', ('s09', 'No drug'), [('s09', 'drug'), ('s09', 'filters'), ('s09', 'Teaching'), ('s09', 'counted'), ('s09', 'year after year')],
     'Ein Dorf bei Nacht, ein Brunnen. Ein Tuch-Filter über einem Krug (Wasser läuft hindurch); eine Hand mit Kreide an einer Tafel; eine Person zählt in ein Notizbuch, Strich für Strich, eine Lampe daneben.',
     '① Wasser läuft ② ein Strich nach dem anderen', 'Plansequenz')
shot('9.04', 'EXPL', ('s09', 'It could become'), [('s09', 'second'), ('s09', 'smallpox'), ('s09', 'over'), ('s09', 'Dogs')],
     'Im Notizbuch eine Liste: `SMALLPOX` (durchgestrichen) · `GUINEA WORM` (Strich bis zur Hälfte). Auf **Dogs** läuft am Brunnen ein Hund (Silhouette) durchs Bild.',
     '① Strich ② Hund', 'Plansequenz')
shot('9.05', 'SZENE', ('s09', 'Progress like'), [('s09', 'headline'), ('s09', 'empty bed')],
     '★ **Anker 3 (Wende).** Ein stilles Krankenzimmer: ein leeres Bett unter einem Fenster. Rückzug durchs Fenster: das Fenster ist ein Fach der Schachtel (Draufsicht, aus dem Hook), und `INFECTIONS` glimmt auf, **weil etwas aufgehört hat**.',
     '① Rückzug ② das Fach glimmt', 'Flug · Träger das leuchtende Fach → Tablettenpackung darin · links oben · nach vorn', star=True)

# ===== c10 · Station 7a (B2) ========================================================================================================
shot('10.01', 'SZENE>EXPL', ('s10', None), [('s10', 'machine'), ('s10', 'already have')],
     'Push ins leuchtende Fach: darin liegt eine Tablettenpackung aus Licht (voll).',
     '① Push', 'Plansequenz')
shot('10.02', 'EXPL', ('s10', 'Hepatitis'), [('s10', 'Hepatitis'), ('s10', 'curable'), ('s10', 'pills')],
     'Die Packung, nah: `HEPATITIS C` · `CURABLE SINCE 2015` · `WHO · 2026`. Auf **pills** drückt sich eine Tablette aus dem Blister.',
     '① Tablette', 'Verwandlung · Träger Tablette → eine von fünf Figuren · Mitte · nach rechts')
shot('10.03', 'EXPL', ('s10', 'And yet'), [('s10', 'one in five'), ('s10', 'waiting')],
     'Fünf schlichte Figuren (Indigo, kein Gelb) in einer Reihe; die Tablette erreicht eine, sie wird warm: `1 IN 5` · `TREATED SINCE 2015` · `WHO GLOBAL HEPATITIS REPORT 2026`. Vier warten im Dunkeln.',
     '① Tablette rollt ② eine Figur wird warm', 'Plansequenz')
shot('10.04', 'EXPL>SZENE', ('s10', "What's missing"), [('s10', 'intelligence'), ('s10', 'reach')],
     'Rückzug: zwischen Packung und den vier Wartenden liegt Dunkel. Auf **reach** schiebt sich aus der Packung eine Straße aus Licht zu ihnen hinaus → optional `plateReach`.',
     '① Straße schiebt sich', 'Fahrt · Träger Straße aus Licht (`plateReach`, intern) · links unten → Horizont')

# ===== c11 · Station 7b (B2) ========================================================================================================
shot('11.01', 'EXPL', ('s11', None), [('s11', 'Find'), ('s11', 'Bring'), ('s11', 'keep going')],
     'Die Straße aus Licht in der Ebene; drei Stationen daran leuchten auf ihr Wort: `FIND` · `BRING` · `KEEP GOING` (ein Wort je Station).',
     '① Fahrt die Straße entlang', 'Plansequenz')
shot('11.02', 'EXPL', ('s11', "That's a decision"), [('s11', 'ministries'), ('s11', 'budgets'), ('s11', 'lab')],
     'Am Straßenrand öffnet sich ein Haushaltsbuch aus Licht; eine Zeile glüht: `HEALTH BUDGET`. Das ferne Laborfenster bleibt klein.',
     '① Buch öffnet sich', 'Verwandlung · Träger Buchzeile → Zeitleiste · Mitte · nach rechts')
shot('11.03', 'EXPL', ('s11', 'So the slowest'), [('s11', 'slowest'), ('s11', 'science'), ('s11', 'us'), ('s11', 'finish')],
     'Die Zeile wird eine Zeitleiste: ein kurzes helles Stück `SCIENCE`, dann ein langes, noch dunkles Stück `US: DECIDING`. Auf **finish** beginnt es sich zu füllen.',
     '① Leiste füllt sich', 'Verwandlung · Träger Leiste → Brücke aus Papier · Mitte · –')
shot('11.04', 'SZENE', ('s11', 'And reach is'), [('s11', 'build')],
     'Die Leiste wird eine Brücke aus Papierstreifen über eine Lücke; kleine Silhouetten legen Streifen nach.',
     '① Brücke wächst', 'Fahrt · über die Brücke · Träger Spritze aus Licht · rechts')
shot('11.05', 'SZENE>EXPL', ('s11', 'A shot that'), [('s11', 'HIV'), ('s11', 'twice'), ('s11', 'Zambia'), ('s11', 'Kenya'), ('s11', 'Nigeria'), ('s11', 'South Africa')],
     'Eine Klinik in Sambia bei Abend (Szene): eine Pflegerin (Silhouette) hält die Spritze aus Licht (`F.syringe`): `TWICE A YEAR` · `LENACAPAVIR · CHAI 2026`. Rückzug zur Karte Afrikas: Sambia, Kenia, Nigeria, Südafrika leuchten auf ihr Wort.',
     '① Rückzug ② Länder leuchten', 'Plansequenz')
shot('11.06', 'EXPL', ('s11', 'It isn'), [('s11', 'artificial'), ('s11', 'poorest last')],
     'Eine Schlange aus Lichtpunkten (Länder); die Spritze landet vorn, nicht hinten: `NOT LAST`.',
     '① Spritze landet', 'Fahrt · Träger Spritze fliegt · Mitte · nach rechts')
shot('11.07', 'SZENE>EXPL', ('s11', 'How does'), [('s11', 'travel'), ('s11', 'fast')],
     'Die Spritze fliegt quer durch die Nacht, eine feine Goldspur hinter sich; sie kommt in der Bildmitte zur Ruhe → `plateShot`.',
     '① Flug ② Spur', '**Naht B2 → B3** · Träger `plateShot` (die Spritze, unterwegs) · Mitte')

# ===== c12 · Station 7c (B3) ========================================================================================================
shot('12.01', 'EXPL', ('s12', None), [('s12', 'twenty-seven'), ('s12', 'copies'), ('s12', 'forty')],
     'Aus `plateShot`: die Spritze klont sich zu einer Reihe Kopien (versetzt 60 ms). Von ihrer Grundlinie steigt `$40` · `PER PERSON, PER YEAR` · `FROM 2027 · REUTERS 2025` (Quelle trägt das Jahr, nicht das Label).',
     '① Klonen ② Zahl steigt', 'Plansequenz')
shot('12.02', 'EXPL', ('s12', 'The maker'), [('s12', 'licensed'), ('s12', 'producers'), ('s12', 'locked')],
     'Ein Lizenzblatt (`paperLabel` `LICENSE`) wandert von einer Hand zu sechs kleinen Fabrikfenstern, die angehen. Auf **locked** schließt sich eine Klammer aus Licht um das Preisschild.',
     '① Blatt wandert ② Klammer', 'Verwandlung · Träger Preisschild → Zeitleiste · Mitte · nach links')
shot('12.03', 'EXPL', ('s12', 'It isn'), [('s12', 'perfect'), ('s12', 'year after'), ('s12', 'agreed')],
     'Ehrliche Zeitleiste: `FIRST SHOTS` (Dez. 2025) … kühle Lücke … `CHEAP COPIES` (2027): `MORE THAN A YEAR`. Auf **agreed** glüht eine einzelne Unterschrift: `THE MAKER AGREED`.',
     '① Lücke ② Unterschrift', 'Verwandlung · Träger Unterschrift → Vertrag am Tor · Mitte · –')
shot('12.04', 'EXPL', ('s12', 'The same deal'), [('s12', 'deal'), ('s12', 'license'), ('s12', 'before approval'), ('s12', 'after')],
     'Der Test-Weg aus c06 kehrt klein zurück; am letzten Tor (Zulassung) wird ein Vertrag aus Licht mit zwei Zeilen festgesteckt: `LICENSE` · `PRICE`, **vor** dem Tor.',
     '① Vertrag', 'Plansequenz')
shot('12.05', 'SZENE>EXPL', ('s12', 'Drug makers'), [('s12', 'governments'), ('s12', 'funders'), ('s12', 'sign'), ('s12', 'lose'), ('s12', 'early')],
     'Drei Hände (Silhouetten, kein Gelb) unterschreiben nacheinander (Hersteller, Regierung, Geldgeber). Auf **lose** liegt nichts auf der Verliererseite.',
     '① drei Unterschriften', 'Verwandlung · Träger Vertrag → Medikament aus Licht · Mitte · –')
shot('12.06', 'SZENE>EXPL', ('s12', 'Picture the first'), [('s12', 'Picture'), ('s12', 'back of the line'), ('s12', 'everyone')],
     '★ Das erste zugelassene Medikament aus Licht in der Mitte. Eine lange Schlange kleiner Lichter (Länder) steht dahinter; auf **back of the line** biegt sie sich zu einem Kreis um das Medikament, niemand ist hinten.',
     '① Schlange wird Kreis', 'Verwandlung · Träger Kreis → dein Lichtkegel · Mitte · –', star=True)

# ===== c13 · Station 7d (B3) ========================================================================================================
shot('13.01', 'SZENE', ('s13', None), [('s13', 'you'), ('s13', 'closer'), ('s13', 'lab coat')],
     'Der Kreis schrumpft zu deinem Lichtkegel: du (gelb) in einer Straße bei Nacht. Neben dir hängt ein Laborkittel am Haken; du gehst daran vorbei.',
     '① du gehst ② Fahrt mit', 'Plansequenz')
shot('13.02', 'EXPL', ('s13', 'Hepatitis C shows'), [('s13', 'finds you'), ('s13', 'test'), ('s13', 'book')],
     'Die fünf Figuren aus c10 kehren zurück; ein Lichtstrahl findet eine. Auf **book** schreibt sich ein Terminzettel: `TEST · BOOKED`.',
     '① Strahl ② Zettel', 'Verwandlung · Träger Zettel → Stuhlreihe · Mitte · nach rechts')
shot('13.03', 'EXPL', ('s13', 'If you'), [('s13', 'trial'), ('s13', 'slowest'), ('s13', 'too few'), ('s13', 'volunteer'), ('s13', 'faster')],
     'Eine Reihe leerer Stühle (Studie); auf **volunteer** füllen sie sich mit kleinen Lichtern, einer nach dem anderen; der kleine Test-Weg daneben läuft schneller.',
     '① Stühle füllen sich', 'Verwandlung · Träger ein Licht → Münze · Mitte · nach unten')
shot('13.04', 'EXPL', ('s13', 'And when public'), [('s13', 'public money'), ('s13', 'fair price'), ('s13', 'HIV')],
     'Eine Münze (öffentliches Geld) fällt ins Laborfenster; der Vertrag bekommt eine Zeile `FAIR PRICE`; auf **HIV** klickt die Klammer aus c12 daneben.',
     '① Münze ② Zeile', 'Plansequenz')
shot('13.05', 'SZENE>EXPL', ('s13', 'It isn'), [('s13', 'one line'), ('s13', 'vote')],
     'Nur die eine Zeile glüht. Sie faltet sich zu einem Brief; du steckst ihn in einen beleuchteten Briefkasten `YOUR REPRESENTATIVE`.',
     '① Zeile → Brief ② deine Hand', 'Rückzug · Träger Briefkastenlicht → Fach der Schachtel · Mitte · nach hinten')

# ===== c14 · Schluss · Anker 4 + Endscreen (B3) ====================================================================================
shot('14.01', 'EXPL', ('s14', None), [('s14', 'starting'), ('s14', 'tools'), ('s14', 'halfway'), ('s14', 'not yet')],
     '**Anker 4.** Die Schachtel (Draufsicht) kehrt zurück. Fach für Fach: `TOOLS` hell · `MEDICINES` halb · `LONGER LIFE` dunkel mit gestricheltem Rand (neue Streifen über den alten).',
     '① Fächer leuchten nacheinander', 'Plansequenz')
shot('14.02', 'EXPL', ('s14', 'And some cures'), [('s14', 'already'), ('s14', 'reached')],
     'Ein Fach `HEPATITIS C` ist voll Licht, aber der Deckel liegt fast zu: Licht nur im Spalt.',
     '① Deckel', 'Rückzug · Träger Schachtel → in deinen Händen · Mitte · nach hinten')
shot('14.03', 'SZENE', ('s14', 'The machines'), [('s14', 'bring'), ('s14', 'Carrying'), ('s14', 'our part')],
     '★ Rückzug: du hältst die Schachtel (Echo des Thumbnails), das Band ist darin gefaltet. Auf **Carrying** gehst du los, über die Kante hinunter auf eine Ebene mit fernen Fenstern.',
     '① du gehst ② Rückzug', 'Plansequenz', star=True)
shot('14.04', 'SZENE', ('s15', None), [('s15', 'compartment'), ('s15', 'first')],
     'Nah über der Schachtel in deinen Armen: die Fächer warten, eines flackert kurz (die Frage an dich).',
     '① Fahrt mit dir', 'Plansequenz')
shot('14.05', 'SZENE', ('s15', 'If you want'), [('s15', 'carry'), ('s15', 'last'), ('s15', 'subscribe')],
     'Weit: du gehst auf das fernste Fenster zu (die zuletzt Erreichten). **Frei:** oben rechts für die Abo-Einblendung.',
     '① du gehst', 'Plansequenz')
shot('14.06', 'SZENE>EXPL', ('s15', 'We won'), [('s15', 'arrive'), ('s15', 'stopped')],
     'Am Horizont die Strichliste aus c09, klein: auf **stopped** sinkt ihr letzter Strich, ein Fach in deinen Händen glimmt auf.',
     '① Strich sinkt ② Fach glimmt', 'Rückzug in den Endscreen')
shot('14.07', 'SZENE', ('end', None), [],
     '**Endscreen (VO-Ende bis Schluss, ≤ 17 s, ohne Stimme).** Die Schachtel steht auf der Kante, das Band liegt gefaltet darin, ein Fach glimmt; du sitzt daneben, winzig, unten Mitte. **Frei:** links x 90–780, y 250–700 („best for viewer“), rechts x 1140–1830, y 250–700 („latest upload“), Mitte oben x 810–1110, y 120–330 (Abo-Knopf). Nie statisch: langsamer Rückzug, Sterne ziehen, das Fach atmet, erstes Licht am Horizont.',
     '① Rückzug ② Fach atmet', '–')

# ---------------------------------------------------------------------------------------------------------------------------------
def start_of(sh):
    seg, ph = sh['start']
    if seg == 'end': return VO_END
    if sh['id'] == '1.01': return 0.0
    return TM['sections'][seg]['start'] if ph is None else find(seg, ph)

# one ★ per chunk (the builder's first still goes to the lead before the rest of the chunk is built)
STARS = {'3.03', '4.03', '5.03', '6.06', '7.01', '8.04', '10.03', '11.05', '13.05'}
for sh in S: sh['star'] = sh['star'] or sh['id'] in STARS
# layers tuned to ≈ 2/3 explainer: these are scenes that carry a graphic
for sh in S:
    if sh['id'] in ('5.01', '11.01', '13.03', '13.02'): sh['layer'] = 'SZENE>EXPL'
for sh in S: sh['a'] = start_of(sh)
for i, sh in enumerate(S): sh['b'] = S[i + 1]['a'] if i + 1 < len(S) else TM['duration']
assert all(S[i]['a'] < S[i]['b'] for i in range(len(S))), [(s['id'], s['a'], s['b']) for s in S if s['a'] >= s['b']]
ch_a = [0.0 if c[0] == 'c01' else TM['sections'][c[2]]['start'] for c in CHUNKS]
chunks = [dict(id=c[0], title=c[1], owner=c[3], light=c[4], a=ch_a[i], b=ch_a[i + 1] if i + 1 < len(ch_a) else TM['duration']) for i, c in enumerate(CHUNKS)]
for c in chunks: c['shots'] = [s for s in S if int(s['id'].split('.')[0]) == int(c['id'][1:])]
for c in chunks: assert c['shots'] and (abs(c['shots'][0]['a'] - c['a']) < 1e-6 or c['id'] == 'c01'), c['id']
for s in S:
    for sg, ph in s['anchors']: find(sg, ph)

w = lambda s: 1.0 if s['layer'] == 'EXPL' else .5 if '>' in s['layer'] else 0.0
def share(shots, a=None, b=None):
    tot = ex = 0
    for s in shots:
        x0, x1 = max(s['a'], a if a is not None else s['a']), min(s['b'], b if b is not None else s['b'])
        if x1 > x0: tot += x1 - x0; ex += (x1 - x0) * w(s)
    return ex / tot if tot else 0
fmt = lambda x: f'{x:.2f}'.replace('.', ',')
GROUPS = [('Lead', 'c01–c02'), ('B1', 'c03–c06'), ('B2', 'c07–c11'), ('B3', 'c12–c14 + Endscreen')]

HEAD = """# Film 15 · „Superintelligence Promised 100 Years of Progress in 10. Is It Starting?“ · Shotliste v1 (bindend für die Builder)

Stand 2026-10-28 (Lead Bild). Text `film-jahrhundert/vo-v3.txt`, Timing `film-jahrhundert/audio/timing.json` (Abschnitte `s00` … `s15`); nach dem VO-Ende (508,14 s) folgt ein Endscreen bis 524,94 s, der sich weiter bewegt. Alle Zeiten unten sind aus `timing.json` berechnet; im Code wird nur über Wörter geankert. Welt, Look, Kit und Budgets: `MOTION.md` (zuerst lesen). Aufteilung und Regeln für die Builder: `BRIEF-builders.md`.
**Quelle dieser Datei:** `tools/shots15.py`. Änderungen an Shots dort machen und mit `python3 tools/shots15.py --md docs/shots.md` neu schreiben; diese Datei nie von Hand ändern.

## §1 Lesehilfe
- **ID** = Chunk.Nummer. **Zeit** = von–bis in Filmsekunden; ein Shot beginnt mit seinem ersten VO-Wort und läuft bis zum nächsten; Pausen gehören dem Shot davor (die Bewegung läuft weiter).
- **Ebene:** `[SZENE]` = Welt (Ort, Figur, eine Lichtform); `[EXPL]` = Explainer (Zahl, Kurve, Karte, Zeitleiste aus Licht auf Nachtblau); `[SZENE→EXPL]` / `[EXPL→SZENE]` = der Shot enthält die Verwandlung (zählt halb). Ziel (Jakob): **etwa 2/3 Explainer, 1/3 Szene.**
- **Anker** = Akzentwort `@` Sekunde. Im Code immer über das Wort ankern (`T.S('s09', 'Ten')`), nie über die Sekunde. Achtung: `T.S` nimmt den ersten Treffer und vergleicht das letzte Wort mit `startsWith` („big“ trifft „biggest“). Bei Zweifeln die Phrase verlängern (`T.S('s00', "It's a big")`) oder `nth` setzen.
- **Bewegung** = höchstens 2 Hauptbewegungen, die Kamera zählt mit. Umgebungsleben (Atmen, Sterne, Staub, Korn, Drift) ist immer da und zählt nicht.
- **Übergang → Träger:** Art · `Träger A → B` · Bildposition · Richtung. Arten: **Plansequenz** (gleiche Einstellung, Neues wächst aus Vorhandenem), **Fahrt** (Kamera folgt dem Träger), **Verwandlung** (Form wird Form), **Flug** (in eine Fläche hinein), **Rückzug**, **Match-Fahrt** (gleiche Form an gleicher Bildstelle). **Jeder Übergang hat ein Objekt als Träger. Keine Blenden, kein Fade, kein Wischer, kein Slide, kein harter Schnitt ohne reimenden Träger.**
- **Schachtel und Band** (Box mit zehn Fächern, Papierband der hundert Jahre) erscheinen **nur an 4 Ankern**: Hook (1.01–1.07), Station 2 (4.01–4.03), Wende (9.05) und Schluss (14.01–14.07). Dazwischen hat jede Station ihre eigene Bildwelt.
- ★ = der eine Wow-Shot pro Chunk (erstes Standbild an den Lead, bevor der Rest des Chunks gebaut wird).
- Ruhe-Regeln (gelten für jeden Shot): Halten 1,5–3 s nach jedem Akzent · kein Stillstand > 2 s · max. 1–2 bewegte Hauptelemente · Zahlen und Zeilen stehen ≥ 1,5 s ruhig · ≤ ~1 harter Weltwechsel pro Minute (§3) · nichts wird halbtransparent eingeblendet.

## §2 Chunks und Shots
"""

TAIL = """
## §3 Welten und Weltwechsel (≤ ~1 harter Wechsel pro Minute)
Eine **Welt** ist ein Ort mit eigenem Licht. Explainer-Grafiken auf Nachtblau gehören zur Welt, aus der sie wachsen (kein Wechsel). **Hart** = neuer Ort, auch wenn ein Objekt ihn trägt; **weich** = Verwandlung im selben Licht.

| # | ab | Welt (Licht) | Wechsel | Träger |
|---|---|---|---|---|
| 1 | 0,00 | Felskante bei Nacht, Schachtel und Band (Anker 1) | – | – |
| 2 | 24,32 | im Fach 1: Raum mit Phiole und Nachbarfach | weich (Flug in ein Ding derselben Welt) | Fach 1 |
| 3 | 44,40 | Explainer-Raum: der Tumor als Text, Phiole, Umschlag, Patientenfeld | **hart** | die „0“ → `plateCell` |
| 4 | 85,16 | Schachtel in Draufsicht (Anker 2), Uhr, Startlinie, Bahn mit Apotheke und Labor | **hart** | Papier-Etikett der Phiole |
| 5 | ~127 | Labor: Protein, Medaille, Weltkarte, Kapsel | weich (Flug ins Laborfenster) | Laborlampe |
| 6 | 157,32 | der Weg durch die Tests (Tore aus Licht), Ring und Zelle | **hart** | Kapsel |
| 7 | 198,46 | Zitatkarte, Kalender, Zellen im Takt, weite Ebene (Mitte-Abo) | weich (Explainer-Nacht) | `plateDivide` |
| 8 | 244,20 | Lebenslinie, deine Karte, Landschaft vor Tagesanbruch | **hart** | ein Licht der Ebene → Linie |
| 9 | 271,60 | Strichliste, Dorf mit Brunnen, Krankenzimmer, das Fach glimmt (Anker 3) | **hart** | Horizontstrich → Zählstrich |
| 10 | 306,24 | Hepatitis C: Packung, fünf Figuren | weich (im Fach) | das leuchtende Fach |
| 11 | 331,00 | Straße aus Licht, Haushaltsbuch, Brücke, Klinik in Sambia, Karte | **hart** | Straße aus Licht |
| 12 | 380,30 | Spritzen-Kopien, Lizenz, Vertrag, Kreis der Länder | **hart** | `plateShot` |
| 13 | 433,36 | du in der Straße, Kittel, Stühle, Brief | **hart** | Kreis → dein Lichtkegel |
| 14 | 477,56 | Schachtel (Anker 4), du trägst sie in die Ebene, Endscreen | **hart** | Briefkastenlicht → Fach |

**Harte Wechsel: 9 auf 8,75 min ≈ 1,0 pro Minute.** Mehr nicht hinzufügen; wer einen Ort braucht, verwandelt im selben Licht.

## §4 Zahlen und Quellen im Bild (nur diese; Werte aus `faktencheck.md` / `vo-v3.txt`)
| Shot | Einblendung | Quelle im Bild | faktencheck |
|---|---|---|---|
| 1.04 | „the compressed 21st century“ | `DARIO AMODEI · “MACHINES OF LOVING GRACE” · 2024` | #1, #2 |
| 2.02 | `−42 %` RISK OF RELAPSE OR DEATH | `MODERNA & MERCK · ESMO 2026` | #4 |
| 2.04 | `0` APPROVED DRUGS FOUND BY ARTIFICIAL INTELLIGENCE | `AS OF OCT 2026 · INTUITIONLABS TRACKER` | #9 |
| 3.02 | `UP TO 34 MARKS` ONLY IN THIS CANCER | `MODERNA 10-K · 2025` | #5 |
| 3.05 | “MACHINE LEARNING” | `MODERNA` | #6 |
| 3.06 | OVERALL SURVIVAL · DATA IMMATURE | `ESMO 2026` | #7 (nicht „not yet analysed“) |
| 3.07 | `1,137` PATIENTS IN THE TRIAL | `INTERPATH-001 · ESMO 2026` | #8 |
| 4.05 | `EARLIEST: ~2026` | `DARIO AMODEI · 2024` | #11 |
| 5.02 | NOBEL PRIZE IN CHEMISTRY `2024` | – | #13 |
| 5.03 | `>1 MILLION` USERS IN LOW- AND MIDDLE-INCOME COUNTRIES | `GOOGLE DEEPMIND` | #14 |
| 6.03 | `9 IN 10` PASS THE FIRST TEST | `JAYATUNGA ET AL. · DRUG DISCOVERY TODAY 2024` | #15 |
| 6.04 | NO BETTER IN TEST 2 | wie 6.03, `SMALL SAMPLE` | #16 |
| 7.02 | Zitat wortgenau mit „I think“ | `GLP-1 RESEARCHER · ANTHROPIC EVENT · JUNE 2026` (Name nur nach Gegenhören) | #17 |
| 7.04 | END 2025 → `END 2026` | `REUTERS · JAN 2026` | #18 (Recheck vor Upload) |
| 8.01 | `~75 YEARS` | `ESSAY · 2024` | #19 |
| 8.02 | CLINICAL EVIDENCE: NONE · A BET, NOT A FORECAST | – | #19 |
| 9.01 | `3.5 MILLION` CASES A YEAR · 1986 | `THE CARTER CENTER` | #20 |
| 9.02 | `10` CASES · 2025 | `THE CARTER CENTER` | #21 (Menschen, vorläufig) |
| 10.02 | CURABLE SINCE `2015` | `WHO · 2026` | #24 |
| 10.03 | `1 IN 5` TREATED SINCE 2015 | `WHO GLOBAL HEPATITIS REPORT 2026` | #25 |
| 11.05 | TWICE A YEAR · Sambia, Kenia, Nigeria, Südafrika | `LENACAPAVIR · CHAI 2026` | #26 (Südafrika seit **Juni** 2026) |
| 12.01 | `$40` PER PERSON, PER YEAR | `FROM 2027 · REUTERS 2025` | #27 |
| 12.03 | MORE THAN A YEAR | – | #29 |

Im Bild immer „artificial intelligence“, nie „AI“. Eine Grafik = eine Aussage, höchstens eine Zahl und ≤ 6 Wörter plus Quelle.
"""

if __name__ == '__main__':
    print(f"{'chunk':5} {'own':4} {'a':>7} {'b':>7} {'dur':>5} {'shots':>5} {'EXPL':>5}")
    for c in chunks: print(f"{c['id']:5} {c['owner']:4} {c['a']:7.2f} {c['b']:7.2f} {c['b'] - c['a']:5.1f} {len(c['shots']):5} {share(c['shots']):5.0%}")
    print(f"film EXPL share (0–VO end {VO_END}): {share(S, 0, VO_END):.1%} · incl. endscreen {share(S):.1%} · shots {len(S)} · stars {sum(s['star'] for s in S)}")
    for g, cs in GROUPS:
        sel = [c for c in chunks if c['owner'] == g]; print(f"  {g:4} {cs:22} {sel[0]['a']:7.2f}–{sel[-1]['b']:7.2f}  {sel[-1]['b'] - sel[0]['a']:6.1f} s")
    if '--md' in sys.argv:
        out = sys.argv[sys.argv.index('--md') + 1]; L = []
        L.append('| Chunk | Wer | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |')
        L.append('|---|---|---|---|---|---|---|---|')
        for c in chunks: L.append(f"| {c['id']} | {c['owner']} | {fmt(c['a'])}–{fmt(c['b'])} | {c['b'] - c['a']:.1f} | {c['title']} | {c['light']} | {len(c['shots'])} | {share(c['shots']):.0%} |")
        L.append(f"\n**Explainer-Anteil (gemessen, 0–{fmt(VO_END)} s):** {share(S, 0, VO_END):.0%} (mit Endscreen {share(S):.0%}); gemischte Shots zählen halb. Ziel ≈ 2/3.\n")
        L.append('**Gruppen:** ' + ' · '.join(f"{g} {cs} ({fmt([c for c in chunks if c['owner'] == g][0]['a'])}–{fmt([c for c in chunks if c['owner'] == g][-1]['b'])})" for g, cs in GROUPS) + '\n')
        for c in chunks:
            st = [s for s in c['shots'] if s['star']]
            L.append(f"### {c['id']} · {c['title']} · {fmt(c['a'])}–{fmt(c['b'])} ({c['b'] - c['a']:.0f} s) · {c['owner']} · ★ {st[0]['id'] if st else '–'} · [EXPL] {share(c['shots']):.0%}")
            L.append(f"Licht/Held: {c['light']}\n")
            L.append('| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |')
            L.append('|---|---|---|---|---|---|---|')
            for s in c['shots']:
                anc = ' · '.join(f"**{ph}** @{fmt(find(sg, ph))}" for sg, ph in s['anchors'])
                lay = '[' + s['layer'].replace('>', '→') + ']'
                L.append(f"| {'**' + s['id'] + ' ★**' if s['star'] else s['id']} | {lay} | {fmt(s['a'])}–{fmt(s['b'])} | {anc or '–'} | {s['pic']} | {s['moves']} | {s['tr']} |")
            L.append('')
        open(out, 'w').write(HEAD + '\n'.join(L) + TAIL); print('wrote', out)
