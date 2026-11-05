#!/usr/bin/env python3
"""Film 13 shot list (single source): every shot anchored to a VO WORD, never to a second. Times come from timing.json.
  python3 tools/shots13.py [timing.json] [--md docs/shots.md]   prints chunk table + explainer share, writes the shot list markdown.
Layer: SZENE (world) · EXPL (explainer: light on night) · SZENE>EXPL / EXPL>SZENE (the shot holds the transformation; counts half).
A shot runs from the start of its first word (seg, phrase) to the start of the next shot. Anchors: [(seg, phrase), …] accent words.
"""
import json, re, sys

TIMING = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '/mnt/project-files/scenario/film-zeit/audio/timing.json'
TM = json.load(open(TIMING))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def find(seg, phrase, nth=0):
    ws = [w for w in TM['words'] if w['sec'] == seg]; q = [norm(p) for p in phrase.split() if norm(p)]; hit = 0
    for i in range(len(ws) - len(q) + 1):
        if all((norm(ws[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(ws[i + j]['w']) == p) for j, p in enumerate(q)):
            if hit == nth: return ws[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found: {seg} "{phrase}"')

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, title, first (seg, phrase) — the chunk starts with that word (c01 at 0), light (the hero light / time of day)
CHUNKS = [
    ('c01', 'Hook I · das Versprechen, die alten Versprechen', ('s00', None), 'Nacht · Held: die Sanduhr aus Licht (Sand = Gold), gereicht von der Lichthand'),
    ('c02', 'Hook II · Berkeley, „a lie?“ → „No.“, das Arbeitsjahr', ('s02', None), 'Nacht · Held: der Ring (Maschine, kühl-creme) → die Sanduhr · Explainer-Licht'),
    ('c03', 'Wasser: 200 Mio. Stunden, die Leitung kommt, bei dir null', ('s04', None), 'Nacht, Mond tief · Held: der Mond über dem Weg → der Wasserhahn (Gold-Sand) → Küchenfenster'),
    ('c04', 'Die Stunde wandert: Waschmaschine, Cowan, E-Mail, Microsoft', ('s05', None), 'Nacht · Held: der Sandfaden und die Explainer-Lichter'),
    ('c05', 'Linder, der Sand rinnt vorbei, „this machine is different“', ('s07', None), 'Nacht · Held: der Stundenblock → die Sanduhr in der Lichthand'),
    ('c06', 'Not so far: Berkeley, Jongleur, Hassabis', ('s08', None), 'Nacht · Held: Sanduhr mit Riss → Explainer → das eine späte Fenster'),
    ('c07', 'Battle Creek 1930: Kellogg, 8 → 6, Hunnicutt, was die Stadt tat', ('s10', None), 'Winternacht → Abend · Held: die Fabrikuhr (8 → 6), dann die Stadt als Lichtkarte'),
    ('c08', 'Der Sommerabend (Herzstück), dann: wie es verrutschte', ('s12', None), 'Sommerabend, tiefe Sonne (Held) → Sonnenuntergang → Nachtschicht'),
    ('c09', 'Kein Bösewicht, Mission, die Zeit, die wir behielten', ('s14', None), 'Nacht · Held: die Sanduhr auf der Werkbank → Blätter aus Licht (Regeln)'),
    ('c10', 'Firmen: Vier-Tage-Woche, Zeit-Dividende, Krankenhaus', ('s16', None), 'Nacht hellt auf (Vor-Dämmerung) · Held: das Blatt und die Explainer'),
    ('c11', 'Wir alle: Recht auf Abschalten, Keynes, wer entscheidet', ('s18', None), 'Vor-Dämmerung · Held: der Abendtisch (Lampe) → Karte → Waage aus Licht'),
    ('c12', 'Du: Zeit kaufen, 2 von 100, die erste Stunde schützen', ('s20', None), 'Vor-Dämmerung · Held: die kleine Sanduhr in deinen Händen'),
    ('c13', 'Wann die Regeln kamen, diesmal vorher, wir brauchen es', ('s21', None), 'erstes Morgenlicht · Held: die Zeitleiste → die Lichthand vom Anfang'),
    ('c14', 'Die Stunde kommt an, Schluss, Endscreen', ('s23', None), 'goldener Abend, tiefe Sonne (Echo Battle Creek) · Held: die Sonne'),
]

# shots: (id, layer, (seg, first phrase), [anchors], picture, moves, transition, star)
#   first phrase None = the segment's first word (c01's first shot starts at 0)
S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook I ==============================================================================================================
shot('1.01', 'SZENE', ('s00', None), [('s00', 'Superintelligence'), ('s00', 'free')],
     '**Thumbnail-Motiv.** Nachtblau, Sterne. Oben rechts eine riesige Hand aus Licht (die Maschine), zwischen Daumen und Fingern eine Sanduhr aus Licht: oberer Kolben voll Goldsand. Unten links auf einer Felskante du (gelber Regenmantel, Kapuze), klein, schaust hinauf. Auf **free** beginnt der Sand zu rinnen: ein feiner Goldfaden fällt in den unteren Kolben.',
     '① die Hand senkt die Sanduhr ② langsamer Push', 'Plansequenz', star=True)
shot('1.02', 'SZENE', ('s00', 'Your hours'), [('s00', 'given')],
     'Die Hand setzt die Sanduhr vor dir auf die Kante: Kontakt auf **given**, ein Hauch Lichtstaub, 80 ms später glüht dein Mantelrand auf. Die Hand öffnet sich und zieht sich etwas zurück, sie bleibt im Bild.',
     '① Hand setzt ab, öffnet sich ② Halten mit Drift', 'Fahrt · Träger Sandfaden → steigt als Lichtlinie aus dem oberen Kolben · Mitte · nach oben (Neigung)')
shot('1.03', 'EXPL', ('s00', 'Bill Gates'), [('s00', 'Gates'), ('s00', 'purpose')],
     '**Zitatkarte aus Licht** im Nachthimmel über der Sanduhr (kein Rahmen): die Lichtlinie läuft als Grundlinie und lässt zuerst die Quelle stehen, dann Zeile für Zeile das Zitat (Masken-Wipe von der Grundlinie): „The purpose of life is not just to do jobs. So if you eventually get a society where you only have to work three days a week or something, that\'s probably okay.“ · `— Bill Gates, “What Now?” with Trevor Noah, 2023`. Unten am Bildrand glimmt die Sanduhr weiter.',
     '① die Schrift (Zeile für Zeile) ② Neigung endet in Drift', 'Plansequenz')
shot('1.04', 'EXPL', ('s00', 'If the machines'), [('s00', 'three-day'), ('s00', 'Probably')],
     'Das Zitat steht ruhig (lesen). Auf **three-day** werden die Worte „three days a week“ warm (Gold statt Creme), der Rest bleibt Creme.',
     '① die drei Worte glühen', 'Verwandlung · Träger „three days a week“ → Goldsand · Mitte · nach unten')
shot('1.05', 'EXPL>SZENE', ('s00', 'More of your'), [('s00', 'More'), ('s00', 'life')],
     'Die übrigen Zeilen sinken unter ihre Grundlinie weg; „three days a week“ zerfällt in Goldsand und rieselt nach unten. Die Kamera neigt sich mit dem Sand zurück zur Sanduhr: der Sand fällt in den oberen Kolben, der voller wird (more of your life).',
     '① Sand fällt ② Neigung nach unten', 'Plansequenz')
shot('1.06', 'SZENE', ('s00', "That's the deal"), [('s00', 'deal')],
     'Rückzug zum Maßstab: du, die große Sanduhr voller Gold vor dir auf der Kante, darüber die offene Lichthand (das Angebot). Auf **deal** dreht die Hand die Handfläche nach oben.',
     '① Rückzug ② Hand öffnet sich', 'Push in den unteren Kolben (ab „But“) · Träger runder Glaskolben · Mitte · nach vorn')
shot('1.07', 'SZENE>EXPL', ('s01', 'But'), [('s01', 'before')],
     'Push auf den runden unteren Kolben, bis er groß im Bild steht; der Sand darin wirbelt.',
     '① Push ② Sand wirbelt', 'Verwandlung · Träger Kreis → Bullauge · Mitte · –')
shot('1.08', 'EXPL', ('s01', 'The washing'), [('s01', 'washing')],
     'Der Kolben wird das **Bullauge einer Waschmaschine aus Licht**; die Trommel dreht, der Sand darin ist Wäsche.',
     '① Trommel dreht', 'Verwandlung · Träger Bullauge klappt zu → Briefumschlag · Mitte · –')
shot('1.09', 'EXPL', ('s01', 'Email made'), [('s01', 'Email')],
     'Das Bullauge faltet sich zu einem **Briefumschlag aus Licht**; er fliegt ein Stück nach rechts unten.',
     '① Faltung ② Flug', 'Verwandlung · Träger Umschlag → Bildschirm · Mitte rechts · nach unten')
shot('1.10', 'EXPL>SZENE', ('s01', 'The phone'), [('s01', 'pocket')],
     'Der Umschlag wird das Leuchten eines **Handys**; Rückzug: das Handy steckt in deiner Manteltasche und leuchtet durch den Stoff.',
     '① Rückzug', 'Rückzug · Träger Handylicht · unten · nach hinten')
shot('1.11', 'SZENE', ('s01', 'So why'), [('s01', 'busier')],
     'Weit: du stehst still auf einer nächtlichen Straße; um dich hasten schlichte Silhouetten (Indigo) mit kühlem Handylicht vorbei. Die kleine Sanduhr in deinen Händen ist das einzige warme Licht. Auf **busier** ziehen die Silhouetten schneller (Lichtschlieren), du bleibst.',
     '① die Menge hastet ② langsamer Push', 'Kranfahrt nach oben · Träger die Handylichter steigen auf und werden ein Ring · oben Mitte · nach oben')

# ===== c02 · Hook II ============================================================================================================
shot('2.01', 'EXPL', ('s02', None), [('s02', 'artificial'), ('s02', 'already')],
     'Die kühlen Handylichter steigen auf und schließen sich zu **einem Ring aus Licht** (die Maschine, kühl-creme) über der Stadt aus Lichtpunkten.',
     '① Lichter → Ring ② Kran', 'Plansequenz · Träger Ring · Mitte · –')
shot('2.02', 'EXPL', ('s02', 'Researchers'), [('s02', 'company'), ('s02', 'year')],
     'Unter dem Ring ein Bürohaus aus Lichtfenstern (eine Firma). Um den Ring füllen sich 8 von 12 Monatsbögen: `8 MONTHS INSIDE ONE COMPANY` · `UC BERKELEY · 2025`. Auf **use it** zeigt ein Fenster ein Chatfeld mit blinkendem Cursor.',
     '① Monatsbögen ② Cursor', 'Plansequenz')
shot('2.03', 'EXPL', ('s02', 'Their early'), [('s02', 'no time')],
     'Zähler aus Licht über dem Haus: `TIME FREED UP` rollt hoch … und auf **no time** zurück auf `0` (kühl).',
     '① Zähler', 'Fahrt hinab ins Fenster · Träger Cursor → Bildschirm am Mittagstisch · Mitte · nach vorn')
shot('2.04', 'SZENE', ('s02', 'People were'), [('s02', 'prompts'), ('s02', 'lunch')],
     'Innen, ein Mittagstisch unter einer Lampe (Held): eine Silhouette tippt am Laptop, daneben ein halbes Sandwich und die kleine Sanduhr. Die Wanduhr zeigt 12.',
     '① Hände tippen ② Sand rinnt', 'Rückzug · Träger Sanduhr · Mitte · nach hinten')
shot('2.05', 'SZENE', ('s02', 'So was'), [('s02', 'lie')],
     '★ Rückzug aus dem Fenster in die große Nacht: über der Stadt hängt die riesige Sanduhr, um sie die drei Formen von vorhin (Bullauge, Umschlag, Handy) als kühle Konturen. Auf **lie?** bleibt der fallende Sand mitten im Fall stehen (≤ 1,2 s, Kamera driftet).',
     '① Rückzug ② Sand hält an', 'Plansequenz, **ohne Pause** in 2.06', star=True)
shot('2.06', 'EXPL', ('s03', 'No'), [('s03', 'No'), ('s03', 'true')],
     'Auf **No.** fällt der Sand weiter; auf **true** landet er im unteren Kolben (Akzent, kleiner Lichtstoß).',
     '① Sand fällt', 'Verwandlung · Träger Sandhaufen → Balken · unten · nach rechts')
shot('2.07', 'EXPL', ('s03', 'In Germany'), [('s03', 'Germany'), ('s03', 'half')],
     'Der Sandhaufen streckt sich zu einem langen **Balken aus Licht**: `GERMANY · HOURS WORKED PER YEAR` · `1870: ~3,300`. Auf **half** zerfällt mehr als die Hälfte des Balkens zu Sand und rieselt ab: `TODAY: ~1,350`.',
     '① Balken wächst ② Hälfte zerfällt', 'Plansequenz')
shot('2.08', 'EXPL', ('s03', 'Most rich'), [('s03', 'similar')],
     'Darunter wachsen vier weitere Länderbalken (ohne Namen, nur Linien), zerfallen nacheinander genauso (Kaskade 80 ms). Quelle `OUR WORLD IN DATA · HUBERMAN & MINNS`.',
     '① Kaskade', 'Verwandlung · Träger Balken → Horizontlinie → staubiger Weg · Mitte · nach links')

# ===== c03 · Wasser =============================================================================================================
shot('3.01', 'EXPL>SZENE', ('s04', None), [('s04', 'simplest')],
     'Die Balken sinken zu einer Linie, die Linie wird der Horizont einer weiten Ebene; der tiefe Mond geht darüber auf (Held).',
     '① Linie → Horizont ② Mond steigt', 'Plansequenz')
shot('3.02', 'SZENE', ('s04', 'Wherever'), [('s04', 'tap'), ('s04', 'girls')],
     'Ein langer staubiger Weg zum Horizont; ein Mädchen (Indigo-Silhouette, kein Gelb) trägt einen Wasserkanister auf dem Kopf, geht langsam. Weit hinter ihr weitere kleine Gestalten.',
     '① sie geht ② seitliche Fahrt', 'Plansequenz')
shot('3.03', 'EXPL', ('s04', 'two hundred'), [('s04', 'million'), ('s04', 'water')],
     'Die Fußspuren auf dem Weg werden Lichtpunkte, die sich zu einem Feld zählen: `200 MILLION HOURS` · `EVERY DAY · UNICEF 2016`.',
     '① Punkte zählen sich', 'Verwandlung · Träger Weglinie → Wasserleitung aus Licht · unten · nach rechts')
shot('3.04', 'SZENE', ('s04', 'When the pipe'), [('s04', 'pipe'), ('s04', 'school'), ('s04', 'work')],
     '★ Eine Leitung aus Licht läuft den Weg entlang bis zu ihr, ein Hahn; aus dem Hahn rinnt **Goldsand** und landet zum ersten Mal in einer offenen Hand (ihrer). Auf **school** trägt sie eine Schultasche und geht zu einem erleuchteten Schulfenster; auf **work** leuchtet weiter hinten ein Werkstattfenster.',
     '① Leitung läuft ② sie geht', 'Match-Fahrt · Träger Hahn → dein Küchenhahn (gleiche Bildstelle) · Mitte · –', star=True)
shot('3.05', 'EXPL', ('s04', 'In your home'), [('s04', 'zero')],
     'Dein Küchenfenster bei Nacht, du füllst ein Glas am Hahn, ohne hinzusehen. Neben dem Hahn steht in Creme `0 HOURS`.',
     '① Wasser läuft', 'Plansequenz')
shot('3.06', 'SZENE', ('s04', "That's what time"), [('s04', 'arrives'), ('s04', 'missing')],
     'Nah am Hahn: der letzte Tropfen fällt und wird ein Sandkorn in der kleinen Sanduhr auf dem Fensterbrett. Ruhiges Halten.',
     '① Tropfen → Korn', 'Plansequenz')
shot('3.07', 'SZENE', ('s04', 'So if it worked'), [('s04', 'feel')],
     'Du am Fenster schaust auf die Sanduhr; draußen ist jedes Fenster der Stadt noch hell (alle arbeiten noch).',
     '① langsamer Rückzug', 'Plansequenz · Träger Sandfaden in der Sanduhr · Mitte · –')

# ===== c04 · Waschmaschine, E-Mail ==============================================================================================
shot('4.01', 'SZENE>EXPL', ('s05', None), [('s05', 'vanish'), ('s05', 'else')],
     'Die Sanduhr nah: auf **else** biegt der Sandfaden mitten im Fall zur Seite ab und läuft aus dem Glas nach rechts ins Dunkel. Die Kamera folgt ihm.',
     '① der Faden biegt ab ② Schwenk', 'Fahrt · Träger Sandfaden · Mitte → rechts · nach rechts')
shot('4.02', 'EXPL', ('s05', 'Take the'), [('s05', 'washing'), ('s05', 'easier')],
     'Der Faden fällt in eine **Waschmaschine aus Licht** (Bullauge wie 1.08). Daneben ein Balken `HOURS OF LAUNDRY`, der auf **easier** schrumpft.',
     '① Balken schrumpft', 'Plansequenz')
shot('4.03', 'EXPL', ('s05', 'We washed'), [('s05', 'often'), ('s05', 'clothes'), ('s05', 'cleaner')],
     'Drei Takte in einer Einstellung: Waschgänge als Striche (mehr), ein Stapel Hemden aus Licht (höher), ein Funkeln (sauberer). Der Balken wächst wieder.',
     '① Striche/Stapel ② Balken wächst', 'Plansequenz')
shot('4.04', 'EXPL', ('s05', 'The historian'), [('s05', 'Cowan'), ('s05', 'rose')],
     'Eine Treppenlinie: jede neue Maschine (Bügeleisen, Waschmaschine, Staubsauger als Licht-Icons) hebt die Linie „Standard“ eine Stufe. `RUTH SCHWARTZ COWAN · MORE WORK FOR MOTHER · 1983`.',
     '① Linie steigt Stufe für Stufe', 'Plansequenz')
shot('4.05', 'EXPL', ('s05', 'Later studies'), [('s05', 'shrink'), ('s05', 'grew')],
     'Vier Balken: `COOKING` `CLEANING` schrumpfen, ihr Sand fließt sichtbar hinüber in `SHOPPING` `CHILDCARE`, die wachsen. `GERSHUNY & HARMS 2016`.',
     '① Sand fließt hinüber', 'Plansequenz')
shot('4.06', 'EXPL', ('s05', 'The work'), [('s05', 'disappear'), ('s05', 'moved')],
     '★ Rückzug: die vier Balken liegen im unteren Kolben der großen Sanduhr; der Sand verschiebt sich von einer Seite auf die andere, die Menge bleibt gleich. `MOVED`.',
     '① Rückzug ② Sand verschiebt sich', 'Verwandlung · Träger Sandfaden → Straße mit Tagesstrichen · Mitte · nach rechts', star=True)
shot('4.07', 'EXPL', ('s06', None), [('s06', 'email'), ('s06', 'days'), ('s06', 'second')],
     'Eine Linie mit drei Tagesstrichen: ein Brief aus Licht wandert langsam über alle drei Tage (`3 DAYS`). Auf **second** schießt ein Umschlag dieselbe Strecke in einem Augenblick (`1 SECOND`), Tempo-Kontrast.',
     '① Brief langsam ② Umschlag schnell', 'Plansequenz')
shot('4.08', 'EXPL', ('s06', 'So did we'), [('s06', 'less'), ('s06', 'more')],
     'Der eine Umschlag vervielfältigt sich: der Posteingang stapelt sich als Turm aus Licht nach oben.',
     '① Turm wächst', 'Verwandlung · Träger Turm → Zifferblatt · Mitte · –')
shot('4.09', 'EXPL', ('s06', 'By Microsoft'), [('s06', 'interrupted'), ('s06', 'two minutes')],
     'Ein Zifferblatt einer Stunde aus Licht: alle 2 Minuten ein Ping-Strich (30 Striche leuchten nacheinander auf). `EVERY 2 MINUTES` · `BUSIEST USERS · MICROSOFT WORK TREND INDEX 2025`.',
     '① Striche', 'Plansequenz')
shot('4.10', 'EXPL', ('s06', 'Microsoft even'), [('s06', 'infinite')],
     'Der Zeiger hört nicht auf; das Zifferblatt zieht sich zu einer liegenden Acht aus Licht, auf der der Zeiger weiterläuft. `THE INFINITE WORKDAY`.',
     '① Kreis → Acht', 'Verwandlung · Träger Acht → Glasblock „eine Stunde“ · Mitte · –')

# ===== c05 · Linder =============================================================================================================
shot('5.01', 'EXPL', ('s07', None), [('s07', 'seventy'), ('s07', 'Linder')],
     'Die Acht faltet sich zu einem flachen, gerundeten Gefäß aus Licht: **eine Stunde**. `STAFFAN LINDER · 1970` · `THE HARRIED LEISURE CLASS`.',
     '① Faltung', 'Plansequenz')
shot('5.02', 'EXPL', ('s07', 'The more valuable'), [('s07', 'valuable'), ('s07', 'cram')],
     'Neben dem Gefäß steigt eine Wertlinie; Icons (Termin, Einkauf, Sporttasche) werden hineingestopft, das Gefäß beult.',
     '① Linie ② Icons hinein', 'Plansequenz')
shot('5.03', 'EXPL', ('s07', 'Even our'), [('s07', 'rushed')],
     'Zuletzt ein Liegestuhl mit Handy: auch die Freizeit wird hineingestopft.',
     '① Liegestuhl', 'Plansequenz')
shot('5.04', 'EXPL', ('s07', 'Make something'), [('s07', 'easier'), ('s07', 'more of it')],
     'Ein Kreislauf aus Licht: `EASIER → MORE` (zwei Knoten, der Pfeil schließt den Kreis).',
     '① Pfeil läuft', 'Verwandlung · Träger Kreislauf → Riss im Glas · Mitte · –')
shot('5.05', 'SZENE', ('s07', 'Every time, the hour'), [('s07', 'handed'), ('s07', 'sand slipped'), ('s07', 'reached')],
     '★ Die Lichthand reicht dir die Sanduhr; ein Haarriss im Glas, der Sandfaden tritt aus und biegt in einem langen Bogen am Rand deiner erhobenen Hände vorbei ins Dunkel.',
     '① Bogen des Sandes ② deine Hände', 'Plansequenz', star=True)
shot('5.06', 'SZENE', ('s07', 'But this machine'), [('s07', 'different'), ('s07', 'do the work')],
     'Die Lichthand wird größer und heller; sie setzt eine neue Sanduhr ohne Riss ab, heller als die erste.',
     '① Hand setzt ab', 'Plansequenz')
shot('5.07', 'SZENE', ('s07', 'So this time'), [('s07', 'reaches'), ('s07', 'Right')],
     'Du hebst die Hände; die neue Sanduhr schwebt knapp darüber. Halten, hoffnungsvoll. Auf **Right?** stockt der Sand kurz.',
     '① Hände heben', 'Plansequenz')

# ===== c06 · Not so far =========================================================================================================
shot('6.01', 'SZENE', ('s08', None), [('s08', 'far')],
     'Auf **far** läuft doch ein Haarriss über das neue Glas (Akzent, 3 Frames).',
     '① Riss', 'Fahrt · Träger Ring über der Sanduhr → Ring über dem Bürohaus · oben · nach rechts')
shot('6.02', 'EXPL', ('s08', 'Remember'), [('s08', 'Berkeley')],
     'Das Bürohaus aus Licht mit dem Ring von 2.02 kehrt zurück. `UC BERKELEY · HARVARD BUSINESS REVIEW · 2026`.',
     '① Fahrt', 'Plansequenz')
shot('6.03', 'EXPL', ('s08', 'Artificial intelligence did'), [('s08', 'plates'), ('s08', 'filled'), ('s08', 'roles')],
     'Ein Schreibtisch von oben mit Aufgabenkarten aus Licht: der Ring hebt Karten weg; sofort fallen neue hinein, einige kühler getönt (fremde Rollen).',
     '① Karten weg ② neue Karten', 'Plansequenz')
shot('6.04', 'EXPL', ('s08', 'Work crept'), [('s08', 'evenings')],
     'Tagesleiste 9–17 Uhr; der Arbeitsbalken kriecht über 17 Uhr hinaus in den dunklen Abend bis 22 Uhr.',
     '① Balken kriecht', 'Verwandlung · Träger Balkenende → Jonglierball · rechts · nach oben')
shot('6.05', 'SZENE', ('s08', 'Some people'), [('s08', 'several'), ('s08', 'juggler'), ('s08', 'ball')],
     'Eine Silhouette jongliert drei kleine Ringe aus Licht (Assistenten); auf **one more ball** kommt ein vierter dazu.',
     '① Jonglage', 'Verwandlung · Träger Ringe → Stundengefäß · oben · –')
shot('6.06', 'EXPL', ('s08', 'Linder saw'), [('s08', 'worth'), ('s08', 'ever')],
     'Das Stundengefäß von 5.01 kehrt zurück, heller; die Wertlinie steigt steil, das Gefäß füllt sich schneller.',
     '① Linie ② Füllung', 'Fahrt · Träger Gefäß → Fenster eines Hauses · Mitte · nach vorn')
shot('6.07', 'SZENE', ('s09', None), [('s09', 'top'), ('s09', 'dinner'), ('s09', 'night')],
     '★ Ein Haus in weiter Nacht, ein warmes Fenster: drinnen ein Esstisch mit Familie (Silhouetten). Auf **then starting** wird es dunkel, nur ein kühles Laptop-Licht bleibt; die Kamera hält das eine späte Fenster, Mond zieht. `DEMIS HASSABIS · GOOGLE DEEPMIND`.',
     '① Licht wechselt ② Mond', 'Kran nach oben · Träger das Fenster wird klein · Mitte · nach oben', star=True)
shot('6.08', 'SZENE', ('s09', 'I don'), [('s09', 'human'), ('s09', 'time machine'), ('s09', 'either')],
     'Kran: das Haus wird winzig, daneben am Horizont die riesige Lichthand mit der Sanduhr (die Zeitmaschine). Maßstab.',
     '① Kran', 'Plansequenz')
shot('6.09', 'SZENE', ('s09', 'So maybe'), [('s09', 'us'), ('s09', 'free time')],
     'Du vor der großen Sanduhr: im Glas spiegelt sich dein gelber Mantel. Push ins Glas.',
     '① Push', 'Flug ins Glas · Träger Spiegelung → Luftbild der Stadt · Mitte · nach vorn')

# ===== c07 · Battle Creek 1930 ==================================================================================================
shot('7.01', 'SZENE', ('s10', None), [('s10', 'Michigan'), ('s10', 'Battle')],
     'Aus dem Glas: Luftbild einer kleinen Stadt im Winter an einem Fluss, Fabrik mit Schornstein. `BATTLE CREEK · MICHIGAN`.',
     '① Abstieg', 'Plansequenz')
shot('7.02', 'EXPL', ('s10', 'December'), [('s10', 'thirty'), ('s10', 'Depression')],
     'Der Jahresstempel rollt auf `1930`; eine Kurve aus Licht stürzt ab (`GREAT DEPRESSION`).',
     '① Ziffern ② Kurve', 'Verwandlung · Träger Kurve → Fabrikdach · Mitte · nach unten')
shot('7.03', 'SZENE', ('s10', 'And W'), [('s10', 'Kellogg'), ('s10', 'expects')],
     'Die Fabrikfront bei Nacht, über dem Tor die große Uhr (Held). Am Tor eine Silhouette mit Hut (Kellogg, Indigo).',
     '① Push auf die Uhr', 'Push in die Uhr · Träger Zifferblatt · oben Mitte · nach vorn')
shot('7.04', 'EXPL', ('s10', 'He cuts'), [('s10', 'eight'), ('s10', 'six'), ('s10', 'hire')],
     '★ Das Zifferblatt wird ein Tagesring: der Arbeitsbogen schrumpft von 8 auf 6 Stunden, **zwei goldene Stundenscheiben** heben sich aus dem Ring. Auf **hire**: 3 Schichtbalken werden 4. `1 DEC 1930 · 8 → 6 HOURS`.',
     '① Bogen schrumpft ② Scheiben heben sich', 'Plansequenz', star=True)
shot('7.05', 'EXPL', ('s10', 'So what does'), [('s10', 'two extra'), ('s10', 'day')],
     'Die zwei Scheiben schweben über der Stadt aus Lichtpunkten.',
     '① Scheiben schweben', 'Fahrt hinab · Träger Scheiben → Licht auf einer Veranda · Mitte · nach unten')
shot('7.06', 'SZENE', ('s11', None), [('s11', 'Hunnicutt'), ('s11', 'lived')],
     'Eine Veranda bei Nacht: ein alter Mensch und ein Zuhörer mit Tonbandgerät (kleines Licht). `BENJAMIN HUNNICUTT · KELLOGG\'S SIX-HOUR DAY · 1996`.',
     '① Tonband dreht', 'Plansequenz')
shot('7.07', 'EXPL', ('s11', 'What they'), [('s11', 'output'), ('s11', 'life')],
     'Licht-Hälften: links ein kühler Stapel Kisten (`OUTPUT`) dimmt; rechts wächst warmes Gold (`LIFE`).',
     '① Hälften', 'Verwandlung · Träger Gold → Sand über der Stadtkarte · Mitte · nach unten')
shot('7.08', 'EXPL', ('s11', 'Parents'), [('s11', 'children'), ('s11', 'neighbors'), ('s11', 'library'), ('s11', 'gardens'), ('s11', 'sewed'), ('s11', 'ice')],
     'Die Stadt als Karte aus Licht: der Goldsand fällt, und bei jedem Satz leuchtet ein Ort auf (Veranda, Zaun, Bibliothek, Garten, Einmachgläser, Eis-Kurbel), Takte in einer Einstellung.',
     '① Orte leuchten nacheinander', 'Plansequenz')
shot('7.09', 'EXPL', ('s11', 'In the evenings'), [('s11', 'ball'), ('s11', 'fishing'), ('s11', 'farm')],
     'Weiter: Ballfeld, Fluss mit Angelschnur, kleiner Hof leuchten auf. Am Horizont geht die Sonne als tiefe Scheibe auf (Abend).',
     '① Orte ② Sonne', 'Abstieg in die Karte · Träger die Karte wird die Stadt · Mitte · nach unten')

# ===== c08 · Sommerabend + Verrutschen ==========================================================================================
shot('8.01', 'SZENE', ('s12', None), [('s12', 'summer'), ('s12', 'light'), ('s12', 'father'), ('s12', 'kid')],
     '★ **Das Herzstück.** Sommerabend, die tiefe Sonne (Held) am Horizont, lange Schatten. Vor dem Fabriktor: Vater und Kind (Silhouetten) gehen mit Angelrute zum Fluss. Eine durchgehende seitliche Fahrt nach rechts.',
     '① die beiden gehen ② Fahrt', 'Plansequenz (Fahrt läuft weiter)', star=True)
shot('8.02', 'SZENE', ('s12', 'On a porch'), [('s12', 'cranking')],
     'Die Fahrt erreicht eine Veranda: jemand kurbelt die Eismaschine.',
     '① Kurbel', 'Plansequenz')
shot('8.03', 'SZENE', ('s12', 'At the ball'), [('s12', 'starting')],
     'Weiter zum Ballfeld: der erste Wurf fliegt im Bogen durchs Abendlicht.',
     '① Ball fliegt', 'Kran nach oben')
shot('8.04', 'SZENE', ('s12', "That's the promise"), [('s12', 'promise'), ('s12', 'century')],
     'Kran: die ganze Stadt im Abendlicht; der Schatten des Fabrikschornsteins zieht über die Gärten. `1930`.',
     '① Kran', 'Fahrt · Träger Fabrikuhr · oben · nach vorn')
shot('8.05', 'EXPL', ('s12', 'So why'), [('s12', 'six'), ('s12', 'today')],
     'Die Fabrikuhr: Tagesring mit dem 6-h-Bogen; die Sonne sinkt hinter die Fabrik.',
     '① Sonne sinkt', 'Plansequenz')
shot('8.06', 'EXPL', ('s13', None), [('s13', 'wanting')],
     'Ein Balken `WANTED IT` bleibt voll (warm).',
     '① Balken', 'Plansequenz')
shot('8.07', 'EXPL', ('s13', 'First came'), [('s13', 'war'), ('s13', 'eight')],
     'Die zwei Goldscheiben gleiten in den Ring zurück: wieder 8 h. `1943 · WAR`.',
     '① Scheiben zurück', 'Plansequenz')
shot('8.08', 'EXPL', ('s13', 'After the war'), [('s13', 'voted'), ('s13', 'back')],
     'Erhobene Hände als Lichtstriche: die meisten heben sich. `1946 · MOST VOTE FOR 6 HOURS`.',
     '① Hände', 'Verwandlung · Träger Striche → Fensterreihen der Fabrik · Mitte · –')
shot('8.09', 'EXPL', ('s13', 'But then'), [('s13', 'department'), ('s13', 'one by one'), ('s13', 'longer')],
     'Die Fabrikfront als Fensterreihen (Abteilungen): eine nach der anderen wechselt von warm (6 h) zu kühl (8 h); je eine Münze fällt daneben.',
     '① Fenster kippen', 'Plansequenz')
shot('8.10', 'EXPL', ('s13', 'The last'), [('s13', 'eighty-five'), ('s13', 'leave')],
     'Ein letztes warmes Fenster; die Zeitleiste läuft bis `1985`, das Fenster wird kühl. `THE LAST 530`.',
     '① Zeitleiste ② Fenster', 'Fahrt · Träger das Fenster → leere Werkbank · Mitte · nach vorn')

# ===== c09 · Kein Bösewicht, Mission, behaltene Zeit =============================================================================
shot('9.01', 'SZENE', ('s14', None), [('s14', 'villain'), ('s14', 'away')],
     'Eine leere Werkbank im dunklen Fabriksaal, eine Lampe (Held). Die Sanduhr steht allein darauf, keine Hand in der Nähe.',
     '① langsamer Push', 'Plansequenz')
shot('9.02', 'SZENE', ('s14', 'It slipped'), [('s14', 'vote'), ('s14', 'shift')],
     'Der Sand rinnt Korn für Korn; jedes Korn ein winziger Strich.',
     '① Körner', 'Plansequenz')
shot('9.03', 'SZENE', ('s14', 'And nobody'), [('s14', 'keep')],
     '★ Das letzte Korn fällt durch einen Spalt in der Werkbank ins Dunkel; niemand fängt es. Halten 2 s.',
     '① das Korn', 'Plansequenz', star=True)
shot('9.04', 'SZENE', ('s14', 'This channel'), [('s14', 'everyone'), ('s14', 'subscribe')],
     'Du trittst an die Bank und hältst die Hand unter den Faden; um dich in der Halle viele kleine Lichter (alle).',
     '① deine Hand', 'Verwandlung · Träger Lichter → Wochenleiste · Mitte · nach oben')
shot('9.05', 'EXPL', ('s15', None), [('s15', 'weekend'), ('s15', 'eight-hour')],
     'Wochenleiste aus Licht: Samstag und Sonntag glühen gold; ein Tagesring mit 8-h-Bogen.',
     '① Tage ② Bogen', 'Plansequenz')
shot('9.06', 'EXPL', ('s15', "They didn't"), [('s15', 'decided'), ('s15', 'law'), ('s15', 'contract'), ('s15', 'Ford')],
     'An jede behaltene Zeit heftet sich ein unterschriebenes Blatt aus Licht: Gesetz, Vertrag, Aushang. `HENRY FORD · FIVE-DAY WEEK · 1926`.',
     '① Blätter', 'Plansequenz')
shot('9.07', 'EXPL', ('s15', 'The time that'), [('s15', 'slipped'), ('s15', 'down')],
     'Daneben Waschmaschine, Posteingang, Laptop (Icons): kein Blatt daran, ihr Sand rinnt ab.',
     '① Sand rinnt', 'Plansequenz')
shot('9.08', 'EXPL', ('s15', 'So what would'), [('s15', 'decision'), ('s15', 'superintelligence')],
     'Ein leeres Blatt aus Licht liegt neben der neuen Sanduhr; ein Stift aus Licht kommt ins Bild.',
     '① Stift', 'Plansequenz → c10')

# ===== c10 · Firmen ==============================================================================================================
shot('10.01', 'EXPL', ('s16', None), [('s16', 'work')],
     'Der Stift zieht die erste Zeile auf das Blatt; die Zeile läuft hinaus und wird eine Landkarte.',
     '① Zeile', 'Verwandlung · Träger Zeile → Küstenlinie Großbritanniens · Mitte · nach rechts')
shot('10.02', 'EXPL', ('s16', 'A few years'), [('s16', 'dozens'), ('s16', 'four-day')],
     'Großbritannien als Lichtkarte, 61 kleine Bürolichter. `UK PILOT · 61 COMPANIES · 2022`.',
     '① Lichter gehen an', 'Plansequenz')
shot('10.03', 'EXPL', ('s16', 'A year later'), [('s16', 'nine in ten'), ('s16', 'half'), ('s16', 'permanent')],
     '54 von 61 bleiben an (`~9 IN 10`), 31 werden gold (`~HALF PERMANENT`). `AUTONOMY 2024`.',
     '① Lichter', 'Fahrt · Träger die Karte sinkt → Maschine aus Licht · Mitte · nach oben')
shot('10.04', 'EXPL', ('s16', 'Now carry'), [('s16', 'machines'), ('s16', 'hours'), ('s16', 'profit'), ('s16', 'dividend')],
     '★ Die Lichthand arbeitet; was herauskommt, teilt sich in zwei Ströme: Münzen nach links, Sand nach rechts, und der Sand fließt in die Hände kleiner Figuren (du darunter). `TIME DIVIDEND`.',
     '① Strom teilt sich ② Sand in die Hände', 'Plansequenz', star=True)
shot('10.05', 'EXPL', ('s16', "It's a proposal"), [('s16', 'proposal'), ('s16', 'nothing'), ('s16', 'new time')],
     '`PROPOSAL` · Die Münzen, die schon auf dem Tisch liegen, bleiben unberührt; geteilt wird nur der neue Strom.',
     '① neuer Strom', 'Fahrt · Träger Sandstrom → Lichtstreifen eines Flurs · rechts · nach rechts')
shot('10.06', 'SZENE', ('s17', None), [('s17', 'job'), ('s17', 'hospital'), ('s17', 'Fridays')],
     'Ein Krankenhausflur bei Nacht, eine Pflegekraft (Silhouette) geht an hellen Türen vorbei.',
     '① sie geht', 'Plansequenz')
shot('10.07', 'SZENE>EXPL', ('s17', 'But a rule'), [('s17', 'perfect'), ('s17', 'normal')],
     'Das Flurlicht fällt aufs Blatt; der Stift schreibt die zweite Zeile.',
     '① Zeile', 'Fahrt · Träger Blatt → Tischtuch am Abendtisch · Mitte · nach unten')

# ===== c11 · Wir alle ===========================================================================================================
shot('11.01', 'SZENE', ('s18', None), [('s18', 'France'), ('s18', 'disconnect'), ('s18', 'answer')],
     'Ein Abendtisch unter einer Lampe (Held), Silhouetten und du. Ein Handy leuchtet mit einer Arbeitsnachricht und dreht sich von selbst um.',
     '① Handy ② Lampe atmet', 'Kran nach oben · Träger Handylicht → Punkt auf der Karte (Frankreich) · Mitte · nach oben')
shot('11.02', 'EXPL', ('s18', 'Belgium'), [('s18', 'Belgium'), ('s18', 'Australia'), ('s18', 'Ireland')],
     'Karte aus Licht: Frankreich (`2017`), dann Belgien, Australien, dann Spanien, Portugal, Irland. Namen in Versalien.',
     '① Länder leuchten', 'Fahrt hinab · Träger Kartenpunkt → Lampe am Tisch · Mitte · nach unten')
shot('11.03', 'SZENE', ('s18', "That's the real"), [('s18', 'shift'), ('s18', 'favor'), ('s18', 'yours')],
     '★ Zurück am Tisch: der Abend geht weiter, ein Kind klettert auf einen Schoß, jemand schenkt ein. Rückzug durchs Fenster: das Haus in der Nacht, ein warmes Fenster.',
     '① Abend lebt ② Rückzug', 'Verwandlung · Träger Fenster → Kurve · Mitte · nach oben', star=True)
shot('11.04', 'EXPL', ('s19', None), [('s19', 'Keynes'), ('s19', 'fifteen'), ('s19', 'riches')],
     'Zwei Kurven: Einkommen steigt (fest, warm), Arbeitsstunden sollten auf 15 sinken (gepunktet), bleiben aber hoch. `J. M. KEYNES · 1930 · 15 HOURS A WEEK`.',
     '① Kurven', 'Verwandlung · Träger Kurven → Waagebalken · Mitte · –')
shot('11.05', 'EXPL', ('s19', 'Mostly'), [('s19', 'money'), ('s19', 'more time')],
     'Eine Waage aus Licht: links Münzen (kühl), rechts die Sanduhr (warm); sie hing immer zur Münzseite. Auf **more time?** pendelt sie in die Mitte.',
     '① Waage pendelt', 'Plansequenz')
shot('11.06', 'EXPL', ('s19', 'So who'), [('s19', 'companies'), ('s19', 'governments'), ('s19', 'everyone')],
     'Drei Lichtzeichen nacheinander: Firma, Parlament, eine Hand mit Stimmzettel; jedes legt ein Gewicht auf die Zeitseite.',
     '① Zeichen', 'Fahrt · Träger Sanduhr auf der Waage → Sanduhr in deinen Händen · Mitte · nach vorn')

# ===== c12 · Du =================================================================================================================
shot('12.01', 'EXPL', ('s20', None), [('s20', 'study'), ('s20', 'four'), ('s20', 'time'), ('s20', 'happier')],
     'Du, näher als sonst, eine Münze in der Hand: Münze → Sand (Zeit gekauft) → ein Balken `HAPPIER` steigt. `WHILLANS ET AL. · PNAS 2017 · 4 COUNTRIES`.',
     '① Münze → Sand ② Balken', 'Plansequenz')
shot('12.02', 'EXPL', ('s20', 'Yet when'), [('s20', 'forty'), ('s20', 'two in a hundred')],
     'Hundert kleine Lichtpunkte bekommen je `$40`: 98 ziehen kühl zu den Läden, 2 setzen sich warm auf eine Bank. `2 IN 100`.',
     '① die Menge zieht', 'Verwandlung · Träger die 2 warmen Punkte → leerer Kalenderslot · Mitte · nach vorn')
shot('12.03', 'SZENE', ('s20', 'We are'), [('s20', 'strangely'), ('s20', 'step'), ('s20', 'fill')],
     '★ Dein Schreibtisch bei Nacht: im Kalender glüht eine leere Stunde; kleine Aufgabenkarten fliegen heran, prallen ab. Du legst die Hände um die Sanduhr.',
     '① Karten ② deine Hände', 'Plansequenz', star=True)
shot('12.04', 'SZENE', ('s20', 'Notice'), [('s20', 'Notice'), ('s20', 'Guard'), ('s20', 'empty')],
     'Drei Takte: du schaust (notice), legst die Hände schützend herum (guard), setzt dich daneben, nichts passiert (empty), das ruhigste Bild des Films.',
     '① deine Haltung', 'Plansequenz')
shot('12.05', 'EXPL', ('s20', 'But there'), [('s20', 'common'), ('s20', 'when')],
     'Die Blätter aus Licht (Wochenende, Vertrag, Recht auf Abschalten) steigen auf und legen sich auf eine Zeitleiste.',
     '① Blätter fliegen', 'Plansequenz → c13')

# ===== c13 · Wann sie kamen =====================================================================================================
shot('13.01', 'EXPL', ('s21', None), [('s21', 'factories'), ('s21', 'weekend'), ('s21', 'generations')],
     'Zeitleiste: Fabrik-Icon um 1800, eine lange Strecke verschütteter Sand, dann landet das Blatt `WEEKEND` (1920er–40er), viel zu spät.',
     '① Leiste läuft ② Blatt', 'Plansequenz')
shot('13.02', 'EXPL', ('s21', 'Email filled'), [('s21', 'evenings'), ('s21', 'France')],
     'Umschlag-Icon 1990er, Strecke verschütteten Sandes, `RIGHT TO DISCONNECT · 2017`, wieder zu spät.',
     '① Leiste läuft', 'Plansequenz')
shot('13.03', 'EXPL', ('s21', 'Again and'), [('s21', 'first'), ('s21', 'after'), ('s21', 'gone')],
     'Das Muster legt sich übereinander: Maschine → Lücke aus verlorenem Sand (kühl) → Regel.',
     '① Lücke glüht kühl', 'Plansequenz')
shot('13.04', 'EXPL', ('s21', 'Time never'), [('s21', 'decide'), ('s21', 'ahead'), ('s21', 'us')],
     'Auf der Leiste: `NOW`, davor der Ring der Superintelligenz; das Blatt gleitet **vor** den Ring.',
     '① Blatt gleitet', 'Fahrt · Träger Ring → Lichthand vom Anfang · rechts oben · nach rechts')
shot('13.05', 'SZENE', ('s21', 'And this time'), [('s21', 'can'), ('s21', 'Before'), ('s21', 'after')],
     '★ Die Lichthand vom Anfang will die Sanduhr reichen; diesmal liegt das unterschriebene Blatt schon darunter, und deine offene Hand ruht darauf, **bevor** etwas gereicht wird.',
     '① Hand senkt ② dein Arm', 'Plansequenz', star=True)
shot('13.06', 'EXPL', ('s22', None), [('s22', 'more time'), ('s22', 'need')],
     'Balken der Zeit, die Maschinen gaben (Waschmaschine, E-Mail, Handy klein), dann die Superintelligenz: ein riesiger Balken, der aus dem Bild wächst.',
     '① Balken', 'Verwandlung · Träger Balken → zwei sinkende Kurven · Mitte · nach unten')
shot('13.07', 'EXPL', ('s22', 'In America'), [('s22', 'friends'), ('s22', 'twenty'), ('s22', 'nature')],
     'Zwei leise Kurven sinken: `TIME WITH FRIENDS · 2003–2023 · ATUS`, `TRIPS INTO NATURE · PERGAMS & ZARADIC · PNAS 2008`.',
     '① Kurven', 'Verwandlung · Träger Kurven → Horizont und Sonne · Mitte · –')

# ===== c14 · Die Stunde kommt an ================================================================================================
shot('14.01', 'SZENE', ('s23', None), [('s23', 'hour'), ('s23', 'arrives')],
     'Die tiefe goldene Sonne (Held). Der Sand fällt endlich in deine offene Hand.',
     '① Sand in die Hand', 'Verwandlung · Träger Sand → Erde → Garten · unten · –')
shot('14.02', 'SZENE', ('s23', 'A garden'), [('s23', 'garden'), ('s23', 'Battle')],
     '★ Aus dem Sand in deiner Hand wird Erde, Setzlinge wachsen: ein Garten im Abendlicht, wie in Battle Creek.',
     '① Garten wächst ② Rückzug', 'Fahrt (seitlich, eine Einstellung bis 14.05)', star=True)
shot('14.03', 'SZENE', ('s23', 'A long dinner'), [('s23', 'dinner'), ('s23', 'love')],
     'Die Fahrt erreicht einen langen Tisch draußen, Laternen, Silhouetten, du unter ihnen.',
     '① Fahrt', 'Plansequenz')
shot('14.04', 'SZENE', ('s23', 'A child'), [('s23', 'river')],
     'Weiter: ein Kind hockt am Fluss, dasselbe Licht wie am Abend in Battle Creek.',
     '① Fahrt', 'Plansequenz')
shot('14.05', 'SZENE', ('s23', 'A walk'), [('s23', 'woods'), ('s23', 'nowhere')],
     'Weiter: du gehst langsam einen Waldweg, Sonne durch die Stämme.',
     '① du gehst', 'Kran nach oben')
shot('14.06', 'SZENE', ('s23', "That's what the time"), [('s23', 'for'), ('s23', 'all of us'), ('s23', 'subscribe')],
     'Kran: Garten, Fluss, Wald; über die Landschaft verteilt viele kleine warme Gärten (für alle).',
     '① Kran', 'Plansequenz')
shot('14.07', 'SZENE', ('s24', None), [('s24', 'hour'), ('s24', 'keep')],
     'Die Sanduhr auf der Gartenmauer, der Sand ruht im unteren Kolben, die Sonne scheint hindurch; deine Hand liegt daneben.',
     '① Sonne', 'Rückzug in den Endscreen')
shot('14.08', 'SZENE', ('end', None), [],
     '**Endscreen (VO-Ende bis Schluss, ≤ 15 s, ohne Stimme).** Weites Bild in goldener Stunde: Garten, Fluss, Waldrand; Sonne tief in der Mitte am Horizont. Du und die Sanduhr winzig unten in der Mitte. **Frei:** links (x 90–780, y 250–700: „best for viewer“), rechts (x 1140–1830: „latest upload“), Mitte über der Sonne (x 810–1110, y 330–600: Abo-Knopf). Nie statisch: langsamer Rückzug, der Fluss glitzert, Blätter und Gräser wiegen sich, Glühwürmchen steigen, die Sonne sinkt.',
     '① Rückzug ② Sonne sinkt, Fluss, Glühwürmchen', '–')

# ---------------------------------------------------------------------------------------------------------------------------------
def start_of(sh):
    seg, ph = sh['start']
    if seg == 'end': return TM['sections']['s24']['end']
    if sh['id'] == '1.01': return 0.0
    return TM['sections'][seg]['start'] if ph is None else find(seg, ph)

for sh in S: sh['a'] = start_of(sh)
for i, sh in enumerate(S): sh['b'] = S[i + 1]['a'] if i + 1 < len(S) else TM['duration']
assert all(S[i]['a'] < S[i]['b'] for i in range(len(S))), [(s['id'], s['a'], s['b']) for s in S if s['a'] >= s['b']]
ch_a = []
for cid, title, (seg, ph), light in CHUNKS: ch_a.append(0.0 if cid == 'c01' else TM['sections'][seg]['start'])
chunks = [dict(id=c[0], title=c[1], light=c[3], a=ch_a[i], b=ch_a[i + 1] if i + 1 < len(ch_a) else TM['duration']) for i, c in enumerate(CHUNKS)]
for c in chunks: c['shots'] = [s for s in S if int(s['id'].split('.')[0]) == int(c['id'][1:])]
for c in chunks: assert c['shots'] and abs(c['shots'][0]['a'] - c['a']) < 1e-6 or c['id'] == 'c01', c['id']

w = lambda s: 1.0 if s['layer'] == 'EXPL' else .5 if '>' in s['layer'] else 0.0
def share(shots, a=None, b=None):
    tot = ex = 0
    for s in shots:
        x0, x1 = max(s['a'], a if a is not None else s['a']), min(s['b'], b if b is not None else s['b'])
        if x1 > x0: tot += x1 - x0; ex += (x1 - x0) * w(s)
    return ex / tot if tot else 0
VO_END = TM['sections']['s24']['end']
fmt = lambda x: f'{x:.2f}'.replace('.', ',')

if __name__ == '__main__':
    print(f"{'chunk':5} {'a':>7} {'b':>7} {'dur':>5} {'shots':>5} {'EXPL':>5}")
    for c in chunks: print(f"{c['id']:5} {c['a']:7.2f} {c['b']:7.2f} {c['b'] - c['a']:5.1f} {len(c['shots']):5} {share(c['shots']):5.0%}")
    print(f"film EXPL share (0–VO end {VO_END}): {share(S, 0, VO_END):.1%} · incl. endscreen {share(S):.1%} · shots {len(S)} · stars {sum(s['star'] for s in S)}")
    if '--md' in sys.argv:
        out = sys.argv[sys.argv.index('--md') + 1]; L = []
        tpl = open(out.replace('shots.md', 'shots_head.md')).read() if False else None
        for c in chunks:
            st = [s for s in c['shots'] if s['star']]
            L.append(f"### {c['id']} · {c['title']} · {fmt(c['a'])}–{fmt(c['b'])} ({c['b'] - c['a']:.0f} s) · ★ {st[0]['id'] if st else '–'} · [EXPL] {share(c['shots']):.0%}")
            L.append(f"Licht/Held: {c['light']}\n")
            L.append('| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |')
            L.append('|---|---|---|---|---|---|---|')
            for s in c['shots']:
                anc = ' · '.join(f"**{ph}** @{fmt(find(sg, ph))}" for sg, ph in s['anchors'])
                lay = '[' + s['layer'].replace('>', '→') + ']'
                L.append(f"| {'**' + s['id'] + ' ★**' if s['star'] else s['id']} | {lay} | {fmt(s['a'])}–{fmt(s['b'])} | {anc or '–'} | {s['pic']} | {s['moves']} | {s['tr']} |")
            L.append('')
        body = '\n'.join(L)
        txt = open(out).read()
        a, b = txt.index('<!-- SHOTS:BEGIN -->'), txt.index('<!-- SHOTS:END -->')
        chunk_tab = '\n'.join(['| Chunk | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |', '|---|---|---|---|---|---|---|'] +
                              [f"| {c['id']} | {fmt(c['a'])}–{fmt(c['b'])} | {c['b'] - c['a']:.1f} | {c['title']} | {c['light']} | {len(c['shots'])} | {share(c['shots']):.0%} |" for c in chunks])
        summary = f"\n\n**Explainer-Anteil (gemessen, Laufzeit 0–{fmt(VO_END)} s):** {share(S, 0, VO_END):.0%} (mit Endscreen {share(S):.0%}); gemischte Shots [SZENE→EXPL] zählen halb. Ziel 60–70 %.\n"
        txt = txt[:a] + '<!-- SHOTS:BEGIN -->\n' + chunk_tab + summary + '\n' + body + '\n' + txt[b:]
        open(out, 'w').write(txt); print('wrote', out)
