#!/usr/bin/env python3
"""Film 25 · the binding shot list -> docs/shots.md (times from the current timing: $TIMING, <ROOT>audio/timing.json, else
data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots25.py
Every shot: id, anchor = a VO phrase (looked up in the film after the previous shot's anchor; 'slot:J1' = a silent slot), one picture
(one motif per sentence), layer, carrier into the next shot, flags. Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (diagram made of film things: slabs, mini stones, light lines, serif numbers, quote cards) · ROW .6 (the task-stone row:
  a metaphor diagram with glyphs) · STUDIO .5 (Jakob's timeline wall: diagram + scene) · MIX .5 (scene with a diagram on it) ·
  SCENE 0 · CLIP 0 (interview footage).
Flags: W = a hard world change (a light-flood door or a cut; budget ~1 per minute) · ★ = the one wow moment of the chunk."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F25ROOT', '/mnt/project-files/scenario/film-last-human-job/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'ROW': .6, 'STUDIO': .5, 'MIX': .5, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'There will be a last'), ('c02', 'B1', 'Ten kinds of work'), ('c03', 'B1', 'Number nine'), ('c04', 'B1', 'Number seven'),
          ('c05', 'B2', "So here's the puzzle"), ('c06', 'B2', 'This channel exists for one reason'), ('c07', 'B2', 'Number five'),
          ('c08', 'B3', 'Number two'), ('c09', 'B3', "Number one isn't"), ('c10', 'B3', 'So how do you stay'), ('c11', 'B3', 'Every time the machine took a step#1')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('1.01', 'There will be a last', 'THE ROW on the night plain: tall task stones receding right, the near one made of warm light; you (yellow coat) small beside it; THE LAST HUMAN JOB left (= thumbnail A)', 'ROW', 'the camera glides along the faces', '★'),
 ('1.02', 'Think of something', 'the title sinks into its baseline; slow glide right along the stone faces', 'ROW', 'the glyphs on the faces', ''),
 ('1.03', 'An email', 'the glyphs on stones 1–3 light amber on their words: email, report, translation', 'ROW', 'a star detaches', ''),
 ('1.04', 'A machine can now', 'a cool bead drops from the sky and drains the three glyphs in seconds (they turn cool)', 'ROW', 'the bead parks in the sky', ''),
 ('1.05', 'Every job is a row', 'pull back: the whole row, a light bracket ONE JOB over it', 'EXPL', 'the far end of the row', ''),
 ('1.06', "And they're starting to fall", 'the cascade: far → near, heavy, each stone leans on the next, glyphs turn cool', 'ROW', 'the wave of falling runs toward the light', ''),
 ('1.07', 'So which human job', 'the stone of light stands; you look up at it', 'ROW', 'the bead in the sky', ''),
 ('1.08', 'This time, the machines', 'tilt up into the sky: FACTORY and DESK grow from two stars; the bead heads for the factory, swerves to the desk; the desk turns cool', 'EXPL', 'the bead lands on the desk', ''),
 ('1.09', 'Among young people', 'two light lines grow out of the desk (Stanford): LEAST EXPOSED rises, MOST EXPOSED falls; 19 % BEHIND · AGES 22–25', 'EXPL', 'the cool line runs on, down', ''),
 ('1.10', 'The creator of this channel', 'the cool line comes down onto a second row: Jakob\'s steps (TOPIC of light near, IDEA … MUSIC), all amber; the bead sits on MUSIC', 'ROW', 'TOPIC\'s light', ''),
 ('1.11', 'His name is Jakob', 'push into TOPIC\'s light → flood → out of the desk lamp', 'ROW', 'the light door (TOPIC = lamp)', 'W'),
 ('1.12', 'For fifteen years', 'the studio: Jakob at his desk under the lamp, the timeline wall; the year ruler 2011–2026 grows, the playhead fills the lanes by hand', 'STUDIO', 'the playhead', ''),
 ('1.13', 'Concepts', 'IDEA, SHOOT, EDIT, ANIMATION headers light on their words', 'STUDIO', 'the ruler', ''),
 ('1.14', 'And in all that time', 'the last four years of the ruler stretch and turn cool: 15 YEARS | 4 YEARS', 'EXPL', 'the header column', ''),
 ('1.15', 'slot:J1', 'J1: lower third JAKOB · CREATOR OF THIS CHANNEL; the headers light top → bottom as he names them, the camera follows down', 'STUDIO', 'MUSIC header', ''),
 ('1.16', 'A few years ago', 'the whole studio, every lane his, his hands at work', 'STUDIO', 'the lamp', ''),
 ('1.17', 'Today, a machine does', 'into the lamp → flood → out of TOPIC\'s light: his row falls far → near, a cool bead lifts off every step', 'ROW', 'the light door (lamp = TOPIC)', 'W'),
 ('1.18', "And yet, he's still here", 'TOPIC stands, Jakob beside it in its light = plateJakobRow', 'ROW', 'plateJakobRow', ''),
 # ---------------------------------------------------------------- c02 · B1
 ('2.01', 'Ten kinds of work', 'rise out of the plate: further down the plain the RANK ROW, ten numbered stones (No. 10 far … No. 1 of light near); the rank rail is born top left', 'ROW', 'the rank row', ''),
 ('2.02', 'The order is a judgment call', 'two thin lines along the row: MEASURED (light line) and ROBOTS TODAY (a small hand glyph), both short labels', 'EXPL', 'No. 10', ''),
 ('2.03', 'Number ten. The first', 'No. 10 close, it tips (rail too); THE FIRST JOB AT THE DESK', 'EXPL', 'the face of No. 10', ''),
 ('2.04', 'The junior coder', 'three glyphs on its face light on their words: code, chat, draft', 'EXPL', 'the face opens as a lit window', ''),
 ('2.05', "Most of them aren't being fired", 'through the window: an office at night, one young desk empty, the chair pushed in, the screen asleep (window fly-in, ≥ 2.5 s)', 'SCENE', 'the office door', ''),
 ('2.06', "They're just not being hired", 'the office door stays shut: a line of light under it, nobody comes in', 'SCENE', 'the door frame', ''),
 ('2.07', 'The economist who measured', 'the door frame grows into the clip plate → K1 Brynjolfsson', 'MIX', 'clip plate', ''),
 ('2.08', 'slot:K1', 'K1 (credits per zitatkarten.md), the picture still under the clip', 'CLIP', 'the plate shrinks back into the door', ''),
 ('2.09', 'And then the researchers found', 'two rows of mini stones: SENIOR stays full (amber), JUNIOR has gaps (cool dashed outlines)', 'EXPL', 'the senior row', ''),
 ('2.10', 'Companies still fight', 'a cool bead passes the junior gaps; the senior stones get a warm rim', 'EXPL', 'the gap', ''),
 ('2.11', "If you've been doing your work", 'a parent (amber) inside, a kid (small) outside a closed door of light', 'MIX', 'the door of light', ''),
 ('2.12', 'For Jakob, it also started', 'the door light becomes the desk lamp → the studio, the playhead scrubs back to 2022', 'STUDIO', 'light door', 'W'),
 ('2.13', 'slot:J2', 'J2: the first bead takes a piece of ANIMATION (images); everything else amber; small JAKOB lower third', 'STUDIO', 'the ANIMATION header', ''),
 ('2.14', 'A few pictures', 'the cool clips in ANIMATION, the rest by hand', 'STUDIO', 'the header slab', ''),
 ('2.15', 'But the next domino', 'the ANIMATION header slab tilts like a domino → match on the leaning No. 9 of the rank row', 'ROW', 'the leaning shape', 'W'),
 # ---------------------------------------------------------------- c03 · B1
 ('3.01', 'Number nine', 'No. 9 falls; THE VOICE', 'EXPL', 'the falling stone', ''),
 ('3.02', 'Translators, interpreters', 'voice / translate glyphs on its face', 'EXPL', 'the stone lands flat', ''),
 ('3.03', 'Microsoft studied', 'the fallen stone is the first slab of a ranking; slabs grow below it (Microsoft)', 'EXPL', 'the top slab', ''),
 ('3.04', 'Interpreters and translators landed', 'the top slabs: INTERPRETERS, TRANSLATORS, longest, cool', 'EXPL', 'down the slabs', ''),
 ('3.05', 'Writers and historians', 'WRITERS, HISTORIANS close behind', 'EXPL', 'down', ''),
 ('3.06', 'Roofers and dredge operators', 'the bottom: ROOFERS, DREDGE OPERATORS, short and amber; source line', 'EXPL', 'the shortest slab', ''),
 ('3.07', 'Jakob stopped booking', 'the shortest slab is a shelf in a voice booth: the empty booth, the microphone, the lamp off (window fly-in)', 'SCENE', 'the microphone', ''),
 ('3.08', "The voice you're hearing", 'a waveform of this very sentence runs in front of the microphone; no person', 'MIX', 'the waveform', ''),
 ('3.09', 'So if even a voice', 'the waveform settles into a line → the horizon of the rank row', 'ROW', 'the line', ''),
 ('3.10', 'Number eight', 'No. 8 tips; THE OFFICE ROUTINE; form, invoice, calendar glyphs on their words', 'EXPL', 'the ten glyphs', ''),
 ('3.11', 'In office and admin work', 'ten mini stones: nine get a cool dashed outline (COULD)', 'EXPL', 'the grid', ''),
 ('3.12', 'In practice', 'only a fraction tips (DID); SO FAR', 'EXPL', 'the tipped stone', ''),
 ('3.13', "But companies aren't waiting", 'two slabs: 2025 54,836 → 2026 121,401 (job cuts citing A.I.)', 'EXPL', 'the long slab', ''),
 ('3.14', 'So the desk is going early', 'back along the rank row: 10, 9, 8 lie', 'ROW', 'No. 7', ''),
 ('3.15', 'Surely the creative work', 'No. 7 with image, music, cut glyphs; it still stands', 'ROW', 'the face of No. 7', ''),
 # ---------------------------------------------------------------- c04 · B1
 ('4.01', 'Number seven', 'No. 7 tips; CREATIVE HANDWORK', 'EXPL', 'the image glyph', ''),
 ('4.02', 'Not really', 'into the image glyph\'s light → the studio, now', 'STUDIO', 'light door', 'W'),
 ('4.03', 'Images', 'beads take ANIMATION, MUSIC, SOUND, SHOOT on their words; on "Even the edit" the EDIT bead starts and hesitates', 'STUDIO', 'the EDIT bead', ''),
 ('4.04', 'slot:J3', 'J3: Jakob climbs the ladder to the first ledge (directing)', 'STUDIO', 'Jakob', ''),
 ('4.05', 'slot:J3b', 'J3b: the EDIT bead runs through; settle on plateStudio', 'STUDIO', 'plateStudio', ''),
 # ---------------------------------------------------------------- c05 · B2
 ('5.01', "So here's the puzzle", 'out of plateStudio: slow push on Jakob on his ledge, beads running below him', 'STUDIO', 'his ledge light', ''),
 ('5.02', "There's a profession", 'the ledge light opens as a window: a radiology lightbox with a scan (window fly-in)', 'MIX', 'the lightbox', ''),
 ('5.03', 'In 2016, Geoffrey Hinton', 'the Hinton card (QUOTES.hinton) rises from the lightbox', 'EXPL', 'the scan', ''),
 ('5.04', 'He was partly right', 'scan tiles: a cool bead reads them, many turn cool', 'EXPL', 'the tile row', ''),
 ('5.05', 'And yet, this year', 'a light line of training spots rises to a record: RECORD 1,241 · US MATCH 2026', 'EXPL', 'the line\'s head', ''),
 ('5.06', "Hospitals can't find enough", 'the line runs on; empty chairs at the lightbox', 'MIX', 'the lightbox', ''),
 ('5.07', 'Because a radiologist never', 'widen: the radiologist (amber) at the lightbox with a surgeon', 'SCENE', 'the two figures', ''),
 ('5.08', 'They talk to the surgeon', 'TALK · DECIDE · ANSWER FOR IT, three small labels on their words', 'MIX', 'the lightbox', ''),
 ('5.09', 'So the dominoes were never', 'pull back out of the window: the radiologist job is a stone that splits into a row of task stones (scan, talk, decide, carry)', 'ROW', 'the scan stone', '★'),
 ('5.10', 'The machine took over part', 'only the scan stone falls (cool); the others stand', 'ROW', 'the fallen scan stone', ''),
 ('5.11', 'The radiologist kept', 'the radiologist steps up onto the fallen stone', 'ROW', 'the step up', ''),
 ('5.12', 'slot:J4', 'J4 in the studio: STORYBOARD and SCRIPT taken, Jakob climbs to ledge 2', 'STUDIO', 'Jakob climbing', 'W'),
 ('5.13', 'Every time the machine took a step', 'the core sentence: a bead takes a lane, Jakob steps up a ledge, held calmly (no staircase of light)', 'STUDIO', 'the ledge lamp', ''),
 # ---------------------------------------------------------------- c06 · B2
 ('6.01', 'This channel exists for one reason', 'subscribe 1: a night ridge, a line of small people passes one warm lamp along', 'SCENE', 'the lamp', 'W'),
 ('6.02', 'Not just for a few', 'lamps along the whole ridge; one small line SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', 'SCENE', 'the ridge line', ''),
 ('6.03', 'From here on', 'the ridge line becomes the horizon of the rank row (10–7 lie)', 'ROW', 'the horizon', 'W'),
 ('6.04', "It's how much of it", 'the standing part of each stone glows: how much is left', 'EXPL', 'No. 6', ''),
 ('6.05', 'Number six', 'No. 6; ANALYSIS · RESEARCH · SOFTWARE', 'EXPL', 'the face of No. 6', ''),
 ('6.06', 'This is where the agents arrive', 'a chain of small stones (a workflow); one bead runs it start to finish', 'EXPL', 'the end of the chain', ''),
 ('6.07', 'One lab chief has warned', 'the Amodei card (paraphrase, no quote marks)', 'EXPL', 'the card', ''),
 ('6.08', "That's a forecast", 'FORECAST (dashed outline) vs MEASURED (solid: fewer hires)', 'EXPL', 'the solid slab', ''),
 ('6.09', 'But if agents can run', 'rank row: No. 6 lies; the camera on No. 5', 'ROW', 'No. 5', ''),
 # ---------------------------------------------------------------- c07 · B2
 ('7.01', 'Number five', 'No. 5 tips halfway; TEACHERS', 'EXPL', 'the teach glyph', ''),
 ('7.02', 'can already explain anything', 'a cool bead writes on a small board, glyphs of many languages', 'EXPL', 'the board', ''),
 ('7.03', "But a child doesn't learn", 'the board is in a classroom at dusk: teacher and child at a small desk, warm lamp (window fly-in)', 'SCENE', 'the lamp', ''),
 ('7.04', 'The explaining falls', 'two mini stones: EXPLAINING falls (cool), BELIEVING stays (amber)', 'EXPL', 'BELIEVING', ''),
 ('7.05', 'Number four', 'No. 4 tips less; DOCTORS', 'EXPL', 'the steth glyph', ''),
 ('7.06', 'More and more of the diagnosis', 'the diagnosis glyph turns cool; just like the scan (callback: the scan stone)', 'EXPL', 'the stone face window', ''),
 ('7.07', 'But someone still has to sit', 'a doctor sits at a bedside, stays (window fly-in)', 'SCENE', 'the bedside lamp', ''),
 ('7.08', 'And then the row slows down', 'back on the rank row: the stones tip less and less', 'ROW', 'No. 3', ''),
 ('7.09', 'Number three', 'No. 3; THE TRADES; electrician, plumber, roofer on their words', 'EXPL', 'the wrench glyph', ''),
 ('7.10', "What's easy for us", 'a flooded basement: the plumber\'s torch finds the rusted pipe (window fly-in)', 'SCENE', 'the torch circle', ''),
 ('7.11', 'The first humanoid robots', 'beside it: a clean factory hall, a robot repeats one task (cool)', 'SCENE', 'the basement again', ''),
 ('7.12', 'Your basement is not', 'back in the basement', 'SCENE', 'the torch circle', ''),
 ('7.13', 'Even the man who warned', 'the torch circle grows into the clip plate → K2 Hinton', 'MIX', 'clip plate', ''),
 ('7.14', 'slot:K2', 'K2, the picture still under the clip', 'CLIP', 'the plate shrinks into No. 3', ''),
 ('7.15', 'Notice the catch', 'No. 3 trembles: A LONG TIME · NOT FOREVER → plateRankRow', 'ROW', 'plateRankRow', ''),
 # ---------------------------------------------------------------- c08 · B3
 ('8.01', 'Number two', 'out of plateRankRow: No. 2 barely tips; CARE', 'EXPL', 'the care glyph', ''),
 ('8.02', 'The nurse who turns a patient', 'a nurse turns a patient at night; a child asleep, a carer (window fly-in)', 'SCENE', 'the night lamp', ''),
 ('8.03', "In Microsoft's study", 'the Microsoft slabs again, at the bottom: NURSING ASSISTANTS', 'EXPL', 'the short slab', ''),
 ('8.04', "Here, the human isn't just", 'two hands, the human is the gift', 'SCENE', 'the warm light', ''),
 ('8.05', 'So the work that lasts', 'the rank row: only 2 and 1 stand', 'ROW', 'TOPIC of Jakob\'s row (light)', ''),
 ('8.06', 'Which brings us back to Jakob', 'light door → the studio from STUDIO_CAM.top: Jakob on the top ledge', 'STUDIO', 'light door', 'W'),
 ('8.07', 'slot:J5', 'J5: Jakob conducts; every lane runs by agents except TOPIC', 'STUDIO', 'the lanes', ''),
 ('8.08', 'By hand, one film like this', '14 amber day tiles vs 1 cool tile', 'EXPL', 'the single tile', ''),
 ('8.09', 'Now agents do the production', 'beads run the lanes; he gives the direction (arms)', 'STUDIO', 'TOPIC', ''),
 # ---------------------------------------------------------------- c09 · B3
 ('9.01', "Number one isn't", 'out of TOPIC\'s light → the rank row: No. 1, the stone of light; the rail turns gold', 'ROW', 'light door', 'W'),
 ('9.02', "It's the one where we want a human", 'you step beside No. 1', 'ROW', 'a chess glyph on its face', ''),
 ('9.03', 'Computers have beaten', 'the chess glyph; 1997 · DEEP BLUE BEATS KASPAROV', 'EXPL', 'the year', ''),
 ('9.04', 'And chess has never been bigger', '≈10 MILLION A DAY: a counter of tiny figures', 'EXPL', 'the crowd', ''),
 ('9.05', 'Machines play each other too', 'two cool beads at a board, nobody watching; the crowd around two people', 'MIX', 'the crowd', ''),
 ('9.06', "It's the person who sits with you", 'three amber stones: sits with you, signs off, decides what\'s worth making', 'EXPL', 'the three stones', ''),
 ('9.07', "Those aren't tasks a machine", 'a cool dashed outline (COULD) around them; they stay amber', 'EXPL', 'No. 1', ''),
 ('9.08', "The last human job isn't the one", 'No. 1 of light, alone on the row', 'ROW', 'you', ''),
 # ---------------------------------------------------------------- c10 · B3
 ('10.01', 'So how do you stay', 'you walk along the row toward the standing stones', 'ROW', 'five stones rise', ''),
 ('10.02', 'First, judgment', '1 JUDGMENT: two stones, finished vs good; protects from: a button', 'EXPL', 'stone 2', ''),
 ('10.03', 'Second, directing', '2 DIRECTING: one goal splits into steps handed to beads, checked back (Jakob small, conducting)', 'MIX', 'stone 3', ''),
 ('10.04', 'Third, trust', '3 TRUST: three people linked by warm threads; protects from: price', 'EXPL', 'stone 4', ''),
 ('10.05', 'Fourth, hands plus a head', '4 HANDS + HEAD: the wrench + a cool bead in the pocket; the basement callback', 'EXPL', 'stone 5', ''),
 ('10.06', 'And fifth, learning in steps', '5 STEPS: one new step each time a stone falls', 'EXPL', 'the clip plate from stone 5', ''),
 ('10.07', 'Even Bill Gates calls this', 'K3 Gates (or the QUOTES.gates card if K3 is dropped)', 'MIX', 'clip plate', ''),
 ('10.08', 'slot:K3', 'K3, the picture still under the clip', 'CLIP', 'the plate shrinks into the row', ''),
 # ---------------------------------------------------------------- c11 · B3
 ('11.01', 'Every time the machine took a step#1', 'the ending row: all stones lie, one stands; you beside it', 'ROW', 'you', ''),
 ('11.02', 'So the last human job isn\'t waiting', 'the camera along the fallen row to its end, the open plain', 'ROW', 'the open plain', ''),
 ('11.03', "It's the step you take next", 'you take one step forward into the plain', 'ROW', 'your step', ''),
 ('11.04', 'slot:J6', 'J6: Jakob beside his TOPIC stone further along (callback 1.18)', 'ROW', 'two figures, two lights', ''),
 ('11.05', 'This channel exists so that', 'subscribe 2: the final row, tiny lamps wake on the horizon', 'ROW', 'end screen', ''),
 ('11.06', 'END', 'end screen 15 s: the row at rest, the right two thirds dark and quiet for the end cards', 'ROW', '—', ''),
]

norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
W = TM['words']; NW = [norm(w['w']) for w in W]
def find(phrase, after=-1.0, nth=0):
    q = [norm(x) for x in phrase.split() if norm(x)]; hit = 0
    for i in range(len(W) - len(q) + 1):
        if W[i]['s'] <= after: continue
        if all((NW[i + j].startswith(p) if j == len(q) - 1 else NW[i + j] == p) for j, p in enumerate(q)):
            if hit == nth: return W[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.1f}: {phrase!r}')
def at(anchor, after):
    if anchor == 'END': return TM['words'][-1]['e'] + .6
    if anchor.startswith('slot:'): return next(c['start'] for c in TM['clips'] if c['id'] == anchor[5:])
    p, _, n = anchor.partition('#')
    return find(p, -1 if n else after, int(n) if n else 0)
times, prev = [], -1.0
for s in SHOTS:
    t = at(s[1], prev - .01); times.append(t); prev = t
chunk_t = [0.0] + [at(c[2], -1) for c in CHUNKS[1:]]
dur = TM['duration']
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
rows, tot, wsum, cuts = [], 0.0, 0.0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
for k, s in enumerate(SHOTS):
    a, b = times[k], (times[k + 1] if k + 1 < len(SHOTS) else dur)
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[3]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[3]]
    cuts += 'W' in s[5]
    rows.append((c, s, a, d))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 25 · "The Last Human Job" · shot list (binding)\n')
L.append(f'Generated by `tools/shots25.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; slots `T.clip(id)`).\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · ROW .6 · STUDIO .5 · MIX .5 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f} per minute (budget ~1/min). Window fly-ins (camera pushes through a lit stone face or lamp into a scene and back) are continuous moves, not W; each ≥ 2.5 s.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk.\n')
L.append('## 2 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2].replace("#1", " (2nd)")} | {fmt(a)} | {fmt(b)} | {b - a:.0f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
grp = {}
for i, c in enumerate(CHUNKS):
    b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    g = grp.setdefault(c[1], [chunk_t[i], b]); g[1] = b
L.append('\n' + ' · '.join(f'**{k}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s)' for k, v in grp.items()) + '\n')
L.append('## 3 · Shots\n')
cur = None
for c, s, a, d in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | picture (one idea) | layer | carrier → next | |')
        L.append('|---|---|---|---|---|---|---|---|')
    anc = s[1].replace('#1', ' (2nd)')
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {s[2]} | {s[3]} | {s[4]} | {s[5]} |')
L.append('\n## 4 · Seams between the groups (lib/f25_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | Ten kinds of work | plateJakobRow (JR_CAM) | 1.18 settles on it | 2.01 rises out of it to the rank row |")
L.append("| B1 → B2 | So here's the puzzle | plateStudio (STUDIO_AFTER_J3B, home camera) | 4.05 settles on it | 5.01 pushes on Jakob |")
L.append("| B2 → B3 | Number two | plateRankRow (RR_CAM, No. 3 trembles) | 7.15 settles on it | 8.01 No. 2 barely tips |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries (c02/c03, c03/c04, c05/c06, c06/c07, c08/c09, c09/c10, c10/c11) belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones; wording from zitatkarten.md)\n')
L.append('- Title: THE LAST HUMAN JOB · bracket ONE JOB · FACTORY · DESK · LEAST EXPOSED · MOST EXPOSED · 19 % · BEHIND · AGES 22–25 · 2022 · 2026')
L.append('- Studio: TOPIC IDEA SCRIPT STORYBOARD SHOOT EDIT ANIMATION SOUND MUSIC · 2011 2022 2026 · 15 YEARS · 4 YEARS · JAKOB · CREATOR OF THIS CHANNEL')
L.append('- Rank: No. 10 … No. 1 · THE FIRST JOB AT THE DESK · THE VOICE · THE OFFICE ROUTINE · CREATIVE HANDWORK · ANALYSIS · RESEARCH · SOFTWARE · TEACHERS · DOCTORS · THE TRADES · CARE · WHERE WE WANT A HUMAN')
L.append('- Explainers: MEASURED · ROBOTS TODAY · SENIOR · JUNIOR · INTERPRETERS · TRANSLATORS · WRITERS · HISTORIANS · ROOFERS · DREDGE OPERATORS · NURSING ASSISTANTS · COULD · DID · SO FAR · 54,836 · 121,401 · 2025 · 2026 · RECORD 1,241 · TALK · DECIDE · ANSWER FOR IT · FORECAST · MEASURED · EXPLAINING · BELIEVING · A LONG TIME · NOT FOREVER · 1997 · ≈10 MILLION A DAY · 14 DAYS · 1 DAY · JUDGMENT · DIRECTING · TRUST · HANDS + HEAD · STEPS · SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY')
L.append('- Source lines: `F.SOURCES` (stanford, microsoft, anthropic, challenger, hinton, radiology, kasparov, chess) · cards: `F.QUOTES` (amodei: no quote marks; hinton; gates only if K3 is dropped) · clip credits: `F.CLIPS`.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
