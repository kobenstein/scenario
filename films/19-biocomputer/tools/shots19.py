#!/usr/bin/env python3
"""Film 19 shot list (single source): every shot anchored to a VO PHRASE (looked up globally, in film order), never to a second.
  python3 tools/shots19.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, writes the shot list markdown.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json).
Layer: SCENE (the 3D aisle: rack, drawer, you) · CLIP (ORIGINAL FOOTAGE in a screen; not counted in the share) · EXPL (explainer graphic: light on night) · SCENE>EXPL / EXPL>SCENE (the shot holds the transformation; counts half).
A shot starts at its first phrase (searched after the previous shot's start) and runs to the next shot's start; anchors are searched
after the shot start. The scene code uses the same phrases: T.G(phrase, 0, after)."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REAL = '/mnt/project-files/scenario/film-biocomputer/audio/timing.json'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--md']
TIMING = args[0] if args else (REAL if os.path.exists(REAL) else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WS = TM['words']
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def gfind(phrase, after=-1.0, nth=0):
    q = [norm(p) for p in phrase.split() if norm(p)]; hit = 0
    for i in range(len(WS) - len(q) + 1):
        if WS[i]['s'] < after - 1e-3: continue
        if all((norm(WS[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(WS[i + j]['w']) == p) for j, p in enumerate(q)):
            if hit == nth: return WS[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.2f}: "{phrase}"')

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, builder, title, first phrase, light / hero
CHUNKS = [
    ('c01', 'Lead', 'Hook: the drawer, you, the rack in Singapore, feeding, Doom (C1), no hands/eyes/reward, the question, blood, the clock', 'Computers now run on', 'THE RACK (anchor): the drawer opens, the dish glows → the dish field: the net rewinds to one blood cell with a clock'),
    ('c02', 'B1', 'Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original', 'In a lab', 'Dish field: the cell (carrier) → stem cell → neuron → the net grows → pull back into the box'),
    ('c03', 'B1', 'Pong 2022: sense and move zones · the trick: order or noise', 'The answer came', 'Dish field: the Pong court drawn over the chip; ORDER (gold ticks) vs NOISE (cool static)'),
    ('c04', 'B1', 'Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick?', 'After about five minutes', 'Dish field: rally counter; the radio dial (you); C2 in a screen'),
    ('c05', 'B1', "For sale ($35,000 / a few hundred a week) · Doom in a week · \"doesn't know\" · why a rack?", "It didn't stay in the lab", 'The box as product → Doom → the box slides into the rack (plateRack)'),
    ('c06', 'B2', 'Twenty watts · data centres +50 % · Melbourne, Singapore, 1,000 · 30 W per box, untested', 'It comes down to a number', 'From the rack to your head (20 W) → the aisle grows (Singapore) → the box\'s watts'),
    ('c07', 'B2', 'The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch)', 'Picture it as a match', 'THE SCOREBOARD over the dish field: CELLS (gold) vs A.I. (cool)'),
    ('c08', 'B2', 'Round 3 everything else · final score · pairing · is anyone in there?', 'Round three', 'Scoreboard 2 : 1 → pairing → fly down into the dish (plateNet)'),
    ('c09', 'B3', 'How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence', 'First, how big', 'The size ladder (creatures) → 120 dishes → your head'),
    ('c10', 'B3', 'Seth · embedded ethics (Johns Hopkins) · Smirnova (C3) · what now?', 'Still, some researchers', 'The rack (anchor: a bee on the box) → the round table → C3 in a screen'),
    ('c11', 'B3', 'The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen', 'At the start, the question', 'Dish field: callback, three rule cards → THE RACK: the drawer closes, you in the aisle'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook (Lead, built: scenes/sc01.mjs) ===================================================================================
shot('1.01', 'SCENE', 'Computers now run on', ['human brain cells'],
     '**★ [THE RACK · opening image = thumbnail]** Close above drawer 11 of the alive rack: it slides open, light rises, the dish with the gold net glows on its chip.',
     '① drawer slides ② light/sparks', 'plan sequence · truck left to you', star=True)
shot('1.02', 'SCENE', 'The same kind of cells', ['right now', 'watch this'],
     'You (yellow raincoat) in the aisle with your phone; the same net (same sparks) glows inside your hood. The open drawer at the right edge.',
     '① head net ② phone light', 'plan sequence · pull back')
shot('1.03', 'SCENE', 'But these live on a chip', ['chip', 'server rack', 'Singapore'],
     'The aisle (medium, breathing pull back): the alive rack (gold seams) among cold servers, you look up at it. Label from the rack top: SINGAPORE / DATA CENTRE.',
     '① you look up ② label', 'plan sequence · push to the drawer')
shot('1.04', 'SCENE', 'And every few days', ['someone feeds them'],
     'A gloved hand lowers a pipette over the dish; one drop falls; the net answers in a wave from the landing point.',
     '① pipette ② drop → wave', 'truck right into the screen in the aisle')
shot('1.05', 'CLIP', 'Cells like these', ['play this', 'controller', "They haven't"],
     '**[C1 · ORIGINAL FOOTAGE, muted under the voice]** The screen on a stand in the aisle fills CLIP_RECT: CL1 playing DOOM. Credit: Cortical Labs · CL1 PLAYING DOOM · 2026.',
     '① footage', 'the screen goes dark')
shot('1.06', 'EXPL', 'No hands', ['No eyes', 'No reward'],
     'In the dark screen: hand, eye, star rise one per word, each struck by a cool line.',
     'one glyph per word', 'the camera swings back and tilts down into the dish')
shot('1.07', 'SCENE>EXPL', 'So how do you teach a dish', ['cells anything'],
     'The question line rises; the camera tilts straight down into the dish while the aisle sinks into night: the dish IS the explainer field now. The ladder rail grows at the left edge.',
     '① camera ② ladder', 'plan sequence (2D from here)')
shot('1.08', 'EXPL', 'Your brain cells grew', ['inside a head', 'These never did'],
     'A head silhouette rises beside the dish, its own small net glowing (rung 1: WHERE DO THE CELLS COME FROM?).',
     '① head rises', 'plan sequence')
shot('1.09', 'EXPL', "They didn't even start out", ['blood sample', 'last checkup', 'make brain cells', "cell's clock"],
     'The head sinks; the net REWINDS into round cells, gold → cool: blood cells (rung answer BLOOD). The tube (DONOR) rises; all cells but one stream back into it; the one comes to the centre, grows, gets a clock ring with the hands turning BACKWARD.',
     '① rewind ② stream / clock', 'seam → **plateClock**')

# ===== c02 (B1) ====================================================================================================================
shot('2.01', 'EXPL', 'In a lab', ['stem cells', 'almost anything', 'Nobel Prize', 'no embryos'],
     'From plateClock: the clock keeps turning back, the blood cell warms into a round gold STEM CELL; the clock ring opens into a fan of faint futures (neuron, muscle, heart, …). Small label NOBEL PRIZE 2012.',
     '① cell warms ② fan', 'plan sequence')
shot('2.02', 'EXPL', 'Then the clock runs forward', ['grow into neurons', 'Brain cells'],
     'The hands turn FORWARD; the fan folds into one branch: the stem cell sprouts dendrites → a neuron (cell kind neuron, sprout 0→1).',
     '① clock forward ② sprout', 'plan sequence')
shot('2.03', 'EXPL', 'Spread them on a chip', ['reach out', 'wiring up'],
     'The neuron is one of many on the chip; they reach out to each other: THE NET grows (net grow 0→1) on the dish field.',
     '① net grows', 'plan sequence')
shot('2.04', 'EXPL', 'Tiny electrodes underneath', ['send them signals', 'their answers', 'Ordinary code'],
     'The electrode grid under the net: cool pulses go up (signals), gold sparks come back (answers); a thin line of code runs at the dish rim.',
     '① pulses up ② sparks back', 'pull back out of the dish')
shot('2.05', 'SCENE>EXPL', "That's the computer", ['living neurons', 'life support', 'Cortical Labs'],
     'Pull back: the dish shrinks into the window of THE BOX (cl1, front view) with its life-support tubes; label CORTICAL LABS · MELBOURNE.',
     '① pull back ② pump pulse', 'plan sequence')
shot('2.06', 'EXPL', 'The artificial intelligence you know', ['imitates neurons', 'real thing'],
     'Split: left a cool node graph of math imitating a neuron, right the gold net (the original).',
     '① cool graph ② gold net', 'plan sequence')
shot('2.07', 'EXPL', 'So how do you teach it', ['without a reward'],
     'The cool graph withdraws; the box window grows back to the dish field (rung 2: HOW DO YOU TEACH THEM?).',
     '① window grows', 'plan sequence')

# ===== c03 (B1) ====================================================================================================================
shot('3.01', 'EXPL', 'The answer came from', ['four years ago', 'Pong'],
     'On the dish field the Pong court draws itself in cool lines over the chip: two walls, a paddle, a ball. Label PONG · 2022.',
     '① court draws ② ball', 'plan sequence')
shot('3.02', 'EXPL', 'They connected a dish', ['human cells', 'mice', 'never saw a screen', 'where the ball was', 'moved the paddle'],
     'Two cell icons (human, mouse); a small screen icon struck. Then the SENSE zone of electrodes lights where the ball is; activity in the MOVE zone pushes the paddle.',
     '① sense zone ② paddle', 'plan sequence')
shot('3.03', 'EXPL', 'Then came the trick', ['Hit the ball', 'tidy signal', 'Miss', 'random noise', 'static'],
     'Hit: a short tidy pulse runs over all electrodes (gold, regular ticks). Miss: four seconds of cool static fill the field (a 4 s bar empties).',
     '① tidy pulse ② static', 'plan sequence')
shot('3.04', 'EXPL>SCENE', 'No reward. Just order', ['chaos'],
     'Two strips side by side: ORDER (gold ticks) and NOISE (cool static); pull back up out of the dish to the drawer in the aisle.',
     '① strips', 'plan sequence')

# ===== c04 (B1) ====================================================================================================================
shot('4.01', 'EXPL', 'After about five minutes', ['rallies got longer', 'no feedback', "wasn't luck"],
     'A rally counter climbs over a 5-minute clock; a second, cool line for the dishes without feedback stays flat.',
     '① gold line climbs', 'plan sequence')
shot('4.02', 'EXPL', 'It looks like the cells want', ['too big a word', 'keeps the noise away'],
     'The word "want" sits over the dish, then shrinks (too big a word); the net settles where the static stays away.',
     '① word shrinks', 'plan sequence')
shot('4.03', 'SCENE', 'Behind the trick', ['Karl Friston', 'more predictable', 'crackling radio'],
     'In the aisle (anchor): label KARL FRISTON · NEUROSCIENTIST. You (yellow) turn the dial of a small radio; its noisy wave smooths into a clean voice line.',
     '① dial ② wave smooths', 'the radio becomes a screen')
shot('4.04', 'CLIP', "Here's Brett Kagan", ['led the study'],
     '**[C2 · ORIGINAL FOOTAGE]** Brett Kagan · Chief Scientific Officer, Cortical Labs · 2026, in the screen (CLIP_RECT).',
     '① footage', 'out of the screen')
shot('4.05', 'EXPL', 'So cells can learn', ['order and noise', 'lab trick'],
     'Back on the dish field; ladder: answer ORDER VS. NOISE, then rung 3 JUST A LAB TRICK?',
     '① ladder', 'plan sequence')

# ===== c05 (B1) ====================================================================================================================
shot('5.01', 'SCENE>EXPL', "It didn't stay in the lab", ['became a product', 'thirty-five thousand', 'rent one', 'few hundred'],
     'The box on a plinth in the aisle as a product: a tag $35,000; a smaller cloud tag A FEW HUNDRED $ / WEEK (never "$300").',
     '① tag ② cloud tag', 'plan sequence')
shot('5.02', 'SCENE>EXPL', 'And that game from the start', ['Doom', 'about a week', 'year and a half'],
     'The screen in the aisle again (C1 motif, small, no new footage); two bars: ABOUT A WEEK (Doom) vs 1½ YEARS (Pong setup).',
     '① bars', 'plan sequence')
shot('5.03', 'EXPL', 'The cells turn, find enemies', ['die a lot', "doesn't actually know"],
     'Quote card: "The system doesn\'t actually know it\'s playing Doom." Alon Loeffler, Cortical Labs.',
     '① quote', 'plan sequence')
shot('5.04', 'EXPL>SCENE', 'Still... from Pong to Doom', ['four years', 'server rack'],
     'PONG → DOOM · 4 YEARS; then the box slides back into drawer 11, pull back onto RACK_PLATE_CAM (rung 4: WHY A DATA CENTER?).',
     '① box slides in ② pull back', 'seam → **plateRack**')

# ===== c06 (B2) ====================================================================================================================
shot('6.01', 'SCENE>EXPL', 'It comes down to a number', ['inside your head', 'twenty watts', 'ever learned'],
     'From plateRack: push past the rack to you; your head\'s net glows: 20 WATTS (ladder answer).',
     '① push ② 20 W', 'plan sequence')
shot('6.02', 'EXPL', 'The data centers behind', ['vastly more', 'about half'],
     'A cool bar for A.I. data-centre electricity jumps by about half (+50 %, IEA 2026).',
     '① bar jumps', 'plan sequence')
shot('6.03', 'SCENE', 'So some companies are betting', ['original', 'Melbourne and Singapore', 'thousand', 'drug research'],
     'The aisle: two map pins MELBOURNE · SINGAPORE; in Singapore the alive racks multiply down the aisle: UP TO 1,000.',
     '① pins ② racks', 'plan sequence')
shot('6.04', 'SCENE>EXPL', 'But does it actually save power', ['thirty watts', 'whole brain', 'almost nothing', 'life support', 'nobody has tested'],
     'A box half out of its drawer: 30 W (incl. life support) vs your brain 20 W; inside the box the cells\' share is a sliver, the pumps take the rest. NOT YET TESTED.',
     '① bars ② sliver', 'plan sequence')
shot('6.05', 'SCENE', 'So can a dish of cells really', ['compete'],
     'The aisle (anchor): the alive rack among the cold servers; rung 5: CAN CELLS COMPETE?',
     '① ladder', 'plan sequence')

# ===== c07 (B2) ====================================================================================================================
shot('7.01', 'SCENE>EXPL', 'Picture it as a match', ['cells against', 'Three rounds'],
     'In the aisle the scoreboard rises over the alive rack, then the camera dives into the dish field under it: CELLS (gold) : A.I. (cool), three round lamps.',
     '① board rises', 'plan sequence')
shot('7.02', 'EXPL', 'Round one', ['Learning speed', 'study published last year', 'three standard', 'tiny amount of practice'],
     'Pong again: the dish vs three cool program icons; equal short practice bars.',
     '① lamp 1 ② bars', 'plan sequence')
shot('7.03', 'EXPL', 'The cells learned faster', ['longer rallies'],
     'Two curves: gold rises faster than cool.',
     '① curves', 'plan sequence')
shot('7.04', 'EXPL', 'Point, cells', ['with a catch', 'older', 'far more practice'],
     'A gold point token drops; a CATCH tag hangs from it.',
     '① token ② catch', 'plan sequence')
shot('7.05', 'EXPL', 'Round two', ['Teamwork', 'Washington', 'fifteen boxes', 'thirty-two', 'about forty', 'About seventy'],
     'Fifteen small boxes link into a team (presented, not shown live); a figure steers across a grid to a goal; three bars: 32 · 40 · 70 (numbers only, no "% of max").',
     '① boxes link ② bars', 'plan sequence')
shot('7.06', 'EXPL', 'Point, cells. Another catch', ['No published paper', "today's best"],
     'Second gold token, second CATCH tag: ONE COMPANY · ONE TALK · NO PAPER YET.',
     '① token ② catch', 'plan sequence')

# ===== c08 (B2) ====================================================================================================================
shot('8.01', 'EXPL', 'Round three', ['six months', 'good days', 'fast, precise math'],
     'Lamp 3; a six-month bar; a wave of good and bad days; a cool block of fast math.',
     '① bar ② wave', 'plan sequence')
shot('8.02', 'EXPL', 'Point, artificial intelligence', ['A big one'],
     'The A.I. token drops and grows giant.',
     '① token grows', 'plan sequence')
shot('8.03', 'SCENE>EXPL', 'Final score', ['Two small points', 'giant one', 'pairing'],
     '2 : 1 · WITH CATCHES (ladder answer); then pull back into the aisle: gold drawers and cool servers side by side in one rack: pairing.',
     '① score ② interlock', 'plan sequence')
shot('8.04', 'EXPL', 'Cells that learn', ['anyone in there'],
     'Fly down into the dish: one soma in the centre flickers (rung 6: IS ANYONE IN THERE?).',
     '① fly down', 'seam → **plateNet**')

# ===== c09 (B3) ====================================================================================================================
shot('9.01', 'EXPL', 'First, how big', ['two hundred thousand', 'fruit fly', 'honeybee'],
     'From plateNet: pull back, the net shrinks into the box\'s window; the box stands on the size ladder: FLY < BOX < BEE (creature fill = neurons).',
     '① pull back ② ladder', 'plan sequence')
shot('9.02', 'EXPL', "Put all of Melbourne's boxes", ['a third', 'mouse brain', 'hundred and twenty', 'eighty-six billion'],
     'A grid of 120 small dishes fills a third of a mouse silhouette; then your head: 86 BILLION.',
     '① grid fills ② your head', 'plan sequence')
shot('9.03', 'EXPL>SCENE', 'Reacting to signals', ['no evidence', 'structure'],
     'A signal arrow in, a reaction out, nothing in between that feels: NO EVIDENCE · STAY CAREFUL (ladder answer).',
     '① arrow', 'pull back into the aisle')

# ===== c10 (B3) ====================================================================================================================
shot('10.01', 'SCENE', 'Still, some researchers', ['Anil Seth', 'ChatGPT'],
     'The alive rack; a small bee silhouette rests on the box (scale). Label ANIL SETH · NEUROSCIENTIST.',
     '① bee ② label', 'plan sequence')
shot('10.02', 'SCENE>EXPL', 'At Johns Hopkins', ['from the very start', 'Ethicists', 'embedded ethics'],
     'In the aisle, round the open drawer: ethicists, scientists, the public (three groups of small figures): EMBEDDED ETHICS.',
     '① groups gather', 'into the screen')
shot('10.03', 'CLIP', "Here's Lena Smirnova", ['what that means'],
     '**[C3 · ORIGINAL FOOTAGE]** Lena Smirnova · Johns Hopkins University · 2023, in the screen (CLIP_RECT).',
     '① footage', 'out of the screen')
shot('10.04', 'SCENE', 'So what do we do now', ["bee's brain"],
     'Out of the screen into the aisle: the alive rack, the bee on the box; ladder top: WHAT NOW?',
     '① ladder', 'plan sequence')

# ===== c11 (B3) ====================================================================================================================
shot('11.01', 'EXPL', 'At the start, the question', ['Order', 'teaching us back'],
     'Callback: the question line of 1.07 returns; ORDER … AND NOISE; the net sparks back at you.',
     '① question ② answer', 'plan sequence')
shot('11.02', 'EXPL', 'First, about learning', ['very little power', 'leaner'],
     'Two small gauges (power, practice) stay low; a cool software block slims.',
     '① block slims', 'plan sequence')
shot('11.03', 'EXPL', 'And the good is already real', ['Epilepsy', 'Pong game', 'animal experiments', 'brain diseases'],
     'A drug drop on the neurons; the Pong rally improves; a mouse silhouette steps back.',
     '① drop ② mouse', 'plan sequence')
shot('11.04', 'EXPL>SCENE', 'The harder lesson', ['good rules', 'Three would be'],
     'Pull back: the drawer in the aisle; three empty rule cards rise beside the rack (ladder answer 3 RULES).',
     '① cards rise', 'plan sequence')
shot('11.05', 'EXPL', 'One. Donors', ['say yes'],
     'Card 1 fills: the donor tube + a tick: CONSENT.',
     '① card 1', 'plan sequence')
shot('11.06', 'EXPL', 'Two. Before these systems', ['signs of experience', 'oversight'],
     'Card 2 fills: a check-light over a growing net: CHECK, EVERY TIME.',
     '① card 2', 'plan sequence')
shot('11.07', 'EXPL>SCENE', 'Three. Results in public', ['anyone can check'],
     'Card 3 fills: an open book / open window: IN PUBLIC.',
     '① card 3', 'tilt up out of the dish into the aisle')
shot('11.08', 'SCENE', 'For seventy years', ['imitate brain cells', 'inside the machine', 'up to us'],
     '**★** Back in the aisle: the drawer slides shut, its gold seam glows; you stand in front of the alive rack and look up.',
     '① drawer closes ② you', 'pull back into the end screen', star=True)

ENDSCREEN = ('11.09', 'SCENE', 'End screen (VO end → film end, ≤ 15 s, no voice). The aisle at night, slow pull back: the alive rack in the centre (x 840–1080), its seams breathing, you tiny before it. **Free areas for the YouTube end cards: left x 90–780 and right x 1140–1830, y 250–700**; nothing moves there but the grain.', '① seams breathe ② slow pull back')

# ---------------------------------------------------------------------------------------------------------------------------------
def ff(x): return f'{x:.2f}'.replace('.', ',')

def resolve():
    chunk_start = {}
    last = -1.0
    for c in CHUNKS:
        t0 = 0.0 if c[0] == 'c01' else gfind(c[3], last)
        chunk_start[c[0]] = t0; last = t0
    last = -1.0
    for sh in S:
        t = 0.0 if sh['id'] == '1.01' else gfind(sh['start'], last)
        sh['t'] = t; last = t
        sh['at'] = [(a, gfind(a, t - .01)) for a in sh['anchors']]
    for i, sh in enumerate(S):
        sh['t1'] = S[i + 1]['t'] if i + 1 < len(S) else vo_end()
    return chunk_start

def vo_end(): return max(w['e'] for w in WS)

def chunk_of(sh): return 'c%02d' % int(sh['id'].split('.')[0])

LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5, 'CLIP': None}   # CLIP: original footage, outside the share

def main():
    cs = resolve()
    dur = TM['duration']
    ends = {c[0]: (cs[CHUNKS[i + 1][0]] if i + 1 < len(CHUNKS) else dur) for i, c in enumerate(CHUNKS)}
    out = []
    out.append('| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |')
    out.append('|---|---|---|---|---|---|---|---|')
    tot = {'B1': 0, 'B2': 0, 'B3': 0, 'Lead': 0}
    allx = [0, 0]
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs if LAYER_W[s['layer']] is not None) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs if LAYER_W[s['layer']] is not None)
        allx[0] += ex; allx[1] += span
        a, b = cs[c[0]], ends[c[0]]; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / span)}% |')
    out.append('')
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s · B1 {tot["B1"]:.0f} s · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s (B3 includes the ≤ 15 s end screen). '
               f'**Explainer share (spoken part):** {round(100 * allx[0] / allx[1])}% (mixed shots count half, clips excluded). Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL)" if TM.get("provisional") else ""}.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs if LAYER_W[s['layer']] is not None) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs if LAYER_W[s['layer']] is not None)
        star = next((s['id'] for s in shs if s['star']), '–')
        a, b = cs[c[0]], ends[c[0]]
        out.append('')
        out.append(f'### {c[0]} · {c[2]} · {ff(a)}–{ff(b)} ({b - a:.0f} s) · {c[1]} · ★ {star} · [EXPL] {round(100 * ex / span)}%')
        out.append(f'Light/hero: {c[4]}')
        out.append('')
        out.append('| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |')
        out.append('|---|---|---|---|---|---|---|')
        for s in shs:
            an = ' · '.join(f'**{a}** @{ff(t)}' for a, t in s['at'])
            sid = f'**{s["id"]} ★**' if s['star'] else s['id']
            out.append(f'| {sid} | [{s["layer"]}] | {ff(s["t"])}–{ff(s["t1"])} | {an} | {s["pic"]} | {s["moves"]} | {s["tr"]} |')
        if c[0] == 'c11':
            e = ENDSCREEN
            out.append(f'| {e[0]} | [{e[1]}] | {ff(vo_end())}–{ff(dur)} | – | {e[2]} | {e[3]} | – |')
    md = '\n'.join(out)
    print('\n'.join(out[:len(CHUNKS) + 4]))
    if '--md' in sys.argv:
        p = sys.argv[sys.argv.index('--md') + 1]
        doc = open(p).read() if os.path.exists(p) else '<!-- SHOTS:BEGIN -->\n<!-- SHOTS:END -->\n'
        a, b = doc.index('<!-- SHOTS:BEGIN -->'), doc.index('<!-- SHOTS:END -->')
        open(p, 'w').write(doc[:a] + '<!-- SHOTS:BEGIN -->\n' + md + '\n\n' + doc[b:])
        print('wrote', p)

if __name__ == '__main__':
    main()
