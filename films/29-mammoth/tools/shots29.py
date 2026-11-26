#!/usr/bin/env python3
"""Film 29 · "AI Is Bringing Back the Mammoth" · the binding shot list -> docs/shots.md (times from the current timing: $TIMING,
<ROOT>audio/timing.json, else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots29.py
Every shot: id (H = hook, 1…6 = the text sections, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the film
after the previous shot's anchor; 'slot:C1' = a clip / card slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram made of the world's things: strands, glints, the comb, the tally, the list, skulls, the ice, the freezer) ·
  CARD 1.0 (a quote card: words light up; it explains, there is no footage) ·
  MIX .5 (the world with a diagram on it: traits lit on the animal, glints counted on the snow) · WORLD .3 (THE FENCE itself, the
  field station: the places explain a little) · SCENE 0 (people, the lab, animals only).
Flags: W = a hard world change (budget < 1 per minute; portals and camera flights are continuous, not W) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F29ROOT', '/mnt/project-files/scenario/film-mammut/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'CARD': 1.0, 'MIX': .5, 'WORLD': .3, 'SCENE': 0.0}
CHUNKS = [('c01', 'Lead', 'Artificial intelligence is bringing'), ('c02', 'B1', 'The mice belong'), ('c03', 'B1', 'And it has plenty to read'),
          ('c04', 'B1', 'Still far too many'), ('c05', 'B1', 'From seven genes'), ('c06', 'B1', 'And the dodo is the harder'),
          ('c07', 'B2', 'Then it turned to the dodo'), ('c08', 'B2', 'Today, the machine writes'), ('c09', 'B2', 'There is a way to check'),
          ('c10', 'B2', 'That is what'), ('c11', 'B2', "It isn't"),
          ('c12', 'B3', 'Now take an American animal'), ('c13', 'B3', 'Now scale that up'), ('c14', 'B3', 'Even the mammoth depends'),
          ('c15', 'B3', 'So here is what the evidence'), ('c16', 'B3', 'So stand at that fence once more')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'Artificial intelligence is bringing', 'THUMBNAIL at frame 0: the POSTER MAMMOTH in gold rungs of light on the horizon, you (yellow coat) and the child from behind at the fence, the hut far left; AI IS BRINGING / BACK THE MAMMOTH (gold), out before "A few winters"', 'WORLD', 'crane down to the two', ''),
 ('H.02', 'A few winters', 'the camera cranes down to the two of you, the poster rises out of the top; SCENARIO · EARLY 2030s', 'WORLD', 'your hand', ''),
 ('H.03', "There's a small hand", 'close behind the two: the child\'s hand rises into yours', 'SCENE', 'up over the shoulders', ''),
 ('H.04', 'And behind the fence', 'over your shoulders: the poster\'s light pours down behind the fence and gathers into the animal (gold rungs)', 'MIX', 'the gold animal', ''),
 ('H.05', 'lifts its head', 'it lifts its head; the light turns to red-brown fur; the camera cranes over the fence', 'WORLD', 'the fur', ''),
 ('H.06', 'Red-brown fur', 'the fur takes the light · the small ear flicks · breath steams from the trunk (one accent per word)', 'WORLD', 'the body', ''),
 ('H.07', "That animal doesn't exist", 'it breaks back into gold points', 'MIX', 'the points', ''),
 ('H.08', 'Between an elephant', 'the points fly up and build two flat strands ELEPHANT / MAMMOTH over the plain; the differences light gold; the TALLY rolls to 1,400,000 · DIFFERENCES IN THE DNA; source CELL REPORTS, 2015', 'EXPL', 'the gold rungs', ''),
 ('H.09', 'Which ones make a mammoth', 'the gold differences rain onto the tundra: every glint in the snow turns gold, to the horizon; WHICH ONES?', 'EXPL', 'the glittering snow', '★'),
 ('H.10', 'No human can check', 'down behind you: you look over the glittering plain', 'MIX', 'pan left', ''),
 ('H.11', 'No lab can change', 'pan left over the snow to the field station: the hut, the amber window, the mast', 'WORLD', 'the mast light', ''),
 ('H.12', 'So the search for the few', 'the mast blinks; the machine\'s cyan comb sweeps the snow from the hut: almost every glint goes grey, a few stay gold', 'EXPL', 'the gold picks', ''),
 ('H.13', 'And the first test animals', 'the gold picks fly into the hut window; the lab opens out of it (portal): the woolly mouse walks in its glass box; source COLOSSAL · PREPRINT, MARCH 2025', 'MIX', 'the window', ''),
 ('H.14', 'The mice were the rehearsal', 'the lab folds back into the window; the elephant walks into the window light beside the hut', 'WORLD', 'the glide back', ''),
 ('H.15', 'And the same tools', 'the glide back over the fence: the wolf, the ferret, the bird light gold one by one; the child looks up → plateFence', 'WORLD', 'plateFence', ''),
 # ---------------------------------------------------------------- c02 · B1 · the company, the plan, the machine's part
 ('1.01', 'The mice belong', 'out of plateFence: glide left over the snow to the hut; a small plate on it COLOSSAL · DALLAS', 'WORLD', 'the snow opens', ''),
 ('1.02', 'And its plan is not', 'a cutaway under the snow: a frozen mammoth in the ice (F.beast shade 1 inside S.iceBlock); a cream ✗ over it: NOT THIS', 'EXPL', 'up to the elephant', ''),
 ('1.03', 'The plan is to take', 'the elephant at the hut (F.ELEPHANT), ASIAN ELEPHANT · LIVING COUSIN; its strand appears under it; "for the cold": three rungs flip gold', 'MIX', 'the strand', ''),
 ('1.04', "And the machine's part", 'the cyan comb runs along two strands (mammoth over elephant); differences are flagged gold; source AS REPORTED · TIME, AUG 24, 2026', 'EXPL', 'three flags', ''),
 ('1.05', 'The thick fur', 'three flags jump to the elephant\'s body: FUR · FAT · EARS light gold on the words (F.beast glowTrait), the body changes a little with each (fur → COLD)', 'MIX', 'the flags', '★'),
 ('1.06', "It doesn't change a single gene", 'the comb passes a rung and leaves it as it was; THE LIST writes itself in cyan: FUR · FAT · EARS (F.list)', 'EXPL', 'the list', ''),
 # ---------------------------------------------------------------- c03 · B1 · plenty to read, reading is not knowing, 1,600
 ('1.07', 'And it has plenty to read', 'the list slides down into the snow; a cutaway of frozen ground: layers, bones and short broken strands in the ice', 'EXPL', 'the strands rise', ''),
 ('1.08', 'and Colossal says it now holds', 'the broken strands rise and complete into a stack of full strands; tally 100 · MAMMOTH GENOMES · PER COLOSSAL', 'EXPL', 'the empty snow', ''),
 ('1.09', 'So why is there still no mammoth', 'back at the fence: the empty snow where the animal stood, the child looks at it', 'WORLD', 'the comb', ''),
 ('1.10', 'Because reading was never', 'the comb runs one strand end to end in a second (reading); then stops at one gold rung: READING ≠ KNOWING', 'EXPL', 'the glints', ''),
 ('1.11', 'Start the count at 1.4 million', 'the glittering plain again; tally 1,400,000', 'MIX', 'the glints dim', ''),
 ('1.12', 'Most of those differences probably', 'most glints go grey (they change nothing you would see)', 'MIX', 'the rest gather', ''),
 ('1.13', 'Only some of them change', 'the remaining gold glints gather into gene blocks; tally 1,600 · GENES; source CELL REPORTS, 2015', 'EXPL', 'the blocks', ''),
 # ---------------------------------------------------------------- c04 · B1 · the ranking: 150+, the mice: 7, the caution
 ('1.14', 'Still far too many', 'the 1,600 blocks as a field too big to rebuild (a pile against the small elephant)', 'EXPL', 'the comb', ''),
 ('1.15', "This is where the machine's ranking", 'the comb ranks the blocks into a row, the low end greys; tally ~150 · GENES ON THE LIST (and rising); source TIME, AUG 24, 2026 · AS REPORTED', 'EXPL', 'the list', ''),
 ('1.16', 'And tested in a living animal', 'the list beside the lab window: only seven rows lit; tally 7 · GENES · TESTED IN MICE', 'MIX', 'the mouse', ''),
 ('1.17', 'Critics add a caution', 'the woolly mouse; a tag on the seven rows: ALREADY KNOWN COAT GENES; THE EDITING ✓ · THE LIST ?; source TORI HERRIDGE · SCIENCE MEDIA CENTRE · 4.3.2025', 'EXPL', 'the seven rows', ''),
 # ---------------------------------------------------------------- c05 · B1 · 7 → 150, C1, the short list, the dodo
 ('1.18', 'From seven genes', 'two lists side by side: 7 (mouse) → ~150 (elephant), the gap between them', 'EXPL', 'the card', ''),
 ('1.19', 'slot:C1', 'QUOTE CARD C1 (Ben Lamm, Moonshots #297): the words light evenly over the clip slot; no footage, no photo', 'CARD', 'the card folds to a list', ''),
 ('1.20', 'No magic', 'NO MAGIC. NOTHING OVERNIGHT.; the list (short) handed to a lab bench: SOMEBODY HAS TO TEST IT', 'EXPL', 'the hidden step', ''),
 ('1.21', 'But how would a machine even know', 'a strand with a blank middle (the step not shown in public); then a bird\'s silhouette lands on it: THE DODO', 'EXPL', 'the dodo', ''),
 # ---------------------------------------------------------------- c06 · B1 · one genome, the living teach
 ('1.22', 'And the dodo is the harder', 'two stacks: ~100 mammoth strands vs ONE dodo strand; tally 1 · DODO GENOME', 'EXPL', 'the one strand', ''),
 ('1.23', 'One bird. Nothing to compare', 'the dodo alone on the night stage, the strand under it', 'MIX', 'living birds', ''),
 ('1.24', 'With the living', 'living birds hop in around it (70+ silhouettes), each with its skull outline and strand; tally 70+ · LIVING BIRD SPECIES; source GENOMORPH · PER COLOSSAL · NOT PEER-REVIEWED', 'EXPL', 'the beaks', '★'),
 ('1.25', 'That is how it learned', 'skull shapes and strands line up: a few rungs light with each beak shape (the learning) → plateDodo', 'EXPL', 'plateDodo', ''),
 # ---------------------------------------------------------------- c07 · B2 · 2,300 candidates, might, learned from the living
 ('2.01', 'Then it turned to the dodo', 'out of plateDodo: the comb runs the dodo strand; candidates light; tally 1 → 2,300 · CANDIDATES', 'EXPL', 'the beak', ''),
 ('2.02', 'Twenty-three hundred places', 'the dodo\'s beak lit; thin lines from 2,300 points to it; MIGHT. (one word); source COLOSSAL: CANDIDATES, NOT PROOF', 'EXPL', 'the lab bench', ''),
 ('2.03', 'Every candidate still has to prove', 'the candidates fall into a long row of test tubes / dishes at a lab bench, each waits for a tick', 'MIX', 'the living birds', ''),
 ('2.04', 'So that is how a machine finds', 'the living birds again, their light flowing into the comb: IT LEARNS FROM THE LIVING', 'EXPL', 'pull back to the fence', ''),
 # ---------------------------------------------------------------- c08 · B2 · subscribe 1, the egg, the question
 ('M.01', 'Today, the machine writes', 'subscribe 1: the fence, calm and wide; the list in the child\'s hand? no: the list floats small over the hut, the future machines as a bigger glow far away; one quiet subscribe line, no QR', 'WORLD', 'the list', ''),
 ('2.05', 'A list is not an animal', 'the list lies on the lab bench; a bird grows in an egg: a clear glass-like shell (F.FROST) with a chick inside; source 26 CHICKS · PER COLOSSAL · MAY 2026', 'MIX', 'the shell', ''),
 ('2.06', 'So suppose all of it works', 'every list row ticks; a gate in the fence opens; IS IT A MAMMOTH?', 'MIX', 'the wolves', ''),
 # ---------------------------------------------------------------- c09 · B2 · the wolves, Q1, Q2
 ('2.07', 'There is a way to check', 'three white wolves walk out of the snow (F.wolf pale 1) behind the fence; 3 ALIVE', 'SCENE', 'their names', ''),
 ('2.08', 'Romulus, Remus and Khaleesi', 'names as small tags on the three; DIRE WOLF (as presented); a tooth 13,000 YEARS; 20 EDITS · 14 GENES · PER COLOSSAL; GRAY WOLF CELLS', 'EXPL', 'the pack', ''),
 ('2.09', 'Colossal says the oldest', 'the pack hunts across the snow: 2 YEARS · HEALTHY · PER COLOSSAL · OCT 2026', 'MIX', 'the card', ''),
 ('2.10', 'So are they dire wolves', 'SO ARE THEY? (one line over the pack)', 'MIX', 'the card', ''),
 ('2.11', 'slot:Q1', 'QUOTE CARD Q1 (IUCN SSC Canid Specialist Group, APRIL 18, 2025), picture only, time to read', 'CARD', 'the card', ''),
 ('2.12', 'slot:Q2', 'QUOTE CARD Q2 (Beth Shapiro, Chief Science Officer, to New Scientist, May 2025: “Our animals are grey wolves with 20 edits that are cloned.”): spoken, the words light with the voice', 'CARD', 'the traits', ''),
 # ---------------------------------------------------------------- c10 · B2 · traits not species, the cold elephant, dates, Q3
 ('2.13', 'That is what', 'the wolves\' white coat lights as a TRAIT; the species label stays GRAY WOLF: THE TRAITS COME BACK. THE SPECIES DOES NOT.', 'EXPL', 'the fence', ''),
 ('2.14', 'And it tells you what would really stand', 'THE FENCE: behind it the elephant built for the cold (F.COLD): fur, fat, small ears lit as traits', 'MIX', 'dates', '★'),
 ('2.15', 'And not soon', 'calendar row on the snow: 2028 (struck, cream) → EARLY 2030s → NO HARD DATE', 'EXPL', 'the card', ''),
 ('2.16', 'slot:Q3', 'QUOTE CARD Q3 (Ben Lamm, TIME, AUG 24, 2026: “Not 2036, but not 2030 either.” only), picture only', 'CARD', 'the empty field', ''),
 ('2.17', 'That is a hope', 'the empty snow behind the fence; NO EMBRYO REPORTED · AS OF NOV 2026; a pregnancy bar ~22 MONTHS', 'EXPL', 'the shaggy elephant', ''),
 ('2.18', 'So is one shaggy elephant', 'the cold elephant small and alone behind the fence, years of snow falling', 'WORLD', 'the ice', ''),
 # ---------------------------------------------------------------- c11 · B2 · the last mammoths, the ice → plateIce
 ('2.19', "It isn't", 'today\'s animals light behind the fence (wolf, ferret, bird): THE BIGGER PRIZE', 'MIX', 'the island', ''),
 ('2.20', 'The last mammoths died', 'a small island far north on the horizon; a timeline in the snow: ~4,000 YEARS AGO · WRANGEL ISLAND; the pyramids as a tiny silhouette already standing; source CELL, 2024', 'MIX', 'the ice', ''),
 ('2.21', 'But nobody was there', 'the last mammoth walks into the snow and is gone; ice closes over its trace', 'MIX', 'the ice block', ''),
 ('2.22', 'The ice kept only broken DNA', 'the ice block with broken strand shards; "difference by difference" → plateIce', 'EXPL', 'plateIce', ''),
 # ---------------------------------------------------------------- c12 · B3 · Willa, the freezer, the grandchildren
 ('3.01', 'Now take an American animal', 'out of plateIce: the ice block frosts into a freezer door (S.iceBlock frost 1); a ferret in its light: WILLA · 1980s; source U.S. FISH & WILDLIFE SERVICE', 'MIX', 'the vial', ''),
 ('3.02', 'Decades later', 'the freezer opens, a vial of living cells; clones step out (F.ferret), then their kits, then kits of kits: a small family tree on the snow', 'EXPL', 'the family tree', '★'),
 ('3.03', 'A ferret from the nineteen-eighties', 'GRANDCHILDREN (one word), the ferret family in the snow', 'MIX', 'the freezer', ''),
 ('3.04', 'No short list', 'NO LIST. NO GUESSWORK. the freezer door, opened in time', 'EXPL', 'more doors', ''),
 # ---------------------------------------------------------------- c13 · B3 · the biobank, the living teach
 ('3.05', 'Now scale that up', 'the freezer door multiplies into a long wall of frost doors; tally ~2,300 · LISTED SPECIES; source FWS / NYT, JUNE 2026', 'MIX', 'online', ''),
 ('3.06', 'And the genomes are meant', 'from every door a strand flows up into the sky, open: ONLINE · FREE', 'EXPL', 'a forest', ''),
 ('3.07', 'A freezer is not a forest', 'the frost wall in the snow, small against a dark forest edge: NO HABITAT', 'WORLD', 'the comb', ''),
 ('3.08', 'But think about what the machine', 'the comb reads the strands from the doors: every saved genome a lesson (a rung lights); a species that vanishes: its strand fades unread', 'EXPL', 'an elephant', ''),
 # ---------------------------------------------------------------- c14 · B3 · the elephant mother, the vaccine, the Red List
 ('3.09', 'Even the mammoth depends', 'the elephant (mother) with a calf in the hut light; ASIAN ELEPHANT · ENDANGERED', 'MIX', 'the virus', ''),
 ('3.10', 'In North American zoos', 'a virus mark at the calf (no red: cream); LEADING KILLER OF CALVES IN NORTH AMERICAN ZOOS', 'EXPL', 'the vaccine', ''),
 ('3.11', 'This summer, researchers reported', 'two calves; a vaccine drop; both come through; source JOURNAL OF VIROLOGY · JULY 28, 2026 · CO-FUNDED BY COLOSSAL', 'EXPL', 'the two calves', ''),
 ('3.12', 'Two calves are a first sign', 'A FIRST SIGN, NOT PROOF; the mother walks the calves away from the hut', 'MIX', 'the snow', ''),
 ('3.13', 'And the elephant is not alone', 'the glints on the snow return as animals: tally ~50,000 · THREATENED SPECIES; source IUCN RED LIST 2026-1', 'EXPL', 'the poster', ''),
 # ---------------------------------------------------------------- c15 · B3 · the evidence
 ('3.14', 'So here is what the evidence', 'the cold elephant with the traits lit: THE TRAITS, IN AN ELEPHANT · NOT THE MAMMOTH', 'MIX', 'the poster', ''),
 ('3.15', 'The mammoth draws the cameras', 'the poster mammoth on the horizon, all light on it; then the camera turns to the small frost door and the hut window', 'WORLD', 'the fence', ''),
 # ---------------------------------------------------------------- c16 · B3 · the fence once more, the vote, subscribe 2, end
 ('6.01', 'So stand at that fence once more', 'THE FENCE like frame 0, but behind it the elephant in a mammoth\'s coat lifts its head; the small hand in yours', 'WORLD', 'the gate', ''),
 ('6.02', 'Should it ever walk free', 'the gate in the fence, closed; one vote tally: 1 · VOTE; source IUCN CONGRESS, OCT 2025 · MORATORIUM REJECTED BY ONE VOTE; WHO DECIDES?', 'EXPL', 'the child', ''),
 ('6.03', 'Whatever the answer', 'the child, grown (a young adult silhouette, no yellow) at the fence; elephants, ferrets, birds, wolves alive in the snow', 'SCENE', 'the poster', ''),
 ('6.04', 'The mammoth is the poster', 'THE POSTER (the gold mammoth on the horizon) · THE ARK (the frost door glowing at the hut)', 'MIX', 'subscribe', ''),
 ('A.01', 'These films exist', 'subscribe 2: the final picture runs on (no buttons, one quiet line), no QR', 'WORLD', 'the walk', ''),
 ('A.02', 'END', 'the quiet walk without voice: you and the child walk along the fence (music carries)', 'WORLD', 'END_CAM', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s: S.END_CAM, the fence, the two of you, the animals lit, snow; free: S.END_TILES; no text, no QR', 'WORLD', '—', ''),
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
L.append('# Film 29 · "AI Is Bringing Back the Mammoth" · shot list (binding)\n')
L.append(f'Generated by `tools/shots29.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'Wording follows vo-v3 (the fact check; a newer vo-vN wins; `faktenzettel.md` and the newest vo-vN override every number here).\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · CARD 1 · MIX .5 · WORLD .3 · SCENE 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. The whole film is ONE world (THE FENCE): the lab, the cutaways under the snow and the night stage of the dodo open out of a thing (the hut window, the snow, a strand) and close back into it — continuous, not W.')
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
L.append('\n## 4 · Seams between the groups (lib/f29_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append('| Lead → B1 | The mice belong | plateFence (FENCE_C0 creeping via S.creepCam: you and the child from behind left of centre, today\'s animals lit gold, the hut far left) | H.15 glides onto it (built) | 1.01 glides left to the hut |')
L.append('| B1 → B2 | Then it turned to the dodo | plateDodo (screen space on S.stage: the gold-rung dodo centred, its unlit strand under it, tally 70+ LIVING BIRD SPECIES) | 1.25 settles onto it | 2.01 the comb runs the strand |')
L.append('| B2 → B3 | Now take an American animal | plateIce (ICE_CAM on the world: the ice block with broken strand shards in the snow, no fence, no people) | 2.22 settles onto it | 3.01 the block frosts into the freezer door |')
L.append('\nBoth sides draw the plate (S.plateFence / S.plateDodo / S.plateIce) for ±0.5 s with the same creep (3 %/s push, 24 px/s truck), no drift. Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('≤ 6 words per explainer. **vo-v3.txt and faktenzettel.md override every number here.** Company figures say so on screen (PER COLOSSAL, AS REPORTED, NOT PEER-REVIEWED, CANDIDATES, NOT PROOF).')
L.append('- Hook: AI IS BRINGING / BACK THE MAMMOTH · SCENARIO · EARLY 2030s · ELEPHANT · MAMMOTH · 1,400,000 · DIFFERENCES IN THE DNA · WHICH ONES? · sources `F.SOURCES.diff14`, `F.SOURCES.mice`')
L.append('- 1: COLOSSAL · DALLAS · NOT THIS · ASIAN ELEPHANT · LIVING COUSIN · FUR · FAT · EARS · THE LIST · 100 MAMMOTH GENOMES · READING ≠ KNOWING · 1,600 GENES · ~150 GENES ON THE LIST · 7 GENES · TESTED IN MICE · ALREADY KNOWN COAT GENES · THE EDITING ✓ · THE LIST ? · NO MAGIC. NOTHING OVERNIGHT. · SOMEBODY HAS TO TEST IT · THE DODO · 1 DODO GENOME · 70+ LIVING BIRD SPECIES')
L.append('- 2: 2,300 CANDIDATES · MIGHT. · IT LEARNS FROM THE LIVING · IS IT A MAMMOTH? · 3 ALIVE · ROMULUS · REMUS · KHALEESI · 13,000 YEARS · 20 EDITS · 14 GENES · GRAY WOLF CELLS · 2 YEARS · HEALTHY · SO ARE THEY? · THE TRAITS COME BACK. THE SPECIES DOES NOT. · 2028 · EARLY 2030s · NO HARD DATE · NO EMBRYO REPORTED · ~22 MONTHS · THE BIGGER PRIZE · ~4,000 YEARS AGO · WRANGEL ISLAND')
L.append('- 3: WILLA · 1980s · GRANDCHILDREN · NO LIST. NO GUESSWORK. · ~2,300 LISTED SPECIES · ONLINE · FREE · NO HABITAT · ASIAN ELEPHANT · ENDANGERED · A FIRST SIGN, NOT PROOF · ~50,000 THREATENED SPECIES · THE TRAITS, IN AN ELEPHANT · NOT THE MAMMOTH')
L.append('- 6: 1 VOTE · WHO DECIDES? · THE POSTER · THE ARK')
L.append('- Quote cards (`F.QUOTES`, `F.quoteCard`): C1 (clip slot: the clip audio plays if a real clip file appears in <ROOT>clips/, else the card lights evenly), Q1 and Q3 (picture only, time to read), Q2 (spoken: words light with the voice). No photo, no footage, no likeness, never "ORIGINAL FOOTAGE".')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
