#!/usr/bin/env python3
"""Film 65 · "AI Can Now Call You in Your Mom's Voice" · the binding shot list -> docs/shots.md (times from the current timing: $TIMING,
<ROOT>audio/timing.json, else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots65.py
Every shot: id (H = hook, 1…7 = the steps and the answer, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the film
after the previous shot's anchor; 'slot:S1' = a clip / card slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram made of the world's things: voice ribbons, the notes, the tags, the tally, dots, slabs) · CARD 1.0 (the C10 quote card) ·
  CLIP .5 (original footage in a clip frame) · MIX .5 (the world with a diagram on it) · WORLD .3 (THE LINE itself, the kitchen) · SCENE 0.
Flags: W = a hard world change (budget < 1 per minute; portals and camera flights are continuous, not W) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F65ROOT', '/mnt/project-files/scenario/film-ki-betrug/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or next((f for f in (os.path.join(HERE, '..', 'audio', 'timing.json'), ROOT + 'audio/timing.json') if os.path.exists(f)), os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'CARD': 1.0, 'CLIP': .5, 'MIX': .5, 'WORLD': .3, 'SCENE': 0.0}
CHUNKS = [('c01', 'Lead', 'A.I. can now call you'), ('c02', 'B1', 'The first step is the voice'), ('c03', 'B1', 'So where does a machine get a voice'),
          ('c04', 'B1', 'That family in California now uses'), ('c05', 'B1', 'That is the second step'), ('c06', 'B1', 'So agree on a second thing'),
          ('c07', 'B2', 'The third step is a face'), ('c08', 'B2', 'So the most expensive lie'), ('c09', 'B2', 'So the scam must not give her the time'),
          ('c10', 'B2', 'And think of those long hours'), ('c11', 'B2', 'The Federal Trade Commission'),
          ('c12', 'B3', 'Then one step is left'), ('c13', 'B3', 'And the law is moving'), ('c14', 'B3', 'Because a copy needs an original'),
          ('c15', 'B3', "And it won't stop at scams"), ('c16', 'B3', 'And one evening')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'A.I. can now call you', 'THUMBNAIL at frame 0 (thumbnail A echoed): her house far left (warm kitchen window), the line on five poles down to the bank, you on the near hill right with your phone; a GOLD voice arcs from her window to your phone; IT’S NOT / YOUR MOM. On "sound exactly like your mom" the arc’s far end lifts off her window to the cold glow behind the far ridge and turns BLUE (the copy)', 'MIX', 'the blue arc', ''),
 ('H.02', 'And it can call her', 'glide left: a second blue arc drops from the glow into her window; IT’S NOT / YOU; your arc hangs up', 'MIX', 'the arc into her window', ''),
 ('H.03', 'It takes a short', 'a short gold snippet lights at the glow’s end of the arc (the recording); a gold price tag ≈ $0 swings in; source clone', 'EXPL', 'the camera rises', ''),
 ('H.04', 'And the losses', 'up over the valley: gold sparks rise from every lit window of the town and gather into NEARLY $8 BILLION · AMERICANS 60+ · ONE YEAR · +59 %; source losses', 'EXPL', 'the sparks fade', '★'),
 ('H.05', 'A machine can copy', 'the glide down to her window, the blue arc trembles into it; WHAT STILL / PROTECTS HER?', 'MIX', 'the window', ''),
 ('H.06', 'Her phone rings', 'through the window (portal) into the kitchen: the phone on the table rings with your picture; she reaches and lifts it to her ear; a trembling blue voice leaves it; SCENARIO', 'SCENE', 'the blue voice', ''),
 ('H.07', "Don't count on her", 'the voice turns neutral and clones itself: two identical voices, REAL / A.I. swap places (and back); a coin flips; 54 % · HOW OFTEN PEOPLE SPOT AN A.I. VOICE; source ear', 'EXPL', 'the voices sink', ''),
 ('H.08', 'So forget listening', 'the voices sink back into the phone; she listens, fooled; the camera drifts to the fridge: an empty dashed place for a note', 'MIX', 'the empty place', ''),
 ('H.09', 'And it exists', 'the place glows gold; back out through the window; gold runs down the wire from her house, tags 1–5 light: 5 STEPS · four poles get blue copies (4 A MACHINE CAN FAKE) · the bank window glows calm gold (1 IT CANNOT) · the light runs back to pole 1 → plateLine(1)', 'EXPL', 'plateLine(1)', ''),
 # ---------------------------------------------------------------- c02 · B1 · step 1: the voice, the Del Mastro call
 ('1.01', 'The first step is the voice', 'out of plateLine(1): tag 1 glows; STEP 1 OF 5 · THE VOICE (F.stepLabel); the camera follows the wire back up into her window', 'MIX', 'her window', ''),
 ('1.02', 'This summer, a mother from California', 'the kitchen: her phone on the table lights; on its screen a small hearing room (a long table, a microphone, a woman, E.person); source senate. "Her daughter’s voice": a gold voice on the screen; "kidnapped": it turns blue', 'MIX', 'the phone screen', ''),
 ('1.03', 'slot:S1', 'S1 ORIGINAL FOOTAGE (Deborah Del Mastro · U.S. Senate Special Committee on Aging · July 2026) grows out of the phone screen (F.clipFrame from = phone screen) and shrinks back into it after the sentence', 'CLIP', 'the phone screen', ''),
 ('1.04', 'It was not her daughter', 'the screen: the call timer runs up to 5:30:00 while outside the kitchen window the moon crosses (the only clock: no dial, no hourglass); 5½ HOURS', 'EXPL', 'the timer stops', ''),
 ('1.05', 'She was certain', 'a calm, dignified picture: her (our mother) with the phone, the lamp; small: FEELING SURE ≠ BEING RIGHT (respect, no mockery)', 'SCENE', 'the phone at her ear', ''),
 # ---------------------------------------------------------------- c03 · B1 · where a machine gets a voice
 ('1.06', 'So where does a machine get a voice', 'the phone at her ear, on its screen three silent dots after "hello"', 'MIX', 'the dots', ''),
 ('1.07', 'Usually, that silence', 'out through the window over the valley: the glow behind the ridge fans out hundreds of thin blue lines to the town windows at once, only two are answered (a dialing computer); source dialer; "No documented case": bracket NO CASE: ONE HELLO → A CLONE', 'EXPL', 'the lines withdraw', '★'),
 ('1.08', 'The voice can come from what', 'small video tiles float over lit windows (a birthday, a speech, a holiday); from each a strip of gold voice tears off and drifts to the glow; "too late": the tiles dim', 'EXPL', 'back to her window', ''),
 # ---------------------------------------------------------------- c04 · B1 · the code word
 ('1.09', 'That family in California now uses', 'the kitchen: you (yellow coat, hood down) at the table opposite her; a folded gold note slides across; the word stays covered (gold bar)', 'SCENE', 'the note', ''),
 ('1.10', 'A panicked call asks', 'three phone screens in a row: ASK FOR THE WORD · HANG UP · CALL BACK (contacts: your name lit)', 'EXPL', 'the note', ''),
 ('1.11', 'The FBI recommends it', 'the note goes onto the fridge (slot 1, covered); source codeword; out through the window: tag 1 glows gold', 'MIX', 'the wire', ''),
 ('1.12', 'Still, a voice is only a sound', 'the camera follows the wire to pole 2: a question mark rises over it', 'WORLD', 'pole 2', ''),
 # ---------------------------------------------------------------- c05 · B1 · step 2: the story
 ('2.01', 'That is the second step', 'STEP 2 OF 5 · THE STORY; tag 2; the lit windows of the town show tiny posts (photos) that turn into lines of text and flow up the wire to the glow', 'MIX', 'the text lines', ''),
 ('2.02', 'And the machine no longer', 'her phone screen split: a person (indigo) talks while a blue ribbon lends the voice · a chat where only the blue machine types', 'EXPL', 'the chat', ''),
 ('2.03', 'The clearest case comes', 'a dating app as a grid of profile circles (F.dotField): thousands; 3 OF 4 PROFILES turn blue: MACHINES; bracket THE COMPANY REPORTS ON ITSELF; source report (no number 4,700: "thousands")', 'EXPL', 'one profile', ''),
 ('2.04', 'This was paid chat', 'bracket PAID CHAT, NOT SAVINGS', 'EXPL', 'the grid', ''),
 ('2.05', 'The system kept track', 'one human profile flickers, a blue ring closes around it: SUSPECTS', 'EXPL', 'the ring', '★'),
 # ---------------------------------------------------------------- c06 · B1 · the question
 ('2.06', 'So agree on a second thing', 'the kitchen fridge: note 2 "?" goes up; the phone shows one question; its answer is a gold dot that never leaves the house (no line to the glow)', 'EXPL', 'out of the window', ''),
 ('2.07', 'And still, the panicked call', 'out of the window, along the wire: the glow moves to pole 3; a screen lights in a window down the hill → plateLine(3)', 'WORLD', 'plateLine(3)', ''),
 # ---------------------------------------------------------------- c07 · B2 · step 3: a face
 ('3.01', 'The third step is a face', 'out of plateLine(3): STEP 3 OF 5 · A FACE; tag 3; push into a lit window across the valley: a tablet with a forged leader (a generic suit before a flag, no likeness) recommending an investment', 'MIX', 'the tablet', ''),
 ('3.02', 'In Canada, a woman', 'an old woman’s hands at the tablet; ABOUT CA$900,000; source canada', 'EXPL', 'the money', ''),
 ('3.03', 'She is far from alone', 'one slab of light = all reported losses, NEARLY HALF of it lights gold: INVESTMENT FRAUD; source invest (no "3.5 of 8 billion": "nearly half")', 'EXPL', 'the half', '★'),
 ('3.04', 'How much of that involved', 'bracket NEVER RELIABLY MEASURED; the forged face as one door into the slab', 'EXPL', 'the face', ''),
 # ---------------------------------------------------------------- c08 · B2 · the house rule, subscribe 1
 ('3.05', 'So the most expensive lie', 'a small blue voice in tears beside a rising gold return line on the tablet: the second one is the big one; it wears the face', 'EXPL', 'the tablet', ''),
 ('3.06', 'Here, the agreement is a house rule', 'note 3 on the fridge: FAMOUS FACE + PROFIT = FAKE; a link icon gets a cream ✗', 'EXPL', 'the fridge', ''),
 ('3.07', 'A voice, a story, a face', 'out on the line: tags 1–3 gold; her phone: contacts, your name lit; a gold arc from her house to your hill (she might call you)', 'MIX', 'the gold arc', ''),
 ('M.01', 'This channel exists for one reason', 'subscribe 1: calm world shot, you on your hill, her window warm across the valley, the gold arc between you breathing', 'WORLD', 'the arc', ''),
 # ---------------------------------------------------------------- c09 · B2 · step 4: the clock, the fake FBI call, C10
 ('4.01', 'So the scam must not give her the time', 'STEP 4 OF 5 · THE CLOCK; tag 4; the moon begins its slow arc (the only clock)', 'WORLD', 'her window', ''),
 ('4.02', 'It sounds like this', 'on her phone, two short lines: DO IT NOW · DON’T TELL ANYONE', 'EXPL', 'the phone', ''),
 ('4.03', 'One version, as the FBI', 'the fake chain on her phone: THE BANK calls · a VIDEO CALL: a so-called agent before a flag and a seal (phone screen video, the seal a little crooked) · a paper to sign · DON’T SPEAK TO ANYONE; source fbiChicago', 'EXPL', 'the video screen', ''),
 ('4.04', 'Here is the real FBI', 'the fake video screen goes dark; the quote card grows out of it', 'MIX', 'the card', ''),
 ('4.05', 'slot:C10', 'C10 QUOTE CARD (no footage, no clip sound): "If a would-be agent tries to isolate and burden you with an overwhelming level of urgency, they may be a scammer." · Inside the FBI Podcast', 'CARD', 'the card shrinks', ''),
 ('4.06', "Real agents don't reach out", 'the card shrinks back into the phone; a cream ✗ over the video call', 'EXPL', 'the phone', ''),
 # ---------------------------------------------------------------- c10 · B2 · the long hours, too trusting?, the stop rule
 ('4.07', 'And think of those long hours', 'the line at night: her window and your hill; the call timer runs; the arc from her house to you cannot form (the line is busy)', 'MIX', 'the timer', ''),
 ('4.08', 'So is your mother simply', 'two dot fields: younger people (many small dots light) · older adults (fewer light, but larger); A SMALL SHARE OF CASES carries most of the money (no 6 % / 70 %); source ftcShare', 'EXPL', 'the big dots', '★'),
 ('4.09', "So what's missing is not suspicion", 'the kitchen in calm light: A PLAN, MADE ON A CALM DAY', 'SCENE', 'the fridge', ''),
 ('4.10', 'Agree on this', 'note 4: HURRY + SECRET + MONEY = STOP; her contacts: your name lit (one person you chose together)', 'EXPL', 'the phone', ''),
 # ---------------------------------------------------------------- c11 · B2 · the FTC plan, C1, on her way to the bank
 ('4.11', 'The Federal Trade Commission', 'on her phone: ACTION PLAN · WHAT TO DO · WHO TO CALL · HOW TO VERIFY; source ftcPlan', 'EXPL', 'the phone screen', ''),
 ('4.12', 'slot:C1', 'C1 ORIGINAL FOOTAGE (Mark Meador · FTC Commissioner), fit contain (subtitles burned in), grows out of her phone screen and back', 'CLIP', 'the phone', ''),
 ('4.13', "But suppose she doesn't stop", 'she walks out of her house down the hill along the line (E.person walk); tags 1–4 pass with their blue copies → plateLine(5)', 'WORLD', 'plateLine(5)', ''),
 # ---------------------------------------------------------------- c12 · B3 · step 5: the money
 ('5.01', 'Then one step is left', 'out of plateLine(5): STEP 5 OF 5 · THE MONEY; tag 5; the bank window glows calm gold', 'WORLD', 'the bank window', ''),
 ('5.02', 'And this is the one', 'a blue copy of pole 5 tries to form and slides off: nothing to copy', 'EXPL', 'the window', ''),
 ('5.03', 'Her savings sit in a bank', 'push into the counter window: her savings as a gold stack behind the teller; "they have to leave": a transfer path; "a real person": the teller looks up', 'MIX', 'the teller', ''),
 ('5.04', 'So put an agreement there', 'note 5: TRUSTED CONTACT (your name); YOU CAN’T WITHDRAW A CENT; a gold arc from the bank to your phone (the firm may call you)', 'EXPL', 'your phone', '★'),
 ('5.05', 'Brokers in the United States', 'two counter windows: BROKER: MUST ASK ✓ · BANK: NOT REQUIRED; source finra; "bring it up herself": her note', 'EXPL', 'the two windows', ''),
 # ---------------------------------------------------------------- c13 · B3 · the law, S2, test it
 ('5.06', 'And the law is moving', 'two counter windows light: MARYLAND · NORTH CAROLINA, HOLD + ALERT under each (no map, no pins); source states', 'EXPL', 'the window', ''),
 ('5.07', "The banks' own lobby", 'the teller notices: FRIGHTENED · SECRETIVE · COACHED (three small words); source aba', 'EXPL', 'the counter window', ''),
 ('5.08', 'slot:S2', 'S2 ORIGINAL FOOTAGE (Paul Benda · American Bankers Association) grows out of the counter window and back; he says "In THOSE moments"', 'CLIP', 'the window', ''),
 ('5.09', "That's a lobby speaking", 'bracket A LOBBY; two questions: WILL YOU HOLD IT? · WHO GETS THE CALL?', 'EXPL', 'the questions', ''),
 ('5.10', 'How often these agreements', 'bracket NEVER MEASURED; the bank glow holds "when she is already convinced"', 'MIX', 'the glow', ''),
 ('5.11', 'Which is strange', 'scale contrast: the huge cold glow behind the ridge · a small paper with a name at the counter', 'WORLD', 'the paper', ''),
 # ---------------------------------------------------------------- c14 · B3 · a copy needs an original
 ('6.01', 'Because a copy needs an original', 'three tiles over the town: A RECORDING · A PHOTO · A LIFE POSTED ONLINE, ribbons from each to the glow', 'EXPL', 'the ribbons', ''),
 ('6.02', 'But the word you chose together', 'the five notes on the fridge: no ribbon leaves them; the blue glow stops at her kitchen window', 'EXPL', 'the window', ''),
 ('6.03', 'For all of history', 'a gold voice = proof; "That has ended": it turns neutral; "trust has to move": its gold slides onto the five notes', 'EXPL', 'the notes', '★'),
 # ---------------------------------------------------------------- c15 · B3 · beyond scams, the answer
 ('6.04', "And it won't stop at scams", 'two chat bubbles AI · HUMAN; slabBars 46 % vs 18 % (agreed to the request); bracket ONE SMALL STUDY · 22 PEOPLE; source study', 'EXPL', 'the AI bar', ''),
 ('6.05', 'If that holds up', 'the glow behind the ridge rises a little over the town; "not as a robot": your phone rings on your hill', 'WORLD', 'your phone', ''),
 ('6.06', 'And the answer to it fits', 'the kitchen: you and her at the table; TEN MINUTES · THIS WEEK; ONE WORD · ONE PERSON TO CALL · ONE NAME AT THE BANK; "the same for yourself": a note on your own phone', 'EXPL', 'the table', ''),
 # ---------------------------------------------------------------- c16 · B3 · one evening, subscribe 2, the end picture
 ('7.01', 'And one evening', 'the hook returns exactly (H.06): the phone rings with your picture, she lifts it, the trembling blue voice', 'SCENE', 'the blue voice', ''),
 ('7.02', "Your mother doesn't listen", 'she asks for the word: note 1 glows on the fridge; "The line goes quiet": the blue voice goes flat and falls apart', 'MIX', 'the quiet', '★'),
 ('7.03', 'A machine can copy your voice#1', 'out through her window: the line at night, all five tags gold, the bank window calm', 'WORLD', 'the line', ''),
 ('A.01', 'This channel exists so that', 'subscribe 2: the glide to the end picture', 'WORLD', 'END_CAM', ''),
 ('E.01', 'ENDSCREEN', 'END PICTURE (15 s): her house on its hill, the kitchen window warm, inside it small her and you at the table; all tags gold; the moon; tiles free left and right (END_TILES), no text, no QR', 'WORLD', '—', ''),
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
L.append('# Film 65 · "AI Can Now Call You in Your Mom\'s Voice" · shot list (binding)\n')
L.append(f'Generated by `tools/shots65.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'Wording follows vo-v3 (a newer vo-vN wins; `faktenzettel.md` and the newest vo-vN override every number here).\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · CARD 1 · MIX .5 · WORLD .3 · SCENE 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. The whole film is ONE world (THE LINE): the kitchen, the counter window, the phone screens and the clip frames open out of a thing in it (her window, a screen) and close back into it — continuous, not W.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. At most two things move at once (the camera counts).\n')
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
L.append('\n## 4 · Seams between the groups (lib/f65_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append('| Lead → B1 | The first step is the voice | plateLine(1): pole 1 by her house (left third), tag 1 glowing, wire gold up to pole 1, the glow behind the ridge at .55 | H.09 settles onto it (built) | 1.01 follows the wire up into her window |')
L.append('| B1 → B2 | The third step is a face | plateLine(3): pole 3 half-way down, tags 1–2 gold, tag 3 glowing, wire gold to pole 3 | 2.07 settles onto it | 3.01 pushes into a lit window across the valley |')
L.append('| B2 → B3 | Then one step is left | plateLine(5): pole 5 at the foot of the hill, the bank right, tags 1–4 gold, tag 5 glowing, bank glow .35 | 4.13 (her walk) settles onto it | 5.01 the bank window |')
L.append('\nBoth sides draw the plate (S.plateLine(ctx, t, T, k)) for ±0.5 s with the same creep (3 %/s push, 24 px/s truck), no drift. Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('≤ 6 words per explainer. **The newest vo-vN.txt and faktenzettel.md override every number here.** Interested senders say so on screen (THE COMPANY REPORTS ON ITSELF, A LOBBY). MUSS 5: "thousands" (not 4,700), "nearly half" (not 3.5 of 8 billion), "a small share of cases" (not 6 % / 70 %).')
L.append('- Hook: IT’S NOT / YOUR MOM · IT’S NOT / YOU · ≈ $0 · NEARLY $8 BILLION · AMERICANS 60+ · ONE YEAR · +59 % · WHAT STILL / PROTECTS HER? · SCENARIO · REAL · A.I. · 54 % · HOW OFTEN PEOPLE SPOT AN A.I. VOICE · 5 STEPS · 4 A MACHINE CAN FAKE · 1 IT CANNOT')
L.append('- 1: STEP 1 OF 5 · THE VOICE · 5½ HOURS · FEELING SURE ≠ BEING RIGHT · NO CASE: ONE HELLO → A CLONE · ASK FOR THE WORD · HANG UP · CALL BACK')
L.append('- 2: STEP 2 OF 5 · THE STORY · THOUSANDS · 3 OF 4 PROFILES · MACHINES · THE COMPANY REPORTS ON ITSELF · PAID CHAT, NOT SAVINGS · SUSPECTS · ?')
L.append('- 3: STEP 3 OF 5 · A FACE · ABOUT CA$900,000 · NEARLY HALF · INVESTMENT FRAUD · NEVER RELIABLY MEASURED · FAMOUS FACE + PROFIT = FAKE')
L.append('- 4: STEP 4 OF 5 · THE CLOCK · DO IT NOW · DON’T TELL ANYONE · THE BANK · VIDEO CALL · DON’T SPEAK TO ANYONE · A SMALL SHARE OF CASES · A PLAN, MADE ON A CALM DAY · HURRY + SECRET + MONEY = STOP · ACTION PLAN · WHAT TO DO · WHO TO CALL · HOW TO VERIFY')
L.append('- 5: STEP 5 OF 5 · THE MONEY · TRUSTED CONTACT · YOU CAN’T WITHDRAW A CENT · BROKER: MUST ASK · BANK: NOT REQUIRED · MARYLAND · NORTH CAROLINA · HOLD + ALERT · FRIGHTENED · SECRETIVE · COACHED · A LOBBY · WILL YOU HOLD IT? · WHO GETS THE CALL? · NEVER MEASURED')
L.append('- 6: A RECORDING · A PHOTO · A LIFE POSTED ONLINE · AI · HUMAN · 46 % · 18 % · ONE SMALL STUDY · 22 PEOPLE · TEN MINUTES · THIS WEEK · ONE WORD · ONE PERSON TO CALL · ONE NAME AT THE BANK')
L.append('- Clips (`F.clipFrame`): S1, C1, S2 = ORIGINAL FOOTAGE with the name bar (`F.CLIPS`); C10 = QUOTE card (the same frame, label QUOTE, no footage, no clip sound). Every frame grows out of a screen or window in the world and shrinks back into it.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
