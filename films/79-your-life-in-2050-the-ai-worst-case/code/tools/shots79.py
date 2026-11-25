#!/usr/bin/env python3
"""Film 79 'Your Life in 2050: The AI Worst Case' (mirror of #74) · shot list, REGELN §13 (one picture per sentence, explainer share 60-70 %).
One row per sentence (clips and the end screen are rows too). Writes docs/shots.md with the numbers computed on the timing file
(real VO <ROOT>audio/timing.json if present, else data/provisional_timing.json) and data/rows.json (read by film.mjs).
Types: S = SZENE-2.5D (a real place of the script as parallax layers) · M = MIX (graphic, counter, type or a paper card ON a scene) ·
E = EXPL (pure explainer graphic) · C = CLIP. Weights (§13.2): E 1 · M .5 · S 0 · C 0. Target 60-70 % (unlike #74, which deviated to ~42 %).
Columns: id · phrase (first words of the sentence, used to find its time) · type · shows literally · new motif? (y / n = same picture, beat) ·
carrier to the next row · flag (A = leitbild anchor: the same street, * = wow moment of the section).
While the rows do not cover the whole VO yet (vo-v2 pending), the numbers are computed over the covered span and flagged as such.
usage: python3 tools/shots79.py [timing.json]"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); CODE = os.path.dirname(HERE)
ROOT = os.environ.get('F79ROOT', '/mnt/project-files/scenario/film-79-worst-case/').rstrip('/') + '/'
TF = sys.argv[1] if len(sys.argv) > 1 else (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else CODE + '/data/provisional_timing.json')
# ---- vo-v2 rows (25.11.). Format per line: id | phrase | type | shows literally | new (y/n) | carrier | flag
R = r"""
H.01|This is your life in|M|YOUR STREET 2050 at cold dawn (thumbnail A): box hedges where the cars stood, the windowless tower with its carmine band, you at your yellow door · 2050 rolls in · tag A WARNING · IF WE GET IT WRONG|y|the road line|A
H.02|If we get|M|same street, AI WENT WRONG rises under 2050 on "wrong", the tower band flickers once|n|the road line becomes a timeline|
H.03|The worst case|E|TIMELINE 2026 -> 2050 on the night ground, the 2050 end marked THE WORST CASE|y|the line|
H.04|No war|E|a pale-ink war sign drops toward the line and is struck out carmine|y|the strike|
H.05|No robot army|E|a pale-ink marching robot row drops toward the line and is struck out|y|the strike|
H.06|Superintelligence came, and|E|a carmine ring lands on the line (EARLY 2030s · A SCENARIO ASSUMPTION); on "works" the line turns even and bright|y|the ring|
H.07|Just not for|E|you walk along the line; the bright line lifts off over your head and runs on to 2050 without you|y|the 2050 dot becomes the bedroom window|
H.08|You wake up|S|BEDROOM at cold dawn: you sit up; corner clock MONDAY · 8:10 AM|y|the nightstand|
H.09|Nothing woke you|S|push to the nightstand: a pale ring in the dust where a clock stood|y|the ring in the dust (iris)|
H.10|Your grandson is holding|S|KITCHEN: the grandson (rust coat) lifts the brass alarm clock out of an old box; the tower in the window|y|the clock face|
H.11|What was this for|S|close: he holds the clock out to you|y|the clock face|
H.12|It got you to|M|paper card out of the clock face: BACK IN THE TWENTIES, bells at 6:15, a figure hurries TO WORK|y|the card|
H.13|He asks who needed|M|the card again: YOU in the middle, ink lines to boss, customers, colleagues, your kids; the lines go slack one by one|y|the empty centre|
H.14|He has never met|S|kitchen: he turns the clock in his hands, looks out at the empty street (nobody out there)|y|his look to the hall|
H.15|So how does a world|M|HALLWAY: the NOT NEEDED counter grows big, nine boxes, the first carmine THE ALARM CLOCK, a question mark|y|the front door (portal)|
H.16|You open the front|S|the front door swings open into cold light|y|the door opening|
H.17|It's your street|S|YOUR STREET at eye level (leitbild) · tag YOUR STREET · 2050|y|the houses|
H.18|Same houses|S|beat: the house fronts catch the pale light one after another|n|the corner|
H.19|Same corner|S|beat: the corner house catches the light|n|the facades|
H.20|Nothing is broken|M|one wide frame: a pale-ink ghost of broken windows on the house across is wiped off, the real panes are whole|y|the bays|
H.21|Every hedge is trimmed|S|truck along the kerb: box hedges in the old parking bays, cut to the millimetre|y|the road|
H.22|You raise your hand|S|you at the kerb raise your hand; a robotaxi with crates comes down the street|y|the car|
H.23|An empty car slows|M|the car slows, a carmine scan line reads you: BALANCE 0 on its roof strip; it drives on at full speed|y|the car leads the eye down the street|
H.24|At the end of the|M|push down the street: pale-ink 2026 cornfields over the horizon are wiped, a FENCE runs across the end|y|the fence line|
H.25|Behind it, a tower|S|rise up the TOWER behind the fence: windowless, the carmine band breathes, lit day and night; you tiny at the street|y|the band|*
H.26|And it's Monday morning|M|a calendar leaf MONDAY drops into the empty street|y|the leaf|
H.27|Nobody on this street|M|pull back: every front door shut, blank day-leaves over the doors, nobody steps out|y|the neighbour's garage door|
B.01|Your neighbor used to build|S|the neighbour's garage door rolls up: a half-built wooden boat hull under a sheet, his tools on the wall, he sits on a crate|y|the hull|
B.02|Nobody fired him|E|pale-ink FIRED notice drops and is struck out (nothing happened to him)|y|the strike|
B.03|The orders just stopped|E|his order book as monthly bars 2046-2050 that thin out to nothing; the last pages blank|y|the last bar|
B.04|And the thing you were|E|your own trade on a paper card: your hands and your tool, BACK THEN · YOUR WORK|y|the card|
B.05|A machine does it now|E|two effort bars: YOU · A DAY vs A MACHINE · A FEW SECONDS (no amounts); the machine bar is a sliver|y|the sliver becomes the counter line|
B.06|So what does everybody live|E|street: the NOT NEEDED counter adds YOUR WORK|y|the HUD clock|
B.07|You'll know at noon|E|the day clock dial: a pale noon mark ahead of 8:40|y|the dial|
B.08|Until then, your balance|M|your phone in your hand: BALANCE 0 in carmine; you put it away and start to walk|y|your steps|
B.09|You step into the road|S|kerb from low: you step into the road without looking|y|the car|
B.10|So who are they all|M|robotaxis brake around you in a soft wave and glide on|y|one car|
B.11|Look through the glass|S|close along a car's side window|y|the window (portal)|
B.12|The passengers are crates|M|inside: crates and spare parts strapped in seats, tags FROM: MACHINE · TO: MACHINE|y|the tags|
B.13|It's the busiest street|E|the street from above as a map: hundreds of trip lines; YOUR ERRANDS: 0|y|the lines bend across the road|
D.01|Most of those crates are headed|S|the cars turn across the road into a loading door of the DATA CENTRE|y|the loading door|
D.02|That building wasn't there|E|pale-ink ghost of the empty plot on the 1st of the month (paper calendar corner NOVEMBER 1)|y|the ghost plot|
D.03|Machines printed the walls|S|timelapse: the gantry prints the walls, arms fit the roof, DAY 1 ... DAY 9 ticks|y|the gantry|
D.04|On the tenth, nobody|S|day 10: finished, the gantry folds away; nobody arrives, only cars|y|the facade|
D.05|It has no windows|M|close along the smooth facade, the seam, cooling vapour|y|the seam|
D.06|Nothing inside needs to|E|pale-ink window drawn on the facade is struck: nobody inside to look out|y|the facade line|
D.07|It's a data center, and|E|STAFF 0 in big serif over the building section (dark inside, no figures)|y|the 0 (iris)|
D.08|Back in the twenties, a|E|a paper card unfolds out of the 0: BACK IN THE TWENTIES · STANFORD|y|the card|
D.09|Listen to where he found|M|on the card: a ladder, the bottom rung glows|y|the card opens to the clip|
C2||C|CLIP C2 Brynjolfsson (Revelio) on the paper plate|y|the plate folds back|
D.10|He had every reason to|E|card: ECONOMIST · STANFORD · CO-FOUNDER OF AN AI FIRM|y|the firm|
D.11|He co-founded a firm|E|a firm box sends AI lines into company boxes|y|the companies|
D.12|His study found no|E|jobs by age group: older lines steady, no wave (source line)|y|the young line|
D.13|But for the young|E|the 22-25 line in AI-exposed jobs bends down; the bottom rung of a ladder drops out|y|the ladder|*
D.14|On this street, the whole|E|the ladder over the data centre: every rung gone|y|the empty rails|
D.15|So machines drive, build|E|three marks DRIVE · BUILD · RUN, each taken by a carmine ring|y|the rings|
D.16|What is left for you|M|the counter adds THE BUILDING SITE|y|the HUD clock|
D.17|By ten o|M|the day clock runs to 10:00, your kitchen window in the distance|y|the window|
K.01|You get home just as|S|KITCHEN: you come in, the lamp goes out in 3 frames (light-out 1)|y|the dark|
K.02|It isn't a blackout|M|the meter on the wall: a paper slip SCHEDULED · 10:00-14:00|y|the slip|
K.03|It's a schedule|E|a 24-h ring: your house's hours cut out in blocks, the tower's ring never cut|y|the full ring|
K.04|Behind the fence, the tower|S|through the dark window: the tower shines on, its band steady|y|the band|
K.05|There's more electricity than|E|a supply bar grows far past any earlier bar|y|the bar|
K.06|Power is like air|E|the bar dissolves into slow flow lines filling the frame|y|the flow|
K.07|But the machines breathe|E|the flow splits: a broad carmine stream to the machines first, a thin amber thread to the houses|y|the thin thread|
K.08|The first sign came|M|paper card BACK IN THE TWENTIES: a grid map of the eastern US|y|the map|
K.09|On America's biggest grid|E|X.pjm: the capacity bill $63.6 BN, a row of houses paying into it|y|the bar|
K.10|By the grid watchdog's|E|X.pjm: the $29.4 BN / 46 % segment turns carmine, ESTIMATE · MARKET MONITOR|y|the carmine segment|
K.11|So who decided that|E|dark kitchen; the counter adds YOUR KITCHEN, FIRST with a question mark|y|the phone on the table|
K.12|It's almost noon|M|the day clock to 11:59, the phone on the table waits|y|the phone (portal)|
N.01|Noon The|S|THE STREET AT NOON (anchor Wende): every house chimes at once, carmine points in every window|y|the points|A
N.02|The whole street chimes|S|the chime points ripple down the street|n|one window|
N.03|Every phone, the same|M|PL.phoneNoon: YOUR MONTHLY ALLOWANCE HAS ARRIVED|y|the notification line|
N.04|It comes from the company|E|one company ring sends thin lines to every house; the government building beside it stays pale|y|the lines|
N.05|An algorithm sets the|E|this month's line steps a little lower than last month's (no amounts)|y|the step|
N.06|No reason given|M|the notification: WHY? field empty|y|the field|
N.07|And if you want to|E|a TALK TO A HUMAN button with a lock: EXTRA FEE|y|the lock|
N.08|It isn't a wage|E|labels WAGE and RIGHT struck out|y|the strikes|
N.09|An owner gets a dividend|E|OWNER: a share line flows TO the owner|y|the flow|
N.10|A child gets an allowance|E|CHILD: a small line handed DOWN, the same picture as yours|y|you on the child's place|
N.11|So who decided that the machines come|E|X.need opens: the machine ring and you|y|the ring|
N.12|Nobody voted on it|E|a ballot box stays empty|y|the box|
N.13|Nobody had to|E|the box fades, the mechanism stays|n|the mechanism|
N.14|Think about why anyone|E|X.need THEN: YOU in the middle|y|you|
N.15|Your employer needed your|E|amber arrows WORK -> EMPLOYER, TAXES -> GOVERNMENT|n|the arrows|
N.16|That was your seat|E|the arrows form YOUR SEAT AT THE TABLE|n|the seat|
N.17|Not kindness|E|KINDNESS struck|n|the strike|
N.18|Need|E|NEED stamped amber|n|the stamp|
N.19|Now the machines do all|E|X.need NOW: the carmine ring takes WORK and TAXES|y|your lines|
N.20|You still have your vote|E|one thin amber VOTE line remains|n|the thin line|
N.21|But in your old life|E|the arrows reverse: they lived off you|n|the reversal|
N.22|Here, you live off|E|the ALLOWANCE dotted line feeds you from the ring|n|the dotted line|
N.23|And whoever is being fed|M|the table: a menu card written at the ring's end, you without a pen|y|the menu card|
N.24|Back in the twenties, a computer|E|paper card: BACK IN THE TWENTIES · COMPUTER SCIENTIST|y|the card|
N.25|He had led a team|M|card: HE LED A TEAM AT AN AI COMPANY|y|the plate|
C1||C|CLIP C1 Duvenaud (80,000 Hours) on the paper plate|y|the plate folds back|
N.26|It was a warning, not|E|stamps WARNING (amber) vs FORECAST (struck)|y|the stamp|
N.27|In this version of twenty|M|the street at noon: the stamp turns CAME TRUE|y|the street|
N.28|No one had to push|E|a pale-ink pushing hand struck out|y|you at the table edge|
N.29|They only had to stop|E|your last lines fade one by one|y|the empty seat|
N.30|And how bad can life|M|the street at noon, you with the phone, the chime points fading|y|the phone|
N.31|This month, your allowance|E|the allowance line steps down month after month, NEXT MONTH dotted lower|y|the step down becomes the counter|
G.01|This channel exists for one|M|SUBSCRIBE 1 on the street at noon (anchor): the counter half full|y|the street|A
G.02|Want that too|M|the street holds, the counter breathes|n|the empty pavement|
G.03|But people who lose their|M|the calm street in the afternoon light, nobody outside|y|the street|
G.04|Go and look for|E|a cream search ring on the street, counter ANGRY FACES 0|y|the ring moves to a window|
G.05|Start with your grandson|S|LIVING ROOM: the grandson at his screen, lit by it, you in the doorway|y|the screen|
G.06|There's no school bus|M|a bus stop sign; a pale-ink bus is wiped off|y|the sign|
G.07|No bell|M|the school bell in its frame, still|y|the bell|
G.08|He learns from a screen|S|back in the living room: his screen, his small hands|y|the screen|
G.09|It's endlessly patient, and|E|the screen answers again and again, counter ANSWERS rising, never tired|y|the counter|
G.10|It's built for one|E|a loop arrow around the child: MINUTES ON SCREEN keep growing|y|the loop|
G.11|Not out of malice|E|MALICE struck; the loop keeps turning|n|the loop|
G.12|A contented child asks|S|the boy, still, content, the room quiet|y|the window to the school|
G.13|The old school building|S|PL.school: chained gate, the last lit window goes out (light-out 2)|y|the chain|
G.14|He has never lost an|E|a scoreboard ARGUMENTS · WON all · LOST 0|y|the 0|
G.15|Everything he talks to|E|his screen: every reply carries a small YES tick|y|the ticks|
G.16|In your day, more than|E|survey: more than a third of US kids who used AI talked to it about feelings or problems (source)|y|the bar|
G.17|What a machine is allowed|E|paper card: a rulebook with blank pages, STILL BEING DECIDED|y|the blank page|
L.01|So the children are content|E|the search ring: children checked off, calm|y|the ring moves on|
L.02|But the grown-ups remember|M|a neighbour at his window, old work boots on the sill|y|the window|
L.03|What keeps them quiet|E|the search ring rests on him|n|the ring|
L.04|Breakthroughs that used to take|E|a DECADES bar folds down to EVERY WEEK, parcels drop out of it|y|the parcels|
L.05|And who sends back a|M|doorsteps: parcels arrive at every door, a car delivers, nobody returns one|y|the road to the fence|
L.06|And the farmers|E|the search ring moves to the end of the street|y|the ring|
L.07|They lost their land|E|a field map: parcels flip from green to carmine one by one|y|the map|
L.08|By afternoon, you have walked|S|you at the end of the street, the fence (4 PM)|y|the fence|
L.09|Where the cornfields ran|M|pale-ink cornfields over the land are wiped|y|the wipe|
L.10|Behind it, solar panels|S|PL.land: solar rows and grey halls to the hills|y|the rows|
L.11|Every gate opens from|S|the gate close: latch and hinge on the far side|y|the latch|
L.12|But nobody stole these|E|the map again: no break-in marks, only SOLD tags|y|the tags|
L.13|They were sold, one|E|offer slips land one parcel at a time|y|the last slip|
Q.01|That leaves one place|E|the search ring to the town square on a small map|y|the square|
Q.02|The path loops back|S|you on the path back into town (6 PM)|y|the path|
Q.03|It's empty, like every|S|THE EMPTY SQUARE (anchor Pointe): dry fountain, shut stall, empty benches|y|the square|A
Q.04|The only person on|S|you tiny in the middle|n|the windows|
Q.05|Everyone else is at|M|every window around the square glows with the AI friend|y|one window|
Q.06|It only ever gives|E|arrows only from the friend to the person, none back|y|the arrows|
Q.07|The computer scientist behind|E|the paper card returns|y|the card|
Q.08|He even predicted how|M|card opens to the plate|y|the plate|
C3||C|CLIP C3 Duvenaud (SRI) on the paper plate|y|the plate folds back|
Q.09|That's why the street is|E|search result: ANGRY FACES 0 · ROBBED 0 · LOOKED AFTER all|y|the result|
Q.10|Is a friend who never|E|one friend window close, the glow steady|y|the glow|
Q.11|There's nobody on the square|M|the empty square, benches|y|a bench|
Q.12|So what is left for|E|the counter list, one line left|y|the last line|
Q.13|Your time|E|a dial: YOUR TIME · THE ONE THING NO MACHINE CAN MAKE|y|the dial|
Q.14|And here, nobody is waiting|M|the square clock tower, nobody under it|y|the bench|
E.01|Then your grandson sits|S|PL.bench from behind: he sits beside you with the clock|y|the clock|
E.02|He has never heard it|M|the clock in his hands, silent|n|the clock|
E.03|But he knows your stories|E|ink stories rise out of the clock: the job, the crowded square, the people who waited|y|the ink|
E.04|Why didn't anyone stop|S|he looks up at you|y|your look|
E.05|You look for something to|E|three empty frames: A RUIN · A VILLAIN · THE DAY|y|the frames|
E.06|There isn't one|E|the frames stay empty and fold|n|the folds|
E.07|Every step looked like a|E|three gifts on a path: THE SAFER CAR · THE PATIENT SCREEN · THE FRIEND WHO STAYS|y|the path|
E.08|Nothing in this street was|S|from the bench: the street at night, the last lamp at home goes out (light-out 3), the tower band steady|y|the dark street|*
W.01|But it isn't twenty fifty|E|the 2050 stamp rolls back to 2026|y|the stamp|
W.02|This street hasn't been built|E|the street becomes a pale blueprint|y|the plan|
W.03|Tomorrow morning, somebody is|M|a morning door, someone waiting for you outside|y|the figure|
W.04|Your work, your taxes|E|WORK · TAXES · VOTE light amber|y|the three lines|
W.05|That is leverage|E|the three lines become a lever|y|the lever|
W.06|And people are already using|E|the station list returns as a column (WAY OUT)|y|the column|
W.07|Those fields, sold one|E|station THE FIELDS|y|the field|
W.08|In Kentucky, a woman|E|offer card: $26 MILLION for part of the farm|y|the card|
W.09|They said no|E|WON (amber tick)|y|the tick|
W.10|The screen that keeps|E|station THE SCREEN|y|the screen|
W.11|A Senate committee voted|E|committee tally 22-0|y|the tally|
W.12|It isn't law yet|E|OPEN (empty ring breathes)|y|the ring|
W.13|And the dark kitchen|E|station THE KITCHEN|y|the kitchen|
W.14|America's biggest grid had|E|the plan: cut big data centres first in a shortage|y|the plan|
W.15|In October, federal regulators|E|LOST (carmine line through)|y|the line|
W.16|So some of it is won|E|the column: WON · OPEN · LOST|n|the column|
W.17|And the biggest stop is|E|a fork: ALLOWANCE or A SHARE BY RIGHT, a big OPEN ring|y|the fork|
W.18|Every stop on this street|E|the street with its stations marked|y|the street|
W.19|The economist who spotted|E|paper card: he has a stake in AI|y|the card|
W.20|Asked to bet on which|M|card opens to the plate|y|the plate|
R6||C|CLIP R6 Brynjolfsson (Revelio) on the paper plate|y|the plate folds back|
W.21|There is another twenty fifty|S|the other street: warm, a quote of #74|y|the street|
W.22|Same street|M|beat: the same houses, warm|n|the machines|
W.23|Same machines|M|beat: the same cars, carrying people|n|the clock|
W.24|Same clock|M|beat: the clock ringing|n|the square|
W.25|In that one, noon is|M|noon is dividend day, the square full in the evening|y|the square|
W.26|This channel exists so that|M|SUBSCRIBE 2 over the full square|y|the square|
W.27|Want to help get there|M|the square holds|n|the night|
W.28|Tonight, your alarm clock|S|the bench at night: you wind the clock|y|the key|
W.29|Set it for tomorrow|S|you set the hand|n|the clock|
W.30|Somebody still has to|S|the pair small on the bench, the lamp breathes|n|end picture|A
END||S|END SCREEN PL.endWind: the pair in the centre, left and right calm night|y||
"""
ROWS = []
for line in R.strip().splitlines():
    f = line.split('|'); f += [''] * (7 - len(f))
    ROWS.append((f[0], f[1] or None, f[2], f[3], f[4], f[5], f[6]))
ROWS_ALL = ROWS
CHUNKS = [('c01', 'H.01', 'Hook: your street, the timeline, bedroom, kitchen + clock, flashback cards, hallway counter, your street, fence + tower'),
          ('c02', 'B.01', 'the neighbour and the boat, your work, balance 0, the road and the robotaxis with crates'),
          ('c03', 'D.01', 'the data centre (9 days, staff 0), the economist + C2, the missing rung, the whole ladder gone'),
          ('c04', 'K.01', 'the kitchen goes dark on schedule, power like air, PJM 46 %'),
          ('c05', 'N.01', 'noon: the allowance, the need mechanism, C1, a warning not a forecast'),
          ('c06', 'G.01', 'subscribe 1, the search for one angry face: the grandson and his screen, the locked school, the survey'),
          ('c07', 'L.01', 'the grown-ups and the weekly breakthroughs, the farmers, the land behind the fence'),
          ('c08', 'Q.01', 'the empty square, the AI friend, C3, your time'),
          ('c09', 'E.01', 'the bench: why did nobody stop it, the core sentence'),
          ('c10', 'W.01', 'the way out: leverage, WON / OPEN / LOST, R6, the other 2050, subscribe 2, the clock, end screen')]
W = {'E': 1.0, 'M': .5, 'S': 0.0, 'C': 0.0}
NAME = {'S': 'SZENE-2.5D', 'M': 'MIX', 'E': 'EXPL', 'C': 'CLIP'}

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())
def times(tf):
    TM = json.load(open(tf)); ws = TM['words']; clips = {c['id']: c for c in TM.get('clips', [])}
    out, after = [], -1
    for r in ROWS:
        rid, ph = r[0], r[1]
        if rid in clips: out.append(clips[rid]['start']); after = clips[rid]['end']; continue
        if rid == 'END': out.append(TM['duration'] - 15.0); continue
        q = [norm(x) for x in ph.split()]; hit = None
        for i in range(len(ws) - len(q) + 1):
            if ws[i]['s'] < after - 1e-3: continue
            if all((norm(ws[i + j]['w']) == p) if j < len(q) - 1 else norm(ws[i + j]['w']).startswith(p) for j, p in enumerate(q)): hit = ws[i]['s']; break
        if hit is None: raise SystemExit(f'phrase not found: {rid} "{ph}" after {after:.1f}')
        out.append(hit); after = hit
    return out, TM

def sentence_end(ws, s0):
    j = next(k for k, w in enumerate(ws) if abs(w['s'] - s0) < 1e-6); words = []
    while j < len(ws):
        words.append(ws[j]['w'])
        if re.search(r'[.?!]["”]?$', ws[j]['w']): break
        j += 1
    return ' '.join(words), ws[j]['e'] if j < len(ws) else ws[-1]['e']

def main():
    st, TM = times(TF); dur = TM['duration']; prov = TM.get('provisional', False); ws = TM['words']
    covered_all = ROWS[-1][0] == 'END'
    last_end = dur if covered_all else sentence_end(ws, st[-1])[1] + .4
    a = [0.0] + [max(0, s - .35) for s in st[1:]]
    b = a[1:] + [last_end]
    L = [y - x for x, y in zip(a, b)]; span_s = sum(L)
    sec = {k: 0.0 for k in W}
    for r, l in zip(ROWS, L): sec[r[2]] += l
    share = sum(W[k] * v for k, v in sec.items()) / span_s * 100
    new = sum(1 for r in ROWS if r[4] == 'y'); anchors = [r[0] for r in ROWS if r[6] == 'A']
    ft = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
    cov = '' if covered_all else f' **Rows cover 0:00-{ft(last_end)} of {ft(dur)} only (vo-v2 pending): numbers are for the covered span.**'
    o = ['# Film 79 · "Your Life in 2050: The AI Worst Case" · shot list (binding, one row per sentence)', '',
         f'Generated by `tools/shots79.py` from `{os.path.basename(TF)}`{" (PROVISIONAL timing from " + TM.get("source", "?") + ")" if prov else " (real VO)"}, duration {dur:.1f} s. Edit the table in the script, never this file. **Code anchors on phrases, never on seconds.**' + cov, '',
         '## 1 · Numbers (REGELN §13.2, computed before animating)', '',
         f'- **Explainer share (weighted): {share:.1f} %** over {ft(span_s)} (target for the whole film 60-70 %; the hook carries feeling, so it sits lower, the stations carry the mechanism).',
         '- Seconds by type: ' + ' · '.join(f'{NAME[k]} {v:.0f} s ({v / span_s * 100:.0f} %)' for k, v in sorted(sec.items(), key=lambda kv: -kv[1])),
         f'- Rows: {len(ROWS)} · new motifs: {new} · leitbild anchors (the same street): {len(anchors)} ({", ".join(anchors)}) · wow moments (*): {sum(1 for r in ROWS if r[6] == "*")}.',
         '- Hard cuts planned: 0 (every boundary is a carrier: portal through a window/door/frame, iris out of a round shape, a near layer sweeping past the lens, a paper card unfolding from an object, or a graphic that builds out of the scene and falls back into it).', '',
         '## 2 · Chunks', '', '']
    idx = {r[0]: i for i, r in enumerate(ROWS)}
    o[-1] = '| chunk | from | start | length | explainer share | contents |'; o.append('|---|---|---|---|---|---|')
    for k, (c, first, txt) in enumerate(CHUNKS):
        i0 = idx[first]; i1 = idx[CHUNKS[k + 1][1]] if k + 1 < len(CHUNKS) else len(ROWS)
        ln = sum(L[i0:i1]); sh = sum(W[ROWS[i][2]] * L[i] for i in range(i0, i1)) / ln * 100
        o.append(f'| {c} | {first} | {ft(st[i0])} | {ft(ln)} | {sh:.0f} % | {txt} |'); print(f'{c} {ft(st[i0])} len {ft(ln)} share {sh:.0f} %')
    o += ['', '## 3 · Shots', '', '| ID | t | len | Satz | Typ | zeigt wörtlich | Motiv neu? | Träger → nächstes | |', '|---|---|---|---|---|---|---|---|---|']
    for i, r in enumerate(ROWS):
        sent = ('[' + r[0] + ']' if r[0] != 'END' else '[end screen]') if r[1] is None else sentence_end(ws, st[i])[0]
        o.append(f'| {r[0]} | {ft(st[i])} | {L[i]:.1f} | {sent} | {NAME[r[2]]} | {r[3]} | {"yes" if r[4] == "y" else "no (beat)"} | {r[5]} | {r[6]} |')
    o += ['', '## 4 · Nicht wiederholen', '',
          '- **#74 (the mirror):** same street, same stations, same clock, same day clock and the same carriers, but never the same picture: no apple trees, no chalk, no robot on a ladder, no gold sun, no lanterns, no dancing children. #74 light = warm gold, #79 light = cold, the machine = carmine.',
          '- **#23 "A Day in 2037":** the street in section at night, the kitchen light wall, the tutor voice-light, night interiors with cut-away floors.',
          '- **#63 Pope:** the machine block, the slot, the scale. **#59:** crystal, bell, stamps as seal. **#54:** the great hall. **#67:** headline sky, chalkboard, paper tower. **#66/#27/#64:** price tags, receipts, pay slips, the dollar bar (the allowance is a phone notification + a one-way line, no amounts).',
          '- **Channel bans:** robot faces as "the AI" (the thumbnail robot is the only giant robot and only as an ink sign that is struck out in the hook), brains, matrix code, server racks, explosions, villains.']
    open(os.path.join(CODE, 'docs', 'shots.md'), 'w').write('\n'.join(o) + '\n')
    print(f'{len(ROWS)} rows · explainer share {share:.1f} % over {span_s:.0f} s · S {sec["S"]:.0f}s M {sec["M"]:.0f}s E {sec["E"]:.0f}s C {sec["C"]:.0f}s · new {new} · anchors {anchors}')
    tm = {r[0]: st[i] for i, r in enumerate(ROWS)}
    json.dump([{'id': r[0], 'phrase': r[1], 'type': r[2], 't': tm.get(r[0])} for r in ROWS], open(os.path.join(CODE, 'data', 'rows.json'), 'w'))
if __name__ == '__main__': main()
