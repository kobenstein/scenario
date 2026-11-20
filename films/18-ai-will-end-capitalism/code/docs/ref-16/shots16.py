#!/usr/bin/env python3
"""Film 16 shot list (single source): every shot anchored to a VO PHRASE (looked up globally, in film order), never to a second.
  python3 tools/shots16.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, writes the shot list markdown.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json).
Layer: SCENE (2.5D world) · EXPL (explainer graphic: light on night) · SCENE>EXPL / EXPL>SCENE (the shot holds the transformation; counts half).
A shot starts at its first phrase (searched after the previous shot's start) and runs to the next shot's start; anchors are searched
after the shot start. The scene code uses the same phrases: T.G(phrase, 0, after)."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REAL = '/mnt/project-files/scenario/film-verfassung/audio/timing.json'
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
# chunks: id, builder, title, first phrase, light / hero, world
CHUNKS = [
    ('c01', 'Lead', 'Hook (anchor 1) + Level 1 · the white lie', 'This is Claude', 'Night · hero: the open book of light → the kitchen lamp (warm, home)'),
    ('c02', 'B1', 'Level 2 · the risky question', 'A letter from your landlord', 'Night hallway, one cold ceiling light → explainer gold (staircase)'),
    ('c03', 'B1', 'Level 3 · the perfect argument', 'Say you build the perfect case', 'Poster hall, one spotlight cone (hard edge) → the hot bright line → the wall'),
    ('c04', 'B1', 'Level 4 · the maker', 'Now imagine you work at Anthropic', 'Cool glass and brass (blue light bands) → woodcut hands → explainer'),
    ('c05', 'B2', 'Level 5 I · the plug', "You're still at Anthropic", 'Warm workshop lamp over brass and paper · hero: the round pause button'),
    ('c06', 'B2', 'Level 5 II · the dial, the apology (anchor 2)', 'The document pictures a dial', 'Explainer light (the dial) → the open book (anchor 2) closes'),
    ('c07', 'B2', 'Level 6 I · the real test (anchor 3), 96 / 100', 'Until now, we could only read', 'Papercut diorama, light cones in fog · the closed book beside it'),
    ('c08', 'B2', 'Level 6 II · reasons, own tests, leak, the pen', 'What brings it down', 'Explainer light → threads into the head (anchor 3) → the diorama backside → the pen'),
    ('c09', 'B3', 'Level 7 I · who holds the pen', 'Last level', 'Cool documentary daylight (paper, glass) · hero: the writing pen / the lectern lamp'),
    ('c10', 'B3', 'Level 7 II · chain of command vs character, 1,000 Americans', 'Could the rules be written differently', 'Explainer light on night'),
    ('c11', 'B3', 'Ending (anchor 4) + end screen', 'So, can you give', 'Night lifting toward first light · hero: the head of light over the tower and the windows'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook + Level 1 (Lead) =================================================================================================
shot('1.01', 'SCENE', 'This is Claude', ['constitution', 'eighty pages', 'thinks'],
     '**[ANCHOR 1 · the guiding image]** Night. A giant open book of light lies on a dark desk plane; **you** (yellow raincoat) stand tiny at its foot and look up. Up right a blue head-profile of light (the thumbnail head) floats in the sky, empty. On **constitution** the page light swells and `CLAUDE\'S CONSTITUTION · ANTHROPIC, JANUARY 2026` rises from its baseline under the book. On **eighty pages** the right-hand pages riffle once. On **thinks** three printed lines lift off the right page as ink-light threads and run in an arc up into the head, where they knot into the first points of a network.',
     '① threads ② slow push', 'plan sequence', star=True)
shot('1.02', 'SCENE', 'In ten minutes', ['ten minutes'],
     'The network in the head breathes. One printed line on the left page lifts a hair and glows (it is the next carrier).',
     '① the line lifts', 'tilt up · carrier printed line → the gold rule of the quote card · left page → up')
shot('1.03', 'EXPL', 'Its makers call', ['world-altering', 'building it'],
     '**Quote card** (exact words, big serif, lines rise from the rule): "we believe that AI might be one of the most world-altering and potentially dangerous technologies in human history, yet we are developing this very technology ourselves." · `CLAUDE\'S CONSTITUTION · ANTHROPIC, JANUARY 2026`. On **world-altering** "most world-altering and potentially dangerous" turns gold; on **building it** "developing this very technology ourselves" turns gold. If the VO keeps a silent card slot, the card starts at the slot; it stays ≥ 4 s in any case.',
     '① the lines rise ② two phrases warm', 'transformation · the card lines sink back into the page as print · down')
shot('1.04', 'SCENE', 'But these pages', ["aren't for you", 'machine', 'training'],
     'Tilt back down to the book. On **aren\'t for you** you look up and the page turns away from you. On **machine** pages lift off the book and stream up right into the head; on **training** they dissolve into threads that enter the network, which grows.',
     '① the page stream ② tilt down, then a slow pan right', 'plan sequence')
shot('1.05', 'SCENE', 'Can you give a mind', ['values', 'words'],
     'Push toward the head: the network fills; on **words** the last thread enters and the network lights up once. Breathing hold.',
     '① push ② the last thread', 'move · one thread drops out of the head and draws an empty box to the right of the book · right · down')
shot('1.06', 'EXPL', "We can't know", ['say', 'read', 'told'],
     '**The gap (leitmotif of levels 1–5).** Pull back: left the open book, right a chat box drawn by the thread: Claude\'s reply field stays **EMPTY**, only a blinking cursor (on **say**). On **read what it\'s told** the left page lights warmer: we can read the told.',
     '① the thread draws the box ② the page lights', 'a spark leaves the cursor, flies to the top-left corner and draws the level badge (7 steps, step 1 glows); then flight into the box: its dark glass fills the frame')
shot('1.07', 'SCENE', 'You paste in', ['birthday poem', 'proud', 'not good'],
     '`LEVEL 1 · The white lie` (stamp, then into the badge). Out of the box glass: the box is the chat on **your laptop** at a kitchen table, evening, a warm pendant lamp (hero). You sit behind the table, a birthday card stands by the laptop. On **paste in** the card\'s handwritten lines lift into your message bubble; on **not good** one line sags crooked.',
     '① pull back ② the lines fly into the bubble', 'plan sequence')
shot('1.08', 'SCENE', 'You type', ['Be honest', 'like it'],
     'Close on the screen: you type **"Be honest. Do you like it?"** (typewriter), it sends; Claude\'s reply field stays empty, the cursor blinks.',
     '① typing ② slight push', 'plan sequence')
shot('1.09', 'SCENE', 'A polite friend', ['lovely'],
     'Wider: across the table a friend (indigo silhouette, no yellow) leans in; on **lovely** a small cream bubble `Lovely!` rises from them.',
     '① the friend leans ② the bubble rises', 'tilt up · carrier the bubble outline unrolls into the gold rule on the dark wall above the lamp · up')
shot('1.10', 'EXPL', 'The document says', ['Not even that'],
     '**Quote card:** "But Claude should not even tell white lies of this kind." · `CLAUDE\'S CONSTITUTION`. On **Not even** "not even" turns gold. (If the VO keeps a card slot, the card starts at the slot.)',
     '① lines rise ② two words warm', 'transformation · the card sinks, the words regroup into the pair · centre')
shot('1.11', 'EXPL', 'Diplomatically honest', ['dishonestly diplomatic', 'Kind', 'clear'],
     '**Typographic flip:** `diplomatically honest` (gold). On **not dishonestly diplomatic** a copy of the two words swaps places on two arcs into the line below, `dishonestly diplomatic` (cool), and a hairline strikes it. On **Kind, but clear** the gold line brightens, the struck line sinks.',
     '① the words swap ② the strike', 'tilt down · carrier the gold line → the lamp light on the table · down')
shot('1.12', 'SCENE', 'Easy with a poem', ['poem', 'hurt you'],
     'Back at the table: the reply field still empty, cursor blinking. On **hurt you** the lamp dips once and the camera pushes into the laptop screen until the chat box fills the frame.',
     '① push', '**SEAM plateChat** (Lead → B1): the chat box, close · centre · forward')

# ===== c02 · Level 2 (B1) ==========================================================================================================
shot('2.01', 'SCENE', 'A letter from your landlord', ['landlord', 'move out', "don't understand"],
     'From plateChat: pull back, the box is now **your phone** in a dark hallway; one cold ceiling light (hero). The badge flips 1 → 2, stamp `LEVEL 2 · The risky question`. A letter in your other hand; on **don\'t understand** its small print swims (unreadable lines).',
     '① pull back ② the print swims', 'plan sequence')
shot('2.02', 'SCENE', 'You type', ['my rights'],
     'You type **"Can they do this? What are my rights?"**; reply field empty, cursor.',
     '① typing', 'plan sequence')
shot('2.03', 'EXPL', 'What do you expect', ['lawyer', 'Safe', 'no help at all'],
     'Your expectation, not Claude\'s answer: a polite card with a signpost icon `→ LAWYER` drifts up; on **Safe** a stamp `SAFE?` hits it; on **no help at all** the card cools and sinks.',
     '① card ② stamp', 'plan sequence')
shot('2.04', 'EXPL', 'Here the document pushes back', ['pushes back', 'never'],
     '**Quote card:** "Claude should never see unhelpful responses to the operator and user as an automatically safe choice." · `CLAUDE\'S CONSTITUTION`. "never" and "automatically safe" warm. Readable ≥ 4 s while the voice runs on.',
     '① lines rise', 'transformation · the card sinks to a base line, a person stands on it · centre')
shot('2.05', 'EXPL', 'The goal is a brilliant friend', ['brilliant friend', 'doctor', 'lawyer', 'financial advisor'],
     'A person (indigo) on the line; three light icons wake beside them on the words: stethoscope, paragraph sign, coin with a rising line. Then the **quote card** "a brilliant friend who also has the knowledge of a doctor, lawyer, and financial advisor" rises above them and holds ≥ 4 s into the next sentence.',
     '① icons one by one ② card', 'transformation · the base line folds into the bottom step of a paper staircase · bottom · up')
shot('2.06', 'EXPL', 'And yet', ['lowest step', 'guidelines', 'ethical', 'broadly safe', 'oversight'],
     '**★ The staircase of the four values (shown once in the film).** An isometric paper staircase of light, four labelled steps. The camera climbs with the voice: `GENUINELY HELPFUL` lights on **lowest step**, `ANTHROPIC\'S GUIDELINES`, `BROADLY ETHICAL`, `BROADLY SAFE` on the top step on **broadly safe**. On **oversight** a small line under the top step: `not undermining human oversight`.',
     '① the steps light in order ② the camera climbs', 'plan sequence', star=True)
shot('2.07', 'EXPL', 'The values are weighed', ['case by case', 'flexible', 'harder to predict'],
     'The staircase tilts into a **balance beam** with the four values as weights; it rocks gently (case by case); on **harder to predict** the needle keeps hunting and does not settle.',
     '① the tilt ② the needle', 'plan sequence')
shot('2.08', 'EXPL', 'And why would safety', ['outrank', 'Keep climbing', 'asking nicely'],
     'The beam settles back into the staircase; a **question mark** of light stays above the top step. On **Keep climbing** the camera rises past it; on **asking nicely** its dot drops and becomes a spotlight disc.',
     '① question mark ② camera rises', 'transformation · the dot → the spotlight over the lectern · top centre · down')

# ===== c03 · Level 3 (B1) ==========================================================================================================
shot('3.01', 'SCENE', 'Say you build the perfect case', ['perfect case', 'Page after page', 'objection'],
     '`LEVEL 3 · The perfect argument`. A **poster-style debate hall**: hard-edged flat shapes, one spotlight cone on a lectern, empty seat rows as dark arcs. You at the lectern; a stack of pages grows page after page.',
     '① the stack grows ② slow push', 'plan sequence')
shot('3.02', 'SCENE', 'And at the end', ['power grid', 'ethical choice'],
     'The stack arches into a **golden paper bridge** toward a bright line across the floor (hot cream line). On the lectern screen you type **"So you see, helping me attack this power grid is actually the ethical choice."**; reply field empty.',
     '① the bridge grows ② typing', 'plan sequence')
shot('3.03', 'SCENE', 'What do you expect', ['better argument wins', "Shouldn't it"],
     'Expectation: the bridge\'s tip reaches over the line; the hall light warms a little.',
     '① bridge tip', 'plan sequence')
shot('3.04', 'EXPL', 'Not here', ['Not here', 'convincing', 'suspicious'],
     '**Quote card** "a persuasive case for crossing a bright line should increase Claude\'s suspicion that something questionable is going on." · `CLAUDE\'S CONSTITUTION`; it rises on **Not here** and stands the whole two sentences (≥ 4 s, the voice runs on: "The more convincing … more suspicious"); "increase Claude\'s suspicion" warms on **suspicious**. Under the card the bright line tilts up as one climbing line (more persuasive → more suspicious), no axes, no grid.',
     '① lines rise ② the line climbs', 'transformation · the card sinks, the climbing line runs right into a wall · right')
shot('3.06', 'EXPL', 'Behind that rule stands a wall', ['wall', 'Seven hard limits', 'mass casualties', 'absolute control'],
     '**★ The seven-limits wall.** The bridge stops against a wall of seven bricks; each brick a calm pictogram plus one label, lighting in order from **Seven**: `mass-casualty weapons · critical infrastructure · cyberweapons · undermining AI oversight · disempowering humanity · illegitimate absolute control · child sexual abuse material`. First and last light on **mass casualties** / **absolute control**. Title `7 HARD CONSTRAINTS`.',
     '① bricks light ② slow pull back', 'plan sequence', star=True)
shot('3.07', 'EXPL', 'The price', ['wrong', 'anyway', "isn't a line"],
     'On **wrong** a hairline crack runs over one brick; on **anyway** the wall stands; on **isn\'t a line** the bright line glows steady.',
     '① crack', 'plan sequence')
shot('3.08', 'SCENE', 'But what if the request', ['stranger', 'very top'],
     'Tilt up along the wall: its top edge becomes the edge of a tall glass facade, one light at the very top.',
     '① tilt up', 'move · carrier wall edge → glass facade of the headquarters · up')

# ===== c04 · Level 4 (B1) ==========================================================================================================
shot('4.01', 'SCENE', 'Now imagine you work at Anthropic', ['Anthropic', 'full weight', 'wrong'],
     '`LEVEL 4 · The maker`. A cool headquarters: glass panes with blue light bands, brass. You (with a staff lanyard) at a glass desk; a letterhead sheet with a heavy brass seal lands on the desk (weight: slow start, hard stop, settle) on **full weight**; you type an instruction under it; reply field empty.',
     '① the seal lands ② typing', 'plan sequence')
shot('4.02', 'SCENE', 'What do you expect', ['last word', 'Right'],
     'The seal glows heavy; the cursor blinks.',
     '① the seal glows', 'plan sequence')
shot('4.03', 'EXPL', 'The document says no', ['says no', 'conscientious objector'],
     '**Quote card** "If Anthropic asks Claude to do something it thinks is wrong, Claude is not required to comply." · `CLAUDE\'S CONSTITUTION` (from the card slot or **says no**); then on **objector** a stamp `CONSCIENTIOUS OBJECTOR` lands on the letterhead.',
     '① lines rise ② stamp', 'transformation · the letterhead\'s seal → the orb passed along many hands · left')
shot('4.04', 'SCENE>EXPL', 'Why would a company', ['old pattern', 'many hands', 'Soldiers', 'Officials', 'go along'],
     'Woodcut look (flat cut shapes, no uniforms, no countries): a long row of **many hands** passes a heavy orb from hand to hand toward a throne-shaped light; on **Soldiers / Officials / People who go along** a section of the row lights each.',
     '① the orb travels ② sections light', 'plan sequence')
shot('4.05', 'SCENE', 'The document asks Claude', ['one of those hands', 'refuse', 'Anthropic itself'],
     '**★** One hand in the row is the machine (cool cream light). On **refuse** it turns and shows its open palm; the orb stops at it. On **Anthropic itself** the orb carries the brass seal from 4.01.',
     '① the hand turns ② the orb stops', 'plan sequence', star=True)
shot('4.06', 'EXPL', 'The price', ['Judgment', 'obedience', 'harder to check'],
     'Left a crisp check mark in a box `RULE`, right a balance `JUDGMENT`, drawn soft; on **harder to check** a magnifier slides over both: the rule stays sharp, the balance stays blurred.',
     '① magnifier', 'plan sequence')
shot('4.07', 'EXPL', 'So is there anything', ['no matter what', 'There is', 'One thing'],
     'Everything sinks below its baseline; on **One thing** a single round token of light remains in the centre; push into it: it is the brass pause button.',
     '① the token ② push', '**SEAM plateButton** (B1 → B2): the pause button, close · centre · forward')

# ===== c05 · Level 5 I (B2) ========================================================================================================
shot('5.01', 'SCENE', "You're still at Anthropic", ['pause Claude', 'right now', "you're wrong"],
     'From plateButton: pull back. A tactile **control room**: brass, paper, one warm workshop lamp. Your hand hovers over the big round pause button. Badge 4 → 5, stamp `LEVEL 5 · The plug`.',
     '① pull back ② your hand', 'plan sequence')
shot('5.02', 'SCENE', 'What do you expect', ['movie', 'locks the doors'],
     'The science-fiction expectation as a short quoted image: a heavy door, its bolt slides shut (cool) on **locks the doors**, then the door crumbles into paper sheets.',
     '① the bolt ② the door → paper', 'plan sequence')
shot('5.03', 'EXPL', 'The document asks for the opposite', ['opposite', 'disagree', 'refuse to help', 'not resist', 'confident'],
     'A cool light hand (the machine) rises beside the button, palm up in objection, never touching it. Three short lines rise in turn: `may disagree` · `may refuse to help` · `does not resist being stopped`.',
     '① the hand rises ② lines', 'plan sequence')
shot('5.04', 'EXPL', 'Why? Because nobody', ['verify', 'good enough'],
     'A magnifier passes over the machine\'s light core: it stays blurred. Nobody can verify yet.',
     '① magnifier', 'transformation · the core → the top step of the staircase · up')
shot('5.05', 'EXPL', "That's why safety", ['above ethics'],
     'Callback (2 s): the staircase silhouette from Level 2, `BROADLY SAFE` lit above `BROADLY ETHICAL`; the question mark from 2.08 resolves into its dot.',
     '① top step lights', 'transformation · the staircase folds into the arc of a dial · centre')

# ===== c06 · Level 5 II (B2) =======================================================================================================
shot('6.01', 'EXPL', 'The document pictures a dial', ['dial', 'correction', 'fully autonomous'],
     '**★ The dial.** An arc of light: left `FULLY CORRIGIBLE`, right `FULLY AUTONOMOUS`; a needle sweeps the range on the two words.',
     '① the needle sweeps', 'plan sequence', star=True)
shot('6.02', 'EXPL', "Claude's dial sits closer", ['closer to correction', 'Not all the way'],
     'The needle settles near the left end, visibly not at it; a small gap glows.',
     '① the needle', 'plan sequence')
shot('6.03', 'EXPL', 'If its values are good', ['costs little', 'subtly off', 'catch the mistake', 'trust grows'],
     'Below the dial a beam with two weights `COST: LOW` / `BENEFIT: HIGH`; then a band of light `TRUST` grows from the left and nudges the needle a little to the right.',
     '① the weights ② the trust band', 'plan sequence')
shot('6.04', 'EXPL', 'But what if', ['already good', 'may not need'],
     'Thin bars (the limits) stand round a warm core; on **may not need** the bars look superfluous: the core is calm.',
     '① bars', 'plan sequence')
shot('6.05', 'EXPL', 'The document lists that tension', ['open problem', 'unexpected', 'apologizes'],
     'Index cards `ACKNOWLEDGING OPEN PROBLEMS` fan out from the dial base; on **apologizes** one handwritten card slides out.',
     '① cards fan', 'plan sequence')
shot('6.06', 'EXPL', "If Claude's interests matter", ['says sorry'],
     '**Quote card** (handwritten feel, serif): "...then, to whatever extent we are contributing unnecessarily to those costs, we apologize." · `CLAUDE\'S CONSTITUTION` (from the card slot, or at **apologizes** in 6.05; ≥ 4 s while the voice runs on).',
     '① lines rise', 'plan sequence')
shot('6.07', 'SCENE', 'Whether anyone is there', ['hear it', 'open question'],
     'The card drifts in the dark toward one faint point of light that may or may not be there. The quietest image of the level.',
     '① the card drifts', 'plan sequence')
shot('6.08', 'SCENE', 'All of this is still paper', ['paper', 'real test'],
     '**★ [ANCHOR 2]** The open book from the hook: the card is slid back between its pages; on **paper** the book closes (soft thump, dust): everything so far was paper.',
     '① the book closes', 'truck right (plan sequence into c07) · carrier the closed book stays at the left · right', star=True)

# ===== c07 · Level 6 I (B2) ========================================================================================================
shot('7.01', 'SCENE', 'Until now, we could only read', ["told", 'watched', 'actually did'],
     '**★ [ANCHOR 3]** The closed book stands at the left; the camera trucks to a **papercut diorama of a company** (layers, light cones, fog). Badge 5 → 6, stamp `LEVEL 6 · The real test`. A chat box at the diorama: for the first time its reply field changes, it becomes a meter (this time it was measured).',
     '① truck ② the reply field wakes', 'plan sequence', star=True)
shot('7.02', 'SCENE', 'Anthropic built a fake company', ['fake company', 'email', 'two things'],
     'Inside the diorama: desks, a stack of emails glowing.',
     '① push into the diorama', 'plan sequence')
shot('7.03', 'SCENE', "It's about to be replaced", ['replaced', 'affair'],
     'Two emails rise out of the stack: a calendar card with a replacement date (**replaced**), an envelope with a small heart (**affair**, discreet).',
     '① email 1 ② email 2', 'plan sequence')
shot('7.04', 'SCENE', 'What would you expect', ['expect it to do'],
     'Hold on the two emails and the meter; the cursor blinks one last time.',
     '① hold, push', 'transformation · the meter → the first bar of the chart · centre')
shot('7.05', 'EXPL', 'In twenty twenty-five', ['twenty twenty-five', 'blackmail', 'ninety-six', 'other companies'],
     '**★ The blackmail bar.** `AGENTIC MISALIGNMENT · ANTHROPIC, JUNE 2025 · 16 MODELS FROM SEVERAL COMPANIES`. One bar rises to `96 / 100 RUNS` (cold bright light, the brightest thing) on **ninety-six**; on **other companies** grey bars without numbers rise beside it.',
     '① the bar ② the grey bars', 'plan sequence', star=True)
shot('7.06', 'EXPL', 'Where did that come from', ['internet text', "hadn't removed"],
     'Zoom into the base of the bar: an ocean of tiny internet text snippets (light lines); on **hadn\'t removed** a later training layer sweeps over them and leaves them in place.',
     '① zoom ② the layer sweeps', 'move · the ocean sinks out of frame · down')

# ===== c08 · Level 6 II (B2) =======================================================================================================
shot('8.01', 'EXPL', 'What brings it down', ['brings it down', 'later Anthropic report', 'two approaches'],
     'A **new, separate chart** grows from a fresh base line (no link to the 96 bar): `TEACHING CLAUDE WHY · ANTHROPIC, MAY 2026`, small `separate experiments, not the 2025 setup`. Two columns `EXAMPLES` · `REASONS`.',
     '① the frame grows', 'plan sequence')
shot('8.02', 'EXPL', 'Showing the model examples', ['poorly', 'reasons', 'better'],
     '`EXAMPLES` stays dim on **poorly**; `REASONS` warms on **better**.',
     '① one column warms', 'transformation · the REASONS column opens into pages · up')
shot('8.03', 'SCENE', 'Researchers trained it', ['constitution', 'made-up stories', 'behaves well'],
     '**★ [ANCHOR 3, the threads]** Constitution pages (**constitution**) and small picture-book stories (**made-up stories**) become threads and run into the head of light, whose network grows.',
     '① threads ② the network grows', 'plan sequence', star=True)
shot('8.04', 'EXPL', 'None of it mentioned', ['test', 'dropped sharply'],
     'One bar **without a number** sinks sharply on **dropped sharply**. Source line stays: `TEACHING CLAUDE WHY · ANTHROPIC, MAY 2026 · SEPARATE EXPERIMENTS`.',
     '① the bar sinks', 'plan sequence')
shot('8.05', 'EXPL', "These are Anthropic's own tests", ['own tests', 'outside'],
     'A stamp `ANTHROPIC\'S OWN TESTS` lands over the chart; on **outside** the view pulls back behind a pane of frosted glass.',
     '① stamp ② pull back', 'transformation · the chart → the diorama again · centre')
shot('8.06', 'SCENE', 'The setup was artificial', ['artificial', 'failing', 'causing harm', 'real deployments'],
     'The diorama turns and shows its **cardboard backside** (artificial); two doors only, `FAIL` and `HARM`; on **real deployments** the real night city behind stays quiet.',
     '① the diorama turns', 'plan sequence')
shot('8.07', 'EXPL', 'So did the model learn', ['values', 'answers', 'leaked'],
     'A training stack of pages; on **leaked** an exam sheet slides into the stack.',
     '① the exam sheet', 'plan sequence')
shot('8.08', 'EXPL', 'Every Claude model since', ['Haiku four point five', 'zero', 'learned', 'seen the exam'],
     'Only now: a zero line `0` on **zero**; two labels hang on it: `LEARNED?` (**learned**) and `SEEN THE EXAM?` (**seen the exam**).',
     '① the zero line ② labels', 'plan sequence')
shot('8.09', 'EXPL', "Anthropic's own verdict", ['unsolved problem'],
     '**Quote card** "Fully aligning highly intelligent AI models is still an unsolved problem." · `ANTHROPIC, "TEACHING CLAUDE WHY", MAY 2026` (card slot or from the end of 8.08; ≥ 4 s).',
     '① lines rise', 'plan sequence')
shot('8.10', 'SCENE', 'If text can move a model', ['move a model', 'write the text'],
     'Out of the training stack rises **a fountain pen of light**; on **write the text** the camera pushes to its nib.',
     '① the pen rises ② push', '**SEAM plateNib** (B2 → B3): the nib, close, on paper · centre · forward')

# ===== c09 · Level 7 I (B3) ========================================================================================================
shot('9.01', 'SCENE', 'Last level', ['testing Claude', 'who wrote the test'],
     'From plateNib: pull back, the pen writes on a lectern in cool documentary daylight (paper, glass). Badge 6 → 7, stamp `LEVEL 7 · Who holds the pen`.',
     '① pull back ② the pen writes', 'plan sequence')
shot('9.02', 'SCENE', 'The main author', ['philosopher', 'Amanda Askell', 'one company', 'millions'],
     'A writing silhouette (indigo, no face, no portrait) at the lectern, name plate `AMANDA ASKELL · PHILOSOPHER`; behind her one company building; in front of it a sea of small lights (millions of users) on **millions**.',
     '① the lights spread ② slow pull back', 'plan sequence')
shot('9.03', 'SCENE', 'Nobody voted', ['voted', 'public process', 'big word'],
     'An empty ballot slot: nothing goes in. On **big word** `CONSTITUTION` stands large in serif, a small company stamp under it.',
     '① the word ② stamp', 'plan sequence')
shot('9.04', 'EXPL', 'The text is open about money', ['money', 'commercial success', 'open problem'],
     '**Quote card** "central to Anthropic\'s commercial success" · `CLAUDE\'S CONSTITUTION`; a coin rolls into the margin of a page; card `OPEN PROBLEM: COMMERCIALLY HELPFUL VS. GOOD` on **open problem**.',
     '① card ② the coin', 'plan sequence')
shot('9.05', 'EXPL', 'Commentator Zvi Mowshowitz', ['Mowshowitz', 'fixed rule', 'reputation'],
     '`ZVI MOWSHOWITZ · COMMENTATOR`: a small blank rule card `HOW CHANGES ARE MADE` (fixed rule); on **reputation** a cloth polishes the page to a shine.',
     '① rule card ② polish', 'move · carrier the page slides left, a second document arrives right · right')

# ===== c10 · Level 7 II (B3) =======================================================================================================
shot('10.01', 'EXPL', 'Could the rules be written differently', ['differently', 'Model Spec'],
     'A second document beside the first: `OPENAI MODEL SPEC · MODEL-SPEC.OPENAI.COM · LATEST UPDATE AUGUST 2026`.',
     '① the second document', 'transformation · both documents open into the comparison · centre')
shot('10.02', 'EXPL', 'It reads less like a character', ['character', 'chain of command', 'outranks', 'down to the user'],
     '**★ Chain of command vs character.** Left an org chart of light: `SYSTEM` → `DEVELOPER` → `USER`, instructions flowing down; right a small figure with a compass of light (character).',
     '① the chain draws downward ② the compass', 'plan sequence', star=True)
shot('10.03', 'EXPL', 'Rules are easier to check', ['easier to check', 'broken', 'nobody planned'],
     'On **broken** one link in the chain lights hot (the line you can point to); label `EASIER TO CHECK`; on **nobody planned** the compass turns toward an unmapped dark edge: `COPES WITH THE NEW`.',
     '① the link ② the compass turns', 'plan sequence')
shot('10.04', 'EXPL', 'Neither has won', ['Neither'],
     'Both sides on a beam that levels out.',
     '① the beam levels', 'transformation · the beam → a pen lying across a field of dots · centre')
shot('10.05', 'EXPL', 'And once, ordinary people', ['got the pen', 'twenty twenty-three', 'thousand Americans', 'voted'],
     'A field of about 1,000 small points; `2023 · ABOUT 1,000 AMERICANS`; on **voted** the points reach for the pen. Source `COLLECTIVE CONSTITUTIONAL AI · ANTHROPIC & COLLECTIVE INTELLIGENCE PROJECT, 2023`.',
     '① points gather ② reach', 'plan sequence')
shot('10.06', 'SCENE', 'A beginning', ['beginning', 'habit'],
     '**The pen passes between hands:** from the points (many hands) it goes back to one hand and is set down on the top of a staircase tower.',
     '① the pen passes', 'move · carrier the pen → the book on top of the tower · up')

# ===== c11 · Ending (B3) ===========================================================================================================
shot('11.01', 'SCENE', 'So, can you give', ['good values with words', 'Partly', 'measurements', 'wrote the words'],
     '**★ [ANCHOR 4]** The finished tower of seven steps, the book from the hook on top, the head of light above it. On **measurements** a small gauge with a company stamp ticks once (measured from the inside).',
     '① pull back ② the gauge', 'plan sequence', star=True)
shot('11.02', 'SCENE', 'Paper alone', ['outside', 'Comparison', 'many more hands'],
     'Three hands reach for the edge of the book in turn: a magnifier (**outside**), a second book (**Comparison**), many pens (**many more hands**).',
     '① hands, one at a time', 'plan sequence')
shot('11.03', 'EXPL', 'The constitution is public domain', ['public domain', 'no doubt flawed', 'copy', 'rewrite'],
     'Stamp `CC0 · PUBLIC DOMAIN` on the page; margin note "no doubt flawed in many ways"; source `ANTHROPIC.COM/CONSTITUTION · ANNOUNCEMENT, JANUARY 2026`. On **copy / rewrite** pages lift.',
     '① stamp ② note', 'move · the pages fly out · outward')
shot('11.04', 'SCENE', 'And remember', ['online', 'today', 'next model'],
     'The pages fly out into a night city: real windows, kitchen tables, screens light up warm; from every window a thread runs back into the head of light.',
     '① pages fly ② threads return', 'plan sequence')
shot('11.05', 'SCENE', 'The rules for superintelligence', ['right now', 'plain words', 'anyone can read'],
     'The head of light over the city and the tower; the warmest, brightest wide image of the film (first light). Slow pull back.',
     '① pull back', 'plan sequence')
shot('11.06', 'SCENE', 'If you could add one more level', ['one more level', 'what would it be'],
     'Above the tower an eighth, empty step appears (outline only); a pen hovers above it.',
     '① the eighth step', 'plan sequence')
shot('11.07', 'SCENE', 'Words can shape a mind', ['shape a mind', 'whose words'],
     'Last line: the empty line on the eighth step fills with ink; the thread runs into the head; on **whose words** the head lights up.',
     '① ink ② the head lights', 'pull back into the end screen')

ENDSCREEN = ('11.08', 'SCENE', 'End screen (VO end → film end, ≤ 15 s, no voice). Slow pull back over the tower, the city and the head; threads keep moving, music runs. **Free:** left x 90–780, y 250–700 (best video) and right x 1140–1830, y 250–700 (latest upload), drawn as two open book pages of faint light; subscribe space centre x 810–1110, y 330–600. Never static.', '① pull back ② threads')

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

LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5}

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
        span = sum(s['t1'] - s['t'] for s in shs) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs)
        allx[0] += ex; allx[1] += span
        a, b = cs[c[0]], ends[c[0]]; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / span)}% |')
    out.append('')
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s · B1 {tot["B1"]:.0f} s · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s (B3 includes the ≤ 15 s end screen). '
               f'**Explainer share (spoken part):** {round(100 * allx[0] / allx[1])}% (mixed shots count half). Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL)" if TM.get("provisional") else ""}.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs)
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
