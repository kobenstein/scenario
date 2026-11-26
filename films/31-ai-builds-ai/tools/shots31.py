#!/usr/bin/env python3
"""Film 31 · "Superhuman AI Is Coming Next Year" · the binding shot list -> docs/shots.md (times from the current timing:
$TIMING, <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json from vo-final). Edit the SHOTS table here, never docs/shots.md.
   python3 tools/shots31.py
Every shot: id (H = hook, 2…12 = the chunk, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the film after the
previous shot's anchor; 'slot:T2' = a clip / card slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6; 'ENDSCREEN' =
duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram over the night veil: the ladder big with labels, cards, rings, the gauge, the timeline, the swarm, numbers) ·
  MIX .5 (the foundry with a diagram on it: labels, tags, rung states read as information, the HUD) · WORLD .3 (the foundry itself) ·
  SCENE 0 (you, people, a moment) · CLIP 0 (original footage).
Flags: W = a hard world change (budget ≤ 1 per minute; the plan has none) · ★ = the one wow moment of the chunk · R = a rung changes state."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F31ROOT', '/mnt/project-files/scenario/film-ai-2027/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'WORLD': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'You may be using'), ('c02', 'B1', 'Picture a ladder'), ('c03', 'B1', 'At Google too'),
          ('c04', 'B1', "By Anthropic's own verdict"), ('c05', 'B1', 'Until this year'),
          ('c06', 'B1', 'This channel exists'), ('c07', 'B2', "So don't take Anthropic's word"), ('c08', 'B2', 'And for one group'), ('c09', 'B2', 'One point three years'),
          ('c10', 'B3', 'Their scenario, late'), ('c11', 'B3', 'Right now, the labs hold'), ('c12', 'B3', 'So how close is#1')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'You may be using', 'THUMBNAIL A (HOOK_CAM): a huge ladder of pure gold light rises from the workshop floor into the core of the next machine (top right, the light spills over the frame edge); you tiny at its foot, looking up; SUPERHUMAN / AI: 2027 left (heavy cream caps). Slow push up the ladder', 'SCENE', 'the title', '★'),
 ('H.02', 'Some insiders now forecast', 'the title holds; a small line rises under it: SOME INSIDERS\' FORECAST; on "superhuman" the core swells once (light, not text)', 'MIX', 'the core\'s pulse', ''),
 ('H.03', 'When you turn off the light', 'the title sinks; your bench lamp at the left flickers (anticipation) and goes OFF on "off" (the one hard accent); the camera pulls back and up (2.6 s): THE NIGHT FOUNDRY, the ring in its gantry, builders welding, carts rolling: the work goes on', 'WORLD', 'the thread', ''),
 ('H.04', 'Because A.I. is now building', 'a gold thread lights from the machine you use (left, on its plinth) to the builders; pulses run toward the new ring; labels: THE A.I. YOU USE · THE NEXT A.I.', 'MIX', 'the veil, the cards', ''),
 ('H.05', 'At one leading lab', 'night veil: ten code-change cards rise; nine turn gold one by one (written by its own A.I.), one stays cream; 9 OF 10 · source: >90 % OF CODE CHANGES · "WITH HUMAN GUIDANCE"', 'EXPL', 'the cream card', ''),
 ('H.06', 'People steer', 'the cream card lifts (PEOPLE STEER); on "The machine builds" the nine pulse (THE MACHINE BUILDS)', 'EXPL', 'the veil lifts', ''),
 ('H.07', 'So how close is', 'the veil lifts; the camera glides up the ladder to the ring; a paper tag HOW CLOSE? drops from the ring on a gold thread', 'MIX', 'the thread → the rail', ''),
 ('H.08', 'Close enough that last week', 'veil; the tag\'s thread draws the timeline rail 2025 … 2031 (A.I. THAT DOES THE RESEARCH ITSELF · WHEN?); six forecaster dots wait in 2028–2030; "Earlier": they slide left; "twenty twenty-seven": they land in the 2027 band; "All of them": the band lights · source: ALL SIX FORECASTERS …', 'EXPL', 'the band', '★'),
 ('H.09', 'Inside that same lab', 'the timeline sinks; the night town of agents rises row by row; the counter runs to ≈ 30,000 on "thirty thousand"; every window a working agent; "None of them human" · source: ≈30,000 AI AGENTS AT ONCE …', 'EXPL', 'the windows → the hall windows', ''),
 # ---------------------------------------------------------------- c02 · B1 · the ladder, rung 1, Tao Lin (T2)
 ('2.01', 'Picture a ladder', 'out of plateLadder: the ladder of light in the foundry, floor to core; "between today and that machine": a label TODAY at your feet, THAT MACHINE at the core; the light cools to metal rails, the five rungs rise as labels 1 CODE … 5 THE BRAKE', 'MIX', 'rung 1', ''),
 ('2.02', 'A.I. already stands on the first rung', 'the small climbing machine steps onto rung 1; rung 1 fills gold on "writing the code"', 'MIX', 'the top rung', 'R'),
 ('2.03', 'And the last rung decides', 'tilt up the ladder to rung 5 (the lever), cream, a little warm glow', 'MIX', 'the machine', ''),
 ('2.04', 'The lab is Anthropic', 'a gold label on the ring: ANTHROPIC; the two hook numbers return as small cards (9 OF 10 · ≈ 30,000) and get a stamp ITS OWN NUMBERS · source: ANTHROPIC\'S OWN REPORTS', 'EXPL', 'a builder\'s eye', ''),
 ('2.05', 'In a new interview', 'the camera finds one builder at the ring; its gold eye grows (the clip plate starts as that eye)', 'MIX', 'the eye → the plate', ''),
 ('2.06', 'slot:T2', 'CLIP T2 · TAO LIN · RESEARCHER AT ANTHROPIC · PERSONAL VIEW · NOV 15, 2026 · ORIGINAL FOOTAGE (PALISADE RESEARCH INTERVIEW)', 'CLIP', 'the plate → the eye', ''),
 ('2.07', 'In a year', 'the plate shrinks back into the eye; a tag IN A YEAR? hangs from the builder: ONE INSIDER\'S FORECAST', 'EXPL', 'the ladder', ''),
 ('2.08', 'So test it, rung by rung', 'the full ladder shrinks into the top-left corner and becomes THE LADDER HUD (it stays from here)', 'MIX', 'the HUD', ''),
 # ---------------------------------------------------------------- c03 · B1 · the fine print, rung 1 taken, science
 ('3.01', 'At Google too', 'paper card: GOOGLE DEEPMIND, OCT 2026 · AI WRITES >75 % OF PRODUCTION CODE', 'EXPL', 'the card turns', ''),
 ('3.02', 'But so far', 'the card turns to the fine print: "There is currently no clear end-to-end acceleration …" (a magnifier ring moves over it) · small: ≈88 % OF CHANGES STILL NEED HUMAN STEERING', 'EXPL', 'the HUD', ''),
 ('3.03', 'So the first step up the ladder', 'the HUD grows big for a moment: rung 1 TAKEN (stamp), then back to the corner ★', 'EXPL', 'the loop', '★ R'),
 ('3.04', "But typing code isn't science", 'the code cards slide away; three circles in a loop: GUESS → TEST → RESULT (science = finding out what works)', 'EXPL', 'a builder rolls in', ''),
 ('3.05', 'Can a machine do that too', 'a small builder rolls up to the loop; a ? tag swings above it', 'MIX', 'two benches', ''),
 # ---------------------------------------------------------------- c04 · B1 · rung 2 experiments
 ('4.01', "By Anthropic's own verdict", 'two benches side by side: a person (cream) and a builder (gold) run the same experiment; result bars grow equal · quote: "…match or outperform skilled humans at executing a well-specified experiment." · ANTHROPIC, SEPT 2026', 'EXPL', 'the gold bar', ''),
 ('4.02', 'Or better', 'the builder\'s bar ends a little longer', 'EXPL', 'a calendar', ''),
 ('4.03', 'A year ago', 'a calendar card OCT 2025; a tag on a gold thread: GOAL: AI RESEARCH INTERN · BY SEPT 2026 · SAM ALTMAN, OPENAI', 'EXPL', 'the page turns', ''),
 ('4.04', 'September came', 'the calendar turns to SEPT 2026: REPORTED AS REACHED (OPENAI) · NOT EXTERNALLY VERIFIED stamp · small: "SIGNIFICANT HUMAN STEERING"', 'EXPL', 'the HUD', ''),
 ('4.05', 'So the second rung', 'the HUD big: rung 2 TAKEN · ON THE LABS\' WORD ★', 'EXPL', 'the note', '★ R'),
 ('4.06', 'But listen to the condition', 'a paper note WELL-SPECIFIED passes from a cream hand to the builder: DESCRIBE IT CLEARLY', 'EXPL', 'the ladder', ''),
 ('4.07', 'So who decides which experiments', 'back in the foundry: the camera looks up to rung 3; a ? hangs there', 'MIX', 'your lamp', ''),
 # ---------------------------------------------------------------- c05 · B1 · rung 3 leading research
 ('5.01', 'Until this year', 'your lamp comes back ON on "people" (the human light); rung 3 glows cream', 'SCENE', 'the core → the ring', ''),
 ('5.02', 'In February', 'the share ring grows out of the ring machine\'s shape: FEB <1 % … "About a quarter": 26 % ★ · source: RESEARCH "LED BY" THE MODEL …', 'EXPL', 'three steps', '★'),
 ('5.03', 'works the way you use', 'three steps: YOU SET A ROUGH GOAL (cream) → IT DOES MOST OF THE WORK (gold) → YOU CHECK THE RESULT (cream)', 'EXPL', 'the quote', ''),
 ('5.04', 'But nowhere', 'paper card: "…not operating fully autonomously for any measured subset of AI R&D work." · ANTHROPIC, SEPT 2026', 'EXPL', 'the ? lamp', ''),
 ('5.05', 'And knowing which question', 'a cream ? lights: RESEARCH TASTE · HUMAN, FOR NOW', 'EXPL', 'the HUD', ''),
 ('5.06', 'So, rung three', 'the HUD big: rung 3 SHARED, its gold edge creeps a little further while we watch', 'EXPL', 'a poster', 'R'),
 ('5.07', 'The movies promised', 'a cinema-poster card ONE NIGHT, IN SECRET folds away; behind it the ladder in the foundry, one rung at a time', 'MIX', 'a headline', ''),
 ('5.08', 'So the next time a headline', 'a headline card A.I. IS BUILDING A.I.; a ? hops rung to rung on the HUD: ON WHICH RUNG?', 'EXPL', 'the climbing machine', ''),
 ('5.09', 'And then a second one', 'the camera pulls back: the climbing machine on the ladder: HOW FAST?', 'MIX', 'the wide foundry', ''),
 # ---------------------------------------------------------------- c06 · B2 · subscribe 1, how fast
 ('M.01', 'This channel exists', 'the foundry at work, wide (one take from 5.09); the hall windows light one by one (everybody)', 'WORLD', 'the builders', ''),
 ('M.02', 'Including the part where machines', 'builders weld the next plate, sparks; you small under it', 'WORLD', 'the HUD', ''),
 ('6.01', 'How fast? For you', 'the HUD returns; a small gauge needle beside it trembles; card: TIME LEFT TO AGREE ON THE RULES; it sinks, the camera settles wide → plateClimb', 'MIX', 'plateClimb', ''),
 # ---------------------------------------------------------------- c07 · B2 · the evaluators, 1.9×, the critics
 ('7.01', "So don't take Anthropic's word", 'out of plateClimb: cool-lit figures with badges step in at the hall door; card: INDEPENDENT EVALUATORS (METR) INSIDE ANTHROPIC · "ANTHROPIC CAN\'T VETO PUBLICATION."', 'MIX', 'the gauge', ''),
 ('7.02', 'Their estimate', 'the speed gauge: the needle swings to ≈ 1.9× (range band 1.5–2.8) ★ · ON BENCHMARKS · source METR', 'EXPL', 'the band', '★'),
 ('7.03', 'And most of that', 'the band splits: ≈80 % FROM PUTTING A.I. TO WORK (gold) · HUMANS IN THE LOOP', 'EXPL', 'the cards', ''),
 ('7.04', 'But look at where these numbers', 'all numbers so far as small cards (9 OF 10 · ≈ 30,000 · AS WELL AS A SKILLED HUMAN · <1 % → 26 % · ≈ 1.9×); each gets the stamp SOURCE: THE LAB', 'EXPL', 'a price tag', ''),
 ('7.05', 'And this lab is going public', 'the veil thins: a tag on a gold thread hangs from the ring: IPO · THIS WEEK; "Speed sells": the tag turns to $', 'MIX', 'the report', ''),
 ('7.06', 'The evaluators say', 'the evaluators\' report, most lines blacked out · quote: "Anthropic redacted a majority of the evidence we found most informative …" · METR, NOV 5, 2026', 'EXPL', 'the scale', ''),
 ('7.07', 'And outside critics', 'two bars: SPENDING 6.19× | PACE 1.91× · IMAS & GARICANO · "nothing causal can be inferred"', 'EXPL', 'two trays', ''),
 ('7.08', "So here's what the evidence supports", 'two trays: LOOKS REAL (gold) | OPEN FIGHT: HOW BIG? HOW MUCH IS THE MACHINE? (cool)', 'EXPL', 'a calendar page', ''),
 # ---------------------------------------------------------------- c08 · B2 · AI 2027, Kokotajlo, Tao Lin (T1a)
 ('8.01', 'And for one group', 'a calendar page tears off and becomes the timeline rail (the hook\'s timeline returns)', 'EXPL', 'the rail', ''),
 ('8.02', "They're the people behind", 'a paper card AI 2027 · A SCENARIO (APRIL 2025) pinned on the rail', 'EXPL', 'the marker', ''),
 ('8.03', 'As late as August', 'Kokotajlo\'s marker at END 2028 (AUG 2026)', 'EXPL', 'the report', ''),
 ('8.04', "Then the evaluators' report", 'the gauge card drops onto the rail; "May, twenty twenty-seven": the marker slides to MAY 2027 (a dashed trail stays) ★; "everyone on his team": five more land in the band · ALL SIX MEDIANS: MAY–NOV 2027', 'EXPL', 'the band → the ring', '★'),
 ('8.05', 'Their date marks one machine', 'the band rises into the ring machine; label at the core: A SUPERHUMAN A.I. RESEARCHER', 'MIX', 'a builder\'s eye', ''),
 ('8.06', 'Tao Lin again', 'a builder\'s eye grows (the plate starts as it)', 'MIX', 'the plate', ''),
 ('8.07', 'slot:T1a', 'CLIP T1a · TAO LIN · RESEARCHER AT ANTHROPIC · PERSONAL VIEW (33 s: the plate holds; the HUD sinks)', 'CLIP', 'the plate stays', ''),
 # ---------------------------------------------------------------- c09 · B2 · 1.3 years, T1b, rung 3 forecast, the record
 ('9.01', 'One point three years', 'the plate steps back (smaller, left); a card 1.3 YEARS? · TIMELINES TO WHAT?', 'EXPL', 'the plate grows again', ''),
 ('9.02', 'slot:T1b', 'CLIP T1b · TAO LIN (same plate)', 'CLIP', 'the plate → a pin', ''),
 ('9.03', 'The end of next year', 'the plate shrinks into a pin on the timeline: TAO LIN · END 2027, inside the forecasters\' band ★ · ONE INSIDER\'S VIEW, NOT AN OFFICIAL ONE', 'EXPL', 'the HUD', '★'),
 ('9.04', "On the ladder, that's rung three", 'the HUD big: rung 3 dashed FORECAST: TAKEN NEXT YEAR; in the foundry the builders start building builders ("machines can design the machines")', 'MIX', 'a scorecard', 'R'),
 ('9.05', 'Should you believe the forecasters', 'their scorecard: ✓ A.I. HELPS BUILD A.I. · ✗ STOCKS UP 30 % · ✗ MASS PROTESTS', 'EXPL', 'a tag', ''),
 ('9.06', "And they aren't neutral", 'a tag on the AI 2027 card: THEY WANT A PAUSE', 'EXPL', 'the quote', ''),
 ('9.07', "So it's a forecast", 'quote: "…assuming no substantial deliberate slowdown" · AI FUTURES PROJECT, NOV 10, 2026', 'EXPL', 'the fork', ''),
 ('9.08', 'And that condition', 'the timeline rail splits in two at 2027; the veil lifts onto the ring machine, nearly finished → plateMachine', 'MIX', 'plateMachine', ''),
 # ---------------------------------------------------------------- c10 · B3 · the scenario, the vote, rungs 4 + 5, K3
 ('10.01', 'Their scenario, late', 'out of plateMachine: the stamp SCENARIO · 2027 (AI 2027, PUBLISHED APRIL 2025) rolls in top left; the ring big, builders fast', 'MIX', 'the month pages', ''),
 ('10.02', 'Inside one lab', 'the builders speed up, month cards flip past the ring: A YEAR OF PROGRESS EVERY WEEK', 'MIX', 'the pupil', ''),
 ('10.03', 'And it has begun to follow goals', 'the core\'s pupil turns away from you, slowly (no threat imagery: one look)', 'WORLD', 'the table', ''),
 ('10.04', 'Then everything comes down', 'night veil: a committee table, ten seats; the vote lights seat by seat: 6 : 4 ★', 'EXPL', 'the fork', '★'),
 ('10.05', 'In one ending', 'the fork: left path rises into gold light with no people (THE RACE GOES ON); right path slower, people at the rail (SLOW DOWN · OVERSIGHT) · small: THE AUTHORS: A STORY, NOT A RECOMMENDATION', 'EXPL', 'the ladder', ''),
 ('10.06', "It's a story", 'the full ladder with labels: NOT CODE · NOT EXPERIMENTS · NOT EVEN RESEARCH: rungs 1–3 dim one by one', 'EXPL', 'rungs 4 + 5', ''),
 ('10.07', 'The top of the ladder', 'rungs 4 + 5 glow cream: 4 THE GOAL (the flag) on "choosing the goal" · 5 THE BRAKE (the lever) on "when to stop"', 'EXPL', 'TODAY', 'R'),
 ('10.08', 'Back to today', 'stamp TODAY; back in the foundry, LADDER_CAM: two cream hands on rungs 4 and 5 (people hold both)', 'MIX', 'the quote card', ''),
 ('10.09', 'But holding a rung', 'the quote card K3 slides out of the lever\'s light: "no lab has solved alignment and monitoring to a sufficient degree to continue responsibly scaling at maximum speed for much longer." (spoken part lights word by word) · JAKUB PACHOCKI …', 'EXPL', 'the lever', ''),
 ('10.10', 'So who holds the last rung', 'the lever on rung 5, close; you small below; a ? swings on the lever', 'MIX', 'the town', ''),
 # ---------------------------------------------------------------- c11 · B3 · the monitor, the auditors, T3, the stop
 ('11.01', 'Right now, the labs hold', 'the night town of agents again; the MONITOR EYE opens above it, its cool cone sweeps ★ · source: MONITOR CHECKS 100 % OF AGENT ACTIONS …', 'EXPL', 'flagged cases', '★'),
 ('11.02', 'About fifty cases', 'a few cases light cream and travel to a person: ≈ 50 A WEEK', 'EXPL', 'the eye', ''),
 ('11.03', "But that's a lab checking itself", 'the eye looks at the lab\'s own ring; the evaluators (cool) step in: WHO CHECKS THE LAB?', 'EXPL', 'a document', ''),
 ('11.04', 'This fall', 'a document with signatures: WHITE HOUSE ACCORD, SEPT 29, 2026 · OUTSIDE AUDITS: PROMISED · NOT REQUIRED (stamp on "Not required")', 'EXPL', 'the lever', ''),
 ('11.05', 'And the stop itself', 'the lever on rung 5; a builder\'s eye beside it grows into the plate', 'MIX', 'the plate', ''),
 ('11.06', 'slot:T3', 'CLIP T3 · TAO LIN · RESEARCHER AT ANTHROPIC · PERSONAL VIEW', 'CLIP', 'the plate → the gauge', ''),
 ('11.07', 'Briefly', 'the plate shrinks into the gauge: the needle sinks to ≈ ¼ OF TODAY\'S PACE (his wish); small: SLOWING ALONE BUYS ONE OR TWO YEARS', 'EXPL', 'a rule book', ''),
 ('11.08', 'So the stop has to be agreed', 'a paper rule book: AGREED IN ADVANCE', 'EXPL', 'two cards', ''),
 ('11.09', 'Here, even rivals', 'two cards: OPENAI\'S CHIEF SCIENTIST: MANDATORY SAFETY RULES | ANTHROPIC: THE OPTION TO PAUSE · RULES SET BEFOREHAND · OUTSIDERS AT THE TABLE', 'EXPL', 'the table', ''),
 ('11.10', 'That includes the people', 'a long table, one free seat; you sit down and lay a note: WHO CHECKS THE LABS? · WHO CAN CALL A STOP?', 'SCENE', 'the foundry', ''),
 ('11.11', 'Machines now do the building', 'the foundry wide: builders build (gold); the top rungs cream; you at the foot', 'WORLD', 'the ladder', ''),
 # ---------------------------------------------------------------- c12 · B3 · the answer, the last rung, subscribe 2, end screen
 ('12.01', 'So how close is#1', 'LADDER_CAM: the whole ladder with labels', 'MIX', 'the rungs', ''),
 ('12.02', 'Two rungs', 'rungs light with the words: 1 + 2 gold · 3 half + dashed FORECAST · 4 + 5 cream, IN HUMAN HANDS; "only holds if nobody chooses to slow down": the dashed outline flickers', 'EXPL', 'your lamp', 'R'),
 ('12.03', 'When you turn off the light tonight#1', 'your lamp goes off again (same accent as the hook); the foundry keeps building', 'WORLD', 'the thread', ''),
 ('12.04', 'You may be using one#1', 'the machine you use, close (OLD_CAM); the thread to the next one; "design its own successor": builders build builders', 'WORLD', 'the lever', ''),
 ('12.05', "Whether it's allowed to", 'you climb to the top of the ladder and put your hand on the lever (rung 5) ★', 'SCENE', 'the pull back', '★'),
 ('12.06', "That's the last rung", 'pull back: you tiny at the top of the ladder, the two top rungs cream in the gold light: THE LAST RUNG IS STILL OURS', 'MIX', 'the foundry', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2: the foundry at night, all hall windows warm, your lamp back on', 'WORLD', 'the end camera', ''),
 ('A.02', 'END', 'quiet: the camera settles into END_CAM (music carries)', 'WORLD', 'end screen', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s: S.END_CAM: the ring big and calm top centre, you small on the floor at the left, the dark floor carries the two tiles + subscribe circle (S.END_TILES); no text', 'WORLD', '—', ''),
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
    if anchor == 'END': return W[-1]['e'] + .6
    if anchor == 'ENDSCREEN': return TM['duration'] - 15
    if anchor.startswith('slot:'): return next(c['start'] for c in TM['clips'] if c['id'] == anchor[5:])
    p, _, n = anchor.partition('#')
    return find(p, -1 if n else after, int(n) if n else 0)
times, prev = [], -1.0
for s in SHOTS:
    try: t = at(s[1], prev - .01)
    except SystemExit:   # a line the sound agent has not re-taken yet: keep the order, warn (re-run when timing.json follows)
        t = prev + .01; print(f'  WARN {s[0]}: {s[1]!r} not in the timing yet (placed at {t:.1f} s)')
    times.append(t); prev = t
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
    cuts += 'W' in s[5].split()
    rows.append((c, s, a, d))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 31 · "Superhuman AI Is Coming Next Year" · shot list (binding)\n')
L.append(f'Generated by `tools/shots31.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO, 16.11."}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'The fact check may still change a few spoken lines: anchors are phrases, so the code does not care; if a phrase goes missing, `T.G` says which one.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · WORLD .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. One world (THE NIGHT FOUNDRY): explainers float over a night veil while the camera keeps gliding behind it; clips grow out of a builder\'s eye and go back into it.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. R = a rung changes state (`F.ladderHUD` does it from `F.LADDER` phrases; full-frame ladders use the same states).')
clip = sum(c['end'] - c['start'] for c in TM['clips'] if not c.get('under'))
L.append(f'- Clips: {clip:.1f} s = {clip / dur * 100:.1f} % of {dur:.0f} s (limit 10 %).\n')
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
L.append('\n## 4 · Seams between the groups (lib/f31_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | Picture a ladder | plateLadder (LADDER_CAM: the whole ladder of pure gold light, floor to core; you at the foot; your lamp OFF; hall .7) | H.09: the swarm\'s windows become the hall windows as the veil lifts | 2.01: the light cools to metal, the labels rise |")
L.append("| B1 → B2 | So don't take Anthropic's word | plateClimb (WIDE_CAM: rungs 1, 2 gold, 3 half, 4, 5 cream, no labels; your lamp ON; hall .5; the HUD top left) | 6.01: the card TIME LEFT … sinks, the camera settles wide | 7.01: the evaluators step in at the hall door |")
L.append("| B2 → B3 | Their scenario, late | plateMachine (MACH_CAM: the ring nearly done, build .94, glow 1.15; no veil; the HUD) | 9.08: the rail splits, the veil lifts onto the ring | 10.01: the SCENARIO · 2027 stamp rolls in |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Wording: vo-final.txt (fact check 17.11.) + text-v2.md Einblendungen as far as vo-final keeps them; shortened to ≤ 6 words per statement where possible, numbers exactly as there. Sources live in `F.SOURCES` (lib/f31_kit.mjs). A new string needs a line in faktenzettel.md; say so in your report.')
L.append('- Fact-check wording (binding): "SOME INSIDERS" (never "insiders" alone) · Tao Lin = "RESEARCHER AT ANTHROPIC · PERSONAL VIEW" (never "speaking for himself") · METR 1.9× always with "ON BENCHMARKS" · Tao\'s timeline "NOT AN OFFICIAL ONE" · AI 2027 record "STOCKS UP 30 %" (not "a stock boom") · the speed-up "LOOKS REAL".')
L.append('- **No QR anywhere.** No support / donation overlay. The model\'s name is not on screen (disclosure goes in the description).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
