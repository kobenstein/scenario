#!/usr/bin/env python3
"""Film 4 sound plan: atmos per chapter (loops) + accents anchored to VO words -> sound_plan.json.
usage: make_sound_plan.py <audio_dir>"""
import json, re, sys
A = sys.argv[1].rstrip('/') + '/'
T = json.load(open(A + 'timing.json')); W = T['words']; SEC = T['sections']
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower())

def at(seg, phrase, n=1, end=False):
    """start (or end) time of the n-th occurrence of phrase inside VO segment seg"""
    ws = [w for w in W if w['sec'] == seg]; p = [norm(x) for x in phrase.split()]
    hits = [i for i in range(len(ws) - len(p) + 1) if all(norm(ws[i + k]['w']) == p[k] for k in range(len(p)))]
    if len(hits) < n: raise SystemExit(f'phrase not found: {seg} {phrase!r}')
    i = hits[n - 1]; return ws[i + len(p) - 1]['e'] if end else ws[i]['s']

P = []
def atmo(f, t0, t1, v=1.0, fade=1.5): P.append({'f': f, 't': round(t0, 2), 'd': round(t1 - t0, 2), 'loop': 1, 'v': v, 'fade': fade})
def hit(f, t, v=1.0, lead=0.08): P.append({'f': f, 't': round(t - lead, 2), 'v': v})
clip = {c['id']: c for c in T['clips']}

# 00 hook: the morning message
atmo('dawn_birds', 0, 37.0, .8, 2.5)
hit('phone_buzz', at('00a', 'one message'), .8, .5)
hit('shimmer_rings', at('00a', 'taken care'), .6)
hit('swell', at('00a', 'rest of your life'), .6, .6)
hit('whoosh_airy', at('00b', 'Travel'), .6, .25)
hit('boom_soft', at('00b', 'wall'), .7, .05)
hit('swell', at('00c', 'on stage'), .5, .8)
# 01 the condition / the biggest if
atmo('hill', 39.8, 76.5, .7)
hit('whoosh', at('01a', 'condition'), .5, .3)
hit('tone', at('01a', 'if', 1), .5)
hit('boom_soft', at('01b', 'having to work'), .7, .1)
hit('shimmer_rings', at('01b', 'what a human life'), .6, .3)
# 02 the first weeks
atmo('harbour', 76.0, 98.5, .9)
atmo('kitchen', 98.0, 104.5, .8, 1)
hit('whoosh_airy', at('02a', 'everything'), .5, .3)
hit('paper_pop', at('02a', 'checkout'), .5)
hit('bloom', at('02a', 'gone'), .6, .2)
for w in ('boss', 'commute', 'wearing'): hit('whoosh', at('02a', w), .55, .35)
hit('steps', at('02a', 'move to'), .4, .2)
hit('pour', at('02a', 'Just because'), .7, .6)
# HILL 1
atmo('city_night_hill', 104.0, 113.5, .8)
hit('bloom', at('02a', 'home'), .7, .1)
hit('swell', at('02a', "You don't have to"), .5, .6)
# 03 the slump
atmo('rain', 113.3, 183.0, .45, 2.5)
hit('tone', at('03a', 'One more episode'), .4)
hit('screen_off', at('03a', 'past midnight'), .5)
hit('clink', at('03a', 'glass of wine'), .8, .3)
hit('clink', at('03a', 'a second'), .6, .1)
hit('tick', at('03b', 'nine at night'), .45, .2)
hit('boom_soft', at('03b', 'exhausted'), .6, .1)
hit('curtain', at('03b', 'hangover'), .9, .25)
hit('shimmer_rings', at('03b', 'Big lottery'), .6, .2)
# 03b Sweden, the word, the question
atmo('snow', 182.9, 200.0, .8, 2)
hit('pencil', at('03b', 'kept working'), .4, .2)
hit('stamp', at('03b', 'the word'), .9, .1)
hit('pencil', at('03b', 'retired'), .5, .05)
hit('wings', at('03b', 'gone'), .7, -.3)
atmo('city_street', 217.0, 228.5, .5)
hit('swell', at('03c', 'not my job'), .5, .8)
# 04 people
atmo('kitchen', 233.0, 262.0, .7, 2)
hit('bloom', at('04a', 'invitation'), .6, .2)
hit('pour', at('04a', 'you love'), .8, .4)
atmo('city_street', 262.0, 292.5, .6, 2)
hit('clink', at('04a', 'nine'), .6, .1)
hit('wings', at('04a', 'name'), .5, -.2)
hit('drop', at('04a', 'afternoon'), .5, -.6)
hit('swell', at('04a', 'tribe'), .6, .5)
# 05 creating (clip A slot keeps the bed low)
atmo('city_street', 292.5, 354.5, .5, 2)
hit('shimmer_rings', at('05a', 'precious'), .6, .3)
hit('pencil', at('05a', 'violin'), .4, .2)
hit('paper_pop', at('05a', 'quietly disappear'), .5, .2)
hit('bloom', at('05a', 'own businesses'), .5, .2)
hit('boom_soft', at('05b', 'wanting to'), .7, .1)
# 06 river and giving
atmo('kitchen', 376.5, 386.0, .6, 1)
hit('pencil', at('06a', 'catch'), .5, .1)
atmo('river', 386.0, 424.0, .9, 2)
hit('splash', at('06a', 'swam'), .8, .1)
hit('splash', at('06a', 'start on'), .7, .1)
hit('splash', at('06a', 'best reason'), .9, .1)
hit('swell', at('06b', 'multiply'), .7, .6)
atmo('lake', 424.0, 436.0, .8, 1.5)
hit('wings', at('06b', 'answer'), .5, -.1)
# 07 the question
atmo('nightsky', 435.0, 537.0, .8, 3)
hit('boom_soft', at('07a', 'up here'), .5, .2)
hit('shimmer_rings', at('07a', 'first time'), .6, .3)
hit('swell', at('07a', 'To you'), .6, .6)
hit('tick', at('07b', 'four thousand weeks'), .4, .2)
hit('chime', at('07c', 'wonderful life'), .5, .2)
hit('swell', at('07d', 'What is this life for'), .6, .5)
hit('bloom', at('07d', 'the noise might stop', end=True), .6, -.4)
# 08 the open if, the message
atmo('dawn_birds', 536.5, T['duration'], .7, 3)
hit('tone', at('08a', 'if'), .4)
hit('phone_buzz', at('08b', 'that message'), .7, .5)
hit('swell', at('08c', 'You want to'), .7, .6)

P.sort(key=lambda c: c['t'])
json.dump(P, open(A + 'sound_plan.json', 'w'), indent=1)
print(len(P), 'cues')
