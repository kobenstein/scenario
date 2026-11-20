#!/usr/bin/env python3
"""Film 25: subtitle cues for Jakob's O-Ton (J1..J6, J3b) and the interview clips (K1..K3) -> audio/clips.json (format as films/24-animals/audio/clips.json).
  cues = [[seconds from the first footage frame, subtitle line]], lines <= 34 characters (channel standard).
J clips: the wording below is checked against <o-ton>/Jn.wav by forced alignment (pocketsphinx) -> real phrase times.
         TEXT_STATUS says whether the wording was verified with fal-ai/whisper; 'provisional' = taken from o-ton/auswahl-v1.md and a
         pocketsphinx free decode (the auswahl note abbreviates J2/J3b with "..."), to be replaced by the Whisper wording (re-run this script).
K clips: wording as given by the coordinator (10.11.), times spread over the planned length by characters until the footage is cut (timing 'estimated');
         K3 has no wording yet -> no cues.
usage: f25_oton_cues.py <audio_dir> [--text J.json]   (--text: {"J2": "wording", ...} overrides, e.g. from Whisper)"""
import json, os, re, subprocess, sys
A = sys.argv[1].rstrip('/')
OTON = os.environ.get('F25OTON', '/mnt/project-files/scenario/film-last-human-job/o-ton/clips-v1').rstrip('/')
MAX = 34
J_TEXT = {
 'J1': "At the beginning, I used to do everything by hand. Topic, idea, script, storyboard, shooting, editing, sound, animation, music.",
 'J2': "When AI arrived four years ago, AI took over the first small piece. For example, I created some images with it, which I used as layers for my animations.",
 'J3': "Every month my part shifted. Less doing, more directing. The work and the output got better.",
 'J3b': "During the past weeks, suddenly AI was also able to edit.",
 'J4': "Every time a new model mastered one part of production, I had to redefine my job.",
 'J5': "Now you see with this channel, I'm able to create a documentary a day.",
 'J6': "What's left for me right now is to decide what's worth making and why.",
}
TEXT_STATUS = {k: 'provisional' for k in J_TEXT}   # set to 'whisper' once checked
K_TEXT = {
 'K1': "If you looked at the most exposed occupations and you looked at the youngest age group there, say 22 to 26, then you saw a very noticeable decline in employment.",
 'K2': "I'd say it's going to be a long time before it's as good at physical manipulation as us. And so, a good bet would be to be a plumber.",
}
K_META = {
 'K1': dict(name='Erik Brynjolfsson', role='Director, Stanford Digital Economy Lab', source='https://www.youtube.com/watch?v=OvFI-V9Zaeo', plan=13.2),
 'K2': dict(name='Geoffrey Hinton', role='AI pioneer, Nobel laureate in physics 2024', source='https://www.youtube.com/watch?v=giT0ytynSqg', plan=9.7),
 'K3': dict(name='Bill Gates', role='Co-founder of Microsoft, Gates Foundation', source='https://www.youtube.com/watch?v=MLeTQWQiOvg', plan=12.0, cues=None),
}
if '--text' in sys.argv:
    over = json.load(open(sys.argv[sys.argv.index('--text') + 1])); J_TEXT.update(over); TEXT_STATUS.update({k: 'whisper' for k in over})
def lines_of(words):
    """words = [(w, t0, t1)] -> [[t0, line]], lines <= MAX characters: fill greedily, break early after . ? ! (>= 14 chars) or , ; (>= 22 chars)"""
    out, cur = [], []
    def n(ws): return len(' '.join(w for w, _, _ in ws))
    for w in words:
        if cur and n(cur + [w]) > MAX: out.append(cur); cur = []
        cur.append(w)
        L = n(cur)
        if (w[0].endswith(('.', '?', '!')) and L >= 14) or (w[0].endswith((',', ';')) and L >= 22): out.append(cur); cur = []
    if cur: out.append(cur)
    k = 1
    while k < len(out):   # a stub of one or two short words goes back to the line before when it fits
        if n(out[k]) < 11 and n(out[k - 1] + out[k]) <= MAX: out[k - 1] += out.pop(k)
        else: k += 1
    if len(out) > 1 and len(out[-1]) == 1 and len(out[-2]) > 3:   # a lone last word takes the last word(s) of the line before (no 'a / day.')
        m = 2 if out[-2][-1][0].lower() in ('a', 'an', 'the', 'to', 'of') or len(out[-2][-2][0]) < 3 else 1
        out[-1] = out[-2][-m:] + out[-1]; out[-2] = out[-2][:-m]
    return [[round(c[0][1], 2), ' '.join(w for w, _, _ in c)] for c in out]
def align(wav, text):
    from pocketsphinx import Decoder, get_model_path
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'])
    dic = {l.split()[0] for l in open(get_model_path() + '/en-us/cmudict-en-us.dict')}
    words = text.split(); seq, owner = [], []
    stand = {'ai': 'a i'}
    for k, w in enumerate(words):
        for t in re.sub(r"[^a-z' -]", '', w.lower()).replace('-', ' ').split():
            for u in stand.get(t, t).split():
                seq.append(u if u in dic else 'the'); owner.append(k)
    d = Decoder(loglevel='FATAL'); d.set_align_text(' '.join(seq)); d.start_utt(); d.process_raw(raw, full_utt=True); d.end_utt()
    seg = [(x.start_frame / 100, (x.end_frame + 1) / 100) for x in d.seg() if x.word not in ('<sil>', '</s>', '<s>') and not x.word.startswith('++')]
    assert len(seg) == len(seq), (len(seg), len(seq))
    out = [[w, None, None] for w in words]
    for (a, b), o in zip(seg, owner):
        if out[o][1] is None: out[o][1] = a
        out[o][2] = b
    return [tuple(x) for x in out]
def spread(text, dur):
    ws = text.split(); tot = sum(len(w) + 1 for w in ws); t = 0.0; out = []
    for w in ws:
        n = (len(w) + 1) / tot * dur; out.append((w, t, t + n)); t += n
    return out
clips = {'_comment': "Film 25 slot metadata (format as films/24-animals/audio/clips.json). 'dur' (seconds of real footage) is set when a K clip is cut; until then build_vo.py uses the planned slot length "
                     "(data root clips.json 'dauer' for K1/K2). 'offset': footage starts this long after the slot opens. 'cues': [[seconds from first footage frame, subtitle line]]. "
                     "cue_status: 'whisper' = checked wording, 'provisional' = wording from o-ton/auswahl-v1.md + pocketsphinx, verify; 'estimated' = times spread over the planned length, re-time on the real footage."}
for cid, text in J_TEXT.items():
    wav = f'{OTON}/{cid}.wav'
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]))
    try: ws, how = align(wav, text), 'aligned'
    except Exception as e: print(cid, 'alignment failed, spreading:', e); ws, how = spread(text, d), 'spread'
    clips[cid] = {'plan': round(d, 3), 'dur': None, 'offset': 0.0, 'file': f'{cid}.wav', 'name': 'Jakob', 'role': 'Creator of this channel (own voice)',
                  'source': f'o-ton/clips-v1/{cid}.wav', 'text': text, 'cue_status': TEXT_STATUS[cid], 'cue_timing': how, 'cues': lines_of(ws)}
for cid, m in K_META.items():
    c = {'plan': m['plan'], 'dur': None, 'offset': 0.0, 'name': m['name'], 'role': m['role'], 'source': m['source']}
    if cid in K_TEXT:
        c.update(text=K_TEXT[cid], cue_status='estimated', cue_timing='spread over the planned length', cues=lines_of(spread(K_TEXT[cid], m['plan'] - 0.15)))
    else: c.update(cues=None, cue_status='none yet (K3 wording pending)')
    clips[cid] = c
json.dump(clips, open(A + '/clips.json', 'w'), indent=1, ensure_ascii=False)
for cid, c in clips.items():
    if cid.startswith('_'): continue
    print(cid, c.get('cue_status'), c.get('cue_timing', ''), '|', ' / '.join(f"{t}:{l}" for t, l in (c['cues'] or [])))
    assert all(len(l) <= MAX for _, l in (c['cues'] or [])), cid
