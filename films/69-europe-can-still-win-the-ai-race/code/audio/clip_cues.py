#!/usr/bin/env python3
"""Film 69 · subtitle cues for the five clips: pocketsphinx forced alignment of the checked wording (<ROOT>clips-geprueft.json, Whisper-checked twice at the iMac)
on the clip sound (<clipwav>/<id>.wav = the whole <ROOT>clips/Cn.mp4) -> clips_meta.json (speaker, source, transcript, cues [[seconds from the clip start, line <= 34]]).
clips_json.py then turns clips_meta.json + timing.json into clips.json (mix.py + subs.py).
CUES = the subtitle lines (exact wording, numbers as digits); SPOKEN = how a line is said where it differs (alignment only: '500' -> 'five hundred', OHB, KION).
C4: a second panelist says a quiet 'Nobody.' at ~4.6 s into the clip; it is NOT in the wording and gets no subtitle (coordinator 24.11.); the alignment skips it as noise.
usage: clip_cues.py [clipwav_dir]"""
import json, os, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F69ROOT', '/mnt/project-files/scenario/film-europa-ki/').rstrip('/') + '/'
CW = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/f69/audio/clipwav').rstrip('/')
SRC = {c['id']: c for c in json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8'))['clips']}
CUES = {'C1': ['One year on,', 'Europe is therefore', 'in a harder place.', 'Our growth model is fading.'],
        'C2': ["And if you can't afford", 'the business continuity,', "well, you're going to depend on,", "basically you're becoming", 'a client state to the one',
               'that is providing you', 'with the technology.'],
        'C3': ['All this,', "what I've just described,", 'needs massive investment.', 'At least 500 billion euros,', 'according to our own estimates.'],
        'C4': ["And that's the trick,", 'because none of us', 'can do it alone.', "Siemens can't.", 'Yes, we do produce.', 'We produce trains,', 'substations and so on.',
               "But we don't have enough data.", "OHB doesn't have enough data,", "and also KION doesn't have", 'enough data.'],
        'C1b': ['Of all those now caught between', 'the United States and China,', 'Europeans alone have the option', 'to become a genuine power', 'themselves.']}
SPOKEN = {'500': 'five hundred', 'OHB': 'o_h_b', 'KION': 'kion'}
# gain_db: the clips are RMS-matched to the voice in mix.py but measure 0.7-2.2 LU louder than the VO around them (ebur128, first mix 24.11.): pull them level
GAIN = {'C1': -1.4, 'C2': -0.9, 'C3': -0.7, 'C4': -0.9, 'C1b': -2.0}
EXTRA = {'o_h_b': 'OW EY CH B IY', 'substations': 'S AH B S T EY SH AH N Z', 'kion': 'K IY AA N', 'draghi': 'D R AA G IY'}
norm = lambda w: re.sub(r"[^a-z_']", '', w.lower().replace('’', "'"))
cfg = Config(hmm=get_model_path('en-us/en-us'), dict=get_model_path('en-us/cmudict-en-us.dict'), lm=None, loglevel='FATAL')
dec = Decoder(cfg)
for w, p in EXTRA.items():
    try: dec.add_word(w, p, False)
    except RuntimeError: pass
meta = {}
for cid, lines in CUES.items():
    c = SRC[cid]
    words = ' '.join(lines).split()
    assert [re.sub(r'[^\w]', '', w).lower() for w in words] == [re.sub(r'[^\w]', '', w).lower() for w in c['transcript'].split()], (cid, 'cue lines != checked wording')
    assert all(len(l) <= 34 for l in lines), cid
    sub, first = [], []   # sub-tokens for the aligner; index of the first sub-token of every cue line
    for l in lines:
        first.append(len(sub))
        for w in l.split():
            for p in SPOKEN.get(w.strip('.,'), w).split(): sub.append(norm(p))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f'{CW}/{cid}.wav', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    dec.set_align_text(' '.join(sub)); dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    seg = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in dec.seg() if x.word not in ('<s>', '</s>', '<sil>') and not x.word.startswith(('[', '<', '+'))]
    assert len(seg) == len(sub), (cid, len(seg), len(sub))
    # a cue starts at its first word, but never inside a pause (10-ms RMS frames below -46 dBFS for >= 40 ms): then at the end of that pause
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    quiet = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2) + 1e-12) for i in range(0, len(x) - 160, 160)])) < -46
    def unpause(t):
        i = int(t * 100)
        while i < len(quiet) and quiet[i]: i += 1
        return i / 100
    cues = [[round(max(0.0, unpause(seg[k][1]) - 0.05), 2), l] for k, l in zip(first, lines)]
    meta[cid] = {'speaker': c['speaker'], 'role': c['lower_third'].split(' · ')[1], 'source': f"{c['channel']} ({c['date']})", 'url': c['url'], 'credit': c.get('channel'),
                 'lower_third': c['lower_third'], 'transcript': c['transcript'], 'cues': cues, 'cue_end': round(min(seg[-1][2] + 0.4, c['duration_s'] - 0.05), 2),
                 'word_end': round(seg[-1][2], 2), 'gain_db': GAIN[cid]}
    print(cid, c['duration_s'], 's · first word', round(seg[0][1], 2), '· last word ends', round(seg[-1][2], 2), '·', [(t, l) for t, l in cues])
json.dump(meta, open(os.path.join(HERE, 'clips_meta.json'), 'w'), indent=1, ensure_ascii=False)
