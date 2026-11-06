#!/usr/bin/env python3
"""Film 23 "Your 2037 Has Already Started" · shot list (single source). Every shot is anchored to a VO PHRASE (looked up globally, in
film order), never to a second.
  python3 tools/shots23.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, writes the shot list markdown.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json).
Layer: SCENE (2.5D world: the cut-away street) · EXPL (explainer graphic: light on night, grown from a world object) ·
SCENE>EXPL / EXPL>SCENE (the shot holds the transformation; counts half) · CLIP (ORIGINAL FOOTAGE on the kitchen wall; excluded
from the explainer share, reported separately).
A shot starts at its first phrase (searched after the previous shot's start; 'clip:K1' = the clip slot's start in timing.json) and
runs to the next shot's start; anchors are listed in VO order and each is searched after the previous one. Phrase matching is robust to how the TTS splits words
("Seven-thirty" = "Seven" "thirty" = "Seven-thirty"). The scene code uses the same phrases: T.G(phrase, 0, after)."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REAL = '/mnt/project-files/scenario/film-erster-tag/2037/audio/timing.json'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--md']
TIMING = args[0] if args else (REAL if os.path.exists(REAL) else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WS = TM['words']
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
NW = [norm(w['w']) for w in WS]

def gfind(phrase, after=-1.0, nth=0):
    q = ''.join(norm(p) for p in phrase.split()); hit = 0
    for i in range(len(WS)):
        if WS[i]['s'] < after - 1e-3 or not NW[i] or not q.startswith(NW[i][:len(q)]): continue
        acc, j = '', i
        while j < len(WS) and len(acc) < len(q):
            acc += NW[j]; j += 1
        if acc.startswith(q) and (len(acc) == len(q) or len(acc) - len(NW[j - 1]) < len(q)):
            if hit == nth: return WS[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.2f}: "{phrase}"')

def clip(cid):
    cl = TM.get('clips', [])
    c = next((c for c in cl if cid in str(c.get('id', '')) or cid in str(c.get('file', ''))), None)
    if c is None:  # fall back to film order (K1, K3, K4 = 1st, 2nd, 3rd clip)
        order = ['K1', 'K3', 'K4']; ks = [c for c in cl if c.get('kind', 'clip') == 'clip']
        c = ks[order.index(cid)] if cid in order and len(ks) > order.index(cid) else None
    if c is None: raise SystemExit(f'clip {cid} not in {TIMING}')
    return c

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, builder, title, first phrase, light / hero
CHUNKS = [
    ('c01', 'Lead', 'Hook · 2037, a possible Tuesday · 06:15 the message from the clinic · it could have gone only to payers', 'Your twenty thirty-seven', 'Night city in section · hero: the gold year 2037 → your lit kitchen window → the clinic\'s light reaching every window'),
    ('c02', 'Lead', '06:15 · the spot against every scan in history · no bill · the kettle · the argument next door', 'You open the scan', 'Inside the phone: one scan tile against a sky of scans → the kitchen at first light → the tutor\'s voice-light next door'),
    ('c03', 'B1', '07:30 · the kid and her tutor: the genius that asks instead of answering', 'Seven-thirty', 'Kitchen table at dawn · hero: the cool voice-light and the ladder of questions under the sealed answer'),
    ('c04', 'B1', '09:00 · breakthroughs like weather · the night shift of science · outside testers, in the open', "Nine o'clock", 'The quiet flat → the tower of tireless minds on the skyline → the road to the testers\' open house'),
    ('c05', 'B1', '12:00 · the agent that belongs to you: forms, deposit, insurance, loyalty', 'Noon', 'Noon light · hero: the agent\'s light on its gold thread to your wrist; the makers\' cool thread cannot attach'),
    ('c06', 'B2', '16:00 · Dad on the balcony: translation, hearing, the flat that keeps an eye · the same earbuds for everyone', "Four o'clock", 'Low gold sun · the walk two streets over → the balcony → Dad\'s building in section, every flat lit the same'),
    ('c07', 'B2', '19:00 · dinner: black holes with a pea · the homework question · it almost went another way · K1 Schneier', "Seven o'clock", 'The lamp over the kitchen table · the light wall above it: the fork in the road · the old recording (K1)'),
    ('c08', 'B2', 'Dinner II · the other way · people got stubborn · one in five didn\'t hold up · test before you trust', 'When you were a baby', 'The light wall: the other road\'s three pictures → five findings, one goes dark → the testers\' gate for medicines and machines'),
    ('c09', 'B3', 'Dinner III · the agent\'s loyalty · doctors, lawyers, agents · K3 Berners-Lee · it loses its keys', 'And today you say', 'The light wall: threads cut from the towers and re-tied to people → the old recording (K3) → the ring of keys'),
    ('c10', 'B3', 'Dinner IV · luxury or library · who paid · was it easy · the tutor that asks · K4 Khan', "And Grandpa's earbuds", 'The light wall: the earbuds behind glass → the library that lights every window → the exam chart → the old recording (K4)'),
    ('c11', 'B3', 'Dinner V · the grown-ups practiced · what did you do · the three questions · millions · the notebook', 'And the grown-ups practiced', 'The light wall: the school, teachers first → the three questions → the city of millions of lights → her notebook'),
    ('c12', 'Lead', '22:30 · asleep over a black hole · the call with Dad · the city goes to sleep · the title + end screen', 'Ten-thirty', 'Night, moon · the notebook → the call between two windows → the hallway window: the city\'s lights go out, one stays on'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook (Lead) ==========================================================================================================
shot('1.01', 'EXPL>SCENE', 'Your twenty thirty-seven', ['twenty thirty-seven', 'already started', 'one day', 'A Tuesday'],
     '**[OPENING IMAGE = THUMBNAIL MOTIF · placeholder, see §5]** Night. The cut-away street in section, dark, one window lit warm on floor 2 of your building (your kitchen). Over the roofs the year rolls in big (Instrument Serif, odometer roll 2026 → 2037, gold core): it lands on **twenty thirty-seven**. On **already started** the last digit gives one small settle. On **one day** the year shrinks along an arc into the top-left corner and becomes the **day-clock stamp** (`TUESDAY · 2037`, the dial with its sun-dot still under the horizon). On **A Tuesday** `A POSSIBLE TUESDAY` rises under it from its baseline (scenario label, holds ≥ 3 s).',
     '① year roll → shrink to stamp ② label rises', 'plan sequence · carrier: the year itself becomes the clock stamp (top-left, stays for the whole film)')
shot('1.02', 'SCENE', 'Superintelligence has been here', ['Superintelligence', 'for years'],
     'The camera glides slowly right and down over the sleeping city. On **Superintelligence** the **night-shift tower** on the skyline is found: a tall slab whose windows glow machine-cool (the machine is light, never a robot). On **for years** tiny cool points are seen in many ordinary windows too: quiet, everyday.',
     '① glide ② the tower\'s windows', 'plan sequence · carrier: the camera\'s glide continues down onto your building')
shot('1.03', 'SCENE', 'Six-fifteen', ['Six-fifteen', 'kitchen', 'phone buzzes', 'clinic'],
     'On **Six-fifteen** the clock prints `06:15` (first jump: the digits roll in, the sun-dot sits just under the dial horizon). The camera arrives at your lit window: the kitchen in section, **you** (yellow raincoat, hood down indoors) at the table. On **phone buzzes** the phone on the table lights cool-white and shivers twice. On **clinic** a thin gold line draws from the **clinic** (low building at the left end of the street, one tall warm window) along the street to your phone.',
     '① arrive ② phone, then the line', 'plan sequence · carrier: the phone\'s light')
shot('1.04', 'SCENE>EXPL', 'Overnight, an AI read your scan', ['Overnight', 'read your scan', 'found something', 'Early', 'stay small'],
     'You lift the phone; the camera pushes over your shoulder until the phone face is large. On **read your scan** the scan draws itself: a cool circle of light (an organ in section, no anatomy detail). On **found something** a gold ring closes round one tiny warm spot. On **Early** a thin timeline under it shows the mark at its very start; on **stay small** the ring tightens a step.',
     '① push to the phone ② the ring', 'plan sequence · carrier: the scan ring rises out of the phone into the sky over the city')
shot('1.05', 'EXPL', "It wasn't luck", ['luck', 'same machines', 'only to people', 'pay extra', 'go well'],
     '**★ The other way, then this way.** Pull back out of the window to the whole city in section (the explainer view of the world: a map of windows). From the clinic\'s window a fan of thin gold lines reaches toward every window. On **only to people who pay extra** the lines draw back: only a few windows with a small gold price tag keep their line, the rest of the city stays dark (light halves: warm few, dark many). On **So why did it go well?** the lines run out again to **every** window at once (the version that happened). Widest, calmest picture of the hook.',
     '① the lines retract ② the lines spread to all', 'transformation · carrier: the line to YOUR window, the camera follows it back in · centre-left · inward')

# ===== c02 · 06:15 the finding (Lead) =============================================================================================
shot('2.01', 'EXPL', 'You open the scan', ['open the scan', 'There it is', 'spot', 'grain of rice'],
     '**Flight into the phone** (hard change 1): the scan fills the frame, cool circle on night. On **There it is** the warm spot pulses once. On **grain of rice** a grain of rice (gold outline, flat) slides in beside it on an arc and settles: the spot is visibly smaller. No numbers.',
     '① the grain slides in', 'plan sequence · carrier: the scan tile')
shot('2.02', 'EXPL', 'The mind that found it', ['more scans', 'every doctor', 'Last night', 'all of them'],
     '**★ One scan against all of them.** The scan shrinks into a small tile. On **every doctor in history** a modest warm stack of tiles grows on the left (everything all doctors ever saw). On **more scans** (first) the dark around fills with a sky of millions of tiny cool tiles, far beyond the warm stack (scale contrast). On **Last night, while you slept** the moon (from the clock dial) crosses; on **all of them** your tile slides along the field and a light sweeps it row after row.',
     '① the field fills ② your tile sweeps', 'transformation · carrier: the sky of tiles sinks back into the kitchen window as the last stars of the night; pull back out of the phone · outward')
shot('2.03', 'SCENE>EXPL', 'Your heart should be racing', ['racing', "It isn't", 'good news', 'It means early', 'short procedure', 'over'],
     'Back in the kitchen, first light in the window. You set the phone down. On **racing** a faint heartbeat line runs along the table edge; on **It isn\'t** it calms to slow waves and your shoulders drop (breath). On **good news** the phone\'s glow turns from cool to warm. On **short procedure** the heartbeat line becomes a short gold timeline on the table: one small mark (the procedure), three quiet dots (**a few quiet days**), an end mark on **over**.',
     '① the line ② you breathe', 'plan sequence · carrier: the gold timeline on the table edge')
shot('2.04', 'EXPL', 'No bill', ['No bill', 'No upgrade offer', 'Everyone in your city', 'same careful look', 'Somebody decided'],
     'On **No bill** a small bill card rises from the phone and folds flat back into it; the same for an **upgrade offer** card (a card with a lock). On **Everyone in your city** pull back out of the window: the city in section again; the clinic\'s light places the **same** small gold ring in every window, one after another in a quick wave (stagger left → right). On **Somebody decided that** a single hand-drawn gold rule underlines the whole city (people decided).',
     '① cards fold ② the wave of rings', 'pull back in · carrier: the ring in YOUR window becomes the lid of the kettle\'s glow · inward')
shot('2.05', 'SCENE', 'You put the kettle on', ['kettle', 'whole illness', 'making tea'],
     'The kitchen. You put the kettle on; its small warm light and the steam (gold dust) rise. On **A whole illness just didn\'t happen to you** you stand still, one hand on the counter (breathing; a slow camera push). On **making tea** you pour; the steam drifts right toward the wall.',
     '① you, the kettle ② steam', 'plan sequence · carrier: the steam drifts right to the wall')
shot('2.06', 'SCENE', 'From the next room', ['next room', 'losing an argument', 'genius'],
     'The camera trucks right with the steam through the cut wall into the **next room**: your kid (small indigo silhouette, ponytail, pajamas) on the bed, arms waving, arguing with a small **cool voice-light** hovering at her eye level (a sphere with slow rings: the tutor). On **losing an argument** she flops back. On **With a genius** push in onto the voice-light.',
     '① truck right ② push in', '**SEAM plateGenius** (Lead → B1): the voice-light close, centre · forward')

# ===== c03 · 07:30 the tutor (B1) =================================================================================================
shot('3.01', 'SCENE', 'Seven-thirty', ['Seven-thirty', 'still at it', 'kitchen table', 'pajamas'],
     'From plateGenius: pull back. The clock jumps to `07:30` (digits roll, the sun-dot rises over the dial horizon; the window behind turns dawn-blue). The voice-light now hovers over the **kitchen table**; your kid sits there in **pajamas**, chin on fists, book open (time has passed under the plate).',
     '① pull back ② clock jump', 'plan sequence · carrier: the voice-light')
shot('3.02', 'EXPL', 'Her tutor is a voice', ['belongs to her alone', 'bored', 'bluffing', 'laugh', 'more physics', 'professor'],
     'The voice-light draws a thin ring that closes round **her alone** (a private circle; you, at the counter, outside it). Three small beads orbit the ring, each on its word: **bored** (a slack line), **bluffing** (a small wobble), **laugh** (a bounce). On **more physics than any professor alive** two columns rise from the table: a warm column (a professor\'s knowledge, one silhouette at its foot) and the tutor\'s cool column that runs out of the top of the frame.',
     '① the ring + beads ② the two columns', 'transformation · carrier: the cool column folds down into a black hole above the book · centre')
shot('3.03', 'EXPL', "This morning, it's black holes", ['black holes', 'wants the answer', "won't give it", 'question instead', 'Then another', 'groans', 'waits'],
     '**★ The ladder of questions.** Above the book a black hole: a dark disc with a thin gold ring. On **wants the answer** a sealed cube of light (the answer) hangs over it; on **won\'t give it** the cube stays shut (a small glint on its lock). On **question instead** a `?` of light drops as one step beneath her; on **Then another** a second step: a staircase toward the cube. On **groans** she slumps back (arms drop). On **waits** the voice-light holds and breathes slowly.',
     '① the steps ② she slumps', 'plan sequence · carrier: the sealed cube')
shot('3.04', 'EXPL', "It isn't being difficult", ['built this way', 'never once', 'Why would anyone'],
     'On **built this way** the voice-light and the cube are redrawn as a builder\'s drawing in thin gold lines (a blueprint: the cube with a lock symbol, a dotted line from the light to the ladder, not to the cube). On **never once** the lock line pulses once. On **Why would anyone build a genius** the drawing holds; the blueprint lines breathe.',
     '① the blueprint draws', 'transformation · the blueprint sinks back into the real light and cube · in place')
shot('3.05', 'SCENE', 'She stomps off to school', ['stomps off', 'without one', 'only one kept waiting'],
     'She slides off the chair and **stomps off** (a real stomping walk, arms swinging) out of the kitchen; the voice-light dims to a pilot dot on the table. On **only one kept waiting** the camera rises past the ceiling and the roofs to the skyline: the night-shift tower in morning light.',
     '① she walks off ② camera rises', 'camera rise · carrier: the tower on the skyline · up, centre-right')

# ===== c04 · 09:00 the night shift (B1) ===========================================================================================
shot('4.01', 'SCENE', "Nine o'clock", ["Nine o'clock", 'quiet', 'morning news'],
     'The clock jumps to `09:00` (the sun-dot higher; the sky lifts to deep day-blue, never light). The camera settles back down into the **quiet** flat: you at the window with a news sheet of light (a thin tablet), scrolling.',
     '① clock jump ② camera settles', 'plan sequence · carrier: the tablet\'s light')
shot('4.02', 'EXPL', 'A new antibiotic', ['antibiotic', 'shrugged off', 'disease so rare', 'few hundred children', 'designed overnight'],
     'Two headlines rise from the tablet as small light objects in the window space. On **antibiotic** a spiky cool germ; on **shrugged off every other drug** three small pills bounce off it; a new gold capsule docks onto it. On **disease so rare** a dark globe outline; on **few hundred children** a few hundred warm points scattered thinly across it. On **designed overnight** a small moon mark appears above both.',
     '① germ + capsule ② the globe points', 'plan sequence · carrier: the moon mark')
shot('4.03', 'SCENE', 'You barely look up', ['barely look up', 'like weather'],
     'You keep scrolling. The two objects drift out of the window and join a gentle drizzle of small lights falling past the glass outside: **breakthroughs like weather**. You don\'t look up (breath, a glance down).',
     '① the drizzle', 'camera travel · carrier: the drizzle leads the camera out of the window and up to the tower · up-right')
shot('4.04', 'EXPL', 'Every night, while the city sleeps', ['Every night', 'never tire', 'everything ever written'],
     '**★ The night shift.** The camera reaches the tower (hard change 2: the sky behind it turns to night in the explainer: "every night"). The tower opens in section: floors of cool minds (points of light in rows). On **everything ever written about a disease** a vast wall of gold text-lines (pages, no legible words) streams across the sky into the tower like threads.',
     '① the tower opens ② the wall of lines streams in', 'plan sequence · carrier: one point of light leaves the tower')
shot('4.05', 'EXPL', 'They form a hunch', ['hunch', 'thousand different ways', 'before sunrise', 'night shift now'],
     'Card **E1** unfolds from the clock on **hunch**. One cool point (a hunch) leaves the tower; on **a thousand different ways** it splits into a fan of a thousand hair-thin rays; most go dim, a few stay lit. On **before sunrise** the sun\'s edge touches the horizon. On **Science works the night shift now** wide: the tower lit through the night over the sleeping city.',
     '① the fan of rays ② the sun\'s edge', 'plan sequence · carrier: the few lit rays gather into one capsule')
shot('4.06', 'EXPL', 'And yet none of it', ['single patient', 'outside testers', "don't work for the makers", 'In the open', 'for months'],
     'A gold road runs from the tower to the city. The capsule travels on it and stops at a small separate house with a warm lamp: **the testers\' house** (a visible gap between it and the tower). On **don\'t work for the makers** the gap glows (a gold rule). On **In the open** the house\'s front wall swings open: indigo testers at a long table. On **Sometimes for months** month ticks unroll along the road; the capsule waits.',
     '① the capsule travels ② the ticks unroll', 'plan sequence · carrier: the capsule at the testers\' door')
shot('4.07', 'EXPL>SCENE', 'Some people hate the wait', ['hate the wait', 'costs lives', 'not wrong', 'this patient'],
     'At the far end of the road a few indigo figures wait (patients, the people waiting). On **costs lives** each month tick on the road darkens a little. On **They\'re not wrong** one figure turns toward the testers\' house. On **why are we still this patient?** the camera holds on the capsule at the door; the testers\' lamp breathes.',
     '① ticks darken ② a figure turns', 'camera travel · carrier: the road leads back into the city, to your window · left-down')
shot('4.08', 'SCENE', 'Meanwhile, another mind', ['another mind', 'whole morning', 'your money'],
     'Back in your flat: on the table a small cool light (the **agent**) has been sorting all morning: on **your money** a few gold coins slide into neat stacks under it.',
     '① the coins stack', 'plan sequence · carrier: the agent\'s light')

# ===== c05 · 12:00 the agent (B1) =================================================================================================
shot('5.01', 'SCENE>EXPL', 'Noon', ['Noon', 'checks in', 'booked for Thursday', 'everything it needs'],
     'The clock jumps to `12:00` (the sun-dot at the top of the dial; the brightest frame type of the film, mean luma ≤ 60). On **checks in** the agent\'s light rises from the table to your shoulder; a thin **gold thread** runs from it to your wrist (it belongs to you). On **booked for Thursday** a small row `TUE · WED · THU` rises, THU ringed gold. On **everything it needs** a short stack of documents slides from the agent along the clinic\'s gold line out of the window.',
     '① agent rises ② the day row', 'plan sequence · carrier: the gold thread')
shot('5.02', 'EXPL', "You haven't seen a single form", ['single form', 'deposit', 'it asks', 'spends your money'],
     'Card **E2** unfolds on **single form**. A flurry of form-cards flies toward you and is caught by the agent before it reaches you; you see none. On **deposit** a coin starts along the thread toward the clinic and stops at a small gate on it; on **it asks** the gate lifts a `?` toward you; you nod (head) and the coin passes on **spends your money**.',
     '① the forms ② coin at the gate', 'plan sequence · carrier: the coin')
shot('5.03', 'EXPL', 'Then it brings up your health insurance', ['health insurance', 'making lunch', 'every plan on the market', 'cheaper one', 'just as much'],
     'Below, you make lunch (a knife, a board, the steady arm move). Above the counter on **every plan on the market** a deck of plan cards fans out across the window space and sorts itself into a row of bars (price) with a thin coverage line on each. On **cheaper one** one shorter bar lights gold; on **just as much** its coverage line lifts to match yours exactly.',
     '① the fan → bars ② the gold bar', 'plan sequence · carrier: the gold bar')
shot('5.04', 'EXPL', 'The company that built your agent', ['would earn more', 'stayed where you are', 'tells you anyway'],
     '**★ Loyalty.** On the skyline the makers\' tower casts a long cool thread toward the agent; on **would earn more** it reaches but cannot attach (it slides off the gold thread). On **It tells you anyway** the agent\'s light leans toward the gold bar and the thread to your wrist brightens.',
     '① the cool thread fails ② the agent points', 'plan sequence · carrier: the agent\'s light drops into your pocket')
shot('5.05', 'EXPL>SCENE', "It's like carrying the sharpest lawyer", ['sharpest lawyer', 'pocket', 'nobody can buy', "isn't being kind", "isn't allowed", 'ahead of you', 'answer to you'],
     'The agent\'s glow at your coat pocket. On **One nobody can buy** a few cool coins from the tower arc toward it and bounce off. On **isn\'t allowed to put anyone ahead of you** a straight gold rule line draws under the thread (the rule it obeys). On **answer to you, and not to them** the thread\'s knot at your wrist gives one warm pulse.',
     '① coins bounce ② the rule line', 'plan sequence · carrier: the thread\'s pulse')
shot('5.06', 'SCENE', "There's one job you won't hand it", ['one job', 'Telling your dad'],
     'The agent\'s light dims. You walk to the window; across the roofs, two streets away, one warm window with a balcony: **Dad\'s**. On **Telling your dad** push past your shoulder toward it.',
     '① you walk ② push', '**SEAM plateWindow** (B1 → B2): Dad\'s lit balcony window, centre, in a dark facade · forward')

# ===== c06 · 16:00 Dad (B2) =======================================================================================================
shot('6.01', 'SCENE', "Four o'clock", ["Four o'clock", 'two streets away', 'balcony', 'tomatoes', 'In Arabic', "doesn't speak a word"],
     'From plateWindow: the clock jumps to `16:00` (the sun-dot low on the right, the sky gold at the horizon, long shadows). Pull back and truck: you walk the **two streets** (one walking move, the camera follows). On **balcony** crane up: **Dad** (older indigo silhouette, slight stoop, cardigan) among tomato plants (warm round fruits, no red), the **neighbour** on the next balcony, both gesturing. On **doesn\'t speak a word of it** Dad throws up one hand.',
     '① the walk ② crane up', 'plan sequence · carrier: the neighbour\'s voice')
shot('6.02', 'EXPL', 'His earbuds translate', ['translate every sentence', 'hear it'],
     'Card **E3** on **translate every sentence**, card **E4** stacks below it on **hear it** (pair). The neighbour\'s speech leaves him as a cool bubble of abstract wave-glyphs (no real script), flows into a tiny cool dot at Dad\'s ear and comes out on his side as a warm bubble. On **let him hear it** a small faint waveform swells into a full, clear one.',
     '① bubble through the earbud ② the wave swells', 'plan sequence · carrier: the waveform')
shot('6.03', 'SCENE', 'For years, he just nodded', ['nodded along', 'interrupts people again', 'Including you', 'tell him about the scan', 'get a word in'],
     'On **nodded along** Dad nods in a slow loop while faint pale waves fall short of him (the years he could not hear). On **interrupts people again** he leans in, both arms talking. You are on the balcony now; on **Including you** he turns to you mid-gesture. On **tell him about the scan** you raise a hand; on **get a word in** it drops back.',
     '① Dad talks ② your hand', 'pull back · carrier: the balcony door frame')
shot('6.04', 'SCENE>EXPL', "He's eighty-two", ['eighty-two', 'grew up in', 'keeps an eye on him', 'into a home'],
     'Pull back: Dad\'s flat in section. On **grew up in** gold pencil marks of a child\'s height glow on the door frame (your marks). On **keeps an eye on him** soft cool points in the room\'s corners light and a thin cool line traces the floor (the flat watches gently). On **into a home** a dark, distant care home on the skyline that the path from his door never reaches.',
     '① height marks ② cool points', 'plan sequence · carrier: the section widens to the whole building')
shot('6.05', 'EXPL', 'On your way out', ['same earbuds', 'student downstairs', 'always broke', 'everyone in the building'],
     '**★ The same for everyone.** Dad\'s whole building in section, as a diagram. On **same earbuds** the neighbour\'s flat lights a tiny cool earbud pair; on **student downstairs** a flat below (a mattress, an empty wallet shape on **always broke**) lights the same pair. On **everyone in the building** every flat lights the identical pair, a wave from the top floor down.',
     '① flat by flat ② the wave', 'transformation · carrier: the floors of the building tilt into steps of a price ladder · in place')
shot('6.06', 'EXPL', 'The best version of anything', ['whoever pays the most', 'Not here', 'Why not'],
     'The floors become a ladder of price tags: the brightest earbud pair only on the top step, dimmer on each step down (the usual way). On **Not here** the ladder folds flat: every step gets the bright pair. On **Why not?** the sun-dot drops toward the dial horizon.',
     '① the ladder ② it folds flat', 'camera travel · carrier: the sun sets behind your building as you walk home; your kitchen lamp switches on · left')

# ===== c07 · 19:00 dinner I (B2) ==================================================================================================
shot('7.01', 'SCENE', "Seven o'clock", ["Seven o'clock", 'dinner', 'black holes', 'pea', 'spoon', 'waving'],
     'The clock jumps to `19:00` (sun-dot under the horizon). The kitchen table under the lamp: you and your kid at dinner. Above the table, the dark wall: **the light wall** (in 2037 a wall can show light; no frame, no panel). On **pea** she holds up a pea (a gold dot), on **spoon** a spoon (a dark hollow); on **waving** her arms sweep big arcs (natural, overlapping arm motion).',
     '① clock jump ② her arms', 'plan sequence · carrier: the pea')
shot('7.02', 'EXPL', 'She gets every part of it right', ['every part', 'never told her a thing'],
     'The pea\'s orbit draws itself as gold light on the wall: the black-hole diagram from 3.03, now complete, drawn by her. On **never told her a thing** the ladder of `?` from 3.03 lights beneath it: she climbed it herself.',
     '① the diagram draws', 'plan sequence · carrier: the diagram sinks; one `?` stays and drops into her notebook')
shot('7.03', 'SCENE', 'Then she pulls out her homework', ['homework', 'One question', "wouldn't answer it", 'ask you'],
     'She pulls out her notebook; one line glows. On **wouldn\'t answer it** the tutor\'s pilot light beside her stays dim. On **ask you** she turns the notebook toward you.',
     '① the notebook turns', 'plan sequence · carrier: the notebook')
shot('7.04', 'SCENE', 'Why did it go well she reads', ['looks up', 'always like this', 'never known anything else'],
     'Close on the notebook: in her handwriting, `Why did it go well?` (the homework line, diegetic). On **looks up** she lifts her head to you. On **never known anything else** the camera eases back: through the kitchen window the city at night, every window lit (the only world she knows).',
     '① she looks up ② ease back', 'plan sequence · carrier: the window\'s lit city')
shot('7.05', 'EXPL', 'No, you say', ['another way', "weren't smart enough", 'plenty smart', "who they'd work for"],
     '**★ The fork.** On the light wall the day draws itself as one gold road through small station marks (clinic ring, `?` ladder, tower + testers\' house, the agent\'s thread, the earbuds). On **almost went another way** a cool road forks off below it. On **plenty smart** one big cool disc (the machines) rises over BOTH roads, equally large. On **who they\'d work for** threads drop from the disc: on the gold road to many small people, on the cool road to one tower.',
     '① the fork ② the threads', 'plan sequence · carrier: you lift your hand toward the wall')
shot('7.06', 'SCENE', 'Some people saw it clearly', ['saw it clearly', 'Look', 'old recording', 'wall'],
     'On **Look** you lift your hand; on **old recording** a gold line runs from your hand up the wall to the middle of the light wall and **switches on like an old screen**: a bright horizontal line opens vertically into a 16:9 picture (mask, 0.5 s, expo-out) holding the first frame of K1. Push in toward it (sine, ≈ 1.6 s) to land as the clip starts.',
     '① the line runs up ② the screen opens, push', '**CLIP IN** (see §5): carrier the gold line → the opening line of the old screen · centre')
shot('7.07', 'CLIP', 'clip:K1', [],
     '**ORIGINAL FOOTAGE K1 · Bruce Schneier, 2026** (8.8 s): "Every AI can do both. It is a power-enhancing technology. Enhances the power of who wants to use it. So, we get to decide how to do this." Framed old recording on the light wall (§5): label `ORIGINAL FOOTAGE`, lower third `Bruce Schneier` / `SECURITY TECHNOLOGIST, HARVARD KENNEDY SCHOOL · 2026`. Camera still (only `cameraFloat`).',
     '– (footage)', '**CLIP OUT**: the picture collapses to a line, the line to a point; the point drops onto the cool fork of 7.05 · centre → down')

# ===== c08 · dinner II (B2) =======================================================================================================
shot('8.01', 'EXPL', 'When you were a baby', ['baby', 'Good check-ups', 'paid extra', 'spat out answers', 'worked for the shop'],
     'Pull back to the table and the wall. From the point the cool road draws on and three small pictures stand on it, each on its phrase: **Good check-ups only for people who paid extra** (the clinic window with a price tag, a queue left dark); **Tutors that just spat out answers** (the cube pops open and answers tumble out); **Agents that worked for the shop** (an agent light whose thread is tied to a shop sign, not to a person).',
     '① the three pictures, one by one', 'plan sequence · carrier: the cool road')
shot('8.02', 'SCENE', 'She looks at you', ['making it up', "So why didn't it", 'stubborn'],
     'Two-shot at the table. On **making it up** she tilts her head and crosses her arms. On **So why didn\'t it** she leans in. On **stubborn** you set both hands flat on the table (small, firm).',
     '① she crosses arms ② your hands', 'plan sequence · carrier: your hands → the light wall')
shot('8.03', 'EXPL', 'There was a new antibiotic', ['antibiotic in the news', 'for months', 'so slow', 'On purpose'],
     'Card **E5** on **antibiotic in the news**. On the wall the gold capsule from 4.02 rides the road and stops at the testers\' house (4.06 callback); on **for months** the month ticks unroll. On **so slow** she groans (arms). On **On purpose** the testers\' lamp glows warmer.',
     '① the capsule ② month ticks', 'plan sequence · carrier: the tower behind the house')
shot('8.04', 'EXPL', 'Back then, those research machines', ['brilliant', 'one in five', 'One in five', "take a pill back"],
     '**★ One in five.** Five findings leave the tower as five bright points in a row. On **one in five of their findings didn\'t hold up** card **E6** unfolds and the fifth point cracks and goes grey. On **One in five.** (repeat) the four warm, the one grey hold. On **you can\'t take a pill back** a pill passes a one-way door that closes behind it.',
     '① five points ② the fifth cracks', 'plan sequence · carrier: the one-way door → the testers\' gate')
shot('8.05', 'EXPL', 'So people insisted', ['test it before you trust it', 'Outside the companies', 'in the open', 'Not just the medicines', 'Every new machine'],
     'The testers\' gate: every finding passes it before the road goes on to the city. On **Outside the companies** the gap between tower and house glows. On **in the open** the house\'s wall opens (testers at work). On **Every new machine, too** card **E7** unfolds and a whole new cool disc (a machine) also rolls into the testers\' house before the city. On **before it reached anyone** the graphic sinks into the wall\'s lower edge.',
     '① the gate ② the disc rolls in', '**SEAM plateWall** (B2 → B3): the empty light wall over the table, lamp pool below · centre')

# ===== c09 · dinner III (B3) ======================================================================================================
shot('9.01', 'EXPL', 'And today you say', ['cheaper insurance', 'makers lose money', 'Why would it do that'],
     'From plateWall: the agent\'s light lowers into the light wall with its gold thread (5.01 callback). On **cheaper insurance** the two bars from 5.03 return, the gold one shorter. On **makers lose money** one cool coin drops away on the tower side. On **Why would it do that?** she points at the wall (arm).',
     '① agent lowers ② the coin drops', 'plan sequence · carrier: the agent\'s thread')
shot('9.02', 'EXPL', 'Because back then', ['digital helpers', 'whoever built them', 'very old rule', 'act for someone', 'owe them loyalty'],
     '**★ The threads re-tied.** Many small helper lights on the wall, each with a cool thread running back to its maker\'s tower (threads converging). On **very old rule** card **E8** unfolds and an old rule card of light (a seal) settles in the middle. On **act for someone** the cool threads cut at the towers; on **owe them loyalty** they re-tie as gold threads to small people.',
     '① threads cut ② threads re-tie', 'cloning · carrier: one gold pair splits into three pairs · centre')
shot('9.03', 'EXPL', 'Doctors have that rule', ['Doctors', 'Lawyers', 'first time politicians'],
     'Three pairs side by side, each tied by the same gold thread: on **Doctors** a doctor and a patient, on **Lawyers** a lawyer and a client, then the agent and you (indigo silhouettes; only you in yellow). On **first time politicians heard it** you lift your hand; the old screen switches on in the middle of the wall (line → picture), push in.',
     '① the three pairs ② the screen opens', '**CLIP IN**: carrier the agent\'s gold thread straightens into the old screen\'s opening line · centre')
shot('9.04', 'CLIP', 'clip:K3', [],
     '**ORIGINAL FOOTAGE K3 · Tim Berners-Lee, 2023** (7.7 s): "I talked about the idea of, your AI could work for you just like your doctor works for you, or just like a lawyer works for you. Then their eyes lit up." Lower third `Tim Berners-Lee` / `INVENTOR OF THE WORLD WIDE WEB · 2023`.',
     '– (footage)', '**CLIP OUT**: line → point; the point becomes the agent\'s light on the wall, now holding a ring of keys · centre')
shot('9.05', 'EXPL', 'And if it cheats', ['cheats', 'loses its keys', 'One sentence', 'grounding it', 'Exactly like'],
     'The agent holds a ring of gold keys (your accounts, your money). On **cheats** its light flickers to a dull grey. On **loses its keys** card **E9** unfolds; the keys lift off the ring and fly back into your hand at the table. On **One sentence is enough** you raise one finger: a single line of light on the wall. On **grounding it** she laughs (shoulders) and the agent\'s light sits small in a little box. On **Exactly like grounding it** you nod.',
     '① the keys fly back ② the box', 'plan sequence · carrier: the box → a shop window (glass box) · in place')

# ===== c10 · dinner IV (B3) =======================================================================================================
shot('10.01', 'EXPL', "And Grandpa's earbuds", ["Grandpa's earbuds", 'Same story', 'luxury', 'towns and countries', 'built libraries'],
     '**★ Luxury or library.** The box becomes a shop window: the earbud pair behind glass with a price tag. On **luxury** cards **E10** (cool, the other way) and **E11** (warm, the good way) unfold as a pair. On **towns and countries bought it for everyone** the glass opens; on **built libraries** a library of light (columns, an open door) stands on the wall and from its door the same earbud light reaches every window of a small town.',
     '① glass → library ② the windows light', 'plan sequence · carrier: the library door')
shot('10.02', 'EXPL', 'Who paid', ['Who paid', 'machines earned', 'all of us'],
     'A loop: on **machines earned** cool coins leave the tower; part of the stream turns gold and flows back through the library door into the town\'s windows on **all of us** (a slow circular flow diagram).',
     '① the flow loop', 'transformation · carrier: the loop opens into two roads · in place')
shot('10.03', 'EXPL', 'Was it easy', ['easy', 'It was close', 'years longer'],
     'The gold road and the cool road from 7.05 run side by side; on **It was close** they nearly touch. On **took years longer than anyone wanted** the gold road\'s arrival mark slides on past a dotted "expected" tick (a timeline, no years).',
     '① the roads converge ② the mark slides', 'pull back to the table · carrier: her elbow on the table')
shot('10.04', 'SCENE', "Then why won't my tutor", ['just tell me things', 'noticed something'],
     'Two-shot: she props her chin, the tutor\'s pilot light beside her. On **noticed something** you lean forward.',
     '① you lean', 'plan sequence · carrier: the tutor\'s pilot light rises to the wall')
shot('10.05', 'EXPL', 'Kids who got their answers', ['better with it', 'worse without it', 'built to ask', 'Like yours', 'dad asking'],
     'Card **E12** on **Kids who got**. On the wall a light chart (no axes, no grid): **better with it** a cool bar rises (practice with a plain chatbot); **worse without it** the exam bar beside it sinks to `−17 %`; a gold pair (tutor with guardrails) stays level. On **built to ask** the `?` ladder from 3.03 climbs beside it. On **dad asking** the old screen switches on, push in.',
     '① the bars ② the ladder / screen', '**CLIP IN**: carrier the top `?` of the ladder straightens into the opening line · centre')
shot('10.06', 'CLIP', 'clip:K4', [],
     '**ORIGINAL FOOTAGE K4 · Sal Khan, 2024** (12.5 s): "I\'m here with my son, and I\'d love you to tutor him on this math problem, but don\'t give him the answer. You can ask questions and nudge him in the right direction, but I really want to make sure he understands it himself." Lower third `Sal Khan` / `FOUNDER, KHAN ACADEMY · 2024` (keep the OpenAI logo in the footage small or cropped).',
     '– (footage)', '**CLIP OUT**: line → point; the point becomes the first lit window of a school on the wall · centre')

# ===== c11 · dinner V (B3) ========================================================================================================
shot('11.01', 'EXPL', 'And the grown-ups practiced', ['practiced', 'without leaning on it', 'Teachers first', 'rest of us', 'Everybody did'],
     'Card **E13** on **practiced**. On the wall a school of light: 156 small windows; they light one by one, 154 of them (the card carries the number). On **without leaning on it** a small figure stands upright beside a cool light instead of leaning on it. On **Teachers first** a first ring of light spreads from the school; on **rest of us** a second, wider ring. On **Everybody did** both rings breathe.',
     '① windows light ② the rings', 'pull back to the table · carrier: the rings fade into the lamp pool by contracting into it (no dissolve)')
shot('11.02', 'SCENE', 'She thinks about that', ['thinks about that', 'what did you do', 'takes you a moment'],
     'Close two-shot. She props her chin, thinks (a slow head tilt). On **what did you do** she looks at you. On **It takes you a moment** you look down at your hands; a slow push in; you breathe.',
     '① push', 'plan sequence · carrier: you lift your head toward the wall')
shot('11.03', 'EXPL', 'Not much. Asked questions', ['Asked questions', 'Who checked this', 'Whose side', 'Does everyone get it'],
     'On the wall the film\'s three symbols return, one per question: **Who checked this?** the testers\' house with its lamp; **Whose side is it on?** the gold thread to a wrist; **Does everyone get it?** a row of windows, all lit. They stand in a row as three small lights.',
     '① the three symbols, one by one', 'plan sequence · carrier: the three symbols become three windows')
shot('11.04', 'EXPL', 'At work. With friends.', ['At work', 'With friends', 'every vote', 'Millions'],
     '**★ Millions.** Three small windows of ordinary days: **At work** (you at a desk, a `?` over your screen), **With friends** (a table of indigo friends, a `?` between them), **Before every vote** (a ballot box, a `?` above it). On **Millions of people did the same** the camera pulls back through the wall\'s picture: a map of the whole city, then of many cities, lit by millions of tiny gold points.',
     '① three windows ② pull back to millions', 'transformation · carrier: the points sink back into the lamp pool on the table · down')
shot('11.05', 'SCENE', 'She writes it down', ['writes it down', 'biggest letters', 'Because people kept asking'],
     'The table. She writes in her notebook; the letters draw as handwriting strokes in gold: `Because people kept asking.` (word by word on the phrase).',
     '① the handwriting', 'plan sequence · carrier: the notebook page')
shot('11.06', 'SCENE', 'One person still', ['One person', "doesn't know"],
     'She leaves the notebook open. Your phone lies beside it, dark. On **doesn\'t know about your scan** push in onto the page.',
     '① push', '**SEAM plateNotebook** (B3 → Lead): the notebook page close, `Because people kept asking.` · centre')

# ===== c12 · 22:30 + end (Lead) ===================================================================================================
shot('12.01', 'SCENE', 'Ten-thirty', ['Ten-thirty', 'fell asleep', 'inside a black hole'],
     'From plateNotebook: the clock jumps to `22:30` (the moon-dot high on the dial). Pull back: your kid asleep with her head on her arms at the table, the pea and the black-hole drawing beside the notebook; the lamp lower.',
     '① clock jump ② pull back', 'plan sequence · carrier: the phone beside the notebook')
shot('12.02', 'SCENE', 'Your phone buzzes', ['phone buzzes', 'Your dad', 'tell me something today'],
     'On **phone buzzes** the phone lights (the 1.03 rhyme). You take it to the window: across the roofs Dad\'s window is lit; a thin gold line connects the two windows (the call).',
     '① you to the window ② the line', 'plan sequence · carrier: the gold line between the windows')
shot('12.03', 'SCENE', 'You tell him about the scan', ['about the scan', 'How big', 'Really small', 'say it twice', 'every word'],
     'On **How big?** your fingers show a tiny gap (the grain of rice from 2.01, rhyme). On **Really small** the gap closes a little more. On **He hears every word** the tiny cool dot at Dad\'s ear glows once in his far window.',
     '① your fingers ② the earbud dot', 'camera travel · carrier: you walk into the hallway, the camera follows · left')
shot('12.04', 'SCENE', 'You stand in the hallway', ['hallway', 'going to sleep', 'night shift is starting'],
     'The hallway window, you small before it. Outside, on **going to sleep**, the city\'s windows go out one by one (slow, staggered). On **the night shift is starting** the tower\'s cool windows switch on, one after another.',
     '① windows go out ② the tower lights', 'plan sequence · carrier: the clock stamp grows down from the corner')
shot('12.05', 'EXPL', "This Tuesday didn't begin", ["didn't begin", 'years before', 'ordinary days', 'people like you', 'who these machines were for'],
     '**★ The year rolls back.** The clock stamp\'s year rolls back `2037 → 2026` (hard change 3: the sky over the city becomes a timeline). A thin line runs across the sky from **2026** on the left to **2037** on the right, dotted with small lit windows (**ordinary days**). On **people like you** a tiny yellow figure stands at the 2026 end with a `?`. On **who these machines were for** the line lights gold from 2026 all the way to 2037.',
     '① year rolls back ② the line lights', 'plan sequence · carrier: the year rolls forward and returns into the stamp')
shot('12.06', 'SCENE', 'Your twenty thirty-seven has already started', ['already started'],
     'The year rolls forward to `2037` and settles in the stamp on **already started**. The camera rises slowly out through the hallway window over the sleeping city; the stamp shows `22:30`.',
     '① rise', 'pull back into the end screen')

ENDSCREEN = ('12.07', 'SCENE', 'End screen (VO end → film end, ≈ 15 s, no voice, music runs on). Continuing the rise: the city\'s last windows go out, **one stays on** (the tower\'s night shift, cool). Then the camera sinks back down the facade of your building and through the kitchen window (fly-through of the window frame, ≈ 8 s in): the notebook on the table in the moonlight, `Because people kept asking.`, the pea beside it. **Free areas** for end cards: left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), centre x 810–1110, y 330–600 (subscribe); the notebook sits below y 720. Never static: the moon-light breathes, the camera keeps a slow push.', '① lights go out ② sink back to the notebook')

# ---------------------------------------------------------------------------------------------------------------------------------
def ff(x): return f'{x:.2f}'.replace('.', ',')
def vo_end(): return max(w['e'] for w in WS)
def chunk_of(sh): return 'c%02d' % int(sh['id'].split('.')[0])
LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5, 'CLIP': None}

def resolve():
    chunk_start, last = {}, -1.0
    for c in CHUNKS:
        t0 = 0.0 if c[0] == 'c01' else gfind(c[3], last)
        chunk_start[c[0]] = t0; last = t0
    last = -1.0
    for sh in S:
        if sh['start'].startswith('clip:'):
            cl = clip(sh['start'][5:]); t = cl['start']; sh['clip'] = cl
        else:
            t = 0.0 if sh['id'] == '1.01' else gfind(sh['start'], last)
        sh['t'] = t; last = t
        sh['at'], prev = [], t - .01           # anchors in VO order: each is searched after the previous one (repeats like 'One in five')
        for a in sh['anchors']:
            prev = gfind(a, prev + (.01 if sh['at'] else 0)); sh['at'].append((a, prev))
    for i, sh in enumerate(S):
        sh['t1'] = S[i + 1]['t'] if i + 1 < len(S) else vo_end()
    return chunk_start

def share(shs):
    span = sum(s['t1'] - s['t'] for s in shs if s['layer'] != 'CLIP') or 1
    ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs if s['layer'] != 'CLIP')
    return ex, span

def main():
    cs = resolve()
    dur = TM['duration']
    ends = {c[0]: (cs[CHUNKS[i + 1][0]] if i + 1 < len(CHUNKS) else dur) for i, c in enumerate(CHUNKS)}
    out = ['| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |', '|---|---|---|---|---|---|---|---|']
    tot = {'Lead': 0, 'B1': 0, 'B2': 0, 'B3': 0}
    allx = [0, 0]
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        ex, span = share(shs); allx[0] += ex; allx[1] += span
        a, b = cs[c[0]], ends[c[0]]; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / span)}% |')
    clips = [s for s in S if s['layer'] == 'CLIP']; clip_s = sum(s['t1'] - s['t'] for s in clips)
    n_expl = sum(1 for s in S if s['layer'] == 'EXPL'); n_half = sum(1 for s in S if s['layer'] in ('SCENE>EXPL', 'EXPL>SCENE'))
    n_scene = sum(1 for s in S if s['layer'] == 'SCENE')
    out.append('')
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s (c01, c02, c12 incl. the end screen) · B1 {tot["B1"]:.0f} s · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s. '
               f'**Explainer share:** **{round(100 * allx[0] / allx[1])} %** of the spoken picture time without the clips (mixed shots count half; target 60–70 %; Film 18 had 43 %); '
               f'{round(100 * allx[0] / (allx[1] + clip_s))} % if the {clip_s:.0f} s of clip slots count as non-explainer. '
               f'Shots: {len(S)} ({n_expl} EXPL, {n_half} mixed, {n_scene} SCENE, {len(clips)} CLIP) + end screen. '
               f'Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL, 145 wpm)" if TM.get("provisional") else " (real VO)"}, VO end {vo_end():.1f} s, film {dur:.1f} s.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        ex, span = share(shs)
        star = next((s['id'] for s in shs if s['star']), '–')
        a, b = cs[c[0]], ends[c[0]]
        out += ['', f'### {c[0]} · {c[2]} · {ff(a)}–{ff(b)} ({b - a:.0f} s) · {c[1]} · ★ {star} · [EXPL] {round(100 * ex / span)}%', f'Light/hero: {c[4]}', '',
                '| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |', '|---|---|---|---|---|---|---|']
        for s in shs:
            an = ' · '.join(f'**{a}** @{ff(t)}' for a, t in s['at']) or f'clip slot {s["clip"]["start"]:.2f}–{s["clip"]["end"]:.2f}'.replace('.', ',')
            sid = f'**{s["id"]} ★**' if s['star'] else s['id']
            out.append(f'| {sid} | [{s["layer"]}] | {ff(s["t"])}–{ff(s["t1"])} | {an} | {s["pic"]} | {s["moves"]} | {s["tr"]} |')
        if c[0] == CHUNKS[-1][0]:
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
