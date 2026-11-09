#!/usr/bin/env python3
"""Film 24 · shot list → docs/shots.md. One motif per sentence (or per short line), anchored on PHRASES of vo-v5 (never seconds);
the times in the table come from the timing file (provisional until <ROOT>audio/timing.json exists) and are only for orientation.
Layers: MAP (the night map) · EXPL (explainer field / graphics) · MIX (habitat scene + explainer layer) · SCENE (habitat / story) ·
CLIP (original footage, excluded from the share). Explainer share = (MAP + EXPL + ½ MIX) / (all − CLIP), weighted by duration.
`cut` marks a HARD world change (no map zoom, no medallion between the two worlds); target ≤ ~1 per minute.
  python3 tools/shots24.py [timing.json]   (default: $TIMING, else ROOT audio/timing.json, else data/provisional_timing.json)"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F24ROOT', '/mnt/project-files/scenario/film-tiersprache/').rstrip('/') + '/'
TF = (sys.argv[1] if len(sys.argv) > 1 else os.environ.get('TIMING')) or next(f for f in (ROOT + 'audio/timing.json', os.path.join(HERE, '..', 'data', 'provisional_timing.json')) if os.path.exists(f))
TM = json.load(open(TF))
WORDS = TM['words']
norm = lambda s: re.sub(r"[^\w']", '', s.lower().replace('’', "'"))
NW = [norm(w['w']) for w in WORDS]
def G(phrase, after=-1.0):
    p = [norm(x) for x in phrase.split()]
    for i in range(len(NW) - len(p) + 1):
        if WORDS[i]['s'] > after and NW[i:i + len(p)] == p: return WORDS[i]['s']
    raise SystemExit(f'phrase not found: {phrase!r}')
CLIP = {c['id']: c for c in TM['clips']}

# chapters (= film.mjs CHUNKS) and their builders
CH = [('c01', 'Scientists are trying', 'Lead', 'Hook · the barn → the night map'),
      ('c02', 'Their A.I. can already', 'B1', 'Who are they? · the listener, the feed, the clip'),
      ('c03', 'Every baby on Earth', 'B1', 'A language without a dictionary · baby, guessing game, recorder'),
      ('c04', 'Further than you might', 'B1', 'The tour I · Kenya: names, the chorus'),
      ('c05', 'Now north, to Spain', 'B2', 'The tour II · León crows, the pigs again'),
      ('c06', 'In the Caribbean', 'B2', 'The tour III · Dominica, Bahamas, Berkeley · the empty middle'),
      ('c07', 'Why is meaning so hard', 'B2', 'The wall · toddler, prize, Alaska · 2030? · subscribe'),
      ('c08', 'But suppose they make it', 'B2', 'What would change? · 1970, the songs'),
      ('c09', 'Now think back to those pigs', 'B3', 'The pigs, the feeling, the paradox'),
      ('c10', 'Twenty thirty. Day one', 'B3', 'Scenario · day one, year one'),
      ('c11', 'Year ten', 'B3', 'Scenario · year ten · other minds · back to today · end screen')]

# (id, anchor phrase or [Cn] or END, layer, picture (one idea), move / carrier, flags)
S = [
 # ---------------------------------------------------------------- c01 (lead, built: scenes/sc01.mjs)
 ('1.01', 'Scientists are trying', 'SCENE', 'the barn at night, two pigs under ONE hanging lamp (the hero light); small calls rise from the snouts', 'slow push'),
 ('1.02', 'The first step already', 'MIX', 'the claim top left: "A.I. can hear what they feel." (gold on the last words)', 'push · line rises'),
 ('1.03', 'Try it yourself', 'SCENE', 'the camera pulls back: you at the fence, leaning in, forearms on the rail', 'pull back (reveal)'),
 ('1.04', 'One of these two pigs', 'MIX', 'PIG 1 / PIG 2 cards rise out of the pigs\' backs (staggered), FEELS ?', 'breathing hold'),
 ('1.05', 'Listen', 'MIX', '[P1] a calm grunt wave grows over pig 1 while it calls; the snout pulses', 'drift to pig 1'),
 ('1.06', 'And this one', 'MIX', '[P2] a shrill squeal wave over pig 2; the head rises, the mouth opens', 'drift to pig 2'),
 ('1.07', "It's the second pig", 'MIX', 'the beads slide: pig 2 NOT FINE (cool), pig 1 FINE (gold)', 'back to both'),
 ('1.08', 'You probably got it', 'MIX', 'YOU ✓ · A.I. = the gold listener · 9 of 10 marks gold · 9/10', 'slow push'),
 ('1.09', 'Feelings, yes', 'MIX', 'ticks on both FEELS rows · an empty [translating…] bar under the lamp', 'push'),
 ('1.10', 'in California wants to change', 'MAP', 'the barn shrinks into the medallion of the Europe pig pin, the night map opens round it; the gold ESP pin grows on "California"; every species calls', 'ONE zoom out (carrier: the medallion)'),
 ('1.11', "They're called the Earth", 'MAP', 'EARTH SPECIES PROJECT label; the 2030 strip is born on it and docks top right', 'label · strip flies'),
 ('1.12', 'Will they make it', 'MAP', 'the question; the map pushes onto California = plateCalifornia', 'push → SEAM'),
 # ---------------------------------------------------------------- c02 (B1)
 ('2.01', 'Their A.I. can already', 'EXPL', 'push into the gold ESP pin: its medallion opens (iris) onto the explainer field, where the gold listener stands', 'iris (carrier: ESP medallion)'),
 ('2.02', 'Play it a call from', 'EXPL', 'an unknown call (tag NEVER HEARD) flies into the listener\'s bell; an index card with the species comes out of the tip · small: NatureLM-audio · ESP', 'call → card'),
 ('2.03', 'Not every time', 'EXPL', 'a row of tries, most cards land, a few miss; beside it a die rolls and misses (no percentage)', 'stagger'),
 ('2.04', "One of the team's founders", 'EXPL', 'a phone rises on the field; a thumb scrolls an endless feed', 'phone rises'),
 ('2.05', 'Infinite scroll', 'EXPL', 'the feed runs; AZA RASKIN · CO-FOUNDER · INVENTED INFINITE SCROLL', 'label'),
 ('2.06', "Now he's building", 'EXPL', 'the feed runs out at the bottom into a wave of animal calls that flows into the listener', 'feed → wave'),
 ('2.07', 'Not to chat with your dog', 'MIX', 'a toy box DOG TRANSLATOR, struck; instead two elephants on a dusk horizon talking, the listener only an ear at the edge', 'strike · pan'),
 ('2.08', 'Here he is', 'EXPL', 'the ESP medallion grows into the clip plate', 'clip plate (carrier: medallion)'),
 ('2.09', '[C1]', 'CLIP', 'Aza Raskin · ORIGINAL FOOTAGE · StarTalk 2026', 'clip'),
 ('2.10', 'Serious money backs them', 'EXPL', 'the clip shrinks back into the medallion; a simple stack $10M · REID HOFFMAN · LINKEDIN CO-FOUNDER', 'stack rises'),
 ('2.11', 'But how do you crack', 'EXPL', 'a dictionary opens, every page blank; a whale silhouette with a question mark; the blank page glows', 'pages · push into the page'),
 # ---------------------------------------------------------------- c03 (B1)
 ('3.01', 'Every baby on Earth', 'SCENE', 'the blank page\'s light becomes the kitchen window at morning: a baby in a high chair, a parent talking', 'match on the bright rectangle', 'cut'),
 ('3.02', 'A baby never gets', 'MIX', 'the sounds float as small waves in bubbles past the baby\'s head', 'drift'),
 ('3.03', 'It notices which sounds', 'EXPL', 'the bubbles sort: same sounds take the same colour, pairs stick together', 'sort'),
 ('3.04', 'Then it notices what happens', 'SCENE', 'the baby makes a sound, the bottle comes into frame', 'hand-in'),
 ('3.05', "The team's A.I. does", 'EXPL', 'pull back: the kitchen is one medallion in a mountain of call waves (NO LABELS) sliding into the listener', 'pull back (carrier: window → medallion)'),
 ('3.06', 'Then it plays a guessing', 'EXPL', 'a wave with a greyed gap; the listener fills it', 'gap fills'),
 ('3.07', 'Like autocomplete on your', 'EXPL', 'a phone keyboard; its suggestions are bird and click icons', 'suggestions pop'),
 ('3.08', 'Guess after guess', 'EXPL', 'clusters step out of the noise; calls of one colour linked', 'clusters'),
 ('3.09', 'But a baby has one', 'MIX', 'the kitchen medallion again: the baby points at the bottle', 'medallion opens'),
 ('3.10', "The machine can't", 'EXPL', 'the listener with a blindfold', 'blindfold drops'),
 ('3.11', 'tiny recorders onto wild animals', 'EXPL', 'exploded drawing of the tiny recorder on a crow\'s tail feather: MICROPHONE · MOTION SENSORS · 12.5 G', 'parts fly apart'),
 ('3.12', 'They record each call', 'EXPL', 'two tracks: the call wave and the motion line FLYING · LANDING · FEEDING', 'tracks run'),
 ('3.13', 'Patterns first', 'EXPL', 'PATTERNS → MEANING', 'arrow'),
 ('3.14', 'Twenty thirty is only', 'EXPL', 'the 2030 strip grows big at the centre: TODAY · NOV 2026 ——— 2030, a short bar between; it docks again', 'strip big → dock'),
 # ---------------------------------------------------------------- c04 (B1)
 ('4.01', 'Further than you might', 'MAP', 'zoom out to the world: the pins of all teams appear (gold ESP, cream others); the stone tablet (7 slots round MEANING) settles lower left', 'zoom out · pins stagger'),
 ('4.02', 'Start in Kenya', 'MAP', 'flight to Kenya; the cream Kenya pin grows; OTHER TEAM · KENYA', 'flight'),
 ('4.03', 'Play an elephant a call', 'SCENE', 'iris into the savanna: an elephant cow, a speaker on a jeep; she answers and walks towards it', 'iris · walk'),
 ('4.04', 'They caught it on camera', 'SCENE', 'the Kenya medallion grows into the clip plate', 'clip plate'),
 ('4.05', '[C2]', 'CLIP', 'elephant playback · ORIGINAL FOOTAGE · Colorado State University', 'clip'),
 ('4.06', 'If elephants have names', 'MAP', 'back into the medallion; the tablet slot NAMES is engraved (cream)', 'slot engraves'),
 ('4.07', 'Also in Kenya, the Earth', 'MAP', 'a short pan inside Kenya to the gold Amboseli pin', 'pan'),
 ('4.08', 'Elephant families often rumble', 'SCENE', 'iris into dusk at Amboseli: a family close together, all rumbling at once (overlapping rumble waves)', 'iris'),
 ('4.09', 'Their A.I. listened to', 'MIX', 'the overlapping rumbles slide into the listener; out come GREETING · CALF COMFORTED', 'waves → tags'),
 ('4.10', 'A first step from patterns', 'MAP', 'the chorus closes into the Amboseli pin; the map pulls back onto Africa and Europe; WHAT\'S GOING ON is engraved (gold) = plateNorth', 'iris closes → SEAM'),
 # ---------------------------------------------------------------- c05 (B2)
 ('5.01', 'Now north, to Spain', 'MAP', 'flight north; the gold León pin (crow) grows', 'flight'),
 ('5.02', 'They caught more than', 'MIX', 'iris into a field at León: a crow family, one bird with the recorder of 3.11; a counter runs to 100,000+ CALLS, many waves small and pale', 'iris · counter'),
 ('5.03', 'And each call comes with', 'MIX', 'under each wave the motion line; a flash of the baby with the bottle; CONTEXT is engraved (gold)', 'tracks · slot'),
 ('5.04', 'And the pigs from the start', 'MAP', 'out onto the map: the Europe pig pin; OTHER TEAM · EUROPE (COPENHAGEN · ETH ZURICH · INRAE)', 'flight · label'),
 ('5.05', 'Their A.I. learned from thousands', 'MIX', 'iris into the barn of the hook: a life line BIRTH → SLAUGHTER along the floor, many small calls on it (no violence)', 'iris · line'),
 ('5.06', 'So one piece is already', 'EXPL', 'the FEELS bead of the cards flies into the tablet: FEELINGS (cream)', 'bead → slot'),
 # ---------------------------------------------------------------- c06 (B2)
 ('6.01', 'In the Caribbean', 'MAP', 'the barn closes into its pin; flight to Dominica; OTHER TEAM · DOMINICA · PROJECT CETI', 'flight'),
 ('6.02', 'They found that the clicks', 'MIX', 'iris into deep blue: a sperm whale sinks; a click sequence with four sliders RHYTHM · TEMPO · STRETCH · EXTRA CLICK', 'iris · sliders'),
 ('6.03', 'Mixed together', 'EXPL', 'the variants fan out', 'fan'),
 ('6.04', 'Good news for the California', 'MAP', 'pull back: PARTS is engraved; the gold California pin blinks', 'zoom out · slot'),
 ('6.05', 'in the Bahamas', 'MAP', 'short flight to Bimini; OTHER TEAM · GOOGLE · BAHAMAS; the keyboard of 3.07 now suggests dolphin whistles', 'flight · keyboard'),
 ('6.06', 'It learned from recordings', 'SCENE', 'iris into clear water: dolphins, a diver with a recorder; 40 YEARS', 'iris'),
 ('6.07', "Here's what she hopes", 'SCENE', 'the Bahamas medallion grows into the clip plate', 'clip plate'),
 ('6.08', '[C3]', 'CLIP', 'Denise Herzing · ORIGINAL FOOTAGE · Google 2025', 'clip'),
 ('6.09', "Google's model is built", 'EXPL', 'a small listener with one dolphin vs the gold listener with many silhouettes; NEXT SOUND is engraved', 'two listeners'),
 ('6.10', 'Back in California', 'MAP', 'flight back to California: the Berkeley pin (finch) next to the gold ESP pin; two finch calls', 'flight'),
 ('6.11', 'Like "couch" and "sofa"', 'EXPL', 'COUCH / SOFA: two different waves, one shared symbol; two finch calls drop into the same drawer', 'merge'),
 ('6.12', 'So the meaning is there', 'EXPL', "IT'S THERE is engraved", 'slot'),
 ('6.13', 'But the machines', 'MAP', 'the whole map with all pins lit; the tablet full, only MEANING empty', 'pull back'),
 ('6.14', 'Not one of them', 'EXPL', 'the empty middle becomes the [translating…] bar; the cursor blinks, no word', 'slot → bar'),
 # ---------------------------------------------------------------- c07 (B2)
 ('7.01', 'Why is meaning so hard', 'EXPL', 'the question over the empty bar', 'line rises'),
 ('7.02', 'Remember the baby', 'MIX', 'the kitchen medallion opens again: the baby is a toddler now, calling; the parent understands at once', 'medallion opens'),
 ('7.03', 'Researchers tested A.I.', 'EXPL', 'toddler sounds as dots; TEL AVIV UNIVERSITY · 2026', 'dots'),
 ('7.04', 'Sounds their parents understand', 'EXPL', 'the dots get labels UPSET · HUNGRY · MOM/DAD', 'labels'),
 ('7.05', 'The best systems', 'EXPL', 'the listener sorts them; the colours land mixed up', 'sort fails'),
 ('7.06', "If machines can't yet", 'MIX', 'zoom out from the kitchen to the open ocean on the map; one whale, far off', 'zoom out'),
 ('7.07', "There's a prize worth", 'EXPL', 'an empty pedestal with the sign UNCLAIMED; COLLER DOLITTLE CHALLENGE · UP TO $10M', 'pedestal'),
 ('7.08', "It's still unclaimed", 'EXPL', 'the pedestal\'s light breathes; nothing on it', 'hold'),
 ('7.09', 'The closest thing yet', 'MAP', 'flight to the Alaska pin (humpback)', 'flight'),
 ('7.10', 'Off Alaska, a humpback', 'MIX', 'iris into the sea: an underwater speaker sends a call, a humpback answers, waves back and forth; 20 MIN', 'iris · waves'),
 ('7.11', '[C4]', 'CLIP', 'Twain · ORIGINAL FOOTAGE · WhaleSETI 2024', 'clip'),
 ('7.12', 'One whale. One call.', 'EXPL', 'three small cards, one after another: ONE WHALE · ONE CALL · ONE TIME', 'cards'),
 ('7.13', 'And the Earth Species Project admits', 'MAP', 'the gold pin; a quote card WON\'T KNOW WHEN A MODEL IS "ABSOLUTELY RIGHT" (AP 2025)', 'card'),
 ('7.14', 'So will they make twenty', 'EXPL', 'the strip grows big: 2030?', 'strip big'),
 ('7.15', 'Today, there is no translator', 'EXPL', 'the [translating…] bar stays empty; under it whale, elephant, dog: NO TRANSLATOR', 'silhouettes'),
 ('7.16', 'This channel exists', 'SCENE', 'calm: the elephant family at dusk, the calf in the middle; subscribe area SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', 'slow push (mid-film subscribe)', 'cut'),
 ('7.17', 'Want that too', 'SCENE', 'same picture; SUBSCRIBE', 'hold'),
 # ---------------------------------------------------------------- c08 (B2)
 ('8.01', 'But suppose they make it', 'EXPL', 'the strip opens: WHAT CHANGES?; a timeline runs back to 1970', 'strip → timeline'),
 ('8.02', 'History has one clue', 'EXPL', 'the timeline lands on 1970', 'land'),
 ('8.03', 'Nineteen seventy', 'SCENE', 'a living room in 1970: a record player, the cover SONGS OF THE HUMPBACK WHALE, a family listening', 'the 1970 dot becomes the record\'s label', 'cut'),
 ('8.04', 'Twelve years later', 'EXPL', 'timeline 1970 → 1982: IWC · COMMERCIAL WHALING PAUSED; a harpoon struck; STILL IN FORCE', 'timeline'),
 ('8.05', "The songs weren't the only", 'MAP', 'the record\'s song wave; pull back onto the map, zoom into the Europe pig pin = plateBarn', 'zoom out → zoom in → SEAM'),
 # ---------------------------------------------------------------- c09 (B3)
 ('9.01', 'Now think back to those', 'SCENE', 'the barn of the hook (plate), a slow push to pig 2', 'push'),
 ('9.02', 'Today, going without meat', 'MIX', 'the camera rises out of the barn: a shelf with plant burgers and oat milk', 'rise', 'cut'),
 ('9.03', 'In Germany, about nine', 'MAP', 'the map on Germany; a grid of 100 figures, 9 light: NO MEAT · 9 IN 100 · GERMANY 2025; then AGE 14–29: 20', 'grid'),
 ('9.04', 'Still, nine in ten', 'EXPL', 'the grid turns: 90 lit warm', 'flip'),
 ('9.05', 'Maybe the products just', 'EXPL', 'a balance: PRICE · TASTE', 'balance'),
 ('9.06', "Or maybe what's missing", 'MIX', 'the other pan: a heart with an ear (FEELING); a barn seen from outside, its wall swallows every sound', 'pan tips'),
 ('9.07', 'Now imagine a machine', 'SCENE', 'the 1970 record player, the needle drops; a pig wave floats out and fills a kitchen today', 'needle · wave', 'cut'),
 ('9.08', 'Could that make vegetarian', 'EXPL', 'the question; a small scale of rights', 'line rises'),
 ('9.09', 'Maybe. But even for whales', 'MAP', 'flight to Iceland; a harbour, a whaling ship leaves; ICELAND · JUNE 2026 · FIN WHALES', 'flight · iris'),
 ('9.10', "There's also what psychologists", 'EXPL', 'two bubbles over a head LOVES ANIMALS · EATS MEAT; THE MEAT PARADOX', 'bubbles'),
 ('9.11', 'Remind people that farm', 'EXPL', 'a slider MIND sinks when a barn picture appears; BASTIAN ET AL. 2012', 'slider'),
 ('9.12', "That's not hypocrisy", 'SCENE', 'you, calm, at the fence of the barn', 'hold'),
 ('9.13', 'So maybe a feeling', 'EXPL', 'the heart with the ear shrinks', 'shrink'),
 ('9.14', 'But what if, one day', 'EXPL', 'the [translating…] bar returns, the 2030 strip beside it', 'bar'),
 # ---------------------------------------------------------------- c10 (B3)
 ('10.01', 'Twenty thirty. Day one', 'MAP', 'SCENARIO stamp; the strip → TARGET HIT (gold); DAY 1 · YEAR 1 · YEAR 10; the map zooms onto a camp in Kenya', 'stamp · zoom in'),
 ('10.02', 'In this scenario', 'SCENE', 'iris into the camp at dawn: a laptop with the chorus spectrogram', 'iris'),
 ('10.03', 'Their A.I. understands a whole', 'MIX', 'the spectrogram runs; the listener drinks it in', 'drink'),
 ('10.04', 'The first message probably', 'SCENE', 'WOW: the bar fills for the first time: "time to go" (SCENARIO); the family sets off', 'typed · walk'),
 ('10.05', 'Not far-fetched', 'EXPL', 'REAL card: VOICES LINE UP WHEN FAMILIES SEEM TO PLAN · SCI. REP. 2026', 'card'),
 ('10.06', 'Do we answer', 'SCENE', 'a researcher, her hand over the speaker\'s button; she hesitates', 'push'),
 ('10.07', 'The man who invented the endless', 'MIX', 'the phone with the feed of 2.04, briefly; it grows into the clip plate', 'clip plate'),
 ('10.08', '[C5]', 'CLIP', 'Aza Raskin · ORIGINAL FOOTAGE · StarTalk 2026', 'clip'),
 ('10.09', 'Year one. A courtroom', 'MAP', 'SCENARIO · YEAR 1; flight to New Zealand; iris into a courtroom, a sperm whale recording on the screen, a container ship outside', 'flight · iris'),
 ('10.10', 'Two parts of this are real', 'EXPL', 'REAL: NEAR SHIPS, CALLS SHIFT · DOMINICA · 13 WHALES · 2026 · CAUSE UNCLEAR', 'stamp'),
 ('10.11', 'And Māori and Pacific', 'EXPL', 'REAL: HE WHAKAPUTANGA MOANA · 2024 · DECLARATION, NOT LAW; TOHORĀ ORANGA BILL · 2026', 'stamp'),
 ('10.12', 'The rest is our scenario', 'SCENE', 'SCENARIO: the bar under the recording "too loud"; the judge nods; outside, the ship slows, its wake calms', 'typed · ship'),
 # ---------------------------------------------------------------- c11 (B3)
 ('11.01', 'Year ten. A farm kitchen', 'MAP', 'SCENARIO · YEAR 10; flight to Iowa; iris into a farm kitchen in the evening, the barn through the window', 'flight · iris'),
 ('11.02', 'Microphones in every barn', 'MIX', 'a small microphone with a light under the barn roof; the FEELS card of the hook', 'push to the window'),
 ('11.03', 'Whether that changes', 'SCENE', 'the table, dinner, a breathing hold', 'hold'),
 ('11.04', 'Under the table', 'SCENE', 'a dog under the table; the bar: "walk." three times (SCENARIO)', 'tilt down'),
 ('11.05', 'Listening to animals is practice', 'EXPL', 'pull out of the kitchen: the animals\' waves, beside them a calm abstract wave of a machine mind; OTHER MINDS', 'pull back'),
 ('11.06', 'And one of those minds', 'EXPL', 'the mind wave grows', 'grow'),
 ('11.07', 'Soon, we may not be', 'SCENE', 'a room full of people; a new voice appears as a line of light, everyone turns to it', 'turn', 'cut'),
 ('11.08', "Then listening won't be", 'SCENE', 'hold on the line of light', 'push'),
 ('11.09', 'Back to today', 'MAP', 'TODAY · NOV 2026 on the strip; the night map with all pins', 'pull back'),
 ('11.10', 'Twenty thirty is only a few', 'EXPL', 'the strip big: the short bar to 2030', 'strip big'),
 ('11.11', 'But one part has already', 'MAP', 'zoom into the Europe pig pin; the barn opens', 'zoom in (carrier: pig medallion)'),
 ('11.12', 'A.I. can hear them now', 'SCENE', 'the two pigs; the FEELS bead under PIG 2 glows; you at the gate, listening', 'push'),
 ('11.13', 'Whether we listen', 'SCENE', 'you lower your head and listen', 'hold'),
 ('11.14', 'Want the arrival', 'SCENE', 'subscribe area over the calm barn: SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', 'slow pull'),
 ('11.15', 'END', 'SCENE', 'END SCREEN 15 s: the barn at rest, the lamp, pigs breathing; the right 2/3 a quiet dark wall for the end cards', 'very slow drift'),
]

def start(sh, after):
    a = sh[1]
    if a.startswith('[C'): return CLIP[a[1:-1]]['start']
    if a == 'END': return WORDS[-1]['e'] + .4
    return G(a, after)
rows, t = [], -1.0
for sh in S:
    s = start(sh, t if not sh[1].startswith('[') else -1); rows.append([*sh[:5], 'cut' in sh[5:], s]); t = s - .01
for i, r in enumerate(rows): r.append((rows[i + 1][6] if i + 1 < len(rows) else TM['duration']) - r[6])
chs = [(c, G(p), b, n) for c, p, b, n in CH]
def chap(s): return [c for c in chs if c[1] <= s + 1e-6][-1]
W = {'MAP': 1, 'EXPL': 1, 'MIX': .5, 'SCENE': 0}
def share(rs):
    num = sum(W[r[2]] * r[7] for r in rs if r[2] != 'CLIP'); den = sum(r[7] for r in rs if r[2] != 'CLIP'); return num / den if den else 0
ts = lambda s: f'{int(s // 60)}:{s % 60:04.1f}'
out = []
P = out.append
P('# Film 24 · shot list (generated: `python3 tools/shots24.py` from the table in that file; do not edit by hand)\n')
P(f'Timing: `{os.path.basename(TF)}`{" (PROVISIONAL)" if TM.get("provisional") else ""} · duration {ts(TM["duration"])}. Times are for orientation only: code anchors on the PHRASE column (T.G / T.GE).\n')
P('## 1 · Rules\n')
P('- One motif per sentence (or per short line). One main movement at a time; the camera never stops (<5 % near-static frames, no stretch > 2 s).')
P('- Every boundary has a carrier: at a station change the map zooms out, flies, zooms in; the place pin\'s medallion is the carrier (iris). Inside a station: morph, mask, match.')
P('- Layers: **MAP** night map · **EXPL** explainer field / graphics · **MIX** habitat scene with an explainer layer (counts ½) · **SCENE** habitat / story · **CLIP** footage (not counted).')
P('- Explainer share target 60–70 % (weighted by duration, clips excluded). `cut` = hard world change without the map or a medallion between the worlds; target ≤ ~1 per minute.')
P('- Subtitles own y > 910: nothing important below that line. End screen: right 2/3 free for the end cards.\n')
tot = share(rows); cuts = [r for r in rows if r[5]]
P('## 2 · Totals\n')
P(f'- **Explainer share {tot * 100:.1f} %** (MAP + EXPL + ½ MIX over all shots except clips).')
P(f'- Hard world changes: **{len(cuts)}** in {TM["duration"] / 60:.1f} min = {len(cuts) / (TM["duration"] / 60):.2f} per minute ({", ".join(r[0] for r in cuts)}). All other boundaries are map zooms, medallion irises, morphs or masks.\n')
P('| chapter | from | builder | content | start | length | explainer share |')
P('|---|---|---|---|---|---|---|')
for i, (c, s0, b, n) in enumerate(chs):
    s1 = chs[i + 1][1] if i + 1 < len(chs) else TM['duration']
    rs = [r for r in rows if chap(r[6])[0] == c]
    P(f'| {c} | {CH[i][1]} | {b} | {n} | {ts(s0)} | {s1 - s0:.1f} s | {share(rs) * 100:.0f} % |')
bt = {}
for c, s0, b, n in chs: bt.setdefault(b, []).append(c)
P('\n' + ' · '.join(f'**{b}** {", ".join(v)} ({sum(r[7] for r in rows if chap(r[6])[0] in v):.0f} s)' for b, v in bt.items()) + '\n')
P('## 3 · Shots\n')
cur = None
for r in rows:
    c = chap(r[6])
    if c[0] != cur:
        cur = c[0]; P(f'\n### {c[0]} · {c[3]} · {c[2]}\n'); P('| ID | anchor (phrase) | t | len | layer | picture (one idea) | move / carrier |'); P('|---|---|---|---|---|---|---|')
    P(f'| {r[0]}{" ✂" if r[5] else ""} | {r[1]} | {ts(r[6])} | {r[7]:.1f} | {r[2]} | {r[3]} | {r[4]} |')
P('\n## 4 · Seams between builders (lib/f24_seams.mjs)\n')
P('| seam | at (phrase) | plate | handing side | receiving side |')
P('|---|---|---|---|---|')
P(f"| Lead → B1 | 'Their A.I. can already' ({ts(G('Their A.I. can already'))}) | plateCalifornia | 1.12 push onto CA_VIEW | 2.01 iris into the ESP pin |")
P(f"| B1 → B2 | 'Now north, to Spain' ({ts(G('Now north, to Spain'))}) | plateNorth | 4.10 chorus closes into the Amboseli pin, pull back to NORTH_VIEW | 5.01 flight north |")
P(f"| B2 → B3 | 'Now think back to those pigs' ({ts(G('Now think back to those pigs'))}) | plateBarn | 8.05 zoom into the Europe pig pin | 9.01 slow push to pig 2 |")
P('\n## 5 · On-screen text and numbers (only these; from text-v4 Faktenliste)\n')
P('Names, places and numbers appear only as short labels (Inter caps) or serif numbers. Fixed strings: NEVER HEARD · NatureLM-audio · AZA RASKIN · CO-FOUNDER · INVENTED INFINITE SCROLL · $10M · REID HOFFMAN · NO LABELS · MICROPHONE · MOTION SENSORS · 12.5 G · FLYING · LANDING · FEEDING · PATTERNS → MEANING · TODAY · NOV 2026 · 2030 · OTHER TEAM · KENYA · EARTH SPECIES PROJECT · AMBOSELI · GREETING · CALF COMFORTED · ESP + UNIVERSITY OF LEÓN · 100,000+ CALLS · COPENHAGEN · ETH ZURICH · INRAE · BIRTH → SLAUGHTER · DOMINICA · PROJECT CETI · RHYTHM · TEMPO · STRETCH · EXTRA CLICK · GOOGLE · BAHAMAS · DolphinGemma · 40 YEARS · BERKELEY · COUCH / SOFA · TEL AVIV UNIVERSITY · 2026 · UPSET · HUNGRY · MOM/DAD · UNCLAIMED · COLLER DOLITTLE CHALLENGE · UP TO $10M · ALASKA · 20 MIN · ONE WHALE · ONE CALL · ONE TIME · WHAT CHANGES? · 1970 · 1982 · IWC · COMMERCIAL WHALING PAUSED · STILL IN FORCE · NO MEAT · 9 IN 100 · GERMANY 2025 · AGE 14–29 · PRICE · TASTE · FEELING · ICELAND · JUNE 2026 · FIN WHALES · THE MEAT PARADOX · BASTIAN ET AL. 2012 · SCENARIO · TARGET HIT · DAY 1 · YEAR 1 · YEAR 10 · REAL · SCI. REP. 2026 · DOMINICA · 13 WHALES · HE WHAKAPUTANGA MOANA · TOHORĀ ORANGA BILL · OTHER MINDS · SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY.')
P('Tablet slots (lib/f24_kit.mjs TABLET): NAMES · WHAT\'S GOING ON · CONTEXT · FEELINGS · PARTS · NEXT SOUND · IT\'S THERE, the middle MEANING stays empty.\n')
md = '\n'.join(out) + '\n'
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write(md)
print(f'{len(rows)} shots · explainer share {tot * 100:.1f} % · hard changes {len(cuts)} ({len(cuts) / (TM["duration"] / 60):.2f}/min) → docs/shots.md')
for i, (c, s0, b, n) in enumerate(chs):
    rs = [r for r in rows if chap(r[6])[0] == c]; print(f'  {c} {b} {ts(s0)} {share(rs) * 100:.0f} %')
