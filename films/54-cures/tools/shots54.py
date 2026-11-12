#!/usr/bin/env python3
"""Film 54 · "AI Just Gave Disease a 10-Year Deadline" · the binding shot list -> docs/shots.md (times from the current timing: $TIMING,
<ROOT>audio/timing.json, else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots54.py
Every shot: id (station.n; H = hook, 1…8 = the stations, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the
film after the previous shot's anchor; 'slot:C3' = a clip / card slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (diagram made of museum things: labels, the two dates, the board, mint lines, dot fields, slabs, serif numbers, wall text) ·
  MIX .5 (a hall scene with a diagram on it) · HALL .3 (the hall of relics itself: an anchor, its plaques and vitrines explain a little) ·
  SCENE 0 (a diorama / a room / people) · CLIP 0 (original footage / audio).
Flags: W = a hard world change (budget < 1 per minute; glass fly-ins are continuous, not W) · ★ = the one wow moment of the chunk ·
  B = the deadline board changes on this shot (a row lights, an answer, a verdict) · Q = inside a QR window (top-right corner quiet)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F54ROOT', '/mnt/project-files/scenario/film-heilung/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'HALL': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Artificial intelligence just gave'), ('c02', 'B1', "He didn't invent it"), ('c03', 'B1', "Less than a decade that's"),
          ('c04', 'B1', 'Then the body answers'), ('c05', 'B1', 'Heart disease answers twice'),
          ('c06', 'B2', 'The third disease answers fast'), ('c07', 'B2', 'The changes in the brain'), ('c08', 'B2', "But the race doesn't start"), ('c09', 'B2', 'The cardiologist'),
          ('c10', 'B3', 'He even warned of a jam'), ('c11', 'B3', 'In other trials'), ('c12', 'B3', 'If the machines make'), ('c13', 'B3', 'Investors are already')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'Artificial intelligence just gave', 'THUMBNAIL A: the night hall, vitrine 1 huge with the mint cancer cell, you (yellow coat) tiny in front looking up; AI GAVE DISEASE / A DEADLINE left; DEADLINE: 2036 slams onto the glass on "deadline"; the silent proof line (quote, name, date)', 'HALL', 'you turn left', ''),
 ('H.02', 'Think of the last time', 'the camera glides left to the diorama A DOCTOR\'S OFFICE · 2026 and pushes through its glass: a doctor sits down behind the desk, you beside someone you love, a hand on their shoulder', 'SCENE', 'the desk', ''),
 ('H.03', "Or Alzheimer's", 'word cards fall onto the desk on their words: CANCER (on "cancer") · ALZHEIMER\'S · HEART DISEASE · DEPRESSION', 'SCENE', 'out of the glass', ''),
 ('H.04', 'Now picture your grandkids', 'pull back out of the glass: the office ages into a relic (cream-grey, cards yellowed); two small children walk past it', 'HALL', 'the kids walk left', ''),
 ('H.05', 'Something from a history book', 'the kids stop at the plague mask vitrine (THE PLAGUE · A RELIC)', 'HALL', 'the four cards', ''),
 ('H.06', 'So which of these', 'the four aged cards lift out of the diorama and fly with the camera to a row above vitrine 1, a mint ? after each; HISTORY BY THE DEADLINE?; they drop onto the four plinth plaques (the names)', 'MIX', 'the CANCER plaque', ''),
 ('H.07', 'The machines can find', 'push to the plaque; it grows into a panel: FINDING (molecules appear one after another, cool sparks) | THE BODY (a person in a scanner ring, one slow breath)', 'EXPL', 'the panel', ''),
 ('H.08', 'Every cure has two dates', 'the panel becomes THE LABEL: EVERY CURE · FOUND (mint stamp on "found") · PROVEN (blinks on "proven")', 'EXPL', 'clone', ''),
 ('H.09', 'And for each of these diseases', 'the label clones into four (CANCER · HEART DISEASE · MENTAL ILLNESS · ALZHEIMER\'S), the hall wide behind; wait tracks: CANCER proven in WEEKS, ALZHEIMER\'S inches, DECADES, the room breathes darker and lighter (years, no clock)', 'EXPL', 'the labels go home', '★'),
 ('H.10', 'That deadline comes from', 'the four labels shrink into their plaques; the camera trucks right past the vitrines to the wall panel; the credit rises on "Dario Amodei"', 'MIX', 'the wall text', ''),
 ('H.11', 'slot:C1', 'C1 (read by the narrator): the wall text lights word by word · DARIO AMODEI · ANTHROPIC IPO ROADSHOW VIDEO · NOV 10, 2026', 'EXPL', 'the text block', ''),
 ('H.12', 'He runs Anthropic', 'the quote folds into a drawn video frame IPO ROADSHOW VIDEO · NOV 10, 2026 (no footage, no person); MADE TO SELL SHARES', 'MIX', 'the frame', ''),
 ('H.13', "This isn't about whether", 'bracket NOT INVESTMENT ADVICE; the camera settles on the frame + the lectern → plateRoadshow', 'MIX', 'plateRoadshow', ''),
 # ---------------------------------------------------------------- c02 · B1 · the promise, fair
 ('1.01', "He didn't invent it", 'out of plateRoadshow: glide right to the lectern; the essay opens: MACHINES OF LOVING GRACE · DARIO AMODEI · OCT 2024', 'MIX', 'the open pages', ''),
 ('1.02', 'With small print', 'a magnifier glides over the small print: still unreadable', 'EXPL', 'the page', ''),
 ('1.03', 'And his reasoning', 'two trial lanes grow out of the page: on one an effect trembles barely above zero and needs an endless row of patients', 'EXPL', 'lane 2', ''),
 ('1.04', 'When something works really well', 'on the second lane the effect jumps steeply; after a few patients the line is reached', 'EXPL', 'the steep lane', ''),
 ('1.05', 'Earlier this year, on a podcast', 'glide right to the media kiosk (bench, dark screen); the screen wakes; push in', 'MIX', 'the screen', ''),
 ('1.06', 'slot:C3', 'the screen grows into the clip plate: C3 DARIO AMODEI · CEO, ANTHROPIC · FEB 2026 · ORIGINAL FOOTAGE · DWARKESH PODCAST', 'CLIP', 'the plate shrinks', ''),
 ('1.07', 'So even in his view', 'the plate shrinks into the screen; its last line NOT INSTANT, NOT INFINITELY FAST stays as a mint line', 'EXPL', 'the mint line', ''),
 # ---------------------------------------------------------------- c03 · B1 · the deadline board, the lab
 ('2.00', "Less than a decade that's", 'the mint line folds into THE BOARD (top left): DEADLINE: 2036 · OUR CONVERSION OF "LESS THAN A DECADE" (NOV 2026) · CANCER · HEART · MIND · ALZHEIMER\'S · ANSWERS IN … empty', 'EXPL', 'the four rows', 'B'),
 ('2.01', 'Four diseases, and one question', 'pull back along the four vitrines: each lights a little as its row is read', 'MIX', 'the ANSWERS IN column', ''),
 ('2.02', 'When a medicine really works', 'a mint ? in the empty ANSWERS IN column', 'EXPL', 'the CANCER row', ''),
 ('2.03', 'The fastest clear answer', 'board row CANCER lights; push to vitrine 1', 'HALL', 'the glass of vitrine 1', 'B'),
 ('2.04', 'In the lab, the day', 'through the glass into a lab at night (mint light); on the CANCER label the FOUND row fills a little', 'SCENE', 'the cell', ''),
 ('2.05', "Doctors can rebuild a patient's", 'an immune cell grows small hooks on its surface and swims toward the cancer cell', 'EXPL', 'a hook', ''),
 ('2.06', 'Artificial intelligence now helps', 'on a lab screen a few variants of the receptor\'s inner part (no speed motif, the hook tip unchanged); one design wins: the cell then carries visibly more hooks: ONE AI-PROPOSED DESIGN · ≈ 10× MORE RECEPTORS · LAB TESTS ONLY', 'EXPL', 'the dish', ''),
 ('2.07', 'All still in the lab', 'the lid of a petri dish closes over the hooks', 'SCENE', 'the round lid', ''),
 # ---------------------------------------------------------------- c04 · B1 · cancer answers in weeks
 ('2.08', 'Then the body answers', 'the round lid becomes a scan: two scans side by side, the tumour shrinks between them; board CANCER · WEEKS', 'EXPL', 'the capsule', 'B'),
 ('2.09', "That's how one pill won approval", 'a capsule; behind it 55 small figures in twelve colour groups, three in four light mint; the steep lane from 1.04 flashes: LAROTRECTINIB · 55 PATIENTS · 12 CANCER TYPES · 75 % RESPONDED', 'EXPL', 'the cell', '★'),
 ('2.10', "But cancer isn't one disease", 'the one cell splits into more than a hundred shapes; some deform and dodge the hooks: 100+ TYPES OF CANCER', 'EXPL', 'back to the lectern', ''),
 ('2.11', 'His own essay said so', 'the magnifier makes the small print readable: "…elimination of most cancer…" · "…rare, difficult malignancies persists."', 'EXPL', 'the word most', ''),
 ('2.12', 'The line in the sales video', 'the wall text C1 beside it: "cancer" glows mint, a gap before it where the essay says "most"', 'EXPL', 'the board', ''),
 ('2.13', 'So cancer, by the deadline', 'board CANCER · WEEKS · ✓ MANY KINDS (on the verdict words)', 'MIX', 'the HEART row', 'B'),
 ('2.14', 'But is a fast answer', 'board row HEART starts to glow; truck to vitrine 2', 'HALL', 'vitrine 2', 'B'),
 # ---------------------------------------------------------------- c05 · B1 · heart disease answers twice + subscribe 1
 ('3.01', 'Heart disease answers twice', 'vitrine 2: heart and liver as two glowing organs, joined by a vessel', 'HALL', 'the liver', ''),
 ('3.02', 'First, the blood', 'an infusion bag, one single drop; in the liver a gene switch flips: CTX310 · NEJM, NOV 2025 · 15 PEOPLE · ONE INFUSION', 'EXPL', 'the LDL column', ''),
 ('3.03', 'At the highest dose', 'an LDL column sinks to half: LDL ≈ −50 % · HIGHEST DOSE · DAY 60; board HEART · WEEKS', 'EXPL', 'the life band', 'B'),
 ('3.04', 'One treatment, meant to last', 'one infusion, beside it a life band that runs on without another drop', 'EXPL', 'the band becomes DNA', ''),
 ('3.05', 'But a change to your DNA', 'a DNA strand with a lasting mark; a long path along which one figure is accompanied for years: FDA: UP TO 15 YEARS FOLLOW-UP', 'EXPL', 'the path widens', ''),
 ('3.06', 'And whether the heart attacks', 'THE STADIUM: thousands of small figures fill the stands, seasons pass over them as light, a heart beats calmly: E.G. FOURIER: 27,564 PATIENTS · MEDIAN 2.2 YEARS', 'EXPL', 'the board', '★'),
 ('3.07', 'So heart disease, by the deadline', 'board HEART · WEEKS · YEARS · ½', 'MIX', 'the doorway', 'B'),
 ('M.01', 'This channel exists', 'subscribe 1: the lit doorway in the back wall opens onto a hospital corridor at night, a warm open door, a bed and someone beside it; the top-right corner stays dark wall (QR)', 'SCENE', 'the door light', 'Q'),
 ('M.02', 'Want that too', 'the door light breathes; the camera drifts right to vitrine 3 → plateMind', 'HALL', 'plateMind', 'Q'),
 # ---------------------------------------------------------------- c06 · B2 · the mind answers fast, but faint
 ('4.01', 'The third disease answers fast', 'out of plateMind: board MIND lights; inside vitrine 3 a microphone before a field of noise', 'EXPL', 'the noise', 'B Q'),
 ('4.02', 'Take depression', 'two groups in a waiting room; in both, faces lighten, also with the sugar pill; board MIND · WEEKS, BUT FAINT', 'SCENE', 'the people become cards', 'B Q'),
 ('4.03', 'Even for the antidepressants', '74 small cards, a little over half turn mint: 38 OF 74 TRIALS POSITIVE (51 %) · FDA REVIEWS', 'EXPL', 'one card', ''),
 ('4.04', "And there's no blood test", 'an empty blood tube beside a questionnaire with boxes', 'EXPL', 'the essay', ''),
 ('4.05', "That doesn't make it hopeless", 'the essay page: "Most mental illness can probably be cured." · AMODEI, OCT 2024', 'EXPL', 'the board', ''),
 ('4.06', 'So mental illness, by the deadline', 'board MIND · ?; beside it the scan from 2.08 and an empty frame (the mind waits for its scan)', 'EXPL', 'the ALZHEIMER\'S row', 'B'),
 ('4.07', 'And then the fourth disease', 'board row ALZHEIMER\'S glimmers, ANSWERS IN stays empty; glide to vitrine 4', 'HALL', 'the brain', 'B'),
 ('5.00', "Alzheimer's", 'vitrine 4: a brain of mint lines', 'HALL', 'the brain', ''),
 # ---------------------------------------------------------------- c07 · B2 · Alzheimer's answers in decades
 ('5.01', 'The changes in the brain', 'in the brain a tiny point glows and grows very slowly: CHANGES CAN BEGIN 20+ YEARS BEFORE SYMPTOMS', 'EXPL', 'the point', 'B'),
 ('5.02', 'That means many people', 'a busy street of today; in some passers-by the same faint point glows', 'MIX', 'the healthy group', ''),
 ('5.03', 'So the medicine has to come', 'a group of healthy people counted year by year; a tally grows', 'EXPL', 'the tally', ''),
 ('5.04', 'One such trial waited', 'the tally runs for almost five years, at its end a crossed-out vial: A4 (SOLANEZUMAB) · 240 WEEKS · FAILED', 'EXPL', 'the lectern', ''),
 ('5.05', 'And for those already sick', 'the magnifier on the essay: "…may be very difficult to reverse."', 'EXPL', 'the wall text', ''),
 ('5.06', "The line in the sales video doesn't", "the wall text C1: \"Alzheimer's\" glows, no caveat", 'EXPL', 'the board', ''),
 ('5.07', "So Alzheimer's, by the deadline", "board ALZHEIMER'S · DECADES · ✗", 'MIX', 'the blood tube', 'B'),
 # ---------------------------------------------------------------- c08 · B2 · the race starts now · the pitch · C5
 ('5.08', "But the race doesn't start", 'a blood tube lights mint: FIRST ALZHEIMER\'S BLOOD TEST CLEARED · FDA, MAY 2025 · FOR PEOPLE WITH SYMPTOMS, 55+', 'EXPL', 'the wall panel', ''),
 ('5.09', "So if the machines aren't", 'back at the wall panel: NOV 10, 2026 under the roadshow frame lights', 'MIX', 'the date', ''),
 ('6.01', 'Partly, because a sales pitch', 'a drawn stage: a spotlight falls on a date (no person, no caricature)', 'SCENE', 'the spotlight', ''),
 ('6.02', 'The Nobel Prize-winning biologist', 'the audio-guide post in the hall: its light wakes', 'HALL', 'the speaker', ''),
 ('6.03', 'slot:C5', 'the speaker grows into the audio plate: VENKI RAMAKRISHNAN · NOBEL PRIZE IN CHEMISTRY 2009 · ORIGINAL AUDIO · RYAN PETERMAN PODCAST · mint waveform (no portrait)', 'CLIP', 'the waveform', ''),
 ('6.04', 'The testing, not the finding', 'the waveform becomes THE GLASS PIPELINE: FINDING streams in, it narrows at TESTING', 'EXPL', 'the label', '★'),
 ('6.05', "The other reason for Amodei's date", 'the two-dates label: behind PROVEN an arrow forward with a ? · "…much faster than we\'re used to…" · AMODEI, FEB 2026', 'EXPL', 'a wall card', ''),
 # ---------------------------------------------------------------- c09 · B2 · Topol, Amodei, the mouse, the queue
 ('6.06', 'The cardiologist Eric Topol', 'a small wall card: "…these cure projections are wildly off-base…" · ERIC TOPOL, CARDIOLOGIST, ON X', 'EXPL', 'a second card', ''),
 ('6.07', 'To be fair', 'a second card: "The thing that will work is actually curing cancer." · AMODEI ON X, AUG 2026', 'EXPL', 'a molecule', ''),
 ('6.08', 'His own company now designs', 'a molecule speeds along a short bright path to a mouse; FOUND fills: MUSCULAR DYSTROPHY · IDEA → MOUSE DATA IN < 18 MONTHS', 'EXPL', 'the queue', ''),
 ('6.09', 'Its human trials could start', 'it joins a long queue of molecules before a door HUMAN TRIALS; the label: FOUND full, PROVEN far behind · AS SOON AS LATE 2028', 'EXPL', 'the queue', ''),
 ('6.10', 'Same road as everyone else', 'the queue runs past the media kiosk; the camera settles on its dark screen → plateKiosk', 'HALL', 'plateKiosk', ''),
 # ---------------------------------------------------------------- c10 · B3 · C2, the jam, it can
 ('6.11', 'He even warned of a jam', 'out of plateKiosk: the kiosk screen wakes; push in', 'MIX', 'the screen', ''),
 ('6.12', 'slot:C2', 'the screen grows into the clip plate: C2 DARIO AMODEI · CEO, ANTHROPIC · FEB 2026 · ORIGINAL FOOTAGE · DWARKESH PODCAST', 'CLIP', 'the plate shrinks', ''),
 ('6.13', 'Discovery speeds up', 'the pipeline from 6.04: in front it streams, behind the neck it jams; board complete ✓ ½ ? ✗', 'EXPL', 'the label', ''),
 ('6.14', 'So can proof come sooner', 'the two-dates label of the hook: PROVEN blinks', 'EXPL', 'PROVEN', ''),
 ('7.01', 'It can.', 'PROVEN moves a step forward', 'EXPL', 'a diorama', ''),
 ('7.02', 'Picture someone you love, around sixty', 'a study-clinic diorama: someone around sixty laughs with the nurse, a blood tube; result card FIRST TRACES', 'SCENE', 'the form', ''),
 ('7.03', 'So they join a trial', 'a signature under a trial form', 'SCENE', 'the line of the signature', ''),
 ('7.04', "that's how the slowest proof", 'WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST (a calm bracket over the clinic)', 'MIX', 'the trial row', ''),
 # ---------------------------------------------------------------- c11 · B3 · twins, the regulator, C1b
 ('7.05', 'In other trials', 'participants in a row; beside each a transparent twin of fine mint lines appears', 'EXPL', 'the sugar-pill row', ''),
 ('7.06', 'Fewer people on a sugar pill', 'the sugar-pill row gets shorter, never vanishes: DIGITAL TWINS (PROCOVA) · EMA, SEPT 2022 · UP TO ~35 % (COMPANY FIGURE)', 'EXPL', 'a desk', ''),
 ('7.07', "At America's regulator", 'a reviewer at a desk, a file stack shrinks, an assistant window marks passages: FDA "ELSA" · TARGET 1–2 MONTHS', 'SCENE', 'the file', ''),
 ('7.08', "Amodei's own proposal", '"…designed around an era of drugs that barely work…"; then the board\'s HEART row: UP TO 15 YEARS FOLLOW-UP', 'EXPL', 'the wall panel', ''),
 ('7.09', 'In the sales video, his promise', 'truck back to the wall panel (the same design as C1)', 'HALL', 'the wall text', ''),
 ('7.10', 'slot:C1b', 'C1b read by the narrator: "I think if we do this right, we can create an age of miracles…" (if we do this right in mint) + the credit', 'EXPL', 'the label', ''),
 # ---------------------------------------------------------------- c12 · B3 · people set the second date · the big answer
 ('7.11', 'If the machines make', 'the two-dates label: FOUND fills fast, PROVEN stays open; three people step beside it', 'EXPL', 'three dioramas', ''),
 ('7.12', 'Clinics that find disease early', 'three short dioramas in a row: the study clinic, a trial office with the twins, a parliament hall', 'SCENE', 'the label', ''),
 ('7.13', "That's what doing it right", 'PROVEN moves visibly closer to FOUND', 'EXPL', 'the board', ''),
 ('8.01', 'So, does the deadline hold?', 'the board flies big into the centre', 'EXPL', 'the verdicts', 'B'),
 ('8.02', 'Cancer: for many kinds, yes', '✓ ½ ? ✗ light in the rhythm of the words', 'EXPL', 'the board leaves', 'B'),
 ('8.03', 'Maybe your grandkids will hear', 'the hall: the two kids in front of vitrine 4, its plaque ALZHEIMER\'S faded (a relic); the board is gone', 'HALL', 'the plaque', '★ B'),
 ('8.04', 'Every cure has two dates#1', 'the label with both rows, big: EVERY CURE HAS TWO DATES', 'EXPL', 'PROVEN', ''),
 # ---------------------------------------------------------------- c13 · B3 · investors · subscribe 2 · the quiet walk · end screen
 ('8.05', 'Investors are already', 'a ticker line fades (no price, no figure); PROVEN stays open, a pen lies beside it', 'MIX', 'you', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2: you walk through the night hall toward the four vitrines; the top-right corner stays dark (QR)', 'HALL', 'the walk', 'Q'),
 ('A.02', 'END', 'the quiet walk without voice (music carries); the QR fades out before the end screen', 'HALL', 'you stop', 'Q'),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s: the quiet hall, four plinths; in one an old faded exhibit without a plaque (a relic), three empty with soft mint light; you stop before an empty one. S.END_CAM; free: S.END_TILES (two tiles on the upper wall, subscribe in the doorway; docs/MOTION.md §10)', 'HALL', '—', ''),
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
    cuts += 'W' in s[5].split()
    rows.append((c, s, a, d))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 54 · "AI Just Gave Disease a 10-Year Deadline" · shot list (binding)\n')
L.append(f'Generated by `tools/shots54.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'The fact-checked vo-v3 changes words, not the openers: if a phrase goes missing, the generator and `T.G` say which one.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · HALL .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. The whole film is ONE hall: rooms are entered by pushing through a glass (vitrine, diorama, doorway, kiosk screen) and left the same way — continuous moves, not W, each ≥ 2.5 s.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. B = the deadline board changes (`F.board` does it from `F.BOARD` phrases; never by hand). Q = inside a QR window.\n')
L.append('## 2 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2]} | {fmt(a)} | {fmt(b)} | {b - a:.0f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
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
L.append('\n## 4 · Seams between the groups (lib/f54_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | He didn't invent it | plateRoadshow (RS_CAM: the wall panel with the roadshow frame, left; the lectern with the closed essay under its cream lamp, right; the kiosk's edge far right) | H.13 settles on it | 1.01 glides right to the lectern, the essay opens |")
L.append("| B1 → B2 | The third disease answers fast | plateMind (MIND_CAM: vitrine 3 with the quiet ring, plaque MENTAL ILLNESS, V4's edge dim right; board top left; QR corner dark wall) | M.02 drifts onto it | 4.01 the MIND row lights, push into vitrine 3 |")
L.append("| B2 → B3 | He even warned of a jam | plateKiosk (KIOSK_CAM: the media kiosk, dark screen with a cream play mark, the bench, the audio post at the right; board complete) | 6.10 settles on it | 6.11 the screen wakes, push in → C2 |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Wording: text-v2.md (Einblendung lines), shortened to ≤ 6 words per explainer. **The fact sheet (faktenzettel.md) and the fact-checked vo-v3 override every number here** — read them before you set a number. Company figures say so on screen.')
L.append('- Hook: AI GAVE DISEASE / A DEADLINE · DEADLINE: 2036 · silent proof line (`F.SOURCES.hook`) · CANCER · ALZHEIMER\'S · HEART DISEASE · DEPRESSION · A DOCTOR\'S OFFICE · 2026 · THE PLAGUE · A RELIC · HISTORY BY THE DEADLINE? · FINDING · THE BODY · EVERY CURE · FOUND · PROVEN · WEEKS · DECADES · MADE TO SELL SHARES · NOT INVESTMENT ADVICE · IPO ROADSHOW VIDEO · NOV 10, 2026')
L.append('- Quote cards (`F.QUOTES`, `F.CREDIT`, `F.wallText`): C1 and C1b word for word + DARIO AMODEI · ANTHROPIC IPO ROADSHOW VIDEO · NOV 10, 2026. No photo, no footage, no likeness.')
L.append('- Board (`F.BOARD`): DEADLINE: 2036 · OUR CONVERSION OF "LESS THAN A DECADE" (NOV 2026) · CANCER · HEART · MIND · ALZHEIMER\'S · WEEKS · WEEKS · YEARS · WEEKS, BUT FAINT · DECADES · ✓ MANY KINDS · ½ · ? · ✗')
L.append('- 1: MACHINES OF LOVING GRACE · DARIO AMODEI · OCT 2024 · NOT INSTANT, NOT INFINITELY FAST')
L.append('- 2: ONE AI-PROPOSED DESIGN · ≈ 10× MORE RECEPTORS ON THE CELLS · LAB TESTS ONLY · GENERATE BIOMEDICINES / ANTHROPIC, OCT 2026 (faktencheck MB1: never ≈ 70 % SHORTER, never a speed motif) · LAROTRECTINIB · 55 PATIENTS · 12 CANCER TYPES · 75 % RESPONDED · 100+ TYPES OF CANCER · "…elimination of most cancer…"')
L.append('- 3: CTX310 · 15 PEOPLE · ONE INFUSION · LDL ≈ −50 % · DAY 60 · UP TO 15 YEARS FOLLOW-UP · E.G. FOURIER: 27,564 PATIENTS · MEDIAN 2.2 YEARS')
L.append('- 4: 38 OF 74 TRIALS POSITIVE (51 %) · FDA REVIEWS · "Most mental illness can probably be cured."')
L.append("- 5: 20+ YEARS BEFORE SYMPTOMS · A4 (SOLANEZUMAB) · 240 WEEKS · FAILED · \"…may be very difficult to reverse.\" · FIRST ALZHEIMER'S BLOOD TEST CLEARED · FDA, MAY 2025 · 55+")
L.append('- 6: FINDING · TESTING · "…wildly off-base…" · "The thing that will work is actually curing cancer." · IDEA → MOUSE DATA IN < 18 MONTHS · AS SOON AS LATE 2028 · HUMAN TRIALS')
L.append('- 7: FIRST TRACES · WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST (faktencheck MB2) · DIGITAL TWINS (PROCOVA) · EMA, SEPT 2022 · UP TO ~35 % (COMPANY FIGURE) · FDA "ELSA" · TARGET 1–2 MONTHS · UP TO 15 YEARS FOLLOW-UP')
L.append('- 8: ✓ ½ ? ✗ · EVERY CURE HAS TWO DATES')
L.append('- **Optional (faktencheck K5–K8, Jakob decides; default = as listed above):** K5 2:50 the full sentence "It would not be surprising if an assortment of rare, difficult malignancies persists." · K6 6:38 Topol credit + ", AUG 2026" · K7 8:32 "…where the safety and efficacy is actually going to be really crisp and clear…" (or lengthen to "…and often have serious side effects") · K8 C5 credit PUBLISHED NOV 2026 · K9 clip subtitles by ear (C3 "Machines of Loving Grace"). K10: the hook line stays.')
L.append('- Clip credits `F.CLIPS` (name · role · date · ORIGINAL FOOTAGE / ORIGINAL AUDIO · source) · source lines `F.SOURCES`.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
